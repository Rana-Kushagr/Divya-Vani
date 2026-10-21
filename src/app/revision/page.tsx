'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  History, 
  AlertTriangle, 
  Printer, 
  Sparkles, 
  Bookmark, 
  CheckCircle2, 
  Download, 
  FileText 
} from 'lucide-react';
import TopCommandHeader from '@/components/layout/TopCommandHeader';
import LegalFooter from '@/components/layout/LegalFooter';
import MathRenderer from '@/components/solver/MathRenderer';
import { INITIAL_WEAK_TOPICS, SUBJECTS } from '@/lib/mockData';
import { WeakTopic } from '@/lib/types';

export default function RevisionPage() {
  const [weakTopics, setWeakTopics] = useState<WeakTopic[]>(INITIAL_WEAK_TOPICS);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('All');

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const filteredTopics = selectedSubjectFilter === 'All'
    ? weakTopics
    : weakTopics.filter((t) => t.subject.toLowerCase() === selectedSubjectFilter.toLowerCase());

  return (
    <div className="min-h-screen bg-obsidian text-alabaster flex flex-col">
      {/* Top Header */}
      <header className="border-b border-structural-dark px-6 py-4 bg-obsidian sticky top-0 z-20 no-print">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-alabaster transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Chapter Workspace</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-royal hover:bg-royal-hover text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Chapter Cheat Sheet</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Revision Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-8">
        
        {/* Banner Section */}
        <section className="no-print bg-obsidian-surface border-1.5 border-structural-dark rounded-2xl p-6 shadow-block-dark flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber bg-amber/15 px-2 py-0.5 rounded border border-amber/40">
                Personalized Learning
              </span>
              <span className="text-xs text-zinc-500 font-mono">Class IX-H</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-alabaster">
              Revision Hub & Weak Topic Radar
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-xl">
              Automated misconception diagnosis: Tracks concepts that triggered doubts and generates 1-click printable revision cheat sheets for upcoming exams.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-alabaster text-obsidian hover:bg-zinc-100 font-bold text-xs shadow-block-light transition-all"
            >
              <FileText className="w-4 h-4 text-royal" />
              <span>1-Click Cheat Sheet</span>
            </button>
          </div>
        </section>

        {/* Weak Topic Radar Section */}
        <section className="no-print space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber" />
              <h2 className="text-base font-bold text-alabaster">
                Weak Topic Radar (Needs Review Before Exams)
              </h2>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 text-xs">
              {['All', 'Science', 'Mathematics'].map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedSubjectFilter(f)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                    selectedSubjectFilter === f
                      ? 'bg-zinc-800 text-alabaster border border-zinc-700'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredTopics.map((topic) => (
              <div
                key={topic.id}
                className="bg-obsidian-surface border-1.5 border-structural-dark rounded-xl p-4 shadow-block-dark flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                      {topic.subject} • {topic.chapter}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-amber">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
                      {topic.doubtCount} Doubts
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-alabaster mb-1">
                    {topic.topic}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {topic.recommendedAction}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-structural-dark flex items-center justify-between">
                  <Link
                    href={`/?prompt=Explain ${encodeURIComponent(topic.topic)} step by step`}
                    className="text-xs font-semibold text-royal-light hover:underline flex items-center gap-1"
                  >
                    <span>Practice Concept</span>
                    <span>→</span>
                  </Link>
                  <span className="text-[10px] uppercase font-mono text-zinc-500">
                    High Yield
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Printable Chapter Cheat Sheet Canvas */}
        <section className="print-page bg-alabaster text-obsidian border-1.5 border-structural-light rounded-2xl p-6 md:p-8 shadow-block-light">
          <div className="flex items-start justify-between pb-6 border-b-2 border-zinc-900 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-royal bg-royal/10 px-2 py-0.5 rounded">
                  Class IX CBSE Quick-Revision Card
                </span>
                <span className="text-xs text-zinc-500">•</span>
                <span className="text-xs text-zinc-600 font-medium">Concept: Vanshika & Divyanshi (IX-H)</span>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-obsidian mt-2">
                Physics Chapter 8: Motion — High-Yield Formula Sheet
              </h2>
            </div>
            <button
              onClick={handlePrint}
              className="no-print p-2 rounded-lg border border-zinc-300 hover:bg-zinc-100 text-zinc-700"
              title="Print document"
            >
              <Printer className="w-5 h-5 text-royal" />
            </button>
          </div>

          {/* Core Kinematic Equations Block */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl border border-zinc-300 bg-white">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                First Equation (Velocity-Time)
              </span>
              <div className="text-center py-2">
                <MathRenderer math="v = u + at" block className="text-base font-bold text-royal" />
              </div>
              <p className="text-[11px] text-zinc-600 mt-1 text-center">
                Relates initial velocity $$u$$, uniform acceleration $$a$$, time $$t$$, and final velocity $$v$$.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-300 bg-white">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                Second Equation (Position-Time)
              </span>
              <div className="text-center py-2">
                <MathRenderer math="s = ut + \frac{1}{2}at^2" block className="text-base font-bold text-royal" />
              </div>
              <p className="text-[11px] text-zinc-600 mt-1 text-center">
                Area under velocity-time graph divided into rectangle and triangle.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-zinc-300 bg-white">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                Third Equation (Position-Velocity)
              </span>
              <div className="text-center py-2">
                <MathRenderer math="2as = v^2 - u^2" block className="text-base font-bold text-royal" />
              </div>
              <p className="text-[11px] text-zinc-600 mt-1 text-center">
                Independent of time $$t$$; essential for stopping distance problems.
              </p>
            </div>
          </div>

          {/* Critical Examination Traps & Reminders */}
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-300 text-xs text-zinc-700 leading-relaxed">
            <h4 className="font-bold text-obsidian text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-mint" />
              <span>CBSE Examination Mark-Saving Rules</span>
            </h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Speed conversion constant: Multiply by <code className="font-mono font-bold text-royal">5/18</code> to convert from km/h to m/s.</li>
              <li>When a vehicle starts from rest: set <code className="font-mono font-bold text-royal">u = 0</code>. When brakes are applied to bring it to a stop: set <code className="font-mono font-bold text-royal">v = 0</code>.</li>
              <li>Uniform circular motion has constant speed, but velocity changes direction continuously (accelerated motion towards center).</li>
            </ul>
          </div>
        </section>

      </main>

      <LegalFooter />
    </div>
  );
}
