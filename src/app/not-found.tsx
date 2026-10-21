import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-obsidian flex flex-col items-center justify-center p-6 text-alabaster">
      <div className="max-w-md w-full bg-obsidian-surface border-1.5 border-structural-dark rounded-2xl p-8 text-center shadow-block-dark">
        <div className="w-14 h-14 mx-auto rounded-xl bg-royal/20 border border-royal flex items-center justify-center text-royal-light mb-4">
          <Search className="w-7 h-7 text-amber" />
        </div>
        
        <span className="text-xs font-mono font-bold tracking-widest text-royal uppercase bg-royal/10 px-2 py-0.5 rounded border border-royal/30">
          Error 404
        </span>
        
        <h1 className="text-2xl font-bold tracking-tight text-alabaster mt-3 mb-2">
          Chapter or Page Not Found
        </h1>
        
        <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
          The educational document or route you are looking for has been moved, archived, or does not exist in the Divyavani syllabus index.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-royal hover:bg-royal-hover text-white text-xs font-semibold transition-colors shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Return to Workspace</span>
          </Link>
          <Link
            href="/revision"
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-obsidian border border-structural-dark hover:bg-zinc-800 text-alabaster text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Revision Hub</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
