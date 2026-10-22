'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  BookOpen, 
  Bookmark, 
  CheckCircle2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  ExternalLink, 
  Trash2, 
  Award,
  ChevronDown,
  ChevronUp,
  Home,
  RotateCw,
  User,
  Star,
  FileCheck,
  Timer,
  BookText,
  Copy,
  Eye,
  EyeOff,
  Download
} from 'lucide-react';

import { SubjectId, BookmarkItem } from '@/lib/types';
import { CLASS_LEVELS, SUBJECTS } from '@/lib/mockData';
import { 
  getNcertBookCode, 
  getNcertChapters, 
  NcertChapterDetail
} from '@/lib/ncertData';
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
          return <MathRenderer key={`latex-${i}-${part.slice(0, 10)}`} math={part} className="mx-1 font-semibold text-royal-light" />;
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

  // Chapters list from NCERT Data
  const chapters = getNcertChapters(currentClass, currentSubject);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(0);
  const activeChapter: NcertChapterDetail = chapters[selectedChapterIndex] || chapters[0];

  // User Profile
  const [userName, setUserName] = useState<string>('Student');

  // Bookmarks & Completion State
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [completedChapters, setCompletedChapters] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showBookmarksModal, setShowBookmarksModal] = useState<boolean>(false);

  // Dropdown states for Class and Subject quick switch
  const [showClassDropdown, setShowClassDropdown] = useState<boolean>(false);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState<boolean>(false);

  // ==================== Module 1: Important Qs State ====================
  const [qsFilter, setQsFilter] = useState<'ALL' | 'INTEXT' | 'EXERCISE'>('ALL');
  const [expandedSolutions, setExpandedSolutions] = useState<Record<string, boolean>>({});
  const [allSolutionsExpanded, setAllSolutionsExpanded] = useState<boolean>(false);

  // ==================== Module 2: Revision Sheet State ====================
  const [revisionTab, setRevisionTab] = useState<'BLANKS' | 'ASSERTION' | 'MCQS' | 'SUBJECTIVE'>('BLANKS');
  const [fillBlankInputs, setFillBlankInputs] = useState<Record<string, string>>({});
  const [fillBlankChecked, setFillBlankChecked] = useState<Record<string, boolean>>({});
  const [fillBlankShowHint, setFillBlankShowHint] = useState<Record<string, boolean>>({});
  const [assertionChoices, setAssertionChoices] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [revisionMcqChoices, setRevisionMcqChoices] = useState<Record<string, number>>({});
  const [expandedSubjective, setExpandedSubjective] = useState<Record<string, boolean>>({});

  // ==================== Module 3: Chapter Test State ====================
  const [testChoices, setTestChoices] = useState<Record<string, number>>({});
  const [isTestSubmitted, setIsTestSubmitted] = useState<boolean>(false);
  const [testScore, setTestScore] = useState<number>(0);

  // ==================== Module 4: NCERT Books Reader State ====================
  const [readerMode, setReaderMode] = useState<'INTERACTIVE' | 'LOCAL_PDF'>('LOCAL_PDF');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [readerFilter, setReaderFilter] = useState<'light' | 'sepia' | 'dark'>('light');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const readerContainerRef = useRef<HTMLDivElement>(null);

  // Load saved state from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('divyavani_ncert_v4');
      if (stored) {
        const state = JSON.parse(stored);
        if (state.userName) setUserName(state.userName);
        if (state.bookmarks) setBookmarks(state.bookmarks);
        if (state.completedChapters) setCompletedChapters(state.completedChapters);
        if (state.readerFilter) setReaderFilter(state.readerFilter);
      }
    } catch {
      // ignore
    }

    // Check URL parameters for module jump if any
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
  }, [chapters]);

  // Persist updates to localStorage
  const persistState = (newBookmarks?: BookmarkItem[], newCompleted?: Record<string, boolean>) => {
    try {
      const stored = localStorage.getItem('divyavani_ncert_v4');
      const existing = stored ? JSON.parse(stored) : {};
      const updated = {
        ...existing,
        userName,
        selectedClass: currentClass,
        selectedSubject: currentSubject,
        selectedChapterIndex,
        currentPage,
        zoomLevel,
        bookmarks: newBookmarks !== undefined ? newBookmarks : bookmarks,
        completedChapters: newCompleted !== undefined ? newCompleted : completedChapters,
      };
      localStorage.setItem('divyavani_ncert_v4', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Toggle Chapter Completion
  const handleToggleCompleteChapter = () => {
    const chapterKey = `${currentClass}|${currentSubject}|${activeChapter.number}`;
    const nextVal = !completedChapters[chapterKey];
    const updated = { ...completedChapters, [chapterKey]: nextVal };
    setCompletedChapters(updated);
    persistState(undefined, updated);
    showToast(nextVal ? `Marked Ch ${activeChapter.number} as Completed! 🎉` : `Ch ${activeChapter.number} marked in-progress`);
  };

  // Bookmark Active Page (in NCERT Books)
  const handleBookmarkPage = () => {
    const key = `${currentClass}|${currentSubject}|${selectedChapterIndex}|${currentPage}`;
    const newBookmark: BookmarkItem = {
      key,
      classLevel: currentClassObj.name,
      subjectCode: currentSubject,
      subjectName: currentSubjectObj.name,
      chapterIndex: selectedChapterIndex,
      chapterNumber: activeChapter.number,
      chapterTitle: activeChapter.title,
      page: currentPage,
      pdfUrl: activeChapter.pdfUrl,
      savedAt: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };

    const filtered = bookmarks.filter((b) => b.key !== key);
    const updated = [newBookmark, ...filtered];
    setBookmarks(updated);
    persistState(updated);
    showToast(`Bookmarked Page ${currentPage} of Ch ${activeChapter.number}`);
  };

  // Remove Bookmark
  const handleDeleteBookmark = (key: string) => {
    const updated = bookmarks.filter((b) => b.key !== key);
    setBookmarks(updated);
    persistState(updated);
    showToast('Bookmark deleted');
  };

  // Jump to Bookmark
  const handleJumpToBookmark = (b: BookmarkItem) => {
    const targetClass = b.classLevel.toLowerCase().replace(/\s+/g, '-');
    const targetSub = b.subjectCode.toLowerCase();

    if (targetClass === currentClass && targetSub === currentSubject) {
      setSelectedChapterIndex(b.chapterIndex);
      setCurrentPage(b.page);
      setActiveModule('NCERT_BOOKS');
      setShowBookmarksModal(false);
    } else {
      router.push(`/learn/${targetClass}/${targetSub}?module=NCERT_BOOKS&ch=${b.chapterNumber}`);
    }
  };

  // Toggle All Solutions in Important Questions
  const handleToggleAllSolutions = () => {
    const nextState = !allSolutionsExpanded;
    setAllSolutionsExpanded(nextState);
    const updated: Record<string, boolean> = {};
    const allQs = [...activeChapter.mostImportantQuestions.intext, ...activeChapter.mostImportantQuestions.exercise];
    allQs.forEach((q) => {
      updated[q.id] = nextState;
    });
    setExpandedSolutions(updated);
  };

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
    showToast(`Test Submitted! You scored ${score} / 10`);
  };

  // Retake Chapter Test
  const handleRetakeTest = () => {
    setTestChoices({});
    setIsTestSubmitted(false);
    setTestScore(0);
    showToast('Test reset. Practice again!');
  };

  // Fullscreen toggle for Reader
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      readerContainerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Copy text helper (safe promise execution)
  const handleCopyNotes = (text: string) => {
    void navigator.clipboard.writeText(text).catch(() => {});
    showToast('Copied to clipboard!');
  };

  const currentClassObj = CLASS_LEVELS.find((c) => c.id === currentClass) || { name: 'Class 9', id: 'class-9', badge: 'IX' };
  const currentSubjectObj = SUBJECTS.find((s) => s.id === currentSubject) || SUBJECTS[0];
  const bookCode = getNcertBookCode(currentClass, currentSubject);
  const isCurrentChapterDone = !!completedChapters[`${currentClass}|${currentSubject}|${activeChapter.number}`];

  // Quick Switch Ribbon Items
  const moduleRibbonItems: Array<{ id: ActiveStudyModule; label: string; icon: any; color: string }> = [
    { id: 'IMPORTANT_QS', label: 'Important Qs', icon: Star, color: 'text-amber' },
    { id: 'REVISION_SHEET', label: 'Revision Sheet', icon: FileCheck, color: 'text-mint' },
    { id: 'CHAPTER_TEST', label: 'Chapter Test', icon: Timer, color: 'text-red-400' },
    { id: 'NCERT_BOOKS', label: 'NCERT Books', icon: BookOpen, color: 'text-blue-400' },
    { id: 'CHAPTER_NOTES', label: 'Notes', icon: BookText, color: 'text-purple-400' },
    { id: 'BRIEF_SUMMARY', label: 'Brief Summary', icon: Sparkles, color: 'text-yellow-300' },
  ];

  return (
    <div className="min-h-screen bg-obsidian text-alabaster flex flex-col selection:bg-royal selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-mint text-obsidian px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-obsidian" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          UNIVERSAL 2-WAY INTERLINK BAR (STICKY TOP NAVBAR)
          ========================================================================= */}
      <header className="bg-alabaster text-obsidian border-b border-structural-light sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2.5">
          
          {/* Brand + Universal Interlinks */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-royal flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4 text-mint" />
              </div>
              <div className="hidden xs:block">
                <span className="font-extrabold text-base tracking-tight text-obsidian">Divyavani</span>
                <span className="ml-1 text-[10px] font-bold uppercase tracking-wider bg-royal/10 text-royal px-1.5 py-0.5 rounded">
                  v5.0
                </span>
              </div>
            </Link>

            {/* Universal Button 1: 🏠 Main Web Hub */}
            <button
              type="button"
              onClick={() => setActiveModule('HUB')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                activeModule === 'HUB'
                  ? 'bg-royal text-white ring-2 ring-royal/30'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200'
              }`}
              title="Return to Stage 3 Main Web Hub"
            >
              <Home className="w-3.5 h-3.5 text-mint" />
              <span>🏠 Main Web Hub</span>
            </button>

            {/* Universal Button 2: 🔄 Change Class / Subject */}
            <Link
              href="/select-class"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 text-xs font-semibold transition-colors"
              title="Return to Stage 2 Class & Subject Selection Gateway"
            >
              <RotateCw className="w-3.5 h-3.5 text-royal" />
              <span className="hidden sm:inline">🔄 Change Class / Subject</span>
              <span className="sm:hidden">🔄 Switch</span>
            </Link>

            {/* Universal Button 3: 👤 Change Name */}
            <Link
              href="/login"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 text-xs font-medium transition-colors"
              title="Return to Stage 1 Login / Name Entry"
            >
              <User className="w-3.5 h-3.5 text-zinc-500" />
              <span>👤 {userName}</span>
            </Link>
          </div>

          {/* Right Controls: Fast Class/Subject Dropdowns & Bookmarks */}
          <div className="flex items-center gap-2">
            
            {/* Quick Switch Class Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => { setShowClassDropdown(!showClassDropdown); setShowSubjectDropdown(false); }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-zinc-800 transition-colors border border-zinc-200"
              >
                <span>{currentClassObj.name}</span>
                <ChevronDown className="w-3 h-3 text-zinc-500" />
              </button>

              {showClassDropdown && (
                <div className="absolute right-0 sm:left-0 top-full mt-1 w-44 bg-white rounded-xl shadow-2xl border border-zinc-200 py-1.5 z-50">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase text-zinc-400">Select Class:</div>
                  {CLASS_LEVELS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setShowClassDropdown(false);
                        try {
                          localStorage.setItem('divyavani_selected_class', c.id);
                        } catch {}
                        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (typeof window !== 'undefined' && window.location.pathname.startsWith('/Divya-Vani') ? '/Divya-Vani' : '');
                        window.location.href = `${basePath}/learn/${c.id}/${currentSubject}?module=${activeModule}`;
                      }}
                      className={`w-full px-3 py-1.5 text-left text-xs font-semibold flex items-center justify-between hover:bg-zinc-100 ${
                        c.id === currentClass ? 'text-royal font-bold bg-royal/5' : 'text-zinc-700'
                      }`}
                    >
                      <span>{c.name}</span>
                      <span className="text-[10px] text-zinc-400">{c.badge}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Switch Subject Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => { setShowSubjectDropdown(!showSubjectDropdown); setShowClassDropdown(false); }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-zinc-800 transition-colors border border-zinc-200"
              >
                <span>{currentSubjectObj.name}</span>
                <ChevronDown className="w-3 h-3 text-zinc-500" />
              </button>

              {showSubjectDropdown && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-2xl border border-zinc-200 py-1.5 z-50">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase text-zinc-400">Select Subject:</div>
                  {SUBJECTS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setShowSubjectDropdown(false);
                        try {
                          localStorage.setItem('divyavani_selected_subject', s.id);
                        } catch {}
                        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (typeof window !== 'undefined' && window.location.pathname.startsWith('/Divya-Vani') ? '/Divya-Vani' : '');
                        window.location.href = `${basePath}/learn/${currentClass}/${s.id}?module=${activeModule}`;
                      }}
                      className={`w-full px-3 py-1.5 text-left text-xs font-semibold flex items-center justify-between hover:bg-zinc-100 ${
                        s.id === currentSubject ? 'text-royal font-bold bg-royal/5' : 'text-zinc-700'
                      }`}
                    >
                      <span>{s.name}</span>
                      <span className="text-[10px] text-zinc-400 font-devanagari">{s.hindiName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bookmarks Drawer Trigger */}
            <button
              type="button"
              onClick={() => setShowBookmarksModal(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber/10 hover:bg-amber/20 text-amber-700 border border-amber/30 text-xs font-bold transition-colors"
              title="View Bookmarks"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber" />
              {bookmarks.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber text-white text-[10px] flex items-center justify-center font-bold">
                  {bookmarks.length}
                </span>
              )}
            </button>

          </div>
        </div>
      </header>

      {/* =========================================================================
          STAGE 4 SUB-HEADER: 6-MODULE QUICK-SWITCH RIBBON & BACK BUTTON
          ========================================================================= */}
      {activeModule !== 'HUB' && (
        <div className="bg-obsidian border-b border-structural-dark px-3 sm:px-6 py-2.5 sticky top-[53px] z-30 shadow-md">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5">
            
            {/* Left: ← Back to Main Web Hub button & Chapter Spotlight */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={() => setActiveModule('HUB')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-royal hover:bg-royal-hover text-white text-xs font-bold transition-all shadow-sm group"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>&larr; Back to Main Web Hub</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-white truncate max-w-[200px] sm:max-w-[280px]">
                  Ch {activeChapter.number}: {activeChapter.title}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                  {bookCode}
                </span>
              </div>
            </div>

            {/* Right: 6-Module Quick-Switch Ribbon */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {moduleRibbonItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveModule(item.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-alabaster text-obsidian font-extrabold shadow-md scale-105'
                        : 'bg-obsidian-surface hover:bg-obsidian-elevated text-zinc-400 hover:text-white border border-structural-dark'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-royal' : item.color}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          STAGE 3: MAIN WEB HUB VIEW
          ========================================================================= */}
      {activeModule === 'HUB' && (
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
          
          {/* Welcome & Context Banner */}
          <div className="bg-obsidian-surface border border-structural-dark rounded-2xl p-6 mb-8 shadow-block-dark">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-royal/20 border border-royal/40 text-royal-light text-xs font-semibold mb-2">
                  <Award className="w-3.5 h-3.5 text-mint" />
                  <span>Stage 3: Central Study Hub</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {currentClassObj.name} &bull; {currentSubjectObj.name} Web Hub
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
                  Welcome, <span className="text-white font-bold">{userName}</span>! Select your active chapter below, then launch any of the 6 core study modules with 100% verified solutions.
                </p>
              </div>

              {/* Quick Class & Subject Dropdowns on Stage 3 */}
              <div className="flex items-center gap-3 flex-wrap">
                <div>
                  <label htmlFor="hubClassSelect" className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Class</label>
                  <select
                    id="hubClassSelect"
                    value={currentClass}
                    onChange={(e) => {
                      const newClass = e.target.value;
                      try {
                        localStorage.setItem('divyavani_selected_class', newClass);
                      } catch {}
                      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (typeof window !== 'undefined' && window.location.pathname.startsWith('/Divya-Vani') ? '/Divya-Vani' : '');
                      window.location.href = `${basePath}/learn/${newClass}/${currentSubject}?module=${activeModule}`;
                    }}
                    className="bg-obsidian-elevated text-white text-xs font-bold px-3 py-2 rounded-xl border border-structural-dark cursor-pointer focus:outline-none focus:border-royal"
                  >
                    {CLASS_LEVELS.map((c) => (
                      <option key={`hub-sel-${c.id}`} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="hubSubjectSelect" className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Subject</label>
                  <select
                    id="hubSubjectSelect"
                    value={currentSubject}
                    onChange={(e) => {
                      const newSubject = e.target.value;
                      try {
                        localStorage.setItem('divyavani_selected_subject', newSubject);
                      } catch {}
                      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (typeof window !== 'undefined' && window.location.pathname.startsWith('/Divya-Vani') ? '/Divya-Vani' : '');
                      window.location.href = `${basePath}/learn/${currentClass}/${newSubject}?module=${activeModule}`;
                    }}
                    className="bg-obsidian-elevated text-white text-xs font-bold px-3 py-2 rounded-xl border border-structural-dark cursor-pointer focus:outline-none focus:border-royal"
                  >
                    {SUBJECTS.map((s) => (
                      <option key={`hub-sel-${s.id}`} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="self-end pt-1">
                  <Link
                    href="/select-class"
                    className="px-3 py-2 rounded-xl bg-royal/20 hover:bg-royal text-royal-light hover:text-white border border-royal/40 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <span>Change Grid &rarr;</span>
                  </Link>
                </div>
              </div>

              {/* Status Metric */}
              <div className="flex items-center gap-3 bg-obsidian-elevated px-4 py-3 rounded-xl border border-structural-dark">
                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase text-zinc-400">Syllabus Progress</div>
                  <div className="text-base font-extrabold text-mint">
                    {Object.keys(completedChapters).filter((k) => k.startsWith(`${currentClass}|${currentSubject}`)).length} / {chapters.length} Done
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-mint/10 border border-mint/30 flex items-center justify-center">
                  <Award className="w-5 h-5 text-mint" />
                </div>
              </div>
            </div>
          </div>

          {/* STEP 1: CHAPTER SELECTOR (Ch 1 to Ch 18) */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-zinc-800 text-alabaster flex items-center justify-center text-[11px] font-mono">1</span>
                <span>Step 1: Choose Chapter Number (Ch 1 to Ch {chapters.length})</span>
              </h2>
              <span className="text-xs text-zinc-500 font-medium">Click to set active chapter</span>
            </div>

            {/* Chapter Pill Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {chapters.map((ch, idx) => {
                const isSelected = selectedChapterIndex === idx;
                const isDone = !!completedChapters[`${currentClass}|${currentSubject}|${ch.number}`];
                return (
                  <button
                    key={`ch-pill-${ch.number}`}
                    type="button"
                    onClick={() => setSelectedChapterIndex(idx)}
                    className={`p-3 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between min-h-[82px] relative group ${
                      isSelected
                        ? 'bg-royal border-royal text-white shadow-lg ring-2 ring-royal/40 scale-[1.02]'
                        : isDone
                          ? 'bg-mint/5 border-mint/30 text-zinc-300 hover:border-mint/60'
                          : 'bg-obsidian-surface border-structural-dark text-zinc-300 hover:border-zinc-600 hover:bg-obsidian-elevated'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        Ch {ch.number}
                      </span>
                      {isDone && <Check className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-mint'}`} />}
                    </div>

                    <div className="my-1">
                      <span className="text-xs font-bold tracking-tight line-clamp-2 block leading-snug">
                        {ch.title}
                      </span>
                    </div>

                    {ch.hindiTitle && (
                      <span className={`text-[10px] font-devanagari truncate ${
                        isSelected ? 'text-white/80' : 'text-zinc-500'
                      }`}>
                        {ch.hindiTitle}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* ACTIVE CHAPTER SPOTLIGHT CARD */}
          <div className="bg-alabaster text-obsidian rounded-2xl p-5 sm:p-6 border border-structural-light shadow-xl mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-extrabold uppercase tracking-wider bg-royal text-white px-2 py-0.5 rounded">
                    Active Chapter {activeChapter.number}
                  </span>
                  <span className="text-xs font-mono bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded font-bold border border-zinc-200">
                    NCERT Code: {bookCode}
                  </span>
                  {activeChapter.hindiTitle && (
                    <span className="text-xs font-semibold text-royal font-devanagari">
                      {activeChapter.hindiTitle}
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-obsidian tracking-tight">
                  {activeChapter.title}
                </h3>
                <p className="text-xs text-zinc-600 mt-1 max-w-2xl line-clamp-2">
                  {activeChapter.briefSummary.synopsis}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleCompleteChapter}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isCurrentChapterDone
                      ? 'bg-mint text-obsidian shadow-sm'
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-300'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{isCurrentChapterDone ? 'Completed ✓' : 'Mark as Done'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* STEP 2: 6 CORE STUDY HUB MODULES */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-zinc-800 text-alabaster flex items-center justify-center text-[11px] font-mono">2</span>
                <span>Step 2: Launch a Study Module (6 Dedicated Hubs)</span>
              </h2>
              <span className="text-xs text-zinc-500 font-medium">100% Working Answers &amp; Tools</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* HUB CARD 1: Most Important Questions */}
              <div className="bg-obsidian-surface border border-structural-dark rounded-2xl p-5 hover:border-royal/60 transition-all flex flex-col justify-between group shadow-block-dark">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber/10 border border-amber/30 text-amber flex items-center justify-center font-bold">
                      <Star className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber/20 text-amber-300">
                      Module 1
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-white group-hover:text-amber transition-colors">
                    Most Important Questions
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                    Official Intext Blue-Box Questions &amp; End-of-Chapter Exercises with expandable step-by-step verified CBSE derivations.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-zinc-500 font-medium">
                    <span>{activeChapter.mostImportantQuestions.intext.length} Intext Qs</span>
                    <span>&bull;</span>
                    <span>{activeChapter.mostImportantQuestions.exercise.length} Exercise Qs</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModule('IMPORTANT_QS')}
                  className="mt-5 w-full py-2.5 px-4 rounded-xl bg-amber/15 hover:bg-amber text-amber-300 hover:text-obsidian font-bold text-xs transition-all flex items-center justify-center gap-2 border border-amber/30"
                >
                  <span>Open Questions Hub &rarr;</span>
                </button>
              </div>

              {/* HUB CARD 2: Complete Revision Sheet */}
              <div className="bg-obsidian-surface border border-structural-dark rounded-2xl p-5 hover:border-mint/60 transition-all flex flex-col justify-between group shadow-block-dark">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-mint/10 border border-mint/30 text-mint flex items-center justify-center font-bold">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-mint/20 text-mint">
                      Module 2
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-white group-hover:text-mint transition-colors">
                    Complete Revision Sheet
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                    Interactive 4-part sheet: Fill in the Blanks with instant checking, Assertion-Reason (A/B/C/D), MCQs, &amp; Subjective Qs.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-zinc-500 font-medium">
                    <span>Fill Blanks</span>
                    <span>&bull;</span>
                    <span>Assertion-Reason</span>
                    <span>&bull;</span>
                    <span>2/3/5 Mark Qs</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModule('REVISION_SHEET')}
                  className="mt-5 w-full py-2.5 px-4 rounded-xl bg-mint/15 hover:bg-mint text-mint hover:text-obsidian font-bold text-xs transition-all flex items-center justify-center gap-2 border border-mint/30"
                >
                  <span>Open Revision Sheet &rarr;</span>
                </button>
              </div>

              {/* HUB CARD 3: Chapter Test */}
              <div className="bg-obsidian-surface border border-structural-dark rounded-2xl p-5 hover:border-red-500/60 transition-all flex flex-col justify-between group shadow-block-dark">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center font-bold">
                      <Timer className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-300">
                      Module 3
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-white group-hover:text-red-400 transition-colors">
                    Chapter Test (10 Tough MCQs)
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                    10 Tough HOTS &amp; Olympiad-standard MCQs. Features live answered counter, instant submission scorecard, and deep explanations.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-zinc-500 font-medium">
                    <span>10 Tough Questions</span>
                    <span>&bull;</span>
                    <span>Live Scorecard</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModule('CHAPTER_TEST')}
                  className="mt-5 w-full py-2.5 px-4 rounded-xl bg-red-500/15 hover:bg-red-500 text-red-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 border border-red-500/30"
                >
                  <span>Start Chapter Test &rarr;</span>
                </button>
              </div>

              {/* HUB CARD 4: NCERT Books */}
              <div className="bg-obsidian-surface border border-structural-dark rounded-2xl p-5 hover:border-blue-500/60 transition-all flex flex-col justify-between group shadow-block-dark">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                      Module 4
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-white group-hover:text-blue-400 transition-colors">
                    NCERT Books Reader
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                    Distraction-free 6-page interactive textbook reader with zoom, paper/sepia filters, bookmarks, and local system PDF viewer.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-zinc-500 font-medium">
                    <span>6 Pages</span>
                    <span>&bull;</span>
                    <span>Code: {bookCode}</span>
                    <span>&bull;</span>
                    <span>Offline Ready</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModule('NCERT_BOOKS')}
                  className="mt-5 w-full py-2.5 px-4 rounded-xl bg-blue-500/15 hover:bg-blue-500 text-blue-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 border border-blue-500/30"
                >
                  <span>Open NCERT Books &rarr;</span>
                </button>
              </div>

              {/* HUB CARD 5: Chapter Notes */}
              <div className="bg-obsidian-surface border border-structural-dark rounded-2xl p-5 hover:border-purple-500/60 transition-all flex flex-col justify-between group shadow-block-dark">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold">
                      <BookText className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                      Module 5
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-white group-hover:text-purple-400 transition-colors">
                    Chapter Notes (Notes Only)
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                    Laser-focused notes only: High-yield definitions, structured revision bullets covering every concept, and complete formula tables.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-zinc-500 font-medium">
                    <span>{activeChapter.chapterNotes.keyDefinitions.length} Definitions</span>
                    <span>&bull;</span>
                    <span>{activeChapter.chapterNotes.formulaTable.length} Formulas</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModule('CHAPTER_NOTES')}
                  className="mt-5 w-full py-2.5 px-4 rounded-xl bg-purple-500/15 hover:bg-purple-500 text-purple-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 border border-purple-500/30"
                >
                  <span>Read Chapter Notes &rarr;</span>
                </button>
              </div>

              {/* HUB CARD 6: Brief Summary */}
              <div className="bg-obsidian-surface border border-structural-dark rounded-2xl p-5 hover:border-yellow-400/60 transition-all flex flex-col justify-between group shadow-block-dark">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 flex items-center justify-center font-bold">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-yellow-400/20 text-yellow-300">
                      Module 6
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-white group-hover:text-yellow-300 transition-colors">
                    Brief Summary (Summary Only)
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                    Crisp 2-minute revision summary: One high-impact synopsis paragraph followed by the 4 core takeaways you cannot enter exams without.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-zinc-500 font-medium">
                    <span>1 Synopsis</span>
                    <span>&bull;</span>
                    <span>4 Core Takeaways</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModule('BRIEF_SUMMARY')}
                  className="mt-5 w-full py-2.5 px-4 rounded-xl bg-yellow-400/15 hover:bg-yellow-400 text-yellow-300 hover:text-obsidian font-bold text-xs transition-all flex items-center justify-center gap-2 border border-yellow-400/30"
                >
                  <span>View Brief Summary &rarr;</span>
                </button>
              </div>

            </div>
          </section>

        </main>
      )}

      {/* =========================================================================
          MODULE 1: MOST IMPORTANT QUESTIONS (STAGE 4)
          Unified single renderer without duplication
          ========================================================================= */}
      {activeModule === 'IMPORTANT_QS' && (
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
          
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber/20 text-amber-300 text-xs font-semibold mb-1 border border-amber/30">
                <Star className="w-3.5 h-3.5" />
                <span>Module 1: Most Important Questions</span>
              </div>
              <h2 className="text-2xl font-black text-white">
                Ch {activeChapter.number}: {activeChapter.title} — Questions Hub
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                All official intext blue-box &amp; end-of-chapter exercises with step-by-step CBSE derivations.
              </p>
            </div>

            {/* Filter & Global Expand/Collapse */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center bg-obsidian-surface p-1 rounded-xl border border-structural-dark text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setQsFilter('ALL')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    qsFilter === 'ALL' ? 'bg-royal text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  All ({activeChapter.mostImportantQuestions.intext.length + activeChapter.mostImportantQuestions.exercise.length})
                </button>
                <button
                  type="button"
                  onClick={() => setQsFilter('INTEXT')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    qsFilter === 'INTEXT' ? 'bg-royal text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Intext ({activeChapter.mostImportantQuestions.intext.length})
                </button>
                <button
                  type="button"
                  onClick={() => setQsFilter('EXERCISE')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    qsFilter === 'EXERCISE' ? 'bg-royal text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Exercises ({activeChapter.mostImportantQuestions.exercise.length})
                </button>
              </div>

              <button
                type="button"
                onClick={handleToggleAllSolutions}
                className="px-3 py-1.5 rounded-xl bg-obsidian-elevated hover:bg-zinc-800 text-zinc-300 hover:text-white border border-structural-dark text-xs font-bold transition-all flex items-center gap-1.5"
              >
                {allSolutionsExpanded ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{allSolutionsExpanded ? 'Hide All Answers' : 'Show All Answers'}</span>
              </button>
            </div>
          </div>

          {/* Unified Questions Stream (Zero Duplication) */}
          <div className="space-y-4">
            {[
              ...(qsFilter === 'ALL' || qsFilter === 'INTEXT' ? activeChapter.mostImportantQuestions.intext : []),
              ...(qsFilter === 'ALL' || qsFilter === 'EXERCISE' ? activeChapter.mostImportantQuestions.exercise : []),
            ].map((q) => {
              const isExpanded = !!expandedSolutions[q.id];
              const isIntext = q.type === 'INTEXT';
              return (
                <div key={q.id} className="bg-obsidian-surface border border-structural-dark rounded-2xl p-5 shadow-block-dark">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                        isIntext 
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' 
                          : 'bg-amber/20 text-amber-300 border-amber/40'
                      }`}>
                        {isIntext ? 'Intext Blue-Box' : 'End-of-Chapter Exercise'}
                      </span>
                      <span className="text-xs font-bold text-zinc-400">
                        {q.questionNumber} &bull; {isIntext ? `Page ${q.pageRef}` : `${q.marks} Marks`}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setExpandedSolutions((prev) => ({ ...prev, [q.id]: !isExpanded }))}
                      className="px-3 py-1 rounded-lg bg-royal/20 hover:bg-royal/35 text-royal-light text-xs font-bold transition-colors flex items-center gap-1 border border-royal/40"
                    >
                      <span>{isExpanded ? 'Hide Solution' : 'Show Solution'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="mt-3 text-sm font-semibold text-white leading-relaxed">
                    <RenderLatexText text={q.question} />
                  </div>

                  {isExpanded && (
                    <div className="mt-4 p-4 rounded-xl bg-alabaster text-obsidian border border-structural-light animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center justify-between mb-2 pb-2 border-b border-zinc-200">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-royal">
                          Step-by-Step Verified Solution:
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyNotes(q.solution)}
                          className="text-[11px] text-zinc-500 hover:text-obsidian flex items-center gap-1 font-semibold"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </button>
                      </div>
                      <div className="text-xs leading-relaxed text-zinc-800 whitespace-pre-line font-medium">
                        <RenderLatexText text={q.solution} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* =========================================================================
          MODULE 2: COMPLETE REVISION SHEET (STAGE 4)
          ========================================================================= */}
      {activeModule === 'REVISION_SHEET' && (
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
          
          {/* Header */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-mint/20 text-mint text-xs font-semibold mb-1 border border-mint/30">
              <FileCheck className="w-3.5 h-3.5" />
              <span>Module 2: Complete Revision Sheet</span>
            </div>
            <h2 className="text-2xl font-black text-white">
              Ch {activeChapter.number}: {activeChapter.title} — Interactive Revision
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Practice all 4 CBSE question varieties with instant feedback and step-by-step explanations.
            </p>
          </div>

          {/* Sub-Section Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none border-b border-structural-dark">
            <button
              type="button"
              onClick={() => setRevisionTab('BLANKS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                revisionTab === 'BLANKS'
                  ? 'bg-mint text-obsidian shadow-sm'
                  : 'bg-obsidian-surface hover:bg-obsidian-elevated text-zinc-400 hover:text-white border border-structural-dark'
              }`}
            >
              1. Fill in the Blanks ({activeChapter.revisionSheet.fillInTheBlanks.length})
            </button>
            <button
              type="button"
              onClick={() => setRevisionTab('ASSERTION')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                revisionTab === 'ASSERTION'
                  ? 'bg-mint text-obsidian shadow-sm'
                  : 'bg-obsidian-surface hover:bg-obsidian-elevated text-zinc-400 hover:text-white border border-structural-dark'
              }`}
            >
              2. Assertion &amp; Reason ({activeChapter.revisionSheet.assertionReason.length})
            </button>
            <button
              type="button"
              onClick={() => setRevisionTab('MCQS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                revisionTab === 'MCQS'
                  ? 'bg-mint text-obsidian shadow-sm'
                  : 'bg-obsidian-surface hover:bg-obsidian-elevated text-zinc-400 hover:text-white border border-structural-dark'
              }`}
            >
              3. Revision MCQs ({activeChapter.revisionSheet.mcqs.length})
            </button>
            <button
              type="button"
              onClick={() => setRevisionTab('SUBJECTIVE')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                revisionTab === 'SUBJECTIVE'
                  ? 'bg-mint text-obsidian shadow-sm'
                  : 'bg-obsidian-surface hover:bg-obsidian-elevated text-zinc-400 hover:text-white border border-structural-dark'
              }`}
            >
              4. Subjective Qs ({activeChapter.revisionSheet.subjective.length})
            </button>
          </div>

          {/* SECTION 1: Fill in the Blanks */}
          {revisionTab === 'BLANKS' && (
            <div className="space-y-4">
              {activeChapter.revisionSheet.fillInTheBlanks.map((b, idx) => {
                const userVal = fillBlankInputs[b.id] || '';
                const isChecked = !!fillBlankChecked[b.id];
                const isCorrect = userVal.trim().toLowerCase() === b.blankAnswer.toLowerCase();
                const showHint = !!fillBlankShowHint[b.id];

                return (
                  <div key={b.id} className="bg-obsidian-surface border border-structural-dark rounded-2xl p-5 shadow-block-dark">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                        Blank #{idx + 1}
                      </span>
                      {isChecked && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                          isCorrect ? 'bg-mint/20 text-mint' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {isCorrect ? 'Correct! ✓' : `Incorrect (Answer: ${b.blankAnswer})`}
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-semibold text-white leading-relaxed mb-4">
                      <RenderLatexText text={b.sentence} />
                    </p>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input
                        type="text"
                        value={userVal}
                        onChange={(e) => setFillBlankInputs((prev) => ({ ...prev, [b.id]: e.target.value }))}
                        placeholder="Type missing term here..."
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-obsidian-elevated border border-structural-dark text-white text-xs font-medium focus:border-mint outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setFillBlankChecked((prev) => ({ ...prev, [b.id]: true }))}
                        className="px-4 py-2.5 rounded-xl bg-mint hover:bg-mint-hover text-obsidian text-xs font-bold transition-all shadow-sm"
                      >
                        Check Answer
                      </button>
                      <button
                        type="button"
                        onClick={() => setFillBlankShowHint((prev) => ({ ...prev, [b.id]: !showHint }))}
                        className="px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-all"
                      >
                        {showHint ? 'Hide Hint' : 'Hint'}
                      </button>
                    </div>

                    {showHint && (
                      <div className="mt-3 p-3 rounded-xl bg-amber/10 border border-amber/30 text-xs text-amber-200">
                        💡 Hint: {b.hint}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* SECTION 2: Assertion & Reason */}
          {revisionTab === 'ASSERTION' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 space-y-1">
                <div className="font-bold text-white mb-1">Standard CBSE Code Legend:</div>
                <div>(A) Both A and R are true and R is the correct explanation of A.</div>
                <div>(B) Both A and R are true but R is NOT the correct explanation of A.</div>
                <div>(C) A is true but R is false.</div>
                <div>(D) A is false but R is true.</div>
              </div>

              {activeChapter.revisionSheet.assertionReason.map((ar, idx) => {
                const choice = assertionChoices[ar.id];
                const isSelected = !!choice;
                const isCorrect = choice === ar.correctAnswer;

                return (
                  <div key={ar.id} className="bg-obsidian-surface border border-structural-dark rounded-2xl p-5 shadow-block-dark">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                        Assertion-Reason #{idx + 1}
                      </span>
                      {isSelected && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                          isCorrect ? 'bg-mint/20 text-mint' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {isCorrect ? 'Correct! ✓' : `Incorrect (Correct: Option ${ar.correctAnswer})`}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 mb-4 text-xs sm:text-sm">
                      <div className="p-3 rounded-xl bg-obsidian-elevated border border-structural-dark">
                        <span className="font-bold text-royal-light block mb-0.5">Assertion (A):</span>
                        <RenderLatexText text={ar.assertion} className="text-zinc-200" />
                      </div>
                      <div className="p-3 rounded-xl bg-obsidian-elevated border border-structural-dark">
                        <span className="font-bold text-mint block mb-0.5">Reason (R):</span>
                        <RenderLatexText text={ar.reason} className="text-zinc-200" />
                      </div>
                    </div>

                    {/* A/B/C/D Buttons */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                        const optChosen = choice === opt;
                        const isCorrectOpt = ar.correctAnswer === opt;
                        let btnStyle = 'bg-obsidian-elevated text-zinc-300 border-structural-dark hover:border-zinc-500';
                        if (isSelected) {
                          if (optChosen && isCorrect) btnStyle = 'bg-mint text-obsidian font-bold border-mint';
                          else if (optChosen && !isCorrect) btnStyle = 'bg-red-500 text-white font-bold border-red-500';
                          else if (isCorrectOpt) btnStyle = 'bg-mint/20 text-mint font-bold border-mint/50';
                        }

                        return (
                          <button
                            key={`${ar.id}-opt-${opt}`}
                            type="button"
                            onClick={() => setAssertionChoices((prev) => ({ ...prev, [ar.id]: opt }))}
                            className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${btnStyle}`}
                          >
                            Option {opt}
                          </button>
                        );
                      })}
                    </div>

                    {isSelected && (
                      <div className="mt-4 p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
                        <span className="font-bold text-white block mb-1">Explanation:</span>
                        <RenderLatexText text={ar.explanation} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* SECTION 3: Revision MCQs */}
          {revisionTab === 'MCQS' && (
            <div className="space-y-4">
              {activeChapter.revisionSheet.mcqs.map((m, idx) => {
                const choice = revisionMcqChoices[m.id];
                const isAnswered = choice !== undefined;
                const isCorrect = choice === m.correctIndex;

                return (
                  <div key={m.id} className="bg-obsidian-surface border border-structural-dark rounded-2xl p-5 shadow-block-dark">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                        MCQ #{idx + 1}
                      </span>
                      {isAnswered && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                          isCorrect ? 'bg-mint/20 text-mint' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {isCorrect ? 'Correct! ✓' : 'Incorrect ✗'}
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-semibold text-white leading-relaxed mb-4">
                      <RenderLatexText text={m.question} />
                    </p>

                    <div className="space-y-2">
                      {m.options.map((opt, oIdx) => {
                        const optChosen = choice === oIdx;
                        const isCorrectOpt = m.correctIndex === oIdx;
                        let optStyle = 'bg-obsidian-elevated text-zinc-300 border-structural-dark hover:border-zinc-500';
                        if (isAnswered) {
                          if (optChosen && isCorrect) optStyle = 'bg-mint text-obsidian font-bold border-mint';
                          else if (optChosen && !isCorrect) optStyle = 'bg-red-500 text-white font-bold border-red-500';
                          else if (isCorrectOpt) optStyle = 'bg-mint/20 text-mint font-bold border-mint/50';
                        }

                        return (
                          <button
                            key={`${m.id}-opt-${oIdx}`}
                            type="button"
                            onClick={() => setRevisionMcqChoices((prev) => ({ ...prev, [m.id]: oIdx }))}
                            className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${optStyle}`}
                          >
                            <span>
                              <span className="font-bold mr-2">{String.fromCodePoint(65 + oIdx)}.</span>
                              <RenderLatexText text={opt} />
                            </span>
                            {isAnswered && isCorrectOpt && <Check className="w-4 h-4 text-mint flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <div className="mt-4 p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
                        <span className="font-bold text-white block mb-1">Detailed Explanation:</span>
                        <RenderLatexText text={m.explanation} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* SECTION 4: Subjective Questions */}
          {revisionTab === 'SUBJECTIVE' && (
            <div className="space-y-4">
              {activeChapter.revisionSheet.subjective.map((sq, idx) => {
                const isExpanded = !!expandedSubjective[sq.id];

                return (
                  <div key={sq.id} className="bg-obsidian-surface border border-structural-dark rounded-2xl p-5 shadow-block-dark">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                        Question #{idx + 1} &bull; {sq.marks} Marks
                      </span>
                      <button
                        type="button"
                        onClick={() => setExpandedSubjective((prev) => ({ ...prev, [sq.id]: !isExpanded }))}
                        className="px-3 py-1 rounded-lg bg-royal/20 hover:bg-royal/35 text-royal-light text-xs font-bold transition-colors flex items-center gap-1 border border-royal/40"
                      >
                        <span>{isExpanded ? 'Hide Answer' : 'Reveal Answer'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <p className="text-sm font-semibold text-white leading-relaxed mb-3">
                      <RenderLatexText text={sq.question} />
                    </p>

                    {isExpanded && (
                      <div className="p-4 rounded-xl bg-alabaster text-obsidian border border-structural-light animate-in fade-in">
                        <div className="text-xs font-extrabold uppercase tracking-wider text-royal mb-1.5 pb-1 border-b border-zinc-200">
                          CBSE Model Marking Solution:
                        </div>
                        <div className="text-xs leading-relaxed text-zinc-800 whitespace-pre-line font-medium">
                          <RenderLatexText text={sq.answer} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </main>
      )}

      {/* =========================================================================
          MODULE 3: CHAPTER TEST (10 TOUGH MCQS) (STAGE 4)
          ========================================================================= */}
      {activeModule === 'CHAPTER_TEST' && (
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
          
          {/* Header Banner */}
          <div className="bg-obsidian-surface border border-structural-dark rounded-2xl p-5 sm:p-6 mb-6 shadow-block-dark">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 text-xs font-semibold mb-1 border border-red-500/30">
                  <Timer className="w-3.5 h-3.5" />
                  <span>Module 3: Chapter Test</span>
                </div>
                <h2 className="text-2xl font-black text-white">
                  Ch {activeChapter.number}: {activeChapter.title} — 10 Tough MCQs
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  CBSE HOTS and Olympiad standard test. Answer all 10 questions to unlock your scorecard.
                </p>
              </div>

              {/* Live Answer Counter */}
              <div className="bg-obsidian-elevated px-4 py-2.5 rounded-xl border border-structural-dark text-center sm:text-right">
                <span className="text-[10px] font-bold uppercase text-zinc-400 block">Progress</span>
                <span className="text-sm font-extrabold text-mint">
                  {Object.keys(testChoices).length} / {activeChapter.toughTest.length} Answered
                </span>
              </div>
            </div>
          </div>

          {/* SCORECARD BANNER (after submission) */}
          {isTestSubmitted && (
            <div className="mb-8 p-6 rounded-2xl bg-alabaster text-obsidian border border-structural-light shadow-2xl animate-in fade-in zoom-in-95">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-royal">
                      Test Result Scorecard
                    </span>
                    <span className="text-xs text-zinc-400">&bull;</span>
                    <span className="text-xs font-semibold text-zinc-600">
                      {testScore >= 8 ? 'Outstanding! 🏆' : testScore >= 5 ? 'Good Effort! 🌟' : 'Needs Practice 📚'}
                    </span>
                  </div>
                  <h3 className="text-3xl font-black text-obsidian tracking-tight">
                    {testScore} / {activeChapter.toughTest.length} ({Math.round((testScore / activeChapter.toughTest.length) * 100)}%)
                  </h3>
                  <p className="text-xs text-zinc-600 mt-1">
                    {testScore >= 8 
                      ? 'You demonstrated master-level conceptual clarity on CBSE HOTS problems!'
                      : 'Review the detailed explanations below to cement your understanding of missed topics.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRetakeTest}
                  className="px-5 py-3 rounded-xl bg-royal hover:bg-royal-hover text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Test</span>
                </button>
              </div>
            </div>
          )}

          {/* Test Questions Stream */}
          <div className="space-y-5">
            {activeChapter.toughTest.map((q, idx) => {
              const selectedOpt = testChoices[q.id];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = selectedOpt === q.correctIndex;

              return (
                <div key={q.id} className="bg-obsidian-surface border border-structural-dark rounded-2xl p-5 shadow-block-dark">
                  
                  {/* Question Meta */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                        Q{idx + 1}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40">
                        {q.difficulty}
                      </span>
                      <span className="text-xs text-zinc-400 hidden sm:inline">
                        Topic: {q.topic}
                      </span>
                    </div>

                    {isTestSubmitted && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        isCorrect ? 'bg-mint/20 text-mint' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {isCorrect ? '+1 Mark (Correct)' : '0 Marks (Incorrect)'}
                      </span>
                    )}
                  </div>

                  {/* Question Text */}
                  <p className="text-sm font-semibold text-white leading-relaxed mb-4">
                    <RenderLatexText text={q.question} />
                  </p>

                  {/* Options */}
                  <div className="space-y-2">
                    {q.options.map((opt, oIdx) => {
                      const isChosen = selectedOpt === oIdx;
                      const isTargetCorrect = q.correctIndex === oIdx;
                      let optClass = 'bg-obsidian-elevated text-zinc-300 border-structural-dark hover:border-zinc-500';

                      if (isTestSubmitted) {
                        if (isChosen && isCorrect) optClass = 'bg-mint text-obsidian font-bold border-mint';
                        else if (isChosen && !isCorrect) optClass = 'bg-red-500 text-white font-bold border-red-500';
                        else if (isTargetCorrect) optClass = 'bg-mint/20 text-mint font-bold border-mint/50';
                      } else if (isChosen) {
                        optClass = 'bg-royal text-white font-bold border-royal ring-2 ring-royal/30';
                      }

                      return (
                        <button
                          key={`${q.id}-opt-${oIdx}`}
                          type="button"
                          disabled={isTestSubmitted}
                          onClick={() => setTestChoices((prev) => ({ ...prev, [q.id]: oIdx }))}
                          className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${optClass}`}
                        >
                          <span>
                            <span className="font-bold mr-2">{String.fromCodePoint(65 + oIdx)}.</span>
                            <RenderLatexText text={opt} />
                          </span>
                          {isTestSubmitted && isTargetCorrect && <Check className="w-4 h-4 text-mint flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Detailed Explanation if test submitted */}
                  {isTestSubmitted && (
                    <div className="mt-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 animate-in fade-in">
                      <span className="font-bold text-white block mb-1 text-xs uppercase tracking-wider">
                        CBSE Derivation &amp; Solution:
                      </span>
                      <div className="leading-relaxed whitespace-pre-line">
                        <RenderLatexText text={q.explanation} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit Test Button */}
          {!isTestSubmitted && (
            <div className="mt-8 bg-alabaster text-obsidian rounded-2xl p-5 border border-structural-light flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-royal block">
                  Ready to Grade?
                </span>
                <span className="text-xs text-zinc-600">
                  You have answered {Object.keys(testChoices).length} of {activeChapter.toughTest.length} questions.
                </span>
              </div>

              <button
                type="button"
                onClick={handleSubmitTest}
                disabled={Object.keys(testChoices).length === 0}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-royal hover:bg-royal-hover disabled:bg-zinc-300 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Submit &amp; Grade Test &rarr;</span>
              </button>
            </div>
          )}

        </main>
      )}

      {/* =========================================================================
          MODULE 4: NCERT BOOKS (6-PAGE READER + LOCAL PDF VIEWER) (STAGE 4)
          ========================================================================= */}
      {activeModule === 'NCERT_BOOKS' && (
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
          
          {/* Reader Top Controls */}
          <div className="bg-obsidian-surface border border-structural-dark rounded-2xl p-4 mb-6 shadow-block-dark flex flex-wrap items-center justify-between gap-3 text-xs">
            
            {/* Mode Toggle: Interactive vs Local PDF */}
            <div className="flex items-center gap-2">
              <span className="text-zinc-400 font-bold uppercase text-[10px]">Mode:</span>
              <div className="flex items-center bg-obsidian-elevated p-1 rounded-xl border border-structural-dark">
                <button
                  type="button"
                  onClick={() => setReaderMode('INTERACTIVE')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    readerMode === 'INTERACTIVE' ? 'bg-royal text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  6-Page Reader
                </button>
                <button
                  type="button"
                  onClick={() => setReaderMode('LOCAL_PDF')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    readerMode === 'LOCAL_PDF' ? 'bg-royal text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Local System PDF
                </button>
              </div>
            </div>

            {/* Reading Controls (for Interactive Mode) */}
            {readerMode === 'INTERACTIVE' && (
              <div className="flex items-center gap-3 flex-wrap">
                
                {/* Zoom Controls */}
                <div className="flex items-center bg-obsidian-elevated border border-structural-dark rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.max(70, z - 15))}
                    className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 font-mono text-[11px] text-zinc-300 font-bold">{zoomLevel}%</span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
                    className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Filter Theme */}
                <div className="flex items-center bg-obsidian-elevated border border-structural-dark rounded-lg p-0.5">
                  <button
                    type="button"
                    onClick={() => setReaderFilter('light')}
                    className={`px-2 py-1 rounded text-[10px] font-bold ${
                      readerFilter === 'light' ? 'bg-white text-obsidian shadow-sm' : 'text-zinc-400'
                    }`}
                  >
                    Paper
                  </button>
                  <button
                    type="button"
                    onClick={() => setReaderFilter('sepia')}
                    className={`px-2 py-1 rounded text-[10px] font-bold ${
                      readerFilter === 'sepia' ? 'bg-[#F4ECD8] text-[#5C4033] shadow-sm' : 'text-zinc-400'
                    }`}
                  >
                    Sepia
                  </button>
                  <button
                    type="button"
                    onClick={() => setReaderFilter('dark')}
                    className={`px-2 py-1 rounded text-[10px] font-bold ${
                      readerFilter === 'dark' ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-400'
                    }`}
                  >
                    Night
                  </button>
                </div>

                {/* Bookmark Page */}
                <button
                  type="button"
                  onClick={handleBookmarkPage}
                  className="px-3 py-1.5 rounded-lg bg-amber hover:bg-amber-hover text-obsidian font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Bookmark Page</span>
                </button>

                {/* Fullscreen */}
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="p-1.5 rounded-lg bg-obsidian-elevated hover:bg-zinc-800 text-zinc-300 border border-structural-dark"
                  title="Fullscreen"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            )}

            {/* Direct Official PDF link */}
            <a
              href={activeChapter.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-royal-light hover:underline font-semibold"
            >
              <span>Official NCERT PDF</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

          </div>

          {/* Interactive Mode Content Viewport */}
          {readerMode === 'INTERACTIVE' && (
            <div ref={readerContainerRef} className="space-y-4">
              
              {/* Active Page Card */}
              {(() => {
                const pageIndex = Math.min(Math.max(1, currentPage), activeChapter.pages.length) - 1;
                const page = activeChapter.pages[pageIndex] || activeChapter.pages[0];

                const filterClasses = 
                  readerFilter === 'sepia' 
                    ? 'bg-[#F4ECD8] text-[#3E2723] border-[#D7CCC8]' 
                    : readerFilter === 'dark'
                      ? 'bg-zinc-950 text-zinc-100 border-zinc-800'
                      : 'bg-alabaster text-obsidian border-structural-light';

                return (
                  <div 
                    className={`rounded-2xl p-6 sm:p-10 border shadow-2xl transition-all ${filterClasses}`}
                    style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                  >
                    {/* Page Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-zinc-200/50 mb-6">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-extrabold uppercase px-2 py-0.5 rounded bg-royal text-white">
                          NCERT Class {currentClassObj.badge} &bull; {bookCode}
                        </span>
                        <span className="text-xs font-bold opacity-75">
                          Ch {activeChapter.number}: {activeChapter.title}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded bg-zinc-200/50">
                        Page {page.pageNumber} of {activeChapter.pages.length}
                      </span>
                    </div>

                    {/* Section Title */}
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight mb-4">
                      {page.sectionTitle}
                    </h3>

                    {/* Page Content Body with LaTeX */}
                    <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium space-y-3">
                      <RenderLatexText text={page.content} />
                    </div>

                    {/* Page Footer */}
                    <div className="mt-8 pt-4 border-t border-zinc-200/50 flex items-center justify-between text-[11px] opacity-60 font-mono">
                      <span>Divyavani NCERT Universal Reader</span>
                      <span>Page {page.pageNumber}</span>
                    </div>
                  </div>
                );
              })()}

              {/* Page Navigation Strip */}
              <div className="bg-obsidian-surface border border-structural-dark rounded-2xl p-4 flex items-center justify-between shadow-block-dark">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3.5 py-2 rounded-xl bg-obsidian-elevated hover:bg-zinc-800 disabled:opacity-40 text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-structural-dark"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev Page</span>
                </button>

                {/* Page Number Pills */}
                <div className="flex items-center gap-1.5">
                  {activeChapter.pages.map((p) => (
                    <button
                      key={`page-${p.pageNumber}`}
                      type="button"
                      onClick={() => setCurrentPage(p.pageNumber)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                        currentPage === p.pageNumber
                          ? 'bg-royal text-white shadow-sm'
                          : 'bg-obsidian-elevated text-zinc-400 hover:text-white'
                      }`}
                    >
                      {p.pageNumber}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={currentPage >= activeChapter.pages.length}
                  onClick={() => setCurrentPage((p) => Math.min(activeChapter.pages.length, p + 1))}
                  className="px-3.5 py-2 rounded-xl bg-obsidian-elevated hover:bg-zinc-800 disabled:opacity-40 text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-structural-dark"
                >
                  <span>Next Page</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* Local System PDF Viewer (iframe) */}
          {readerMode === 'LOCAL_PDF' && (() => {
            const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (typeof window !== 'undefined' && window.location.pathname.startsWith('/Divya-Vani') ? '/Divya-Vani' : '');
            const localPdfUrl = `${basePath}/${activeChapter.localPdfUrl}`;
            return (
              <div className="bg-obsidian-surface border border-structural-dark rounded-2xl p-4 shadow-block-dark">
                <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-bold text-zinc-300">
                    Official NCERT PDF: <code className="font-mono text-mint">/{activeChapter.localPdfUrl}</code>
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={localPdfUrl}
                      download={`NCERT_${currentClass}_${currentSubject}_Ch${activeChapter.number}.pdf`}
                      className="px-3.5 py-1.5 rounded-xl bg-royal text-white text-xs font-bold hover:bg-royal-hover transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Book PDF</span>
                    </a>
                    <a
                      href={localPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-obsidian-elevated text-zinc-300 border border-structural-dark text-xs font-bold hover:text-white transition-colors flex items-center gap-1"
                    >
                      <span>Direct Open</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="w-full h-[800px] bg-zinc-900 rounded-2xl overflow-hidden border border-structural-dark shadow-lg">
                  <iframe
                    src={localPdfUrl}
                    className="w-full h-[800px] border-0 rounded-2xl shadow-lg"
                    title={`NCERT Class ${currentClass} ${currentSubject} Ch ${activeChapter.number} PDF`}
                  />
                </div>

                <p className="text-[11px] text-zinc-400 mt-3 text-center">
                  Official authentic textbook PDF loaded directly from repository archive with zero CORS restrictions.
                </p>
              </div>
            );
          })()}

        </main>
      )}

      {/* =========================================================================
          MODULE 5: CHAPTER NOTES (STAGE 4)
          ========================================================================= */}
      {activeModule === 'CHAPTER_NOTES' && (
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-1 border border-purple-500/30">
                <BookText className="w-3.5 h-3.5" />
                <span>Module 5: Chapter Notes</span>
              </div>
              <h2 className="text-2xl font-black text-white">
                Ch {activeChapter.number}: {activeChapter.title} — High-Yield Notes
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Laser-focused notes only. Key definitions, comprehensive revision bullets, and mathematical formulas.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleCopyNotes(`${activeChapter.title} Notes\n\n` + activeChapter.chapterNotes.revisionBullets.join('\n\n'))}
              className="px-3.5 py-2 rounded-xl bg-obsidian-surface hover:bg-obsidian-elevated text-zinc-200 border border-structural-dark text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Full Notes</span>
            </button>
          </div>

          <div className="space-y-8">
            
            {/* 1. Key Definitions */}
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-royal-light mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-royal text-white flex items-center justify-center text-[10px]">1</span>
                <span>Core Scientific &amp; Mathematical Definitions</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeChapter.chapterNotes.keyDefinitions.map((def) => (
                  <div key={def.term} className="bg-obsidian-surface border border-structural-dark rounded-xl p-4 shadow-block-dark">
                    <span className="text-xs font-extrabold text-mint block mb-1">
                      {def.term}
                    </span>
                    <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                      <RenderLatexText text={def.definition} />
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 2. Topic Revision Bullets */}
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-royal-light mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-royal text-white flex items-center justify-center text-[10px]">2</span>
                <span>Comprehensive Topic Revision Bullets</span>
              </h3>

              <div className="bg-obsidian-surface border border-structural-dark rounded-2xl p-5 shadow-block-dark space-y-3">
                {activeChapter.chapterNotes.revisionBullets.map((bullet, idx) => (
                  <div key={`bullet-${bullet.slice(0, 20)}`} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-royal/20 text-royal-light text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium">
                      <RenderLatexText text={bullet} />
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. Formula & Identity Table */}
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-royal-light mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-royal text-white flex items-center justify-center text-[10px]">3</span>
                <span>Formula &amp; Identity Table</span>
              </h3>

              <div className="bg-obsidian-surface border border-structural-dark rounded-2xl overflow-hidden shadow-block-dark">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-900 border-b border-structural-dark text-zinc-400 uppercase text-[10px] tracking-wider font-bold">
                      <tr>
                        <th className="p-3.5">Concept / Name</th>
                        <th className="p-3.5">Mathematical Formula</th>
                        <th className="p-3.5">Application &amp; Conditions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-structural-dark">
                      {activeChapter.chapterNotes.formulaTable.map((f) => (
                        <tr key={f.name} className="hover:bg-zinc-900/40 transition-colors">
                          <td className="p-3.5 font-bold text-white whitespace-nowrap">{f.name}</td>
                          <td className="p-3.5 font-mono text-royal-light font-bold">
                            <MathRenderer math={f.formula} />
                          </td>
                          <td className="p-3.5 text-zinc-300">{f.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

          </div>
        </main>
      )}

      {/* =========================================================================
          MODULE 6: BRIEF SUMMARY (STAGE 4)
          ========================================================================= */}
      {activeModule === 'BRIEF_SUMMARY' && (
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
          
          {/* Header */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 text-xs font-semibold mb-1 border border-yellow-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Module 6: Brief Summary</span>
            </div>
            <h2 className="text-2xl font-black text-white">
              Ch {activeChapter.number}: {activeChapter.title} — 2-Minute Summary
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Strictly concise summary only: Executive synopsis paragraph and 4 non-negotiable exam takeaways.
            </p>
          </div>

          <div className="space-y-6">
            
            {/* Executive Synopsis */}
            <div className="bg-alabaster text-obsidian rounded-2xl p-6 sm:p-8 border border-structural-light shadow-xl">
              <span className="text-xs font-extrabold uppercase tracking-wider text-royal block mb-2">
                Executive Chapter Synopsis
              </span>
              <p className="text-sm sm:text-base leading-relaxed text-zinc-800 font-medium">
                <RenderLatexText text={activeChapter.briefSummary.synopsis} />
              </p>
            </div>

            {/* 4 Core Takeaways */}
            <div className="bg-obsidian-surface border border-structural-dark rounded-2xl p-6 shadow-block-dark">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-4">
                4 Non-Negotiable Core Takeaways:
              </span>

              <div className="space-y-3.5">
                {activeChapter.briefSummary.coreTakeaways.map((takeaway) => (
                  <div key={`takeaway-${takeaway.slice(0, 20)}`} className="p-4 rounded-xl bg-obsidian-elevated border border-structural-dark flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-yellow-400/20 text-yellow-300 text-xs font-extrabold flex items-center justify-center flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                    <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-semibold">
                      <RenderLatexText text={takeaway} />
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Shortcuts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveModule('CHAPTER_TEST')}
                className="p-4 rounded-xl bg-royal hover:bg-royal-hover text-white text-xs font-bold transition-all shadow-md flex items-center justify-between"
              >
                <span>Test Knowledge: 10 Tough MCQs &rarr;</span>
                <Timer className="w-4 h-4 text-mint" />
              </button>
              <button
                type="button"
                onClick={() => setActiveModule('IMPORTANT_QS')}
                className="p-4 rounded-xl bg-obsidian-surface hover:bg-obsidian-elevated text-zinc-200 border border-structural-dark text-xs font-bold transition-all flex items-center justify-between"
              >
                <span>Practice Intext &amp; Exercise Solutions &rarr;</span>
                <Star className="w-4 h-4 text-amber" />
              </button>
            </div>

          </div>
        </main>
      )}

      {/* =========================================================================
          BOOKMARKS MODAL / DRAWER
          ========================================================================= */}
      {showBookmarksModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-obsidian-surface border border-structural-dark text-alabaster w-full max-w-lg rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-structural-dark">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-amber" />
                <h3 className="text-base font-extrabold text-white">Your Saved Bookmarks</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowBookmarksModal(false)}
                className="text-xs font-bold text-zinc-400 hover:text-white px-2 py-1 rounded bg-obsidian-elevated"
              >
                ✕ Close
              </button>
            </div>

            {bookmarks.length === 0 ? (
              <div className="text-center py-8 text-zinc-500 text-xs">
                <Bookmark className="w-8 h-8 text-zinc-600 mx-auto mb-2 opacity-50" />
                <p>No bookmarks saved yet.</p>
                <p className="mt-1">Click "Bookmark Page" while reading NCERT Books to save your place!</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                {bookmarks.map((b) => (
                  <div
                    key={b.key}
                    className="p-3 rounded-xl bg-obsidian-elevated border border-structural-dark flex items-center justify-between gap-3 hover:border-zinc-500 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-royal text-white">
                          {b.classLevel}
                        </span>
                        <span className="text-xs font-bold text-white truncate">
                          Ch {b.chapterNumber}: {b.chapterTitle}
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-400 mt-0.5 block">
                        Page {b.page} &bull; Saved {b.savedAt}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleJumpToBookmark(b)}
                        className="px-2.5 py-1 rounded-lg bg-amber hover:bg-amber-hover text-obsidian text-xs font-bold transition-colors"
                      >
                        Jump &rarr;
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBookmark(b.key)}
                        className="p-1 rounded-lg hover:bg-red-500/20 text-zinc-500 hover:text-red-400 transition-colors"
                        title="Delete Bookmark"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <LegalFooter />
      <CookieConsentBanner />

    </div>
  );
}
