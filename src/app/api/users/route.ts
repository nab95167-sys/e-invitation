import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, hashPassword } from "@/lib/auth";
import { sanitizeString } from "@/lib/security";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || (session.role !== "SUPERADMIN" && session.role !== "COUPLE")) {
      return NextResponse.json(
        { error: "Access denied. Administrative privileges required." },
        { status: 403 }
      );
    }

    const whereClause: any = {};
    if (session.role === "COUPLE") {
      whereClause.OR = [
        { id: session.userId },
        { role: { in: ["ORGANIZER", "GUEST"] } },
      ];
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        permissions: true,
        createdAt: true,
        _count: {
          select: { events: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, users, currentUserRole: session.role });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "SUPERADMIN" && session.role !== "COUPLE")) {
      return NextResponse.json(
        { error: "Access denied. Insufficient privileges to create users." },
        { status: 403 }
      );
    }

    const { email, name, password, role, permissions } = await req.json();

    if (!email || !name || !password) {
      return NextResponse.json(
        { error: "Email, name, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters for platform security." },
        { status: 400 }
      );
    }

    // Security check: Couples can only add GUEST (Viewer) or ORGANIZER (Assistant)
    if (session.role === "COUPLE" && !["GUEST", "ORGANIZER"].includes(role)) {
      return NextResponse.json(
        { error: "Couples can only create GUEST (Restricted Viewer) or ORGANIZER (Check-in Staff) users." },
        { status: 403 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json({ error: "A user with this email already exists." }, { status: 400 });
    }

    const validRole = ["SUPERADMIN", "COUPLE", "ORGANIZER", "GUEST"].includes(role) ? role : "GUEST";

    const passwordHash = await hashPassword(password);
    const permissionsJson = permissions
      ? (typeof permissions === "string" ? permissions : JSON.stringify(permissions))
      : null;

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        name: sanitizeString(name),
        passwordHash,
        role: validRole,
        permissions: permissionsJson,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        permissions: true,
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
    if (!session || (session.role !== "SUPERADMIN" && session.role !== "COUPLE")) {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }

    const { id, role, name, permissions } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Security enforcement: Couple cannot modify Superadmins or other Couples
    if (session.role === "COUPLE") {
      if (targetUser.role === "SUPERADMIN" || (targetUser.role === "COUPLE" && targetUser.id !== session.userId)) {
        return NextResponse.json({ error: "Forbidden: You cannot modify administrator accounts." }, { status: 403 });
      }
      if (role && !["GUEST", "ORGANIZER"].includes(role)) {
        return NextResponse.json({ error: "Couples can only assign GUEST or ORGANIZER roles." }, { status: 403 });
      }
    }

    // Superadmin protection: Cannot demote the last superadmin
    if (targetUser.role === "SUPERADMIN" && role && role !== "SUPERADMIN") {
      const superadminCount = await prisma.user.count({ where: { role: "SUPERADMIN" } });
      if (superadminCount <= 1) {
        return NextResponse.json({ error: "Cannot demote the sole system Superadmin." }, { status: 400 });
      }
    }

    const permissionsJson = permissions !== undefined
      ? (typeof permissions === "string" ? permissions : JSON.stringify(permissions))
      : undefined;

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(role && { role }),
        ...(name && { name: sanitizeString(name) }),
        ...(permissionsJson !== undefined && { permissions: permissionsJson }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        permissions: true,
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
    if (!session || (session.role !== "SUPERADMIN" && session.role !== "COUPLE")) {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    if (id === session.userId) {
      return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Security checks
    if (session.role === "COUPLE") {
      if (targetUser.role === "SUPERADMIN" || targetUser.role === "COUPLE") {
        return NextResponse.json({ error: "Forbidden: You cannot delete administrative accounts." }, { status: 403 });
      }
    }

    if (targetUser.role === "SUPERADMIN") {
      const count = await prisma.user.count({ where: { role: "SUPERADMIN" } });
      if (count <= 1) {
        return NextResponse.json({ error: "Cannot delete the sole system Superadmin." }, { status: 400 });
      }
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "User deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
