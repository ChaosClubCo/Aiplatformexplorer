import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

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

Deno.serve(app.fetch);
