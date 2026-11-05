"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/meta";

/** Fundo escuro com brilhos verde/vermelho que derivam lentamente. */
export function Glow({
  variant = "a",
  className,
}: {
  variant?: "a" | "b" | "c" | "red";
  className?: string;
}) {
  const reduce = useReducedMotion();
  const blobs: Record<string, { c: string; x: string; y: string; s: number }[]> = {
    a: [
      { c: "rgba(50,160,65,.55)", x: "-10%", y: "55%", s: 900 },
      { c: "rgba(27,107,40,.6)", x: "60%", y: "-30%", s: 800 },
      { c: "rgba(200,25,30,.18)", x: "85%", y: "70%", s: 600 },
    ],
    b: [
      { c: "rgba(50,160,65,.45)", x: "55%", y: "40%", s: 1000 },
      { c: "rgba(13,58,21,.9)", x: "-15%", y: "-20%", s: 800 },
    ],
    c: [
      { c: "rgba(50,160,65,.4)", x: "70%", y: "-25%", s: 900 },
      { c: "rgba(126,224,140,.15)", x: "-10%", y: "70%", s: 700 },
    ],
    red: [
      { c: "rgba(200,25,30,.35)", x: "60%", y: "-20%", s: 900 },
      { c: "rgba(50,160,65,.35)", x: "-10%", y: "60%", s: 800 },
    ],
  };
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {blobs[variant].map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: b.x,
            top: b.y,
            width: b.s,
            height: b.s,
            background: `radial-gradient(circle, ${b.c} 0%, transparent 65%)`,
          }}
          animate={reduce ? undefined : { x: [0, 60, -40, 0], y: [0, -40, 30, 0], scale: [1, 1.08, 0.96, 1] }}
          transition={{ duration: 18 + i * 4, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/**
 * Mosaico de "blocos de disco" piscando — canvas.
 * focus: ponto (0–1) onde a densidade é maior.
 */
export function PixelField({
  className,
  focus = { x: 0.8, y: 0.6 },
  radius = 0.55,
  cell = 18,
  gap = 3,
  rgb = "50,160,65",
  accentRgb = "126,224,140",
  intensity = 1,
}: {
  className?: string;
  focus?: { x: number; y: number };
  radius?: number;
  cell?: number;
  gap?: number;
  rgb?: string;
  accentRgb?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let w = 0;
    let h = 0;
    let cells: { x: number; y: number; base: number; ph: number; sp: number; acc: boolean }[] = [];
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const born = performance.now();

    const build = () => {
      const r = canvas.getBoundingClientRect();
      // getBoundingClientRect inclui o scale do palco; usamos o tamanho de layout
      w = canvas.offsetWidth || r.width;
      h = canvas.offsetHeight || r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cells = [];
      const step = cell + gap;
      const diag = Math.hypot(w, h);
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const d = Math.hypot(x - focus.x * w, y - focus.y * h) / diag;
          const fall = Math.max(0, 1 - d / radius);
          const base = Math.pow(fall, 1.6) * (0.35 + Math.random() * 0.65);
          if (base < 0.02) continue;
          cells.push({
            x,
            y,
            base,
            ph: Math.random() * Math.PI * 2,
            sp: 0.4 + Math.random() * 1.6,
            acc: Math.random() < 0.04,
          });
        }
      }
    };

    let last = 0;
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last < 33) return; // ~30fps
      last = t;
      const s = (t - born) / 1000;
      const intro = Math.min(1, s / 1.4);
      ctx.clearRect(0, 0, w, h);
      for (const c of cells) {
        // revelação diagonal na entrada
        const reveal = Math.min(1, Math.max(0, intro * 2.2 - (c.x / w) * 0.6 - (c.y / h) * 0.6));
        if (reveal <= 0) continue;
        const flick = reduce ? 0.8 : 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(s * c.sp + c.ph));
        const a = c.base * flick * reveal * intensity;
        if (a < 0.015) continue;
        ctx.fillStyle = `rgba(${c.acc ? accentRgb : rgb},${Math.min(1, a)})`;
        ctx.fillRect(c.x, c.y, cell, cell);
      }
    };

    build();
    raf = requestAnimationFrame(draw);
    const ro = new ResizeObserver(build);
    ro.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [focus.x, focus.y, radius, cell, gap, rgb, accentRgb, intensity, reduce]);

  return <canvas ref={ref} className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} />;
}

/** Cubo 3D de voxels (blocos) girando. */
export function VoxelCube({ size = 3, unit = 64, className }: { size?: number; unit?: number; className?: string }) {
  const half = (size * unit) / 2;
  const voxels = buildVoxels(size);

  const faces = [
    { t: `translateZ(${unit / 2}px)`, c: "rgba(50,160,65,.85)" },
    { t: `rotateY(180deg) translateZ(${unit / 2}px)`, c: "rgba(27,107,40,.85)" },
    { t: `rotateY(90deg) translateZ(${unit / 2}px)`, c: "rgba(27,107,40,.9)" },
    { t: `rotateY(-90deg) translateZ(${unit / 2}px)`, c: "rgba(40,130,52,.9)" },
    { t: `rotateX(90deg) translateZ(${unit / 2}px)`, c: "rgba(126,224,140,.9)" },
    { t: `rotateX(-90deg) translateZ(${unit / 2}px)`, c: "rgba(13,58,21,.9)" },
  ];

  return (
    <div className={cn("voxel-scene", className)} style={{ width: size * unit * 1.8, height: size * unit * 1.8 }}>
      <div className="relative h-full w-full">
        <div className="voxel-rotor absolute left-1/2 top-1/2" style={{ width: 0, height: 0 }}>
          {voxels.map((v, i) => {
            const accent = v.pop && i % 3 === 0;
            return (
              <div
                key={i}
                className={cn("absolute", v.pop && "voxel-pop")}
                style={
                  {
                    width: unit,
                    height: unit,
                    left: -unit / 2,
                    top: -unit / 2,
                    transform: `translate3d(${v.x * unit - half + unit / 2}px, ${v.y * unit - half + unit / 2}px, ${
                      v.z * unit - half + unit / 2
                    }px)`,
                    animationDelay: `${v.delay}s`,
                    "--pop-x": `${(v.x - 1) * unit * 0.6}px`,
                    "--pop-y": `${(v.y - 1) * unit * 0.6}px`,
                    "--pop-z": `${(v.z - 1) * unit * 0.6}px`,
                  } as React.CSSProperties
                }
              >
                {faces.map((f, fi) => (
                  <div
                    key={fi}
                    className="absolute inset-0 border border-white/10"
                    style={{
                      transform: f.t,
                      background: accent ? (fi === 4 ? "rgba(255,90,95,.95)" : "rgba(200,25,30,.9)") : f.c,
                      backfaceVisibility: "hidden",
                    }}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Geração determinística (mesma no servidor e no cliente). */
function buildVoxels(size: number) {
  const voxels: { x: number; y: number; z: number; pop: boolean; delay: number }[] = [];
  let seed = 7;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let x = 0; x < size; x++)
    for (let y = 0; y < size; y++)
      for (let z = 0; z < size; z++) {
        const r = rnd();
        if (r < 0.12) continue; // buracos = blocos livres
        voxels.push({ x, y, z, pop: r > 0.82, delay: rnd() * 6 });
      }
  return voxels;
}

/** Escurece a base do slide para manter legível o que fica perto do rodapé. */
export function BottomShade({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 h-[300px] bg-gradient-to-t from-black/85 via-black/45 to-transparent",
        className,
      )}
    />
  );
}
