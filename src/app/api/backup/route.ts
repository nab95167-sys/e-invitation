import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "SUPERADMIN" && session.role !== "COUPLE")) {
      return NextResponse.json({ error: "Access denied. Administrative privileges required." }, { status: 403 });
    }

    const [events, guests, gifts, wishes, media] = await Promise.all([
      prisma.event.findMany({
        where: session.role === "SUPERADMIN" ? {} : { userId: session.userId },
      }),
      prisma.guest.findMany(),
      prisma.gift.findMany(),
      prisma.wish.findMany(),
      prisma.mediaItem.findMany(),
    ]);

    const backupData = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      exportedBy: {
        name: session.name,
        email: session.email,
        role: session.role,
      },
      summary: {
        totalEvents: events.length,
        totalGuests: guests.length,
        totalGifts: gifts.length,
        totalWishes: wishes.length,
        totalMedia: media.length,
      },
      data: {
        events,
        guests,
        gifts,
        wishes,
        media,
      },
    };

    const dateStr = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const filename = `wedding-backup-${dateStr}.json`;

    return new NextResponse(JSON.stringify(backupData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error: any) {
    console.error("Backup export error:", error);
    return NextResponse.json(
      { error: "Failed to generate system backup: " + (error?.message || "") },
      { status: 500 }
    );
  }
}
