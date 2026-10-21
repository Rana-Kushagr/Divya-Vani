'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  MessageSquare, 
  Send, 
  ChevronRight, 
  FileText 
} from 'lucide-react';

interface FloatingDoubtBubbleProps {
  onQuickDoubtSubmit: (query: string) => void;
  activeTabTitle?: string;
}

export default function FloatingDoubtBubble({
  onQuickDoubtSubmit,
  activeTabTitle,
}: FloatingDoubtBubbleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;
    onQuickDoubtSubmit(inputVal);
    setInputVal('');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating Modal Drawer */}
      {isOpen ? (
        <div className="bg-obsidian-surface border-1.5 border-structural-dark rounded-2xl w-80 sm:w-96 p-4 shadow-block-dark text-alabaster animate-in fade-in slide-in-from-bottom-6">
          <div className="flex items-center justify-between pb-3 border-b border-structural-dark">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-royal flex items-center justify-center text-white">
                <Sparkles className="w-3.5 h-3.5 text-mint" />
              </div>
              <h4 className="font-bold text-xs text-alabaster">Quick Doubt Sidecar</h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-alabaster"
              aria-label="Close floating doubt assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {activeTabTitle && (
            <div className="mt-2.5 p-2 rounded-lg bg-obsidian border border-structural-dark flex items-center gap-2 text-[11px] text-zinc-400">
              <FileText className="w-3.5 h-3.5 text-royal" />
              <span className="truncate">Active: {activeTabTitle}</span>
            </div>
          )}

          <form onSubmit={handleSend} className="mt-3">
            <label htmlFor="quick-doubt-input" className="sr-only">Type quick doubt</label>
            <textarea
              id="quick-doubt-input"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask a quick doubt without losing your reading place..."
              rows={3}
              className="w-full bg-obsidian text-alabaster placeholder-zinc-500 text-xs p-3 rounded-xl border border-structural-dark focus:border-royal transition-all resize-none leading-relaxed"
            />
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-structural-dark">
              <span className="text-[10px] text-zinc-500">Press Enter to solve</span>
              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-royal hover:bg-royal-hover disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <span>Solve</span>
                <Send className="w-3 h-3 text-mint" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Floating Trigger Orb */
        <button
          onClick={() => setIsOpen(true)}
          type="button"
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-obsidian border-2 border-royal text-white shadow-block-dark hover:scale-105 active:scale-95 transition-all"
          aria-label="Open Floating Doubt Bubble"
          title="Divyavani Floating Doubt Assistant"
        >
          {/* Subtle pulse ring */}
          <span className="absolute -inset-1 rounded-full bg-royal/30 animate-pulse pointer-events-none" />
          
          <div className="relative flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-mint group-hover:rotate-12 transition-transform" />
          </div>
          
          {/* Badge Tooltip */}
          <span className="sr-only">Ask Doubt</span>
        </button>
      )}
    </div>
  );
}
