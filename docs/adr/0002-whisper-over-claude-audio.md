# ADR 0002 — Whisper API para transcrição em vez de Claude audio input

**Status:** Accepted
**Date:** 2026-04-23

## Context

Boa parte dos usuários alvo (donos de lanchonete, confeitaria, pizzaria) vai mandar ingredientes e quantidades por áudio no WhatsApp — é o canal natural deles (mãos ocupadas, dirigindo, etc.). Precisamos transcrição de alta qualidade em português brasileiro.

## Decision

Usar **OpenAI Whisper API (`whisper-1`)** para transcrever o áudio. O texto resultante é então enviado para Claude processar (extração estruturada via tool use, resposta conversacional).

## Alternatives considered

| Alternativa | Por que rejeitada |
|---|---|
| Claude audio input nativo | ~10× mais caro por minuto, sem ganho de qualidade perceptível em PT-BR |
| Google Speech-to-Text | Qualidade boa, mas integração/billing mais chatos; custo similar ao Whisper |
| Azure Speech | Idem Google |
| Whisper local (whisper.cpp) | Inviável em container Railway sem GPU; overhead de manutenção |
| AssemblyAI | Boa qualidade, custo maior que Whisper |

## Consequences

**Positive:**
- Custo estimado de ~R$ 0,03 por ficha (30-60s de áudio)
- WER <5% em PT-BR em condições normais
- API simples e estável

**Negative:**
- Dependência de provider não-Anthropic (OpenAI) — único ponto de exceção na stack
- Se OpenAI mudar preço ou qualidade, precisamos trocar

## Trade-offs

Ganhamos: custo baixo e qualidade alta para o canal principal.
Mitigação: `apps/api/src/integrations/whisper.ts` é uma fachada fina — trocar por Google/Deepgram/AssemblyAI é questão de implementar a mesma interface.
