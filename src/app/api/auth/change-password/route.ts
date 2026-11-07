import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, hashPassword, verifyPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "សូមបញ្ចូលលេខសម្ងាត់បច្ចុប្បន្ន និងលេខសម្ងាត់ថ្មី (Current and new passwords are required)." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "លេខសម្ងាត់ថ្មីត្រូវមានយ៉ាងហោចណាស់ ៦ តួអក្សរ (New password must be at least 6 characters)." },
        { status: 400 }
      );
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "លេខសម្ងាត់ផ្ទៀងផ្ទាត់មិនត្រូវគ្នាទេ (Password confirmation does not match)." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "រកមិនឃើញគណនីអ្នកប្រើប្រាស់ (User not found)." }, { status: 404 });
    }

    const isCurrentValid = await verifyPassword(currentPassword, user.passwordHash);
    if (!isCurrentValid) {
      return NextResponse.json(
        { error: "លេខសម្ងាត់បច្ចុប្បន្នមិនត្រឹមត្រូវទេ (Current password is incorrect)." },
        { status: 400 }
      );
    }

    const newHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: session.userId },
      data: { passwordHash: newHash },
    });

    return NextResponse.json({
      success: true,
      message: "ផ្លាស់ប្តូរលេខសម្ងាត់បានជោគជ័យ (Password changed successfully)!",
    });
  } catch (error: any) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "មានបញ្ហាក្នុងការប្តូរលេខសម្ងាត់ (Failed to change password): " + (error?.message || "") },
      { status: 500 }
    );
  }
}
