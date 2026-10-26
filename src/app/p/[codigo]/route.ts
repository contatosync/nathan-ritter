import { NextResponse } from "next/server";
import { quizHome, trackRecoveryLink } from "@/lib/recovery-links";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ codigo: string }> },
) {
  const { codigo } = await params;
  const requestUrl = new URL(request.url);

  // Link-preview crawlers do not execute JavaScript, so only a real browser
  // reaches the tracked request below.
  if (requestUrl.searchParams.get("go") !== "1") {
    const next = new URL(`/p/${encodeURIComponent(codigo)}?go=1`, request.url);
    return new Response(
      `<!doctype html><html><head><meta name="robots" content="noindex"><script>location.replace(${JSON.stringify(next.toString())})</script></head><body><a href="${next.toString()}">Continuar</a></body></html>`,
      {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store",
        },
      },
    );
  }

  const result = await trackRecoveryLink(codigo, "payment");

  if (!result.found) {
    return NextResponse.redirect(quizHome(request), 302);
  }

  const checkout = new URL(
    process.env.NEXT_PUBLIC_CHECKOUT_URL ||
      "https://pay.kiwify.com.br/InK3eLE",
  );
  checkout.searchParams.set("utm_source", "whatsapp");
  checkout.searchParams.set("utm_medium", "recuperacao");
  checkout.searchParams.set("utm_campaign", "quiz-ml-recuperacao");
  checkout.searchParams.set("utm_content", `etapa-${result.etapa_max ?? ""}`);
  checkout.searchParams.set("utm_term", result.utm_campaign ?? "");
  checkout.searchParams.set("src", "whatsapp-recuperacao");
  // sck leva a sessão do lead para o webhook da Kiwify ligar a compra à linha da planilha
  checkout.searchParams.set("sck", result.session_id || `rec-${codigo}`);
  // Pré-preenche o checkout da Kiwify (telefone só com DDD + número)
  if (result.nome) checkout.searchParams.set("name", result.nome);
  const phone = (result.telefone ?? "").replace(/\D/g, "").replace(/^55(?=\d{10,11}$)/, "");
  if (/^\d{10,11}$/.test(phone)) checkout.searchParams.set("phone", phone);

  return NextResponse.redirect(checkout, 302);
}
