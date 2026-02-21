// ═══════════════════════════════════════════════════════════════
// DATE SELECTION ENGINE — 择日 (Ze Ri) Auspicious Wedding Days
// ═══════════════════════════════════════════════════════════════
// Deterministic, database-free date selection using BaZi pillars,
// Weton/Neptu, Shen Sha, and Yong Shen scoring.

import {
  BirthProfile,
  BaZiResult,
  WetonResult,
  Pillar,
  EarthlyBranch,
  FiveElement,
  DateCandidate,
  DateSignal,
  DateEvaluation,
  DateRanking,
  CoupleProfile,
} from "./types";
import {
  hashString,
  SeededRandom,
  getStemBranch,
  calculateBaZi,
  calculateWeton,
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
} from "./divinationEngine";

// ─── Constants ─────────────────────────────────────────────────

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const PASARAN_NAMES = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"];

// Auspicious Weton days for marriage (Javanese tradition)
const AUSPICIOUS_WETON_MARRIAGE = [
  "Senin Pon", "Kamis Legi", "Jumat Wage", "Sabtu Kliwon", "Rabu Pon",
  "Senin Kliwon", "Kamis Pon", "Jumat Legi",
];

const HARI_LABELS: Record<number, string> = {
  0: "Minggu", 1: "Senin", 2: "Selasa", 3: "Rabu", 4: "Kamis", 5: "Jumat", 6: "Sabtu",
};

// Branch clash table (六冲)
const SIX_CLASHES: [number, number][] = [
  [0, 6], [1, 7], [2, 8], [3, 9], [4, 10], [5, 11],
];

function branchIndex(branch: EarthlyBranch): number {
  return EARTHLY_BRANCHES.findIndex((b) => b.name === branch);
}

function hasClash(a: number, b: number): boolean {
  return SIX_CLASHES.some(([x, y]) => (a === x && b === y) || (a === y && b === x));
}

const ELEMENT_PRODUCTIVE: Record<FiveElement, FiveElement> = {
  Wood: "Fire", Fire: "Earth", Earth: "Metal", Metal: "Water", Water: "Wood",
};

// ─── Shen Sha quick check for date pillars ────────────────────

interface QuickShenSha {
  name: string;
  type: "positive" | "negative";
  check: (dayBranchIdx: number, dayStemIdx: number) => boolean;
}

const DATE_SHEN_SHA: QuickShenSha[] = [
  {
    name: "Tian Xi (Heavenly Happiness 天喜)",
    type: "positive",
    check: (db) => [4, 0, 8].includes(db), // Dragon, Rat, Monkey days
  },
  {
    name: "Hong Luan (Red Phoenix 红鸾)",
    type: "positive",
    check: (db) => [3, 9].includes(db), // Rabbit, Rooster days
  },
  {
    name: "Tian De (Heavenly Virtue 天德)",
    type: "positive",
    check: (_, ds) => [0, 2, 4, 6, 8].includes(ds), // Yang stem days
  },
  {
    name: "Po Ri (Destruction Day 破日)",
    type: "negative",
    check: (db) => [2, 5, 8, 11].includes(db), // Tiger, Snake, Monkey, Pig (simplified)
  },
  {
    name: "Gui Men (Ghost Gate 鬼门)",
    type: "negative",
    check: (db) => db === 10, // Xu (Dog) day
  },
];

// ═══════════════════════════════════════════════════════════════
// 1. GENERATE CANDIDATE DATES
// ═══════════════════════════════════════════════════════════════

function generateCandidateDates(startDate: Date, endDate: Date): DateCandidate[] {
  const candidates: DateCandidate[] = [];
  const baseDate = new Date(2000, 0, 7); // Known Jia-Zi day

  const current = new Date(startDate);
  current.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  // Pasaran epoch: Jan 1, 2000 = Wage (index 3)
  const pasaranEpoch = new Date(2000, 0, 1);

  while (current <= end) {
    const diffFromBase = Math.floor((current.getTime() - baseDate.getTime()) / 86400000);
    const dayStemIdx = ((diffFromBase % 10) + 10) % 10;
    const dayBranchIdx = ((diffFromBase % 12) + 12) % 12;
    const dayPillar = getStemBranch(dayStemIdx, dayBranchIdx);

    const dayOfWeek = DAY_NAMES[current.getDay()];

    // Pasaran calculation
    const diffFromPasaranEpoch = Math.floor((current.getTime() - pasaranEpoch.getTime()) / 86400000);
    const pasaranIdx = ((diffFromPasaranEpoch % 5) + 3) % 5; // Jan 1, 2000 = Wage (idx 3)
    const pasaran = PASARAN_NAMES[pasaranIdx];
    const hariJawa = HARI_LABELS[current.getDay()];
    const weton = `${hariJawa} ${pasaran}`;

    candidates.push({
      date: new Date(current),
      dayPillar,
      weton,
      pasaran,
      dayOfWeek,
    });

    current.setDate(current.getDate() + 1);
  }

  return candidates;
}

