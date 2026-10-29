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
- Recuperação única por WhatsApp (Evolution API), com convite para a comunidade e link de pagamento rastreado quando aplicável
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
| WhatsApp | Evolution API, instância existente `Nathan` (`5511976896161`), preservando webhook, integrações e settings atuais |
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
| `NEXT_PUBLIC_PRECO_PARCELA` | `5,32` | Valor exibido pela Kiwify para 11 parcelas |
| `NEXT_PUBLIC_PRECO_PARCELAS_QTD` | `11` | |
| `NEXT_PUBLIC_PRECO_DIA` | `0,16` | Regra: (parcela × quantidade de parcelas) ÷ 365, arredondado para centavos |
| `NEXT_PUBLIC_PRECO_DIA_TEXTO` | `0,17` | Texto para subtítulo "menos de R$ 0,17 por dia" |
| `NEXT_PUBLIC_PRECO_AVISTA` | `47,90` | Valor à vista exibido no card de pagamento |
| `VENDAS_BASE` | `177` | Total fixo de compradores exibido no contador da Tela 12. Para mudar o número no futuro, basta alterar esta variável na Vercel e fazer redeploy (sem consultas dinâmicas ou polling) |
| `VENDAS_BASE_DATA` | `2026-10-13` | Data de corte das vendas base |
| `ULTIMO_COMPRADOR_BASE` | `Marcos C.` | Comprador base para o toast de prova social |
| `NEXT_PUBLIC_FORM_MENTORIA_URL` | `https://form.respondi.app/6ZJ4HSZC` | Formulário Respondi |
| `FATURAMENTO_LIMITE_MENTORIA` | `30000` | Mensal |
| `GOOGLE_SHEETS_ID` | `1RDYGQsl3PcRjYiCHwERy2sEcnV5Z-u87zyocUUYG6a0` | Planilha `NR`; usada pelo workflow do n8n |
| `N8N_WEBHOOK_URL` | configurada fora do código | Webhook do workflow `NR · Registro de leads` |
| `N8N_WEBHOOK_SECRET` | configurada fora do código | Segredo do header `x-nr-webhook-secret` |
| `KIWIFY_WEBHOOK_TOKEN` | configurada fora do código | Token gerado pela Kiwify para validar a assinatura HMAC-SHA1 |
| `EVOLUTION_API_URL` | `https://evolution-evolution-api.5hv2sw.easypanel.host` | |
| `EVOLUTION_API_KEY` | a definir | |
| `EVOLUTION_INSTANCE` | `Nathan` | Não alterar as configurações da instância |
| `RECUPERACAO_ATIVA` | `true` | Recuperação autorizada somente nos limites do modo atual |
| `RECUPERACAO_MODO` | `producao` | Produção autorizada em 2026-10-15; mantém janela de 08h–21h, limite diário e envio único por telefone |
| `RECUPERACAO_TELEFONES_TESTE` | configurada fora do código | Números permitidos no modo de teste, separados por vírgula |
| `LINK_COMUNIDADE` | `https://chat.whatsapp.com/F6ZFqDnzdR8Lh5Pl6L2bNZ` | Destino da rota curta de comunidade |
| `RECUPERACAO_INTERVALO_MIN_S` / `MAX_S` | `40` / `120` | Pausa aleatória entre envios |
| `RECUPERACAO_LIMITE_DIARIO` | `60` | Limite de mensagens automáticas por dia |
| `N8N_RECOVERY_LINK_URL` | configurada fora do código | Webhook protegido do workflow `NR · Links de recuperação` |
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

### Tela 1 · Início (redesenho de 2026-10-29, a partir do modelo enviado pelo Nathan)
- **Direção visual:** fundo azul-marinho quase preto, sem brilho laranja atrás do texto, com composição tipográfica em branco e amarelo. Sem rótulo e sem logo.
- **Ordem dos elementos:** headline → subtítulo → print real do painel → botão FAZER O DIAGNÓSTICO, tudo centralizado no fluxo da página.
- **Headline:** Sua primeira venda no Mercado Livre em 48 horas
  - Deve ocupar exatamente duas linhas: "Sua primeira venda no" e "Mercado Livre em 48 horas".
  - Destaques em amarelo: "venda no Mercado Livre" e "48 horas".
