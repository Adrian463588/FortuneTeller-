// ═══════════════════════════════════════════════════════════════
// RECOMMENDATION ENGINE — Ideal Match Suggestions
// ═══════════════════════════════════════════════════════════════
// Zodiac/Shio-first recommendations for romance, colleague, and
// friend modes, with optional BaZi/Weton/Feng Shui refinement
// when a second person is provided.

import type {
  ReadingResult,
  BirthProfile,
  MatchMode,
  RankedMatch,
  CollaborationRisk,
  PairComparison,
  RecommendationResult,
  FiveElement,
  BaZiResult,
  WetonResult,
  WesternZodiac,
  ChineseZodiac,
} from "./types";
import {
  hashString,
  SeededRandom,
  calculateBaZi,
  getWesternZodiac,
  getChineseZodiac,
  calculateWeton,
} from "./divinationEngine";

// ═══════════════════════════════════════════════════════════════
// ZODIAC RULE PACK (versioned, embedded)
// ═══════════════════════════════════════════════════════════════

const ZODIAC_SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
];
const ZODIAC_SYMBOLS: Record<string,string> = {
  Aries:"♈",Taurus:"♉",Gemini:"♊",Cancer:"♋",Leo:"♌",Virgo:"♍",
  Libra:"♎",Scorpio:"♏",Sagittarius:"♐",Capricorn:"♑",Aquarius:"♒",Pisces:"♓",
};
const ZODIAC_ELEMENTS: Record<string,string> = {
  Aries:"Fire",Taurus:"Earth",Gemini:"Air",Cancer:"Water",
  Leo:"Fire",Virgo:"Earth",Libra:"Air",Scorpio:"Water",
  Sagittarius:"Fire",Capricorn:"Earth",Aquarius:"Air",Pisces:"Water",
};
const ZODIAC_QUALITIES: Record<string,string> = {
  Aries:"Cardinal",Taurus:"Fixed",Gemini:"Mutable",Cancer:"Cardinal",
  Leo:"Fixed",Virgo:"Mutable",Libra:"Cardinal",Scorpio:"Fixed",
  Sagittarius:"Mutable",Capricorn:"Cardinal",Aquarius:"Fixed",Pisces:"Mutable",
};

// Element harmony pairs (high compatibility)
const ELEMENT_HARMONY: [string,string][] = [
  ["Fire","Air"],["Earth","Water"],["Fire","Fire"],
  ["Air","Air"],["Earth","Earth"],["Water","Water"],
];

// Classical trines (highly compatible sign groups)
const ZODIAC_TRINES: string[][] = [
  ["Aries","Leo","Sagittarius"],       // Fire trine
  ["Taurus","Virgo","Capricorn"],      // Earth trine
  ["Gemini","Libra","Aquarius"],       // Air trine
  ["Cancer","Scorpio","Pisces"],       // Water trine
];

// Classical sextile/supportive pairs
const ZODIAC_SEXTILES: [string,string][] = [
  ["Aries","Gemini"],["Aries","Aquarius"],
  ["Taurus","Cancer"],["Taurus","Pisces"],
  ["Gemini","Leo"],["Cancer","Virgo"],
  ["Leo","Libra"],["Virgo","Scorpio"],
  ["Libra","Sagittarius"],["Scorpio","Capricorn"],
  ["Sagittarius","Aquarius"],["Capricorn","Pisces"],
];

// Colleague work-style roles assigned by quality+element
const WORK_ROLES: Record<string,string> = {
  "Cardinal_Fire":"Initiator & Leader",
  "Fixed_Fire":"Visionary & Motivator",
  "Mutable_Fire":"Strategist & Adapter",
  "Cardinal_Earth":"Project Manager",
  "Fixed_Earth":"Stabilizer & Executor",
  "Mutable_Earth":"Analyst & Optimizer",
  "Cardinal_Air":"Networker & Diplomat",
  "Fixed_Air":"Innovator & Disruptor",
  "Mutable_Air":"Communicator & Mediator",
  "Cardinal_Water":"Empathic Leader",
  "Fixed_Water":"Deep Researcher",
  "Mutable_Water":"Creative & Visionary",
};

// ═══════════════════════════════════════════════════════════════
// SHIO RULE PACK (versioned, embedded)
// ═══════════════════════════════════════════════════════════════

const SHIO_ANIMALS = [
  "Rat","Ox","Tiger","Rabbit","Dragon","Snake",
  "Horse","Goat","Monkey","Rooster","Dog","Pig",
];
const SHIO_SYMBOLS: Record<string,string> = {
  Rat:"🐀",Ox:"🐂",Tiger:"🐅",Rabbit:"🐇",Dragon:"🐉",Snake:"🐍",
  Horse:"🐎",Goat:"🐐",Monkey:"🐒",Rooster:"🐓",Dog:"🐕",Pig:"🐖",
};

