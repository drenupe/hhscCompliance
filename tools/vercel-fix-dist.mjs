import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const distWeb = path.join(root, "dist", "web");
const indexRoot = path.join(distWeb, "index.html");
const distBrowser = path.join(distWeb, "browser");
const indexBrowser = path.join(distBrowser, "index.html");

function ls(p) {
  try {
    return fs.readdirSync(p, { withFileTypes: true }).map((d) =>
      d.isDirectory() ? `${d.name}/` : d.name
    );
  } catch (e) {
    return [`(cannot read: ${String(e.message || e)})`];
  }
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

console.log("=== vercel-fix-dist ===");
console.log("dist/web:", distWeb);
console.log("dist/web listing BEFORE:", ls(distWeb));

const rootHasIndex = fs.existsSync(indexRoot);
const browserHasIndex = fs.existsSync(indexBrowser);

console.log("dist/web/index.html exists?", rootHasIndex);
console.log("dist/web/browser/index.html exists?", browserHasIndex);

if (!rootHasIndex && browserHasIndex) {
  console.log("Promoting dist/web/browser/* -> dist/web/*");
  copyDir(distBrowser, distWeb);
}

console.log("dist/web listing AFTER:", ls(distWeb));

if (!fs.existsSync(indexRoot)) {
  console.error("ERROR: dist/web/index.html is missing. Cannot deploy static site.");
  process.exit(1);
}

console.log("OK: dist/web/index.html present.");
