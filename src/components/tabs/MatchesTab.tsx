"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Heart, Users, Briefcase, Star, Sparkles, Info, ChevronDown, ChevronUp,
  AlertTriangle, Shield, User, Calendar, Clock,
} from "lucide-react";
import type { ReadingResult, BirthProfile, MatchMode, RecommendationResult, RankedMatch, PairComparison } from "@/utils/types";
import { generateRecommendations } from "@/utils/recommendationEngine";
import { generateReading } from "@/utils/divinationEngine";

const MODE_CONFIG = {
  romance: { label: "Romance", icon: Heart, color: "#f472b6", gradient: "linear-gradient(135deg, #f472b6, #d4a853)" },
  friend: { label: "Friend", icon: Users, color: "#22d3ee", gradient: "linear-gradient(135deg, #22d3ee, #a78bfa)" },
  colleague: { label: "Colleague", icon: Briefcase, color: "#4ade80", gradient: "linear-gradient(135deg, #4ade80, #d4a853)" },
};

function MatchCard({ match, index, color }: { match: RankedMatch; index: number; color: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08 }}
      whileHover={{ scale: 1.02, boxShadow: `0 4px 30px ${color}20` }}
      className="rounded-xl p-4 cursor-pointer transition-all"
      style={{
        background: "rgba(17,13,31,0.85)",
        border: `1px solid ${color}18`,
      }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{match.symbol}</span>
          <div>
            <h4 className="font-heading text-sm font-semibold text-text-primary">
              {match.sign}
              {match.role && <span className="text-xs text-text-muted ml-2 font-normal">· {match.role}</span>}
            </h4>
            <div className="flex gap-1 mt-0.5">
              {match.signalsUsed.map((s) => (
                <span
                  key={s}
                  className="px-1.5 py-0.5 rounded text-xs"
                  style={{ background: `${color}12`, color, fontSize: "0.6rem" }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="text-right flex items-center gap-2">
          <span className="font-heading font-bold text-lg" style={{ color }}>{match.score}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5 text-text-muted" /> : <ChevronDown className="w-3.5 h-3.5 text-text-muted" />}
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-text-secondary text-xs leading-relaxed mt-3 pt-3"
            style={{ borderTop: "1px solid rgba(212,168,83,0.06)" }}
          >
            {match.whySummary}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function PairComparisonCard({ pair }: { pair: PairComparison }) {
  const systems = [
    { key: "zodiac", label: "Zodiac", color: "#a78bfa" },
    { key: "shio", label: "Shio", color: "#f472b6" },
    { key: "bazi", label: "BaZi", color: "#d4a853" },
    { key: "weton", label: "Weton", color: "#22c55e" },
    { key: "fengShui", label: "Feng Shui", color: "#22d3ee" },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-xl p-5 space-y-4"
      style={{
        background: "linear-gradient(135deg, rgba(17,13,31,0.95), rgba(26,20,48,0.95))",
        border: "1px solid rgba(212,168,83,0.12)",
      }}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-sm text-accent-gold-light">Pair Comparison</h3>
        <div className="flex items-center gap-2">
          <span className="font-heading text-2xl font-bold text-accent-gold">{pair.pairScore}</span>
          <span className="text-text-muted text-xs">/100</span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {systems.map((sys) => (
          <div key={sys.key} className="text-center">
            <div className="w-full h-2 rounded-full overflow-hidden mb-1" style={{ background: "rgba(255,255,255,0.05)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: sys.color }}
                initial={{ width: 0 }}
                animate={{ width: `${pair.systemBreakdown[sys.key]}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </div>
            <p className="text-xs" style={{ color: sys.color }}>{pair.systemBreakdown[sys.key]}</p>
            <p className="text-text-muted" style={{ fontSize: "0.55rem" }}>{sys.label}</p>
          </div>
        ))}
      </div>

      {pair.strengths.length > 0 && (
        <div className="space-y-1">
          <h4 className="text-xs text-emerald-400 font-semibold">Strengths</h4>
          {pair.strengths.map((s, i) => (
            <p key={i} className="text-xs text-text-secondary flex items-start gap-1.5">
              <span className="w-1 h-1 mt-1.5 bg-emerald-400 rounded-full flex-shrink-0" />{s}
            </p>
          ))}
        </div>
      )}
      {pair.challenges.length > 0 && (
        <div className="space-y-1">
          <h4 className="text-xs text-red-400 font-semibold">Challenges</h4>
          {pair.challenges.map((c, i) => (
            <p key={i} className="text-xs text-text-secondary flex items-start gap-1.5">
              <span className="w-1 h-1 mt-1.5 bg-red-400 rounded-full flex-shrink-0" />{c}
            </p>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default function MatchesTab({ reading }: { reading: ReadingResult }) {
  const [mode, setMode] = useState<MatchMode>("romance");
  const [result, setResult] = useState<RecommendationResult>(() => generateRecommendations(reading, "romance"));

  // Compare overlay state
  const [showCompare, setShowCompare] = useState(false);
  const [compareName, setCompareName] = useState("");
  const [compareDob, setCompareDob] = useState("");
  const [compareTime, setCompareTime] = useState("");
  const [compareGender, setCompareGender] = useState<"male" | "female">("male");

  const switchMode = (m: MatchMode) => {
    setMode(m);
    setResult(generateRecommendations(reading, m));
  };

  const handleCompare = () => {
    if (!compareName || !compareDob) return;
    const otherProfile: BirthProfile = {
      fullName: compareName.trim(),
      dateOfBirth: new Date(compareDob),
      timeOfBirth: compareTime || undefined,
      gender: compareGender,
    };
    const otherReading = generateReading(otherProfile);
    setResult(generateRecommendations(reading, mode, otherReading));
    setShowCompare(false);
  };

  const cfg = MODE_CONFIG[mode];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 pb-12"
    >
      {/* Mode Switcher */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 rounded-xl p-1" style={{ background: "rgba(17,13,31,0.6)", border: "1px solid rgba(212,168,83,0.08)" }}>
          {(Object.keys(MODE_CONFIG) as MatchMode[]).map((m) => {
            const Icon = MODE_CONFIG[m].icon;
            const isActive = mode === m;
            return (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: isActive ? cfg.gradient : "transparent",
                  color: isActive ? "#0a0613" : "var(--text-secondary)",
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                {MODE_CONFIG[m].label}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setShowCompare(!showCompare)}
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg transition-all"
          style={{
            background: showCompare ? "rgba(212,168,83,0.15)" : "rgba(17,13,31,0.6)",
            border: "1px solid rgba(212,168,83,0.12)",
            color: showCompare ? "#d4a853" : "var(--text-secondary)",
          }}
        >
          <Users className="w-3.5 h-3.5" />
          Compare
        </button>
      </div>

      {/* Compare Overlay */}
      <AnimatePresence>
        {showCompare && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-xl p-4 space-y-3"
            style={{ background: "rgba(17,13,31,0.9)", border: "1px solid rgba(212,168,83,0.12)" }}
          >
            <h4 className="text-xs text-accent-gold font-semibold uppercase tracking-wider">Compare with someone</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input type="text" placeholder="Full name" value={compareName} onChange={(e) => setCompareName(e.target.value)} className="input-mystic px-3 py-2 rounded-lg text-xs" />
              <input type="date" value={compareDob} onChange={(e) => setCompareDob(e.target.value)} className="input-mystic px-3 py-2 rounded-lg text-xs" style={{ colorScheme: "dark" }} />
              <input type="time" value={compareTime} onChange={(e) => setCompareTime(e.target.value)} className="input-mystic px-3 py-2 rounded-lg text-xs" style={{ colorScheme: "dark" }} />
              <button onClick={handleCompare} className="px-4 py-2 rounded-lg text-xs font-semibold" style={{ background: cfg.gradient, color: "#0a0613" }}>
                Analyze
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pair Comparison (if available) */}
      {result.pairComparison && <PairComparisonCard pair={result.pairComparison} />}

      {/* Two columns: Zodiac & Shio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Zodiac */}
        <div className="space-y-3">
          <h3 className="font-heading text-sm flex items-center gap-2" style={{ color: "#a78bfa" }}>
            <Star className="w-4 h-4" /> Top Zodiac Matches
          </h3>
          <div className="space-y-2">
            {result.zodiacRanked.map((m, i) => (
              <MatchCard key={m.sign} match={m} index={i} color="#a78bfa" />
            ))}
          </div>
        </div>

        {/* Shio */}
        <div className="space-y-3">
          <h3 className="font-heading text-sm flex items-center gap-2" style={{ color: "#f472b6" }}>
            <Sparkles className="w-4 h-4" /> Top Shio Matches
          </h3>
          <div className="space-y-2">
            {result.shioRanked.map((m, i) => (
              <MatchCard key={m.sign} match={m} index={i} color="#f472b6" />
            ))}
          </div>
        </div>
      </div>

      {/* Colleague Risks (colleague mode only) */}
      {mode === "colleague" && result.collaborationRisks.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <h3 className="font-heading text-sm text-amber-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Collaboration Risks & Mitigations
          </h3>
          <div className="space-y-2">
            {result.collaborationRisks.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="rounded-xl p-4"
                style={{ background: "rgba(250,204,21,0.04)", border: "1px solid rgba(250,204,21,0.1)" }}
              >
                <div className="flex items-start gap-2 mb-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-text-primary text-xs font-semibold">{r.risk}</p>
                </div>
                <div className="flex items-start gap-2 ml-5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <p className="text-text-secondary text-xs">{r.mitigation}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Explanation footer */}
      <div
        className="rounded-xl p-4 space-y-2"
        style={{ background: "rgba(17,13,31,0.5)", border: "1px solid rgba(212,168,83,0.06)" }}
      >
        <h4 className="text-xs text-accent-gold font-semibold flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" /> How rankings work
        </h4>
        {result.explanations.map((e, i) => (
          <p key={i} className="text-text-muted text-xs leading-relaxed">{e}</p>
        ))}
      </div>
    </motion.div>
  );
}
