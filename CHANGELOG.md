# Changelog

Registro de todas as mudanças do projeto, da mais recente para a mais antiga.

Formato de cada entrada:

```
## AAAA-MM-DD HH:MM · Agente
**O que mudou:**
**Arquivos:**
**Recursos externos criados/alterados:**
**Pendências:**
```

---

## 2026-10-13 22:38 · Antigravity
**O que mudou:** adicionado botão "QUERO O CURSO MÁQUINA DE VENDAS" logo abaixo do player de vídeo na Tela 11:
- Botão no estilo padrão (amarelo gradiente, largura total, em uma linha em 375 px via clamp e nowrap, altura mínima de 44 px).
- Espaçamento exato: 24 px abaixo do player (`.video-btn-wrap`) e 40 px de respiro até o bloco "O que você recebe" (`.receives-section`).
- Comportamento de pausa: ao tocar no botão (ou nos demais botões da Tela 11) com o vídeo em reprodução, o vídeo do YouTube é pausado via `ytPlayerRef.current.pauseVideo()` antes da transição para a Tela 11B (`pergunta_valor`).
- Atualização da seção 5 de `ESPECIFICACAO.md` e changelog.
**Arquivos:** `src/components/quiz.tsx`, `src/app/globals.css`, `ESPECIFICACAO.md`, `CHANGELOG.md`.
**Recursos externos criados/alterados:** nenhum. Todos os recursos usam prefixo `NR`.
**Pendências:** nenhuma.

## 2026-10-13 21:55 · Antigravity
**O que mudou:** Execução completa dos ajustes rápidos no funil:
- **Tela 11B (Pergunta de valor):** novo subtítulo em `--muted` (16 px) contextualizando módulos do primeiro passo à escala e o diagnóstico; card de aviso com borda amarela fina e ícone de cadeado em amarelo (15 px, branco) esclarecendo que o preço real é menor que qualquer opção.
- **Tela 11 (Vídeo do curso):** domínio `youtube-nocookie.com`, iframe carregado sob demanda apenas após o clique com `autoplay=1`, `controls=0`, `cc_load_policy=0`, `iv_load_policy=3`, `rel=0`, `modestbranding=1`, `playsinline=1`, `disablekb=1`, `fs=0`, `enablejsapi=1` e `hl=pt-BR`; remoção rigorosa de legendas chamando `unloadModule("captions")` e `unloadModule("cc")` no `onReady` e `onStateChange` (`PLAYING`); controles próprios com camada de clique transparente sobre o iframe para play/pause, botão de som dedicado no canto inferior direito e barra amarela fina de progresso na base; container com `overflow: hidden` e iframe centralizado em ~115% de escala recortando o cabeçalho do YouTube sem cortar o rosto do Nathan; retorno automático à capa com botão de play ao terminar o vídeo.
- **Tela 12 (Pagamento):** rótulo "ÚLTIMO PASSO" removido; headline contextualizada para "Você disse que pagaria R$ {valor}, mas isso sai por menos de R$ 2 por dia" (ou versão neutra sem resposta), com destaque amarelo em "menos de R$ 2 por dia" e valor cheio (R$ 297) restrito ao card de preço; substituição do antigo card pulsante por notificação flutuante no topo estilo iPhone (largura ~92%, cantos 18 px, blur translúcido, ícone de 38 px com a caixa amarela do logo `icone-caixa.png`, textos "MÁQUINA DE VENDAS" e "**177** pessoas já compraram o curso", surgimento em 1 s com efeito mola de ~350 ms, exibição por 2,5 s e saída de ~300 ms, uma única vez por visita, e som "ding" de dois tons gerado nativamente via Web Audio API em 1.320 Hz e 1.760 Hz com fallback silencioso e fade sob `prefers-reduced-motion`); inserção do carrossel de provas sociais da Tela 11 abaixo do card de preço com lightbox (ordem 01, 02, 03, 07, 06, 04, 05, 08 e título com "Resultados" em amarelo); repetição do botão "QUERO PAGAR AGORA" abaixo do carrossel.
- **Validação e documentação:** testes automatizados executados em 375 px simulando Chrome e Safari do iPhone validando layout, áudio e interações; atualização da seção 5 de `ESPECIFICACAO.md` e changelog.
**Arquivos:** `src/components/quiz.tsx`, `src/app/globals.css`, `ESPECIFICACAO.md`, `CHANGELOG.md`.
**Recursos externos criados/alterados:** nenhum recurso GMN alterado. Todos os recursos usam prefixo `NR`.
**Pendências:** nenhuma.

