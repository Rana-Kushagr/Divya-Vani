'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, X } from 'lucide-react';

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
      className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-50 bg-white border border-zinc-200 rounded-2xl p-4 shadow-xl text-zinc-900 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-zinc-100 text-zinc-800 flex-shrink-0">
          <Cookie className="w-5 h-5 text-zinc-800" />
        </div>
        <div className="flex-1 text-xs">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-zinc-900 text-sm">Privacy &amp; Cookie Notice</h4>
            <button
              onClick={() => handleConsent('essential')}
              className="text-zinc-400 hover:text-zinc-700 p-1 transition"
              aria-label="Dismiss cookie notice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-zinc-600 mt-1 leading-relaxed">
            Divya Vani uses local storage and essential cookies to preserve your reading progress, bookmarks, and quiz scores. We adhere to DPDP and COPPA standards.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => handleConsent('all')}
              className="px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white font-medium text-xs transition"
            >
              Accept All
            </button>
            <button
              onClick={() => handleConsent('essential')}
              className="px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-medium text-xs transition"
            >
              Essential Only
            </button>
            <Link
              href="/privacy"
              className="text-zinc-500 hover:text-zinc-900 text-xs ml-auto underline-offset-2 hover:underline"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
