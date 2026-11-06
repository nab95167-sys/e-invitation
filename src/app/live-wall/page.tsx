import { prisma } from "@/lib/prisma";
import LiveWallClient from "./LiveWallClient";

export const dynamic = "force-dynamic";

export default async function LiveWallPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}) {
  const resolvedParams = await searchParams;
  const slug = resolvedParams?.slug;

  let event = null;
  if (slug) {
    event = await prisma.event.findFirst({
      where: { slug: { equals: slug, mode: "insensitive" } },
      include: {
        wishes: {
          where: { isApproved: true },
          orderBy: { createdAt: "desc" },
          take: 50,
        },
        media: {
          where: { category: "GALLERY" },
          orderBy: { sortOrder: "asc" },
          take: 20,
        },
      },
    });
  }

  if (!event) {
    event = await prisma.event.findFirst({
      include: {
        wishes: {
          where: { isApproved: true },
          orderBy: { createdAt: "desc" },
          take: 50,
        },
        media: {
          where: { category: "GALLERY" },
          orderBy: { sortOrder: "asc" },
          take: 20,
        },
      },
    });
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-stone-950 text-white flex items-center justify-center p-8">
        No wedding event found.
      </div>
    );
  }

  return (
    <LiveWallClient
      eventId={event.id}
      eventSlug={event.slug}
      groomName={event.groomName}
      brideName={event.brideName}
      eventDate={event.eventDate ? event.eventDate.toISOString() : null}
      couplePhotoUrl={event.couplePhotoUrl || event.coverImageUrl}
      venueName={event.venueName}
      initialWishes={event.wishes}
    />
  );
}
