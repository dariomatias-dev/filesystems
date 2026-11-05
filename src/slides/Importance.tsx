"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { BASE_DELAY, EASE, cn } from "@/lib/meta";
import { Glow } from "@/components/ui/backgrounds";
import { Reveal, SplitWords, Tag } from "@/components/ui/motion";
import {
  CheckCircle,
  Desktop,
  Gauge,
  HardDrives,
  IconTile,
  PuzzlePiece,
  Ruler,
  ShieldWarning,
  Usb,
  Warning,
  XCircle,
  type Icon,
} from "@/components/ui/icons";

type Risk = "Compatibilidade" | "Limite de tamanho" | "Desempenho" | "Recuperação";
type Verdict = "ok" | "warn" | "bad";

const RISKS: { t: Risk; d: string; icon: Icon }[] = [
  { t: "Compatibilidade", d: "o dispositivo não é reconhecido em outro sistema", icon: PuzzlePiece },
  { t: "Limite de tamanho", d: "arquivos grandes simplesmente não cabem", icon: Ruler },
  { t: "Desempenho", d: "estrutura inadequada para a mídia ou o uso", icon: Gauge },
  { t: "Recuperação", d: "sem mecanismos de consistência após falhas", icon: ShieldWarning },
];

const SCENARIOS: {
  name: string;
  icon: Icon;
  desc: string;
  options: { fs: string; v: Verdict; why: string; risk?: Risk }[];
}[] = [
  {
    name: "Pendrive compartilhado",
    icon: Usb,
    desc: "Levar um vídeo de 6 GB entre Windows, macOS e Linux.",
    options: [
      { fs: "exFAT", v: "ok", why: "Arquivos grandes e suporte nos três sistemas" },
      { fs: "NTFS", v: "warn", why: "No macOS, o acesso nativo é somente leitura", risk: "Compatibilidade" },
      { fs: "FAT32", v: "bad", why: "O vídeo de 6 GB passa do limite de 4 GB", risk: "Limite de tamanho" },
      { fs: "ext4", v: "bad", why: "Windows e macOS não leem nativamente", risk: "Compatibilidade" },
    ],
  },
  {
    name: "Notebook com Windows",
    icon: Desktop,
    desc: "Disco do sistema, com vários usuários e risco de queda de energia.",
    options: [
      { fs: "NTFS", v: "ok", why: "Padrão do Windows: permissões, journaling e cotas" },
      { fs: "exFAT", v: "bad", why: "Sem permissões e sem journaling", risk: "Recuperação" },
      { fs: "FAT32", v: "bad", why: "Limite de 4 GB por arquivo e nenhuma proteção", risk: "Limite de tamanho" },
      { fs: "ext4", v: "bad", why: "O Windows não o suporta nativamente", risk: "Compatibilidade" },
    ],
  },
  {
    name: "Servidor Linux",
    icon: HardDrives,
    desc: "Muitos arquivos, desempenho estável e recuperação após falhas.",
    options: [
      { fs: "ext4", v: "ok", why: "Escolha consolidada: estável e com journaling" },
      { fs: "Btrfs", v: "ok", why: "Alternativa com snapshots e checksums" },
      { fs: "NTFS", v: "warn", why: "Funciona via driver, mas não é o padrão do Linux", risk: "Desempenho" },
      { fs: "FAT32", v: "bad", why: "Sem permissões nem journaling", risk: "Recuperação" },
    ],
  },
];

const VERDICT = {
  ok: { label: "Adequado", icon: CheckCircle, cls: "bg-if-green/20 text-if-lime ring-if-green/50", row: "border-if-green/50 bg-if-green/[0.12]" },
  warn: { label: "Limitado", icon: Warning, cls: "bg-amber-400/15 text-amber-300 ring-amber-400/40", row: "border-white/10 bg-white/[0.04]" },
  bad: { label: "Inadequado", icon: XCircle, cls: "bg-if-red/20 text-if-red-soft ring-if-red/50", row: "border-white/10 bg-white/[0.04]" },
};

