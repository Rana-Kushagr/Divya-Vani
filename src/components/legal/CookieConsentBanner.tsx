'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, ShieldCheck, X } from 'lucide-react';

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('divyavani_cookie_consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleConsent = (level: 'all' | 'essential') => {
    localStorage.setItem(
      'divyavani_cookie_consent',
      JSON.stringify({
        level,
        timestamp: new Date().toISOString(),
      })
    );
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside 
      aria-label="Cookie and Privacy Consent" 
      role="region"
      className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-50 bg-obsidian-surface border-1.5 border-structural-dark rounded-xl p-4 shadow-block-dark text-alabaster animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-royal/20 text-royal-light border border-royal/40 flex-shrink-0">
          <Cookie className="w-5 h-5 text-amber" />
        </div>
        <div className="flex-1 text-xs">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-alabaster text-sm">Privacy & Cookie Consent</h4>
            <button
              onClick={() => handleConsent('essential')}
              className="text-zinc-400 hover:text-alabaster p-1"
              aria-label="Dismiss cookie notice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-zinc-300 mt-1 leading-relaxed">
            Divyavani respects your academic privacy (DPDP / COPPA). We use essential cookies to maintain your multi-tab chapter workspace and offline cache. No tracking ads.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <Link href="/cookies" className="text-royal-light underline hover:text-white text-[11px]">
              Learn more
            </Link>
          </div>

          {/* Equal weight action buttons as per Constitution Guardrail */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-structural-dark">
            <button
              onClick={() => handleConsent('essential')}
              className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-obsidian border border-structural-dark hover:bg-zinc-800 text-alabaster transition-colors text-center"
            >
              Reject Non-Essential
            </button>
            <button
              onClick={() => handleConsent('all')}
              className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-royal hover:bg-royal-hover text-white transition-colors text-center shadow-sm"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
