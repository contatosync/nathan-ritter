export interface QuizPrintItem {
  id: string;
  arquivo: string;
  src: string;
  width: number;
  height: number;
  legenda: string;
  legendaHighlight?: string;
  alt: string;
}

export const capaPrint: QuizPrintItem = {
  id: "capa",
  arquivo: "capa-painel-30-dias.webp",
  src: "/imagens/prints-reais/capa-painel-30-dias.webp",
  width: 1350,
  height: 736,
  legenda: "Print do meu painel de vendas",
  alt: "Print do meu painel de vendas no Mercado Livre",
};

export const questionPrints: QuizPrintItem[] = [
  {
    id: "p1",
    arquivo: "p1-produto-campeao-chocadeira.webp",
    src: "/imagens/prints-reais/p1-produto-campeao-chocadeira.webp",
    width: 860,
    height: 351,
    legenda: "Produto validado: 1.194 avaliações",
    alt: "Produto validado: 1.194 avaliações no Mercado Livre",
  },
  {
    id: "p2",
    arquivo: "p2-fornecedores-nacionais.webp",
    src: "/imagens/prints-reais/p2-fornecedores-nacionais.webp",
    width: 860,
    height: 351,
    legenda: "13 fornecedores nacionais para um único produto",
    alt: "13 fornecedores nacionais para um único produto",
  },
  {
    id: "p3",
    arquivo: "p3-lucro-margem-20.webp",
    src: "/imagens/prints-reais/p3-lucro-margem-20.webp",
    width: 860,
    height: 351,
    legenda: "Margem de 20% acompanhada no painel",
    alt: "Margem de 20% acompanhada no painel",
  },
  {
    id: "p4",
    arquivo: "p4-campanhas-roas-receita.webp",
    src: "/imagens/prints-reais/p4-campanhas-roas-receita.webp",
    width: 860,
    height: 351,
    legenda: "Anúncios com retorno acima de 16x",
    alt: "Anúncios com retorno acima de 16x no Mercado Livre",
  },
  {
    id: "p5",
    arquivo: "p5-roas-retorno-investimento.webp",
    src: "/imagens/prints-reais/p5-roas-retorno-investimento.webp",
    width: 860,
    height: 351,
    legenda: "ROAS de 1.055x em uma campanha",
    alt: "ROAS de 1.055x em uma campanha",
  },
];
