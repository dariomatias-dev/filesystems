"use client";

import {
  AnimatePresence,
  animate,
  motion,
  motionValue,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, CornersOut, IconProvider } from "@/components/ui/icons";
import { SLIDES, SECTIONS } from "@/slides";
import { DeckContext, MouseContext } from "./context";
import { EASE, META, cn } from "@/lib/meta";
import { IfpbLogo } from "@/components/ui/IfpbLogo";

const W = 1600;
const H = 900;

const T_EASE = [0.83, 0, 0.17, 1] as const;
const T_DUR = 1.25;

/* Transição em "degraus": cada faixa horizontal avança com um atraso diferente,
   como blocos sendo gravados no disco. */
const ROWS = 9;
const ROW_DELAY = [0.1, 0.04, 0, 0.05, 0.13, 0.07, 0.02, 0.09, 0.16];
const MAX_D = Math.max(...ROW_DELAY);
const rowP = (p: number, i: number) => Math.min(1, Math.max(0, (p - ROW_DELAY[i]) / (1 - MAX_D)));
const easeRow = (t: number) => 1 - Math.pow(1 - t, 2.2);

function useStageZoom() {
  const [zoom, setZoom] = useState<number | null>(null);
  useLayoutEffect(() => {
    const fit = () => setZoom(Math.min(window.innerWidth / W, window.innerHeight / H));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  return zoom;
}

const sectionV: Variants = {
  enter: { zIndex: 2, scale: 1, x: 0, borderRadius: 0 },
  center: { zIndex: 2, scale: 1, x: 0, borderRadius: 0 },
  exit: (d: number) => ({ zIndex: 1, scale: 0.9, x: d > 0 ? "-5%" : "5%", borderRadius: 36 }),
};
const shadeV: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 0 },
  exit: { opacity: 0.78 },
};

type Nav = { index: number; dir: number; progress: MotionValue<number>; n: number };

export function Deck() {
  const zoom = useStageZoom();
  const reduce = useReducedMotion();
  const [nav, setNav] = useState<Nav>(() => ({ index: 0, dir: 1, progress: motionValue(1), n: 0 }));
  const { index, dir, progress, n: navs } = nav;
  const lock = useRef(0);
  const touch = useRef<number | null>(null);
  const stage = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 22, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 120, damping: 22, mass: 0.6 });
  const mouse = useMemo(() => ({ x: sx, y: sy }), [sx, sy]);
  const px = useTransform(sx, (v) => (v + 0.5) * W);
  const py = useTransform(sy, (v) => (v + 0.5) * H);
  const spot = useMotionTemplate`radial-gradient(560px circle at ${px}px ${py}px, rgba(126,224,140,0.12), transparent 70%)`;

  const go = useCallback((target: number, force = false) => {
    const now = Date.now();
    if (!force && now - lock.current < 750) return;
    setNav((cur) => {
      const next = Math.max(0, Math.min(SLIDES.length - 1, target));
      if (next === cur.index) return cur;
      lock.current = now;
      return { index: next, dir: next > cur.index ? 1 : -1, progress: motionValue(0), n: cur.n + 1 };
    });
  }, []);

  const goTo = useCallback(
    (id: string | number) => {
      const i = typeof id === "number" ? id : SLIDES.findIndex((s) => s.id === id);
      if (i >= 0) go(i, true);
    },
    [go],
  );

  useEffect(() => {
    const n = parseInt(window.location.hash.replace("#", ""), 10);
    if (!Number.isNaN(n) && n >= 1 && n <= SLIDES.length)
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hash só existe no cliente
      setNav((c) => ({ ...c, index: n - 1, progress: motionValue(1) }));
  }, []);

  useEffect(() => {
    if (progress.get() >= 1) return;
    const c = animate(progress, 1, { duration: reduce ? 0.3 : T_DUR, ease: T_EASE });
    return () => c.stop();
  }, [progress, reduce]);

  useEffect(() => {
    window.history.replaceState(null, "", `#${index + 1}`);
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
        case " ":
        case "Enter":
          e.preventDefault();
          go(index + 1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
        case "Backspace":
          e.preventDefault();
          go(index - 1);
          break;
        case "Home":
          go(0, true);
          break;
        case "End":
          go(SLIDES.length - 1, true);
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index]);

  const slide = SLIDES[index];
  const tone = slide.tone;
  const dur = reduce ? 0.3 : T_DUR;

  return (
    <IconProvider>
    <DeckContext.Provider value={{ goTo, index }}>
      <MouseContext.Provider value={mouse}>
        <main
          className="fixed inset-0 flex items-center justify-center overflow-hidden bg-[#020403] select-none"
          onPointerMove={(e) => {
            const r = stage.current?.getBoundingClientRect();
            if (!r) return;
            mx.set((e.clientX - r.left) / r.width - 0.5);
            my.set((e.clientY - r.top) / r.height - 0.5);
          }}
          onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touch.current === null) return;
            const dx = e.changedTouches[0].clientX - touch.current;
            if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
            touch.current = null;
          }}
        >
          <div
            ref={stage}
            className="relative shrink-0 overflow-hidden bg-[#020403]"
            style={{ width: W, height: H, zoom: zoom ?? 1, opacity: zoom === null ? 0 : 1 }}
          >
            <AnimatePresence initial={false} custom={dir}>
              <motion.section
                key={slide.id}
                custom={dir}
                className="absolute inset-0 overflow-hidden"
                variants={sectionV}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: dur * 0.9, ease: T_EASE, zIndex: { duration: 0 } }}
              >
                <StepReveal progress={progress} dir={dir} parallax={!reduce}>
                  {slide.render()}
                </StepReveal>
                <motion.div
                  className="pointer-events-none absolute inset-0 bg-black"
                  variants={shadeV}
                  transition={{ duration: dur * 0.9, ease: T_EASE }}
                />
              </motion.section>
            </AnimatePresence>

            {!reduce && navs > 0 && <Sweep key={navs} dir={dir} progress={progress} />}

            <motion.div
              className="pointer-events-none absolute inset-0 z-20 mix-blend-screen transition-opacity duration-700"
              style={{ background: spot, opacity: tone === "dark" ? 1 : 0.35 }}
            />

            <Header index={index} onGo={(i) => go(i, true)} />
            <Footer index={index} onGo={(i) => go(i, true)} />
          </div>
        </main>
      </MouseContext.Provider>
    </DeckContext.Provider>
    </IconProvider>
  );
}

