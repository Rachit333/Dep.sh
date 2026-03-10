import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { activeTokens } from "@/lib/tokens";

// In production, store credentials in a database or environment variables
const VALID_CREDENTIALS = {
  admin: "admin",
  user: "password123",
};

function generateToken(): string {
  return randomBytes(32).toString("hex");
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password required" },
        { status: 400 }
      );
    }

    // Validate credentials
    if (
      !VALID_CREDENTIALS[username as keyof typeof VALID_CREDENTIALS] ||
      VALID_CREDENTIALS[username as keyof typeof VALID_CREDENTIALS] !== password
    ) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate unique token
    const token = generateToken();

    // Store token in the active tokens set
    activeTokens.add(token);

    return NextResponse.json(
      {
        token,
        username,
        message: "Login successful",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