## 2026-10-13 20:25 · Antigravity
**O que mudou:** Execução completa da Rodada 2 de ajustes:
- **Tela 10 (Diagnóstico):** título com o nome antes da frase ("{nome}, seu diagnóstico está pronto" e "{nome}, você já domina a base"); introdução dos dois caminhos (CAMINHO 1 cinza / CAMINHO 2 amarelo com brilho) omitidos no caso "sim em tudo"; botão "QUERO O CURSO MÁQUINA DE VENDAS" com espaçamento >= 32 px e texto em linha única em 375 px via clamp e nowrap.
- **Tela 11 (Curso):** descrições dos módulos reduzidas pela metade (P1 a P5 e módulos 07, 08, 10); inserção de player de vídeo explicativo do Nathan sob demanda logo abaixo do primeiro botão, com thumbnail YouTube maxresdefault e botão de play amarelo centralizado, injeção do iframe apenas após o clique com som e autoplay, sem lentidão de carregamento; rastreio de `AssistiuVideoCurso` (Pixel + CAPI, deduplicado por sessão) e registro de `assistiu_video_em`.
- **Tela 11B (Pergunta de Valor):** nova tela intermediária aberta por todos os botões da Tela 11 ("Quanto você pagaria pelo Máquina de Vendas?"), com opções R$ 1.500, R$ 1.000, R$ 600 e R$ 300, transição em ~150 ms, registro na etapa 62 (`pergunta_valor`), disparo de `RespondeuValor` e persistência de `quanto_pagaria`.
- **Tela 12 (Pagamento):** remoção do logo do topo; headline dominante "Tudo isso por menos de R$ 2 por dia" com destaque em amarelo; linha de retorno contextualizada com base na resposta da Tela 11B (ou oculta sem resposta); card do contador em formato de notificação com número fixo 177 à esquerda em amarelo (40 px) sem chamadas de rede, textos à direita, ponto de notificação com efeito ping de 1,5 s, brilho contínuo em loop de 2 s sem salto de layout, animação de entrada com slide-in de 300 ms e desativação sob prefers-reduced-motion; tipografia >= 16 px, line-height 1.4 e 24 px entre blocos.
- **Documentação e infra:** atualização de `ESPECIFICACAO.md` (seções 3, 4, 5, 7, 9 e tabela de etapas), `next.config.ts` (remotePatterns para `i.ytimg.com`), relatório `docs/rodada-antigravity-2.md` e changelog.
**Arquivos:** `next.config.ts`, `src/components/quiz.tsx`, `src/config/diagnostico-modulos.ts`, `src/app/globals.css`, `ESPECIFICACAO.md`, `CHANGELOG.md`, `docs/rodada-antigravity-2.md`.
**Recursos externos criados/alterados:** nenhum recurso GMN alterado. Todos os recursos usam prefixo `NR`.
**Pendências:** nenhuma.

## 2026-10-13 19:38 · Antigravity
**O que mudou:** contador de vendas da Tela 12 desacoplado de consultas dinâmicas, polling e webhooks; o número passa a ser fixo e alimentado pela variável `VENDAS_BASE` (valor `177`) mapeada em `next.config.ts`, aparecendo instantaneamente já no primeiro carregamento sem animação. Para atualizar o número no futuro, basta alterar `VENDAS_BASE` na Vercel e disparar um redeploy. A rota `/api/social-proof` permanece ativa exclusivamente para o aviso discreto do comprador.
**Arquivos:** `next.config.ts`, `src/components/quiz.tsx`, `ESPECIFICACAO.md`, `CHANGELOG.md`.
**Recursos externos criados/alterados:** nenhum.
**Pendências:** nenhuma.

## 2026-10-13 19:28 · Antigravity
**O que mudou:** persistido o controle de disparo do evento `ViuPagamento` no `sessionStorage` do navegador (chaves `nr_viu_pagamento` e `nr_viu_pagamento_${sessionId}`), garantindo que o evento e o registro da etapa 65 disparem estritamente uma única vez por pessoa/sessão, mesmo em cenários de retorno à oferta e reabertura do pagamento ou recarregamento da página.
**Arquivos:** `src/components/quiz.tsx`, `CHANGELOG.md`, `docs/rodada-antigravity.md`.
**Recursos externos criados/alterados:** nenhum.
**Pendências:** nenhuma.

