"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import HeroForm from "@/components/HeroForm";
import LoadingOracle from "@/components/LoadingOracle";
import ResultsDashboard from "@/components/ResultsDashboard";
import { generateReading } from "@/utils/divinationEngine";
import type { ReadingResult } from "@/utils/types";

type AppState = "input" | "loading" | "results";

export default function Home() {
  const [state, setState] = useState<AppState>("input");
  const [reading, setReading] = useState<ReadingResult | null>(null);

  const handleSubmit = async (data: {
    fullName: string;
    dateOfBirth: string;
    timeOfBirth: string;
  }) => {
    setState("loading");

    // Simulate mystical computation time (let the animation play)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const result = generateReading({
      fullName: data.fullName,
      dateOfBirth: new Date(data.dateOfBirth),
      timeOfBirth: data.timeOfBirth || undefined,
    });

    setReading(result);
    setState("results");
  };

  const handleReset = () => {
    setState("input");
    setReading(null);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {state === "input" && <HeroForm key="form" onSubmit={handleSubmit} isLoading={false} />}
        {state === "loading" && <LoadingOracle key="loading" />}
        {state === "results" && reading && (
          <ResultsDashboard key="results" reading={reading} onReset={handleReset} />
        )}
      </AnimatePresence>
    </>
  );
}
