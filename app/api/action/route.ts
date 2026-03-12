import { NextRequest, NextResponse } from "next/server";
import { run } from "@/lib/shell";
import { spawn } from "child_process";

const VALID_ACTIONS = new Set(["deploy", "redep", "rollback", "delete", "stop", "start"]);

async function resolvepm2(): Promise<string> {
  const result = await run("which", ["pm2"]);
  return result.stdout.trim() || "/usr/local/bin/pm2";
}

export async function POST(req: NextRequest) {

  const { action, appName, repo } = await req.json();

  if (!VALID_ACTIONS.has(action)) {
    return NextResponse.json({ error: "invalid action" }, { status: 400 });
  }

  let result;

  if (action === "deploy") {
    if (!repo) return NextResponse.json({ error: "repo required" }, { status: 400 });

    const args = [repo];
    if (appName) args.push(appName);

    const proc = spawn("/usr/local/bin/deploy", args, {
      detached: true,
      stdio: "ignore",
    });
    proc.unref();

    return NextResponse.json({ success: true, output: "deploy started" });

  } else if (action === "redep") {
    if (!appName) return NextResponse.json({ error: "appName required" }, { status: 400 });

    const proc = spawn("/usr/local/bin/deploy", ["redep", appName], {
      detached: true,
      stdio: "ignore",
    });
    proc.unref();

    return NextResponse.json({ success: true, output: "redeploy started" });

  } else if (action === "stop") {
    if (!appName) return NextResponse.json({ error: "appName required" }, { status: 400 });
    const pm2 = await resolvepm2();
    result = await run(pm2, ["stop", appName]);

  } else if (action === "start") {
    if (!appName) return NextResponse.json({ error: "appName required" }, { status: 400 });
    const pm2 = await resolvepm2();
    result = await run(pm2, ["start", appName]);

  } else {
    // rollback, delete — fast operations, await is fine
    if (!appName) return NextResponse.json({ error: "appName required" }, { status: 400 });
    result = await run("/usr/local/bin/deploy", [action, appName]);
  }

  return NextResponse.json({
    success: result.code === 0,
    output: result.stdout,
    error: result.stderr,
  });
}