'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Loader2 } from 'lucide-react';

export default function RootPage() {
  const router = useRouter();
  const [statusText, setStatusText] = useState('Verifying student session...');

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('divyavani_user');
      const savedClass = localStorage.getItem('divyavani_selected_class');
      const savedSubject = localStorage.getItem('divyavani_selected_subject');

      if (!storedUser) {
        setStatusText('Directing to Student Sign-In...');
        router.replace('/login');
        return;
      }

      if (savedClass && savedSubject) {
        setStatusText(`Loading ${savedClass.toUpperCase()} ${savedSubject.toUpperCase()} Classroom...`);
        router.replace(`/learn/${savedClass}/${savedSubject}`);
      } else {
        setStatusText('Directing to Class & Subject Selection Gateway...');
        router.replace('/select-class');
      }
    } catch (e) {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-obsidian text-alabaster flex flex-col items-center justify-center p-4">
      <div className="w-12 h-12 rounded-2xl bg-royal flex items-center justify-center text-white mb-4 shadow-lg animate-bounce">
        <Sparkles className="w-6 h-6 text-mint" />
      </div>
      <h2 className="text-xl font-bold tracking-tight text-white mb-2">Divyavani</h2>
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <Loader2 className="w-4 h-4 animate-spin text-royal" />
        <span>{statusText}</span>
      </div>
    </div>
  );
}
