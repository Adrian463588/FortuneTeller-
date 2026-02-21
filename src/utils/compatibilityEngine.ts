// ═══════════════════════════════════════════════════════════════
// COMPATIBILITY ENGINE — 合婚 (He Hun) Couple Reading
// ═══════════════════════════════════════════════════════════════
// Deterministic, database-free compatibility scoring across
// BaZi (Saju Palja), Weton/Neptu (Javanese Primbon),
// Western Zodiac, and Chinese Shio.

import {
  BirthProfile,
  BaZiResult,
  WetonResult,
  WesternZodiac,
  ChineseZodiac,
  FiveElement,
  Pillar,
  EarthlyBranch,
  SystemScore,
  PrimbonMatchClass,
  TimelineEntry,
  CompatibilityResult,
  CoupleProfile,
} from "./types";
import {
  hashString,
  SeededRandom,
  calculateBaZi,
  getWesternZodiac,
  getChineseZodiac,
  calculateWeton,
  EARTHLY_BRANCHES,
} from "./divinationEngine";

// ─── Helper ────────────────────────────────────────────────────

function branchIndex(branch: EarthlyBranch): number {
  return EARTHLY_BRANCHES.findIndex((b) => b.name === branch);
}

const ELEMENT_PRODUCTIVE: Record<FiveElement, FiveElement> = {
  Wood: "Fire", Fire: "Earth", Earth: "Metal", Metal: "Water", Water: "Wood",
};
const ELEMENT_DESTRUCTIVE: Record<FiveElement, FiveElement> = {
  Wood: "Earth", Fire: "Metal", Earth: "Water", Metal: "Wood", Water: "Fire",
};

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

// ═══════════════════════════════════════════════════════════════
// 1. BAZI COMPATIBILITY
// ═══════════════════════════════════════════════════════════════

// Six Combination pairs (六合)
const SIX_COMBOS: [number, number][] = [
  [0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7],
];

// Six Clash pairs (六冲)
const SIX_CLASHES: [number, number][] = [
  [0, 6], [1, 7], [2, 8], [3, 9], [4, 10], [5, 11],
];

function hasCombination(a: number, b: number): boolean {
  return SIX_COMBOS.some(([x, y]) => (a === x && b === y) || (a === y && b === x));
}

function hasClash(a: number, b: number): boolean {
  return SIX_CLASHES.some(([x, y]) => (a === x && b === y) || (a === y && b === x));
}

function elementComplement(a: FiveElement, b: FiveElement): number {
  if (a === b) return 5; // Same element: neutral
  if (ELEMENT_PRODUCTIVE[a] === b || ELEMENT_PRODUCTIVE[b] === a) return 10; // Productive
  if (ELEMENT_DESTRUCTIVE[a] === b || ELEMENT_DESTRUCTIVE[b] === a) return -5; // Destructive
  return 0;
}

