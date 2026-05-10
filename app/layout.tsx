import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kaya.ge | Georgia's All-in-One Travel & Services Marketplace",
  description: "Discover Georgia like a local. Book hotels, restaurants, tours, car rentals, and unique experiences across Sakartvelo. Powered by KLARA AI travel planning.",
  keywords: "Georgia travel, Sakartvelo, Tbilisi hotels, Georgian tours, Batumi restaurants, car rental Georgia, Kaya.ge, travel marketplace, wine tours Georgia",
  openGraph: {
    title: "Kaya.ge — Discover Georgia",
    description: "Georgia's premier travel and services marketplace",
    type: "website",
    locale: "en_GE",
  },
};

import CustomCursor from "./components/CustomCursor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
