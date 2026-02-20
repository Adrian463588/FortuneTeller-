"use client";

import { motion } from "framer-motion";
import { Compass, Hash, Layers } from "lucide-react";
import type { ReadingResult } from "@/utils/types";
import { ElementChart } from "@/components/ui/PredictionCard";

export default function PersonalityTab({ reading }: { reading: ReadingResult }) {
  const { bazi, westernZodiac, chineseZodiac, numerology } = reading;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* BaZi Four Pillars */}
      <section>
        <h2 className="font-heading text-xl text-accent-gold-light mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-accent-gold" />
          Four Pillars of Destiny (BaZi / Saju Palja)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {([
            { label: "Year Pillar", pillar: bazi.yearPillar },
            { label: "Month Pillar", pillar: bazi.monthPillar },
            { label: "Day Pillar", pillar: bazi.dayPillar },
            { label: "Hour Pillar", pillar: bazi.hourPillar },
          ] as const).map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl p-4 text-center"
              style={{
                background: "linear-gradient(135deg, rgba(17,13,31,0.9), rgba(26,20,48,0.9))",
                border: "1px solid rgba(212,168,83,0.15)",
              }}
            >
              <p className="text-text-muted text-xs mb-2 uppercase tracking-wider">{item.label}</p>
              <div className="text-3xl mb-2 font-heading">
                <span className="text-accent-gold">{item.pillar.stemChinese}</span>
                <span className="text-accent-cyan ml-1">{item.pillar.branchChinese}</span>
              </div>
              <p className="text-text-secondary text-xs">
                {item.pillar.heavenlyStem} · {item.pillar.earthlyBranch}
              </p>
              <div className="flex justify-center gap-1 mt-2">
                <span className="px-1.5 py-0.5 rounded text-xs bg-accent-gold/10 text-accent-gold">
                  {item.pillar.stemElement}
                </span>
                <span className="px-1.5 py-0.5 rounded text-xs bg-accent-cyan/10 text-accent-cyan">
                  {item.pillar.branchElement}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Element Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl p-5"
          style={{
            background: "linear-gradient(135deg, rgba(17,13,31,0.9), rgba(26,20,48,0.9))",
            border: "1px solid rgba(212,168,83,0.1)",
          }}
        >
          <h3 className="font-heading text-sm text-accent-gold-light mb-3">Element Balance</h3>
          <ElementChart balance={bazi.elementBalance} />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="text-center p-2 rounded-lg" style={{ background: "rgba(74,222,128,0.08)" }}>
              <p className="text-text-muted text-xs">Dominant</p>
              <p className="text-emerald-400 font-semibold text-sm">{bazi.dominantElement}</p>
            </div>
            <div className="text-center p-2 rounded-lg" style={{ background: "rgba(248,113,113,0.08)" }}>
              <p className="text-text-muted text-xs">Weakest</p>
              <p className="text-red-400 font-semibold text-sm">{bazi.weakestElement}</p>
            </div>
          </div>
        </motion.div>

        {/* Day Master Personality */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-xl p-5 mt-4"
          style={{
            background: "linear-gradient(135deg, rgba(17,13,31,0.9), rgba(26,20,48,0.9))",
            border: "1px solid rgba(155,89,182,0.15)",
          }}
        >
          <h3 className="font-heading text-sm text-accent-purple mb-2">
            {bazi.dayMaster} Day Master Personality
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">{bazi.personality}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-2">
                Strengths
              </h4>
              <ul className="space-y-1">
                {bazi.strengths.map((s) => (
                  <li key={s} className="text-text-secondary text-xs flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs text-red-400 font-semibold uppercase tracking-wider mb-2">
                Challenges
              </h4>
              <ul className="space-y-1">
                {bazi.challenges.map((c) => (
                  <li key={c} className="text-text-secondary text-xs flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full" /> {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Western Zodiac Details */}
      <section>
        <h2 className="font-heading text-xl text-accent-gold-light mb-4 flex items-center gap-2">
          <Compass className="w-5 h-5 text-accent-gold" />
          Western Zodiac — {westernZodiac.sign} {westernZodiac.symbol}
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl p-5"
          style={{
            background: "linear-gradient(135deg, rgba(17,13,31,0.9), rgba(26,20,48,0.9))",
            border: "1px solid rgba(212,168,83,0.15)",
          }}
        >
          <div className="flex flex-wrap gap-2 mb-4">
            {westernZodiac.traits.map((t) => (
              <span key={t} className="px-2.5 py-1 rounded-full text-xs bg-accent-gold/10 text-accent-gold">
                {t}
              </span>
            ))}
          </div>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">{westernZodiac.description}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-2">Strengths</h4>
              <ul className="space-y-1">
                {westernZodiac.strengths.map((s) => (
                  <li key={s} className="text-text-secondary text-xs flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs text-red-400 font-semibold uppercase tracking-wider mb-2">Weaknesses</h4>
              <ul className="space-y-1">
                {westernZodiac.weaknesses.map((w) => (
                  <li key={w} className="text-text-secondary text-xs flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full" /> {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Chinese Zodiac */}
      <section>
        <h2 className="font-heading text-xl text-accent-purple mb-4 flex items-center gap-2">
          <Compass className="w-5 h-5 text-accent-purple" />
          Chinese Zodiac — {chineseZodiac.animal}
        </h2>
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
          <div className="flex flex-wrap gap-2 mb-4">
            {chineseZodiac.traits.map((t) => (
              <span key={t} className="px-2.5 py-1 rounded-full text-xs bg-accent-purple/10 text-accent-purple">
                {t}
              </span>
            ))}
          </div>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">{chineseZodiac.description}</p>
          <div>
            <h4 className="text-xs text-accent-cyan font-semibold uppercase tracking-wider mb-2">
              Compatible With
            </h4>
            <div className="flex flex-wrap gap-2">
              {chineseZodiac.compatibility.map((c) => (
                <span key={c} className="px-2.5 py-1 rounded-full text-xs bg-accent-cyan/10 text-accent-cyan">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Name Numerology */}
      <section>
        <h2 className="font-heading text-xl text-accent-cyan mb-4 flex items-center gap-2">
          <Hash className="w-5 h-5 text-accent-cyan" />
          Name Numerology
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl p-5"
          style={{
            background: "linear-gradient(135deg, rgba(17,13,31,0.9), rgba(26,20,48,0.9))",
            border: "1px solid rgba(0,229,255,0.15)",
          }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="text-center p-3 rounded-xl" style={{ background: "rgba(0,229,255,0.08)" }}>
              <p className="text-text-muted text-xs">Expression</p>
              <p className="text-accent-cyan font-heading font-bold text-2xl">{numerology.expression}</p>
            </div>
            <div className="text-center p-3 rounded-xl" style={{ background: "rgba(212,168,83,0.08)" }}>
              <p className="text-text-muted text-xs">Life Path</p>
              <p className="text-accent-gold font-heading font-bold text-2xl">{numerology.lifePath}</p>
            </div>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">{numerology.interpretation}</p>
          <div className="flex flex-wrap gap-2">
            {numerology.traits.map((t) => (
              <span key={t} className="px-2.5 py-1 rounded-full text-xs bg-accent-cyan/10 text-accent-cyan">
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
}