// San He (三合) — Three Harmony Trines (highest compatibility)
const SAN_HE: string[][] = [
  ["Rat","Dragon","Monkey"],
  ["Ox","Snake","Rooster"],
  ["Tiger","Horse","Dog"],
  ["Rabbit","Goat","Pig"],
];

// Liu He (六合) — Six Harmony Pairs (deep compatibility)
const LIU_HE: [string,string][] = [
  ["Rat","Ox"],["Tiger","Pig"],["Rabbit","Dog"],
  ["Dragon","Rooster"],["Snake","Monkey"],["Horse","Goat"],
];

// Six Clashes (六冲)
const SHIO_CLASHES: [string,string][] = [
  ["Rat","Horse"],["Ox","Goat"],["Tiger","Monkey"],
  ["Rabbit","Rooster"],["Dragon","Dog"],["Snake","Pig"],
];

// ═══════════════════════════════════════════════════════════════
// SCORING FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function getZodiacScore(userSign: string, targetSign: string): { score: number; signals: string[]; why: string } {
  const signals: string[] = [];
  let score = 40; // baseline
  const userEl = ZODIAC_ELEMENTS[userSign];
  const targetEl = ZODIAC_ELEMENTS[targetSign];

  // Same sign
  if (userSign === targetSign) {
    score += 12;
    signals.push("Same sign affinity");
  }

  // Trine check
  const trine = ZODIAC_TRINES.find(t => t.includes(userSign) && t.includes(targetSign) && userSign !== targetSign);
  if (trine) {
    score += 25;
    signals.push("Trine harmony");
  }

  // Element harmony
  const elHarmony = ELEMENT_HARMONY.some(([a,b]) =>
    (a === userEl && b === targetEl) || (b === userEl && a === targetEl)
  );
  if (elHarmony && !trine) {
    score += 15;
    signals.push("Element harmony");
  }

  // Sextile
  const sextile = ZODIAC_SEXTILES.some(([a,b]) =>
    (a === userSign && b === targetSign) || (b === userSign && a === targetSign)
  );
  if (sextile) {
    score += 10;
    signals.push("Sextile support");
  }

  // Opposing quality slight penalty
  const userQual = ZODIAC_QUALITIES[userSign];
  const targetQual = ZODIAC_QUALITIES[targetSign];
  if (userQual === targetQual && userSign !== targetSign) {
    score -= 3;
    signals.push("Same quality tension");
  }

  score = Math.max(15, Math.min(100, score));

  const why = trine
    ? `${targetSign} shares your ${userEl} trine — a deeply harmonious connection built on shared values and natural understanding.`
    : sextile
    ? `${targetSign} (${targetEl}) supports your ${userEl} energy through a sextile aspect — easy communication and mutual growth.`
    : elHarmony
    ? `${targetSign}'s ${targetEl} element naturally complements your ${userEl} energy.`
    : `${targetSign} has a neutral to moderate connection — potential for growth through complementary differences.`;

  return { score, signals, why };
}

function getShioScore(userAnimal: string, targetAnimal: string): { score: number; signals: string[]; why: string } {
  const signals: string[] = [];
  let score = 40;

  // Same animal
  if (userAnimal === targetAnimal) {
    score += 10;
    signals.push("Same animal kindred");
  }

  // San He (Three Harmony)
  const sanHe = SAN_HE.find(t => t.includes(userAnimal) && t.includes(targetAnimal) && userAnimal !== targetAnimal);
  if (sanHe) {
    score += 28;
    signals.push("三合 San He trine");
  }

  // Liu He (Six Harmony)
  const liuHe = LIU_HE.some(([a,b]) =>
    (a === userAnimal && b === targetAnimal) || (b === userAnimal && a === targetAnimal)
  );
  if (liuHe) {
    score += 22;
    signals.push("六合 Liu He pair");
  }

  // Clash check (penalty)
  const clash = SHIO_CLASHES.some(([a,b]) =>
    (a === userAnimal && b === targetAnimal) || (b === userAnimal && a === targetAnimal)
  );
  if (clash) {
    score -= 25;
    signals.push("六冲 Liu Chong clash");
  }

  score = Math.max(10, Math.min(100, score));

  const why = sanHe
    ? `${targetAnimal} is in your Three Harmony (三合) group — one of the most auspicious pairings in Chinese astrology.`
    : liuHe
    ? `${targetAnimal} forms a Six Harmony (六合) pair with ${userAnimal} — a deep, secret bond of mutual understanding.`
    : clash
    ? `${targetAnimal} sits opposite ${userAnimal} in the zodiac wheel (六冲 clash). Attraction exists but requires conscious effort.`
    : `${targetAnimal} has a moderate connection with ${userAnimal} — a stable, workable pairing with room for growth.`;

  return { score, signals, why };
}

