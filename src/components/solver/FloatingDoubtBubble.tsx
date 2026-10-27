'use client';

import React, { useState, useEffect } from 'react';
import CameraCaptureModal from './CameraCaptureModal';
import OneOnOneVoiceAssistantModal from './OneOnOneVoiceAssistantModal';

export type BubbleConsentState = 'ask' | 'stay' | 'hidden';

export interface FloatingDoubtBubbleProps {
  readonly classLevel?: string | number;
  readonly subjectName?: string;
  readonly chapterTitle?: string;
  readonly activeTabTitle?: string;
  readonly onOpenCameraModal?: () => void;
  readonly onOpenVoiceModal?: () => void;
  readonly onOpenDoubtSection?: () => void;
  // Compatibility with previous props
  readonly currentSubject?: string;
  readonly currentChapter?: string;
  readonly onQuickDoubtSubmit?: (query: string, imageBase64?: string) => void;
}

const CONSENT_STORAGE_KEY = 'divyavani_floating_bubble_consent_v1';

/* =========================================================================
   CUSTOM HIGH-FIDELITY VECTOR ICONS (No lucide-react used)
   ========================================================================= */

function SparklesGlyph({ className = "w-4 h-4" }: { readonly className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="sparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="50%" stopColor="#6D28D9" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>
      <path
        d="M12 2L13.8 8.2C14.3 9.7 15.5 10.9 17 11.4L22 13L17 14.6C15.5 15.1 14.3 16.3 13.8 17.8L12 24L10.2 17.8C9.7 16.3 8.5 15.1 7 14.6L2 13L7 11.4C8.5 10.9 9.7 9.7 10.2 8.2L12 2Z"
        fill="url(#sparkleGrad)"
      />
      <circle cx="19.5" cy="5.5" r="1.5" fill="#10B981" className="animate-pulse" />
      <circle cx="5.5" cy="19.5" r="1.2" fill="#A78BFA" className="animate-pulse" />
    </svg>
  );
}

function CameraGlyph({ className = "w-4 h-4" }: { readonly className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M14.5 4h-5L7.5 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2h-3.5L14.5 4z" />
      <circle cx="12" cy="13.5" r="3.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="9.5" r="1" fill="currentColor" />
    </svg>
  );
}

function MicGlyph({ className = "w-4 h-4" }: { readonly className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M5 10a7 7 0 0014 0" />
      <line x1="12" y1="17" x2="12" y2="21" />
      <line x1="8" y1="21" x2="16" y2="21" />
    </svg>
  );
}

function SendGlyph({ className = "w-4 h-4" }: { readonly className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
    </svg>
  );
}

function MessageSquareGlyph({ className = "w-4 h-4" }: { readonly className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      <circle cx="9" cy="10" r="1" fill="currentColor" />
      <circle cx="12" cy="10" r="1" fill="currentColor" />
      <circle cx="15" cy="10" r="1" fill="currentColor" />
    </svg>
  );
}

