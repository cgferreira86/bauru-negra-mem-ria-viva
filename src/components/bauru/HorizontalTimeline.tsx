import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, MapPin, X } from "lucide-react";

export type TimelineItem = {
  id: string; periodo: string; titulo: string; resumo: string; detalhe: string;
  fontes: string[]; status: string; territorio?: string;
  imagem?: { url: string; legenda?: string; credito?: string; autorizada?: boolean };
  eventos?: { ano: string; texto: string }[];
};

type Props = {
  items: TimelineItem[];
  renderFonte: (id: string) => ReactNode;
  renderSelo: (s: string) => ReactNode;
  canLocate: (territorioId?: string) => boolean;
  onLocate: (territorioId: string) => void;
};

export function HorizontalTimeline({ items, renderFonte, renderSelo, canLocate, onLocate }: Props) {
  const [idx, setIdx] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [anim, setAnim] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pos, setPos] = useState({ left: 0, arrow: 0, width: 0 });
  const item = items[idx];

  const select = (i: number, focus = false) => {
    const n = Math.max(0, Math.min(items.length - 1, i));
    if (n !== idx) { setIdx(n); setExpanded(false); setAnim((a) => a + 1); }
    const m = markerRefs.current[n];
    if (focus) m?.focus();
    m?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  const measure = () => {
    const wrap = wrapRef.current, m = markerRefs.current[idx];
    if (!wrap || !m) return;
    const W = wrap.clientWidth;
    const cardW = Math.min(560, W);
    const wr = wrap.getBoundingClientRect(), mr = m.getBoundingClientRect();
    const cx = mr.left + mr.width / 2 - wr.left;
    const left = Math.max(0, Math.min(W - cardW, cx - cardW / 2));
    setPos({ left, arrow: Math.max(16, Math.min(cardW - 16, cx - left)), width: cardW });
  };
  useLayoutEffect(measure, [idx]);
  useEffect(() => {
    const t = trackRef.current;
    window.addEventListener("resize", measure);
    t?.addEventListener("scroll", measure, { passive: true });
    return () => { window.removeEventListener("resize", measure); t?.removeEventListener("scroll", measure); };
  });

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); select(idx + 1, true); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); select(idx - 1, true); }
    else if (e.key === "Home") { e.preventDefault(); select(0, true); }
    else if (e.key === "End") { e.preventDefault(); select(items.length - 1, true); }
  };

  const showImg = item.imagem?.autorizada && item.imagem.url;

  return (
    <div ref={wrapRef} className="relative mt-12 flex flex-col">
      {/* Card */}
      <div className="md:min-h-[300px] md:flex md:flex-col md:justify-end order-2 md:order-1">
        <div
          key={anim}
          id="tl-card"
          role="region"
          aria-live="polite"
          aria-label={`${item.periodo} — ${item.titulo}`}
          className="tl-card relative border border-border bg-card p-6 shadow-[0_8px_24px_-12px_hsl(0_0%_0%/0.25)] md:mb-6"
          style={{ marginLeft: pos.width ? pos.left : 0, width: pos.width || "100%", maxWidth: "100%" }}
        >
          <span aria-hidden className="absolute -bottom-2 hidden h-4 w-4 rotate-45 border-b border-r border-border bg-card md:block" style={{ left: pos.arrow - 8 }} />
          <div className="flex items-start justify-between gap-4">
            <p className="font-serif text-3xl font-bold text-accent">{item.periodo}</p>
            {renderSelo(item.status)}
          </div>
          <h3 className="mt-1 text-2xl font-semibold">{item.titulo}</h3>
          <p className="mt-2 line-clamp-3 text-muted-foreground">{item.resumo}</p>

          <div className={`tl-expand grid ${expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`} id="tl-more">
            <div className="overflow-hidden">
              <div className="mt-4 border-t border-border pt-4">
                <p className="leading-relaxed">{item.detalhe}</p>
                {showImg && (
                  <figure className="mt-4">
                    <img src={item.imagem!.url} alt={item.imagem!.legenda ?? ""} className="w-full border border-border" loading="lazy" />
                    <figcaption className="mt-1 text-xs text-muted-foreground">{item.imagem!.legenda}{item.imagem!.credito && ` · ${item.imagem!.credito}`}</figcaption>
                  </figure>
                )}
                {item.eventos?.length ? (
                  <ul className="mt-4 space-y-1 text-sm">{item.eventos.map((ev) => <li key={ev.ano + ev.texto}><span className="font-bold text-accent">{ev.ano}</span> — {ev.texto}</li>)}</ul>
                ) : null}
                <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Fontes documentais</p>
                <div className="mt-1 flex flex-col gap-1">{item.fontes.map((f) => <span key={f}>{renderFonte(f)}</span>)}</div>
                {item.territorio && canLocate(item.territorio) && (
                  <button onClick={() => onLocate(item.territorio!)} className="mt-4 inline-flex items-center gap-2 rounded bg-accent px-4 py-2 text-xs font-bold tracking-widest text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"><MapPin className="h-4 w-4" /> VER NO TERRITÓRIO</button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            {!expanded ? (
              <button onClick={() => setExpanded(true)} aria-expanded={false} aria-controls="tl-more" className="text-xs font-bold uppercase tracking-[0.2em] underline decoration-accent underline-offset-4 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">Explorar memória</button>
            ) : (
              <button onClick={() => setExpanded(false)} aria-expanded aria-controls="tl-more" className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"><X className="h-3 w-3" /> Recolher</button>
            )}
          </div>
        </div>
      </div>

      {/* Track */}
      <div className="order-1 mb-4 flex items-center gap-2 md:order-2 md:mb-0">
        <button onClick={() => select(idx - 1)} disabled={idx === 0} aria-label="Período anterior" className="shrink-0 rounded-full border border-foreground/40 p-2 hover:border-accent hover:text-accent disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-accent"><ChevronLeft className="h-4 w-4" /></button>
        <div ref={trackRef} className="min-w-0 flex-1 overflow-x-auto overscroll-x-contain [scrollbar-width:thin]" style={{ touchAction: "pan-x pan-y" }}>
          <div role="tablist" aria-label="Períodos da linha do tempo" onKeyDown={onKey} className="relative flex min-w-[640px] justify-between px-6 py-4">
            <span aria-hidden className="absolute left-6 right-6 top-[26px] h-px bg-foreground/60" />
            {items.map((t, i) => {
              const active = i === idx;
              return (
                <button
                  key={t.id}
                  ref={(el) => { markerRefs.current[i] = el; }}
                  role="tab"
                  aria-selected={active}
                  aria-controls="tl-card"
                  tabIndex={active ? 0 : -1}
                  onClick={() => select(i)}
                  className="group relative flex w-24 flex-col items-center gap-3 focus-visible:outline-none"
                >
                  <span className={`tl-dot block rounded-full border-2 ${active ? "h-5 w-5 border-accent bg-accent" : "h-3 w-3 mt-1 border-foreground/50 bg-background group-hover:border-accent"} group-focus-visible:ring-2 group-focus-visible:ring-accent group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-background`} />
                  <span className={`whitespace-nowrap font-serif text-sm ${active ? "font-bold text-accent" : "text-muted-foreground group-hover:text-foreground"}`}>{t.periodo}</span>
                </button>
              );
            })}
          </div>
        </div>
        <button onClick={() => select(idx + 1)} disabled={idx === items.length - 1} aria-label="Próximo período" className="shrink-0 rounded-full border border-foreground/40 p-2 hover:border-accent hover:text-accent disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-accent"><ChevronRight className="h-4 w-4" /></button>
      </div>
    </div>
  );
}
