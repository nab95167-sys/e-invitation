import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import InvitationClient from "./InvitationClient";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ code?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug },
  });

  if (!event) {
    return {
      title: "Wedding Invitation Not Found",
    };
  }

  return {
    title: `${event.groomName} & ${event.brideName} — Wedding Invitation`,
    description: `You are cordially invited to celebrate the marriage of ${event.groomName} & ${event.brideName}.`,
    openGraph: {
      title: `${event.groomName} & ${event.brideName}'s Wedding Celebration`,
      description: `Join us on ${new Date(event.eventDate).toLocaleDateString()} at ${event.venueName}.`,
      images: [event.coverImageUrl || ""],
    },
  };
}

export default async function InvitationPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { code } = await searchParams;

  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      media: {
        orderBy: { sortOrder: "asc" },
      },
      wishes: {
        where: { isApproved: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!event) {
    notFound();
  }

  let guest = null;
  if (code) {
    guest = await prisma.guest.findUnique({
      where: { invitationCode: code },
    });

    if (guest && guest.eventId === event.id) {
      // Record view asynchronously
      await prisma.guest.update({
        where: { id: guest.id },
        data: {
          viewsCount: { increment: 1 },
          isOpened: true,
          openedAt: guest.openedAt || new Date(),
        },
      });
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return <InvitationClient event={event} guest={guest} baseUrl={baseUrl} />;
}
