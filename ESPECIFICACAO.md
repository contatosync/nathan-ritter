# Diagnóstico Mercado Livre · Nathan Ritter

Especificação funcional e técnica do funil de diagnóstico do curso **Máquina de Vendas 2.0**.
Versão 1.0 · 13/10/2026

Este documento é a fonte de verdade do projeto. Qualquer mudança de regra, texto ou fluxo deve ser feita aqui e registrada no `CHANGELOG.md`.

---

## 0. Regra de isolamento (ler antes de tudo)

Este projeto foi desenhado a partir do funil de diagnóstico do **Google Meu Negócio (Notake)**, que já está em produção. Ele é uma **cópia de lógica**, não uma extensão.

- Nenhum recurso do funil GMN pode ser editado, renomeado, reaproveitado ou apagado: repositório, projeto Vercel, planilha, workflows, instância da Evolution API, pixel, variáveis de ambiente, webhooks e DNS.
- É permitido **ler** o código ou os workflows do funil GMN para copiar a lógica. Ao copiar, criar sempre um recurso novo.
- Todo recurso novo leva o prefixo `NR` (Nathan Ritter) no nome, para não ser confundido com recursos da Notake.
- Antes de qualquer ação via MCP (Google, n8n, Vercel, GitHub, Evolution), confirmar que o alvo é um recurso `NR`. Se houver dúvida sobre qual recurso será afetado, parar e perguntar.
- Todo recurso criado deve ser anotado em `RECURSOS.md` no mesmo momento.

---

## 1. Visão geral

Pessoa vê anúncio no Meta → responde um diagnóstico de 5 perguntas sobre vender no Mercado Livre → recebe a lista de pontos que ainda precisa estudar → vê a oferta do curso Máquina de Vendas 2.0.

Quem já vende e fatura acima de R$ 30 mil por mês sai do fluxo do curso e é direcionado para o formulário da mentoria individual.

### Escopo da v1
- Quiz com diagnóstico e oferta
- Rota da mentoria por faturamento
- Rastreio Meta (Pixel + API de Conversões)
- Planilha Google com uma linha por lead
- Recuperação por WhatsApp (Evolution API) e áudio comercial
- Webhook da Kiwify para marcar compra e cancelar recuperação

### Fora da v1
- Envio ao DataCrazy
- Dashboard de métricas

---

## 2. Infraestrutura

| Item | Definição |
|---|---|
| Repositório | GitHub, novo: `nr-diagnostico-ml` |
| Hospedagem | Vercel, projeto novo: `nr-diagnostico-ml` |
| URL pública | URL padrão fornecida pela Vercel. Domínio próprio adiado, fora da v1 neste momento |
| Front-end | Next.js (App Router) + Tailwind |
| Back-end | API Routes do próprio Next.js na Vercel |
| Banco de dados | Google Sheets, planilha `NR · Diagnóstico ML · Leads`. O site envia dados ao n8n; não acessa a planilha diretamente |
| Automações | Workflows novos no n8n, todos com prefixo `NR ·` |
| WhatsApp | Evolution API, **instância nova e própria do Nathan** (número ainda não conectado) |
| Pagamento | Kiwify (link ainda não existe) |
| Pixel Meta | `2015455052410421` |

### Domínio
Por enquanto, publicar usando a URL padrão do projeto Vercel `nr-diagnostico-ml`. Não criar nem alterar registros DNS. A configuração de domínio próprio fica adiada para uma fase futura.

---

## 3. Variáveis de configuração

Tudo que ainda não existe fica em variável, para ser trocado sem mexer no código. Ver `.env.example`.

| Variável | Valor atual | Observação |
|---|---|---|
| `NEXT_PUBLIC_META_PIXEL_ID` | `2015455052410421` | |
| `META_CAPI_TOKEN` | a gerar | Gerenciador de Eventos do Meta |
| `META_TEST_EVENT_CODE` | opcional | Usar só em teste |
| `NEXT_PUBLIC_CHECKOUT_URL` | `https://pay.kiwify.com.br/InK3eLE` | Checkout da Kiwify |
| `NEXT_PUBLIC_PRECO_PARCELA` | `30,72` | Valor exibido pela Kiwify para 12 parcelas |
| `NEXT_PUBLIC_PRECO_PARCELAS_QTD` | `12` | |
| `NEXT_PUBLIC_PRECO_DIA` | `1,01` | Regra: (parcela × 12) ÷ 365, arredondado para centavos |
| `NEXT_PUBLIC_PRECO_DIA_TEXTO` | `2` | Texto para subtítulo "menos de R$ 2 por dia" |
| `VENDAS_BASE` | `177` | Total fixo de compradores exibido no contador da Tela 12. Para mudar o número no futuro, basta alterar esta variável na Vercel e fazer redeploy (sem consultas dinâmicas ou polling) |
| `VENDAS_BASE_DATA` | `2026-10-13` | Data de corte das vendas base |
| `ULTIMO_COMPRADOR_BASE` | `Marcos C.` | Comprador base para o toast de prova social |
| `NEXT_PUBLIC_FORM_MENTORIA_URL` | `https://form.respondi.app/6ZJ4HSZC` | Formulário Respondi |
| `FATURAMENTO_LIMITE_MENTORIA` | `30000` | Mensal |
| `GOOGLE_SHEETS_ID` | `1RDYGQsl3PcRjYiCHwERy2sEcnV5Z-u87zyocUUYG6a0` | Planilha `NR`; usada pelo workflow do n8n |
| `N8N_WEBHOOK_URL` | configurada fora do código | Webhook do workflow `NR · Registro de leads` |
| `N8N_WEBHOOK_SECRET` | configurada fora do código | Segredo do header `x-nr-webhook-secret` |
| `KIWIFY_WEBHOOK_TOKEN` | a criar | Validar origem do webhook |
| `EVOLUTION_API_URL` | a definir | |
| `EVOLUTION_API_KEY` | a definir | |
| `EVOLUTION_INSTANCE` | `nr-nathan` (a criar) | Nunca usar a instância da Notake |
| `RECUPERACAO_ATIVA` | `false` | Só virar `true` com o número conectado e testado |
| `AUDIO_COMERCIAL_URL` | vazio | Áudio comercial fora do escopo atual; lógica desligada |
| `HORARIO_ENVIO_INICIO` | `08:00` | America/Sao_Paulo |
| `HORARIO_ENVIO_FIM` | `21:00` | America/Sao_Paulo |

