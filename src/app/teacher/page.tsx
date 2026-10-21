'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Users, 
  TrendingUp, 
  AlertCircle, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import LegalFooter from '@/components/layout/LegalFooter';
import { COHORT_ANALYTICS } from '@/lib/mockData';

export default function TeacherPage() {
  return (
    <div className="min-h-screen bg-obsidian text-alabaster flex flex-col">
      {/* Top Header */}
      <header className="border-b border-structural-dark px-6 py-4 bg-obsidian sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-alabaster transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Workspace</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-bold text-mint bg-mint/10 border border-mint/30 px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-mint" />
            <span>Anonymized Cohort Mode (Zero PII)</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-8">
        
        {/* Banner Section */}
        <section className="bg-obsidian-surface border-1.5 border-structural-dark rounded-2xl p-6 shadow-block-dark flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-royal-light bg-royal/30 px-2 py-0.5 rounded border border-royal/50">
                Educator Command Center
              </span>
              <span className="text-xs text-zinc-500 font-mono">Class IX-H • Academic Year 2026</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-alabaster">
              Cohort Doubt Heatmap & Curriculum Telemetry
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-xl">
              Provides teachers with aggregated, anonymized insights into which textbook chapters, formula sheets, and questions generate the highest doubt concentration.
            </p>
          </div>

          <div className="flex items-center gap-4 text-center">
            <div className="bg-obsidian px-4 py-2.5 rounded-xl border border-structural-dark">
              <span className="text-2xl font-black text-alabaster">204</span>
              <span className="text-[10px] text-zinc-400 block uppercase font-bold">Total Doubts Logged</span>
            </div>
            <div className="bg-obsidian px-4 py-2.5 rounded-xl border border-structural-dark">
              <span className="text-2xl font-black text-mint">71%</span>
              <span className="text-[10px] text-zinc-400 block uppercase font-bold">Avg Cohort Mastery</span>
            </div>
          </div>
        </section>

        {/* Heatmap Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-alabaster flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-royal" />
              <span>Chapter Confusion Hotspots</span>
            </h2>
            <span className="text-xs text-zinc-500">Live Telemetry from Multi-Tab Vault</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COHORT_ANALYTICS.map((item) => (
              <div
                key={item.chapterId}
                className="bg-obsidian-surface border-1.5 border-structural-dark rounded-xl p-5 shadow-block-dark flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                      {item.subject}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber">
                      {item.totalDoubts} Doubts
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-alabaster mb-1">
                    {item.chapterTitle}
                  </h3>

                  {/* Progress Bar */}
                  <div className="my-3">
                    <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                      <span>Concept Comprehension</span>
                      <span className="font-bold text-alabaster">{item.averageMasteryPct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-mint rounded-full transition-all"
                        style={{ width: `${item.averageMasteryPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 p-3 rounded-lg bg-obsidian border border-structural-dark text-xs space-y-1.5">
                    <div className="flex items-start gap-1.5 text-amber">
                      <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                      <span className="font-semibold text-zinc-200">Prevalent Misconception:</span>
                    </div>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      {item.commonMisconception}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-structural-dark flex items-center justify-between text-xs text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-royal" />
                    <span className="text-[11px] truncate max-w-[180px]">{item.mostQueriedDoc}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 uppercase font-mono">High Density</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <LegalFooter />
    </div>
  );
}
