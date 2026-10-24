'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  BookOpen, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  User, 
  Star, 
  FileCheck, 
  Timer, 
  BookText, 
  Download,
  CheckCircle2,
  Check
} from 'lucide-react';

import { SubjectId } from '@/lib/types';
import { CLASS_LEVELS, SUBJECTS } from '@/lib/mockData';
import { 
  getNcertBookCode, 
  getNcertChapters, 
  getLocalNcertPdfUrl,
  NcertChapterDetail
} from '@/lib/ncertData';
import DivyaVaniLogo from '@/components/layout/DivyaVaniLogo';
import MathRenderer from '@/components/solver/MathRenderer';
import CookieConsentBanner from '@/components/legal/CookieConsentBanner';
import LegalFooter from '@/components/layout/LegalFooter';

export type ActiveStudyModule = 
  | 'HUB' 
  | 'IMPORTANT_QS' 
  | 'REVISION_SHEET' 
  | 'CHAPTER_TEST' 
  | 'NCERT_BOOKS' 
  | 'CHAPTER_NOTES' 
  | 'BRIEF_SUMMARY';

interface LearnWorkspaceClientProps {
  readonly routeParams?: { readonly class: string; readonly subject: string };
  readonly initialModule?: ActiveStudyModule;
}

interface TestAttempt {
  id: number;
  chapterNumber: number;
  score: number;
  total: number;
  date: string;
}

// Inline LaTeX Text Parser & Renderer
function RenderLatexText({ text, className = '' }: { readonly text: string; readonly className?: string }) {
  if (!text || !text.includes('$')) {
    return <span className={className}>{text}</span>;
  }
  const parts = text.split('$');
  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (i % 2 === 1) {
          return <MathRenderer key={`latex-${i}-${part.slice(0, 10)}`} math={part} className="mx-1 font-semibold text-zinc-900" />;
        }
        return <span key={`txt-${i}-${part.slice(0, 10)}`}>{part}</span>;
      })}
    </span>
  );
}