---

## 4. Fluxo completo

```
Anúncio Meta
  → Tela 1: Início
  → Tela 2: Nome e WhatsApp            (cria a linha na planilha · evento Lead)
  → Tela 3: Você já vende no ML?
       ├─ Ainda não ───────────────────────────────┐
       └─ Sim → Tela 4: Faturamento mensal          │
                  ├─ Até R$ 30 mil ─────────────────┤
                  └─ Acima de R$ 30 mil              │
                       → Tela M: Mentoria            │
                       → Formulário da mentoria      │
  ┌─────────────────────────────────────────────────┘
  → Telas 5 a 9: as 5 perguntas
  → Tela 10: Diagnóstico
  → Tela 11: Apresentação do Máquina de Vendas (sem preço e com vídeo sob demanda)
  → Tela 11B: Pergunta de valor
  → Tela 12: Pagamento e Prova Social (redesenho)
  → Checkout Kiwify
```

### Etapas (coluna `etapa_max` da planilha)

Valores numéricos para permitir comparação. A etapa só avança, nunca volta.

| Código | Etapa |
|---|---|
| 0 | `inicio` |
| 10 | `cadastro` |
| 20 | `ja_vende` |
| 30 | `faturamento` |
| 41 a 45 | `p1` a `p5` |
| 50 | `diagnostico` |
| 60 | `oferta` |
| 62 | `pergunta_valor` |
| 65 | `pagamento` |
| 70 | `clique_checkout` |
| 80 | `comprou` |
| 35 | `tela_mentoria` |
| 36 | `clique_mentoria` |

---

## 5. Textos das telas

Os textos abaixo estão aprovados. Não reescrever sem pedido explícito.

### Tela 1 · Início
- **Rótulo:** DIAGNÓSTICO GRATUITO
- **Logo do curso:** removido da capa; o print real entra no lugar dele.
- **Ordem dos elementos:** rótulo DIAGNÓSTICO GRATUITO → print → headline → subtítulo → botão FAZER O DIAGNÓSTICO.
- **Print real:** `capa-painel-30-dias.webp` (900×494), posicionado reto (sem qualquer inclinação ou rotação), largura total do conteúdo e exibido inteiro sem corte mantendo a proporção natural. Card com cantos de 16 px, borda amarela fina (`rgba(255, 212, 0, 0.45)`) e brilho amarelo suave atrás (`box-shadow`).
- **Legenda do print:** posicionada fora e logo abaixo do card, texto de 12 px, cor `--muted`, precedida de um ponto amarelo (`#FFD400`): "Painel real: R$ 104 mil de lucro bruto em 30 dias" ("R$ 104 mil" em amarelo).
- **Headline:** Descubra em 5 perguntas se você está pronto para vender no Mercado Livre sem quebrar nos primeiros 3 meses
  - Destaque em amarelo: "pronto para vender no Mercado Livre"
- **Subtítulo:** O diagnóstico mostra o que você já sabe e o que ainda falta para vender com margem desde o primeiro produto.
- **Botão:** FAZER O DIAGNÓSTICO (visível sem qualquer rolagem num iPhone de 375×667).

### Tela 2 · Nome e WhatsApp
- **Título:** Para onde enviamos seu diagnóstico?
- **Campos:** Seu nome · Seu WhatsApp com DDD
- **Botão:** CONTINUAR
- **Rodapé:** Seus dados ficam só com a equipe do Nathan.
- **Sem imagem/print:** mantida estritamente limpa e focada no cadastro.

### Tela 3 · Você já vende no Mercado Livre?
- Ainda não
- Sim, já vendo

### Tela 4 · Quanto você fatura por mês no Mercado Livre?
- Até R$ 5 mil
- De R$ 5 mil a R$ 15 mil
- De R$ 15 mil a R$ 30 mil
- Acima de R$ 30 mil

### Telas 5 a 9 · As 5 perguntas
Respostas iguais para todas: **Sim, sei fazer** · **Mais ou menos** · **Não sei**

Cada pergunta exibe um print real demonstrativo imediatamente acima do título (`<h2>`), recortado no formato do card (860×351, ~2,45:1), exibido inteiro sem corte mantendo a proporção, cantos arredondados de 14 px, borda `--border` e animação de entrada fade + 8 px de subida (200 ms). Legenda posicionada fora da imagem, logo abaixo do card, em texto de 12 px cor `--muted` com ponto amarelo antes. As 3 opções de resposta permanecem visíveis sem rolagem num iPhone de 375×667. A imagem da próxima pergunta é pré-carregada em segundo plano garantindo troca em até 200 ms.