// ═══════════════════════════════════════════════════════════════
// MODE-SPECIFIC COPY
// ═══════════════════════════════════════════════════════════════

function getModeContext(mode: MatchMode) {
  if (mode === "romance") return { verb: "romantic chemistry", adj: "passionate", focus: "emotional bond and intimacy" };
  if (mode === "colleague") return { verb: "professional synergy", adj: "productive", focus: "teamwork, trust, and execution" };
  return { verb: "friendship rapport", adj: "supportive", focus: "loyalty, fun, and mutual growth" };
}

// ═══════════════════════════════════════════════════════════════
// COLLEAGUE RISK GENERATOR
// ═══════════════════════════════════════════════════════════════

function generateCollaborationRisks(userSign: string, userAnimal: string): CollaborationRisk[] {
  const userEl = ZODIAC_ELEMENTS[userSign];
  const risks: CollaborationRisk[] = [];

  const elRisks: Record<string, CollaborationRisk> = {
    Fire: { risk: "Impatience with slower methodical colleagues", mitigation: "Schedule regular check-ins to align on pace. Celebrate small wins together." },
    Earth: { risk: "Resistance to rapid pivots and experimental ideas", mitigation: "Pre-frame changes with data and clear rationale. Give time to process." },
    Air: { risk: "Over-abstracting when concrete action is needed", mitigation: "Use visual roadmaps and deadlines. Pair with an Earth-type executor." },
    Water: { risk: "Emotional absorption of team stress", mitigation: "Establish clear emotional boundaries. Schedule decompression breaks." },
  };
  if (elRisks[userEl]) risks.push(elRisks[userEl]);

  const qualRisks: Record<string, CollaborationRisk> = {
    Cardinal: { risk: "Starting too many initiatives without finishing", mitigation: "Use a priority matrix. Assign a Fixed-type to own completion." },
    Fixed: { risk: "Stubbornness when plans need to change", mitigation: "Build 'review gates' into project timelines for adaptive replanning." },
    Mutable: { risk: "Difficulty committing to one direction", mitigation: "Set clear decision deadlines. Use a Cardinal-type to anchor direction." },
  };
  const qual = ZODIAC_QUALITIES[userSign];
  if (qualRisks[qual]) risks.push(qualRisks[qual]);

  return risks;
}

// ═══════════════════════════════════════════════════════════════
// PAIR COMPARISON (when second person is provided)
// ═══════════════════════════════════════════════════════════════

function calculatePairComparison(readingA: ReadingResult, readingB: ReadingResult): PairComparison {
  // Zodiac
  const zScore = getZodiacScore(readingA.westernZodiac.sign, readingB.westernZodiac.sign);
  // Shio
  const sScore = getShioScore(readingA.chineseZodiac.animal, readingB.chineseZodiac.animal);

  // BaZi — Day Master element compatibility
  const PRODUCTIVE: Record<FiveElement, FiveElement> = { Wood:"Fire", Fire:"Earth", Earth:"Metal", Metal:"Water", Water:"Wood" };
  const dmA = readingA.bazi.dayMaster;
  const dmB = readingB.bazi.dayMaster;
  let baziScore = 50;
  if (dmA === dmB) baziScore += 10;
  if (PRODUCTIVE[dmA] === dmB || PRODUCTIVE[dmB] === dmA) baziScore += 20;
  // Yong Shen alignment
  if (readingA.bazi.yongShen.usefulElement === dmB) baziScore += 15;
  if (readingB.bazi.yongShen.usefulElement === dmA) baziScore += 15;
  baziScore = Math.min(100, baziScore);

  // Weton
  const combinedNeptu = readingA.weton.totalNeptu + readingB.weton.totalNeptu;
  const wetonClass = combinedNeptu % 9;
  const goodWetonClasses = [1,2,4,5,6,7]; // Ratu, Jodoh, Tinari, Lungguh, Gedhong, Sri
  const wetonScore = goodWetonClasses.includes(wetonClass) ? 75 : 35;

  // Feng Shui (simple Kua alignment)
  let fengShuiScore = 50;
  if (readingA.fengShui && readingB.fengShui) {
    const eastKua = [1, 3, 4, 9];
    const kuaA = readingA.fengShui.kuaNumber;
    const kuaB = readingB.fengShui.kuaNumber;
    const sameGroup = (eastKua.includes(kuaA) && eastKua.includes(kuaB)) || (!eastKua.includes(kuaA) && !eastKua.includes(kuaB));
    if (sameGroup) {
      fengShuiScore = 80;
    }
  }

  const pairScore = Math.round(
    zScore.score * 0.25 + sScore.score * 0.25 +
    baziScore * 0.25 + wetonScore * 0.15 + fengShuiScore * 0.10
  );

  const strengths: string[] = [];
  const challenges: string[] = [];
  const signals: string[] = [...zScore.signals, ...sScore.signals];

  if (zScore.score >= 65) strengths.push("Strong Western Zodiac harmony.");
  if (zScore.score < 40) challenges.push("Western Zodiac elements may create friction.");
  if (sScore.score >= 65) strengths.push("Auspicious Chinese Shio relationship.");
  if (sScore.score < 35) challenges.push("Shio clash requires conscious adaptation.");
  if (baziScore >= 70) strengths.push("Day Master elements are complementary.");
  if (baziScore < 45) challenges.push("BaZi element balance shows potential tension.");
  if (wetonScore >= 70) strengths.push("Javanese Weton class favors this pairing.");
  if (wetonScore < 40) challenges.push("Weton Neptu combination signals caution.");

  return {
    pairScore,
    systemBreakdown: {
      zodiac: zScore.score,
      shio: sScore.score,
      bazi: baziScore,
      weton: wetonScore,
      fengShui: fengShuiScore,
    },
    strengths,
    challenges,
    signals,
  };
}

