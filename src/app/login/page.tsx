'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  User, 
  CheckCircle2, 
  ShieldCheck, 
  GraduationCap,
  Bookmark,
  Zap
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [savedBookmark, setSavedBookmark] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('divyavani_ncert_v4');
      if (stored) {
        const state = JSON.parse(stored);
        if (state.userName) setName(state.userName);
        if (state.bookmarks && state.bookmarks.length > 0) {
          setSavedBookmark(state.bookmarks[0]);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleContinue = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalName = name.trim() || 'Student';

    try {
      // Retrieve existing state or initialize new
      const stored = localStorage.getItem('divyavani_ncert_v4');
      const existingState = stored ? JSON.parse(stored) : {};
      
      const updatedState = {
        ...existingState,
        userName: finalName,
        selectedClass: existingState.selectedClass || 'class-9',
        selectedSubject: existingState.selectedSubject || 'science',
      };
      
      localStorage.setItem('divyavani_ncert_v4', JSON.stringify(updatedState));
      localStorage.setItem('divyavani_user', JSON.stringify({ fullName: finalName, id: 'student-local' }));

      // If a bookmark exists, student can still go to select-class to resume
      router.push('/select-class');
    } catch (err) {
      router.push('/select-class');
    }
  };

  const handleQuickName = (selectedName: string) => {
    setName(selectedName);
  };

  const handleDirectResume = () => {
    if (savedBookmark) {
      const normClass = savedBookmark.classLevel.toLowerCase().replace(/\s+/g, '-');
      const normSub = savedBookmark.subjectCode.toLowerCase();
      router.push(`/learn/${normClass}/${normSub}`);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-alabaster flex flex-col justify-between selection:bg-royal selection:text-white">
      {/* Top Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-structural-dark">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-royal flex items-center justify-center text-white shadow-block-dark">
            <Sparkles className="w-4 h-4 text-mint" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white">Divyavani</span>
            <span className="ml-2 text-[10px] font-semibold bg-royal/40 text-royal-light border border-royal/60 px-1.5 py-0.5 rounded">
              NCERT Edition
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <ShieldCheck className="w-4 h-4 text-mint" />
          <span>Zero-Backend &bull; 100% Privacy</span>
        </div>
      </header>

      {/* Main Entry Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-alabaster text-obsidian rounded-2xl shadow-2xl border border-structural-light p-6 sm:p-8">
          
          {/* Card Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-royal text-white mb-3 shadow-md">
              <BookOpen className="w-6 h-6 text-mint" />
            </div>
            <h1 className="text-2xl font-extrabold text-obsidian tracking-tight">
              Welcome to Divyavani
            </h1>
            <p className="text-xs text-zinc-500 mt-1 font-medium">
              Official NCERT Textbook Reader & Pre-Generated Chapter Summaries
            </p>
          </div>

          {/* Quick Resume Banner if Bookmark Exists */}
          {savedBookmark && (
            <div className="mb-5 p-3 rounded-xl bg-amber/10 border border-amber/30 text-obsidian flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Bookmark className="w-4 h-4 text-amber flex-shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-amber-900 block">Resume Saved Bookmark:</span>
                  <span className="text-zinc-600 truncate max-w-[190px] block">
                    {savedBookmark.classLevel} &bull; Ch {savedBookmark.chapterNumber}: {savedBookmark.chapterTitle}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDirectResume}
                className="px-2.5 py-1.5 rounded-lg bg-amber hover:bg-amber-hover text-white text-xs font-bold shadow-sm transition-colors"
              >
                Jump &rarr;
              </button>
            </div>
          )}

          {/* Form: Name-Only Entry */}
          <form onSubmit={handleContinue} className="space-y-4">
            <div>
              <label htmlFor="student-name-input" className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                What is your name?
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="student-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name (e.g. Aarav, Vanshika)"
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-zinc-300 text-sm font-medium text-obsidian focus:border-royal focus:ring-2 focus:ring-royal/20 transition-all outline-none"
                  autoFocus
                />
              </div>
            </div>

            {/* Quick Name Suggestions */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                Quick Select:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {['Aarav', 'Vanshika', 'Divyanshi', 'Kushagr', 'Ananya', 'Rohan'].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => handleQuickName(n)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium transition-colors border border-zinc-200"
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-royal hover:bg-royal-hover text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 group mt-2"
            >
              <span>Continue to Select Class &amp; Subject &rarr;</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </form>

          {/* Privacy Note */}
          <div className="mt-6 pt-4 border-t border-zinc-200 text-center text-[11px] text-zinc-400">
            <span>No passwords or phone verification required. Your reading bookmarks stay 100% private in your browser.</span>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-3 px-6 text-center text-xs text-zinc-500 border-t border-structural-dark">
        Divyavani AI Educational Platform &bull; Conceived by Vanshika & Divyanshi (Class IX-H) &bull; Master NCERT Reader Edition
      </footer>
    </div>
  );
}
