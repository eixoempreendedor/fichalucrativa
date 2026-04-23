# ADR 0004 — Asaas como gateway de pagamento

**Status:** Accepted
**Date:** 2026-04-23

## Context

Público-alvo é pequeno food business brasileiro. Pagamento recorrente precisa cobrir PIX, boleto e cartão — PIX é crítico para conversão em público popular. Cartão recorrente é necessário para baixo churn involuntário.

## Decision

Usar **Asaas** como gateway único de cobrança recorrente.

## Alternatives considered

| Alternativa | Por que rejeitada |
|---|---|
| Stripe BR | Recorrência PIX é limitada/ruim; meio imaturo no mercado brasileiro |
| Pagar.me | Viável mas DX e docs do Asaas são melhores para SaaS small |
| Mercado Pago | Orientado a marketplace, não a recorrência SaaS |
| Juno | Similar ao Asaas, ecossistema menor |

## Consequences

**Positive:**
- Cobertura completa BR (PIX + boleto + cartão recorrente)
- Webhook nativo com eventos úteis (`PAYMENT_CONFIRMED`, `PAYMENT_OVERDUE`, `SUBSCRIPTION_CANCELED`)
- Fee competitivo (~1.99% cartão, R$ 1-2 boleto)
- API em PT-BR, documentação decente

**Negative:**
- **Quase-irreversível:** migrar assinantes de gateway é doloroso (precisa re-autorização)
- Se Asaas tiver outage, cobranças ficam presas

## Trade-offs

Ganhamos: cobertura de meios, taxa baixa, implementação rápida.
Mitigação para o risco de lock-in: manter `apps/api/src/integrations/asaas.ts` fino e focado em operações essenciais. Se precisar migrar, novas assinaturas vão pro novo gateway e as antigas terminam seu ciclo no Asaas.
