'use client';

import React from 'react';
import katex from 'katex';
import { sanitizeHtml } from '@/lib/sanitizer';

interface MathRendererProps {
  math?: string;
  content?: string;
  block?: boolean;
  className?: string;
}

export default function MathRenderer({
  math,
  content,
  block = false,
  className = '',
}: MathRendererProps) {
  const target = math ?? content ?? '';

  // If text contains embedded LaTeX $$...$$
  if (content && (content.includes('$$') || content.includes('\\['))) {
    const parts = content.split(/(\$\$[^$]+\$\$|\\\[[^\]]+\\\])/g);
    return (
      <span className={`inline leading-relaxed ${className}`}>
        {parts.map((part, i) => {
          if (part.startsWith('$$') && part.endsWith('$$')) {
            const mathStr = part.slice(2, -2);
            try {
              const rawHtml = katex.renderToString(mathStr, { displayMode: false, throwOnError: false });
              return <span key={i} className="inline-block px-1" dangerouslySetInnerHTML={{ __html: sanitizeHtml(rawHtml) }} />;
            } catch {
              return <code key={i} className="font-mono text-xs">{mathStr}</code>;
            }
          }
          if (part.startsWith('\\[') && part.endsWith('\\]')) {
            const mathStr = part.slice(2, -2);
            try {
              const rawHtml = katex.renderToString(mathStr, { displayMode: true, throwOnError: false });
              return <div key={i} className="my-2 overflow-x-auto text-center" dangerouslySetInnerHTML={{ __html: sanitizeHtml(rawHtml) }} />;
            } catch {
              return <code key={i} className="font-mono text-xs block">{mathStr}</code>;
            }
          }
          return <span key={i}>{part}</span>;
        })}
      </span>
    );
  }

  // Pure Math rendering
  try {
    const rawHtml = katex.renderToString(target, {
      displayMode: block,
      throwOnError: false,
    });
    const cleanHtml = sanitizeHtml(rawHtml);

    return (
      <span
        className={`inline-block overflow-x-auto max-w-full ${className}`}
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />
    );
  } catch (err) {
    return <span className={`font-sans text-xs ${className}`}>{target}</span>;
  }
}
