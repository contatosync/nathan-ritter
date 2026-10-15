import { NextResponse } from "next/server";
import { quizHome, trackRecoveryLink } from "@/lib/recovery-links";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ codigo: string }> },
) {
  const { codigo } = await params;
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
  checkout.searchParams.set("sck", `rec-${codigo}`);

  return NextResponse.redirect(checkout, 302);
}
