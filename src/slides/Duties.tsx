"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { BASE_DELAY, EASE, cn } from "@/lib/meta";
import { Glow } from "@/components/ui/backgrounds";
import { Reveal, SplitWords, Tag } from "@/components/ui/motion";
import { AnimatedNumber } from "@/components/ui/live";
import { useStep } from "@/components/visuals/shared";
import {
  ChartPieSlice,
  Check,
  Eye,
  FileText,
  FolderSimple,
  IconTile,
  Key,
  Lifebuoy,
  PencilSimple,
  SealCheck,
  Tag as TagIcon,
  Trash,
  TreeStructure,
  X,
  type Icon,
} from "@/components/ui/icons";

/* ───────────────────────── mini-visualizações (todas em loop) ───────────────────────── */

const TREE = [
  { d: 0, n: "/", dir: true },
  { d: 1, n: "home/", dir: true },
  { d: 2, n: "aluno/", dir: true },
  { d: 3, n: "so/", dir: true },
  { d: 3, n: "seminario.pdf", dir: false },
];

function TreeViz() {
  const n = useStep(TREE.length + 2, 650, 1200);
  return (
    <div className="flex flex-col gap-[3px] font-mono text-[14px]">
      {TREE.map((t, i) => (
        <motion.div
          key={i}
          className="flex items-center gap-1.5"
          style={{ paddingLeft: t.d * 18 }}
          animate={{ opacity: i <= n ? 1 : 0.18, x: i <= n ? 0 : -6 }}
          transition={{ duration: 0.35 }}
        >
          {t.dir ? <FolderSimple size={15} className="text-if-lime" /> : <FileText size={15} className="text-white/80" />}
          <span className={t.dir ? "text-white" : "text-white/80"}>{t.n}</span>
        </motion.div>
      ))}
    </div>
  );
}

