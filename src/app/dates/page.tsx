"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays, User, Calendar, Clock, Users, Heart,
  ChevronRight, ArrowLeft,
} from "lucide-react";
import AuspiciousCalendar from "@/components/AuspiciousCalendar";
import { rankWeddingDates } from "@/utils/zeRiEngine";
import type { BirthProfile, DateRanking } from "@/utils/types";

interface PartnerData {
  fullName: string;
  dateOfBirth: string;
  timeOfBirth: string;
  gender: "male" | "female";
}

const emptyPartner: PartnerData = { fullName: "", dateOfBirth: "", timeOfBirth: "", gender: "male" };

function PartnerMini({ label, color, partner, setPartner }: {
  label: string; color: string;
  partner: PartnerData; setPartner: (p: PartnerData) => void;
}) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color }}>{label}</h4>
      <input
        type="text" placeholder="Full Name" value={partner.fullName}
        onChange={(e) => setPartner({ ...partner, fullName: e.target.value })}
        className="input-mystic w-full px-3 py-2 rounded-lg text-xs"
      />
      <input
        type="date" value={partner.dateOfBirth}
        onChange={(e) => setPartner({ ...partner, dateOfBirth: e.target.value })}
        className="input-mystic w-full px-3 py-2 rounded-lg text-xs"
        style={{ colorScheme: "dark" }}
      />
      <input
        type="time" value={partner.timeOfBirth}
        onChange={(e) => setPartner({ ...partner, timeOfBirth: e.target.value })}
        className="input-mystic w-full px-3 py-2 rounded-lg text-xs"
        style={{ colorScheme: "dark" }}
      />
      <div className="grid grid-cols-2 gap-2">
        {(["male", "female"] as const).map((g) => (
          <button
            key={g} type="button"
            onClick={() => setPartner({ ...partner, gender: g })}
            className="py-1.5 rounded-lg text-xs capitalize transition-all"
            style={{
              background: partner.gender === g ? `${color}22` : "rgba(17,13,31,0.6)",
              border: `1px solid ${partner.gender === g ? `${color}55` : "rgba(212,168,83,0.1)"}`,
              color: partner.gender === g ? color : "var(--text-secondary)",
            }}
          >
            {g}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function DatesPage() {
  const [partnerA, setPartnerA] = useState<PartnerData>(emptyPartner);
  const [partnerB, setPartnerB] = useState<PartnerData>(emptyPartner);
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [result, setResult] = useState<DateRanking | null>(null);
  const [errors, setErrors] = useState("");

  const handleSearch = () => {
    if (!partnerA.fullName || !partnerA.dateOfBirth || !partnerB.fullName || !partnerB.dateOfBirth) {
      setErrors("Please fill in both partners' name and date of birth.");
      return;
    }
    if (!dateStart || !dateEnd) {
      setErrors("Please select a date range to search.");
      return;
    }
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

    const ranking = rankWeddingDates(
      { partnerA: profileA, partnerB: profileB },
      new Date(dateStart),
      new Date(dateEnd),
      10
    );
    setResult(ranking);
  };

  const handleReset = () => {
    setResult(null);
  };

  if (result) {
    return <AuspiciousCalendar ranking={result} onReset={handleReset} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
    >
      {/* Title */}
      <div className="text-center mb-8">
        <div
          className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full"
          style={{
            background: "linear-gradient(135deg, rgba(212,168,83,0.15), rgba(34,211,238,0.15))",
            border: "1px solid rgba(212,168,83,0.2)",
          }}
        >
          <CalendarDays className="w-4 h-4 text-accent-gold" />
          <span className="text-xs text-accent-gold-light tracking-widest uppercase">择日 · Ze Ri</span>
        </div>
        <h1 className="font-heading text-3xl md:text-5xl font-bold mb-3">
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg, #d4a853, #22d3ee, #d4a853)", backgroundSize: "200% 200%", animation: "shimmer 4s linear infinite" }}
          >
            Wedding Date Finder
          </span>
        </h1>
        <p className="text-text-secondary max-w-md mx-auto text-sm">
          Find the most auspicious wedding dates based on both partners' BaZi, Weton, and cosmic alignment.
        </p>
      </div>

      {/* Form */}
      <div
        className="w-full max-w-lg rounded-2xl p-6 space-y-5"
        style={{
          background: "linear-gradient(135deg, rgba(17,13,31,0.95), rgba(26,20,48,0.95))",
          border: "1px solid rgba(212,168,83,0.15)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <PartnerMini label="Partner A" color="#f472b6" partner={partnerA} setPartner={setPartnerA} />
          <PartnerMini label="Partner B" color="#22d3ee" partner={partnerB} setPartner={setPartnerB} />
        </div>

        <div
          className="h-px w-full"
          style={{ background: "linear-gradient(90deg, transparent, rgba(212,168,83,0.15), transparent)" }}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-text-secondary mb-1 block uppercase tracking-wider">
              Start Date
            </label>
            <input
              type="date" value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
              className="input-mystic w-full px-3 py-2 rounded-lg text-xs"
              style={{ colorScheme: "dark" }}
            />
          </div>
          <div>
            <label className="text-xs text-text-secondary mb-1 block uppercase tracking-wider">
              End Date
            </label>
            <input
              type="date" value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
              className="input-mystic w-full px-3 py-2 rounded-lg text-xs"
              style={{ colorScheme: "dark" }}
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSearch}
          className="w-full py-3 rounded-xl font-heading font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2"
          style={{
            background: "linear-gradient(135deg, #d4a853, #22d3ee)",
            color: "#0a0613",
          }}
        >
          <CalendarDays className="w-4 h-4" /> Find Auspicious Dates
        </motion.button>

        {errors && (
          <p className="text-red-400 text-xs text-center">{errors}</p>
        )}
      </div>
    </motion.div>
  );
}
