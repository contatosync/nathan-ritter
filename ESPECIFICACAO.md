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
| `NEXT_PUBLIC_PRECO_AVISTA` | `297` | |
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
  → Tela 11: Oferta Máquina de Vendas
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
| 70 | `clique_checkout` |
| 80 | `comprou` |
| 35 | `tela_mentoria` |
| 36 | `clique_mentoria` |

---

## 5. Textos das telas

Os textos abaixo estão aprovados. Não reescrever sem pedido explícito.

### Tela 1 · Início
- **Rótulo:** DIAGNÓSTICO GRATUITO
- **Headline:** Descubra em 5 perguntas se você está pronto para vender no Mercado Livre sem quebrar nos primeiros 3 meses
  - Destaque em amarelo: "pronto para vender no Mercado Livre"
- **Subtítulo:** O diagnóstico mostra o que você já sabe e o que ainda falta para vender com margem desde o primeiro produto.
- **Botão:** FAZER O DIAGNÓSTICO

### Tela 2 · Nome e WhatsApp
- **Título:** Para onde enviamos seu diagnóstico?
- **Campos:** Seu nome · Seu WhatsApp com DDD
- **Botão:** CONTINUAR
- **Rodapé:** Seus dados ficam só com a equipe do Nathan.

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

| # | Pergunta | Ponto exibido no diagnóstico |
|---|---|---|
| 1 | Você sabe encontrar um produto com procura e pouca concorrência no Mercado Livre? | Como encontrar produtos com procura e pouca concorrência |
| 2 | Você sabe encontrar fornecedores nacionais confiáveis para revender? | Como encontrar fornecedores nacionais confiáveis |
| 3 | Você sabe calcular a margem antes de vender, considerando taxa do Mercado Livre, frete e imposto? | Como calcular a margem antes de vender |
| 4 | Você sabe montar um anúncio que apareça na busca do Mercado Livre (título, fotos e ficha técnica)? | Como montar anúncios que aparecem na busca |
| 5 | Você sabe quanto precisa investir para começar e como girar o estoque sem travar o dinheiro? | Como planejar o investimento inicial e o giro de estoque |

### Tela 10 · Diagnóstico
**Lógica:** todo item com resposta "Mais ou menos" ou "Não sei" entra na lista de pontos a estudar (card com X vermelho). Itens com "Sim, sei fazer" entram na lista do que a pessoa já domina (card com check amarelo).

**Caso padrão (1 ou mais pontos a estudar):**
- **Título:** Seu diagnóstico está pronto, {nome}
- **Texto:** Para vender com margem no Mercado Livre, você ainda precisa aprender estes pontos:
- [lista dinâmica]
- **Bloco "o que você já domina":** exibido só se houver ao menos um item
- **Fechamento:** Você pode estudar cada um sozinho. Se preferir seguir o caminho que o Nathan usa desde 2022, ele está organizado no curso Máquina de Vendas.
- **Botão:** VER COMO APRENDER

**Caso "Sim" em todas:**
- **Título:** Você já domina a base, {nome}
- **Texto:** O curso aprofunda os pontos em que a maioria trava depois das primeiras vendas: escolha de produto e controle de margem.
- **Botão:** VER O CURSO

### Tela 11 · Oferta
- **Nome:** Máquina de Vendas 2.0
- **Preço em destaque:** 12x de R$ {NEXT_PUBLIC_PRECO_PARCELA}
- **Linha abaixo:** Menos de R$ {NEXT_PUBLIC_PRECO_DIA} por dia
- **Linha pequena, em cinza:** ou R$ {NEXT_PUBLIC_PRECO_AVISTA} à vista
- **Botão:** QUERO COMEÇAR AGORA
- **Abaixo do botão:** cadeado + "Acesso imediato após pagamento"
- **Prova:** faixa amarela com resultados (mesma da página de vendas)

**Comportamento do botão:**
1. Dispara `CliqueCheckout` (Pixel + CAPI) e grava `clicou_checkout_em`.
2. Se `NEXT_PUBLIC_CHECKOUT_URL` estiver preenchida, abre o link levando as UTMs da sessão.
3. Se estiver vazia, mostra "Link de pagamento em configuração" (só em ambiente de teste).

### Tela M · Mentoria (faturamento acima de R$ 30 mil)
- **Título:** Pelo seu faturamento, você pode precisar de um acompanhamento individual
- **Texto:** Quem já fatura acima de R$ 30 mil por mês costuma ter decisões mais específicas sobre estoque, caixa e escala. Nesses casos, o Nathan acompanha a operação de perto, na mentoria individual. Se tiver interesse, preencha o formulário e a equipe entra em contato.
- **Botão:** QUERO FALAR SOBRE A MENTORIA
- **Visual:** sem o logo do curso. Foto do Nathan de braços cruzados ao lado do texto.