// ═══════════════════════════════════════════════════════════════
// MAIN API — generateRecommendations
// ═══════════════════════════════════════════════════════════════

export function generateRecommendations(
  reading: ReadingResult,
  mode: MatchMode = "romance",
  otherReading?: ReadingResult,
): RecommendationResult {
  const userSign = reading.westernZodiac.sign;
  const userAnimal = reading.chineseZodiac.animal;
  const ctx = getModeContext(mode);

  // Rank all Zodiac signs
  const zodiacRanked: RankedMatch[] = ZODIAC_SIGNS
    .filter(s => s !== userSign)
    .map(sign => {
      const { score, signals, why } = getZodiacScore(userSign, sign);
      const role = WORK_ROLES[`${ZODIAC_QUALITIES[sign]}_${ZODIAC_ELEMENTS[sign]}`];
      return {
        sign,
        symbol: ZODIAC_SYMBOLS[sign],
        score,
        whySummary: mode === "colleague"
          ? `${why} In the workplace, ${sign} excels as a ${role || "versatile team member"}.`
          : mode === "friend"
          ? `${why} A friendship built on ${ctx.focus}.`
          : why,
        signalsUsed: signals,
        role: mode === "colleague" ? role : undefined,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  // Rank all Shio animals
  const shioRanked: RankedMatch[] = SHIO_ANIMALS
    .filter(a => a !== userAnimal)
    .map(animal => {
      const { score, signals, why } = getShioScore(userAnimal, animal);
      return {
        sign: animal,
        symbol: SHIO_SYMBOLS[animal],
        score,
        whySummary: mode === "colleague"
          ? `${why} ${animal} types bring ${ctx.adj} energy to collaborative projects.`
          : mode === "friend"
          ? `${why} ${animal} friends provide ${ctx.adj} companionship and ${ctx.focus}.`
          : why,
        signalsUsed: signals,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  // Explanations
  const explanations: string[] = [
    `Rankings are based on ${ctx.verb} potential across Western astrology element groups and Chinese zodiac harmony structures.`,
    `Zodiac analysis uses element harmony (Fire-Air, Earth-Water), trine groups, and sextile aspects.`,
    `Shio analysis uses Three Harmony (三合 San He) trines, Six Harmony (六合 Liu He) pairs, and clash (六冲) avoidance.`,
  ];

  if (reading.bazi.yongShen) {
    explanations.push(`Your BaZi Useful God (用神) is ${reading.bazi.yongShen.usefulElement}. Partners who embody this element are especially beneficial.`);
  }

  // Colleague risks
  const collaborationRisks = mode === "colleague"
    ? generateCollaborationRisks(userSign, userAnimal)
    : [];

  // Pair comparison (if other person provided)
  const pairComparison = otherReading
    ? calculatePairComparison(reading, otherReading)
    : undefined;

  return {
    mode,
    zodiacRanked,
    shioRanked,
    explanations,
    collaborationRisks,
    pairComparison,
  };
}
