// Tool definitions para Claude (function calling / tool use).
// Schemas Zod vivem em packages/shared — estas são as versões JSON Schema
// para enviar à API Anthropic. Manter os dois em sincronia.

import type Anthropic from "@anthropic-ai/sdk";

export const LUCRO_TOOLS: Anthropic.Tool[] = [
  {
    name: "register_dish",
    description:
      "Registra um novo prato que o usuário quer precificar. Use quando o usuário mencionar o nome de um prato pela primeira vez.",
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Nome do prato (ex: X-Burger, Pizza Calabresa)" },
        yield_units: {
          type: "integer",
          description: "Quantas unidades/porções a receita rende. Default 1 se desconhecido.",
          default: 1,
        },
        prep_minutes: {
          type: "integer",
          description: "Tempo de preparo em minutos. Opcional.",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "add_ingredient",
    description:
      "Adiciona um ingrediente à ficha do prato atual. Sempre inclua confidence (0-1) indicando o quanto você tem certeza da quantidade e unidade. Se confidence < 0.8, o servidor pedirá confirmação ao usuário.",
    input_schema: {
      type: "object",
      properties: {
        dish_id: { type: "string", description: "ID do prato retornado por register_dish" },
        name: { type: "string", description: "Nome do ingrediente como o usuário falou" },
        quantity: { type: "number", description: "Quantidade por unidade da receita" },
        unit: {
          type: "string",
          description: "Unidade: g, kg, ml, l, un",
          enum: ["g", "kg", "ml", "l", "un"],
        },
        confidence: {
          type: "number",
          description: "Confiança na extração, 0-1",
          minimum: 0,
          maximum: 1,
        },
        notes: { type: "string", description: "Observação opcional (ex: 'aproximado')" },
      },
      required: ["dish_id", "name", "quantity", "unit", "confidence"],
    },
  },
  {
    name: "set_ingredient_price",
    description:
      "Define ou atualiza o preço que o restaurante paga por um ingrediente. Use quando o usuário informar preço.",
    input_schema: {
      type: "object",
      properties: {
        ingredient_id: { type: "string" },
        price_brl: { type: "number", description: "Preço em reais" },
        quantity: { type: "number", description: "Para qual quantidade esse preço vale" },
        unit: { type: "string", description: "Unidade da quantidade" },
      },
      required: ["ingredient_id", "price_brl", "quantity", "unit"],
    },
  },
  {
    name: "calculate_and_finalize",
    description:
      "Calcula custo total, sugere preço de venda (CMV alvo 30%) e marca a ficha como pronta. Só chame APÓS o usuário confirmar todos os ingredientes e quantidades.",
    input_schema: {
      type: "object",
      properties: {
        dish_id: { type: "string" },
        actual_price_brl: {
          type: "number",
          description: "Preço que o usuário já cobra pelo prato (opcional, para comparar com sugerido)",
        },
      },
      required: ["dish_id"],
    },
  },
  {
    name: "ask_user",
    description:
      "Faz uma pergunta ao usuário e aguarda resposta. Use para coletar dados faltantes ou confirmar informação com confidence baixa. O servidor transforma em mensagem WhatsApp.",
    input_schema: {
      type: "object",
      properties: {
        question: { type: "string", description: "Pergunta em português, tom do Lucrô" },
        expected_type: {
          type: "string",
          enum: ["text", "number", "choice", "confirmation"],
        },
        choices: {
          type: "array",
          items: { type: "string" },
          description: "Opções quando expected_type=choice",
        },
      },
      required: ["question", "expected_type"],
    },
  },
  {
    name: "cancel_current_dish",
    description: "Cancela e arquiva o prato atualmente em construção. Use quando o usuário pedir explicitamente.",
    input_schema: {
      type: "object",
      properties: {
        dish_id: { type: "string" },
        reason: { type: "string", description: "Motivo informado pelo usuário, se houver" },
      },
      required: ["dish_id"],
    },
  },
];

export type ToolName =
  | "register_dish"
  | "add_ingredient"
  | "set_ingredient_price"
  | "calculate_and_finalize"
  | "ask_user"
  | "cancel_current_dish";
