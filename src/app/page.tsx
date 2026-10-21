'use client';

import React, { useState } from 'react';
import TopCommandHeader from '@/components/layout/TopCommandHeader';
import LegalFooter from '@/components/layout/LegalFooter';
import CookieConsentBanner from '@/components/legal/CookieConsentBanner';
import ChapterTabWorkspace from '@/components/workspace/ChapterTabWorkspace';
import MultimodalDoubtComposer from '@/components/solver/MultimodalDoubtComposer';
import StepByStepSolutionCard from '@/components/solver/StepByStepSolutionCard';
import FloatingDoubtBubble from '@/components/solver/FloatingDoubtBubble';
import SmartLectureListener from '@/components/solver/SmartLectureListener';

import { SubjectId, DocumentTab, SocraticSolution } from '@/lib/types';
import { SUBJECTS, CHAPTERS, INITIAL_CHAPTER_TABS } from '@/lib/mockData';
import { solveSocraticDoubt } from '@/lib/aiSimulation';
import { Sparkles, Atom, Calculator, BookOpen, Languages, Globe, Scroll } from 'lucide-react';

export default function WorkspacePage() {
  const [currentSubject, setCurrentSubject] = useState<SubjectId>('science');
  const [currentChapterId, setCurrentChapterId] = useState<string>('sci-ch8');
  const [listenerActive, setListenerActive] = useState<boolean>(false);

  // Tabs management
  const [tabsMap, setTabsMap] = useState<Record<string, DocumentTab[]>>(INITIAL_CHAPTER_TABS);
  const currentTabs = tabsMap[currentChapterId] || INITIAL_CHAPTER_TABS['sci-ch8'] || [];
  const [activeTabId, setActiveTabId] = useState<string>(currentTabs[0]?.id || 'tab-ncert-pdf');

  // Solution and doubt state
  const [activeSolution, setActiveSolution] = useState<SocraticSolution | null>(() => {
    return solveSocraticDoubt(
      'A train starting from rest attains a velocity of 72 km/h in 5 minutes. Find acceleration and distance traveled.',
      'Chapter 8: Motion',
      'Formula Sheet & Derivations'
    );
  });
  const [isLoading, setIsLoading] = useState(false);
  const [composerQuery, setComposerQuery] = useState('');

  const currentChapter = CHAPTERS[currentSubject]?.find((c) => c.id === currentChapterId) 
    || CHAPTERS[currentSubject]?.[0] 
    || { number: 8, title: 'Motion', id: 'sci-ch8' };

  const activeTab = currentTabs.find((t) => t.id === activeTabId);

  // Handle Tab actions
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

  // Solving doubt
  const handleSolveDoubt = (query: string, attachTabContext: boolean) => {
    setIsLoading(true);
    setTimeout(() => {
      const sol = solveSocraticDoubt(
        query,
        `Ch ${currentChapter.number}: ${currentChapter.title}`,
        attachTabContext ? activeTab?.title : undefined
      );
      setActiveSolution(sol);
      setIsLoading(false);
    }, 450);
  };

  // Quick prompt from highlight
  const handleAskFromContext = (selectedText: string) => {
    setComposerQuery(`Regarding "${selectedText.slice(0, 60)}...": Can you explain how this concept applies in numerical problems?`);
  };

  // Subject quick icon helper
  const getSubjectIcon = (id: SubjectId) => {
    switch (id) {
      case 'science': return <Atom className="w-4 h-4 text-royal" />;
      case 'maths': return <Calculator className="w-4 h-4 text-mint" />;
      case 'english': return <BookOpen className="w-4 h-4 text-blue-400" />;
      case 'hindi': return <Languages className="w-4 h-4 text-amber" />;
      case 'social_science': return <Globe className="w-4 h-4 text-red-400" />;
      case 'sanskrit': return <Scroll className="w-4 h-4 text-purple-400" />;
      default: return <Sparkles className="w-4 h-4 text-royal" />;
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-alabaster flex flex-col">
      {/* Top Command Rail */}
      <TopCommandHeader
        currentSubject={currentSubject}
        onSubjectChange={(sub) => {
          setCurrentSubject(sub);
          const firstCh = CHAPTERS[sub]?.[0]?.id || '';
          setCurrentChapterId(firstCh);
          const chTabs = tabsMap[firstCh] || INITIAL_CHAPTER_TABS[firstCh] || [];
          if (chTabs[0]) setActiveTabId(chTabs[0].id);
        }}
        currentChapterId={currentChapterId}
        onChapterChange={(chId) => {
          setCurrentChapterId(chId);
          const chTabs = tabsMap[chId] || INITIAL_CHAPTER_TABS[chId] || [];
          if (chTabs[0]) setActiveTabId(chTabs[0].id);
        }}
        listenerActive={listenerActive}
        onToggleListener={() => setListenerActive(!listenerActive)}
      />

      {/* Classroom Smart Listener HUD (when active) */}
      <SmartLectureListener
        active={listenerActive}
        onToggle={() => setListenerActive(false)}
        onSelectTerm={(term) => {
          setComposerQuery(`Explain the term "${term}" and derive its formula for Class IX.`);
        }}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 space-y-6">
        
        {/* Bento Quick-Access Subject Strip (Alternating Black & White Blocks) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {SUBJECTS.map((sub, idx) => {
            const isSelected = sub.id === currentSubject;
            const isEven = idx % 2 === 0;
            return (
              <button
                key={sub.id}
                onClick={() => {
                  setCurrentSubject(sub.id);
                  const firstCh = CHAPTERS[sub.id]?.[0]?.id || '';
                  setCurrentChapterId(firstCh);
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-royal bg-royal/15 shadow-sm ring-1 ring-royal'
                    : isEven
                    ? 'bg-obsidian-surface border-structural-dark hover:border-zinc-600 text-alabaster'
                    : 'bg-zinc-900 border-structural-dark hover:border-zinc-600 text-alabaster'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="p-1.5 rounded-lg bg-obsidian border border-structural-dark">
                    {getSubjectIcon(sub.id)}
                  </div>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-mint" />
                  )}
                </div>
                <div className="font-bold text-xs text-alabaster truncate">{sub.name}</div>
                <div className="text-[10px] text-zinc-400 font-medium">{sub.hindiName}</div>
              </button>
            );
          })}
        </div>

        {/* Split-Screen Multi-Tab Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Pane (7 Cols): Multi-Tab Chapter Document Workspace */}
          <section className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <div>
                <h2 className="text-base font-bold text-alabaster tracking-tight flex items-center gap-2">
                  <span>Chapter Vault</span>
                  <span className="text-xs text-zinc-500 font-normal">•</span>
                  <span className="text-xs text-zinc-400 font-medium">
                    Ch {currentChapter.number}: {currentChapter.title}
                  </span>
                </h2>
                <p className="text-[11px] text-zinc-500">
                  Switch tabs instantly or upload your own notes and question banks
                </p>
              </div>
              <span className="text-[11px] font-mono text-zinc-400 bg-obsidian px-2 py-0.5 rounded border border-structural-dark">
                {currentTabs.length} Tabs Open
              </span>
            </div>

            {/* Chapter Tab Workspace Component */}
            <div className="min-h-[580px]">
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

          {/* Right Pane (5 Cols): Multimodal Doubt Composer & Socratic Solution Engine */}
          <section className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-base font-bold text-alabaster tracking-tight">
                Socratic Doubt Engine
              </h2>
              <span className="text-[11px] font-semibold text-mint flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-mint" />
                <span>Pedagogy Ready</span>
              </span>
            </div>

            {/* Composer */}
            <MultimodalDoubtComposer
              currentSubject={currentSubject}
              currentChapterId={currentChapterId}
              chapterTitle={`Ch ${currentChapter.number}: ${currentChapter.title}`}
              activeTabTitle={activeTab?.title}
              initialQuery={composerQuery}
              onSolveDoubt={handleSolveDoubt}
              isLoading={isLoading}
            />

            {/* Socratic Output Card */}
            {activeSolution && (
              <StepByStepSolutionCard
                solution={activeSolution}
                onSaveToRevision={(sol) => {
                  // Saved to revision hub
                }}
              />
            )}
          </section>

        </div>

      </main>

      {/* Floating Doubt Bubble Orb at bottom-6 right-6 */}
      <FloatingDoubtBubble
        activeTabTitle={activeTab?.title}
        onQuickDoubtSubmit={(q) => handleSolveDoubt(q, true)}
      />

      {/* Cookie Consent Banner */}
      <CookieConsentBanner />

      {/* Legal Footer */}
      <LegalFooter />
    </div>
  );
}
