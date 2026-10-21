import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Cookie, Info } from 'lucide-react';
import LegalFooter from '@/components/layout/LegalFooter';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-obsidian text-alabaster flex flex-col">
      <header className="border-b border-structural-dark px-6 py-4 bg-obsidian-surface sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-alabaster transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Workspace</span>
          </Link>
          <span className="text-xs text-zinc-400">Cookie Management</span>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-10">
        <article className="bg-obsidian-surface border-1.5 border-structural-dark rounded-2xl p-6 md:p-10 shadow-block-dark">
          <span className="text-xs font-mono font-bold text-royal uppercase tracking-wider bg-royal/10 px-2.5 py-1 rounded border border-royal/30">
            Cookie Policy
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-3 mb-2 text-alabaster">
            Cookie & Local Storage Policy
          </h1>
          <p className="text-xs text-zinc-400 mb-8">
            Last Updated: October 2026 • Zero Third-Party Advertising Trackers
          </p>

          <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
            <section className="p-4 rounded-xl bg-obsidian border border-structural-dark">
              <h2 className="text-base font-bold text-alabaster flex items-center gap-2 mb-2">
                <Cookie className="w-4 h-4 text-amber" />
                1. How We Use Cookies & LocalStorage
              </h2>
              <p>
                Divyavani stores essential state solely to ensure your multi-tab workspace survives page reloads without losing open documents, chapter notes, or revision bookmark stars. We never place marketing beacons or cross-site tracking cookies.
              </p>
            </section>
          </div>
        </article>
      </main>

      <LegalFooter />
    </div>
  );
}