- **Subtítulo:** Responda **5 perguntas rápidas** e descubra o que falta para vender no Mercado Livre.
- **Print:** `capa-painel-30-dias.webp`, preservado sem alterar os números, com a legenda "Print do meu painel de vendas".
- **Botão:** FAZER O DIAGNÓSTICO com seta à direita, no fluxo da página.

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
  - R$ 150
  - R$ 125
  - R$ 100
  - R$ 97
- **Avanço:** transição rápida (~150 ms) para a Tela 12.
- **Rastreio e persistência:** dispara o evento personalizado `RespondeuValor` com o valor selecionado, grava na coluna `quanto_pagaria` da planilha (150, 125, 100 ou 97) e registra a etapa 62 (`pergunta_valor`).

### Tela 12 · Pagamento e Prova Social (redesenho completo)
Tela curta e limpa, focada exclusivamente em finalizar a matrícula com alta conversão e prova social.
- **Logo:** logo pequeno no topo removido (o logo dentro do card de oferta é mantido).
- **Rótulo "ÚLTIMO PASSO":** removido.
- **Headline dominante:**
  - Com resposta da Tela 11B: "Você disse que pagaria R$&nbsp;{valor}, mas o curso sai por menos de R$&nbsp;0,17 por dia" (destaque em amarelo em "menos de R$&nbsp;0,17 por dia"). Válido para as 4 opções (150, 125, 100, 97) com espaço não separável (`&nbsp;`) para evitar quebra de linha entre "R$" e os números.
  - Sem resposta: "O curso completo sai por menos de R$&nbsp;0,17 por dia" (mesmo destaque em amarelo e espaço não separável).
  - O valor cheio (R$ 47,90) aparece somente no card de preço.
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
  - Preço em linha única em 375 px sem quebra: "11x de" em branco menor e "R$ 5,32" grande em amarelo gradiente (`white-space: nowrap`, `clamp()`).
  - Linha abaixo: "ou R$ 47,90 à vista" em cinza muted (16 px, line-height 1.4).
  - Botão principal: **QUERO PAGAR AGORA** (dispara `CliqueCheckout` com o mesmo `event_id` no Pixel e CAPI, registra `clicou_checkout_em` e etapa 70, e redireciona para `https://pay.kiwify.com.br/InK3eLE` preservando `utm_*`, `src`, `sck`, `fbclid` e `gclid`, e pré-preenchendo o checkout com `name` (nome digitado no quiz) e `phone` (DDD + número, sem o 55), parâmetros aceitos pela Kiwify).
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
- **Capa (Tela 1):** headline `clamp(28px, 8.6vw, 40px)` font-black line-height 1.1, subtítulo 17 px, 3 cards de 64 px e botão de 58 px no fluxo da página. Em 375×667, headline, subtítulo, cards e botão aparecem juntos sem rolagem (redesenho de 2026-10-28).
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
- CAPI envia em **todos** os eventos (não só no `Lead`) os dados que a sessão já tem: telefone (`ph`), primeiro nome (`fn`), sobrenome (`ln`), país (`country=br`) e `external_id` (o `session_id`), todos com hash SHA-256, além de `fbp` e `fbc` sem hash, IP e user agent.
- `fbp` e `fbc` vêm dos cookies do Pixel. Sem o cookie `_fbc`, a página monta o valor a partir do `fbclid` da URL (`fb.1.<ms>.<fbclid>`) e grava o cookie. Os dois também vão para as colunas `fbp` e `fbc` da planilha no cadastro.
- Capturar e salvar na sessão: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `fbclid`.
- Repassar as UTMs para o link da Kiwify.
- `sck` do checkout leva o `session_id` do lead (substitui um `sck` vindo do anúncio). A Kiwify devolve esse valor no webhook de compra, o que liga cada venda à linha do lead e à campanha e ao criativo de origem.

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
| `quanto_pagaria` | Resposta selecionada na Tela 11B (150, 125, 100 ou 97) |
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
| `classificacao_resposta` | `conversou` / `recuperou` (`respondeu_audio` deixa de ser usado) |
| `codigo_curto` | Código único de 6 a 8 caracteres usado nas rotas `/c/` e `/p/` |
| `clicou_comunidade_em` | Data e hora do clique no convite da comunidade |
| `clicou_pagamento_wpp_em` | Data e hora do clique no pagamento enviado por WhatsApp |

