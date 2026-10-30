import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; guest?: string; [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(resolvedParams)) {
    if (typeof value === "string") {
      search.set(key, value);
    }
  }

  const queryString = search.toString();
  let slug = "so-vith-and-ma-na";
  try {
    const event = await prisma.event.findFirst({
      select: { slug: true },
    });
    if (event?.slug) slug = event.slug;
  } catch (err) {
    console.warn("HomePage event findFirst fallback:", err);
  }

  redirect(`/invite/${slug}${queryString ? `?${queryString}` : ""}`);
}
