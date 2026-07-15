import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "C1 Testspiel – Persönliches Lesetraining",
  description: "KI-generierte C1-Lesetexte, telc-nahe Übungen und persönlicher Wortschatz.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
