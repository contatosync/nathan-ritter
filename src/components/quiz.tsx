"use client";
import Image from "next/image";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  COURSE_BENEFITS,
  COURSE_MODULES,
  DIAGNOSTIC_TOPICS,
  MASTERY_TOPICS,
} from "@/config/diagnostico-modulos";
import {
  ModuleCarousel,
  ProofCarousel,
  ProofItem,
} from "./carousel";
import {
  capaPrint,
  questionPrints,
  QuizPrintItem,
} from "@/config/prints-quiz";
type Answer = "sim" | "mais_ou_menos" | "nao";
type QuizAnswers = Partial<Record<`p${1 | 2 | 3 | 4 | 5}`, Answer>>;
type Screen =
  | "inicio"
  | "cadastro"
  | "ja_vende"
  | "faturamento"
  | "pergunta"
  | "diagnostico"
  | "oferta"
  | "pergunta_valor"
  | "pagamento"
  | "mentoria";
const questions = [
  [
    "Você sabe encontrar um produto com procura e pouca concorrência no Mercado Livre?",
    "Como encontrar produtos com procura e pouca concorrência",
  ],
  [
    "Você sabe encontrar fornecedores nacionais confiáveis para revender?",
    "Como encontrar fornecedores nacionais confiáveis",
  ],
  [
    "Você sabe calcular a margem antes de vender, considerando taxa do Mercado Livre, frete e imposto?",
    "Como calcular a margem antes de vender",
  ],
  [
    "Você sabe montar um anúncio que apareça na busca do Mercado Livre (título, fotos e ficha técnica)?",
    "Como montar anúncios que aparecem na busca",
  ],
  [
    "Você sabe quanto precisa investir para começar e como girar o estoque sem travar o dinheiro?",
    "Como planejar o investimento inicial e o giro de estoque",
  ],
] as const;
const stageNames: Record<number, string> = {
  0: "inicio",
  10: "cadastro",
  20: "ja_vende",
  30: "faturamento",
  35: "tela_mentoria",
  36: "clique_mentoria",
  41: "p1",
  42: "p2",
  43: "p3",
  44: "p4",
  45: "p5",
  50: "diagnostico",
  60: "oferta",
  62: "pergunta_valor",
  65: "pagamento",
  70: "clique_checkout",
};
const answerLabels: Array<[Answer, string]> = [
  ["sim", "Sim, sei fazer"],
  ["mais_ou_menos", "Mais ou menos"],
  ["nao", "Não sei"],
];
const proofs: Record<string, ProofItem> = {
  "01": {
    number: "01",
    image: "/imagens/provas/prova-01-5k-para-40k.webp",
    caption: "Começou em março faturando 5k. Em maio fez 40k.",
  },
  "02": {
    number: "02",
    image: "/imagens/provas/prova-02-7k-para-121k.webp",
    caption: "Março: R$ 7.702 → Abril: R$ 37.117 → Maio: R$ 121.698",
  },
  "03": {
    number: "03",
    image: "/imagens/provas/prova-03-conta-nova-76k-7-dias.webp",
    caption: "Conta nova faturou R$ 76 mil em 7 dias.",
  },
  "04": {
    number: "04",
    image: "/imagens/provas/prova-04-mercadolider-platinum.webp",
    caption: "De 5k em março a MercadoLíder Platinum em agosto.",
  },
  "05": {
    number: "05",
    image: "/imagens/provas/prova-05-mercadolider-gold.webp",
    caption: "Bateu Gold. Meta agora é Platinum.",
  },
  "06": {
    number: "06",
    image: "/imagens/provas/prova-06-recorde-11k-dia.webp",
    caption: "Recorde diário de R$ 11 mil em vendas.",
  },
  "07": {
    number: "07",
    image: "/imagens/provas/prova-07-achar-produto-facil.webp",
    caption: "“Tá fácil achar produto agora.”",
  },
  "08": {
    number: "08",
    image: "/imagens/provas/prova-08-depoimento-direct.webp",
    caption: "Depoimento recebido no direct.",
  },
};
const mentoringProofs = ["02", "04", "05", "06", "01", "03", "07", "08"].map(
  (number) => proofs[number],
);
const offerProofs = ["01", "02", "03", "07", "06", "04", "05", "08"].map(
  (number) => proofs[number],
);
interface YTPlayerInstance {
  playVideo?: () => void;
  pauseVideo?: () => void;
  mute?: () => void;
  unMute?: () => void;
  isMuted?: () => boolean;
  getPlayerState?: () => number;
  getCurrentTime?: () => number;
  getDuration?: () => number;
  unloadModule?: (module: string) => void;
  destroy?: () => void;
}

interface YTEvent {
  target: YTPlayerInstance;
  data?: number;
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    YT?: {
      Player: new (
        elementId: string,
        options: {
          events?: {
            onReady?: (event: YTEvent) => void;
            onStateChange?: (event: YTEvent) => void;
          };
        },
      ) => YTPlayerInstance;
    };
    onYouTubeIframeAPIReady?: () => void;
    webkitAudioContext?: typeof AudioContext;
  }
}
function playNotificationSound() {
  try {
    if (typeof window === "undefined") return;
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(1320, now);
    gain1.gain.setValueAtTime(0.06, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.12);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1760, now + 0.11);
    gain2.gain.setValueAtTime(0.07, now + 0.11);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.23);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.11);
    osc2.stop(now + 0.23);

    setTimeout(() => {
      try {
        ctx.close().catch(() => {});
      } catch {}
    }, 450);
  } catch {
    // Falha silenciosa se áudio bloqueado
  }
}
function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "").replace(/^0+/, "");
  return digits.startsWith("55") ? digits : `55${digits}`;
}
function validPhone(value: string) {
  return /^55\d{10,11}$/.test(normalizePhone(value));
}
function formatWhatsApp(raw: string) {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("55") && digits.length > 11) {
    digits = digits.slice(2);
  }
  digits = digits.slice(0, 11);

  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}