### Aba `eventos` (log, uma linha por evento)
`registrado_em` · `session_id` · `evento` · `etapa` · `dados_json` · `event_id_meta`

### Aba `mensagens` (log do WhatsApp)
`registrado_em` · `session_id` · `telefone` · `direcao` (`enviada`/`recebida`) · `tipo` (`texto`/`audio`) · `conteudo` · `msg_id`

---

## 10. Abandono e recuperação

Uma única mensagem automática é enviada por pessoa. No modo `teste`, apenas os telefones listados em `RECUPERACAO_TELEFONES_TESTE` são elegíveis. O modo `producao` depende de aprovação expressa após os testes.

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

### Mensagens
Variáveis: `{nome}` (primeiro nome), `{primeiro_ponto}` (primeiro item da lista do diagnóstico, em minúsculas), `{link_comunidade}` e `{link_pagamento}`. São usados os textos A, B, C e D aprovados na rodada de recuperação de 2026-10-14, com a mensagem C atualizada em 2026-10-29. A mensagem C inclui o link de pagamento e oferece a comunidade como bônus após o envio do comprovante; o convite não é enviado nessa primeira mensagem. As demais abordagens mantêm o convite direto para a comunidade.

**`parou_cadastro`** (etapa 10 a 30)
> Oi, {nome}! Aqui é da equipe do Nathan Ritter. Vi que você começou o diagnóstico para vender no Mercado Livre e parou logo no início. Ficou alguma dúvida? Se quiser, te ajudo por aqui.

**`parou_perguntas`** (etapa 41 a 45)
> Oi, {nome}, tudo bem? Aqui é da equipe do Nathan. Você respondeu parte do diagnóstico do Mercado Livre e faltaram poucas perguntas para ver o resultado. Tem alguma dúvida sobre como começar a vender lá?

**`viu_diagnostico`** (etapa 50)
> Oi, {nome}! Aqui é da equipe do Nathan. No seu diagnóstico, um dos pontos que apareceram foi {primeiro_ponto}. É um dos temas em que mais gente trava no começo. Quer que eu te explique como o curso trata isso?

**`viu_oferta`** (etapas 60, 65 e 70)
> Oi, {nome}! Aqui é da equipe do Nathan Ritter. Vi que você chegou a acessar a oferta do Máquina de Vendas 2.0, mas ainda não concluiu a compra.
>
> O Nathan deixou eu te dar como bônus o acesso à comunidade de Mercado Livre dele. Se você comprar o curso e me enviar o comprovante por aqui, eu te mando o convite.
>
> A comunidade já tem mais de 400 pessoas, com lives mensais do Nathan e troca entre os participantes.
>
> Este é o link para concluir a compra:
> {link_pagamento}
>
> Depois do pagamento, manda o comprovante aqui que eu libero seu convite.

**`mentoria`** (etapa 35 e 36, sem aplicação)
> Oi, {nome}! Aqui é da equipe do Nathan Ritter. Pelo faturamento que você informou, o Nathan costuma indicar o acompanhamento individual. Quer que eu te conte como funciona a mentoria?

### Áudio comercial
Removido do fluxo. Não existe segundo toque automático e as colunas históricas `audio_enviado_em` e `audio_msg_id` permanecem vazias, sem serem apagadas.

### Links rastreados
- Comunidade: `https://nr-diagnostico-ml.vercel.app/c/{codigo}` registra `clicou_comunidade_em` e redireciona para `LINK_COMUNIDADE`.
- Pagamento: `https://nr-diagnostico-ml.vercel.app/p/{codigo}` registra `clicou_pagamento_wpp_em` e redireciona para a Kiwify com `utm_source=whatsapp`, `utm_medium=recuperacao`, `utm_campaign=quiz-ml-recuperacao`, `utm_content=etapa-{etapa_max}`, `utm_term={utm_campaign original}`, `src=whatsapp-recuperacao` e `sck={session_id do lead}` (ou `rec-{codigo}` se a linha não tiver sessão). Também pré-preenche o checkout com `name` e `phone` (DDD + número), que o workflow `NR · Links de recuperação` devolve junto com a etapa.
- Código inexistente redireciona para a capa do quiz.

