"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { BASE_DELAY, EASE, cn } from "@/lib/meta";
import { CountUp, Reveal, SplitWords, Tag } from "@/components/ui/motion";
import { useStep } from "@/components/visuals/shared";
import { Anim, CheckIcon, Minus } from "@/components/ui/icons";

type Cap = "y" | "n" | string;
type Row = { fs: string; env: string; main: string; note: string; rec: Cap; snap: Cap; perm: Cap; big: Cap };

const ROWS: Row[] = [
  { fs: "NTFS", env: "Windows", main: "Segurança e gerenciamento", note: "Padrão do Windows moderno, com permissões, criptografia, compressão e cotas.", rec: "journal", snap: "n", perm: "y", big: "y" },
  { fs: "ext4", env: "Linux", main: "Estabilidade e desempenho", note: "Escolha consolidada no Linux; usa extents para alocar o espaço com eficiência.", rec: "journal", snap: "n", perm: "y", big: "y" },
  { fs: "FAT32", env: "Diversos sistemas", main: "Compatibilidade", note: "Funciona em quase tudo, mas limita cada arquivo a 4 GB.", rec: "n", snap: "n", perm: "n", big: "n" },
  { fs: "exFAT", env: "Armazenamento externo", main: "Suporte a arquivos grandes", note: "Sucessor do FAT32 para mídias removíveis compartilhadas entre sistemas.", rec: "n", snap: "n", perm: "n", big: "y" },
  { fs: "APFS", env: "Apple", main: "Criptografia e otimização para SSD", note: "Feito pela Apple para flash: Copy-on-Write, snapshots e espaço compartilhado.", rec: "CoW", snap: "y", perm: "y", big: "y" },
  { fs: "Btrfs", env: "Linux", main: "Snapshots e integridade", note: "Copy-on-Write com checksums, compressão e vários discos no mesmo volume.", rec: "CoW", snap: "y", perm: "y", big: "y" },
];

const CAPS: { key: "rec" | "snap" | "perm" | "big"; label: string; short: string }[] = [
  { key: "rec", label: "Recuperação após falha", short: "Recuperação" },
  { key: "snap", label: "Snapshots", short: "Snapshots" },
  { key: "perm", label: "Permissões de acesso", short: "Permissões" },
  { key: "big", label: "Arquivos maiores que 4 GB", short: "> 4 GB" },
];

const has = (v: Cap) => v !== "n";

const STATS = [
  { n: ROWS.length, l: "sistemas comparados" },
  { n: ROWS.filter((r) => has(r.perm)).length, l: "com permissões" },
  { n: ROWS.filter((r) => has(r.snap)).length, l: "com snapshots" },
  { n: ROWS.filter((r) => has(r.big)).length, l: "aceitam arquivos > 4 GB" },
];

function Mark({ v }: { v: Cap }) {
  if (v === "y")
    return (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-if-green text-white">
        <CheckIcon size={17} />
      </span>
    );
  if (v === "n")
    return (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-ink/[0.07] text-ink/45">
        <Minus size={17} />
      </span>
    );
  return <span className="rounded-lg bg-if-green/15 px-2.5 py-1 font-mono text-[14px] font-medium text-if-green-dark">{v}</span>;
}

