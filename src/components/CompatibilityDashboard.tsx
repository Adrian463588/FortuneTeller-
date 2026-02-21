"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Heart, BarChart3, ScrollText, Star, CalendarDays, Lightbulb,
  ChevronRight, ArrowLeft, Info,
} from "lucide-react";
import type { CompatibilityResult } from "@/utils/types";

const SYSTEM_COLORS: Record<string, string> = {
  bazi: "#d4a853",
  weton: "#22c55e",
  zodiac: "#a78bfa",
  shio: "#f472b6",
};

const SYSTEM_LABELS: Record<string, string> = {
  bazi: "BaZi / Four Pillars",
  weton: "Weton / Primbon Jawa",
  zodiac: "Western Zodiac",
  shio: "Chinese Shio",
};

interface CompatibilityDashboardProps {
  result: CompatibilityResult;
  onReset: () => void;
}

export default function CompatibilityDashboard({ result, onReset }: CompatibilityDashboardProps) {
  const [activeTab, setActiveTab] = useState<"quick" | "bazi" | "weton" | "zodiac" | "shio" | "timeline">("quick");

  const tabs = [
    { id: "quick", label: "Score", icon: Heart },
    { id: "bazi", label: "BaZi", icon: BarChart3 },
    { id: "weton", label: "Weton", icon: ScrollText },
    { id: "zodiac", label: "Zodiac", icon: Star },
    { id: "shio", label: "Shio", icon: Star },
    { id: "timeline", label: "Timeline", icon: CalendarDays },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pb-20"
    >
      {/* Header */}
      <div className="sticky top-0 z-30 backdrop-blur-xl" style={{ background: "rgba(10,6,19,0.85)" }}>
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onReset}
              className="flex items-center gap-2 text-text-secondary hover:text-accent-gold text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> New Reading
            </button>
            <div className="text-right text-xs text-text-muted">
              <span className="text-pink-400">{result.coupleProfile.partnerA.fullName}</span>
              {" × "}
              <span className="text-cyan-400">{result.coupleProfile.partnerB.fullName}</span>
            </div>
          </div>

          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${isActive ? "text-bg-deep" : "text-text-secondary"}`}
                  style={{
                    background: isActive ? "linear-gradient(135deg, #f472b6, #d4a853)" : "transparent",
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(244,114,182,0.2), transparent)" }} />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Quick Score Tab */}
        {activeTab === "quick" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Combined Score Ring */}
            <div className="text-center">
              <div className="relative w-40 h-40 mx-auto mb-4">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                  <motion.circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke="url(#scoreGrad)"
                    strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={`${result.combinedScore * 2.64} 264`}
                    initial={{ strokeDasharray: "0 264" }}
                    animate={{ strokeDasharray: `${result.combinedScore * 2.64} 264` }}
                    transition={{ duration: 1.5, delay: 0.3 }}
                  />
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#f472b6" />
                      <stop offset="100%" stopColor="#d4a853" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span
                    className="font-heading text-4xl font-bold text-accent-gold-light"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    {result.combinedScore}
                  </motion.span>
                  <span className="text-text-muted text-xs">/ 100</span>
                </div>
              </div>
              <h2 className="font-heading text-lg text-accent-gold-light mb-2">Relationship Outlook</h2>
              <p className="text-text-secondary text-sm max-w-lg mx-auto leading-relaxed">{result.overallOutlook}</p>
            </div>

            {/* System Score Bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.systemScores.map((sys, i) => (
                <motion.div
                  key={sys.system}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="rounded-xl p-4"
                  style={{ background: "rgba(17,13,31,0.8)", border: `1px solid ${SYSTEM_COLORS[sys.system]}22` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold" style={{ color: SYSTEM_COLORS[sys.system] }}>{sys.label}</span>
                    <span className="text-xs font-bold" style={{ color: SYSTEM_COLORS[sys.system] }}>{sys.score}/100</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: SYSTEM_COLORS[sys.system] }}
                      initial={{ width: 0 }}
                      animate={{ width: `${sys.score}%` }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.15 }}
                    />
                  </div>
                  <p className="text-text-muted text-xs mt-2">{sys.summary}</p>
                </motion.div>
              ))}
            </div>

            {/* Primbon Badge */}
            <div
              className="rounded-xl p-5 text-center"
              style={{
                background: "linear-gradient(135deg, rgba(34,197,94,0.05), rgba(17,13,31,0.9))",
                border: "1px solid rgba(34,197,94,0.15)",
              }}
            >
              <p className="text-xs text-emerald-400 uppercase tracking-wider mb-1">Primbon Jawa Class</p>
              <h3 className="font-heading text-2xl text-emerald-300 font-bold mb-2">{result.primbonMatch.javanese}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{result.primbonMatch.interpretation}</p>
              <p className="text-emerald-400/70 text-xs mt-3 italic">{result.primbonMatch.advice}</p>
            </div>

            {/* Strengths & Challenges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl p-4" style={{ background: "rgba(74,222,128,0.04)", border: "1px solid rgba(74,222,128,0.12)" }}>
                <h4 className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-2">✦ Strengths</h4>
                {result.strengths.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 mb-1.5 text-xs text-text-secondary">
                    <span className="w-1.5 h-1.5 mt-1.5 bg-emerald-400 rounded-full flex-shrink-0" /> {s}
                  </div>
                ))}
              </div>
              <div className="rounded-xl p-4" style={{ background: "rgba(248,113,113,0.04)", border: "1px solid rgba(248,113,113,0.12)" }}>
                <h4 className="text-xs text-red-400 font-semibold uppercase tracking-wider mb-2">⚡ Challenges</h4>
                {result.challenges.map((c, i) => (
                  <div key={i} className="flex items-start gap-2 mb-1.5 text-xs text-text-secondary">
                    <span className="w-1.5 h-1.5 mt-1.5 bg-red-400 rounded-full flex-shrink-0" /> {c}
                  </div>
                ))}
              </div>
            </div>

            {/* Advice */}
            <div className="space-y-2">
              <h4 className="text-xs text-accent-gold font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" /> Advice
              </h4>
              {result.advice.map((a, i) => (
                <div key={i} className="rounded-lg p-3 text-xs text-text-secondary" style={{ background: "rgba(212,168,83,0.04)", border: "1px solid rgba(212,168,83,0.08)" }}>
                  {a}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* System Deep Dive Tabs */}
        {["bazi", "weton", "zodiac", "shio"].includes(activeTab) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {result.systemScores
              .filter((s) => s.system === activeTab)
              .map((sys) => (
                <div key={sys.system}>
                  <h2 className="font-heading text-xl mb-4 flex items-center gap-2" style={{ color: SYSTEM_COLORS[sys.system] }}>
                    <BarChart3 className="w-5 h-5" /> {sys.label} — Deep Dive
                  </h2>
                  <div className="rounded-xl p-5 mb-4" style={{ background: "rgba(17,13,31,0.8)", border: `1px solid ${SYSTEM_COLORS[sys.system]}15` }}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold" style={{ color: SYSTEM_COLORS[sys.system] }}>{sys.score}/100</span>
                      <div className="flex flex-wrap gap-1">
                        {sys.signalsUsed.map((s) => (
                          <span key={s} className="px-1.5 py-0.5 rounded text-xs bg-accent-purple/10 text-accent-purple">{s}</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-text-secondary text-sm mb-4">{sys.summary}</p>
                  </div>

                  <div className="space-y-2">
                    {sys.details.map((d, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-3 rounded-lg p-3"
                        style={{ background: "rgba(17,13,31,0.6)", border: "1px solid rgba(212,168,83,0.06)" }}
                      >
                        <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: SYSTEM_COLORS[sys.system] }} />
                        <p className="text-text-secondary text-xs leading-relaxed">{d}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
          </motion.div>
        )}

        {/* Timeline Tab */}
        {activeTab === "timeline" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h2 className="font-heading text-xl text-accent-gold-light flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-accent-gold" /> Relationship Timeline
            </h2>
            <p className="text-text-secondary text-sm mb-4">
              A projection of easier and harder periods based on the interaction of both partners' luck cycles.
            </p>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px" style={{ background: "linear-gradient(to bottom, rgba(244,114,182,0.3), rgba(212,168,83,0.3), rgba(34,211,238,0.3))" }} />
              <div className="space-y-3">
                {result.timeline.map((t, i) => {
                  const phaseColor = t.phase === "easier" ? "#4ade80" : t.phase === "harder" ? "#f87171" : "#94a3b8";
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10"
                        style={{
                          background: `${phaseColor}15`,
                          border: `2px solid ${phaseColor}40`,
                        }}
                      >
                        <span className="text-xs font-bold" style={{ color: phaseColor }}>
                          {t.yearStart.toString().slice(-2)}s
                        </span>
                      </div>
                      <div
                        className="flex-1 rounded-xl p-4"
                        style={{
                          background: "rgba(17,13,31,0.8)",
                          border: `1px solid ${phaseColor}15`,
                        }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold" style={{ color: phaseColor }}>
                            {t.yearStart}–{t.yearEnd}
                          </span>
                          <span
                            className="px-2 py-0.5 rounded-full text-xs capitalize font-semibold"
                            style={{ background: `${phaseColor}15`, color: phaseColor }}
                          >
                            {t.phase}
                          </span>
                        </div>
                        <p className="text-text-secondary text-xs leading-relaxed">{t.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
