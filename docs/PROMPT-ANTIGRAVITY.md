# MISSÃO

Você vai executar uma rodada de ajustes no quiz de diagnóstico do curso **Máquina de Vendas 2.0** (Nathan Ritter), já publicado na Vercel a partir do repositório `nr-diagnostico-ml`. O trabalho só termina quando todos os critérios de aceite da seção 7 estiverem cumpridos, testados no celular e publicados.

Trabalhe de forma autônoma. Tome as decisões técnicas sozinho, sempre a favor de velocidade de carregamento, clareza no celular e conversão. Só pare para perguntar nos casos listados na seção 2.

---

# 1. CONTEXTO

## O produto
- Funil: anúncio no Meta → quiz de 5 perguntas sobre vender no Mercado Livre → diagnóstico com os pontos a estudar → página do curso → página de pagamento → checkout Kiwify.
- Quem já vende e fatura acima de R$ 30 mil/mês vai para a rota da mentoria (Tela M).
- Curso: Máquina de Vendas 2.0, R$ 297 à vista ou 12x de R$ 30,72 na Kiwify. Checkout: https://pay.kiwify.com.br/InK3eLE

## Fontes de verdade no repositório (leia antes de qualquer alteração)
1. `AGENTS.md`: regras para todos os agentes
2. `ESPECIFICACAO.md`: regras de produto, telas, eventos, planilha
3. `CHANGELOG.md`: o que já foi feito e por quem
4. `RECURSOS.md`: recursos externos que pertencem ao projeto

O projeto já foi trabalhado pelo Codex. Leia o último bloco do CHANGELOG para saber o estado atual e não desfazer trabalho anterior.

## Stack
Next.js (App Router) + Tailwind na Vercel. Dados vão para um webhook do n8n, que grava na planilha Google `NR · Diagnóstico ML · Leads`. Rastreio por Meta Pixel + API de Conversões com o mesmo `event_id`.

---

# 2. REGRAS INEGOCIÁVEIS

1. **Isolamento.** Nada do funil Google Meu Negócio (Notake) pode ser alterado: repositório, projeto Vercel, planilha, workflows n8n, credenciais, instância Evolution, pixel, variáveis, webhooks, DNS. Todo recurso deste projeto tem prefixo `NR`. Antes de agir sobre qualquer recurso externo, confirme que ele tem prefixo `NR` e está no `RECURSOS.md`. Se não estiver, pare e pergunte.
2. **Segredos.** Nunca escreva tokens ou segredos em arquivo versionado, log, CHANGELOG ou mensagem de commit.
3. **Textos.** Use exatamente os textos desta tarefa. Textos de telas não citadas aqui continuam como estão.
4. **Registro.** Toda alteração entra no `CHANGELOG.md` (agente: `Antigravity`) e toda mudança de regra entra na `ESPECIFICACAO.md`. Adicione `Antigravity` à lista de agentes do `AGENTS.md`.
5. **Recuperação por WhatsApp** continua desligada (`RECUPERACAO_ATIVA=false`).
6. **Pare e pergunte** somente se: precisar alterar algo sem prefixo `NR`; precisar de uma credencial que não existe; ou um critério de aceite for impossível sem mudar uma regra da especificação.

---

# 3. MODO DE TRABALHO: TRÊS AGENTES EM CICLO

Opere como três papéis em sequência. Escreva o resultado de cada papel em `docs/rodada-antigravity.md` (crie o arquivo), para eu acompanhar.

## Agente 1 · Planejador
- Lê os 4 arquivos de contexto e o código atual das telas envolvidas.
- Mapeia cada item da seção 4 para arquivos e componentes concretos.
- Identifica riscos (evento duplicado, etapa_max regredindo, quebra de layout, perda de UTM) e como evitá-los.
- Entrega um plano numerado, com ordem de execução e o critério de aceite que fecha cada passo.

## Agente 2 · Executor
- Cria a branch `ajustes-oferta-checkout`.
- Implementa o plano passo a passo, um commit por passo (`tipo: descrição`, em português).
- Não altera nada fora do escopo do plano. Se descobrir algo necessário fora do plano, devolve para o Planejador antes de seguir.

## Agente 3 · Revisor
Revisa como se não tivesse escrito o código:
- Roda lint, typecheck e build.
- Testa no navegador em 375 px e 1280 px as rotas: curso (com pontos a estudar), "sim em tudo" e mentoria.
- Confere cada critério da seção 7, um por um, marcando OK ou FALHOU com evidência (print ou descrição do teste).
- Mede o tempo entre o toque na resposta e a próxima pergunta aparecer.
- Confere no Gerenciador de Eventos (com `META_TEST_EVENT_CODE`) que cada evento aparece uma vez.
- Lê os textos da tela e confere letra por letra com esta tarefa.

