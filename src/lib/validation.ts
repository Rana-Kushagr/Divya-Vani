import { z } from 'zod';

// Allowed file extensions
export const ALLOWED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg', '.webp', '.md', '.txt'] as const;
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

// File Upload Validator Schema
export const FileUploadSchema = z.object({
  name: z.string().min(1, 'File name is required').max(255, 'File name too long')
    .refine((name) => {
      const lower = name.toLowerCase();
      return ALLOWED_EXTENSIONS.some((ext) => lower.endsWith(ext));
    }, {
      message: `File type not permitted. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`,
    }),
  size: z.number().max(MAX_FILE_SIZE_BYTES, 'File size exceeds maximum 10 MB limit'),
  type: z.string().refine((type) => {
    // Block executable mime types
    const blocked = ['text/html', 'image/svg+xml', 'application/x-msdownload', 'application/x-sh'];
    return !blocked.includes(type.toLowerCase());
  }, 'Blocked file MIME type for security reasons'),
});

// Doubt Submission Schema
export const DoubtQuerySchema = z.object({
  studentQuery: z.string().min(3, 'Please enter at least 3 characters for your doubt').max(1500, 'Query too long'),
  subjectId: z.enum(['science', 'maths', 'english', 'hindi', 'social_science', 'sanskrit']),
  chapterId: z.string().min(1, 'Chapter selection is required'),
  inputMode: z.enum(['text', 'voice', 'image']),
  attachedTabContext: z.string().max(2000).optional(),
});

// Cookie Consent Schema
export const CookieConsentSchema = z.object({
  essential: z.literal(true),
  analytics: z.boolean(),
  preferences: z.boolean(),
  consentedAt: z.string().datetime(),
});
