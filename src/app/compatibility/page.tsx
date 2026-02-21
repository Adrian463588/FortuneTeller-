"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import CoupleForm from "@/components/CoupleForm";
import MergeAnimation from "@/components/MergeAnimation";
import CompatibilityDashboard from "@/components/CompatibilityDashboard";
import { generateCompatibilityReading } from "@/utils/compatibilityEngine";
import type { BirthProfile, CompatibilityResult } from "@/utils/types";

type PageState = "input" | "merging" | "results";

export default function CompatibilityPage() {
  const [state, setState] = useState<PageState>("input");
  const [result, setResult] = useState<CompatibilityResult | null>(null);

  const handleSubmit = (partnerA: BirthProfile, partnerB: BirthProfile) => {
    setState("merging");

    // Calculate during animation
    const reading = generateCompatibilityReading({ partnerA, partnerB });
    setResult(reading);
  };

  const handleMergeComplete = () => {
    setState("results");
  };

  const handleReset = () => {
    setState("input");
    setResult(null);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {state === "input" && (
          <CoupleForm key="form" onSubmit={handleSubmit} isLoading={false} />
        )}
        {state === "merging" && (
          <MergeAnimation key="merge" onComplete={handleMergeComplete} />
        )}
        {state === "results" && result && (
          <CompatibilityDashboard key="results" result={result} onReset={handleReset} />
        )}
      </AnimatePresence>
    </>
  );
}
