'use client';

import React from 'react';
import katex from 'katex';
import { sanitizeHtml } from '@/lib/sanitizer';

interface MathRendererProps {
  readonly math?: string;
  readonly content?: string;
  readonly block?: boolean;
  readonly className?: string;
}

export default function MathRenderer({
  math,
  content,
  block = false,
  className = '',
}: MathRendererProps) {
  const target = math ?? content ?? '';

  // If text contains embedded LaTeX $$...$$ or \[...\]
  if (content && (content.includes('$$') || content.includes(String.raw`\[`))) {
    const parts = content.split(/(\$\$[^$]+\$\$|\\\[[^\]]+\\\])/g);
    const parsedParts = parts.map((part, index) => ({
      id: `math-part-${index}-${part.slice(0, 8).replace(/[^a-zA-Z0-9]/g, '')}`,
      text: part,
    }));

    return (
      <span className={`inline leading-relaxed ${className}`}>
        {parsedParts.map(({ id, text }) => {
          if (text.startsWith('$$') && text.endsWith('$$')) {
            const mathStr = text.slice(2, -2);
            try {
              const rawHtml = katex.renderToString(mathStr, { displayMode: false, throwOnError: false });
              return <span key={id} className="inline-block px-1" dangerouslySetInnerHTML={{ __html: sanitizeHtml(rawHtml) }} />;
            } catch {
              return <code key={id} className="font-mono text-xs">{mathStr}</code>;
            }
          }
          if (text.startsWith(String.raw`\[`) && text.endsWith(String.raw`\]`)) {
            const mathStr = text.slice(2, -2);
            try {
              const rawHtml = katex.renderToString(mathStr, { displayMode: true, throwOnError: false });
              return <div key={id} className="my-2 overflow-x-auto text-center" dangerouslySetInnerHTML={{ __html: sanitizeHtml(rawHtml) }} />;
            } catch {
              return <code key={id} className="font-mono text-xs block">{mathStr}</code>;
            }
          }
          return <span key={id}>{text}</span>;
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
  } catch (_err) {
    // Graceful fallback to raw text if KaTeX parser encounters non-standard symbols
    return <span className={`font-sans text-xs ${className}`}>{target}</span>;
  }
}
