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
    const rawParams = await params;
    const slug = rawParams?.slug ? decodeURIComponent(rawParams.slug).trim().replace(/\s+/g, "") : "";

    // 1. Fetch event from DB
    let event = null;
    if (slug) {
      event = await prisma.event.findFirst({
        where: { slug: { equals: slug, mode: "insensitive" } },
        select: {
          coverImageUrl: true,
          couplePhotoUrl: true,
          groomPhotoUrl: true,
          bridePhotoUrl: true,
          groomName: true,
          brideName: true,
          theme: true,
        },
      });
    }

    if (!event) {
      event = await prisma.event.findFirst({
        where: {
          OR: [
            { slug: "hoeurn-phanith-and-seourr-sreynith" },
            { groomName: { contains: "ផានិត" } },
          ],
        },
        select: {
          coverImageUrl: true,
          couplePhotoUrl: true,
          groomPhotoUrl: true,
          bridePhotoUrl: true,
          groomName: true,
          brideName: true,
          theme: true,
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
          theme: true,
        },
      });
    }

    // 2. Select image candidate
    // Priority:
    // 1. themeConfig.socialSharePhoto (explicitly selected in dashboard)
    // 2. couplePhotoUrl (Center couple portrait from The Couple section)
    // 3. groomPhotoUrl / bridePhotoUrl (Portraits)
    // 4. coverImageUrl (Hero / Gate background)
    // 5. fallback public/og.jpg
    let themeConfig: any = {};
    if (event?.theme) {
      try {
        themeConfig = typeof event.theme === "string" ? JSON.parse(event.theme) : event.theme;
      } catch (e) {}
    }

    const rawImage =
      themeConfig?.socialSharePhoto ||
      event?.couplePhotoUrl ||
      event?.groomPhotoUrl ||
      event?.bridePhotoUrl ||
      event?.coverImageUrl;

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

    // Fallback: User's default wedding portrait
    const fallbackPath = path.join(process.cwd(), "public", "og.jpg");
    try {
      const fallbackBuffer = await fs.readFile(fallbackPath);
      return new Response(fallbackBuffer, {
        status: 200,
        headers: {
          "Content-Type": "image/jpeg",
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
