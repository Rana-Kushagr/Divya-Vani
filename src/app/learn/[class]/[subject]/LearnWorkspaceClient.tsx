'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import TopCommandHeader from '@/components/layout/TopCommandHeader';
import LegalFooter from '@/components/layout/LegalFooter';
import CookieConsentBanner from '@/components/legal/CookieConsentBanner';
import ChapterTabWorkspace from '@/components/workspace/ChapterTabWorkspace';
import MultimodalDoubtComposer from '@/components/solver/MultimodalDoubtComposer';
import StepByStepSolutionCard from '@/components/solver/StepByStepSolutionCard';
import FloatingDoubtBubble from '@/components/solver/FloatingDoubtBubble';
import SmartLectureListener from '@/components/solver/SmartLectureListener';

import { SubjectId, DocumentTab, SocraticSolution, Chapter } from '@/lib/types';
import { 
  CLASS_LEVELS, 
  SUBJECTS, 
  getChaptersForClassAndSubject, 
  getTabsForChapter 
} from '@/lib/mockData';
import { solveSocraticDoubt } from '@/lib/aiSimulation';
import { 
  Sparkles, 
  BookOpen, 
  ChevronRight, 
  Flame, 
  Mic, 
  Layers,
  HelpCircle
} from 'lucide-react';

interface LearnWorkspaceClientProps {
  routeParams?: { class: string; subject: string };
}

