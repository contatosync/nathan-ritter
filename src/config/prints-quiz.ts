export interface QuizPrintItem {
  id: string;
  arquivo: string;
  src: string;
  legenda: string;
  legendaHighlight?: string;
  alt: string;
  objectPosition?: string;
}

export const capaPrint: QuizPrintItem = {
  id: "capa",
  arquivo: "capa-480k-faturamento-30-dias.webp",
  src: "/imagens/prints-reais/capa-480k-faturamento-30-dias.webp",
  legenda: "Painel real: R$ 480 mil em 30 dias",
  legendaHighlight: "R$ 480 mil",
  alt: "Painel de vendas com faturamento de R$ 480 mil em 30 dias",
  objectPosition: "center",
};

export const questionPrints: QuizPrintItem[] = [
  {
    id: "p1",
    arquivo: "p1-produto-campeao-chocadeira.webp",
    src: "/imagens/prints-reais/p1-produto-campeao-chocadeira.webp",
    legenda: "Produto validado: 1.194 avaliações",
    alt: "Produto validado com 1.194 avaliações no Mercado Livre",
    objectPosition: "center",
  },
  {
    id: "p2",
    arquivo: "p2-fornecedores-nacionais.webp",
    src: "/imagens/prints-reais/p2-fornecedores-nacionais.webp",
    legenda: "13 fornecedores nacionais para um único produto",
    alt: "13 fornecedores nacionais para um único produto",
    objectPosition: "top",
  },
  {
    id: "p3",
    arquivo: "p3-painel-lucro-margem.webp",
    src: "/imagens/prints-reais/p3-painel-lucro-margem.webp",
    legenda: "Lucro e margem acompanhados em cada venda",
    alt: "Painel com lucro e margem acompanhados em cada venda",
    objectPosition: "center",
  },
  {
    id: "p4",
    arquivo: "p4-campanhas-roas-receita.webp",
    src: "/imagens/prints-reais/p4-campanhas-roas-receita.webp",
    legenda: "Anúncios com retorno acima de 16x",
    alt: "Campanhas de anúncios com retorno acima de 16x no Mercado Livre",
    objectPosition: "center",
  },
  {
    id: "p5",
    arquivo: "p5-roas-retorno-investimento.webp",
    src: "/imagens/prints-reais/p5-roas-retorno-investimento.webp",
    legenda: "ROAS de 1.055x em uma campanha",
    alt: "Campanha com ROAS de 1.055x de retorno sobre investimento",
    objectPosition: "center",
  },
];
