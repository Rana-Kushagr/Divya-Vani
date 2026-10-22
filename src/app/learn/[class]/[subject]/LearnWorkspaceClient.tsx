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
  Layers, 
  FileText, 
  Compass, 
  Printer, 
  Trash2, 
  Sun, 
  Moon, 
  BookMarked,
  ShieldCheck,
  Flame,
  Award,
  ChevronDown
} from 'lucide-react';

import { SubjectId, BookmarkItem, ChapterSummary } from '@/lib/types';
import { CLASS_LEVELS, SUBJECTS } from '@/lib/mockData';
import { 
  getNcertBookCode, 
  getNcertPdfUrl, 
  getNcertChapters, 
  getChapterSummary, 
  NcertChapterDetail,
  NCERT_BOOK_CODES
} from '@/lib/ncertData';
import MathRenderer from '@/components/solver/MathRenderer';
import CookieConsentBanner from '@/components/legal/CookieConsentBanner';
import LegalFooter from '@/components/layout/LegalFooter';

interface LearnWorkspaceClientProps {
  routeParams?: { class: string; subject: string };
}

type SurfView = 'READER' | 'SUMMARY' | 'BOOKMARKS' | 'BLUEPRINT';
type ReaderFilter = 'light' | 'sepia' | 'dark';
type ReaderMode = 'INTERACTIVE' | 'OFFICIAL_EMBED';

