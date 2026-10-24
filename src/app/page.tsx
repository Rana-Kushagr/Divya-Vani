'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, BookOpen } from 'lucide-react';

export default function RootPage() {
  const router = useRouter();
  const [statusText, setStatusText] = useState('Loading NCERT Study Workspace...');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('divyavani_ncert_v4');
      if (stored) {
        const state = JSON.parse(stored);
        if (state.userName && state.selectedClass && state.selectedSubject) {
          setStatusText(`Opening ${state.selectedClass.toUpperCase()} ${state.selectedSubject.toUpperCase()} NCERT Reader...`);
          router.replace(`/learn/${state.selectedClass}/${state.selectedSubject}`);
          return;
        } else if (state.userName) {
          setStatusText('Directing to NCERT Class Selection...');
          router.replace('/select-class');
          return;
        }
      }

      // Check legacy user fallback
      const legacyUser = localStorage.getItem('divyavani_user');
      const savedClass = localStorage.getItem('divyavani_selected_class');
      const savedSubject = localStorage.getItem('divyavani_selected_subject');

      if (legacyUser && savedClass && savedSubject) {
        router.replace(`/learn/${savedClass}/${savedSubject}`);
        return;
      }

      // Default: Direct to Gate 1 (Name-Only Entry Screen)
      setStatusText('Directing to Name Entry...');
      router.replace('/login');
    } catch (e) {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-obsidian text-alabaster flex flex-col items-center justify-center p-4">
      <div className="w-12 h-12 rounded-2xl bg-royal flex items-center justify-center text-white mb-4 shadow-lg animate-bounce">
        <BookOpen className="w-6 h-6 text-mint" />
      </div>
      <h2 className="text-xl font-bold tracking-tight text-white mb-2">Divyavani</h2>
      <p className="text-xs text-zinc-400 mb-3">Official NCERT Textbook Reader & Summary Hub</p>
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <Loader2 className="w-4 h-4 animate-spin text-royal" />
        <span>{statusText}</span>
      </div>
    </div>
  );
}
