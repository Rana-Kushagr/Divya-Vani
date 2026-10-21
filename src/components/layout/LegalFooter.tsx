import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Sparkles, Heart } from 'lucide-react';

export default function LegalFooter() {
  return (
    <footer className="w-full bg-obsidian border-t-1.5 border-structural-dark py-8 px-4 text-xs text-zinc-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Project & Student Attribution */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="flex items-center gap-2 text-alabaster font-semibold text-sm">
            <Sparkles className="w-4 h-4 text-royal" />
            <span>Divyavani (v2.0)</span>
            <span className="text-[11px] font-normal text-zinc-500">•</span>
            <span className="text-zinc-400 text-xs font-normal">Classroom AI Workspace</span>
          </div>
          <p className="flex items-center gap-1.5 text-zinc-500">
            Conceived by <span className="text-alabaster font-medium">Vanshika & Divyanshi</span> (Class IX-H)
          </p>
          <p className="text-[11px] text-zinc-600 mt-0.5">
            Synchronized Double-Palette Architecture • WCAG 2.1 AA Compliant
          </p>
        </div>

        {/* Center: Legal & Compliance Links */}
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-zinc-400">
          <Link href="/privacy" className="hover:text-alabaster transition-colors underline-offset-4 hover:underline">
            Privacy Policy (DPDP / COPPA)
          </Link>
          <Link href="/terms" className="hover:text-alabaster transition-colors underline-offset-4 hover:underline">
            Terms of Service
          </Link>
          <Link href="/cookies" className="hover:text-alabaster transition-colors underline-offset-4 hover:underline">
            Cookie Policy
          </Link>
          <Link href="/accessibility" className="hover:text-alabaster transition-colors underline-offset-4 hover:underline">
            Accessibility Statement
          </Link>
        </nav>

        {/* Right: Constitution Shield Indicator */}
        <div className="flex items-center gap-2 bg-obsidian-surface px-3 py-1.5 rounded-lg border border-structural-dark text-zinc-400">
          <ShieldCheck className="w-4 h-4 text-mint" />
          <span className="text-[11px]">Vibecoded Security Shield Active</span>
        </div>

      </div>
    </footer>
  );
}
