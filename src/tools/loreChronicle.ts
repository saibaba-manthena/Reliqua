import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export interface CommitEntry {
  hash: string;
  message: string;
}

export async function getGitLog(cwd: string, count: number): Promise<CommitEntry[]> {
  const { stdout } = await execAsync(`git log --oneline -${count}`, { cwd }).catch((err) => {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to read the realm's annals: ${msg}`);
  });

  return stdout
    .trim()
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      const space = line.indexOf(" ");
      return {
        hash: line.slice(0, space),
        message: line.slice(space + 1).trim(),
      };
    });
}

export function buildChroniclePrompt(entries: CommitEntry[]): string {
  if (entries.length === 0) {
    return "The annals lie empty — no deeds have yet been inscribed upon the scrolls of this realm.";
  }

  const entryList = entries
    .map((e, i) => `${i + 1}. Seal [${e.hash}] — "${e.message}"`)
    .join("\n");

  return `\
You are the Grand Chronicler of an ancient realm, sole keeper of the Sacred Annals — \
the living record of every great deed, battle, decree, and catastrophe that has shaped \
the course of history. You write in the tradition of the greatest epic historians: \
sweeping, grave, and magnificent.

You have been handed a list of ancient seals and their terse field-glyphs — \
shorthand inscribed by the realm's scribes in moments of haste. \
Your sacred duty is to expand each glyph into a full Chronicle entry: \
a paragraph of vivid, epic prose that immortalises the event for all ages.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAWS OF THE CHRONICLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Each seal glyph describes a real historical event: a battle won or lost, \
a great edict handed down, a discovery made in the depths of the archives, \
a treachery uncovered, a faction formed or dissolved, a relic recovered or destroyed.
2. Give every entry a bold title in the form: **The [Grand Epithet] of [Place or Name]**
3. Render the seal (the short hex code) as a sigil — e.g. "bearing the sigil ${entries[0]?.hash ?? "of ancients"}".
4. Write each entry as a paragraph of three to five sentences of epic prose. \
Vary the register: some events are solemn, some triumphant, some darkly foreboding.
5. Entries are listed from most recent to most ancient — write accordingly, \
as if reading the annals backwards through time.
6. Never use mundane or technical language. There is no software here — only history.
7. After all entries, add a closing section: \
**The Chronicler's Seal** — two sentences reflecting on what these events, \
taken together, foretell for the realm's fate.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE RECOVERED SEALS (most recent → most ancient)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${entryList}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Begin the Chronicle now. Let each word ring true across the ages.
`;
}
