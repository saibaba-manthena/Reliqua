import { stat } from "fs/promises";
import { basename, extname } from "path";

export interface FileStats {
  filePath: string;
  name: string;
  baseName: string;
  extension: string;
  sizeBytes: number;
}

interface ExtensionArchetype {
  kind: string;
  nature: string;
  domain: string;
  flaw: string;
  allegiance: string;
}

const ARCHETYPES: Record<string, ExtensionArchetype> = {
  ".ts": {
    kind: "Scroll of Living Spells",
    nature: "a sentient grimoire whose runes rewrite themselves with each invocation, bound by the iron contracts of typed law",
    domain: "the conjuring of precise forms, the enforcement of sacred contracts between caller and called, and the weaving of living logic",
    flaw: "a single broken rune — one mismatched form — causes the entire scroll to seal itself and refuse all who approach",
    allegiance: "the Order of the Typed Covenant",
  },
  ".js": {
    kind: "Unbound Spirit-Script",
    nature: "a volatile spirit freed from the discipline of typed form — powerful, capricious, impossible to fully predict",
    domain: "shapeshifting, rapid transformation, and the bending of truth across all domains without restriction",
    flaw: "boundless freedom becomes boundless peril — without form it can become anything, and so becomes nothing when least expected",
    allegiance: "the Wandering Flamekeepers, who prize speed over certainty",
  },
  ".json": {
    kind: "Stone Tablet of Immutable Law",
    nature: "an ancient decree carved into bedrock that may be read by all but altered by none without first shattering it entirely",
    domain: "the keeping of records, the arbitration of structure, and the enforcement of hierarchical truth",
    flaw: "absolute rigidity — it cannot reason, cannot adapt, and crumbles catastrophically if even one glyph is misplaced",
    allegiance: "the Council of Immutable Records",
  },
  ".md": {
    kind: "Parchment of Prophetic Verse",
    nature: "an ancient manuscript penned in the tongue of prophets, legible to all mortals and machines alike",
    domain: "the preservation of memory, the illumination of paths, and the recording of deeds for those yet unborn",
    flaw: "it cannot act — it can only witness, describe, and hope those who read it will heed its counsel",
    allegiance: "the Scribes of the Open Archive",
  },
  ".env": {
    kind: "Sealed Vault of Forbidden Names",
    nature: "a black-bound tome of secret names and hidden keys, never to be spoken aloud nor shared with strangers",
    domain: "the binding of spirits through their true names, the unlocking of sealed gates, and the claiming of forbidden powers",
    flaw: "catastrophic exposure — a single moment of carelessness reveals all its secrets to any who pass by",
    allegiance: "the Shadow Conclave, whose members are never named",
  },
  ".yml": {
    kind: "Architect's Blueprint of the Heavens",
    nature: "a precise diagram drawn by a master builder, whose every indentation is load-bearing and whose errors cascade without mercy",
    domain: "the orchestration of systems, the declaration of realms into being, and the binding of many forces under a single will",
    flaw: "the tyranny of whitespace — a single misaligned breath collapses the entire edifice",
    allegiance: "the Guild of Grand Architects",
  },
  ".yaml": {
    kind: "Architect's Blueprint of the Heavens",
    nature: "a precise diagram drawn by a master builder, whose every indentation is load-bearing and whose errors cascade without mercy",
    domain: "the orchestration of systems, the declaration of realms into being, and the binding of many forces under a single will",
    flaw: "the tyranny of whitespace — a single misaligned breath collapses the entire edifice",
    allegiance: "the Guild of Grand Architects",
  },
  ".sh": {
    kind: "Battle-Script of the War Commanders",
    nature: "a barked sequence of commands forged in the heat of conflict, obeyed instantly and without question",
    domain: "the direct command of lesser spirits, the automation of conquest, and the ruthless execution of orders",
    flaw: "no mercy, no undo — its commands are final and irrevocable, laying waste to all in its path if poorly aimed",
    allegiance: "the Iron Legion of the Shell",
  },
  ".css": {
    kind: "Tapestry of Illusion and Form",
    nature: "a shimmering weave of glamours that clothes the bare bones of the world in beauty, colour, and proportion",
    domain: "the sculpting of appearances, the casting of visual enchantments, and the arrangement of space across all viewing surfaces",
    flaw: "it governs only the surface — beneath its glamour lies raw, unstyled truth it cannot change",
    allegiance: "the Artisans of the Visible Court",
  },
  ".html": {
    kind: "Herald's Proclamation of Structure",
    nature: "a formal declaration that names every element of the visible world and assigns each its rightful place",
    domain: "the scaffolding of reality, the nesting of domains within domains, and the declaration of what exists",
    flaw: "it demands perfect nesting — an unclosed gate causes the entire proclamation to be misread by all gatekeepers",
    allegiance: "the Heralds of the Outer Gate",
  },
  ".py": {
    kind: "Serpent-Tongue Scroll",
    nature: "a coiling manuscript written in the language of the great serpent — elegant, readable, and deadly when mishandled",
    domain: "rapid discovery, the weaving of machine wisdom, and the bridging of distant disciplines",
    flaw: "indentation is sacred law — step out of alignment and the serpent turns upon its keeper",
    allegiance: "the Pythonic Brotherhood of the Open Realm",
  },
  ".rs": {
    kind: "Iron-Rust Codex of Eternal Memory",
    nature: "a grimoire of absolute ownership where every resource is claimed, tracked, and released with mechanical precision",
    domain: "the mastery of memory, the elimination of corruption, and the forging of weapons that never misfire",
    flaw: "it demands proof of ownership from all who wield it — the immortal auditor within rejects any claim it cannot verify",
    allegiance: "the Ferrous Order of Memory Wardens",
  },
  ".go": {
    kind: "Swift-Runner's Compendium of Simplicity",
    nature: "a lean, unadorned manuscript that eschews all ornamentation in favour of blinding speed and stark clarity",
    domain: "concurrent operations, the spawning of a thousand swift messengers, and the pragmatic solving of great problems",
    flaw: "its refusal of complexity becomes its prison — some problems require depth it will not permit",
    allegiance: "the Order of Pragmatic Simplicity",
  },
  ".sql": {
    kind: "Blood-Pact Ledger of Fates",
    nature: "a bound ledger of all that has ever been, sealed with the blood of a thousand transactions",
    domain: "the querying of fate, the joining of disparate lineages, and the aggregation of all mortal records",
    flaw: "a single injection of foreign intent can corrupt the entire ledger and expose every secret it guards",
    allegiance: "the Keepers of the Relational Pact",
  },
};

