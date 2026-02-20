"use client";

import { motion } from "framer-motion";
import { CalendarDays, Star, AlertTriangle, Lightbulb } from "lucide-react";
import { useState } from "react";
import type { ReadingResult } from "@/utils/types";
import { PredictionCard } from "@/components/ui/PredictionCard";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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
                  carries the energy of transformation and purpose. Your cosmic blueprint aligns with
                  opportunities that shape the next phase of your journey.
                </p>
              </div>
            </div>
          </div>

          {/* Lucky & Challenge Months */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className="rounded-xl p-4"
              style={{
                background: "rgba(74,222,128,0.05)",
                border: "1px solid rgba(74,222,128,0.15)",
              }}
            >
              <h4 className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                <Star className="w-3.5 h-3.5" /> Lucky Months
              </h4>
              <div className="flex flex-wrap gap-2">
                {MONTHS.map((m, i) => (
                  <span
                    key={m}
                    className={`px-2 py-1 rounded text-xs ${
                      current.luckyMonths.includes(i + 1)
                        ? "bg-emerald-400/20 text-emerald-400 font-semibold"
                        : "text-text-muted"
                    }`}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
            <div
              className="rounded-xl p-4"
              style={{
                background: "rgba(248,113,113,0.05)",
                border: "1px solid rgba(248,113,113,0.15)",
              }}
            >
              <h4 className="text-xs text-red-400 font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5" /> Challenge Months
              </h4>
              <div className="flex flex-wrap gap-2">
                {MONTHS.map((m, i) => (
                  <span
                    key={m}
                    className={`px-2 py-1 rounded text-xs ${
                      current.challengeMonths.includes(i + 1)
                        ? "bg-red-400/20 text-red-400 font-semibold"
                        : "text-text-muted"
                    }`}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Key Advice */}
          <div
            className="rounded-xl p-4 flex items-start gap-3"
            style={{
              background: "rgba(212,168,83,0.05)",
              border: "1px solid rgba(212,168,83,0.15)",
            }}
          >
            <Lightbulb className="w-5 h-5 text-accent-gold flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs text-accent-gold font-semibold uppercase tracking-wider mb-1">
                Key Advice for {current.year}
              </h4>
              <p className="text-text-secondary text-sm italic leading-relaxed">
                {current.keyAdvice}
              </p>
            </div>
          </div>

          {/* Domain Predictions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {current.domains.map((d, i) => (
              <PredictionCard key={d.category} prediction={d} index={i} />
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
