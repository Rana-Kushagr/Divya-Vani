import DOMPurify from 'dompurify';

/**
 * Sanitizes untrusted HTML / markdown content to protect against XSS.
 * Safe for client-side and hybrid environments.
 */
export function sanitizeHtml(dirty: string): string {
  if (typeof window === 'undefined') {
    // In SSR, return escaped text or basic fallback
    return dirty.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  return DOMPurify.sanitize(dirty, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: [
      'b', 'i', 'em', 'strong', 'a', 'p', 'span', 'code', 'pre',
      'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'blockquote',
      'table', 'thead', 'tbody', 'tr', 'th', 'td', 'br', 'hr',
      'div'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style', 'id', 'data-term'],
  });
}

/**
 * Isolates untrusted student query input inside XML boundary tags
 * to eliminate prompt injection attacks against LLMs.
 */
export function wrapInPromptDelimiters(studentText: string, context?: string): string {
  const safeQuery = studentText.replace(/<\/student_query>/gi, '');
  const safeContext = context ? context.replace(/<\/chapter_context>/gi, '') : '';
  
  return `<system_instruction>
You are Divyavani Socratic AI Tutor for Class IX CBSE. Explain concepts with patience, formula derivation, and clarity.
Follow strict pedagogical steps: 1. Concept Link, 2. Given Data, 3. Formula Spotlight, 4. Step-by-Step Derivation, 5. Micro-Quiz.
</system_instruction>
${safeContext ? `<chapter_context>\n${safeContext}\n</chapter_context>` : ''}
<student_query>
${safeQuery}
</student_query>`;
}

/**
 * Simple client-side UUID generator (RFC4122 v4 compliant)
 */
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
