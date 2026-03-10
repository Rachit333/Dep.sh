import { NextResponse } from "next/server";
import { run } from "@/lib/shell";

export async function GET() {
  const result = await run("/usr/local/bin/deploy", ["status"]);

  return NextResponse.json({
    status: result.stdout,
  });
}
