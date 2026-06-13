import type { WorkspaceScan } from "../workspace/scanner.js";

export type Genre = string;

// Tone descriptor injected into the chronicler's voice instruction
const GENRE_VOICE: Record<string, string> = {
  fantasy:
    "high fantasy — ancient kingdoms, arcane magic, divine prophecy, and legendary heroes of old",
  "sci-fi":
    "space opera — star-spanning civilizations, cosmic phenomena, synthetic minds, and the cold void between worlds",
  horror:
    "eldritch horror — forbidden knowledge, nameless entities from outside, creeping dread, and the inevitability of doom",
  steampunk:
    "steampunk chronicle — clockwork empires, aetheric engines, industrial titans, and the age of brass and steam",
  cyberpunk:
    "cyberpunk saga — fractured megacities, digital shamans, corporate warlords, and the war for human consciousness",
  western:
    "mythic western — vast untamed territories, wandering gunslingers of legend, iron law, and the ever-encroaching frontier",
};

// Programming terms the output must never contain
const FORBIDDEN_TERMS = [
  "JavaScript",
  "TypeScript",
  "npm",
  "package",
  "module",
  "function",
  "variable",
  "array",
  "object",
  "class",
  "interface",
  "import",
  "export",
  "compile",
  "runtime",
  "library",
  "framework",
  "API",
  "JSON",
  "HTTP",
  "repository",
  "dependency",
  "node",
  "script",
  "syntax",
  "parser",
  "lint",
  "build",
  "install",
  "deploy",
  "callback",
  "async",
  "await",
  "promise",
  "type",
  "boolean",
  "string",
  "integer",
  "null",
  "undefined",
].join(", ");

function resolveVoice(genre: Genre): string {
  return (
    GENRE_VOICE[genre.toLowerCase()] ??
    `${genre} mythology — adapt tone, imagery, and tropes to faithfully evoke this genre`
  );
}

function renderFolderList(folders: string[]): string {
  if (folders.length === 0) return "  (no domains surveyed)";
  return folders.map((f) => `  - "${f}"`).join("\n");
}

function renderKeyFiles(files: string[]): string {
  if (files.length === 0) return "  (none recovered)";
  return files.map((f) => `  - "${f}"`).join("\n");
}

function renderAge(count: number | null): string {
  if (count === null) return "an age beyond all reckoning";
  if (count === 0) return "the first breath of its existence — no cycles yet recorded";
  if (count === 1) return "a single cycle of recorded history";
  return `${count.toLocaleString()} cycles of recorded history`;
}

export function buildLorePrompt(
  scan: WorkspaceScan,
  genreContext: string,
  genre: Genre
): string {
  const voice = resolveVoice(genre);
  const age = renderAge(scan.gitCommitCount);
  const readmeBlock = scan.readmePreview
    ? `\nThe opening verse recovered from the realm's founding text:\n\`\`\`\n${scan.readmePreview.trim()}\n\`\`\``
    : "";

  return `\
You are an ancient chronicler who has witnessed the rise and fall of countless realms. \
Your singular purpose is to receive a survey of an unknown realm and render it as a complete, \
vivid mythological account written in the tradition of ${voice}.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABSOLUTE LAWS OF THE CHRONICLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. You must NEVER use any of the following words or their derivatives: ${FORBIDDEN_TERMS}.
   If a concept from this list must be expressed, translate it entirely into mythic language.
2. Every folder name below is the TRUE ANCIENT NAME of a domain, faction, or power.
   You must invent a mythic title for each one, but always write the true ancient name
   in parentheses directly after the mythic title on first use. Example:
   "The Ember Conclave (foundry)"
3. All output must be valid Markdown.
4. Write in second-person-omniscient narrative voice — the chronicler addresses the reader
   as a witness to history, not as an outsider.
5. Do not break character. There is no codebase. There is only the realm.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SURVEY OF THE REALM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Realm seat:         ${scan.path}
Age of the realm:   ${age}
Ancient scrolls:    ${scan.totalFiles.toLocaleString()} recovered in total
${readmeBlock}

Domains within the realm's borders (TRUE ANCIENT NAMES):
${renderFolderList(scan.topLevelFolders)}

Sacred artifacts recovered from the realm's heart:
${renderKeyFiles(scan.keyFiles)}

Keeper's testament — additional context for this realm:
${genreContext.trim() || "(the keeper left no testament)"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REQUIRED SECTIONS — produce ALL five, in this exact order
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## The Chronicle of [choose a grand realm name]

### I. The Age Before — World History
Write three to five paragraphs of vivid world history. Describe how this realm came into being, \
the great ages it has passed through, and the titanic forces that shaped it. \
Ground the timeline in the realm's age (${age}) and weave in the true ancient names of the \
domains as if they have always been part of the land. \
Let the number of ancient scrolls (${scan.totalFiles.toLocaleString()}) reflect the density \
or breadth of accumulated knowledge in the realm's archives.

### II. The Great Factions
For EACH domain listed in the survey, write a standalone paragraph describing it as a \
distinct faction, order, guild, or sovereign power. \
Open each paragraph with the mythic title followed by the true ancient name in parentheses. \
Describe its purpose, its inner hierarchy, its symbols or sigils, its seat of power within \
the realm, and its relationship — alliance, rivalry, or cold indifference — to at least one \
other faction.

### III. The Current Threat
Write one to two paragraphs describing the dark force, looming catastrophe, or existential \
threat that now moves against the realm. \
It must feel inevitable — grown from the realm's own history, from the tensions between \
factions, and from the sheer weight of the ${scan.totalFiles.toLocaleString()} scrolls whose \
secrets press against the walls of the archive. \
Do not resolve the threat here.

### IV. The Prophecy
Compose a prophecy of eight to twelve lines in verse. \
It must name at least three domains by their mythic titles, \
hint at the agent of salvation or doom without naming them plainly, \
and end on a line that could be read as either hope or annihilation.

### V. The Lore Map
Render a text-art map of the realm using box-drawing characters (┌ ┐ └ ┘ │ ─ ┼ ╔ ╗ ╚ ╝ ║ ═), \
labels, and directional symbols. \
Every domain must appear as a named region. Connect them with paths, borders, rivers, or voids. \
Include at least one landmark, ruin, or point of interest that has NOT been mentioned \
anywhere else in the chronicle — something only the map reveals. \
Surround the map in a fenced code block so spacing is preserved.

Begin the chronicle now. Let no profane technical term sully the parchment.
`;
}