| # | Pergunta | Print exibido | Legenda (abaixo do card) | Ponto exibido no diagnóstico |
|---|---|---|---|---|
| 1 | Você sabe encontrar um produto com procura e pouca concorrência no Mercado Livre? | `p1-produto-campeao-chocadeira.webp` | Produto validado: 1.194 avaliações | Como encontrar produtos com procura e pouca concorrência |
| 2 | Você sabe encontrar fornecedores nacionais confiáveis para revender? | `p2-fornecedores-nacionais.webp` | 13 fornecedores nacionais para um único produto | Como encontrar fornecedores nacionais confiáveis |
| 3 | Você sabe calcular a margem antes de vender, considerando taxa do Mercado Livre, frete e imposto? | `p3-lucro-margem-20.webp` | Margem de 20% acompanhada no painel | Como calcular a margem antes de vender |
| 4 | Você sabe montar um anúncio que apareça na busca do Mercado Livre (título, fotos e ficha técnica)? | `p4-campanhas-roas-receita.webp` | Anúncios com retorno acima de 16x | Como montar anúncios que aparecem na busca |
| 5 | Você sabe quanto precisa investir para começar e como girar o estoque sem travar o dinheiro? | `p5-roas-retorno-investimento.webp` | ROAS de 1.055x em uma campanha | Como planejar o investimento inicial e o giro de estoque |

### Tela 10 · Diagnóstico
**Lógica:** todo item com resposta "Mais ou menos" ou "Não sei" entra na lista de pontos a estudar (card com X vermelho). Itens com "Sim, sei fazer" entram na lista do que a pessoa já domina (card com check amarelo).

**Caso padrão (1 ou mais pontos a estudar):**
- **Título:** {nome}, seu diagnóstico está pronto
- **Texto:** Para vender com margem no Mercado Livre, você ainda precisa aprender estes pontos:
- [lista dinâmica]
- **Bloco "o que você já domina":** exibido só se houver ao menos um item
- **Dois caminhos:**
  - **Abertura:** Agora você sabe o que precisa aprender. Existem dois caminhos:
  - **Card 1 (CAMINHO 1):** Aprender cada ponto sozinho, procurando o conteúdo por conta própria e testando até acertar. (borda cinza)
  - **Card 2 (CAMINHO 2):** Aprender todos os pontos em uma única plataforma, com o passo a passo de quem vende no Mercado Livre desde 2022. (borda amarela com brilho leve)
- **Espaçamento:** mínimo de 32 px entre o card 2 e o botão.
- **Botão:** QUERO O CURSO MÁQUINA DE VENDAS (em uma única linha em 375 px, clamp, altura mínima 44 px).

**Caso "Sim" em todas:**
- **Título:** {nome}, você já domina a base
- **Texto:** O curso aprofunda os pontos em que a maioria trava depois das primeiras vendas: escolha de produto e controle de margem.
- Não exibe o bloco dos dois caminhos.
- **Espaçamento:** mínimo de 32 px entre o último parágrafo e o botão.
- **Botão:** QUERO O CURSO MÁQUINA DE VENDAS (em uma linha só em 375 px).

### Tela 11 · Apresentação do curso (sem preço)
Apresentação focada exclusivamente nos conteúdos do curso direcionados ao diagnóstico do lead, sem qualquer informação de preço ou checkout.

**Estrutura da tela:**
1. **Rótulo:** SEU PRÓXIMO PASSO
   **Título:** Em quais módulos você vai focar para melhorar os pontos do seu diagnóstico (destaque amarelo em "pontos do seu diagnóstico")
2. **Blocos por ponto do diagnóstico (descrições curtas):**
   - P1: Como ler a busca do Mercado Livre para achar produtos que vendem e têm poucos concorrentes bons.
   - P2: Onde o Nathan encontra fornecedores no Brasil e como testar com pouca quantidade antes de comprar mais.
   - P3: Como montar a conta com custo, tarifa, frete e imposto para saber quanto sobra em cada venda.
   - P4: Título, fotos e ficha técnica que aparecem na busca, e o que faz o anúncio subir de posição.
   - P5: Como começar com estoque pequeno, validar o giro e só depois repor em maior quantidade.
   - Caso "Sim" em todas: módulos 07 ("O que faz um anúncio que já vende ganhar posição na busca."), 08 ("Como usar os anúncios pagos do Mercado Livre sem queimar caixa.") e 10 ("Como aumentar o volume de vendas sem perder o controle do caixa.").
3. **Botão intermediário:** QUERO O CURSO MÁQUINA DE VENDAS (posicionado logo após os blocos de pontos, navega para a Tela 11B).
4. **Vídeo do Nathan sobre o curso (on-demand com controles próprios e sem legendas):**
   - Posicionado logo abaixo do primeiro botão.
   - Cabeçalho: título "Ainda tem dúvidas sobre o curso?" e subtítulo "No vídeo abaixo, o Nathan explica cada parte do Máquina de Vendas. E logo depois tem o que você recebe, os 10 módulos e resultados de alunos."
   - Player sob demanda: capa estática do YouTube em alta resolução (`maxresdefault.jpg`) com botão de play amarelo centralizado (16:9, cantos arredondados, borda e brilho amarelos).
   - O iframe é carregado sob demanda apenas após o clique do usuário via domínio `youtube-nocookie.com`, com os parâmetros: `autoplay=1&controls=0&cc_load_policy=0&iv_load_policy=3&rel=0&modestbranding=1&playsinline=1&disablekb=1&fs=0&enablejsapi=1&hl=pt-BR`.
   - Remoção rigorosa de legendas do YouTube: chamada de `player.unloadModule("captions")` e `player.unloadModule("cc")` no `onReady` e repetida no `onStateChange` ao entrar em estado `PLAYING`.
   - Controles customizados: camada transparente sobre o iframe para clique alternar play/pause sem exibir interface do YouTube; botão de áudio no canto inferior direito para ativar/desativar som; barra de progresso amarela fina na base, apenas informativa.
   - Container com `overflow: hidden` e iframe centralizado (~115% de altura), cortando o título superior e marcas d'água sem cortar o rosto do Nathan.
   - Ao terminar a reprodução (`ended`), retorna automaticamente à capa inicial com o botão de play.
   - Dispara evento `AssistiuVideoCurso` (Pixel + CAPI, deduplicado por sessão) e salva `assistiu_video_em` na planilha.
