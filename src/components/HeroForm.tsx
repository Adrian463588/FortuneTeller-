"use client";

import { motion, useAnimation } from "framer-motion";
import { Sparkles, User, Calendar, Clock, Users } from "lucide-react";
import { useState, useMemo } from "react";

interface HeroFormProps {
  onSubmit: (data: { fullName: string; dateOfBirth: string; timeOfBirth: string; gender: "male" | "female" }) => void;
  isLoading: boolean;
}

// Only allow letters (incl. unicode), spaces, hyphens, apostrophes
const NAME_REGEX = /^[\p{L}\s'\-]+$/u;
const NAME_MAX_LENGTH = 100;

const shakeVariants = {
  shake: {
    x: [0, -8, 8, -6, 6, -3, 3, 0],
    transition: { duration: 0.4 },
  },
  idle: { x: 0 },
};

export default function HeroForm({ onSubmit, isLoading }: HeroFormProps) {
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [timeOfBirth, setTimeOfBirth] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const nameControls = useAnimation();
  const dobControls = useAnimation();

  // Today's date as YYYY-MM-DD for max constraint
  const today = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }, []);

  const triggerShake = (field: string) => {
    const ctrl = field === "fullName" ? nameControls : dobControls;
    ctrl.start("shake").then(() => ctrl.start("idle"));
  };

  // Filter name input: collapse multiple spaces, enforce max length
  const handleNameChange = (value: string) => {
    const cleaned = value.replace(/\s{2,}/g, " ").slice(0, NAME_MAX_LENGTH);
    setFullName(cleaned);
    if (errors.fullName) setErrors((p) => ({ ...p, fullName: "" }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const trimmedName = fullName.trim();

    // Name validation
    if (!trimmedName) {
      newErrors.fullName = "Please enter your full name.";
    } else if (trimmedName.length < 2) {
      newErrors.fullName = "Name must be at least 2 characters.";
    } else if (!NAME_REGEX.test(trimmedName)) {
      newErrors.fullName = "Name can only contain letters, spaces, hyphens, and apostrophes.";
    }

    // DOB validation
    if (!dateOfBirth) {
      newErrors.dateOfBirth = "Please enter your date of birth.";
    } else {
      const dob = new Date(dateOfBirth);
      const minDate = new Date("1900-01-01");
      const maxDate = new Date();
      if (isNaN(dob.getTime())) {
        newErrors.dateOfBirth = "Please enter a valid date.";
      } else if (dob < minDate) {
        newErrors.dateOfBirth = "Date must be after January 1, 1900.";
      } else if (dob > maxDate) {
        newErrors.dateOfBirth = "Date cannot be in the future.";
      }
    }

    setErrors(newErrors);

    // Trigger shake on invalid fields
    if (newErrors.fullName) triggerShake("fullName");
    if (newErrors.dateOfBirth) triggerShake("dateOfBirth");

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ fullName: fullName.trim().replace(/\s{2,}/g, " "), dateOfBirth, timeOfBirth, gender });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
    >
      {/* Mystical Title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <motion.div
          className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full"
          style={{
            background: "linear-gradient(135deg, rgba(212,168,83,0.15), rgba(155,89,182,0.15))",
            border: "1px solid rgba(212,168,83,0.2)",
          }}
          animate={{ boxShadow: ["0 0 10px rgba(212,168,83,0.1)", "0 0 25px rgba(212,168,83,0.25)", "0 0 10px rgba(212,168,83,0.1)"] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Sparkles className="w-4 h-4 text-accent-gold" />
          <span className="text-xs text-accent-gold-light tracking-widest uppercase">
            Mystical Divination
          </span>
        </motion.div>

        <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(135deg, #d4a853, #f0d78c, #d4a853, #9b59b6)",
              backgroundSize: "200% 200%",
              animation: "shimmer 4s linear infinite",
            }}
          >
            Unveil Your Destiny
          </span>
        </h1>
        <p className="text-text-secondary max-w-lg mx-auto text-sm md:text-base leading-relaxed">
          Harness the ancient wisdom of <span className="text-accent-gold">Saju Palja</span>,{" "}
          <span className="text-accent-cyan">BaZi</span>,{" "}
          <span className="text-accent-purple">Western Zodiac</span>,{" "}
          <span className="text-accent-gold-light">Javanese Primbon</span>, and{" "}
          <span className="text-emerald-400">Feng Shui</span> to reveal the cosmic blueprint of your life.
        </p>
      </motion.div>

      {/* Form Card */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-full max-w-md space-y-5"
      >
        <div
          className="rounded-2xl p-6 md:p-8 space-y-5"
          style={{
            background: "linear-gradient(135deg, rgba(17,13,31,0.95), rgba(26,20,48,0.95))",
            border: "1px solid rgba(212,168,83,0.15)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(212,168,83,0.05)",
          }}
        >
          {/* Full Name */}
          <div>
            <label className="flex items-center gap-2 text-xs text-text-secondary mb-2 uppercase tracking-wider">
              <User className="w-3.5 h-3.5 text-accent-gold" />
              Full Name
              <span className="ml-auto text-text-muted normal-case tracking-normal">{fullName.length}/{NAME_MAX_LENGTH}</span>
            </label>
            <motion.div variants={shakeVariants} animate={nameControls}>
              <input
                type="text"
                value={fullName}
                onChange={(e) => handleNameChange(e.target.value)}
                maxLength={NAME_MAX_LENGTH}
                placeholder="Enter your birth name..."
                className="input-mystic w-full px-4 py-3 rounded-xl text-sm"
                style={{ borderColor: errors.fullName ? "rgba(248,113,113,0.5)" : undefined }}
                aria-invalid={!!errors.fullName}
                aria-describedby={errors.fullName ? "name-error" : undefined}
              />
            </motion.div>
            {errors.fullName && (
              <motion.p
                id="name-error"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-xs mt-1.5 font-semibold"
                role="alert"
              >
                ⚠ {errors.fullName}
              </motion.p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="flex items-center gap-2 text-xs text-text-secondary mb-2 uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5 text-accent-gold" />
              Date of Birth
            </label>
            <motion.div variants={shakeVariants} animate={dobControls}>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => {
                  setDateOfBirth(e.target.value);
                  if (errors.dateOfBirth) setErrors((p) => ({ ...p, dateOfBirth: "" }));
                }}
                min="1900-01-01"
                max={today}
                className="input-mystic w-full px-4 py-3 rounded-xl text-sm"
                style={{ colorScheme: "dark", borderColor: errors.dateOfBirth ? "rgba(248,113,113,0.5)" : undefined }}
                aria-invalid={!!errors.dateOfBirth}
                aria-describedby={errors.dateOfBirth ? "dob-error" : undefined}
              />
            </motion.div>
            {errors.dateOfBirth && (
              <motion.p
                id="dob-error"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-xs mt-1.5 font-semibold"
                role="alert"
              >
                ⚠ {errors.dateOfBirth}
              </motion.p>
            )}
          </div>

          {/* Time of Birth */}
          <div>
            <label className="flex items-center gap-2 text-xs text-text-secondary mb-2 uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-accent-gold" />
              Time of Birth{" "}
              <span className="text-text-muted normal-case tracking-normal">(optional but recommended)</span>
            </label>
            <input
              type="time"
              value={timeOfBirth}
              onChange={(e) => setTimeOfBirth(e.target.value)}
              className="input-mystic w-full px-4 py-3 rounded-xl text-sm"
              style={{ colorScheme: "dark" }}
            />
          </div>

          {/* Gender Selector */}
          <div>
            <label className="flex items-center gap-2 text-xs text-text-secondary mb-2 uppercase tracking-wider">
              <Users className="w-3.5 h-3.5 text-accent-gold" />
              Gender{" "}
              <span className="text-text-muted normal-case tracking-normal">(for Kua number calculation)</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(["male", "female"] as const).map((g) => (
                <motion.button
                  key={g}
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setGender(g)}
                  className="py-2.5 rounded-xl text-sm font-semibold capitalize transition-all"
                  style={{
                    background: gender === g
                      ? "linear-gradient(135deg, rgba(212,168,83,0.3), rgba(155,89,182,0.3))"
                      : "rgba(17,13,31,0.6)",
                    border: gender === g
                      ? "1px solid rgba(212,168,83,0.4)"
                      : "1px solid rgba(212,168,83,0.1)",
                    color: gender === g ? "var(--accent-gold-light)" : "var(--text-secondary)",
                  }}
                >
                  {g}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(212,168,83,0.4)" }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 rounded-xl font-heading font-semibold text-sm tracking-wider uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #d4a853, #9b59b6)",
              color: "#0a0613",
              boxShadow: "0 0 20px rgba(212,168,83,0.2)",
            }}
          >
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              {isLoading ? "Casting the Spell..." : "Reveal My Destiny"}
            </span>
          </motion.button>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-text-muted text-xs px-4">
          This reading combines multiple ancient divination traditions for entertainment and spiritual guidance.
          Results are algorithmically generated and should not be taken as deterministic fact.
        </p>
      </motion.form>
    </motion.div>
  );
}
