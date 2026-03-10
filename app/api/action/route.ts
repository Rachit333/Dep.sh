import { NextRequest, NextResponse } from "next/server";
import { run } from "@/lib/shell";

export async function POST(req: NextRequest) {
  const { action, appName, repo, port } = await req.json();

  let args: string[] = [];

  if (action === "deploy") {
    args = [repo, appName, port].filter((a): a is string => a != null && a !== "");
  } else {
    args = [action, appName].filter(Boolean);
  }

  const result = await run("/usr/local/bin/deploy", args);

  return NextResponse.json({
    success: result.code === 0,
    output: result.stdout,
    error: result.stderr,
  });
}