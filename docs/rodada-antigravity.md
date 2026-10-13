# Rodada Antigravity · Oferta e Checkout

Registro das atividades dos três papéis em sequência: Planejador, Executor e Revisor.

---

# 1. Agente 1 · Planejador

## 1.1 Contexto e Fontes de Verdade Analisadas
- `AGENTS.md`: regras de isolamento estrito contra o funil GMN (Notake); prefixo `NR`; proibição de versionar segredos. Adicionar Antigravity à lista de agentes.
- `ESPECIFICACAO.md`: especificação técnica e de produto. Necessário atualizar seções 3 (variáveis de vendas e preço/dia), 4 (fluxo e etapa 65 `pagamento`), 5 (textos das Telas 10, 11 e 12), 7 (evento `ViuPagamento`), 9 (coluna `viu_pagamento_em`), 10 (recuperação `viu_oferta` para etapas 60, 65 e 70).
- `CHANGELOG.md`: histórico do projeto e estado atual após as rodadas do Codex.
- `RECURSOS.md`: catálogo de recursos externos `NR`.
- `PROMPT-ANTIGRAVITY.md`: requisitos da rodada atual e critérios de aceite.

## 1.2 Mapeamento de Tarefas para Componentes e Arquivos
1. **Aviso de Rodapé (Tarefa 4.1):**
   - Arquivos: `src/components/quiz.tsx`, `src/app/globals.css`.
   - Ação: Remover componente `LegalNotice` e todas as chamadas. Remover estilos associados.
2. **Velocidade entre Perguntas (Tarefa 4.2):**
   - Arquivos: `src/components/quiz.tsx`.
   - Ação: Adicionar guarda síncrona contra duplo clique (`if (selected !== undefined || busy) return`). Manter feedback visual imediato no card tocado (`selected`). Reduzir tempo de transição para ~150 ms (meta total <= 200 ms). Disparar eventos de telemetria/n8n/Pixel/CAPI em segundo plano via `fetch` com `keepalive` sem bloquear a transição de tela.
3. **Tela 10 · Diagnóstico (Tarefa 4.3):**
   - Arquivos: `src/components/quiz.tsx`, `src/app/globals.css`.
   - Ação: Ajustar espaçamento entre o último parágrafo e o botão para >= 32 px. Unificar o texto do botão para `QUERO O CURSO MÁQUINA DE VENDAS` em todos os cenários.
4. **Tela 11 · Curso sem Preço (Tarefa 4.4):**
   - Arquivos: `src/config/diagnostico-modulos.ts` (novo), `src/components/quiz.tsx`, `src/components/carousel.tsx`, `src/app/globals.css`.
   - Ação: Remover preço, 'por dia', à vista, cadeado, CTA fixo, garantia e FAQ. Novo título com destaque amarelo em "pontos do seu diagnóstico". Renderizar blocos por ponto marcado com miniatura 48x72 px da capa Kiwify, selo amarelo, ponto em negrito e texto de como aprender. Caso "sim em tudo" com 3 módulos específicos. Repetir botão após o bloco 2 e no final da tela (`QUERO O CURSO MÁQUINA DE VENDAS` -> navega para Tela 12). Carrossel de 10 módulos com capas Kiwify 2:3 sem selo/título sobreposto; largura ~62% no mobile e 3 cards no desktop. Deletar `public/imagens/modulos/`.
5. **Tela 12 · Pagamento (Tarefa 4.5 e 4.7):**
   - Arquivos: `src/components/quiz.tsx`, `src/app/globals.css`, `src/app/api/social-proof/route.ts` (novo), `.env.example`, `.env.local`.
   - Ação: Criar estado de tela `pagamento` (etapa 65). Topo com logo pequeno, rótulo "ÚLTIMO PASSO", título "Seu acesso ao Máquina de Vendas 2.0". Contador "🔥 177 pessoas já compraram o Máquina de Vendas" (sem incrementos artificiais). Subtítulo "Tudo isso fica por menos de R$ 2 por dia." com `NEXT_PUBLIC_PRECO_DIA_TEXTO`. Card de oferta com preço "12x de R$ 30,72" em linha única (clamp e nowrap), "ou R$ 297 à vista", botão `QUERO PAGAR AGORA`, cadeado e texto de acesso imediato. Prova social discreta aos 3s (duração 6s) com "Marcos C. entrou no Máquina de Vendas". Disparo de `ViuPagamento` ao abrir Tela 12 e `CliqueCheckout` com repasse de UTMs ao clicar no botão.