export function Comparison() {
  const auto = useStep(ROWS.length, 2600, 2400);
  const [manual, setManual] = useState<number | null>(null);
  const active = manual ?? auto;
  const r = ROWS[active];
  const cols = "grid-cols-[118px_236px_1fr_118px_100px_104px_80px]";

  return (
    <div className="relative h-full w-full overflow-hidden bg-paper text-ink">
      <div className="grid-lines-dark absolute inset-0" />
      <div className="relative flex h-full flex-col px-14 pb-[110px] pt-[120px]">
        <div className="flex items-end justify-between">
          <div>
            <Reveal>
              <Tag tone="light">03 · Comparação</Tag>
            </Reveal>
            <h2 className="mt-5 font-display text-[64px] font-bold leading-[0.95] tracking-[-0.045em]">
              <SplitWords text="Lado a *lado*" accentClass="text-if-green" />
            </h2>
          </div>
          <div className="flex gap-3">
            {STATS.map((s, i) => (
              <Reveal
                key={s.l}
                delay={0.3 + i * 0.08}
                className="w-[168px] rounded-2xl bg-white px-5 py-3.5 shadow-[0_10px_30px_-20px_rgba(5,10,6,.4)] ring-1 ring-ink/[0.07]"
              >
                <div className="font-display text-[38px] font-bold leading-none text-if-green">
                  <CountUp to={s.n} delay={0.5 + i * 0.1} duration={1.2} />
                </div>
                <div className="mt-1.5 text-[15px] leading-tight text-ink/75">{s.l}</div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-6 grid flex-1 grid-cols-[1fr_380px] gap-5">
          {/* tabela */}
          <div className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_40px_80px_-40px_rgba(5,10,6,.3)] ring-1 ring-ink/[0.07]">
            <div className={cn("grid items-center bg-ink px-6 py-3.5 text-[14px] font-medium text-white/85", cols)}>
              <span>Sistema</span>
              <span>Ambiente</span>
              <span>Principal característica</span>
              {CAPS.map((c) => (
                <span key={c.key} className="text-center">
                  {c.short}
                </span>
              ))}
            </div>
            {ROWS.map((row, i) => {
              const on = i === active;
              return (
                <motion.button
                  key={row.fs}
                  onClick={() => setManual(i)}
                  onMouseEnter={() => setManual(i)}
                  className={cn(
                    "relative grid w-full flex-1 items-center border-t border-ink/[0.06] px-6 text-left transition-colors duration-300",
                    on ? "bg-if-green/[0.09]" : "hover:bg-ink/[0.03]",
                    cols,
                  )}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: BASE_DELAY + 0.3 + i * 0.08, duration: 0.7, ease: EASE }}
                >
                  <span
                    className={cn(
                      "absolute inset-y-0 left-0 w-[5px] bg-if-green transition-opacity duration-300",
                      on ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="text-[24px] font-bold tracking-tight">{row.fs}</span>
                  <span className="text-[16px] text-ink/70">{row.env}</span>
                  <span className="pr-3 text-[17px] font-medium leading-snug">{row.main}</span>
                  {CAPS.map((c) => (
                    <span key={c.key} className="flex justify-center">
                      <Mark v={row[c.key]} />
                    </span>
                  ))}
                </motion.button>
              );
            })}
          </div>

          {/* painel de destaque */}
          <Reveal delay={0.5} className="relative overflow-hidden rounded-3xl bg-ink p-7 text-white">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-if-green/30 blur-3xl" />
            <AnimatePresence mode="wait">
              <motion.div
                key={r.fs}
                className="relative flex h-full flex-col"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <div className="text-[13px] font-semibold uppercase tracking-[0.16em] text-white/65">{r.env}</div>
                <div className="mt-2 font-display text-[64px] font-bold leading-none tracking-tight">{r.fs}</div>
                <div className="mt-3 text-[19px] font-medium leading-snug text-if-lime">{r.main}</div>
                <p className="mt-3 text-[17px] leading-snug text-white/80">{r.note}</p>
                <div className="mt-auto flex flex-col gap-2">
                  {CAPS.map((c, j) => {
                    const v = r[c.key];
                    const ok = has(v);
                    return (
                      <motion.div
                        key={c.key}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[16px]",
                          ok ? "bg-if-green/20 text-white" : "bg-white/[0.05] text-white/60",
                        )}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.08 * j, duration: 0.35 }}
                      >
                        <span className="flex-1">{c.label}</span>
                        {ok ? (
                          v === "y" ? (
                            <Anim icon={CheckIcon} size={18} trigger={r.fs} delay={0.1 + j * 0.08} className="text-if-lime" />
                          ) : (
                            <span className="font-mono text-[14px] text-if-lime">{v}</span>
                          )
                        ) : (
                          <Minus size={18} />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
