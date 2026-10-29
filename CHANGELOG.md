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

## 2026-10-29 · Codex · capa integral com arte final
**O que mudou:** a primeira tela passou a usar a arte `Primeira venda no Mercado Livre em 48 horas.png` como fundo integral. A headline e o painel já presentes na imagem deixaram de ser duplicados no HTML visível. Foram mantidos em HTML apenas o subtítulo e o botão clicável, agora com o texto "QUERO VENDER EM 48 HORAS". No computador, a arte vertical fica centralizada com laterais azul-marinho.
**Arquivos:** `public/imagens/fundo/hero-capa-48h.webp`, `src/components/quiz.tsx`, `src/app/globals.css`, `ESPECIFICACAO.md`, `CHANGELOG.md`.
**Recursos externos criados/alterados:** nenhum nesta etapa local.
**Validação:** `npm run lint`, `npm run build`, capa conferida em 375×667 e 1440×900 e CTA testado até a tela de cadastro.
**Pendências:** publicar em produção.

## 2026-10-29 · Codex · substituição do print da capa
**O que mudou:** o print da capa foi substituído pela imagem `Painel SaaS com métricas financeiras.png` enviada pelo Nathan. O arquivo foi convertido para WebP em 1350×736 px, com qualidade 92, mantendo os valores visíveis e o peso final em aproximadamente 52 KB.
**Arquivos:** `public/imagens/prints-reais/capa-painel-30-dias.webp`, `src/config/prints-quiz.ts`, `ESPECIFICACAO.md`, `CHANGELOG.md`.
**Recursos externos criados/alterados:** nenhum nesta etapa local.
**Validação:** `npm run lint`, `npm run build` e enquadramento conferido em 375×667, com os dois valores legíveis dentro do card.
**Pendências:** publicar em produção.

## 2026-10-29 · Codex · refinamento de leitura da capa
**O que mudou:** a headline da Tela 1 passou a ocupar exatamente duas linhas, o brilho laranja central foi removido para aumentar o contraste e a legenda passou a ser "Print do meu painel de vendas".
**Arquivos:** `src/components/quiz.tsx`, `src/config/prints-quiz.ts`, `src/app/globals.css`, `ESPECIFICACAO.md`, `CHANGELOG.md`.
**Recursos externos criados/alterados:** nenhum nesta etapa local.
**Validação:** `npm run lint`, `npm run build` e medidas da headline conferidas em 375×667, com duas linhas de 335,2 px dentro da área útil.
**Pendências:** publicar em produção.

## 2026-10-29 · Codex · nova capa com promessa de primeira venda e print real
**O que mudou:** a Tela 1 foi refeita a partir da arte de referência enviada pelo Nathan. A nova capa usa a headline "Sua primeira venda no Mercado Livre em 48 horas", destaques amarelos, subtítulo sobre as cinco perguntas, brilho laranja central e botão amarelo. Os três cards de benefício foram removidos e o print real `capa-painel-30-dias.webp` voltou para a primeira tela com sua legenda original. A composição recebeu ajustes específicos para telas de até 720 px de altura.
**Arquivos:** `src/components/quiz.tsx`, `src/app/globals.css`, `ESPECIFICACAO.md`, `CHANGELOG.md`.
**Recursos externos criados/alterados:** nenhum nesta etapa local.
**Validação:** `npm run lint`, `npm run build` e fluxo do CTA conferido em 375×667.
**Pendências:** publicar em produção.

## 2026-10-29 · Codex · nova abordagem de recuperação da oferta
**O que mudou:** a mensagem automática `viu_oferta`, usada para leads nas etapas 60, 65 e 70, passou a contextualizar que a pessoa acessou a oferta e ainda não concluiu a compra. O texto oferece como bônus o acesso à comunidade de Mercado Livre do Nathan, informa que ela reúne mais de 400 pessoas e tem lives mensais, envia somente o link rastreado de pagamento e orienta a pessoa a mandar o comprovante para receber o convite. O link direto da comunidade foi removido dessa primeira abordagem. As mensagens A, B e D e todas as regras de elegibilidade, janela, limite diário e envio único foram preservadas.
**Arquivos:** `ESPECIFICACAO.md`, `RECURSOS.md`, `CHANGELOG.md`.
**Recursos externos criados/alterados:** workflow `NR · Agendador de recuperação` (`Znc53yNJVuRk9jRX`), publicado e ativo em produção; validação final com 10 nós, 9 conexões, zero erros e zero avisos.
**Pendências:** o convite da comunidade deve ser enviado manualmente após a conferência do comprovante recebido no WhatsApp.

