'use client';

import React from 'react';
import katex from 'katex';
import { sanitizeHtml } from '@/lib/sanitizer';

interface MathRendererProps {
  math: string;
  block?: boolean;
  className?: string;
}

export default function MathRenderer({
  math,
  block = false,
  className = '',
}: MathRendererProps) {
  try {
    const rawHtml = katex.renderToString(math, {
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
    console.error('KaTeX rendering error:', err);
    return <code className="font-mono text-xs">{math}</code>;
  }
}
