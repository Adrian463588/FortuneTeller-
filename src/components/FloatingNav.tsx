"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { href: "/", label: "Reading", icon: Home },
  { href: "/compatibility", label: "Match", icon: Heart },
  { href: "/dates", label: "Dates", icon: CalendarDays },
];

export default function FloatingNav() {
  const pathname = usePathname();

  return (
    <div
      className="z-50 flex justify-center"
      style={{
        position: "sticky",
        bottom: 0,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        pointerEvents: "none",
      }}
    >
      <motion.nav
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="flex items-center gap-1 rounded-2xl px-2 py-1.5 mb-3"
        style={{
          pointerEvents: "auto",
          background: "rgba(17,13,31,0.9)",
          border: "1px solid rgba(212,168,83,0.15)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
        }}
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive ? "text-bg-deep" : "text-text-secondary hover:text-text-primary"
                }`}
                style={{
                  background: isActive ? "linear-gradient(135deg, #d4a853, #f472b6)" : "transparent",
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </div>
            </Link>
          );
        })}
      </motion.nav>
    </div>
  );
}