export default function LearnWorkspaceClient({ routeParams }: LearnWorkspaceClientProps) {
  const hookParams = useParams();
  const rawClass = routeParams?.class || (hookParams?.class as string) || 'class-9';
  const rawSubject = routeParams?.subject || (hookParams?.subject as string) || 'science';

  const currentClass = rawClass.toLowerCase();
  const currentSubject = rawSubject.toLowerCase() as SubjectId;

  // Chapters list for this class & subject
  const availableChapters = getChaptersForClassAndSubject(currentClass, currentSubject);
  const [currentChapterId, setCurrentChapterId] = useState<string>(availableChapters[0]?.id || 'sci-ch8');
  
  const currentChapter = availableChapters.find((c) => c.id === currentChapterId) || availableChapters[0];

  // Document tabs state
  const [tabsMap, setTabsMap] = useState<Record<string, DocumentTab[]>>({});
  const currentTabs = tabsMap[currentChapterId] || getTabsForChapter(currentChapter, currentClass);
  const [activeTabId, setActiveTabId] = useState<string>(currentTabs[0]?.id || 'tab-1');

  // Solver & Lecture Listener state
  const [listenerActive, setListenerActive] = useState<boolean>(false);
  const [composerQuery, setComposerQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSolution, setActiveSolution] = useState<SocraticSolution | null>(() => {
    return solveSocraticDoubt(
      'A train starting from rest attains a velocity of 72 km/h in 5 minutes. Find acceleration and distance traveled.',
      currentChapter?.title || 'Motion',
      'Formula Sheet & Derivations'
    );
  });

  // Mobile viewport view switcher ('document' vs 'solver')
  const [mobileActiveView, setMobileActiveView] = useState<'document' | 'solver'>('document');

  // Persist active class and subject
  useEffect(() => {
    try {
      localStorage.setItem('divyavani_selected_class', currentClass);
      localStorage.setItem('divyavani_selected_subject', currentSubject);
    } catch (e) {
      // ignore
    }
  }, [currentClass, currentSubject]);

  // Sync tabs when chapter changes
  useEffect(() => {
    if (!tabsMap[currentChapterId]) {
      const generated = getTabsForChapter(currentChapter, currentClass);
      setTabsMap((prev) => ({ ...prev, [currentChapterId]: generated }));
      if (generated[0]) setActiveTabId(generated[0].id);
    } else {
      const existing = tabsMap[currentChapterId];
      if (existing && existing[0]) setActiveTabId(existing[0].id);
    }
  }, [currentChapterId, currentClass, currentChapter, tabsMap]);

  const activeTab = currentTabs.find((t) => t.id === activeTabId) || currentTabs[0];

  // Tab Handlers
  const handleSelectTab = (id: string) => {
    setActiveTabId(id);
  };

  const handleAddTab = (newTab: DocumentTab) => {
    setTabsMap((prev) => {
      const existing = prev[currentChapterId] || [];
      return {
        ...prev,
        [currentChapterId]: [...existing, newTab],
      };
    });
    setActiveTabId(newTab.id);
  };

  const handleCloseTab = (id: string) => {
    setTabsMap((prev) => {
      const existing = prev[currentChapterId] || [];
      const filtered = existing.filter((t) => t.id !== id);
      return {
        ...prev,
        [currentChapterId]: filtered,
      };
    });
    if (activeTabId === id) {
      const remaining = currentTabs.filter((t) => t.id !== id);
      if (remaining[0]) setActiveTabId(remaining[0].id);
    }
  };

  const handleTogglePinTab = (id: string) => {
    setTabsMap((prev) => {
      const existing = prev[currentChapterId] || [];
      const updated = existing.map((t) => (t.id === id ? { ...t, pinned: !t.pinned } : t));
      return {
        ...prev,
        [currentChapterId]: updated,
      };
    });
  };

  // Solve Doubt handler
  const handleSolveDoubt = async (query: string, attachTabContext: boolean) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/doubts/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentQuery: query,
          chapterId: currentChapter.title,
          subjectId: currentSubject,
          attachedTabContext: attachTabContext ? activeTab?.title : undefined,
          inputMode: 'text',
        }),
      });

      const data = await res.json();
      if (data.success && data.solution) {
        setActiveSolution(data.solution);
      } else {
        const fallback = solveSocraticDoubt(
          query,
          `Ch ${currentChapter.number}: ${currentChapter.title}`,
          attachTabContext ? activeTab?.title : undefined
        );
        setActiveSolution(fallback);
      }
    } catch (err) {
      const fallback = solveSocraticDoubt(
        query,
        `Ch ${currentChapter.number}: ${currentChapter.title}`,
        attachTabContext ? activeTab?.title : undefined
      );
      setActiveSolution(fallback);
    } finally {
      setIsLoading(false);
      setMobileActiveView('solver');
    }
  };

  const handleAskFromContext = (selectedText: string) => {
    setComposerQuery(`Regarding "${selectedText.slice(0, 70)}...": Can you explain how this concept applies in numerical problems?`);
    setMobileActiveView('solver');
  };

  const handleSaveToRevision = (sol: SocraticSolution) => {
    try {
      const saved = localStorage.getItem('divyavani_revision_vault');
      const list = saved ? JSON.parse(saved) : [];
      list.unshift(sol);
      localStorage.setItem('divyavani_revision_vault', JSON.stringify(list.slice(0, 50)));
    } catch (e) {
      // ignore
    }
  };

  const classObj = CLASS_LEVELS.find((c) => c.id === currentClass) || { name: 'Class 9', id: 'class-9' };
  const subjectObj = SUBJECTS.find((s) => s.id === currentSubject) || SUBJECTS[0];

  return (
    <div className="min-h-screen bg-obsidian text-alabaster flex flex-col selection:bg-royal selection:text-white">
      
      {/* =========================================================================
          BLOCK 1: ALABASTER WHITE BLOCK (#FFFFFF)
          Header & Welcome Banner: Clean, breathable, high clarity with deep slate text.
          ========================================================================= */}
      <div className="bg-alabaster text-obsidian border-b border-structural-light">
        <TopCommandHeader
          currentClass={currentClass}
          currentSubject={currentSubject}
          currentChapterTitle={`Ch ${currentChapter.number}: ${currentChapter.title}`}
          listenerActive={listenerActive}
          onToggleListener={() => setListenerActive(!listenerActive)}
          theme="white"
        />

        {/* Welcome Sub-Banner */}
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-obsidian tracking-tight">
              {classObj.name} &bull; {subjectObj.name} ({subjectObj.hindiName})
            </span>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-royal/10 text-royal border border-royal/20">
              CBSE NCERT Aligned
            </span>
          </div>

          <div className="flex items-center gap-4 text-zinc-500">
            <span className="hidden sm:inline font-medium">
              Socratic AI Tutor Active &bull; No Hallucination Guard
            </span>
            <Link 
              href="/select-class" 
              className="text-royal font-bold hover:underline flex items-center gap-1"
            >
              <span>Change Subject</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================================
          BLOCK 2: OBSIDIAN BLACK BLOCK (#09090B)
          Command & Selection Strip: Dark, focused command block holding Chapter pills,
          Formula Spotlights, and Audio HUD for high visual impact and contrast.
          ========================================================================= */}
      <div className="bg-obsidian border-b-1.5 border-structural-dark px-4 lg:px-6 py-3 shadow-block-dark">
        <div className="max-w-7xl mx-auto space-y-3">
          
          {/* Chapter Selector Strip (Horizontal Scroll) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 whitespace-nowrap flex items-center gap-1.5 mr-1">
              <Layers className="w-3.5 h-3.5 text-royal" />
              <span>Chapters:</span>
            </span>

            {availableChapters.map((ch) => {
              const isSelected = ch.id === currentChapterId;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setCurrentChapterId(ch.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-royal text-white border-royal shadow-sm ring-1 ring-royal-light/40'
                      : 'bg-obsidian-surface text-zinc-400 hover:text-white border-structural-dark hover:border-zinc-700'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {ch.number}
                  </span>
                  <span className="truncate max-w-[150px]">{ch.title}</span>
                  {ch.formulaCount > 0 && (
                    <span className="text-[9px] px-1 rounded bg-amber/20 text-amber font-mono">
                      {ch.formulaCount} fx
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Formula Spotlight Ticker & Audio HUD */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-structural-dark/60 text-xs">
            <div className="flex items-center gap-2 text-zinc-300">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber/10 border border-amber/30 text-amber font-bold text-[10px] uppercase">
                <Flame className="w-3 h-3 text-amber" />
                <span>Formula Spotlight</span>
              </div>
              <span className="text-zinc-400 truncate max-w-md hidden sm:inline">
                {currentChapter.title === 'Motion' 
                  ? 'Kinematic Big Three: v = u + at, s = ut + ½at², 2as = v² - u²'
                  : `Master core derivations for Ch ${currentChapter.number}: ${currentChapter.title}`}
              </span>
            </div>

            {/* Smart Listener Live Feedback */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setListenerActive(!listenerActive)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md border transition-all ${
                  listenerActive
                    ? 'bg-mint text-obsidian border-mint font-bold shadow-sm'
                    : 'bg-obsidian-surface text-zinc-400 border-structural-dark hover:border-zinc-600'
                }`}
              >
                <Mic className={`w-3.5 h-3.5 ${listenerActive ? 'animate-bounce' : 'text-zinc-500'}`} />
                <span>{listenerActive ? 'Lecture Listener Live' : 'Enable Lecture Listener'}</span>
              </button>
            </div>
          </div>

          {/* Smart Lecture Listener Component when active */}
          {listenerActive && (
            <div className="pt-2">
              <SmartLectureListener
                active={listenerActive}
                onToggle={() => setListenerActive(!listenerActive)}
                onSelectTerm={(term: string) => {
                  setComposerQuery(`Explain the syllabus concept of "${term}" with definition, formula, and CBSE marking key.`);
                  setMobileActiveView('solver');
                }}
              />
            </div>
          )}

        </div>
      </div>

      {/* =========================================================================
          BLOCK 3: ALABASTER WHITE BLOCK (#FFFFFF)
          Primary Content Canvas: White background for reading PDFs, notes, and step derivations.
          Side-by-side (60% Reader / 40% AI Tutor) on desktop.
          ========================================================================= */}
      <main className="flex-1 bg-alabaster text-obsidian p-3 sm:p-6">
        <div className="max-w-7xl mx-auto h-full flex flex-col">
          
          {/* Mobile Tab Switcher (< 1024px) */}
          <div className="lg:hidden flex items-center p-1 bg-zinc-200 rounded-xl mb-3 border border-zinc-300 text-xs font-bold">
            <button
              type="button"
              onClick={() => setMobileActiveView('document')}
              className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all ${
                mobileActiveView === 'document'
                  ? 'bg-white text-obsidian shadow-sm'
                  : 'text-zinc-600 hover:text-obsidian'
              }`}
            >
              <BookOpen className="w-4 h-4 text-royal" />
              <span>Chapter Document & Notes</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileActiveView('solver')}
              className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all ${
                mobileActiveView === 'solver'
                  ? 'bg-white text-obsidian shadow-sm'
                  : 'text-zinc-600 hover:text-obsidian'
              }`}
            >
              <Sparkles className="w-4 h-4 text-mint" />
              <span>Socratic AI Tutor</span>
            </button>
          </div>

          {/* Split Screen Layout (60% Document Reader / 40% AI Doubt Solver) */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: 60% Document & Chapter Vault */}
            <section className={`lg:col-span-7 h-full flex flex-col ${
              mobileActiveView === 'document' ? 'block' : 'hidden lg:block'
            }`}>
              <div className="flex-1 min-h-[560px] flex flex-col">
                <ChapterTabWorkspace
                  tabs={currentTabs}
                  activeTabId={activeTabId}
                  onSelectTab={handleSelectTab}
                  onAddTab={handleAddTab}
                  onCloseTab={handleCloseTab}
                  onTogglePinTab={handleTogglePinTab}
                  onAskFromContext={handleAskFromContext}
                />
              </div>
            </section>

            {/* RIGHT COLUMN: 40% 24/7 Socratic AI Doubt Solver */}
            <section className={`lg:col-span-5 flex flex-col space-y-4 ${
              mobileActiveView === 'solver' ? 'block' : 'hidden lg:block'
            }`}>
              
              {/* Multimodal Doubt Composer */}
              <MultimodalDoubtComposer
                currentSubject={currentSubject}
                currentChapterId={currentChapterId}
                chapterTitle={currentChapter.title}
                activeTabTitle={activeTab?.title}
                initialQuery={composerQuery}
                onSolveDoubt={handleSolveDoubt}
                isLoading={isLoading}
              />

              {/* Step-by-Step Pedagogical Solution */}
              {activeSolution ? (
                <StepByStepSolutionCard
                  solution={activeSolution}
                  onSaveToRevision={handleSaveToRevision}
                />
              ) : (
                <div className="bg-obsidian-surface border-1.5 border-structural-dark rounded-xl p-8 text-center text-zinc-400 shadow-block-dark">
                  <HelpCircle className="w-10 h-10 text-royal mx-auto mb-2 opacity-60" />
                  <h4 className="font-bold text-white text-sm">No Active Doubt Query</h4>
                  <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
                    Type a question, speak into your mic, or highlight any passage from the textbook to generate a step-by-step CBSE derivation.
                  </p>
                </div>
              )}

            </section>

          </div>

        </div>
      </main>

      {/* Global Persistent Tools */}
      <FloatingDoubtBubble
        activeTabTitle={activeTab?.title}
        onQuickDoubtSubmit={(q: string) => {
          handleSolveDoubt(q, true);
        }}
      />

      <CookieConsentBanner />

      <LegalFooter />

    </div>
  );
}
