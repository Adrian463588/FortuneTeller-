"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const mysticSymbols = ["✦", "☽", "✧", "⚝", "☆", "◇", "⬡", "☉", "♄", "♃", "♂", "♀"];
const loadingMessages = [
  "Aligning celestial bodies...",
  "Reading the Four Pillars...",
  "Consulting the Heavenly Stems...",
  "Calculating your Weton...",
  "Deciphering the Earthly Branches...",
  "Summoning ancient wisdom...",
  "Mapping your elemental balance...",
  "Unveiling cosmic patterns...",
  "Casting the natal chart...",
  "Interpreting the stars...",
];

export default function LoadingOracle() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: "radial-gradient(circle at 50% 50%, #110d1f, #0a0613)" }}
    >
      {/* Spinning Sigil Ring */}
      <div className="relative w-48 h-48 mb-8">
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {mysticSymbols.map((symbol, i) => {
            const angle = (i / mysticSymbols.length) * 360;
            const rad = (angle * Math.PI) / 180;
            const x = 50 + 45 * Math.cos(rad);
            const y = 50 + 45 * Math.sin(rad);
            return (
              <motion.span
                key={i}
                className="absolute text-accent-gold text-lg"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.15,
                  repeat: Infinity,
                }}
              >
                {symbol}
              </motion.span>
            );
          })}
        </motion.div>

        {/* Middle ring */}
        <motion.div
          className="absolute inset-6 rounded-full"
          style={{
            border: "1px solid rgba(155,89,182,0.3)",
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          <motion.div
            className="absolute w-2 h-2 bg-accent-purple rounded-full"
            style={{ top: "-4px", left: "50%", transform: "translateX(-50%)" }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>

        {/* Inner core */}
        <motion.div
          className="absolute inset-14 rounded-full flex items-center justify-center"
          style={{
            background: "radial-gradient(circle, rgba(212,168,83,0.2), transparent)",
          }}
          animate={{
            boxShadow: [
              "0 0 20px rgba(212,168,83,0.2)",
              "0 0 60px rgba(212,168,83,0.5)",
              "0 0 20px rgba(212,168,83,0.2)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.span
            className="text-3xl text-accent-gold"
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            ☉
          </motion.span>
        </motion.div>
      </div>

      {/* Loading Text */}
      <motion.div className="text-center space-y-3">
        <motion.h2
          className="font-heading text-xl text-accent-gold-light"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Calculating Your Fate
        </motion.h2>
        <motion.p
          key={messageIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-text-secondary text-sm"
        >
          {loadingMessages[messageIndex]}
        </motion.p>
      </motion.div>

      {/* Progress dots */}
      <div className="flex gap-2 mt-8">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-accent-gold"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1, delay: i * 0.3, repeat: Infinity }}
          />
        ))}
      </div>
    </motion.div>
  );
}