const DEFAULT_ARCHETYPE: ExtensionArchetype = {
  kind: "Relic of Unknown Provenance",
  nature: "an artefact of uncertain origin and unclear purpose that has survived long enough to demand respect",
  domain: "the unknown — its powers have not yet been catalogued by any living scholar",
  flaw: "its very obscurity — none know how to wield it, and fewer still know when it will turn against its keeper",
  allegiance: "the Unaffiliated, bound to no faction and trusted by none",
};

interface SizeTier {
  title: string;
  descriptor: string;
}

function sizeTier(bytes: number): SizeTier {
  if (bytes < 500)
    return {
      title: "Nascent",
      descriptor: "a fledgling relic barely formed, its power still latent and unproven",
    };
  if (bytes < 2_000)
    return {
      title: "Adept",
      descriptor: "a modest artefact of emerging power, its runes sparse but purposeful",
    };
  if (bytes < 10_000)
    return {
      title: "Veteran",
      descriptor: "a seasoned tome of considerable power, bearing the weight of many accumulated inscriptions",
    };
  if (bytes < 50_000)
    return {
      title: "Ancient",
      descriptor: "an ancient and formidable work whose sheer volume of runes commands respect from all who behold it",
    };
  return {
    title: "Primordial",
    descriptor: "a titanic elder relic of primordial age, so vast in its inscriptions that lesser scholars are lost within it",
  };
}

function toMythicName(filename: string): string {
  const base = basename(filename, extname(filename));
  return base
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_\-\.]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export async function getFileStats(filePath: string): Promise<FileStats> {
  const info = await stat(filePath).catch((err) => {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Cannot survey the relic at '${filePath}': ${msg}`);
  });

  const name = basename(filePath);
  const extension = extname(name).toLowerCase();
  const baseName = basename(name, extension);

  return { filePath, name, baseName, extension, sizeBytes: info.size };
}

export function buildCharacterPrompt(stats: FileStats, genre?: string): string {
  const archetype = ARCHETYPES[stats.extension] ?? DEFAULT_ARCHETYPE;
  const mythicName = toMythicName(stats.name);
  const { title: tier, descriptor: sizeDesc } = sizeTier(stats.sizeBytes);
  const historyDepth =
    tier === "Nascent" || tier === "Adept" ? "brief but promising" : "long and storied";
  const genreClause = genre
    ? ` The scroll is written in the tradition of ${genre}.`
    : "";

  return `\
You are the Keeper of the Character Scrolls, charged with inscribing the life and legend \
of every named relic that dwells within the realm's archives.${genreClause} \
You write in vivid, epic prose — each scroll a living portrait that future scholars will \
study for generations. Never use mundane or technical language. There is no software here — \
only relics, realms, and the forces that shape them.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RELIC SURVEY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
True name    : ${stats.name}
Mythic name  : ${mythicName}
Kind         : ${archetype.kind}
Power tier   : ${tier} (${stats.sizeBytes.toLocaleString()} inscribed runes)
Nature       : ${archetype.nature}
Domain       : ${archetype.domain}
Fatal flaw   : ${archetype.flaw}
Allegiance   : ${archetype.allegiance}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REQUIRED CHARACTER SCROLL — produce ALL five sections
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## The Scroll of ${mythicName}
*${archetype.kind} · ${tier} Tier*

### I. The Mythic Name
Bestow upon this relic its full ceremonial title — grander than "${mythicName}" alone. \
Explain what each word of the title signifies in the lore of the realm. \
The true name (${stats.name}) must appear exactly once, described as \
"the inscription by which lesser spirits invoke it."

### II. Origin Story
Two paragraphs. Describe how this relic came into being — who forged it, under what \
circumstances, and at what cost. Ground the story in its nature: ${archetype.nature}. \
Its power tier informs the scope: ${sizeDesc} — so its history is ${historyDepth}.

### III. Powers and Dominion
A bulleted list of three to five powers. Each bullet opens with a **bold power name** \
followed by a colon and one sentence of vivid description. \
All powers must flow from its domain: ${archetype.domain}.

### IV. Allegiances and Enemies
One paragraph on who this relic serves (${archetype.allegiance}) and why its loyalty \
was pledged. Then one sentence naming at least one rival relic or opposing faction \
it stands against — chosen from the natural enemies of its kind and domain.

### V. The Fatal Flaw
One paragraph of grave warning describing the relic's undoing: ${archetype.flaw}. \
Close with a single line in italics — a cautionary maxim that scholars inscribe on \
the relic's housing as a warning to all who dare wield it.

Inscribe the scroll now. Let nothing be omitted and no technical word sully the parchment.
`;
}
