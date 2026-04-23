# ADR 0001 — Stack do MVP

**Status:** Accepted
**Date:** 2026-04-23
**Deciders:** Luiz Curti (founder/dev), CTO Architect (consulting)

## Context

MVP do Ficha Lucrativa precisa estar em produção em 4-6 semanas com 1 dev (Luiz, solo). Já existe stack dominada no projeto irmão zapi-monitor: Node/Express + Z-API + Claude API + Railway. O produto é WhatsApp-first com dashboard web secundário. Conversa é multimodal (áudio/foto/texto), async por natureza, e exige base de dados relacional (preços, fichas, assinaturas).

## Decision

Adotar:

- **Runtime:** Node.js 20 LTS
- **API framework:** Express
- **ORM:** Prisma
- **Banco relacional:** Postgres (Railway managed)
- **Fila de jobs:** BullMQ + Redis (Railway addon)
- **LLM principal:** Claude Sonnet 4.6 (Anthropic)
- **LLM classificador:** Claude Haiku 4.5
- **Transcrição áudio:** OpenAI Whisper (`whisper-1`) — ver ADR 0002
- **Visão:** Claude Sonnet 4.6 com tool use
- **WhatsApp:** Z-API
- **Pagamento:** Asaas — ver ADR 0004
- **Auth web:** magic link próprio (sem senha)
- **Dashboard web:** Next.js 14 App Router + Tailwind + shadcn/ui
- **PDF:** `@react-pdf/renderer`
- **Storage:** Cloudflare R2
- **Deploy:** Railway (API + worker) + Vercel (web)
- **Observabilidade:** Sentry (erros) + Axiom (logs)
- **Monorepo:** pnpm workspaces (sem Turbo/Nx)

## Alternatives considered

| Alternativa | Por que rejeitada |
|---|---|
| Fastify | Ganho marginal sobre Express; trocar tooling não justifica em 4 semanas |
| Supabase | Auth integrado não encaixa com WhatsApp-as-identity; lock-in forte |
| Firebase/Firestore | Mau ajuste para dados relacionais (preços históricos, joins) |
| Turborepo | Overhead de configuração desnecessário para 2 apps |
| Monolito sem worker | Webhook Z-API tem timeout; async é obrigatório para áudio/imagem |

## Consequences

**Positive:**
- Velocidade máxima: zero curva de aprendizado
- Debug familiar para o dev solo
- Stack "chato" (boring) = menos surpresa em produção

**Negative:**
- Não é a stack mais moderna possível (ok, trade deliberado)
- Express tem menos tipagem nativa que Fastify (mitigado com Zod)

**Neutral:**
- Custo mensal estimado em produção com ~50 usuários: Railway ~US$ 20 + Vercel grátis + R2 ~US$ 2 + Anthropic/OpenAI ~R$ 50. Sub-R$ 300/mês.

## Trade-offs

Ganhamos: time-to-ship, familiaridade, observabilidade pronta.
Abrimos mão: possíveis melhorias de perf/DX que vêm com stacks mais novas — aceitável porque o gargalo do MVP é iteração com cliente, não infraestrutura.
