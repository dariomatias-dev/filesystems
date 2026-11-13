"use client";

import { QRCodeSVG } from "qrcode.react";
import { META } from "@/lib/meta";
import { Glow } from "@/components/ui/backgrounds";
import { Reveal, SplitWords, Tag } from "@/components/ui/motion";

/** Aceita o link normal do Google Forms e devolve as versões de embed e de compartilhamento. */
function formLinks(url: string) {
  if (!url) return null;
  try {
    const open = new URL(url);
    open.searchParams.delete("embedded");
    open.searchParams.delete("usp");
    const embed = new URL(open.toString());
    embed.searchParams.set("embedded", "true");
    return { open: open.toString(), embed: embed.toString() };
  } catch {
    return null;
  }
}

export function Quiz() {
  const links = formLinks(META.formUrl);

  return (
    <div className="grain relative h-full w-full overflow-hidden bg-ink text-white">
      <Glow variant="b" />
      <div className="grid-lines absolute inset-0 opacity-40" />
      <div className="relative grid h-full grid-cols-[480px_1fr] gap-12 px-14 pb-[110px] pt-[120px]">
        <div className="flex flex-col">
          <Reveal>
            <Tag>05 · Quiz</Tag>
          </Reveal>
          <h2 className="mt-5 font-display text-[64px] font-bold leading-[0.95] tracking-[-0.045em]">
            <SplitWords text={"Teste o que\nvocê *aprendeu*"} />
          </h2>
          <Reveal delay={0.4} className="mt-5 text-[19px] leading-snug text-white/80">
            Responda pelo celular: aponte a câmera para o QR code ou use o formulário ao lado.
          </Reveal>

          {links && (
            <Reveal delay={0.6} className="mt-auto flex items-center gap-6 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <div className="rounded-2xl bg-white p-3">
                <QRCodeSVG value={links.open} size={176} fgColor="#050a06" bgColor="#ffffff" level="M" />
              </div>
              <div>
                <div className="text-[13px] font-semibold uppercase tracking-[0.16em] text-if-lime">Pelo celular</div>
                <div className="mt-1.5 text-[22px] font-semibold leading-tight">Aponte a câmera para o código</div>
                <div className="mt-2 text-[15px] text-white/75">{META.formShortUrl || "Formulário Google"}</div>
              </div>
            </Reveal>
          )}
        </div>

        <Reveal
          delay={0.3}
          className="relative overflow-hidden rounded-3xl border border-white/12 bg-white shadow-[0_40px_80px_-30px_rgba(0,0,0,.8)]"
        >
          {links ? (
            <iframe src={links.embed} title="Formulário de perguntas" className="absolute inset-0 h-full w-full" loading="lazy">
              Carregando…
            </iframe>
          ) : (
            <div className="flex h-full items-center justify-center bg-ink-2 p-10 text-center text-[19px] text-white/80">
              Configure <code className="mx-1.5 rounded bg-white/10 px-1.5 font-mono">formUrl</code> em src/lib/meta.ts
            </div>
          )}
        </Reveal>
      </div>
    </div>
  );
}
