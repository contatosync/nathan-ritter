# Rodada de recuperação por WhatsApp

Data: 2026-10-14 a 2026-10-15

## Planejador

Objetivo: concluir a Fase 5 em modo de teste, com uma única mensagem automática por pessoa, convite para a comunidade e link de pagamento rastreado para quem chegou ao pagamento.

Regras de segurança:

- usar somente a instância existente `Nathan`;
- não reiniciar, desconectar, gerar QR Code ou alterar configurações da instância;
- preservar integralmente o webhook já existente;
- criar ou alterar apenas recursos com prefixo `NR ·`;
- manter `RECUPERACAO_MODO=teste` até aprovação expressa;
- manter segredos apenas em variáveis de ambiente e credenciais.

## Leitura inicial da instância `Nathan`

Consulta somente leitura realizada em 2026-10-14, antes de qualquer alteração externa.

- Estado: conectada (`open`).
- Número: `5511976896161`.
- Integração WhatsApp: `WHATSAPP-BAILEYS`.
- Cliente: `evolution_exchange`.
- Webhook: ativo em `https://n8n-n8n.5hv2sw.easypanel.host/webhook/evolution-webinar-nathan`.
- Evento do webhook: `GROUP_PARTICIPANTS_UPDATE`.
- `webhookByEvents`: `false`.
- `webhookBase64`: `false`.
- Chatwoot: não configurado.
- Proxy: não configurado.
- RabbitMQ, NATS, SQS e WebSocket: não configurados.
- Settings: `rejectCall=false`, `groupsIgnore=false`, `alwaysOnline=false`, `readMessages=false`, `readStatus=false`, `syncFullHistory=false`.

Decisão: o webhook existente não será alterado. O workflow `NR · Mensagens recebidas` consultará `/chat/findMessages/Nathan` a cada 2 minutos.

## Automações existentes que usam Nathan (somente leitura)

- `Notake | Google Meu Negócio | Nathan | Recuperação WhatsApp` — ativo.
- `Notake | Google Meu Negócio | Nathan | Entrada Evolution` — ativo.
- `Notake | Google Meu Negócio | Nathan | Varredura WhatsApp` — ativo.
- `Notake | Google Meu Negócio | Nathan | Captura e Upsert de Leads` — ativo.
- `Resumo Diário WhatsApp — Nathan Cérebro` — ativo.

Nenhum desses workflows será aberto para edição, duplicado para edição ou alterado.

## Executor

- Criada a credencial isolada `NR · Evolution Nathan · API Key`.
- Adicionadas à aba `leads` as colunas `codigo_curto`, `clicou_comunidade_em` e `clicou_pagamento_wpp_em`.
- Atualizado `NR · Registro de leads` para preservar e gravar as novas colunas.
- Criado e ativado `NR · Links de recuperação` (`0pczy18HNqWoxWbs`).
- Criado `NR · Agendador de recuperação` (`Znc53yNJVuRk9jRX`) com modo de teste, quatro mensagens, janela de horário, limite diário e pausa aleatória.
- Criado `NR · Mensagens recebidas` (`GRgcmYKPBdcc4njc`) com consulta à Evolution para recuperações das últimas 72 horas.
- Adicionadas ao site as rotas `/c/{codigo}` e `/p/{codigo}`.
- Variáveis configuradas localmente e na Vercel para Production e Preview; `AUDIO_COMERCIAL_URL` removida.

## Revisor

- Cenários finais A, B, C e D registrados nas linhas 82–85 da aba `leads`, todos restritos ao telefone de teste.
- As quatro mensagens foram aceitas pela Evolution e receberam `msg_id`; o log correspondente foi gravado na aba `mensagens`.
- O link de comunidade respondeu com redirecionamento 302 para a comunidade aprovada.
- O link de pagamento respondeu com redirecionamento 302 para a Kiwify com `utm_source=whatsapp`, `utm_medium=recuperacao`, `utm_campaign=quiz-ml-recuperacao`, `utm_content=etapa-65`, `src=whatsapp-recuperacao` e `sck=rec-{codigo}`.
- O pedido inicial de preview retornou HTML sem registrar clique; o registro ocorre apenas no segundo pedido executado pelo navegador.
- Simulação da janela: `21:30` bloqueado; `08:00` permitido.
- O workflow de registro foi corrigido para criar linhas exclusivamente por `session_id`; eventos sem `session_id`, como compra, usam o telefone como fallback para a sessão mais recente.
- O agendador foi corrigido para tratar `recuperacao_tipo` como reserva, impedindo outra execução concorrente de selecionar a mesma sessão.
- Durante a execução de validação, antes da trava e enquanto havia execuções já em espera, houve repetição das mensagens A, B e C. As causas foram corrigidas e não há sessões elegíveis restantes, mas a prova limpa de ausência de duplicidade precisa ser repetida em outro número.
- Pendente: validar mensagem recebida com `fromMe=false`. O único número autorizado para teste é o mesmo número da instância remetente, portanto respostas para si próprio aparecem como `fromMe=true` e são corretamente ignoradas.
- `RECUPERACAO_MODO=teste` permanece ativo; nenhuma mudança para produção foi feita.
