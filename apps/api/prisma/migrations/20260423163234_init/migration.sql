-- CreateEnum
CREATE TYPE "Segment" AS ENUM ('lanchonete', 'pizzaria', 'food_truck', 'confeitaria', 'dark_kitchen', 'restaurante', 'padaria', 'outro');

-- CreateEnum
CREATE TYPE "PriceSource" AS ENUM ('seed', 'user', 'nota_fiscal', 'crowdsource');

-- CreateEnum
CREATE TYPE "DishStage" AS ENUM ('basica', 'custo_preco', 'pop', 'nutricional');

-- CreateEnum
CREATE TYPE "DishStatus" AS ENUM ('em_construcao', 'pronta', 'validada', 'arquivada');

-- CreateEnum
CREATE TYPE "ConversationState" AS ENUM ('idle', 'collecting_ingredients', 'confirming_ingredients', 'collecting_prices', 'confirming_final', 'finalized');

-- CreateEnum
CREATE TYPE "MsgDirection" AS ENUM ('inbound', 'outbound');

-- CreateEnum
CREATE TYPE "MsgType" AS ENUM ('text', 'audio', 'image', 'document', 'system');

-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('trial', 'basic', 'pro');

-- CreateEnum
CREATE TYPE "SubStatus" AS ENUM ('trialing', 'active', 'past_due', 'canceled');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "whatsapp_e164" TEXT NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restaurants" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "segment" "Segment" NOT NULL,
    "city" TEXT,
    "state_uf" CHAR(2),
    "default_markup" DECIMAL(5,4) NOT NULL DEFAULT 0.30,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "restaurants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "canonical_name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "category" TEXT,
    "is_global" BOOLEAN NOT NULL DEFAULT false,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredient_prices" (
    "id" TEXT NOT NULL,
    "ingredient_id" TEXT NOT NULL,
    "restaurant_id" TEXT,
    "price_brl" DECIMAL(10,4) NOT NULL,
    "quantity" DECIMAL(10,3) NOT NULL,
    "unit" TEXT NOT NULL,
    "source" "PriceSource" NOT NULL,
    "valid_from" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ingredient_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dishes" (
    "id" TEXT NOT NULL,
    "restaurant_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "yield_units" INTEGER NOT NULL DEFAULT 1,
    "prep_minutes" INTEGER,
    "stage" "DishStage" NOT NULL DEFAULT 'basica',
    "status" "DishStatus" NOT NULL DEFAULT 'em_construcao',
    "total_cost_brl" DECIMAL(10,2),
    "suggested_price_brl" DECIMAL(10,2),
    "actual_price_brl" DECIMAL(10,2),
    "margin_pct" DECIMAL(5,2),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dishes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dish_ingredients" (
    "id" TEXT NOT NULL,
    "dish_id" TEXT NOT NULL,
    "ingredient_id" TEXT NOT NULL,
    "quantity" DECIMAL(10,3) NOT NULL,
    "unit" TEXT NOT NULL,
    "unit_cost_brl" DECIMAL(10,4),
    "line_cost_brl" DECIMAL(10,4),

    CONSTRAINT "dish_ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "active_dish_id" TEXT,
    "state" "ConversationState" NOT NULL DEFAULT 'idle',
    "pending_fields" JSONB NOT NULL DEFAULT '[]',
    "last_message_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "direction" "MsgDirection" NOT NULL,
    "type" "MsgType" NOT NULL,
    "content_text" TEXT,
    "media_url" TEXT,
    "raw_payload" JSONB,
    "cost_usd" DECIMAL(10,6),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "asaas_customer_id" TEXT,
    "asaas_sub_id" TEXT,
    "plan" "Plan" NOT NULL DEFAULT 'trial',
    "status" "SubStatus" NOT NULL DEFAULT 'trialing',
    "current_period_end" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_whatsapp_e164_key" ON "users"("whatsapp_e164");

-- CreateIndex
CREATE INDEX "restaurants_owner_id_idx" ON "restaurants"("owner_id");

-- CreateIndex
CREATE INDEX "ingredients_canonical_name_idx" ON "ingredients"("canonical_name");

-- CreateIndex
CREATE UNIQUE INDEX "ingredients_canonical_name_created_by_key" ON "ingredients"("canonical_name", "created_by");

-- CreateIndex
CREATE INDEX "ingredient_prices_ingredient_id_restaurant_id_valid_from_idx" ON "ingredient_prices"("ingredient_id", "restaurant_id", "valid_from" DESC);

-- CreateIndex
CREATE INDEX "dishes_restaurant_id_status_idx" ON "dishes"("restaurant_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "dishes_restaurant_id_name_key" ON "dishes"("restaurant_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "dish_ingredients_dish_id_ingredient_id_key" ON "dish_ingredients"("dish_id", "ingredient_id");

-- CreateIndex
CREATE INDEX "conversations_user_id_idx" ON "conversations"("user_id");

-- CreateIndex
CREATE INDEX "messages_conversation_id_created_at_idx" ON "messages"("conversation_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "subscriptions_user_id_idx" ON "subscriptions"("user_id");

-- AddForeignKey
ALTER TABLE "restaurants" ADD CONSTRAINT "restaurants_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "restaurants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredient_prices" ADD CONSTRAINT "ingredient_prices_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredient_prices" ADD CONSTRAINT "ingredient_prices_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dishes" ADD CONSTRAINT "dishes_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dish_ingredients" ADD CONSTRAINT "dish_ingredients_dish_id_fkey" FOREIGN KEY ("dish_id") REFERENCES "dishes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dish_ingredients" ADD CONSTRAINT "dish_ingredients_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_active_dish_id_fkey" FOREIGN KEY ("active_dish_id") REFERENCES "dishes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
