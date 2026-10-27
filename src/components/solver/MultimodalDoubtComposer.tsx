'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Mic, 
  Image as ImageIcon, 
  FileText, 
  Sparkles, 
  X, 
  Lightbulb,
  Camera,
  KeyRound
} from 'lucide-react';
import { DoubtQuerySchema } from '@/lib/validation';
import { SubjectId } from '@/lib/types';
import CameraCaptureModal from './CameraCaptureModal';
import OneOnOneVoiceAssistantModal from './OneOnOneVoiceAssistantModal';

interface MultimodalDoubtComposerProps {
  readonly currentSubject: SubjectId;
  readonly currentChapterId: string;
  readonly chapterTitle: string;
  readonly activeTabTitle?: string;
  readonly initialQuery?: string;
  readonly onSolveDoubt: (query: string, attachTabContext: boolean, imageBase64?: string) => void;
  readonly isLoading: boolean;
}

function getInputMode(isRecording: boolean, hasImage: boolean): 'voice' | 'image' | 'text' {
  if (isRecording) return 'voice';
  if (hasImage) return 'image';
  return 'text';
}

function getComposerPlaceholder(isRecording: boolean, hasImage: boolean): string {
  if (isRecording) return 'Listening to your question in English / Hinglish...';
  if (hasImage) return 'Add any additional questions about the photo, or tap Solve Question...';
  return 'Ask any doubt from this chapter, speak aloud, or snap a photo of a textbook question...';
}

