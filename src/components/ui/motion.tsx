"use client";

import { animate, motion, useInView, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { BASE_DELAY, EASE, cn } from "@/lib/meta";
import { useStageMouse } from "@/components/deck/context";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  className?: string;
};

/**
 * Entrada padrão: opacidade + deslocamento. Sem blur/scale de propósito — filtros
 * e escalas em texto causam o "pulo" de re-rasterização quando a animação termina.
 */
export function Reveal({ children, delay = 0, y = 26, x = 0, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 1, delay: BASE_DELAY + delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Título com revelação palavra a palavra (máscara).
 * Palavras entre *asteriscos* recebem destaque com brilho.
 */
export function SplitWords({
  text,
  delay = 0,
  stagger = 0.06,
  className,
  accentClass = "text-shimmer",
}: {
  text: string;
  delay?: number;
  stagger?: number;
  className?: string;
  accentClass?: string;
}) {
  const lines = text.split("\n");
  let n = 0;
  return (
    <span className={className}>
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.split(" ").map((raw, wi, arr) => {
            const accent = raw.startsWith("*") && raw.replace(/[.,!?:]$/, "").endsWith("*");
            const word = raw.replace(/\*/g, "");
            const i = n++;
            return (
              <span key={wi} className="inline-block overflow-hidden pb-[0.22em] -mb-[0.22em] align-bottom">
                <motion.span
                  className={cn("inline-block", accent && accentClass)}
                  initial={{ y: "120%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1.1, delay: BASE_DELAY + delay + i * stagger, ease: [0.16, 1, 0.3, 1] }}
                >
                  {word}
                </motion.span>
                {wi < arr.length - 1 && " "}
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}

export function Tag({
  children,
  className,
  tone = "dark",
}: {
  children: ReactNode;
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full border py-1.5 pl-3 pr-4 text-[15px] font-semibold tracking-wide",
        tone === "dark" ? "border-white/15 bg-white/[0.06] text-white/90" : "border-ink/15 bg-white text-ink/80",
        className,
      )}
    >
      <span className="h-2 w-2 rounded-[2px] bg-if-green shadow-[0_0_10px_rgba(47,158,65,.9)]" />
      {children}
    </span>
  );
}

export function CountUp({
  to,
  delay = 0,
  duration = 1.8,
  decimals = 0,
  suffix = "",
  className,
}: {
  to: number;
  delay?: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => v.toFixed(decimals).replace(".", ",") + suffix);
  useEffect(() => {
    if (!inView) return;
    const c = animate(mv, to, { duration, delay: BASE_DELAY + delay, ease: EASE });
    return () => c.stop();
  }, [inView, mv, to, duration, delay]);
  return (
    <motion.span ref={ref} className={cn("tabular-nums", className)}>
      {text}
    </motion.span>
  );
}

export function Rule({ delay = 0, className }: { delay?: number; className?: string }) {
  return (
    <motion.div
      className={cn("h-px origin-left bg-current opacity-20", className)}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 1.2, delay: BASE_DELAY + delay, ease: EASE }}
    />
  );
}

/** Desloca o conteúdo levemente conforme o mouse (profundidade). */
export function Parallax({
  children,
  depth = 20,
  className,
}: {
  children: ReactNode;
  depth?: number;
  className?: string;
}) {
  const m = useStageMouse();
  const x = useTransform(m.x, (v) => v * depth);
  const y = useTransform(m.y, (v) => v * depth);
  return (
    <motion.div className={className} style={{ x, y }}>
      {children}
    </motion.div>
  );
}

/** Texto digitado estilo terminal. */
export function Typewriter({
  lines,
  delay = 0,
  speed = 0.022,
  className,
}: {
  lines: { text: string; className?: string }[];
  delay?: number;
  speed?: number;
  className?: string;
}) {
  const starts = lines.reduce<number[]>(
    (acc, l, i) => [...acc, i === 0 ? BASE_DELAY + delay : acc[i - 1] + lines[i - 1].text.length * speed + 0.25],
    [],
  );
  const end = lines.length ? starts[lines.length - 1] + lines[lines.length - 1].text.length * speed : BASE_DELAY + delay;
  return (
    <div className={className}>
      {lines.map((l, li) => {
        const start = starts[li];
        return (
          <div key={li} className={cn("whitespace-pre", l.className)}>
            {l.text.split("").map((ch, ci) => (
              <motion.span
                key={ci}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.01, delay: start + ci * speed }}
              >
                {ch}
              </motion.span>
            ))}
          </div>
        );
      })}
      <motion.span
        className="inline-block h-[1.1em] w-[0.6em] translate-y-[0.2em] bg-if-lime"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ delay: end, duration: 1, repeat: Infinity, times: [0, 0.01, 0.5, 0.51] }}
      />
    </div>
  );
}
