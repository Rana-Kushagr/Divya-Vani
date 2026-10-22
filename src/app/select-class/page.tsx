'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Atom, 
  Calculator, 
  Globe, 
  BookOpen, 
  Languages, 
  Scroll, 
  ArrowRight, 
  CheckCircle2, 
  Bookmark, 
  Check, 
  Compass,
  FileText
} from 'lucide-react';
import { CLASS_LEVELS, SUBJECTS } from '@/lib/mockData';
import { SubjectId, BookmarkItem } from '@/lib/types';
import { getNcertBookCode } from '@/lib/ncertData';

export default function SelectClassPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>('Student');
  const [selectedClass, setSelectedClass] = useState<string>('class-9');
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>('science');
  const [activeBookmark, setActiveBookmark] = useState<BookmarkItem | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('divyavani_ncert_v4');
      if (stored) {
        const state = JSON.parse(stored);
        if (state.userName) setUserName(state.userName);
        if (state.selectedClass) setSelectedClass(state.selectedClass);
        if (state.selectedSubject) setSelectedSubject(state.selectedSubject);
        if (state.bookmarks && state.bookmarks.length > 0) {
          setActiveBookmark(state.bookmarks[0]);
        }
      } else {
        const legacyUser = localStorage.getItem('divyavani_user');
        if (legacyUser) {
          const user = JSON.parse(legacyUser);
          if (user.fullName) setUserName(user.fullName);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleSubjectIcon = (id: SubjectId) => {
    switch (id) {
      case 'science': return <Atom className="w-5 h-5 text-royal" />;
      case 'maths': return <Calculator className="w-5 h-5 text-mint" />;
      case 'social_science': return <Globe className="w-5 h-5 text-red-500" />;
      case 'english': return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'hindi': return <Languages className="w-5 h-5 text-amber" />;
      case 'sanskrit': return <Scroll className="w-5 h-5 text-purple-500" />;
      default: return <Sparkles className="w-5 h-5 text-royal" />;
    }
  };

  const handleProceed = () => {
    try {
      const stored = localStorage.getItem('divyavani_ncert_v4');
      const existing = stored ? JSON.parse(stored) : {};
      const updated = {
        ...existing,
        userName,
        selectedClass,
        selectedSubject,
      };
      localStorage.setItem('divyavani_ncert_v4', JSON.stringify(updated));
      localStorage.setItem('divyavani_selected_class', selectedClass);
      localStorage.setItem('divyavani_selected_subject', selectedSubject);

      router.push(`/learn/${selectedClass}/${selectedSubject}`);
    } catch (e) {
      router.push(`/learn/${selectedClass}/${selectedSubject}`);
    }
  };

  const handleResumeBookmark = () => {
    if (activeBookmark) {
      const normClass = activeBookmark.classLevel.toLowerCase().replace(/\s+/g, '-');
      const normSub = activeBookmark.subjectCode.toLowerCase();
      router.push(`/learn/${normClass}/${normSub}`);
    }
  };

  const currentClassObj = CLASS_LEVELS.find((c) => c.id === selectedClass) || CLASS_LEVELS[3];
  const currentSubjectObj = SUBJECTS.find((s) => s.id === selectedSubject) || SUBJECTS[0];
  const activeBookCode = getNcertBookCode(selectedClass, selectedSubject);

  return (
    <div className="min-h-screen bg-obsidian text-alabaster flex flex-col justify-between selection:bg-royal selection:text-white">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-structural-dark bg-obsidian sticky top-0 z-20">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-royal flex items-center justify-center text-white shadow-block-dark">
            <Sparkles className="w-4 h-4 text-mint" />
          </div>
          <span className="font-bold text-base tracking-tight text-white">Divyavani</span>
        </Link>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span>Student:</span>
          <span className="text-zinc-200 font-semibold">{userName}</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 sm:py-10">
        
        {/* Animated Welcome Banner */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-royal/20 border border-royal/40 text-royal-light text-xs font-semibold mb-3">
            <Compass className="w-3.5 h-3.5 text-mint" />
            <span>Gate 2: NCERT Selection Gateway</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome, {userName}! 👋
          </h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-lg mx-auto">
            Select your grade and subject to open the official NCERT textbook PDF reader and revision summary hub.
          </p>
        </div>

        {/* Smart Bookmark Resume Banner (if saved bookmark exists) */}
        {activeBookmark && (
          <div className="mb-8 p-4 rounded-2xl bg-amber/10 border border-amber/30 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber text-obsidian flex items-center justify-center font-bold flex-shrink-0">
                <Bookmark className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-400 text-sm">Resume Where You Left Off</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber/20 text-amber-200">
                    Saved Bookmark
                  </span>
                </div>
                <p className="text-xs text-zinc-300 mt-0.5">
                  {activeBookmark.classLevel} &bull; {activeBookmark.subjectName} &bull; Ch {activeBookmark.chapterNumber}: {activeBookmark.chapterTitle} (Page {activeBookmark.page})
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResumeBookmark}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber hover:bg-amber-hover text-obsidian font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <span>Resume Reading</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Step 1: Select Your Class (Classes 6 to 12) */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-zinc-800 text-alabaster flex items-center justify-center text-[11px] font-mono">1</span>
              <span>Select Your Class</span>
            </h2>
            <span className="text-xs text-zinc-500 font-medium">Official NCERT Grades 6–12</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
            {CLASS_LEVELS.map((cls) => {
              const isSelected = selectedClass === cls.id;
              return (
                <button
                  key={cls.id}
                  type="button"
                  onClick={() => setSelectedClass(cls.id)}
                  className={`p-3.5 rounded-xl border text-center transition-all duration-150 flex flex-col items-center justify-between min-h-[92px] group relative ${
                    isSelected
                      ? 'bg-royal border-royal text-white shadow-lg ring-2 ring-royal/40 scale-[1.02]'
                      : 'bg-obsidian-surface border-structural-dark text-zinc-300 hover:border-zinc-600 hover:bg-obsidian-elevated'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {cls.badge}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-mint" />}
                  </div>

                  <div className="my-1.5">
                    <span className="text-base font-extrabold tracking-tight block">
                      {cls.name}
                    </span>
                  </div>

                  <span className={`text-[10px] truncate max-w-full ${
                    isSelected ? 'text-white/80' : 'text-zinc-500'
                  }`}>
                    {cls.stage}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 2: Select Your Subject (6 Subjects) */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-zinc-800 text-alabaster flex items-center justify-center text-[11px] font-mono">2</span>
              <span>Select Your Subject</span>
            </h2>
            <span className="text-xs text-zinc-500 font-medium">Textbook PDFs & Summaries</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {SUBJECTS.map((sub) => {
              const isSelected = selectedSubject === sub.id;
              const bookCode = getNcertBookCode(selectedClass, sub.id);
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setSelectedSubject(sub.id)}
                  className={`p-4 rounded-xl border text-left transition-all duration-150 flex items-start gap-3.5 group relative ${
                    isSelected
                      ? 'bg-white text-obsidian border-white shadow-xl ring-2 ring-white/50 scale-[1.02]'
                      : 'bg-obsidian-surface border-structural-dark text-zinc-300 hover:border-zinc-600 hover:bg-obsidian-elevated'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${
                    isSelected ? 'bg-zinc-100 shadow-sm' : 'bg-obsidian-elevated border border-structural-dark'
                  }`}>
                    {handleSubjectIcon(sub.id)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`font-bold text-sm truncate ${
                        isSelected ? 'text-obsidian' : 'text-white'
                      }`}>
                        {sub.name}
                      </span>
                      <span className={`text-xs font-medium ${
                        isSelected ? 'text-royal' : 'text-zinc-400'
                      }`}>
                        {sub.hindiName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                        isSelected ? 'bg-zinc-200 text-zinc-800' : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        NCERT: {bookCode}
                      </span>
                      <span className={`text-[11px] truncate ${
                        isSelected ? 'text-zinc-500' : 'text-zinc-400'
                      }`}>
                        Official Textbook PDF
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="absolute right-3 top-3">
                      <div className="w-5 h-5 rounded-full bg-royal text-white flex items-center justify-center">
                        <Check className="w-3 h-3 text-mint" />
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Action Gate Button */}
        <div className="bg-alabaster text-obsidian rounded-2xl p-5 sm:p-6 border border-structural-light shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-royal">
                Ready to Enter
              </span>
              <span className="text-xs text-zinc-400">&bull;</span>
              <span className="text-xs font-semibold text-zinc-700">
                {currentClassObj.name} &bull; {currentSubjectObj.name} (Code: {activeBookCode})
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Opens the distraction-free NCERT textbook reader with zoom, page navigation, and chapter summaries.
            </p>
          </div>

          <button
            type="button"
            onClick={handleProceed}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-royal hover:bg-royal-hover text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2.5 group min-h-[48px]"
          >
            <span>Open NCERT Book PDFs</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-3 px-6 text-center text-xs text-zinc-500 border-t border-structural-dark">
        Divyavani AI Educational Platform &bull; Conceived by Vanshika & Divyanshi (Class IX-H) &bull; Master NCERT Reader Edition
      </footer>
    </div>
  );
}