## 2026-10-28 · Claude · planilha limpa, nova capa e novos valores
**O que mudou:**
- Planilha: a aba técnica `leads` foi renomeada para `controle` e segue com as 42 colunas usadas pelas automações. Foi criada a aba `Leads`, a primeira e única visível, montada por fórmula a partir de `controle`, com 15 colunas práticas: Cadastro, Nome, WhatsApp, Status, Parou em, Já vende, Faturamento, Pagaria (R$), Clicou no checkout, Comprou em, Pontos a aprender, WhatsApp enviado em, Respondeu em, Campanha e Anúncio. As datas aparecem como `dd/mm/aaaa hh:mm` no horário de Brasília (o ISO UTC fica em `controle`), o telefone aparece como `(11) 99999-9999` e os valores internos viram texto legível. A aba é ordenada da mais recente para a mais antiga e exclui testes (nome com "teste", telefone vazio, número da instância e número de teste). `controle`, `eventos` e `mensagens` ficaram ocultas. A planilha está em pt_BR, então a fórmula usa `;` como separador.
- Workflows `NR · Registro de leads`, `NR · Agendador de recuperação`, `NR · Mensagens recebidas` e `NR · Links de recuperação`: as referências `leads!` passaram para `controle!`, sem outra mudança de lógica. Validado: agendador e receptor rodando com sucesso, e um evento de teste gravado pelo `/api/events`.
- Datas de cadastro dos 9 leads reprocessados voltaram ao horário real, tirado das execuções com erro. O teste de 2026-10-29 02:17 UTC (nome "teste") também foi completado.
- Capa (Tela 1) refeita conforme o modelo enviado pelo Nathan: headline sem "sem quebrar nos primeiros 3 meses", novo subtítulo, 3 cards de benefício com ícone, botão com seta no fluxo da página, sem rótulo, sem print do painel e sem foto de fundo.
- Pergunta de valor (Tela 11B): opções passam a ser R$ 150, R$ 125, R$ 100 e R$ 97.
**Arquivos:** `src/components/quiz.tsx`, `src/app/globals.css`, `ESPECIFICACAO.md`, `RECURSOS.md`, `CHANGELOG.md`.
**Recursos externos criados/alterados:** planilha `NR · Diagnóstico ML · Leads` (abas `Leads` nova e `controle` renomeada); os 4 workflows NR citados. Workflows temporários de acesso à planilha criados e apagados.
**Pendências:** as pendências do registro de leads abaixo continuam valendo.

## 2026-10-28 · Claude · registro de leads destravado
**O que mudou:**
- Causa: a aba `eventos` atingiu o limite padrão de 1.000 linhas da grade do Google Sheets. O workflow `NR · Registro de leads` grava em endereço fixo (`eventos!A{n}:F{n}`) e passou a falhar com "exceeds grid limits" a partir de 2026-10-27 ~13:25 UTC. O site seguiu funcionando (o pixel e a CAPI disparavam), mas `/api/events` devolvia 502 e nada entrava na planilha: 127 execuções com erro, 9 cadastros e 2 compras sem registro, e a recuperação por WhatsApp não rodou para esses leads.
- Grade ampliada: `eventos` de 1.000 para 20.000 linhas e `leads` de 1.000 para 5.000, por um workflow temporário com a credencial Google Sheets já existente, apagado em seguida.
- Reprocessados 117 eventos recuperados das execuções com erro, em ordem cronológica, via `/api/events` (sem `/api/meta`, para não duplicar conversões). As repetições do webhook da Kiwify (6 por compra) entraram uma vez só. As 2 compras ficaram com `status=comprou`. Os leads reprocessados têm `criado_em` da data do reprocessamento; o horário original está no `dados_json` das execuções.
- A sessão de teste do Nathan (`4a17a6a5`, linha 43 de `leads`) foi reprocessada sem nome e telefone; não entra na recuperação.
**Arquivos:** `CHANGELOG.md`.
**Recursos externos criados/alterados:** planilha `NR · Diagnóstico ML · Leads` (grade e linhas reprocessadas). Workflow temporário `NR · TEMP aumentar linhas` criado e apagado. Nenhum workflow permanente foi alterado.
**Pendências:** trocar a gravação em endereço fixo por append (o limite volta perto de 20.000 linhas, uns 1.500 leads) e criar alerta de erro no n8n para o registro.

