import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, hashPassword, createSessionToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { checkRateLimit } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local";
    const rate = checkRateLimit(`login-${ip}`, 5, 60000); // Strict brute-force threshold
    if (!rate.success) {
      return NextResponse.json(
        { error: "Too many login attempts. Access blocked for 60 seconds." },
        { status: 429 }
      );
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    let user = null;
    try {
      user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });
    } catch (lookupErr: any) {
      console.warn("User lookup notice:", lookupErr?.message);
    }

    // Auto-seed if database is blank or user not found on fresh deploy
    if (!user) {
      try {
        const userCount = await prisma.user.count().catch(() => 0);
        if (userCount === 0) {
          const adminPassword = await hashPassword("Admin@123456");
          const couplePassword = await hashPassword("Wedding@2026");
          const organizerPassword = await hashPassword("Organizer@2026");

          await prisma.user.createMany({
            data: [
              {
                email: "admin@wedding.com",
                name: "System Administrator",
                passwordHash: adminPassword,
                role: "SUPERADMIN",
              },
              {
                email: "alex.sophia@wedding.com",
                name: "Alex & Sophia",
                passwordHash: couplePassword,
                role: "COUPLE",
              },
              {
                email: "organizer@wedding.com",
                name: "Claire Wedding Planner",
                passwordHash: organizerPassword,
                role: "ORGANIZER",
              },
            ],
          });

          // Also ensure at least one default event exists for the dashboard
          const eventCount = await prisma.event.count().catch(() => 0);
          if (eventCount === 0) {
            const adminUser = await prisma.user.findUnique({
              where: { email: "admin@wedding.com" },
            });
            if (adminUser) {
              await prisma.event.create({
                data: {
                  slug: "raksmey-and-pheakdey",
                  title: "សិរីសួស្តីអាពាហ៍ពិពាហ៍ · ផៃ រស្មី & មាស ភក្ដី",
                  groomName: "ផៃ រស្មី",
                  groomParents: "លោក ផៃ សុខន និង អ្នកស្រី យ៉ាន់ ចាន់ណារ៉ា",
                  brideName: "មាស ភក្ដី",
                  brideParents: "លោក ហែម សាវឿន និង អ្នកស្រី សៅ ណឺង",
                  eventDate: new Date("2026-11-15T16:00:00+07:00"),
                  ceremonyTime: "6:30 ព្រឹក - 12:00 ថ្ងៃត្រង់",
                  receptionTime: "4:00 រសៀល - 9:00 យប់",
                  venueName: "គេហដ្ឋានខាងស្រី (The Bride’s House)",
                  venueAddress: "ភូមិព្រែកហូរលិច១ សង្កាត់ព្រែកហូរ ក្រុងតាខ្មៅ ខេត្តកណ្តាល",
                  theme: "royal_khmer_olive",
                  userId: adminUser.id,
                },
              });
            }
          }

          user = await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() },
          });
        }
      } catch (seedErr) {
        console.error("Auto-seed error on login:", seedErr);
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as any,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error?.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
