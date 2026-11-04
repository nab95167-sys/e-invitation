import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // 1. Fetch event from DB
    let event = null;
    if (slug) {
      event = await prisma.event.findUnique({
        where: { slug },
        select: {
          coverImageUrl: true,
          couplePhotoUrl: true,
          groomPhotoUrl: true,
          bridePhotoUrl: true,
          groomName: true,
          brideName: true,
        },
      });
    }

    if (!event) {
      event = await prisma.event.findFirst({
        select: {
          coverImageUrl: true,
          couplePhotoUrl: true,
          groomPhotoUrl: true,
          bridePhotoUrl: true,
          groomName: true,
          brideName: true,
        },
      });
    }

    // 2. Select image candidate
    const rawImage =
      event?.coverImageUrl ||
      event?.couplePhotoUrl ||
      event?.groomPhotoUrl ||
      event?.bridePhotoUrl;

    if (rawImage) {
      // Case A: Base64 Data URL (e.g. data:image/jpeg;base64,...)
      if (rawImage.startsWith("data:")) {
        const match = rawImage.match(/^data:([^;]+);base64,(.+)$/);
        if (match) {
          const contentType = match[1] || "image/jpeg";
          const base64Data = match[2];
          const buffer = Buffer.from(base64Data, "base64");
          return new Response(buffer, {
            status: 200,
            headers: {
              "Content-Type": contentType,
              "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
            },
          });
        }
      }

      // Case B: External HTTP / HTTPS URL
      if (rawImage.startsWith("http://") || rawImage.startsWith("https://")) {
        return NextResponse.redirect(rawImage, 307);
      }

      // Case C: Local file in /public/
      const cleanPath = rawImage.startsWith("/") ? rawImage.slice(1) : rawImage;
      const fullPath = path.join(process.cwd(), "public", cleanPath);
      try {
        const fileBuffer = await fs.readFile(fullPath);
        const ext = path.extname(fullPath).toLowerCase();
        let mime = "image/jpeg";
        if (ext === ".png") mime = "image/png";
        if (ext === ".webp") mime = "image/webp";
        if (ext === ".gif") mime = "image/gif";
        return new Response(fileBuffer, {
          status: 200,
          headers: {
            "Content-Type": mime,
            "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
          },
        });
      } catch (err) {
        console.warn("Could not read local image file:", fullPath, err);
      }
    }

    // Fallback: Default wedding hero image
    const fallbackPath = path.join(process.cwd(), "public", "img", "hero-m-1280.webp");
    try {
      const fallbackBuffer = await fs.readFile(fallbackPath);
      return new Response(fallbackBuffer, {
        status: 200,
        headers: {
          "Content-Type": "image/webp",
          "Cache-Control": "public, max-age=86400",
        },
      });
    } catch {
      return new Response("Image Not Found", { status: 404 });
    }
  } catch (error) {
    console.error("OG Image route error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
