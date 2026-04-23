import express from "express";
import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";

const app = express();

app.use(express.json({ limit: "5mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "ficha-lucrativa-api", ts: new Date().toISOString() });
});

// TODO S1: webhooks/zapi.ts
// TODO S1: webhooks/asaas.ts
// TODO S1: routes/auth.ts (magic link)
// TODO S3: routes/dishes.ts, routes/restaurants.ts

app.listen(env.API_PORT, () => {
  logger.info({ port: env.API_PORT, env: env.NODE_ENV }, "🚀 API Ficha Lucrativa rodando");
});
