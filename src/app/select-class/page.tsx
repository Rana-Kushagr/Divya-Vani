'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Atom, 
  Calculator, 
  Globe, 
  BookOpen, 
  Languages, 
  Scroll, 
  ArrowRight, 
  CheckCircle2, 
  GraduationCap, 
  Compass,
  Check,
  ChevronRight
} from 'lucide-react';
import { CLASS_LEVELS, SUBJECTS, ClassLevel } from '@/lib/mockData';
import { SubjectId } from '@/lib/types';

export default function SelectClassPage() {
  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState<string>('class-9');
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>('science');
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState<string>('Student');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('divyavani_user');
      if (stored) {
        const user = JSON.parse(stored);
        if (user.fullName) setUserName(user.fullName);
      }
      const prevClass = localStorage.getItem('divyavani_selected_class');
      const prevSub = localStorage.getItem('divyavani_selected_subject') as SubjectId;
      if (prevClass) setSelectedClass(prevClass);
      if (prevSub) setSelectedSubject(prevSub);
    } catch (e) {
      // ignore
    }
  }, []);

  const handleSubjectIcon = (id: SubjectId) => {
    switch (id) {
      case 'science': return <Atom className="w-5 h-5 text-royal" />;
      case 'maths': return <Calculator className="w-5 h-5 text-mint" />;
      case 'social_science': return <Globe className="w-5 h-5 text-red-500" />;
      case 'english': return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'hindi': return <Languages className="w-5 h-5 text-amber" />;
      case 'sanskrit': return <Scroll className="w-5 h-5 text-purple-500" />;
      default: return <Sparkles className="w-5 h-5 text-royal" />;
    }
  };

  const handleProceed = async () => {
    setIsLoading(true);
    try {
      localStorage.setItem('divyavani_selected_class', selectedClass);
      localStorage.setItem('divyavani_selected_subject', selectedSubject);

      const res = await fetch('/api/user/select-class-subject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classLevel: selectedClass,
          subject: selectedSubject,
        }),
      });

      const data = await res.json();
      if (data.redirectUrl) {
        router.push(data.redirectUrl);
      } else {
        router.push(`/learn/${selectedClass}/${selectedSubject}`);
      }
    } catch (err) {
      router.push(`/learn/${selectedClass}/${selectedSubject}`);
    } finally {
      setIsLoading(false);
    }
  };

  const currentClassObj = CLASS_LEVELS.find((c) => c.id === selectedClass) || CLASS_LEVELS[3];
  const currentSubjectObj = SUBJECTS.find((s) => s.id === selectedSubject) || SUBJECTS[0];

  return (
    <div className="min-h-screen bg-obsidian text-alabaster flex flex-col justify-between selection:bg-royal selection:text-white">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-structural-dark bg-obsidian sticky top-0 z-20">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-royal flex items-center justify-center text-white shadow-block-dark">
            <Sparkles className="w-4 h-4 text-mint" />
          </div>
          <span className="font-bold text-base tracking-tight text-white">Divyavani</span>
        </Link>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span>Student:</span>
          <span className="text-zinc-200 font-semibold">{userName}</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 sm:py-12">
        {/* Step Banner */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-royal/20 border border-royal/40 text-royal-light text-xs font-semibold mb-3">
            <Compass className="w-3.5 h-3.5 text-mint" />
            <span>Targeted Learning Gateway (Gate 2 of 3)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Personalize Your Study Stream
          </h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-lg mx-auto">
            Choose your current grade and subject to land directly into your verified syllabus repository with zero clutter.
          </p>
        </div>

        {/* STEP A: Which Class are you in? */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-zinc-800 text-alabaster flex items-center justify-center text-[11px] font-mono">1</span>
              <span>Which Class are you in?</span>
            </h2>
            <span className="text-xs text-zinc-500 font-medium">CBSE Curriculum (Grades 6–12)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
            {CLASS_LEVELS.map((cls) => {
              const isSelected = selectedClass === cls.id;
              return (
                <button
                  key={cls.id}
                  type="button"
                  onClick={() => setSelectedClass(cls.id)}
                  className={`p-3.5 rounded-xl border text-center transition-all duration-150 flex flex-col items-center justify-between min-h-[92px] group relative ${
                    isSelected
                      ? 'bg-royal border-royal text-white shadow-lg ring-2 ring-royal/40 scale-[1.02]'
                      : 'bg-obsidian-surface border-structural-dark text-zinc-300 hover:border-zinc-600 hover:bg-obsidian-elevated'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {cls.badge}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-mint" />}
                  </div>

                  <div className="my-1.5">
                    <span className="text-base font-extrabold tracking-tight block">
                      {cls.name}
                    </span>
                  </div>

                  <span className={`text-[10px] truncate max-w-full ${
                    isSelected ? 'text-white/80' : 'text-zinc-500'
                  }`}>
                    {cls.stage}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* STEP B: Select Your Subject */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-zinc-800 text-alabaster flex items-center justify-center text-[11px] font-mono">2</span>
              <span>Select Your Core Subject</span>
            </h2>
            <span className="text-xs text-zinc-500 font-medium">Chapter Notes & Socratic AI</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {SUBJECTS.map((sub) => {
              const isSelected = selectedSubject === sub.id;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setSelectedSubject(sub.id)}
                  className={`p-4 rounded-xl border text-left transition-all duration-150 flex items-start gap-3.5 group relative ${
                    isSelected
                      ? 'bg-white text-obsidian border-white shadow-xl ring-2 ring-white/50 scale-[1.02]'
                      : 'bg-obsidian-surface border-structural-dark text-zinc-300 hover:border-zinc-600 hover:bg-obsidian-elevated'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${
                    isSelected ? 'bg-zinc-100 shadow-sm' : 'bg-obsidian-elevated border border-structural-dark'
                  }`}>
                    {handleSubjectIcon(sub.id)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`font-bold text-sm truncate ${
                        isSelected ? 'text-obsidian' : 'text-white'
                      }`}>
                        {sub.name}
                      </span>
                      <span className={`text-xs font-medium ${
                        isSelected ? 'text-royal' : 'text-zinc-400'
                      }`}>
                        {sub.hindiName}
                      </span>
                    </div>

                    <p className={`text-xs mt-1 truncate ${
                      isSelected ? 'text-zinc-600' : 'text-zinc-400'
                    }`}>
                      {sub.id === 'science' && 'Motion, Laws, Gravitation & Cell'}
                      {sub.id === 'maths' && 'Number Systems, Polynomials, Triangles'}
                      {sub.id === 'social_science' && 'Revolutions, Maps & Contemporary India'}
                      {sub.id === 'english' && 'Prose, Poetry & Grammar Mastery'}
                      {sub.id === 'hindi' && 'क्षितिज, कृतिका एवं व्याकरण'}
                      {sub.id === 'sanskrit' && 'शेमुषी, शब्दरूप एवं श्लोक अर्थ'}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="absolute right-3 top-3">
                      <div className="w-5 h-5 rounded-full bg-royal text-white flex items-center justify-center">
                        <Check className="w-3 h-3 text-mint" />
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Action Gate Button */}
        <div className="bg-alabaster text-obsidian rounded-2xl p-5 sm:p-6 border border-structural-light shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-royal">
                Ready to Enter
              </span>
              <span className="text-xs text-zinc-400">&bull;</span>
              <span className="text-xs font-semibold text-zinc-600">
                {currentClassObj.name} &bull; {currentSubjectObj.name} ({currentSubjectObj.hindiName})
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Instant access to verified chapter vault, formula sheets, and 24/7 Socratic AI Tutor.
            </p>
          </div>

          <button
            type="button"
            onClick={handleProceed}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-royal hover:bg-royal-hover text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2.5 group disabled:opacity-50 min-h-[48px]"
          >
            <span>{isLoading ? 'Entering Classroom...' : `Enter ${currentClassObj.name} ${currentSubjectObj.name} Classroom`}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-3 px-6 text-center text-xs text-zinc-500 border-t border-structural-dark">
        Divyavani AI Educational Platform &bull; Conceived by Vanshika & Divyanshi (Class IX-H)
      </footer>
    </div>
  );
}
