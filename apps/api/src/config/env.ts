import { config as loadEnv } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

// Carrega .env da raiz do monorepo (3 níveis acima de src/config).
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
loadEnv({ path: resolve(__dirname, "../../../../.env") });


const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  API_PORT: z.coerce.number().default(3001),
  API_BASE_URL: z.string().url(),
  WEB_BASE_URL: z.string().url(),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),

  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),

  // Chaves externas: opcionais em dev (features específicas validam no ponto de uso).
  // Em produção, recomendamos preencher todas antes do deploy.
  ANTHROPIC_API_KEY: z.string().default(""),
  ANTHROPIC_MODEL_MAIN: z.string().default("claude-sonnet-4-6"),
  ANTHROPIC_MODEL_ROUTER: z.string().default("claude-haiku-4-5-20251001"),
  OPENAI_API_KEY: z.string().default(""),
  OPENAI_WHISPER_MODEL: z.string().default("whisper-1"),

  ZAPI_INSTANCE_ID: z.string().default(""),
  ZAPI_TOKEN: z.string().default(""),
  ZAPI_CLIENT_TOKEN: z.string().default(""),
  ZAPI_WEBHOOK_SECRET: z.string().default(""),

  ASAAS_API_KEY: z.string().default(""),
  ASAAS_API_BASE: z.string().url().default("https://sandbox.asaas.com/api/v3"),
  ASAAS_WEBHOOK_SECRET: z.string().default(""),

  R2_ACCOUNT_ID: z.string().default(""),
  R2_ACCESS_KEY_ID: z.string().default(""),
  R2_SECRET_ACCESS_KEY: z.string().default(""),
  R2_BUCKET: z.string().default("ficha-lucrativa-media"),
  R2_PUBLIC_URL: z.string().default("https://media.fichalucrativa.com.br"),

  JWT_SECRET: z.string().min(32),
  MAGIC_LINK_FROM_EMAIL: z.string().email().default("lucro@fichalucrativa.com.br"),
  RESEND_API_KEY: z.string().default(""),

  SENTRY_DSN: z.string().optional(),
  AXIOM_TOKEN: z.string().optional(),
  AXIOM_DATASET: z.string().default("ficha-lucrativa"),

  FEATURE_IMAGE_INPUT: z.coerce.boolean().default(true),
  FEATURE_AUDIO_INPUT: z.coerce.boolean().default(true),
  FEATURE_PAYWALL: z.coerce.boolean().default(false),

  PLAN_TRIAL_FICHAS: z.coerce.number().default(1),
  PLAN_BASIC_MSG_PER_DAY: z.coerce.number().default(50),
  PLAN_PRO_MSG_PER_DAY: z.coerce.number().default(200),
  PLAN_AUDIO_MAX_SECONDS: z.coerce.number().default(120),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Variáveis de ambiente inválidas:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export type Env = z.infer<typeof envSchema>;
