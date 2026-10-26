type KiwifyPayload = {
  order_id?: string;
  order_status?: string;
  webhook_event_type?: string;
  status?: string;
  event?: string;
  approved_date?: string;
  Customer?: { mobile?: string; phone?: string };
  customer?: { mobile?: string; phone?: string };
  phone?: string;
  id?: string;
  TrackingParameters?: { sck?: string | null; src?: string | null };
};

const SESSION_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const APPROVED_EVENTS = new Set(["order_approved", "paid", "approved"]);

function signaturesMatch(supplied: string | null, expected: string) {
  if (!supplied) return false;

  const suppliedBuffer = Buffer.from(supplied.toLowerCase(), "utf8");
  const expectedBuffer = Buffer.from(expected.toLowerCase(), "utf8");

  return (
    suppliedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(suppliedBuffer, expectedBuffer)
  );
}

export async function POST(request: Request) {
  const token = process.env.KIWIFY_WEBHOOK_TOKEN;

  if (!token) {
    return Response.json(
      { inactive: true, message: "Webhook Kiwify ainda não ativado" },
      { status: 503 },
    );
  }

  const rawBody = await request.text();
  const url = new URL(request.url);
  const suppliedSignature =
    url.searchParams.get("signature") ??
    request.headers.get("x-kiwify-signature");
  const expectedSignature = createHmac("sha1", token)
    .update(rawBody)
    .digest("hex");
  const legacyToken =
    request.headers.get("x-kiwify-token") ?? url.searchParams.get("token");

  if (
    !signaturesMatch(suppliedSignature, expectedSignature) &&
    legacyToken !== token
  ) {
    return Response.json({ error: "Não autorizado" }, { status: 401 });
  }

  let payload: KiwifyPayload;

  try {
    payload = JSON.parse(rawBody) as KiwifyPayload;
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }

  const eventType = String(
    payload.webhook_event_type ??
      payload.order_status ??
      payload.status ??
      payload.event ??
      "",
  ).toLowerCase();

  if (!APPROVED_EVENTS.has(eventType)) {
    return Response.json({ ok: true, ignored: true });
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  const secret = process.env.N8N_WEBHOOK_SECRET;

  if (!webhookUrl || !secret) {
    return Response.json({ error: "Registro indisponível" }, { status: 503 });
  }

  const phone =
    payload.Customer?.mobile ??
    payload.Customer?.phone ??
    payload.customer?.mobile ??
    payload.customer?.phone ??
    payload.phone;

  // O quiz e o link de recuperação mandam a sessão do lead no sck do checkout
  const sck = String(payload.TrackingParameters?.sck ?? "").trim();
  const sessionId = SESSION_ID.test(sck) ? sck : undefined;

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-nr-webhook-secret": secret,
    },
    body: JSON.stringify({
      ...(sessionId ? { session_id: sessionId } : {}),
      evento: "comprou",
      etapa: 80,
      etapa_nome: "comprou",
      telefone: phone,
      status: "comprou",
      comprou_em: payload.approved_date ?? new Date().toISOString(),
      kiwify_order_id: payload.order_id ?? payload.id,
      dados_json: payload,
    }),
    cache: "no-store",
  });

  return Response.json({ ok: response.ok }, { status: response.ok ? 200 : 502 });
}
import { createHmac, timingSafeEqual } from "node:crypto";

