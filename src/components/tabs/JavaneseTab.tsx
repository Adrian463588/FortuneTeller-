"use client";

import { motion } from "framer-motion";
import { Moon, Coins, Heart, Briefcase, Activity } from "lucide-react";
import type { ReadingResult } from "@/utils/types";

export default function JavaneseTab({ reading }: { reading: ReadingResult }) {
  const { weton } = reading;

  const fortuneIcons: Record<string, React.ReactNode> = {
    wealth: <Coins className="w-4 h-4" />,
    love: <Heart className="w-4 h-4" />,
    career: <Briefcase className="w-4 h-4" />,
    health: <Activity className="w-4 h-4" />,
  };

  const fortuneColors: Record<string, string> = {
    wealth: "text-accent-gold",
    love: "text-pink-400",
    career: "text-accent-cyan",
    health: "text-emerald-400",
  };

  const fortuneBorderColors: Record<string, string> = {
    wealth: "rgba(212,168,83,0.15)",
    love: "rgba(236,72,153,0.15)",
    career: "rgba(0,229,255,0.15)",
    health: "rgba(52,211,153,0.15)",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Weton Header */}
      <section>
        <h2 className="font-heading text-xl text-accent-gold-light mb-4 flex items-center gap-2">
          <Moon className="w-5 h-5 text-accent-gold" />
          Javanese Weton & Neptu System
        </h2>

        {/* Weton Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-6 text-center mb-6"
          style={{
            background: "linear-gradient(135deg, rgba(17,13,31,0.9), rgba(26,20,48,0.9))",
            border: "1px solid rgba(212,168,83,0.2)",
            boxShadow: "0 0 40px rgba(212,168,83,0.05)",
          }}
        >
          <p className="text-text-muted text-xs uppercase tracking-widest mb-2">Your Weton</p>
          <h3 className="font-heading text-3xl md:text-4xl text-accent-gold-light font-bold mb-4">
            {weton.weton}
          </h3>

          <div className="flex justify-center gap-6 mb-6">
            <div className="text-center">
              <p className="text-text-muted text-xs mb-1">Day ({weton.dayOfWeek})</p>
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto"
                style={{ background: "rgba(212,168,83,0.15)" }}
              >
                <span className="text-accent-gold font-heading text-xl font-bold">
                  {weton.dayNeptu}
                </span>
              </div>
              <p className="text-text-muted text-xs mt-1">Neptu</p>
            </div>
            <div className="flex items-center text-text-muted text-2xl font-light">+</div>
            <div className="text-center">
              <p className="text-text-muted text-xs mb-1">{weton.pasaran}</p>
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto"
                style={{ background: "rgba(155,89,182,0.15)" }}
              >
                <span className="text-accent-purple font-heading text-xl font-bold">
                  {weton.pasaranNeptu}
                </span>
              </div>
              <p className="text-text-muted text-xs mt-1">Neptu</p>
            </div>
            <div className="flex items-center text-text-muted text-2xl font-light">=</div>
            <div className="text-center">
              <p className="text-text-muted text-xs mb-1">Total</p>
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto"
                style={{
                  background: "linear-gradient(135deg, rgba(212,168,83,0.2), rgba(155,89,182,0.2))",
                  boxShadow: "0 0 20px rgba(212,168,83,0.15)",
                }}
              >
                <span className="text-accent-gold-light font-heading text-xl font-bold">
                  {weton.totalNeptu}
                </span>
              </div>
              <p className="text-text-muted text-xs mt-1">Neptu</p>
            </div>
          </div>

          {/* Traits */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {weton.traits.map((t) => (
              <span
                key={t}
                className="px-3 py-1 rounded-full text-xs bg-accent-gold/10 text-accent-gold"
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Neptu Interpretation */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl p-5"
          style={{
            background: "linear-gradient(135deg, rgba(17,13,31,0.9), rgba(26,20,48,0.9))",
            border: "1px solid rgba(155,89,182,0.15)",
          }}
        >
          <h3 className="font-heading text-sm text-accent-purple mb-3">
            Primbon Interpretation
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed">{weton.interpretation}</p>
        </motion.div>
      </section>

      {/* Neptu Lookup Reference Table */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl p-5"
          style={{
            background: "linear-gradient(135deg, rgba(17,13,31,0.9), rgba(26,20,48,0.9))",
            border: "1px solid rgba(0,229,255,0.1)",
          }}
        >
          <h3 className="font-heading text-sm text-accent-cyan mb-3">
            Neptu Reference Table
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-text-muted text-xs mb-2 uppercase tracking-wider">Day Neptu</p>
              <div className="space-y-1">
                {Object.entries({
                  "Minggu (Sunday)": 5,
                  "Senin (Monday)": 4,
                  "Selasa (Tuesday)": 3,
                  "Rabu (Wednesday)": 7,
                  "Kamis (Thursday)": 8,
                  "Jumat (Friday)": 6,
                  "Sabtu (Saturday)": 9,
                }).map(([day, val]) => (
                  <div key={day} className="flex justify-between items-center text-xs">
                    <span className={`${day.includes(weton.dayOfWeek) ? "text-accent-gold font-semibold" : "text-text-secondary"}`}>
                      {day}
                    </span>
                    <span className={`font-mono ${day.includes(weton.dayOfWeek) ? "text-accent-gold font-bold" : "text-text-muted"}`}>
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-text-muted text-xs mb-2 uppercase tracking-wider">Pasaran Neptu</p>
              <div className="space-y-1">
                {Object.entries({
                  Legi: 5,
                  Pahing: 9,
                  Pon: 7,
                  Wage: 4,
                  Kliwon: 8,
                }).map(([pas, val]) => (
                  <div key={pas} className="flex justify-between items-center text-xs">
                    <span className={`${pas === weton.pasaran ? "text-accent-purple font-semibold" : "text-text-secondary"}`}>
                      {pas}
                    </span>
                    <span className={`font-mono ${pas === weton.pasaran ? "text-accent-purple font-bold" : "text-text-muted"}`}>
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Fortune Areas */}
      <section>
        <h2 className="font-heading text-lg text-accent-gold-light mb-4">
          Weton Fortune Areas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(Object.entries(weton.fortuneAreas) as [string, string][]).map(([key, value], i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="rounded-xl p-4"
              style={{
                background: "linear-gradient(135deg, rgba(17,13,31,0.9), rgba(26,20,48,0.9))",
                border: `1px solid ${fortuneBorderColors[key]}`,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={fortuneColors[key]}>{fortuneIcons[key]}</span>
                <h3 className={`font-heading text-sm font-semibold capitalize ${fortuneColors[key]}`}>
                  {key}
                </h3>
              </div>
              <p className="text-text-secondary text-xs leading-relaxed">{value}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
