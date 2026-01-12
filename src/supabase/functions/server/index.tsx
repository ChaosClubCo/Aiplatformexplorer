import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { z } from "npm:zod";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Validation Schemas
const StackSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  platformIds: z.array(z.string()),
  createdAt: z.number(),
  updatedAt: z.number(),
  tags: z.array(z.string()).optional()
});

const NotionExportSchema = z.object({
  stack: StackSchema,
  databaseId: z.string().optional()
});

const GitHubExportSchema = z.object({
  stack: StackSchema,
  repoUrl: z.string().min(1)
});

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-8c5e19c9/health", (c) => {
  return c.json({ status: "ok" });
});

// Seed data endpoint
app.post("/make-server-8c5e19c9/seed", async (c) => {
  try {
    const body = await c.req.json();
    const { platforms, questions } = body;

    if (platforms) {
      await kv.set("platforms", platforms);
    }
    
    if (questions) {
      await kv.set("questions", questions);
    }

    return c.json({ status: "seeded" });
  } catch (error) {
    console.error("Seed error:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Get platforms endpoint
app.get("/make-server-8c5e19c9/platforms", async (c) => {
  try {
    const platforms = await kv.get("platforms");
    return c.json(platforms || []);
  } catch (error) {
    console.error("Get platforms error:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Get questions endpoint
app.get("/make-server-8c5e19c9/questions", async (c) => {
  try {
    const questions = await kv.get("questions");
    return c.json(questions || []);
  } catch (error) {
    console.error("Get questions error:", error);
    return c.json({ error: error.message }, 500);
  }
});

// --- Stacks Routes ---

// Get User Stacks
app.get("/make-server-8c5e19c9/stacks/:userId", async (c) => {
  const userId = c.req.param("userId");
  try {
    const stacks = await kv.getByPrefix(`stacks:${userId}`);
    return c.json(stacks);
  } catch (error) {
    console.error("Get stacks error:", error);
    return c.json({ error: error.message }, 500);
  }
});

// Save Stack (Upsert)
app.post("/make-server-8c5e19c9/stacks/:userId", async (c) => {
  const userId = c.req.param("userId");
  try {
    const body = await c.req.json();
    const stack = StackSchema.parse(body);
    
    await kv.set(`stacks:${userId}:${stack.id}`, stack);
    return c.json({ status: "saved" });
  } catch (error) {
    console.error("Save stack error:", error);
    return c.json({ error: error instanceof z.ZodError ? error.errors : error.message }, 400);
  }
});

// Delete Stack
app.delete("/make-server-8c5e19c9/stacks/:userId/:stackId", async (c) => {
  const { userId, stackId } = c.req.param();
  try {
    await kv.del(`stacks:${userId}:${stackId}`);
    return c.json({ status: "deleted" });
  } catch (error) {
    console.error("Delete stack error:", error);
    return c.json({ error: error.message }, 500);
  }
});

// --- Integrations ---

// Notion Export
app.post("/make-server-8c5e19c9/integrations/notion", async (c) => {
  try {
    const body = await c.req.json();
    const { stack, databaseId } = NotionExportSchema.parse(body);
    
    const notionKey = Deno.env.get("NOTION_SECRET_API") || Deno.env.get("Notion_api_key");
    const targetDbId = databaseId || Deno.env.get("Notion_database_id");
    
    if (!notionKey) return c.json({ error: "Notion API key not configured" }, 500);
    if (!targetDbId) return c.json({ error: "Notion Database ID not provided" }, 400);
    
    // Create a page in the database
    const response = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${notionKey}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        parent: { database_id: targetDbId },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: stack.name,
                },
              },
            ],
          },
          Description: {
            rich_text: [
              {
                text: {
                  content: stack.description || "",
                },
              },
            ],
          },
          PlatformCount: {
            number: stack.platformIds.length
          }
        },
        children: [
           {
            object: "block",
            type: "heading_2",
            heading_2: {
              rich_text: [{ type: "text", text: { content: "Platform Analysis" } }]
            }
          },
          {
            object: "block",
            type: "paragraph",
            paragraph: {
              rich_text: [{ type: "text", text: { content: `Analysis created on ${new Date(stack.createdAt).toLocaleDateString()}` } }]
            }
          }
        ]
      }),
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Notion API error: ${err}`);
    }

    const data = await response.json();
    return c.json({ url: data.url });
  } catch (error) {
    console.error("Notion export error:", error);
    return c.json({ error: error instanceof z.ZodError ? error.errors : error.message }, 500);
  }
});

// GitHub Issue Export
app.post("/make-server-8c5e19c9/integrations/github", async (c) => {
  try {
    const body = await c.req.json();
    const { stack, repoUrl } = GitHubExportSchema.parse(body);
    
    const githubToken = Deno.env.get("Github"); // Using the secret name provided in prompt

    if (!githubToken) return c.json({ error: "GitHub token not configured" }, 500);

    const description = `
# Stack Evaluation: ${stack.name}

${stack.description || "No description provided."}

**Platforms:** ${stack.platformIds.length}
**Created:** ${new Date(stack.createdAt).toISOString()}

## Platforms in this Stack
${stack.platformIds.map((id: string) => `- ${id}`).join("\n")}
    `;

    const response = await fetch(`https://api.github.com/repos/${repoUrl}/issues`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${githubToken}`,
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "AI-Platform-Explorer"
      },
      body: JSON.stringify({
        title: `[Evaluation] ${stack.name}`,
        body: description,
        labels: ["ai-evaluation", "stack"]
      })
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`GitHub API error: ${err}`);
    }

    const data = await response.json();
    return c.json({ url: data.html_url });
  } catch (error) {
    console.error("GitHub export error:", error);
    return c.json({ error: error instanceof z.ZodError ? error.errors : error.message }, 500);
  }
});

Deno.serve(app.fetch);
