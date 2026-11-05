"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { BASE_DELAY, EASE, cn } from "@/lib/meta";
import { BottomShade, Glow, PixelField } from "@/components/ui/backgrounds";
import type { Icon } from "@/components/ui/icons";
import { Parallax, Reveal, SplitWords, Tag } from "@/components/ui/motion";
import { useDeck } from "@/components/deck/context";

export type FsInfo = {
  id: string;
  num: string;
  name: string;
  full: string;
  env: string;
  since: string;
  lead: string;
  features: string[];
  where: { label: string; icon: Icon }[];
  visual: ReactNode;
  glow?: "a" | "b" | "c" | "red";
};

const TABS = [
  { id: "ntfs", name: "NTFS" },
  { id: "ext4", name: "ext4" },
  { id: "fat32", name: "FAT32" },
  { id: "exfat", name: "exFAT" },
  { id: "apfs", name: "APFS" },
  { id: "btrfs", name: "Btrfs" },
];

export function FsSlide({ fs }: { fs: FsInfo }) {
  const { goTo } = useDeck();
  return (
    <div className="grain relative h-full w-full overflow-hidden bg-ink text-white">
      <Glow variant={fs.glow ?? "a"} />
      <Parallax depth={-20} className="absolute inset-0">
        <PixelField focus={{ x: 0.05, y: 1 }} radius={0.4} intensity={0.5} />
      </Parallax>
      <div className="grid-lines absolute inset-0 opacity-50" />

      {/* nome gigante vazado ao fundo */}
      <Parallax depth={36} className="pointer-events-none absolute -bottom-24 -right-8">
        <motion.div
          className="text-outline font-display text-[320px] font-bold leading-none tracking-tighter"
          initial={{ opacity: 0, x: 160 }}
          animate={{ opacity: 0.3, x: 0 }}
          transition={{ duration: 1.8, delay: BASE_DELAY, ease: EASE }}
        >
          {fs.name}
        </motion.div>
      </Parallax>

      <BottomShade />

      <div className="relative grid h-full grid-cols-[640px_1fr] gap-14 px-14 pb-[110px] pt-[120px]">
        <div className="flex flex-col">
          {/* abas dos 6 filesystems */}
          <Reveal className="flex items-center gap-1 font-mono text-[14px]">
            <span className="mr-2 text-white/60">{fs.num}/06</span>
            {TABS.map((t) => {
              const active = t.id === fs.id;
              return (
                <button
                  key={t.id}
                  onClick={() => !active && goTo(t.id)}
                  className={cn(
                    "rounded-md px-2.5 py-1 transition-colors",
                    active ? "bg-if-green text-white" : "text-white/65 hover:bg-white/8 hover:text-white",
                  )}
                >
                  {t.name}
                </button>
              );
            })}
          </Reveal>

          <h2 className="mt-5 font-display text-[132px] font-bold leading-[0.88] tracking-[-0.05em]">
            <SplitWords text={fs.name} delay={0.05} />
          </h2>

          <Reveal delay={0.2} className="mt-4 flex flex-wrap items-center gap-2">
            <span className="mr-2 font-mono text-[15px] text-if-lime">{fs.full}</span>
            <Tag>{fs.env}</Tag>
            <Tag>desde {fs.since}</Tag>
          </Reveal>

          <Reveal delay={0.3} className="mt-6 max-w-[580px] text-[21px] leading-snug text-white/70">
            {fs.lead}
          </Reveal>

          <ul className="mt-7 flex flex-col">
            {fs.features.map((f, i) => (
              <motion.li
                key={f}
                className="group flex items-center gap-4 border-t border-white/10 py-2.5 text-[18px] text-white/90"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: BASE_DELAY + 0.45 + i * 0.07, duration: 0.8, ease: EASE }}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-if-green/15 font-mono text-[13px] text-if-lime transition-colors group-hover:bg-if-green group-hover:text-white">
                  {i + 1}
                </span>
                {f}
              </motion.li>
            ))}
          </ul>

          <Reveal delay={1} className="mt-auto pt-6">
            <div className="mb-2.5 text-[14px] font-semibold uppercase tracking-[0.16em] text-white/80">Onde se usa</div>
            <div className="flex flex-wrap gap-2.5">
              {fs.where.map(({ label, icon: I }) => (
                <span
                  key={label}
                  className="flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2 text-[16px] font-medium text-white ring-1 ring-inset ring-white/15 backdrop-blur-md"
                >
                  <I size={20} className="text-if-lime" />
                  {label}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="flex flex-col justify-center">{fs.visual}</div>
      </div>
    </div>
  );
}
