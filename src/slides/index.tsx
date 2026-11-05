"use client";

import { motion } from "motion/react";
import {
  AppleLogo,
  Camera,
  DeviceMobile,
  DeviceTablet,
  HardDrive,
  HardDrives,
  Lightning,
  LinuxLogo,
  Television,
  Usb,
  WindowsLogo,
} from "@/components/ui/icons";
import { BASE_DELAY, META, cn } from "@/lib/meta";
import { BottomShade, Glow, PixelField, VoxelCube } from "@/components/ui/backgrounds";
import { CountUp, Parallax, Reveal, SplitWords, Tag, Typewriter } from "@/components/ui/motion";
import { LiveDot, Ticker } from "@/components/ui/live";
import { useStep } from "@/components/visuals/shared";
import { DiskGrid } from "@/components/visuals/DiskGrid";
import { JournalDemo } from "@/components/visuals/Journal";
import { ApfsVisual, BtrfsVisual, CopyDemo, Ext4Visual, FatChain, NtfsVisual } from "@/components/visuals/FsVisuals";
import type { SlideDef } from "@/components/deck/context";
import { FsSlide, type FsInfo } from "./FsSlide";
import { Duties } from "./Duties";
import { Comparison } from "./Comparison";
import { Importance } from "./Importance";
import { Quiz } from "./Quiz";
import { CourseStrip, TeamPanel } from "./People";

/* ═══════════════════════════ 01 · CAPA ═══════════════════════════ */

