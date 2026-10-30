import crypto from "crypto";

// Decode HTML entities safely
export function decodeHtmlEntities(input: string): string {
  if (!input) return "";
  let decoded = input;
  // Multiple passes to unwrap nested &amp;amp;
  for (let i = 0; i < 5; i++) {
    const next = decoded
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'");
    if (next === decoded) break;
    decoded = next;
  }
  return decoded;
}

// Sanitize string to prevent XSS without corrupting ampersands and quotes in user text
export function sanitizeString(input: string): string {
  if (!input) return "";
  const decoded = decodeHtmlEntities(input);
  // Strip dangerous HTML tags
  return decoded.replace(/<[^>]*>/g, "").trim();
}

// Generate random secure token for unique guest invites
export function generateInvitationCode(name: string): string {
  const cleanName = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 15);
  const randomSuffix = crypto.randomBytes(3).toString("hex");
  return `${cleanName}-${randomSuffix}`;
}

// In-memory simple rate limiter (IP based, resets every minute)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(identifier: string, limit: number = 30, windowMs: number = 60000): {
  success: boolean;
  remaining: number;
} {
  const now = Date.now();
  const userRecord = rateLimitMap.get(identifier);

  if (!userRecord || now > userRecord.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (userRecord.count >= limit) {
    return { success: false, remaining: 0 };
  }

  userRecord.count += 1;
  return { success: true, remaining: limit - userRecord.count };
}

// Allowed MIME types and extensions for photos, videos, and music audio
export const ALLOWED_PHOTO_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
  "image/avif",
  "image/svg+xml",
  "image/bmp",
  "image/tiff",
  "image/x-icon",
];
export const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-m4v",
  "video/x-msvideo",
  "video/x-matroska",
];
export const ALLOWED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  "audio/ogg",
  "audio/aac",
  "audio/m4a",
  "audio/x-m4a",
  "audio/mp4",
  "audio/webm",
  "audio/flac",
  "audio/opus",
];

export const MAX_PHOTO_SIZE = 35 * 1024 * 1024; // 35MB for high-res modern photos
export const MAX_AUDIO_SIZE = 60 * 1024 * 1024; // 60MB
export const MAX_VIDEO_SIZE = 120 * 1024 * 1024; // 120MB
