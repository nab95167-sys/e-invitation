import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, hashPassword, createSessionToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { checkRateLimit, isLoginLocked, recordFailedLogin, clearFailedLogin } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    const rate = checkRateLimit(`login-${ip}`, 15, 60000); // 15 attempts per minute per IP
    if (!rate.success) {
      return NextResponse.json(
        { error: "Too many login attempts. Access blocked for 60 seconds." },
        { status: 429 }
      );
    }

    const rawBody = await req.json().catch(() => null);
    if (!rawBody || typeof rawBody !== "object") {
      return NextResponse.json(
        { error: "Invalid request payload." },
        { status: 400 }
      );
    }

    const email = typeof rawBody.email === "string" ? rawBody.email.trim() : "";
    const password = typeof rawBody.password === "string" ? rawBody.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check account / IP lockout
    const emailLock = isLoginLocked(`acc-${normalizedEmail}`);
    const ipLock = isLoginLocked(`ip-${ip}`);
    if (emailLock.isLocked || ipLock.isLocked) {
      const remainingMins = Math.max(emailLock.remainingLockMinutes, ipLock.remainingLockMinutes);
      return NextResponse.json(
        {
          error: `គណនី ឬ IP នេះត្រូវបានចាក់សោរបណ្តោះអាសន្នរយៈពេល ${remainingMins} នាទី ដោយសារព្យាយាមបញ្ចូលលេខសម្ងាត់ខុសច្រើនដង (Account temporarily locked for ${remainingMins} min due to multiple failed attempts).`,
        },
        { status: 429 }
      );
    }

    let user = null;
    try {
      user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
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

    // Strict verification against database hashed password
    let authenticatedUser: { id: string; email: string; name: string; role: any } | null = null;

    if (user && user.passwordHash) {
      const isValid = await verifyPassword(password, user.passwordHash).catch(() => false);
      if (isValid) {
        authenticatedUser = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    }

    if (!authenticatedUser) {
      const emailLockResult = recordFailedLogin(`acc-${normalizedEmail}`);
      const ipLockResult = recordFailedLogin(`ip-${ip}`);

      if (emailLockResult.isLocked || ipLockResult.isLocked) {
        const lockMins = Math.max(emailLockResult.lockMinutes, ipLockResult.lockMinutes);
        return NextResponse.json(
          {
            error: `លេខសម្ងាត់មិនត្រឹមត្រូវ។ ដោយសារព្យាយាមខុស ៥ ដង ប្រព័ន្ធបានចាក់សោរគណនី/IP នេះរយៈពេល ${lockMins} នាទី (Account locked for ${lockMins} min).`,
          },
          { status: 429 }
        );
      }

      const attemptsLeft = Math.min(emailLockResult.remainingAttempts, ipLockResult.remainingAttempts);
      return NextResponse.json(
        {
          error: `អ៊ីមែល ឬលេខសម្ងាត់មិនត្រឹមត្រូវ (អ្នកនៅសល់ឱកាសសាកល្បង ${attemptsLeft} ដងទៀត មុននឹងត្រូវចាក់សោរ)។`,
        },
        { status: 401 }
      );
    }

    // Success! Clear any recorded failed attempts
    clearFailedLogin(`acc-${normalizedEmail}`);
    clearFailedLogin(`ip-${ip}`);

    const token = await createSessionToken({
      userId: authenticatedUser.id,
      email: authenticatedUser.email,
      name: authenticatedUser.name,
      role: authenticatedUser.role,
    });

    const response = NextResponse.json({
      success: true,
      user: authenticatedUser,
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
    console.error("Login route error:", error);
    const msg = error?.message || (typeof error === "string" ? error : "An unexpected error occurred.");
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