// ═══════════════════════════════════════════════════════════════
// 2. FILTER CLASH DATES
// ═══════════════════════════════════════════════════════════════

function filterClashDates(
  candidates: DateCandidate[],
  baziA: BaZiResult,
  baziB: BaZiResult
): { passed: DateCandidate[]; clashed: { candidate: DateCandidate; reason: string }[] } {
  const yearBranchA = branchIndex(baziA.yearPillar.earthlyBranch);
  const yearBranchB = branchIndex(baziB.yearPillar.earthlyBranch);
  const dayBranchA = branchIndex(baziA.dayPillar.earthlyBranch);
  const dayBranchB = branchIndex(baziB.dayPillar.earthlyBranch);

  const passed: DateCandidate[] = [];
  const clashed: { candidate: DateCandidate; reason: string }[] = [];

  for (const c of candidates) {
    const db = branchIndex(c.dayPillar.earthlyBranch);
    const reasons: string[] = [];

    if (hasClash(db, yearBranchA)) {
      reasons.push(`Day Branch ${c.dayPillar.branchChinese} clashes with Partner A's Year Branch`);
    }
    if (hasClash(db, yearBranchB)) {
      reasons.push(`Day Branch ${c.dayPillar.branchChinese} clashes with Partner B's Year Branch`);
    }
    if (hasClash(db, dayBranchA)) {
      reasons.push(`Day Branch ${c.dayPillar.branchChinese} clashes with Partner A's Day Branch (Spouse Palace)`);
    }
    if (hasClash(db, dayBranchB)) {
      reasons.push(`Day Branch ${c.dayPillar.branchChinese} clashes with Partner B's Day Branch (Spouse Palace)`);
    }

    if (reasons.length > 0) {
      clashed.push({ candidate: c, reason: reasons.join("; ") });
    } else {
      passed.push(c);
    }
  }

  return { passed, clashed };
}

// ═══════════════════════════════════════════════════════════════
// 3. SCORE REMAINING DATES
// ═══════════════════════════════════════════════════════════════

