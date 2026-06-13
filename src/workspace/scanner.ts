import { readdir, readFile } from "fs/promises";
import { join } from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const EXCLUDED_DIRS = new Set(["node_modules", ".git", "dist"]);

const KEY_FILE_NAMES = new Set([
  "index.ts",
  "index.js",
  "main.ts",
  "app.ts",
  "package.json",
  "README.md",
]);

export interface WorkspaceScan {
  path: string;
  topLevelFolders: string[];
  keyFiles: string[];
  totalFiles: number;
  readmePreview: string | null;
  gitCommitCount: number | null;
}

async function countFiles(dir: string): Promise<number> {
  const entries = await readdir(dir, { withFileTypes: true });
  let count = 0;
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.has(entry.name)) {
        count += await countFiles(join(dir, entry.name));
      }
    } else {
      count++;
    }
  }
  return count;
}

export async function scanWorkspace(path: string): Promise<WorkspaceScan> {
  const entries = await readdir(path, { withFileTypes: true });

  const topLevelFolders: string[] = [];
  const keyFiles: string[] = [];

  for (const entry of entries) {
    if (entry.isDirectory() && !EXCLUDED_DIRS.has(entry.name)) {
      topLevelFolders.push(entry.name);
    } else if (entry.isFile() && KEY_FILE_NAMES.has(entry.name)) {
      keyFiles.push(entry.name);
    }
  }

  const totalFiles = await countFiles(path);

  let readmePreview: string | null = null;
  if (keyFiles.includes("README.md")) {
    const content = await readFile(join(path, "README.md"), "utf-8");
    readmePreview = content.slice(0, 300);
  }

  let gitCommitCount: number | null = null;
  try {
    const { stdout } = await execAsync("git rev-list --count HEAD", { cwd: path });
    gitCommitCount = parseInt(stdout.trim(), 10);
  } catch {
    // not a git repo or no commits yet
  }

  return {
    path,
    topLevelFolders,
    keyFiles,
    totalFiles,
    readmePreview,
    gitCommitCount,
  };
}
