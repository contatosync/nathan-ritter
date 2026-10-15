import { NextResponse } from "next/server";
import { quizHome, trackRecoveryLink } from "@/lib/recovery-links";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ codigo: string }> },
) {
  const { codigo } = await params;
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