function renderPrintLegend(item: QuizPrintItem, isCapa = false) {
  return (
    <div className={`print-legend ${isCapa ? "print-legend-capa" : ""}`}>
      <span className="print-legend-dot" aria-hidden="true" />
      <span>
        {item.legendaHighlight && item.legenda.includes(item.legendaHighlight) ? (
          <>
            {item.legenda.split(item.legendaHighlight)[0]}
            <span className="yellow">{item.legendaHighlight}</span>
            {item.legenda.split(item.legendaHighlight)[1]}
          </>
        ) : (
          item.legenda
        )}
      </span>
    </div>
  );
}
export function Quiz() {
  const [screen, setScreen] = useState<Screen>("inicio");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [question, setQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [selected, setSelected] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState<{
    latestBuyer: string;
    timeAgo: string | null;
  }>({
    latestBuyer: "Marcos C.",
    timeAgo: null,
  });
  const [showBuyerToast, setShowBuyerToast] = useState(false);
  const [videoPlayed, setVideoPlayed] = useState(false);
  const ytPlayerRef = useRef<YTPlayerInstance | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [iphoneToastState, setIphoneToastState] = useState<
    "hidden" | "showing" | "hiding"
  >("hidden");
  const hasShownToastThisVisit = useRef(false);
  const hasTrackedPayment = useRef(false);
  const hasTrackedVideo = useRef(false);
  const hasTrackedValor = useRef(false);
  const [valorResposta, setValorResposta] = useState<number | null>(null);
  const [isOfferStickyVisible, setIsOfferStickyVisible] = useState(false);
  const [isPaymentStickyVisible, setIsPaymentStickyVisible] = useState(false);
  const utms = useRef<Record<string, string>>({});
  const missing = useMemo(
    () =>
      questions
        .filter((_, i) => answers[`p${i + 1}` as keyof QuizAnswers] !== "sim")
        .map((q) => q[1]),
    [answers],
  );
  const mastered = useMemo(
    () =>
      questions
        .filter((_, i) => answers[`p${i + 1}` as keyof QuizAnswers] === "sim")
        .map((q) => q[1]),
    [answers],
  );
  const relevantTopics = useMemo(() => {
    return DIAGNOSTIC_TOPICS.filter((topic) => {
      const answer = answers[`p${topic.questionIndex + 1}` as keyof QuizAnswers];
      return answer === "mais_ou_menos" || answer === "nao";
    });
  }, [answers]);
  function sendBackground(url: string, payload: unknown, retries = 2) {
    const body = JSON.stringify(payload);
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.sendBeacon === "function"
    ) {
      try {
        const blob = new Blob([body], { type: "application/json" });
        if (navigator.sendBeacon(url, blob)) return;
      } catch {}
    }
    const attempt = (remaining: number) => {
      fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {
        if (remaining > 0) {
          setTimeout(() => attempt(remaining - 1), 1000);
        }
      });
    };
    attempt(retries);
  }
  const record = useCallback(
    (
      evento: string,
      etapa: number,
      data: Record<string, unknown> = {},
    ) => {
      if (!sessionId && etapa > 10) return;
      sendBackground("/api/events", {
        session_id: sessionId,
        evento,
        etapa,
        etapa_nome: stageNames[etapa],
        ...data,
      });
    },
    [sessionId],
  );
  const meta = useCallback(
    (
      eventName: string,
      customData: Record<string, unknown> = {},
      userData: Record<string, unknown> = {},
    ) => {
      const eventId = crypto.randomUUID();
      const standard = ["PageView", "Lead"].includes(eventName);
      window.fbq?.(standard ? "track" : "trackCustom", eventName, customData, {
        eventID: eventId,
      });
      sendBackground("/api/meta", {
        eventName,
        eventId,
        customData,
        userData,
        eventSourceUrl: location.href,
      });
      return eventId;
    },
    [],
  );

  const saveSession = useCallback(
    (
      s: Screen,
      q: number,
      a: QuizAnswers,
      n: string,
      p: string,
      sid: string,
      v: number | null,
    ) => {
      if (typeof window === "undefined") return;
      try {
        sessionStorage.setItem(
          "nr_quiz_state",
          JSON.stringify({
            screen: s,
            question: q,
            answers: a,
            name: n,
            phone: p,
            sessionId: sid,
            valorResposta: v,
          }),
        );
      } catch {}
    },
    [],
  );

  const pushScreenState = useCallback(
    (
      nextScreen: Screen,
      nextQuestion = 0,
      overrideAnswers?: QuizAnswers,
      overrideName?: string,
      overridePhone?: string,
      overrideSessionId?: string,
      overrideValor?: number | null,
    ) => {
      const curAnswers = overrideAnswers ?? answers;
      const curName = overrideName ?? name;
      const curPhone = overridePhone ?? phone;
      const curSessionId = overrideSessionId ?? sessionId;
      const curValor =
        overrideValor !== undefined ? overrideValor : valorResposta;

      setScreen(nextScreen);
      setQuestion(nextQuestion);
      if (typeof window !== "undefined") {
        window.history.pushState(
          { screen: nextScreen, question: nextQuestion },
          "",
        );
        saveSession(
          nextScreen,
          nextQuestion,
          curAnswers,
          curName,
          curPhone,
          curSessionId,
          curValor,
        );
      }
    },
    [answers, name, phone, sessionId, valorResposta, saveSession],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const saved = sessionStorage.getItem("nr_quiz_state");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.screen) {
          setScreen(parsed.screen);
          if (typeof parsed.question === "number") setQuestion(parsed.question);
          if (parsed.answers) setAnswers(parsed.answers);
          if (parsed.name) setName(parsed.name);
          if (parsed.phone) setPhone(parsed.phone);
          if (parsed.sessionId) setSessionId(parsed.sessionId);
          if (parsed.valorResposta !== undefined) {
            setValorResposta(parsed.valorResposta);
          }
          window.history.replaceState(
            { screen: parsed.screen, question: parsed.question || 0 },
            "",
          );
          return;
        }
      }
    } catch {}

    if (!window.history.state || !window.history.state.screen) {
      window.history.replaceState({ screen: "inicio", question: 0 }, "");
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onPop = (e: PopStateEvent) => {
      if (e.state && e.state.screen) {
        setScreen(e.state.screen);
        setQuestion(e.state.question || 0);
        setSelected(undefined);
        setNameError("");
        setPhoneError("");
        saveSession(
          e.state.screen,
          e.state.question || 0,
          answers,
          name,
          phone,
          sessionId,
          valorResposta,
        );
      }
    };

    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [answers, name, phone, sessionId, valorResposta, saveSession]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (screen === "cadastro" || screen === "ja_vende") {
      const img = new window.Image();
      img.src = questionPrints[0].src;
    }
    if (screen === "pergunta" && question < questionPrints.length - 1) {
      const nextImg = new window.Image();
      nextImg.src = questionPrints[question + 1].src;
    }
  }, [screen, question]);

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    for (const key of [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "fbclid",
      "gclid",
      "src",
      "sck",
    ]) {
      const value = p.get(key);
      if (value) utms.current[key] = value;
    }
    meta("PageView");
  }, [meta]);

  useEffect(() => {
    if (screen === "pagamento") {
      const storageKey = sessionId ? `nr_viu_pagamento_${sessionId}` : "nr_viu_pagamento";
      let alreadyTracked = hasTrackedPayment.current;

      if (!alreadyTracked && typeof window !== "undefined") {
        try {
          if (
            sessionStorage.getItem("nr_viu_pagamento") === "1" ||
            sessionStorage.getItem(storageKey) === "1"
          ) {
            alreadyTracked = true;
          }
        } catch {
          // fallback silencioso para restrições de navegação privada
        }
      }

      if (!alreadyTracked) {
        hasTrackedPayment.current = true;
        if (typeof window !== "undefined") {
          try {
            sessionStorage.setItem("nr_viu_pagamento", "1");
            sessionStorage.setItem(storageKey, "1");
          } catch {
            // fallback silencioso
          }
        }
        record("pagamento", 65, { viu_pagamento_em: new Date().toISOString() });
        meta("ViuPagamento");
      }
    }
  }, [screen, sessionId, meta, record]);

  useEffect(() => {
    if (screen !== "pagamento") return;
    fetch("/api/social-proof")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.latestBuyer === "string") {
          setBuyerInfo({
            latestBuyer: data.latestBuyer,
            timeAgo: data.timeAgo || null,
          });
        }
      })
      .catch(() => {});

    const timerShow = setTimeout(() => setShowBuyerToast(true), 3000);
    const timerHide = setTimeout(() => setShowBuyerToast(false), 9000);
    return () => {
      clearTimeout(timerShow);
      clearTimeout(timerHide);
      setShowBuyerToast(false);
    };
  }, [screen]);

  useEffect(() => {
    if (screen !== "pagamento") {
      hasShownToastThisVisit.current = false;
      return;
    }
    if (hasShownToastThisVisit.current) return;
    hasShownToastThisVisit.current = true;

    const tShow = setTimeout(() => {
      setIphoneToastState("showing");
      playNotificationSound();
    }, 1000);

    const tHide = setTimeout(() => {
      setIphoneToastState("hiding");
    }, 3500);

    const tDone = setTimeout(() => {
      setIphoneToastState("hidden");
    }, 3850);

    return () => {
      clearTimeout(tShow);
      clearTimeout(tHide);
      clearTimeout(tDone);
      setIphoneToastState("hidden");
    };
  }, [screen]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (screen !== "oferta" && screen !== "pagamento") {
      setIsOfferStickyVisible(false);
      setIsPaymentStickyVisible(false);
      return;
    }

    const isOffer = screen === "oferta";
    const btnClass = isOffer ? ".offer-content-btn" : ".payment-content-btn";
    const setSticky = isOffer ? setIsOfferStickyVisible : setIsPaymentStickyVisible;

    let cleanup: (() => void) | undefined;
    const timer = setTimeout(() => {
      const buttons = Array.from(
        document.querySelectorAll<HTMLElement>(btnClass),
      );
      if (!buttons.length) return;

      const firstBtn = buttons[0];
      const visibilityMap = new Map<HTMLElement, boolean>();
      buttons.forEach((b) => visibilityMap.set(b, false));

      const updateSticky = () => {
        const anyVisible = Array.from(visibilityMap.values()).some(Boolean);
        const firstRect = firstBtn.getBoundingClientRect();
        const hasPassedFirst = firstRect.bottom < 0;
        setSticky(!anyVisible && hasPassedFirst);
      };

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            visibilityMap.set(
              entry.target as HTMLElement,
              entry.isIntersecting,
            );
          });
          updateSticky();
        },
        { threshold: 0.1 },
      );

      buttons.forEach((b) => observer.observe(b));

      const onScroll = () => {
        updateSticky();
      };
      window.addEventListener("scroll", onScroll, { passive: true });

      cleanup = () => {
        observer.disconnect();
        window.removeEventListener("scroll", onScroll);
      };
    }, 100);

    return () => {
      clearTimeout(timer);
      if (cleanup) cleanup();
    };
  }, [screen]);

  useEffect(() => {
    if (typeof window === "undefined" || screen !== "oferta") return;
    if (!window.YT) {
      const existing = document.querySelector(
        'script[src*="youtube.com/iframe_api"]',
      );
      if (!existing) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const first = document.getElementsByTagName("script")[0];
        first?.parentNode?.insertBefore(tag, first);
      }
    }
  }, [screen]);

  useEffect(() => {
    if (!videoPlayed) {
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy?.();
        } catch {}
        ytPlayerRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      return;
    }

    let isMounted = true;
    let pollTimer: NodeJS.Timeout | null = null;
    let initTimer: NodeJS.Timeout | null = null;

    const attachPlayer = () => {
      if (!window.YT || !window.YT.Player) return false;
      const el = document.getElementById("course-yt-player");
      if (!el) return false;

      try {
        ytPlayerRef.current = new window.YT.Player("course-yt-player", {
          events: {
            onReady: (event: YTEvent) => {
              if (!isMounted) return;
              try {
                event.target.unloadModule?.("captions");
                event.target.unloadModule?.("cc");
              } catch {}
              setIsVideoPlaying(true);
              try {
                setIsVideoMuted(Boolean(event.target.isMuted?.()));
              } catch {}
            },
            onStateChange: (event: YTEvent) => {
              if (!isMounted) return;
              if (event.data === 1) {
                // PLAYING
                try {
                  event.target.unloadModule?.("captions");
                  event.target.unloadModule?.("cc");
                } catch {}
                setIsVideoPlaying(true);
              } else if (event.data === 2) {
                // PAUSED
                setIsVideoPlaying(false);
              } else if (event.data === 0) {
                // ENDED - voltar para a capa com o botão de play
                setVideoPlayed(false);
                setIsVideoPlaying(false);
                setVideoProgress(0);
              }
            },
          },
        });
        return true;
      } catch {
        return false;
      }
    };

    if (!attachPlayer()) {
      initTimer = setInterval(() => {
        if (attachPlayer()) {
          if (initTimer) clearInterval(initTimer);
        }
      }, 150);
    }

    pollTimer = setInterval(() => {
      if (ytPlayerRef.current && isMounted) {
        try {
          const cur = ytPlayerRef.current.getCurrentTime?.() || 0;
          const dur = ytPlayerRef.current.getDuration?.() || 0;
          if (dur > 0) {
            setVideoProgress(Math.min(100, Math.max(0, (cur / dur) * 100)));
          }
        } catch {}
      }
    }, 250);
    progressIntervalRef.current = pollTimer;

    return () => {
      isMounted = false;
      if (initTimer) clearInterval(initTimer);
      if (pollTimer) clearInterval(pollTimer);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, [videoPlayed]);

  useEffect(() => {
    if (!sessionId) return;
    const onLeave = () =>
      navigator.sendBeacon(
        "/api/events",
        new Blob(
          [
            JSON.stringify({
              session_id: sessionId,
              evento: "saida",
              etapa: currentStage(screen, question),
              etapa_nome: stageNames[currentStage(screen, question)],
            }),
          ],
          { type: "application/json" },
        ),
      );
    window.addEventListener("pagehide", onLeave);
    return () => window.removeEventListener("pagehide", onLeave);
  }, [sessionId, screen, question]);
  async function submitLead(e: FormEvent) {
    e.preventDefault();
    setNameError("");
    setPhoneError("");
    let hasErr = false;
    if (name.trim().length < 2) {
      setNameError("Digite seu nome.");
      hasErr = true;
    }
    if (!validPhone(phone)) {
      setPhoneError("Digite um WhatsApp brasileiro válido com DDD.");
      hasErr = true;
    }
    if (hasErr) return;
    setBusy(true);
    const id = crypto.randomUUID(),
      normalized = normalizePhone(phone);
    setSessionId(id);
    const eventId = meta(
      "Lead",
      {},
      { nome: name.trim(), telefone: normalized },
    );
    await fetch("/api/events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        session_id: id,
        evento: "cadastro",
        etapa: 10,
        etapa_nome: "cadastro",
        nome: name.trim(),
        telefone: normalized,
        status: "em_andamento",
        rota: "curso",
        event_id_meta: eventId,
        ...utms.current,
      }),
    });
    setBusy(false);
    pushScreenState("ja_vende", 0, answers, name.trim(), normalized, id);
  }
  function chooseSeller(value: "sim" | "nao") {
    if (selected !== undefined || busy) return;
    setSelected(value);
    record("ja_vende", 20, { ja_vende: value });
    setTimeout(() => {
      setSelected(undefined);
      if (value === "sim") pushScreenState("faturamento");
      else startQuestions();
    }, 150);
  }
  function startQuestions() {
    pushScreenState("pergunta", 0);
  }
  const goBackInternal = useCallback(() => {
    setNameError("");
    setPhoneError("");
    setSelected(undefined);
    if (screen === "cadastro") {
      setScreen("inicio");
      saveSession("inicio", 0, answers, name, phone, sessionId, valorResposta);
    } else if (screen === "ja_vende") {
      setScreen("cadastro");
      saveSession("cadastro", 0, answers, name, phone, sessionId, valorResposta);
    } else if (screen === "faturamento") {
      setScreen("ja_vende");
      saveSession("ja_vende", 0, answers, name, phone, sessionId, valorResposta);
    } else if (screen === "pergunta") {
      if (question > 0) {
        setQuestion((q) => q - 1);
        saveSession("pergunta", question - 1, answers, name, phone, sessionId, valorResposta);
      } else {
        setScreen("ja_vende");
        saveSession("ja_vende", 0, answers, name, phone, sessionId, valorResposta);
      }
    } else if (screen === "diagnostico") {
      setQuestion(4);
      setScreen("pergunta");
      saveSession("pergunta", 4, answers, name, phone, sessionId, valorResposta);
    } else if (screen === "oferta") {
      setScreen("diagnostico");
      saveSession("diagnostico", 4, answers, name, phone, sessionId, valorResposta);
    } else if (screen === "pergunta_valor") {
      setScreen("oferta");
      saveSession("oferta", 0, answers, name, phone, sessionId, valorResposta);
    } else if (screen === "pagamento") {
      setScreen("pergunta_valor");
      saveSession("pergunta_valor", 0, answers, name, phone, sessionId, valorResposta);
    } else if (screen === "mentoria") {
      setScreen("faturamento");
      saveSession("faturamento", 0, answers, name, phone, sessionId, valorResposta);
    }
  }, [screen, question, answers, name, phone, sessionId, valorResposta, saveSession]);

  const handleBack = useCallback(() => {
    if (selected !== undefined || busy) return;
    if (
      typeof window !== "undefined" &&
      window.history.state &&
      window.history.state.screen &&
      window.history.state.screen !== "inicio"
    ) {
      window.history.back();
    } else {
      goBackInternal();
    }
  }, [selected, busy, goBackInternal]);

  function chooseValor(valor: number) {
    if (selected !== undefined || busy) return;
    setSelected(String(valor));
    setValorResposta(valor);
    let alreadyTracked = hasTrackedValor.current;
    if (!alreadyTracked && typeof window !== "undefined") {
      try {
        if (
          sessionStorage.getItem("nr_respondeu_valor") === "1" ||
          (sessionId &&
            sessionStorage.getItem(`nr_respondeu_valor_${sessionId}`) === "1")
        ) {
          alreadyTracked = true;
        }
      } catch {
        // fallback silencioso
      }
    }
    if (!alreadyTracked) {
      hasTrackedValor.current = true;
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem("nr_respondeu_valor", "1");
          if (sessionId) {
            sessionStorage.setItem(`nr_respondeu_valor_${sessionId}`, "1");
          }
        } catch {
          // fallback silencioso
        }
      }
      record("pergunta_valor", 62, { quanto_pagaria: valor });
      meta("RespondeuValor", { valor, value: valor, currency: "BRL" });
    }
    setTimeout(() => {
      setSelected(undefined);
      pushScreenState(
        "pagamento",
        0,
        undefined,
        undefined,
        undefined,
        undefined,
        valor,
      );
    }, 150);
  }
  function chooseRevenue(value: string) {
    if (selected !== undefined || busy) return;
    setSelected(value);
    const mentoring = value === "acima_30mil";
    record("faturamento", mentoring ? 35 : 30, {
      faixa_faturamento: value,
      rota: mentoring ? "mentoria" : "curso",
      status: mentoring ? "mentoria" : "em_andamento",
    });
    if (mentoring) meta("LeadMentoria");
    setTimeout(() => {
      setSelected(undefined);
      if (mentoring) pushScreenState("mentoria");
      else startQuestions();
    }, 150);
  }
  function chooseAnswer(value: Answer) {
    if (selected !== undefined || busy) return;
    setSelected(value);
    const key = `p${question + 1}` as keyof QuizAnswers,
      next = { ...answers, [key]: value };
    setAnswers(next);
    record(key, 41 + question, { [key]: value });
    setTimeout(() => {
      setSelected(undefined);
      if (question < 4) pushScreenState("pergunta", question + 1, next);
      else {
        const points = questions
          .filter((_, i) => next[`p${i + 1}` as keyof QuizAnswers] !== "sim")
          .map((q) => q[1]);
        record("diagnostico", 50, {
          pontos_diagnostico: points.join(";"),
          qtd_pontos: points.length,
        });
        meta("DiagnosticoConcluido", { qtd_pontos: points.length });
        pushScreenState("diagnostico", 4, next);
      }
    }, 150);
  }
  function showOffer() {
    record("oferta", 60, { viu_oferta_em: new Date().toISOString() });
    pushScreenState("oferta", 0);
  }
  function playCourseVideo() {
    setVideoPlayed(true);
    let alreadyTracked = hasTrackedVideo.current;
    if (!alreadyTracked && typeof window !== "undefined") {
      try {
        if (
          sessionStorage.getItem("nr_assistiu_video") === "1" ||
          (sessionId &&
            sessionStorage.getItem(`nr_assistiu_video_${sessionId}`) === "1")
        ) {
          alreadyTracked = true;
        }
      } catch {
        // fallback silencioso
      }
    }
    if (!alreadyTracked) {
      hasTrackedVideo.current = true;
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem("nr_assistiu_video", "1");
          if (sessionId) {
            sessionStorage.setItem(`nr_assistiu_video_${sessionId}`, "1");
          }
        } catch {
          // fallback silencioso
        }
      }
      record("assistiu_video", currentStage(screen, question), {
        assistiu_video_em: new Date().toISOString(),
      });
      meta("AssistiuVideoCurso");
    }
  }
  function toggleVideoPlayPause() {
    if (!ytPlayerRef.current) return;
    try {
      const state = ytPlayerRef.current.getPlayerState?.();
      if (state === 1) {
        ytPlayerRef.current.pauseVideo?.();
        setIsVideoPlaying(false);
      } else {
        ytPlayerRef.current.playVideo?.();
        setIsVideoPlaying(true);
      }
    } catch {}
  }
  function toggleVideoSound() {
    if (!ytPlayerRef.current) return;
    try {
      if (ytPlayerRef.current.isMuted?.()) {
        ytPlayerRef.current.unMute?.();
        setIsVideoMuted(false);
      } else {
        ytPlayerRef.current.mute?.();
        setIsVideoMuted(true);
      }
    } catch {}
  }
  function goToValueQuestion() {
    if (ytPlayerRef.current) {
      try {
        ytPlayerRef.current.pauseVideo?.();
        setIsVideoPlaying(false);
      } catch {}
    }
    pushScreenState("pergunta_valor", 0);
  }
  function checkout() {
    const eventId = meta("CliqueCheckout");
    record("clique_checkout", 70, {
      clicou_checkout_em: new Date().toISOString(),
      event_id_meta: eventId,
    });
    const url =
      process.env.NEXT_PUBLIC_CHECKOUT_URL ||
      "https://pay.kiwify.com.br/InK3eLE";
    const target = new URL(url);
    Object.entries(utms.current).forEach(([k, v]) => {
      if (v) target.searchParams.set(k, v);
    });
    // Navegadores de app (Instagram, Facebook, WhatsApp): abrir na mesma aba para não abrir tela branca
    window.location.href = target.toString();
  }
  async function mentoring() {
    await meta("AplicacaoMentoria");
    await record("clique_mentoria", 36, {
      clicou_mentoria_em: new Date().toISOString(),
    });
    const url = process.env.NEXT_PUBLIC_FORM_MENTORIA_URL;
    if (url) {
      try {
        const target = new URL(url);
        Object.entries(utms.current).forEach(([k, v]) => {
          if (v) target.searchParams.set(k, v);
        });
        window.location.href = target.toString();
      } catch {
        window.location.href = url;
      }
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    const unlockAudio = () => {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          if (ctx.state === "suspended") {
            ctx.resume().catch(() => {});
          }
          setTimeout(() => {
            try {
              ctx.close().catch(() => {});
            } catch {}
          }, 60);
        }
      } catch {}
    };
    window.addEventListener("touchstart", unlockAudio, {
      passive: true,
      once: true,
    });
    window.addEventListener("click", unlockAudio, {
      passive: true,
      once: true,
    });
    return () => {
      window.removeEventListener("touchstart", unlockAudio);
      window.removeEventListener("click", unlockAudio);
    };
  }, []);
  return (
    <main
      className={`quiz-shell ${screen === "inicio" ? "is-hero" : ""} ${screen === "oferta" || screen === "mentoria" || screen === "pagamento" ? "is-long" : ""}`}
    >
      <div className="quiz-content">
        {screen !== "inicio" &&
        screen !== "mentoria" &&
        screen !== "oferta" &&
        screen !== "pagamento" ? (
          <Image
            className="logo logo-small"
            src="/imagens/logo/logo-maquina-de-vendas-sm.webp"
            width={180}
            height={115}
            alt="Máquina de Vendas 2.0"
            priority
          />
        ) : null}
        {screen !== "inicio" ? (
          <BackButton onClick={handleBack} disabled={busy || Boolean(selected)} />
        ) : null}
        {screen === "inicio" ? (
          <>
            <section className="screen screen-inicio">
              <span className="eyebrow eyebrow-capa">DIAGNÓSTICO GRATUITO</span>
              <h1 className="headline-capa">
                Descubra em 5 perguntas se você está{" "}
                <span className="yellow">
                  pronto para vender no Mercado Livre
                </span>{" "}
                sem quebrar nos primeiros 3 meses
              </h1>
              <p className="subtitle-capa">
                O diagnóstico mostra o que você já sabe e o que ainda falta para
                vender com margem desde o primeiro produto.
              </p>
              <div className="print-container print-container-capa">
                <div className="print-card print-card-capa">
                  <Image
                    src={capaPrint.src}
                    alt={capaPrint.alt}
                    width={capaPrint.width}
                    height={capaPrint.height}
                    sizes="(max-width: 600px) 100vw, 560px"
                    priority
                    className="print-img"
                  />
                </div>
                {renderPrintLegend(capaPrint, true)}
              </div>
            </section>
            <aside className="fixed-cta-bar" aria-label="Ação da capa">
              <div className="fixed-cta-inner">
                <button
                  className="btn-primary btn-capa-fixed"
                  onClick={() => pushScreenState("cadastro")}
                >
                  FAZER O DIAGNÓSTICO
                </button>
                <p className="fixed-cta-subline">Leva menos de 1 minuto</p>
              </div>
            </aside>
          </>
        ) : null}
        {screen === "cadastro" ? (
          <form className="screen" onSubmit={submitLead}>
            <h2>Para onde enviamos seu diagnóstico?</h2>
            <div className="field">
              <label htmlFor="name">Seu nome</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError("");
                }}
                autoComplete="given-name"
                autoCapitalize="words"
                enterKeyHint="next"
                onFocus={(e) =>
                  e.target.scrollIntoView({
                    block: "center",
                    behavior: "smooth",
                  })
                }
              />
              {nameError ? (
                <p className="error field-error">{nameError}</p>
              ) : null}
            </div>
            <div className="field">
              <label htmlFor="phone">Seu WhatsApp com DDD</label>
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => {
                  setPhone(formatWhatsApp(e.target.value));
                  setPhoneError("");
                }}
                autoComplete="tel-national"
                enterKeyHint="done"
                placeholder="(DD) 9XXXX-XXXX"
                onFocus={(e) =>
                  e.target.scrollIntoView({
                    block: "center",
                    behavior: "smooth",
                  })
                }
              />
              {phoneError ? (
                <p className="error field-error">{phoneError}</p>
              ) : null}
            </div>
            <button className="btn-primary" disabled={busy}>
              {busy ? "Salvando..." : "Continuar"}
            </button>
            <p className="privacy">
              Seus dados ficam só com a equipe do Nathan.
            </p>
          </form>
        ) : null}
        {screen === "ja_vende" ? (
          <Choice
            title="Você já vende no Mercado Livre?"
            options={[
              ["nao", "Ainda não"],
              ["sim", "Sim, já vendo"],
            ]}
            selected={selected}
            onChoose={(v) => chooseSeller(v as "sim" | "nao")}
          />
        ) : null}
        {screen === "faturamento" ? (
          <Choice
            title="Quanto você fatura por mês no Mercado Livre?"
            options={[
              ["ate_5mil", "Até R$ 5 mil"],
              ["5_a_15mil", "De R$ 5 mil a R$ 15 mil"],
              ["15_a_30mil", "De R$ 15 mil a R$ 30 mil"],
              ["acima_30mil", "Acima de R$ 30 mil"],
            ]}
            selected={selected}
            onChoose={chooseRevenue}
          />
        ) : null}
        {screen === "pergunta" ? (
          <section className="screen screen-pergunta">
            <Progress current={question + 1} />
            <div key={question} className="print-container question-print-container">
              <div className="print-card question-print-card">
                <Image
                  src={questionPrints[question].src}
                  alt={questionPrints[question].alt}
                  width={questionPrints[question].width}
                  height={questionPrints[question].height}
                  sizes="(max-width: 600px) 100vw, 560px"
                  priority
                  className="print-img"
                />
              </div>
              {renderPrintLegend(questionPrints[question])}
            </div>
            <h2>{questions[question][0]}</h2>
            <div className="answers">
              {answerLabels.map(([v, l]) => (
                <button
                  key={v}
                  className={`answer ${selected === v ? "selected" : ""}`}
                  onClick={() => chooseAnswer(v)}
                >
                  {l}
                </button>
              ))}
            </div>
          </section>
        ) : null}
        {screen === "diagnostico" ? (
          <>
            <section className="screen screen-diagnostico-wrap">
              <h2>
                {missing.length
                  ? `${name.trim().split(" ")[0] || "Você"}, seu diagnóstico está pronto`
                  : `${name.trim().split(" ")[0] || "Você"}, você já domina a base`}
              </h2>
              {missing.length ? (
                <>
                  <p className="muted">
                    Para vender com margem no Mercado Livre, você ainda precisa
                    aprender estes pontos:
                  </p>
                  {missing.map((x) => (
                    <Result key={x} good={false}>
                      {x}
                    </Result>
                  ))}
                  {mastered.length ? (
                    <>
                      <p className="eyebrow" style={{ marginTop: 24 }}>
                        O QUE VOCÊ JÁ DOMINA
                      </p>
                      {mastered.map((x) => (
                        <Result key={x} good>
                          {x}
                        </Result>
                      ))}
                    </>
                  ) : null}
                  <p className="two-paths-intro">
                    Agora você sabe o que precisa aprender. Existem dois caminhos:
                  </p>
                  <div className="two-paths-container">
                    <div className="path-card path-card-1">
                      <span className="path-label">CAMINHO 1</span>
                      <p className="path-text">
                        Aprender cada ponto sozinho, procurando o conteúdo por conta própria e testando até acertar.
                      </p>
                    </div>
                    <div className="path-card path-card-2">
                      <span className="path-label">CAMINHO 2</span>
                      <p className="path-text">
                        Aprender todos os pontos em uma única plataforma, com o passo a passo de quem vende no Mercado Livre desde 2022.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <p className="muted">
                  O curso aprofunda os pontos em que a maioria trava depois das
                  primeiras vendas: escolha de produto e controle de margem.
                </p>
              )}
            </section>
            <aside className="fixed-cta-bar" aria-label="Avançar para a oferta">
              <div className="fixed-cta-inner">
                <button
                  className="btn-primary btn-fixed-bar btn-course-single-line"
                  onClick={showOffer}
                >
                  QUERO O CURSO MÁQUINA DE VENDAS
                </button>
              </div>
            </aside>
          </>
        ) : null}
        {screen === "oferta" ? (
          <>
            <section className="screen offer-screen">
            <header className="offer-heading">
              <span className="eyebrow">SEU PRÓXIMO PASSO</span>
              <h2>
                {missing.length > 0 ? (
                  <>
                    Em quais módulos você vai focar para melhorar os{" "}
                    <span className="yellow">pontos do seu diagnóstico</span>
                  </>
                ) : (
                  "Os módulos que vão aprofundar o que você já sabe"
                )}
              </h2>
            </header>
            <section className="offer-section">
              <div className="topic-list">
                {missing.length > 0
                  ? relevantTopics.map((topic) => (
                      <div className="diagnostic-topic-card" key={topic.point}>
                        <Image
                          className="diagnostic-topic-thumb"
                          src={topic.coverImage}
                          width={48}
                          height={72}
                          alt={topic.badge}
                        />
                        <div className="diagnostic-topic-content">
                          <span className="diagnostic-topic-badge">
                            {topic.badge}
                          </span>
                          <h4 className="diagnostic-topic-title">
                            {topic.point}
                          </h4>
                          <p className="diagnostic-topic-text">
                            {topic.howToLearn}
                          </p>
                        </div>
                      </div>
                    ))
                  : MASTERY_TOPICS.map((topic) => (
                      <div className="diagnostic-topic-card" key={topic.badge}>
                        <Image
                          className="diagnostic-topic-thumb"
                          src={topic.coverImage}
                          width={48}
                          height={72}
                          alt={topic.badge}
                        />
                        <div className="diagnostic-topic-content">
                          <span className="diagnostic-topic-badge">
                            {topic.badge}
                          </span>
                          <p
                            className="diagnostic-topic-text"
                            style={{ marginTop: 4 }}
                          >
                            {topic.text}
                          </p>
                        </div>
                      </div>
                    ))}
              </div>
              <div style={{ marginTop: 24 }}>
                <button
                  className="btn-primary btn-course-single-line offer-content-btn content-action-btn"
                  onClick={goToValueQuestion}
                >
                  QUERO O CURSO MÁQUINA DE VENDAS
                </button>
              </div>
            </section>
            <section className="offer-section video-section">
              <div className="video-header">
                <h3>Ainda tem dúvidas sobre o curso?</h3>
                <p>
                  No vídeo abaixo, o Nathan explica cada parte do Máquina de
                  Vendas. E logo depois tem o que você recebe, os 10 módulos e
                  resultados de alunos.
                </p>
              </div>
              <div className="video-wrapper">
                {videoPlayed ? (
                  <>
                    <iframe
                      id="course-yt-player"
                      className="video-iframe"
                      src="https://www.youtube-nocookie.com/embed/RXcBV_dWnh4?autoplay=1&controls=0&cc_load_policy=0&iv_load_policy=3&rel=0&modestbranding=1&playsinline=1&disablekb=1&fs=0&enablejsapi=1&hl=pt-BR"
                      title="Vídeo de Apresentação Máquina de Vendas"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                    <div
                      className="video-click-overlay"
                      onClick={toggleVideoPlayPause}
                      role="button"
                      tabIndex={0}
                      aria-label={
                        isVideoPlaying ? "Pausar vídeo" : "Reproduzir vídeo"
                      }
                    >
                      {!isVideoPlaying ? (
                        <div className="video-paused-pill" aria-hidden="true">
                          <svg
                            viewBox="0 0 24 24"
                            width="28"
                            height="28"
                            fill="#0A0F1C"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      className="video-sound-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVideoSound();
                      }}
                      aria-label={isVideoMuted ? "Ativar som" : "Desativar som"}
                    >
                      {isVideoMuted ? (
                        <svg
                          viewBox="0 0 24 24"
                          width="20"
                          height="20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path
                            d="M11 5L6 9H2v6h4l5 4V5z"
                            fill="currentColor"
                          />
                          <line x1="23" y1="9" x2="17" y2="15" />
                          <line x1="17" y1="9" x2="23" y2="15" />
                        </svg>
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          width="20"
                          height="20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path
                            d="M11 5L6 9H2v6h4l5 4V5z"
                            fill="currentColor"
                          />
                          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                        </svg>
                      )}
                    </button>
                    <div className="video-progress-track" aria-hidden="true">
                      <div
                        className="video-progress-fill"
                        style={{ width: `${videoProgress}%` }}
                      />
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    className="video-thumbnail-btn"
                    onClick={playCourseVideo}
                    aria-label="Assistir vídeo sobre o curso"
                  >
                    <Image
                      src="https://i.ytimg.com/vi/RXcBV_dWnh4/maxresdefault.jpg"
                      alt="Capa do vídeo Máquina de Vendas"
                      fill
                      className="video-thumbnail-img"
                      priority={false}
                      unoptimized
                    />
                    <span className="video-play-btn" aria-hidden="true">
                      <svg
                        viewBox="0 0 24 24"
                        width="30"
                        height="30"
                        fill="#0A0F1C"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </button>
                )}
              </div>
              <div className="video-btn-wrap">
                <button
                  className="btn-primary btn-course-single-line offer-content-btn content-action-btn"
                  onClick={goToValueQuestion}
                >
                  QUERO O CURSO MÁQUINA DE VENDAS
                </button>
              </div>
            </section>
            <section className="offer-section receives-section">
              <h3>O que você recebe</h3>
              <div className="benefit-list">
                {COURSE_BENEFITS.map((item) => (
                  <div key={item}>
                    <span className="check">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>
            <section className="offer-section carousel-section">
              <h3>
                Os <span className="yellow">10 módulos</span> do curso
              </h3>
              <ModuleCarousel items={COURSE_MODULES} />
            </section>
            <section className="offer-section carousel-section">
              <h3>
                <span className="yellow">Resultados</span> de quem aplica o
                método do Nathan
              </h3>
              <ProofCarousel items={offerProofs} />
            </section>
            <section className="teacher-card">
              <Image
                src="/imagens/nathan/nathan-foto-fundo-preto.webp"
                width={700}
                height={700}
                alt="Nathan Ritter"
                sizes="(max-width: 600px) 92vw, 480px"
                loading="lazy"
              />
              <div>
                <span className="eyebrow">QUEM ENSINA</span>
                <h3>Nathan Ritter</h3>
                <p>
                  Comecei no Mercado Livre errando muito: produto errado, margem
                  zero, estresse máximo. Descobri na prática que a virada não
                  vem de trabalhar mais, vem de trabalhar no produto certo com a
                  estrutura certa. Hoje ensino exatamente o que funciona pra
                  mim, sem firulas e sem papo furado, direto ao ponto.
                </p>
              </div>
            </section>
            <div style={{ marginTop: 32 }}>
              <button
                className="btn-primary btn-course-single-line offer-content-btn content-action-btn"
                onClick={goToValueQuestion}
              >
                QUERO O CURSO MÁQUINA DE VENDAS
              </button>
            </div>
          </section>
          <aside
            className={`sticky-cta-bar ${isOfferStickyVisible ? "is-active" : ""}`}
            aria-label="Ação da oferta"
          >
            <div className="fixed-cta-inner">
              <button
                className="btn-primary btn-fixed-bar btn-course-single-line"
                onClick={goToValueQuestion}
              >
                QUERO O CURSO MÁQUINA DE VENDAS
              </button>
            </div>
          </aside>
          </>
        ) : null}
        {screen === "pergunta_valor" ? (
          <section className="screen">
            <h2>Quanto você pagaria pelo Máquina de Vendas?</h2>
            <p className="value-subtitle">
              Um curso com módulos que vão do primeiro passo à escala no Mercado Livre,
              incluindo cada ponto que apareceu no seu diagnóstico.
            </p>
            <div className="value-warning-card">
              <svg
                className="value-warning-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <p className="value-warning-text">
                Esse não é o valor que você vai pagar. Queremos saber quanto o curso vale
                para você, e o preço real é menor do que qualquer uma das opções.
              </p>
            </div>
            <div className="answers">
              {[
                [1500, "R$ 1.500"],
                [1000, "R$ 1.000"],
                [600, "R$ 600"],
                [300, "R$ 300"],
              ].map(([val, label]) => (
                <button
                  key={val}
                  className={`answer ${selected === String(val) ? "selected" : ""}`}
                  onClick={() => chooseValor(val as number)}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>
        ) : null}
        {screen === "pagamento" ? (
          <>
            <section className="screen payment-screen">
              {iphoneToastState !== "hidden" ? (
                <div
                  className={`iphone-banner ${iphoneToastState === "showing" ? "is-showing" : "is-hiding"}`}
                  role="status"
                  aria-live="polite"
                >
                  <div className="iphone-banner-icon">
                    <Image
                      src="/imagens/logo/icone-caixa.png"
                      width={38}
                      height={38}
                      alt="Máquina de Vendas"
                      priority
                    />
                  </div>
                  <div className="iphone-banner-content">
                    <span className="iphone-banner-app">MÁQUINA DE VENDAS</span>
                    <span className="iphone-banner-text">
                      <strong>{process.env.VENDAS_BASE || "177"}</strong> pessoas já compraram o curso
                    </span>
                  </div>
                </div>
              ) : null}

              <h1 className="payment-headline">
                {valorResposta !== null ? (
                  <>
                    Você disse que pagaria R$&nbsp;{valorResposta.toLocaleString("pt-BR")}, mas o curso sai por{" "}
                    <span className="yellow">menos de R$&nbsp;2 por dia</span>
                  </>
                ) : (
                  <>
                    O curso completo sai por{" "}
                    <span className="yellow">menos de R$&nbsp;2 por dia</span>
                  </>
                )}
              </h1>

              <div className="offer-card payment-card">
                <Image
                  className="logo"
                  src="/imagens/logo/logo-maquina-de-vendas-sm.webp"
                  width={190}
                  height={122}
                  alt="Máquina de Vendas 2.0"
                />
                <h2>Máquina de Vendas 2.0</h2>
                <div className="price-single-line">
                  <span className="price-installment-label">12x de</span>
                  <span className="price-installment-value">
                    R$ {process.env.NEXT_PUBLIC_PRECO_PARCELA || "30,72"}
                  </span>
                </div>
                <p className="price-cash">
                  ou R$ {process.env.NEXT_PUBLIC_PRECO_AVISTA || "297"} à vista
                </p>
                <button
                  className="btn-primary payment-content-btn content-action-btn"
                  onClick={checkout}
                >
                  QUERO PAGAR AGORA
                </button>
                <p className="lock">🔒 Acesso imediato após pagamento</p>
              </div>

              <section className="payment-proofs-section">
                <h3>
                  <span className="yellow">Resultados</span> de quem aplica o método do Nathan
                </h3>
                <ProofCarousel items={offerProofs} />
              </section>

              <div className="payment-secondary-cta">
                <button
                  className="btn-primary payment-content-btn content-action-btn"
                  onClick={checkout}
                >
                  QUERO PAGAR AGORA
                </button>
                <p className="lock">🔒 Acesso imediato após pagamento</p>
              </div>

              {showBuyerToast ? (
                <aside className="buyer-toast" role="status" aria-live="polite">
                  <span className="buyer-toast-dot" aria-hidden="true" />
                  <span>
                    {buyerInfo.latestBuyer} entrou no Máquina de Vendas
                    {buyerInfo.timeAgo ? ` · há ${buyerInfo.timeAgo}` : ""}
                  </span>
                </aside>
              ) : null}
            </section>
            <aside
              className={`sticky-cta-bar ${isPaymentStickyVisible ? "is-active" : ""}`}
              aria-label="Ação de pagamento"
            >
              <div className="fixed-cta-inner">
                <button
                  className="btn-primary btn-fixed-bar"
                  onClick={checkout}
                >
                  QUERO PAGAR AGORA
                </button>
              </div>
            </aside>
          </>
        ) : null}
        {screen === "mentoria" ? (
          <>
            <section className="screen mentor-flow">
              <div className="mentor-copy">
                <span className="eyebrow">ACOMPANHAMENTO INDIVIDUAL</span>
                <h2>
                  Pelo seu faturamento, você pode precisar de um acompanhamento
                  individual
                </h2>
                <p className="muted">
                  Quem já fatura acima de R$ 30 mil por mês costuma ter decisões
                  mais específicas sobre estoque, caixa e escala. Nesses casos, o
                  Nathan acompanha a operação de perto, na mentoria individual. Se
                  tiver interesse, preencha o formulário. O próprio Nathan entra
                  em contato com você.
                </p>
                <p className="mentor-results-callout">
                  Veja abaixo os resultados de alguns mentorados do Nathan.
                </p>
              </div>
              <Image
                className="mentor-photo"
                src="/imagens/nathan/nathan-recorte.webp"
                width={680}
                height={900}
                alt="Nathan Ritter de braços cruzados"
                sizes="(max-width: 600px) 92vw, 450px"
                loading="lazy"
              />
              <section className="mentor-results">
                <h3>
                  <span className="yellow">Resultados</span> dos mentorados do
                  Nathan
                </h3>
                <ProofCarousel items={mentoringProofs} />
              </section>
            </section>
            <aside className="fixed-cta-bar" aria-label="Ação da mentoria">
              <div className="fixed-cta-inner">
                <button
                  className="btn-primary btn-fixed-bar"
                  onClick={mentoring}
                >
                  Quero falar sobre a mentoria
                </button>
              </div>
            </aside>
          </>
        ) : null}
      </div>
    </main>
  );
}
function currentStage(screen: Screen, question: number) {
  return screen === "cadastro"
    ? 10
    : screen === "ja_vende"
      ? 20
      : screen === "faturamento"
        ? 30
        : screen === "pergunta"
          ? 41 + question
          : screen === "diagnostico"
            ? 50
            : screen === "oferta"
              ? 60
              : screen === "pergunta_valor"
                ? 62
                : screen === "pagamento"
                  ? 65
                : screen === "mentoria"
                  ? 35
                  : 0;
}
function BackButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      className="btn-back"
      onClick={onClick}
      disabled={disabled}
      aria-label="Voltar para a etapa anterior"
    >
      <span aria-hidden="true">←</span> Voltar
    </button>
  );
}
function Choice({
  title,
  options,
  selected,
  onChoose,
}: {
  title: string;
  options: Array<[string, string]>;
  selected?: string;
  onChoose: (value: string) => void;
}) {
  return (
    <section className="screen">
      <h2>{title}</h2>
      <div className="answers">
        {options.map(([v, l]) => (
          <button
            key={v}
            className={`answer ${selected === v ? "selected" : ""}`}
            onClick={() => onChoose(v)}
          >
            {l}
          </button>
        ))}
      </div>
    </section>
  );
}
function Progress({ current }: { current: number }) {
  return (
    <div className="progress">
      <div className="progress-meta">
        <span>Pergunta {current} de 5</span>
        <span>{current * 20}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-bar" style={{ width: `${current * 20}%` }} />
      </div>
    </div>
  );
}
function Result({ good, children }: { good: boolean; children: string }) {
  return (
    <div className="diagnostic-card">
      <span className={`diagnostic-icon ${good ? "good" : "bad"}`}>
        {good ? "✓" : "×"}
      </span>
      <span>{children}</span>
    </div>
  );
}


