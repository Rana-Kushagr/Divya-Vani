'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  History, 
  Users, 
  ShieldCheck 
} from 'lucide-react';
import { SubjectId } from '@/lib/types';

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

  return (
    <header className="w-full bg-obsidian border-b-2 border-structural-dark sticky top-0 z-50 px-4 lg:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand & Concept Attribution */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-royal flex items-center justify-center text-white shadow-black-block group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-mint" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-alabaster tracking-tight">Divyavani</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-royal/40 text-royal-light border border-royal/60 px-1.5 py-0.5 rounded">
                  Class IX-H
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium">
                Concept: Vanshika & Divyanshi
              </p>
            </div>
          </Link>
        </div>

        {/* Center / Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2 text-xs font-semibold">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              pathname === '/' 
                ? 'bg-alabaster text-obsidian font-bold shadow-sm' 
                : 'text-zinc-400 hover:text-alabaster hover:bg-zinc-800'
            }`}
          >
            Workspace
          </Link>
          <Link
            href="/revision"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              pathname === '/revision' 
                ? 'bg-alabaster text-obsidian font-bold shadow-sm' 
                : 'text-zinc-400 hover:text-alabaster hover:bg-zinc-800'
            }`}
          >
            <History className="w-3.5 h-3.5 text-amber" />
            <span>Revision Hub</span>
          </Link>
          <Link
            href="/teacher"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              pathname === '/teacher' 
                ? 'bg-alabaster text-obsidian font-bold shadow-sm' 
                : 'text-zinc-400 hover:text-alabaster hover:bg-zinc-800'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-mint" />
            <span>Teacher Mode</span>
          </Link>
        </nav>

        {/* Right Tools: Smart Lecture Listener & Security Shield */}
        <div className="flex items-center gap-2.5">
          {/* Smart Listener Toggle */}
          <button
            onClick={onToggleListener}
            type="button"
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border-2 transition-all ${
              listenerActive
                ? 'bg-mint text-obsidian border-mint font-black shadow-sm'
                : 'bg-obsidian text-zinc-400 border-structural-dark hover:border-zinc-500 hover:text-alabaster'
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

          {/* Privacy Shield Badge */}
          <div 
            className="hidden sm:flex items-center gap-1.5 text-[11px] text-zinc-400 bg-obsidian-surface px-2.5 py-1.5 rounded-lg border-2 border-structural-dark"
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
