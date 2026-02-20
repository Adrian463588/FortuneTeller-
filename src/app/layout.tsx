import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fortune Teller — Mystical Divination",
  description:
    "Discover your fate through ancient divination systems: Saju Palja, BaZi, Western Zodiac, Javanese Weton & Neptu. Enter your name and birth date to reveal your destiny.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
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
      <body className="min-h-screen font-body antialiased">
        {/* Starfield background */}
        <Starfield />
        {/* Main Content */}
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}

function Starfield() {
  // Generate deterministic star positions
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    left: `${(i * 17 + 13) % 100}%`,
    top: `${(i * 23 + 7) % 100}%`,
    size: (i % 3) + 1,
    delay: `${(i * 0.3) % 5}s`,
    duration: `${2 + (i % 4)}s`,
  }));

  return (
    <div className="starfield">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}
      {/* Ambient orbs */}
      <div
        className="absolute w-96 h-96 rounded-full animate-float"
        style={{
          background:
            "radial-gradient(circle, rgba(155,89,182,0.05) 0%, transparent 70%)",
          top: "10%",
          left: "5%",
        }}
      />
      <div
        className="absolute w-80 h-80 rounded-full animate-float"
        style={{
          background:
            "radial-gradient(circle, rgba(0,229,255,0.04) 0%, transparent 70%)",
          bottom: "15%",
          right: "10%",
          animationDelay: "3s",
        }}
      />
      <div
        className="absolute w-64 h-64 rounded-full animate-float"
        style={{
          background:
            "radial-gradient(circle, rgba(212,168,83,0.04) 0%, transparent 70%)",
          top: "50%",
          left: "60%",
          animationDelay: "1.5s",
        }}
      />
    </div>
  );
}
