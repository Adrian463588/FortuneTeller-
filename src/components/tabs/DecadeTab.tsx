"use client";

import { motion } from "framer-motion";
import { Milestone, ChevronRight, Lightbulb, ShieldAlert, Eye, EyeOff, Info } from "lucide-react";
import { useState } from "react";
import type { ReadingResult } from "@/utils/types";
import { PredictionCard } from "@/components/ui/PredictionCard";

export default function DecadeTab({ reading }: { reading: ReadingResult }) {
  const { decadePredictions } = reading;
  const [expandedDecade, setExpandedDecade] = useState<number | null>(0);
  const [mortalityRevealed, setMortalityRevealed] = useState(false);
  const [showSafetyGate, setShowSafetyGate] = useState(false);

  const handleRevealMortality = () => {
    setShowSafetyGate(true);
  };

  const confirmReveal = () => {
    setMortalityRevealed(true);
    setShowSafetyGate(false);
  };

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

      {/* Safety Gate Modal */}
      {showSafetyGate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.8)" }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="max-w-md w-full rounded-2xl p-6"
            style={{
              background: "linear-gradient(135deg, rgba(17,13,31,0.98), rgba(26,20,48,0.98))",
              border: "1px solid rgba(248,113,113,0.2)",
              boxShadow: "0 0 40px rgba(248,113,113,0.1)",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <ShieldAlert className="w-6 h-6 text-red-400" />
              <h3 className="font-heading text-lg text-red-300">Sensitive Content</h3>
            </div>
            <p className="text-text-secondary text-sm mb-4 leading-relaxed">
              The mortality and transition themes section contains algorithmically generated content about 
              life transitions, endings, and renewal cycles. This content is symbolic and based on 
              traditional divination systems — it is <span className="text-accent-gold font-semibold">not</span> a 
              medical or factual prediction.
            </p>
            <p className="text-text-muted text-xs mb-6">
              Do you wish to reveal this content?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSafetyGate(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-text-secondary transition-all"
                style={{ background: "rgba(17,13,31,0.8)", border: "1px solid rgba(212,168,83,0.1)" }}
              >
                Keep Hidden
              </button>
              <button
                onClick={confirmReveal}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-bg-deep transition-all"
                style={{ background: "linear-gradient(135deg, #d4a853, #9b59b6)" }}
              >
                Reveal Content
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Timeline */}
      <div className="relative">
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
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all"
                  style={{
                    background: expandedDecade === i
                      ? "linear-gradient(135deg, #d4a853, #9b59b6)"
                      : "rgba(17,13,31,0.9)",
                    border: expandedDecade === i
                      ? "2px solid transparent"
                      : "2px solid rgba(212,168,83,0.2)",
                    boxShadow: expandedDecade === i ? "0 0 20px rgba(212,168,83,0.3)" : "none",
                  }}
                >
                  <span className={`font-heading text-xs font-bold ${expandedDecade === i ? "text-bg-deep" : "text-text-secondary"}`}>
                    {decade.startAge}s
                  </span>
                </div>
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
                      <p className="text-text-muted text-xs">{decade.startYear}–{decade.endYear}</p>
                    </div>
                    <motion.div animate={{ rotate: expandedDecade === i ? 90 : 0 }} transition={{ duration: 0.2 }}>
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
                  <div className="rounded-xl p-4" style={{ background: "rgba(17,13,31,0.8)", border: "1px solid rgba(155,89,182,0.1)" }}>
                    <p className="text-text-secondary text-sm leading-relaxed">{decade.overallTheme}</p>
                  </div>

                  {/* Major Milestones */}
                  <div className="rounded-xl p-4" style={{ background: "rgba(17,13,31,0.8)", border: "1px solid rgba(0,229,255,0.1)" }}>
                    <h4 className="text-xs text-accent-cyan font-semibold uppercase tracking-wider mb-2">Major Milestones</h4>
                    <ul className="space-y-1.5">
                      {decade.majorMilestones.map((m, mi) => (
                        <li key={`${i}-milestone-${mi}`} className="text-text-secondary text-xs flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-accent-cyan rounded-full flex-shrink-0" /> {m}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Mortality Theme — Blur to Reveal */}
                  <div
                    className="rounded-xl p-4 relative overflow-hidden"
                    style={{
                      background: "rgba(248,113,113,0.03)",
                      border: "1px solid rgba(248,113,113,0.1)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs text-red-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        {mortalityRevealed ? "Transition & Renewal Theme" : "Sensitive Content"}
                      </h4>
                      {!mortalityRevealed ? (
                        <button
                          onClick={handleRevealMortality}
                          className="flex items-center gap-1 text-xs text-text-muted hover:text-red-400 transition-colors"
                        >
                          <Eye className="w-3 h-3" /> Reveal
                        </button>
                      ) : (
                        <button
                          onClick={() => setMortalityRevealed(false)}
                          className="flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary transition-colors"
                        >
                          <EyeOff className="w-3 h-3" /> Hide
                        </button>
                      )}
                    </div>

                    <div className={`transition-all duration-500 ${mortalityRevealed ? "" : "blur-md select-none pointer-events-none"}`}>
                      <p className="text-text-secondary text-sm mb-2 italic">{decade.mortalityTheme.softLabel}</p>
                      <p className="text-text-secondary text-xs mb-3 leading-relaxed">{decade.mortalityTheme.theme}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-text-muted">Caution level:</span>
                        <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(248,113,113,0.1)" }}>
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${decade.mortalityTheme.score * 10}%`,
                              background: "linear-gradient(90deg, #fbbf24, #f87171)",
                            }}
                          />
                        </div>
                        <span className="text-xs text-red-300">{decade.mortalityTheme.score}/10</span>
                      </div>
                      <div className="space-y-1 mb-2">
                        {decade.mortalityTheme.protections.map((p, pi) => (
                          <div key={`${i}-prot-${pi}`} className="flex items-center gap-2 text-xs text-emerald-400">
                            <span className="w-1 h-1 bg-emerald-400 rounded-full flex-shrink-0" /> {p}
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <Info className="w-3 h-3 text-text-muted mt-0.5" />
                        {decade.mortalityTheme.signalsUsed.map((s, si) => (
                          <span key={`${i}-msig-${si}`} className="px-1.5 py-0.5 rounded text-xs bg-accent-purple/10 text-accent-purple">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Decade Strategies */}
                  <div>
                    <h4 className="text-xs text-accent-gold font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5" /> Strategic Advice
                    </h4>
                    <div className="space-y-2">
                      {decade.strategies.map((s, si) => (
                        <motion.div
                          key={s.domain}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 * si }}
                          className="rounded-lg p-3"
                          style={{ background: "rgba(17,13,31,0.6)", border: "1px solid rgba(212,168,83,0.08)" }}
                        >
                          <p className="text-accent-gold-light text-xs font-semibold mb-1">{s.domain}</p>
                          <p className="text-text-secondary text-xs mb-1">{s.strategy}</p>
                          <p className="text-text-muted text-xs italic mb-1.5">{s.rationale}</p>
                          <div className="flex flex-wrap gap-1">
                            {s.signalsUsed.map((sig, sigi) => (
                              <span key={`${i}-strat-${si}-sig-${sigi}`} className="px-1.5 py-0.5 rounded text-xs bg-accent-purple/10 text-accent-purple">{sig}</span>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Key Advice */}
                  <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: "rgba(212,168,83,0.05)", border: "1px solid rgba(212,168,83,0.1)" }}>
                    <Lightbulb className="w-4 h-4 text-accent-gold flex-shrink-0 mt-0.5" />
                    <p className="text-text-secondary text-xs italic leading-relaxed">{decade.keyAdvice}</p>
                  </div>

                  {/* Domain Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {decade.domains.map((d, di) => (
                      <PredictionCard key={`${i}-domain-${di}`} prediction={d} index={di} />
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
