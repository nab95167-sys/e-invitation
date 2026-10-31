import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  ALLOWED_PHOTO_TYPES,
  ALLOWED_VIDEO_TYPES,
  ALLOWED_AUDIO_TYPES,
  MAX_PHOTO_SIZE,
  MAX_VIDEO_SIZE,
  MAX_AUDIO_SIZE,
} from "@/lib/security";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export const dynamic = "force-dynamic";

async function uploadToCloudinary(
  buffer: Buffer,
  mimeType: string,
  filename: string
): Promise<string | null> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

  if (cloudName && uploadPreset) {
    try {
      const formData = new FormData();
      const blob = new Blob([new Uint8Array(buffer)], { type: mimeType });
      formData.append("file", blob, filename);
      formData.append("upload_preset", uploadPreset);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const json = await res.json();
        return json.secure_url || json.url || null;
      }
    } catch (e) {
      console.warn("Cloudinary upload failed:", e);
    }
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const mimeType = (file.type || "").toLowerCase();
    const lowerName = file.name.toLowerCase();

    const isPhoto =
      ALLOWED_PHOTO_TYPES.includes(mimeType) ||
      mimeType.startsWith("image/") ||
      /\.(jpg|jpeg|png|webp|gif|heic|heif|avif|bmp|tiff|svg)$/i.test(lowerName);
    const isVideo =
      ALLOWED_VIDEO_TYPES.includes(mimeType) ||
      mimeType.startsWith("video/") ||
      /\.(mp4|webm|mov|m4v|avi|mkv)$/i.test(lowerName);
    const isAudio =
      ALLOWED_AUDIO_TYPES.includes(mimeType) ||
      mimeType.startsWith("audio/") ||
      /\.(mp3|wav|ogg|m4a|aac|flac|opus|wma)$/i.test(lowerName);

    if (!isPhoto && !isVideo && !isAudio) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPG, PNG, WEBP, GIF, HEIC, AVIF, MP4, WEBM, MOV, MP3, WAV, M4A, OGG." },
        { status: 400 }
      );
    }

    const maxSize = isPhoto ? MAX_PHOTO_SIZE : isAudio ? MAX_AUDIO_SIZE : MAX_VIDEO_SIZE;
    if (file.size > maxSize) {
      const limitMb = Math.round(maxSize / (1024 * 1024));
      return NextResponse.json(
        { error: `File too large. Max allowed: ${limitMb}MB.` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract safe extension
    let extension = path.extname(lowerName);
    if (!extension || extension.length < 2) {
      if (mimeType.includes("png")) extension = ".png";
      else if (mimeType.includes("webp")) extension = ".webp";
      else if (mimeType.includes("gif")) extension = ".gif";
      else if (mimeType.includes("heic")) extension = ".heic";
      else if (mimeType.includes("avif")) extension = ".avif";
      else if (mimeType.includes("svg")) extension = ".svg";
      else if (mimeType.includes("wav")) extension = ".wav";
      else if (mimeType.includes("ogg")) extension = ".ogg";
      else if (mimeType.includes("m4a")) extension = ".m4a";
      else if (isAudio) extension = ".mp3";
      else if (isPhoto) extension = ".jpg";
      else extension = ".mp4";
    }

    const safeFilename = `${crypto.randomUUID()}${extension}`;
    let publicUrl = "";

    // 1. Try Cloudinary if configured
    const cloudinaryUrl = await uploadToCloudinary(buffer, mimeType, safeFilename);
    if (cloudinaryUrl) {
      publicUrl = cloudinaryUrl;
    } else {
      // 2. Try writing to local public/uploads directory (works locally)
      try {
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await fs.mkdir(uploadDir, { recursive: true });
        const filePath = path.join(uploadDir, safeFilename);
        await fs.writeFile(filePath, buffer);
        publicUrl = `/uploads/${safeFilename}`;
      } catch (fsErr: any) {
        // 3. Vercel Serverless Fallback (read-only filesystem) -> High-res Base64 Data URL
        console.warn("Local disk read-only (Vercel Serverless). Using Base64 Data URL:", fsErr?.message);
        publicUrl = `data:${mimeType || "image/jpeg"};base64,${buffer.toString("base64")}`;
      }
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      mediaType: isPhoto ? "PHOTO" : isVideo ? "VIDEO" : "AUDIO",
      originalName: file.name,
      size: file.size,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error?.message || "File upload failed." },
      { status: 500 }
    );
  }
}
