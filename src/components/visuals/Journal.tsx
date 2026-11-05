"use client";

import { AnimatePresence, motion } from "motion/react";
import { BookOpenText, Check, Cpu, HardDrive, ArrowCounterClockwise, Lightning } from "@/components/ui/icons";
import { EASE, cn } from "@/lib/meta";
import { Panel, useStep } from "./shared";

const STEPS = [
  { label: "Pedido de gravação", desc: "Aplicação pede para salvar notas.txt", tone: "neutral" },
  { label: "1 · Registra no diário", desc: "A intenção da alteração é escrita no journal", tone: "neutral" },
  { label: "2 · Commit", desc: "Registro confirmado: a transação está completa", tone: "neutral" },
  { label: "3 · Aplica no disco", desc: "Estruturas reais atualizadas; entrada liberada", tone: "ok" },
  { label: "Queda de energia", desc: "Nova gravação interrompida no meio do caminho", tone: "bad" },
  { label: "Reinício · replay", desc: "Journal relido: alteração refeita, disco consistente", tone: "ok" },
] as const;

export function JournalDemo() {
  const step = useStep(STEPS.length, 2300, 1300);

  const entryA = step === 1 || step === 2;
  const entryB = step >= 4;
  const diskA = step >= 3; // blocos 2,3
  const diskB = step === 5 ? "ok" : step === 4 ? "partial" : "none";
  const crash = step === 4;

  return (
    <div className="relative">
      <Panel title="journaling — simulação" right={<span className="font-mono text-[13px] text-if-lime">etapa {step + 1}/6</span>}>
        <div className="relative grid grid-cols-[1fr_1.2fr_1.4fr] gap-4 p-5">
          {/* Operação */}
          <Column icon={<Cpu size={16} />} title="Operação">
            <AnimatePresence mode="wait">
              {(step === 0 || step === 4) && (
                <motion.div
                  key={`op${step}`}
                  className="rounded-lg border border-if-green/50 bg-if-green/15 p-3 font-mono text-[14px] text-white"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 80 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  write({step === 0 ? "notas.txt" : "trabalho.odt"})
                </motion.div>
              )}
            </AnimatePresence>
          </Column>

          {/* Journal */}
          <Column icon={<BookOpenText size={16} />} title="Journal (diário)">
            <div className="flex flex-col gap-2">
              <AnimatePresence mode="wait">
                {entryA && (
                  <Entry key="A" name="TX#41 notas.txt" state={step === 1 ? "pendente" : "commit"} />
                )}
                {entryB && <Entry key="B" name="TX#42 trabalho.odt" state={step === 5 ? "replay" : "commit"} />}
              </AnimatePresence>
            </div>
          </Column>

          {/* Disco */}
          <Column icon={<HardDrive size={16} />} title="Disco">
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 8 }).map((_, i) => {
                const isA = i === 1 || i === 2;
                const isB = i === 5 || i === 6;
                let bg = "rgba(255,255,255,.05)";
                let border = "rgba(255,255,255,.1)";
                if (isA && diskA) {
                  bg = "rgba(50,160,65,.8)";
                  border = "rgba(126,224,140,.8)";
                }
                if (isB && diskB === "ok") {
                  bg = "rgba(50,160,65,.8)";
                  border = "rgba(126,224,140,.8)";
                }
                if (isB && diskB === "partial") {
                  bg = i === 5 ? "rgba(50,160,65,.8)" : "rgba(200,25,30,.85)";
                  border = i === 5 ? "rgba(126,224,140,.8)" : "rgba(255,90,95,1)";
                }
                return (
                  <motion.div
                    key={i}
                    className="flex aspect-square items-center justify-center rounded-md border font-mono text-[13px] text-white/70"
                    animate={{ backgroundColor: bg, borderColor: border, scale: isB && crash && i === 6 ? [1, 1.15, 1] : 1 }}
                    transition={{ duration: 0.5, delay: isA ? (i - 1) * 0.15 : isB ? (i - 5) * 0.15 : 0 }}
                  >
                    {isB && diskB === "partial" && i === 6 ? "?!" : `b${i}`}
                  </motion.div>
                );
              })}
            </div>
            <motion.div
              className={cn(
                "mt-3 flex items-center gap-2 rounded-md px-2.5 py-1.5 font-mono text-[13px]",
                crash ? "bg-if-red/20 text-if-red-soft" : "bg-if-green/15 text-if-lime",
              )}
            >
              {crash ? <Lightning size={12} /> : <Check size={12} />}
              {crash ? "inconsistente" : "consistente"}
            </motion.div>
          </Column>

          {/* flash de queda de energia */}
          <AnimatePresence>
            {crash && (
              <motion.div
                className="pointer-events-none absolute inset-0 bg-if-red"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0, 0.3, 0, 0.12] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9 }}
              />
            )}
          </AnimatePresence>
        </div>
      </Panel>

      {/* timeline */}
      <div className="mt-5 grid grid-cols-6 gap-2">
        {STEPS.map((s, i) => (
          <div key={i} className="relative">
            <div className="h-[3px] overflow-hidden rounded-full bg-white/10">
              {i === step && (
                <motion.div
                  className={cn("h-full", s.tone === "bad" ? "bg-if-red" : "bg-if-green")}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.3, ease: "linear" }}
                />
              )}
              {i < step && <div className="h-full w-full bg-white/40" />}
            </div>
            <div
              className={cn(
                "mt-2 font-mono text-[13px] leading-tight transition-colors duration-300",
                i === step ? (s.tone === "bad" ? "text-if-red-soft" : "text-white") : "text-white/60",
              )}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 h-6">
        <AnimatePresence mode="wait">
          <motion.p
            key={step}
            className="flex items-center gap-2 text-[17px] text-white/75"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {step === 5 && <ArrowCounterClockwise size={16} className="text-if-lime" />}
            {STEPS[step].desc}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Column({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-[230px] rounded-xl border border-white/8 bg-black/25 p-3.5">
      <div className="mb-3 flex items-center gap-2 font-mono text-[13px] uppercase tracking-[0.15em] text-white/65">
        <span className="text-if-lime">{icon}</span>
        {title}
      </div>
      {children}
    </div>
  );
}

function Entry({ name, state }: { name: string; state: "pendente" | "commit" | "replay" }) {
  return (
    <motion.div
      className="rounded-lg border border-white/12 bg-white/[0.06] p-2.5 font-mono text-[14px]"
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 60 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <div className="text-white/85">{name}</div>
      <div className="mt-1.5 flex items-center gap-1.5">
        <span
          className={cn(
            "rounded px-1.5 py-0.5 text-[13px] uppercase tracking-wider",
            state === "pendente" && "bg-white/10 text-white/70",
            state === "commit" && "bg-if-green/25 text-if-lime",
            state === "replay" && "bg-if-lime/25 text-if-lime",
          )}
        >
          {state}
        </span>
        {state === "replay" && (
          <motion.span animate={{ rotate: -360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
            <ArrowCounterClockwise size={11} className="text-if-lime" />
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}