export default function LearnWorkspaceClient({ routeParams }: LearnWorkspaceClientProps) {
  const router = useRouter();

  const currentClass = (routeParams?.class || 'class-9').toLowerCase();
  const currentSubject = (routeParams?.subject || 'science').toLowerCase() as SubjectId;

  // Active Surf View
  const [activeView, setActiveView] = useState<SurfView>('READER');

  // Chapters list from NCERT Data
  const chapters = getNcertChapters(currentClass, currentSubject);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(0);
  const activeChapter = chapters[selectedChapterIndex] || chapters[0];

  // Reader Controls
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [readerFilter, setReaderFilter] = useState<ReaderFilter>('light');
  const [readerMode, setReaderMode] = useState<ReaderMode>('INTERACTIVE');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('Student');

  // Bookmarks and Completion State
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [completedChapters, setCompletedChapters] = useState<Record<string, boolean>>({});
  const [bookmarkNotification, setBookmarkNotification] = useState<string | null>(null);

  // Dropdown states for Class and Subject quick switch
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);

  const readerContainerRef = useRef<HTMLDivElement>(null);

  // Initialize and load state from localStorage ('divyavani_ncert_v4')
  useEffect(() => {
    try {
      const stored = localStorage.getItem('divyavani_ncert_v4');
      if (stored) {
        const state = JSON.parse(stored);
        if (state.userName) setUserName(state.userName);
        if (state.bookmarks) setBookmarks(state.bookmarks);
        if (state.completedChapters) setCompletedChapters(state.completedChapters);
        if (state.readerFilter) setReaderFilter(state.readerFilter);
        if (state.readerMode) setReaderMode(state.readerMode);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Sync state to localStorage on update
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
        readerMode,
        readerTheme: readerFilter,
        bookmarks: newBookmarks !== undefined ? newBookmarks : bookmarks,
        completedChapters: newCompleted !== undefined ? newCompleted : completedChapters,
      };
      localStorage.setItem('divyavani_ncert_v4', JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
  };

  const showToast = (msg: string) => {
    setBookmarkNotification(msg);
    setTimeout(() => setBookmarkNotification(null), 3000);
  };

  // Bookmark active page
  const handleBookmarkPage = () => {
    const key = `${currentClass}|${currentSubject}|${selectedChapterIndex}`;
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

  // Complete chapter & auto-bookmark next
  const handleCompleteChapter = () => {
    const chapterKey = `${currentClass}|${currentSubject}|${activeChapter.number}`;
    const updatedCompleted = { ...completedChapters, [chapterKey]: true };
    setCompletedChapters(updatedCompleted);

    // Auto-bookmark next chapter if available
    if (selectedChapterIndex < chapters.length - 1) {
      const nextIdx = selectedChapterIndex + 1;
      const nextCh = chapters[nextIdx];
      const nextKey = `${currentClass}|${currentSubject}|${nextIdx}`;
      const nextBookmark: BookmarkItem = {
        key: nextKey,
        classLevel: currentClassObj.name,
        subjectCode: currentSubject,
        subjectName: currentSubjectObj.name,
        chapterIndex: nextIdx,
        chapterNumber: nextCh.number,
        chapterTitle: nextCh.title,
        page: 1,
        pdfUrl: nextCh.pdfUrl,
        savedAt: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      };
      const filtered = bookmarks.filter((b) => b.key !== nextKey);
      const updatedBookmarks = [nextBookmark, ...filtered];
      setBookmarks(updatedBookmarks);
      persistState(updatedBookmarks, updatedCompleted);
      setSelectedChapterIndex(nextIdx);
      setCurrentPage(1);
      showToast(`Ch ${activeChapter.number} Completed! Auto-bookmarked Ch ${nextCh.number}`);
    } else {
      persistState(undefined, updatedCompleted);
      showToast(`Congratulations! You completed all chapters of ${currentSubjectObj.name}!`);
    }
  };

  // Delete bookmark
  const handleDeleteBookmark = (key: string) => {
    const updated = bookmarks.filter((b) => b.key !== key);
    setBookmarks(updated);
    persistState(updated);
    showToast('Bookmark removed');
  };

  // Jump to bookmark
  const handleJumpToBookmark = (b: BookmarkItem) => {
    const targetClass = b.classLevel.toLowerCase().replace(/\s+/g, '-');
    const targetSub = b.subjectCode.toLowerCase();

    if (targetClass === currentClass && targetSub === currentSubject) {
      setSelectedChapterIndex(b.chapterIndex);
      setCurrentPage(b.page);
      setActiveView('READER');
    } else {
      router.push(`/learn/${targetClass}/${targetSub}`);
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      readerContainerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const currentClassObj = CLASS_LEVELS.find((c) => c.id === currentClass) || { name: 'Class 9', id: 'class-9' };
  const currentSubjectObj = SUBJECTS.find((s) => s.id === currentSubject) || SUBJECTS[0];
  const bookCode = getNcertBookCode(currentClass, currentSubject);
  const chapterSummary = getChapterSummary(currentClass, currentSubject, activeChapter.number, activeChapter.title);

  const isCurrentChapterCompleted = !!completedChapters[`${currentClass}|${currentSubject}|${activeChapter.number}`];

  return (
    <div className="min-h-screen bg-obsidian text-alabaster flex flex-col selection:bg-royal selection:text-white">
      
      {/* Toast Notification */}
      {bookmarkNotification && (
        <div className="fixed top-16 right-6 z-50 bg-mint text-obsidian px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-obsidian" />
          <span>{bookmarkNotification}</span>
        </div>
      )}

      {/* =========================================================================
          BLOCK 1: ALABASTER WHITE TOP NAVBAR (#FFFFFF)
          Brand, Class & Subject Instant Selectors, and 4 Surf View Tabs
          ========================================================================= */}
      <header className="bg-alabaster text-obsidian border-b border-structural-light sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          
          {/* Brand & Concept Attribution */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-royal flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4 text-mint" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-obsidian">Divyavani</span>
                <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wider bg-royal/10 text-royal px-1.5 py-0.5 rounded">
                  NCERT Portal
                </span>
              </div>
            </Link>

            {/* Instant Switch Class Dropdown */}
            <div className="relative ml-2">
              <button
                type="button"
                onClick={() => { setShowClassDropdown(!showClassDropdown); setShowSubjectDropdown(false); }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-zinc-800 transition-colors border border-zinc-200"
              >
                <span>{currentClassObj.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
              </button>

              {showClassDropdown && (
                <div className="absolute left-0 top-full mt-1 w-44 bg-white rounded-xl shadow-2xl border border-zinc-200 py-1.5 z-50">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase text-zinc-400">Switch Class:</div>
                  {CLASS_LEVELS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setShowClassDropdown(false);
                        router.push(`/learn/${c.id}/${currentSubject}`);
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

            {/* Instant Switch Subject Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => { setShowSubjectDropdown(!showSubjectDropdown); setShowClassDropdown(false); }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-royal/10 hover:bg-royal/20 text-xs font-bold text-royal transition-colors border border-royal/20"
              >
                <span>{currentSubjectObj.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-royal" />
              </button>

              {showSubjectDropdown && (
                <div className="absolute left-0 top-full mt-1 w-52 bg-white rounded-xl shadow-2xl border border-zinc-200 py-1.5 z-50">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase text-zinc-400">Switch Subject:</div>
                  {SUBJECTS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setShowSubjectDropdown(false);
                        router.push(`/learn/${currentClass}/${s.id}`);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-xs font-semibold flex items-center justify-between hover:bg-zinc-100 ${
                        s.id === currentSubject ? 'text-royal font-bold bg-royal/5' : 'text-zinc-700'
                      }`}
                    >
                      <span>{s.name}</span>
                      <span className="text-[10px] text-zinc-400 font-hindi">{s.hindiName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 4 Clean Surf View Tabs */}
          <nav className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveView('READER')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeView === 'READER'
                  ? 'bg-white text-obsidian shadow-sm'
                  : 'text-zinc-500 hover:text-obsidian'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-royal" />
              <span>NCERT Book PDF</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('SUMMARY')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeView === 'SUMMARY'
                  ? 'bg-white text-obsidian shadow-sm'
                  : 'text-zinc-500 hover:text-obsidian'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-mint" />
              <span>Chapter Summary</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('BOOKMARKS')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeView === 'BOOKMARKS'
                  ? 'bg-white text-obsidian shadow-sm'
                  : 'text-zinc-500 hover:text-obsidian'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-amber" />
              <span>Bookmarks</span>
              {bookmarks.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber text-white text-[10px] flex items-center justify-center font-bold">
                  {bookmarks.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveView('BLUEPRINT')}
              className={`hidden sm:flex px-3 py-1.5 rounded-lg transition-all items-center gap-1.5 ${
                activeView === 'BLUEPRINT'
                  ? 'bg-white text-obsidian shadow-sm'
                  : 'text-zinc-500 hover:text-obsidian'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              <span>Blueprint</span>
            </button>
          </nav>

          {/* Student Greeting */}
          <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-zinc-500">
            <span className="w-2 h-2 rounded-full bg-mint" />
            <span>Hi, {userName}</span>
          </div>

        </div>
      </header>

      {/* =========================================================================
          BLOCK 2: OBSIDIAN BLACK READER COMMAND STRIP (#09090B)
          Chapter Selector, Zoom, Pages, Reading Filters, Bookmark & Complete Ch
          ========================================================================= */}
      {activeView === 'READER' && (
        <div className="bg-obsidian border-b border-structural-dark px-4 lg:px-6 py-2.5 shadow-block-dark sticky top-[57px] z-30">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            
            {/* Left: Chapter Selector Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="chapter-selector" className="text-zinc-400 font-bold uppercase text-[10px] tracking-wider whitespace-nowrap">
                Chapter:
              </label>
              <select
                id="chapter-selector"
                value={selectedChapterIndex}
                onChange={(e) => {
                  setSelectedChapterIndex(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-obsidian-elevated text-alabaster font-semibold px-3 py-1.5 rounded-lg border border-structural-dark hover:border-zinc-600 focus:border-royal transition-colors cursor-pointer max-w-[260px] truncate"
              >
                {chapters.map((ch, idx) => (
                  <option key={ch.number} value={idx} className="bg-obsidian">
                    Ch {ch.number}: {ch.title}
                  </option>
                ))}
              </select>

              {isCurrentChapterCompleted && (
                <span className="flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-mint/20 text-mint border border-mint/40">
                  <Check className="w-3 h-3" />
                  <span>Done</span>
                </span>
              )}
            </div>

            {/* Center: Zoom & Page Navigation */}
            <div className="flex items-center gap-3">
              
              {/* Zoom Controls */}
              <div className="flex items-center bg-obsidian-elevated border border-structural-dark rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(70, z - 15))}
                  className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  title="Zoom Out (−)"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(100)}
                  className="px-2 text-[11px] font-mono font-bold text-zinc-300 hover:text-white"
                  title="Reset to 100%"
                >
                  {zoomLevel}%
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(160, z + 15))}
                  className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  title="Zoom In (+)"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Page Navigator */}
              <div className="flex items-center bg-obsidian-elevated border border-structural-dark rounded-lg px-1.5 py-0.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="p-1 text-zinc-400 hover:text-white disabled:opacity-30"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono text-zinc-300 px-2 font-semibold">
                  Page {currentPage} of {activeChapter.pageCount}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(activeChapter.pageCount, p + 1))}
                  disabled={currentPage >= activeChapter.pageCount}
                  className="p-1 text-zinc-400 hover:text-white disabled:opacity-30"
                  title="Next Page"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Reading Filters (Paper / Sepia / Night) */}
              <div className="hidden sm:flex items-center bg-obsidian-elevated border border-structural-dark rounded-lg p-0.5 gap-1">
                <button
                  type="button"
                  onClick={() => setReaderFilter('light')}
                  className={`px-2 py-1 rounded text-[11px] font-bold ${
                    readerFilter === 'light' ? 'bg-white text-obsidian' : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Paper (White sheet)"
                >
                  Paper
                </button>
                <button
                  type="button"
                  onClick={() => setReaderFilter('sepia')}
                  className={`px-2 py-1 rounded text-[11px] font-bold ${
                    readerFilter === 'sepia' ? 'bg-[#FDF6E2] text-[#5C4B37]' : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Sepia (Warm tone eye-saver)"
                >
                  Sepia
                </button>
                <button
                  type="button"
                  onClick={() => setReaderFilter('dark')}
                  className={`px-2 py-1 rounded text-[11px] font-bold ${
                    readerFilter === 'dark' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Night (Dark mode)"
                >
                  Night
                </button>
              </div>

              {/* Mode Toggle: Interactive vs Official Embed */}
              <div className="hidden md:flex items-center bg-obsidian-elevated border border-structural-dark rounded-lg p-0.5 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setReaderMode('INTERACTIVE')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    readerMode === 'INTERACTIVE' ? 'bg-royal text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Sheet
                </button>
                <button
                  type="button"
                  onClick={() => setReaderMode('OFFICIAL_EMBED')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    readerMode === 'OFFICIAL_EMBED' ? 'bg-royal text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  PDF Embed
                </button>
              </div>
            </div>

            {/* Right: Bookmark & Complete Chapter */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleBookmarkPage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs border border-zinc-700 transition-colors shadow-sm"
                title="Bookmark current page for 1-click resume"
              >
                <Bookmark className="w-3.5 h-3.5 text-amber" />
                <span>Bookmark Page</span>
              </button>

              <button
                type="button"
                onClick={handleCompleteChapter}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-mint hover:bg-mint-hover text-obsidian font-extrabold text-xs shadow-sm transition-colors"
                title="Mark chapter complete and auto-bookmark next chapter"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Complete Ch</span>
              </button>

              <button
                type="button"
                onClick={toggleFullscreen}
                className="p-1.5 rounded-lg bg-obsidian-elevated border border-structural-dark hover:border-zinc-600 text-zinc-400 hover:text-white transition-colors"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          BLOCK 3: MAIN VIEWPORT (DISTRACTION-FREE CANVAS)
          View 1: NCERT Book Reader
          View 2: Pre-Generated Chapter Summary Hub
          View 3: Saved Bookmarks Manager
          View 4: Architecture Blueprint
          ========================================================================= */}
      <main ref={readerContainerRef} className="flex-1 bg-alabaster text-obsidian p-3 sm:p-6 flex flex-col">
        <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
          
          {/* VIEW 1: OFFICIAL NCERT BOOK PDF READER */}
          {activeView === 'READER' && (
            <div className="flex-1 flex flex-col space-y-4">
              
              {/* Official NCERT Header Ribbon */}
              <div className="bg-alabaster-muted border border-structural-light rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-obsidian text-sm">
                    {currentClassObj.name} {currentSubjectObj.name} &bull; Ch {activeChapter.number}: {activeChapter.title}
                  </span>
                  <span className="text-[10px] font-mono uppercase bg-zinc-200 text-zinc-800 font-bold px-1.5 py-0.5 rounded">
                    Code: {activeChapter.bookCode}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={activeChapter.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-royal font-bold hover:underline"
                  >
                    <span>Official NCERT PDF ({activeChapter.bookCode}{String(activeChapter.number).padStart(2, '0')}.pdf)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    type="button"
                    onClick={() => setActiveView('SUMMARY')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-royal text-white font-bold hover:bg-royal-hover shadow-sm"
                  >
                    <Sparkles className="w-3 h-3 text-mint" />
                    <span>View Summary</span>
                  </button>
                </div>
              </div>

              {/* Reader Viewport */}
              {readerMode === 'INTERACTIVE' ? (
                <div 
                  className={`flex-1 rounded-2xl p-6 sm:p-10 border transition-all shadow-md overflow-y-auto min-h-[600px] ${
                    readerFilter === 'sepia' 
                      ? 'bg-[#FBF0D9] text-[#433422] border-[#E8D7B8]' 
                      : readerFilter === 'dark'
                        ? 'bg-[#18181B] text-[#F4F4F5] border-zinc-800'
                        : 'bg-white text-obsidian border-structural-light'
                  }`}
                  style={{ fontSize: `${(zoomLevel / 100) * 15}px` }}
                >
                  {/* Textbook Sheet Title */}
                  <div className="border-b border-current/15 pb-4 mb-6">
                    <div className="text-xs uppercase tracking-widest font-mono font-bold opacity-60">
                      National Council of Educational Research and Training &bull; CBSE Class {currentClass.replace('class-', '')}
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                      Chapter {activeChapter.number}: {activeChapter.title}
                    </h1>
                    {activeChapter.hindiTitle && (
                      <div className="text-sm font-semibold opacity-75 font-hindi mt-0.5">
                        {activeChapter.hindiTitle}
                      </div>
                    )}
                  </div>

                  {/* Textbook Passage Content */}
                  <div className="space-y-4 font-sans leading-relaxed whitespace-pre-line max-w-3xl">
                    {activeChapter.previewText}
                  </div>

                  {/* Page Footer Navigation Ribbon */}
                  <div className="mt-12 pt-4 border-t border-current/15 flex items-center justify-between text-xs font-semibold opacity-70">
                    <span>NCERT Class {currentClass.replace('class-', '')} &bull; Page {currentPage} of {activeChapter.pageCount}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage <= 1}
                        className="px-2 py-1 rounded bg-black/10 hover:bg-black/20 disabled:opacity-30"
                      >
                        Previous Page
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.min(activeChapter.pageCount, p + 1))}
                        disabled={currentPage >= activeChapter.pageCount}
                        className="px-2 py-1 rounded bg-black/10 hover:bg-black/20 disabled:opacity-30"
                      >
                        Next Page
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* PDF Embed View */
                <div className="flex-1 rounded-2xl overflow-hidden border border-structural-light bg-zinc-100 min-h-[640px] flex flex-col shadow-md">
                  <div className="p-3 bg-zinc-200 border-b border-zinc-300 flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-700">Official NCERT Document Stream: {activeChapter.pdfUrl}</span>
                    <a
                      href={activeChapter.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded bg-royal text-white font-bold hover:bg-royal-hover flex items-center gap-1"
                    >
                      <span>Open Direct PDF</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <iframe
                    src={activeChapter.pdfUrl}
                    title={activeChapter.title}
                    className="w-full flex-1 min-h-[600px] border-none"
                  />
                </div>
              )}

            </div>
          )}

          {/* VIEW 2: PRE-GENERATED CHAPTER SUMMARY HUB */}
          {activeView === 'SUMMARY' && (
            <div className="space-y-6">
              
              {/* Summary Header & Chapter Picker */}
              <div className="bg-alabaster-muted border border-structural-light rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-royal/10 text-royal text-xs font-bold mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-mint" />
                      <span>Pre-Generated NCERT Summary Hub</span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-obsidian tracking-tight">
                      {currentClassObj.name} {currentSubjectObj.name} &bull; Ch {activeChapter.number}: {activeChapter.title}
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      Exam-ready core concepts, formula vaults, and high-weightage CBSE marking questions.
                    </p>
                  </div>

                  {/* Chapter switcher pills */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold uppercase text-zinc-400 mr-1">Switch Ch:</span>
                    {chapters.map((ch, idx) => (
                      <button
                        key={ch.number}
                        type="button"
                        onClick={() => setSelectedChapterIndex(idx)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                          idx === selectedChapterIndex
                            ? 'bg-royal text-white shadow-sm'
                            : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
                        }`}
                        title={ch.title}
                      >
                        {ch.number}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 1. Executive Overview Card */}
              <div className="bg-white border border-structural-light rounded-2xl p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-royal flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-royal" />
                  <span>Executive Chapter Overview</span>
                </h3>
                <p className="text-sm text-zinc-700 leading-relaxed font-sans">
                  {chapterSummary.overview}
                </p>
              </div>

              {/* 2. Core Concepts Breakdown */}
              <div className="bg-white border border-structural-light rounded-2xl p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-royal flex items-center gap-2 mb-4">
                  <Layers className="w-4 h-4 text-mint" />
                  <span>Core Pedagogical Concepts & Proofs</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {chapterSummary.coreConcepts.map((concept, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                      <h4 className="font-bold text-sm text-obsidian mb-1">{concept.title}</h4>
                      <p className="text-xs text-zinc-600 leading-relaxed">{concept.description}</p>
                      {concept.latexFormula && (
                        <div className="mt-2.5 p-2 rounded-lg bg-white border border-zinc-200 text-xs">
                          <MathRenderer math={concept.latexFormula} block={true} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Formula & Theorem Vault */}
              <div className="bg-white border border-structural-light rounded-2xl p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-2 mb-4">
                  <Flame className="w-4 h-4 text-amber" />
                  <span>Formula & Theorem Vault</span>
                </h3>

                <div className="space-y-3">
                  {chapterSummary.formulaAndTheorems.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-amber/5 border border-amber/20 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <span className="font-bold text-sm text-obsidian block">{item.name}</span>
                        <span className="text-xs text-zinc-500">{item.statement}</span>
                        {item.siUnitsOrConditions && (
                          <span className="text-[11px] text-amber-700 font-mono block mt-0.5">
                            Conditions / SI: {item.siUnitsOrConditions}
                          </span>
                        )}
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-amber/30 text-xs font-mono">
                        <MathRenderer math={item.formulaLatex} block={false} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. High-Weightage NCERT Exam Questions */}
              <div className="bg-white border border-structural-light rounded-2xl p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-royal flex items-center gap-2 mb-4">
                  <Award className="w-4 h-4 text-royal" />
                  <span>High-Weightage CBSE Exam Questions</span>
                </h3>

                <div className="space-y-3">
                  {chapterSummary.highWeightageQuestions.map((q, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-royal text-white">
                          {q.type}
                        </span>
                        <span className="text-xs font-bold text-obsidian">{q.question}</span>
                      </div>
                      <div className="text-xs text-zinc-600 bg-white p-2.5 rounded-lg border border-zinc-200 mt-2">
                        <strong className="text-zinc-800">Exam Solution Key: </strong>
                        {q.solutionHint}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveView('READER')}
                  className="px-4 py-2 rounded-xl bg-zinc-200 hover:bg-zinc-300 text-obsidian font-bold text-xs transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to NCERT Reader</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-royal hover:bg-royal-hover text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Revision Sheet</span>
                </button>
              </div>

            </div>
          )}

          {/* VIEW 3: SAVED BOOKMARKS & COMPLETED CHAPTERS MANAGER */}
          {activeView === 'BOOKMARKS' && (
            <div className="space-y-6">
              <div className="bg-alabaster-muted border border-structural-light rounded-2xl p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-obsidian tracking-tight flex items-center gap-2">
                    <Bookmark className="w-6 h-6 text-amber" />
                    <span>Saved Bookmarks & Completed Chapters</span>
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Pick up right where you left off. Saved locally in your browser.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-royal">{bookmarks.length}</span>
                  <span className="text-xs text-zinc-400 block font-bold uppercase">Active Bookmarks</span>
                </div>
              </div>

              {bookmarks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bookmarks.map((b) => (
                    <div
                      key={b.key}
                      className="bg-white border border-structural-light rounded-xl p-4 shadow-sm flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-royal/10 text-royal">
                            {b.classLevel} &bull; {b.subjectName}
                          </span>
                          <h4 className="font-bold text-sm text-obsidian mt-1.5">
                            Ch {b.chapterNumber}: {b.chapterTitle}
                          </h4>
                          <span className="text-xs font-semibold text-zinc-500">
                            Bookmarked at Page {b.page} &bull; {b.savedAt}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteBookmark(b.key)}
                          className="p-1.5 rounded text-zinc-400 hover:text-red-500 transition-colors"
                          title="Delete bookmark"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleJumpToBookmark(b)}
                        className="w-full py-2 rounded-lg bg-royal hover:bg-royal-hover text-white text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span>Resume from Page {b.page}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-structural-light rounded-2xl p-12 text-center text-zinc-400 shadow-sm">
                  <Bookmark className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                  <h4 className="font-bold text-obsidian text-base">No Saved Bookmarks Yet</h4>
                  <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                    While reading any NCERT chapter, click <strong>"Bookmark Page"</strong> in the top toolbar to save your exact reading position.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveView('READER')}
                    className="mt-4 px-4 py-2 rounded-xl bg-royal text-white font-bold text-xs"
                  >
                    Open NCERT Reader
                  </button>
                </div>
              )}

              {/* Completed Chapters List */}
              <div className="bg-white border border-structural-light rounded-2xl p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-mint flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-mint" />
                  <span>Completed Chapter Achievements</span>
                </h3>

                {Object.keys(completedChapters).length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(completedChapters).map((key) => {
                      const parts = key.split('|');
                      return (
                        <div key={key} className="px-3 py-1.5 rounded-lg bg-mint/10 border border-mint/30 text-mint text-xs font-bold flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          <span>{parts[0]} &bull; {parts[1].toUpperCase()} &bull; Ch {parts[2]}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500">
                    Click <strong>"Complete Ch"</strong> in the reading toolbar after finishing a chapter to log your progress!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* VIEW 4: MASTER ENGINEERING BLUEPRINT VIEW */}
          {activeView === 'BLUEPRINT' && (
            <div className="bg-white border border-structural-light rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="border-b border-zinc-200 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-royal font-mono">
                  Master Product & Engineering Blueprint
                </span>
                <h2 className="text-2xl font-extrabold text-obsidian tracking-tight mt-1">
                  Divyavani AI — NCERT Reader & Summary Edition
                </h2>
                <p className="text-xs text-zinc-500 mt-1">
                  Next-Generation Distraction-Free NCERT Study Portal Benchmarked Against NextToppers & Extramarks
                </p>
              </div>

              {/* Architecture 3-Gate Flow */}
              <div>
                <h3 className="font-bold text-sm text-obsidian mb-2">1. The 3-Gate Student Journey</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                    <span className="font-bold text-royal block">Gate 1: Name-Only Entry</span>
                    <p className="text-zinc-600 mt-1">Zero backend login friction. Students enter only their Name ("What is your name?") with zero passwords or OTPs.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                    <span className="font-bold text-royal block">Gate 2: Welcome & Selection</span>
                    <p className="text-zinc-600 mt-1">Personalized greeting ("Welcome, [Name]! 👋") with 1-click Bookmark Resume and Class (6–12) & Subject grid.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                    <span className="font-bold text-royal block">Gate 3: NCERT Workspace</span>
                    <p className="text-zinc-600 mt-1">Official NCERT Book PDF reader with Zoom, Reading Filters, Bookmark Page, and Pre-Generated Chapter Summaries.</p>
                  </div>
                </div>
              </div>

              {/* Official NCERT Textbook Code Matrix Table */}
              <div>
                <h3 className="font-bold text-sm text-obsidian mb-2">2. Official NCERT Textbook Code Matrix (ncert.nic.in)</h3>
                <div className="overflow-x-auto rounded-xl border border-zinc-200">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-zinc-100 border-b border-zinc-200 text-zinc-700 font-bold">
                      <tr>
                        <th className="p-2.5">Class</th>
                        <th className="p-2.5">Science / Physics</th>
                        <th className="p-2.5">Mathematics</th>
                        <th className="p-2.5">Social Science</th>
                        <th className="p-2.5">English</th>
                        <th className="p-2.5">Hindi</th>
                        <th className="p-2.5">Sanskrit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 font-mono text-zinc-600">
                      {['class-6', 'class-7', 'class-8', 'class-9', 'class-10', 'class-11', 'class-12'].map((cls) => {
                        const codes = NCERT_BOOK_CODES[cls];
                        return (
                          <tr key={cls} className={cls === currentClass ? 'bg-royal/5 font-bold text-royal' : ''}>
                            <td className="p-2.5 font-sans font-bold">{cls.replace('class-', 'Class ')}</td>
                            <td className="p-2.5">{codes.science}</td>
                            <td className="p-2.5">{codes.maths}</td>
                            <td className="p-2.5">{codes.social_science}</td>
                            <td className="p-2.5">{codes.english}</td>
                            <td className="p-2.5">{codes.hindi}</td>
                            <td className="p-2.5">{codes.sanskrit}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Double Palette Description */}
              <div className="p-4 rounded-xl bg-zinc-100 border border-zinc-200 text-xs">
                <span className="font-bold text-obsidian block mb-1">Synchronized Double-Palette Rhythm (White → Black → White)</span>
                <p className="text-zinc-600">
                  Block 1 (Alabaster White Header) houses branding & navigation; Block 2 (Obsidian Black Toolbar) concentrates reader commands; Block 3 (Alabaster White Canvas) eliminates eye strain during hours of academic reading.
                </p>
              </div>

            </div>
          )}

        </div>
      </main>

      <CookieConsentBanner />
      <LegalFooter />

    </div>
  );
}
