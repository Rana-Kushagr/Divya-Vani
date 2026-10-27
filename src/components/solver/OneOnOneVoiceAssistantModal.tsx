'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  X, 
  Sparkles, 
  Send, 
  User, 
  Bot, 
  Square
} from 'lucide-react';
import MathRenderer from './MathRenderer';

interface ChatMessage {
  id: string;
  sender: 'student' | 'assistant';
  text: string;
  spokenText?: string;
  timestamp: string;
}

interface OneOnOneVoiceAssistantModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly currentSubject: string;
  readonly currentChapter: string;
  readonly userApiKey?: string;
}

interface ChatMessageBubbleProps {
  readonly msg: ChatMessage;
  readonly onSpeak: (text: string) => void;
}

function getStatusBadge(isAiSpeaking: boolean, isListening: boolean): string {
  if (isAiSpeaking) return 'Speaking...';
  if (isListening) return 'Listening...';
  return 'Ready';
}

function getStatusBanner(isListening: boolean, isAiSpeaking: boolean): string {
  if (isListening) return '🎧 Hearing your voice...';
  if (isAiSpeaking) return '🗣️ Explaining solution...';
  return '🎙️ Tap microphone to talk 1v1';
}

function getWaveBarColor(isAiSpeaking: boolean, isListening: boolean): string {
  if (isAiSpeaking) return 'bg-mint';
  if (isListening) return 'bg-royal-light';
  return 'bg-zinc-700';
}

