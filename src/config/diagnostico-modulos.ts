export interface DiagnosticModuleTopic {
  questionIndex: number;
  badge: string;
  point: string;
  howToLearn: string;
  coverImage: string;
}

export interface MasteryModuleTopic {
  badge: string;
  text: string;
  coverImage: string;
}

export interface ModuleItemConfig {
  number: string;
  title: string;
  image: string;
}

export const DIAGNOSTIC_TOPICS: DiagnosticModuleTopic[] = [
  {
    questionIndex: 0,
    badge: "MÓDULO 05 · PRODUTO CAMPEÃO",
    point: "Como encontrar produtos com procura e pouca concorrência",
    howToLearn:
      "Você aprende a ler a busca do Mercado Livre para achar produtos que já vendem e ainda têm poucos vendedores bem posicionados. Também vê como descartar os que só competem por preço, antes de comprar a primeira unidade.",
    coverImage: "/imagens/modulos-kiwify/modulo-05-produto-campeao.webp",
  },
  {
    questionIndex: 1,
    badge: "MÓDULO 05 · PRODUTO CAMPEÃO",
    point: "Como encontrar fornecedores nacionais confiáveis",
    howToLearn:
      "O Nathan mostra onde procura fornecedores no Brasil, como negocia o primeiro pedido e como testar o fornecedor com pouca quantidade antes de fechar um volume maior.",
    coverImage: "/imagens/modulos-kiwify/modulo-05-produto-campeao.webp",
  },
  {
    questionIndex: 2,
    badge: "MÓDULO 02 · O ESSENCIAL PARA COMEÇAR",
    point: "Como calcular a margem antes de vender",
    howToLearn:
      "Antes de anunciar, você monta a conta do produto com custo, tarifa do Mercado Livre, frete, imposto e embalagem. Com ela pronta, sabe quanto sobra em cada venda e qual é o menor preço que ainda dá lucro.",
    coverImage: "/imagens/modulos-kiwify/modulo-02-essencial-para-comecar.webp",
  },
  {
    questionIndex: 3,
    badge: "MÓDULOS 06 E 07 · ANÚNCIO E RANQUEAMENTO",
    point: "Como montar anúncios que aparecem na busca",
    howToLearn:
      "No Módulo 06 você monta título, fotos e ficha técnica do jeito que o Mercado Livre usa para exibir o anúncio na busca. No 07, aprende o que faz o anúncio subir de posição depois das primeiras vendas.",
    coverImage: "/imagens/modulos-kiwify/modulo-06-anuncio-campeao.webp",
  },
  {
    questionIndex: 4,
    badge: "MÓDULOS 03 E 04 · PRIMEIRA VENDA E LOGÍSTICA",
    point: "Como planejar o investimento inicial e o giro de estoque",
    howToLearn:
      "Você começa com estoque pequeno, valida se o produto gira e só então repõe em maior quantidade. Assim o dinheiro não fica parado em caixa no depósito enquanto o produto não vende.",
    coverImage: "/imagens/modulos-kiwify/modulo-03-primeira-venda.webp",
  },
];

export const MASTERY_TOPICS: MasteryModuleTopic[] = [
  {
    badge: "MÓDULO 07 · ESTRATÉGIA PARA RANQUEAR",
    text: "O que faz um anúncio que já vende ganhar posição e ficar entre os primeiros da busca.",
    coverImage: "/imagens/modulos-kiwify/modulo-07-estrategia-para-ranquear.webp",
  },
  {
    badge: "MÓDULO 08 · DOMINANDO ADS",
    text: "Como usar os anúncios pagos dentro do Mercado Livre para escalar sem queimar caixa.",
    coverImage: "/imagens/modulos-kiwify/modulo-08-dominando-ads.webp",
  },
  {
    badge: "MÓDULO 10 · CRESÇA RÁPIDO",
    text: "Como aumentar o volume de vendas sem perder o controle da operação e do caixa.",
    coverImage: "/imagens/modulos-kiwify/modulo-10-cresca-rapido.webp",
  },
];

export const COURSE_MODULES: ModuleItemConfig[] = [
  {
    number: "01",
    title: "Primeiros Passos",
    image: "/imagens/modulos-kiwify/modulo-01-primeiros-passos.webp",
  },
  {
    number: "02",
    title: "O essencial para começar a vender no Meli",
    image: "/imagens/modulos-kiwify/modulo-02-essencial-para-comecar.webp",
  },
  {
    number: "03",
    title: "Como destravar sua primeira venda no Meli",
    image: "/imagens/modulos-kiwify/modulo-03-primeira-venda.webp",
  },
  {
    number: "04",
    title: "Envios & Logística",
    image: "/imagens/modulos-kiwify/modulo-04-envios-e-logistica.webp",
  },
  {
    number: "05",
    title: "Produto Campeão",
    image: "/imagens/modulos-kiwify/modulo-05-produto-campeao.webp",
  },
  {
    number: "06",
    title: "Criando anúncio campeão",
    image: "/imagens/modulos-kiwify/modulo-06-anuncio-campeao.webp",
  },
  {
    number: "07",
    title: "Estratégia para Ranquear",
    image: "/imagens/modulos-kiwify/modulo-07-estrategia-para-ranquear.webp",
  },
  {
    number: "08",
    title: "Dominando ADS",
    image: "/imagens/modulos-kiwify/modulo-08-dominando-ads.webp",
  },
  {
    number: "09",
    title: "Pós Venda",
    image: "/imagens/modulos-kiwify/modulo-09-pos-venda.webp",
  },
  {
    number: "10",
    title: "Cresça rápido",
    image: "/imagens/modulos-kiwify/modulo-10-cresca-rapido.webp",
  },
];

export const COURSE_BENEFITS = [
  "10 módulos, do primeiro passo à escala",
  "1 ano de acesso para assistir no seu ritmo",
  "Aulas novas quando o algoritmo e as regras do Mercado Livre mudam",
  "Suporte para dúvidas sobre o conteúdo",
];
