import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MBTI Real Scene - Discover Your True Self",
  description: "A revolutionary MBTI assessment that reveals your authentic personality through immersive behavioral scenarios, not self-idealizations.",
  keywords: ["MBTI", "personality test", "16 personalities", "psychology", "self-discovery"],
  authors: [{ name: "MBTI Real Scene" }],
  openGraph: {
    title: "MBTI Real Scene - Discover Your True Self",
    description: "Experience a revolutionary personality assessment with personalized scenarios and stunning 3D visuals.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <head>
        {/* Viewport with safe area support for mobile devices */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        {/* LXGW WenKai - Beautiful Chinese font */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/style.css"
        />
        {/* Noto Sans SC as fallback */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} antialiased bg-slate-950 text-white min-h-screen`}
        style={{
          fontFamily: locale === 'zh'
            ? '"LXGW WenKai", "Noto Sans SC", system-ui, sans-serif'
            : 'var(--font-inter), system-ui, sans-serif',
        }}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