function ChatMessageBubble({ msg, onSpeak }: ChatMessageBubbleProps) {
  const isStudent = msg.sender === 'student';
  return (
    <div
      className={`flex items-start gap-3 ${
        isStudent ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
          isStudent
            ? 'bg-royal text-white'
            : 'bg-gradient-to-tr from-mint to-emerald-500 text-obsidian shadow'
        }`}
      >
        {isStudent ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      <div
        className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
          isStudent
            ? 'bg-royal text-white rounded-tr-none shadow-md'
            : 'bg-obsidian border border-structural-dark text-alabaster rounded-tl-none shadow-md'
        }`}
      >
        <div className="whitespace-pre-wrap">
          <MathRenderer content={msg.text} />
        </div>

        <div className="mt-2 pt-1 border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-400">
          <span>{msg.timestamp}</span>
          {!isStudent && (
            <button
              type="button"
              onClick={() => onSpeak(msg.spokenText || msg.text)}
              className="hover:text-mint flex items-center gap-1 text-[10px] font-semibold transition"
              title="Read aloud"
            >
              <Volume2 className="w-3 h-3" />
              <span>Listen</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OneOnOneVoiceAssistantModal({
  isOpen,
  onClose,
  currentSubject,
  currentChapter,
  userApiKey,
}: OneOnOneVoiceAssistantModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: `Hello! I am Divya Vani, your personal 1v1 AI study companion. Ask me any doubt from ${currentChapter || 'your syllabus'} or speak aloud anytime!`,
      spokenText: `Hello! I am Divya Vani, your personal AI study companion. Ask me any doubt or speak aloud anytime!`,
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [waveHeights, setWaveHeights] = useState<number[]>([14, 28, 18, 36, 22, 32, 16, 26]);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Audio wave animation
  useEffect(() => {
    let interval: any;
    if (isListening || isAiSpeaking) {
      interval = setInterval(() => {
        setWaveHeights((prev) =>
          prev.map(() => Math.floor(Math.random() * 32) + 12)
        );
      }, 100);
    } else {
      setWaveHeights([12, 16, 12, 20, 14, 18, 12, 16]);
    }
    return () => clearInterval(interval);
  }, [isListening, isAiSpeaking]);

  // Web Speech Synthesis (Text to Speech)
  const speakText = (text: string) => {
    if (!speechEnabled || typeof window === 'undefined') return;

    window.speechSynthesis.cancel(); // Stop ongoing speech

    const clean = text
      .replace(/\$\$([^$]+)\$\$/g, ' formula: $1 ')
      .replace(/\$([^$]+)\$/g, ' $1 ')
      .replace(/[*#_`]/g, '')
      .slice(0, 350);

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    // Pick best English / Indian voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.lang.includes('en-IN') || v.name.includes('India') || v.lang.includes('en-US')
    );
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => setIsAiSpeaking(true);
    utterance.onend = () => setIsAiSpeaking(false);
    utterance.onerror = () => setIsAiSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
      setIsAiSpeaking(false);
    }
  };

  // Web Speech Recognition (Speech to Text)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-IN'; // Hinglish & English friendly

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((res: any) => res[0].transcript)
            .join('');
          setInputText(transcript);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. You can type your doubt instead.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      stopSpeaking();
      setInputText('');
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Recognition start error:', err);
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const studentMsg: ChatMessage = {
      id: `std-${Date.now()}`,
      sender: 'student',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, studentMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          subjectId: currentSubject,
          chapterTitle: currentChapter,
          apiKey: userApiKey,
        }),
      });

      const data = await res.json();
      const replyText = data.reply || data.message || 'I understand your question! Let us explore the core concept together.';
      const spoken = data.spokenText || replyText;

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        spokenText: spoken,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      speakText(spoken);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: 'Let us break this down step-by-step: In this chapter, always identify the given variables first, apply the fundamental formula, and solve with correct SI units.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      speakText(fallbackMsg.text);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-obsidian border-2 border-structural-dark rounded-3xl w-full max-w-2xl h-[90vh] max-h-[750px] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header Strip with Audio Controls */}
        <div className="bg-obsidian-surface px-5 py-3.5 border-b border-structural-dark flex items-center justify-between text-alabaster">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-royal to-purple-600 flex items-center justify-center text-white shadow-lg shadow-royal/30">
                <Sparkles className="w-5 h-5 text-mint" />
              </div>
              {(isListening || isAiSpeaking) && (
                <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-mint" />
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-alabaster">Divya Vani 1v1 AI Study Buddy</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-mint/20 text-mint border border-mint/40">
                  {getStatusBadge(isAiSpeaking, isListening)}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                {currentChapter ? `${currentSubject} • ${currentChapter}` : 'CBSE AI Tutor'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Speech Toggle */}
            <button
              type="button"
              onClick={() => {
                if (isAiSpeaking) stopSpeaking();
                setSpeechEnabled(!speechEnabled);
              }}
              className={`p-2 rounded-xl border transition ${
                speechEnabled
                  ? 'border-royal/50 bg-royal/20 text-royal-light'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-500'
              }`}
              title={speechEnabled ? 'Mute AI voice' : 'Enable AI voice speech'}
            >
              {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Stop current speaking */}
            {isAiSpeaking && (
              <button
                type="button"
                onClick={stopSpeaking}
                className="p-2 rounded-xl border border-rose-500/40 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition text-xs flex items-center gap-1 font-bold"
                title="Stop talking"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>
            )}

            {/* Close Modal */}
            <button
              type="button"
              onClick={() => {
                stopSpeaking();
                if (isListening && recognitionRef.current) recognitionRef.current.stop();
                onClose();
              }}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              aria-label="Close 1v1 Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Central Audio Waveform Visualizer Banner */}
        <div className="bg-gradient-to-r from-obsidian via-zinc-950 to-obsidian border-b border-structural-dark py-3 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-medium text-zinc-400">
              {getStatusBanner(isListening, isAiSpeaking)}
            </span>
          </div>

          {/* Soundwave Bars */}
          <div className="flex items-center gap-1.5 h-8">
            {waveHeights.map((h, i) => (
              <div
                key={`wave-bar-${i}`}
                className={`w-1 rounded-full transition-all duration-100 ${getWaveBarColor(isAiSpeaking, isListening)}`}
                style={{ height: `${h}px` }}
              />
            ))}
          </div>
        </div>

        {/* Chat History Messages Canvas */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-obsidian-surface/60">
          {messages.map((msg) => (
            <ChatMessageBubble
              key={msg.id}
              msg={msg}
              onSpeak={speakText}
            />
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-mint/20 border border-mint/40 flex items-center justify-center text-mint">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-obsidian border border-structural-dark rounded-2xl rounded-tl-none p-3.5 text-xs text-zinc-300 flex items-center gap-2 shadow">
                <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
                <span>Divya Vani is analyzing and preparing step-by-step guidance...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="bg-obsidian px-4 py-2 border-t border-structural-dark overflow-x-auto flex items-center gap-2 text-xs">
          <span className="text-[10px] font-mono text-zinc-500 uppercase shrink-0">Quick Ask:</span>
          {[
            'Explain this in Hinglish',
            'Give a daily life analogy',
            'Show full formula derivation',
            'What are common exam mistakes?',
          ].map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => {
                void handleSendMessage(prompt);
              }}
              className="shrink-0 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-royal text-[11px] font-medium transition"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Bottom Input & Voice Trigger Bar */}
        <div className="bg-obsidian-surface p-4 border-t border-structural-dark flex items-center gap-3">
          {/* Big Voice Button */}
          <button
            type="button"
            onClick={toggleListening}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg shrink-0 ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-500/30'
                : 'bg-royal hover:bg-royal-hover text-white shadow-royal/30'
            }`}
            title={isListening ? 'Stop listening' : 'Start talking 1v1'}
          >
            {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          {/* Text Input Field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSendMessage();
            }}
            className="flex-1 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? 'Listening to your voice... speak now!' : 'Type your question or speak above...'}
              className="flex-1 bg-obsidian border border-structural-dark rounded-xl px-4 py-3 text-xs text-alabaster placeholder-zinc-500 focus:outline-none focus:border-royal transition"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-3 rounded-xl bg-mint text-obsidian font-bold hover:bg-emerald-400 disabled:opacity-40 transition shrink-0"
              aria-label="Send Doubt Query"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
