import { spawn } from "child_process";

export function run(
  cmd: string,
  args: string[] = []
): Promise<{ stdout: string; stderr: string; code: number }> {
  return new Promise((resolve) => {
    const proc = spawn(cmd, args);

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (d) => {
      stdout += d.toString();
    });

    proc.stderr.on("data", (d) => {
      stderr += d.toString();
    });

    proc.on("close", (code) => {
      resolve({
        stdout,
        stderr,
        code: code ?? 0,
      });
    });
  });
}