#### Estrutura aprovada da Tela M
Ordem: rótulo → título → texto → botão → foto do Nathan → `CarrosselProvas` → botão repetido → aviso legal. O carrossel usa o título “Resultados dos mentorados do Nathan” e a ordem 02, 04, 05, 06, 01, 03, 07, 08. Os dois botões disparam `AplicacaoMentoria` e abrem o formulário aprovado.

#### Estrutura aprovada da Tela 11
Ordem: introdução “SEU PRÓXIMO PASSO”; relação entre os pontos do diagnóstico e o conteúdo do curso; card de preço; lista “O que você recebe”; carrossel dos 10 módulos; carrossel de resultados; apresentação de Nathan Ritter; garantia de 7 dias com CTA; quatro perguntas frequentes; aviso legal. Quando todas as respostas forem “Sim”, destacar Produto Campeão, Estratégia para ranquear e Dominando ADS. No celular, exibir CTA fixo somente quando o card de preço e o CTA da garantia estiverem fora da tela.

Todos os CTAs de compra disparam `CliqueCheckout` pelo Pixel e CAPI com o mesmo `event_id` e levam ao checkout `InK3eLE`, repassando `utm_*`, `src`, `sck`, `fbclid` e `gclid`.

---

## 6. Identidade visual

### Identidade aprovada da página de vendas

- `--bg: #0A0F1C`; `--bg-alt: #11182B`; `--card: #161D33`; borda `rgba(255,255,255,0.08)`; `--yellow: #FFD400`; `--orange: #FF6A00`; `--text: #FFFFFF`; `--muted: #B8C0D9`.
- Fonte principal Sora, com Poppins e `system-ui` como fallback. Títulos em peso 900.
- Botão principal com degradê `#FFE34D → #FFD400`, texto `#0A0F1C`, sombra amarela e animação `pulse-cta` de 2,5 segundos, respeitando `prefers-reduced-motion`.
- Tela inicial usa `fundo/hero.webp` e `hero-mobile.webp` com opacidade de 40%, `mix-blend-screen`, brilhos radiais amarelo/laranja e degradê escuro.
- Card de oferta usa borda amarela a 60% e fundo radial amarelo sobre degradê azul-marinho.
- Carrosséis usam scroll-snap, gesto horizontal no celular, setas somente no desktop e indicadores com o ativo amarelo. Imagens de provas abrem em lightbox.
- Todas as telas mostram o aviso: “Este produto não garante resultados financeiros. Os depoimentos refletem experiências individuais.”

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
- **Card de resposta:** fundo `--card`, borda `--border`, cantos arredondados. Selecionado: borda e ícone amarelos. Avança sozinho 500 ms após a seleção.
- **Barra de progresso:** amarela, com a seta do logo na ponta. Texto "Pergunta X de 5".
- **Card de diagnóstico:** X vermelho em círculo vermelho escuro (pontos a estudar) e check amarelo (o que já domina).
- **Faixa de resultados:** fundo amarelo, texto preto em caixa alta, rolagem horizontal.

### Logo
- O arquivo atual tem fundo azul-marinho embutido (`#0B1226`). Pedir versão PNG transparente ou SVG. Até lá, usar essa cor exata atrás do logo.
- Tela 1: logo grande, centralizado, com brilho amarelo atrás e fundo de caixas, notas e faíscas desfocadas (igual ao topo da página de vendas).
- Demais telas: logo pequeno no topo (cerca de 90 px de largura no celular).
- Tela M: sem logo do curso.

### Layout
- Pensado primeiro para celular. Uma pergunta por tela, botão fixo na parte de baixo.
- No desktop, conteúdo centralizado com largura máxima de 560 px.

---

## 7. Rastreio Meta

Pixel `2015455052410421`. Todos os eventos disparados pela página vão pelo Pixel e pela API de Conversões com o **mesmo `event_id`** (deduplicação).

| Momento | Evento | Quem dispara |
|---|---|---|
| Página carregou | `PageView` | Página |
| Enviou nome e WhatsApp | `Lead` | Página (Pixel + CAPI) |
| Faturamento acima de R$ 30 mil | `LeadMentoria` (personalizado) | Página |
| Viu o diagnóstico | `DiagnosticoConcluido` (personalizado) | Página |
| Clicou no botão da oferta | `CliqueCheckout` (personalizado) | Página |
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
| `viu_oferta_em` | |
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

**`viu_oferta`** (etapa 60 e 70)
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
