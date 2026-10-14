# Prints reais no quiz (capa e perguntas)

Leia AGENTS.md e o último bloco do CHANGELOG antes de começar. Trabalhe no ciclo Planejador → Executor → Revisor das rodadas anteriores e registre em docs/rodada-antigravity-prints.md.

As imagens já estão em `public/imagens/prints-reais/`, recortadas em 16:10 (800×500).

## 1. Onde cada print entra

| Tela | Arquivo | Legenda (chip) |
|---|---|---|
| Tela 1 · Capa | capa-480k-faturamento-30-dias.webp | Painel real: R$ 480 mil em 30 dias |
| P1 · Produto | p1-produto-campeao-chocadeira.webp | Produto validado: 1.194 avaliações |
| P2 · Fornecedores | p2-fornecedores-nacionais.webp | 13 fornecedores nacionais para um único produto |
| P3 · Margem | p3-painel-lucro-margem.webp | Lucro e margem acompanhados em cada venda |
| P4 · Anúncio | p4-campanhas-roas-receita.webp | Anúncios com retorno acima de 16x |
| P5 · Investimento e giro | p5-roas-retorno-investimento.webp | ROAS de 1.055x em uma campanha |

Guarde o mapeamento em `src/config/prints-quiz.ts` (arquivo, legenda, alt) para ser editado sem mexer nos componentes.

## 2. Como exibir

**Capa (Tela 1)**
- Entre o subtítulo e o botão FAZER O DIAGNÓSTICO.
- Card com cantos de 16 px, borda amarela fina, brilho amarelo suave atrás e leve inclinação (rotate -2deg) para parecer um print solto, sem cortar nas laterais em 375 px.
- Altura máxima de 190 px em 375 px (object-fit: cover, object-position: center). O botão precisa continuar visível sem rolar num iPhone de 375×667.
- Chip da legenda no canto inferior esquerdo do card: fundo #0A0F1C a 85%, texto branco 12 px, "R$ 480 mil" em amarelo.

**Cadastro (Tela 2)**
- Sem print. A tela de nome e WhatsApp continua como está.

**Perguntas (P1 a P5)**
- Imagem acima do título da pergunta, altura de 140 px em 375 px (object-fit: cover), cantos de 14 px, borda --border, chip da legenda no canto inferior esquerdo.
- Na P2 (fornecedores), usar object-position: top, para o título da busca de fornecedores aparecer inteiro.
- As 3 respostas precisam continuar visíveis sem rolar num iPhone de 375×667. Se não couberem, reduzir a altura da imagem até caber (mínimo 110 px).
- Pré-carregar a imagem da próxima pergunta enquanto a atual está na tela, para manter a troca em até 200 ms.
- Leve animação de entrada (fade + 8 px de subida, 200 ms) junto com a pergunta.

**Regras gerais**
- next/image com width 800 e height 500; a imagem da capa com priority, as demais com loading="lazy" + pré-carregamento.
- alt de cada imagem descrevendo o print (ex.: "Painel de vendas com faturamento de R$ 480 mil em 30 dias").
- Com prefers-reduced-motion: sem inclinação animada e sem animação de entrada.

## 3. Aceite
1. Cada tela mostra o print e a legenda corretos.
2. Em 375×667: botão da capa e as 3 respostas de cada pergunta visíveis sem rolar.
3. Cadastro sem imagem, igual ao atual.
4. Troca entre perguntas continua em até 200 ms (medir de novo).
5. Lint, typecheck e build sem erros; deploy publicado.
6. ESPECIFICACAO.md (seções 5 e 6) e CHANGELOG atualizados.

Entregar: URL, prints em 375 px da capa e das 5 perguntas, e o tempo medido entre perguntas.
