import { z } from "zod";

export const UnitEnum = z.enum(["g", "kg", "ml", "l", "un"]);
export type Unit = z.infer<typeof UnitEnum>;

export const SegmentEnum = z.enum([
  "lanchonete",
  "pizzaria",
  "food_truck",
  "confeitaria",
  "dark_kitchen",
  "restaurante",
  "padaria",
  "outro",
]);
export type Segment = z.infer<typeof SegmentEnum>;

export const DishStageEnum = z.enum(["basica", "custo_preco", "pop", "nutricional"]);
export const DishStatusEnum = z.enum(["em_construcao", "pronta", "validada", "arquivada"]);

// Inputs de tools Claude (validar antes de persistir)
export const RegisterDishInput = z.object({
  name: z.string().min(1).max(120),
  yield_units: z.number().int().positive().default(1),
  prep_minutes: z.number().int().nonnegative().optional(),
});

export const AddIngredientInput = z.object({
  dish_id: z.string().uuid(),
  name: z.string().min(1).max(120),
  quantity: z.number().positive(),
  unit: UnitEnum,
  confidence: z.number().min(0).max(1),
  notes: z.string().max(300).optional(),
});

export const SetIngredientPriceInput = z.object({
  ingredient_id: z.string().uuid(),
  price_brl: z.number().positive(),
  quantity: z.number().positive(),
  unit: UnitEnum,
});

export const CalculateAndFinalizeInput = z.object({
  dish_id: z.string().uuid(),
  actual_price_brl: z.number().positive().optional(),
});

export const AskUserInput = z.object({
  question: z.string().min(1).max(500),
  expected_type: z.enum(["text", "number", "choice", "confirmation"]),
  choices: z.array(z.string()).optional(),
});

export const CancelCurrentDishInput = z.object({
  dish_id: z.string().uuid(),
  reason: z.string().optional(),
});

// Payload do webhook Z-API (inbound) — schema mínimo, valida o essencial.
export const ZapiInboundSchema = z.object({
  phone: z.string(),
  messageId: z.string(),
  fromMe: z.boolean().optional(),
  type: z.enum(["text", "audio", "image", "document"]).optional(),
  text: z.object({ message: z.string() }).optional(),
  audio: z.object({ audioUrl: z.string().url() }).optional(),
  image: z.object({ imageUrl: z.string().url(), caption: z.string().optional() }).optional(),
});
export type ZapiInbound = z.infer<typeof ZapiInboundSchema>;
