import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Eye } from 'lucide-react';
import LegalFooter from '@/components/layout/LegalFooter';

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-obsidian text-alabaster flex flex-col">
      <header className="border-b border-structural-dark px-6 py-4 bg-obsidian-surface sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-alabaster transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Workspace</span>
          </Link>
          <span className="text-xs text-zinc-400">WCAG 2.1 AA / AAA</span>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-10">
        <article className="bg-obsidian-surface border-1.5 border-structural-dark rounded-2xl p-6 md:p-10 shadow-block-dark">
          <span className="text-xs font-mono font-bold text-royal uppercase tracking-wider bg-royal/10 px-2.5 py-1 rounded border border-royal/30">
            Accessibility Statement
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-3 mb-2 text-alabaster">
            WCAG 2.1 AA Accessibility Declaration
          </h1>
          <p className="text-xs text-zinc-400 mb-8">
            Committed to Inclusive Educational Access for Every Student
          </p>

          <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
            <section className="p-4 rounded-xl bg-obsidian border border-structural-dark">
              <h2 className="text-base font-bold text-alabaster flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-mint" />
                1. Synchronized High-Contrast Double-Palette
              </h2>
              <p>
                Divyavani’s architectural pairing of Obsidian Black (<code className="text-xs font-mono text-zinc-300">#09090B</code>) and Pure Alabaster (<code className="text-xs font-mono text-zinc-300">#FFFFFF</code>) delivers an outstanding 19.4:1 contrast ratio, far surpassing the WCAG 2.1 AA threshold (4.5:1) and meeting AAA standards.
              </p>
            </section>

            <section className="p-4 rounded-xl bg-obsidian border border-structural-dark">
              <h2 className="text-base font-bold text-alabaster flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-royal" />
                2. Keyboard Navigation & Assistive Technologies
              </h2>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-zinc-300">
                <li>Visible high-contrast focus rings on all interactive elements (<code className="text-xs font-mono text-royal-light">focus-visible:ring-2</code>).</li>
                <li>Full tab-index support: navigate tabs, doubt inputs, and micro-quizzes using Tab, Enter, Space, and Escape.</li>
                <li>Descriptive aria-labels on icon buttons and screen-reader accessible mathematical expressions.</li>
              </ul>
            </section>
          </div>
        </article>
      </main>

      <LegalFooter />
    </div>
  );
}
