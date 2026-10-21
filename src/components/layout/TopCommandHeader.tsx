'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  GraduationCap, 
  Users, 
  History, 
  BookMarked,
  ShieldCheck
} from 'lucide-react';
import { SubjectId } from '@/lib/types';
import { SUBJECTS, CHAPTERS } from '@/lib/mockData';

interface TopCommandHeaderProps {
  currentSubject: SubjectId;
  onSubjectChange: (sub: SubjectId) => void;
  currentChapterId: string;
  onChapterChange: (chId: string) => void;
  listenerActive: boolean;
  onToggleListener: () => void;
}

export default function TopCommandHeader({
  currentSubject,
  onSubjectChange,
  currentChapterId,
  onChapterChange,
  listenerActive,
  onToggleListener,
}: TopCommandHeaderProps) {
  const pathname = usePathname();
  const availableChapters = CHAPTERS[currentSubject] || [];

  return (
    <header className="w-full bg-obsidian border-b-1.5 border-structural-dark sticky top-0 z-50 px-4 lg:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand & Concept Attribution */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-royal flex items-center justify-center text-white shadow-block-dark group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-mint" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-alabaster tracking-tight">Divyavani</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-royal/40 text-royal-light border border-royal/60 px-1.5 py-0.5 rounded">
                  Class IX-H
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium">
                Concept: Vanshika & Divyanshi
              </p>
            </div>
          </Link>

          {/* Subject & Chapter Selectors */}
          <div className="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-structural-dark">
            {/* Subject Selector */}
            <label htmlFor="subject-select" className="sr-only">Select Subject</label>
            <select
              id="subject-select"
              value={currentSubject}
              onChange={(e) => {
                const newSub = e.target.value as SubjectId;
                onSubjectChange(newSub);
                const firstCh = CHAPTERS[newSub]?.[0]?.id || '';
                onChapterChange(firstCh);
              }}
              className="bg-obsidian-elevated text-alabaster text-xs font-semibold px-2.5 py-1.5 rounded-md border border-structural-dark hover:border-zinc-600 focus:border-royal transition-colors cursor-pointer"
            >
              {SUBJECTS.map((sub) => (
                <option key={sub.id} value={sub.id} className="bg-obsidian">
                  {sub.name} ({sub.hindiName})
                </option>
              ))}
            </select>

            <span className="text-zinc-600 text-xs">/</span>

            {/* Chapter Selector */}
            <label htmlFor="chapter-select" className="sr-only">Select Chapter</label>
            <select
              id="chapter-select"
              value={currentChapterId}
              onChange={(e) => onChapterChange(e.target.value)}
              className="bg-obsidian-elevated text-alabaster text-xs font-semibold px-2.5 py-1.5 rounded-md border border-structural-dark hover:border-zinc-600 focus:border-royal transition-colors cursor-pointer max-w-[200px] truncate"
            >
              {availableChapters.map((ch) => (
                <option key={ch.id} value={ch.id} className="bg-obsidian">
                  Ch {ch.number}: {ch.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center / Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2 text-xs font-medium">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-md transition-colors ${
              pathname === '/' 
                ? 'bg-zinc-800 text-alabaster font-semibold' 
                : 'text-zinc-400 hover:text-alabaster hover:bg-zinc-900'
            }`}
          >
            Workspace
          </Link>
          <Link
            href="/revision"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              pathname === '/revision' 
                ? 'bg-zinc-800 text-alabaster font-semibold' 
                : 'text-zinc-400 hover:text-alabaster hover:bg-zinc-900'
            }`}
          >
            <History className="w-3.5 h-3.5 text-amber" />
            <span>Revision Hub</span>
          </Link>
          <Link
            href="/teacher"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              pathname === '/teacher' 
                ? 'bg-zinc-800 text-alabaster font-semibold' 
                : 'text-zinc-400 hover:text-alabaster hover:bg-zinc-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-mint" />
            <span>Teacher Mode</span>
          </Link>
        </nav>

        {/* Right Tools: Smart Lecture Listener & Security Badge */}
        <div className="flex items-center gap-2.5">
          {/* Smart Listener Toggle */}
          <button
            onClick={onToggleListener}
            type="button"
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border transition-all ${
              listenerActive
                ? 'bg-mint text-obsidian border-mint font-bold shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                : 'bg-obsidian-surface text-zinc-400 border-structural-dark hover:border-zinc-600 hover:text-alabaster'
            }`}
            title="Classroom Smart Listener: Detects syllabus terms and offers 1-click explainers"
          >
            {listenerActive ? (
              <>
                <span className="w-2 h-2 rounded-full bg-obsidian animate-ping" />
                <Mic className="w-3.5 h-3.5" />
                <span>Listener Active</span>
              </>
            ) : (
              <>
                <MicOff className="w-3.5 h-3.5 text-zinc-500" />
                <span>Lecture Listener</span>
              </>
            )}
          </button>

          {/* Privacy & Constitution Badge */}
          <div 
            className="hidden sm:flex items-center gap-1 text-[11px] text-zinc-400 bg-obsidian-surface px-2.5 py-1.5 rounded-md border border-structural-dark"
            title="Constitution Hardened: OWASP Top 10, DOMPurify, Zod Guarded"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-mint" />
            <span>Vibecoded Shield</span>
          </div>
        </div>

      </div>
    </header>
  );
}