## 2026-10-26 · Claude · checkout pré-preenchido e tracking
**O que mudou:**
- Checkout pré-preenchido: o botão de pagamento do quiz e o link de recuperação `/p/{codigo}` passam `name` e `phone` (DDD + número) para a Kiwify, que preenche esses campos. Testado no checkout real.
- CAPI: todos os eventos levam telefone, nome, sobrenome, país, `external_id` (sessão), `fbp` e `fbc`, e não só o `Lead`. Sem cookie `_fbc`, ele é montado a partir do `fbclid`. `fbp` e `fbc` passam a ser gravados na planilha no cadastro.
- Venda ligada ao lead: o `sck` do checkout leva o `session_id` (quiz e recuperação). O webhook da Kiwify lê `TrackingParameters.sck` e manda `session_id` ao registro; sem sessão válida, o registro cai no telefone como antes.
- `src/app/api/meta/route.ts` reformatado (estava minificado).
**Arquivos:** `src/components/quiz.tsx`, `src/app/api/meta/route.ts`, `src/app/api/webhooks/kiwify/route.ts`, `src/app/p/[codigo]/route.ts`, `src/lib/recovery-links.ts`, `ESPECIFICACAO.md`, `RECURSOS.md`, `CHANGELOG.md`.
**Recursos externos criados/alterados:** workflow `NR · Links de recuperação` (`0pczy18HNqWoxWbs`) agora devolve `session_id`, `nome` e `telefone`; workflow `NR · Registro de leads` (`tm3Yl3j6e6gyxU6K`) procura pelo telefone quando um evento `comprou` traz `session_id` não encontrado. Os dois seguem ativos e compatíveis com o código anterior.
**Pendências:** conferir a qualidade de correspondência (EMQ) dos eventos no Gerenciador de Eventos depois de alguns dias; conferir na primeira venda real se a Kiwify devolveu o `sck` no webhook.

## 2026-10-24 · Codex · biblioteca permanente de assets
**O que mudou:** removidos prompts e copys temporários do lote encerrado; assets reutilizáveis separados em marca, Nathan, mockups ilustrativos, prints reais e capas de módulos; artes aprovadas arquivadas por lote e formato; criado catálogo com regras de uso e atualizadas as instruções dos agentes para manter a biblioteca organizada nos próximos trabalhos.
**Arquivos:** `../Biblioteca de Assets - Máquina de Vendas 2.0/CATALOGO.md`, `AGENTS.md`, `docs/PLANO-CRIATIVOS.md`, `CHANGELOG.md`.
**Recursos externos criados/alterados:** nenhum.
**Pendências:** nenhuma relativa à organização da biblioteca.

## 2026-10-24 · Codex · encerramento do lote 01 de criativos
**O que mudou:** consolidados os aprendizados do lote, registrada a regra de réplica entre 1:1 e 9:16 e documentado o mapeamento das sete artes quadradas recebidas. As artes foram movidas de Downloads para a pasta definitiva do lote com nomes padronizados.
**Arquivos:** `docs/PLANO-CRIATIVOS.md`, `../Biblioteca de Assets - Máquina de Vendas 2.0/06 - Artes Finais/Lote 01/1x1/*`, `CHANGELOG.md`.
**Recursos externos criados/alterados:** nenhum.
**Pendências:** o conceito 01, editorial minimalista, não apareceu entre os arquivos recebidos no encerramento.

## 2026-10-24 · Codex · copys do primeiro lote de anúncios
**O que mudou:** criadas cinco opções de título, descrição e texto principal para cada uma das oito linhas visuais do primeiro lote, totalizando 120 opções de copy. Os textos preservam a distinção entre prints reais e montagens ilustrativas e mantêm a oferta em R$ 47,90 ou 11x de R$ 5,32.
**Arquivos:** artefato temporário removido no encerramento; registro preservado no `CHANGELOG.md`.
**Recursos externos criados/alterados:** nenhum.
**Pendências:** gerar as artes, configurar os anúncios e registrar as combinações publicadas para comparar os resultados.

