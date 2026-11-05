"use client";

import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect } from "react";
import { AnimatedNumber, Fluctuate, IoGraph, LiveDot } from "@/components/ui/live";
import { Warning, Camera, Check, FileVideo, LockSimple, Minus, ShieldCheck, LockSimpleOpen, X } from "@/components/ui/icons";
import { BASE_DELAY, EASE, cn } from "@/lib/meta";
import { Panel, useStep } from "./shared";

/* ───────────────────────────── NTFS ───────────────────────────── */

const ACL = [
  { who: "Administradores", perms: [1, 1, 1, 1] },
  { who: "Usuários", perms: [1, 1, 0, 0] },
  { who: "Convidado", perms: [1, 0, 0, 0] },
];
const ACL_COLS = ["Leitura", "Executar", "Gravação", "Controle total"];

export function NtfsVisual() {
  const step = useStep(2, 2600, 2000);
  return (
    <div className="flex flex-col gap-5">
      <Panel title="Propriedades de C:\Projetos › Segurança">
        <div className="p-5">
          <div className="grid grid-cols-[1.4fr_repeat(4,1fr)] items-center gap-y-3 font-mono text-[14px]">
            <span className="text-white/60">Grupo / usuário</span>
            {ACL_COLS.map((c) => (
              <span key={c} className="text-center text-white/60">
                {c}
              </span>
            ))}
            {ACL.map((row, ri) => (
              <Row key={row.who} row={row} ri={ri} />
            ))}
          </div>
        </div>
      </Panel>
      <div className="grid grid-cols-3 gap-4">
        <Panel title="EFS" delay={0.5}>
          <div className="flex h-[118px] flex-col items-center justify-center gap-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 16 }}
              >
                {step ? <LockSimple className="text-if-lime" size={34} /> : <LockSimpleOpen className="text-white/65" size={34} />}
              </motion.div>
            </AnimatePresence>
            <span className="font-mono text-[13px] text-white/70">{step ? "criptografado" : "texto claro"}</span>
          </div>
        </Panel>
        <Panel title="Compressão" delay={0.6}>
          <div className="flex h-[118px] flex-col justify-center gap-2 px-4">
            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-if-green to-if-lime"
                animate={{ width: step ? "58%" : "100%" }}
                transition={{ duration: 1.2, ease: EASE }}
              />
            </div>
            <span className="font-mono text-[14px] text-white/75">
              <AnimatedNumber value={step ? 2.9 : 5} decimals={1} suffix=" GB" className="text-[20px] font-semibold text-white" />{" "}
              {step ? "comprimido" : "original"}
            </span>
          </div>
        </Panel>
        <Panel title="Cota de disco" delay={0.7}>
          <div className="flex h-[118px] flex-col justify-center gap-2 px-4">
            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className={cn("h-full rounded-full", step ? "bg-if-red" : "bg-if-green")}
                animate={{ width: step ? "96%" : "61%" }}
                transition={{ duration: 1.2, ease: EASE }}
              />
            </div>
            <span className={cn("font-mono text-[13px]", step ? "text-if-red-soft" : "text-white/70")}>
              <AnimatedNumber value={step ? 48 : 30.5} decimals={1} className="text-[20px] font-semibold" />
              {" / 50 GB"}
            </span>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Row({ row, ri }: { row: (typeof ACL)[number]; ri: number }) {
  return (
    <>
      <motion.span
        className="text-white/85"
        initial={{ opacity: 0, x: -14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: BASE_DELAY + 0.5 + ri * 0.15 }}
      >
        {row.who}
      </motion.span>
      {row.perms.map((p, pi) => (
        <motion.span
          key={pi}
          className="flex justify-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15, delay: BASE_DELAY + 0.7 + ri * 0.15 + pi * 0.08 }}
        >
          <span
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-md",
              p ? "bg-if-green/25 text-if-lime" : "bg-if-red/15 text-if-red-soft",
            )}
          >
            {p ? <Check size={14} /> : <X size={14} />}
          </span>
        </motion.span>
      ))}
    </>
  );
}

