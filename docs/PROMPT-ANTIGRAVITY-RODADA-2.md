# MISSÃO

Rodada 2 de ajustes no quiz do curso Máquina de Vendas 2.0 (repositório `nr-diagnostico-ml`, publicado na Vercel). O trabalho só termina quando todos os critérios de aceite da seção 4 estiverem cumpridos, testados no celular e publicados em produção.

Trabalhe de forma autônoma e tome as decisões técnicas a favor de velocidade, clareza no celular e conversão.

# 1. CONTEXTO E REGRAS

- Antes de qualquer alteração, leia `AGENTS.md`, `ESPECIFICACAO.md`, `CHANGELOG.md` (último bloco) e `RECURSOS.md`, e o `docs/rodada-antigravity.md` da rodada anterior.
- Nada do funil Google Meu Negócio (Notake) pode ser alterado. Só recursos com prefixo `NR` listados no `RECURSOS.md`. Na planilha e no n8n, mexa apenas na planilha `NR · Diagnóstico ML · Leads` e no workflow `NR · Registro de leads`.
- Nunca escreva tokens ou segredos em arquivo versionado, log ou commit.
- Use exatamente os textos desta tarefa. Telas e textos não citados aqui continuam como estão.
- O contador de vendas é fixo: o número vem de `VENDAS_BASE=177`, sem consultar planilha, API ou webhook e sem atualização em tempo real. Confirme que está assim; se não estiver, corrija.
- Pare e pergunte só se precisar mexer em algo sem prefixo `NR` ou se um critério for impossível sem mudar uma regra da especificação.

# 2. MODO DE TRABALHO: TRÊS AGENTES EM CICLO

Registre o resultado de cada papel em `docs/rodada-antigravity-2.md`.

**Agente 1 · Planejador.** Lê o contexto e o código das Telas 10, 11 e 12. Mapeia cada item da seção 3 para arquivos e componentes, lista riscos (evento duplicado, etapa_max regredindo, quebra de layout em 375 px, vídeo pesando no carregamento) e entrega um plano numerado com o critério que fecha cada passo.

**Agente 2 · Executor.** Cria a branch `ajustes-rodada-2` e implementa o plano, um commit por passo (`tipo: descrição`, em português). Não sai do escopo; se algo novo for necessário, devolve ao Planejador.

**Agente 3 · Revisor.** Revisa como se não tivesse escrito o código: lint, typecheck e build; teste em 375 px e 1280 px das rotas curso (com pontos), "sim em tudo" e mentoria; confere os textos letra por letra; confere os eventos no Gerenciador de Eventos com `META_TEST_EVENT_CODE`; confere as colunas novas na planilha; mede o tempo de carregamento da Tela 11 com e sem play no vídeo. Marca cada critério da seção 4 como OK ou FALHOU, com evidência. Se algo falhar, volta ao Executor. Só com tudo OK: merge na `main`, deploy e conferência na URL de produção.

# 3. TAREFAS
## 3.1 · Tela 10 · Diagnóstico
1. Título com o nome antes da frase:
   - Com pontos a estudar: "{nome}, seu diagnóstico está pronto"
   - "Sim" em todas: "{nome}, você já domina a base"
2. Trocar o parágrafo "Você pode estudar cada um sozinho. Se preferir..." por:
   - Abertura (branco, negrito): "Agora você sabe o que precisa aprender. Existem dois caminhos:"
   - Card 1 (borda cinza) · rótulo CAMINHO 1: "Aprender cada ponto sozinho, procurando o conteúdo por conta própria e testando até acertar."
   - Card 2 (borda amarela, brilho leve) · rótulo CAMINHO 2: "Aprender todos os pontos em uma única plataforma, com o passo a passo de quem vende no Mercado Livre desde 2022."
   - No caso "Sim" em todas, não exibir os dois caminhos.
3. Botão "QUERO O CURSO MÁQUINA DE VENDAS" a pelo menos 32 px do card 2 e em uma linha só em 375 px (fonte com clamp, altura mínima 44 px). Vale para todos os botões com esse texto.