6. **Etapas, Planilha e Recuperação (Tarefa 4.6):**
   - Arquivos: `src/components/quiz.tsx`, `ESPECIFICACAO.md`.
   - Ação: Registrar etapa 65 `pagamento`, registrar `viu_pagamento_em`, atualizar tabela de etapas e regras de recuperação.

## 1.3 Mapeamento de Riscos e Mitigações
- **Risco: Eventos duplicados no Pixel/CAPI.**
  *Mitigação:* Usar `event_id` único via `crypto.randomUUID()` em paridade Pixel + CAPI. Controlar disparo de `ViuPagamento` para ocorrer exatamente uma vez por visita à tela de pagamento usando ref/flag.
- **Risco: Regressão de `etapa_max` na planilha.**
  *Mitigação:* A etapa 65 fica estritamente ordenada entre 60 (oferta) e 70 (clique checkout). O workflow n8n já protege monotonicidade de `etapa_max`.
- **Risco: Quebra de layout do preço no mobile (375 px).**
  *Mitigação:* Usar container flex nowrap e `font-size: clamp(...)` garantindo que "12x de" e "R$ 30,72" fiquem na mesma linha sem rolagem lateral ou quebra.
- **Risco: Perda de parâmetros UTM ou rastreadores no checkout.**
  *Mitigação:* Manter captura e propagação integral de `utm_*`, `src`, `sck`, `fbclid` e `gclid` no clique do botão de checkout.

## 1.4 Plano de Execução Numerado
1. **Passo 1 (Remoção do rodapé):** Remover componente `LegalNotice` e limpar CSS. *Critério de aceite: Critério 1.*
2. **Passo 2 (Velocidade e feedback entre perguntas):** Implementar avanço rápido (~150 ms), bloqueio de duplo clique e envio assíncrono em background com `keepalive`. *Critério de aceite: Critério 2.*
3. **Passo 3 (Ajustes da Tela 10 - Diagnóstico):** Ajustar espaçamento do parágrafo final para >= 32 px e texto do botão para "QUERO O CURSO MÁQUINA DE VENDAS". *Critério de aceite: Critério 3.*
4. **Passo 4 (Tela 11 - Apresentação do curso sem preço):** Criar `src/config/diagnostico-modulos.ts`, atualizar cards de pontos, miniaturas 48x72 px, novo carrossel de 10 módulos com proporção 2:3 sem sobreposição, remover preço/garantia/FAQ, remover `public/imagens/modulos/`. *Critério de aceite: Critério 4.*
5. **Passo 5 (Tela 12 - Pagamento, Prova Social e Rastreio):** Criar Tela 12, rota `/api/social-proof`, contador de alunos estático e toast discreto de comprador, evento `ViuPagamento` e etapa 65, card de preço em linha única para 375 px, botão `QUERO PAGAR AGORA` com repasse de UTMs. *Critérios de aceite: Critérios 5, 6, 7, 8.*
6. **Passo 6 (Documentação e Registro):** Atualizar `ESPECIFICACAO.md`, `CHANGELOG.md`, `AGENTS.md` e `.env.example`. *Critério de aceite: Critério 10.*
7. **Passo 7 (Revisão e Validação):** Agente 3 valida lint, typecheck, build, rotas em 375 px e 1280 px, tempos de resposta e critérios de aceite. Merge para `main` e publicação na Vercel. *Critério de aceite: Critério 9.*

---

# 2. Agente 2 · Executor

Branch de trabalho: `ajustes-oferta-checkout`

### Passo 1: Remoção do aviso de rodapé
- **Arquivos modificados:** `src/components/quiz.tsx`, `src/app/globals.css`.
- **Descrição:** Removido o componente `LegalNotice` e todas as suas invocações. Removidas as regras CSS de `.legal-notice`. Nenhuma tela exibe o texto sobre resultados financeiros.
- **Commit:** `f0c39fd refactor: remove aviso de rodapé de todas as telas`
- **Critério associado:** Critério 1 cumprido.

