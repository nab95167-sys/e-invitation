import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import GiftsClient from "./GiftsClient";

export const dynamic = "force-dynamic";

export default async function GiftsPage() {
  const session = await getSession();

  const event = await prisma.event.findFirst({
    where: session?.role === "SUPERADMIN" ? {} : { userId: session?.userId },
    include: {
      gifts: {
        orderBy: { createdAt: "desc" },
        include: {
          guest: {
            select: {
              id: true,
              name: true,
              category: true,
              tableNumber: true,
            },
          },
        },
      },
      guests: {
        select: {
          id: true,
          name: true,
          category: true,
          tableNumber: true,
        },
        orderBy: { name: "asc" },
      },
    },
  });

  if (!event) {
    return (
      <div className="p-8 text-center text-stone-500">
        រកមិនឃើញព័ត៌មានកម្មវិធីមង្គលការឡើយ (No event found)
      </div>
    );
  }

  return (
    <GiftsClient
      initialGifts={event.gifts}
      guests={event.guests}
      eventId={event.id}
      eventSlug={event.slug}
      groomName={event.groomName}
      brideName={event.brideName}
    />
  );
}
