import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "e-invitation-secure-jwt-token-secret-wedding-auth-2026"
);
const AUTH_COOKIE_NAME = "wedding_auth_token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  let isValidSession = false;
  if (token) {
    try {
      await jwtVerify(token, SECRET_KEY);
      isValidSession = true;
    } catch {
      isValidSession = false;
    }
  }

  // Protect /dashboard routes at Edge Network
  if (pathname.startsWith("/dashboard")) {
    if (!isValidSession) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      const response = NextResponse.redirect(loginUrl);
      // Clean invalid cookie if present
      if (token) {
        response.cookies.delete(AUTH_COOKIE_NAME);
      }
      return response;
    }
  }

  // Protect sensitive dashboard backend APIs at Edge Network
  const protectedApis = ["/api/backup", "/api/users", "/api/gifts", "/api/upload"];
  const isProtectedApi = protectedApis.some((api) => pathname.startsWith(api));
  if (isProtectedApi && !isValidSession) {
    return NextResponse.json(
      { error: "Unauthorized access. Authentication token missing or invalid." },
      { status: 401 }
    );
  }

  const response = NextResponse.next();

  // Edge Security Headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(self), microphone=(), geolocation=()"
  );

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/backup/:path*",
    "/api/users/:path*",
    "/api/gifts/:path*",
    "/api/upload/:path*",
  ],
};
