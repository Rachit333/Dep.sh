import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/jwt";

// ── Config ───────────────────────────────────────────────────────────────────

const ALLOWED_ORIGINS = new Set(
  [
    "http://localhost:3000",
    "http://localhost:9010",
    "https://depsh.rachit.site",
  ].filter(Boolean) as string[]
);

const PUBLIC_PATHS = new Set(["/login", "/api/auth/login"]);

// Rate limiting store: ip -> { count, windowStart }
const rateLimitStore = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 60;           // requests per window
const AUTH_RATE_LIMIT_MAX = 10;      // stricter for auth endpoints

// Suspicious UA fragments — block known script/tool agents on API routes
const BLOCKED_UA_PATTERNS = [
  /^curl\//i,
  /^python-requests\//i,
  /^axios\//i,
  /^got\//i,
  /^node-fetch\//i,
  /^httpie\//i,
  /^wget\//i,
  /^java\//i,
  /^okhttp\//i,
  /postman/i,
  /insomnia/i,
];

const CORS_HEADERS = {
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Request-ID",
  "Access-Control-Max-Age": "86400",
  "Access-Control-Allow-Credentials": "true",
};

// Security headers applied to every response
const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; img-src 'self' data:",
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function applySecurityHeaders(res: NextResponse): void {
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(k, v);
  }
}

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function getOrigin(req: NextRequest): string | null {
  const origin = req.headers.get("origin");
  if (origin) return origin;

  const referer = req.headers.get("referer");
  if (!referer) return null;

  try {
    const u = new URL(referer);
    return `${u.protocol}//${u.host}`;
  } catch {
    return null;
  }
}

function isAllowedOrigin(req: NextRequest, origin: string | null): boolean {
  if (!origin) return false;

  // Check explicit allowlist
  if (ALLOWED_ORIGINS.has(origin)) return true;

  // Check same-host (handles dynamic ports / preview deployments)
  const host = req.headers.get("host");
  if (!host) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function isBlockedUserAgent(ua: string | null): boolean {
  if (!ua) return true; // No UA = likely a raw script
  return BLOCKED_UA_PATTERNS.some((p) => p.test(ua));
}

function checkRateLimit(ip: string, isAuthRoute: boolean): boolean {
  const now = Date.now();
  const limit = isAuthRoute ? AUTH_RATE_LIMIT_MAX : RATE_LIMIT_MAX;
  const entry = rateLimitStore.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(ip, { count: 1, windowStart: now });
    return true; // allowed
  }

  if (entry.count >= limit) return false; // blocked

  entry.count++;
  return true; // allowed
}

function deny(message: string, status: number, req: NextRequest): NextResponse {
  const res = new NextResponse(
    JSON.stringify({ error: message }),
    {
      status,
      headers: {
        "Content-Type": "application/json",
        // Never cache error responses
        "Cache-Control": "no-store",
      },
    }
  );
  applySecurityHeaders(res);

  // Log suspicious activity (swap for your logger in production)
  console.warn(
    JSON.stringify({
      ts: new Date().toISOString(),
      event: "blocked_request",
      reason: message,
      status,
      ip: getClientIP(req),
      ua: req.headers.get("user-agent"),
      path: req.nextUrl.pathname,
      origin: getOrigin(req),
    })
  );

  return res;
}

// ── Middleware ───────────────────────────────────────────────────────────────

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isApiRoute = pathname.startsWith("/api/");
  const isAuthRoute = pathname === "/api/auth/login";
  const ip = getClientIP(req);
  const origin = getOrigin(req);
  const ua = req.headers.get("user-agent");

  // ── 1. Rate limiting (all routes) ─────────────────────────────────────────
  if (!checkRateLimit(ip, isAuthRoute)) {
    return deny("Too many requests", 429, req);
  }

  // ── 2. CORS preflight ─────────────────────────────────────────────────────
  if (req.method === "OPTIONS" && isApiRoute) {
    if (!isAllowedOrigin(req, origin)) {
      return deny("Forbidden", 403, req);
    }
    const res = new NextResponse(null, { status: 204 });
    res.headers.set("Access-Control-Allow-Origin", origin!);
    Object.entries(CORS_HEADERS).forEach(([k, v]) => res.headers.set(k, v));
    applySecurityHeaders(res);
    return res;
  }

  // ── 3. API-specific hardening ──────────────────────────────────────────────
  if (isApiRoute) {
    // 3a. Block disallowed origins (curl, postman, cross-site)
    if (!isAllowedOrigin(req, origin)) {
      return deny("Cross-origin requests are not allowed", 403, req);
    }

    // 3b. Block scripting user-agents on non-auth routes
    //     (auth route handled separately to keep error generic)
    if (!isAuthRoute && isBlockedUserAgent(ua)) {
      return deny("Forbidden", 403, req);
    }

    // 3c. Enforce Content-Type: application/json on mutation requests
    if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
      const ct = req.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        return deny("Content-Type must be application/json", 415, req);
      }
    }

    // 3d. Reject oversized payloads (guard against body-bomb DoS)
    const contentLength = parseInt(req.headers.get("content-length") || "0", 10);
    if (contentLength > 64 * 1024) { // 64 KB
      return deny("Payload too large", 413, req);
    }
  }

  // ── 4. Public paths — allow through after hardening ───────────────────────
  if (PUBLIC_PATHS.has(pathname)) {
    const res = NextResponse.next();
    if (origin && isAllowedOrigin(req, origin)) {
      res.headers.set("Access-Control-Allow-Origin", origin);
      Object.entries(CORS_HEADERS).forEach(([k, v]) => res.headers.set(k, v));
    }
    applySecurityHeaders(res);
    return res;
  }

  // ── 5. Non-API pages — just add security headers ──────────────────────────
  if (!isApiRoute) {
    const res = NextResponse.next();
    applySecurityHeaders(res);
    return res;
  }

  // ── 6. JWT verification (protected API routes) ────────────────────────────
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return deny("Unauthorized", 401, req);
  }

  const token = authHeader.slice(7);

  // Sanity-check token shape before hitting crypto (avoids wasted work)
  if (!/^[\w-]+\.[\w-]+\.[\w-]+$/.test(token)) {
    return deny("Unauthorized", 401, req);
  }

  const payload = await verifyToken(token);

  if (!payload) {
    return deny("Unauthorized", 401, req);
  }

  // ── 7. Attach verified identity & pass through ────────────────────────────
  const mutatedHeaders = new Headers(req.headers);
  mutatedHeaders.set("x-user", payload.sub);
  mutatedHeaders.set("x-request-id", crypto.randomUUID());

  const res = NextResponse.next({ request: { headers: mutatedHeaders } });

  if (origin) res.headers.set("Access-Control-Allow-Origin", origin);
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.headers.set(k, v));
  applySecurityHeaders(res);

  return res;
}

export const config = {
  matcher: ["/", "/api/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
};