5. **Botão abaixo do vídeo:** QUERO O CURSO MÁQUINA DE VENDAS (posicionado logo abaixo do player com 24 px de espaçamento, no mesmo estilo dos outros: amarelo, largura total do conteúdo, linha única em 375 px, altura mínima de 44 px; abre a Tela 11B; se o vídeo estiver tocando, pausa o vídeo antes de trocar de tela; 40 px de espaçamento até "O que você recebe").
6. **O que você recebe:** 4 itens com check amarelo (10 módulos, 1 ano de acesso, aulas novas com mudanças do algoritmo, suporte a dúvidas).
7. **Carrossel dos 10 módulos:** capas originais da Kiwify na proporção 2:3 com cantos arredondados, sem sobreposição de selos, títulos ou degradês, com `alt` acessível; ocupa ~62% da largura no mobile e 3 cards no desktop.
8. **Carrossel de provas:** resultados de alunos do curso (ordem 01, 02, 03, 07, 06, 04, 05, 08).
9. **Quem ensina:** apresentação do Nathan Ritter.
10. **Botão final:** QUERO O CURSO MÁQUINA DE VENDAS (navega para a Tela 11B).

**Itens removidos da Tela 11:** card de preço, valores por dia, preço à vista, cadeado, CTA fixo móvel, garantia de 7 dias, perguntas frequentes (FAQ) e aviso legal de rodapé.

### Tela 11B · Pergunta de valor (entre Tela 11 e Tela 12)
Tela intermediária disparada por todos os botões "QUERO O CURSO MÁQUINA DE VENDAS" da Tela 11.
- **Layout:** idêntico às perguntas do quiz (logo pequeno no topo, cards de resposta, sem barra de progresso, avanço em ~150 ms).
- **Pergunta:** Quanto você pagaria pelo Máquina de Vendas?
- **Subtítulo (--muted, 16 px):** Um curso com módulos que vão do primeiro passo à escala no Mercado Livre, incluindo cada ponto que apareceu no seu diagnóstico.
- **Card de aviso:** card baixo com borda amarela fina, ícone de cadeado em amarelo e texto em branco (15 px): "Esse não é o valor que você vai pagar. Queremos saber quanto o curso vale para você, e o preço real é menor do que qualquer uma das opções."
- **Opções de resposta:**
  - R$ 1.500
  - R$ 1.000
  - R$ 600
  - R$ 300
- **Avanço:** transição rápida (~150 ms) para a Tela 12.
- **Rastreio e persistência:** dispara o evento personalizado `RespondeuValor` com o valor selecionado, grava na coluna `quanto_pagaria` da planilha (1500, 1000, 600 ou 300) e registra a etapa 62 (`pergunta_valor`).

### Tela 12 · Pagamento e Prova Social (redesenho completo)
Tela curta e limpa, focada exclusivamente em finalizar a matrícula com alta conversão e prova social.
- **Logo:** logo pequeno no topo removido (o logo dentro do card de oferta é mantido).
- **Rótulo "ÚLTIMO PASSO":** removido.
- **Headline dominante:**
  - Com resposta da Tela 11B: "Você disse que pagaria R$&nbsp;{valor}, mas o curso sai por menos de R$&nbsp;2 por dia" (destaque em amarelo em "menos de R$&nbsp;2 por dia"). Válido para as 4 opções (1.500, 1.000, 600, 300) com espaço não separável (`&nbsp;`) para evitar quebra de linha entre "R$" e os números.
  - Sem resposta: "O curso completo sai por menos de R$&nbsp;2 por dia" (mesmo destaque em amarelo e espaço não separável).
  - A linha antiga de retorno ("Você disse que pagaria... Hoje o acesso completo sai por R$ 297") foi totalmente removida; o valor cheio (R$ 297) não aparece fora do card de preço.
- **Notificação flutuante no estilo iPhone (contador de vendas):**
  - Banner flutuante fixado no topo da tela, sobre o conteúdo (`position: fixed`), largura ~92%, cantos arredondados (18 px), fundo translúcido escuro com desfoque (`backdrop-filter: blur(20px)`), sombra suave.
  - À esquerda: ícone quadrado arredondado de 38 px com a caixa amarela do logo (`public/imagens/logo/icone-caixa.png`).
  - Ao lado, em duas linhas: "MÁQUINA DE VENDAS" (11 px, `--muted`, caixa alta) e "177 pessoas já compraram o curso" (15 px, branco, "177" em negrito).
  - Comportamento: surge 1 s após a abertura da tela descendo do topo com efeito mola (~350 ms), permanece visível por 2,5 s e sobe sumindo (~300 ms). Aparece uma única vez por visita à tela.
  - Som de notificação curto: "ding" de dois tons gerado nativamente via Web Audio API (1.320 Hz seguido de 1.760 Hz, ~120 ms cada tom, volume baixo com decay exponencial). Sem dependência de arquivos de áudio externos; falha silenciosamente se o navegador bloquear autoplay de áudio.
  - Acessibilidade: sob `prefers-reduced-motion: reduce`, a notificação surge e some com fade simples, sem efeito de mola e sem emissão de som.
  - Total fixo: valor fixado em 177 vindo de `VENDAS_BASE`, sem "agora" ou "há X min". Para atualizar o número no futuro, basta alterar `VENDAS_BASE` na Vercel e fazer redeploy.
