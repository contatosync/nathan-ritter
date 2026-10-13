# Imagens do quiz · Máquina de Vendas 2.0

Copiar esta pasta para `public/imagens/` no repositório `nr-diagnostico-ml`.

## Onde cada arquivo entra

| Arquivo | Uso |
|---|---|
| `logo/logo-maquina-de-vendas.webp` | Tela 1 (logo grande) |
| `logo/logo-maquina-de-vendas-md.webp` | Tela 1 no celular |
| `logo/logo-maquina-de-vendas-sm.webp` | Topo das demais telas (exibir com ~90 px de largura) |
| `logo/logo-maquina-de-vendas.png` | Matriz em alta, fundo transparente. Não usar direto na página |
| `logo/icone-caixa.png` | Ícone da caixa, para a tela de diagnóstico |
| `nathan/nathan-recorte.webp` | Tela M (mentoria), foto recortada sem fundo |
| `nathan/nathan-recorte-sm.webp` | Mesma foto para celular |
| `nathan/nathan-recorte.png` | Matriz em alta, fundo transparente |
| `nathan/nathan-foto-fundo-preto.webp` | Foto original quadrada, para avatar ou card |
| `favicon/*` | Favicon e ícones de app |
| `social/og-image.jpg` | Prévia do link no WhatsApp e redes (1200×630) |

## Observações
- O logo original veio com fundo azul-marinho. Esta versão tem fundo transparente e um contorno escuro refeito, então funciona sobre o azul do quiz e sobre fundo claro.
- O recorte da foto foi feito por IA. Sobre o fundo escuro do quiz as bordas ficam limpas; sobre fundo branco pode aparecer leve sombra no ombro direito.
- O fundo do topo da página de vendas (caixas, notas e faíscas) não está aqui. Exportar do projeto Lovable e salvar como `fundo/hero.webp`.

## Metadados (Next.js, `app/layout.tsx`)

```ts
export const metadata = {
  title: "Diagnóstico Mercado Livre · Máquina de Vendas",
  description: "Descubra em 5 perguntas se você está pronto para vender no Mercado Livre.",
  icons: {
    icon: [{ url: "/imagens/favicon/favicon.ico" }, { url: "/imagens/favicon/favicon-32.png", sizes: "32x32" }],
    apple: "/imagens/favicon/apple-touch-icon.png",
  },
  openGraph: { images: [{ url: "/imagens/social/og-image.jpg", width: 1200, height: 630 }] },
};
```
