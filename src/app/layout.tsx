import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Sender.io - Ferramenta de Automação",
  description:
    "Automatize suas campanhas e mensagens de forma simples e eficiente.",
  openGraph: {
    title: "Sender.io - Automação de WhatsApp",
    description: "Automatize campanhas e mensagens.",
    url: "https://sender.io",
    siteName: "Sender.io",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sender.io",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} dark`}>
        <Toaster theme="dark" expand />
        {children}
      </body>
    </html>
  );
}
