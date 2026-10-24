// src/app/login/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, ArrowRight } from 'lucide-react';
import DivyaVaniLogo from '@/components/layout/DivyaVaniLogo';

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('divyavani_ncert_v4');
      if (stored) {
        const state = JSON.parse(stored);
        if (state.userName) setName(state.userName);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleContinue = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalName = name.trim() || 'Student';

    try {
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
      localStorage.setItem('divyavani_student_name', finalName);
    } catch {
      // ignore
    }

    router.push('/select-class');
  };

  return (
    <main className="min-h-screen bg-[#09090B] text-white flex flex-col justify-between items-center p-6 sm:p-10 relative overflow-hidden selection:bg-zinc-800 selection:text-white">
      {/* Decorative Corner Arcs & Subtle Sparkle Stars */}
      <div className="absolute top-0 left-0 w-48 h-48 pointer-events-none opacity-20">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full stroke-white">
          <circle cx="0" cy="0" r="140" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="0" cy="0" r="180" strokeWidth="0.75" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-48 h-48 pointer-events-none opacity-20">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full stroke-white">
          <circle cx="200" cy="200" r="140" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="200" cy="200" r="180" strokeWidth="0.75" />
        </svg>
      </div>

      {/* Floating 4-point Sparkles */}
      <span className="absolute top-16 left-12 text-zinc-500 text-xs sm:text-sm select-none opacity-60">✦</span>
      <span className="absolute top-36 right-16 text-zinc-400 text-base sm:text-lg select-none opacity-50">✦</span>
      <span className="absolute bottom-28 left-20 text-zinc-600 text-sm select-none opacity-50">✦</span>
      <span className="absolute bottom-20 right-12 text-zinc-500 text-xs select-none opacity-70">✦</span>

      {/* Top Centered Brand Header */}
      <header className="w-full text-center pt-4 sm:pt-8 z-10 flex flex-col items-center">
        <DivyaVaniLogo variant="dark" size="xl" showText={true} showSubtitle={true} className="flex-col items-center gap-2" />
      </header>

      {/* Center White Card (Screen 1 Match) */}
      <div className="w-full max-w-md bg-white text-zinc-900 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 border border-zinc-200/50 my-6">
        <div className="text-left">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-sans">
            Welcome!
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 font-sans">
            Enter your name to get started
          </p>
        </div>

        <form onSubmit={handleContinue} className="mt-6 space-y-4">
          <div>
            <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-zinc-200 bg-zinc-50/70 focus-within:border-zinc-950 focus-within:bg-white transition-all shadow-sm">
              <User className="w-4 h-4 text-zinc-400 flex-shrink-0" />
              <input
                id="student-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-transparent text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Quick Name Chips */}
          <div className="pt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
              Quick Select:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {['Kushagr', 'Aarav', 'Vanshika', 'Divyanshi', 'Ananya'].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setName(n)}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium border border-zinc-200 hover:border-zinc-900 hover:bg-zinc-100 text-zinc-700 transition"
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-5 bg-zinc-950 hover:bg-zinc-800 text-white font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition duration-150 shadow-md hover:shadow-lg cursor-pointer text-sm"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Bottom Quote & Motivation */}
      <footer className="w-full text-center pb-4 z-10">
        <p className="text-xs text-zinc-400 font-sans tracking-wide flex items-center justify-center gap-2 max-w-sm mx-auto">
          <span className="text-zinc-600 text-[10px]">✦</span>
          <span>&ldquo;Small steps in learning lead to big dreams.&rdquo;</span>
          <span className="text-zinc-600 text-[10px]">✦</span>
        </p>
      </footer>
    </main>
  );
}
