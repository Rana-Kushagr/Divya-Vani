# Divyavani AI Security, Legal Compliance & Pre-Launch Guardrails

This project complies strictly with the **Vibecoded Website Security, Legal Compliance & Pre-Launch AI Agent Playbook**:

## 1. Zero Client Secret Exposure
- No API keys, service roles, or backend secrets in `NEXT_PUBLIC_` environment variables.
- All LLM/DB calls are routed through server-only handlers using `import 'server-only'`.

## 2. XSS & Prompt Injection Immunity
- All dynamically rendered user inputs, AI markdown, and KaTeX math derivations MUST be sanitized through DOMPurify before rendering into the DOM.
- Never use raw `dangerouslySetInnerHTML` without DOMPurify sanitization.
- Untrusted user queries and uploaded document context MUST be isolated inside explicit XML delimiter tags (`<student_query>...</student_query>`) separate from system instructions to prevent prompt injection.

## 3. Strict Input & Upload Validation
- All forms, tab additions, search parameters, and file metadata are validated by runtime Zod schemas.
- File uploads enforce a strict 10MB cap and extension allowlist: `.pdf`, `.png`, `.jpg`, `.webp`, `.md`, `.txt`. Executable files (`.html`, `.svg`, `.exe`, `.sh`) are strictly rejected.

## 4. Entity Identifier Protection (IDOR / BOLA Prevention)
- All document, tab, doubt, and user identifiers must use cryptographic UUIDv4 strings. Sequential integers (e.g., `/doubt/1041`) are prohibited.

## 5. Synchronized Double-Palette Architecture
- Obsidian Black (`#09090B`) and Alabaster White (`#FFFFFF`) coexist in deliberate rhythm with 1.5px structural borders (`border-structural-dark` / `border-structural-light`).
- WCAG 2.1 AA/AAA contrast ratios: 19.4:1 text contrast for all critical reading surfaces.
- High-visibility keyboard focus rings: `focus-visible:ring-2 focus-visible:ring-royal focus-visible:outline-none`.

## 6. Mandatory Legal & Privacy Shields
- Dedicated legal routes: `/privacy`, `/terms`, `/cookies`, `/accessibility`.
- Equal weight Cookie Consent Banner with matching "Accept All" and "Reject Non-Essential" action buttons.
- Microphone access (Voice HUD & Smart Lecture Listener) strictly requires explicit, deliberate opt-in user consent before calling the Web Speech API.
