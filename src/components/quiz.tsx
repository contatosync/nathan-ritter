"use client";
import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
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
  70: "clique_checkout",
};
const answerLabels: Array<[Answer, string]> = [
  ["sim", "Sim, sei fazer"],
  ["mais_ou_menos", "Mais ou menos"],
  ["nao", "Não sei"],
];
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
  async function record(
    evento: string,
    etapa: number,
    data: Record<string, unknown> = {},
  ) {
    if (!sessionId && etapa > 10) return;
    await fetch("/api/events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        evento,
        etapa,
        etapa_nome: stageNames[etapa],
        ...data,
      }),
    });
  }
  async function meta(
    eventName: string,
    customData: Record<string, unknown> = {},
    userData: Record<string, unknown> = {},
  ) {
    const eventId = crypto.randomUUID();
    const standard = ["PageView", "Lead"].includes(eventName);
    window.fbq?.(standard ? "track" : "trackCustom", eventName, customData, {
      eventID: eventId,
    });
    await fetch("/api/meta", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        eventName,
        eventId,
        customData,
        userData,
        eventSourceUrl: location.href,
      }),
    });
    return eventId;
  }
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    for (const key of [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "fbclid",
    ]) {
      const value = p.get(key);
      if (value) utms.current[key] = value;
    }
    void meta("PageView");
  }, []);
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
    const eventId = await meta(
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
  async function chooseSeller(value: "sim" | "nao") {
    setSelected(value);
    await record("ja_vende", 20, { ja_vende: value });
    setTimeout(() => {
      setSelected(undefined);
      if (value === "sim") setScreen("faturamento");
      else startQuestions();
    }, 500);
  }
  function startQuestions() {
    setQuestion(0);
    setScreen("pergunta");
  }
  function goBack() {
    if (selected || busy) return;
    setError("");
    if (screen === "cadastro") setScreen("inicio");
    else if (screen === "ja_vende") setScreen("cadastro");
    else if (screen === "faturamento") setScreen("ja_vende");
    else if (screen === "pergunta") {
      if (question > 0) setQuestion((q) => q - 1);
      else setScreen("ja_vende");
    } else if (screen === "diagnostico") setScreen("pergunta");
    else if (screen === "oferta") setScreen("diagnostico");
    else if (screen === "mentoria") setScreen("faturamento");
  }
  async function chooseRevenue(value: string) {
    setSelected(value);
    const mentoring = value === "acima_30mil";
    await record("faturamento", mentoring ? 35 : 30, {
      faixa_faturamento: value,
      rota: mentoring ? "mentoria" : "curso",
      status: mentoring ? "mentoria" : "em_andamento",
    });
    if (mentoring) await meta("LeadMentoria");
    setTimeout(() => {
      setSelected(undefined);
      if (mentoring) setScreen("mentoria");
      else startQuestions();
    }, 500);
  }
  async function chooseAnswer(value: Answer) {
    setSelected(value);
    const key = `p${question + 1}` as keyof QuizAnswers,
      next = { ...answers, [key]: value };
    setAnswers(next);
    await record(key, 41 + question, { [key]: value });
    setTimeout(async () => {
      setSelected(undefined);
      if (question < 4) setQuestion((q) => q + 1);
      else {
        const points = questions
          .filter((_, i) => next[`p${i + 1}` as keyof QuizAnswers] !== "sim")
          .map((q) => q[1]);
        await record("diagnostico", 50, {
          pontos_diagnostico: points.join(";"),
          qtd_pontos: points.length,
        });
        await meta("DiagnosticoConcluido", { qtd_pontos: points.length });
        setScreen("diagnostico");
      }
    }, 500);
  }
  async function showOffer() {
    await record("oferta", 60, { viu_oferta_em: new Date().toISOString() });
    setScreen("oferta");
  }
  async function checkout() {
    const eventId = await meta("CliqueCheckout");
    await record("clique_checkout", 70, {
      clicou_checkout_em: new Date().toISOString(),
      event_id_meta: eventId,
    });
    const url = process.env.NEXT_PUBLIC_CHECKOUT_URL;
    if (!url) {
      alert("Link de pagamento em configuração");
      return;
    }
    const target = new URL(url);
    Object.entries(utms.current).forEach(([k, v]) =>
      target.searchParams.set(k, v),
    );
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
    <main className="quiz-shell">
      <div className="quiz-content">
        {screen !== "inicio" && screen !== "mentoria" ? (
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
          <BackButton
            onClick={goBack}
            disabled={busy || Boolean(selected)}
          />
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
                ? `Seu diagnóstico está pronto, ${name.split(" ")[0]}`
                : `Você já domina a base, ${name.split(" ")[0]}`}
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
                <p className="muted">
                  Você pode estudar cada um sozinho. Se preferir seguir o
                  caminho que o Nathan usa desde 2022, ele está organizado no
                  curso Máquina de Vendas.
                </p>
              </>
            ) : (
              <p className="muted">
                O curso aprofunda os pontos em que a maioria trava depois das
                primeiras vendas: escolha de produto e controle de margem.
              </p>
            )}
            <button className="btn-primary" onClick={showOffer}>
              {missing.length ? "Ver como aprender" : "Ver o curso"}
            </button>
          </section>
        ) : null}
        {screen === "oferta" ? (
          <section className="screen">
            <div className="offer-card">
              <Image
                className="logo"
                src="/imagens/logo/logo-maquina-de-vendas-sm.webp"
                width={190}
                height={122}
                alt="Máquina de Vendas 2.0"
              />
              <h2>Máquina de Vendas 2.0</h2>
              <div className="price">
                12x de R$ {process.env.NEXT_PUBLIC_PRECO_PARCELA}
              </div>
              <p>Menos de R$ {process.env.NEXT_PUBLIC_PRECO_DIA} por dia</p>
              <p className="muted">
                ou R$ {process.env.NEXT_PUBLIC_PRECO_AVISTA} à vista
              </p>
              <button className="btn-primary" onClick={checkout}>
                Quero começar agora
              </button>
              <p className="lock">🔒 Acesso imediato após pagamento</p>
            </div>
            <div className="result-strip">
              Método prático · Produto · Margem · Anúncio · Estoque
            </div>
          </section>
        ) : null}
        {screen === "mentoria" ? (
          <section className="screen mentor">
            <div>
              <span className="eyebrow">ACOMPANHAMENTO INDIVIDUAL</span>
              <h2>
                Pelo seu faturamento, você pode precisar de um acompanhamento
                individual
              </h2>
              <p className="muted">
                Quem já fatura acima de R$ 30 mil por mês costuma ter decisões
                mais específicas sobre estoque, caixa e escala. Nesses casos, o
                Nathan acompanha a operação de perto, na mentoria individual. Se
                tiver interesse, preencha o formulário e a equipe entra em
                contato.
              </p>
              <button className="btn-primary" onClick={mentoring}>
                Quero falar sobre a mentoria
              </button>
            </div>
            <Image
              src="/imagens/nathan/nathan-recorte.webp"
              width={680}
              height={900}
              alt="Nathan Ritter de braços cruzados"
              priority
            />
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
