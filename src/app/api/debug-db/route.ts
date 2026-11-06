import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const rawUrl = process.env.DATABASE_URL || "";
  let masked = "NOT_SET";
  let host = "";
  let database = "";
  let username = "";

  if (rawUrl) {
    try {
      const parsed = new URL(rawUrl);
      host = parsed.host;
      database = parsed.pathname.replace(/^\//, "");
      username = parsed.username;
      masked = `${parsed.protocol}//${parsed.username}:****@${parsed.host}${parsed.pathname}`;
    } catch {
      masked = "INVALID_URL";
    }
  }

  const giftCount = await prisma.gift.count();
  const eventCount = await prisma.event.count();
  const guestCount = await prisma.guest.count();
  const latestGift = await prisma.gift.findFirst({
    orderBy: { createdAt: "desc" },
    select: { id: true, guestName: true, amount: true, currency: true, createdAt: true },
  });

  return NextResponse.json({
    databaseHost: host,
    databaseName: database,
    databaseUsername: username,
    maskedUrl: masked,
    stats: {
      giftCount,
      eventCount,
      guestCount,
      latestGift,
    },
  });
}
