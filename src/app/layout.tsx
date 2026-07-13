import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { QueryProvider } from "@/providers/QueryProvider";
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
    icon: "/icon.jpeg",
    apple: "/icon.jpeg",
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
          <AmbientBackground />
          <ParticleBackground />
          <MouseGlow />
          <Navbar />
          <main className="relative z-10 w-full max-w-full overflow-x-clip">{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
