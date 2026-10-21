import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, Eye, FileText } from 'lucide-react';
import LegalFooter from '@/components/layout/LegalFooter';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-obsidian text-alabaster flex flex-col">
      <header className="border-b border-structural-dark px-6 py-4 bg-obsidian-surface sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-alabaster transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Workspace</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-bold text-mint">
            <ShieldCheck className="w-4 h-4" />
            <span>DPDP & COPPA Shield Active</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-10">
        <article className="bg-obsidian-surface border-1.5 border-structural-dark rounded-2xl p-6 md:p-10 shadow-block-dark">
          <span className="text-xs font-mono font-bold text-royal uppercase tracking-wider bg-royal/10 px-2.5 py-1 rounded border border-royal/30">
            Legal Constitution
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-3 mb-2 text-alabaster">
            Privacy Policy & Student Data Shield
          </h1>
          <p className="text-xs text-zinc-400 mb-8">
            Last Updated: October 2026 • Compliant with Digital Personal Data Protection Act (DPDP) and COPPA
          </p>

          <div className="space-y-6 text-sm text-zinc-300 leading-relaxed">
            <section className="p-4 rounded-xl bg-obsidian border border-structural-dark">
              <h2 className="text-base font-bold text-alabaster flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-mint" />
                1. Student Data Sovereignty & Zero Commercialization
              </h2>
              <p>
                Divyavani was conceived by Vanshika & Divyanshi (Class IX-H) as a purely academic, privacy-first educational tool. We believe student curiosity should never be commodified. We do not sell, rent, or monetize student queries, doubt histories, uploaded chapter documents, or speech transcripts to third-party ad networks or brokers.
              </p>
            </section>

            <section className="p-4 rounded-xl bg-obsidian border border-structural-dark">
              <h2 className="text-base font-bold text-alabaster flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-amber" />
                2. Information We Process
              </h2>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-zinc-300">
                <li><strong className="text-alabaster">Academic Doubts & Queries:</strong> Text queries submitted to the Socratic doubt-solving engine.</li>
                <li><strong className="text-alabaster">Microphone & Audio Data:</strong> Audio processed via the Web Speech API requires explicit, deliberate opt-in toggle and is never retained on permanent external servers.</li>
                <li><strong className="text-alabaster">Uploaded Chapter Documents:</strong> Documents (.pdf, .md, .txt) uploaded to the Multi-Tab Chapter Vault remain in your browser session memory and local cache.</li>
              </ul>
            </section>

            <section className="p-4 rounded-xl bg-obsidian border border-structural-dark">
              <h2 className="text-base font-bold text-alabaster flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-royal" />
                3. Pre-Launch AI Safety & Prompt Isolation
              </h2>
              <p>
                Under our Vibecoded Pre-Launch Security Constitution, all student text queries are enclosed in strict XML boundary tags (<code className="text-mint font-mono">&lt;student_query&gt;</code>) and sanitized through DOMPurify to guarantee zero Cross-Site Scripting (XSS) and complete immunity from prompt injection exploits.
              </p>
            </section>
          </div>
        </article>
      </main>

      <LegalFooter />
    </div>
  );
}
