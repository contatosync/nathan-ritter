# Recursos externos

Inventário de tudo que existe fora do código. Atualizar no mesmo momento em que um recurso for criado.

## Recursos deste projeto (`NR`)

| Recurso | Nome | ID / URL | Criado em | Por |
|---|---|---|---|---|
| Repositório GitHub | `contatosync/nathan-ritter` | `https://github.com/contatosync/nathan-ritter` | 2026-10-13 | Nathan / Codex |
| Projeto Vercel | `nr-diagnostico-ml` | `prj_psW6Ob5p0L2fcyxn7vnRNDQq22ED` | 2026-10-13 | Codex |
| URL pública | URL padrão da Vercel | `https://nr-diagnostico-ml.vercel.app` | 2026-10-13 | Codex |
| Deploy Vercel | Primeiro deploy de produção | `dpl_ECABgEwvDkiffJekeiDsmseURyrs` · READY | 2026-10-13 | Codex |
| Deploy Vercel | Recuperação WhatsApp e proteção contra preview | `dpl_F7fAvygGxMiTuqEBjw2pjLMVugm8` · READY | 2026-10-15 | Codex |
| Formulário de mentoria | Respondi | `https://form.respondi.app/6ZJ4HSZC` | já existente | Nathan |
| Checkout Kiwify | Máquina de Vendas 2.0 | `https://pay.kiwify.com.br/InK3eLE` · R$ 47,90 à vista ou 11x de R$ 5,32 | atualizado em 2026-10-24 | Nathan |
| Planilha Google | `NR · Diagnóstico ML · Leads` | `1RDYGQsl3PcRjYiCHwERy2sEcnV5Z-u87zyocUUYG6a0` · `https://docs.google.com/spreadsheets/d/1RDYGQsl3PcRjYiCHwERy2sEcnV5Z-u87zyocUUYG6a0/edit` | 2026-10-13 | Codex |
| Conta de serviço Google | | | | |
| Workflow | `NR · Agendador de recuperação` | `Znc53yNJVuRk9jRX` · ativo · modo produção · log por append atômico | 2026-10-14 | Codex |
| Workflow | `NR · Mensagens recebidas` | `GRgcmYKPBdcc4njc` · ativo · consulta a cada 2 min · compatível com `@lid`/`remoteJidAlt` | 2026-10-14 | Codex |
| Workflow | `NR · Links de recuperação` | `0pczy18HNqWoxWbs` · ativo | 2026-10-14 | Codex |
| Workflow | `NR · Registro de leads` | `tm3Yl3j6e6gyxU6K` · ativo · persiste `quanto_pagaria` | 2026-10-13 | Codex |
| Credencial n8n | `NR · Registro de leads · Segredo` | `9WxqOUdKGTeHMyiu` | 2026-10-13 | Codex |
| Credencial n8n | `NR · Evolution Nathan · API Key` | `5MszQ2kaC345fN66` | 2026-10-14 | Codex |
| Instância Evolution | `Nathan` | `3b1ca9e5-1cac-4afa-bee4-0afde4657213` · conectada · `5511976896161` | já existente | Nathan |
| Rota rastreada | Comunidade | `https://nr-diagnostico-ml.vercel.app/c/{codigo}` | 2026-10-14 | Codex |
| Rota rastreada | Pagamento WhatsApp | `https://nr-diagnostico-ml.vercel.app/p/{codigo}` | 2026-10-14 | Codex |
| Webhook Kiwify | `NR · Compra aprovada` | `POST https://nr-diagnostico-ml.vercel.app/api/webhooks/kiwify` · ativo · assinatura oficial validada · teste Kiwify confirmado | 2026-10-15 | Nathan / Codex |
| Pixel Meta | Nathan Ritter | `2015455052410421` | já existente | |

Observação: o repositório oficial está conectado ao projeto Vercel `nr-diagnostico-ml`; pushes na branch `main` disparam deploy de produção automaticamente.

## Recursos do funil GMN (somente leitura)

Listar aqui o que for consultado para copiar lógica, para deixar claro o que **não** pode ser alterado.

| Recurso | Nome | ID / URL | Observação |
|---|---|---|---|
| | | | Não alterar |
| Workflow | `Notake | Google Meu Negócio | Nathan | Recuperação WhatsApp` | ativo | Usa a instância `Nathan`; somente leitura |
| Workflow | `Notake | Google Meu Negócio | Nathan | Entrada Evolution` | ativo | Usa a instância `Nathan`; somente leitura |
| Workflow | `Notake | Google Meu Negócio | Nathan | Varredura WhatsApp` | ativo | Usa a instância `Nathan`; somente leitura |
| Workflow | `Notake | Google Meu Negócio | Nathan | Captura e Upsert de Leads` | ativo | Usa a instância `Nathan`; somente leitura |

## Registros DNS existentes antes do projeto

Se o domínio já tiver outros registros, anotar aqui antes de criar o novo.

| Tipo | Nome | Valor |
|---|---|---|
| | | |
