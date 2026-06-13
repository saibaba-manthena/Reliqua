import { basename } from "path";
import type { WorkspaceScan } from "../workspace/scanner.js";

export type MapStyle = "ascii" | "unicode";

interface DrawChars {
  tl: string; tr: string; bl: string; br: string;
  h: string; v: string;
  teeTop: string; teeBot: string; teeLeft: string; teeRight: string;
  cross: string;
  deco: string;
  bullet: string;
}

const UNI: DrawChars = {
  tl: "╔", tr: "╗", bl: "╚", br: "╝",
  h: "═", v: "║",
  teeTop: "╦", teeBot: "╩", teeLeft: "╠", teeRight: "╣",
  cross: "╬",
  deco: "·:·",
  bullet: "·",
};

const ASC: DrawChars = {
  tl: "+", tr: "+", bl: "+", br: "+",
  h: "-", v: "|",
  teeTop: "+", teeBot: "+", teeLeft: "+", teeRight: "+",
  cross: "+",
  deco: "~",
  bullet: "*",
};

const BASE_CELL_W = 22; // minimum interior cell width
const CELL_H = 5;       // content lines per territory row

const MYTHIC: Record<string, string> = {
  tools:       "The Arsenal of Ancient Arts",
  workspace:   "The Grand Sanctum",
  foundry:     "The Crucible of Creation",
  engine:      "The Iron Citadel",
  src:         "The Wellspring of Origins",
  components:  "The Hall of Constructs",
  utils:       "The Esoteric Library",
  services:    "The Order's Keep",
  types:       "The Codex Vault",
  config:      "The Vault of Decrees",
  tests:       "The Proving Grounds",
  test:        "The Proving Grounds",
  __tests__:   "The Proving Grounds",
  public:      "The Open Markets",
  assets:      "The Royal Treasury",
  styles:      "The Tapestry Hall",
  style:       "The Tapestry Hall",
  pages:       "The Herald's Gallery",
  api:         "The Council Chambers",
  lib:         "The Elder Archive",
  core:        "The Heart of the Realm",
  data:        "The Chronicle Depths",
  models:      "The Sculptor's Atelier",
  controllers: "The War Room",
  views:       "The Vision Chamber",
  routes:      "The Waymarker's Post",
  middleware:  "The Veil Between Worlds",
  hooks:       "The Chamber of Bindings",
  store:       "The Vault of Memories",
  context:     "The Mindweb Nexus",
  scripts:     "The Battle-Script Armory",
  docs:        "The Great Library",
  doc:         "The Great Library",
  build:       "The Forge of Manifestation",
  server:      "The Citadel Keep",
  client:      "The Outer Reaches",
  shared:      "The Common Grounds",
  helpers:     "The Acolytes' Quarter",
  constants:   "The Pillars of Law",
};

function mythicName(folder: string): string {
  const key = folder.toLowerCase();
  if (MYTHIC[key]) return MYTHIC[key];
  const words = folder
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_\-]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  return `The ${words.join(" ")} Dominion`;
}

function exact(s: string, w: number): string {
  if (s.length >= w) return s.slice(0, w);
  return s + " ".repeat(w - s.length);
}

function centerIn(s: string, w: number): string {
  if (s.length >= w) return s.slice(0, w);
  const diff = w - s.length;
  return " ".repeat(Math.floor(diff / 2)) + s + " ".repeat(Math.ceil(diff / 2));
}

function wrap(text: string, w: number): string[] {
  if (text.length <= w) return [text];
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length <= w) {
      line = next;
    } else {
      if (line) lines.push(line);
      line = word.slice(0, w);
    }
  }
  if (line) lines.push(line);
  return lines;
}

function numCols(count: number): number {
  if (count <= 1) return 1;
  if (count <= 4) return 2;
  return 3;
}

// cw: effective cell interior width (computed per-map, not global)
function hBar(
  C: DrawChars,
  n: number,
  cw: number,
  lc: string,
  mc: string,
  rc: string
): string {
  return lc + Array.from({ length: n }, () => C.h.repeat(cw)).join(mc) + rc;
}

function cellLines(folder: string, cw: number): string[] {
  const lines: string[] = [];
  lines.push(exact(` ${folder.toUpperCase()}`, cw));
  lines.push(exact("", cw));
  const wrapped = wrap(mythicName(folder), cw - 1);
  for (const l of wrapped.slice(0, CELL_H - 2)) {
    lines.push(exact(` ${l}`, cw));
  }
  while (lines.length < CELL_H) lines.push(exact("", cw));
  return lines.slice(0, CELL_H);
}

function voidLines(C: DrawChars, cw: number): string[] {
  const label = centerIn(
    C.deco === "·:·" ? "· · V O I D · ·" : "- - V O I D - -",
    cw
  );
  const lines = Array.from({ length: CELL_H }, () => exact("", cw));
  lines[Math.floor(CELL_H / 2)] = label;
  return lines;
}

export function buildLoreMap(
  scan: WorkspaceScan,
  style: MapStyle = "unicode"
): string {
  const C = style === "unicode" ? UNI : ASC;
  const folders = scan.topLevelFolders;
  const realmName = basename(scan.path).toUpperCase();
  const nc = folders.length === 0 ? 1 : numCols(folders.length);
  const nr = folders.length === 0 ? 0 : Math.ceil(folders.length / nc);

  // Title is built first so cw can expand to fit it
  const title = ` ${C.deco} THE REALM OF ${realmName} ${C.deco} `;
  // cw must be wide enough that nc columns + (nc-1) dividers >= title.length
  const cw = Math.max(BASE_CELL_W, Math.ceil((title.length - (nc - 1)) / nc));
  const innerWidth = nc * cw + (nc - 1);

  const out: string[] = [];

  // ── Realm header ─────────────────────────────────────────────────
  out.push(C.tl + C.h.repeat(innerWidth) + C.tr);
  out.push(C.v + centerIn(title, innerWidth) + C.v);

  if (folders.length === 0) {
    out.push(C.v + centerIn("[ no territories surveyed ]", innerWidth) + C.v);
    out.push(C.bl + C.h.repeat(innerWidth) + C.br);
  } else {
    // ── Header → territory divider ───────────────────────────────
    out.push(hBar(C, nc, cw, C.teeLeft, C.teeTop, C.teeRight));

    // ── Territory rows ───────────────────────────────────────────
    for (let r = 0; r < nr; r++) {
      const grid = Array.from({ length: nc }, (_, c) => {
        const idx = r * nc + c;
        return idx < folders.length
          ? cellLines(folders[idx], cw)
          : voidLines(C, cw);
      });

      for (let line = 0; line < CELL_H; line++) {
        out.push(C.v + grid.map((col) => col[line]).join(C.v) + C.v);
      }

      out.push(
        r === nr - 1
          ? hBar(C, nc, cw, C.bl, C.teeBot, C.br)
          : hBar(C, nc, cw, C.teeLeft, C.cross, C.teeRight)
      );
    }

    // ── Legend ───────────────────────────────────────────────────
    const legendHead = `${C.deco} LEGEND ${C.deco}`;
    out.push("");
    out.push(legendHead);
    out.push(C.h.repeat(legendHead.length));
    for (const f of folders) {
      out.push(`${C.bullet} ${f.padEnd(14)} ${C.v}  ${mythicName(f)}`);
    }
  }

  return "```\n" + out.join("\n") + "\n```";
}
