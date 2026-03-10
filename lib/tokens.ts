// lib/tokens.ts

declare global {
  var __activeTokens: Set<string> | undefined;
}

if (!globalThis.__activeTokens) {
  globalThis.__activeTokens = new Set<string>();
}

export const activeTokens = globalThis.__activeTokens;