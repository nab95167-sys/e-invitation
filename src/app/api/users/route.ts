import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, hashPassword } from "@/lib/auth";
import { sanitizeString } from "@/lib/security";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Access denied. Superadmin required." }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: { events: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, users });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Access denied. Superadmin required." }, { status: 403 });
    }

    const { email, name, password, role } = await req.json();

    if (!email || !name || !password) {
      return NextResponse.json({ error: "Email, name, and password are required." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json({ error: "A user with this email already exists." }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        name: sanitizeString(name),
        passwordHash,
        role: ["SUPERADMIN", "COUPLE", "ORGANIZER", "GUEST"].includes(role) ? role : "COUPLE",
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Access denied. Superadmin required." }, { status: 403 });
    }

    const { id, role, name } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Prevent demoting last superadmin or self demoting blindly
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(role && { role }),
        ...(name && { name: sanitizeString(name) }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "SUPERADMIN") {
      return NextResponse.json({ error: "Access denied. Superadmin required." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    if (id === session.userId) {
      return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "User deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
