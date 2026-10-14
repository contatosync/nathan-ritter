import type { Metadata, Viewport } from "next";
import { Poppins, Sora } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  display: "swap",
  preload: true,
});
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  display: "swap",
});
const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://nr-diagnostico-ml.vercel.app"),
  title: "Diagnóstico Mercado Livre · Máquina de Vendas",
  description:
    "Descubra em 5 perguntas se você está pronto para vender no Mercado Livre.",
  icons: {
    icon: [
      { url: "/imagens/favicon/favicon.ico" },
      { url: "/imagens/favicon/favicon-32.png", sizes: "32x32" },
    ],
    apple: "/imagens/favicon/apple-touch-icon.png",
  },
  openGraph: {
    title: "Diagnóstico Mercado Livre · Máquina de Vendas",
    description:
      "Descubra em 5 perguntas se você está pronto para vender no Mercado Livre.",
    images: [{ url: "/imagens/social/og-image.jpg", width: 1200, height: 630 }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${sora.variable} ${poppins.variable} antialiased`}
    >
      <body>{children}</body>
      {pixelId ? (
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
        >{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');`}</Script>
      ) : null}
    </html>
  );
}
