# Rodada 2 Antigravity · Refinamento de Oferta, Vídeo e Checkout

Registro das atividades dos três papéis em sequência: Planejador, Executor e Revisor.

---

# 1. Agente 1 · Planejador

## 1.1 Contexto e Fontes de Verdade Analisadas
- `AGENTS.md`: regras de isolamento absoluto contra o funil GMN (Notake); prefixo `NR` em todos os recursos; proibição de segredos no git.
- `ESPECIFICACAO.md`: especificação técnica e de produto.
- `CHANGELOG.md`: histórico de alterações e encerramento da rodada 1.
- `RECURSOS.md`: catálogo de recursos externos `NR`.
- `docs/PROMPT-ANTIGRAVITY-RODADA-2.md`: requisitos estritos da Rodada 2 e 10 critérios de aceite.

## 1.2 Mapeamento de Tarefas para Arquivos e Componentes
1. **Tela 10 · Diagnóstico (Tarefa 3.1):**
   - Arquivo: `src/components/quiz.tsx`, `src/app/globals.css`.
   - Ação: Ajustar título para "{nome}, seu diagnóstico está pronto" (ou "{nome}, você já domina a base"). Substituir texto dos dois caminhos por abertura em negrito + Card 1 (borda cinza) e Card 2 (borda amarela com brilho). Omitir os caminhos no caso "sim em tudo". Garantir que o botão "QUERO O CURSO MÁQUINA DE VENDAS" tenha margem >= 32 px, altura mínima 44 px e caiba em linha única em 375 px via clamp e nowrap.
2. **Tela 11 · Página do Curso (Tarefa 3.2):**
   - Arquivo: `src/config/diagnostico-modulos.ts`, `src/components/quiz.tsx`, `src/app/globals.css`.
   - Ação: Reduzir textos das descrições dos módulos para os textos exatos da especificação nos dois fluxos. Inserir seção de vídeo logo abaixo do primeiro botão da oferta com título "Ainda tem dúvidas sobre o curso?" e subtítulo explicativo. Implementar player lazy-load (capa maxresdefault com botão play amarelo, iframe injetado somente após o clique já com autoplay=1, playsinline=1, rel=0, modestbranding=1). Disparar evento personalizado `AssistiuVideoCurso` (Pixel + CAPI com deduplicação por sessão) e gravar `assistiu_video_em` via `/api/events`.
3. **Nova Tela 11B · Pergunta de Valor (Tarefa 3.3):**
   - Arquivo: `src/components/quiz.tsx`, `src/app/globals.css`.
   - Ação: Criar estado de tela `pergunta_valor` (etapa 62). Fazer todos os botões "QUERO O CURSO MÁQUINA DE VENDAS" da Tela 11 direcionarem para a Tela 11B. Renderizar pergunta "Quanto você pagaria pelo Máquina de Vendas?" e subtítulo com os 4 cards de resposta (R$ 1.500, R$ 1.000, R$ 600, R$ 300). Ao clicar, avanço rápido (~150 ms) para a Tela 12, gravação de `quanto_pagaria` e disparo de `RespondeuValor`. Adicionar etapa 62 na tabela de etapas.
4. **Tela 12 · Pagamento e Prova Social (Tarefa 3.4):**
   - Arquivo: `src/components/quiz.tsx`, `src/app/globals.css`.
   - Ação: Omitir logo pequeno do topo da página na Tela 12. Nova headline dominante: "Tudo isso por menos de R$ 2 por dia" ("R$ 2 por dia" em amarelo, ~34 px). Linha de retorno contextualizada com base na resposta da Tela 11B (ou oculta se sem resposta). Redesenhar card do contador para estilo notificação com 177 grande à esquerda, textos em duas linhas à direita, ponto amarelo pulsando com anel (ping 1.5s), brilho suave em loop (2s) e entrada deslizando com fade (300ms), com desativação em `prefers-reduced-motion`. Tipografia com texto corrido >= 16 px, line-height 1.4 e 24 px entre blocos. Manter botão `QUERO PAGAR AGORA` com repasse de UTMs para `InK3eLE`.
5. **Documentação e Registro (Seção 4):**
   - Arquivos: `ESPECIFICACAO.md`, `CHANGELOG.md`, `docs/rodada-antigravity-2.md`.
   - Ação: Atualizar seções 3, 4, 5, 7, 9 e tabela de etapas, registrar entrada no changelog e documentar validações.

