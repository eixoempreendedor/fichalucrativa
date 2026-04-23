# Ficha Lucrativa

> **Decida o seu lucro em cada prato.**

SaaS brasileiro de precificação para pequeno food business. Bot **Lucrô** conversa pelo WhatsApp (áudio/foto/texto), monta a ficha técnica e entrega custo + preço sugerido + PDF.

## Monorepo

```
apps/
  api/     Backend Node/Express + Prisma + Claude + Worker (BullMQ)
  web/     Dashboard Next.js 14 (App Router)
packages/
  shared/  Zod schemas + tipos compartilhados
docs/
  adr/     Architecture Decision Records
```

## Stack

- **Runtime:** Node 20 · **API:** Express · **ORM:** Prisma · **DB:** Postgres · **Queue:** BullMQ + Redis
- **LLM:** Claude Sonnet 4.6 (principal) + Haiku 4.5 (roteador) · **Áudio:** OpenAI Whisper
- **WhatsApp:** Z-API · **Pagamento:** Asaas · **Storage:** Cloudflare R2
- **Web:** Next.js 14 + Tailwind + shadcn/ui · **Deploy:** Railway (API+worker) + Vercel (web)

Detalhes: [docs/adr/0001-stack.md](docs/adr/0001-stack.md).

## Setup local

```bash
pnpm install
cp .env.example .env   # preencha as chaves
pnpm --filter api prisma migrate dev
pnpm --filter api prisma db seed
pnpm dev               # roda api + worker + web
```

## Scripts principais

```bash
pnpm dev               # tudo em paralelo
pnpm --filter api dev  # só a API + worker
pnpm --filter web dev  # só o dashboard
pnpm test              # roda testes
pnpm typecheck         # tsc --noEmit em todo workspace
pnpm lint              # biome check
```

## Variáveis de ambiente

Ver `.env.example`. Essenciais para rodar:

- `DATABASE_URL` · `REDIS_URL`
- `ANTHROPIC_API_KEY` · `OPENAI_API_KEY`
- `ZAPI_INSTANCE_ID` · `ZAPI_TOKEN` · `ZAPI_CLIENT_TOKEN` · `ZAPI_WEBHOOK_SECRET`
- `ASAAS_API_KEY` · `ASAAS_WEBHOOK_SECRET`
- `R2_ACCOUNT_ID` · `R2_ACCESS_KEY_ID` · `R2_SECRET_ACCESS_KEY` · `R2_BUCKET`

## Deploy

- **API + Worker:** Railway (dois serviços apontando pro mesmo repo, comandos `pnpm --filter api start` e `pnpm --filter api start:worker`)
- **Web:** Vercel apontando para `apps/web`
- **DB + Redis:** Railway addons

## Licença

Proprietário © 2026 Ficha Lucrativa · Projeto idealizado por Luiz Curti.
