import { z } from 'zod';

// Allowed file extensions
export const ALLOWED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg', '.webp', '.md', '.txt', '.mp4', '.webm'] as const;
export const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB for multimedia

// File Upload Validator Schema
export const FileUploadSchema = z.object({
  name: z.string().min(1, 'File name is required').max(255, 'File name too long')
    .refine((name) => {
      const lower = name.toLowerCase();
      return ALLOWED_EXTENSIONS.some((ext) => lower.endsWith(ext));
    }, {
      message: `File type not permitted. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`,
    }),
  size: z.number().max(MAX_FILE_SIZE_BYTES, 'File size exceeds maximum 100 MB limit'),
  type: z.string().refine((type) => {
    // Block executable mime types
    const blocked = ['text/html', 'image/svg+xml', 'application/x-msdownload', 'application/x-sh'];
    return !blocked.includes(type.toLowerCase());
  }, 'Blocked file MIME type for security reasons'),
});

// Auth Login Schema
export const LoginSchema = z.object({
  authMode: z.enum(['email', 'phone', 'google']).default('email'),
  email: z.string().email('Please enter a valid student email').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  phone: z.string().regex(/^\+?[1-9]\d{9,13}$/, 'Please enter a valid phone number').optional(),
  otp: z.string().length(6, 'OTP must be 6 digits').optional(),
  rememberMe: z.boolean().optional(),
}).refine((data) => {
  if (data.authMode === 'email') {
    return !!data.email && !!data.password;
  }
  if (data.authMode === 'phone') {
    return !!data.phone;
  }
  return true;
}, {
  message: 'Required credentials missing for selected login method',
});

// Class and Subject Selection Schema
export const SelectClassSubjectSchema = z.object({
  userId: z.string().optional(),
  classLevel: z.string().min(1, 'Class selection is required'),
  subject: z.string().min(1, 'Subject selection is required'),
});

// Doubt Submission Schema
export const DoubtQuerySchema = z.object({
  userId: z.string().optional(),
  documentId: z.string().optional(),
  studentQuery: z.string().min(3, 'Please enter at least 3 characters for your doubt').max(1500, 'Query too long'),
  subjectId: z.string().min(1, 'Subject selection is required'),
  chapterId: z.string().min(1, 'Chapter selection is required'),
  inputMode: z.enum(['text', 'voice', 'image']).default('text'),
  attachedTabContext: z.string().max(2000).optional(),
  imageBase64: z.string().optional(),
});

// Cookie Consent Schema
export const CookieConsentSchema = z.object({
  essential: z.literal(true),
  analytics: z.boolean(),
  preferences: z.boolean(),
  consentedAt: z.string().datetime(),
});