## 2026-10-24 · Codex · plano inicial de criativos
**O que mudou:** registradas as regras confirmadas para uso dos assets e definidas oito linhas de design substancialmente diferentes para testar o funil: editorial, interface de diagnóstico, prova em primeiro plano, autoridade, colagem, alerta operacional, produto digital premium e oferta direta.
**Arquivos:** `docs/PLANO-CRIATIVOS.md`, `CHANGELOG.md`.
**Recursos externos criados/alterados:** nenhum.
**Pendências:** produzir os prompts em 1:1 e 9:16 para cada linha e gerar o primeiro lote de artes.

## 2026-10-24 · Codex · preço atualizado para R$ 47,90
**O que mudou:** atualizado o preço do Máquina de Vendas 2.0 para R$ 47,90 à vista ou 11x de R$ 5,32; recalculado o equivalente diário para R$ 0,16 e ajustada a headline para "menos de R$ 0,17 por dia"; atualizados os fallbacks do componente, as variáveis documentadas e o inventário do checkout.
**Arquivos:** `src/components/quiz.tsx`, `.env.example`, `ESPECIFICACAO.md`, `RECURSOS.md`, `CHANGELOG.md`.
**Recursos externos criados/alterados:** variáveis de preço do projeto Vercel `nr-diagnostico-ml` em Production e Preview. Nenhum recurso GMN foi alterado.
**Pendências:** nenhuma relativa à atualização de preço.

## 2026-10-19 · Codex · opções de valor atualizadas
**O que mudou:** substituídas as respostas da pergunta "Quanto você pagaria pelo Máquina de Vendas?" por R$ 150, R$ 200, R$ 250 e R$ 300; mantidos o evento `RespondeuValor`, a persistência em `quanto_pagaria` e a personalização da tela de pagamento com o valor escolhido.
**Arquivos:** `src/components/quiz.tsx`, `ESPECIFICACAO.md`, `CHANGELOG.md`.
**Recursos externos criados/alterados:** deploy do projeto Vercel `nr-diagnostico-ml`. Nenhum recurso GMN foi alterado.
**Pendências:** nenhuma relativa às opções de valor.

## 2026-10-19 · Codex · preço atualizado para R$ 97
**O que mudou:** atualizado o preço do Máquina de Vendas 2.0 para R$ 97 à vista ou 12x de R$ 10,03; recalculado o equivalente diário para R$ 0,33 e ajustada a headline para "menos de R$ 1 por dia"; centralizados no ambiente também a quantidade de parcelas e o valor diário exibido, removendo os fallbacks antigos do componente.
**Arquivos:** `src/components/quiz.tsx`, `.env.example`, `.env.local` (não versionado), `ESPECIFICACAO.md`, `RECURSOS.md`, `CHANGELOG.md`.
**Recursos externos criados/alterados:** variáveis de preço do projeto Vercel `nr-diagnostico-ml` em Production e Preview. Nenhum recurso GMN foi alterado.
**Pendências:** nenhuma relativa à atualização de preço.

## 2026-10-16 · Codex · captura de valor corrigida
**O que mudou:** adicionada a coluna `quanto_pagaria` à aba `leads`; atualizado o workflow `NR · Registro de leads` para ler e gravar até a coluna AP; corrigida a trava de sessão no navegador para que cada `session_id` registre sua própria resposta de valor; o valor agora é reenviado também nos eventos `pagamento` e `clique_checkout`, criando redundância caso o evento original da pergunta falhe; validado o fluxo completo com uma sessão sintética de R$ 1.000, confirmando etapa 62 e persistência na coluna, e removidos em seguida somente o lead e o evento sintéticos criados pela validação.
**Arquivos:** `src/components/quiz.tsx`, `RECURSOS.md`, `CHANGELOG.md`.
**Recursos externos criados/alterados:** planilha `NR · Diagnóstico ML · Leads` e workflow `NR · Registro de leads` (`tm3Yl3j6e6gyxU6K`). Nenhum recurso GMN foi alterado.
**Pendências:** as respostas históricas existentes continuam disponíveis em `eventos.dados_json`; os leads atuais que passaram ao pagamento antes da correção não possuem o valor em nenhum evento, portanto não podem ser preenchidos retroativamente sem inventar dados.

