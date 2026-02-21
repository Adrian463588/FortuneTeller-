"use client";

import { motion, AnimatePresence } from "framer-motion";
import { User, Calendar, Clock, Users, ChevronRight, Heart, ArrowLeft } from "lucide-react";
import { useState } from "react";
import type { BirthProfile } from "@/utils/types";

interface CoupleFormProps {
  onSubmit: (partnerA: BirthProfile, partnerB: BirthProfile) => void;
  isLoading: boolean;
}

interface PartnerFormData {
  fullName: string;
  dateOfBirth: string;
  timeOfBirth: string;
  gender: "male" | "female";
}

const emptyPartner: PartnerFormData = { fullName: "", dateOfBirth: "", timeOfBirth: "", gender: "male" };

function PartnerInputCard({
  label,
  partner,
  setPartner,
  color,
}: {
  label: string;
  partner: PartnerFormData;
  setPartner: (p: PartnerFormData) => void;
  color: string;
}) {
  return (
    <div className="space-y-4">
      <h3 className="font-heading text-lg font-semibold" style={{ color }}>
        {label}
      </h3>
      <div>
        <label className="flex items-center gap-2 text-xs text-text-secondary mb-1.5 uppercase tracking-wider">
          <User className="w-3.5 h-3.5" style={{ color }} /> Full Name
        </label>
        <input
          type="text"
          value={partner.fullName}
          onChange={(e) => setPartner({ ...partner, fullName: e.target.value })}
          placeholder="Enter birth name..."
          className="input-mystic w-full px-4 py-2.5 rounded-xl text-sm"
        />
      </div>
      <div>
        <label className="flex items-center gap-2 text-xs text-text-secondary mb-1.5 uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5" style={{ color }} /> Date of Birth
        </label>
        <input
          type="date"
          value={partner.dateOfBirth}
          onChange={(e) => setPartner({ ...partner, dateOfBirth: e.target.value })}
          className="input-mystic w-full px-4 py-2.5 rounded-xl text-sm"
          style={{ colorScheme: "dark" }}
        />
      </div>
      <div>
        <label className="flex items-center gap-2 text-xs text-text-secondary mb-1.5 uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5" style={{ color }} /> Time of Birth
          <span className="text-text-muted normal-case tracking-normal">(optional)</span>
        </label>
        <input
          type="time"
          value={partner.timeOfBirth}
          onChange={(e) => setPartner({ ...partner, timeOfBirth: e.target.value })}
          className="input-mystic w-full px-4 py-2.5 rounded-xl text-sm"
          style={{ colorScheme: "dark" }}
        />
      </div>
      <div>
        <label className="flex items-center gap-2 text-xs text-text-secondary mb-1.5 uppercase tracking-wider">
          <Users className="w-3.5 h-3.5" style={{ color }} /> Gender
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(["male", "female"] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setPartner({ ...partner, gender: g })}
              className="py-2 rounded-xl text-xs font-semibold capitalize transition-all"
              style={{
                background: partner.gender === g
                  ? `linear-gradient(135deg, ${color}33, ${color}22)`
                  : "rgba(17,13,31,0.6)",
                border: partner.gender === g
                  ? `1px solid ${color}66`
                  : "1px solid rgba(212,168,83,0.1)",
                color: partner.gender === g ? color : "var(--text-secondary)",
              }}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CoupleForm({ onSubmit, isLoading }: CoupleFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [partnerA, setPartnerA] = useState<PartnerFormData>(emptyPartner);
  const [partnerB, setPartnerB] = useState<PartnerFormData>(emptyPartner);
  const [errors, setErrors] = useState<string>("");

  const validatePartner = (p: PartnerFormData, label: string): string | null => {
    if (!p.fullName.trim()) return `${label}: Please enter a name.`;
    if (!p.dateOfBirth) return `${label}: Please enter a date of birth.`;
    return null;
  };

  const handleNext = () => {
    const err = validatePartner(partnerA, "Partner A");
    if (err) { setErrors(err); return; }
    setErrors("");
    setStep(2);
  };

  const handleSubmit = () => {
    const err = validatePartner(partnerB, "Partner B");
    if (err) { setErrors(err); return; }
    setErrors("");

    const profileA: BirthProfile = {
      fullName: partnerA.fullName.trim(),
      dateOfBirth: new Date(partnerA.dateOfBirth),
      timeOfBirth: partnerA.timeOfBirth || undefined,
      gender: partnerA.gender,
    };
    const profileB: BirthProfile = {
      fullName: partnerB.fullName.trim(),
      dateOfBirth: new Date(partnerB.dateOfBirth),
      timeOfBirth: partnerB.timeOfBirth || undefined,
      gender: partnerB.gender,
    };
    onSubmit(profileA, profileB);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
    >
      {/* Title */}
      <motion.div className="text-center mb-8">
        <div
          className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full"
          style={{
            background: "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(244,114,182,0.15))",
            border: "1px solid rgba(244,114,182,0.25)",
          }}
        >
          <Heart className="w-4 h-4 text-pink-400" />
          <span className="text-xs text-pink-300 tracking-widest uppercase">合婚 · He Hun</span>
        </div>
        <h1 className="font-heading text-3xl md:text-5xl font-bold mb-3">
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg, #f472b6, #d4a853, #f472b6)", backgroundSize: "200% 200%", animation: "shimmer 4s linear infinite" }}
          >
            Match & Marry
          </span>
        </h1>
        <p className="text-text-secondary max-w-md mx-auto text-sm">
          Enter both partners' details to reveal your cosmic compatibility across BaZi, Weton, Zodiac, and Shio.
        </p>
      </motion.div>

      {/* Stepper Indicator */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? "bg-pink-500/20 text-pink-400 border border-pink-500/40" : "bg-bg-deep text-text-muted border border-white/10"}`}>A</div>
        <div className="w-8 h-px" style={{ background: step >= 2 ? "rgba(244,114,182,0.4)" : "rgba(255,255,255,0.1)" }} />
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? "bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/40" : "bg-bg-deep text-text-muted border border-white/10"}`}>B</div>
      </div>

      {/* Form Card */}
      <div
        className="w-full max-w-md rounded-2xl p-6 md:p-8"
        style={{
          background: "linear-gradient(135deg, rgba(17,13,31,0.95), rgba(26,20,48,0.95))",
          border: "1px solid rgba(212,168,83,0.15)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="stepA"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <PartnerInputCard label="Partner A" partner={partnerA} setPartner={setPartnerA} color="#f472b6" />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="w-full mt-5 py-3 rounded-xl font-heading font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #f472b6, #d4a853)",
                  color: "#0a0613",
                }}
              >
                Continue to Partner B <ChevronRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="stepB"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary mb-3 transition-colors"
              >
                <ArrowLeft className="w-3 h-3" /> Back to Partner A
              </button>
              <PartnerInputCard label="Partner B" partner={partnerB} setPartner={setPartnerB} color="#22d3ee" />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full mt-5 py-3 rounded-xl font-heading font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2 disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #22d3ee, #d4a853)",
                  color: "#0a0613",
                }}
              >
                <Heart className="w-4 h-4" />
                {isLoading ? "Weaving the Stars..." : "Calculate Compatibility"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {errors && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-xs mt-3 text-center"
          >
            {errors}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
