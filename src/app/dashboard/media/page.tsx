import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import MediaClient from "./MediaClient";

export default async function MediaPage() {
  const session = await getSession();

  const event = await prisma.event.findFirst({
    where: session?.role === "SUPERADMIN" ? {} : { userId: session?.userId },
    include: {
      media: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!event) {
    return <div className="p-8">No event found.</div>;
  }

  return <MediaClient initialMedia={event.media} eventId={event.id} eventSlug={event.slug} />;
}
