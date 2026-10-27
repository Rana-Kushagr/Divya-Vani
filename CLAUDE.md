# Divyavani AI Security, Legal Compliance & Pre-Launch Guardrails (v3.0)
# NextToppers & Extramarks Inspired EdTech UI/UX + 3 Google Drive Vaults Edition

This project complies strictly with the **Vibecoded Website Security, Legal Compliance & Pre-Launch AI Agent Playbook**:

## 1. Zero Client Secret Exposure
- No API keys, service roles, or backend secrets in `NEXT_PUBLIC_` or `VITE_` environment variables.
- All LLM/DB calls are routed through server-only handlers using `import 'server-only'`.

## 2. Row-Level Security (RLS) & Entity Protection
- All database tables enforce Row-Level Security (`auth.uid() = user_id`).
- All entities, document tabs, and doubts use UUIDv4 identifiers (sequential integers prohibited to prevent IDOR/BOLA attacks).

## 3. Strict Input & Upload Validation (Zod Guarded)
- Runtime Zod schemas validate all inputs, query forms, and document upload metadata.
- Supported file extensions: `.pdf`, `.mp4`, `.webm`, `.md`, `.txt`, `.png`, `.jpg`, `.webp` (Max 10MB).
- Executable and script-bearing extensions (`.html`, `.svg`, `.exe`, `.sh`, `.bat`, `.js`, `.php`) are strictly blocked on upload.
- Google Drive folder and file links are validated against `https://drive.google.com/drive/folders/...` or `https://drive.google.com/file/...`.

## 4. XSS & Prompt Injection Immunity
- All markdown and KaTeX LaTeX math output sanitized via DOMPurify before rendering into the DOM.
- Untrusted user queries and active chapter tab context are isolated inside explicit XML delimiter tags (`<student_query>...</student_query>`) separate from system pedagogical prompts.

## 5. NextToppers + Extramarks EdTech Design System
- Canvas: Soft Slate-50 (`#F8FAFC`) background canvas with radial dot grid pattern to reduce eye fatigue during multi-hour study sessions.
- Elevated Cards: Crisp `#FFFFFF` elevated cards (`rounded-2xl shadow-sm border border-slate-200`).
- Primary Brand Accent: Royal Indigo (`#4F46E5` / `indigo-600`).
- Action Badges: Extramarks Coral Orange (`#F97316` / `orange-500`) for "Live Batch" and "Score Booster" pills.
- Mastery Progress: Emerald Teal (`#10B981` / `emerald-500`).
- Deep Slate Typography: `#0F172A` (slate-900) meeting WCAG 2.1 AA (>12:1 contrast).

## 6. Integrated Google Drive Chapter Resource Vaults
The 3 pre-configured Google Drive Chapter Vaults are embedded via secure iframe views:
- **Vault 1 (Lectures & Core PDFs)**: `1-p63t_9hciCKCspwVJNNoUHsPpYVgX1e`
- **Vault 2 (Study Notes & Reference Media)**: `1KcZbtN5ij-19L8SkS6AjLqaLdwzP2sX4`
- **Vault 3 (DPPs, Practice Banks & Videos)**: `1lEU75-5NTwcfQGSfUFu3_ARibYVDyHbl`

## 7. Mandatory Legal & Privacy Shields
- Dedicated routes: `/privacy`, `/terms`, `/cookies`, `/accessibility`.
- Equal weight Cookie Consent Banner with matching "Accept All" and "Reject All" action buttons.
- Microphone access (Voice HUD & Smart Lecture Listener) strictly requires explicit, deliberate opt-in user consent before calling the Web Speech API.
