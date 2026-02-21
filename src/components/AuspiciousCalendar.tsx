"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, AlertTriangle, Info, Calendar } from "lucide-react";
import type { DateRanking, DateEvaluation } from "@/utils/types";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const RATING_COLORS = {
  auspicious: { bg: "rgba(74,222,128,0.12)", border: "rgba(74,222,128,0.25)", text: "#4ade80", dot: "#4ade80" },
  neutral: { bg: "rgba(250,204,21,0.08)", border: "rgba(250,204,21,0.15)", text: "#facc15", dot: "#facc15" },
  inauspicious: { bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.15)", text: "#f87171", dot: "#f87171" },
};

const SIGNAL_COLORS: Record<string, string> = {
  bazi: "#d4a853",
  weton: "#22c55e",
  shenSha: "#a78bfa",
  yongShen: "#22d3ee",
};

interface AuspiciousCalendarProps {
  ranking: DateRanking;
  onReset: () => void;
}

export default function AuspiciousCalendar({ ranking, onReset }: AuspiciousCalendarProps) {
  const allDates = [...ranking.allDates, ...ranking.avoidDates];
  const dateMap = new Map<string, DateEvaluation>();
  for (const d of allDates) {
    const key = d.candidate.date.toISOString().split("T")[0];
    dateMap.set(key, d);
  }

  // Derive month range from data
  const firstDate = ranking.dateRange.start;
  const [currentMonth, setCurrentMonth] = useState(firstDate.getMonth());
  const [currentYear, setCurrentYear] = useState(firstDate.getFullYear());
  const [selectedDate, setSelectedDate] = useState<DateEvaluation | null>(null);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1); }
    else setCurrentMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1); }
    else setCurrentMonth((m) => m + 1);
  };

  // Calendar grid
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const monthName = new Date(currentYear, currentMonth).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pb-20"
    >
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={onReset} className="text-text-secondary hover:text-accent-gold text-sm flex items-center gap-1.5 transition-colors">
            <ChevronLeft className="w-4 h-4" /> New Search
          </button>
          <div className="text-right text-xs text-text-muted">
            <span className="text-pink-400">{ranking.coupleProfile.partnerA.fullName}</span>
            {" × "}
            <span className="text-cyan-400">{ranking.coupleProfile.partnerB.fullName}</span>
          </div>
        </div>

        <h1 className="font-heading text-2xl text-accent-gold-light flex items-center gap-2">
          <Calendar className="w-6 h-6 text-accent-gold" /> Auspicious Wedding Dates
        </h1>

        {/* Top Dates Summary */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {ranking.bestDates.slice(0, 5).map((d) => (
            <button
              key={d.candidate.date.toISOString()}
              onClick={() => setSelectedDate(d)}
              className="flex-shrink-0 rounded-xl px-4 py-3 text-center transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg, rgba(74,222,128,0.1), rgba(17,13,31,0.9))",
                border: "1px solid rgba(74,222,128,0.2)",
                minWidth: "110px",
              }}
            >
              <p className="text-emerald-400 text-xs font-semibold">
                {d.candidate.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </p>
              <p className="text-text-muted text-xs">{d.candidate.dayOfWeek}</p>
              <p className="text-emerald-300 text-sm font-bold mt-1">{d.score}</p>
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#4ade80" }} /> Auspicious
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#facc15" }} /> Neutral
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#f87171" }} /> Avoid
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }} /> Not evaluated
          </div>
        </div>

        {/* Month Nav */}
        <div className="flex items-center justify-between">
          <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
            <ChevronLeft className="w-5 h-5 text-text-secondary" />
          </button>
          <h3 className="font-heading text-lg text-text-primary">{monthName}</h3>
          <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
            <ChevronRight className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div
          className="rounded-xl p-4"
          style={{ background: "rgba(17,13,31,0.8)", border: "1px solid rgba(212,168,83,0.1)" }}
        >
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS_OF_WEEK.map((d) => (
              <div key={d} className="text-center text-xs text-text-muted font-semibold py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} />;
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const evaluation = dateMap.get(dateStr);
              const rating = evaluation?.rating;
              const colors = rating ? RATING_COLORS[rating] : null;

              return (
                <button
                  key={dateStr}
                  onClick={() => evaluation && setSelectedDate(evaluation)}
                  className="aspect-square rounded-lg flex flex-col items-center justify-center text-xs transition-all hover:scale-110 relative"
                  style={{
                    background: colors?.bg || "rgba(255,255,255,0.02)",
                    border: `1px solid ${colors?.border || "rgba(255,255,255,0.04)"}`,
                    cursor: evaluation ? "pointer" : "default",
                  }}
                  aria-label={`${monthName} ${day}${evaluation ? `, ${rating}` : ""}`}
                >
                  <span style={{ color: colors?.text || "var(--text-muted)" }}>{day}</span>
                  {evaluation && (
                    <span
                      className="absolute bottom-0.5 w-1 h-1 rounded-full"
                      style={{ background: colors?.dot }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Date Detail Expansion */}
        <AnimatePresence>
          {selectedDate && (
            <motion.div
              key={selectedDate.candidate.date.toISOString()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="rounded-xl p-5 space-y-4"
              style={{
                background: "linear-gradient(135deg, rgba(17,13,31,0.95), rgba(26,20,48,0.95))",
                border: `1px solid ${RATING_COLORS[selectedDate.rating].border}`,
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg" style={{ color: RATING_COLORS[selectedDate.rating].text }}>
                    {selectedDate.candidate.date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                  </h3>
                  <p className="text-text-muted text-xs">
                    {selectedDate.candidate.dayPillar.stemChinese}{selectedDate.candidate.dayPillar.branchChinese} · {selectedDate.candidate.weton}
                  </p>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-bold font-heading" style={{ color: RATING_COLORS[selectedDate.rating].text }}>
                    {selectedDate.score}
                  </span>
                  <p
                    className="text-xs capitalize font-semibold"
                    style={{ color: RATING_COLORS[selectedDate.rating].text }}
                  >
                    {selectedDate.rating}
                  </p>
                </div>
              </div>

              {/* Signal Chips */}
              <div className="flex flex-wrap gap-1.5">
                {selectedDate.signals.map((s, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
                    style={{
                      background: `${SIGNAL_COLORS[s.system] || "#94a3b8"}15`,
                      color: SIGNAL_COLORS[s.system] || "#94a3b8",
                      border: `1px solid ${SIGNAL_COLORS[s.system] || "#94a3b8"}25`,
                    }}
                  >
                    {s.type === "positive" ? <Star className="w-3 h-3" /> : s.type === "negative" ? <AlertTriangle className="w-3 h-3" /> : <Info className="w-3 h-3" />}
                    {s.label}
                  </span>
                ))}
              </div>

              {/* Reason Trace Accordion */}
              <div className="space-y-2">
                <h4 className="text-xs text-accent-gold font-semibold uppercase tracking-wider">Why this date?</h4>
                {selectedDate.signals.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-2 text-xs text-text-secondary rounded-lg p-2.5"
                    style={{ background: "rgba(17,13,31,0.5)" }}
                  >
                    <span
                      className="w-1.5 h-1.5 mt-1.5 rounded-full flex-shrink-0"
                      style={{ background: s.type === "positive" ? "#4ade80" : s.type === "negative" ? "#f87171" : "#94a3b8" }}
                    />
                    <div>
                      <span className="font-semibold" style={{ color: SIGNAL_COLORS[s.system] }}>{s.label}:</span>{" "}
                      {s.description}
                    </div>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={() => setSelectedDate(null)}
                className="text-xs text-text-muted hover:text-text-secondary transition-colors"
              >
                Close detail
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Avoid Dates Section */}
        {ranking.avoidDates.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-heading text-sm text-red-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Dates to Avoid
            </h3>
            <div className="space-y-2">
              {ranking.avoidDates.slice(0, 5).map((d) => (
                <div
                  key={d.candidate.date.toISOString()}
                  className="flex items-center justify-between rounded-lg p-3"
                  style={{ background: "rgba(248,113,113,0.04)", border: "1px solid rgba(248,113,113,0.1)" }}
                >
                  <div>
                    <p className="text-red-400 text-xs font-semibold">
                      {d.candidate.date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    </p>
                    <p className="text-text-muted text-xs">{d.reasonTrace}</p>
                  </div>
                  <span className="text-red-400 text-xs font-bold">{d.score}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