export default function LearnWorkspaceClient({ routeParams, initialModule = 'HUB' }: LearnWorkspaceClientProps) {
  const router = useRouter();

  const currentClass = (routeParams?.class || 'class-9').toLowerCase();
  const currentSubject = (routeParams?.subject || 'science').toLowerCase() as SubjectId;

  // Active Hub State: 'HUB' or one of the 6 core study modules
  const [activeModule, setActiveModule] = useState<ActiveStudyModule>(initialModule);

  // Memoize chapters to avoid new array reference on every render
  const chapters = useMemo(() => getNcertChapters(currentClass, currentSubject), [currentClass, currentSubject]);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(0);
  const activeChapter: NcertChapterDetail = chapters[selectedChapterIndex] || chapters[0];

  // User Profile
  const [userName, setUserName] = useState<string>('Student');

  // Bookmarks & Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // ==================== Module 1: Important Qs State ====================
  const [qsDifficultyFilter, setQsDifficultyFilter] = useState<'ALL' | 'EASY' | 'MEDIUM' | 'HARD'>('ALL');
  const [expandedSolutions, setExpandedSolutions] = useState<Record<string, boolean>>({});

  // ==================== Module 2: Revision Sheet State ====================
  const [expandedPractice, setExpandedPractice] = useState<Record<string, boolean>>({});

  // ==================== Module 3: Chapter Test State ====================
  const [isTestRunning, setIsTestRunning] = useState<boolean>(false);
  const [testChoices, setTestChoices] = useState<Record<string, number>>({});
  const [isTestSubmitted, setIsTestSubmitted] = useState<boolean>(false);
  const [testScore, setTestScore] = useState<number>(0);
  const [previousAttempts, setPreviousAttempts] = useState<TestAttempt[]>([]);

  // ==================== Module 4: NCERT Books Reader State ====================
  const [readerMode, setReaderMode] = useState<'LOCAL_PDF' | 'INTERACTIVE'>('LOCAL_PDF');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const readerContainerRef = useRef<HTMLDivElement>(null);

  // Load saved state from localStorage & URL
  useEffect(() => {
    try {
      const stored = localStorage.getItem('divyavani_ncert_v4');
      if (stored) {
        const state = JSON.parse(stored);
        if (state.userName) setUserName(state.userName);
      }
      const savedAttempts = localStorage.getItem('divyavani_test_attempts');
      if (savedAttempts) {
        setPreviousAttempts(JSON.parse(savedAttempts));
      } else {
        // Initial clean placeholder attempt for design parity
        setPreviousAttempts([
          { id: 1, chapterNumber: 1, score: 8, total: 10, date: '20 Oct 2025' }
        ]);
      }
    } catch {
      // ignore
    }

    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const modParam = urlParams.get('module');
      if (modParam && ['HUB', 'IMPORTANT_QS', 'REVISION_SHEET', 'CHAPTER_TEST', 'NCERT_BOOKS', 'CHAPTER_NOTES', 'BRIEF_SUMMARY'].includes(modParam)) {
        setActiveModule(modParam as ActiveStudyModule);
      }
      const chParam = urlParams.get('ch');
      if (chParam) {
        const chNum = parseInt(chParam, 10);
        const idx = chapters.findIndex((c) => c.number === chNum);
        if (idx !== -1) setSelectedChapterIndex(idx);
      }
    }
  }, [currentClass, currentSubject]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const bookCode = getNcertBookCode(currentClass, currentSubject);
  const localPdfUrl = getLocalNcertPdfUrl(currentClass, currentSubject, bookCode, activeChapter?.number || 1);

  // Submit Chapter Test
  const handleSubmitTest = () => {
    let score = 0;
    activeChapter.toughTest.forEach((q) => {
      if (testChoices[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    setTestScore(score);
    setIsTestSubmitted(true);
    setIsTestRunning(false);

    const newAttempt: TestAttempt = {
      id: Date.now(),
      chapterNumber: activeChapter.number,
      score,
      total: activeChapter.toughTest.length,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    const updated = [newAttempt, ...previousAttempts.filter((a) => a.id !== newAttempt.id)];
    setPreviousAttempts(updated);
    try {
      localStorage.setItem('divyavani_test_attempts', JSON.stringify(updated));
    } catch {
      // ignore
    }

    showToast(`Test Submitted! You scored ${score} / ${activeChapter.toughTest.length}`);
  };

  // Retake Chapter Test
  const handleRetakeTest = () => {
    setTestChoices({});
    setIsTestSubmitted(false);
    setIsTestRunning(true);
    setTestScore(0);
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-zinc-950 text-white px-4 py-2.5 rounded-xl font-semibold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          UNIVERSAL TOP NAVIGATION BAR (STICKY)
          ========================================================================= */}
      <header className="bg-white border-b border-zinc-200 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30">
        
        {/* Left: Brand Logo + Typography */}
        <button
          type="button"
          onClick={() => setActiveModule('HUB')}
          className="flex items-center gap-2 text-left hover:opacity-85 transition"
        >
          <DivyaVaniLogo size="sm" showSubtitle={false} />
        </button>

        {/* Right Controls: Class Pill, Subject Pill, Back to Selection, User Avatar */}
        <div className="flex items-center gap-2.5 flex-wrap">
          
          {/* Class Pill Dropdown */}
          <select
            aria-label="Select Class"
            value={currentClass}
            onChange={(e) => {
              const newClass = e.target.value;
              router.push(`/learn/${newClass}/${currentSubject}?module=HUB`);
            }}
            className="rounded-xl border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-800 outline-none hover:border-zinc-400 focus:border-zinc-900 transition cursor-pointer"
          >
            {CLASS_LEVELS.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Subject Pill Dropdown */}
          <select
            aria-label="Select Subject"
            value={currentSubject}
            onChange={(e) => {
              const newSub = e.target.value;
              router.push(`/learn/${currentClass}/${newSub}?module=HUB`);
            }}
            className="rounded-xl border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-800 outline-none hover:border-zinc-400 focus:border-zinc-900 transition cursor-pointer"
          >
            {SUBJECTS.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          {/* Back to Selection Button */}
          <Link
            href="/select-class"
            className="rounded-xl border border-zinc-200 bg-white hover:bg-zinc-100 px-3.5 py-1.5 text-xs font-medium text-zinc-800 flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
            <span className="hidden sm:inline">Back to selection</span>
            <span className="sm:hidden">Back</span>
          </Link>

          {/* User Avatar Circle */}
          <Link
            href="/login"
            className="w-8 h-8 rounded-full bg-zinc-950 text-white flex items-center justify-center hover:bg-zinc-800 transition shadow-sm"
            title={userName}
          >
            <User className="w-4 h-4" />
          </Link>

        </div>
      </header>

      {/* =========================================================================
          SCREEN 3: MAIN HUB VIEW (activeModule === 'HUB')
          ========================================================================= */}
      {activeModule === 'HUB' && (
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-65px)] bg-white">
          
          {/* Left Column (Chapters Sidebar) */}
          <aside className="lg:col-span-4 xl:col-span-3 border-r border-zinc-200 p-5 bg-white">
            <h2 className="text-base font-bold text-zinc-900 mb-3 px-2">Chapters</h2>
            <div className="space-y-1">
              {chapters.map((ch, idx) => {
                const isActive = selectedChapterIndex === idx;
                return (
                  <button
                    key={ch.number}
                    type="button"
                    onClick={() => {
                      setSelectedChapterIndex(idx);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left text-sm px-4 py-2.5 rounded-xl flex items-center justify-between transition ${
                      isActive
                        ? 'bg-zinc-950 text-white font-semibold shadow-sm'
                        : 'text-zinc-700 hover:bg-zinc-100 border-b border-zinc-100 last:border-0'
                    }`}
                  >
                    <span className="truncate pr-2">{ch.number}. {ch.title}</span>
                    <ChevronRight className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Right Column (Banner + 6 Module Cards) */}
          <main className="lg:col-span-8 xl:col-span-9 p-5 sm:p-8 bg-white space-y-7">
            
            {/* Top Featured Chapter Banner */}
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex-1">
                <span className="inline-block bg-zinc-200/80 text-zinc-700 text-xs font-medium px-3 py-1 rounded-full">
                  Currently Open
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 mt-3">
                  {activeChapter.number}. {activeChapter.title}
                </h1>
                <p className="text-sm text-zinc-600 mt-1.5 max-w-lg leading-relaxed">
                  {activeChapter.briefSummary.synopsis}
                </p>
              </div>

              {/* Decorative Monochrome Graphic */}
              <div className="hidden sm:flex items-center justify-center w-28 h-28 bg-white rounded-2xl border border-zinc-200 shadow-sm flex-shrink-0 select-none">
                <svg viewBox="0 0 100 100" className="w-20 h-20 text-zinc-900" fill="none">
                  <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
                  <text x="30" y="42" fontSize="22" fontFamily="serif" fontWeight="bold" fill="currentColor">1</text>
                  <text x="56" y="56" fontSize="28" fontFamily="serif" fontWeight="bold" fill="currentColor">2</text>
                  <text x="34" y="74" fontSize="20" fontFamily="serif" fontWeight="bold" fill="currentColor">3</text>
                  <line x1="22" y1="22" x2="28" y2="28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="78" y1="22" x2="72" y2="28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="50" y1="12" x2="50" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Explore More Grid */}
            <div className="space-y-3">
              <h2 className="text-base font-bold text-zinc-900">Explore More</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                
                {/* 1. Most Important Questions */}
                <div
                  onClick={() => setActiveModule('IMPORTANT_QS')}
                  className="bg-white border border-zinc-200 hover:border-zinc-900 rounded-2xl p-6 text-center flex flex-col items-center justify-center cursor-pointer transition shadow-sm hover:shadow-md group"
                >
                  <div className="w-11 h-11 rounded-xl bg-zinc-950 text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-sm text-zinc-900">Most Important Questions</h3>
                  <p className="text-xs text-zinc-500 mt-1">Hard questions included</p>
                </div>

                {/* 2. Revision Sheet */}
                <div
                  onClick={() => setActiveModule('REVISION_SHEET')}
                  className="bg-white border border-zinc-200 hover:border-zinc-900 rounded-2xl p-6 text-center flex flex-col items-center justify-center cursor-pointer transition shadow-sm hover:shadow-md group"
                >
                  <div className="w-11 h-11 rounded-xl bg-zinc-950 text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <FileCheck className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-sm text-zinc-900">Revision Sheet</h3>
                  <p className="text-xs text-zinc-500 mt-1">Quick &amp; complete revision</p>
                </div>

                {/* 3. Test */}
                <div
                  onClick={() => setActiveModule('CHAPTER_TEST')}
                  className="bg-white border border-zinc-200 hover:border-zinc-900 rounded-2xl p-6 text-center flex flex-col items-center justify-center cursor-pointer transition shadow-sm hover:shadow-md group"
                >
                  <div className="w-11 h-11 rounded-xl bg-zinc-950 text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Timer className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-sm text-zinc-900">Test</h3>
                  <p className="text-xs text-zinc-500 mt-1">Check your understanding</p>
                </div>

                {/* 4. NCERT Book Reader */}
                <div
                  onClick={() => setActiveModule('NCERT_BOOKS')}
                  className="bg-white border border-zinc-200 hover:border-zinc-900 rounded-2xl p-6 text-center flex flex-col items-center justify-center cursor-pointer transition shadow-sm hover:shadow-md group"
                >
                  <div className="w-11 h-11 rounded-xl bg-zinc-950 text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-sm text-zinc-900">NCERT Book Reader</h3>
                  <p className="text-xs text-zinc-500 mt-1">Read online</p>
                </div>

                {/* 5. Notes */}
                <div
                  onClick={() => setActiveModule('CHAPTER_NOTES')}
                  className="bg-white border border-zinc-200 hover:border-zinc-900 rounded-2xl p-6 text-center flex flex-col items-center justify-center cursor-pointer transition shadow-sm hover:shadow-md group"
                >
                  <div className="w-11 h-11 rounded-xl bg-zinc-950 text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <BookText className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-sm text-zinc-900">Notes</h3>
                  <p className="text-xs text-zinc-500 mt-1">Short &amp; clear notes</p>
                </div>

                {/* 6. Summary */}
                <div
                  onClick={() => setActiveModule('BRIEF_SUMMARY')}
                  className="bg-white border border-zinc-200 hover:border-zinc-900 rounded-2xl p-6 text-center flex flex-col items-center justify-center cursor-pointer transition shadow-sm hover:shadow-md group"
                >
                  <div className="w-11 h-11 rounded-xl bg-zinc-950 text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-sm text-zinc-900">Summary</h3>
                  <p className="text-xs text-zinc-500 mt-1">Key points at a glance</p>
                </div>

              </div>
            </div>

          </main>

        </div>
      )}

      {/* =========================================================================
          SCREEN 4: MOST IMPORTANT QUESTIONS (activeModule === 'IMPORTANT_QS')
          ========================================================================= */}
      {activeModule === 'IMPORTANT_QS' && (
        <main className="max-w-4xl mx-auto w-full p-4 sm:p-8 bg-white min-h-[calc(100vh-65px)] flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <button 
                type="button" 
                onClick={() => setActiveModule('HUB')} 
                className="flex items-center gap-2 text-zinc-900 font-bold text-lg hover:text-zinc-600 transition"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Most Important Questions</span>
              </button>
              <span className="text-xs text-zinc-500 font-medium">Ch {activeChapter.number}: {activeChapter.title}</span>
            </div>

            {/* Difficulty Filter Pill Bar */}
            <div className="flex items-center gap-2 my-4">
              {(['ALL', 'EASY', 'MEDIUM', 'HARD'] as const).map((lvl) => {
                const isActive = qsDifficultyFilter === lvl;
                const label = lvl === 'ALL' ? 'All' : lvl.charAt(0) + lvl.slice(1).toLowerCase();
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setQsDifficultyFilter(lvl)}
                    className={`rounded-full px-5 py-1.5 text-xs font-semibold transition ${
                      isActive
                        ? 'bg-zinc-950 text-white shadow-sm'
                        : 'bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-400'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Questions List */}
            <div className="space-y-3.5 mt-4">
              {[
                ...activeChapter.mostImportantQuestions.intext,
                ...activeChapter.mostImportantQuestions.exercise
              ]
                .filter((_, idx) => {
                  if (qsDifficultyFilter === 'ALL') return true;
                  const diff = idx % 3 === 0 ? 'HARD' : idx % 3 === 1 ? 'MEDIUM' : 'EASY';
                  return diff === qsDifficultyFilter;
                })
                .map((q, idx) => {
                  const isExpanded = !!expandedSolutions[q.id];
                  const diffLabel = idx % 3 === 0 ? 'Hard' : idx % 3 === 1 ? 'Medium' : 'Easy';
                  return (
                    <div
                      key={q.id}
                      onClick={() => setExpandedSolutions((prev) => ({ ...prev, [q.id]: !prev[q.id] }))}
                      className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5 hover:border-zinc-400 transition cursor-pointer shadow-sm space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <span className="font-bold text-sm text-zinc-900 mr-2">Q{idx + 1}.</span>
                          <span className="text-sm text-zinc-800 leading-relaxed font-medium">
                            <RenderLatexText text={q.question} />
                          </span>
                        </div>
                        <span className="text-zinc-400 text-sm leading-none flex-shrink-0 pt-0.5">
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-700" /> : <ChevronRight className="w-4 h-4" />}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="bg-zinc-100 text-zinc-600 text-xs px-2.5 py-0.5 rounded-md font-medium">
                          {diffLabel}
                        </span>
                        <span className="text-[11px] text-zinc-400 font-mono">
                          {q.type === 'INTEXT' ? 'Intext Question' : 'Exercise Question'}
                        </span>
                      </div>

                      {isExpanded && (
                        <div className="pt-3 border-t border-zinc-100 text-xs sm:text-sm text-zinc-700 bg-zinc-50/70 p-4 rounded-xl space-y-2">
                          <div className="font-bold text-zinc-900 text-xs uppercase tracking-wide">Verified Solution:</div>
                          <div className="whitespace-pre-line leading-relaxed">
                            <RenderLatexText text={q.solution} />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Bottom Button */}
          <button
            type="button"
            onClick={() => showToast('All NCERT verified exercises loaded for this chapter.')}
            className="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-semibold py-3.5 rounded-xl transition mt-6 text-center shadow-sm"
          >
            More Questions &rarr;
          </button>
        </main>
      )}

      {/* =========================================================================
          SCREEN 5: REVISION SHEET (activeModule === 'REVISION_SHEET')
          ========================================================================= */}
      {activeModule === 'REVISION_SHEET' && (
        <main className="max-w-4xl mx-auto w-full p-4 sm:p-8 bg-white min-h-[calc(100vh-65px)] flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <button 
                type="button" 
                onClick={() => setActiveModule('HUB')} 
                className="flex items-center gap-2 text-zinc-900 font-bold text-lg hover:text-zinc-600 transition"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Revision Sheet</span>
              </button>
              <span className="text-xs text-zinc-500 font-medium">Ch {activeChapter.number}: {activeChapter.title}</span>
            </div>

            {/* Main Card */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 space-y-5 my-4 shadow-sm">
              
              {/* Key Points */}
              <div>
                <h3 className="text-base font-bold text-zinc-900 mb-3">Key Points</h3>
                <ul className="space-y-2.5 text-sm text-zinc-700 leading-relaxed">
                  {activeChapter.chapterNotes.revisionBullets.slice(0, 5).map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-zinc-900 font-bold">&bull;</span>
                      <span><RenderLatexText text={bullet} /></span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Divider */}
              <div className="border-t border-zinc-200 my-4" />

              {/* Quick Recap */}
              <div>
                <h3 className="text-base font-bold text-zinc-900 mb-3">Quick Recap</h3>
                
                {/* Soft gray example box */}
                <div className="bg-zinc-100/80 rounded-xl p-4 text-sm text-zinc-800 space-y-2 mb-4">
                  <div className="font-bold text-xs uppercase tracking-wide text-zinc-600">Core Principle / Example:</div>
                  <p className="leading-relaxed">
                    <RenderLatexText text={activeChapter.briefSummary.synopsis} />
                  </p>
                </div>

                {/* Interactive practice questions with expandable answers */}
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-zinc-500">Practice Checkpoint:</div>
                  {activeChapter.revisionSheet.subjective.slice(0, 3).map((sub, idx) => {
                    const isExpanded = !!expandedPractice[sub.id];
                    return (
                      <div key={sub.id} className="border border-zinc-200 rounded-xl p-3.5 bg-white">
                        <button
                          type="button"
                          onClick={() => setExpandedPractice((prev) => ({ ...prev, [sub.id]: !prev[sub.id] }))}
                          className="w-full flex items-center justify-between text-left font-semibold text-xs text-zinc-900 gap-2"
                        >
                          <span>Q{idx + 1}. {sub.question}</span>
                          <span className="text-zinc-400 text-xs">{isExpanded ? '▲' : '▼'}</span>
                        </button>
                        {isExpanded && (
                          <p className="mt-2 text-xs text-zinc-600 bg-zinc-50 p-2.5 rounded-lg border border-zinc-100 leading-relaxed">
                            <RenderLatexText text={sub.answer} />
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>

            </div>
          </div>

          {/* Bottom Button */}
          <button
            type="button"
            onClick={() => {
              window.print();
              showToast('Opening revision sheet print dialog...');
            }}
            className="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition mt-4 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>&darr; Download PDF</span>
          </button>
        </main>
      )}

      {/* =========================================================================
          SCREEN 6: CHAPTER TEST (activeModule === 'CHAPTER_TEST')
          ========================================================================= */}
      {activeModule === 'CHAPTER_TEST' && (
        <main className="max-w-4xl mx-auto w-full p-4 sm:p-8 bg-white min-h-[calc(100vh-65px)] flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <button 
                type="button" 
                onClick={() => setActiveModule('HUB')} 
                className="flex items-center gap-2 text-zinc-900 font-bold text-lg hover:text-zinc-600 transition"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Test</span>
              </button>
              <span className="text-xs text-zinc-500 font-medium">Ch {activeChapter.number}: {activeChapter.title}</span>
            </div>

            {/* Initial Test Card (when not currently running) */}
            {!isTestRunning && !isTestSubmitted && (
              <>
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-4 mt-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-zinc-950 text-white flex items-center justify-center">
                      <Timer className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-zinc-900">Chapter {activeChapter.number}: {activeChapter.title}</h3>
                      <p className="text-xs text-zinc-500 mt-0.5">10 Questions &bull; 15 Minutes</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsTestRunning(true);
                      setIsTestSubmitted(false);
                      setTestChoices({});
                    }}
                    className="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition shadow-sm"
                  >
                    <span>Start Test &rarr;</span>
                  </button>
                </div>

                {/* Previous Attempts Section */}
                <div className="mt-8">
                  <h4 className="text-sm font-bold text-zinc-900 mb-3">Previous Attempts</h4>
                  {previousAttempts.length === 0 ? (
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-4 text-center text-xs text-zinc-500">
                      No previous attempts yet. Click &quot;Start Test&quot; above to take your first test!
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {previousAttempts.map((att, i) => (
                        <div
                          key={att.id || i}
                          onClick={() => showToast(`Reviewing score for Attempt ${i + 1}: ${att.score}/${att.total}`)}
                          className="rounded-2xl border border-zinc-200 bg-white p-4 flex items-center justify-between cursor-pointer hover:border-zinc-400 transition shadow-sm"
                        >
                          <div>
                            <div className="font-bold text-sm text-zinc-900">Attempt {i + 1}</div>
                            <div className="text-xs text-zinc-500 mt-0.5">Date: {att.date}</div>
                          </div>
                          <div className="font-bold text-sm text-zinc-900 flex items-center gap-1">
                            <span>{att.score}/{att.total || 10}</span>
                            <ChevronRight className="w-4 h-4 text-zinc-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Test Runner (when test is running) */}
            {isTestRunning && (
              <div className="space-y-6 mt-4">
                <div className="flex items-center justify-between bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                  <span className="text-xs font-bold text-zinc-700">
                    Questions: {Object.keys(testChoices).length} / {activeChapter.toughTest.length} Answered
                  </span>
                  <button
                    type="button"
                    onClick={handleSubmitTest}
                    className="px-4 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs transition"
                  >
                    Submit Test &rarr;
                  </button>
                </div>

                <div className="space-y-5">
                  {activeChapter.toughTest.map((q, idx) => (
                    <div key={q.id} className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-3 shadow-sm">
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-sm text-zinc-900">Q{idx + 1}.</span>
                        <div className="text-sm text-zinc-800 font-medium leading-relaxed">
                          <RenderLatexText text={q.question} />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2 pt-2">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = testChoices[q.id] === optIdx;
                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => setTestChoices((prev) => ({ ...prev, [q.id]: optIdx }))}
                              className={`text-left p-3 rounded-xl border text-xs font-medium flex items-center gap-3 transition ${
                                isSelected
                                  ? 'border-zinc-900 bg-zinc-950 text-white shadow-sm'
                                  : 'border-zinc-200 hover:bg-zinc-50 text-zinc-800'
                              }`}
                            >
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                                isSelected ? 'border-white text-white' : 'border-zinc-300 text-zinc-500'
                              }`}>
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span className="flex-1"><RenderLatexText text={opt} /></span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleSubmitTest}
                  className="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-semibold py-3.5 rounded-xl transition text-center shadow-sm"
                >
                  Submit Test &rarr;
                </button>
              </div>
            )}

            {/* Test Result View (when test is submitted) */}
            {isTestSubmitted && (
              <div className="space-y-6 mt-4">
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-6 text-center space-y-2">
                  <div className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Your Scorecard</div>
                  <div className="text-3xl font-extrabold text-zinc-950">
                    {testScore} / {activeChapter.toughTest.length}
                  </div>
                  <p className="text-xs text-zinc-600">
                    {testScore >= 8 ? 'Outstanding score! Keep up the brilliant work.' : 'Good effort! Review the verified explanations below.'}
                  </p>
                  <div className="pt-2 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleRetakeTest}
                      className="px-4 py-2 rounded-xl bg-zinc-950 text-white font-semibold text-xs hover:bg-zinc-800 transition"
                    >
                      Take Again &rarr;
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveModule('HUB')}
                      className="px-4 py-2 rounded-xl border border-zinc-200 bg-white text-zinc-800 font-semibold text-xs hover:bg-zinc-100 transition"
                    >
                      Back to Hub
                    </button>
                  </div>
                </div>

                {/* Question review */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-zinc-900">Answers &amp; Explanations</h4>
                  {activeChapter.toughTest.map((q, idx) => {
                    const userPick = testChoices[q.id];
                    const isCorrect = userPick === q.correctIndex;
                    return (
                      <div key={q.id} className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-bold text-sm text-zinc-900">Q{idx + 1}. {q.question}</div>
                          <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                            isCorrect ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-100 text-zinc-600'
                          }`}>
                            {isCorrect ? '✓ Correct' : '✕ Incorrect'}
                          </span>
                        </div>

                        <div className="text-xs space-y-1">
                          <div className="text-zinc-600">
                            Your answer: <span className="font-semibold">{userPick !== undefined ? q.options[userPick] : 'Not answered'}</span>
                          </div>
                          <div className="text-zinc-900 font-semibold">
                            Correct answer: {q.options[q.correctIndex]}
                          </div>
                        </div>

                        <div className="text-xs text-zinc-600 bg-zinc-50 p-3 rounded-xl border border-zinc-100 leading-relaxed">
                          <span className="font-bold text-zinc-900 block mb-0.5">Explanation:</span>
                          <RenderLatexText text={q.explanation} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          <div />
        </main>
      )}

      {/* =========================================================================
          SCREEN 7: NCERT BOOK READER (activeModule === 'NCERT_BOOKS')
          ========================================================================= */}
      {activeModule === 'NCERT_BOOKS' && (
        <main className="max-w-5xl mx-auto w-full p-4 sm:p-8 bg-white min-h-[calc(100vh-65px)] flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-100">
              <button 
                type="button" 
                onClick={() => setActiveModule('HUB')} 
                className="flex items-center gap-2 text-zinc-900 font-bold text-lg hover:text-zinc-600 transition"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>NCERT Book Reader</span>
              </button>
              
              <div className="flex items-center gap-2">
                {/* Mode toggle */}
                <div className="flex items-center bg-zinc-100 rounded-lg p-0.5 border border-zinc-200 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setReaderMode('LOCAL_PDF')}
                    className={`px-3 py-1 rounded-md transition ${
                      readerMode === 'LOCAL_PDF' ? 'bg-white text-zinc-900 shadow-sm font-semibold' : 'text-zinc-600'
                    }`}
                  >
                    📄 Official Chapter PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => setReaderMode('INTERACTIVE')}
                    className={`px-3 py-1 rounded-md transition ${
                      readerMode === 'INTERACTIVE' ? 'bg-white text-zinc-900 shadow-sm font-semibold' : 'text-zinc-600'
                    }`}
                  >
                    📖 Textbook Page View
                  </button>
                </div>

                <a
                  href={localPdfUrl}
                  download={`ncert-${currentClass}-${currentSubject}-ch${String(activeChapter.number).padStart(2, '0')}.pdf`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-xs font-semibold text-zinc-900 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download PDF</span>
                </a>
              </div>
            </div>

            {/* Chapter Dropdown Selector */}
            <div className="my-3">
              <select
                aria-label="Select Chapter to Read"
                value={selectedChapterIndex}
                onChange={(e) => {
                  setSelectedChapterIndex(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 focus:outline-none focus:border-zinc-900 shadow-sm cursor-pointer"
              >
                {chapters.map((ch, idx) => (
                  <option key={ch.number} value={idx}>
                    Chapter {ch.number}: {ch.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Book Viewport with Curved Black Banner */}
            <div ref={readerContainerRef} className="rounded-2xl border border-zinc-300 bg-[#FAF9F6] shadow-inner overflow-hidden flex-1 flex flex-col my-2">
              
              {/* Curved Black Chapter Header Banner */}
              <div className="bg-zinc-900 text-white py-5 px-6 text-center rounded-b-[32px] shadow-sm select-none">
                <div className="text-xs uppercase tracking-widest text-zinc-400 font-medium">
                  {activeChapter.number}
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
                  {activeChapter.title}
                </h2>
                {activeChapter.hindiTitle && (
                  <div className="text-xs text-zinc-300 font-devanagari mt-0.5">
                    {activeChapter.hindiTitle}
                  </div>
                )}
              </div>

              {/* PDF View or Interactive Reader */}
              {readerMode === 'LOCAL_PDF' ? (
                <div className="w-full h-[680px] bg-white flex flex-col items-center justify-center relative">
                  <iframe
                    src={`${localPdfUrl}#page=${currentPage}&view=FitH`}
                    title={`NCERT Book - ${activeChapter.title}`}
                    className="w-full h-full border-0"
                  />
                </div>
              ) : (
                <div className="p-6 sm:p-10 max-w-3xl mx-auto space-y-4">
                  {(() => {
                    const pageIndex = Math.min(Math.max(1, currentPage), activeChapter.pages.length) - 1;
                    const page = activeChapter.pages[pageIndex] || activeChapter.pages[0];
                    return (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 text-xs text-zinc-500 font-medium">
                          <span>Section {page.pageNumber}</span>
                          <span>Page {page.pageNumber} of {activeChapter.pages.length}</span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-zinc-900">
                          {page.sectionTitle}
                        </h3>
                        <div className="text-sm leading-relaxed whitespace-pre-line text-zinc-800 space-y-3">
                          <RenderLatexText text={page.content} />
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

            </div>

            {/* Bottom Pagination Bar */}
            <div className="flex items-center justify-center gap-4 py-3 mt-2 border-t border-zinc-200">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="w-8 h-8 rounded-full border border-zinc-200 bg-white hover:bg-zinc-100 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-zinc-800 transition shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold text-zinc-800">
                {currentPage} / {readerMode === 'LOCAL_PDF' ? 20 : (activeChapter.pages?.length || 6)}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(readerMode === 'LOCAL_PDF' ? 20 : (activeChapter.pages?.length || 6), p + 1))}
                disabled={currentPage >= (readerMode === 'LOCAL_PDF' ? 20 : (activeChapter.pages?.length || 6))}
                className="w-8 h-8 rounded-full border border-zinc-200 bg-white hover:bg-zinc-100 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-zinc-800 transition shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          <div />
        </main>
      )}

      {/* =========================================================================
          SCREEN 8: NOTES (activeModule === 'CHAPTER_NOTES')
          ========================================================================= */}
      {activeModule === 'CHAPTER_NOTES' && (
        <main className="max-w-4xl mx-auto w-full p-4 sm:p-8 bg-white min-h-[calc(100vh-65px)] flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <button 
                type="button" 
                onClick={() => setActiveModule('HUB')} 
                className="flex items-center gap-2 text-zinc-900 font-bold text-lg hover:text-zinc-600 transition"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Notes</span>
              </button>
              <span className="text-xs text-zinc-500 font-medium">Ch {activeChapter.number}: {activeChapter.title}</span>
            </div>

            {/* Main Notes Card */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 space-y-5 my-4 shadow-sm">
              <h3 className="text-lg font-bold text-zinc-900">
                Chapter {activeChapter.number}: {activeChapter.title}
              </h3>

              {/* Clean bulleted notes with bold key terms */}
              <div className="space-y-4">
                
                {/* 1. Key Definitions */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Key Concepts &amp; Definitions</h4>
                  <ul className="space-y-2 text-sm text-zinc-700">
                    {activeChapter.chapterNotes.keyDefinitions.map((def) => (
                      <li key={def.term} className="leading-relaxed">
                        <span className="font-bold text-zinc-950">&bull; {def.term}: </span>
                        <span><RenderLatexText text={def.definition} /></span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-zinc-100" />

                {/* 2. Core Revision Bullets */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Summary Points</h4>
                  <ul className="space-y-2 text-sm text-zinc-700">
                    {activeChapter.chapterNotes.revisionBullets.map((bullet, idx) => (
                      <li key={idx} className="leading-relaxed">
                        <span className="font-bold text-zinc-950">&bull; </span>
                        <span><RenderLatexText text={bullet} /></span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3. Formulas or Highlights (if any) */}
                {activeChapter.chapterNotes.formulaTable.length > 0 && (
                  <>
                    <div className="border-t border-zinc-100" />
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Formulas &amp; Rules</h4>
                      <ul className="space-y-2 text-sm text-zinc-700">
                        {activeChapter.chapterNotes.formulaTable.map((f) => (
                          <li key={f.name} className="leading-relaxed">
                            <span className="font-bold text-zinc-950">&bull; {f.name}: </span>
                            <span className="font-mono font-medium"><MathRenderer math={f.formula} /></span>
                            {f.notes && <span className="text-xs text-zinc-500 ml-2">({f.notes})</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

              </div>
            </div>
          </div>

          {/* Bottom Button */}
          <button
            type="button"
            onClick={() => {
              window.print();
              showToast('Opening notes print / export dialog...');
            }}
            className="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition mt-4 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>&darr; Download Notes</span>
          </button>
        </main>
      )}

      {/* =========================================================================
          SCREEN 9: SUMMARY (activeModule === 'BRIEF_SUMMARY')
          ========================================================================= */}
      {activeModule === 'BRIEF_SUMMARY' && (
        <main className="max-w-4xl mx-auto w-full p-4 sm:p-8 bg-white min-h-[calc(100vh-65px)] flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <button 
                type="button" 
                onClick={() => setActiveModule('HUB')} 
                className="flex items-center gap-2 text-zinc-900 font-bold text-lg hover:text-zinc-600 transition"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Summary</span>
              </button>
              <span className="text-xs text-zinc-500 font-medium">Ch {activeChapter.number}: {activeChapter.title}</span>
            </div>

            {/* Chapter Heading */}
            <h3 className="text-base font-bold text-zinc-900 mt-4">
              Chapter {activeChapter.number}: {activeChapter.title}
            </h3>

            {/* Soft Gray Summary Box */}
            <div className="rounded-2xl bg-zinc-100/80 border border-zinc-200/80 p-5 sm:p-6 space-y-3.5 my-4 shadow-sm">
              <h4 className="text-sm font-bold text-zinc-900">Key Takeaways</h4>
              <ul className="space-y-2 text-sm text-zinc-700 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-zinc-900 font-bold">&bull;</span>
                  <span><RenderLatexText text={activeChapter.briefSummary.synopsis} /></span>
                </li>
                {activeChapter.briefSummary.coreTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-zinc-900 font-bold">&bull;</span>
                    <span><RenderLatexText text={takeaway} /></span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Button */}
          <button
            type="button"
            onClick={() => setActiveModule('HUB')}
            className="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition mt-4 shadow-sm"
          >
            <Check className="w-4 h-4" />
            <span>✓ Done</span>
          </button>
        </main>
      )}

      {/* Footer */}
      <LegalFooter />
      <CookieConsentBanner />

    </div>
  );
}
