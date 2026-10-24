// src/app/select-class/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  GraduationCap, 
  BookOpen, 
  ChevronDown, 
  ArrowRight,
  User
} from 'lucide-react';
import DivyaVaniLogo from '@/components/layout/DivyaVaniLogo';

const CLASSES = [
  { id: 'class-6', label: 'Class 6' },
  { id: 'class-7', label: 'Class 7' },
  { id: 'class-8', label: 'Class 8' },
  { id: 'class-9', label: 'Class 9' },
  { id: 'class-10', label: 'Class 10' },
  { id: 'class-11', label: 'Class 11' },
  { id: 'class-12', label: 'Class 12' },
];

const SUBJECTS = [
  { id: 'maths', label: 'Mathematics' },
  { id: 'science', label: 'Science' },
  { id: 'social-science', label: 'Social Science' },
  { id: 'english', label: 'English' },
  { id: 'hindi', label: 'Hindi' },
  { id: 'sanskrit', label: 'Sanskrit' },
];

export default function SelectClassPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>('Student');
  const [selectedClass, setSelectedClass] = useState<string>('class-9');
  const [selectedSubject, setSelectedSubject] = useState<string>('science');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('divyavani_ncert_v4');
      if (stored) {
        const state = JSON.parse(stored);
        if (state.userName) setUserName(state.userName);
        if (state.selectedClass) setSelectedClass(state.selectedClass);
        if (state.selectedSubject) {
          const s = state.selectedSubject.replace(/_/g, '-');
          setSelectedSubject(s);
        }
      } else {
        const legacyUser = localStorage.getItem('divyavani_user');
        if (legacyUser) {
          const user = JSON.parse(legacyUser);
          if (user.fullName) setUserName(user.fullName);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const handleGoToHub = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
      localStorage.setItem('divyavani_class', selectedClass);
      localStorage.setItem('divyavani_subject', selectedSubject);
    } catch {
      // ignore
    }

    router.push(`/learn/${selectedClass}/${selectedSubject}`);
  };

  return (
    <main className="min-h-screen bg-white text-zinc-900 flex flex-col justify-between selection:bg-zinc-900 selection:text-white">
      {/* Top Header */}
      <header className="max-w-xl w-full mx-auto px-6 pt-6 pb-4 flex items-center justify-between border-b border-zinc-100 sm:border-0">
        <Link href="/" className="hover:opacity-85 transition">
          <DivyaVaniLogo variant="light" size="md" showText={true} />
        </Link>
        <Link
          href="/login"
          className="w-9 h-9 rounded-full bg-zinc-950 text-white flex items-center justify-center hover:bg-zinc-800 transition shadow-sm"
          title={`Signed in as ${userName}. Click to change name.`}
          aria-label="Student Account"
        >
          <User className="w-4 h-4" />
        </Link>
      </header>

      {/* Main Selection Body */}
      <section className="max-w-xl w-full mx-auto px-6 py-4 flex-1 flex flex-col justify-center">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 font-sans">
            Hello, {userName}!
          </h1>
          <p className="text-sm text-zinc-500 mt-1 font-sans">
            Choose your class and subject to continue
          </p>
        </div>

        <form onSubmit={handleGoToHub} className="space-y-4">
          {/* Dropdown 1: Class Selector */}
          <div>
            <label htmlFor="classSelectBox" className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
              Class
            </label>
            <div className="relative flex items-center justify-between px-4 py-3.5 rounded-xl border border-zinc-200 bg-white hover:border-zinc-400 focus-within:border-zinc-950 shadow-sm transition">
              <div className="flex items-center gap-3 w-full">
                <GraduationCap className="w-5 h-5 text-zinc-800 flex-shrink-0" />
                <select
                  id="classSelectBox"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-zinc-900 appearance-none focus:outline-none cursor-pointer pr-8"
                >
                  {CLASSES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <ChevronDown className="w-4 h-4 text-zinc-500 pointer-events-none absolute right-4" />
            </div>
          </div>

          {/* Dropdown 2: Subject Selector */}
          <div>
            <label htmlFor="subjectSelectBox" className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
              Subject
            </label>
            <div className="relative flex items-center justify-between px-4 py-3.5 rounded-xl border border-zinc-200 bg-white hover:border-zinc-400 focus-within:border-zinc-950 shadow-sm transition">
              <div className="flex items-center gap-3 w-full">
                <BookOpen className="w-5 h-5 text-zinc-800 flex-shrink-0" />
                <select
                  id="subjectSelectBox"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-zinc-900 appearance-none focus:outline-none cursor-pointer pr-8"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <ChevronDown className="w-4 h-4 text-zinc-500 pointer-events-none absolute right-4" />
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            className="w-full mt-4 bg-zinc-950 hover:bg-zinc-800 text-white font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition duration-150 shadow-md hover:shadow-lg cursor-pointer text-sm"
          >
            <span>Go to Main Hub</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </section>

      {/* Bottom Student Line-Art Illustration (Screen 2 Match) */}
      <footer className="w-full max-w-xl mx-auto px-6 pb-6 pt-2 flex flex-col items-center">
        <svg
          viewBox="0 0 240 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-52 h-24 text-zinc-900"
          aria-hidden="true"
        >
          {/* Ground Base Line */}
          <line x1="10" y1="92" x2="230" y2="92" stroke="#09090B" strokeWidth="2" strokeLinecap="round" />

          {/* Stack of 3 Books on Left */}
          {/* Book 1 */}
          <rect x="25" y="80" width="44" height="11" rx="2" stroke="#09090B" strokeWidth="1.75" fill="#FAFAFA" />
          <line x1="28" y1="85" x2="65" y2="85" stroke="#09090B" strokeWidth="1" strokeLinecap="round" />
          {/* Book 2 */}
          <rect x="28" y="68" width="40" height="11" rx="2" stroke="#09090B" strokeWidth="1.75" fill="#FFFFFF" />
          <line x1="31" y1="73" x2="64" y2="73" stroke="#09090B" strokeWidth="1" strokeLinecap="round" />
          {/* Book 3 (Top with bookmark) */}
          <rect x="24" y="56" width="46" height="11" rx="2" stroke="#09090B" strokeWidth="1.75" fill="#FAFAFA" />
          <path d="M 62 56 L 62 64 L 65 62 L 68 64 L 68 56 Z" fill="#09090B" />

          {/* Student Sitting and Writing */}
          {/* Head & Hair */}
          <circle cx="130" cy="30" r="12" stroke="#09090B" strokeWidth="1.75" fill="#FFFFFF" />
          <path d="M 120 28 C 120 20 132 18 138 22 C 142 25 142 30 139 33" stroke="#09090B" strokeWidth="1.75" strokeLinecap="round" />
          {/* Glasses or Eye Detail */}
          <circle cx="134" cy="30" r="2" fill="#09090B" />

          {/* Torso & Shoulders leaning forward */}
          <path d="M 126 42 C 120 54 116 68 114 80" stroke="#09090B" strokeWidth="2" strokeLinecap="round" />
          <path d="M 132 42 C 138 52 144 60 152 70" stroke="#09090B" strokeWidth="2" strokeLinecap="round" />

          {/* Arm Extending & Pen Writing in Notebook */}
          <path d="M 134 46 L 150 62 L 158 60" stroke="#09090B" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="158" y1="60" x2="162" y2="64" stroke="#09090B" strokeWidth="2" strokeLinecap="round" />

          {/* Study Desk & Notebook */}
          <path d="M 140 76 L 195 76" stroke="#09090B" strokeWidth="2" strokeLinecap="round" />
          <line x1="190" y1="76" x2="190" y2="92" stroke="#09090B" strokeWidth="1.75" strokeLinecap="round" />
          {/* Open Notebook on Desk */}
          <path d="M 148 76 L 158 68 L 176 68 L 182 76 Z" stroke="#09090B" strokeWidth="1.5" fill="#FFFFFF" />
          <line x1="167" y1="68" x2="167" y2="76" stroke="#09090B" strokeWidth="1" strokeLinecap="round" />

          {/* Little Floating Idea Light / Sparkle */}
          <path d="M 115 16 L 115 12 M 115 20 L 115 24 M 111 16 L 107 16 M 119 16 L 123 16" stroke="#A1A1AA" strokeWidth="1" strokeLinecap="round" />
        </svg>
        <span className="text-[11px] text-zinc-400 font-sans tracking-wide mt-1">
          Divya Vani &bull; NCERT Study Ecosystem
        </span>
      </footer>
    </main>
  );
}
