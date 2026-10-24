'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import DivyaVaniLogo from '@/components/layout/DivyaVaniLogo';

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

      // Default: Direct to Login
      setStatusText('Directing to Name Entry...');
      router.replace('/login');
    } catch {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col items-center justify-center p-4">
      <DivyaVaniLogo size="lg" showSubtitle={true} className="mb-4" />
      <div className="flex items-center gap-2 text-xs text-zinc-500 mt-4">
        <Loader2 className="w-4 h-4 animate-spin text-zinc-800" />
        <span>{statusText}</span>
      </div>
    </div>
  );
}