function calculateBaZiCompatibility(baziA: BaZiResult, baziB: BaZiResult): SystemScore {
  const details: string[] = [];
  let score = 50; // Start at neutral

  const pillarsA = [baziA.yearPillar, baziA.monthPillar, baziA.dayPillar, baziA.hourPillar];
  const pillarsB = [baziB.yearPillar, baziB.monthPillar, baziB.dayPillar, baziB.hourPillar];
  const pillarNames = ["Year", "Month", "Day", "Hour"];

  // Check each pillar pair for combinations and clashes
  let combos = 0;
  let clashes = 0;
  for (let i = 0; i < 4; i++) {
    const biA = branchIndex(pillarsA[i].earthlyBranch);
    const biB = branchIndex(pillarsB[i].earthlyBranch);

    if (hasCombination(biA, biB)) {
      combos++;
      score += 8;
      details.push(`${pillarNames[i]} Pillar: Branch Combination (六合) — ${pillarsA[i].branchChinese}+${pillarsB[i].branchChinese} form a harmonious bond.`);
    }
    if (hasClash(biA, biB)) {
      clashes++;
      score -= 10;
      details.push(`${pillarNames[i]} Pillar: Branch Clash (六冲) — ${pillarsA[i].branchChinese} clashes with ${pillarsB[i].branchChinese}. Friction in this life area.`);
    }
  }

  // Day Master compatibility (most important)
  const dmCompat = elementComplement(baziA.dayMaster, baziB.dayMaster);
  score += dmCompat * 2;
  if (dmCompat > 0) {
    details.push(`Day Masters: ${baziA.dayMaster} and ${baziB.dayMaster} are in productive harmony — a strong natural connection.`);
  } else if (dmCompat < 0) {
    details.push(`Day Masters: ${baziA.dayMaster} and ${baziB.dayMaster} have a controlling relationship — requires mutual understanding.`);
  } else {
    details.push(`Day Masters: ${baziA.dayMaster} and ${baziB.dayMaster} have a neutral relationship — steady and balanced.`);
  }

  // Spouse Palace check (Day Branch stress)
  const spouseA = branchIndex(baziA.dayPillar.earthlyBranch);
  const spouseB = branchIndex(baziB.dayPillar.earthlyBranch);
  if (hasCombination(spouseA, spouseB)) {
    score += 12;
    details.push("Spouse Palace: Day Branches form a Six Combination — an exceptionally strong marital bond.");
  } else if (hasClash(spouseA, spouseB)) {
    score -= 8;
    details.push("Spouse Palace: Day Branches clash — the marital palace carries tension. Extra care needed in daily interactions.");
  }

  // Element balance complementarity
  const elements: FiveElement[] = ["Wood", "Fire", "Earth", "Metal", "Water"];
  let complementary = 0;
  for (const el of elements) {
    if (baziA.elementBalance[el] <= 1 && baziB.elementBalance[el] >= 2) complementary++;
    if (baziB.elementBalance[el] <= 1 && baziA.elementBalance[el] >= 2) complementary++;
  }
  if (complementary >= 2) {
    score += 8;
    details.push("Element Balance: Partners complement each other's elemental weaknesses — a naturally balancing union.");
  }

  // Yong Shen alignment
  if (baziA.yongShen.usefulElement === baziB.dayMaster || baziB.yongShen.usefulElement === baziA.dayMaster) {
    score += 10;
    details.push("Yong Shen Alignment: One partner's Day Master IS the other's Useful God (用神) — a deeply beneficial resonance.");
  }

  return {
    system: "bazi",
    label: "BaZi / Four Pillars",
    score: clamp(score, 0, 100),
    summary: combos > clashes
      ? "The Four Pillars reveal more harmony than friction — a naturally supportive connection."
      : clashes > combos
      ? "There are notable clashes between your pillars. This doesn't doom the relationship but signals areas requiring conscious effort."
      : "A balanced mix of harmony and tension — a relationship with both comfort and growth.",
    details,
    signalsUsed: ["Branch Combinations", "Branch Clashes", "Day Master Elements", "Spouse Palace", "Yong Shen"],
  };
}

// ═══════════════════════════════════════════════════════════════
// 2. WETON / NEPTU COMPATIBILITY (Javanese Primbon)
// ═══════════════════════════════════════════════════════════════

interface PrimbonRule {
  className: string;
  javanese: string;
  score: number;
  interpretation: string;
  advice: string;
}

// Primbon compatibility mapping based on combined Neptu mod 9
const PRIMBON_CLASSES: Record<number, PrimbonRule> = {
  0: { className: "Pegat", javanese: "Pegat", score: 25, interpretation: "Separation energy. This pairing tends toward disagreement and parting. Both partners must work very hard to maintain harmony.", advice: "Practice empathy daily. Establish clear communication rituals. Consider counseling for conflict resolution." },
  1: { className: "Ratu", javanese: "Ratu", score: 90, interpretation: "Royal match. This is one of the most auspicious pairings in Javanese tradition. The couple carries an energy of mutual respect and shared prosperity.", advice: "Support each other's ambitions. This bond thrives on shared goals and mutual admiration." },
  2: { className: "Jodoh", javanese: "Jodoh", score: 95, interpretation: "Destined soulmates. The cosmic alignment strongly favors this union. Deep spiritual and emotional resonance.", advice: "Trust the bond. Focus on growth together rather than control. This is a rare gift." },
  3: { className: "Topo", javanese: "Topo", score: 55, interpretation: "Ascetic pairing. The relationship can feel restrained or overly serious. Joy must be actively cultivated.", advice: "Inject playfulness into daily life. Plan adventures together. Don't let routine dull the spark." },
  4: { className: "Tinari", javanese: "Tinari", score: 75, interpretation: "Steadfast companionship. A reliable, enduring match based on loyalty and shared values.", advice: "Appreciate the stability this bond provides. Express gratitude often and avoid taking each other for granted." },
  5: { className: "Lungguh", javanese: "Lungguh", score: 80, interpretation: "Seated in comfort. This pairing suggests material abundance and domestic harmony when nurtured.", advice: "Build your home life with intentionality. Financial planning together strengthens this bond." },
  6: { className: "Gedhong", javanese: "Gedhong", score: 85, interpretation: "Palace of prosperity. An auspicious match for wealth, status, and social standing within the community.", advice: "Use your combined social influence for good. Generosity multiplies the blessings of this pairing." },
  7: { className: "Sri", javanese: "Sri", score: 88, interpretation: "Goddess of rice and prosperity. Abundance flows naturally to this couple, especially in sustenance and family.", advice: "Share your abundance with family and community. Fertility and growth are highlighted." },
  8: { className: "Lara", javanese: "Lara", score: 35, interpretation: "Painful longing. There is deep attraction but also deep potential for heartache. Intense yet turbulent.", advice: "Set healthy boundaries. Channel the intensity into creative collaboration rather than emotional drama." },
};

