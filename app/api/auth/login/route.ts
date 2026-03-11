import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual, createHash } from "crypto";
import { signToken } from "@/lib/jwt";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

function safeCompare(a: string, b: string): boolean {
  const bufA = createHash("sha256").update(a).digest();
  const bufB = createHash("sha256").update(b).digest();
  return timingSafeEqual(bufA, bufB);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    console.log("INPUT_USERNAME:", username);
    console.log("INPUT_PASSWORD:", password);
    console.log("ENV_ADMIN_USERNAME:", ADMIN_USERNAME);
    console.log("ADMIN_PASSWORD:", ADMIN_PASSWORD);

    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !password.trim() ||
      username.length > 64 ||
      password.length > 128
    ) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Always compare both fields even if env vars are missing
    // prevents timing attacks from short-circuiting
    const usernameValid = safeCompare(
      username.toLowerCase(),
      (ADMIN_USERNAME ?? "").toLowerCase()
    );

    const passwordValid = safeCompare(
      password,
      ADMIN_PASSWORD ?? ""
    );

    if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !usernameValid || !passwordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = await signToken("admin");

    return NextResponse.json({ token, message: "Login successful" });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}