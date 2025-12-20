import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Moneta AI | Intelligent Pricing Analyst",
  description: "Make confident, data-driven pricing decisions with AI-powered analysis, simulations, and explainable recommendations.",
  keywords: ["pricing analyst", "AI pricing", "revenue optimization", "pricing intelligence", "pricing strategy", "machine learning", "price simulation", "enterprise pricing"],
  authors: [{ name: "Moneta AI" }],
  creator: "Moneta AI",
  publisher: "Moneta AI",
  metadataBase: new URL("https://moneta-ai-gamma.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://moneta-ai-gamma.vercel.app",
    title: "Moneta AI | Intelligent Pricing Analyst",
    description: "Make confident, data-driven pricing decisions with AI-powered analysis, simulations, and explainable recommendations.",
    siteName: "Moneta AI",
    images: [
      {
        url: "/screenshot.png",
        width: 1200,
        height: 630,
        alt: "Moneta AI - Intelligent Pricing Analyst",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Moneta AI | Intelligent Pricing Analyst",
    description: "Make confident, data-driven pricing decisions with AI-powered analysis, simulations, and explainable recommendations.",
    images: ["/screenshot.png"],
    creator: "@monetaai",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#010203] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
