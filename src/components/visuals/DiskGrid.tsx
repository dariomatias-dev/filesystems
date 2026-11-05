"use client";

import { AnimatePresence, motion } from "motion/react";
import { BASE_DELAY, EASE, cn } from "@/lib/meta";
import { Panel, useStep } from "./shared";
import { Fluctuate } from "@/components/ui/live";

const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

const FILES = [
  {
    name: "relatorio.pdf",
    size: "2,4 MB",
    created: "12/03/2026 09:14",
    perm: "-rw-r--r--",
    owner: "aluno",
    blocks: [...range(2, 9), ...range(34, 37)],
    color: "#32a041",
  },
  {
    name: "foto_campus.jpg",
    size: "5,1 MB",
    created: "02/04/2026 16:40",
    perm: "-rw-rw-r--",
    owner: "aluno",
    blocks: range(18, 31),
    color: "#7ee08c",
  },
  {
    name: "escalonador.c",
    size: "12 KB",
    created: "20/05/2026 22:03",
    perm: "-rwxr-x---",
    owner: "prof",
    blocks: [44, 45, 61],
    color: "#ff5a5f",
  },
  {
    name: "aula_so.mp4",
    size: "48 MB",
    created: "07/06/2026 10:21",
    perm: "-r--r--r--",
    owner: "ifpb",
    blocks: [...range(66, 89), ...range(98, 109)],
    color: "#a5f3b0",
  },
];

const COLS = 16;
const ROWS = 8;

export function DiskGrid() {
  const active = useStep(FILES.length, 2600, 1400);
  const owner = new Map<number, number>();
  FILES.forEach((f, fi) => f.blocks.forEach((b) => owner.set(b, fi)));
  const file = FILES[active];
  const used = owner.size;
  const total = COLS * ROWS;

  return (
    <div className="flex flex-col gap-5">
      <Panel
        title="/dev/sda1 — mapa de blocos"
        right={
          <span className="flex items-center gap-3 font-mono text-[14px] text-white/75">
            <span>E/S</span>
            <Fluctuate base={312} spread={60} every={600} suffix=" MB/s" className="text-white" />
            <span className="text-white/40">·</span>
            {Math.round((used / total) * 100)}% ocupado
          </span>
        }
      >
        <div className="relative p-5">
          <div className="grid gap-[5px]" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
            {Array.from({ length: total }).map((_, i) => {
              const fi = owner.get(i);
              const isActive = fi === active;
              const color = fi !== undefined ? FILES[fi].color : undefined;
              return (
                <motion.div
                  key={i}
                  className="h-[30px] rounded-[4px] border"
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{
                    opacity: 1,
                    scale: isActive ? 1.06 : 1,
                    backgroundColor: color ? color : "rgba(255,255,255,0.03)",
                    borderColor: isActive ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.07)",
                    filter: fi === undefined ? "none" : isActive ? "brightness(1.15)" : "brightness(.35) saturate(.6)",
                    boxShadow: isActive ? `0 0 18px ${color}` : "0 0 0 transparent",
                  }}
                  transition={{
                    opacity: { delay: BASE_DELAY + 0.3 + ((i % COLS) + Math.floor(i / COLS)) * 0.018 },
                    scale: { type: "spring", stiffness: 300, damping: 18, delay: isActive ? (file.blocks.indexOf(i) % 40) * 0.02 : 0 },
                    default: { duration: 0.5 },
                  }}
                />
              );
            })}
          </div>
          {/* cabeça de leitura varrendo */}
          <motion.div
            className="pointer-events-none absolute inset-y-3 w-24 bg-gradient-to-r from-transparent via-if-lime/20 to-transparent"
            initial={{ left: "-10%" }}
            animate={{ left: ["-10%", "100%"] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "linear", delay: 1.4 }}
          />
        </div>
        <div className="flex gap-5 border-t border-white/10 px-5 py-3 font-mono text-[13px] text-white/70">
          {FILES.map((f, i) => (
            <span key={f.name} className={cn("flex items-center gap-2 transition-opacity", i === active ? "opacity-100" : "opacity-50")}>
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: f.color }} />
              {f.name}
            </span>
          ))}
          <span className="ml-auto flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm border border-white/20 bg-white/5" /> livre
          </span>
        </div>
      </Panel>

      <Panel title="stat — metadados (inode)" delay={0.45}>
        <div className="relative h-[112px] px-5 py-3.5 font-mono text-[15px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={file.name}
              className="grid grid-cols-3 gap-x-8 gap-y-2.5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <Meta k="nome" v={file.name} color={file.color} />
              <Meta k="tamanho" v={file.size} />
              <Meta k="criado em" v={file.created} />
              <Meta k="permissões" v={file.perm} />
              <Meta k="dono" v={file.owner} />
              <Meta k="blocos" v={`${file.blocks.length} → [${file.blocks[0]}…${file.blocks.at(-1)}]`} />
            </motion.div>
          </AnimatePresence>
        </div>
      </Panel>
    </div>
  );
}

function Meta({ k, v, color }: { k: string; v: string; color?: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[13px] uppercase tracking-[0.18em] text-white/60">{k}</span>
      <span className="truncate text-white/90" style={color ? { color } : undefined}>
        {v}
      </span>
    </div>
  );
}
