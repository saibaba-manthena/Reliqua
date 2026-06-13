import "dotenv/config";

interface RetrieveResult {
  content?: string;
  text?: string;
  chunk_id?: string;
  "@search.rerankerScore"?: number;
  [key: string]: unknown;
}

interface RetrieveResponse {
  value?: RetrieveResult[];
}

class FoundryConfigError extends Error {
  constructor(varName: string) {
    super(`Missing required environment variable: ${varName}`);
    this.name = "FoundryConfigError";
  }
}

class FoundryRequestError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = "FoundryRequestError";
  }
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new FoundryConfigError(name);
  return value;
}

function extractText(result: RetrieveResult): string {
  return (result.content ?? result.text ?? "").trim();
}

export async function retrieveGenreContext(
  genre: string,
  query: string
): Promise<string> {
  const endpoint = requireEnv("FOUNDRY_IQ_ENDPOINT").replace(/\/$/, "");
  const apiKey = requireEnv("FOUNDRY_IQ_API_KEY");
  const kbId = requireEnv("FOUNDRY_KB_ID");

  const url = `${endpoint}/knowledgebases/${kbId}/retrieve?api-version=2026-05-01-preview`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        query: `[${genre}] ${query}`,
        top: 4,
        reranker: "semantic",
      }),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new FoundryRequestError(`Network error reaching Foundry IQ: ${message}`);
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "(no body)");
    throw new FoundryRequestError(
      `Foundry IQ returned ${response.status} ${response.statusText}: ${body}`,
      response.status
    );
  }

  const data = (await response.json()) as RetrieveResponse;
  const results = data.value ?? [];

  return results
    .map(extractText)
    .filter((t) => t.length > 0)
    .join("\n\n---\n\n");
}