export default function MultimodalDoubtComposer({
  currentSubject,
  currentChapterId,
  chapterTitle,
  activeTabTitle,
  initialQuery = '',
  onSolveDoubt,
  isLoading,
}: MultimodalDoubtComposerProps) {
  const [query, setQuery] = useState(initialQuery);
  const [attachTabContext, setAttachTabContext] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [waveformBars, setWaveformBars] = useState<number[]>([12, 24, 8, 30, 16, 28, 10, 22]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Image / Camera state
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  const [selectedImageName, setSelectedImageName] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // 1v1 Voice modal state
  const [isVoice1v1Open, setIsVoice1v1Open] = useState(false);

  // Optional custom API key modal state
  const [isApiKeyOpen, setIsApiKeyOpen] = useState(false);
  const [userApiKey, setUserApiKey] = useState<string>('');

  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  // Load saved API key from localStorage if any
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('divyavani_gemini_key') || '';
      setUserApiKey(savedKey);
    }
  }, []);

  const saveApiKey = (key: string) => {
    setUserApiKey(key);
    if (typeof window !== 'undefined') {
      localStorage.setItem('divyavani_gemini_key', key);
    }
    setIsApiKeyOpen(false);
  };

  // Voice Web Speech API Setup for quick dictation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-IN'; // English (India) / Hinglish friendly

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          setQuery(transcript);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Waveform animation effect while recording
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      let tick = 0;
      interval = setInterval(() => {
        tick = (tick + 1) % 12;
        setWaveformBars([
          12 + (tick % 4) * 6,
          18 + ((tick + 2) % 5) * 5,
          10 + ((tick + 4) % 4) * 4,
          24 + ((tick + 1) % 5) * 4,
          16 + ((tick + 3) % 4) * 5,
          22 + ((tick + 5) % 5) * 4,
          12 + ((tick + 2) % 4) * 3,
          18 + ((tick + 4) % 5) * 4,
        ]);
      }, 120);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      setErrorMsg('Speech recognition not supported in this browser. Please type your doubt or open 1v1 Voice Tutor.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setErrorMsg(null);
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImageName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setSelectedImageBase64(base64);
      if (!query.trim()) {
        setQuery(`[Question from ${file.name}]: Please solve this step-by-step.`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = (base64Image: string, fileName: string) => {
    setSelectedImageBase64(base64Image);
    setSelectedImageName(fileName);
    if (!query.trim()) {
      setQuery('Please analyze this photo from my textbook and explain the solution step-by-step.');
    }
  };

  const clearImage = () => {
    setSelectedImageBase64(null);
    setSelectedImageName(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    const promptText = query.trim() || (selectedImageBase64 ? 'Please solve the question shown in this textbook photo step-by-step.' : '');

    const validation = DoubtQuerySchema.safeParse({
      studentQuery: promptText,
      subjectId: currentSubject,
      chapterId: currentChapterId,
      inputMode: getInputMode(isRecording, Boolean(selectedImageBase64)),
      attachedTabContext: attachTabContext ? activeTabTitle : undefined,
      imageBase64: selectedImageBase64 || undefined,
      apiKey: userApiKey || undefined,
    });

    if (!validation.success) {
      setErrorMsg(validation.error.errors[0]?.message || 'Please provide a question or snap a photo.');
      return;
    }

    onSolveDoubt(promptText, attachTabContext, selectedImageBase64 || undefined);
  };

  const handleQuickPrompt = (promptText: string) => {
    setQuery(promptText);
    setErrorMsg(null);
  };

  return (
    <div className="bg-obsidian-surface border-1.5 border-structural-dark rounded-xl p-4 shadow-block-dark text-alabaster">
      
      {/* Hidden file input for Image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

      {/* 1v1 Voice Assistant Modal */}
      <OneOnOneVoiceAssistantModal
        isOpen={isVoice1v1Open}
        onClose={() => setIsVoice1v1Open(false)}
        currentSubject={String(currentSubject)}
        currentChapter={chapterTitle}
        userApiKey={userApiKey}
      />

      {/* Header & Quick Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-royal" />
          <h3 className="font-bold text-sm text-alabaster">Divya Vani AI Assistant</h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-mint/20 text-mint border border-mint/40">
            24/7 Doubt Solver
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* 1v1 Voice Tutor Button */}
          <button
            type="button"
            onClick={() => setIsVoice1v1Open(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-royal text-white hover:bg-royal-hover shadow-sm transition animate-bounce duration-1000"
            title="Open 1v1 Talking Voice Assistant"
          >
            <Mic className="w-3.5 h-3.5 text-mint" />
            <span>Talk 1v1</span>
          </button>

          {/* Context Attachment Chip */}
          {activeTabTitle && (
            <button
              type="button"
              onClick={() => setAttachTabContext(!attachTabContext)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                attachTabContext
                  ? 'bg-royal/20 text-royal-light border-royal/60 shadow-sm'
                  : 'bg-zinc-800 text-zinc-500 border-zinc-700'
              }`}
              title="Attach current document tab context to your query"
            >
              <FileText className="w-3 h-3 text-mint" />
              <span className="truncate max-w-[120px]">{activeTabTitle}</span>
              <span className="text-[9px] uppercase px-1 rounded bg-zinc-900">
                {attachTabContext ? 'On' : 'Off'}
              </span>
            </button>
          )}

          {/* Optional API Key Button */}
          <button
            type="button"
            onClick={() => setIsApiKeyOpen(true)}
            className={`p-1.5 rounded-lg border transition text-xs ${
              userApiKey
                ? 'border-mint/50 bg-mint/10 text-mint'
                : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
            title={userApiKey ? 'Custom Gemini API Key Connected' : 'Configure Google AI Studio Free Key (Optional)'}
          >
            <KeyRound className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Selected Image Preview Pill */}
      {selectedImageBase64 && (
        <div className="mb-3 p-2 rounded-xl bg-obsidian border border-royal/40 flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImageBase64}
              alt="Question preview"
              className="w-12 h-12 object-cover rounded-lg border border-zinc-700 shrink-0"
            />
            <div className="truncate">
              <span className="text-[10px] font-mono font-bold text-mint uppercase block">
                Question Photo Attached
              </span>
              <span className="text-xs text-zinc-300 truncate block">
                {selectedImageName || 'Textbook Question'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={clearImage}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            title="Remove photo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Form and Input Area */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (errorMsg) setErrorMsg(null);
            }}
            placeholder={
              isRecording
                ? 'Listening to your question in English / Hinglish...'
                : selectedImageBase64
                ? 'Add any additional questions about the photo, or tap Solve Question...'
                : 'Ask any doubt from this chapter, speak aloud, or snap a photo of a textbook question...'
            }
            rows={3}
            className={`w-full bg-obsidian border ${
              isRecording ? 'border-royal ring-2 ring-royal/30' : 'border-structural-dark'
            } rounded-xl p-3 text-xs text-alabaster placeholder-zinc-500 focus:outline-none focus:border-royal transition-all resize-none`}
            disabled={isLoading}
          />

          {/* Voice Waveform Overlay during active listening */}
          {isRecording && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-obsidian/90 px-2.5 py-1 rounded-full border border-royal">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping mr-1" />
              {waveformBars.map((h, i) => (
                <div
                  key={`composer-bar-${i}`}
                  className="w-0.5 bg-mint rounded-full transition-all duration-100"
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>
          )}
        </div>

        {errorMsg && (
          <p className="text-[11px] text-rose-400 font-medium">{errorMsg}</p>
        )}

        {/* Action Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-structural-dark">
          <div className="flex items-center gap-2">
            {/* 1. Snap Camera Button */}
            <button
              type="button"
              onClick={() => setIsCameraOpen(true)}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-structural-dark hover:border-royal bg-obsidian text-zinc-300 hover:text-alabaster text-xs font-semibold transition"
              title="Snap photo of textbook question"
            >
              <Camera className="w-3.5 h-3.5 text-royal-light" />
              <span>Camera</span>
            </button>

            {/* 2. Upload Image File Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-structural-dark hover:border-royal bg-obsidian text-zinc-300 hover:text-alabaster text-xs font-semibold transition"
              title="Upload question image"
            >
              <ImageIcon className="w-3.5 h-3.5 text-amber" />
              <span>Upload Photo</span>
            </button>

            {/* 3. Dictation Mic Button */}
            <button
              type="button"
              onClick={toggleRecording}
              disabled={isLoading}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                isRecording
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/60 animate-pulse'
                  : 'bg-obsidian border-structural-dark hover:border-royal text-zinc-300 hover:text-alabaster'
              }`}
              title={isRecording ? 'Stop voice recording' : 'Speak doubt in Hinglish / English'}
            >
              <Mic className={`w-3.5 h-3.5 ${isRecording ? 'text-rose-400' : 'text-mint'}`} />
              <span>{isRecording ? 'Listening...' : 'Voice'}</span>
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || (!query.trim() && !selectedImageBase64)}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-royal hover:bg-royal-hover disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-mint animate-spin" />
                <span>Solving Doubt...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Solve Question</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Suggested Quick Doubts Strip */}
      <div className="mt-3 pt-2.5 border-t border-structural-dark flex flex-wrap items-center gap-1.5 text-[11px] text-zinc-400">
        <span className="font-mono text-[10px] text-zinc-500 uppercase flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber" /> Quick Doubts:
        </span>
        {[
          'Explain core derivation step-by-step',
          'Difference between mass and weight',
          'What are the 3 Laws of Motion?',
        ].map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleQuickPrompt(prompt)}
            className="px-2 py-0.5 rounded-md bg-obsidian hover:bg-zinc-800 text-zinc-300 hover:text-alabaster border border-structural-dark transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* API Key Modal */}
      {isApiKeyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-obsidian border-2 border-structural-dark rounded-2xl w-full max-w-md p-5 text-alabaster shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-structural-dark mb-4">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-mint" />
                <h4 className="font-bold text-sm">Google AI Studio API Key (Optional)</h4>
              </div>
              <button
                onClick={() => setIsApiKeyOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed mb-3">
              Divya Vani already works <strong className="text-mint">100% free with zero configuration</strong> using our built-in multi-tier AI engine. If you would like to connect your personal Google AI Studio key:
            </p>

            <input
              type="password"
              defaultValue={userApiKey}
              id="apiKeyInput"
              placeholder="AIzaSy..."
              className="w-full bg-obsidian-surface border border-structural-dark rounded-xl px-3.5 py-2.5 text-xs text-alabaster placeholder-zinc-500 mb-2 focus:outline-none focus:border-royal font-mono"
            />

            <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-4">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-royal-light hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Get a Free Key from Google AI Studio &rarr;</span>
              </a>
              {userApiKey && (
                <button
                  type="button"
                  onClick={() => saveApiKey('')}
                  className="text-rose-400 hover:underline"
                >
                  Clear Key
                </button>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsApiKeyOpen(false)}
                className="px-4 py-2 rounded-xl border border-zinc-700 text-xs font-semibold text-zinc-300 hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('apiKeyInput') as HTMLInputElement;
                  saveApiKey(el?.value || '');
                }}
                className="px-5 py-2 rounded-xl bg-mint text-obsidian font-bold text-xs hover:bg-emerald-400 shadow"
              >
                Save Preference
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
