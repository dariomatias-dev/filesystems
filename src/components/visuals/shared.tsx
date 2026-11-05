"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { BASE_DELAY, EASE, cn } from "@/lib/meta";

/** Contador cíclico de etapas para demonstrações em loop. */
export function useStep(count: number, ms: number, startDelay = 900) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    let id: ReturnType<typeof setInterval>;
    const t = setTimeout(() => {
      id = setInterval(() => setStep((s) => (s + 1) % count), ms);
    }, startDelay);
    return () => {
      clearTimeout(t);
      clearInterval(id);
    };
  }, [count, ms, startDelay]);
  return step;
}

/** Painel de vidro com cabeçalho estilo janela. */
export function Panel({
  title,
  children,
  className,
  delay = 0.2,
  right,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  delay?: number;
  right?: ReactNode;
}) {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl",
        "shadow-[0_40px_120px_-40px_rgba(50,160,65,.45)]",
        className,
      )}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1, delay: BASE_DELAY + delay, ease: EASE }}
      
    >
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-if-red/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-if-green/80" />
          </span>
          <span className="font-mono text-[14px] text-white/70">{title}</span>
        </div>
        {right}
      </div>
      <div className="relative">{children}</div>
    </motion.div>
  );
}
