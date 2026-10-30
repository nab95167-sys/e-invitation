import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import WishesClient from "./WishesClient";

export default async function WishesPage() {
  const session = await getSession();

  const event = await prisma.event.findFirst({
    where: session?.role === "SUPERADMIN" ? {} : { userId: session?.userId },
    include: {
      wishes: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!event) {
    return <div className="p-8">No event found.</div>;
  }

  return <WishesClient initialWishes={event.wishes} eventSlug={event.slug} />;
}