Se qualquer item FALHAR, o ciclo volta ao Executor com a lista de falhas. Repita até tudo estar OK. Só então faça merge na `main`, publique na Vercel e confira a URL de produção.

---

# 4. TAREFAS

## 4.1 Remover o aviso de rodapé
Remover de todas as telas o texto "Este produto não garante resultados financeiros. Os depoimentos refletem experiências individuais." e o componente que o renderiza, se não for usado em outro lugar.

## 4.2 Velocidade entre perguntas
Hoje há demora entre o toque na resposta e a próxima pergunta. Meta: a próxima pergunta aparece em até 200 ms após o toque, no celular.
- Feedback visual imediato no card tocado (borda e ícone amarelos no mesmo frame).
- Avanço em ~150 ms, sem esperar nenhuma requisição.
- Envio de eventos (planilha via n8n, Pixel, CAPI) sem bloquear a navegação: dispare em segundo plano (fila local, `fetch` com `keepalive` ou `sendBeacon`). Se uma requisição falhar, tente de novo em segundo plano sem travar a tela.
- Evitar re-render pesado entre perguntas; pré-carregar a próxima tela e as imagens que ela usa.
- Garantir que um toque duplo não registre a resposta duas vezes nem pule uma pergunta.

## 4.3 Tela 10 · Diagnóstico
- Aumentar o espaço entre o último parágrafo e o botão para no mínimo 32 px.
- Texto do botão (nos dois casos, com pontos e "sim em tudo"): **QUERO O CURSO MÁQUINA DE VENDAS**

## 4.4 Tela 11 · Página do curso (sem preço)
Esta tela passa a apresentar o curso, sem nenhum valor ou condição de pagamento.

Remover desta tela: card de preço, "por dia", à vista, cadeado de pagamento, barra fixa de preço, card de garantia e FAQ.

Nova ordem:

**1. Rótulo:** SEU PRÓXIMO PASSO
**Título:** Em quais módulos você vai focar para melhorar os pontos do seu diagnóstico
(destacar "pontos do seu diagnóstico" em amarelo)

**2. Blocos por ponto.** Mostrar só os pontos que a pessoa marcou como "Mais ou menos" ou "Não sei", na ordem das perguntas. Cada bloco é um card com:
- selo amarelo com o módulo (ex.: "MÓDULO 05")
- o ponto do diagnóstico em branco, negrito
- o texto de como aprender, em `--muted`

Guarde o mapeamento num arquivo de configuração único (`src/config/diagnostico-modulos.ts`) para ser editado sem mexer nos componentes.

| Pergunta | Selo | Ponto | Como aprender |
|---|---|---|---|
| P1 | MÓDULO 05 · PRODUTO CAMPEÃO | Como encontrar produtos com procura e pouca concorrência | Você aprende a ler a busca do Mercado Livre para achar produtos que já vendem e ainda têm poucos vendedores bem posicionados. Também vê como descartar os que só competem por preço, antes de comprar a primeira unidade. |
| P2 | MÓDULO 05 · PRODUTO CAMPEÃO | Como encontrar fornecedores nacionais confiáveis | O Nathan mostra onde procura fornecedores no Brasil, como negocia o primeiro pedido e como testar o fornecedor com pouca quantidade antes de fechar um volume maior. |
| P3 | MÓDULO 02 · O ESSENCIAL PARA COMEÇAR | Como calcular a margem antes de vender | Antes de anunciar, você monta a conta do produto com custo, tarifa do Mercado Livre, frete, imposto e embalagem. Com ela pronta, sabe quanto sobra em cada venda e qual é o menor preço que ainda dá lucro. |
| P4 | MÓDULOS 06 E 07 · ANÚNCIO E RANQUEAMENTO | Como montar anúncios que aparecem na busca | No Módulo 06 você monta título, fotos e ficha técnica do jeito que o Mercado Livre usa para exibir o anúncio na busca. No 07, aprende o que faz o anúncio subir de posição depois das primeiras vendas. |
| P5 | MÓDULOS 03 E 04 · PRIMEIRA VENDA E LOGÍSTICA | Como planejar o investimento inicial e o giro de estoque | Você começa com estoque pequeno, valida se o produto gira e só então repõe em maior quantidade. Assim o dinheiro não fica parado em caixa no depósito enquanto o produto não vende. |

