import { readdir, readFile } from "fs/promises";
import { join, relative, extname } from "path";

export type OmenKind = "TODO" | "FIXME";

export interface TodoItem {
  file: string;
  line: number;
  kind: OmenKind;
  text: string;
}

const EXCLUDED_DIRS = new Set(["node_modules", ".git", "dist"]);
const TARGET_EXTENSIONS = new Set([".ts", ".js", ".py"]);

// comment marker must lead the line so descriptive comments containing "TODO" are skipped
const TODO_RE = /^\s*(?:\/\/|\/\*|#)\s*(TODO|FIXME)\b[:\s]+(.+?)(?:\s*\*\/)?\s*$/i;

async function collectFiles(dir: string, out: string[]): Promise<void> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.has(entry.name)) {
        await collectFiles(join(dir, entry.name), out);
      }
    } else if (
      entry.isFile() &&
      TARGET_EXTENSIONS.has(extname(entry.name).toLowerCase())
    ) {
      out.push(join(dir, entry.name));
    }
  }
}

async function scanFile(filePath: string, root: string): Promise<TodoItem[]> {
  const content = await readFile(filePath, "utf-8").catch(() => "");
  const items: TodoItem[] = [];

  content.split("\n").forEach((rawLine, idx) => {
    const match = TODO_RE.exec(rawLine);
    if (!match) return;
    items.push({
      file: relative(root, filePath).replace(/\\/g, "/"),
      line: idx + 1,
      kind: match[1].toUpperCase() as OmenKind,
      text: match[2].trim(),
    });
  });

  return items;
}

export async function findTodos(cwd: string): Promise<TodoItem[]> {
  const files: string[] = [];
  await collectFiles(cwd, files);
  const batches = await Promise.all(files.map((f) => scanFile(f, cwd)));
  return batches.flat();
}

const PEACE = "The realm is at peace — no prophecies remain unspoken.";

function formatOmen(item: TodoItem, index: number): string {
  const scroll = item.file;
  const inscription = item.line;
  const n = String(index + 1).padStart(2, " ");

  if (item.kind === "FIXME") {
    return `${n}. [DARK OMEN] Scroll "${scroll}", inscription ${inscription}:\n    "${item.text}"`;
  }
  return `${n}. [UNFULFILLED PROPHECY] Scroll "${scroll}", inscription ${inscription}:\n    "${item.text}"`;
}

export function buildProphecyPrompt(todos: TodoItem[]): string {
  if (todos.length === 0) return PEACE;

  const todoCount = todos.filter((t) => t.kind === "TODO").length;
  const fixmeCount = todos.filter((t) => t.kind === "FIXME").length;
  const omenList = todos.map(formatOmen).join("\n\n");

  return `\
You are the Oracle of the Unfinished Age — the seer who reads the wounds and whispers \
of a realm not yet whole. You have been given a list of omens recovered from deep within \
the realm's scrolls: ${todoCount} unfulfilled ${todoCount === 1 ? "prophecy" : "prophecies"} \
and ${fixmeCount} dark ${fixmeCount === 1 ? "omen" : "omens"} of festering corruption.

Your sacred charge is to narrate each one as the realm's living lore — \
not as a technical note, but as an event in the mythological record: \
a destiny deferred, a wound unhealed, a forgotten oath, or a creeping darkness \
that has not yet been confronted.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAWS OF ORACLE SPEECH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. UNFULFILLED PROPHECY (TODO) — narrate as a sworn quest or divine mandate that has \
not yet been answered. The realm is incomplete without it. A champion must one day rise.
2. DARK OMEN (FIXME) — narrate as a festering wound, a corruption in the realm's \
foundations, or a broken seal through which shadow seeps. It grows worse with each \
passing cycle.
3. Every entry must have a title in bold: **The [Epithet] of [Scroll Name]**
4. Write two to three sentences of vivid epic prose for each entry. \
Vary the register: urgency, dread, melancholy, righteous fury.
5. The scroll name is the name of the ancient text where the omen was found. \
The inscription number is the precise line in that scroll where the mark appears — \
render it as "the N-th inscription" or "inscribed at the N-th rune-mark."
6. Never use technical or mundane language. There is no code here — only prophecy.
7. After all entries, write a closing section:

   **The Oracle's Reckoning**
   Two to three sentences. Weigh the balance of prophecies versus omens and pronounce \
   the realm's overall fate: is it on the cusp of a golden age, descending into shadow, \
   or locked in a precarious equilibrium?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE RECOVERED OMENS (${todos.length} total)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${omenList}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Speak now, Oracle. Let every word ring with the weight of unfinished fate.
`;
}
