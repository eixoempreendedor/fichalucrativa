# CLAUDE.md — Ficha Lucrativa

Instruções para Claude Code ao trabalhar neste repositório.

## Contexto do projeto

**Ficha Lucrativa** é um SaaS WhatsApp-first que monta ficha técnica + precificação de pratos para pequenos negócios de food no Brasil. O bot se chama **Lucrô**.

**Público:** donos de lanchonete, pizzaria pequena, food truck, confeitaria, dark kitchen.
**Proposta em 1 frase:** *Decida o seu lucro em cada prato.*

## Princípios de engenharia

1. **Boring tech wins.** Reuso do stack do zapi-monitor (Node/Express/Claude/Z-API/Railway). Nada de novidade sem ROI claro em 4 semanas.
2. **Máquina de estados determinística > agente autônomo.** LLM é usado para NLU/NLG, não para decidir fluxo. Ver `apps/api/src/conversation/stateMachine.ts`.
3. **Confirmação obrigatória antes de finalizar.** Lucrô NUNCA fecha ficha sem o humano confirmar — a IA pode errar e o prejuízo é do cliente.
4. **Tool use > texto estruturado no prompt.** Toda extração de dado passa por function calling do Claude.
5. **Prompt caching sempre.** System + tools cacheados com `cache_control: ephemeral`. Meta: 70%+ cache hit.
6. **Custo rastreado por turno.** Cada `messages.cost_usd` é registrado. Dashboard interno alerta se >10% da mensalidade do usuário.

## Voz do Lucrô

- Contador amigo, não app animado
- Números primeiro
- Zero emoji gratuito
- Traduz jargão: "CMV" → "quanto custa fazer", "markup" → "quanto você ganha por cima"
- Confirma antes de concluir: "Entendi que seu X-Burger leva 120g de carne. Confere?"

## Estrutura

```
apps/api/src/
  webhooks/       # Z-API, Asaas (entrada)
  jobs/           # BullMQ handlers (worker)
  conversation/   # Máquina de estados, roteador (Haiku)
  llm/            # System prompts, tools, Claude client
  domain/         # Lógica pura: custo, preço, resolução de ingrediente
  integrations/   # Z-API (out), Whisper, Asaas, R2
apps/web/         # Next.js 14 App Router
packages/shared/  # Zod schemas trafegados entre api/web
docs/adr/         # Decisões arquiteturais
```

## Regras de código

- **TypeScript estrito** (`strict: true`, sem `any` não documentado)
- **Zod para validar tudo que entra** (webhooks, API pública, LLM tool inputs/outputs)
- **Sem `console.log`** — usar `src/lib/logger.ts` (pino)
- **Segredos só em `.env`**, carregados via `src/config/env.ts` com validação Zod
- **Preços sempre em BRL** com `NUMERIC(10,4)` no banco e `Decimal` em runtime (não float)
- **Telefones sempre em E.164** (`+5561999999999`) — usar `src/lib/phone.ts`

## Fluxo de desenvolvimento

1. Mudança no schema → `pnpm --filter api prisma migrate dev --name descricao_curta`
2. Feature nova relevante → adicionar ADR em `docs/adr/NNNN-titulo.md`
3. Golden set de extração em `apps/api/test/golden/` → rodar antes de deploy se mudou prompt

## Não fazer

- ❌ Adicionar features de POP ou Nutricional no MVP — decidido que são v2
- ❌ Construir abstração genérica "LLM provider agnóstico" — Claude first, abstrair se trocar
- ❌ Microserviços — monolito com worker separado é o suficiente pro MVP e escala pro primeiro ano
- ❌ Testes e2e complexos — priorizar unit nos domínios de custo/preço e golden set de extração
- ❌ Migrar pra outra stack sem ADR superseding explícito

## Quem decide o quê

- **Produto e escopo:** Luiz Curti (founder)
- **Arquitetura:** ADRs em `docs/adr/` — mudanças exigem ADR nova
- **Marca e voz:** `docs/brand.md` + system prompt do Lucrô (versionado)

## Deploy

Merge em `main` → CI roda typecheck + test → Railway (api+worker) e Vercel (web) deployam auto.

Feature flags via variável de ambiente (ex: `FEATURE_IMAGE_INPUT=true`).
