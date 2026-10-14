# Rodada Antigravity · Prints Reais no Quiz (Capa e Perguntas)

Registro das atividades dos três papéis em sequência: Planejador, Executor e Revisor.

---

# 1. Agente 1 · Planejador

## 1.1 Contexto e Fontes de Verdade Analisadas
- `AGENTS.md`: regras de isolamento absoluto contra o funil GMN (Notake); prefixo `NR` em todos os recursos; proibição de segredos no git.
- `ESPECIFICACAO.md`: especificações das telas 1 a 9, 10, 11, 11B, 12 e diretrizes de design.
- `CHANGELOG.md`: histórico de alterações e último bloco (ajuste de headline Tela 12).
- `docs/PROMPT-ANTIGRAVITY-PRINTS.md`: requisitos estritos para inserção de prints reais (Capa e P1 a P5), mapeamento, regras de exibição e critérios de aceite.

## 1.2 Mapeamento de Prints e Requisitos

| Tela | Arquivo | Legenda (chip) | Destaque Legenda | Alt da Imagem | Posição Objeto |
|---|---|---|---|---|---|
| Tela 1 · Capa | `capa-480k-faturamento-30-dias.webp` | Painel real: R$ 480 mil em 30 dias | "R$ 480 mil" (amarelo) | Painel de vendas com faturamento de R$ 480 mil em 30 dias | center |
| P1 · Produto | `p1-produto-campeao-chocadeira.webp` | Produto validado: 1.194 avaliações | - | Produto validado com 1.194 avaliações no Mercado Livre | center |
| P2 · Fornecedores | `p2-fornecedores-nacionais.webp` | 13 fornecedores nacionais para um único produto | - | Lista de 13 fornecedores nacionais para um único produto | top |
| P3 · Margem | `p3-painel-lucro-margem.webp` | Lucro e margem acompanhados em cada venda | - | Painel com lucro e margem acompanhados em cada venda | center |
| P4 · Anúncio | `p4-campanhas-roas-receita.webp` | Anúncios com retorno acima de 16x | - | Campanhas de anúncios com retorno acima de 16x no Mercado Livre | center |
| P5 · Investimento e giro | `p5-roas-retorno-investimento.webp` | ROAS de 1.055x em uma campanha | - | Campanha com ROAS de 1.055x de retorno sobre investimento | center |

- **Configuração isolada:** Mapeamento mantido em `src/config/prints-quiz.ts` com tipagem estrita para ser editado sem alterar componentes.
- **Tela 1 (Capa):**
  - Posicionamento entre o subtítulo (`p.muted`) e o botão (`btn-primary`).
  - Card com cantos de 16 px, borda amarela fina (`border: 1px solid rgba(255, 212, 0, 0.45)`), brilho amarelo suave (`box-shadow: 0 8px 30px rgba(255, 212, 0, 0.15)`), leve inclinação (`rotate: -2deg`), largura sem corte lateral em 375 px.
  - Altura máxima de 190 px em 375 px (`object-fit: cover`, `object-position: center`).
  - Chip da legenda no canto inferior esquerdo: fundo `#0A0F1C` com 85% de opacidade, texto branco 12 px, "R$ 480 mil" em amarelo (`#FFD400`).
  - Prioridade de carregamento: `priority` no `next/image` (`width={800}`, `height={500}`).
  - Viewport 375×667: o botão precisa continuar 100% visível sem rolagem.
- **Tela 2 (Cadastro):**
  - Sem print; formulário permanece idêntico ao atual.
