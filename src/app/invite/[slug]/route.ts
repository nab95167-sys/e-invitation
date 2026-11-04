import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const rawParams = await params;
    const slug = rawParams?.slug ? decodeURIComponent(rawParams.slug).trim().replace(/\s+/g, "") : "";
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code")?.trim();
    const to = searchParams.get("to") || searchParams.get("guest");

    // 1. Fetch event from DB
    let event = null;
    if (slug) {
      event = await prisma.event.findFirst({
        where: { slug: { equals: slug, mode: "insensitive" } },
      });
    }
    if (!event) {
      event = await prisma.event.findFirst({
        where: {
          OR: [
            { slug: "hoeurn-phanith-and-seourr-sreynith" },
            { groomName: { contains: "ផានិត" } },
          ],
        },
      });
    }
    if (!event) {
      event = await prisma.event.findFirst();
    }

    // 2. Resolve guest name if available
    let guestName = to ? decodeURIComponent(to).trim() : "";
    if (!guestName && code) {
      try {
        const guest = await prisma.guest.findUnique({
          where: { invitationCode: code },
          select: { name: true },
        });
        if (guest?.name) guestName = guest.name;
      } catch (e) {
        console.warn("Guest lookup notice:", e);
      }
    }

    // 3. Read template public/raksmey/index.html
    const htmlPath = path.join(process.cwd(), "public", "raksmey", "index.html");
    let html = await fs.readFile(htmlPath, "utf-8");

    // 4. Construct dynamic titles and descriptions
    const groom = event?.groomName || "ហឿន ផានិត";
    const bride = event?.brideName || "សៀ ស្រីនិត";
    const venue = event?.venueName || "គេហដ្ឋានខាងស្រី (The Bride's House)";
    const couple = `${groom} & ${bride}`;

    let dateFormatted = "";
    if (event?.eventDate) {
      try {
        const d = new Date(event.eventDate);
        dateFormatted = d.toLocaleDateString("km-KH", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      } catch (e) {}
    }

    const title = guestName
      ? `💌 លិខិតគោរពអញ្ជើញ៖ ${guestName} · ${couple}`
      : `សិរីសួស្តីអាពាហ៍ពិពាហ៍ · ${couple}`;

    const description = guestName
      ? `សូមគោរពអញ្ជើញ ${guestName} ចូលរួមពិធីសិរីសួស្តីអាពាហ៍ពិពាហ៍រវាង ${couple}${dateFormatted ? ` នៅថ្ងៃទី ${dateFormatted}` : ""}${venue ? ` ទីតាំង៖ ${venue}` : ""}`
      : `សូមគោរពអញ្ជើញចូលរួមពិធីសិរីសួស្តីអាពាហ៍ពិពាហ៍រវាង ${couple}${dateFormatted ? ` នៅថ្ងៃទី ${dateFormatted}` : ""}${venue ? ` ទីតាំង៖ ${venue}` : ""}`;

    // Resolve absolute image URL for Telegram, Facebook, Messenger
    const origin = req.nextUrl.origin || "https://e-invitation-bice.vercel.app";
    const activeSlug = slug || event?.slug || "wedding";
    const eventVersion = event?.updatedAt ? new Date(event.updatedAt).getTime() : Date.now();
    const ogImage = `${origin}/api/og/${encodeURIComponent(activeSlug)}?v=${eventVersion}&img=couple`;

    // 5. Replace metadata tags in HTML head
    html = html.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);
    html = html.replace(/<meta name="description" content=".*?" \/>/i, `<meta name="description" content="${description}" />`);
    html = html.replace(/<meta property="og:title" content=".*?" \/>/i, `<meta property="og:title" content="${title}" />`);
    html = html.replace(/<meta property="og:description" content=".*?" \/>/i, `<meta property="og:description" content="${description}" />`);
    html = html.replace(/<meta property="og:image" content=".*?" \/>/i, `<meta property="og:image" content="${ogImage}" />`);
    html = html.replace(/<meta property="og:url" content=".*?" \/>/i, `<meta property="og:url" content="${req.url}" />`);
    html = html.replace(/<meta name="twitter:title" content=".*?" \/>/i, `<meta name="twitter:title" content="${title}" />`);
    html = html.replace(/<meta name="twitter:description" content=".*?" \/>/i, `<meta name="twitter:description" content="${description}" />`);
    html = html.replace(/<meta name="twitter:image" content=".*?" \/>/i, `<meta name="twitter:image" content="${ogImage}" />`);

    // 6. Preload SSR data into window.__SSR_EVENT__ and window.__SSR_GUEST_NAME__
    const ssrData = `<script>
      window.__SSR_SLUG__ = ${JSON.stringify(slug || "")};
      window.__SSR_EVENT__ = ${JSON.stringify(event || null)};
      window.__SSR_GUEST_NAME__ = ${JSON.stringify(guestName || "")};
      window.__SSR_CODE__ = ${JSON.stringify(code || "")};
    </script>`;
    html = html.replace("</head>", `${ssrData}\n</head>`);

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Invite route handler error:", error);
    // Fallback directly to static template if anything fails
    try {
      const htmlPath = path.join(process.cwd(), "public", "raksmey", "index.html");
      const html = await fs.readFile(htmlPath, "utf-8");
      return new NextResponse(html, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    } catch {
      return new NextResponse("Invitation could not be loaded.", { status: 500 });
    }
  }
}
