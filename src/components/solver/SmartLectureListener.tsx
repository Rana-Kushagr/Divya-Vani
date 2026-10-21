'use client';

import React, { useState } from 'react';
import { Mic, MicOff, Sparkles, ShieldCheck, HelpCircle, X } from 'lucide-react';

interface SmartLectureListenerProps {
  active: boolean;
  onToggle: () => void;
  onSelectTerm: (term: string) => void;
}

const DETECTED_SYLLABUS_TERMS = [
  { term: 'Centripetal Force', explainer: 'The inward force keeping an object in uniform circular motion ($$F = \\frac{mv^2}{r}$$).' },
  { term: 'Negative Acceleration', explainer: 'Acceleration in opposite direction of velocity, commonly referred to as retardation.' },
  { term: 'Inertia', explainer: 'Inherent property of matter to resist any change in its state of rest or uniform motion.' },
];

export default function SmartLectureListener({
  active,
  onToggle,
  onSelectTerm,
}: SmartLectureListenerProps) {
  const [selectedExplainer, setSelectedExplainer] = useState<typeof DETECTED_SYLLABUS_TERMS[0] | null>(null);

  if (!active) return null;

  return (
    <div className="w-full bg-obsidian border-b border-structural-dark px-4 py-2 text-xs text-alabaster">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Active Ticker Indicator */}
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-mint" />
          </span>
          <span className="font-semibold text-mint text-xs">
            Classroom Listener Active:
          </span>
          <span className="text-zinc-400 text-xs hidden sm:inline">
            Listening for syllabus concepts...
          </span>
        </div>

        {/* Real-Time Detected Keyword Badges */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] text-zinc-500 uppercase font-mono">Heard:</span>
          {DETECTED_SYLLABUS_TERMS.map((item) => (
            <button
              key={item.term}
              onClick={() => {
                setSelectedExplainer(item);
                onSelectTerm(item.term);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-royal/20 text-royal-light border border-royal/50 hover:bg-royal/40 transition-colors font-medium text-xs whitespace-nowrap"
            >
              <Sparkles className="w-3 h-3 text-mint" />
              <span>{item.term}</span>
            </button>
          ))}
        </div>

        {/* Privacy Note & Stop Button */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-500 hidden md:inline">Audio strictly processed locally</span>
          <button
            onClick={onToggle}
            className="text-[11px] font-semibold text-zinc-400 hover:text-red-400 transition-colors"
          >
            Turn Off
          </button>
        </div>

      </div>

      {/* Explainer Popover Drawer */}
      {selectedExplainer && (
        <div className="mt-2 p-3 rounded-lg bg-obsidian-surface border border-structural-dark flex items-start justify-between gap-3 animate-in fade-in">
          <div>
            <span className="font-bold text-alabaster text-xs text-mint">
              Syllabus Concept Explainer: {selectedExplainer.term}
            </span>
            <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
              {selectedExplainer.explainer}
            </p>
          </div>
          <button
            onClick={() => setSelectedExplainer(null)}
            className="text-zinc-400 hover:text-alabaster p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