- **Telas 5 a 9 (Perguntas P1 a P5):**
  - Imagem posicionada imediatamente acima do título da pergunta (`<h2>`).
  - Altura base de 140 px em 375 px (`object-fit: cover`), cantos arredondados de 14 px, borda `var(--border)`, chip de legenda no canto inferior esquerdo.
  - P2 (fornecedores): `object-position: top` para exibir o título da busca.
  - Viewport 375×667: todas as 3 respostas (`Sim, sei fazer`, `Mais ou menos`, `Não sei`) visíveis sem rolar.
  - Pré-carregamento: ao renderizar a pergunta `i`, pré-carregar em background a imagem da pergunta `i+1` (e pré-carregar P1 durante o cadastro/introdução).
  - Animação de entrada: fade + 8 px de subida (200 ms) junto com a pergunta.
  - Acessibilidade: sob `prefers-reduced-motion: reduce`, desativar inclinação e animações de entrada.

## 1.3 Mapeamento de Riscos e Mitigações
1. **Risco: Rolagem vertical em tela pequena (375×667) na Capa e nas Perguntas.**
   - *Mitigação:*
     - Na Capa: ajustar padding e proporções do logo/título em telas com altura restrita (`max-height: 700px`) de forma fluida, limitando a altura do print em ~150-160 px (dentro do limite máximo de 190 px) para que o botão fique com folga visível sem nenhuma rolagem.
     - Nas Perguntas: ajustar margens entre logo, botão voltar, barra de progresso, print (120-135 px em viewports compactos), título e cards de resposta para que o conteúdo total permaneça abaixo de 620 px em 375×667, deixando os 3 cards 100% no viewport sem barra de rolagem.
2. **Risco: Aumento do tempo de transição entre perguntas (> 200 ms).**
   - *Mitigação:*
     - A transição do React dura 150 ms (feedback do clique).
     - As imagens reais são arquivos WebP estáticos (~20-100 KB).
     - Com o pré-carregamento programático da próxima imagem (`new window.Image().src = ...`) enquanto o lead lê a pergunta atual, o asset já estará no cache do navegador no momento da troca, eliminando latência de rede.
3. **Risco: Quebra de layout no card inclinado da Capa (-2deg) cortando laterais em 375 px.**
   - *Mitigação:* Usar container centralizado com `margin: 0 auto; width: calc(100% - 16px); max-width: 480px; overflow: visible;` garantindo que os cantos rotacionados fiquem inteiramente dentro da área útil do viewport.

## 1.4 Plano de Execução
1. **Passo 1:** Criar `src/config/prints-quiz.ts` com os metadados tipados de todas as imagens.
2. **Passo 2:** Estilizar no CSS `src/app/globals.css` os cards de print da Capa e das Perguntas, chips de legenda, animação de entrada e regras para `prefers-reduced-motion` e viewports compactos (375×667).
3. **Passo 3:** Integrar os componentes de print em `src/components/quiz.tsx` na Capa (Tela 1) e Perguntas (P1 a P5) com suporte a pré-carregamento da próxima imagem.
4. **Passo 4:** Atualizar `ESPECIFICACAO.md` (seções 5 e 6) e `CHANGELOG.md`.
5. **Passo 5:** Executar testes automatizados (lint, build e suíte em 375×667 medindo visibilidade sem rolagem e tempo de transição).
6. **Passo 6:** Commit, deploy e verificação em produção.

---

# 2. Agente 2 · Executor

### Passo 1 · Configuração de Metadados (`src/config/prints-quiz.ts`)
- Arquivo criado com a interface `QuizPrintItem` e os objetos `capaPrint` e `questionPrints` (P1 a P5).
- Mapeamento estrito com arquivos de imagem de `public/imagens/prints-reais/`, textos exatos de legenda, destaques amarelos, `alt` descritivos e `objectPosition` customizado (especialmente `top` para P2).

