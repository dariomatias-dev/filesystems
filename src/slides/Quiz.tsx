"use client";

import { QRCodeSVG } from "qrcode.react";
import { BASE_DELAY, META } from "@/lib/meta";
import { Glow } from "@/components/ui/backgrounds";
import { Reveal, SplitWords, Tag } from "@/components/ui/motion";
import { ClipboardText, IconTile, ListChecks, QrCode } from "@/components/ui/icons";

/** Aceita o link normal do Google Forms e devolve as versões de embed e de compartilhamento. */
function formLinks(url: string) {
  if (!url) return null;
  try {
    const u = new URL(url);
    const open = new URL(u.toString());
    open.searchParams.delete("embedded");
    const embed = new URL(open.toString());
    embed.searchParams.set("embedded", "true");
    return { open: open.toString(), embed: embed.toString() };
  } catch {
    return null;
  }
}

export function Quiz() {
  const links = formLinks(META.formUrl);
  const shortLink = META.formShortUrl || links?.open.replace(/^https?:\/\//, "");

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

          <Reveal delay={0.6} className="mt-auto flex items-center gap-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <div className="rounded-2xl bg-white p-3">
              {links ? (
                <QRCodeSVG value={links.open} size={150} fgColor="#050a06" bgColor="#ffffff" level="M" />
              ) : (
                <div className="flex h-[150px] w-[150px] items-center justify-center text-ink/40">
                  <QrCode size={64} />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold uppercase tracking-[0.16em] text-if-lime">Acesse</div>
              <div className="mt-1 break-all text-[17px] font-medium leading-snug">{shortLink ?? "link do formulário"}</div>
              <div className="mt-2 text-[15px] text-white/70">Google Forms</div>
            </div>
          </Reveal>
        </div>

        <Reveal
          delay={BASE_DELAY * 0.6}
          className={`relative overflow-hidden rounded-3xl border border-white/12 shadow-[0_40px_80px_-30px_rgba(0,0,0,.8)] ${links ? "bg-white" : "bg-ink-2"}`}
        >
          {links ? (
            <iframe
              src={links.embed}
              title="Formulário de perguntas"
              className="absolute inset-0 h-full w-full"
              loading="lazy"
            >
              Carregando…
            </iframe>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 bg-ink-2 p-10 text-center">
              <IconTile icon={ClipboardText} size="lg" />
              <div className="text-[26px] font-semibold">Formulário ainda não configurado</div>
              <p className="max-w-[460px] text-[17px] leading-snug text-white/75">
                Cole o link do Google Forms em <code className="rounded bg-white/10 px-1.5 font-mono">formUrl</code>, no
                arquivo <code className="rounded bg-white/10 px-1.5 font-mono">src/lib/meta.ts</code>.
              </p>
              <div className="flex items-center gap-2 text-[15px] text-if-lime">
                <ListChecks size={20} /> O formulário aparece aqui e o QR code é gerado sozinho.
              </div>
            </div>
          )}
        </Reveal>
      </div>
    </div>
  );
}