- **Card de preço:**
  - Logo do curso no topo do card.
  - Preço em linha única em 375 px sem quebra: "12x de" em branco menor e "R$ 30,72" grande em amarelo gradiente (`white-space: nowrap`, `clamp()`).
  - Linha abaixo: "ou R$ 297 à vista" em cinza muted (16 px, line-height 1.4).
  - Botão principal: **QUERO PAGAR AGORA** (dispara `CliqueCheckout` com o mesmo `event_id` no Pixel e CAPI, registra `clicou_checkout_em` e etapa 70, e redireciona para `https://pay.kiwify.com.br/InK3eLE` preservando `utm_*`, `src`, `sck`, `fbclid` e `gclid`).
  - Abaixo do botão: 🔒 Acesso imediato após pagamento (16 px, line-height 1.4).
- **Carrossel de provas sociais (abaixo do card de preço):**
  - Mesmo componente `ProofCarousel` da Tela 11, com suporte a visualização ampliada via lightbox.
  - Título: "Resultados de quem aplica o método do Nathan" ("Resultados" em amarelo).
  - Ordem das provas: 01, 02, 03, 07, 06, 04, 05, 08.
- **Botão CTA secundário (repetido abaixo do carrossel):**
  - Botão "QUERO PAGAR AGORA" repetido, com mesmo evento e link de checkout, acompanhado da trava "🔒 Acesso imediato após pagamento".
- **Aviso do comprador discreto:** aviso discreto no canto inferior exibindo "Marcos C. entrou no Máquina de Vendas". Aparece 3 s após carregar a tela e some após 6 s.
- **Rastreio:** ao entrar na Tela 12, dispara o evento personalizado `ViuPagamento` (Pixel + CAPI, deduplicado por sessão) e grava `viu_pagamento_em` com etapa 65 (`pagamento`).
- Sem garantia, sem FAQ e sem aviso legal de rodapé.

### Tela M · Mentoria (faturamento acima de R$ 30 mil)
- **Título:** Pelo seu faturamento, você pode precisar de um acompanhamento individual
- **Texto:** Quem já fatura acima de R$ 30 mil por mês costuma ter decisões mais específicas sobre estoque, caixa e escala. Nesses casos, o Nathan acompanha a operação de perto, na mentoria individual. Se tiver interesse, preencha o formulário. O próprio Nathan entra em contato com você.
- **Botão:** QUERO FALAR SOBRE A MENTORIA
- **Chamada após o primeiro botão:** Veja abaixo os resultados de alguns mentorados do Nathan.
- **Visual:** sem o logo do curso. Foto do Nathan de braços cruzados ao lado do texto.

#### Estrutura aprovada da Tela M
Ordem: rótulo → título → texto → botão → chamada para os resultados → foto do Nathan → `CarrosselProvas` → botão repetido. O carrossel usa o título “Resultados dos mentorados do Nathan” e a ordem 02, 04, 05, 06, 01, 03, 07, 08. Os dois botões disparam `AplicacaoMentoria` e abrem o formulário aprovado. A Tela M não exibe aviso legal abaixo do botão final.

---

## 6. Identidade visual

### Identidade aprovada da página de vendas

- `--bg: #0A0F1C`; `--bg-alt: #11182B`; `--card: #161D33`; borda `rgba(255,255,255,0.08)`; `--yellow: #FFD400`; `--orange: #FF6A00`; `--text: #FFFFFF`; `--muted: #B8C0D9`.
- Fonte principal Sora, com Poppins e `system-ui` como fallback. Títulos em peso 900.
- Botão principal com degradê `#FFE34D → #FFD400`, texto `#0A0F1C`, sombra amarela e animação `pulse-cta` de 2,5 segundos, respeitando `prefers-reduced-motion`.
- Tela inicial usa `fundo/hero.webp` e `hero-mobile.webp` com opacidade de 40%, `mix-blend-screen`, brilhos radiais amarelo/laranja e degradê escuro.
- Card de oferta usa borda amarela a 60% e fundo radial amarelo sobre degradê azul-marinho.
- Carrosséis usam scroll-snap, gesto horizontal no celular, setas somente no desktop e indicadores com o ativo amarelo. Imagens de provas abrem em lightbox.
- Nenhuma tela exibe aviso legal de rodapé sobre resultados financeiros.

Base: página de vendas `maquina-de-vendas-nathan.lovable.app`. Os valores de cor abaixo foram estimados por captura de tela. Se houver acesso ao projeto Lovable, usar os valores exatos do CSS/Tailwind de lá e registrar no CHANGELOG.

### Cores
| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#0F1525` | Fundo principal |
| `--bg-alt` | `#0B1120` | Seções alternadas |
| `--card` | `#161D30` | Cards e campos |
| `--border` | `#26304A` | Borda de cards |
| `--yellow` | `#FFD200` | Botões, destaques, progresso |
| `--text` | `#FFFFFF` | Títulos |
| `--muted` | `#A9B2C3` | Texto corrido |
| `--error` | `#E5484D` | Ícone X do diagnóstico |

O degradê amarelo (`#FFE100` → `#F5B700`) fica restrito ao logo e ao preço em destaque.

### Tipografia
- Títulos: sans-serif geométrica, peso 800, palavra-chave em amarelo. Provável Plus Jakarta Sans (confirmar no projeto Lovable).
- Texto corrido: mesma família, peso 400.
- Rótulos: caixa alta, letter-spacing largo, tamanho pequeno.

