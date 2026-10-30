import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sanitizeString } from "@/lib/security";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");
    const slug = searchParams.get("slug");

    const where: any = {};
    if (eventId) where.eventId = eventId;
    if (slug) where.event = { slug };

    const items = await prisma.mediaItem.findMany({
      where,
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ success: true, items });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load media" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role === "GUEST") {
      return NextResponse.json(
        { error: "Access denied. Your account has restricted view-only permissions and cannot upload media." },
        { status: 403 }
      );
    }

    const { eventId, title, mediaType, url, caption, category } = await req.json();

    if (!eventId || !url) {
      return NextResponse.json({ error: "Event ID and media URL are required" }, { status: 400 });
    }

    const item = await prisma.mediaItem.create({
      data: {
        eventId,
        title: title ? sanitizeString(title) : null,
        mediaType: mediaType === "VIDEO" ? "VIDEO" : "PHOTO",
        url,
        caption: caption ? sanitizeString(caption) : null,
        category: category || "GALLERY",
      },
    });

    return NextResponse.json({ success: true, item });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add media item" }, { status: 500 });
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
        { error: "Access denied. Your account has restricted view-only permissions and cannot modify media." },
        { status: 403 }
      );
    }

    const { id, title, caption, category, sortOrder } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Media ID required" }, { status: 400 });
    }

    const item = await prisma.mediaItem.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: sanitizeString(title) }),
        ...(caption !== undefined && { caption: sanitizeString(caption) }),
        ...(category !== undefined && { category }),
        ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) }),
      },
    });

    return NextResponse.json({ success: true, item });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update media item" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role === "GUEST") {
      return NextResponse.json(
        { error: "Access denied. Your account has restricted view-only permissions and cannot delete media." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await prisma.mediaItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Media deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete media" }, { status: 500 });
  }
}
