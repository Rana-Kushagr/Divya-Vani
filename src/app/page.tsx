'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Atom, 
  Globe, 
  Calculator, 
  BookOpen, 
  Languages, 
  Scroll, 
  HelpCircle, 
  FolderGit2, 
  Brain, 
  Play, 
  FileText 
} from 'lucide-react';

import TopCommandHeader from '@/components/layout/TopCommandHeader';
import LegalFooter from '@/components/layout/LegalFooter';
import CookieConsentBanner from '@/components/legal/CookieConsentBanner';
import ChapterNotesHub from '@/components/workspace/ChapterNotesHub';
import MultimodalDoubtComposer from '@/components/solver/MultimodalDoubtComposer';
import StepByStepSolutionCard from '@/components/solver/StepByStepSolutionCard';
import FloatingDoubtBubble from '@/components/solver/FloatingDoubtBubble';
import SmartLectureListener from '@/components/solver/SmartLectureListener';

import { ClassLevel, SubjectId, ChapterMeta, SocraticSolution } from '@/lib/types';
import { CLASSES, SUBJECTS, CHAPTERS_BY_SUBJECT, GOOGLE_DRIVE_VAULTS } from '@/lib/mockData';
import { solveSocraticDoubt } from '@/lib/aiSimulation';

export default function WorkspacePage() {
  // Step 1: Class Selection (Default Class 9-H)
  const [selectedClass, setSelectedClass] = useState<ClassLevel>('Class 9-H');

  // Step 2: Subject Selection (Default Science)
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>('SCIENCE');

  // Step 3: Chapter / Material Selection
  const availableChapters = CHAPTERS_BY_SUBJECT[selectedSubject] || [];
  const [selectedChapterId, setSelectedChapterId] = useState<string>(availableChapters[0]?.id || 'sci-ch1');
  const currentChapter = availableChapters.find((c) => c.id === selectedChapterId) || availableChapters[0] || {
    id: 'sci-ch1',
    number: 1,
    title: 'Matter in Our Surroundings',
    subjectCode: 'SCIENCE',
    hasExtraMaterials: true,
  };

  // View Mode: 'CHAPTER_NOTES' vs 'GOOGLE_DRIVE_VAULTS'
  const [activeMaterialTab, setActiveMaterialTab] = useState<'NOTES' | 'DRIVE1' | 'DRIVE2' | 'DRIVE3'>('NOTES');
  const [driveEmbedMode, setDriveEmbedMode] = useState<'list' | 'grid'>('list');

  // Doubt Engine
  const [composerQuery, setComposerQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSolution, setActiveSolution] = useState<SocraticSolution | null>(() => {
    return solveSocraticDoubt(
      'Explain the difference between latent heat of fusion and latent heat of vaporization with formula.',
      'Chapter 1: Matter in Our Surroundings',
      'Chapter Notes PDF'
    );
  });

  const [listenerActive, setListenerActive] = useState(false);

  // Triggering doubt resolution with multi-tier AI backend
  const handleSolveDoubt = async (query: string, attachContext: boolean, imageBase64?: string) => {
    setIsLoading(true);
    try {
      const savedKey = typeof window !== 'undefined' ? localStorage.getItem('divyavani_gemini_key') || undefined : undefined;
      const res = await fetch('/api/doubts/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentQuery: query,
          subjectId: selectedSubject,
          chapterId: `Ch ${currentChapter.number}: ${currentChapter.title}`,
          attachedTabContext: attachContext ? `Ch ${currentChapter.number} Notes` : undefined,
          inputMode: imageBase64 ? 'image' : 'text',
          imageBase64,
          apiKey: savedKey,
        }),
      });

      const data = await res.json();
      if (data.solution) {
        setActiveSolution(data.solution);
      } else {
        const fallback = solveSocraticDoubt(
          query,
          `Ch ${currentChapter.number}: ${currentChapter.title}`,
          attachContext ? `Ch ${currentChapter.number} Notes` : undefined
        );
        setActiveSolution(fallback);
      }
    } catch (err) {
      console.warn('API doubt solve error, using local Socratic engine:', err);
      const fallback = solveSocraticDoubt(
        query,
        `Ch ${currentChapter.number}: ${currentChapter.title}`,
        attachContext ? `Ch ${currentChapter.number} Notes` : undefined
      );
      setActiveSolution(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper for subject icons
  const getSubjectIcon = (code: SubjectId) => {
    switch (code) {
      case 'SCIENCE': return <Atom className="w-4 h-4 text-royal" />;
      case 'SST': return <Globe className="w-4 h-4 text-emerald-400" />;
      case 'MATHEMATICS': return <Calculator className="w-4 h-4 text-amber" />;
      case 'ENGLISH': return <BookOpen className="w-4 h-4 text-blue-400" />;
      case 'HINDI': return <Languages className="w-4 h-4 text-rose-400" />;
      case 'SANSKRIT': return <Scroll className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-alabaster flex flex-col font-sans">
      
      {/* Top Header */}
      <TopCommandHeader
        currentSubject={selectedSubject}
        onSubjectChange={(sub) => {
          setSelectedSubject(sub);
          const firstCh = CHAPTERS_BY_SUBJECT[sub]?.[0]?.id || '';
          setSelectedChapterId(firstCh);
        }}
        currentChapterId={selectedChapterId}
        onChapterChange={(chId) => setSelectedChapterId(chId)}
        listenerActive={listenerActive}
        onToggleListener={() => setListenerActive(!listenerActive)}
      />

      {/* Classroom Smart Listener HUD (when enabled) */}
      <SmartLectureListener
        active={listenerActive}
        onToggle={() => setListenerActive(false)}
        onSelectTerm={(term) => {
          setComposerQuery(`Explain the term "${term}" and derive its formula for Class 9.`);
        }}
      />

      {/* Main Uncrowded Interface Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 space-y-5">
        
        {/* ========================================================= */}
        {/* HIERARCHICAL STRIP: 1. CLASS -> 2. SUBJECT -> 3. CHAPTER */}
        {/* ========================================================= */}
        <section aria-label="Course Hierarchy" className="space-y-3">
          
          {/* STEP 1: CLASS SELECTOR */}
          <div className="flex items-center justify-between gap-3 bg-obsidian-surface border-2 border-structural-dark rounded-xl px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 tracking-wider">
                STEP 1: SELECT CLASS
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              {CLASSES.map((cls) => {
                const isSelected = selectedClass === cls;
                return (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => setSelectedClass(cls)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-alabaster text-obsidian shadow-sm scale-105'
                        : 'bg-obsidian text-zinc-400 hover:text-alabaster border border-structural-dark'
                    }`}
                  >
                    {cls}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: SUBJECT SELECTOR */}
          <div className="bg-obsidian-surface border-2 border-structural-dark rounded-xl p-3">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 tracking-wider">
                STEP 2: SELECT SUBJECT
              </span>
              <span className="text-[11px] text-zinc-500">
                Selected: <strong className="text-alabaster">{selectedSubject}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {SUBJECTS.map((sub) => {
                const isSelected = selectedSubject === sub.code;
                return (
                  <button
                    key={sub.code}
                    type="button"
                    onClick={() => {
                      setSelectedSubject(sub.code);
                      const firstCh = CHAPTERS_BY_SUBJECT[sub.code]?.[0]?.id || '';
                      setSelectedChapterId(firstCh);
                      setActiveMaterialTab('NOTES');
                    }}
                    className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? 'border-royal bg-royal/20 text-alabaster shadow-sm ring-1 ring-royal'
                        : 'border-structural-dark bg-obsidian hover:border-zinc-600 text-zinc-300 hover:text-alabaster'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="p-1 rounded-md bg-obsidian-surface border border-structural-dark">
                        {getSubjectIcon(sub.code)}
                      </div>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-mint" />
                      )}
                    </div>
                    <div className="font-bold text-xs truncate">{sub.name}</div>
                    <div className="text-[10px] text-zinc-500 font-medium">{sub.hindiName}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: CHAPTER SELECTOR */}
          <div className="bg-obsidian-surface border-2 border-structural-dark rounded-xl p-3">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 tracking-wider">
                STEP 3: SELECT CHAPTER MATERIAL
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                {availableChapters.length} Chapters Indexed
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {availableChapters.map((ch) => {
                const isSelected = ch.id === currentChapter.id;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => {
                      setSelectedChapterId(ch.id);
                      setActiveMaterialTab('NOTES');
                    }}
                    className={`px-3 py-2 rounded-xl border-2 text-left whitespace-nowrap transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-alabaster text-obsidian border-structural-light font-bold shadow-sm'
                        : 'bg-obsidian text-zinc-300 border-structural-dark hover:border-zinc-600 hover:text-alabaster'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                      isSelected ? 'bg-royal text-white' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {ch.number}
                    </span>
                    <span className="text-xs">{ch.title}</span>

                    {/* Extra materials badge */}
                    {ch.hasExtraMaterials && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        isSelected ? 'bg-mint text-obsidian font-black' : 'bg-mint/20 text-mint'
                      }`}>
                        {ch.animationVideoUrl ? 'MindMap + Video' : 'MindMap'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </section>

        {/* ========================================================= */}
        {/* RESOURCE VAULT TABS (CHAPTER NOTES vs 3 GOOGLE DRIVE VAULTS) */}
        {/* ========================================================= */}
        <div className="flex items-center gap-2 border-b-2 border-structural-dark pb-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveMaterialTab('NOTES')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold border-2 transition-all ${
              activeMaterialTab === 'NOTES'
                ? 'bg-alabaster text-obsidian border-structural-light shadow-sm'
                : 'bg-obsidian text-zinc-400 border-structural-dark hover:text-alabaster'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-royal" />
            <span>Chapter Material (Notes, Mindmap, Video)</span>
          </button>

          {GOOGLE_DRIVE_VAULTS.map((vault, idx) => {
            const tabKey = (`DRIVE${idx + 1}`) as 'DRIVE1' | 'DRIVE2' | 'DRIVE3';
            const isActive = activeMaterialTab === tabKey;
            return (
              <button
                key={vault.id}
                type="button"
                onClick={() => setActiveMaterialTab(tabKey)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold border-2 transition-all ${
                  isActive
                    ? 'bg-alabaster text-obsidian border-structural-light shadow-sm'
                    : 'bg-obsidian text-zinc-400 border-structural-dark hover:text-alabaster'
                }`}
              >
                <FolderGit2 className="w-3.5 h-3.5 text-amber" />
                <span>Drive Vault {idx + 1}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* SPLIT-SCREEN WORKSPACE (LEFT: MATERIAL | RIGHT: DOUBT SOLVER) */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN (7 COLS): CHAPTER MATERIAL OR GOOGLE DRIVE EXPLORER */}
          <section className="lg:col-span-7 flex flex-col gap-3">
            {activeMaterialTab === 'NOTES' ? (
              <ChapterNotesHub
                chapter={currentChapter}
                onAskAI={(ctx) => {
                  setComposerQuery(ctx);
                  handleSolveDoubt(ctx, true);
                }}
              />
            ) : (
              /* GOOGLE DRIVE EMBEDDED VAULT */
              (() => {
                const vIdx = activeMaterialTab === 'DRIVE1' ? 0 : activeMaterialTab === 'DRIVE2' ? 1 : 2;
                const activeVault = GOOGLE_DRIVE_VAULTS[vIdx];
                const embedSrc = `https://drive.google.com/embeddedfolderview?id=${encodeURIComponent(activeVault.driveFolderId || '')}#${driveEmbedMode}`;

                return (
                  <div className="bg-alabaster text-obsidian rounded-2xl border-2 border-structural-light p-5 space-y-4 shadow-white-block">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-structural-light">
                      <div>
                        <span className="text-[10px] font-mono uppercase bg-royal text-white font-bold px-2 py-0.5 rounded">
                          Live Connected Cloud Vault
                        </span>
                        <h3 className="text-sm font-bold text-obsidian mt-1">
                          {activeVault.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setDriveEmbedMode(driveEmbedMode === 'list' ? 'grid' : 'list')}
                          className="px-2.5 py-1 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-100 text-xs font-semibold"
                        >
                          View: {driveEmbedMode === 'list' ? 'List' : 'Grid'}
                        </button>
                        <a
                          href={activeVault.driveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 rounded-lg bg-royal hover:bg-royal-hover text-white text-xs font-bold"
                        >
                          Open in Google Drive ↗
                        </a>
                      </div>
                    </div>

                    <div className="border border-zinc-300 rounded-xl overflow-hidden bg-zinc-50">
                      <iframe
                        src={embedSrc}
                        title={activeVault.title}
                        className="w-full h-80 border-0 bg-white"
                        loading="lazy"
                      />
                    </div>
                  </div>
                );
              })()
            )}
          </section>

          {/* RIGHT COLUMN (5 COLS): SOCRATIC AI DOUBT SOLVER */}
          <section id="doubt-solver-section" className="lg:col-span-5 flex flex-col gap-3 scroll-mt-20">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-bold text-alabaster tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-mint" />
                <span>Socratic AI Doubt Solver</span>
              </h2>
              <span className="text-[11px] font-mono text-zinc-400">
                Synced: Ch {currentChapter.number}
              </span>
            </div>

            {/* Multimodal Doubt Composer */}
            <MultimodalDoubtComposer
              currentSubject={selectedSubject}
              currentChapterId={currentChapter.id}
              chapterTitle={`Ch ${currentChapter.number}: ${currentChapter.title}`}
              activeTabTitle={`Ch ${currentChapter.number} Notes`}
              initialQuery={composerQuery}
              onSolveDoubt={handleSolveDoubt}
              isLoading={isLoading}
            />

            {/* Socratic Step-by-Step Solution Card */}
            {activeSolution && (
              <StepByStepSolutionCard
                solution={activeSolution}
              />
            )}
          </section>

        </div>

      </main>

      {/* Persistent Floating Doubt Bubble at bottom-6 right-6 */}
      <FloatingDoubtBubble
        classLevel={selectedClass}
        subjectName={selectedSubject}
        chapterTitle={`Ch ${currentChapter.number}: ${currentChapter.title}`}
        activeTabTitle={`Ch ${currentChapter.number}: ${currentChapter.title}`}
        onOpenDoubtSection={() => {
          const el = document.getElementById('doubt-solver-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onQuickDoubtSubmit={(q, img) => handleSolveDoubt(q, true, img)}
      />

      {/* Cookie Consent Banner */}
      <CookieConsentBanner />

      {/* Legal Footer */}
      <LegalFooter />
    </div>
  );
}