## 2026-10-13 18:40 · Antigravity
**O que mudou:** removido o aviso de rodapé de todas as telas; acelerado o avanço entre perguntas para ~150 ms com feedback visual imediato (borda e ícone amarelos) e envio não bloqueante de eventos em segundo plano com keepalive; ajustado o espaçamento da Tela 10 (>= 32 px) e texto do botão unificado para "QUERO O CURSO MÁQUINA DE VENDAS"; reformulada a Tela 11 como apresentação do curso sem preço, com blocos dinâmicos por ponto do diagnóstico com miniaturas das capas Kiwify 48x72 px, novo carrossel com 10 capas originais 2:3 sem sobreposição e remoção de preço/garantia/FAQ; criada a Tela 12 (Pagamento) com etapa 65 (pagamento), evento ViuPagamento, preço em linha única em 375 px ("12x de R$ 30,72"), prova social real estrita com contador de 177 alunos e aviso do comprador Marcos C. aos 3s, rota API /api/social-proof com cache de 60 s e botão "QUERO PAGAR AGORA" repassando parâmetros de rastreamento ao checkout Kiwify InK3eLE.
**Arquivos:** `src/components/quiz.tsx`, `src/components/carousel.tsx`, `src/config/diagnostico-modulos.ts`, `src/app/globals.css`, `src/app/api/social-proof/route.ts`, `.env.example`, `.env.local`, `.gitignore`, `public/imagens/modulos-kiwify/*`, `ESPECIFICACAO.md`, `AGENTS.md`, `CHANGELOG.md`, `docs/rodada-antigravity.md`.
**Recursos externos criados/alterados:** nenhum recurso GMN alterado. Todos os recursos do projeto usam prefixo `NR`.
**Pendências:** `META_TEST_EVENT_CODE` para validação no Gerenciador de Eventos.

## 2026-10-13 17:44 · Codex
**O que mudou:** ajustada a Tela M para informar que o próprio Nathan entra em contato; adicionada uma chamada para os resultados dos mentorados logo após o primeiro botão; removido o aviso legal abaixo do botão final da mentoria.
**Arquivos:** `src/components/quiz.tsx`, `src/app/globals.css`, `ESPECIFICACAO.md`, `CHANGELOG.md`.
**Recursos externos criados/alterados:** nenhum. Nenhum recurso GMN foi alterado.
**Pendências:** `META_TEST_EVENT_CODE` continua ausente para a validação no Gerenciador de Eventos.

## 2026-10-13 16:10 · Codex
**O que mudou:** aplicada a identidade visual exata da página de vendas; fonte alterada para Sora/Poppins; hero passou a usar os fundos oficiais; criada a oferta longa com conteúdo personalizado do diagnóstico, card de preço, benefícios, dez módulos, dois carrosséis de provas sociais, apresentação do Nathan, garantia, FAQ, lightbox e CTA fixo móvel; mentoria reorganizada com carrossel e CTA repetido; parâmetros `src`, `sck` e `gclid` adicionados ao checkout; aviso legal incluído em todas as telas.
**Arquivos:** `src/app/layout.tsx`, `src/app/globals.css`, `src/components/quiz.tsx`, `src/components/carousel.tsx`, `public/imagens/fundo/*`, `public/imagens/modulos/*`, `public/imagens/provas/*`, `ESPECIFICACAO.md`, `CHANGELOG.md`.
**Recursos externos criados/alterados:** nenhum. Nenhum recurso GMN foi alterado.
**Pendências:** `META_TEST_EVENT_CODE` continua ausente para a validação no Gerenciador de Eventos.

## 2026-10-13 10:40 · Codex
**O que mudou:** adicionada a opção “Voltar” em todas as etapas após a tela inicial, incluindo cadastro, decisão de venda, faturamento, cinco perguntas, diagnóstico, oferta e mentoria. As respostas preenchidas são preservadas e o botão fica temporariamente desabilitado durante o envio ou a transição de uma resposta.
**Arquivos:** `src/components/quiz.tsx`, `src/app/globals.css`, `eslint.config.mjs`, `CHANGELOG.md`.
**Recursos externos criados/alterados:** nenhum recurso GMN foi alterado.
**Pendências:** publicar e validar o retorno no ambiente de produção.

