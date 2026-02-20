"use client";

import { motion } from "framer-motion";
import { Star, Sparkles, TrendingUp, Gem } from "lucide-react";
import type { ReadingResult } from "@/utils/types";
import { PredictionCard, ElementChart } from "@/components/ui/PredictionCard";

export default function OverviewTab({ reading }: { reading: ReadingResult }) {
  const { westernZodiac, chineseZodiac, bazi, weton, numerology, coreDomains } = reading;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Profile Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Western Zodiac Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl p-5"
          style={{
            background: "linear-gradient(135deg, rgba(17,13,31,0.9), rgba(26,20,48,0.9))",
            border: "1px solid rgba(212,168,83,0.15)",
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{westernZodiac.symbol}</span>
            <div>
              <h3 className="font-heading text-accent-gold-light font-semibold text-sm">
                {westernZodiac.sign}
              </h3>
              <p className="text-text-muted text-xs">{westernZodiac.dateRange}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            <span className="px-2 py-0.5 rounded-full text-xs bg-accent-gold/10 text-accent-gold">
              {westernZodiac.element}
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-accent-purple/10 text-accent-purple">
              {westernZodiac.quality}
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-accent-cyan/10 text-accent-cyan">
              {westernZodiac.rulingPlanet}
            </span>
          </div>
          <p className="text-text-secondary text-xs leading-relaxed">{westernZodiac.description}</p>
        </motion.div>

        {/* Chinese Zodiac Card */}
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
          <div className="flex items-center gap-3 mb-3">
            <Gem className="w-7 h-7 text-accent-purple" />
            <div>
              <h3 className="font-heading text-accent-purple font-semibold text-sm">
                {chineseZodiac.animal}
              </h3>
              <p className="text-text-muted text-xs">Chinese Zodiac</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            <span className="px-2 py-0.5 rounded-full text-xs bg-accent-purple/10 text-accent-purple">
              {chineseZodiac.element}
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-accent-gold/10 text-accent-gold">
              {chineseZodiac.yinYang}
            </span>
          </div>
          <p className="text-text-secondary text-xs leading-relaxed">{chineseZodiac.description}</p>
        </motion.div>

        {/* BaZi Day Master Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl p-5"
          style={{
            background: "linear-gradient(135deg, rgba(17,13,31,0.9), rgba(26,20,48,0.9))",
            border: "1px solid rgba(0,229,255,0.15)",
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-7 h-7 text-accent-cyan" />
            <div>
              <h3 className="font-heading text-accent-cyan font-semibold text-sm">
                {bazi.dayMaster} Day Master
              </h3>
              <p className="text-text-muted text-xs">BaZi / Saju Palja</p>
            </div>
          </div>
          <div className="mb-3">
            <p className="text-text-muted text-xs mb-2 uppercase tracking-wider">Element Balance</p>
            <ElementChart balance={bazi.elementBalance} />
          </div>
        </motion.div>
      </div>

      {/* Quick Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {[
          { label: "Weton", value: weton.weton, color: "text-accent-gold" },
          { label: "Total Neptu", value: weton.totalNeptu.toString(), color: "text-accent-cyan" },
          { label: "Life Number", value: numerology.expression.toString(), color: "text-accent-purple" },
          { label: "Dominant Element", value: bazi.dominantElement, color: "text-accent-gold-light" },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="rounded-xl p-4 text-center"
            style={{
              background: "rgba(17,13,31,0.8)",
              border: "1px solid rgba(212,168,83,0.1)",
            }}
          >
            <p className="text-text-muted text-xs mb-1">{stat.label}</p>
            <p className={`font-heading font-bold text-lg ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Core Domains */}
      <div>
        <h2 className="font-heading text-xl text-accent-gold-light mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent-gold" />
          Life Domain Readings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coreDomains.map((domain, i) => (
            <PredictionCard key={domain.category} prediction={domain} index={i} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