## 2026-10-15 · Codex · webhook Kiwify validado
**O que mudou:** confirmado o teste oficial de Compra aprovada enviado pelo painel Kiwify; a assinatura HMAC-SHA1 foi aceita pela rota de produção, o evento foi encaminhado ao workflow `NR · Registro de leads` e gravado com `status=comprou` e `etapa_max=80`.
**Arquivos:** `RECURSOS.md`, `CHANGELOG.md`.
**Recursos externos criados/alterados:** webhook `NR · Compra aprovada` ativo; execução n8n `103665` concluída com sucesso; exemplo da Kiwify registrado em `leads!A90:AO90` e `eventos!A564:F564`. Nenhum recurso GMN foi alterado.
**Pendências:** decidir se as duas linhas do teste oficial devem ser preservadas ou removidas; `META_TEST_EVENT_CODE` para validação visual no Gerenciador de Eventos.

## 2026-10-15 · Codex · preparação do webhook Kiwify
**O que mudou:** corrigido o endpoint Kiwify para o payload oficial (`webhook_event_type`, `order_status` e `Customer.mobile`); configurado fora do código o token oficial gerado pela Kiwify, em Production, Preview e `.env.local`; adicionada validação HMAC-SHA1 da assinatura sobre o corpo bruto com comparação em tempo constante; sincronizadas no Preview as variáveis que ainda existiam apenas em Production; mantida a regra de não enviar `Purchase` novamente ao Meta.
**Arquivos:** `src/app/api/webhooks/kiwify/route.ts`, `.env.local` (não versionado), `ESPECIFICACAO.md`, `RECURSOS.md`, `CHANGELOG.md`.
**Recursos externos criados/alterados:** variáveis do projeto Vercel `nr-diagnostico-ml`. Nenhum recurso GMN foi alterado.
**Pendências:** cadastrar `NR · Compra aprovada` em `Apps → Webhooks` no painel autenticado da Kiwify, selecionar o produto Máquina de Vendas 2.0 e o evento Compra aprovada; `META_TEST_EVENT_CODE` para validação visual no Gerenciador de Eventos.

## 2026-10-15 · Codex · recuperação liberada para produção
**O que mudou:** alterado `RECUPERACAO_MODO` de `teste` para `producao` no workflow `NR · Agendador de recuperação`, na Vercel (Production e Preview) e no ambiente local, após autorização expressa; preservadas a janela de 08h–21h, o limite de 60 envios por dia e a trava de envio único por telefone; para impedir que a base histórica de QA entre na fila, produção passou a considerar somente leads criados após `2026-10-15T14:43:00Z` e também ignora nomes com `Teste`; no intervalo entre a ativação e a aplicação do corte, um número fictício foi recusado sem entrega e três mensagens genéricas foram aceitas pela Evolution para números placeholder antigos, sem dados sensíveis; corrigidas duas violações de `react-hooks/set-state-in-effect` na restauração da sessão e no controle dos CTAs fixos.
**Arquivos:** `src/components/quiz.tsx`, `.env.local` (não versionado), `AGENTS.md`, `ESPECIFICACAO.md`, `RECURSOS.md`, `CHANGELOG.md`.
**Recursos externos criados/alterados:** workflow `NR · Agendador de recuperação`; variável `RECUPERACAO_MODO` do projeto Vercel `nr-diagnostico-ml`. Nenhum recurso GMN foi alterado.
**Pendências:** `META_TEST_EVENT_CODE` para validação visual no Gerenciador de Eventos; `KIWIFY_WEBHOOK_TOKEN` para confirmação automática de compras; completar as variáveis não críticas do ambiente Preview.

## 2026-10-15 · Codex · validação da resposta WhatsApp
**O que mudou:** validada a resposta real “Tudo certo” enviada pelo número externo de teste; corrigido o reconhecimento de conversas que a Evolution entrega por `@lid`, usando também `remoteJidAlt`; o receptor passou a processar todas as conversas pendentes do ciclo e cancelou corretamente as quatro recuperações ligadas ao telefone; os registros de mensagens enviadas e recebidas agora usam `values.append`, com as gravações simultâneas consolidadas em uma única operação para evitar colisões.
**Arquivos:** `CHANGELOG.md`, `RECURSOS.md`.
**Recursos externos criados/alterados:** workflows `NR · Mensagens recebidas` e `NR · Agendador de recuperação`; planilha `NR · Diagnóstico ML · Leads`. Nenhum recurso GMN e nenhuma configuração da instância Evolution foram alterados.
**Pendências:** recuperação permanece em `RECUPERACAO_MODO=teste`; mudança para produção depende de aprovação expressa. `META_TEST_EVENT_CODE` e `KIWIFY_WEBHOOK_TOKEN` continuam pendentes.