function scoreDates(
  candidates: DateCandidate[],
  baziA: BaZiResult,
  baziB: BaZiResult
): DateEvaluation[] {
  return candidates.map((c) => {
    let score = 50;
    const signals: DateSignal[] = [];
    const db = branchIndex(c.dayPillar.earthlyBranch);
    const ds = HEAVENLY_STEMS.findIndex((s) => s.name === c.dayPillar.heavenlyStem);

    // 1. Day Stem harmony with Day Masters
    const dateStemEl = c.dayPillar.stemElement;
    if (ELEMENT_PRODUCTIVE[dateStemEl] === baziA.dayMaster || ELEMENT_PRODUCTIVE[dateStemEl] === baziB.dayMaster) {
      score += 8;
      signals.push({ system: "bazi", type: "positive", label: "Day Stem supports Day Master", description: `${c.dayPillar.stemChinese} (${dateStemEl}) productively supports at least one partner's Day Master.` });
    }

    // 2. Yong Shen alignment
    if (dateStemEl === baziA.yongShen.usefulElement) {
      score += 10;
      signals.push({ system: "yongShen", type: "positive", label: "Yong Shen alignment (A)", description: `Date element ${dateStemEl} is Partner A's Useful God — highly favorable.` });
    }
    if (dateStemEl === baziB.yongShen.usefulElement) {
      score += 10;
      signals.push({ system: "yongShen", type: "positive", label: "Yong Shen alignment (B)", description: `Date element ${dateStemEl} is Partner B's Useful God — highly favorable.` });
    }
    if (dateStemEl === baziA.yongShen.avoidElement || dateStemEl === baziB.yongShen.avoidElement) {
      score -= 8;
      signals.push({ system: "yongShen", type: "negative", label: "Yong Shen conflict", description: `Date element ${dateStemEl} is an "Avoid Element" for at least one partner.` });
    }

    // 3. Shen Sha check on day
    for (const sha of DATE_SHEN_SHA) {
      if (sha.check(db, ds)) {
        if (sha.type === "positive") {
          score += 6;
          signals.push({ system: "shenSha", type: "positive", label: sha.name, description: `Auspicious star ${sha.name} is active on this day.` });
        } else {
          score -= 8;
          signals.push({ system: "shenSha", type: "negative", label: sha.name, description: `Inauspicious star ${sha.name} is active on this day — caution advised.` });
        }
      }
    }

    // 4. Weton auspiciousness
    if (AUSPICIOUS_WETON_MARRIAGE.includes(c.weton)) {
      score += 12;
      signals.push({ system: "weton", type: "positive", label: "Auspicious Weton", description: `${c.weton} is traditionally considered an excellent day for marriage ceremonies.` });
    }

    // 5. Weekend bonus (practical)
    if (c.dayOfWeek === "Saturday" || c.dayOfWeek === "Sunday") {
      score += 3;
      signals.push({ system: "bazi", type: "neutral", label: "Weekend", description: "Weekend date — more practical for guests and celebrations." });
    }

    // Clamp
    score = Math.max(0, Math.min(100, score));

    const rating: DateEvaluation["rating"] =
      score >= 65 ? "auspicious" : score >= 40 ? "neutral" : "inauspicious";

    // Build reason trace
    const positives = signals.filter((s) => s.type === "positive").map((s) => s.label);
    const negatives = signals.filter((s) => s.type === "negative").map((s) => s.label);
    let reasonTrace = "";
    if (positives.length > 0) reasonTrace += `Favorable: ${positives.join(", ")}. `;
    if (negatives.length > 0) reasonTrace += `Caution: ${negatives.join(", ")}. `;
    if (positives.length === 0 && negatives.length === 0) reasonTrace = "A neutral day with no strong signals.";

    return { candidate: c, score, rating, signals, reasonTrace };
  });
}

// ═══════════════════════════════════════════════════════════════
// 4. BUILD AVOID LIST
// ═══════════════════════════════════════════════════════════════

function buildAvoidList(
  clashed: { candidate: DateCandidate; reason: string }[]
): DateEvaluation[] {
  return clashed.map((c) => ({
    candidate: c.candidate,
    score: 10,
    rating: "inauspicious" as const,
    signals: [{ system: "bazi" as const, type: "negative" as const, label: "Branch Clash", description: c.reason }],
    reasonTrace: `Avoid: ${c.reason}`,
  }));
}

// ═══════════════════════════════════════════════════════════════
// 5. ORCHESTRATOR — PUBLIC API
// ═══════════════════════════════════════════════════════════════

function extractBaZiForProfile(profile: BirthProfile): BaZiResult {
  const dob = profile.dateOfBirth;
  const year = dob.getFullYear();
  const month = dob.getMonth() + 1;
  const day = dob.getDate();
  let hour = 12;
  if (profile.timeOfBirth) {
    const parts = profile.timeOfBirth.split(":");
    hour = parseInt(parts[0]) || 12;
  }
  const seedStr = `${profile.fullName.toLowerCase().trim()}-${year}-${month}-${day}-${hour}`;
  const rng = new SeededRandom(hashString(seedStr));
  return calculateBaZi(year, month, day, hour, rng);
}

export function rankWeddingDates(
  coupleProfile: CoupleProfile,
  startDate: Date,
  endDate: Date,
  topN: number = 10
): DateRanking {
  const baziA = extractBaZiForProfile(coupleProfile.partnerA);
  const baziB = extractBaZiForProfile(coupleProfile.partnerB);

  // 1. Generate all candidate dates
  const candidates = generateCandidateDates(startDate, endDate);

  // 2. Filter out clash dates
  const { passed, clashed } = filterClashDates(candidates, baziA, baziB);

  // 3. Score remaining dates
  const scored = scoreDates(passed, baziA, baziB);

  // 4. Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // 5. Build avoid list from clashed dates
  const avoidDates = buildAvoidList(clashed);
  avoidDates.sort((a, b) => a.score - b.score);

  return {
    bestDates: scored.slice(0, topN),
    avoidDates: avoidDates.slice(0, topN),
    allDates: scored,
    coupleProfile,
    dateRange: { start: startDate, end: endDate },
    generatedAt: new Date(),
  };
}
