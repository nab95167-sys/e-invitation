import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sanitizeString } from "@/lib/security";

// Helper to get active event ID for current session
async function resolveEventId(session: any, explicitEventId?: string | null): Promise<string | null> {
  if (explicitEventId) {
    const ev = await prisma.event.findUnique({ where: { id: explicitEventId } });
    if (ev) return ev.id;
  }
  const userEvent = await prisma.event.findFirst({
    where: session.role === "SUPERADMIN" ? {} : { userId: session.userId },
    select: { id: true },
  });
  if (userEvent) return userEvent.id;

  const defaultEv = await prisma.event.findFirst({ select: { id: true } });
  return defaultEv?.id || null;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const eventIdParam = searchParams.get("eventId");
    const search = searchParams.get("search")?.trim();
    const currency = searchParams.get("currency");
    const side = searchParams.get("side");
    const paymentMethod = searchParams.get("paymentMethod");
    const exportCsv = searchParams.get("export") === "csv";

    const eventId = await resolveEventId(session, eventIdParam);
    if (!eventId) {
      return NextResponse.json({ error: "No event found" }, { status: 404 });
    }

    const where: any = { eventId };
    if (currency && currency !== "ALL") where.currency = currency;
    if (side && side !== "ALL") where.side = side;
    if (paymentMethod && paymentMethod !== "ALL") where.paymentMethod = paymentMethod;
    if (search) {
      where.OR = [
        { guestName: { contains: search, mode: "insensitive" } },
        { notes: { contains: search, mode: "insensitive" } },
      ];
    }

    const gifts = await prisma.gift.findMany({
      where,
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
    });

    // Also fetch ALL gifts for this event to calculate global summary metrics
    const allEventGifts = await prisma.gift.findMany({
      where: { eventId },
      select: {
        currency: true,
        amount: true,
        side: true,
        paymentMethod: true,
      },
    });

    let totalUSD = 0;
    let totalKHR = 0;
    let groomUSD = 0;
    let groomKHR = 0;
    let brideUSD = 0;
    let brideKHR = 0;
    let bothUSD = 0;
    let bothKHR = 0;
    let cashUSD = 0;
    let cashKHR = 0;
    let transferUSD = 0;
    let transferKHR = 0;

    for (const g of allEventGifts) {
      const amt = Number(g.amount) || 0;
      if (g.currency === "USD") {
        totalUSD += amt;
        if (g.side === "GROOM") groomUSD += amt;
        else if (g.side === "BRIDE") brideUSD += amt;
        else bothUSD += amt;

        if (g.paymentMethod === "TRANSFER") transferUSD += amt;
        else cashUSD += amt;
      } else {
        totalKHR += amt;
        if (g.side === "GROOM") groomKHR += amt;
        else if (g.side === "BRIDE") brideKHR += amt;
        else bothKHR += amt;

        if (g.paymentMethod === "TRANSFER") transferKHR += amt;
        else cashKHR += amt;
      }
    }

    if (exportCsv) {
      const header = "\uFEFFល.រ,ឈ្មោះភ្ញៀវ,ភាគី,រូបិយប័ណ្ណ,ចំនួនទឹកប្រាក់,វិធីទូទាត់,កត់សម្គាល់,កាលបរិច្ឆេទ\n";
      const rows = gifts
        .map((g, idx) => {
          const sideText = g.side === "GROOM" ? "ខាងកូនកំលោះ" : g.side === "BRIDE" ? "ខាងកូនក្រមុំ" : "ទាំងសងខាង";
          const methodText = g.paymentMethod === "TRANSFER" ? "វេរធនាគារ (Transfer)" : "សាច់ប្រាក់ (Cash)";
          const dateStr = new Date(g.createdAt).toLocaleString("km-KH");
          return `${idx + 1},"${g.guestName}","${sideText}","${g.currency}",${g.amount},"${methodText}","${g.notes || ""}","${dateStr}"`;
        })
        .join("\n");

      return new NextResponse(header + rows, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": 'attachment; filename="wedding_gifts_ledger.csv"',
        },
      });
    }

    return NextResponse.json({
      success: true,
      gifts,
      metrics: {
        count: allEventGifts.length,
        totalUSD,
        totalKHR,
        groomUSD,
        groomKHR,
        brideUSD,
        brideKHR,
        bothUSD,
        bothKHR,
        cashUSD,
        cashKHR,
        transferUSD,
        transferKHR,
      },
    });
  } catch (error: any) {
    console.error("GET /api/gifts error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch gifts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // 1. Check if this is a MERGE action for duplicates
    if (body.action === "merge") {
      const { primaryId, duplicateIds } = body;
      if (!primaryId || !Array.isArray(duplicateIds) || duplicateIds.length === 0) {
        return NextResponse.json({ error: "primaryId and duplicateIds array are required" }, { status: 400 });
      }

      const primary = await prisma.gift.findUnique({
        where: { id: primaryId },
        include: { guest: true },
      });
      if (!primary) {
        return NextResponse.json({ error: "Primary gift not found" }, { status: 404 });
      }

      const duplicates = await prisma.gift.findMany({
        where: { id: { in: duplicateIds } },
      });

      let addedAmount = 0;
      const combinedNotes: string[] = primary.notes ? [primary.notes] : [];

      for (const d of duplicates) {
        if (d.currency === primary.currency) {
          addedAmount += Number(d.amount) || 0;
        }
        if (d.notes && !combinedNotes.includes(d.notes)) {
          combinedNotes.push(d.notes);
        }
      }

      const newTotalAmount = Number(primary.amount) + addedAmount;
      const mergedNote = combinedNotes.join(" | ") || null;

      const updated = await prisma.gift.update({
        where: { id: primaryId },
        data: {
          amount: newTotalAmount,
          notes: mergedNote,
        },
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
      });

      // Delete the duplicate rows
      await prisma.gift.deleteMany({
        where: { id: { in: duplicateIds } },
      });

      return NextResponse.json({
        success: true,
        message: "Successfully merged duplicate gifts",
        gift: updated,
        deletedIds: duplicateIds,
      });
    }

    // 2. Normal Create Gift OR Add to existing
    const {
      eventId: rawEventId,
      guestId,
      guestName,
      side = "BOTH",
      currency = "USD",
      amount,
      paymentMethod = "CASH",
      notes,
      addToExistingId, // If user explicitly wants to merge into existing
    } = body;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json({ error: "ចំនួនទឹកប្រាក់ត្រូវតែធំជាង ០ (Valid amount is required)" }, { status: 400 });
    }

    // If adding to existing gift record
    if (addToExistingId) {
      const existing = await prisma.gift.findUnique({ where: { id: addToExistingId } });
      if (existing) {
        const addedTotal = Number(existing.amount) + numAmount;
        const noteExtra = notes ? ` | ${notes}` : "";
        const updated = await prisma.gift.update({
          where: { id: addToExistingId },
          data: {
            amount: addedTotal,
            notes: (existing.notes || "") + noteExtra,
          },
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
        });
        return NextResponse.json({ success: true, gift: updated, isMerged: true });
      }
    }

    if (!guestName || !guestName.trim()) {
      return NextResponse.json({ error: "សូមបញ្ចូលឈ្មោះអ្នកចងដៃ (Guest name is required)" }, { status: 400 });
    }

    const eventId = await resolveEventId(session, rawEventId);
    if (!eventId) {
      return NextResponse.json({ error: "No event found" }, { status: 404 });
    }

    const cleanGuestName = sanitizeString(guestName.trim());
    const cleanNotes = notes ? sanitizeString(notes.trim()) : null;

    const gift = await prisma.gift.create({
      data: {
        eventId,
        guestId: guestId || null,
        guestName: cleanGuestName,
        side: ["GROOM", "BRIDE", "BOTH"].includes(side) ? side : "BOTH",
        currency: currency === "KHR" ? "KHR" : "USD",
        amount: numAmount,
        paymentMethod: ["CASH", "TRANSFER", "OTHER"].includes(paymentMethod) ? paymentMethod : "CASH",
        notes: cleanNotes,
        recordedBy: session.name || session.email || "System User",
      },
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
    });

    return NextResponse.json({ success: true, gift });
  } catch (error: any) {
    console.error("POST /api/gifts error:", error);
    return NextResponse.json({ error: error.message || "Failed to record gift" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      id,
      guestId,
      guestName,
      side,
      currency,
      amount,
      paymentMethod,
      notes,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Gift ID is required" }, { status: 400 });
    }

    const existing = await prisma.gift.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Gift record not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (guestName && guestName.trim()) {
      updateData.guestName = sanitizeString(guestName.trim());
    }
    if (guestId !== undefined) {
      updateData.guestId = guestId || null;
    }
    if (side && ["GROOM", "BRIDE", "BOTH"].includes(side)) {
      updateData.side = side;
    }
    if (currency && ["USD", "KHR"].includes(currency)) {
      updateData.currency = currency;
    }
    if (amount !== undefined) {
      const numAmount = parseFloat(amount);
      if (!isNaN(numAmount) && numAmount > 0) {
        updateData.amount = numAmount;
      }
    }
    if (paymentMethod && ["CASH", "TRANSFER", "OTHER"].includes(paymentMethod)) {
      updateData.paymentMethod = paymentMethod;
    }
    if (notes !== undefined) {
      updateData.notes = notes ? sanitizeString(notes.trim()) : null;
    }

    const updated = await prisma.gift.update({
      where: { id },
      data: updateData,
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
    });

    return NextResponse.json({ success: true, gift: updated });
  } catch (error: any) {
    console.error("PUT /api/gifts error:", error);
    return NextResponse.json({ error: error.message || "Failed to update gift" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Gift ID is required" }, { status: 400 });
    }

    const existing = await prisma.gift.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Gift record not found" }, { status: 404 });
    }

    await prisma.gift.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Gift deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/gifts error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete gift" }, { status: 500 });
  }
}