## 2026-10-15 · Codex · rodada limpa WhatsApp
**O que mudou:** executado teste A/B/C/D no número externo autorizado, mantendo `RECUPERACAO_MODO=teste`; atualizada a allowlist local e da Vercel; criadas quatro sessões isoladas nas linhas 86–89; confirmados quatro envios únicos na Evolution, um por código, sem duplicidade; corrigida colisão concorrente do log da aba `mensagens`, que agora usa uma linha determinística por sessão/lead.
**Arquivos:** `.env.local` (não versionado), `CHANGELOG.md`, `docs/rodada-recuperacao.md`.
**Recursos externos criados/alterados:** variável sensível `RECUPERACAO_TELEFONES_TESTE` na Vercel; workflow `NR · Agendador de recuperação`; planilha `NR · Diagnóstico ML · Leads`. Nenhum recurso GMN foi alterado.
**Pendências:** aguardar uma resposta enviada pelo aparelho de teste para validar o fluxo `fromMe=false` e a marcação `recuperado`.

## 2026-10-15 · Codex
**O que mudou:** concluída a rodada técnica da Fase 5 em modo de teste; corrigido `NR · Registro de leads` para nunca reutilizar por telefone uma linha quando existe `session_id`; executados os cenários A, B, C e D nas linhas 82–85; ativados e validados `NR · Agendador de recuperação` e `NR · Mensagens recebidas`; corrigidos o registro final do envio e a trava de reserva contra disparos concorrentes; desativado o preview de link na Evolution; as rotas `/c/{codigo}` e `/p/{codigo}` agora usam um redirecionamento executado pelo navegador para que o crawler de preview do WhatsApp não seja contado como clique; links de comunidade e pagamento testados, incluindo UTMs do checkout; janela simulada com 21:30 bloqueado e 08:00 permitido.
**Arquivos:** `src/app/c/[codigo]/route.ts`, `src/app/p/[codigo]/route.ts`, `ESPECIFICACAO.md`, `RECURSOS.md`, `CHANGELOG.md`, `docs/rodada-recuperacao.md`.
**Recursos externos criados/alterados:** workflows NR `Registro de leads`, `Agendador de recuperação`, `Mensagens recebidas` e `Links de recuperação`; planilha `NR · Diagnóstico ML · Leads`; deploy Vercel `dpl_F7fAvygGxMiTuqEBjw2pjLMVugm8`. Nenhum recurso GMN e nenhuma configuração da instância Evolution foram alterados.
**Pendências:** repetir a prova de ausência de duplicidade em um número externo limpo (a execução inicial gerou repetições A/B/C antes das correções) e testar resposta recebida (`fromMe=false`); o número informado para teste é o mesmo da instância remetente e não permite validar resposta externa. Produção continua bloqueada até aprovação expressa.

## 2026-10-14 · Codex
**O que mudou:** iniciada a Fase 5 em modo de teste; lida e documentada sem alterações a configuração da instância existente `Nathan`; removido o áudio comercial; adicionadas as rotas rastreadas `/c/{codigo}` e `/p/{codigo}`; adicionadas as colunas `codigo_curto`, `clicou_comunidade_em` e `clicou_pagamento_wpp_em`; criado o workflow ativo `NR · Links de recuperação`; criados e validados `NR · Agendador de recuperação` e `NR · Mensagens recebidas`; configuradas as variáveis locais e da Vercel para Production e Preview, mantendo `RECUPERACAO_MODO=teste`.
**Arquivos:** `src/app/c/[codigo]/route.ts`, `src/app/p/[codigo]/route.ts`, `src/lib/recovery-links.ts`, `.env.example`, `AGENTS.md`, `ESPECIFICACAO.md`, `RECURSOS.md`, `CHANGELOG.md`, `docs/rodada-recuperacao.md`.
**Recursos externos criados/alterados:** planilha `NR · Diagnóstico ML · Leads`; workflows `NR · Registro de leads` e `NR · Links de recuperação`; workflows novos `NR · Agendador de recuperação` e `NR · Mensagens recebidas`; credencial nova `NR · Evolution Nathan · API Key`; variáveis do projeto Vercel `nr-diagnostico-ml`. Nenhum workflow, webhook, setting ou recurso GMN foi alterado.
**Pendências:** executar e revisar os quatro testes A/B/C/D, validar resposta recebida por um número diferente da própria instância, validar janela das 21:30 e obter aprovação antes de mudar para produção.

