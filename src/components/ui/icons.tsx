"use client";

/**
 * Ícones da apresentação.
 *
 * - Estáticos: lucide-react (https://lucide.dev), traço de 2px.
 * - Animados: lucide-animated (https://lucide-animated.com), mesmo desenho do
 *   Lucide, animados com `motion`. Os arquivos ficam em components/icons/animated.
 *
 * Regra de uso: ícone só onde carrega significado (navegação, estado, ação).
 * Nada de ícone decorativo ao lado de todo título ou rótulo.
 */
import {
  useEffect,
  useRef,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type RefAttributes,
} from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/meta";

export { Camera, FileText, Folder, Minus, Pencil, Trash2, X, Eye, Film } from "lucide-react";

export { ArrowLeftIcon } from "@/components/icons/animated/arrow-left";
export { ArrowRightIcon } from "@/components/icons/animated/arrow-right";
export { BadgeAlertIcon } from "@/components/icons/animated/badge-alert";
export { CheckIcon } from "@/components/icons/animated/check";
export { CircleCheckIcon } from "@/components/icons/animated/circle-check";
export { LockKeyholeIcon } from "@/components/icons/animated/lock-keyhole";
export { LockKeyholeOpenIcon } from "@/components/icons/animated/lock-keyhole-open";
export { Maximize2Icon } from "@/components/icons/animated/maximize-2";
export { RotateCCWIcon } from "@/components/icons/animated/rotate-ccw";
export { ShieldCheckIcon } from "@/components/icons/animated/shield-check";
export { ZapOffIcon } from "@/components/icons/animated/zap-off";

type Handle = { startAnimation: () => void; stopAnimation: () => void };
export type AnimatedIcon = ForwardRefExoticComponent<
  HTMLAttributes<HTMLDivElement> & { size?: number } & RefAttributes<Handle>
>;

/**
 * Dispara a animação do ícone:
 * - ao montar (após `delay` s);
 * - sempre que `trigger` mudar;
 * - em loop a cada `every` ms, se informado;
 * - e ao passar o mouse.
 */
export function Anim({
  icon: I,
  size = 22,
  delay = 0,
  every,
  trigger,
  className,
}: {
  icon: AnimatedIcon;
  size?: number;
  delay?: number;
  every?: number;
  trigger?: unknown;
  className?: string;
}) {
  const ref = useRef<Handle>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => ref.current?.startAnimation(), delay * 1000);
    const id = every ? setInterval(() => ref.current?.startAnimation(), every) : undefined;
    return () => {
      clearTimeout(t);
      if (id) clearInterval(id);
    };
  }, [reduce, delay, every, trigger]);

  return (
    <I
      ref={ref}
      size={size}
      className={cn("inline-flex shrink-0 items-center justify-center", className)}
      onMouseEnter={() => ref.current?.startAnimation()}
    />
  );
}
