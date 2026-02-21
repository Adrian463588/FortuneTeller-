"use client";

import { motion } from "framer-motion";
import { Compass, Star, ShieldAlert, BookOpen, Palette, ArrowUpRight } from "lucide-react";
import type { ReadingResult } from "@/utils/types";

const DIRECTION_ANGLES: Record<string, number> = {
  North: 0, Northeast: 45, East: 90, Southeast: 135,
  South: 180, Southwest: 225, West: 270, Northwest: 315,
};

export default function FengShuiTab({ reading }: { reading: ReadingResult }) {
  const { fengShui } = reading;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Kua Number Header */}
      <section>
        <h2 className="font-heading text-xl text-accent-gold-light mb-4 flex items-center gap-2">
          <Compass className="w-5 h-5 text-accent-gold" />
          Personal Feng Shui — Kua Number
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-6 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(17,13,31,0.9), rgba(26,20,48,0.9))",
            border: "1px solid rgba(212,168,83,0.2)",
            boxShadow: "0 0 40px rgba(212,168,83,0.05)",
          }}
        >
          <p className="text-text-muted text-xs uppercase tracking-widest mb-2">Your Kua Number</p>
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3"
            style={{
              background: "linear-gradient(135deg, rgba(212,168,83,0.2), rgba(155,89,182,0.2))",
              boxShadow: "0 0 30px rgba(212,168,83,0.2)",
            }}
          >
            <span className="font-heading text-4xl font-bold text-accent-gold-light">
              {fengShui.kuaNumber}
            </span>
          </div>
          <div className="flex justify-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs bg-accent-gold/10 text-accent-gold">
              {fengShui.group} Group
            </span>
            <span className="px-3 py-1 rounded-full text-xs bg-accent-cyan/10 text-accent-cyan">
              {fengShui.luckyElement} Element
            </span>
          </div>
          <div className="flex justify-center gap-2">
            {fengShui.luckyColors.map((c) => (
              <span key={c} className="px-2.5 py-1 rounded-full text-xs bg-accent-purple/10 text-accent-purple">
                {c}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Compass Visual */}
      <section>
        <h2 className="font-heading text-lg text-accent-gold-light mb-4 flex items-center gap-2">
          <Star className="w-4 h-4 text-accent-gold" />
          Lucky & Unlucky Directions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Lucky */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl p-5"
            style={{
              background: "rgba(74,222,128,0.03)",
              border: "1px solid rgba(74,222,128,0.15)",
            }}
          >
            <h3 className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
              <ArrowUpRight className="w-3.5 h-3.5" /> Lucky Directions
            </h3>
            <div className="space-y-3">
              {fengShui.luckyDirections.map((d, i) => (
                <motion.div
                  key={d.direction}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="rounded-lg p-3"
                  style={{ background: "rgba(17,13,31,0.6)" }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-emerald-400 font-semibold text-sm">{d.direction}</span>
                    <span className="text-xs text-text-muted">{d.label}</span>
                  </div>
                  <p className="text-text-secondary text-xs">{d.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Unlucky */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl p-5"
            style={{
              background: "rgba(248,113,113,0.03)",
              border: "1px solid rgba(248,113,113,0.15)",
            }}
          >
            <h3 className="text-xs text-red-400 font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5" /> Unfavorable Directions
            </h3>
            <div className="space-y-3">
              {fengShui.unluckyDirections.map((d, i) => (
                <motion.div
                  key={d.direction}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i + 0.2 }}
                  className="rounded-lg p-3"
                  style={{ background: "rgba(17,13,31,0.6)" }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-red-400 font-semibold text-sm">{d.direction}</span>
                    <span className="text-xs text-text-muted">{d.label}</span>
                  </div>
                  <p className="text-text-secondary text-xs">{d.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recommendations */}
      <section>
        <h2 className="font-heading text-lg text-accent-gold-light mb-4 flex items-center gap-2">
          <Palette className="w-4 h-4 text-accent-gold" />
          Personalized Recommendations
        </h2>
        <div className="space-y-3">
          {fengShui.recommendations.map((rec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              whileHover={{ x: 4 }}
              className="flex items-start gap-3 rounded-xl p-4"
              style={{
                background: "linear-gradient(135deg, rgba(17,13,31,0.9), rgba(26,20,48,0.9))",
                border: "1px solid rgba(212,168,83,0.1)",
              }}
            >
              <span className="text-accent-gold text-sm mt-0.5">{i + 1}.</span>
              <p className="text-text-secondary text-sm leading-relaxed">{rec}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Flying Star Explainer */}
      <section>
        <h2 className="font-heading text-lg text-accent-cyan mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-accent-cyan" />
          {fengShui.flyingStarExplainer.title}
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl p-5 space-y-4"
          style={{
            background: "linear-gradient(135deg, rgba(17,13,31,0.9), rgba(26,20,48,0.9))",
            border: "1px solid rgba(0,229,255,0.1)",
          }}
        >
          <div>
            <h4 className="text-xs text-accent-cyan font-semibold uppercase tracking-wider mb-2">
              Overview
            </h4>
            <p className="text-text-secondary text-sm leading-relaxed">
              {fengShui.flyingStarExplainer.overview}
            </p>
          </div>
          <div
            className="rounded-lg p-4"
            style={{ background: "rgba(248,191,72,0.05)", border: "1px solid rgba(248,191,72,0.1)" }}
          >
            <h4 className="text-xs text-yellow-400 font-semibold uppercase tracking-wider mb-2">
              ⚠ Limitations of This Reading
            </h4>
            <p className="text-text-secondary text-sm leading-relaxed">
              {fengShui.flyingStarExplainer.limitations}
            </p>
          </div>
          <div>
            <h4 className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-2">
              Recommendation
            </h4>
            <p className="text-text-secondary text-sm leading-relaxed">
              {fengShui.flyingStarExplainer.advice}
            </p>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
}