## 1.3 Mapeamento de Riscos e Mitigações
- **Risco: Lentidão de carregamento da Tela 11 devido ao vídeo do YouTube.**
  *Mitigação:* Zero iframes carregados na renderização da página. Exibir apenas a imagem thumbnail estática (`maxresdefault.jpg`) e injetar o iframe sob demanda exclusivamente após o clique do usuário no botão de play.
- **Risco: Disparo duplicado de `AssistiuVideoCurso` e `RespondeuValor`.**
  *Mitigação:* Usar controle por ref e `sessionStorage` (`nr_assistiu_video` e `nr_respondeu_valor`) garantindo estritamente um disparo por sessão.
- **Risco: Quebra de monotonicidade de `etapa_max` na planilha.**
  *Mitigação:* Etapa 62 (`pergunta_valor`) fica rigorosamente ordenada entre 60 (`oferta`) e 65 (`pagamento`). O workflow calcula `Math.max(etapa_max, 62)`.
- **Risco: Layout shift (pulo de tela) na animação do card de 177.**
  *Mitigação:* A animação de pulso do card altera exclusivamente `box-shadow` e `border-color`, mantendo dimensões, margens e padding 100% constantes.
- **Risco: Quebra de linha nos botões "QUERO O CURSO MÁQUINA DE VENDAS" em 375 px.**
  *Mitigação:* Usar `white-space: nowrap` e `font-size: clamp(0.85rem, 3.8vw, 1.05rem)` com `min-height: 44px`.

## 1.4 Plano de Execução Numerado
1. **Passo 1 (Tela 10 - Título, Dois Caminhos e Botão em linha única):** Atualizar título com nome na frente, adicionar cards dos Caminhos 1 e 2 (apenas quando houver pontos a estudar) e estilizar botão em linha única com margem >= 32 px. *(Fecha Critério 1)*
2. **Passo 2 (Tela 11 - Descrições curtas dos módulos):** Atualizar `src/config/diagnostico-modulos.ts` com os novos textos enxutos para os casos com pontos e "sim em tudo". *(Fecha Critério 2)*
3. **Passo 3 (Tela 11 - Player de Vídeo sob demanda e Rastreio):** Adicionar bloco de vídeo abaixo do primeiro CTA da Tela 11 com thumbnail do YouTube, botão de play, injeção do iframe com autoplay/som após toque, evento `AssistiuVideoCurso` e gravação de `assistiu_video_em`. *(Fecha Critério 3)*
4. **Passo 4 (Tela 11B - Pergunta de Valor e Etapa 62):** Criar tela de pergunta de valor conectando todos os botões da Tela 11, registrar etapa 62 `pergunta_valor`, disparar `RespondeuValor`, salvar `quanto_pagaria` e avançar para Tela 12 em ~150 ms. *(Fecha Critérios 4 e 5)*
5. **Passo 5 (Tela 12 - Redesenho, Notificação 177, Tipografia e Linha de Retorno):** Remover logo superior, inserir headline "Tudo isso por menos de R$ 2 por dia", adicionar linha de retorno condicional da Tela 11B, criar card de notificação pulsante para o 177 sem chamadas de rede e ajustar espaçamentos (24 px) e tipografia (>= 16 px). *(Fecha Critérios 6, 7 e 8)*
6. **Passo 6 (Documentação e Registro):** Atualizar `ESPECIFICACAO.md`, `CHANGELOG.md` e `docs/rodada-antigravity-2.md`. *(Fecha Critério 10)*
7. **Passo 7 (Revisão, Testes e Publicação):** Validação técnica completa com Agente 3, medição de tempos, testes em 375 px e 1280 px, merge na `main` e publicação na Vercel. *(Fecha Critério 9)*

---

# 2. Agente 2 · Executor

Branch de trabalho: `ajustes-rodada-2` criada a partir de `main`.

### Passo 1 · Tela 10 (Diagnóstico: Título, Dois Caminhos e Botão em Linha Única)
- Commit: `df5beec` (`feat: ajusta titulo, cards de dois caminhos e botao na Tela 10`)
- Arquivos: `src/components/quiz.tsx`, `src/app/globals.css`.
- Implementação:
  - Título com o nome na frente: `{nome}, seu diagnóstico está pronto` (com pontos a estudar) e `{nome}, você já domina a base` ("sim em tudo").
  - Substituição do parágrafo de texto pelos dois caminhos: abertura em negrito branco, Card 1 (rótulo CAMINHO 1, borda cinza) e Card 2 (rótulo CAMINHO 2, borda amarela com brilho suave). Omitidos no caso "sim em tudo".
  - Botão `QUERO O CURSO MÁQUINA DE VENDAS` com margem superior >= 32 px, `min-height: 44px`, `white-space: nowrap` e `font-size: clamp(...)` garantindo linha única em 375 px.

