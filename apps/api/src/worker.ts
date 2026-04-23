import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";

// TODO S1: importar filas e handlers
// import { inboundQueue } from "./jobs/queues.js";
// import { processInbound } from "./jobs/processInbound.js";

logger.info({ env: env.NODE_ENV }, "👷 Worker Ficha Lucrativa iniciando");

// Worker vai ficar ouvindo BullMQ aqui — implementação S1
// new Worker("inbound", processInbound, { connection: { url: env.REDIS_URL } });

process.on("SIGTERM", () => {
  logger.info("Worker recebeu SIGTERM, encerrando...");
  process.exit(0);
});