const SPACE = [
  [1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0],
  [1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

function SpaceViz() {
  const k = useStep(SPACE.length, 1500, 1200);
  const map = SPACE[k];
  const used = map.reduce((a, b) => a + b, 0);
  return (
    <div className="flex items-center gap-5">
      <div className="grid flex-1 grid-cols-8 gap-[5px]">
        {map.map((b, i) => (
          <motion.span
            key={i}
            className="h-[22px] rounded-[4px]"
            animate={{ backgroundColor: b ? "rgba(47,158,65,.9)" : "rgba(255,255,255,.07)" }}
            transition={{ duration: 0.35, delay: i * 0.012 }}
          />
        ))}
      </div>
      <div className="text-right">
        <div className="font-display text-[34px] font-bold leading-none">
          <AnimatedNumber value={Math.round((used / map.length) * 100)} suffix="%" />
        </div>
        <div className="mt-1 text-[14px] text-white/75">ocupado</div>
      </div>
    </div>
  );
}

const META_ROWS = [
  ["nome", "seminario.pdf"],
  ["tamanho", "2,4 MB"],
  ["criado", "05/11/2026"],
  ["permissões", "rw-r--r--"],
];

function MetaViz() {
  const a = useStep(META_ROWS.length, 1100, 1200);
  return (
    <div className="flex flex-col gap-1 font-mono text-[14px]">
      {META_ROWS.map(([k, v], i) => (
        <div
          key={k}
          className={cn(
            "flex justify-between rounded-md px-2.5 py-[3px] transition-colors duration-300",
            i === a ? "bg-if-green/25 text-white" : "text-white/75",
          )}
        >
          <span className={i === a ? "text-if-lime" : "text-white/60"}>{k}</span>
          <span>{v}</span>
        </div>
      ))}
    </div>
  );
}

const PERMS = [
  { who: "dono", bits: "rw-", ok: [true, true, false] },
  { who: "grupo", bits: "r--", ok: [true, false, false] },
  { who: "outros", bits: "r--", ok: [true, false, false] },
];

function AccessViz() {
  const g = useStep(PERMS.length, 1400, 1200);
  const p = PERMS[g];
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 font-mono text-[22px] font-semibold tracking-wider">
        {PERMS.map((x, i) => (
          <span
            key={x.who}
            className={cn(
              "rounded-lg px-2 py-0.5 transition-colors duration-300",
              i === g ? "bg-if-green text-white" : "bg-white/6 text-white/60",
            )}
          >
            {x.bits}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-3 text-[15px]">
        <span className="w-[62px] font-semibold text-white">{p.who}</span>
        {["ler", "gravar", "executar"].map((op, i) => (
          <span key={op} className={cn("flex items-center gap-1", p.ok[i] ? "text-if-lime" : "text-if-red-soft")}>
            {p.ok[i] ? <Check size={15} weight="bold" /> : <X size={15} weight="bold" />}
            {op}
          </span>
        ))}
      </div>
    </div>
  );
}

const OPS: { icon: Icon; op: string; file: string; tone: string }[] = [
  { icon: Eye, op: "read", file: "notas.txt", tone: "text-if-lime" },
  { icon: PencilSimple, op: "write", file: "trabalho.odt", tone: "text-white" },
  { icon: Trash, op: "unlink", file: "temp.log", tone: "text-if-red-soft" },
  { icon: Eye, op: "read", file: "foto.jpg", tone: "text-if-lime" },
  { icon: PencilSimple, op: "write", file: "slides.html", tone: "text-white" },
];

function OpsViz() {
  const k = useStep(OPS.length, 1000, 1200);
  const rows = [0, 1, 2].map((j) => OPS[(k + j) % OPS.length]);
  return (
    <div className="relative flex h-[96px] flex-col gap-1.5 overflow-hidden font-mono text-[14px]">
      <AnimatePresence initial={false} mode="popLayout">
        {rows.map((r, j) => {
          const I = r.icon;
          return (
            <motion.div
              key={`${k}-${j}`}
              className={cn("flex items-center gap-2.5 rounded-md bg-white/[0.05] px-2.5 py-1", j === 0 && "bg-white/10")}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: j === 2 ? 0.55 : 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <I size={16} className={r.tone} />
              <span className={cn("w-[56px]", r.tone)}>{r.op}</span>
              <span className="text-white/85">{r.file}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

function RecoverViz() {
  const s = useStep(2, 2200, 1200); // 0 verificando, 1 ok
  const C = 2 * Math.PI * 30;
  return (
    <div className="flex items-center gap-5">
      <div className="relative h-[76px] w-[76px]">
        <svg viewBox="0 0 76 76" className="absolute inset-0 -rotate-90">
          <circle cx="38" cy="38" r="30" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="7" />
          <motion.circle
            cx="38"
            cy="38"
            r="30"
            fill="none"
            stroke="white"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={C}
            initial={{ strokeDashoffset: C }}
            animate={{ strokeDashoffset: s ? 0 : [C, C * 0.1] }}
            transition={{ duration: s ? 0.3 : 2, ease: "easeInOut" }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center">
          {s ? <SealCheck size={30} weight="fill" /> : <span className="font-mono text-[14px]">fsck</span>}
        </span>
      </div>
      <div className="text-[16px] leading-snug">
        <div className="font-semibold">{s ? "Sistema consistente" : "Verificando estruturas…"}</div>
        <div className="text-white/85">{s ? "journal reaplicado" : "relendo o journal"}</div>
      </div>
    </div>
  );
}

/* ───────────────────────── slide ───────────────────────── */

const DUTIES: { icon: Icon; t: string; d: string; viz: ReactNode }[] = [
  { icon: TreeStructure, t: "Organização", d: "Arquivos e diretórios em hierarquia", viz: <TreeViz /> },
  { icon: ChartPieSlice, t: "Espaço livre e ocupado", d: "Saber quais blocos estão disponíveis", viz: <SpaceViz /> },
  { icon: TagIcon, t: "Metadados", d: "Nome, tamanho, data de criação, permissões", viz: <MetaViz /> },
  { icon: Key, t: "Controle de acesso", d: "Quem pode ler, gravar ou executar", viz: <AccessViz /> },
  { icon: PencilSimple, t: "Leitura, gravação e exclusão", d: "Todas as operações passam por ele", viz: <OpsViz /> },
  { icon: Lifebuoy, t: "Consistência após falhas", d: "Recuperar a integridade depois de um erro", viz: <RecoverViz /> },
];

export function Duties() {
  return (
    <div className="grain relative h-full w-full overflow-hidden bg-ink text-white">
      <Glow variant="a" />
      <div className="grid-lines absolute inset-0 opacity-40" />
      <div className="relative px-14 pt-[120px]">
        <div className="flex items-end justify-between">
          <div>
            <Reveal>
              <Tag>01 · Responsabilidades</Tag>
            </Reveal>
            <h2 className="mt-5 font-display text-[64px] font-bold leading-[0.95] tracking-[-0.045em]">
              <SplitWords text="O que um filesystem *faz*" />
            </h2>
          </div>
          <Reveal delay={0.4} className="mb-2 max-w-[400px] text-right text-[17px] leading-snug text-white/75">
            Seis tarefas que todo sistema de arquivos precisa cumprir — cada um à sua maneira.
          </Reveal>
        </div>

        <div className="mt-7 grid grid-cols-3 gap-4">
          {DUTIES.map((d, i) => {
            const hero = i === 5;
            return (
              <motion.div
                key={d.t}
                className={cn(
                  "relative flex h-[262px] flex-col overflow-hidden rounded-3xl p-6",
                  hero
                    ? "bg-gradient-to-br from-if-green to-if-green-dark shadow-[0_30px_60px_-25px_rgba(47,158,65,.7)]"
                    : "border border-white/10 bg-white/[0.045] backdrop-blur",
                )}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: BASE_DELAY + 0.2 + i * 0.08, duration: 0.8, ease: EASE }}
              >
                <div
                  className={cn(
                    "flex h-[126px] items-center rounded-2xl px-4",
                    hero ? "bg-black/15" : "bg-black/30 ring-1 ring-inset ring-white/[0.06]",
                  )}
                >
                  <div className="w-full">{d.viz}</div>
                </div>
                <div className="mt-auto flex items-start gap-3.5">
                  <IconTile icon={d.icon} tone={hero ? "solid" : "green"} size="sm" />
                  <div className="min-w-0">
                    <div className="text-[22px] font-semibold leading-tight tracking-tight">{d.t}</div>
                    <div className={cn("mt-1 text-[16px] leading-snug", hero ? "text-white/90" : "text-white/75")}>{d.d}</div>
                  </div>
                  <span className={cn("ml-auto font-mono text-[14px]", hero ? "text-white/80" : "text-white/55")}>0{i + 1}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
