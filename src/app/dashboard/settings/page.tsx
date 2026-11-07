import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SettingsClient from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await getSession();

  let user = null;
  if (session?.userId) {
    user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  const [totalGuests, totalGifts, totalWishes, totalEvents] = await Promise.all([
    prisma.guest.count().catch(() => 0),
    prisma.gift.count().catch(() => 0),
    prisma.wish.count().catch(() => 0),
    prisma.event.count().catch(() => 0),
  ]);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      <SettingsClient
        user={
          user || {
            id: session?.userId || "user",
            name: session?.name || "Admin",
            email: session?.email || "admin@wedding.com",
            role: session?.role || "SUPERADMIN",
            createdAt: new Date(),
          }
        }
        stats={{
          totalGuests,
          totalGifts,
          totalWishes,
          totalEvents,
        }}
      />
    </div>
  );
}