function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen?.();
}

/* ───────────────────────── transição ───────────────────────── */

function stepPolygon(p: number, dir: number) {
  const pts: string[] = [];
  const h = 100 / ROWS;
  if (dir > 0) {
    pts.push("100% 0%");
    for (let i = 0; i < ROWS; i++) {
      const e = ((1 - easeRow(rowP(p, i))) * 100).toFixed(3);
      pts.push(`${e}% ${(i * h).toFixed(3)}%`, `${e}% ${((i + 1) * h).toFixed(3)}%`);
    }
    pts.push("100% 100%");
  } else {
    pts.push("0% 0%");
    for (let i = 0; i < ROWS; i++) {
      const e = (easeRow(rowP(p, i)) * 100).toFixed(3);
      pts.push(`${e}% ${(i * h).toFixed(3)}%`, `${e}% ${((i + 1) * h).toFixed(3)}%`);
    }
    pts.push("0% 100%");
  }
  return `polygon(${pts.join(", ")})`;
}

function StepReveal({
  progress,
  dir,
  parallax,
  children,
}: {
  progress: MotionValue<number>;
  dir: number;
  parallax: boolean;
  children: ReactNode;
}) {
  const clipPath = useTransform(progress, (p) => (p >= 1 ? "none" : stepPolygon(p, dir)));
  const x = useTransform(progress, (p) => (parallax ? Math.pow(1 - p, 2) * 280 * dir : 0));
  return (
    <motion.div className="absolute inset-0" style={{ clipPath }}>
      <motion.div className="absolute inset-0" style={{ x }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

/** Bordas luminosas de cada faixa. */
function Sweep({ dir, progress }: { dir: number; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.85, 1], [1, 1, 0]);
  return (
    <motion.div className="pointer-events-none absolute inset-0 z-30" style={{ opacity }}>
      {Array.from({ length: ROWS }).map((_, i) => (
        <SweepRow key={i} i={i} dir={dir} progress={progress} />
      ))}
    </motion.div>
  );
}

function SweepRow({ i, dir, progress }: { i: number; dir: number; progress: MotionValue<number> }) {
  const fwd = dir > 0;
  const left = useTransform(progress, (p) => {
    const e = easeRow(rowP(p, i));
    return (fwd ? 1 - e : e) * W;
  });
  const h = H / ROWS;
  return (
    <motion.div className="absolute w-0" style={{ left, top: i * h, height: h }}>
      <div className={cn("absolute inset-y-[6px] flex gap-[5px]", fwd ? "left-[6px]" : "right-[6px] flex-row-reverse")}>
        {[0.9, 0.55, 0.3, 0.14].map((o, k) => (
          <span
            key={k}
            className={cn(
              "h-full w-[22px] rounded-[3px]",
              (i + k) % 7 === 3 ? "bg-if-red" : k === 0 ? "bg-if-lime" : "bg-if-green",
            )}
            style={{ opacity: o }}
          />
        ))}
      </div>
      <div className="absolute inset-y-0 -left-[2px] w-[4px] bg-if-lime shadow-[0_0_22px_6px_rgba(126,224,140,.5),0_0_70px_18px_rgba(47,158,65,.3)]" />
    </motion.div>
  );
}

/* ───────────────────────── header ─────────────────────────
   Cápsulas de vidro escuro: idênticas em slides claros e escuros, então nada
   "pisca" quando a transição passa de um modo para o outro. */

const capsule =
  "border border-white/10 bg-[#07110a]/80 text-white shadow-[0_12px_40px_-12px_rgba(0,0,0,.6)] backdrop-blur-xl";

function Header({ index, onGo }: { index: number; onGo: (i: number) => void }) {
  const current = SLIDES[index].section;
  const activeIdx = SECTIONS.findIndex((s) => s.label === current);
  const navRef = useRef<HTMLElement>(null);
  const [pill, setPill] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const el = navRef.current?.children[activeIdx + 1] as HTMLElement | undefined; // [0] = pílula
    if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth });
  }, [activeIdx]);

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-10 pt-6">
      <button
        onClick={() => onGo(0)}
        className={cn("pointer-events-auto flex h-[60px] items-center gap-4 rounded-2xl pl-4 pr-5", capsule)}
        aria-label="Início"
      >
        <IfpbLogo className="w-[150px]" />
        <span className="h-8 w-px bg-white/20" />
        <span className="flex flex-col items-start leading-tight">
          <span className="text-[15px] font-semibold">{META.disciplina}</span>
          <span className="text-[13px] text-white/70">{META.cursoCurto} · {META.ano}</span>
        </span>
      </button>

      <nav ref={navRef} className={cn("pointer-events-auto relative flex h-[52px] items-center rounded-full p-1.5", capsule)}>
        <motion.span
          className="absolute bottom-1.5 top-1.5 rounded-full bg-if-green shadow-[0_6px_20px_-4px_rgba(47,158,65,.8)]"
          initial={false}
          animate={{ left: pill.left, width: pill.width }}
          transition={{ type: "spring", stiffness: 380, damping: 34 }}
        />
        {SECTIONS.map((s, i) => (
          <button
            key={s.label}
            onClick={() => onGo(s.start)}
            className={cn(
              "relative h-full rounded-full px-4 text-[15px] font-medium transition-colors duration-300",
              i === activeIdx ? "text-white" : "text-white/70 hover:text-white",
            )}
          >
            {s.label}
          </button>
        ))}
      </nav>

      <div className={cn("pointer-events-auto flex h-[60px] items-center gap-3 rounded-2xl pl-5 pr-2", capsule)}>
        <span className="flex items-baseline gap-1.5">
          <span className="relative inline-flex h-[30px] w-[2.1ch] overflow-hidden font-display text-[26px] font-bold leading-[30px] tabular-nums">
            <AnimatePresence initial={false}>
              <motion.span
                key={index}
                className="absolute inset-0"
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                exit={{ y: "-100%" }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                {String(index + 1).padStart(2, "0")}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="text-[16px] tabular-nums text-white/65">/ {String(SLIDES.length).padStart(2, "0")}</span>
        </span>
        <button
          aria-label="Tela cheia (F)"
          title="Tela cheia (F)"
          onClick={toggleFullscreen}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/8 transition-colors hover:bg-if-green"
        >
          <CornersOut size={20} />
        </button>
      </div>
    </header>
  );
}

