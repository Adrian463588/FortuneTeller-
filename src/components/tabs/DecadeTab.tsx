"use client";

import { motion } from "framer-motion";
import { Milestone, ChevronRight, Lightbulb } from "lucide-react";
import { useState } from "react";
import type { ReadingResult } from "@/utils/types";
import { PredictionCard } from "@/components/ui/PredictionCard";

export default function DecadeTab({ reading }: { reading: ReadingResult }) {
  const { decadePredictions } = reading;
  const [expandedDecade, setExpandedDecade] = useState<number | null>(0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <h2 className="font-heading text-xl text-accent-gold-light flex items-center gap-2">
        <Milestone className="w-5 h-5 text-accent-gold" />
        Decade-by-Decade Life Blueprint
      </h2>

      <p className="text-text-secondary text-sm">
        Your life unfolds across major phases, each carrying unique cosmic energy. Click on a decade to explore its detailed reading.
      </p>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div
          className="absolute left-6 top-0 bottom-0 w-px"
          style={{ background: "linear-gradient(to bottom, rgba(212,168,83,0.3), rgba(155,89,182,0.3), rgba(0,229,255,0.3))" }}
        />

        <div className="space-y-4">
          {decadePredictions.map((decade, i) => (
            <motion.div
              key={decade.startYear}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {/* Decade Header */}
              <button
                onClick={() => setExpandedDecade(expandedDecade === i ? null : i)}
                className="w-full text-left flex items-center gap-4 group"
              >
                {/* Timeline dot */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all"
                  style={{
                    background: expandedDecade === i
                      ? "linear-gradient(135deg, #d4a853, #9b59b6)"
                      : "rgba(17,13,31,0.9)",
                    border: expandedDecade === i
                      ? "2px solid transparent"
                      : "2px solid rgba(212,168,83,0.2)",
                    boxShadow: expandedDecade === i
                      ? "0 0 20px rgba(212,168,83,0.3)"
                      : "none",
                  }}
                >
                  <span className={`font-heading text-xs font-bold ${expandedDecade === i ? "text-bg-deep" : "text-text-secondary"}`}>
                    {decade.startAge}s
                  </span>
                </div>

                {/* Summary */}
                <div
                  className="flex-1 rounded-xl p-4 transition-all"
                  style={{
                    background: expandedDecade === i
                      ? "linear-gradient(135deg, rgba(17,13,31,0.95), rgba(26,20,48,0.95))"
                      : "rgba(17,13,31,0.6)",
                    border: expandedDecade === i
                      ? "1px solid rgba(212,168,83,0.2)"
                      : "1px solid rgba(212,168,83,0.05)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`font-heading text-sm font-semibold ${expandedDecade === i ? "text-accent-gold-light" : "text-text-primary"}`}>
                        Ages {decade.startAge}–{decade.endAge}: {decade.lifePhase}
                      </h3>
                      <p className="text-text-muted text-xs">
                        {decade.startYear}–{decade.endYear}
                      </p>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedDecade === i ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-4 h-4 text-text-muted" />
                    </motion.div>
                  </div>
                </div>
              </button>

              {/* Expanded Content */}
              <motion.div
                initial={false}
                animate={{
                  height: expandedDecade === i ? "auto" : 0,
                  opacity: expandedDecade === i ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="ml-16 mt-3 space-y-4">
                  {/* Theme */}
                  <div
                    className="rounded-xl p-4"
                    style={{
                      background: "rgba(17,13,31,0.8)",
                      border: "1px solid rgba(155,89,182,0.1)",
                    }}
                  >
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {decade.overallTheme}
                    </p>
                  </div>

                  {/* Major Milestones */}
                  <div
                    className="rounded-xl p-4"
                    style={{
                      background: "rgba(17,13,31,0.8)",
                      border: "1px solid rgba(0,229,255,0.1)",
                    }}
                  >
                    <h4 className="text-xs text-accent-cyan font-semibold uppercase tracking-wider mb-2">
                      Major Milestones
                    </h4>
                    <ul className="space-y-1.5">
                      {decade.majorMilestones.map((m) => (
                        <li key={m} className="text-text-secondary text-xs flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-accent-cyan rounded-full flex-shrink-0" />
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Key Advice */}
                  <div
                    className="rounded-xl p-4 flex items-start gap-3"
                    style={{
                      background: "rgba(212,168,83,0.05)",
                      border: "1px solid rgba(212,168,83,0.1)",
                    }}
                  >
                    <Lightbulb className="w-4 h-4 text-accent-gold flex-shrink-0 mt-0.5" />
                    <p className="text-text-secondary text-xs italic leading-relaxed">
                      {decade.keyAdvice}
                    </p>
                  </div>

                  {/* Domain Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {decade.domains.map((d, di) => (
                      <PredictionCard key={d.category} prediction={d} index={di} />
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
