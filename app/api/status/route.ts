import { NextRequest, NextResponse } from "next/server";
import { run } from "@/lib/shell";

export async function GET(req: NextRequest) {
  // deploy status doesn't exist — use list --json which is the structured source of truth
  const result = await run("/usr/local/bin/deploy", ["list", "--json"]);

  if (result.code !== 0) {
    return NextResponse.json({ error: result.stderr }, { status: 500 });
  }

  const apps = JSON.parse(result.stdout || "[]");
  return NextResponse.json({ apps });
}
