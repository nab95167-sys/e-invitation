import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

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
  const event = await prisma.event.findFirst({
    select: { slug: true },
  });
  const slug = event?.slug || "davita-and-meassa";

  redirect(`/invite/${slug}${queryString ? `?${queryString}` : ""}`);
}