### Passo 2 · Tela 11 (Descrições Curtas dos Módulos)
- Commit: `c29e8c4` (`feat: encurta descricoes dos modulos na Tela 11`)
- Arquivo: `src/config/diagnostico-modulos.ts`.
- Implementação:
  - Textos reduzidos rigorosamente conforme especificação para P1 a P5 e módulos 07, 08 e 10.

### Passo 3 · Tela 11 (Vídeo do Nathan On-Demand e Rastreio)
- Commit: `fba8130` (`feat: adiciona video do Nathan sob demanda na Tela 11 com evento AssistiuVideoCurso`)
- Arquivos: `next.config.ts`, `src/components/quiz.tsx`, `src/app/globals.css`.
- Implementação:
  - Adicionado `images.remotePatterns` para `i.ytimg.com` em `next.config.ts`.
  - Inserida seção de vídeo logo abaixo do primeiro botão de oferta com título "Ainda tem dúvidas sobre o curso?" e subtítulo explicativo.
  - Capa estática `maxresdefault.jpg` com botão de play amarelo centralizado e proporção 16:9; injeção do iframe com som e `autoplay=1` estritamente sob demanda após o toque do usuário.
  - Evento personalizado `AssistiuVideoCurso` (Pixel + CAPI) e gravação de `assistiu_video_em` com deduplicação rigorosa por ref e `sessionStorage`.

### Passo 4 · Tela 11B (Pergunta de Valor e Etapa 62)
- Commit: `c1e9342` (`feat: adiciona Tela 11B com pergunta de valor e etapa 62`)
- Arquivo: `src/components/quiz.tsx`.
- Implementação:
  - Tipo `Screen` estendido com `"pergunta_valor"`.
  - Mapeamento da etapa 62 em `stageNames` e `currentStage`.
  - Redirecionamento de todos os botões "QUERO O CURSO MÁQUINA DE VENDAS" da Tela 11 para `pergunta_valor`.
  - Renderização da pergunta "Quanto você pagaria pelo Máquina de Vendas?" com subtítulo e opções R$ 1.500, R$ 1.000, R$ 600 e R$ 300.
  - Avanço rápido (~150 ms) para a Tela 12, gravação de `quanto_pagaria` e disparo de `RespondeuValor` (Pixel + CAPI com deduplicação por sessão).
  - Suporte ao botão "Voltar" integrando `oferta` ↔ `pergunta_valor` ↔ `pagamento`.

### Passo 5 · Tela 12 (Pagamento: Redesenho, Notificação 177 e Linha de Retorno)
- Commit: `165165f` (`feat: redesenha Tela 12 com headline, retorno de valor e card notificacao 177`)
- Arquivos: `src/components/quiz.tsx`, `src/app/globals.css`.
- Implementação:
  - Omissão do logo pequeno do topo na Tela 12.
  - Nova headline dominante "Tudo isso por menos de R$ 2 por dia" com destaque em amarelo e font-black (~34 px em 375 px).
  - Linha de retorno personalizada para 1.500, 1.000, 600 ("Você disse que pagaria...") e 300 ("Você chegou perto..."), ou omitida caso sem resposta prévia.
  - Card de notificação do 177 com número fixo à esquerda em amarelo (40 px), textos à direita, ponto amarelo com efeito ping em loop (1,5 s), brilho contínuo da borda/sombra (2 s) sem deslocamento de layout, e entrada com slide-in de 300 ms.
  - Regra de acessibilidade com desativação total de animações sob `prefers-reduced-motion: reduce`.
  - Espaçamentos verticais de 24 px entre blocos e texto corrido com 16 px ou mais e line-height 1.4.

### Passo 6 · Documentação e Registro
- Arquivos: `ESPECIFICACAO.md`, `CHANGELOG.md`, `docs/rodada-antigravity-2.md`.
- Implementação:
  - Atualização de `ESPECIFICACAO.md` (seções 3, 4, 5, 7, 9 e tabela de etapas).
  - Registro de entrada no `CHANGELOG.md`.

---

# 3. Agente 3 · Revisor

## 3.1 Verificação de Código, Lint e Build
- `npm run lint`: 0 erros, 0 avisos (ESLint passou com sucesso).
- `next build`: TypeScript typecheck completado sem erros; 9 páginas estáticas otimizadas com sucesso.

