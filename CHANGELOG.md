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

## 2026-10-13 20:15 · Codex
**O que mudou:** migrado o repositório oficial para `contatosync/nathan-ritter`, conectado ao projeto Vercel `nr-diagnostico-ml` e configuradas as variáveis também no ambiente Preview, incluindo `META_CAPI_TOKEN` como variável sensível.
**Arquivos:** `RECURSOS.md`, `CHANGELOG.md`.
**Recursos externos criados/alterados:** repositório `contatosync/nathan-ritter`; conexão GitHub → Vercel ativa. O repositório anterior não foi apagado e nenhum recurso GMN foi alterado.
**Pendências:** validar o primeiro deploy automático; `META_TEST_EVENT_CODE`; token Kiwify; áudio comercial; Evolution/recuperação e Fase 5.

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
