import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PublicChrome } from "@/components/layout/PublicChrome";
import { QueryProvider } from "@/providers/QueryProvider";
import { CartProvider } from "@/providers/CartProvider";
import { AmbientBackground } from "@/components/effects/AmbientBackground";
import { ParticleBackground } from "@/components/effects/ParticleBackground";
import { MouseGlow } from "@/components/effects/MouseGlow";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BMW Club Uganda | Driven by Passion",
    template: "%s | BMW Club Uganda",
  },
  description:
    "The official digital home for BMW enthusiasts across Uganda. Connect, showcase your vehicle, discover events, explore driving routes, and join Uganda's premier BMW community.",
  keywords: [
    "BMW Club Uganda",
    "BMW enthusiasts",
    "Uganda car club",
    "BMW owners",
    "driving routes Uganda",
    "BMW events",
  ],
  authors: [{ name: "BMW Club Uganda" }],
  openGraph: {
    title: "BMW Club Uganda",
    description: "Driven by Passion. United by Performance. Built for Uganda.",
    type: "website",
    locale: "en_UG",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/club-logo.jpeg", sizes: "512x512", type: "image/jpeg" },
    ],
    apple: "/images/club-logo.jpeg",
    shortcut: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#0E1E36",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="min-h-screen w-full max-w-full overflow-x-clip bg-background text-foreground antialiased">
        <QueryProvider>
          <CartProvider>
            <AmbientBackground />
            <ParticleBackground />
            <MouseGlow />
            <PublicChrome>{children}</PublicChrome>
          </CartProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
