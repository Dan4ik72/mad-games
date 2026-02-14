import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import { Suspense } from "react";
import Script from "next/script";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import YandexMetrika from "@/components/YandexMetrika";

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
  metadataBase: new URL("https://mad-games.ru"),
  title: {
    default: "MAD GAMES — Играй онлайн бесплатно",
    template: "%s | MAD GAMES",
  },
  description:
    "Каталог бесплатных онлайн игр. Играй прямо в браузере без установки!",
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "MAD GAMES — Играй онлайн бесплатно",
    description:
      "Каталог бесплатных онлайн игр. Играй прямо в браузере без установки!",
    url: "/",
    siteName: "MAD GAMES",
    type: "website",
    locale: "ru_RU",
  },
  twitter: {
    card: "summary_large_image",
    title: "MAD GAMES — Играй онлайн бесплатно",
    description:
      "Каталог бесплатных онлайн игр. Играй прямо в браузере без установки!",
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
        {/* Yandex.Metrika counter */}
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=106789020', 'ym');

            ym(106789020, 'init', {
              ssr:true,
              webvisor:true,
              clickmap:true,
              ecommerce:"dataLayer",
              referrer: document.referrer,
              url: location.href,
              accurateTrackBounce:true,
              trackLinks:true
            });
          `}
        </Script>
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/106789020"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>

        {/* SPA page view tracker */}
        <Suspense fallback={null}>
          <YandexMetrika />
        </Suspense>

        <Header />
        <Sidebar />
        <main className="relative z-10 min-h-screen pt-16 pl-14 md:pl-64 transition-[padding] duration-300">
          {children}
        </main>
        <Footer className="pl-14 md:pl-64 transition-[padding] duration-300" />
      </body>
    </html>
  );
}