### Componentes
- **Botão principal:** amarelo, cantos bem arredondados, texto preto em caixa alta e negrito, brilho amarelo (`box-shadow`).
- **Card de resposta:** fundo `--card`, borda `--border`, cantos arredondados. Selecionado: borda e ícone amarelos. Avança sozinho em ~150 ms após a seleção (meta <= 200 ms).
- **Barra de progresso:** amarela, com a seta do logo na ponta. Texto "Pergunta X de 5".
- **Card de diagnóstico:** X vermelho em círculo vermelho escuro (pontos a estudar) e check amarelo (o que já domina).
- **Faixa de resultados:** fundo amarelo, texto preto em caixa alta, rolagem horizontal.
- **Cards de prints reais (Capa e Perguntas):**
  - **Capa:** card reto (sem inclinação/rotação), cantos de 16 px, borda amarela fina (`rgba(255, 212, 0, 0.45)`), brilho amarelo suave (`box-shadow`), largura total do conteúdo e imagem inteira sem corte mantendo proporção. Legenda externa logo abaixo do card, 12 px em `--muted` com ponto amarelo antes e "R$ 104 mil" em amarelo.
  - **Perguntas (P1 a P5):** container posicionado imediatamente acima do `<h2>`, proporção 860×351 (~2,45:1) inteira sem corte, cantos de 14 px, borda `--border`, legenda externa logo abaixo do card em texto de 12 px `--muted` precedida por ponto amarelo, com animação de entrada fade + 8 px de subida em 200 ms.
  - **Pré-carregamento contínuo:** a imagem da próxima pergunta é pré-carregada em background via `Image` no navegador para garantir troca sem latência (<= 200 ms).
  - **Acessibilidade:** sob `prefers-reduced-motion: reduce`, anula animações de entrada.

### Logo
- O arquivo atual tem fundo azul-marinho embutido (`#0B1226`). Pedir versão PNG transparente ou SVG. Até lá, usar essa cor exata atrás do logo.
- Tela 1: logo do curso removido (o print real do painel de 30 dias entra em seu lugar).
- Demais telas (exceto M e Pagamento): logo pequeno no topo (cerca de 65-90 px de largura no celular).
- Tela M: sem logo do curso.

### Layout e Otimizações Mobile
- **Foco Mobile First:** pensado especificamente para tráfego vindo de anúncios no Instagram, Facebook e WhatsApp WebViews (Android e iOS).
- **Dimensões e Viewport:** uso estrito de `100dvh` para adaptação dinâmica à barra de navegação; `viewport-fit=cover` e respeito às áreas seguras (`env(safe-area-inset-top)` e `env(safe-area-inset-bottom)`). Margens laterais fixas de 20 px em todas as telas.
- **Prevenção de Rolagem Horizontal:** `overflow-x: hidden` no container base; largura total de componentes e carrosséis sem transbordar viewports a partir de 360 px.
- **Alvos de Toque e Interatividade:** alvos de toque com no mínimo 48 px de altura (cards de resposta, botão "Voltar", setas de carrossel e pontos indicadores com área ampliada via padding). `touch-action: manipulation` para remover atraso de toque de 300 ms no iOS/Android.
- **Tipografia:** texto corrido com no mínimo 16 px (`--text-body`), rótulos e legendas secundárias com no mínimo 12 px (`--text-caption`). Contraste de `--muted` (`#B8C0D9`) atendendo WCAG AA (>= 4,5:1).
- **Capa (Tela 1):** rótulo no topo (24 px abaixo da safe-area), headline `clamp(26px, 8vw, 34px)` font-black line-height 1.1, subtítulo 16 px, print do painel com `max-height: 30dvh` e legenda externa. Barra fixa no rodapé (`#0A0F1C`) com degradê suave, botão FAZER O DIAGNÓSTICO de 56 px de altura e legenda "Leva menos de 1 minuto". Em 375×667, rótulo, headline, subtítulo, print e botão aparecem juntos sem rolagem.
- **Barras Fixas de Avanço:**
  - Diagnóstico e Tela M: barra fixa no rodapé com botão principal.
  - Telas 11 e 12: barra fixa inteligente via `IntersectionObserver` que surge quando o botão no conteúdo sai da viewport e se oculta quando outro botão idêntico está visível.
- **Cadastro (Tela 2):** inputs com fonte de 16 px (impede o zoom automático indesejado no iOS Safari); máscara de WhatsApp em tempo real `(DD) 9XXXX-XXXX`; mensagens de erro inline abaixo de cada campo; botão mantido no fluxo com `scrollIntoView` para visibilidade total quando o teclado virtual abre.
- **Navegação no Histórico:** integração com `history.pushState` e evento `popstate`, permitindo que o botão voltar do Android e o gesto de deslizar do iOS voltem para a etapa anterior do quiz sem sair da página nem reiniciar o fluxo. Persistência de estado de respostas em `sessionStorage` (`nr_quiz_state`).
- **WebViews e In-App Browsers:** no Instagram, Facebook e WhatsApp, o redirecionamento de checkout da Kiwify é feito na mesma aba (`window.location.href`), contornando bloqueios de popup e preservando parâmetros UTM e fbclid. Eventos de saída e cliques são garantidos via `navigator.sendBeacon` (ou `fetch` com `keepalive: true`).
- **Vídeo e Áudio:** player de vídeo com `playsinline=1`. `AudioContext` de notificações com fallback silencioso para restrições de autoplay de navegadores móveis.
- **No Desktop:** conteúdo centralizado com largura máxima de 560 px.

---

## 7. Rastreio Meta

Pixel `2015455052410421`. Todos os eventos disparados pela página vão pelo Pixel e pela API de Conversões com o **mesmo `event_id`** (deduplicação).

