import { NextRequest, NextResponse } from "next/server";
import { run } from "@/lib/shell";

export async function GET(req: NextRequest) {
  const app = req.nextUrl.searchParams.get("app");

  if (!app) {
    return NextResponse.json({ error: "app required" }, { status: 400 });
  }

  const result = await run("/usr/local/bin/deploy", ["logs", app]);

  return NextResponse.json({
    logs: result.stdout,
  });
}
