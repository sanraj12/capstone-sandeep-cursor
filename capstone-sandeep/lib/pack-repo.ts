import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import JSZip from "jszip";

export const REPO_ZIP_NAME = "capstone-sandeep.zip";
export const REPO_ZIP_PREFIX = "capstone-sandeep";

const SKIP_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  ".cursor",
  "coverage",
  "dist",
  ".turbo",
  ".vercel",
]);

const SKIP_FILES = new Set([".env", ".env.local", ".env.development.local"]);

async function addDir(zip: JSZip, abs: string, rel: string) {
  const entries = await readdir(abs, { withFileTypes: true });
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    if (entry.name.startsWith(".env")) continue;
    const childAbs = path.join(abs, entry.name);
    const childRel = rel ? `${rel}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      await addDir(zip, childAbs, childRel);
    } else if (entry.isFile()) {
      if (SKIP_FILES.has(entry.name) || entry.name.endsWith(".tsbuildinfo")) {
        continue;
      }
      zip.file(childRel, await readFile(childAbs));
    }
  }
}

export async function packRepoZip(root = process.cwd()): Promise<Buffer> {
  const zip = new JSZip();
  await addDir(zip, root, REPO_ZIP_PREFIX);
  const bytes = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
  return Buffer.from(bytes);
}