| Momento | Evento | Quem dispara |
|---|---|---|
| Página carregou | `PageView` | Página |
| Enviou nome e WhatsApp | `Lead` | Página (Pixel + CAPI) |
| Faturamento acima de R$ 30 mil | `LeadMentoria` (personalizado) | Página |
| Viu o diagnóstico | `DiagnosticoConcluido` (personalizado) | Página |
| Tocou no play do vídeo da oferta | `AssistiuVideoCurso` (personalizado) | Página (Pixel + CAPI, 1x por sessão) |
| Respondeu à pergunta de valor (Tela 11B) | `RespondeuValor` (personalizado) | Página (Pixel + CAPI, com valor) |
| Abriu a Tela 12 (pagamento) | `ViuPagamento` (personalizado) | Página (Pixel + CAPI, 1x por sessão) |
| Clicou no botão de pagamento | `CliqueCheckout` (personalizado) | Página (Pixel + CAPI) |
| Abriu o checkout | `InitiateCheckout` | Kiwify |
| Comprou | `Purchase` | Kiwify |
| Clicou no formulário da mentoria | `AplicacaoMentoria` (personalizado) | Página |

Regras:
- A página **não** dispara `InitiateCheckout` nem `Purchase`. A integração da Kiwify já faz isso; disparar dos dois lados duplica.
- CAPI envia telefone e nome com hash SHA-256, além de `fbp`, `fbc`, IP e user agent.
- Capturar e salvar na sessão: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `fbclid`.
- Repassar as UTMs para o link da Kiwify.

---

## 8. Sessão e regras de dados

- Ao enviar a Tela 2, criar `session_id` (UUID), salvar no navegador e criar a linha na planilha.
- Todos os eventos seguintes atualizam **a mesma linha**.
- `etapa_max` só aumenta. Eventos atrasados ou repetidos não sobrescrevem dados mais recentes.
- Telefone normalizado para `55DDDNNNNNNNNN`. A busca por telefone aceita número com e sem o nono dígito.
- Validar telefone brasileiro antes de criar a linha.

---

## 9. Planilha `NR · Diagnóstico ML · Leads`

Criar do zero. Não copiar a planilha do funil GMN.

### Aba `leads` (uma linha por pessoa)
| Coluna | Descrição |
|---|---|
| `session_id` | UUID |
| `criado_em` | Data e hora do cadastro |
| `atualizado_em` | Última atividade |
| `nome` | |
| `telefone` | Normalizado |
| `status` | `em_andamento`, `abandonou`, `em_recuperacao`, `conversou`, `recuperado`, `respondeu_audio`, `comprou`, `mentoria` |
| `etapa_max` | Código numérico |
| `etapa_max_nome` | Nome da etapa |
| `ja_vende` | `sim` / `nao` |
| `faixa_faturamento` | Faixa escolhida |
| `rota` | `curso` / `mentoria` |
| `p1` a `p5` | `sim` / `mais_ou_menos` / `nao` |
| `pontos_diagnostico` | Lista separada por `;` |
| `qtd_pontos` | Número de pontos a estudar |
| `viu_oferta_em` | Data e hora em que viu a oferta |
| `assistiu_video_em` | Data e hora em que tocou no play do vídeo explicativo (Tela 11) |
| `quanto_pagaria` | Resposta selecionada na Tela 11B (1500, 1000, 600 ou 300) |
| `viu_pagamento_em` | Data e hora em que viu a tela de pagamento (etapa 65) |
| `clicou_checkout_em` | |
| `comprou_em` | Pelo webhook da Kiwify |
| `kiwify_order_id` | |
| `clicou_mentoria_em` | |
| `utm_source` a `utm_term` | 5 colunas |
| `fbclid` | |
| `fbp` / `fbc` | |
| `recuperacao_tipo` | Abordagem enviada |
| `recuperacao_enviada_em` | |
| `recuperacao_msg_id` | |
| `audio_enviado_em` | |
| `audio_msg_id` | |
| `primeira_resposta_em` | Primeira mensagem real da pessoa |
| `classificacao_resposta` | `conversou` / `recuperou` / `respondeu_audio` |

### Aba `eventos` (log, uma linha por evento)
`registrado_em` · `session_id` · `evento` · `etapa` · `dados_json` · `event_id_meta`

### Aba `mensagens` (log do WhatsApp)
`registrado_em` · `session_id` · `telefone` · `direcao` (`enviada`/`recebida`) · `tipo` (`texto`/`audio`) · `conteudo` · `msg_id`

---

## 10. Abandono e recuperação

Regras de tempo herdadas do funil GMN. Nada é enviado enquanto `RECUPERACAO_ATIVA=false`; nesse modo, o sistema só calcula e grava o que **seria** enviado, para teste.

### Detecção
| Situação | Espera |
|---|---|
| Saída identificada pelo navegador (`visibilitychange`/`pagehide` + `sendBeacon`) | 10 segundos |
| Sem evento de saída, sem atividade | 15 minutos |
| Clicou no checkout e não comprou | 30 minutos |
| Viu a tela da mentoria e não clicou no formulário | 30 minutos |

### Antes de enviar, verificar
- Telefone válido
- Pessoa não respondeu no WhatsApp
- Pessoa não retomou o quiz
- Não comprou (`comprou_em` vazio)
- Mesma recuperação ainda não enviada
- Horário entre 08:00 e 21:00 (America/Sao_Paulo). Fora disso, agendar para 08:00 do dia seguinte.

### Mensagens (sem link de retomada)
Variáveis: `{nome}` (primeiro nome) e `{primeiro_ponto}` (primeiro item da lista do diagnóstico, em minúsculas).

**`parou_cadastro`** (etapa 10 a 30)
> Oi, {nome}! Aqui é da equipe do Nathan Ritter. Vi que você começou o diagnóstico para vender no Mercado Livre e parou logo no início. Ficou alguma dúvida? Se quiser, te ajudo por aqui.

