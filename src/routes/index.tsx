import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import { ArrowRight, ArrowUp, ExternalLink, MapPin, Plus, Minus } from "lucide-react";
import timeline from "@/data/timeline.json";
import territorios from "@/data/territorios.json";
import personagens from "@/data/personagens.json";
import fontes from "@/data/fontes.json";
import hero from "@/assets/hero-collage.jpg";
import futuro from "@/assets/futuro-collage.jpg";

const TerritorialMap = lazy(() => import("@/components/bauru/TerritorialMap"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bauru Negra — Memória, Território e Futuros Possíveis" },
      { name: "description", content: "O território guarda o que o tempo não apagou. Linha do tempo, mapa e acervos da presença negra em Bauru." },
      { property: "og:title", content: "Bauru Negra — Memória, Território e Futuros Possíveis" },
      { property: "og:description", content: "O território guarda o que o tempo não apagou." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const fonte = (id: string) => fontes.find((f) => f.id === id);
const CATS = ["Todos", "Territórios", "Cultura", "Memórias", "Pessoas", "Acervos"];

function Selo({ children }: { children: React.ReactNode }) {
  return <span className="inline-block border border-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-accent">{children}</span>;
}
function Kicker({ n, children }: { n: string; children: React.ReactNode }) {
  return <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground"><span className="text-accent">{n}</span> — {children}</p>;
}
function FonteLink({ id }: { id: string }) {
  const f = fonte(id);
  if (!f) return null;
  return <a href={f.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs underline decoration-accent underline-offset-4 hover:text-accent">{f.id} · {f.titulo} <ExternalLink className="h-3 w-3" /></a>;
}

function Index() {
  const [open, setOpen] = useState<string | null>("t2");
  const [cat, setCat] = useState("Todos");
  const [sel, setSel] = useState<string | null>(null);
  const items = useMemo(() => territorios.filter((t) => cat === "Todos" || t.categoria === cat), [cat]);
  const onSelect = useCallback((id: string) => setSel(id), []);
  const current = territorios.find((t) => t.id === sel);
  const verNoTerritorio = (id: string) => { setCat("Todos"); setSel(id); document.getElementById("mapa")?.scrollIntoView({ behavior: "smooth" }); };

  return (
    <div className="paper min-h-screen text-foreground">
      <header className="sticky top-0 z-[1000] border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <a href="#topo" className="font-serif text-xl font-bold leading-none">BAURU<br />NEGRA</a>
          <nav className="hidden gap-8 text-sm md:flex">
            {[["Início","topo"],["Tempo","tempo"],["Pessoas","pessoas"],["Território","mapa"],["Futuro","futuro"]].map(([l,h]) => <a key={h} href={`#${h}`} className="hover:text-accent">{l}</a>)}
          </nav>
        </div>
      </header>

      {/* 01 Hero */}
      <section id="topo" className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-14 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <Kicker n="01">Preto em Cinza · Design Afro-Brasileiro</Kicker>
          <h1 className="text-7xl font-bold leading-[0.85] tracking-tight md:text-9xl">BAURU<br />NEGRA</h1>
          <p className="mt-4 font-serif text-3xl italic">Memória, território e futuros possíveis.</p>
          <div className="mt-6 space-y-1 border-l-2 border-accent pl-4 text-lg">
            <p>Nem toda história foi registrada.</p><p>Nem todo registro contou a história inteira.</p><p className="font-bold">Mas toda memória deixa rastros.</p>
          </div>
          <a href="#intro" className="mt-8 inline-flex items-center gap-3 rounded bg-primary px-6 py-3 text-sm font-bold tracking-widest text-primary-foreground hover:bg-accent">EXPLORAR A MEMÓRIA <ArrowRight className="h-4 w-4" /></a>
        </div>
        <figure>
          <img src={hero} width={1280} height={1024} alt="Colagem editorial conceitual: silhuetas, sol laranja e trilhos de trem" className="torn w-full" />
          <figcaption className="mt-2 text-[11px] text-muted-foreground">Composição gráfica conceitual · placeholder provisório. Imagens históricas aguardam licenciamento dos acervos.</figcaption>
        </figure>
      </section>

      {/* 02 Intro */}
      <section id="intro" className="ink torn bg-background py-24 text-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2">
          <div><Kicker n="02">Introdução</Kicker><h2 className="text-5xl font-bold md:text-6xl">O território também tem memória.</h2></div>
          <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
            <p>Bauru cresceu entre trilhos, bairros operários, terreiros de samba e redações de jornal. Em cada camada dessa formação há presença negra — às vezes registrada, muitas vezes silenciada.</p>
            <p>Este projeto reúne pistas documentais em acervos públicos e acadêmicos e as sinaliza com transparência: o que está confirmado, o que está em validação e o que ainda precisa ser escutado.</p>
            <p className="font-serif text-2xl italic text-foreground">“O território guarda o que o tempo não apagou.”</p>
          </div>
        </div>
      </section>

      {/* 03 Timeline */}
      <section id="tempo" className="mx-auto max-w-6xl px-6 py-24">
        <Kicker n="03">Linha do tempo</Kicker>
        <h2 className="text-5xl font-bold md:text-6xl">Rastros da memória.</h2>
        <div className="relative mt-12 border-l-2 border-foreground pl-8">
          {timeline.map((t) => {
            const isOpen = open === t.id;
            return (
              <article key={t.id} className="relative mb-6">
                <span className={`absolute -left-[43px] top-5 h-5 w-5 rounded-full border-2 border-foreground ${isOpen ? "bg-accent" : "bg-background"}`} />
                <button onClick={() => setOpen(isOpen ? null : t.id)} className="flex w-full items-start justify-between gap-4 border border-border bg-card/70 p-5 text-left hover:border-accent">
                  <div className="min-w-0">
                    <p className="font-serif text-3xl font-bold text-accent">{t.periodo}</p>
                    <h3 className="text-2xl font-semibold">{t.titulo}</h3>
                    <p className="mt-1 text-muted-foreground">{t.resumo}</p>
                  </div>
                  {isOpen ? <Minus className="mt-2 h-5 w-5 shrink-0" /> : <Plus className="mt-2 h-5 w-5 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="border border-t-0 border-border bg-card p-5">
                    <p>{t.detalhe}</p>
                    <div className="mt-3"><Selo>{t.status}</Selo></div>
                    <div className="mt-3 flex flex-col gap-1">{t.fontes.map((f) => <FonteLink key={f} id={f} />)}</div>
                    <button onClick={() => verNoTerritorio(t.territorio)} className="mt-4 inline-flex items-center gap-2 rounded bg-accent px-4 py-2 text-xs font-bold tracking-widest text-accent-foreground"><MapPin className="h-4 w-4" /> VER NO TERRITÓRIO</button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* 04 Protagonismo */}
      <section id="pessoas" className="ink bg-background py-24 text-foreground">
        <div className="mx-auto max-w-7xl px-6">
          <Kicker n="04">Protagonismo negro</Kicker>
          <h2 className="text-5xl font-bold md:text-6xl">Quem constrói essa história.</h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {personagens.map((p, i) => (
              <article key={p.id} className="flex flex-col border border-border bg-card">
                <div className="relative grid aspect-[4/3] place-items-center overflow-hidden" style={{ background: i % 2 ? "var(--terra)" : "var(--secondary)" }}>
                  <span className="font-serif text-8xl font-bold text-background/80">{p.glyph}</span>
                  <span className="absolute right-3 top-3 h-10 w-10 rounded-full bg-accent" />
                  <span className="absolute bottom-2 left-3 text-[10px] uppercase tracking-widest text-background">Imagem em licenciamento</span>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{p.tipo} · {p.periodo}</p>
                  <h3 className="text-2xl font-bold leading-tight">{p.nome}</h3>
                  <p className="font-serif italic text-accent">{p.sub}</p>
                  <p className="text-sm text-muted-foreground">{p.texto}</p>
                  <div className="mt-auto space-y-2 pt-2"><Selo>{p.selo}</Selo><div><FonteLink id={p.fonte} /></div></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 05 Mapa */}
      <section id="mapa" className="mx-auto max-w-7xl px-6 py-24">
        <Kicker n="05">Mapa territorial</Kicker>
        <h2 className="text-5xl font-bold md:text-6xl">Bauru como arquivo.</h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {CATS.map((c) => <button key={c} onClick={() => setCat(c)} className={`rounded-full border px-4 py-1.5 text-sm ${cat === c ? "border-accent bg-accent text-accent-foreground" : "border-foreground hover:border-accent"}`}>{c}</button>)}
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="h-[480px] overflow-hidden border-2 border-foreground">
            <ClientOnly fallback={<div className="h-full bg-muted" />}><Suspense fallback={<div className="h-full bg-muted" />}><TerritorialMap items={items} focusId={sel} onSelect={onSelect} /></Suspense></ClientOnly>
          </div>
          <aside className="space-y-4">
            {current ? (
              <div className="border border-foreground bg-card p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{current.categoria}</p>
                <h3 className="text-3xl font-bold">{current.nome}</h3>
                <p className="text-sm text-muted-foreground">{current.endereco}</p>
                <p className="mt-3">{current.descricao}</p>
                <div className="mt-3"><Selo>{current.coords ? current.selo : "Em catalogação · Coordenadas em validação"}</Selo></div>
                <div className="mt-3"><FonteLink id={current.fonte} /></div>
              </div>
            ) : <p className="border border-dashed border-foreground p-5 text-sm text-muted-foreground">Selecione um marcador ou um item da lista.</p>}
            <ul className="max-h-[260px] divide-y divide-border overflow-auto border border-border bg-card/60">
              {items.map((t) => (
                <li key={t.id}><button onClick={() => setSel(t.id)} className={`flex w-full items-center justify-between gap-2 px-4 py-2 text-left text-sm hover:bg-muted ${sel === t.id ? "bg-muted" : ""}`}>
                  <span className="min-w-0 truncate">{t.nome}</span>
                  <span className={`shrink-0 text-[10px] uppercase tracking-wider ${t.coords ? "text-accent" : "text-muted-foreground"}`}>{t.coords ? "No mapa" : "Em catalogação"}</span>
                </button></li>
              ))}
            </ul>
            <p className="text-[11px] text-muted-foreground">Marcadores apenas para instituições com endereço publicado; posições aproximadas a partir do endereço, em reconfirmação. Territórios culturais sem coordenadas validadas não recebem pin.</p>
          </aside>
        </div>
      </section>

      {/* 06 Reflexão */}
      <section className="ink torn bg-background py-28 text-foreground">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Kicker n="06">Reflexão</Kicker>
          <h2 className="text-6xl font-bold md:text-7xl">Entre rastros e silêncios.</h2>
          <div className="mt-10 space-y-6 font-serif text-2xl leading-snug md:text-3xl">
            <p>Um arquivo também é feito do que <span className="text-accent italic">não</span> guardou.</p>
            <p className="text-muted-foreground">Fichas sem rosto. Fotografias sem nome. Bairros inteiros lembrados apenas pela voz de quem viveu.</p>
            <p>Preservar é escutar — e devolver à memória viva o lugar que o registro oficial negou.</p>
          </div>
        </div>
      </section>

      {/* 07 Futuro */}
      <section id="futuro" className="relative">
        <img src={futuro} width={1536} height={768} loading="lazy" alt="Colagem afrofuturista: perfil de pessoa negra diante de uma cidade ao pôr do sol" className="h-[520px] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/40 to-transparent" />
        <div className="absolute inset-0 mx-auto flex max-w-7xl flex-col justify-center px-6 text-background">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em]"><span className="text-accent">07</span> — Futuros possíveis</p>
          <h2 className="max-w-xl text-6xl font-bold md:text-7xl">O futuro também é ancestral.</h2>
          <p className="mt-4 max-w-md text-lg">Imaginar Bauru amanhã é reconhecer quem a construiu ontem. Que futuros podemos construir juntos?</p>
        </div>
      </section>

      <footer className="ink bg-background py-16 text-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-[1fr_2fr]">
          <div>
            <p className="font-serif text-4xl font-bold leading-none">BAURU<br />NEGRA</p>
            <p className="mt-4 text-sm text-muted-foreground">Projeto do curso Preto em Cinza — Design Afro-Brasileiro. Pesquisa documental em andamento; imagens conceituais provisórias até o licenciamento dos acervos.</p>
            <a href="#topo" className="mt-6 inline-flex items-center gap-2 rounded bg-accent px-5 py-2.5 text-xs font-bold tracking-widest text-accent-foreground"><ArrowUp className="h-4 w-4" /> VOLTAR AO TOPO</a>
          </div>
          <div>
            <h3 className="mb-4 text-2xl font-bold">Fontes do banco de dados</h3>
            <ul className="grid gap-3 sm:grid-cols-2">
              {fontes.map((f) => (
                <li key={f.id} className="border-l-2 border-accent pl-3 text-sm">
                  <a href={f.url} target="_blank" rel="noreferrer" className="font-semibold hover:text-accent">{f.id} · {f.titulo}</a>
                  <p className="text-xs text-muted-foreground">{f.autor} — {f.nota}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
