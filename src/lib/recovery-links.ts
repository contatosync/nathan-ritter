type LinkKind = "community" | "payment";

type RecoveryLinkResult = {
  found: boolean;
  etapa_max?: number;
  utm_campaign?: string;
  session_id?: string;
  nome?: string;
  telefone?: string;
};

export async function trackRecoveryLink(
  code: string,
  kind: LinkKind,
): Promise<RecoveryLinkResult> {
  const webhookUrl = process.env.N8N_RECOVERY_LINK_URL;
  const secret = process.env.N8N_WEBHOOK_SECRET;

  if (!webhookUrl || !secret || !/^[A-Za-z0-9]{6,8}$/.test(code)) {
    return { found: false };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-nr-webhook-secret": secret,
      },
      body: JSON.stringify({ code, kind }),
      cache: "no-store",
    });

    if (!response.ok) return { found: false };
    return (await response.json()) as RecoveryLinkResult;
  } catch {
    return { found: false };
  }
}

export function quizHome(request: Request) {
  return new URL("/", request.url);
}
