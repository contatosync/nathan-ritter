import { NextResponse } from "next/server";
import { quizHome, trackRecoveryLink } from "@/lib/recovery-links";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ codigo: string }> },
) {
  const { codigo } = await params;
  const requestUrl = new URL(request.url);

  // WhatsApp fetches links to build previews. Defer tracking to a browser-only
  // redirect so a preview request is not counted as a real click.
  if (requestUrl.searchParams.get("go") !== "1") {
    const next = new URL(`/c/${encodeURIComponent(codigo)}?go=1`, request.url);
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

  const result = await trackRecoveryLink(codigo, "community");

  if (!result.found) {
    return NextResponse.redirect(quizHome(request), 302);
  }

  const community = process.env.LINK_COMUNIDADE;
  return NextResponse.redirect(
    community ? new URL(community) : quizHome(request),
    302,
  );
}
