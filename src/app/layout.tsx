import type { Metadata, Viewport } from "next";
import "./globals.css";
import Footer from "@/components/Footer";
import FloatingNav from "@/components/FloatingNav";

export const metadata: Metadata = {
  title: "Fortune Teller — Mystical Divination",
  description:
    "Unveil your cosmic destiny through Saju Palja, BaZi, Western Zodiac, Javanese Primbon, and Feng Shui. A comprehensive, deterministic divination experience.",
  keywords: [
    "fortune teller",
    "astrology",
    "BaZi",
    "Saju Palja",
    "Weton",
    "Feng Shui",
    "divination",
    "horoscope",
    "Kua number",
    "Javanese Primbon",
  ],
  authors: [{ name: "Adrian Syah Abidin" }],
  manifest: "/manifest.json",
  icons: {
    // Modern browsers use SVG favicon
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    // Apple devices
    apple: [
      { url: "/icons/apple-touch-icon.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
    // PWA shortcut icon
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Fortune Teller — Mystical Divination",
    description:
      "Generate your personalized cosmic destiny reading using ancient wisdom traditions from China, Java, the West, and Feng Shui.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Fortune Teller — Mystical Divination",
    description:
      "Unveil your destiny through BaZi, Weton, Zodiac, and Feng Shui — all running client-side, database-free.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0613",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

function Starfield() {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: `${(i * 17.3) % 100}%`,
    y: `${(i * 23.7) % 100}%`,
    size: (i % 3) + 1,
    delay: (i * 0.15) % 4,
  }));

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full animate-twinkle"
          style={{
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
            backgroundColor: "rgba(212,168,83,0.4)",
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
      {/* Ambient orbs */}
      <div
        className="absolute w-96 h-96 rounded-full animate-floatOrb"
        style={{
          top: "10%",
          left: "5%",
          background: "radial-gradient(circle, rgba(155,89,182,0.06), transparent 70%)",
        }}
      />
      <div
        className="absolute w-80 h-80 rounded-full animate-floatOrb"
        style={{
          bottom: "15%",
          right: "10%",
          background: "radial-gradient(circle, rgba(0,229,255,0.04), transparent 70%)",
          animationDelay: "2s",
        }}
      />
      <div
        className="absolute w-72 h-72 rounded-full animate-floatOrb"
        style={{
          top: "50%",
          left: "40%",
          background: "radial-gradient(circle, rgba(212,168,83,0.04), transparent 70%)",
          animationDelay: "4s",
        }}
      />
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Font imports */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen font-body antialiased flex flex-col">
        <Starfield />
        <main className="relative z-10 flex-1">{children}</main>
        <FloatingNav />
        <Footer />
      </body>
    </html>
  );
}
