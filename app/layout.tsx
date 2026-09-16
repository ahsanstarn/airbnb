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
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.jpg' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-icon.jpg' },
      { url: '/favicon.jpg' }
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-icon.jpg" />
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

