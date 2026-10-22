'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Loader2 } from 'lucide-react';

export default function HubPage() {
  const router = useRouter();

  useEffect(() => {
    let targetClass = 'class-9';
    let targetSubject = 'science';

    try {
      const stored = localStorage.getItem('divyavani_ncert_v4');
      if (stored) {
        const state = JSON.parse(stored);
        if (state.selectedClass) targetClass = state.selectedClass;
        if (state.selectedSubject) targetSubject = state.selectedSubject;
      } else {
        const savedClass = localStorage.getItem('divyavani_selected_class');
        const savedSubject = localStorage.getItem('divyavani_selected_subject');
        if (savedClass) targetClass = savedClass;
        if (savedSubject) targetSubject = savedSubject;
      }
    } catch (e) {
      // fallback to class-9 science
    }

    // Direct student to the Main Web Hub view for their selected class & subject
    router.replace(`/learn/${targetClass}/${targetSubject}?module=HUB`);
  }, [router]);

  return (
    <div className="min-h-screen bg-obsidian text-alabaster flex flex-col items-center justify-center p-4">
      <div className="w-12 h-12 rounded-2xl bg-royal flex items-center justify-center text-white mb-4 shadow-lg animate-bounce">
        <Sparkles className="w-6 h-6 text-mint" />
      </div>
      <h2 className="text-xl font-bold tracking-tight text-white mb-2">Divyavani Web Hub</h2>
      <p className="text-xs text-zinc-400 mb-3">Loading your personalized 6-Hub study space...</p>
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <Loader2 className="w-4 h-4 animate-spin text-royal" />
        <span>Entering Main Web Hub...</span>
      </div>
    </div>
  );
}
