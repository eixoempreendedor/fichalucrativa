import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  API_PORT: z.coerce.number().default(3001),
  API_BASE_URL: z.string().url(),
  WEB_BASE_URL: z.string().url(),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),

  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),

  ANTHROPIC_API_KEY: z.string().min(10),
  ANTHROPIC_MODEL_MAIN: z.string().default("claude-sonnet-4-6"),
  ANTHROPIC_MODEL_ROUTER: z.string().default("claude-haiku-4-5-20251001"),
  OPENAI_API_KEY: z.string().min(10),
  OPENAI_WHISPER_MODEL: z.string().default("whisper-1"),

  ZAPI_INSTANCE_ID: z.string().min(1),
  ZAPI_TOKEN: z.string().min(1),
  ZAPI_CLIENT_TOKEN: z.string().min(1),
  ZAPI_WEBHOOK_SECRET: z.string().min(8),

  ASAAS_API_KEY: z.string().min(1),
  ASAAS_API_BASE: z.string().url().default("https://sandbox.asaas.com/api/v3"),
  ASAAS_WEBHOOK_SECRET: z.string().min(8),

  R2_ACCOUNT_ID: z.string().min(1),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_BUCKET: z.string().min(1),
  R2_PUBLIC_URL: z.string().url(),

  JWT_SECRET: z.string().min(32),
  MAGIC_LINK_FROM_EMAIL: z.string().email(),
  RESEND_API_KEY: z.string().min(1),

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