## 2026-10-13 10:15 · Codex
**O que mudou:** migrado o repositório oficial para `contatosync/nathan-ritter`, conectado ao projeto Vercel `nr-diagnostico-ml` e configuradas as variáveis também no ambiente Preview, incluindo `META_CAPI_TOKEN` como variável sensível.
**Arquivos:** `RECURSOS.md`, `CHANGELOG.md`.
**Recursos externos criados/alterados:** repositório `contatosync/nathan-ritter`; conexão GitHub → Vercel ativa. O repositório anterior não foi apagado e nenhum recurso GMN foi alterado.
**Pendências:** `META_TEST_EVENT_CODE`; token Kiwify; áudio comercial; Evolution/recuperação e Fase 5. O primeiro deploy automático foi validado com status READY.

## 2026-10-13 09:45 · Codex
**O que mudou:** publicado o primeiro deploy de produção; migrado o código para o repositório oficial `SyncAssessoriaMedica/nathan-ritter`; testados em produção os caminhos curso, mentoria e “sim em tudo”; confirmados os três cadastros e seus eventos na planilha; confirmada a recepção de um evento pela Meta CAPI; confirmado que o webhook Kiwify responde como inativo sem token. `META_CAPI_TOKEN` configurado.
**Arquivos:** `RECURSOS.md`, `CHANGELOG.md`, `.gitignore`.
**Recursos externos criados/alterados:** deploy Vercel `dpl_ECABgEwvDkiffJekeiDsmseURyrs` em estado READY; repositório oficial populado. Nenhum recurso GMN foi alterado.
**Pendências:** conceder ao aplicativo GitHub da Vercel acesso ao repositório da organização para habilitar deploy automático e variáveis Preview; fornecer `META_TEST_EVENT_CODE` para validar a aba Eventos de Teste no Gerenciador de Eventos; token Kiwify; áudio comercial; Evolution/recuperação e Fase 5.

## 2026-10-13 00:45 · Codex
**O que mudou:** iniciadas as fases 0, 1 e 2; criada a aplicação Next.js; adicionados o quiz, as rotas curso/mentoria, diagnóstico, oferta, encaminhamento por API Route ao n8n, Pixel+CAPI com deduplicação, captura de UTMs e endpoint inativo da Kiwify; imagens instaladas; criada a planilha com três abas e o workflow protegido `NR · Registro de leads`; `META_CAPI_TOKEN` configurado localmente; áudio e recuperação mantidos desligados.
**Arquivos:** aplicação Next.js, `ESPECIFICACAO.md`, `RECURSOS.md`, `.env.example`, `.env.local`, imagens públicas.
**Recursos externos criados/alterados:** planilha `NR · Diagnóstico ML · Leads`; workflow ativo `NR · Registro de leads`; credencial `NR · Registro de leads · Segredo`. Nenhum recurso GMN foi alterado.
**Pendências:** registradas na entrada mais recente.

## 2026-10-13 00:26 · Codex
**O que mudou:** registrados o formulário da mentoria, o checkout da Kiwify e os preços reais; recalculado o valor diário para R$ 1,01; definida a publicação inicial pela URL padrão da Vercel, sem domínio próprio ou alterações de DNS.
**Arquivos:** `ESPECIFICACAO.md`, `RECURSOS.md`, `env.example`
**Recursos externos criados/alterados:** nenhum; foram apenas documentados recursos já existentes.
**Pendências:**
- URL padrão da Vercel após a criação/publicação do projeto
- Número do WhatsApp do Nathan para a instância `nr-nathan` da Evolution
- Token da API de Conversões do Meta
- Logo em PNG transparente ou SVG
- Cores e fonte exatas do projeto Lovable da página de vendas
- Áudio comercial gravado

## 2026-10-13 · Claude (planejamento)
**O que mudou:** criação da especificação inicial do funil de diagnóstico Mercado Livre do Nathan Ritter, adaptada do funil GMN da Notake.
**Arquivos:** `ESPECIFICACAO.md`, `AGENTS.md`, `CLAUDE.md`, `CHANGELOG.md`, `RECURSOS.md`, `.env.example`
**Recursos externos criados/alterados:** nenhum.
**Pendências:**
- Link de checkout da Kiwify e valor real da parcela
- Link do formulário da mentoria
- Número do WhatsApp do Nathan para a instância `nr-nathan` da Evolution
- Token da API de Conversões do Meta
- Logo em PNG transparente ou SVG
- Cores e fonte exatas do projeto Lovable da página de vendas
- Áudio comercial gravado
- Definir o subdomínio no registro.br