function Cover() {
  return (
    <div className="grain relative h-full w-full overflow-hidden bg-ink text-white">
      <Glow variant="a" />
      <Parallax depth={-24} className="absolute inset-0">
        <PixelField focus={{ x: 0.95, y: 0.8 }} radius={0.75} cell={20} />
      </Parallax>
      <div className="grid-lines absolute inset-0 opacity-60" />
      {/* scanner */}
      <div className="animate-scan pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-transparent via-if-lime/[0.06] to-transparent" />

      <Parallax depth={46} className="absolute right-[40px] top-[300px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.4, y: 120 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.8, delay: BASE_DELAY, ease: [0.16, 1, 0.3, 1] }}
        >
          <VoxelCube size={3} unit={48} />
        </motion.div>
      </Parallax>

      <BottomShade />

      <div className="relative flex h-full flex-col px-14 pb-[110px] pt-[120px]">
        <div>
          <CourseStrip />
        </div>

        <h1 className="mt-6 font-display font-bold leading-[0.84] tracking-[-0.06em]">
          <span className="block text-[200px]">
            <SplitWords text="Filesystems" delay={0.05} stagger={0} />
          </span>
          <span className="flex items-end gap-10 pl-[230px] text-[200px]">
            <SplitWords text="*reais*" delay={0.2} />
            <span className="mb-9 flex flex-col gap-4 font-mono text-[16px] font-normal leading-relaxed tracking-normal text-white/80">
              <DiskBar />
              <Reveal delay={0.9} className="max-w-[330px]">
                Como NTFS, ext4, FAT32, exFAT, APFS e Btrfs organizam os dados no disco.
              </Reveal>
            </span>
          </span>
        </h1>

        <div className="mt-auto flex items-end justify-between">
          <TeamPanel delay={1.1} />

          <Reveal delay={1.2} className="w-[430px] overflow-hidden rounded-2xl border border-white/10 bg-black/50 backdrop-blur-md">
            <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-if-red/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-if-green/80" />
              <span className="ml-2 font-mono text-[13px] text-white/60">aluno@ifpb: ~</span>
            </div>
            <Typewriter
              delay={1.5}
              className="px-4 py-3 font-mono text-[15px] leading-[1.7] text-white/80"
              lines={[
                { text: "$ lsblk -f", className: "text-if-lime" },
                { text: "sda1  ntfs   Windows    C:\\" },
                { text: "sda2  ext4   ubuntu     /" },
                { text: "sdb1  exfat  PENDRIVE   /media" },
              ]}
            />
            <div className="flex items-center gap-3 border-t border-white/10 px-4 py-2.5 font-mono text-[14px] text-white/75">
              <LiveDot />
              <Ticker start={1284392} perSecond={2900} className="text-white" />
              <span>blocos gravados</span>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

/** Barra de blocos sendo "gravada" sob o título. */
function DiskBar() {
  const n = 22;
  return (
    <span className="flex gap-[5px]">
      {Array.from({ length: n }).map((_, i) => (
        <motion.span
          key={i}
          className={cn("h-[14px] w-[10px] rounded-[2px]", i === 15 ? "bg-if-red" : "bg-if-green")}
          initial={{ opacity: 0.08 }}
          animate={{ opacity: i === n - 1 ? [0.15, 1, 0.15] : 1 }}
          transition={
            i === n - 1
              ? { delay: BASE_DELAY + 0.5 + n * 0.045, duration: 1.1, repeat: Infinity }
              : { delay: BASE_DELAY + 0.5 + i * 0.045, duration: 0.15 }
          }
        />
      ))}
    </span>
  );
}


/* ═══════════════════════════ 04 · COMO FUNCIONAM ═══════════════════════════ */

function HowItWorks() {
  return (
    <div className="grain relative h-full w-full overflow-hidden bg-ink text-white">
      <Glow variant="c" />
      <div className="grid-lines absolute inset-0 opacity-40" />
      <div className="relative grid h-full grid-cols-[500px_1fr] gap-14 px-14 pb-[110px] pt-[120px]">
        <div className="flex flex-col">
          <Reveal>
            <Tag>01 · Como funcionam</Tag>
          </Reveal>
          <h2 className="mt-5 font-display text-[64px] font-bold leading-[0.95] tracking-[-0.045em]">
            <SplitWords text={"Dados em *blocos*,\ncontrole em\n*metadados*"} />
          </h2>
          <Reveal delay={0.5} className="mt-5 text-[19px] leading-[1.5] text-white/80">
            O disco é dividido em <b className="text-white">blocos</b> de tamanho fixo. Um arquivo ocupa um ou mais blocos —
            nem sempre vizinhos. Os <b className="text-white">metadados</b> dizem onde cada pedaço está, quem é o dono e o que
            pode ser feito com ele.
          </Reveal>
          <div className="mt-auto grid grid-cols-2 gap-3">
            <Reveal delay={0.8} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="text-[42px] font-bold tracking-tight text-if-lime">
                <CountUp to={4} delay={0.8} /> KB
              </div>
              <div className="mt-1 text-[15px] text-white/75">bloco típico (ext4 / NTFS)</div>
            </Reveal>
            <Reveal delay={0.9} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="text-[42px] font-bold tracking-tight">
                <CountUp to={262144} delay={0.9} duration={2.2} />
              </div>
              <div className="mt-1 text-[15px] text-white/75">blocos em 1 GB</div>
            </Reveal>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <DiskGrid />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════ 06 · JOURNALING ═══════════════════════════ */

function Journaling() {
  return (
    <div className="grain relative h-full w-full overflow-hidden bg-ink text-white">
      <Glow variant="red" />
      <div className="grid-lines absolute inset-0 opacity-40" />
      <div className="relative grid h-full grid-cols-[560px_1fr] gap-12 px-14 pb-[110px] pt-[120px]">
        <div className="flex flex-col">
          <Reveal>
            <Tag>01 · Conceito-chave</Tag>
          </Reveal>
          <h2 className="mt-5 font-display text-[64px] font-bold leading-[0.95] tracking-[-0.045em]">
            <SplitWords text="*Journaling*" />
          </h2>
          <Reveal delay={0.4} className="mt-5 text-[19px] leading-[1.5] text-white/80">
            Antes de alterar as estruturas do disco, o filesystem <b className="text-white">registra a alteração em um diário</b>.
            Se a energia cair no meio do caminho, basta reler o diário para{" "}
            <b className="text-if-lime">recuperar a consistência</b>.
          </Reveal>
          <Reveal delay={0.7} className="mt-auto flex items-center gap-4 rounded-2xl border border-if-red/40 bg-if-red/10 p-5">
            <Lightning className="shrink-0 text-if-red-soft" size={30} />
            <p className="text-[17px] leading-snug text-white/85">
              Sem journal, um desligamento inesperado pode exigir uma varredura completa do disco (fsck / chkdsk).
            </p>
          </Reveal>
        </div>
        <div className="flex flex-col justify-center">
          <JournalDemo />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════ 08–13 · FILESYSTEMS ═══════════════════════════ */

const FS: FsInfo[] = [
  {
    id: "ntfs",
    num: "01",
    name: "NTFS",
    full: "New Technology File System",
    env: "Windows",
    since: "1993",
    lead: "Sistema de arquivos padrão das versões modernas do Windows, em PCs pessoais e servidores.",
    features: [
      "Arquivos e volumes de grande capacidade",
      "Permissões de acesso para usuários e grupos",
      "Journaling para recuperar a consistência",
      "Criptografia (EFS) e compressão",
      "Controle de cotas de armazenamento",
    ],
    where: [
      { label: "PCs com Windows", icon: WindowsLogo },
      { label: "Servidores Windows", icon: HardDrives },
    ],
    visual: <NtfsVisual />,
  },
  {
    id: "ext4",
    num: "02",
    name: "ext4",
    full: "Fourth Extended Filesystem",
    env: "Linux",
    since: "2008",
    lead: "Um dos filesystems mais usados no Linux: bom equilíbrio entre desempenho e confiabilidade.",
    features: [
      "Suporte a arquivos e volumes grandes",
      "Journaling para proteger as estruturas",
      "Gerenciamento eficiente do espaço",
      "Extents para organizar a alocação",
      "Estável e com bom desempenho",
    ],
    where: [
      { label: "Ubuntu", icon: LinuxLogo },
      { label: "Debian", icon: LinuxLogo },
      { label: "Servidores Linux", icon: HardDrives },
    ],
    visual: <Ext4Visual />,
    glow: "c",
  },
  {
    id: "fat32",
    num: "03",
    name: "FAT32",
    full: "File Allocation Table 32",
    env: "Diversos sistemas",
    since: "1996",
    lead: "Antigo, mas ainda muito usado por funcionar em praticamente qualquer dispositivo.",
    features: [
      "Compatível com diversos sistemas operacionais",
      "Estrutura relativamente simples",
      "Frequente em dispositivos removíveis",
      "Limite de 4 GB por arquivo individual",
    ],
    where: [
      { label: "Pendrives", icon: Usb },
      { label: "Cartões de memória", icon: Camera },
      { label: "Consoles e TVs", icon: Television },
    ],
    visual: (
      <div className="flex flex-col gap-5">
        <CopyDemo fs="fat32" />
        <FatChain />
      </div>
    ),
    glow: "red",
  },
  {
    id: "exfat",
    num: "04",
    name: "exFAT",
    full: "Extended File Allocation Table",
    env: "Armazenamento externo",
    since: "2006",
    lead: "Criado para superar as limitações do FAT32, principalmente no armazenamento de arquivos grandes.",
    features: [
      "Arquivos maiores que 4 GB",
      "Ideal para mídias removíveis",
      "Compatível com Windows, macOS e Linux",
      "Estrutura simplificada em relação aos avançados",
    ],
    where: [
      { label: "Cartões SD", icon: Camera },
      { label: "Pendrives", icon: Usb },
      { label: "HDs/SSDs externos", icon: HardDrive },
    ],
    visual: <CopyDemo fs="exfat" />,
    glow: "b",
  },
  {
    id: "apfs",
    num: "05",
    name: "APFS",
    full: "Apple File System",
    env: "Apple",
    since: "2017",
    lead: "Desenvolvido pela Apple e otimizado para armazenamento flash e SSD.",
    features: [
      "Otimização para Flash / SSD",
      "Criptografia integrada",
      "Espaço compartilhado entre volumes",
      "Snapshots: capturas do estado dos dados",
      "Copy-on-Write: não sobrescreve o original",
    ],
    where: [
      { label: "Mac", icon: AppleLogo },
      { label: "iPhone", icon: DeviceMobile },
      { label: "iPad", icon: DeviceTablet },
    ],
    visual: <ApfsVisual />,
    glow: "c",
  },
  {
    id: "btrfs",
    num: "06",
    name: "Btrfs",
    full: "B-tree File System",
    env: "Linux",
    since: "2009",
    lead: "Filesystem avançado do ecossistema Linux, focado em gerenciamento e proteção dos dados.",
    features: [
      "Copy-on-Write",
      "Snapshots",
      "Integridade por checksums",
      "Compressão de dados",
      "Múltiplos dispositivos de armazenamento",
    ],
    where: [
      { label: "Fedora", icon: LinuxLogo },
      { label: "openSUSE", icon: LinuxLogo },
      { label: "NAS e servidores", icon: HardDrives },
    ],
    visual: <BtrfsVisual />,
    glow: "a",
  },
];

/* ═══════════════════════════ 16 · CONCLUSÃO ═══════════════════════════ */

function Conclusion() {
  const factors = ["Desempenho", "Segurança", "Compatibilidade", "Capacidade", "Finalidade"];
  const active = useStep(factors.length, 1300, 2600);
  return (
    <div className="grain relative h-full w-full overflow-hidden bg-ink text-white">
      <Glow variant="b" />
      <Parallax depth={-24} className="absolute inset-0">
        <PixelField focus={{ x: 0.5, y: 1.05 }} radius={0.6} cell={22} />
      </Parallax>
      <BottomShade />
      <div className="relative flex h-full flex-col px-14 pb-[110px] pt-[120px]">
        <Reveal>
          <Tag>05 · Conclusão</Tag>
        </Reveal>
        <h2 className="mt-5 max-w-[1400px] font-display text-[88px] font-bold leading-[0.95] tracking-[-0.05em]">
          <SplitWords
            text={"Não existe um sistema de arquivos *ideal* para *todas* as situações."}
            stagger={0.05}
          />
        </h2>
        <Reveal delay={1} className="mt-8 max-w-[900px] text-[21px] leading-snug text-white/80">
          Todos buscam armazenar, localizar, proteger e recuperar dados com eficiência — mas cada implementação tem
          vantagens e limitações que devem ser pesadas conforme o ambiente.
        </Reveal>
        <div className="mt-10 flex flex-wrap gap-3">
          {factors.map((f, i) => (
            <motion.span
              key={f}
              className={cn(
                "rounded-full border px-5 py-2.5 text-[19px] backdrop-blur transition-colors duration-500",
                i === active
                  ? "border-if-green bg-if-green text-white shadow-[0_10px_30px_-8px_rgba(47,158,65,.8)]"
                  : "border-if-green/40 bg-if-green/15 text-if-lime",
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: BASE_DELAY + 1.3 + i * 0.08, type: "spring", stiffness: 300, damping: 18 }}
            >
              {f}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════ 17 · OBRIGADO ═══════════════════════════ */

function Thanks() {
  return (
    <div className="grain relative h-full w-full overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-if-green-deep via-ink to-ink" />
      <Glow variant="a" />
      <Parallax depth={-24} className="absolute inset-0">
        <PixelField focus={{ x: 0.85, y: 0.35 }} radius={0.55} cell={20} />
      </Parallax>
      <Parallax depth={50} className="absolute right-[120px] top-[170px]">
        <VoxelCube size={3} unit={66} />
      </Parallax>
      <BottomShade />
      <div className="relative flex h-full flex-col px-14 pb-[110px] pt-[120px]">
        <Reveal>
          <Tag>Fim · {META.titulo}</Tag>
        </Reveal>
        <h2 className="mt-5 font-display text-[180px] font-bold leading-[0.85] tracking-[-0.06em]">
          <SplitWords text={"Obrigado!"} />
        </h2>
        <Reveal delay={0.5} className="mt-5 text-[36px] font-medium text-white/85">
          Perguntas?
        </Reveal>
        <div className="mt-auto flex items-end justify-between gap-6">
          <TeamPanel delay={0.8} />
          <CourseStrip delay={1} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════ REGISTRO ═══════════════════════════ */

export const SLIDES: SlideDef[] = [
  { id: "capa", section: "Início", title: "Capa", tone: "dark", render: () => <Cover /> },
  { id: "como", section: "Funcionamento", title: "Blocos e metadados", tone: "dark", render: () => <HowItWorks /> },
  { id: "responsabilidades", section: "Funcionamento", title: "Responsabilidades", tone: "dark", render: () => <Duties /> },
  { id: "journaling", section: "Funcionamento", title: "Journaling", tone: "dark", render: () => <Journaling /> },
  ...FS.map(
    (fs): SlideDef => ({ id: fs.id, section: "Exemplos", title: fs.name, tone: "dark", render: () => <FsSlide fs={fs} /> }),
  ),
  { id: "comparacao", section: "Comparação", title: "Lado a lado", tone: "light", render: () => <Comparison /> },
  { id: "importancia", section: "Conclusão", title: "A escolha importa", tone: "dark", render: () => <Importance /> },
  { id: "conclusao", section: "Conclusão", title: "Conclusão", tone: "dark", render: () => <Conclusion /> },
  { id: "quiz", section: "Conclusão", title: "Quiz", tone: "dark", render: () => <Quiz /> },
  { id: "obrigado", section: "Conclusão", title: "Obrigado", tone: "dark", render: () => <Thanks /> },
];

export const SECTIONS = ["Início", "Funcionamento", "Exemplos", "Comparação", "Conclusão"].map((label) => ({
  label,
  start: SLIDES.findIndex((s) => s.section === label),
}));
