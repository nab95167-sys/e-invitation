import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import GuestsClient from "./GuestsClient";

export default async function GuestsPage() {
  const session = await getSession();

  const event = await prisma.event.findFirst({
    where: session?.role === "SUPERADMIN" ? {} : { userId: session?.userId },
    include: {
      guests: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!event) {
    return <div className="p-8">No event found.</div>;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return (
    <GuestsClient
      initialGuests={event.guests}
      eventId={event.id}
      eventSlug={event.slug}
      groomName={event.groomName}
      brideName={event.brideName}
      eventDate={event.eventDate ? event.eventDate.toISOString() : undefined}
      venueName={event.venueName}
      coverImageUrl={event.coverImageUrl}
      baseUrl={baseUrl}
    />
  );
}
