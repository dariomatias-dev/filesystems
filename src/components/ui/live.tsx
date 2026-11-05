"use client";

import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/meta";

const fmt = (v: number, decimals: number) =>
  v.toLocaleString("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/** Número que interpola suavemente até `value` sempre que ele muda. */
export function AnimatedNumber({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
  stiffness = 70,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  stiffness?: number;
}) {
  const mv = useSpring(value, { stiffness, damping: 20, mass: 1 });
  useEffect(() => {
    mv.set(value);
  }, [mv, value]);
  const text = useTransform(mv, (v) => prefix + fmt(v, decimals) + suffix);
  return <motion.span className={cn("tabular-nums", className)}>{text}</motion.span>;
}

/** Contador que não para de subir (ex.: blocos gravados). */
export function Ticker({
  start,
  perSecond,
  decimals = 0,
  suffix = "",
  className,
}: {
  start: number;
  perSecond: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(start);
  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      const dt = (t - last) / 1000;
      last = t;
      // ritmo levemente irregular, como I/O real
      mv.set(mv.get() + perSecond * dt * (0.6 + Math.random() * 0.8));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mv, perSecond, reduce]);
  const text = useTransform(mv, (v) => fmt(v, decimals) + suffix);
  return <motion.span className={cn("tabular-nums", className)}>{text}</motion.span>;
}

/** Valor que oscila em torno de uma base (ex.: MB/s, latência). */
export function Fluctuate({
  base,
  spread,
  decimals = 0,
  suffix = "",
  every = 900,
  className,
}: {
  base: number;
  spread: number;
  decimals?: number;
  suffix?: string;
  every?: number;
  className?: string;
}) {
  const mv = useMotionValue(base);
  useEffect(() => {
    const id = setInterval(() => {
      animate(mv, base + (Math.random() * 2 - 1) * spread, { duration: every / 1000, ease: "easeInOut" });
    }, every);
    return () => clearInterval(id);
  }, [mv, base, spread, every]);
  const text = useTransform(mv, (v) => fmt(v, decimals) + suffix);
  return <motion.span className={cn("tabular-nums", className)}>{text}</motion.span>;
}

/**
 * Gráfico de throughput de disco (estilo monitor do sistema): série temporal
 * rolando para a esquerda, com área, linha, grade e rótulo de janela de tempo.
 */
export function IoGraph({
  base,
  spread,
  max,
  width = 220,
  height = 56,
  points = 30,
  every = 450,
  label = "últimos 15 s",
  tone = "green",
  className,
}: {
  base: number;
  spread: number;
  max: number;
  width?: number;
  height?: number;
  points?: number;
  every?: number;
  label?: string;
  tone?: "green" | "red";
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [data, setData] = useState<number[]>(() => seedSeries(points, base, spread));
  const shift = useMotionValue(0);
  const step = width / (points - 2);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setData((d) => {
        const last = d[d.length - 1];
        const next = Math.min(max * 0.97, Math.max(base - spread, last + (Math.random() * 2 - 1) * spread * 0.55 + (base - last) * 0.25));
        return [...d.slice(1), next];
      });
      shift.set(0);
      animate(shift, -step, { duration: every / 1000, ease: "linear" });
    }, every);
    return () => clearInterval(id);
  }, [reduce, base, spread, max, every, step, shift]);

  const y = (v: number) => height - 4 - (v / max) * (height - 8);
  const line = data.map((v, i) => `${i ? "L" : "M"}${(i * step).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L${((data.length - 1) * step).toFixed(1)},${height} L0,${height} Z`;
  const stroke = tone === "green" ? "#7ee08c" : "#ff5a5f";
  const id = tone === "green" ? "io-g" : "io-r";

  return (
    <span className={cn("inline-flex flex-col gap-1", className)}>
      <span className="relative block overflow-hidden rounded-md border border-white/10 bg-black/30" style={{ width, height }}>
        {/* grade */}
        <span className="absolute inset-x-0 top-1/2 border-t border-dashed border-white/10" />
        <span className="absolute inset-x-0 top-1/4 border-t border-dashed border-white/[0.06]" />
        <span className="absolute inset-x-0 top-3/4 border-t border-dashed border-white/[0.06]" />
        <motion.svg width={width + step * 2} height={height} className="absolute left-0 top-0" style={{ x: shift }}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity="0.45" />
              <stop offset="100%" stopColor={stroke} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill={`url(#${id})`} />
          <path d={line} fill="none" stroke={stroke} strokeWidth={2} strokeLinejoin="round" />
        </motion.svg>
        {/* ponto atual */}
        <span
          className="absolute right-[6px] h-2 w-2 -translate-y-1/2 rounded-full"
          style={{ top: y(data[data.length - 2]), background: stroke, boxShadow: `0 0 10px ${stroke}` }}
        />
      </span>
      <span className="flex justify-between font-mono text-[12px] leading-none text-white/60">
        <span>{label}</span>
        <span>agora</span>
      </span>
    </span>
  );
}

function seedSeries(n: number, base: number, spread: number) {
  // determinístico para não divergir entre servidor e cliente
  return Array.from({ length: n }, (_, i) => base + Math.sin(i * 0.9) * spread * 0.5 + Math.cos(i * 2.3) * spread * 0.25);
}

/** Flutuação suave contínua (para ícones, cards, objetos). */
export function Float({
  children,
  amount = 8,
  duration = 5,
  delay = 0,
  className,
}: {
  children: ReactNode;
  amount?: number;
  duration?: number;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -amount, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {children}
    </motion.div>
  );
}

/** Ponto "ao vivo" pulsando. */
export function LiveDot({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-flex h-2.5 w-2.5", className)}>
      <motion.span
        className="absolute inset-0 rounded-full bg-if-lime"
        animate={{ scale: [1, 2.6], opacity: [0.7, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
      />
      <span className="relative h-2.5 w-2.5 rounded-full bg-if-lime" />
    </span>
  );
}
