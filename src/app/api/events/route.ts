import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sanitizeString } from "@/lib/security";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (slug) {
      let event = await prisma.event.findUnique({
        where: { slug },
        include: {
          media: { orderBy: { sortOrder: "asc" } },
          _count: {
            select: { guests: true, wishes: true },
          },
        },
      });

      // Fallback: If not found by custom slug, gracefully return the active published wedding event
      if (!event) {
        event = await prisma.event.findFirst({
          include: {
            media: { orderBy: { sortOrder: "asc" } },
            _count: {
              select: { guests: true, wishes: true },
            },
          },
        });
      }

      if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, event });
    }

    const session = await getSession();
    const event = await prisma.event.findFirst({
      where: session && session.role !== "SUPERADMIN" ? { userId: session.userId } : {},
      include: {
        media: true,
        _count: {
          select: { guests: true, wishes: true },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error("GET /api/events error:", error);
    return NextResponse.json({ error: "Failed to load event", details: String(error) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role === "GUEST") {
      return NextResponse.json(
        { error: "Access denied. Your account has restricted view-only permissions and cannot modify event settings." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      id,
      slug,
      title,
      groomName,
      groomParents,
      brideName,
      brideParents,
      quote,
      story,
      eventDate,
      ceremonyTime,
      receptionTime,
      venueName,
      venueAddress,
      googleMapsUrl,
      coverImageUrl,
      groomPhotoUrl,
      bridePhotoUrl,
      theme,
      musicUrl,
      videoUrl,
      dressCode,
      bankAccountInfo,
      lunarDate,
      contacts,
      programme,
      couplePhotoUrl,
      venuePhotoUrl,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    // Clean and validate custom slug if provided
    let cleanSlug: string | undefined = undefined;
    if (slug) {
      cleanSlug = slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      if (cleanSlug) {
        const existing = await prisma.event.findFirst({
          where: { slug: cleanSlug, NOT: { id } },
        });
        if (existing) {
          return NextResponse.json(
            { error: "This URL slug is already taken. Please choose another." },
            { status: 400 }
          );
        }
      }
    }

    const updated = await prisma.event.update({
      where: { id },
      data: {
        ...(cleanSlug && { slug: cleanSlug }),
        ...(title && { title: sanitizeString(title) }),
        ...(groomName && { groomName: sanitizeString(groomName) }),
        ...(groomParents !== undefined && { groomParents: sanitizeString(groomParents) }),
        ...(brideName && { brideName: sanitizeString(brideName) }),
        ...(brideParents !== undefined && { brideParents: sanitizeString(brideParents) }),
        ...(quote !== undefined && { quote: sanitizeString(quote) }),
        ...(story !== undefined && { story: sanitizeString(story) }),
        ...(eventDate && { eventDate: new Date(eventDate) }),
        ...(ceremonyTime !== undefined && { ceremonyTime: sanitizeString(ceremonyTime) }),
        ...(receptionTime !== undefined && { receptionTime: sanitizeString(receptionTime) }),
        ...(venueName && { venueName: sanitizeString(venueName) }),
        ...(venueAddress && { venueAddress: sanitizeString(venueAddress) }),
        ...(googleMapsUrl !== undefined && { googleMapsUrl }),
        ...(coverImageUrl !== undefined && { coverImageUrl }),
        ...(groomPhotoUrl !== undefined && { groomPhotoUrl }),
        ...(bridePhotoUrl !== undefined && { bridePhotoUrl }),
        ...(theme && { theme }),
        ...(musicUrl !== undefined && { musicUrl }),
        ...(videoUrl !== undefined && { videoUrl }),
        ...(dressCode !== undefined && { dressCode: sanitizeString(dressCode) }),
        ...(bankAccountInfo !== undefined && { bankAccountInfo: sanitizeString(bankAccountInfo) }),
        ...(lunarDate !== undefined && { lunarDate: sanitizeString(lunarDate) }),
        ...(contacts !== undefined && { contacts: sanitizeString(contacts) }),
        ...(programme !== undefined && { programme: sanitizeString(programme) }),
        ...(couplePhotoUrl !== undefined && { couplePhotoUrl }),
        ...(venuePhotoUrl !== undefined && { venuePhotoUrl }),
      },
    });

    return NextResponse.json({ success: true, event: updated });
  } catch (error) {
    console.error("Update event error:", error);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}
