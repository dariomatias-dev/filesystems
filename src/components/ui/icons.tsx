"use client";

/**
 * Ícones da apresentação: todos da biblioteca Phosphor (https://phosphoricons.com),
 * peso "duotone" por padrão (definido no IconContext do Deck). A camada de
 * preenchimento do duotone usa a cor atual com 20% de opacidade, então o ícone
 * herda o verde/vermelho do contêiner automaticamente.
 */
import type { ReactNode } from "react";
import { IconContext, type Icon as PhosphorIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/meta";

export {
  AppleLogo,
  ArrowCounterClockwise,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ArrowsClockwise,
  BookOpenText,
  Camera,
  ChartPieSlice,
  Check,
  ChalkboardTeacher,
  CheckCircle,
  ClipboardText,
  CircleNotch,
  CornersOut,
  Cpu,
  Database,
  Desktop,
  DeviceMobile,
  DeviceTablet,
  Eye,
  FileText,
  FileVideo,
  Folder,
  FolderSimple,
  Gauge,
  GraduationCap,
  HardDrive,
  HardDrives,
  Key,
  Lifebuoy,
  Lightning,
  LinuxLogo,
  ListChecks,
  LockSimple,
  LockSimpleOpen,
  Memory,
  Minus,
  PencilSimple,
  PuzzlePiece,
  QrCode,
  Ruler,
  ShieldCheck,
  ShieldWarning,
  SealCheck,
  Stack,
  Tag,
  Television,
  Trash,
  TreeStructure,
  Usb,
  Users,
  UsersThree,
  Warning,
  WindowsLogo,
  X,
  XCircle,
} from "@phosphor-icons/react";

export type Icon = PhosphorIcon;

export function IconProvider({ children }: { children: ReactNode }) {
  return <IconContext.Provider value={{ weight: "duotone", size: 22, color: "currentColor" }}>{children}</IconContext.Provider>;
}

/** Contêiner padrão de ícone: mesmo raio, tamanhos e tons em toda a apresentação. */
export function IconTile({
  icon: I,
  tone = "green",
  size = "md",
  className,
}: {
  icon: PhosphorIcon;
  tone?: "green" | "red" | "neutral" | "solid" | "light";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const box = { sm: "h-9 w-9 rounded-lg", md: "h-12 w-12 rounded-xl", lg: "h-16 w-16 rounded-2xl" }[size];
  const px = { sm: 18, md: 24, lg: 32 }[size];
  const t = {
    green: "bg-if-green/15 text-if-lime ring-1 ring-inset ring-if-green/30",
    red: "bg-if-red/15 text-if-red-soft ring-1 ring-inset ring-if-red/35",
    neutral: "bg-white/8 text-white/85 ring-1 ring-inset ring-white/12",
    solid: "bg-white/20 text-white ring-1 ring-inset ring-white/25",
    light: "bg-if-green/12 text-if-green-dark ring-1 ring-inset ring-if-green/25",
  }[tone];
  return (
    <span className={cn("inline-flex shrink-0 items-center justify-center", box, t, className)}>
      <I size={px} />
    </span>
  );
}
