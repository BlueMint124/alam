import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.cwd(), ".worktrees", "arrivehae-web-mvp");
const requiredFiles = [
  "package.json",
  "src/main.tsx",
  "src/app/App.tsx",
  "src/app/router.tsx",
  "src/styles/tokens.css",
  "src/styles/app-shell.css",
].map((relativePath) => resolve(root, relativePath));

for (const filePath of requiredFiles) {
  if (!existsSync(filePath)) {
    throw new Error(`Missing required file: ${filePath}`);
  }
}

const appSource = await readFile(resolve(root, "src/app/App.tsx"), "utf8");

if (!appSource.includes("ArriveHae")) {
  throw new Error("Expected App shell title to include ArriveHae");
}

console.log("Smoke test passed");
