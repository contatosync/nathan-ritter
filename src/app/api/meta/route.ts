import { createHash } from "node:crypto";

const hash = (value: string) =>
  createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
// Formato dos cookies _fbp/_fbc: fb.<subdomínio>.<timestamp>.<id>
const FB_COOKIE = /^fb\.[0-9]\.\d{10,13}\.[A-Za-z0-9_-]{1,500}$/;

export async function POST(request: Request) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID,
    token = process.env.META_CAPI_TOKEN;
  if (!pixelId || !token) return Response.json({ skipped: true });
  const body = await request.json(),
    input = (body.userData ?? {}) as Record<string, string | undefined>,
    forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const userData: Record<string, unknown> = {
    client_user_agent: request.headers.get("user-agent") || undefined,
    client_ip_address: forwarded,
  };
  if (input.telefone) {
    userData.ph = [hash(input.telefone.replace(/\D/g, ""))];
    userData.country = [hash("br")];
  }
  if (input.nome) {
    const parts = input.nome.trim().split(/\s+/);
    userData.fn = [hash(parts[0])];
    if (parts.length > 1) userData.ln = [hash(parts[parts.length - 1])];
  }
  if (input.external_id) userData.external_id = [hash(input.external_id)];
  // fbp e fbc vão sem hash, como a Meta pede
  if (input.fbp && FB_COOKIE.test(input.fbp)) userData.fbp = input.fbp;
  if (input.fbc && FB_COOKIE.test(input.fbc)) userData.fbc = input.fbc;
  const payload = {
    data: [
      {
        event_name: body.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: body.eventId,
        event_source_url: body.eventSourceUrl,
        action_source: "website",
        user_data: userData,
        custom_data: body.customData || {},
      },
    ],
    ...(process.env.META_TEST_EVENT_CODE
      ? { test_event_code: process.env.META_TEST_EVENT_CODE }
      : {}),
  };
  const response = await fetch(
    `https://graph.facebook.com/v24.0/${pixelId}/events?access_token=${encodeURIComponent(token)}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    },
  );
  const result = await response.json();
  return Response.json(result, { status: response.ok ? 200 : 502 });
}
