import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ficha Lucrativa — Decida o seu lucro em cada prato.",
  description:
    "Monte a ficha técnica e descubra o preço certo do seu prato pelo WhatsApp. Sem planilha, sem consultor caro.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
