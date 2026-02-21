"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  LayoutGrid,
  User,
  Moon,
  CalendarDays,
  Milestone,
  Compass,
  Heart,
  ArrowLeft,
} from "lucide-react";
import type { ReadingResult } from "@/utils/types";
import OverviewTab from "./tabs/OverviewTab";
import PersonalityTab from "./tabs/PersonalityTab";
import JavaneseTab from "./tabs/JavaneseTab";
import YearlyTab from "./tabs/YearlyTab";
import DecadeTab from "./tabs/DecadeTab";
import FengShuiTab from "./tabs/FengShuiTab";
import MatchesTab from "./tabs/MatchesTab";

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "personality", label: "Personality", icon: User },
  { id: "javanese", label: "Javanese", icon: Moon },
  { id: "fengshui", label: "Feng Shui", icon: Compass },
  { id: "yearly", label: "Yearly", icon: CalendarDays },
  { id: "decade", label: "Decade", icon: Milestone },
  { id: "matches", label: "Matches", icon: Heart },
];

interface ResultsDashboardProps {
  reading: ReadingResult;
  onReset: () => void;
}

export default function ResultsDashboard({ reading, onReset }: ResultsDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen pb-20"
    >
      {/* Header */}
      <div className="sticky top-0 z-30 backdrop-blur-xl" style={{ background: "rgba(10,6,19,0.85)" }}>
        <div className="max-w-5xl mx-auto px-4 py-4">
          {/* Top row */}
          <div className="flex items-center justify-between mb-4">
            <motion.button
              onClick={onReset}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-text-secondary hover:text-accent-gold text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              New Reading
            </motion.button>
            <div className="text-right">
              <h2 className="font-heading text-sm text-accent-gold-light">
                {reading.profile.fullName}
              </h2>
              <p className="text-text-muted text-xs">
                {reading.profile.dateOfBirth.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                {reading.profile.timeOfBirth && ` · ${reading.profile.timeOfBirth}`}
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive ? "text-bg-deep" : "text-text-secondary hover:text-text-primary"
                  }`}
                  style={{
                    background: isActive
                      ? "linear-gradient(135deg, #d4a853, #9b59b6)"
                      : "transparent",
                    boxShadow: isActive ? "0 0 15px rgba(212,168,83,0.2)" : "none",
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Separator */}
        <div
          className="h-px"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(212,168,83,0.2), transparent)",
          }}
        />
      </div>

      {/* Tab Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && <OverviewTab key="overview" reading={reading} />}
          {activeTab === "personality" && <PersonalityTab key="personality" reading={reading} />}
          {activeTab === "javanese" && <JavaneseTab key="javanese" reading={reading} />}
          {activeTab === "fengshui" && <FengShuiTab key="fengshui" reading={reading} />}
          {activeTab === "yearly" && <YearlyTab key="yearly" reading={reading} />}
          {activeTab === "decade" && <DecadeTab key="decade" reading={reading} />}
          {activeTab === "matches" && <MatchesTab key="matches" reading={reading} />}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