function calculateWetonCompatibility(wetonA: WetonResult, wetonB: WetonResult): { score: SystemScore; primbonMatch: PrimbonMatchClass } {
  const combinedNeptu = wetonA.totalNeptu + wetonB.totalNeptu;
  const classKey = combinedNeptu % 9;
  const rule = PRIMBON_CLASSES[classKey] || PRIMBON_CLASSES[0];

  const details: string[] = [
    `Partner A: ${wetonA.weton} (${wetonA.dayOfWeek} ${wetonA.pasaran}, Neptu ${wetonA.totalNeptu})`,
    `Partner B: ${wetonB.weton} (${wetonB.dayOfWeek} ${wetonB.pasaran}, Neptu ${wetonB.totalNeptu})`,
    `Combined Neptu: ${combinedNeptu} → mod 9 = ${classKey} → Class: ${rule.javanese}`,
    rule.interpretation,
  ];

  return {
    score: {
      system: "weton",
      label: "Weton / Primbon Jawa",
      score: rule.score,
      summary: `Your Weton pairing falls in the "${rule.javanese}" class — ${rule.interpretation.split(".")[0]}.`,
      details,
      signalsUsed: ["Day Neptu", "Pasaran Neptu", "Combined Neptu", "Primbon Class Lookup"],
    },
    primbonMatch: {
      className: rule.className,
      javanese: rule.javanese,
      score: rule.score,
      interpretation: rule.interpretation,
      advice: rule.advice,
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// 3. WESTERN ZODIAC SYNERGY
// ═══════════════════════════════════════════════════════════════

const ZODIAC_ELEMENT_MAP: Record<string, string> = {
  Aries: "Fire", Taurus: "Earth", Gemini: "Air", Cancer: "Water",
  Leo: "Fire", Virgo: "Earth", Libra: "Air", Scorpio: "Water",
  Sagittarius: "Fire", Capricorn: "Earth", Aquarius: "Air", Pisces: "Water",
};

const ZODIAC_QUALITY_MAP: Record<string, string> = {
  Aries: "Cardinal", Taurus: "Fixed", Gemini: "Mutable", Cancer: "Cardinal",
  Leo: "Fixed", Virgo: "Mutable", Libra: "Cardinal", Scorpio: "Fixed",
  Sagittarius: "Mutable", Capricorn: "Cardinal", Aquarius: "Fixed", Pisces: "Mutable",
};

// Classical compatibility groupings (harmonious)
const ZODIAC_HARMONY: Record<string, string[]> = {
  Aries: ["Leo", "Sagittarius", "Gemini", "Aquarius"],
  Taurus: ["Virgo", "Capricorn", "Cancer", "Pisces"],
  Gemini: ["Libra", "Aquarius", "Aries", "Leo"],
  Cancer: ["Scorpio", "Pisces", "Taurus", "Virgo"],
  Leo: ["Aries", "Sagittarius", "Gemini", "Libra"],
  Virgo: ["Taurus", "Capricorn", "Cancer", "Scorpio"],
  Libra: ["Gemini", "Aquarius", "Leo", "Sagittarius"],
  Scorpio: ["Cancer", "Pisces", "Virgo", "Capricorn"],
  Sagittarius: ["Aries", "Leo", "Libra", "Aquarius"],
  Capricorn: ["Taurus", "Virgo", "Scorpio", "Pisces"],
  Aquarius: ["Gemini", "Libra", "Aries", "Sagittarius"],
  Pisces: ["Cancer", "Scorpio", "Taurus", "Capricorn"],
};

function calculateZodiacSynergy(zodiacA: WesternZodiac, zodiacB: WesternZodiac): SystemScore {
  const details: string[] = [];
  let score = 50;

  const signA = zodiacA.sign;
  const signB = zodiacB.sign;

  // Same sign
  if (signA === signB) {
    score += 15;
    details.push(`Both ${signA} — you deeply understand each other's motivations, but mirror each other's flaws too.`);
  }

  // Element compatibility
  const elA = zodiacA.element;
  const elB = zodiacB.element;
  if (elA === elB) {
    score += 12;
    details.push(`Same element (${elA}) — natural understanding and shared temperament.`);
  } else if (
    (elA === "Fire" && elB === "Air") || (elA === "Air" && elB === "Fire") ||
    (elA === "Earth" && elB === "Water") || (elA === "Water" && elB === "Earth")
  ) {
    score += 10;
    details.push(`${elA} + ${elB} — complementary elements that feed each other's energy.`);
  } else if (
    (elA === "Fire" && elB === "Water") || (elA === "Water" && elB === "Fire") ||
    (elA === "Earth" && elB === "Air") || (elA === "Air" && elB === "Earth")
  ) {
    score -= 8;
    details.push(`${elA} + ${elB} — opposing elements. Attraction exists but requires compromise.`);
  }

  // Classical harmony check
  if (ZODIAC_HARMONY[signA]?.includes(signB)) {
    score += 15;
    details.push(`${signA} and ${signB} are classically harmonious signs — strong astrological affinity.`);
  }

  // Quality interaction
  const qualA = zodiacA.quality;
  const qualB = zodiacB.quality;
  if (qualA === qualB) {
    score -= 3;
    details.push(`Both ${qualA} quality — shared drive style, but possible power struggles.`);
  } else {
    score += 5;
    details.push(`${qualA} + ${qualB} qualities — complementary approaches to life.`);
  }

  return {
    system: "zodiac",
    label: "Western Zodiac",
    score: clamp(score, 0, 100),
    summary: `${signA} (${elA}) + ${signB} (${elB}) — ${score >= 65 ? "a harmonious astrological pairing" : score >= 45 ? "a balanced pairing with growth potential" : "a challenging pairing that demands conscious effort"}.`,
    details,
    signalsUsed: ["Sun Sign", "Zodiac Element", "Quality", "Classical Harmony"],
  };
}

// ═══════════════════════════════════════════════════════════════
// 4. CHINESE SHIO COMPATIBILITY
// ═══════════════════════════════════════════════════════════════

// Harmony triangles
const SHIO_TRIANGLES: string[][] = [
  ["Rat", "Dragon", "Monkey"],
  ["Ox", "Snake", "Rooster"],
  ["Tiger", "Horse", "Dog"],
  ["Rabbit", "Goat", "Pig"],
];

// Six Harmony pairs
const SHIO_SIX_HARMONY: [string, string][] = [
  ["Rat", "Ox"], ["Tiger", "Pig"], ["Rabbit", "Dog"],
  ["Dragon", "Rooster"], ["Snake", "Monkey"], ["Horse", "Goat"],
];

// Six Clash pairs
const SHIO_CLASHES: [string, string][] = [
  ["Rat", "Horse"], ["Ox", "Goat"], ["Tiger", "Monkey"],
  ["Rabbit", "Rooster"], ["Dragon", "Dog"], ["Snake", "Pig"],
];

function calculateShioCompatibility(shioA: ChineseZodiac, shioB: ChineseZodiac): SystemScore {
  const details: string[] = [];
  let score = 50;

  const animalA = shioA.animal;
  const animalB = shioB.animal;

  // Same animal
  if (animalA === animalB) {
    score += 10;
    details.push(`Both ${animalA} — you share the same instincts and life rhythm.`);
  }

  // Harmony triangle
  const inTriangle = SHIO_TRIANGLES.find((t) => t.includes(animalA) && t.includes(animalB));
  if (inTriangle) {
    score += 20;
    details.push(`${animalA} and ${animalB} belong to the same Harmony Triangle (${inTriangle.join(", ")}) — exceptional synergy.`);
  }

  // Six Harmony
  const isSixHarmony = SHIO_SIX_HARMONY.some(
    ([a, b]) => (a === animalA && b === animalB) || (a === animalB && b === animalA)
  );
  if (isSixHarmony) {
    score += 18;
    details.push(`${animalA} and ${animalB} form a Six Harmony Pair (六合) — deep, instinctive compatibility.`);
  }

  // Six Clash
  const isSixClash = SHIO_CLASHES.some(
    ([a, b]) => (a === animalA && b === animalB) || (a === animalB && b === animalA)
  );
  if (isSixClash) {
    score -= 20;
    details.push(`${animalA} and ${animalB} form a Six Clash Pair (六冲) — fundamental tension in values and approach.`);
  }

  // Element harmony
  const elCompat = elementComplement(shioA.element as FiveElement, shioB.element as FiveElement);
  score += elCompat;
  if (elCompat > 0) {
    details.push(`Shio elements ${shioA.element} + ${shioB.element} are in productive harmony.`);
  } else if (elCompat < 0) {
    details.push(`Shio elements ${shioA.element} + ${shioB.element} have a destructive relationship.`);
  }

  return {
    system: "shio",
    label: "Chinese Shio / Zodiac",
    score: clamp(score, 0, 100),
    summary: `${animalA} (${shioA.element}) + ${animalB} (${shioB.element}) — ${score >= 65 ? "an auspicious animal pairing" : score >= 40 ? "a workable pairing with some tension" : "a challenging pairing requiring conscious adaptation"}.`,
    details,
    signalsUsed: ["Animal Sign", "Harmony Triangle", "Six Harmony Pairs", "Six Clash Pairs", "Shio Element"],
  };
}

// ═══════════════════════════════════════════════════════════════
// 5. RELATIONSHIP TIMELINE — Easier/Harder Periods
// ═══════════════════════════════════════════════════════════════

function calculateTimeline(baziA: BaZiResult, baziB: BaZiResult, birthYearA: number): TimelineEntry[] {
  const timeline: TimelineEntry[] = [];
  const maxCycles = Math.min(baziA.luckCycles.length, baziB.luckCycles.length, 6);

  for (let i = 0; i < maxCycles; i++) {
    const cycleA = baziA.luckCycles[i];
    const cycleB = baziB.luckCycles[i];
    const yearStart = birthYearA + cycleA.startAge;
    const yearEnd = birthYearA + cycleA.endAge;

    // Compare luck cycle pillars
    const biA = branchIndex(cycleA.pillar.earthlyBranch);
    const biB = branchIndex(cycleB.pillar.earthlyBranch);

    let phase: "easier" | "harder" | "neutral" = "neutral";
    let description = "A steady period for the relationship with balanced energies from both charts.";

    if (hasCombination(biA, biB)) {
      phase = "easier";
      description = `Both partners' luck cycles are in harmony (${cycleA.pillar.branchChinese}+${cycleB.pillar.branchChinese} combination). A period of natural flow and mutual support.`;
    } else if (hasClash(biA, biB)) {
      phase = "harder";
      description = `Luck cycles clash (${cycleA.pillar.branchChinese} vs ${cycleB.pillar.branchChinese}). A period requiring extra patience, communication, and compromise.`;
    } else {
      const elCompat = elementComplement(cycleA.pillar.stemElement, cycleB.pillar.stemElement);
      if (elCompat > 5) {
        phase = "easier";
        description = `Complementary cycle elements (${cycleA.pillar.stemElement}+${cycleB.pillar.stemElement}). A productive and mutually enriching period.`;
      } else if (elCompat < 0) {
        phase = "harder";
        description = `Conflicting cycle elements (${cycleA.pillar.stemElement} vs ${cycleB.pillar.stemElement}). Navigate disagreements with extra care.`;
      }
    }

    timeline.push({ yearStart, yearEnd, phase, description });
  }

  return timeline;
}

// ═══════════════════════════════════════════════════════════════
// 6. ORCHESTRATOR — PUBLIC API
// ═══════════════════════════════════════════════════════════════

function extractReadingData(profile: BirthProfile) {
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
  const seed = hashString(seedStr);
  const rng = new SeededRandom(seed);

  return {
    bazi: calculateBaZi(year, month, day, hour, rng),
    zodiac: getWesternZodiac(month, day),
    shio: getChineseZodiac(year),
    weton: calculateWeton(dob, rng),
    year,
  };
}

export function generateCompatibilityReading(coupleProfile: CoupleProfile): CompatibilityResult {
  const dataA = extractReadingData(coupleProfile.partnerA);
  const dataB = extractReadingData(coupleProfile.partnerB);

  // Calculate all 4 system scores
  const baziScore = calculateBaZiCompatibility(dataA.bazi, dataB.bazi);
  const { score: wetonScore, primbonMatch } = calculateWetonCompatibility(dataA.weton, dataB.weton);
  const zodiacScore = calculateZodiacSynergy(dataA.zodiac, dataB.zodiac);
  const shioScore = calculateShioCompatibility(dataA.shio, dataB.shio);

  const systemScores: SystemScore[] = [baziScore, wetonScore, zodiacScore, shioScore];

  // Weighted combined score (BaZi heaviest, then Weton, then Shio, then Zodiac)
  const weights = { bazi: 0.35, weton: 0.30, zodiac: 0.15, shio: 0.20 };
  const combinedScore = Math.round(
    baziScore.score * weights.bazi +
    wetonScore.score * weights.weton +
    zodiacScore.score * weights.zodiac +
    shioScore.score * weights.shio
  );

  // Timeline
  const timeline = calculateTimeline(dataA.bazi, dataB.bazi, dataA.year);

  // Generate outlook, strengths, challenges, advice
  const strengths: string[] = [];
  const challenges: string[] = [];
  const advice: string[] = [];

  if (baziScore.score >= 65) strengths.push("Strong Four Pillars harmony — a natural energetic connection.");
  if (baziScore.score < 45) challenges.push("BaZi pillar clashes create friction that requires conscious navigation.");
  if (wetonScore.score >= 70) strengths.push(`Auspicious Weton pairing ("${primbonMatch.javanese}") — Javanese tradition strongly favors this union.`);
  if (wetonScore.score < 40) challenges.push("Primbon Weton class suggests separation energy — build intentional rituals of connection.");
  if (zodiacScore.score >= 65) strengths.push("Western Zodiac signs are in harmonious alignment — ease in communication and lifestyle.");
  if (zodiacScore.score < 45) challenges.push("Zodiac elements are in tension — different emotional languages may cause misunderstanding.");
  if (shioScore.score >= 65) strengths.push("Chinese Shio animals form a harmonious group — shared values and life rhythm.");
  if (shioScore.score < 40) challenges.push("Shio animal clash — fundamentally different instincts require patience and understanding.");

  if (combinedScore >= 75) {
    advice.push("This pairing has strong cosmic alignment. Focus on growth, shared goals, and mutual respect to maximize this potential.");
    advice.push("Don't become complacent — even the best matches require intentional nurturing.");
  } else if (combinedScore >= 50) {
    advice.push("A balanced pairing with both strengths and growth areas. Conscious communication is your greatest tool.");
    advice.push("Identify your complementary strengths and lean into them as a team.");
  } else {
    advice.push("This pairing faces significant cosmic headwinds. Success is absolutely possible but demands exceptional commitment.");
    advice.push("Consider seeking guidance from a trusted counselor to navigate recurring friction points.");
  }

  const overallOutlook = combinedScore >= 80
    ? "An exceptionally harmonious union. The stars align strongly in your favor — nurture this rare gift."
    : combinedScore >= 65
    ? "A naturally supportive connection with strong foundations. Minor tensions are easily overcome with mutual effort."
    : combinedScore >= 50
    ? "A relationship of balance — neither effortless nor impossible. Your growth together depends on conscious choice."
    : combinedScore >= 35
    ? "A challenging but transformative connection. The friction you experience can forge deep resilience if both partners commit."
    : "A deeply challenging pairing. Profound personal growth is possible, but both partners must be prepared for significant effort.";

  return {
    coupleProfile,
    combinedScore,
    systemScores,
    primbonMatch,
    timeline,
    overallOutlook,
    strengths,
    challenges,
    advice,
    generatedAt: new Date(),
  };
}
