import type { Metadata } from "next";
import "./globals.css";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { ThemeProvider } from "@/lib/theme-context";
import { LanguageProvider } from "@/lib/lang-context";
import CustomCursor from "@/app/components/CustomCursor";
import SharedNav from "@/app/components/SharedNav";
import KlaraWidget from "@/app/components/KlaraWidget";
import MouseTilt from "@/app/components/MouseTilt";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kaya.ge — Discover Georgia",
  description: "Phase 1 foundation for Kaya.ge: curated offers, travel discovery, Muse and core platform routes.",
};

const themeScript = `(function(){try{var t=localStorage.getItem('kaya-theme');if(t!=='dark'&&t!=='light'){t='light';}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='light';}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${cormorant.variable} ${manrope.variable} is-guest`}>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <LanguageProvider>
          <ThemeProvider>
            <MouseTilt />
            <CustomCursor />
            <SharedNav />
            {children}
            <KlaraWidget />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