/* ───────────────────────── rodapé ───────────────────────── */

function Footer({ index, onGo }: { index: number; onGo: (i: number) => void }) {
  const s = SLIDES[index];
  const last = SLIDES.length - 1;
  const arrow = "flex h-11 w-11 items-center justify-center rounded-xl transition-colors hover:bg-if-green disabled:pointer-events-none disabled:opacity-30";
  return (
    <>
      {/* linha de progresso na borda inferior (cada trecho é clicável) */}
      <div className="absolute inset-x-0 bottom-0 z-30 h-[5px] bg-black/30">
        <motion.div
          className="absolute inset-y-0 left-0 bg-if-green shadow-[0_0_16px_rgba(47,158,65,.9)]"
          initial={false}
          animate={{ width: `${((index + 1) / SLIDES.length) * 100}%` }}
          transition={{ duration: 0.9, ease: EASE }}
        />
        <div className="absolute inset-x-0 -top-3 bottom-0 flex">
          {SLIDES.map((sl, i) => (
            <button key={sl.id} onClick={() => onGo(i)} aria-label={`Ir para ${sl.title}`} title={`${i + 1}. ${sl.title}`} className="h-full flex-1" />
          ))}
        </div>
      </div>

      {/* controles */}
      <footer className={cn("absolute bottom-6 right-10 z-30 flex h-[56px] items-center gap-1 rounded-2xl px-1.5", capsule)}>
        <button aria-label="Anterior" onClick={() => onGo(index - 1)} disabled={index === 0} className={arrow}>
          <ArrowLeft size={20} />
        </button>
        <div className="relative h-full w-[280px] overflow-hidden">
          <AnimatePresence initial={false}>
            <motion.div
              key={s.id}
              className="absolute inset-0 flex flex-col justify-center px-3"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -24, opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <span className="text-[13px] font-medium uppercase leading-tight tracking-[0.14em] text-if-lime">{s.section}</span>
              <span className="truncate text-[17px] font-semibold leading-tight">{s.title}</span>
            </motion.div>
          </AnimatePresence>
        </div>
        <button aria-label="Próximo" onClick={() => onGo(index + 1)} disabled={index === last} className={arrow}>
          <ArrowRight size={20} />
        </button>
      </footer>
    </>
  );
}
