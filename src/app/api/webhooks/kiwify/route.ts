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
};

const APPROVED_EVENTS = new Set(["order_approved", "paid", "approved"]);

export async function POST(request: Request) {
  const token = process.env.KIWIFY_WEBHOOK_TOKEN;

  if (!token) {
    return Response.json(
      { inactive: true, message: "Webhook Kiwify ainda não ativado" },
      { status: 503 },
    );
  }

  const supplied =
    request.headers.get("x-kiwify-token") ??
    new URL(request.url).searchParams.get("token");

  if (supplied !== token) {
    return Response.json({ error: "Não autorizado" }, { status: 401 });
  }

  let payload: KiwifyPayload;

  try {
    payload = (await request.json()) as KiwifyPayload;
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

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-nr-webhook-secret": secret,
    },
    body: JSON.stringify({
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
