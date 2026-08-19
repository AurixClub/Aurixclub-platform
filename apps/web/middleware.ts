import { NextRequest, NextResponse } from "next/server";

/**
 * SECURITY: Next.js Edge Middleware
 *
 * - Protects /admin routes: redirects unauthenticated users to /auth
 * - Validates session cookie presence (server-side verification happens in API routes)
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /admin routes — require session cookie
  if (pathname.startsWith("/admin")) {
    const sessionToken = req.cookies.get("aurix_session")?.value;

    if (!sessionToken) {
      const loginUrl = new URL("/auth", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Apply middleware to admin routes only
  matcher: ["/admin/:path*"],
};
