"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Coins,
  Heart,
  Users,
  Activity,
  Brain,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import type { DomainPrediction } from "@/utils/types";

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-5 h-5" />,
  Coins: <Coins className="w-5 h-5" />,
  Heart: <Heart className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  Activity: <Activity className="w-5 h-5" />,
  Brain: <Brain className="w-5 h-5" />,
};

const scoreColors: Record<string, string> = {
  low: "text-red-400",
  mid: "text-yellow-400",
  high: "text-emerald-400",
};

function getScoreLevel(score: number): string {
  if (score <= 4) return "low";
  if (score <= 7) return "mid";
  return "high";
}

export function PredictionCard({
  prediction,
  index = 0,
}: {
  prediction: DomainPrediction;
  index?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const level = getScoreLevel(prediction.score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="relative rounded-xl overflow-hidden cursor-pointer group"
      style={{
        background: "linear-gradient(135deg, rgba(17,13,31,0.9), rgba(26,20,48,0.9))",
        border: "1px solid rgba(212, 168, 83, 0.15)",
      }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Glow effect on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 0%, rgba(212,168,83,0.1), transparent 70%)",
        }}
      />

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg"
              style={{
                background: "linear-gradient(135deg, rgba(212,168,83,0.2), rgba(155,89,182,0.2))",
              }}
            >
              <span className="text-accent-gold">{iconMap[prediction.icon]}</span>
            </div>
            <h3 className="font-heading font-semibold text-accent-gold-light text-sm">
              {prediction.title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-4 rounded-full transition-colors ${
                    i < prediction.score
                      ? level === "high"
                        ? "bg-emerald-400"
                        : level === "mid"
                        ? "bg-yellow-400"
                        : "bg-red-400"
                      : "bg-gray-700"
                  }`}
                />
              ))}
            </div>
            <span className={`text-xs font-bold ${scoreColors[level]}`}>
              {prediction.score}/10
            </span>
          </div>
        </div>

        {/* Summary */}
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{prediction.summary}</p>

        {/* Expandable details */}
        <motion.div
          initial={false}
          animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="pt-3 border-t border-border-mystic space-y-3">
            <div>
              <h4 className="text-xs font-semibold text-accent-cyan mb-1 uppercase tracking-wider">
                Why You Got This
              </h4>
              <p className="text-text-muted text-xs leading-relaxed">{prediction.details}</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-accent-purple mb-1 uppercase tracking-wider">
                Cosmic Advice
              </h4>
              <p className="text-text-muted text-xs leading-relaxed italic">{prediction.advice}</p>
            </div>
          </div>
        </motion.div>

        {/* Expand indicator */}
        <div className="flex justify-center mt-2">
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            className="text-text-muted"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export function ElementChart({
  balance,
}: {
  balance: Record<string, number>;
}) {
  const elements = [
    { name: "Wood", color: "#4ade80", bg: "rgba(74,222,128,0.15)" },
    { name: "Fire", color: "#f87171", bg: "rgba(248,113,113,0.15)" },
    { name: "Earth", color: "#fbbf24", bg: "rgba(251,191,36,0.15)" },
    { name: "Metal", color: "#a78bfa", bg: "rgba(167,139,250,0.15)" },
    { name: "Water", color: "#38bdf8", bg: "rgba(56,189,248,0.15)" },
  ];

  const maxVal = Math.max(...Object.values(balance), 1);

  return (
    <div className="space-y-3">
      {elements.map((el, i) => (
        <motion.div
          key={el.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-3"
        >
          <span className="text-xs w-12 text-right" style={{ color: el.color }}>
            {el.name}
          </span>
          <div className="flex-1 h-3 rounded-full" style={{ background: el.bg }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(balance[el.name] / maxVal) * 100}%` }}
              transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${el.color}80, ${el.color})` }}
            />
          </div>
          <span className="text-xs text-text-muted w-4">{balance[el.name]}</span>
        </motion.div>
      ))}
    </div>
  );
}