/* ───────────────────────────── ext4 ───────────────────────────── */

export function Ext4Visual() {
  const N = 24;
  const start = 5;
  const len = 13;
  return (
    <div className="flex flex-col gap-5">
      <Panel title="alocação: ponteiro por bloco  ×  extent">
        <div className="space-y-7 p-6">
          {/* Antigo: um ponteiro por bloco */}
          <div>
            <div className="mb-3 flex items-center justify-between font-mono text-[13px] text-white/65">
              <span>ext2/ext3 · lista de blocos</span>
              <span className="text-if-red-soft">{len} ponteiros</span>
            </div>
            <div className="flex flex-wrap gap-1.5 font-mono text-[13px]">
              {Array.from({ length: len }).map((_, i) => (
                <motion.span
                  key={i}
                  className="rounded border border-white/10 bg-white/5 px-1.5 py-1 text-white/70"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: BASE_DELAY + 0.4 + i * 0.05 }}
                >
                  #{2048 + i}
                </motion.span>
              ))}
            </div>
          </div>
          {/* Novo: extent */}
          <div>
            <div className="mb-3 flex items-center justify-between font-mono text-[13px] text-white/65">
              <span>ext4 · extent</span>
              <span className="text-if-lime">1 descritor</span>
            </div>
            <div className="relative">
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${N}, 1fr)` }}>
                {Array.from({ length: N }).map((_, i) => {
                  const inExt = i >= start && i < start + len;
                  return (
                    <motion.div
                      key={i}
                      className="h-10 rounded-[4px] border border-white/8"
                      initial={{ backgroundColor: "rgba(255,255,255,.04)" }}
                      animate={{
                        backgroundColor: inExt ? "rgba(50,160,65,.85)" : "rgba(255,255,255,.04)",
                      }}
                      transition={{ delay: BASE_DELAY + 1.2 + (inExt ? (i - start) * 0.06 : 0), duration: 0.3 }}
                    />
                  );
                })}
              </div>
              {/* leitura sequencial contínua do extent */}
              <motion.div
                className="pointer-events-none absolute inset-y-0 w-[8%] rounded-md bg-white/50 mix-blend-overlay shadow-[0_0_24px_rgba(255,255,255,.6)]"
                style={{ left: `${(start / N) * 100}%` }}
                animate={{ left: [`${(start / N) * 100}%`, `${((start + len) / N) * 100 - 8}%`] }}
                transition={{ duration: 1.6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: BASE_DELAY + 2.6 }}
              />
              <motion.div
                className="absolute -bottom-4 h-3 rounded-b-md border-x-2 border-b-2 border-if-lime"
                style={{ left: `${(start / N) * 100}%`, width: `${(len / N) * 100}%` }}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: BASE_DELAY + 2.1, duration: 0.6, ease: EASE }}
              />
            </div>
            <motion.div
              className="mx-auto mt-8 w-fit rounded-lg border border-if-lime/40 bg-if-green/15 px-4 py-2.5 font-mono text-[15px] text-white"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: BASE_DELAY + 2.4 }}
            >
              {"{ "}
              <span className="text-if-lime">início</span>: 2048, <span className="text-if-lime">tamanho</span>: {len}
              {" }"}
            </motion.div>
            <div className="mt-6 flex items-end justify-between gap-6 rounded-xl border border-white/10 bg-black/25 p-4">
              <div>
                <div className="flex items-center gap-2 text-[14px] text-white/75">
                  <LiveDot /> Leitura sequencial do extent
                </div>
                <div className="mt-1.5 font-display text-[34px] font-bold leading-none">
                  <Fluctuate base={510} spread={45} every={700} />
                  <span className="ml-1.5 text-[17px] font-medium text-white/70">MB/s</span>
                </div>
              </div>
              <IoGraph base={510} spread={60} max={700} width={260} height={58} label="taxa de leitura · 15 s" />
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}

/* ─────────────────────── FAT32 / exFAT — cópia ─────────────────────── */

export function CopyDemo({ fs }: { fs: "fat32" | "exfat" }) {
  // 0 copiando, 1 resultado, 2 pausa
  const phase = useStep(3, fs === "fat32" ? 2600 : 2600, 600);
  const fail = fs === "fat32";
  const limitPct = 80; // 4 GB de 5 GB
  const target = phase === 0 || phase === 1 ? (fail ? limitPct : 100) : 0;
  const done = phase === 1;
  const pct = useMotionValue(0);
  useEffect(() => {
    const c = animate(pct, target, {
      duration: phase === 0 ? 2.2 : 0.5,
      ease: phase === 0 ? [0.4, 0, 0.6, 1] : [0.22, 1, 0.36, 1],
    });
    return () => c.stop();
  }, [pct, target, phase]);
  const width = useTransform(pct, (v) => `${v}%`);
  const gbText = useTransform(pct, (v) =>
    ((v / 100) * 5).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  );

  return (
    <Panel
      title={`copiar para  /media/pendrive  (${fs === "fat32" ? "FAT32" : "exFAT"})`}
      right={<span className="font-mono text-[13px] text-white/60">filme_4k.mkv · 5 GB</span>}
    >
      <div className="relative p-6">
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/5">
            <FileVideo className="text-if-lime" size={26} />
          </div>
          <div>
            <div className="text-[18px] text-white">filme_4k.mkv</div>
            <div className="font-mono text-[14px] text-white/65">5.368.709.120 bytes</div>
          </div>
          <div className="ml-auto text-right">
            <div className="font-display text-[34px] font-bold leading-none tabular-nums">
              <motion.span className={done && fail ? "text-if-red-soft" : "text-white"}>{gbText}</motion.span>
              <span className="text-[18px] font-medium text-white/65"> / 5 GB</span>
            </div>
            <div className="mt-1.5 flex items-center justify-end gap-2 font-mono text-[14px] text-white/70">
              {phase === 0 ? (
                <>
                  <LiveDot /> <Fluctuate base={182} spread={40} every={450} suffix=" MB/s" />
                </>
              ) : done ? (
                <span className={fail ? "text-if-red-soft" : "text-if-lime"}>{fail ? "interrompido" : "concluído"}</span>
              ) : (
                <span>aguardando…</span>
              )}
            </div>
          </div>
        </div>

        <div className="relative h-14 overflow-hidden rounded-xl border border-white/10 bg-white/5">
          <motion.div
            className={cn(
              "absolute inset-y-0 left-0",
              done && fail ? "bg-gradient-to-r from-if-red/70 to-if-red" : "bg-gradient-to-r from-if-green-dark to-if-green",
            )}
            style={{ width }}
          />
          {phase === 0 && (
            <motion.div
              className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ left: ["-20%", "100%"] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
            />
          )}
          {/* marcas GB */}
          {[1, 2, 3, 4].map((g) => (
            <span
              key={g}
              className="absolute inset-y-0 border-l border-white/10 pl-1.5 pt-1 font-mono text-[13px] text-white/60"
              style={{ left: `${g * 20}%` }}
            >
              {g} GB
            </span>
          ))}
          {fail && (
            <div className="absolute inset-y-0 border-l-2 border-dashed border-if-red-soft" style={{ left: `${limitPct}%` }} />
          )}
        </div>
        <div className="mt-2 flex justify-between font-mono text-[13px] text-white/60">
          <span>0</span>
          {fail ? (
            <span className="text-if-red-soft" style={{ marginLeft: `${limitPct - 12}%` }}>
              limite: 4 GB − 1 byte
            </span>
          ) : (
            <span className="text-if-lime">limite teórico: 16 EB</span>
          )}
          <span>5 GB</span>
        </div>

        <div className="mt-6 h-[74px]">
          <AnimatePresence mode="wait">
            {done && fail && (
              <motion.div
                key="err"
                className="flex items-start gap-3 rounded-xl border border-if-red/50 bg-if-red/15 p-4"
                initial={{ opacity: 0, y: 12, x: 0 }}
                animate={{ opacity: 1, y: 0, x: [0, -10, 10, -6, 6, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Warning className="mt-0.5 shrink-0 text-if-red-soft" size={20} />
                <div>
                  <div className="text-[15px] text-white">O arquivo é muito grande para o sistema de arquivos de destino.</div>
                  <div className="font-mono text-[13px] text-white/65">FAT32 armazena o tamanho em 32 bits → máx. 4 GB por arquivo</div>
                </div>
              </motion.div>
            )}
            {done && !fail && (
              <motion.div
                key="ok"
                className="flex items-center gap-3 rounded-xl border border-if-green/50 bg-if-green/15 p-4"
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <ShieldCheck className="text-if-lime" size={22} />
                <div className="text-[15px] text-white">Cópia concluída — arquivos maiores que 4 GB são suportados.</div>
              </motion.div>
            )}
            {phase === 0 && (
              <motion.div
                key="copy"
                className="font-mono text-[15px] text-white/70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                copiando<motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }}>…</motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Panel>
  );
}

/** Cadeia de clusters da tabela FAT. */
export function FatChain() {
  const chain = [
    { c: 2, n: "5" },
    { c: 5, n: "6" },
    { c: 6, n: "11" },
    { c: 11, n: "EOF" },
  ];
  return (
    <Panel title="tabela FAT · cadeia de clusters" delay={0.5}>
      <div className="flex items-center gap-2 p-5 font-mono text-[14px]">
        {chain.map((x, i) => (
          <div key={x.c} className="flex items-center gap-2">
            <motion.div
              className="rounded-lg border border-white/12 bg-white/5 px-3 py-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, borderColor: ["rgba(255,255,255,.12)", "rgba(126,224,140,.9)", "rgba(255,255,255,.12)"] }}
              transition={{
                opacity: { delay: BASE_DELAY + 0.6 + i * 0.12 },
                y: { delay: BASE_DELAY + 0.6 + i * 0.12 },
                borderColor: { delay: 1.5 + i * 0.35, duration: 0.7, repeat: Infinity, repeatDelay: chain.length * 0.35 },
              }}
            >
              <div className="text-white/60">cluster {x.c}</div>
              <div className={x.n === "EOF" ? "text-if-red-soft" : "text-if-lime"}>→ {x.n}</div>
            </motion.div>
            {i < chain.length - 1 && <span className="text-white/55">›</span>}
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ───────────────────────────── APFS ───────────────────────────── */

const COW_STEPS = [
  "Arquivo aponta para o bloco original A",
  "Alteração: o novo conteúdo vai para A′, em outro lugar",
  "Ponteiro troca para A′ — o original não foi sobrescrito",
  "Snapshot continua enxergando A: estado anterior preservado",
];

export function ApfsVisual() {
  const step = useStep(4, 2400, 1200);
  const W = 640;
  const BW = 180; // largura dos blocos
  const fileX = 100;
  const aX = 100;
  const a2X = 380;
  const snapX = 520;
  return (
    <Panel title="Copy-on-Write + snapshot" right={<span className="font-mono text-[13px] text-if-lime">{step + 1}/4</span>}>
      <div className="relative p-5">
        <div className="relative mx-auto h-[330px]" style={{ width: W }}>
          <svg className="absolute inset-0" width={W} height={330}>
            {/* ponteiro do arquivo */}
            <motion.line
              x1={fileX + BW / 2}
              y1={96}
              y2={220}
              stroke="#7ee08c"
              strokeWidth={2.5}
              strokeDasharray="6 5"
              animate={{ x2: step >= 2 ? a2X + BW / 2 : aX + BW / 2 }}
              initial={{ x2: aX + BW / 2 }}
              transition={{ duration: 0.8, ease: EASE }}
            />
            {/* snapshot → A */}
            <motion.line
              x1={snapX + 55}
              y1={80}
              x2={aX + BW - 30}
              y2={220}
              stroke="#ff5a5f"
              strokeWidth={2}
              strokeDasharray="4 6"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: step === 3 ? 1 : 0, opacity: step === 3 ? 1 : 0 }}
              transition={{ duration: 0.8 }}
            />
          </svg>

          {/* nó de metadados */}
          <div className="absolute top-[30px] rounded-xl border border-white/15 bg-white/8 p-3 text-center" style={{ left: fileX, width: BW }}>
            <div className="font-mono text-[13px] uppercase tracking-widest text-white/60">arquivo</div>
            <div className="text-[15px] text-white">tcc.pages</div>
          </div>

          {/* snapshot */}
          <AnimatePresence>
            {step === 3 && (
              <motion.div
                className="absolute top-[30px] flex w-[110px] items-center justify-center gap-2 rounded-xl border border-if-red/60 bg-if-red/20 p-3"
                style={{ left: snapX }}
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
              >
                <Camera size={16} className="text-if-red-soft" />
                <span className="font-mono text-[14px] text-white">snap</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* bloco A */}
          <motion.div
            className="absolute top-[220px] flex h-[84px] flex-col items-center justify-center gap-0.5 rounded-xl border-2 text-center"
            style={{ left: aX, width: BW }}
            animate={{
              borderColor: step >= 2 && step < 3 ? "rgba(255,255,255,.2)" : "rgba(126,224,140,.9)",
              backgroundColor: step >= 2 && step < 3 ? "rgba(255,255,255,.04)" : "rgba(50,160,65,.35)",
            }}
          >
            <span className="text-[26px] font-semibold text-white">A</span>
            <span className="text-[15px] text-white/80">original intacto</span>
          </motion.div>

          {/* bloco A' */}
          <AnimatePresence>
            {step >= 1 && (
              <motion.div
                className="absolute top-[220px] flex h-[84px] flex-col items-center justify-center gap-0.5 rounded-xl border-2 border-if-lime bg-if-green/40 text-center"
                style={{ left: a2X, width: BW }}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 240, damping: 18 }}
              >
                <span className="text-[26px] font-semibold text-white">A′</span>
                <span className="text-[15px] text-white/85">nova versão</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="h-8 border-t border-white/10 pt-3">
          <AnimatePresence mode="wait">
            <motion.p
              key={step}
              className="text-[16px] text-white/80"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              {COW_STEPS[step]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </Panel>
  );
}

/* ───────────────────────────── Btrfs ───────────────────────────── */

const LEAVES = ["a1f3", "9c0e", "47bd", "e2a8"];

export function BtrfsVisual() {
  // 0 ok, 1 corrompido, 2 detectado, 3 reparado
  const step = useStep(4, 2200, 1300);
  const bad = 2;
  const W = 640;
  const leafX = (i: number) => 30 + i * 150;
  const status = ["Árvore B íntegra: cada bloco tem seu checksum", "Bit flip silencioso no disco…", "Leitura: checksum não confere!", "Reparado a partir da cópia espelhada (RAID1)"];

  return (
    <Panel title="B-tree + checksums (crc32c)" right={<span className="font-mono text-[13px] text-if-lime">scrub</span>}>
      <div className="p-5">
        <div className="relative mx-auto h-[320px]" style={{ width: W }}>
          <svg className="absolute inset-0" width={W} height={320}>
            {[0, 1].map((m) => (
              <motion.line
                key={`r${m}`}
                x1={W / 2}
                y1={74}
                x2={m ? 470 : 170}
                y2={130}
                stroke="rgba(255,255,255,.25)"
                strokeWidth={1.5}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: BASE_DELAY + 0.3, duration: 0.7 }}
              />
            ))}
            {LEAVES.map((_, i) => (
              <motion.line
                key={`l${i}`}
                x1={i < 2 ? 170 : 470}
                y1={186}
                x2={leafX(i) + 60}
                y2={238}
                stroke={i === bad && (step === 1 || step === 2) ? "rgba(255,90,95,.8)" : "rgba(255,255,255,.25)"}
                strokeWidth={1.5}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: BASE_DELAY + 0.7 + i * 0.1, duration: 0.6 }}
              />
            ))}
          </svg>

          <Node x={W / 2 - 60} y={18} label="raiz" sum="5d21" delay={0.2} />
          <Node x={110} y={130} label="nó" sum="b7e0" delay={0.5} />
          <Node x={410} y={130} label="nó" sum="0f9a" delay={0.5} />

          {LEAVES.map((sum, i) => {
            const isBad = i === bad && (step === 1 || step === 2);
            return (
              <motion.div
                key={sum}
                className="absolute w-[120px] rounded-xl border-2 p-2.5 text-center"
                style={{ left: leafX(i), top: 238 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  x: isBad && step === 2 ? [0, -6, 6, -4, 4, 0] : 0,
                  borderColor: isBad ? "rgba(255,90,95,1)" : step === 3 && i === bad ? "rgba(126,224,140,1)" : "rgba(255,255,255,.18)",
                  backgroundColor: isBad ? "rgba(200,25,30,.25)" : step === 3 && i === bad ? "rgba(50,160,65,.35)" : "rgba(255,255,255,.05)",
                }}
                transition={{ delay: step === 0 ? BASE_DELAY + 0.9 + i * 0.1 : 0, duration: 0.45 }}
              >
                <div className="font-mono text-[13px] uppercase tracking-widest text-white/60">folha {i + 1}</div>
                <div className={cn("font-mono text-[15px]", isBad ? "text-if-red-soft" : "text-if-lime")}>
                  {isBad && step >= 1 ? (step === 1 ? sum : "≠ 47bd") : sum}
                </div>
                {i === bad && step === 1 && (
                  <motion.div
                    className="pointer-events-none absolute inset-0 rounded-xl"
                    animate={{ opacity: [0, 0.6, 0, 0.4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                    style={{ background: "repeating-linear-gradient(0deg, rgba(255,90,95,.4) 0 2px, transparent 2px 5px)" }}
                  />
                )}
              </motion.div>
            );
          })}

          {/* espelho */}
          <AnimatePresence>
            {step === 3 && (
              <motion.div
                className="absolute flex items-center gap-1.5 rounded-lg border border-if-lime/50 bg-if-green/20 px-2.5 py-1.5 font-mono text-[13px] text-if-lime"
                style={{ left: leafX(bad) + 10, top: 190 }}
                initial={{ opacity: 0, y: -16, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <ShieldCheck size={12} /> cópia 2
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="h-8 border-t border-white/10 pt-3">
          <AnimatePresence mode="wait">
            <motion.p
              key={step}
              className={cn("flex items-center gap-2 text-[16px]", step === 2 ? "text-if-red-soft" : "text-white/80")}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              {step === 2 ? <Warning size={16} /> : step === 3 ? <Check size={16} className="text-if-lime" /> : <Minus size={16} className="text-white/60" />}
              {status[step]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </Panel>
  );
}

function Node({ x, y, label, sum, delay }: { x: number; y: number; label: string; sum: string; delay: number }) {
  return (
    <motion.div
      className="absolute w-[120px] rounded-xl border border-white/20 bg-white/8 p-2.5 text-center"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: BASE_DELAY + delay, type: "spring", stiffness: 260, damping: 20 }}
    >
      <div className="font-mono text-[13px] uppercase tracking-widest text-white/60">{label}</div>
      <div className="font-mono text-[15px] text-white/80">{sum}</div>
    </motion.div>
  );
}
