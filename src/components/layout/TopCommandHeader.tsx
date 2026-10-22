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
  ChevronRight, 
  Compass, 
  ShieldCheck, 
  GraduationCap 
} from 'lucide-react';
import { SubjectId } from '@/lib/types';
import { SUBJECTS, CLASS_LEVELS } from '@/lib/mockData';

interface TopCommandHeaderProps {
  currentClass?: string;
  currentSubject?: SubjectId;
  currentChapterTitle?: string;
  listenerActive?: boolean;
  onToggleListener?: () => void;
  theme?: 'white' | 'dark';
}

export default function TopCommandHeader({
  currentClass = 'class-9',
  currentSubject = 'science',
  currentChapterTitle = 'Motion',
  listenerActive = false,
  onToggleListener,
  theme = 'white',
}: TopCommandHeaderProps) {
  const pathname = usePathname();

  const classObj = CLASS_LEVELS.find((c) => c.id === currentClass) || { name: 'Class 9', id: 'class-9' };
  const subjectObj = SUBJECTS.find((s) => s.id === currentSubject) || SUBJECTS[0];

  const isWhite = theme === 'white';

  return (
    <header className={`w-full sticky top-0 z-50 px-4 lg:px-6 py-2.5 transition-colors ${
      isWhite 
        ? 'bg-alabaster text-obsidian border-b border-structural-light shadow-sm' 
        : 'bg-obsidian text-alabaster border-b-1.5 border-structural-dark'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Brand & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-royal flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-mint" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className={`font-extrabold text-base tracking-tight ${isWhite ? 'text-obsidian' : 'text-white'}`}>
                  Divyavani
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-royal/10 text-royal border border-royal/30 px-1.5 py-0.5 rounded">
                  v2.0
                </span>
              </div>
            </div>
          </Link>

          {/* Breadcrumbs Trail */}
          <nav aria-label="Breadcrumb" className={`flex items-center gap-1.5 text-xs font-semibold pl-3 border-l ${
            isWhite ? 'border-zinc-200 text-zinc-500' : 'border-structural-dark text-zinc-400'
          }`}>
            <Link 
              href="/" 
              className={`hover:text-royal transition-colors ${isWhite ? 'text-zinc-600' : 'text-zinc-400'}`}
            >
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            
            <Link 
              href="/select-class" 
              className="px-2 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors"
              title="Click to change class"
            >
              {classObj.name}
            </Link>
            
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />

            <Link 
              href="/select-class" 
              className="px-2 py-0.5 rounded bg-royal/10 text-royal hover:bg-royal/20 transition-colors"
              title="Click to change subject"
            >
              {subjectObj.name}
            </Link>

            {currentChapterTitle && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400 hidden md:inline" />
                <span className={`hidden md:inline font-bold truncate max-w-[180px] ${
                  isWhite ? 'text-obsidian' : 'text-white'
                }`}>
                  {currentChapterTitle}
                </span>
              </>
            )}
          </nav>
        </div>

        {/* Center / Navigation Links */}
        <nav className="hidden lg:flex items-center gap-2 text-xs font-medium">
          <Link
            href="/select-class"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              isWhite 
                ? 'text-zinc-600 hover:text-obsidian hover:bg-zinc-100' 
                : 'text-zinc-400 hover:text-alabaster hover:bg-zinc-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-royal" />
            <span>Switch Subject</span>
          </Link>
          <Link
            href="/revision"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              pathname === '/revision' 
                ? 'bg-zinc-200 text-obsidian font-bold' 
                : isWhite ? 'text-zinc-600 hover:text-obsidian hover:bg-zinc-100' : 'text-zinc-400 hover:text-alabaster hover:bg-zinc-900'
            }`}
          >
            <History className="w-3.5 h-3.5 text-amber" />
            <span>Revision Hub</span>
          </Link>
          <Link
            href="/teacher"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              pathname === '/teacher' 
                ? 'bg-zinc-200 text-obsidian font-bold' 
                : isWhite ? 'text-zinc-600 hover:text-obsidian hover:bg-zinc-100' : 'text-zinc-400 hover:text-alabaster hover:bg-zinc-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-mint" />
            <span>Teacher Mode</span>
          </Link>
        </nav>

        {/* Right Tools: Switch Gateway & Concept badge */}
        <div className="flex items-center gap-2">
          {onToggleListener && (
            <button
              onClick={onToggleListener}
              type="button"
              className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-md border transition-all ${
                listenerActive
                  ? 'bg-mint text-obsidian border-mint font-bold shadow-sm'
                  : isWhite
                    ? 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
                    : 'bg-obsidian-surface text-zinc-400 border-structural-dark hover:border-zinc-600 hover:text-alabaster'
              }`}
              title="Classroom Smart Listener"
            >
              {listenerActive ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-obsidian animate-ping" />
                  <Mic className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Listening</span>
                </>
              ) : (
                <>
                  <MicOff className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="hidden sm:inline">Lecture Mic</span>
                </>
              )}
            </button>
          )}

          <Link
            href="/select-class"
            className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-md bg-royal text-white hover:bg-royal-hover transition-colors shadow-sm"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Change Grade</span>
          </Link>
        </div>

      </div>
    </header>
  );
}