Caso "Sim" em todas: título "Os módulos que vão aprofundar o que você já sabe" e três blocos:
| Selo | Texto |
|---|---|
| MÓDULO 07 · ESTRATÉGIA PARA RANQUEAR | O que faz um anúncio que já vende ganhar posição e ficar entre os primeiros da busca. |
| MÓDULO 08 · DOMINANDO ADS | Como usar os anúncios pagos dentro do Mercado Livre para escalar sem queimar caixa. |
| MÓDULO 10 · CRESÇA RÁPIDO | Como aumentar o volume de vendas sem perder o controle da operação e do caixa. |

**3. O que você recebe** (lista com check amarelo):
- 10 módulos, do primeiro passo à escala
- 1 ano de acesso para assistir no seu ritmo
- Aulas novas quando o algoritmo e as regras do Mercado Livre mudam
- Suporte para dúvidas sobre o conteúdo

**4. Carrossel de módulos** "Os 10 módulos do curso", agora com as **capas originais da área de membros da Kiwify** (anexo `capas-modulos-kiwify.zip`, descompactar em `public/imagens/modulos-kiwify/`):
- Substituir as capas atuais (vindas da página de vendas) pelas novas, na ordem 01 a 10.
- As capas já trazem número, título e a marca Máquina de Vendas. Exibir a imagem como está, proporção 2:3, cantos arredondados, **sem** selo "MÓDULO XX", título, barra amarela ou degradê por cima.
- Manter o título do módulo no `alt` de cada imagem, para acessibilidade.
- Tamanho do card: cerca de 62% da largura no celular (mostrando a ponta do próximo) e 3 cards visíveis no desktop.
- Remover os arquivos antigos de `public/imagens/modulos/` se não forem usados em mais nenhum lugar.
- Usar as mesmas capas como miniatura no selo de cada bloco da seção 2 (imagem pequena, 48×72 px, à esquerda do card), para a pessoa reconhecer o módulo quando chegar ao carrossel.

**5. Carrossel de provas** "Resultados de quem aplica o método do Nathan" (manter como está).

**6. Quem ensina** (manter como está).

**7. Botão:** QUERO O CURSO MÁQUINA DE VENDAS → leva para a Tela 12. Repetir o botão também logo após o bloco 2.

## 4.5 Tela 12 · Pagamento (nova)
Tela curta, focada só em pagar. Logo pequeno no topo.

**1. Rótulo:** ÚLTIMO PASSO
**Título:** Seu acesso ao Máquina de Vendas 2.0 ("Máquina de Vendas 2.0" em amarelo)

**2. Frase antes do card**, centralizada, em branco, tamanho de subtítulo:
"Tudo isso fica por menos de R$ {NEXT_PUBLIC_PRECO_DIA_TEXTO} por dia."
Crie a variável `NEXT_PUBLIC_PRECO_DIA_TEXTO` com valor `2` (resultado: "menos de R$ 2 por dia").

**3. Card de preço** (fundo e borda do card de oferta atual):
- Logo do curso no topo do card (como já está)
- Preço em **uma única linha**, sem quebra em 375 px: "12x de" em tamanho pequeno (cerca de 40% do valor), branco; "R$ 30,72" grande, amarelo, font-black. Use `white-space: nowrap` e ajuste o tamanho da fonte com `clamp()` para caber.
- Abaixo, pequeno e em cinza: "ou R$ 297 à vista"
- Botão: **QUERO PAGAR AGORA**
- Abaixo do botão: cadeado + "Acesso imediato após pagamento"

**4.** Sem garantia, sem FAQ, sem aviso de rodapé.

**Comportamento:**
- O botão QUERO PAGAR AGORA dispara `CliqueCheckout` (Pixel + CAPI, mesmo `event_id`), grava `clicou_checkout_em` e abre https://pay.kiwify.com.br/InK3eLE repassando utm_*, src, sck, fbclid e gclid.
- Ao abrir a Tela 12, disparar o evento personalizado `ViuPagamento` e gravar `viu_pagamento_em`.
- O link antigo `h1XRfXi` não pode aparecer em lugar nenhum.

## 4.6 Etapas, planilha e recuperação
- Nova etapa `pagamento` = 65 (entre `oferta` 60 e `clique_checkout` 70). Atualize a tabela de etapas da ESPECIFICACAO.md.
- Nova coluna `viu_pagamento_em` na aba `leads` da planilha e no workflow `NR · Registro de leads` do n8n (só esse workflow).
- A recuperação `viu_oferta` passa a cobrir as etapas 60, 65 e 70.

## 4.7 Prova social na Tela 12 (somente vendas reais)
O curso já tem 177 vendas reais nesta oferta. O último comprador registrado foi Marcos Castro. Mostre só o que aconteceu: nada de vendas simuladas, nomes inventados, intervalos aleatórios ou contador que sobe sozinho ao abrir a página.

