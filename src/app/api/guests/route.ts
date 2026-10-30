import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { generateInvitationCode, sanitizeString } from "@/lib/security";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");
    const exportCsv = searchParams.get("export") === "csv";
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const where: any = {};
    if (eventId) where.eventId = eventId;
    if (status && status !== "ALL") where.rsvpStatus = status;
    if (category && category !== "ALL") where.category = category;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phoneNumber: { contains: search } },
        { invitationCode: { contains: search } },
      ];
    }

    const guests = await prisma.guest.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    if (exportCsv) {
      const header = "Name,Category,Table,Status,Attendees,Phone,Email,InvitationCode,DietaryRestrictions,Notes\n";
      const rows = guests
        .map((g) =>
          `"${g.name}","${g.category}","${g.tableNumber || ""}","${g.rsvpStatus}",${g.attendeesCount},"${g.phoneNumber || ""}","${g.email || ""}","${g.invitationCode}","${g.dietaryRestrictions || ""}","${g.notes || ""}"`
        )
        .join("\n");

      return new NextResponse(header + rows, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": 'attachment; filename="wedding_guest_list.csv"',
        },
      });
    }

    return NextResponse.json({ success: true, guests });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch guests" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role === "GUEST") {
      return NextResponse.json(
        { error: "Access denied. Your account has restricted view-only permissions and cannot add guests." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { eventId, name, phoneNumber, email, category, tableNumber, maxGuests, customCode } =
      body;

    if (!eventId || !name) {
      return NextResponse.json(
        { error: "Event ID and guest name are required." },
        { status: 400 }
      );
    }

    const invitationCode = customCode?.trim()
      ? customCode.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "")
      : generateInvitationCode(name);

    // Verify code uniqueness
    const existing = await prisma.guest.findUnique({
      where: { invitationCode },
    });

    const finalCode = existing ? `${invitationCode}-${Date.now().toString().slice(-4)}` : invitationCode;

    const guest = await prisma.guest.create({
      data: {
        eventId,
        name: sanitizeString(name),
        phoneNumber: phoneNumber ? sanitizeString(phoneNumber) : null,
        email: email ? sanitizeString(email) : null,
        category: category || "Friend",
        tableNumber: tableNumber ? sanitizeString(tableNumber) : null,
        maxGuests: Number(maxGuests) || 2,
        invitationCode: finalCode,
      },
    });

    return NextResponse.json({ success: true, guest });
  } catch (error) {
    console.error("Create guest error:", error);
    return NextResponse.json({ error: "Failed to create guest" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role === "GUEST") {
      return NextResponse.json(
        { error: "Access denied. Your account has restricted view-only permissions and cannot modify guests." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { id, name, phoneNumber, email, category, tableNumber, maxGuests, rsvpStatus, attendeesCount, notes, dietaryRestrictions } = body;

    if (!id) {
      return NextResponse.json({ error: "Guest ID is required" }, { status: 400 });
    }

    const updated = await prisma.guest.update({
      where: { id },
      data: {
        ...(name && { name: sanitizeString(name) }),
        ...(phoneNumber !== undefined && { phoneNumber: sanitizeString(phoneNumber) }),
        ...(email !== undefined && { email: sanitizeString(email) }),
        ...(category && { category }),
        ...(tableNumber !== undefined && { tableNumber: sanitizeString(tableNumber) }),
        ...(maxGuests !== undefined && { maxGuests: Number(maxGuests) }),
        ...(rsvpStatus && { rsvpStatus }),
        ...(attendeesCount !== undefined && { attendeesCount: Number(attendeesCount) }),
        ...(notes !== undefined && { notes: sanitizeString(notes) }),
        ...(dietaryRestrictions !== undefined && { dietaryRestrictions: sanitizeString(dietaryRestrictions) }),
      },
    });

    return NextResponse.json({ success: true, guest: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update guest" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role === "GUEST") {
      return NextResponse.json(
        { error: "Access denied. Your account has restricted view-only permissions and cannot delete guests." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Guest ID is required" }, { status: 400 });
    }

    await prisma.guest.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Guest removed" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete guest" }, { status: 500 });
  }
}
