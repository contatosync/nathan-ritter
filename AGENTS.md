<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Regras do projeto NR

Antes de qualquer tarefa, leia `ESPECIFICACAO.md`, `CHANGELOG.md` e `RECURSOS.md`.

- O funil Google Meu Negócio da Notake é somente leitura. Nunca alterar seus repositórios, projetos, planilhas, workflows, credenciais, instâncias, pixels, variáveis, webhooks ou DNS.
- Todo recurso novo deste projeto usa o prefixo `NR` e deve ser registrado em `RECURSOS.md` no mesmo momento.
- Toda alteração entra no `CHANGELOG.md` antes do commit. Decisões de produto também atualizam `ESPECIFICACAO.md`.
- Os textos aprovados em `ESPECIFICACAO.md` não devem ser reescritos sem pedido explícito.
- Nunca commitar `.env`, `.env.local`, tokens ou outros segredos. Variáveis novas entram em `.env.example` sem valor.
- A recuperação usa a instância existente `Nathan`, sem alterar webhook, integrações ou settings. Nunca reiniciar, desconectar, fazer logout ou gerar QR Code.
- `RECUPERACAO_ATIVA=true`, mas `RECUPERACAO_MODO=teste` restringe os envios aos números autorizados em `RECUPERACAO_TELEFONES_TESTE`. Só mudar para `producao` com aprovação expressa.
- O áudio comercial foi removido. Não criar o workflow `NR · Áudio comercial` e não recriar `AUDIO_COMERCIAL_URL`.

## Agentes do projeto
- Claude (planejamento inicial)
- Codex (desenvolvimento das fases 0 a 4)
- Antigravity (ajustes de oferta, velocidade, prova social e checkout)