## 3.2 · Tela 11 · Página do curso
1. Descrições dos módulos pela metade:
   | Pergunta | Texto novo |
   |---|---|
   | P1 | Como ler a busca do Mercado Livre para achar produtos que vendem e têm poucos concorrentes bons. |
   | P2 | Onde o Nathan encontra fornecedores no Brasil e como testar com pouca quantidade antes de comprar mais. |
   | P3 | Como montar a conta com custo, tarifa, frete e imposto para saber quanto sobra em cada venda. |
   | P4 | Título, fotos e ficha técnica que aparecem na busca, e o que faz o anúncio subir de posição. |
   | P5 | Como começar com estoque pequeno, validar o giro e só depois repor em maior quantidade. |
   Caso "Sim" em todas:
   | Módulo | Texto novo |
   |---|---|
   | 07 | O que faz um anúncio que já vende ganhar posição na busca. |
   | 08 | Como usar os anúncios pagos do Mercado Livre sem queimar caixa. |
   | 10 | Como aumentar o volume de vendas sem perder o controle do caixa. |

2. Vídeo do Nathan sobre o curso, logo abaixo do primeiro botão "QUERO O CURSO MÁQUINA DE VENDAS" (o que vem depois dos blocos de módulos):
   - Texto antes do vídeo, centralizado:
     Título (branco, negrito): "Ainda tem dúvidas sobre o curso?"
     Subtítulo (--muted): "No vídeo abaixo, o Nathan explica cada parte do Máquina de Vendas. E logo depois tem o que você recebe, os 10 módulos e resultados de alunos."
   - Vídeo: YouTube RXcBV_dWnh4 (o mesmo da página de vendas).
   - Sem autoplay. Mostrar só a capa do vídeo (thumbnail do YouTube em alta, https://i.ytimg.com/vi/RXcBV_dWnh4/maxresdefault.jpg) com um botão de play amarelo no centro. O iframe do YouTube só é carregado quando a pessoa toca no play, já com som e tocando (autoplay=1 só depois do clique). Assim a página não fica mais lenta.
   - Formato 16:9, cantos arredondados, borda e brilho amarelos como na página de vendas, largura total do conteúdo.
   - Parâmetros: playsinline=1, rel=0, modestbranding=1.
   - Evento personalizado `AssistiuVideoCurso` (Pixel + CAPI, uma vez por sessão) e coluna `assistiu_video_em` na planilha.

## 3.3 · Nova Tela 11B · Pergunta de valor (entre a Tela 11 e a Tela 12)
Todo botão "QUERO O CURSO MÁQUINA DE VENDAS" da Tela 11 passa a abrir esta tela, e não mais direto a Tela 12.
- Mesmo layout das perguntas do quiz (logo pequeno no topo, card de resposta, avanço em ~150 ms, sem barra de progresso).
- Pergunta: "Quanto você pagaria pelo Máquina de Vendas?"
- Subtítulo (--muted): "Considerando os 10 módulos, 1 ano de acesso e o passo a passo do Nathan."
- Respostas, nesta ordem:
  - R$ 1.500
  - R$ 1.000
  - R$ 600
  - R$ 300
- Ao tocar, vai para a Tela 12.
- Gravar a resposta na coluna nova `quanto_pagaria` da planilha (valores 1500, 1000, 600, 300) e disparar o evento personalizado `RespondeuValor` com o valor.
- Nova etapa `pergunta_valor` = 62 (entre `oferta` 60 e `pagamento` 65).

## 3.4 · Tela 12 · Pagamento (redesenho)
1. Tirar o logo do topo da página (o pequeno, acima do "Voltar"). O logo dentro do card de preço continua.
2. Nova ordem e textos:
   - Rótulo: ÚLTIMO PASSO
   - Headline (o maior texto da tela, font-black, ~34 px em 375 px): "Tudo isso por menos de **R$ 2 por dia**" ("R$ 2 por dia" em amarelo)
   - Linha de retorno da pergunta de valor (branco, 17 px), conforme a resposta:
     - 1.500, 1.000 ou 600: "Você disse que pagaria R$ {valor}. Hoje o acesso completo sai por R$ 297."
     - 300: "Você chegou perto: hoje o acesso completo sai por R$ 297."
     - Se a pessoa chegou sem responder: não exibir a linha.
   - Bloco do contador em formato de notificação piscando:
     - Card baixo, fundo --card, borda amarela fina, cantos bem arredondados, com "177" grande (~40 px, amarelo, font-black) à esquerda e, à direita, em duas linhas: "pessoas já compraram" / "o Máquina de Vendas" (branco, 15 px). Sem emoji.
     - No canto superior esquerdo do card, um ponto amarelo de notificação com anel pulsando (efeito "ping": o anel cresce e some em loop, 1,5 s).
     - O card inteiro pisca de leve em loop: brilho da borda e sombra amarela sobem e descem (2 s, ease-in-out), sem mudar de tamanho para não empurrar o layout.
     - Ao abrir a página, o card entra deslizando de cima com fade (300 ms), como uma notificação chegando.
     - O número continua fixo em 177: a animação é só visual, o valor não muda.
     - Com prefers-reduced-motion, mostrar o card sem animação.
   - Card de preço como está (logo, nome, "12x de R$ 30,72" em uma linha, "ou R$ 297 à vista", botão QUERO PAGAR AGORA, cadeado).
3. Tipografia: aumentar o texto corrido da tela para no mínimo 16 px, linhas com respiro (line-height 1.4) e 24 px entre os blocos.
4. Ajustar a ESPECIFICACAO.md (seções 4, 5, 9 e tabela de etapas) com a Tela 11B e as mudanças da Tela 12.

# 4. CRITÉRIOS DE ACEITE

1. Tela 10: título "{nome}, seu diagnóstico está pronto" (e "{nome}, você já domina a base" no caso "sim em tudo"), bloco dos dois caminhos com o card 2 destacado, botão a 32 px ou mais e em uma linha em 375 px.
2. Tela 11: descrições novas (mais curtas) em todos os blocos, nos dois casos.
3. Tela 11: vídeo abaixo do primeiro botão, com o título e o subtítulo definidos; nenhum iframe do YouTube carregado antes do play; ao tocar, toca com som; `AssistiuVideoCurso` aparece uma vez e `assistiu_video_em` é gravado.
4. Todo botão "QUERO O CURSO MÁQUINA DE VENDAS" da Tela 11 abre a Tela 11B.
5. Tela 11B: pergunta, subtítulo e as 4 opções na ordem; avanço em até 200 ms; `quanto_pagaria` gravado; `RespondeuValor` uma vez; etapa_max = 62.
6. Tela 12: sem logo no topo; headline "Tudo isso por menos de R$ 2 por dia" como maior texto; linha de retorno correta para cada uma das 4 respostas e oculta sem resposta; card do 177 com ponto pulsando, brilho em loop e entrada deslizando; layout sem saltos; sem animação com prefers-reduced-motion.
7. Tela 12: texto corrido com 16 px ou mais e 24 px entre blocos; preço em uma linha; botão QUERO PAGAR AGORA abrindo https://pay.kiwify.com.br/InK3eLE com os parâmetros.
8. Contador fixo em 177 vindo de `VENDAS_BASE`, sem chamadas de rede.
9. Lint, typecheck e build sem erros; deploy de produção publicado.
10. `ESPECIFICACAO.md` (seções 3, 4, 5, 7, 9 e tabela de etapas), `CHANGELOG.md` (agente Antigravity) e `docs/rodada-antigravity-2.md` atualizados.

# 5. ENTREGA FINAL

- URL de produção
- tabela dos 10 critérios com OK e evidência
- prints em 375 px: Tela 10 (com pontos e "sim em tudo"), Tela 11 (blocos e vídeo antes e depois do play), Tela 11B e Tela 12 (com resposta R$ 1.000 e com R$ 300)
- decisões técnicas tomadas sozinho e por quê
- pendências
