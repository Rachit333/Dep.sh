import { NextRequest, NextResponse } from "next/server";
import { run } from "@/lib/shell";
import path from "path";
import os from "os";

export async function GET(req: NextRequest) {
  const app = req.nextUrl.searchParams.get("app");
  if (!app) {
    return NextResponse.json({ error: "app required" }, { status: 400 });
  }

  // Sanitize: app names should only be lowercase alphanumeric + hyphens
  if (!/^[a-z0-9-]+$/.test(app)) {
    return NextResponse.json({ error: "invalid app name" }, { status: 400 });
  }

  const logPath = path.join(os.homedir(), "apps", app, "deploy.log");
  // Tail last 200 lines to keep response size reasonable
  const result = await run("tail", ["-n", "200", logPath]);

  return NextResponse.json({
    logs: result.stdout,
  });
}