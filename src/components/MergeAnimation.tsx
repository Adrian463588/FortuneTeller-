"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function MergeAnimation({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(10,6,19,0.96)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* Orb A (pink) */}
        <motion.div
          className="absolute w-16 h-16 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(244,114,182,0.8), rgba(244,114,182,0.2))",
            boxShadow: "0 0 40px rgba(244,114,182,0.5)",
          }}
          initial={{ x: -100, y: 0, scale: 1 }}
          animate={{ x: 0, y: 0, scale: 0.6 }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
        />

        {/* Orb B (cyan) */}
        <motion.div
          className="absolute w-16 h-16 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(34,211,238,0.8), rgba(34,211,238,0.2))",
            boxShadow: "0 0 40px rgba(34,211,238,0.5)",
          }}
          initial={{ x: 100, y: 0, scale: 1 }}
          animate={{ x: 0, y: 0, scale: 0.6 }}
          transition={{ duration: 1.8, ease: "easeInOut" }}
        />

        {/* Connecting threads */}
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute h-px"
            style={{
              background: `linear-gradient(90deg, rgba(244,114,182,0.4), rgba(212,168,83,0.6), rgba(34,211,238,0.4))`,
              width: "200px",
              left: "calc(50% - 100px)",
              transform: `rotate(${i * 45}deg)`,
            }}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.5 + i * 0.15 }}
          />
        ))}

        {/* Central convergence ring */}
        <motion.div
          className="absolute w-24 h-24 rounded-full"
          style={{
            border: "2px solid rgba(212,168,83,0.4)",
            boxShadow: "0 0 60px rgba(212,168,83,0.2), inset 0 0 30px rgba(212,168,83,0.1)",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        />

        {/* Heart icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 2.0, type: "spring", stiffness: 200 }}
        >
          <Heart className="w-10 h-10 text-accent-gold fill-accent-gold/30" />
        </motion.div>

        {/* Text */}
        <motion.p
          className="absolute bottom-0 text-text-secondary text-xs tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          Weaving your destinies...
        </motion.p>

        {/* Auto-proceed */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 3.2 }}
          onAnimationComplete={onComplete}
        />
      </div>
    </motion.div>
  );
}