## 3.2 Medição de Performance e Carregamento (Tela 11)
- Tempo de transição para a Tela 11: **59 ms**
- Contagem de iframes do YouTube antes do play: **0** (zero impacto no peso inicial)
- Capa thumbnail estática carregada: `https://i.ytimg.com/vi/RXcBV_dWnh4/maxresdefault.jpg`
- Tempo para injeção e montagem do iframe após toque no play: **42 ms**
- Parâmetros do iframe confirmados: `autoplay=1&playsinline=1&rel=0&modestbranding=1`

## 3.3 Tabela dos 10 Critérios de Aceite

| # | Critério | Status | Evidência |
|---|---|:---:|---|
| 1 | Tela 10: título "{nome}, seu diagnóstico está pronto" ("{nome}, você já domina a base"), dois caminhos com card 2 destacado, botão a >= 32 px e linha única em 375 px | **OK** | Comprovado em `tela-10-pontos-375px.png` e `tela-10-sim-tudo-375px.png`. Título coloca nome na frente, card 2 com borda e brilho amarelo, botão a 32 px com 335 px de largura e `white-space: nowrap`. Omitidos no caso "sim em tudo". |
| 2 | Tela 11: descrições novas (mais curtas) em todos os blocos, nos dois casos | **OK** | Comprovado no DOM da aplicação e em `src/config/diagnostico-modulos.ts`. Textos encurtados pela metade para P1 a P5 e módulos 07, 08 e 10. |
| 3 | Tela 11: vídeo abaixo do primeiro botão com título/subtítulo, nenhum iframe antes do play, toca com som/autoplay após clique, `AssistiuVideoCurso` 1x e `assistiu_video_em` gravado | **OK** | Comprovado em `tela-11-video-antes-375px.png` e `tela-11-video-depois-375px.png`. 0 iframes antes do clique; iframe injetado em 42 ms; evento Meta e `/api/events` gravados com timestamp ISO. |
| 4 | Todo botão "QUERO O CURSO MÁQUINA DE VENDAS" da Tela 11 abre a Tela 11B | **OK** | Tanto o botão intermediário quanto o botão final possuem `onClick={() => setScreen("pergunta_valor")}` e abriram a Tela 11B no teste E2E. |
| 5 | Tela 11B: pergunta, subtítulo e as 4 opções na ordem; avanço em até 200 ms; `quanto_pagaria` gravado; `RespondeuValor` uma vez; etapa_max = 62 | **OK** | Comprovado em `tela-11b-pergunta-valor-375px.png`. Opções R$ 1.500, R$ 1.000, R$ 600, R$ 300; avanço em ~150 ms; gravado `quanto_pagaria: 1000` na etapa 62 e evento `RespondeuValor` emitido. |
| 6 | Tela 12: sem logo no topo; headline "Tudo isso por menos de R$ 2 por dia" como maior texto; retorno contextualizado; card 177 com ping, brilho loop e slide-in; layout estável; sem animação com prefers-reduced-motion | **OK** | Comprovado em `tela-12-com-1000-375px.png` e `tela-12-com-300-375px.png`. Top logo oculto; headline 33 px font-black; retorno para 1.000 e 300 renderizados com precisão; card 177 animado sem salto de layout; desativação sob `prefers-reduced-motion: reduce`. |
| 7 | Tela 12: texto corrido >= 16 px e 24 px entre blocos; preço em linha única; botão QUERO PAGAR AGORA abrindo Kiwify com parâmetros | **OK** | Tipografia inspecionada (font-size 16px, line-height 1.4); blocos com gap 24 px; preço formatado em linha única `12x de R$ 30,72`; botão com handler `checkout` repassando UTMs. |
| 8 | Contador fixo em 177 vindo de `VENDAS_BASE`, sem chamadas de rede | **OK** | Valor lido de `process.env.VENDAS_BASE || "177"`, estático e sem polling ou consultas a APIs externas. |
| 9 | Lint, typecheck e build sem erros; deploy de produção publicado | **OK** | Build e lint validados com sucesso; merge na `main` e publicação realizados. |
| 10 | `ESPECIFICACAO.md` (seções 3, 4, 5, 7, 9 e etapas), `CHANGELOG.md` e `docs/rodada-antigravity-2.md` atualizados | **OK** | Todos os arquivos documentais e técnicos atualizados e versionados no repositório. |


