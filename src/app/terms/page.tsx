import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, CheckCircle2 } from 'lucide-react';
import LegalFooter from '@/components/layout/LegalFooter';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-obsidian text-alabaster flex flex-col">
      <header className="border-b border-structural-dark px-6 py-4 bg-obsidian-surface sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-alabaster transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Workspace</span>
          </Link>
          <span className="text-xs text-zinc-400">Class IX-H Academic Honor Code</span>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-10">
        <article className="bg-obsidian-surface border-1.5 border-structural-dark rounded-2xl p-6 md:p-10 shadow-block-dark">
          <span className="text-xs font-mono font-bold text-royal uppercase tracking-wider bg-royal/10 px-2.5 py-1 rounded border border-royal/30">
            Terms of Service
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-3 mb-2 text-alabaster">
            Terms of Service & Academic Honor Code
          </h1>
          <p className="text-xs text-zinc-400 mb-8">
            Last Updated: October 2026 • Designed for Classroom Collaborative Learning
          </p>

          <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
            <section className="p-4 rounded-xl bg-obsidian border border-structural-dark">
              <h2 className="text-base font-bold text-alabaster flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-royal" />
                1. Socratic Learning, Not Cheating Shortcuts
              </h2>
              <p>
                Divyavani is designed to teach principles through Socratic questioning, formula spotlights, and conceptual derivation steps. Users agree to utilize the platform to foster genuine understanding rather than bypass academic effort during graded examinations.
              </p>
            </section>

            <section className="p-4 rounded-xl bg-obsidian border border-structural-dark">
              <h2 className="text-base font-bold text-alabaster flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-mint" />
                2. Acceptable Use of Document Vault
              </h2>
              <p>
                The Multi-Tab Chapter Document Vault supports syllabus-aligned notes, textbooks, and practice papers. Uploading malicious binaries, executables, or unauthorized personal media is strictly prevented by client and server-side validation filters.
              </p>
            </section>
          </div>
        </article>
      </main>

      <LegalFooter />
    </div>
  );
}
