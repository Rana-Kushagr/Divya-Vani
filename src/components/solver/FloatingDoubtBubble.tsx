'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  MessageSquare, 
  Send, 
  ChevronRight, 
  FileText,
  Mic,
  Camera,
  Headphones,
  Volume2
} from 'lucide-react';
import CameraCaptureModal from './CameraCaptureModal';
import OneOnOneVoiceAssistantModal from './OneOnOneVoiceAssistantModal';
import MathRenderer from './MathRenderer';

interface FloatingDoubtBubbleProps {
  onQuickDoubtSubmit: (query: string, imageBase64?: string) => void;
  activeTabTitle?: string;
  currentSubject?: string;
  currentChapter?: string;
  listenerActive?: boolean;
  onToggleListener?: () => void;
}

export default function FloatingDoubtBubble({
  onQuickDoubtSubmit,
  activeTabTitle,
  currentSubject = 'Science',
  currentChapter = 'Chapter 8: Motion',
  listenerActive = false,
  onToggleListener,
}: FloatingDoubtBubbleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [quickAnswer, setQuickAnswer] = useState<string | null>(null);
  const [isQuickSolving, setIsQuickSolving] = useState(false);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;

    const query = inputVal.trim();
    setInputVal('');
    setIsQuickSolving(true);

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          subjectId: currentSubject,
          chapterTitle: currentChapter,
        }),
      });
      const data = await res.json();
      setQuickAnswer(data.reply || data.message || 'Understanding this step-by-step is easy with Divya Vani!');
      onQuickDoubtSubmit(query);
    } catch {
      onQuickDoubtSubmit(query);
      setIsOpen(false);
    } finally {
      setIsQuickSolving(false);
    }
  };

  const handlePhotoCaptured = (base64: string) => {
    onQuickDoubtSubmit('Please analyze this question photo from my textbook step-by-step.', base64);
    setIsOpen(false);
  };

  return (
    <>
      {/* 1v1 Voice Modal */}
      <OneOnOneVoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        currentSubject={currentSubject}
        currentChapter={currentChapter}
      />

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handlePhotoCaptured}
      />

      <div className="fixed bottom-6 right-6 z-40">
        {/* Floating Modal Drawer */}
        {isOpen ? (
          <div className="bg-obsidian-surface border-2 border-structural-dark rounded-2xl w-80 sm:w-96 p-4 shadow-2xl text-alabaster animate-in fade-in slide-in-from-bottom-6">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-structural-dark">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-royal to-purple-600 flex items-center justify-center text-white shadow-lg shadow-royal/30">
                  <Sparkles className="w-4 h-4 text-mint" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-alabaster">Divya Vani AI Assistant</h4>
                  <p className="text-[10px] text-zinc-400">Class 9-H Study Companion</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setQuickAnswer(null);
                }}
                className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-alabaster"
                aria-label="Close floating doubt assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions Ribbon: 1v1 Voice • Camera • Listener */}
            <div className="grid grid-cols-3 gap-2 my-3">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsVoiceOpen(true);
                }}
                className="p-2 rounded-xl bg-obsidian border border-royal/40 hover:border-royal text-center flex flex-col items-center gap-1 group transition"
              >
                <div className="p-1.5 rounded-lg bg-royal/20 text-royal-light group-hover:bg-royal group-hover:text-white transition">
                  <Mic className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-alabaster">Talk 1v1</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsCameraOpen(true);
                }}
                className="p-2 rounded-xl bg-obsidian border border-amber/40 hover:border-amber text-center flex flex-col items-center gap-1 group transition"
              >
                <div className="p-1.5 rounded-lg bg-amber/20 text-amber group-hover:bg-amber group-hover:text-obsidian transition">
                  <Camera className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-alabaster">Snap Photo</span>
              </button>

              {onToggleListener && (
                <button
                  type="button"
                  onClick={onToggleListener}
                  className={`p-2 rounded-xl border text-center flex flex-col items-center gap-1 group transition ${
                    listenerActive
                      ? 'bg-mint/10 border-mint/60 text-mint'
                      : 'bg-obsidian border-zinc-700 text-zinc-400 hover:border-zinc-500'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg transition ${
                    listenerActive ? 'bg-mint text-obsidian font-bold' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    <Headphones className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold">
                    {listenerActive ? 'Listening On' : 'Smart Listener'}
                  </span>
                </button>
              )}
            </div>

            {/* Active Document Indicator */}
            {activeTabTitle && (
              <div className="mb-2 p-1.5 rounded-lg bg-obsidian border border-structural-dark flex items-center gap-2 text-[10px] text-zinc-400">
                <FileText className="w-3 h-3 text-royal" />
                <span className="truncate">Context: {activeTabTitle}</span>
              </div>
            )}

            {/* Quick Answer Card if available */}
            {quickAnswer && (
              <div className="mb-3 p-3 rounded-xl bg-obsidian border border-mint/40 text-xs text-alabaster max-h-48 overflow-y-auto space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-mint uppercase">
                  <span>Assistant Answer</span>
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        const u = new SpeechSynthesisUtterance(quickAnswer.replace(/[*#_`]/g, ''));
                        window.speechSynthesis.speak(u);
                      }
                    }}
                    className="hover:text-white flex items-center gap-1"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Listen</span>
                  </button>
                </div>
                <div className="text-[11px] leading-relaxed">
                  <MathRenderer content={quickAnswer} />
                </div>
              </div>
            )}

            {/* Input Field */}
            <form onSubmit={handleSend} className="relative mt-2">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask doubt without leaving lecture..."
                className="w-full bg-obsidian border border-structural-dark rounded-xl pl-3 pr-10 py-2.5 text-xs text-alabaster placeholder-zinc-500 focus:outline-none focus:border-royal"
                disabled={isQuickSolving}
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || isQuickSolving}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-royal hover:bg-royal-hover text-white disabled:opacity-40 transition"
                aria-label="Send Quick Doubt"
              >
                {isQuickSolving ? (
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-mint" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Floating Orb Trigger Button */
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-royal to-purple-600 text-white font-bold text-xs shadow-2xl shadow-royal/50 hover:scale-105 active:scale-95 transition-all group border-2 border-white/20"
            aria-label="Open AI Doubt Assistant"
          >
            <div className="relative">
              <Sparkles className="w-4 h-4 text-mint group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-mint animate-ping" />
            </div>
            <span className="hidden sm:inline">Ask Divya Vani AI</span>
            <span className="sm:hidden">AI Doubt</span>
          </button>
        )}
      </div>
    </>
  );
}
