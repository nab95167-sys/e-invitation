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
    // 1. themeConfig.socialSharePhoto (if explicitly designated)
    // 2. If themeConfig.socialShareSource === "couple": couplePhotoUrl -> coverImageUrl
    // 3. Default: coverImageUrl (Hero & 3D Envelope Gate Background) -> couplePhotoUrl
    // 4. Fallback: groomPhotoUrl / bridePhotoUrl -> public/og.jpg
    let themeConfig: any = {};
    if (event?.theme) {
      try {
        themeConfig = typeof event.theme === "string" ? JSON.parse(event.theme) : event.theme;
      } catch (e) {}
    }

    const rawImage =
      themeConfig?.socialSharePhoto ||
      (themeConfig?.socialShareSource === "couple"
        ? (event?.couplePhotoUrl || event?.coverImageUrl)
        : (event?.coverImageUrl || event?.couplePhotoUrl)) ||
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
        return NextResponse.redirect(rawImage, 302);
      }

      // Case C: Local file or uploaded asset (redirect directly to CDN asset for high speed & reliability)
      const origin = req.nextUrl.origin || "https://e-invitation-bice.vercel.app";
      if (rawImage.startsWith("/")) {
        return NextResponse.redirect(`${origin}${rawImage}`, 302);
      }
    }

    // Fallback: User's default wedding portrait
    const origin = req.nextUrl.origin || "https://e-invitation-bice.vercel.app";
    return NextResponse.redirect(`${origin}/og.jpg`, 302);
  } catch (error) {
    console.error("OG Image route error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
