'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Image as ImageIcon, 
  FileText, 
  Sparkles, 
  X, 
  HelpCircle,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import { DoubtQuerySchema } from '@/lib/validation';
import { SubjectId } from '@/lib/types';

interface MultimodalDoubtComposerProps {
  currentSubject: SubjectId;
  currentChapterId: string;
  chapterTitle: string;
  activeTabTitle?: string;
  initialQuery?: string;
  onSolveDoubt: (query: string, attachTabContext: boolean) => void;
  isLoading: boolean;
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
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  // Voice Web Speech API Setup
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
      interval = setInterval(() => {
        setWaveformBars([
          Math.floor(Math.random() * 24) + 6,
          Math.floor(Math.random() * 32) + 8,
          Math.floor(Math.random() * 20) + 4,
          Math.floor(Math.random() * 36) + 10,
          Math.floor(Math.random() * 28) + 6,
          Math.floor(Math.random() * 34) + 8,
          Math.floor(Math.random() * 18) + 4,
          Math.floor(Math.random() * 30) + 6,
        ]);
      }, 120);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      setErrorMsg('Speech recognition not supported in this browser. Please type your doubt.');
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

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    const validation = DoubtQuerySchema.safeParse({
      studentQuery: query,
      subjectId: currentSubject,
      chapterId: currentChapterId,
      inputMode: isRecording ? 'voice' : 'text',
      attachedTabContext: attachTabContext ? activeTabTitle : undefined,
    });

    if (!validation.success) {
      setErrorMsg(validation.error.errors[0]?.message || 'Please provide a valid question.');
      return;
    }

    onSolveDoubt(query, attachTabContext);
  };

  const handleQuickPrompt = (promptText: string) => {
    setQuery(promptText);
    setErrorMsg(null);
  };

  return (
    <div className="bg-obsidian-surface border-1.5 border-structural-dark rounded-xl p-4 shadow-block-dark text-alabaster">
      
      {/* Header & Active Tab Context Chip */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-royal" />
          <h3 className="font-bold text-sm text-alabaster">Ask Your Doubt Your Way</h3>
        </div>

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
            <span className="truncate max-w-[150px]">{activeTabTitle}</span>
            <span className="text-[9px] uppercase px-1 rounded bg-zinc-900">
              {attachTabContext ? 'Attached' : 'Detached'}
            </span>
          </button>
        )}
      </div>

      {/* Voice Assistant Waveform HUD (Active when recording) */}
      {isRecording && (
        <div className="mb-3 p-3 rounded-lg bg-obsidian border border-mint/60 flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-mint animate-ping" />
            <span className="font-semibold text-mint">Listening in Hindi / English / Hinglish...</span>
          </div>
          {/* Animated Waveform */}
          <div className="flex items-center gap-1 h-8">
            {waveformBars.map((height, idx) => (
              <span
                key={idx}
                className="w-1 bg-mint rounded-full transition-all duration-100"
                style={{ height: `${height}px` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Input Composer Form */}
      <form onSubmit={handleSubmit} className="relative">
        <label htmlFor="doubt-textarea" className="sr-only">Type or speak your academic doubt</label>
        <textarea
          id="doubt-textarea"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
              handleSubmit();
            }
          }}
          placeholder={`Ask any doubt from ${chapterTitle}... (e.g. Derive 2as = v² - u², or solve numericals)`}
          rows={3}
          className="w-full bg-obsidian text-alabaster placeholder-zinc-500 text-xs sm:text-sm p-3.5 rounded-xl border border-structural-dark focus:border-royal transition-all resize-none font-sans leading-relaxed"
        />

        {/* Composer Action Ribbon */}
        <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-structural-dark/80">
          <div className="flex items-center gap-1.5">
            {/* Push to talk microphone */}
            <button
              type="button"
              onClick={toggleRecording}
              className={`p-2 rounded-lg border transition-all ${
                isRecording
                  ? 'bg-mint text-obsidian border-mint font-bold'
                  : 'bg-obsidian border-structural-dark hover:border-zinc-600 text-zinc-400 hover:text-alabaster'
              }`}
              title="Speak your doubt (Web Speech API)"
            >
              {isRecording ? <Mic className="w-4 h-4 animate-bounce" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Quick Prompt Suggester */}
            <button
              type="button"
              onClick={() => handleQuickPrompt('A train starting from rest attains a velocity of 72 km/h in 5 minutes. Find acceleration and distance.')}
              className="hidden sm:inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-alabaster bg-obsidian border border-structural-dark hover:border-zinc-600 px-2.5 py-1.5 rounded-lg transition-colors"
            >
              <Lightbulb className="w-3 h-3 text-amber" />
              <span>Example Numerical</span>
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-royal hover:bg-royal-hover disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-sm transition-all"
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Solving Socratic Steps...</span>
              </>
            ) : (
              <>
                <span>Solve Doubt</span>
                <Send className="w-3.5 h-3.5 text-mint" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error message */}
      {errorMsg && (
        <p className="text-red-400 text-xs mt-2">{errorMsg}</p>
      )}

      {/* Quick syllabus pills */}
      <div className="mt-3 flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">Quick:</span>
        <button
          type="button"
          onClick={() => handleQuickPrompt('Derive the second equation of motion s = ut + 1/2 at^2 by graphical method')}
          className="text-[11px] bg-obsidian hover:bg-zinc-800 text-zinc-300 border border-structural-dark px-2 py-0.5 rounded transition-colors"
        >
          Graphical Derivation (s = ut + ½at²)
        </button>
        <button
          type="button"
          onClick={() => handleQuickPrompt('Explain difference between distance and displacement with circular path example')}
          className="text-[11px] bg-obsidian hover:bg-zinc-800 text-zinc-300 border border-structural-dark px-2 py-0.5 rounded transition-colors"
        >
          Distance vs Displacement
        </button>
      </div>

    </div>
  );
}
