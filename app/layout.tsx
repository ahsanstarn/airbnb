import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kaya.ge — Georgia's All-in-One Travel & Services Marketplace",
  description: "Discover Georgia like a local. Book hotels, restaurants, tours, car rentals, and unique experiences across Georgia. Powered by AI travel planning.",
  keywords: "Georgia travel, Tbilisi hotels, Georgian tours, Batumi restaurants, car rental Georgia, travel marketplace",
  openGraph: {
    title: "Kaya.ge — Discover Georgia",
    description: "Georgia's premier travel and services marketplace",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
