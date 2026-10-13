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
      "Como ler a busca do Mercado Livre para achar produtos que vendem e têm poucos concorrentes bons.",
    coverImage: "/imagens/modulos-kiwify/modulo-05-produto-campeao.webp",
  },
  {
    questionIndex: 1,
    badge: "MÓDULO 05 · PRODUTO CAMPEÃO",
    point: "Como encontrar fornecedores nacionais confiáveis",
    howToLearn:
      "Onde o Nathan encontra fornecedores no Brasil e como testar com pouca quantidade antes de comprar mais.",
    coverImage: "/imagens/modulos-kiwify/modulo-05-produto-campeao.webp",
  },
  {
    questionIndex: 2,
    badge: "MÓDULO 02 · O ESSENCIAL PARA COMEÇAR",
    point: "Como calcular a margem antes de vender",
    howToLearn:
      "Como montar a conta com custo, tarifa, frete e imposto para saber quanto sobra em cada venda.",
    coverImage: "/imagens/modulos-kiwify/modulo-02-essencial-para-comecar.webp",
  },
  {
    questionIndex: 3,
    badge: "MÓDULOS 06 E 07 · ANÚNCIO E RANQUEAMENTO",
    point: "Como montar anúncios que aparecem na busca",
    howToLearn:
      "Título, fotos e ficha técnica que aparecem na busca, e o que faz o anúncio subir de posição.",
    coverImage: "/imagens/modulos-kiwify/modulo-06-anuncio-campeao.webp",
  },
  {
    questionIndex: 4,
    badge: "MÓDULOS 03 E 04 · PRIMEIRA VENDA E LOGÍSTICA",
    point: "Como planejar o investimento inicial e o giro de estoque",
    howToLearn:
      "Como começar com estoque pequeno, validar o giro e só depois repor em maior quantidade.",
    coverImage: "/imagens/modulos-kiwify/modulo-03-primeira-venda.webp",
  },
];

export const MASTERY_TOPICS: MasteryModuleTopic[] = [
  {
    badge: "MÓDULO 07 · ESTRATÉGIA PARA RANQUEAR",
    text: "O que faz um anúncio que já vende ganhar posição na busca.",
    coverImage: "/imagens/modulos-kiwify/modulo-07-estrategia-para-ranquear.webp",
  },
  {
    badge: "MÓDULO 08 · DOMINANDO ADS",
    text: "Como usar os anúncios pagos do Mercado Livre sem queimar caixa.",
    coverImage: "/imagens/modulos-kiwify/modulo-08-dominando-ads.webp",
  },
  {
    badge: "MÓDULO 10 · CRESÇA RÁPIDO",
    text: "Como aumentar o volume de vendas sem perder o controle do caixa.",
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