**Contador de alunos** (logo abaixo do título da Tela 12):
- Texto: "🔥 {TOTAL} pessoas já compraram o Máquina de Vendas", com o número em amarelo.
- TOTAL = `VENDAS_BASE` + compras aprovadas registradas pelo webhook da Kiwify depois da data `VENDAS_BASE_DATA`.
- Variáveis: `VENDAS_BASE=177` e `VENDAS_BASE_DATA=2026-10-13`.
- Enquanto o webhook não estiver ativo, o contador mostra 177 fixo.
- O número aparece já com o valor certo, sem animação de 176 para 177 nem qualquer incremento que não venha de uma compra real.

**Último aluno** (aviso discreto no canto inferior, aparece uma vez, 3 s depois de a página abrir, e some após 6 s):
- Texto: "{Primeiro nome} {inicial do sobrenome}. entrou no Máquina de Vendas" → hoje: "Marcos C. entrou no Máquina de Vendas"
- Use só primeiro nome e inicial do sobrenome, nunca o nome completo.
- Sem "agora" ou "há X min" enquanto a data da compra não vier do webhook. Quando vier, acrescente "· há {tempo}" calculado a partir da data real.
- Quando o webhook estiver ativo, o aviso passa a mostrar o comprador mais recente da planilha. Se houver várias compras nas últimas 24 h, pode alternar entre elas (no máximo 3, uma a cada 8 s), sempre com dados reais.
- Variáveis: `ULTIMO_COMPRADOR_BASE="Marcos C."` (usado só até existir compra registrada pelo webhook).

**Fonte dos dados:** a contagem e o último comprador vêm de uma API Route que lê a planilha (via n8n), com cache de 60 s. Se a leitura falhar, mostrar os valores base, nunca um número estimado.

---

# 5. O QUE NÃO MUDAR
- Telas 1 a 9, Tela M (exceto o aviso de rodapé), rastreio existente, regras de etapa_max, workflow de registro (exceto a coluna nova), imagens e carrosséis.
- Cores, fonte Sora e componentes visuais atuais.

---

# 6. REGISTRO
- `ESPECIFICACAO.md`: seções 3 (variáveis VENDAS_BASE, VENDAS_BASE_DATA, ULTIMO_COMPRADOR_BASE), 4 (fluxo com a Tela 12), 5 (textos das Telas 10, 11 e 12, incluindo a prova social), 7 (evento ViuPagamento), 9 (coluna nova), 10 (etapas da recuperação).
- `CHANGELOG.md`: um bloco desta rodada, agente `Antigravity`.
- `AGENTS.md`: incluir Antigravity como agente do projeto.
- `docs/rodada-antigravity.md`: plano, execução e revisão.

---

# 7. CRITÉRIOS DE ACEITE

1. Nenhuma tela mostra o aviso de rodapé.
2. Da resposta à próxima pergunta: até 200 ms no celular, sem toque duplo registrando duas vezes.
3. Tela 10: botão "QUERO O CURSO MÁQUINA DE VENDAS" com pelo menos 32 px de distância do texto.
4. Tela 11: título novo, um bloco por ponto marcado (miniatura da capa + módulo + ponto + como aprender), caso "sim em tudo" com os 3 módulos, carrossel com as 10 capas originais da Kiwify sem sobreposição, nenhum preço, nenhuma garantia, nenhum FAQ.
5. Tela 12: frase "menos de R$ 2 por dia" antes do card; "12x de R$ 30,72" em uma linha em 375 px, com "12x de" pequeno e o valor em destaque; "ou R$ 297 à vista" abaixo; botão "QUERO PAGAR AGORA".
6. O botão da Tela 12 abre o checkout InK3eLE com os parâmetros repassados; `CliqueCheckout` e `ViuPagamento` aparecem uma vez cada no Gerenciador de Eventos.
7. A planilha registra `viu_pagamento_em` e `etapa_max` = 65 ao abrir a Tela 12, sem regredir depois.
8. Tela 12 mostra "177 pessoas já compraram" sem animação de incremento e o aviso "Marcos C. entrou no Máquina de Vendas" uma única vez; nenhum dado simulado no código.
9. Lint, typecheck e build sem erros; deploy de produção publicado.
10. CHANGELOG, ESPECIFICACAO, AGENTS e docs/rodada-antigravity.md atualizados.

---

# 8. ENTREGA FINAL
Responda com:
- URL de produção
- tabela dos 10 critérios com OK e a evidência de cada um
- prints em 375 px das Telas 10, 11 (com pontos e "sim em tudo") e 12
- tempo medido entre resposta e próxima pergunta
- qualquer decisão técnica que você tomou sozinho e por quê
- pendências
