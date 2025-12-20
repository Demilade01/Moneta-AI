/**
 * Next.js Middleware
 * Protects dashboard routes and redirects unauthenticated users
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/server/auth";

// Force Node.js runtime (required for jsonwebtoken)
export const runtime = "nodejs";

const COOKIE_NAME = "moneta-auth-token";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookies
  const token = request.cookies.get(COOKIE_NAME)?.value;

  // Check if accessing dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!token || !verifyToken(token)) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Check if accessing auth routes while logged in
  if (pathname.startsWith("/auth/")) {
    if (token && verifyToken(token)) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};