## 2026-10-14 11:25 · Antigravity
**O que mudou:** rodada final de otimização mobile para anúncios e navegadores in-app (Instagram, Facebook e WhatsApp WebViews, Android e iOS):
- **Capa (Tela 1):** nova estrutura compacta sem rolagem em 375×667 — rótulo "DIAGNÓSTICO GRATUITO" encostado no topo, headline 30 px (`clamp(26px, 8vw, 34px)` font-black), subtítulo 16 px, print do painel com `max-height: 30dvh` e legenda externa; barra fixa no rodapé com fundo `#0A0F1C`, degradê suave, botão FAZER O DIAGNÓSTICO de 56 px de altura, texto "Leva menos de 1 minuto" (12 px) e safe-area insets.
- **Barras Fixas:** barra fixa permanente no rodapé no Diagnóstico e Tela M; barra fixa inteligente com `IntersectionObserver` nas Telas 11 e 12 que aparece apenas quando o botão do conteúdo sai da viewport e se esconde quando outro botão igual entra na tela.
- **Cadastro (Tela 2):** campos com fonte 16 px (previne zoom indesejado no iOS Safari); máscara em tempo real para WhatsApp `(11) 9XXXX-XXXX`; mensagens de validação inline exibidas abaixo de cada campo; botão posicionado no fluxo com `scrollIntoView` para visibilidade contínua com teclado aberto.
- **Navegação e Histórico:** integração com `history.pushState` e `popstate` para suporte completo ao botão voltar do Android e gesto de voltar do iPhone, retornando à etapa anterior sem recarregar nem sair do quiz; persistência e recuperação de sessão no `sessionStorage` (`nr_quiz_state`).
- **WebViews e In-App Browsers:** detecção de navegadores in-app de redes sociais com redirecionamento de checkout Kiwify na mesma aba (`window.location.href`), contornando bloqueios de nova aba e preservando parâmetros UTM/fbclid; envio de eventos via `navigator.sendBeacon` com fallback para `fetch` com `keepalive`; `playsinline=1` no vídeo; tratamento resiliente de Web Audio API contra restrições de autoplay.
- **Alvos de Toque e Tipografia:** todos os alvos de toque ajustados para $\ge$ 48 px (cards, "Voltar", setas, pontos de carrossel); texto corrido $\ge$ 16 px e rótulos/legendas $\ge$ 12 px; contraste de `--muted` (`#B8C0D9`) ajustado para WCAG AA (4,8:1); eliminação de qualquer rolagem horizontal em 360 px, 375 px, 390 px e 430 px.
- **Auditoria e Aceite:** 10 critérios da seção 5 integralmente aprovados e documentados em `docs/rodada-mobile.md` e `ESPECIFICACAO.md` (seção 6).
**Arquivos:** `src/components/quiz.tsx`, `src/app/globals.css`, `src/app/layout.tsx`, `docs/rodada-mobile.md`, `ESPECIFICACAO.md`, `CHANGELOG.md`.
**Recursos externos criados/alterados:** nenhum. Todos os recursos usam prefixo `NR`.
**Pendências:** nenhuma.

## 2026-10-13 23:45 · Antigravity
**O que mudou:** ajustes nos prints reais do quiz (Capa e Perguntas P1 a P5):
- **Tela 1 (Capa):** remoção do logo do curso da capa; inserção do novo print reto `capa-painel-30-dias.webp` (900×494, sem rotação/transform) no lugar do logo; nova ordem de elementos: rótulo DIAGNÓSTICO GRATUITO → print → headline → subtítulo → botão FAZER O DIAGNÓSTICO; remoção do chip sobre a imagem e adição de legenda externa logo abaixo do card (12 px, `--muted`, ponto amarelo antes e "R$ 104 mil" em amarelo); remoção do arquivo `capa-480k-faturamento-30-dias.webp`.
- **Telas 5 a 9 (Perguntas):** substituição de todas as imagens pelo novo formato recortado 860×351 (~2,45:1), exibidas inteiras sem corte (`object-fit: contain` / natural aspect ratio) e remoção dos chips de sobreposição, substituídos por legenda externa logo abaixo de cada card com texto 12 px em `--muted` precedido por ponto amarelo; atualização das imagens e legendas (P1: `p1-produto-campeao-chocadeira.webp`, P2: `p2-fornecedores-nacionais.webp`, P3: `p3-lucro-margem-20.webp` com legenda "Margem de 20% acompanhada no painel", P4: `p4-campanhas-roas-receita.webp`, P5: `p5-roas-retorno-investimento.webp`); remoção do arquivo depreciado `p3-painel-lucro-margem.webp`.
- **Responsividade e Aceite em 375×667:** botão da capa e as 3 opções de cada pergunta visíveis sem qualquer rolagem; transição entre perguntas mantida em até 200 ms via pré-carregamento.
- Atualização de `src/config/prints-quiz.ts`, `src/components/quiz.tsx`, `src/app/globals.css`, `ESPECIFICACAO.md` (seções 5 e 6) e changelog.
**Arquivos:** `src/config/prints-quiz.ts`, `src/components/quiz.tsx`, `src/app/globals.css`, `ESPECIFICACAO.md`, `CHANGELOG.md`, `public/imagens/prints-reais/*`.
**Recursos externos criados/alterados:** nenhum. Todos os recursos usam prefixo `NR`.
**Pendências:** nenhuma.

