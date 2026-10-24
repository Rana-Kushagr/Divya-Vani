// src/components/layout/DivyaVaniLogo.tsx
'use client';

import React from 'react';

interface DivyaVaniLogoProps {
  readonly variant?: 'light' | 'dark'; // 'light' is dark text/svg on light bg; 'dark' is white text/svg on dark bg
  readonly size?: 'sm' | 'md' | 'lg' | 'xl';
  readonly showText?: boolean;
  readonly showSubtitle?: boolean;
  readonly className?: string;
}

export default function DivyaVaniLogo({
  variant = 'light',
  size = 'md',
  showText = true,
  showSubtitle = false,
  className = '',
}: DivyaVaniLogoProps) {
  const isDark = variant === 'dark';
  const strokeColor = isDark ? '#FFFFFF' : '#09090B';
  const fillColor = isDark ? '#FFFFFF' : '#09090B';

  const iconDimensions = {
    sm: { w: 28, h: 22 },
    md: { w: 38, h: 30 },
    lg: { w: 54, h: 42 },
    xl: { w: 76, h: 56 },
  }[size];

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Monochrome Open Book + Rising Sun SVG Emblem */}
      <svg
        width={iconDimensions.w}
        height={iconDimensions.h}
        viewBox="0 0 100 76"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
        aria-hidden="true"
      >
        {/* Radiating Sunbeams */}
        <line x1="50" y1="4" x2="50" y2="12" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
        <line x1="32" y1="9" x2="36" y2="16" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
        <line x1="68" y1="9" x2="64" y2="16" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
        <line x1="18" y1="22" x2="25" y2="27" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
        <line x1="82" y1="22" x2="75" y2="27" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />

        {/* Rising Sun Half-Disc */}
        <path
          d="M 36 34 A 14 14 0 0 1 64 34 Z"
          fill={fillColor}
        />

        {/* Open Book Left Page */}
        <path
          d="M 50 36 C 42 33 22 33 6 38 C 6 48 6 62 6 66 C 22 61 42 61 50 64 Z"
          fill="none"
          stroke={strokeColor}
          strokeWidth="3.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Open Book Right Page */}
        <path
          d="M 50 36 C 58 33 78 33 94 38 C 94 48 94 62 94 66 C 78 61 58 61 50 64 Z"
          fill="none"
          stroke={strokeColor}
          strokeWidth="3.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Spine & Page Layer Detail */}
        <line x1="50" y1="36" x2="50" y2="65" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
        <path d="M 12 43 C 24 39 40 40 46 42" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <path d="M 88 43 C 76 39 60 40 54 42" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <path d="M 12 50 C 24 46 40 47 46 49" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <path d="M 88 50 C 76 46 60 47 54 49" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      </svg>

      {/* Typography: Divya Vani */}
      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-serif font-bold tracking-tight leading-none ${textSizes} ${
              isDark ? 'text-white' : 'text-zinc-950'
            }`}
          >
            Divya Vani
          </span>
          {showSubtitle && (
            <span
              className={`text-[10px] sm:text-xs tracking-widest mt-1 uppercase font-medium ${
                isDark ? 'text-zinc-400' : 'text-zinc-500'
              }`}
            >
              Learn &bull; Grow &bull; Shine
            </span>
          )}
        </div>
      )}
    </div>
  );
}
