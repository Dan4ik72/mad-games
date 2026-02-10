import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "MAD GAMES — Играй онлайн бесплатно",
  description:
    "Каталог бесплатных онлайн игр. Играй прямо в браузере без установки!",
  openGraph: {
    title: "MAD GAMES — Играй онлайн бесплатно",
    description:
      "Каталог бесплатных онлайн игр. Играй прямо в браузере без установки!",
    siteName: "MAD GAMES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${inter.variable} ${nunito.variable} antialiased ambient-bg noise-overlay`}
      >
        <Header />
        <main className="relative z-10 min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
