# ADR 0003 — Máquina de estados determinística + LLM só para NLU/NLG

**Status:** Accepted
**Date:** 2026-04-23

## Context

Uma ficha técnica tem campos obrigatórios bem definidos (nome do prato, rendimento, lista de ingredientes com quantidade e unidade, e — no estágio Custo/Preço — preço por ingrediente e preço de venda). A pergunta "o que pedir ao usuário a seguir?" tem resposta determinística dado o estado atual do prato.

Duas abordagens possíveis:
1. **LLM-agent:** Claude decide autonomamente o que perguntar, mantém histórico, orquestra tools.
2. **Híbrido:** lógica de fluxo em TypeScript; Claude entra só para (a) extrair dados da fala, (b) redigir perguntas naturais, (c) fallback conversacional quando o usuário diverge.

## Decision

**Abordagem híbrida.**

- `apps/api/src/conversation/stateMachine.ts` tem a lógica de "qual é o próximo campo faltante?"
- `apps/api/src/conversation/router.ts` usa Claude Haiku 4.5 para classificar o inbound em: `extract_ingredients | answer_question | confirm | cancel | smalltalk`.
- Com base na classificação + estado atual, orquestramos o Claude Sonnet com o prompt e tools certos.
- Claude Sonnet não decide "o que perguntar depois" — ele executa a tool `ask_user(question, expected_type)` que o servidor transforma em mensagem WhatsApp.

## Alternatives considered

| Alternativa | Por que rejeitada |
|---|---|
| Agent autônomo | Caro (muito token), imprevisível, difícil de debugar, risco de laço |
| Fluxo 100% hard-coded (sem LLM) | Quebra em inputs naturais (áudio longo com tudo de uma vez) e não extrai dados |
| State machine com XState | Over-engineering para MVP; TypeScript simples é suficiente |

## Consequences

**Positive:**
- Previsível e testável (unit test cobre `nextMissingField`)
- Custo controlado e previsível por ficha
- Fácil de debugar — log do estado + log da classificação + log do tool call
- LLM é usado onde agrega valor (compreender fala natural e redigir pergunta humana)

**Negative:**
- Se quisermos conversa muito mais livre ("me fala tudo do seu menu de uma vez"), precisa refatorar
- Adicionar novo estágio (ex: POP, Nutricional) exige código, não só mudar prompt

## Trade-offs

Ganhamos: previsibilidade, custo, testabilidade.
Abrimos mão: flexibilidade conversacional extrema — aceitável para o MVP porque o fluxo é naturalmente estruturado (ficha técnica tem schema).
