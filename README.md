<div align="center">

# ✦ RELIQUA

### *Your code has a soul.*

**A GitHub Copilot MCP server that transforms any codebase into living mythology**
**Grounded by Microsoft Foundry IQ** · **Narrated by GitHub Copilot** 

---

[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-Server-1D9E75?style=flat-square)](https://modelcontextprotocol.io)
[![Foundry IQ](https://img.shields.io/badge/Microsoft-Foundry%20IQ-0078D4?style=flat-square&logo=microsoft&logoColor=white)](https://azure.microsoft.com)
[![GitHub Copilot](https://img.shields.io/badge/GitHub-Copilot-black?style=flat-square&logo=github&logoColor=white)](https://github.com/features/copilot)
[![Hackathon](https://img.shields.io/badge/Microsoft-Agents%20League%202026-purple?style=flat-square)](https://innovationstudio.microsoft.com)
[![Track](https://img.shields.io/badge/Track-Creative%20Apps-FF6B35?style=flat-square)]()

</div>

---

## ⚡ What is Reliqua?

Every codebase has an invisible soul — a history of decisions, battles won and lost, heroes and relics accumulated over time.

Developers see it as **folders and files**.

**Reliqua sees it as mythology.**

Reliqua is a **GitHub Copilot MCP server** that reads your VS Code workspace and transforms it into a living, genre-rich mythology — grounded in real archetype knowledge from **Microsoft Foundry IQ**, narrated directly inside **GitHub Copilot Chat**.

```
@reliqua reveal fantasy
```

> *"In the first age, a handful of sages carved the first halls of the Root Bastion (src).
> The Lantern Vault (.vscode) stands as silent guardian of the realm's unseen ways.
> The Forbidden Forest (node_modules) stretches beyond the horizon — vast, untamed,
> never entered willingly. Forty-seven battles have been won. Three shadow creatures
> still lurk in the dark corners of the realm..."*

---

## 🎬 Demo

> **Run these commands in GitHub Copilot Chat (Agent mode) on ANY project:**

| Command | What Happens |
|---|---|
| `@reliqua reveal fantasy` | Your entire codebase becomes a fantasy realm with history, factions, prophecy & world map |
| `@reliqua reveal sci-fi` | Your repo transforms into a space station mission log |
| `@reliqua reveal noir` | Your code becomes a rain-slicked city with a detective narrator |
| `@reliqua reveal western` | Your project becomes a frontier town with an old-timer voice |
| `@reliqua chronicle 5` | Your last 5 git commits narrated as epic battles |
| `@reliqua character src/index.ts` | Any file becomes a full character scroll with powers and fatal flaw |
| `@reliqua prophecy` | Every TODO/FIXME becomes an unfulfilled prophecy |
| `@reliqua map` | Text-art world map of your entire repo with territory legend |

---

## ✨ Real Output — Actual Demo

### `@reliqua reveal fantasy` on the Reliqua repo itself:

```
THE CHRONICLE OF THE ROOT BASTION

I. The Age Before — World History

You stand in a realm born from a single spark beneath a cold sky.
Thirteen cycles of recorded history have passed since the first stone
of this place was laid, and the land has grown from a simple clearing
into an ordered kingdom of halls and veiled archives.

The Lantern Vault (.vscode) is the silent guardian of the realm's
unseen ways. The Root Bastion (src) is the central citadel — home
to the Engine Wardens, the Foundry Seers, the Toolwrights, and the
Outer Scanners, each a guild with its own hall.

IV. The Prophecy

Beneath the Root Bastion's vaulted sky,
the Lantern Vault keeps silent watch.
When thirteen cycles sigh,
the iron ledgers tremble at the notch.
The Foundry Seers will seek the ember's core,
the Toolwrights will bind the hidden key,
and the Outer Scanners will open one more door,
where the silent spring calls them to the sea.
```

### `@reliqua map` — World Map Output:

```
+------------------------------------------+
|    .:. THE REALM OF C:\RELIQUA .:.        |
|                                           |
|  .VSCODE            |  SRC               |
|  The .vscode        |  The Wellspring     |
|  Dominion           |  of Origins         |
+------------------------------------------+
.:. LEGEND .:.
  .vscode  =  The .vscode Dominion
  src      =  The Wellspring of Origins
```

### `@reliqua prophecy` — When realm is clean:

```
"The realm is at peace — no prophecies remain unspoken."
```

---

## 🗺️ The Transformation Dictionary

Every code element becomes mythology. The genre you choose determines the style:

| Code Element | Fantasy | Sci-Fi | Noir | Western |
|---|---|---|---|---|
| `src/` | The Living Realm | Sector Prime | The City Proper | The Town |
| `auth/` | Order of the Iron Gate | Neural Lock Division | The Badge | The Marshal |
| `database/` | Vault of Sleeping Giants | The Memory Core | The Filing Room | The Land Office |
| `api/` | Road of a Thousand Voices | Transmission Array | The Back Channels | The Trails |
| `utils/` | Bazaar of Small Magics | Support Systems | The Fixers | The General Store |
| `node_modules/` | The Forbidden Forest | Allied Vessel Cargo | The Docks | The Supply Trains |
| `index.ts` | The Primordial Scroll | Station Core | The Original Case | The Founding Deed |
| `package.json` | The Elder Council | The Manifest | The Contact List | The Supply List |
| `README.md` | Prophecy of the First Author | Mission Briefing | The Intake Form | The Welcome Sign |
| `.env` | The Sealed Codex | Classified Frequency Codes | The Little Black Book | The Safe |
| git commit | A Battle Won | Mission Log Entry | Closing a Lead | A Day's Work Recorded |
| A bug | A Shadow Creature | System Anomaly | Anomaly in the File | Something's Off |
| TODO comment | Unfulfilled Prophecy | Deferred Maintenance Flag | A Loose Thread | Nail Needing Driving |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                  VS Code (User)                      │
│                                                      │
│  GitHub Copilot Chat — Agent Mode                   │
│       │  @reliqua reveal fantasy                    │
│       ▼                                             │
│  ┌─────────────────────────────────────────────┐   │
│  │         Reliqua MCP Server                  │   │
│  │         (node dist/index.js)                │   │
│  │                                             │   │
│  │  ┌──────────────┐  ┌───────────────────┐   │   │
│  │  │ workspace/   │  │ foundry/client.ts │   │   │
│  │  │ scanner.ts   │  │                   │   │   │
│  │  │              │  │ knowledge_base_   │   │   │
│  │  │ Reads: folders│  │ retrieve()        │   │   │
│  │  │ files, git,  │  │ API v2026-05-01   │   │   │
│  │  │ READMEs      │  └────────┬──────────┘   │   │
│  │  └──────┬───────┘           │              │   │
│  │         │                   │              │   │
│  │  ┌──────▼───────────────────▼───────────┐  │   │
│  │  │       engine/loreEngine.ts           │  │   │
│  │  │  Fuses workspace scan + genre KB     │  │   │
│  │  │  into a rich narrative prompt        │  │   │
│  │  └──────────────────────────────────────┘  │   │
│  │                                             │   │
│  │  Tools: lore_reveal · lore_chronicle        │   │
│  │         lore_character · lore_prophecy      │   │
│  │         lore_map                            │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
         │                        │
         ▼                        ▼
  Your Workspace             Azure AI Foundry
  (folders, files,           Foundry IQ KB:
   git log, TODOs)           lore-archetypes
                             (fantasy · sci-fi
                              noir · western)
```

---

## 📁 Project Structure

```
reliqua/
├── src/
│   ├── index.ts                # MCP server entry — registers all 5 tools
│   ├── engine/
│   │   └── loreEngine.ts       # Narrative fusion engine
│   ├── foundry/
│   │   └── client.ts           # Foundry IQ REST client
│   ├── tools/
│   │   ├── loreCharacter.ts    # File → character scroll
│   │   ├── loreChronicle.ts    # Git commits → battle chronicle
│   │   ├── loreMap.ts          # Folders → text-art world map
│   │   └── loreProphecy.ts     # TODOs → prophecies
│   └── workspace/
│       └── scanner.ts          # Workspace structure reader
├── dist/                       # Compiled JavaScript
├── .vscode/
│   └── mcp.json               # GitHub Copilot MCP registration
├── .env.example               # Credential template
├── .gitignore
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- [VS Code](https://code.visualstudio.com/) with [GitHub Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat) extension
- [Node.js](https://nodejs.org/) v18 or higher
- [Git](https://git-scm.com/)
- Azure account with a [Foundry IQ](https://azure.microsoft.com/en-us/products/ai-foundry) resource (free developer tier)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/saibaba-manthena/Reliqua.git
cd Reliqua
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**
```bash
# Copy the example file
cp .env.example .env

# Fill in your Azure Foundry IQ credentials
FOUNDRY_IQ_ENDPOINT=https://your-resource.search.windows.net
FOUNDRY_IQ_API_KEY=your-primary-admin-key
FOUNDRY_KB_ID=your-knowledge-base-id
```

**4. Set up the Foundry IQ Knowledge Base**

Create a Foundry IQ resource in Azure → create a knowledge base named `lore-archetypes` → upload the 4 genre files:
- `kb-content/fantasy.txt` — epic fantasy archetypes
- `kb-content/scifi.txt` — sci-fi station archetypes
- `kb-content/noir.txt` — detective noir archetypes
- `kb-content/western.txt` — frontier western archetypes

**5. Build the project**
```bash
npm run build
# Expected: Clean — zero errors
```

**6. Open any project in VS Code**
```bash
code /path/to/any/project/you/want/to/mythologize
```

**7. Start using Reliqua in Copilot Chat**

Open Copilot Chat → switch to **Agent mode** → type:
```
@reliqua reveal fantasy
```

---

## 🔧 How the Microsoft IQ Integration Works

Reliqua uses **Foundry IQ** — Microsoft's agentic knowledge retrieval layer — as its intelligence backbone.

**Without Foundry IQ:** Generic AI output. Every codebase produces similar, unmemorable text.

**With Foundry IQ:** The knowledge base contains hand-crafted genre archetype files — specific naming conventions, narrative rules, vocabulary, and world-building logic for each genre. When a user selects `fantasy`, Reliqua calls `knowledge_base_retrieve` with API version `2026-05-01-preview`, gets the fantasy archetype framework, and injects it into the narrative prompt. The result is genre-authentic, internally consistent, and genuinely beautiful.

```typescript
// src/foundry/client.ts
const response = await fetch(
  `${FOUNDRY_IQ_ENDPOINT}/knowledgebases/${KB_ID}/retrieve
   ?api-version=2026-05-01-preview`,
  {
    method: "POST",
    headers: { "api-key": FOUNDRY_IQ_API_KEY },
    body: JSON.stringify({
      query: `${genre} archetypes mythology narrative framework`,
      top: 4,
      reranker: "semantic"
    })
  }
);
```

---

## 🤖 How GitHub Copilot Was Used to Build This

GitHub Copilot was the **primary development tool** throughout the entire 24-hour build:

- **Copilot Agent** scaffolded the complete TypeScript MCP server from a single English prompt
- **Copilot** wrote `scanner.ts` — detecting folders, files, and git history from the workspace
- **Copilot** built all 5 MCP tool registrations with correct parameter schemas
- **Copilot** created the Foundry IQ REST client with proper error handling
- **Copilot** designed the lore engine prompt template with genre-aware narrative instructions
- **Copilot** created `.vscode/mcp.json` — the server registration enabling Copilot integration
- **Copilot** fixed all TypeScript compilation errors — `npm run build` returned zero errors first try
- **The primary user interface IS Copilot Chat** — all @reliqua commands run natively inside Copilot

See [COPILOT_USAGE.md](./COPILOT_USAGE.md) for the complete development diary.

---

## 🏆 Hackathon Submission

| Criterion | Implementation |
|---|---|
| **GitHub Copilot Usage** | Copilot Agent built the entire server. Copilot Chat IS the user interface. |
| **Microsoft IQ Integration** | Foundry IQ knowledge base with 4 genre archetype files. `knowledge_base_retrieve` called on every reveal. |
| **Creative Application** | World-first tool transforming codebases into mythology. Novel concept, zero learning curve, immediate wow factor. |

**Track:** Creative Apps — Microsoft Agents League Hackathon 2026
**Built:** June 13-14, 2026 — 24 hours

---

## 🔮 Why This Is World-First

No tool in existence:
- Transforms a developer's **own codebase** into a creative narrative universe
- Starts from something **real** (your actual workspace) instead of a blank prompt
- Lives **inside GitHub Copilot Chat** — where developers already work
- Produces output **grounded by enterprise knowledge** (Foundry IQ) — not generic AI text
- Makes codebases **emotionally legible** to both technical and non-technical audiences

---

## 📜 License

MIT License — see [LICENSE](./LICENSE) for details.

---

<div align="center">

*Built with ❤️ using GitHub Copilot + Claude + Microsoft Foundry IQ*

**"Every codebase has a soul. Reliqua gives it a name."**

[⭐ Star this repo](https://github.com/saibaba-manthena/Reliqua) · [🐛 Report an issue](https://github.com/saibaba-manthena/Reliqua/issues) · [🍴 Fork it](https://github.com/saibaba-manthena/Reliqua/fork)

</div>
