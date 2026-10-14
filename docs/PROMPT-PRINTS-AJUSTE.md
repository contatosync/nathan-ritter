# Ajuste dos prints reais (capa e perguntas)

Leia o último bloco do CHANGELOG antes de começar. As imagens novas já estão em `public/imagens/prints-reais/` e substituem as anteriores.

## 1. Capa (Tela 1)
- Remover o logo do Máquina de Vendas da capa. O print entra no lugar dele.
- Nova ordem: rótulo DIAGNÓSTICO GRATUITO → print → headline → subtítulo → botão FAZER O DIAGNÓSTICO.
- Imagem: `capa-painel-30-dias.webp` (900×494). Apagar `capa-480k-faturamento-30-dias.webp`.
- Print reto: remover qualquer rotate/transform. A imagem já foi endireitada.
- Card com cantos de 16 px, borda amarela fina e brilho amarelo suave atrás, largura total do conteúdo, imagem inteira sem corte.
- Legenda: "Painel real: R$ 104 mil de lucro bruto em 30 dias" ("R$ 104 mil" em amarelo), no padrão do item 3.
- O botão precisa continuar visível sem rolar num iPhone de 375×667. Se não couber, reduzir a headline (clamp) antes de reduzir o print.

## 2. Perguntas
Todas as imagens foram recortadas no formato do card (860×351, ~2,45:1).

| Pergunta | Arquivo | Legenda |
|---|---|---|
| P1 | p1-produto-campeao-chocadeira.webp | Produto validado: 1.194 avaliações |
| P2 | p2-fornecedores-nacionais.webp | 13 fornecedores nacionais para um único produto |
| P3 | p3-lucro-margem-20.webp | Margem de 20% acompanhada no painel |
| P4 | p4-campanhas-roas-receita.webp | Anúncios com retorno acima de 16x |
| P5 | p5-roas-retorno-investimento.webp | ROAS de 1.055x em uma campanha |

Apagar `p3-painel-lucro-margem.webp` e `p2-margem-20-dashboard.webp`, se existirem.

## 3. Exibição (capa e perguntas)
- Imagem inteira, sem corte (sem object-fit: cover), mantendo a proporção do arquivo.
- Legenda fora da imagem: logo abaixo do card, texto de 12 px, cor --muted, com um ponto amarelo antes. Remover o chip que fica por cima da imagem.
- Pré-carregar a imagem da próxima pergunta, para a troca continuar em até 200 ms.
- Atualizar `src/config/prints-quiz.ts` com arquivos, legendas e alt.

## 4. Aceite
1. Capa sem logo, com o print reto no lugar, e botão visível sem rolar em 375×667.
2. P1 a P5 com as imagens novas, inteiras, e legenda abaixo do card.
3. As 3 respostas de cada pergunta visíveis sem rolar em 375×667.
4. Troca entre perguntas em até 200 ms.
5. Lint, typecheck e build sem erros; deploy publicado; CHANGELOG e ESPECIFICACAO.md (seções 5 e 6) atualizados.

Entregar: URL e prints em 375 px da capa e das 5 perguntas.