**`parou_perguntas`** (etapa 41 a 45)
> Oi, {nome}, tudo bem? Aqui é da equipe do Nathan. Você respondeu parte do diagnóstico do Mercado Livre e faltaram poucas perguntas para ver o resultado. Tem alguma dúvida sobre como começar a vender lá?

**`viu_diagnostico`** (etapa 50)
> Oi, {nome}! Aqui é da equipe do Nathan. No seu diagnóstico, um dos pontos que apareceram foi {primeiro_ponto}. É um dos temas em que mais gente trava no começo. Quer que eu te explique como o curso trata isso?

**`viu_oferta`** (etapas 60, 65 e 70)
> Oi, {nome}, aqui é da equipe do Nathan. Vi que você chegou até a oferta do Máquina de Vendas. Ficou alguma dúvida sobre o curso ou sobre o pagamento? Posso te ajudar por aqui.

**`mentoria`** (etapa 35 e 36, sem aplicação)
> Oi, {nome}! Aqui é da equipe do Nathan Ritter. Pelo faturamento que você informou, o Nathan costuma indicar o acompanhamento individual. Quer que eu te conte como funciona a mentoria?

### Áudio comercial (adiado)
- Fora do escopo atual. `AUDIO_COMERCIAL_URL` permanece vazio e nenhuma automação de áudio deve ser ativada.
- Quando retomado: 24 horas depois da recuperação padrão, se não houver resposta.
- Arquivo em `AUDIO_COMERCIAL_URL`, gravado pela equipe.
- Não enviar se: respondeu, retomou, comprou, telefone inválido, áudio já enviado ou fora do horário.
- Última abordagem automática da sequência.

### Classificação de respostas
Webhook de mensagens recebidas da Evolution (instância `nr-nathan`):
- Considerar só mensagens enviadas pela pessoa. Ignorar mensagens da própria instância, grupos, reações e eventos técnicos.
- Localizar a sessão mais recente pelo telefone (com e sem nono dígito).
- Cancelar recuperações pendentes.
- Classificar:
  - `conversou`: mandou mensagem sem ter recebido recuperação
  - `recuperou`: mandou mensagem depois da recuperação padrão
  - `respondeu_audio`: mandou mensagem depois do áudio comercial

---

## 11. Webhook da Kiwify

- Endpoint: `POST /api/webhooks/kiwify`, validado por `KIWIFY_WEBHOOK_TOKEN`.
- Evento de compra aprovada: localizar o lead por telefone (e e-mail, se vier), gravar `comprou_em`, `kiwify_order_id`, `status=comprou`, `etapa_max=80`, cancelar recuperações.
- Não enviar `Purchase` ao Meta (a Kiwify já envia).
- Implementar quando o produto existir na Kiwify. Até lá, deixar o endpoint pronto e testado com payload de exemplo.

---

## 12. Workflows

Todos novos, com prefixo `NR ·`. Não duplicar e editar um workflow do GMN no lugar: criar do zero ou duplicar e renomear **antes** de qualquer edição, conferindo que o original ficou intacto.

| Workflow | Gatilho | Função |
|---|---|---|
| `NR · Registro de leads` | Webhook POST com header secreto | Cria ou atualiza uma linha por `session_id`, impede regressão de `etapa_max` e registra todos os eventos na aba `eventos` |
| `NR · Agendador de recuperação` | A cada 1 minuto | Lê leads elegíveis, aplica as verificações e envia a recuperação padrão |
| `NR · Áudio comercial` | A cada 5 minutos | Envia o áudio 24 h após a recuperação sem resposta |
| `NR · Mensagens recebidas` | Webhook da Evolution `nr-nathan` | Classifica respostas e cancela pendências |
| `NR · Compra Kiwify` | Webhook da Kiwify | Opcional, se o webhook não ficar na API do Next.js |

As API Routes do Next.js enviam os eventos ao webhook `NR · Registro de leads`; somente o n8n usa a credencial Google e grava na planilha. A credencial Google existente foi apenas selecionada no workflow novo e não pode ser editada, renomeada ou reautenticada.

---

## 13. Fases de implementação

Cada fase termina com registro no CHANGELOG e os critérios de aceite conferidos.

**Fase 0 · Estrutura isolada**
- Repositório, projeto Vercel, planilha com as 3 abas, conta de serviço, `.env` preenchido no que já existe.
- Aceite: `RECURSOS.md` lista todos os recursos `NR`; nenhum recurso GMN aparece como alterado.

**Fase 1 · Quiz e planilha**
- Todas as telas, as duas rotas, gravação na planilha, regra de `etapa_max`.
- Aceite: percorrer as rotas curso, mentoria e "sim em tudo" no celular, e conferir a linha na planilha em cada uma.

**Fase 2 · Rastreio Meta**
- Pixel, CAPI, deduplicação, UTMs.
- Aceite: eventos aparecem no Gerenciador de Eventos com `META_TEST_EVENT_CODE` e sem duplicidade.

**Fase 3 · Publicação na Vercel**
- Usar a URL padrão fornecida pela Vercel, sem configurar domínio próprio ou DNS.
- Aceite: aplicação publicada com HTTPS na URL padrão da Vercel.

**Fase 4 · Kiwify**
- Usar `https://pay.kiwify.com.br/InK3eLE`, os preços reais e ligar o webhook.
- Aceite: compra de teste marca `comprou` na planilha.

**Fase 5 · Recuperação** (quando o número for conectado)
- Instância `nr-nathan`, workflows, áudio.
- Aceite: com `RECUPERACAO_ATIVA=true`, testar cada tipo de recuperação com um número interno, incluindo horário fora da janela e resposta que cancela o áudio.
