import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { activeTokens } from "./lib/tokens";

export function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Allow login page without authentication
  if (pathname === "/login") {
    return NextResponse.next();
  }

  // Allow auth login endpoint without authentication
  if (pathname === "/api/auth/login") {
    return NextResponse.next();
  }

  // Only protect API routes (not pages)
  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Check authorization for API routes
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const token = authHeader.slice(7); // Remove "Bearer " prefix

  // Validate token exists in active tokens
  if (!activeTokens.has(token)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/api/:path*"],
};
