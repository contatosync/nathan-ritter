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
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}
function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "").replace(/^0+/, "");
  return digits.startsWith("55") ? digits : `55${digits}`;
}
function validPhone(value: string) {
  return /^55\d{10,11}$/.test(normalizePhone(value));
}
export function Quiz() {
  const [screen, setScreen] = useState<Screen>("inicio");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
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
  const hasTrackedPayment = useRef(false);
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
    setError("");
    if (name.trim().length < 2) {
      setError("Digite seu nome.");
      return;
    }
    if (!validPhone(phone)) {
      setError("Digite um WhatsApp brasileiro válido com DDD.");
      return;
    }
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
    setScreen("ja_vende");
  }
  function chooseSeller(value: "sim" | "nao") {
    if (selected !== undefined || busy) return;
    setSelected(value);
    record("ja_vende", 20, { ja_vende: value });
    setTimeout(() => {
      setSelected(undefined);
      if (value === "sim") setScreen("faturamento");
      else startQuestions();
    }, 150);
  }
  function startQuestions() {
    setQuestion(0);
    setScreen("pergunta");
  }
  function goBack() {
    if (selected !== undefined || busy) return;
    setError("");
    if (screen === "cadastro") setScreen("inicio");
    else if (screen === "ja_vende") setScreen("cadastro");
    else if (screen === "faturamento") setScreen("ja_vende");
    else if (screen === "pergunta") {
      if (question > 0) setQuestion((q) => q - 1);
      else setScreen("ja_vende");
    } else if (screen === "diagnostico") setScreen("pergunta");
    else if (screen === "oferta") setScreen("diagnostico");
    else if (screen === "pagamento") setScreen("oferta");
    else if (screen === "mentoria") setScreen("faturamento");
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
      if (mentoring) setScreen("mentoria");
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
      if (question < 4) setQuestion((q) => q + 1);
      else {
        const points = questions
          .filter((_, i) => next[`p${i + 1}` as keyof QuizAnswers] !== "sim")
          .map((q) => q[1]);
        record("diagnostico", 50, {
          pontos_diagnostico: points.join(";"),
          qtd_pontos: points.length,
        });
        meta("DiagnosticoConcluido", { qtd_pontos: points.length });
        setScreen("diagnostico");
      }
    }, 150);
  }
  function showOffer() {
    record("oferta", 60, { viu_oferta_em: new Date().toISOString() });
    setScreen("oferta");
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
    location.href = target.toString();
  }
  async function mentoring() {
    await meta("AplicacaoMentoria");
    await record("clique_mentoria", 36, {
      clicou_mentoria_em: new Date().toISOString(),
    });
    const url = process.env.NEXT_PUBLIC_FORM_MENTORIA_URL;
    if (url) location.href = url;
  }
  return (
    <main
      className={`quiz-shell ${screen === "inicio" ? "is-hero" : ""} ${screen === "oferta" || screen === "mentoria" ? "is-long" : ""}`}
    >
      <div className="quiz-content">
        {screen !== "inicio" && screen !== "mentoria" && screen !== "oferta" ? (
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
          <BackButton onClick={goBack} disabled={busy || Boolean(selected)} />
        ) : null}
        {screen === "inicio" ? (
          <section className="screen" style={{ textAlign: "center" }}>
            <span className="eyebrow">DIAGNÓSTICO GRATUITO</span>
            <Image
              className="logo logo-hero"
              src="/imagens/logo/logo-maquina-de-vendas-md.webp"
              width={720}
              height={460}
              alt="Máquina de Vendas 2.0"
              priority
            />
            <h1>
              Descubra em 5 perguntas se você está{" "}
              <span className="yellow">
                pronto para vender no Mercado Livre
              </span>{" "}
              sem quebrar nos primeiros 3 meses
            </h1>
            <p className="muted">
              O diagnóstico mostra o que você já sabe e o que ainda falta para
              vender com margem desde o primeiro produto.
            </p>
            <div style={{ marginTop: 28 }}>
              <button
                className="btn-primary"
                onClick={() => setScreen("cadastro")}
              >
                Fazer o diagnóstico
              </button>
            </div>
          </section>
        ) : null}
        {screen === "cadastro" ? (
          <form className="screen" onSubmit={submitLead}>
            <h2>Para onde enviamos seu diagnóstico?</h2>
            <div className="field">
              <label htmlFor="name">Seu nome</label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div className="field">
              <label htmlFor="phone">Seu WhatsApp com DDD</label>
              <input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                autoComplete="tel"
                placeholder="(11) 99999-9999"
              />
            </div>
            {error ? <p className="error">{error}</p> : null}
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
          <section className="screen">
            <Progress current={question + 1} />
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
          <section className="screen">
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
            <button
              className="btn-primary btn-course-single-line"
              style={{ marginTop: 32 }}
              onClick={showOffer}
            >
              QUERO O CURSO MÁQUINA DE VENDAS
            </button>
          </section>
        ) : null}
        {screen === "oferta" ? (
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
                  className="btn-primary btn-course-single-line"
                  onClick={() => setScreen("pagamento")}
                >
                  QUERO O CURSO MÁQUINA DE VENDAS
                </button>
              </div>
            </section>
            <section className="offer-section">
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
                className="btn-primary btn-course-single-line"
                onClick={() => setScreen("pagamento")}
              >
                QUERO O CURSO MÁQUINA DE VENDAS
              </button>
            </div>
          </section>
        ) : null}
        {screen === "pagamento" ? (
          <section className="screen payment-screen">
            <span className="eyebrow">ÚLTIMO PASSO</span>
            <h2>
              Seu acesso ao{" "}
              <span className="yellow">Máquina de Vendas 2.0</span>
            </h2>
            <p className="payment-counter">
              🔥 <span className="yellow">{process.env.VENDAS_BASE || "177"}</span> pessoas já
              compraram o Máquina de Vendas
            </p>
            <p className="payment-subtitle">
              Tudo isso fica por menos de R${" "}
              {process.env.NEXT_PUBLIC_PRECO_DIA_TEXTO || "2"} por dia.
            </p>
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
              <button className="btn-primary" onClick={checkout}>
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
        ) : null}
        {screen === "mentoria" ? (
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
              <button className="btn-primary" onClick={mentoring}>
                Quero falar sobre a mentoria
              </button>
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
              priority
            />
            <section className="mentor-results">
              <h3>
                <span className="yellow">Resultados</span> dos mentorados do
                Nathan
              </h3>
              <ProofCarousel items={mentoringProofs} />
            </section>
            <button className="btn-primary" onClick={mentoring}>
              Quero falar sobre a mentoria
            </button>
          </section>
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


