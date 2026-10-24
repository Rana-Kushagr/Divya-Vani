import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Sparkles } from 'lucide-react';

export default function LegalFooter() {
  return (
    <footer className="w-full bg-white border-t border-zinc-200 py-8 px-4 text-xs text-zinc-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Project & Student Attribution */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="flex items-center gap-2 text-zinc-900 font-semibold text-sm">
            <Sparkles className="w-4 h-4 text-zinc-950" />
            <span className="font-serif font-bold">Divya Vani</span>
            <span className="text-[11px] font-normal text-zinc-400">•</span>
            <span className="text-zinc-500 text-xs font-normal">Classroom AI Workspace</span>
          </div>
          <p className="flex items-center gap-1.5 text-zinc-500">
            Conceived by <span className="text-zinc-900 font-medium">Vanshika &amp; Divyanshi</span> (Class IX-H)
          </p>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            NCERT Digital Curriculum • WCAG 2.1 AA Compliant
          </p>
        </div>

        {/* Center: Legal & Compliance Links */}
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-zinc-600">
          <Link href="/privacy" className="hover:text-zinc-950 transition-colors underline-offset-4 hover:underline">
            Privacy Policy (DPDP / COPPA)
          </Link>
          <Link href="/terms" className="hover:text-zinc-950 transition-colors underline-offset-4 hover:underline">
            Terms of Service
          </Link>
          <Link href="/cookies" className="hover:text-zinc-950 transition-colors underline-offset-4 hover:underline">
            Cookie Policy
          </Link>
          <Link href="/accessibility" className="hover:text-zinc-950 transition-colors underline-offset-4 hover:underline">
            Accessibility Statement
          </Link>
        </nav>

        {/* Right: Security Shield Indicator */}
        <div className="flex items-center gap-2 bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-700">
          <ShieldCheck className="w-4 h-4 text-zinc-950" />
          <span className="text-[11px] font-medium">Security Shield Active</span>
        </div>

      </div>
    </footer>
  );
}