### Passo 2: Velocidade e feedback imediato entre perguntas
- **Arquivos modificados:** `src/components/quiz.tsx`, `src/app/globals.css`.
- **Descrição:**
  - Adicionado indicador visual imediato no card tocado via pseudo-elemento `:after` com borda e preenchimento amarelos no mesmo frame com transição ultra-rápida (0.08s).
  - Reduzido o tempo de avanço para 150 ms (dentro da meta de até 200 ms).
  - Adicionada guarda síncrona contra duplo clique (`if (selected !== undefined || busy) return`) impedindo múltiplos registros ou pulos acidentais de tela.
  - Criada função `sendBackground` com `keepalive: true` e política de retentativa para gravação de eventos e disparo do Meta Pixel/CAPI sem bloquear a navegação da UI.
- **Commit:** `2639e45 perf: acelera avanço entre perguntas e adiciona feedback visual imediato`
- **Critério associado:** Critério 2 cumprido.

### Passo 3: Ajustes da Tela 10 (Diagnóstico)
- **Arquivos modificados:** `src/components/quiz.tsx`.
- **Descrição:**
  - Espaçamento entre o último parágrafo e o botão principal ajustado para no mínimo 32 px (`marginTop: 32`).
  - Texto do botão unificado para `QUERO O CURSO MÁQUINA DE VENDAS` tanto para o caso com pontos a estudar quanto para o caso "Sim" em todas as perguntas.
- **Commit:** `7d04b06 style: ajusta espaçamento e texto do botão na Tela 10`
- **Critério associado:** Critério 3 cumprido.

### Passo 4: Tela 11 - Apresentação do curso sem preço
- **Arquivos criados/modificados:**
  - `src/config/diagnostico-modulos.ts` (criado com todo o mapeamento e textos)
  - `src/components/carousel.tsx` (atualizado para exibir capas originais Kiwify 2:3 sem selos/títulos sobrepostos)
  - `src/components/quiz.tsx` (reestruturada a tela de oferta, blocos dinâmicos por ponto do diagnóstico com miniaturas 48×72 px, novo título com destaque amarelo, botão repetido intermediário e final, remoção de preço, garantia, FAQ e sticky CTA)
  - `src/app/globals.css` (estilos para `.diagnostic-topic-card`, `.diagnostic-topic-thumb`, `.module-card` a 62% no mobile e 3 cards no desktop)
  - `public/imagens/modulos-kiwify/*` (instaladas 10 capas originais da Kiwify)
  - `public/imagens/modulos/*` (apagada pasta antiga em desuso)
- **Commit:** `20aec48 feat: reformula tela do curso sem preço com novas capas e blocos do diagnóstico`
- **Critério associado:** Critério 4 cumprido.

### Passo 5: Tela 12 - Pagamento, Prova Social e Rastreio
- **Arquivos criados/modificados:**
  - `src/app/api/social-proof/route.ts` (criada rota com cache de 60 s e fallback estrito aos valores base reais)
  - `src/components/quiz.tsx` (adicionada Tela 12 com etapa 65 `pagamento`, evento `ViuPagamento` com deduplicação por ref, contador estático de 177 alunos, frase de menos de R$ 2 por dia, card de preço com valor 12x de R$ 30,72 em linha única em 375 px, botão `QUERO PAGAR AGORA`, prova social discreta do comprador Marcos C. após 3s com duração de 6s, botão de voltar retornando para oferta)
  - `src/app/globals.css` (estilos para `.payment-screen`, `.price-single-line`, `.buyer-toast`)
  - `.env.local` e `.env.example` (configuradas variáveis `NEXT_PUBLIC_PRECO_DIA_TEXTO=2`, `VENDAS_BASE=177`, `VENDAS_BASE_DATA=2026-10-13`, `ULTIMO_COMPRADOR_BASE=Marcos C.`)
- **Commit:** `3d8f088 feat: adiciona Tela 12 de pagamento com etapa 65, rastreio e prova social estrita`
- **Critérios associados:** Critérios 5, 6, 7 e 8 cumpridos.

---