### Passo 2 · Estilização e Otimização para 375×667 (`src/app/globals.css`)
- **Card da Capa:** `.capa-print-card-wrap` centralizado com `.capa-print-card` inclinado em `-2deg`, cantos de 16 px, borda amarela fina e sombra difusa. Chip `.print-chip` com fundo escuro a 85% e destaque no faturamento.
- **Card das Perguntas:** `.question-print-wrap` com cantos de 14 px, borda `--border`, animação `@keyframes printEntry` (fade + 8 px de subida em 200 ms).
- **Responsividade (375×667):** regras sob `@media (max-height: 720px) and (max-width: 600px)` ajustando proporcionalmente altura do logo, títulos, margens e altura do card de print (140 px na Capa e 120 px nas perguntas), garantindo que tanto o botão da Capa quanto os 3 cards de resposta nas perguntas fiquem 100% visíveis sem barra de rolagem.
- **Acessibilidade:** desativação de animações e rotação sob `@media (prefers-reduced-motion: reduce)`.

### Passo 3 · Integração nos Componentes (`src/components/quiz.tsx`)
- Injeção do card de print real na Capa (`screen === "inicio"`) entre o parágrafo de subtítulo e o botão de ação.
- Injeção dinâmica do card de print nas perguntas (`screen === "pergunta"`) imediatamente acima do `<h2>` com chave `key={question}` para disparo da animação a cada pergunta.
- Implementação de `useEffect` de pré-carregamento: durante o início/cadastro/qualificação é pré-carregada a imagem da P1; durante a exibição da pergunta `question`, é pré-carregada em segundo plano a imagem da pergunta `question + 1`.
- Função `renderPrintChip` para renderizar legendas com trechos destacados em amarelo.

### Passo 4 · Documentação
- `ESPECIFICACAO.md`: seções 5 e 6 atualizadas com a descrição de cada print, legenda, comportamento de layout em 375×667 e especificações de acessibilidade.
- `CHANGELOG.md`: registrado bloco de alterações detalhado.

---

# 3. Agente 3 · Revisor

## 3.1 Verificação dos Critérios de Aceite

| # | Critério de Aceite | Resultado | Detalhes |
|---|---|---|---|
| 1 | Cada tela mostra o print e a legenda corretos | **APROVADO** | Capa e P1 a P5 validados via DOM com arquivos, legendas e destaques corretos. |
| 2 | Em 375×667: botão da capa e as 3 respostas visíveis sem rolar | **APROVADO** | Capa: botão termina em 581.8 px (< 667 px). Perguntas: último card termina em 531.8 - 551.9 px (< 667 px). Zero rolagem. |
| 3 | Cadastro sem imagem, igual ao atual | **APROVADO** | Verificado que a Tela 2 possui 0 prints e formulário intacto. |
| 4 | Troca entre perguntas continua em até 200 ms | **APROVADO** | Transição média de 164 ms (todos < 180 ms), impulsionada pelo pré-carregamento. |
| 5 | Lint, typecheck e build sem erros; deploy publicado | **APROVADO** | ESLint 0 erros, TypeScript 0 erros, Next.js build em 772 ms. |
| 6 | ESPECIFICACAO.md (seções 5 e 6) e CHANGELOG atualizados | **APROVADO** | Ambas as seções e changelog atualizados com todas as regras e mapeamentos. |

## 3.2 Tempos de Transição Medidos

| Transição | Tempo Medido | Meta | Status |
|---|---|---|---|
| P1 → P2 | **168 ms** | $\le$ 200 ms | APROVADO |
| P2 → P3 | **161 ms** | $\le$ 200 ms | APROVADO |
| P3 → P4 | **154 ms** | $\le$ 200 ms | APROVADO |
| P4 → P5 | **176 ms** | $\le$ 200 ms | APROVADO |

## 3.3 Acessibilidade e Prefers-Reduced-Motion
- Testado com emulação de mídia `prefers-reduced-motion: reduce`.
- O transform do card da Capa retornou `none` e a animação `@keyframes printEntry` foi anulada.

## 3.4 Screenshots Geradas (375 px)
- Capa: `teste-375px-tela-1-capa.png`
- P1: `teste-375px-tela-p1.png`
- P2: `teste-375px-tela-p2.png`
- P3: `teste-375px-tela-p3.png`
- P4: `teste-375px-tela-p4.png`
- P5: `teste-375px-tela-p5.png`
