"use client";

import { motion } from "framer-motion";
import { CalendarDays, Star, AlertTriangle, Lightbulb, ShieldCheck, Eye, Check, X, Info } from "lucide-react";
import { useState } from "react";
import type { ReadingResult } from "@/utils/types";
import { PredictionCard } from "@/components/ui/PredictionCard";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const DOMAIN_ICONS: Record<string, string> = {
  wealth: "💰", love: "💕", social: "🤝", health: "🏥", spiritual: "🧘",
};

export default function YearlyTab({ reading }: { reading: ReadingResult }) {
  const { yearlyPredictions } = reading;
  const [selectedYear, setSelectedYear] = useState(0);

  const current = yearlyPredictions[selectedYear];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <h2 className="font-heading text-xl text-accent-gold-light flex items-center gap-2">
        <CalendarDays className="w-5 h-5 text-accent-gold" />
        Year-by-Year Forecast
      </h2>

      {/* Year selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {yearlyPredictions.map((yp, i) => (
          <motion.button
            key={yp.year}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedYear(i)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-heading font-semibold transition-all ${
              selectedYear === i
                ? "text-bg-deep"
                : "text-text-secondary hover:text-text-primary"
            }`}
            style={{
              background: selectedYear === i
                ? "linear-gradient(135deg, #d4a853, #9b59b6)"
                : "rgba(17,13,31,0.8)",
              border: selectedYear === i
                ? "1px solid transparent"
                : "1px solid rgba(212,168,83,0.1)",
            }}
          >
            <div>{yp.year}</div>
            <div className={`text-xs ${selectedYear === i ? "opacity-80" : "text-text-muted"}`}>
              Age {yp.age}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Selected year details */}
      {current && (
        <motion.div
          key={current.year}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Year Theme */}
          <div
            className="rounded-xl p-5"
            style={{
              background: "linear-gradient(135deg, rgba(17,13,31,0.9), rgba(26,20,48,0.9))",
              border: "1px solid rgba(212,168,83,0.15)",
            }}
          >
            <div className="flex items-start gap-3">
              <Star className="w-6 h-6 text-accent-gold mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-heading text-lg text-accent-gold-light mb-2">
                  {current.year} — {current.overallTheme}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  At age <span className="text-accent-gold font-semibold">{current.age}</span>, this year
                  carries the energy of transformation and purpose.
                </p>
              </div>
            </div>
          </div>

          {/* Misfortune Index */}
          <div
            className="rounded-xl p-5"
            style={{
              background: current.misfortune.score > 6
                ? "rgba(248,113,113,0.04)"
                : "rgba(17,13,31,0.8)",
              border: `1px solid ${current.misfortune.score > 6 ? "rgba(248,113,113,0.2)" : "rgba(212,168,83,0.1)"}`,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5" /> Misfortune Index
              </h4>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 rounded-full overflow-hidden" style={{ background: "rgba(248,113,113,0.1)" }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${current.misfortune.score * 10}%`,
                      background: current.misfortune.score > 7
                        ? "linear-gradient(90deg, #f87171, #ef4444)"
                        : current.misfortune.score > 4
                        ? "linear-gradient(90deg, #fbbf24, #f59e0b)"
                        : "linear-gradient(90deg, #4ade80, #22c55e)",
                    }}
                  />
                </div>
                <span className={`text-xs font-bold ${current.misfortune.score > 7 ? "text-red-400" : current.misfortune.score > 4 ? "text-yellow-400" : "text-emerald-400"}`}>
                  {current.misfortune.score}/10
                </span>
              </div>
            </div>

            {/* Themes */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {current.misfortune.themes.map((t, ti) => (
                <span key={`theme-${ti}`} className="px-2 py-0.5 rounded-full text-xs bg-red-400/10 text-red-300">{t}</span>
              ))}
            </div>

            {/* Protections */}
            <div className="space-y-1.5 mb-3">
              <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Protections
              </p>
              {current.misfortune.protections.map((p, pi) => (
                <div key={`prot-${pi}`} className="flex items-center gap-2 text-xs text-text-secondary">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full flex-shrink-0" /> {p}
                </div>
              ))}
            </div>

            {/* Signal citation */}
            <div className="flex flex-wrap gap-1 mt-2">
              <Info className="w-3 h-3 text-text-muted mt-0.5" />
              {current.misfortune.signalsUsed.map((s, si) => (
                <span key={`misf-sig-${si}`} className="px-1.5 py-0.5 rounded text-xs bg-accent-purple/10 text-accent-purple">{s}</span>
              ))}
            </div>
          </div>

          {/* Lucky & Challenge Months */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl p-4" style={{ background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.15)" }}>
              <h4 className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                <Star className="w-3.5 h-3.5" /> Lucky Months
              </h4>
              <div className="flex flex-wrap gap-2">
                {MONTHS.map((m, i) => (
                  <span key={m} className={`px-2 py-1 rounded text-xs ${current.luckyMonths.includes(i + 1) ? "bg-emerald-400/20 text-emerald-400 font-semibold" : "text-text-muted"}`}>{m}</span>
                ))}
              </div>
            </div>
            <div className="rounded-xl p-4" style={{ background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.15)" }}>
              <h4 className="text-xs text-red-400 font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5" /> Challenge Months
              </h4>
              <div className="flex flex-wrap gap-2">
                {MONTHS.map((m, i) => (
                  <span key={m} className={`px-2 py-1 rounded text-xs ${current.challengeMonths.includes(i + 1) ? "bg-red-400/20 text-red-400 font-semibold" : "text-text-muted"}`}>{m}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Structured Advice */}
          <div>
            <h3 className="font-heading text-sm text-accent-gold-light mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-accent-gold" /> Actionable Advice
            </h3>
            <div className="space-y-3">
              {current.adviceItems.map((a, i) => (
                <motion.div
                  key={a.domain}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="rounded-xl p-4"
                  style={{
                    background: "linear-gradient(135deg, rgba(17,13,31,0.9), rgba(26,20,48,0.9))",
                    border: "1px solid rgba(212,168,83,0.1)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span>{DOMAIN_ICONS[a.domain]}</span>
                    <h4 className="text-sm font-semibold text-accent-gold-light capitalize">{a.domain}</h4>
                  </div>
                  <p className="text-text-secondary text-sm mb-2">{a.suggestion}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <div className="flex items-start gap-1.5 text-emerald-400">
                      <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      <span>{a.doAction}</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-red-400">
                      <X className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      <span>{a.dontAction}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {a.signalsUsed.map((s, si) => (
                      <span key={`adv-${i}-sig-${si}`} className="px-1.5 py-0.5 rounded text-xs bg-accent-purple/10 text-accent-purple">{s}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Domain Predictions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {current.domains.map((d, di) => (
              <PredictionCard key={`domain-${di}`} prediction={d} index={di} />
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