## 2026-10-13 23:05 · Antigravity
**O que mudou:** inserção de prints reais no quiz (Capa e Perguntas P1 a P5):
- Criação do módulo de configuração isolado `src/config/prints-quiz.ts` mapeando arquivo, legenda com chip, destaque amarelo, alt descritivo e alinhamento de imagem.
- **Tela 1 (Capa):** print do painel de faturamento (`capa-480k-faturamento-30-dias.webp`) posicionado entre o subtítulo e o botão de ação em card com cantos de 16 px, borda amarela fina, brilho suave (`box-shadow`), leve inclinação de -2° e chip com legenda "Painel real: R$ 480 mil em 30 dias" ("R$ 480 mil" em amarelo). Altura máxima de 190 px, otimizada para manter o botão 100% visível sem rolagem em viewports compactos (375×667).
- **Tela 2 (Cadastro):** mantida limpa e sem imagem, focada exclusivamente na captura de nome e WhatsApp.
- **Telas 5 a 9 (Perguntas P1 a P5):** prints reais posicionados imediatamente acima do título da pergunta com cantos de 14 px, borda `--border`, chip de legenda no canto inferior esquerdo e `object-position: top` na P2 (fornecedores nacionais). As 3 opções de resposta permanecem visíveis sem rolagem em 375×667.
- **Pré-carregamento e animação:** pré-carregamento contínuo em background da próxima imagem garantindo troca instantânea (< 200 ms); leve animação de entrada com fade e subida de 8 px (200 ms) junto com a pergunta; respeito integral a `prefers-reduced-motion` (desativação de inclinação e animações).
- Atualização das seções 5 e 6 de `ESPECIFICACAO.md`, documentação em `docs/rodada-antigravity-prints.md` e changelog.
**Arquivos:** `src/config/prints-quiz.ts`, `src/components/quiz.tsx`, `src/app/globals.css`, `ESPECIFICACAO.md`, `CHANGELOG.md`, `docs/rodada-antigravity-prints.md`.
**Recursos externos criados/alterados:** nenhum. Todos os recursos usam prefixo `NR`.
**Pendências:** nenhuma.

## 2026-10-13 22:48 · Antigravity
**O que mudou:** ajuste na headline da Tela 12 (Pagamento):
- Nova redação com resposta da pergunta de valor: "Você disse que pagaria R$&nbsp;{valor}, mas o curso sai por menos de R$&nbsp;2 por dia" ("menos de R$&nbsp;2 por dia" em amarelo), válida para as 4 opções (R$ 1.500, R$ 1.000, R$ 600, R$ 300).
- Nova redação sem resposta: "O curso completo sai por menos de R$&nbsp;2 por dia" (mesmo destaque).
- Inserção de espaço não separável (`&nbsp;`) entre "R$" e o valor monetário e dentro de "R$&nbsp;2", impedindo a quebra de linha órfã do cifrão em telas estreitas (375 px).
- Atualização da seção 5 de `ESPECIFICACAO.md` e changelog.
**Arquivos:** `src/components/quiz.tsx`, `ESPECIFICACAO.md`, `CHANGELOG.md`.
**Recursos externos criados/alterados:** nenhum. Todos os recursos usam prefixo `NR`.
**Pendências:** nenhuma.

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