### Classificação de respostas
Webhook de mensagens recebidas da Evolution (instância `nr-nathan`):
- Considerar só mensagens enviadas pela pessoa. Ignorar mensagens da própria instância, grupos, reações e eventos técnicos.
- Localizar a sessão mais recente pelo telefone (com e sem nono dígito).
- Cancelar recuperações pendentes.
- Classificar:
  - `conversou`: mandou mensagem sem ter recebido recuperação
  - `recuperou`: mandou mensagem depois da recuperação padrão
  - `respondeu_audio` deixa de ser usado

---

## 11. Webhook da Kiwify

- Endpoint: `POST /api/webhooks/kiwify`, validado por `KIWIFY_WEBHOOK_TOKEN`.
- O token é gerado pela própria Kiwify no formulário de criação. Cada chamada traz uma assinatura HMAC-SHA1 do corpo, validada antes do processamento.
- Payload oficial aceito: `webhook_event_type=order_approved` ou `order_status=paid`; telefone lido de `Customer.mobile`.
- Evento de compra aprovada: localizar o lead pelo `session_id` que vem em `TrackingParameters.sck` e, se não houver ou não for encontrado, pelo telefone (e e-mail, se vier); gravar `comprou_em`, `kiwify_order_id`, `status=comprou`, `etapa_max=80`, cancelar recuperações.
- Não enviar `Purchase` ao Meta (a Kiwify já envia).
- No painel Kiwify, cadastrar em `Apps → Webhooks`, selecionar o produto Máquina de Vendas 2.0 e somente o evento Compra aprovada.

---

## 12. Workflows

Todos novos, com prefixo `NR ·`. Não duplicar e editar um workflow do GMN no lugar: criar do zero ou duplicar e renomear **antes** de qualquer edição, conferindo que o original ficou intacto.

| Workflow | Gatilho | Função |
|---|---|---|
| `NR · Registro de leads` | Webhook POST com header secreto | Cria ou atualiza uma linha por `session_id`, impede regressão de `etapa_max` e registra todos os eventos na aba `eventos` |
| `NR · Agendador de recuperação` | A cada 1 minuto | Seleciona leads elegíveis criados depois da ativação de produção (`2026-10-15T14:43:00Z`) e exclui sessões sintéticas identificadas por `Teste` no nome; monta a mensagem A, B, C ou D, limita a 60 envios/dia, aplica intervalo aleatório de 40 a 120 segundos, envia texto pela instância `Nathan` e anexa o log de saída atomicamente na aba `mensagens` |
| `NR · Mensagens recebidas` | A cada 2 minutos | Consulta `/chat/findMessages/Nathan` para todas as recuperações pendentes das últimas 72 h, reconhece tanto `remoteJid` quanto `remoteJidAlt` (incluindo conversas entregues como `@lid`), consolida gravações simultâneas, anexa os logs na aba `mensagens`, cancela as pendências e classifica `recuperou` |
| `NR · Links de recuperação` | Webhook POST protegido | Resolve o código curto, registra o clique e devolve etapa e campanha para o redirecionamento do site |
| `NR · Compra Kiwify` | Webhook da Kiwify | Opcional, se o webhook não ficar na API do Next.js |

As API Routes do Next.js enviam os eventos ao webhook `NR · Registro de leads`; somente o n8n usa a credencial Google e grava na planilha. A credencial Google existente foi apenas selecionada no workflow novo e não pode ser editada, renomeada ou reautenticada.

As rotas rastreadas respondem primeiro com uma página mínima que redireciona por JavaScript para `?go=1`. Assim, o crawler usado pelo WhatsApp para gerar preview não grava um clique falso; somente a navegação de um navegador executa o segundo pedido rastreado.

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

**Fase 5 · Recuperação**
- Instância existente `Nathan`, preservada sem mudanças; workflows NR de envio, consulta de respostas e links rastreados; sem áudio comercial.
- Aceite: com `RECUPERACAO_MODO=teste`, testar A, B, C e D, links, resposta, janela de horário e ausência de duplicidade. Produção somente após aprovação.