export function Importance() {
  const [sc, setSc] = useState(0);
  const [manual, setManual] = useState(false);
  useEffect(() => {
    if (manual) return;
    const id = setInterval(() => setSc((s) => (s + 1) % SCENARIOS.length), 6000);
    return () => clearInterval(id);
  }, [manual]);
  const s = SCENARIOS[sc];
  const triggered = new Set(s.options.map((o) => o.risk).filter(Boolean));
  const SI = s.icon;

  return (
    <div className="grain relative h-full w-full overflow-hidden bg-ink text-white">
      <Glow variant="red" />
      <div className="grid-lines absolute inset-0 opacity-40" />
      <div className="relative grid h-full grid-cols-[520px_1fr] gap-12 px-14 pb-[110px] pt-[120px]">
        <div className="flex flex-col">
          <Reveal>
            <Tag>04 · Importância</Tag>
          </Reveal>
          <h2 className="mt-5 font-display text-[64px] font-bold leading-[0.95] tracking-[-0.045em]">
            <SplitWords text={"A escolha\n*importa*"} accentClass="text-if-red-soft" />
          </h2>
          <Reveal delay={0.4} className="mt-5 text-[19px] leading-snug text-white/80">
            Um filesystem inadequado para o cenário causa problemas reais:
          </Reveal>
          <div className="mt-auto flex flex-col gap-2.5">
            {RISKS.map((r, i) => {
              const on = triggered.has(r.t);
              return (
                <motion.div
                  key={r.t}
                  className={cn(
                    "flex items-center gap-4 rounded-2xl border p-3.5 transition-colors duration-500",
                    on ? "border-if-red/50 bg-if-red/[0.12]" : "border-white/10 bg-white/[0.03]",
                  )}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: BASE_DELAY + 0.5 + i * 0.08, duration: 0.7, ease: EASE }}
                >
                  <IconTile icon={r.icon} tone={on ? "red" : "neutral"} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="text-[19px] font-semibold leading-tight">{r.t}</div>
                    <div className="text-[15px] text-white/75">{r.d}</div>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[13px] font-semibold transition-opacity duration-500",
                      on ? "bg-if-red text-white opacity-100" : "opacity-0",
                    )}
                  >
                    neste cenário
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* simulador */}
        <Reveal delay={0.3} className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-semibold uppercase tracking-[0.16em] text-white/75">Qual filesystem usar?</span>
            <div className="flex gap-1.5 rounded-full bg-black/40 p-1">
              {SCENARIOS.map((x, i) => (
                <button
                  key={x.name}
                  onClick={() => {
                    setManual(true);
                    setSc(i);
                  }}
                  className={cn(
                    "relative rounded-full px-3.5 py-1.5 text-[14px] font-medium transition-colors",
                    i === sc ? "text-white" : "text-white/70 hover:text-white",
                  )}
                >
                  <span
                    className={cn(
                      "absolute inset-0 rounded-full bg-if-green transition-opacity duration-300",
                      i === sc ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="relative">{x.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* barra de tempo do ciclo automático */}
          <div className="mt-4 h-[3px] overflow-hidden rounded-full bg-white/10">
            {!manual && (
              <motion.div
                key={sc}
                className="h-full bg-if-lime/70"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 6, ease: "linear" }}
              />
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={sc}
              className="mt-5 flex flex-1 flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center gap-4 rounded-2xl bg-black/35 p-4">
                <IconTile icon={SI} tone="green" size="lg" />
                <div>
                  <div className="text-[24px] font-semibold leading-tight">{s.name}</div>
                  <div className="mt-0.5 text-[17px] text-white/80">{s.desc}</div>
                </div>
              </div>

              <div className="mt-4 flex flex-1 flex-col gap-3">
                {s.options.map((o, i) => {
                  const V = VERDICT[o.v];
                  const VI = V.icon;
                  return (
                    <motion.div
                      key={o.fs}
                      className={cn("flex flex-1 items-center gap-5 rounded-2xl border px-5", V.row)}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.12, duration: 0.5, ease: EASE }}
                    >
                      <span className="w-[92px] font-display text-[28px] font-bold tracking-tight">{o.fs}</span>
                      <span className="flex-1 text-[17px] leading-snug text-white/90">{o.why}</span>
                      <span
                        className={cn(
                          "flex w-[148px] shrink-0 items-center justify-center gap-1.5 rounded-full py-1.5 text-[15px] font-semibold ring-1 ring-inset",
                          V.cls,
                        )}
                      >
                        <VI size={18} weight="fill" />
                        {V.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </Reveal>
      </div>
    </div>
  );
}
