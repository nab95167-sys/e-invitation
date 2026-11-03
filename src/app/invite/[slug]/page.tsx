import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import InvitationClient from "./InvitationClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ code?: string; to?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { code, to } = (await searchParams) || {};
  const event = await prisma.event.findUnique({
    where: { slug },
  });

  if (!event) {
    return {
      title: "Wedding Invitation Not Found",
    };
  }

  let guestName = to ? decodeURIComponent(to).trim() : "";
  if (!guestName && code) {
    try {
      const guest = await prisma.guest.findUnique({
        where: { invitationCode: code },
        select: { name: true },
      });
      if (guest?.name) guestName = guest.name;
    } catch (e) {}
  }

  const coupleTitle = `${event.groomName} & ${event.brideName}`;
  const title = guestName
    ? `💌 លិខិតគោរពអញ្ជើញ៖ ${guestName} · ${coupleTitle}`
    : `សិរីសួស្តីអាពាហ៍ពិពាហ៍ · ${coupleTitle}`;

  let dateFormatted = "";
  try {
    const d = new Date(event.eventDate);
    dateFormatted = d.toLocaleDateString("km-KH", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch (e) {}

  const description = guestName
    ? `សូមគោរពអញ្ជើញ ${guestName} ចូលរួមពិធីសិរីសួស្តីអាពាហ៍ពិពាហ៍រវាង ${coupleTitle} ${dateFormatted ? `នៅថ្ងៃ ${dateFormatted}` : ""} ${event.venueName ? `ទីតាំង៖ ${event.venueName}` : ""}`
    : `សូមគោរពអញ្ជើញចូលរួមពិធីសិរីសួស្តីអាពាហ៍ពិពាហ៍រវាង ${coupleTitle} ${dateFormatted ? `នៅថ្ងៃ ${dateFormatted}` : ""} ${event.venueName ? `ទីតាំង៖ ${event.venueName}` : ""}`;

  const images = event.coverImageUrl
    ? [event.coverImageUrl]
    : event.couplePhotoUrl
    ? [event.couplePhotoUrl]
    : ["/orn/pattern.svg"];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images,
      type: "website",
      locale: "km_KH",
      siteName: "Digital Wedding Invitation · ធៀបការឌីជីថល",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}

export default async function InvitationPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { code, to } = (await searchParams) || {};

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

  // Graceful fallback for personalized links using ?to=GuestName
  if (!guest && to) {
    guest = {
      name: decodeURIComponent(to).trim(),
      category: "VIP Guest",
      tableNumber: null,
      maxGuests: 2,
      rsvpStatus: "PENDING",
      attendeesCount: 1,
      invitationCode: code || "guest",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return <InvitationClient event={event} guest={guest} baseUrl={baseUrl} />;
}
