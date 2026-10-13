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
