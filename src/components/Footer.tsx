"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer id="main-footer" className="relative z-10 mt-auto">
      <div
        className="h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(212,168,83,0.15), transparent)",
        }}
      />
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col items-center gap-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex items-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5 text-accent-gold/60" />
          <p
            className="text-xs tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            Reading by{" "}
            <span className="text-accent-gold-light font-heading font-semibold">
              Adrian Syah Abidin
            </span>
            .
          </p>
          <Sparkles className="w-3.5 h-3.5 text-accent-gold/60" />
        </motion.div>
        <p className="text-text-muted/50 text-xs">
          For entertainment and spiritual guidance purposes only.
        </p>
      </div>
    </footer>
  );
}
