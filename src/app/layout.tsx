import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Filesystems Reais · Sistemas Operacionais · IFPB",
  description:
    "Apresentação sobre sistemas de arquivos reais (NTFS, ext4, FAT32, exFAT, APFS, Btrfs) — Sistemas Operacionais, ADS, IFPB.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${grotesk.variable} ${jetbrains.variable} h-full antialiased`}>
      <body className="h-full">{children}</body>
    </html>
  );
}
