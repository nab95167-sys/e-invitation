import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    if (!code) {
      return NextResponse.json({ error: "Code required" }, { status: 400 });
    }

    const guest = await prisma.guest.findUnique({
      where: { invitationCode: code },
      select: {
        id: true,
        name: true,
        category: true,
        tableNumber: true,
        maxGuests: true,
        rsvpStatus: true,
        attendeesCount: true,
        notes: true,
        isOpened: true,
      },
    });

    if (!guest) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 });
    }

    // Record open asynchronously
    await prisma.guest.update({
      where: { id: guest.id },
      data: {
        viewsCount: { increment: 1 },
        isOpened: true,
        openedAt: new Date(),
      },
    });

    return NextResponse.json(
      { success: true, guest },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ error: "Failed to resolve guest" }, { status: 500 });
  }
}
