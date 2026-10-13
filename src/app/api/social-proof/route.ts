interface SocialProofResponse {
  total: number;
  latestBuyer: string;
  timeAgo: string | null;
}

let cachedData: SocialProofResponse | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 60 * 1000;

function formatBuyerName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const firstName = parts[0];
  const lastInitial = parts[parts.length - 1][0]?.toUpperCase() || "";
  return `${firstName} ${lastInitial}.`;
}

export async function GET() {
  const baseTotal = parseInt(process.env.VENDAS_BASE || "177", 10) || 177;
  const baseBuyer = process.env.ULTIMO_COMPRADOR_BASE || "Marcos C.";
  const now = Date.now();

  if (cachedData && now - lastCacheTime < CACHE_TTL_MS) {
    return Response.json(cachedData, {
      headers: {
        "cache-control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    });
  }

  // Se houver um endpoint configurado para leitura de compras reais via n8n
  const statsWebhookUrl = process.env.N8N_STATS_WEBHOOK_URL;
  if (statsWebhookUrl) {
    try {
      const response = await fetch(statsWebhookUrl, {
        headers: {
          ...(process.env.N8N_WEBHOOK_SECRET
            ? { "x-nr-webhook-secret": process.env.N8N_WEBHOOK_SECRET }
            : {}),
        },
        cache: "no-store",
      });

      if (response.ok) {
        const data = await response.json();
        const additionalSales = typeof data.novas_vendas === "number" ? data.novas_vendas : 0;
        const total = baseTotal + additionalSales;
        const latestBuyer = data.ultimo_comprador
          ? formatBuyerName(String(data.ultimo_comprador))
          : baseBuyer;
        const timeAgo = data.tempo_decorrido || null;

        cachedData = { total, latestBuyer, timeAgo };
        lastCacheTime = now;
        return Response.json(cachedData);
      }
    } catch {
      // Falha de rede: faz fallback estrito aos valores base
    }
  }

  cachedData = {
    total: baseTotal,
    latestBuyer: baseBuyer,
    timeAgo: null,
  };
  lastCacheTime = now;

  return Response.json(cachedData, {
    headers: {
      "cache-control": "public, s-maxage=60, stale-while-revalidate=30",
    },
  });
}
