import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, sanitizeString } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local";
    const rate = checkRateLimit(`rsvp-${ip}`, 20, 60000);
    if (!rate.success) {
      return NextResponse.json(
        { error: "Too many RSVP updates. Please try again shortly." },
        { status: 429 }
      );
    }

    const { invitationCode, guestName, eventSlug, rsvpStatus, attendeesCount, dietaryRestrictions, notes } =
      await req.json();

    if (!rsvpStatus) {
      return NextResponse.json(
        { error: "RSVP status is required." },
        { status: 400 }
      );
    }

    if (!["ATTENDING", "DECLINED"].includes(rsvpStatus)) {
      return NextResponse.json(
        { error: "Invalid RSVP status. Must be ATTENDING or DECLINED." },
        { status: 400 }
      );
    }

    let guest = null;
    if (invitationCode) {
      guest = await prisma.guest.findUnique({
        where: { invitationCode },
      });
    }

    if (!guest && guestName && eventSlug) {
      const event = await prisma.event.findUnique({
        where: { slug: eventSlug },
      });
      if (!event) {
        return NextResponse.json({ error: "Event not found." }, { status: 404 });
      }
      const randomSuffix = Math.random().toString(36).substring(2, 7);
      const code = `guest-${randomSuffix}`;
      guest = await prisma.guest.create({
        data: {
          eventId: event.id,
          name: sanitizeString(guestName),
          invitationCode: code,
          category: "General",
          maxGuests: 4,
          rsvpStatus,
          attendeesCount: rsvpStatus === "ATTENDING" ? Math.min(Math.max(1, Number(attendeesCount) || 1), 4) : 0,
          notes: sanitizeString(notes || ""),
          dietaryRestrictions: sanitizeString(dietaryRestrictions || ""),
          isOpened: true,
          openedAt: new Date(),
          viewsCount: 1,
        },
      });

      return NextResponse.json({
        success: true,
        message: rsvpStatus === "ATTENDING" ? "Thank you! Your RSVP is confirmed." : "Thank you for letting us know.",
        guest: {
          name: guest.name,
          rsvpStatus: guest.rsvpStatus,
          attendeesCount: guest.attendeesCount,
          dietaryRestrictions: guest.dietaryRestrictions,
        },
      });
    }

    if (!guest) {
      return NextResponse.json(
        { error: "Valid invitation code or guest name is required." },
        { status: 404 }
      );
    }

    const count = rsvpStatus === "ATTENDING" ? Math.min(Math.max(1, Number(attendeesCount) || 1), guest.maxGuests) : 0;

    const updated = await prisma.guest.update({
      where: { id: guest.id },
      data: {
        rsvpStatus,
        attendeesCount: count,
        dietaryRestrictions: sanitizeString(dietaryRestrictions || ""),
        notes: sanitizeString(notes || ""),
        isOpened: true,
        openedAt: guest.openedAt || new Date(),
        viewsCount: { increment: 1 },
      },
    });

    return NextResponse.json({
      success: true,
      message: rsvpStatus === "ATTENDING" ? "Thank you! Your RSVP is confirmed." : "Thank you for letting us know.",
      guest: {
        name: updated.name,
        rsvpStatus: updated.rsvpStatus,
        attendeesCount: updated.attendeesCount,
        dietaryRestrictions: updated.dietaryRestrictions,
      },
    });
  } catch (error) {
    console.error("RSVP error:", error);
    return NextResponse.json(
      { error: "Failed to submit RSVP." },
      { status: 500 }
    );
  }
}
