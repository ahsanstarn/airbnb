import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Cormorant_Garamond, Manrope, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "@/lib/theme-context";
import { LanguageProvider } from "@/lib/lang-context";
import SharedNav from "@/app/components/SharedNav";
import MobileBottomNav from "@/app/components/MobileBottomNav";
import MouseTilt from "@/app/components/MouseTilt";
import PageTransition from "@/app/components/PageTransition";


const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0B132B" },
  ],
};

export const metadata: Metadata = {
  title: "Kaya.ge — Discover Georgia",
  description: "Georgia travel platform, boutique stays, curated experiences, and business suite.",
  manifest: "/site.webmanifest?v=4",
  icons: {
    icon: [
      { url: '/favicon.svg?v=4', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png?v=4', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png?v=4', sizes: '16x16', type: 'image/png' },
      { url: '/icon.png?v=4', sizes: '192x192', type: 'image/png' },
      { url: '/favicon.ico?v=4' },
    ],
    shortcut: '/favicon.ico?v=4',
    apple: [
      { url: '/apple-touch-icon.png?v=4', sizes: '180x180', type: 'image/png' },
    ],
  },
};

const themeScript = `(function(){try{var t=localStorage.getItem('kaya-theme');if(t!=='dark'&&t!=='light'){t='light';}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='light';}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=4" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=4" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=4" />
        <link rel="icon" href="/favicon.ico?v=4" sizes="any" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=4" />
        <link rel="manifest" href="/site.webmanifest?v=4" />
      </head>
      <body className={`${cormorant.variable} ${manrope.variable} ${playfair.variable} is-guest`}>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <LanguageProvider>
          <ThemeProvider>
            <MouseTilt />
            <SharedNav />
            <PageTransition>
              {children}
            </PageTransition>

            <MobileBottomNav />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

