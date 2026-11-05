"use client";

import { motion } from "motion/react";
import { BASE_DELAY, EASE, META, cn } from "@/lib/meta";
import { ChalkboardTeacher, Cpu, GraduationCap, UsersThree, type Icon } from "@/components/ui/icons";

const initials = (n: string) =>
  n
    .split(" ")
    .filter((p) => p.length > 2)
    .slice(0, 2)
    .map((p) => p[0])
    .join("");

/** Faixa de contexto acadêmico: disciplina · curso · instituição. */
export function CourseStrip({ delay = 0 }: { delay?: number }) {
  const items: { icon: Icon; label: string; value: string }[] = [
    { icon: Cpu, label: "Disciplina", value: META.disciplina },
    { icon: GraduationCap, label: "Curso", value: META.curso },
  ];
  return (
    <motion.div
      className="inline-flex items-stretch overflow-hidden rounded-2xl border border-white/12 bg-black/45 backdrop-blur-md"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: BASE_DELAY + delay, duration: 0.8, ease: EASE }}
    >
      {items.map(({ icon: I, label, value }) => (
        <div key={label} className="flex items-center gap-3 border-r border-white/10 py-2.5 pl-3 pr-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-if-green/15 text-if-lime ring-1 ring-inset ring-if-green/30">
            <I size={19} />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/60">{label}</span>
            <span className="text-[17px] font-medium text-white">{value}</span>
          </span>
        </div>
      ))}
      <div className="flex items-center gap-2.5 bg-if-green px-5 text-[17px] font-bold tracking-wide text-white">
        <span className="h-2.5 w-2.5 rounded-[3px] bg-if-red" />
        {META.instituicao} · {META.ano}
      </div>
    </motion.div>
  );
}

function Avatar({ name, tone = "green", size = 44 }: { name: string; tone?: "green" | "white"; size?: number }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl font-display font-bold",
        tone === "green"
          ? "bg-gradient-to-br from-if-green to-if-green-dark text-white shadow-[0_8px_20px_-8px_rgba(47,158,65,.9)]"
          : "bg-white text-if-green-dark",
      )}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials(name)}
    </span>
  );
}

/** Painel com equipe e professor (capa e encerramento). */
export function TeamPanel({ delay = 0, className }: { delay?: number; className?: string }) {
  return (
    <motion.div
      className={cn(
        "flex items-stretch overflow-hidden rounded-3xl border border-white/12 bg-black/55 backdrop-blur-xl",
        className,
      )}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: BASE_DELAY + delay, duration: 0.8, ease: EASE }}
    >
      <div className="p-5 pr-7">
        <div className="mb-3.5 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-if-lime">
          <UsersThree size={18} /> Equipe
        </div>
        <div className="flex flex-col gap-2.5">
          {META.autores.map((n, i) => (
            <motion.div
              key={n}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: BASE_DELAY + delay + 0.2 + i * 0.1, duration: 0.6, ease: EASE }}
            >
              <Avatar name={n} size={38} />
              <span className="text-[19px] font-medium text-white">{n}</span>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="flex w-[350px] flex-col bg-gradient-to-br from-if-green/25 to-if-green/5 p-5 ring-1 ring-inset ring-if-green/25">
        <div className="mb-3.5 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-if-lime">
          <ChalkboardTeacher size={18} /> Professor
        </div>
        <Avatar name={META.professor} tone="white" size={52} />
        <div className="mt-3 text-[20px] font-semibold leading-tight text-white">{META.professor}</div>
        <div className="mt-1 text-[15px] text-white/75">{META.disciplina}</div>
      </div>
    </motion.div>
  );
}