function CheckGlyph({ className = "w-3.5 h-3.5" }: { readonly className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CloseGlyph({ className = "w-4 h-4" }: { readonly className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ShieldGlyph({ className = "w-3 h-3" }: { readonly className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" strokeWidth="2" />
    </svg>
  );
}

/* =========================================================================
   MAIN COMPONENT
   ========================================================================= */

export default function FloatingDoubtBubble({
  classLevel = '9-H',
  subjectName = 'Science',
  chapterTitle = 'Chapter 8: Motion',
  activeTabTitle,
  onOpenCameraModal,
  onOpenVoiceModal,
  onOpenDoubtSection,
  currentSubject,
  currentChapter,
  onQuickDoubtSubmit,
}: FloatingDoubtBubbleProps) {
  const [consent, setConsent] = useState<BubbleConsentState>('ask');
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Fallback modal states if parent doesn't provide handlers
  const [showLocalCamera, setShowLocalCamera] = useState(false);
  const [showLocalVoice, setShowLocalVoice] = useState(false);

  // Normalize prop values
  const effectiveSubject = subjectName || currentSubject || 'Science';
  const effectiveChapter = activeTabTitle || chapterTitle || currentChapter || 'Chapter 8: Motion';

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(CONSENT_STORAGE_KEY) as BubbleConsentState | null;
      if (saved === 'stay' || saved === 'hidden') {
        setConsent(saved);
      }
    } catch {}

    const handleConsentChange = (e: Event) => {
      const custom = e as CustomEvent<BubbleConsentState>;
      if (custom.detail) {
        setConsent(custom.detail);
      }
    };
    window.addEventListener('divyavani-bubble-consent', handleConsentChange);
    return () => window.removeEventListener('divyavani-bubble-consent', handleConsentChange);
  }, []);

  const handleAgreeStay = () => {
    setConsent('stay');
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, 'stay');
    } catch {}
  };

  const handleDenyDisappear = () => {
    setConsent('hidden');
    setIsExpanded(false);
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, 'hidden');
    } catch {}
  };

  const triggerCameraAction = () => {
    setIsExpanded(false);
    if (onOpenCameraModal) {
      onOpenCameraModal();
    } else {
      setShowLocalCamera(true);
    }
  };

  const triggerVoiceAction = () => {
    setIsExpanded(false);
    if (onOpenVoiceModal) {
      onOpenVoiceModal();
    } else {
      setShowLocalVoice(true);
    }
  };

  const triggerDoubtSectionAction = () => {
    setIsExpanded(false);
    if (onOpenDoubtSection) {
      onOpenDoubtSection();
    } else {
      const section = document.getElementById('doubt-solver-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  if (!mounted) return null;

  // When user denies, bubble disappears completely and can only be accessed inside the Doubt Solver section
  if (consent === 'hidden') {
    return null;
  }

  return (
    <>
      {/* Self-hosted Live Camera Modal */}
      {showLocalCamera && (
        <CameraCaptureModal
          isOpen={showLocalCamera}
          onClose={() => setShowLocalCamera(false)}
          onCapture={(base64, fileName) => {
            setShowLocalCamera(false);
            if (onQuickDoubtSubmit) {
              onQuickDoubtSubmit(`[Captured Photo: ${fileName}] Please solve this step-by-step.`, base64);
            }
          }}
        />
      )}

      {/* Self-hosted 1v1 Voice Modal */}
      {showLocalVoice && (
        <OneOnOneVoiceAssistantModal
          isOpen={showLocalVoice}
          onClose={() => setShowLocalVoice(false)}
          currentSubject={String(effectiveSubject)}
          currentChapter={effectiveChapter}
        />
      )}

      {/* =========================================================================
          STATE 1: INITIAL CONSENT PROMPT (Double-Palette with Eye-Catching Effects)
          ========================================================================= */}
      {consent === 'ask' && (
        <div className="fixed bottom-5 right-5 z-50 w-84 max-w-[92vw] bg-white text-zinc-950 border-2 border-zinc-950 rounded-3xl p-5 shadow-2xl animate-float-subtle animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Subtle Ambient Pulse Ring */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-royal/30 via-mint/20 to-purple-600/30 blur-md -z-10 pointer-events-none" />

          {/* Top Brand Tag with Glowing Beacon */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-2xl bg-zinc-950 text-white flex items-center justify-center shadow-md">
                <SparklesGlyph className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-mint animate-radar-ring" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-mint" />
              </div>
              <div>
                <p className="text-xs font-black tracking-tight text-zinc-950">AI Doubt Assistant Bubble</p>
                <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Your Doubt, Our Priority</p>
              </div>
            </div>

            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-royal/10 text-royal border border-royal/20">
              Class {classLevel}
            </span>
          </div>

          <p className="text-xs text-zinc-700 mt-3.5 leading-relaxed font-medium">
            Would you like this floating AI Doubt Bubble to stay on your screen for <strong className="text-zinc-950 font-bold">1-tap Photo Snap</strong> &amp; <strong className="text-zinc-950 font-bold">1v1 Voice help</strong> while you study?
          </p>

          {/* Action Choice Buttons */}
          <div className="grid grid-cols-2 gap-2.5 mt-4">
            <button
              type="button"
              onClick={handleAgreeStay}
              className="group relative px-4 py-2.5 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-zinc-950/20 active:scale-95 transition-all duration-200"
            >
              <div className="p-1 rounded-md bg-white/10 group-hover:bg-white/20 transition">
                <CheckGlyph className="w-3.5 h-3.5 text-mint" />
              </div>
              <span>Yes, Stay</span>
            </button>

            <button
              type="button"
              onClick={handleDenyDisappear}
              className="group px-4 py-2.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all duration-200"
            >
              <div className="p-1 rounded-md bg-zinc-300/60 group-hover:bg-zinc-300 transition">
                <CloseGlyph className="w-3.5 h-3.5 text-zinc-600" />
              </div>
              <span>No, Hide</span>
            </button>
          </div>

          <p className="text-[10px] text-zinc-400 mt-3 text-center leading-normal">
            If hidden, you can still access the AI inside the Doubt Solver section anytime.
          </p>
        </div>
      )}

      {/* =========================================================================
          STATE 2: ACTIVE FLOATING BUBBLE & EXPANDED ASSISTANT DRAWER
          ========================================================================= */}
      {consent === 'stay' && (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
          
          {/* Expanded Drawer Card */}
          {isExpanded && (
            <div className="mb-3 w-84 sm:w-92 max-w-[94vw] bg-white text-zinc-950 border-2 border-zinc-950 rounded-3xl p-4 sm:p-5 shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-200 relative overflow-hidden">
              
              {/* Subtle Decorative Ambient Gradient Arc */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-royal/15 via-mint/10 to-transparent rounded-full pointer-events-none -mr-10 -mt-10 blur-xl" />

              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3 relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-zinc-950 text-white flex items-center justify-center shadow-sm">
                    <SparklesGlyph className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-black text-zinc-950">Divya Vani AI Assistant</p>
                      <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
                    </div>
                    <p className="text-[11px] font-semibold text-zinc-500 truncate max-w-[210px]">
                      Synced: Class {classLevel} • {effectiveSubject} • {effectiveChapter}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 rounded-xl hover:bg-zinc-100 text-zinc-500 hover:text-zinc-950 transition group"
                  title="Minimize"
                  aria-label="Minimize Assistant"
                >
                  <div className="group-hover:rotate-90 transition-transform duration-200">
                    <CloseGlyph className="w-4 h-4" />
                  </div>
                </button>
              </div>

              {/* 3 Dedicated High-Impact Action Tiles */}
              <div className="space-y-2.5 mt-3.5 relative z-10">
                
                {/* 1. Snap & Solve Photo */}
                <button
                  type="button"
                  onClick={triggerCameraAction}
                  className="w-full p-3 rounded-2xl border-2 border-zinc-200 hover:border-zinc-950 bg-zinc-50/70 hover:bg-white text-left flex items-center gap-3.5 group shadow-sm hover:shadow-md transition-all duration-200 active:scale-98"
                >
                  <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 group-hover:bg-royal transition-all duration-200">
                    <CameraGlyph className="w-4 h-4" />
                  </div>
                  <div className="flex-1 truncate">
                    <p className="text-xs font-bold text-zinc-950 group-hover:text-royal transition-colors">
                      📸 Snap &amp; Solve Photo
                    </p>
                    <p className="text-[11px] text-zinc-500 truncate">
                      Live camera or upload textbook diagram
                    </p>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-zinc-100 group-hover:bg-zinc-950 group-hover:text-white flex items-center justify-center text-zinc-400 text-xs transition">
                    &rarr;
                  </div>
                </button>

                {/* 2. 1v1 Voice Tutor */}
                <button
                  type="button"
                  onClick={triggerVoiceAction}
                  className="w-full p-3 rounded-2xl border-2 border-zinc-200 hover:border-zinc-950 bg-zinc-50/70 hover:bg-white text-left flex items-center gap-3.5 group shadow-sm hover:shadow-md transition-all duration-200 active:scale-98"
                >
                  <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 group-hover:bg-emerald-600 transition-all duration-200">
                    <MicGlyph className="w-4 h-4 text-mint" />
                  </div>
                  <div className="flex-1 truncate">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-zinc-950 group-hover:text-emerald-700 transition-colors">
                        🗣️ 1v1 Voice Tutor
                      </p>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-mint/20 text-emerald-800 border border-mint/30">
                        Hinglish/EN
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 truncate">
                      Speak aloud &amp; listen to explanations
                    </p>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-zinc-100 group-hover:bg-zinc-950 group-hover:text-white flex items-center justify-center text-zinc-400 text-xs transition">
                    &rarr;
                  </div>
                </button>

                {/* 3. Open Full Doubt Solver */}
                <button
                  type="button"
                  onClick={triggerDoubtSectionAction}
                  className="w-full p-3 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white text-left flex items-center gap-3.5 group shadow-lg shadow-zinc-950/20 transition-all duration-200 active:scale-98 border-2 border-zinc-950"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/10 group-hover:bg-white/20 text-white flex items-center justify-center shrink-0 transition">
                    <SendGlyph className="w-4 h-4 text-royal-light" />
                  </div>
                  <div className="flex-1 truncate">
                    <p className="text-xs font-bold text-white">
                      ⌨️ Open Full Doubt Solver
                    </p>
                    <p className="text-[11px] text-zinc-400 truncate">
                      Step-by-step KaTeX derivations &amp; quiz
                    </p>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-white/10 group-hover:bg-white group-hover:text-zinc-950 flex items-center justify-center text-zinc-300 text-xs transition">
                    &rarr;
                  </div>
                </button>
              </div>

              {/* Bottom Footer Strip */}
              <div className="pt-3 mt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 relative z-10">
                <div className="flex items-center gap-1.5 font-medium text-zinc-600">
                  <ShieldGlyph className="w-3.5 h-3.5 text-mint" />
                  <span>Zero-Failure 3-Tier AI</span>
                </div>
                <button
                  type="button"
                  onClick={handleDenyDisappear}
                  className="text-zinc-500 hover:text-zinc-950 underline font-semibold transition"
                >
                  Hide floating bubble
                </button>
              </div>
            </div>
          )}

          {/* Main Floating Bubble Trigger Button */}
          <div className="relative group">
            {/* Animated Radar Pulse Ring */}
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-royal via-mint to-purple-600 opacity-60 blur-sm group-hover:opacity-100 animate-radar-ring pointer-events-none" />

            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="relative bg-zinc-950 hover:bg-zinc-800 text-white border-2 border-white/20 rounded-full pl-4 pr-5 py-3 shadow-2xl flex items-center gap-3 transition-all duration-300 transform hover:scale-105 active:scale-95 animate-float-subtle animate-glow-ring"
              aria-label="Ask Divya Vani AI Doubt"
            >
              <div className="relative w-7 h-7 rounded-full bg-royal flex items-center justify-center shadow-inner">
                <MessageSquareGlyph className="w-3.5 h-3.5 text-white" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-mint" />
              </div>
              <div className="text-left">
                <span className="text-xs font-black tracking-tight block">Ask Doubt</span>
                <span className="text-[9px] font-bold text-mint block -mt-0.5">24/7 AI Tutor</span>
              </div>
            </button>
          </div>

        </div>
      )}
    </>
  );
}
