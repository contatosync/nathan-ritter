"use client";

import Image from "next/image";
import { ReactNode, useEffect, useRef, useState } from "react";

export function Carousel({
  children,
  itemCount,
}: {
  children: ReactNode;
  itemCount: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const first = el.firstElementChild as HTMLElement | null;
      if (!first) return;
      setActive(
        Math.round(el.scrollLeft / (first.getBoundingClientRect().width + 16)),
      );
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  function scrollTo(index: number) {
    const el = ref.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return;
    el.scrollTo({
      left: index * (first.getBoundingClientRect().width + 16),
      behavior: "smooth",
    });
  }

  return (
    <div className="carousel-wrap">
      <button
        className="carousel-arrow previous"
        type="button"
        aria-label="Anterior"
        disabled={active === 0}
        onClick={() => scrollTo(Math.max(0, active - 1))}
      >
        ←
      </button>
      <div className="carousel" ref={ref}>
        {children}
      </div>
      <button
        className="carousel-arrow next"
        type="button"
        aria-label="Próximo"
        disabled={active >= itemCount - 1}
        onClick={() => scrollTo(Math.min(itemCount - 1, active + 1))}
      >
        →
      </button>
      <div className="carousel-dots" aria-label="Navegação do carrossel">
        {Array.from({ length: itemCount }).map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Ir para item ${index + 1}`}
            className={index === active ? "active" : ""}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
}

export type ModuleItem = { number: string; title: string; image: string };
export type ProofItem = { number: string; caption: string; image: string };

export function ModuleCarousel({ items }: { items: ModuleItem[] }) {
  return (
    <Carousel itemCount={items.length}>
      {items.map((item, index) => (
        <article className="module-card" key={item.number}>
          <Image
            src={item.image}
            alt={`Módulo ${item.number}: ${item.title}`}
            width={720}
            height={720}
            loading={index === 0 ? "eager" : "lazy"}
          />
          <span className="module-badge">MÓDULO {item.number}</span>
          <div className="module-caption">
            <span />
            {item.title}
          </div>
        </article>
      ))}
    </Carousel>
  );
}

export function ProofCarousel({ items }: { items: ProofItem[] }) {
  const [selected, setSelected] = useState<ProofItem | null>(null);

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selected]);

  return (
    <>
      <Carousel itemCount={items.length}>
        {items.map((item, index) => (
          <article className="proof-card" key={item.number}>
            <button
              type="button"
              onClick={() => setSelected(item)}
              aria-label={`Ampliar resultado ${item.number}`}
            >
              <Image
                src={item.image}
                alt={item.caption}
                width={600}
                height={1065}
                loading={index === 0 ? "eager" : "lazy"}
              />
            </button>
            <p>{item.caption}</p>
          </article>
        ))}
      </Carousel>
      {selected ? (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Resultado ${selected.number}`}
          onClick={() => setSelected(null)}
        >
          <button
            type="button"
            className="lightbox-close"
            aria-label="Fechar imagem"
            onClick={() => setSelected(null)}
          >
            ×
          </button>
          <Image
            src={selected.image}
            alt={selected.caption}
            width={600}
            height={1065}
            priority
            onClick={(event) => event.stopPropagation()}
          />
          <p>{selected.caption}</p>
        </div>
      ) : null}
    </>
  );
}
