import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, sanitizeString } from "@/lib/security";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");
    const slug = searchParams.get("slug");

    let targetEventId = eventId;
    if (!targetEventId && !slug) {
      const session = await getSession();
      const ev = await prisma.event.findFirst({
        where: session?.role === "SUPERADMIN" ? {} : session ? { userId: session.userId } : { isPublished: true },
        select: { id: true },
      });
      targetEventId = ev?.id || null;
    }

    const whereClause: any = { isApproved: true };
    if (targetEventId) whereClause.eventId = targetEventId;
    else if (slug) whereClause.event = { slug };

    const wishes = await prisma.wish.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ success: true, wishes });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch wishes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local";
    const rate = checkRateLimit(`wish-${ip}`, 10, 60000);
    if (!rate.success) {
      return NextResponse.json(
        { error: "Too many wishes submitted. Please wait a moment." },
        { status: 429 }
      );
    }

    const { eventSlug, senderName, message, relationship } = await req.json();

    if (!eventSlug || !senderName?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Name and message are required." },
        { status: 400 }
      );
    }

    const event = await prisma.event.findUnique({
      where: { slug: eventSlug },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const cleanName = sanitizeString(senderName.trim());
    const cleanMessage = sanitizeString(message.trim());
    const cleanRelationship = sanitizeString(relationship?.trim() || "");

    const wish = await prisma.wish.create({
      data: {
        eventId: event.id,
        senderName: cleanName,
        message: cleanMessage,
        relationship: cleanRelationship || null,
        isApproved: true,
      },
    });

    return NextResponse.json({ success: true, wish });
  } catch (error) {
    console.error("Wish submission error:", error);
    return NextResponse.json({ error: "Failed to post message." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await prisma.wish.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Wish deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete wish" }, { status: 500 });
  }
}
