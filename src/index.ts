import dotenv from "dotenv";
dotenv.config();
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { scanWorkspace } from "./workspace/scanner.js";
import { retrieveGenreContext } from "./foundry/client.js";
import { buildLorePrompt } from "./engine/loreEngine.js";
import { getGitLog, buildChroniclePrompt } from "./tools/loreChronicle.js";
import { getFileStats, buildCharacterPrompt } from "./tools/loreCharacter.js";
import { findTodos, buildProphecyPrompt } from "./tools/loreProphecy.js";
import { buildLoreMap } from "./tools/loreMap.js";

const server = new McpServer({
  name: "reliqua",
  version: "0.1.0",
});

server.tool(
  "lore_reveal",
  "Transforms the current workspace into a vivid mythological chronicle.",
  {
    genre: z
      .enum(["fantasy", "sci-fi", "western", "noir"])
      .describe("Mythological genre for the chronicle"),
    detail: z
      .enum(["brief", "full"])
      .optional()
      .describe("Level of chronicle detail (default: full)"),
  },
  async ({ genre, detail }) => {
    const scan = await scanWorkspace(process.cwd());
    const genreContext = await retrieveGenreContext(genre, scan.path);
    const prompt = buildLorePrompt(scan, genreContext, genre);

    return {
      content: [
        {
          type: "text" as const,
          text: prompt,
        },
      ],
    };
  }
);

server.tool(
  "lore_chronicle",
  "Renders the git commit history as an epic chronicle of battles and realm events.",
  {
    commits: z
      .number()
      .int()
      .min(1)
      .max(50)
      .optional()
      .describe("Number of commits to chronicle (default: 5)"),
  },
  async ({ commits }) => {
    const count = commits ?? 5;
    const entries = await getGitLog(process.cwd(), count);
    const prompt = buildChroniclePrompt(entries);

    return {
      content: [
        {
          type: "text" as const,
          text: prompt,
        },
      ],
    };
  }
);

server.tool(
  "lore_character",
  "Generates a mythological character scroll for a file — its mythic name, origin, powers, allegiances, and fatal flaw.",
  {
    filePath: z.string().describe("Path to the file to chronicle"),
    genre: z.string().optional().describe("Optional genre for the scroll's narrative style"),
  },
  async ({ filePath, genre }) => {
    const stats = await getFileStats(filePath);
    const prompt = buildCharacterPrompt(stats, genre);

    return {
      content: [
        {
          type: "text" as const,
          text: prompt,
        },
      ],
    };
  }
);

server.tool(
  "lore_prophecy",
  "Scans the workspace for TODO and FIXME comments and narrates each as an unfulfilled prophecy or dark omen.",
  {},
  async () => {
    const todos = await findTodos(process.cwd());
    const prompt = buildProphecyPrompt(todos);

    return {
      content: [
        {
          type: "text" as const,
          text: prompt,
        },
      ],
    };
  }
);

server.tool(
  "lore_map",
  "Generates a text-art world map of the workspace, with each top-level folder rendered as a named territory.",
  {
    style: z
      .enum(["ascii", "unicode"])
      .optional()
      .describe("Border drawing style (default: unicode)"),
  },
  async ({ style }) => {
    const scan = await scanWorkspace(process.cwd());
    const map = buildLoreMap(scan, style ?? "unicode");

    return {
      content: [
        {
          type: "text" as const,
          text: map,
        },
      ],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
