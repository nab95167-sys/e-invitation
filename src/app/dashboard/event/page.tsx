import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import EventClient from "./EventClient";

export default async function EventPage() {
  const session = await getSession();

  const event = await prisma.event.findFirst({
    where: session?.role === "SUPERADMIN" ? {} : { userId: session?.userId },
    include: {
      media: {
        orderBy: { createdAt: "desc" },
      },
      guests: {
        select: {
          id: true,
          name: true,
          invitationCode: true,
        },
        orderBy: { createdAt: "desc" },
        take: 30,
      },
    },
  });

  if (!event) {
    return <div className="p-8">No event found.</div>;
  }

  return (
    <EventClient
      initialEvent={event}
      initialMedia={event.media || []}
      initialGuests={event.guests || []}
    />
  );
}
