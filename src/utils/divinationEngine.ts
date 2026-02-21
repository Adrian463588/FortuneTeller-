import {
  BirthProfile,
  ReadingResult,
  WesternZodiac,
  ChineseZodiac,
  BaZiResult,
  WetonResult,
  NumerologyResult,
  FengShuiResult,
  MisfortuneIndex,
  MortalityTheme,
  AdviceItem,
  DecadeStrategy,
  DirectionInfo,
  FengShuiDirection,
  TenGodRelation,
  TenGodName,
  ShenShaEntry,
  YongShenResult,
  Pillar,
  HeavenlyStem,
  EarthlyBranch,
  FiveElement,
  Pasaran,
  DayOfWeek,
  LuckCycle,
  DomainPrediction,
  YearlyPrediction,
  DecadePrediction,
  PredictionCategory,
} from "./types";

// ═══════════════════════════════════════════════════════════════
// DETERMINISTIC SEED GENERATOR
// ═══════════════════════════════════════════════════════════════

export function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export class SeededRandom {
  private seed: number;
  constructor(seed: number) {
    this.seed = seed;
  }
  next(): number {
    this.seed = (this.seed * 16807 + 0) % 2147483647;
    return this.seed / 2147483647;
  }
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
  pick<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }
  shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}

// ═══════════════════════════════════════════════════════════════
// LOOKUP TABLES
// ═══════════════════════════════════════════════════════════════

export const HEAVENLY_STEMS: { name: HeavenlyStem; chinese: string; element: FiveElement }[] = [
  { name: "Jia", chinese: "甲", element: "Wood" },
  { name: "Yi", chinese: "乙", element: "Wood" },
  { name: "Bing", chinese: "丙", element: "Fire" },
  { name: "Ding", chinese: "丁", element: "Fire" },
  { name: "Wu", chinese: "戊", element: "Earth" },
  { name: "Ji", chinese: "己", element: "Earth" },
  { name: "Geng", chinese: "庚", element: "Metal" },
  { name: "Xin", chinese: "辛", element: "Metal" },
  { name: "Ren", chinese: "壬", element: "Water" },
  { name: "Gui", chinese: "癸", element: "Water" },
];

export const EARTHLY_BRANCHES: { name: EarthlyBranch; chinese: string; element: FiveElement; animal: string }[] = [
  { name: "Zi", chinese: "子", element: "Water", animal: "Rat" },
  { name: "Chou", chinese: "丑", element: "Earth", animal: "Ox" },
  { name: "Yin", chinese: "寅", element: "Wood", animal: "Tiger" },
  { name: "Mao", chinese: "卯", element: "Wood", animal: "Rabbit" },
  { name: "Chen", chinese: "辰", element: "Earth", animal: "Dragon" },
  { name: "Si", chinese: "巳", element: "Fire", animal: "Snake" },
  { name: "Wu", chinese: "午", element: "Fire", animal: "Horse" },
  { name: "Wei", chinese: "未", element: "Earth", animal: "Goat" },
  { name: "Shen", chinese: "申", element: "Metal", animal: "Monkey" },
  { name: "You", chinese: "酉", element: "Metal", animal: "Rooster" },
  { name: "Xu", chinese: "戌", element: "Earth", animal: "Dog" },
  { name: "Hai", chinese: "亥", element: "Water", animal: "Pig" },
];

const ZODIAC_DATA: Record<string, Omit<WesternZodiac, "sign">> = {
  Aries: {
    symbol: "♈",
    element: "Fire",
    quality: "Cardinal",
    rulingPlanet: "Mars",
    dateRange: "Mar 21 – Apr 19",
    traits: ["Bold", "Ambitious", "Energetic", "Pioneering"],
    strengths: ["Courageous", "Determined", "Confident", "Enthusiastic"],
    weaknesses: ["Impatient", "Short-tempered", "Impulsive"],
    description: "Aries is the trailblazer of the zodiac. Driven by the fiery energy of Mars, you charge forward with passion and fearlessness. Your pioneering spirit inspires others to follow your lead.",
  },
  Taurus: {
    symbol: "♉",
    element: "Earth",
    quality: "Fixed",
    rulingPlanet: "Venus",
    dateRange: "Apr 20 – May 20",
    traits: ["Reliable", "Patient", "Practical", "Devoted"],
    strengths: ["Responsible", "Stable", "Grounded", "Artistic"],
    weaknesses: ["Stubborn", "Possessive", "Materialistic"],
    description: "Taurus embodies stability and sensory pleasure. Ruled by Venus, you appreciate beauty, comfort, and the finer things in life. Your determination is unmatched once you set your mind on a goal.",
  },
  Gemini: {
    symbol: "♊",
    element: "Air",
    quality: "Mutable",
    rulingPlanet: "Mercury",
    dateRange: "May 21 – Jun 20",
    traits: ["Versatile", "Curious", "Witty", "Communicative"],
    strengths: ["Adaptable", "Intellectual", "Social", "Expressive"],
    weaknesses: ["Indecisive", "Inconsistent", "Superficial"],
    description: "Gemini is the communicator and connector. Under Mercury's influence, your mind is always active, seeking new information and experiences. Your dual nature allows you to see multiple perspectives.",
  },
  Cancer: {
    symbol: "♋",
    element: "Water",
    quality: "Cardinal",
    rulingPlanet: "Moon",
    dateRange: "Jun 21 – Jul 22",
    traits: ["Nurturing", "Intuitive", "Protective", "Emotional"],
    strengths: ["Loyal", "Empathetic", "Imaginative", "Tenacious"],
    weaknesses: ["Moody", "Clingy", "Overly sensitive"],
    description: "Cancer is the nurturer of the zodiac. Guided by the Moon, your emotions run deep and your intuition is razor-sharp. You create safe havens for those you love.",
  },
  Leo: {
    symbol: "♌",
    element: "Fire",
    quality: "Fixed",
    rulingPlanet: "Sun",
    dateRange: "Jul 23 – Aug 22",
    traits: ["Charismatic", "Creative", "Generous", "Dramatic"],
    strengths: ["Confident", "Warm-hearted", "Inspiring", "Natural leader"],
    weaknesses: ["Arrogant", "Dominating", "Attention-seeking"],
    description: "Leo is the royal heart of the zodiac. With the Sun as your ruler, you radiate warmth, confidence, and creativity. Your generous spirit and natural magnetism draw others to you.",
  },
  Virgo: {
    symbol: "♍",
    element: "Earth",
    quality: "Mutable",
    rulingPlanet: "Mercury",
    dateRange: "Aug 23 – Sep 22",
    traits: ["Analytical", "Meticulous", "Practical", "Diligent"],
    strengths: ["Detail-oriented", "Reliable", "Modest", "Helpful"],
    weaknesses: ["Overcritical", "Perfectionistic", "Anxious"],
    description: "Virgo is the perfectionist and healer. Mercury grants you an analytical mind that can dissect any problem. Your service-oriented nature makes you indispensable to those around you.",
  },
  Libra: {
    symbol: "♎",
    element: "Air",
    quality: "Cardinal",
    rulingPlanet: "Venus",
    dateRange: "Sep 23 – Oct 22",
    traits: ["Diplomatic", "Harmonious", "Fair-minded", "Social"],
    strengths: ["Cooperative", "Gracious", "Idealistic", "Charming"],
    weaknesses: ["Indecisive", "Avoids confrontation", "Self-pitying"],
    description: "Libra is the keeper of balance and harmony. Venus blesses you with charm, grace, and an innate sense of justice. You seek beauty and equilibrium in all areas of life.",
  },
  Scorpio: {
    symbol: "♏",
    element: "Water",
    quality: "Fixed",
    rulingPlanet: "Pluto",
    dateRange: "Oct 23 – Nov 21",
    traits: ["Passionate", "Intense", "Magnetic", "Strategic"],
    strengths: ["Resourceful", "Brave", "Loyal", "Perceptive"],
    weaknesses: ["Jealous", "Secretive", "Vengeful"],
    description: "Scorpio is the transformer of the zodiac. Pluto's influence gives you unmatched depth and intensity. You see beneath the surface and possess the power to reinvent yourself.",
  },
  Sagittarius: {
    symbol: "♐",
    element: "Fire",
    quality: "Mutable",
    rulingPlanet: "Jupiter",
    dateRange: "Nov 22 – Dec 21",
    traits: ["Adventurous", "Optimistic", "Philosophical", "Free-spirited"],
    strengths: ["Generous", "Humorous", "Idealistic", "Enthusiastic"],
    weaknesses: ["Restless", "Tactless", "Overconfident"],
    description: "Sagittarius is the explorer and philosopher. Jupiter expands your horizons, filling you with wanderlust and a thirst for knowledge. Your optimism is infectious and your spirit is untameable.",
  },
  Capricorn: {
    symbol: "♑",
    element: "Earth",
    quality: "Cardinal",
    rulingPlanet: "Saturn",
    dateRange: "Dec 22 – Jan 19",
    traits: ["Ambitious", "Disciplined", "Pragmatic", "Patient"],
    strengths: ["Responsible", "Self-controlled", "Strategic", "Persistent"],
    weaknesses: ["Pessimistic", "Rigid", "Workaholic"],
    description: "Capricorn is the master builder. Saturn instills discipline, ambition, and a long-term vision. You climb steadily toward your goals, building lasting structures in your wake.",
  },
  Aquarius: {
    symbol: "♒",
    element: "Air",
    quality: "Fixed",
    rulingPlanet: "Uranus",
    dateRange: "Jan 20 – Feb 18",
    traits: ["Innovative", "Humanitarian", "Independent", "Visionary"],
    strengths: ["Original", "Progressive", "Intellectual", "Idealistic"],
    weaknesses: ["Aloof", "Rebellious", "Unpredictable"],
    description: "Aquarius is the visionary and reformer. Uranus sparks your inventive mind and humanitarian spirit. You march to the beat of your own drum and dream of a better future for all.",
  },
  Pisces: {
    symbol: "♓",
    element: "Water",
    quality: "Mutable",
    rulingPlanet: "Neptune",
    dateRange: "Feb 19 – Mar 20",
    traits: ["Compassionate", "Artistic", "Intuitive", "Dreamy"],
    strengths: ["Empathetic", "Imaginative", "Gentle", "Wise"],
    weaknesses: ["Escapist", "Overly trusting", "Melancholic"],
    description: "Pisces is the mystic and dreamer. Neptune dissolves boundaries, giving you profound empathy and artistic vision. Your soul swims in the depths of human experience.",
  },
};

const CHINESE_ZODIAC_ANIMALS = [
  "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake",
  "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig",
];

const CHINESE_ZODIAC_ELEMENTS: FiveElement[] = ["Wood", "Fire", "Earth", "Metal", "Water"];

const CHINESE_ZODIAC_TRAITS: Record<string, { traits: string[]; compatibility: string[]; desc: string }> = {
  Rat: { traits: ["Resourceful", "Quick-witted", "Versatile", "Charming"], compatibility: ["Dragon", "Monkey", "Ox"], desc: "The Rat is clever and resourceful, able to adapt to any situation with sharp intellect and natural charm." },
  Ox: { traits: ["Diligent", "Dependable", "Determined", "Patient"], compatibility: ["Rat", "Snake", "Rooster"], desc: "The Ox embodies strength through patience and hard work. Steadfast and reliable, you build enduring foundations." },
  Tiger: { traits: ["Brave", "Competitive", "Unpredictable", "Charismatic"], compatibility: ["Dragon", "Horse", "Pig"], desc: "The Tiger is a born leader with magnetic charisma. Bold and fierce, you command respect wherever you go." },
  Rabbit: { traits: ["Gentle", "Elegant", "Alert", "Compassionate"], compatibility: ["Goat", "Monkey", "Dog", "Pig"], desc: "The Rabbit brings elegance and peace. With a gentle demeanor and keen intuition, you navigate life with grace." },
  Dragon: { traits: ["Confident", "Ambitious", "Enthusiastic", "Intelligent"], compatibility: ["Rat", "Tiger", "Snake"], desc: "The Dragon is a symbol of power and good fortune. Your charisma and ambition make you destined for greatness." },
  Snake: { traits: ["Enigmatic", "Wise", "Intuitive", "Graceful"], compatibility: ["Dragon", "Rooster", "Ox"], desc: "The Snake is deeply intuitive and philosophical. Your wisdom and mystery make you a compelling presence." },
  Horse: { traits: ["Energetic", "Free-spirited", "Warm", "Independent"], compatibility: ["Tiger", "Goat", "Rabbit"], desc: "The Horse is driven by freedom and vitality. Your enthusiastic spirit and warmth inspire everyone around you." },
  Goat: { traits: ["Calm", "Artistic", "Kind", "Gentle"], compatibility: ["Rabbit", "Horse", "Pig"], desc: "The Goat is a gentle soul with deep artistic sensibility. Your kindness and creativity enrich the world." },
  Monkey: { traits: ["Sharp", "Curious", "Inventive", "Playful"], compatibility: ["Rat", "Dragon", "Snake"], desc: "The Monkey is endlessly inventive and entertaining. Your quick mind and playful nature solve problems with flair." },
  Rooster: { traits: ["Observant", "Hardworking", "Courageous", "Confident"], compatibility: ["Ox", "Snake", "Dragon"], desc: "The Rooster is bold and meticulous. With sharp observation and tireless work ethic, you achieve excellence." },
  Dog: { traits: ["Loyal", "Honest", "Prudent", "Kind"], compatibility: ["Rabbit", "Tiger", "Horse"], desc: "The Dog is the most loyal companion. Your honesty and sense of justice make you a trusted friend and protector." },
  Pig: { traits: ["Generous", "Compassionate", "Diligent", "Optimistic"], compatibility: ["Tiger", "Rabbit", "Goat"], desc: "The Pig brings warmth and generosity. Your optimistic outlook and big heart make you beloved by all." },
};

// Neptu lookup table (from TRD)
const NEPTU_DAY: Record<DayOfWeek, number> = {
  Sunday: 5,
  Monday: 4,
  Tuesday: 3,
  Wednesday: 7,
  Thursday: 8,
  Friday: 6,
  Saturday: 9,
};

const NEPTU_PASARAN: Record<Pasaran, number> = {
  Legi: 5,
  Pahing: 9,
  Pon: 7,
  Wage: 4,
  Kliwon: 8,
};

const PASARAN_CYCLE: Pasaran[] = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"];

const DAY_NAMES: DayOfWeek[] = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

const DAY_NAMES_JAVANESE: Record<DayOfWeek, string> = {
  Sunday: "Minggu",
  Monday: "Senin",
  Tuesday: "Selasa",
  Wednesday: "Rabu",
  Thursday: "Kamis",
  Friday: "Jumat",
  Saturday: "Sabtu",
};

// ═══════════════════════════════════════════════════════════════
// WESTERN ZODIAC CALCULATOR
// ═══════════════════════════════════════════════════════════════

export function getWesternZodiac(month: number, day: number): WesternZodiac {
  let sign: string;
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) sign = "Aries";
  else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) sign = "Taurus";
  else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) sign = "Gemini";
  else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) sign = "Cancer";
  else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) sign = "Leo";
  else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) sign = "Virgo";
  else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) sign = "Libra";
  else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) sign = "Scorpio";
  else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) sign = "Sagittarius";
  else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) sign = "Capricorn";
  else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) sign = "Aquarius";
  else sign = "Pisces";

  return { sign, ...ZODIAC_DATA[sign] };
}

// ═══════════════════════════════════════════════════════════════
// CHINESE ZODIAC CALCULATOR
// ═══════════════════════════════════════════════════════════════

export function getChineseZodiac(year: number): ChineseZodiac {
  const animalIndex = (year - 4) % 12;
  const animal = CHINESE_ZODIAC_ANIMALS[animalIndex >= 0 ? animalIndex : animalIndex + 12];
  const elementIndex = Math.floor(((year - 4) % 10) / 2);
  const element = CHINESE_ZODIAC_ELEMENTS[elementIndex >= 0 ? elementIndex : elementIndex + 5];
  const yinYang = year % 2 === 0 ? "Yang" : "Yin";
  const data = CHINESE_ZODIAC_TRAITS[animal];

  return {
    animal,
    element,
    yinYang,
    traits: data.traits,
    compatibility: data.compatibility,
    description: data.desc,
  };
}

// ═══════════════════════════════════════════════════════════════
// BAZI / SAJU PALJA (FOUR PILLARS) CALCULATOR
// ═══════════════════════════════════════════════════════════════

export function getStemBranch(stemIdx: number, branchIdx: number): Pillar {
  const si = ((stemIdx % 10) + 10) % 10;
  const bi = ((branchIdx % 12) + 12) % 12;
  const stem = HEAVENLY_STEMS[si];
  const branch = EARTHLY_BRANCHES[bi];
  return {
    heavenlyStem: stem.name,
    earthlyBranch: branch.name,
    stemElement: stem.element,
    branchElement: branch.element,
    stemChinese: stem.chinese,
    branchChinese: branch.chinese,
  };
}

// ─── Ten Gods (十神 / Shi Shen) Calculator ─────────────────────

const ELEMENT_ORDER: FiveElement[] = ["Wood", "Fire", "Earth", "Metal", "Water"];

function getElementIndex(el: FiveElement): number {
  return ELEMENT_ORDER.indexOf(el);
}

// Productive cycle: Wood→Fire→Earth→Metal→Water→Wood
// Destructive cycle: Wood→Earth→Water→Fire→Metal→Wood

function getTenGodRelation(dayMasterElement: FiveElement, dayMasterStemIdx: number, targetElement: FiveElement, targetStemIdx: number): { relation: TenGodName; chinese: string; english: string; meaning: string } {
  const dmIdx = getElementIndex(dayMasterElement);
  const tIdx = getElementIndex(targetElement);
  const samePolarity = (dayMasterStemIdx % 2) === (targetStemIdx % 2);

  // Same element
  if (dmIdx === tIdx) {
    return samePolarity
      ? { relation: "Bi Jian", chinese: "比肩", english: "Friend (Shoulder)", meaning: "Peer support, independence, self-reliance. You attract allies who mirror your energy." }
      : { relation: "Jie Cai", chinese: "劫财", english: "Rob Wealth", meaning: "Competition, rivalry, unexpected expenses. Can indicate boldness and entrepreneurial drive." };
  }
  // Day Master produces target (productive cycle +1)
  if ((dmIdx + 1) % 5 === tIdx) {
    return samePolarity
      ? { relation: "Shi Shen", chinese: "食神", english: "Eating God", meaning: "Creativity, enjoyment, talent expression. A gentle outpouring of your inner gifts." }
      : { relation: "Shang Guan", chinese: "伤官", english: "Hurting Officer", meaning: "Rebellion, brilliance, unconventional thinking. Sharp intelligence that challenges authority." };
  }
  // Day Master's produce produces target (+2)
  if ((dmIdx + 2) % 5 === tIdx) {
    return samePolarity
      ? { relation: "Pian Cai", chinese: "偏财", english: "Indirect Wealth", meaning: "Windfall income, social wealth, generosity. Money flows through connections and opportunity." }
      : { relation: "Zheng Cai", chinese: "正财", english: "Direct Wealth", meaning: "Steady income, frugality, earned prosperity. Wealth built through diligence and responsibility." };
  }
  // Target controls Day Master (destructive cycle)
  if ((tIdx + 1) % 5 === (dmIdx + 3) % 5 || (dmIdx + 3) % 5 === tIdx) {
    // Target destroys Day Master → Officer/7 Killings
    if ((tIdx + 2) % 5 === dmIdx || (dmIdx + 3) % 5 === tIdx) {
      return samePolarity
        ? { relation: "Qi Sha", chinese: "七杀", english: "Seven Killings", meaning: "Intense pressure, power, ambition. A fierce driving force that forges resilience and authority." }
        : { relation: "Zheng Guan", chinese: "正官", english: "Direct Officer", meaning: "Discipline, status, career authority. Upright leadership and recognition from structure." };
    }
  }
  // Target produces Day Master (resource)
  if ((tIdx + 1) % 5 === dmIdx) {
    return samePolarity
      ? { relation: "Pian Yin", chinese: "偏印", english: "Indirect Seal", meaning: "Unconventional knowledge, spiritual insight, alternative learning. Wisdom from hidden sources." }
      : { relation: "Zheng Yin", chinese: "正印", english: "Direct Seal", meaning: "Education, nurturing, protection. Support from elders, mentors, and traditional knowledge." };
  }

  // Fallback: controlling relationship
  return samePolarity
    ? { relation: "Qi Sha", chinese: "七杀", english: "Seven Killings", meaning: "Intense pressure and transformation. A catalyst for personal power and resilience." }
    : { relation: "Zheng Guan", chinese: "正官", english: "Direct Officer", meaning: "Authority, structure, and disciplined advancement. Recognition through proper channels." };
}

function calculateTenGods(dayMasterStemIdx: number, yearPillar: Pillar, monthPillar: Pillar, dayPillar: Pillar, hourPillar: Pillar): TenGodRelation[] {
  const dmStem = HEAVENLY_STEMS[((dayMasterStemIdx % 10) + 10) % 10];
  const pillarEntries: { pillar: Pillar; name: "year" | "month" | "day" | "hour" }[] = [
    { pillar: yearPillar, name: "year" },
    { pillar: monthPillar, name: "month" },
    { pillar: dayPillar, name: "day" },
    { pillar: hourPillar, name: "hour" },
  ];

  const results: TenGodRelation[] = [];
  for (const entry of pillarEntries) {
    // Stem of each pillar (skip day stem — it IS the Day Master)
    if (entry.name !== "day") {
      const targetStemIdx = HEAVENLY_STEMS.findIndex(s => s.name === entry.pillar.heavenlyStem);
      const targetStem = HEAVENLY_STEMS[targetStemIdx];
      const rel = getTenGodRelation(dmStem.element, ((dayMasterStemIdx % 10) + 10) % 10, targetStem.element, targetStemIdx);
      results.push({
        stem: targetStem.name,
        stemChinese: targetStem.chinese,
        element: targetStem.element,
        relation: rel.relation,
        chinese: rel.chinese,
        english: rel.english,
        meaning: rel.meaning,
        pillar: entry.name,
      });
    }
  }
  return results;
}

// ─── Shen Sha (神煞 / Symbolic Stars) Identifier ──────────────

interface ShenShaRule {
  name: string;
  chinese: string;
  type: "auspicious" | "inauspicious" | "neutral";
  meaning: string;
  check: (yearBranch: number, monthBranch: number, dayBranch: number, hourBranch: number, dayStem: number) => string | null;
}

const SHEN_SHA_RULES: ShenShaRule[] = [
  {
    name: "Tian Yi Noble",
    chinese: "天乙贵人",
    type: "auspicious",
    meaning: "The Heavenly Noble Star brings helpful people, mentors, and timely assistance into your life. Obstacles resolve through unexpected aid.",
    check: (yb, mb, db, hb, ds) => {
      const nobleMap: Record<number, number[]> = { 0: [1,7], 1: [0,6], 2: [9,5], 3: [11,5], 4: [1,7], 5: [0,8], 6: [7,1], 7: [6,10], 8: [3,9], 9: [3,9] };
      const nobles = nobleMap[ds] || [];
      if (nobles.includes(yb)) return "Year Branch";
      if (nobles.includes(mb)) return "Month Branch";
      if (nobles.includes(db)) return "Day Branch";
      if (nobles.includes(hb)) return "Hour Branch";
      return null;
    },
  },
  {
    name: "Peach Blossom",
    chinese: "桃花",
    type: "neutral",
    meaning: "The Peach Blossom Star enhances romantic attraction, charisma, and social charm. It can indicate popularity or romantic entanglements.",
    check: (yb, _mb, db) => {
      const peachMap: Record<number, number> = { 0: 9, 1: 6, 2: 3, 3: 0, 4: 9, 5: 6, 6: 3, 7: 0, 8: 9, 9: 6, 10: 3, 11: 0 };
      if (peachMap[yb] === db) return "Year→Day";
      return null;
    },
  },
  {
    name: "Academic Star",
    chinese: "文昌",
    type: "auspicious",
    meaning: "The Academic Star favours intellectual pursuits, examinations, writing, and scholarly achievement. Excellent for education and research.",
    check: (_yb, _mb, _db, _hb, ds) => {
      const academicBranch: Record<number, number> = { 0: 5, 1: 6, 2: 8, 3: 9, 4: 8, 5: 9, 6: 11, 7: 0, 8: 2, 9: 3 };
      const target = academicBranch[ds];
      if (target === _db) return "Day Branch";
      if (target === _hb) return "Hour Branch";
      return null;
    },
  },
  {
    name: "Travelling Horse",
    chinese: "驿马",
    type: "neutral",
    meaning: "The Travelling Horse Star signals movement, change, travel, and career relocation. A dynamic energy that resists stagnation.",
    check: (yb, _mb, db) => {
      const horseMap: Record<number, number> = { 0: 2, 1: 11, 2: 8, 3: 5, 4: 2, 5: 11, 6: 8, 7: 5, 8: 2, 9: 11, 10: 8, 11: 5};
      if (horseMap[yb] === db) return "Year→Day";
      return null;
    },
  },
  {
    name: "Sky Virtue",
    chinese: "天德",
    type: "auspicious",
    meaning: "The Sky Virtue Star brings moral fortitude, ancestral protection, and the ability to turn danger into opportunity.",
    check: (_yb, mb) => {
      const virtueMonth = [3, 8, 1, 6, 3, 8, 1, 6, 3, 8, 1, 6];
      if (virtueMonth[mb % 12] === mb) return "Month Branch";
      return null;
    },
  },
  {
    name: "Funeral Gate",
    chinese: "丧门",
    type: "inauspicious",
    meaning: "The Funeral Gate Star warns of potential grief, loss, or emotional upheaval. Extra care for health and relationships is advised.",
    check: (yb, _mb, _db, _hb) => {
      const funeralOffset = (yb + 2) % 12;
      if (funeralOffset === _db) return "Year→Day";
      return null;
    },
  },
  {
    name: "Robbery Sha",
    chinese: "劫煞",
    type: "inauspicious",
    meaning: "The Robbery Sha warns of financial loss, theft, or betrayal. Caution with investments and trust during this influence.",
    check: (yb, _mb, db) => {
      const robberyMap: Record<number, number> = { 0: 5, 1: 2, 2: 11, 3: 8, 4: 5, 5: 2, 6: 11, 7: 8, 8: 5, 9: 2, 10: 11, 11: 8 };
      if (robberyMap[yb] === db) return "Year→Day";
      return null;
    },
  },
  {
    name: "Longevity Star",
    chinese: "长生",
    type: "auspicious",
    meaning: "The Longevity Star signals vitality, perseverance, and the potential for a long, healthy life. New beginnings are favoured.",
    check: (_yb, _mb, _db, _hb, ds) => {
      const longMap: Record<number, number> = { 0: 11, 1: 6, 2: 2, 3: 9, 4: 2, 5: 9, 6: 5, 7: 0, 8: 8, 9: 3 };
      if (longMap[ds] === _db) return "Day Branch";
      return null;
    },
  },
  {
    name: "Heavenly Kitchen",
    chinese: "天厨",
    type: "auspicious",
    meaning: "The Heavenly Kitchen Star brings abundance in food, resources, and material comfort. Especially favourable for hospitality and culinary pursuits.",
    check: (_yb, _mb, _db, _hb, ds) => {
      const kitchenMap: Record<number, number> = { 0: 5, 1: 6, 2: 5, 3: 6, 4: 5, 5: 6, 6: 11, 7: 0, 8: 11, 9: 0 };
      if (kitchenMap[ds] === _db) return "Day Branch";
      return null;
    },
  },
  {
    name: "Solitary Star",
    chinese: "孤辰",
    type: "inauspicious",
    meaning: "The Solitary Star indicates periods of loneliness, independence by necessity, or difficulty forming partnerships. Self-reliance becomes crucial.",
    check: (yb, _mb, db) => {
      const solitaryMap: Record<number, number> = { 0: 2, 1: 2, 2: 5, 3: 5, 4: 5, 5: 8, 6: 8, 7: 8, 8: 11, 9: 11, 10: 11, 11: 2 };
      if (solitaryMap[yb] === db) return "Year→Day";
      return null;
    },
  },
];

function identifyShenSha(yearStemIdx: number, yearBranchIdx: number, monthBranchIdx: number, dayBranchIdx: number, hourBranchIdx: number, dayStemIdx: number): ShenShaEntry[] {
  const results: ShenShaEntry[] = [];
  const yb = ((yearBranchIdx % 12) + 12) % 12;
  const mb = ((monthBranchIdx % 12) + 12) % 12;
  const db = ((dayBranchIdx % 12) + 12) % 12;
  const hb = ((hourBranchIdx % 12) + 12) % 12;
  const ds = ((dayStemIdx % 10) + 10) % 10;

  for (const rule of SHEN_SHA_RULES) {
    const trigger = rule.check(yb, mb, db, hb, ds);
    if (trigger) {
      results.push({
        name: rule.name,
        chinese: rule.chinese,
        type: rule.type,
        meaning: rule.meaning,
        triggerPillar: trigger,
      });
    }
  }
  return results;
}

// ─── Yong Shen (用神 / Useful God) Calculator ─────────────────

function calculateYongShen(balance: Record<FiveElement, number>, dayMaster: FiveElement, dominant: FiveElement, weakest: FiveElement): YongShenResult {
  // Productive cycle: Wood→Fire→Earth→Metal→Water→Wood
  const produces: Record<FiveElement, FiveElement> = { Wood: "Fire", Fire: "Earth", Earth: "Metal", Metal: "Water", Water: "Wood" };
  // Controlling cycle: Wood→Earth, Earth→Water, Water→Fire, Fire→Metal, Metal→Wood
  const controls: Record<FiveElement, FiveElement> = { Wood: "Earth", Fire: "Metal", Earth: "Water", Metal: "Wood", Water: "Fire" };
  const controlledBy: Record<FiveElement, FiveElement> = { Wood: "Metal", Fire: "Water", Earth: "Wood", Metal: "Fire", Water: "Earth" };
  const producedBy: Record<FiveElement, FiveElement> = { Wood: "Water", Fire: "Wood", Earth: "Fire", Metal: "Earth", Water: "Metal" };

  const total = Object.values(balance).reduce((a, b) => a + b, 0);
  const dmCount = balance[dayMaster];
  const isStrong = dmCount >= total / 5 * 1.2;

  let usefulElement: FiveElement;
  let avoidElement: FiveElement;
  let rationale: string;

  if (isStrong) {
    // Strong Day Master → weaken it: use the element it produces (exhaust), or the element that controls it
    usefulElement = produces[dayMaster]; // Exhaust method
    avoidElement = producedBy[dayMaster]; // Avoid what strengthens it
    rationale = `Your ${dayMaster} Day Master is strong (${dmCount}/${total} element points). The "Useful God" (用神) is ${usefulElement} — it exhausts excess ${dayMaster} energy through productive flow. Avoid ${avoidElement} which would further strengthen an already dominant Day Master.`;
  } else {
    // Weak Day Master → strengthen it: use its parent element (what produces it), or same element
    usefulElement = producedBy[dayMaster]; // Mother nurtures child
    avoidElement = controlledBy[dayMaster]; // Avoid what attacks it
    rationale = `Your ${dayMaster} Day Master is relatively weak (${dmCount}/${total} element points). The "Useful God" (用神) is ${usefulElement} — it nurtures and strengthens your Day Master through the productive cycle. Avoid ${avoidElement} which further weakens your core element.`;
  }

  return { usefulElement, avoidElement, rationale };
}


export function calculateBaZi(year: number, month: number, day: number, hour: number, rng: SeededRandom): BaZiResult {
  // Year pillar
  const yearStemIdx = (year - 4) % 10;
  const yearBranchIdx = (year - 4) % 12;
  const yearPillar = getStemBranch(yearStemIdx, yearBranchIdx);

  // Month pillar (simplified: based on month and year stem)
  const monthBranchIdx = (month + 1) % 12; // Feb=Yin(Tiger), etc.
  const monthStemIdx = (yearStemIdx * 2 + month) % 10;
  const monthPillar = getStemBranch(monthStemIdx, monthBranchIdx);

  // Day pillar (simplified approximation using a known formula)
  const baseDate = new Date(2000, 0, 7); // Known Jia-Zi day
  const targetDate = new Date(year, month - 1, day);
  const diffDays = Math.floor((targetDate.getTime() - baseDate.getTime()) / 86400000);
  const dayStemIdx = diffDays % 10;
  const dayBranchIdx = diffDays % 12;
  const dayPillar = getStemBranch(dayStemIdx, dayBranchIdx);

  // Hour pillar
  const hourBranchIdx = Math.floor(((hour + 1) % 24) / 2);
  const hourStemIdx = (dayStemIdx * 2 + hourBranchIdx) % 10;
  const hourPillar = getStemBranch(hourStemIdx, hourBranchIdx);

  // Calculate element balance
  const elements: FiveElement[] = ["Wood", "Fire", "Earth", "Metal", "Water"];
  const balance: Record<FiveElement, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  const pillars = [yearPillar, monthPillar, dayPillar, hourPillar];
  pillars.forEach((p) => {
    balance[p.stemElement] += 1;
    balance[p.branchElement] += 1;
  });

  const dayMaster = dayPillar.stemElement;
  const dominant = elements.reduce((a, b) => (balance[a] >= balance[b] ? a : b));
  const weakest = elements.reduce((a, b) => (balance[a] <= balance[b] ? a : b));

  // Generate luck cycles
  const luckCycles: LuckCycle[] = [];
  const cycleThemes = [
    "Foundation & Learning", "Growth & Discovery", "Ambition & Achievement",
    "Mastery & Influence", "Wisdom & Harvest", "Legacy & Reflection",
    "Renewal & Transformation", "Transcendence & Peace",
  ];
  const cycleDescs = [
    "A period of building essential foundations. Focus on education, family bonds, and discovering your innate talents.",
    "Exploration and expansion mark this cycle. New opportunities emerge as your confidence grows and horizons broaden.",
    "Ambition reaches its peak. Career advancement and significant achievements define this transformative decade.",
    "You command respect and influence. Your expertise is recognized, and leadership roles come naturally.",
    "The fruits of your labor ripen. Financial stability and emotional fulfillment characterize this rewarding era.",
    "Deep wisdom guides your decisions. Reflection on your journey brings clarity and purposeful action.",
    "A powerful cycle of reinvention. Old patterns dissolve as new paths of meaning emerge.",
    "Inner peace and spiritual depth define this cycle. You find harmony between action and stillness.",
  ];

  for (let i = 0; i < 8; i++) {
    const cycleStemIdx = (monthStemIdx + i + 1) % 10;
    const cycleBranchIdx = (monthBranchIdx + i + 1) % 12;
    luckCycles.push({
      startAge: i * 10,
      endAge: (i + 1) * 10 - 1,
      pillar: getStemBranch(cycleStemIdx, cycleBranchIdx),
      theme: cycleThemes[i],
      description: cycleDescs[i],
    });
  }

  // Personality based on day master
  const personalityMap: Record<FiveElement, string> = {
    Wood: "You are growth-oriented, compassionate, and visionary. Like a tree reaching for sunlight, you seek expansion and nurture those around you. Your creative spirit and idealism drive you to make the world a better place.",
    Fire: "You radiate warmth, passion, and charisma. Your dynamic energy ignites inspiration in others. Impulsive yet generous, you live fully and love deeply, leaving a trail of light wherever you go.",
    Earth: "You embody stability, reliability, and nurturing wisdom. Grounded and practical, you are the foundation others build upon. Your patience and methodical approach lead to lasting achievements.",
    Metal: "You possess clarity, precision, and unwavering determination. Like refined steel, you are strong and decisive. Your sense of justice and discipline command respect and admiration.",
    Water: "You flow with adaptability, intuition, and deep intelligence. Like a river, you find your way around obstacles with grace. Your reflective nature conceals profound wisdom and emotional depth.",
  };

  const strengthsMap: Record<FiveElement, string[]> = {
    Wood: ["Creative vision", "Empathy", "Growth mindset", "Leadership through inspiration"],
    Fire: ["Charismatic presence", "Passionate drive", "Quick decisiveness", "Infectious optimism"],
    Earth: ["Rock-solid reliability", "Strategic patience", "Nurturing support", "Practical wisdom"],
    Metal: ["Sharp intellect", "Moral integrity", "Organizational mastery", "Resilience under pressure"],
    Water: ["Fluid adaptability", "Deep intuition", "Diplomatic finesse", "Emotional intelligence"],
  };

  const challengesMap: Record<FiveElement, string[]> = {
    Wood: ["Overextending yourself", "Idealism clashing with reality", "Difficulty saying no"],
    Fire: ["Burnout from excessive energy", "Impulsive decisions", "Needing constant stimulation"],
    Earth: ["Resistance to change", "Overthinking", "Taking on others' burdens"],
    Metal: ["Rigidity in thinking", "Difficulty expressing emotions", "Perfectionism"],
    Water: ["Indecisiveness", "Emotional overwhelm", "Fear of commitment"],
  };

  // Calculate advanced BaZi components
  const tenGods = calculateTenGods(dayStemIdx, yearPillar, monthPillar, dayPillar, hourPillar);
  const shenSha = identifyShenSha(yearStemIdx, yearBranchIdx, monthBranchIdx, dayBranchIdx, hourBranchIdx, dayStemIdx);
  const yongShen = calculateYongShen(balance, dayMaster, dominant, weakest);

  return {
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    dayMaster,
    elementBalance: balance,
    dominantElement: dominant,
    weakestElement: weakest,
    personality: personalityMap[dayMaster],
    strengths: strengthsMap[dayMaster],
    challenges: challengesMap[dayMaster],
    luckCycles,
    tenGods,
    shenSha,
    yongShen,
  };
}

// ═══════════════════════════════════════════════════════════════
// WETON / NEPTU (JAVANESE) CALCULATOR
// ═══════════════════════════════════════════════════════════════

export function calculateWeton(dob: Date, rng: SeededRandom): WetonResult {
  const dayIndex = dob.getDay();
  const dayOfWeek = DAY_NAMES[dayIndex];

  // Calculate Pasaran based on a reference date
  // Reference: January 1, 2000 was Sabtu Legi (Saturday Legi)
  const refDate = new Date(2000, 0, 1);
  const diffDays = Math.floor((dob.getTime() - refDate.getTime()) / 86400000);
  // Jan 1 2000 = Legi (index 0 in PASARAN_CYCLE)
  const pasaranIndex = ((diffDays % 5) + 5) % 5;
  const pasaran = PASARAN_CYCLE[pasaranIndex];

  const dayNeptu = NEPTU_DAY[dayOfWeek];
  const pasaranNeptu = NEPTU_PASARAN[pasaran];
  const totalNeptu = dayNeptu + pasaranNeptu;
  const javaDay = DAY_NAMES_JAVANESE[dayOfWeek];
  const weton = `${javaDay} ${pasaran}`;

  // Interpret based on total neptu
  const neptuInterpretations: Record<string, { interp: string; traits: string[] }> = {
    low: {
      interp: "Your Neptu reveals a soul attuned to simplicity and inner peace. You find strength in quiet contemplation and possess a natural humility that draws others to confide in you. Life's gentler rhythms guide your path.",
      traits: ["Humble", "Reflective", "Patient", "Quietly influential"],
    },
    mid: {
      interp: "Your Neptu indicates a balanced spirit walking the middle path. You blend practicality with intuition, able to navigate both material and spiritual worlds with equal ease. Your adaptability is your greatest asset.",
      traits: ["Balanced", "Adaptable", "Thoughtful", "Harmonious"],
    },
    high: {
      interp: "Your Neptu signals a powerful and commanding presence. You possess strong charisma and natural authority. The forces of fate have endowed you with the energy to lead, create, and inspire on a grand scale.",
      traits: ["Charismatic", "Authoritative", "Energetic", "Destined for influence"],
    },
  };

  let category: string;
  if (totalNeptu <= 9) category = "low";
  else if (totalNeptu <= 14) category = "mid";
  else category = "high";
  const interpData = neptuInterpretations[category];

  // Weton-based fortune areas
  const fortuneTemplates = {
    wealth: [
      "Financial flow comes in waves; your best strategy is patience and consistent saving during prosperous periods.",
      "Your Weton favors steady accumulation. Avoid speculative ventures and focus on building reliable income streams.",
      "Unexpected windfalls may appear, but wisdom lies in investing in long-term security over quick gains.",
      "Your financial path rewards hard work over luck. Property and tangible assets bring the most stability.",
      "A generous spirit attracts prosperity. What you give returns multiplied — balance charity with prudent planning.",
    ],
    love: [
      "Deep emotional bonds define your romantic destiny. Seek partners who value loyalty and intellectual connection.",
      "Passion runs strong in your relationships. Balance intensity with gentle understanding for lasting harmony.",
      "Your ideal partnership is built on mutual respect and shared spiritual growth. Patience in love yields the greatest rewards.",
      "Romance finds you when you least expect it. Trust your intuition in matters of the heart — it rarely leads astray.",
      "Your Weton blesses partnerships with warmth and devotion. Prioritize communication to maintain lasting bonds.",
    ],
    career: [
      "Leadership roles suit your Weton energy. Seek positions where you can guide and mentor others.",
      "Creative professions align with your spiritual blueprint. Your unique perspective is your competitive edge.",
      "Steady, methodical work environments let your talents flourish. Avoid overly chaotic or unstable career paths.",
      "Your Weton favors entrepreneurship and self-directed work. Independence brings out your best qualities.",
      "Service-oriented careers resonate with your soul's purpose. Healing, education, and mentorship are especially favored.",
    ],
    health: [
      "Your vitality is strong, but stress management is key. Regular meditation and nature walks restore your energy.",
      "Pay attention to digestive health and maintain a balanced diet. Your body responds well to natural remedies.",
      "Physical activity is essential for your well-being. Martial arts or yoga particularly align with your Weton energy.",
      "Mental health requires as much care as physical health. Creative expression serves as a powerful emotional outlet.",
      "Your Weton suggests strong constitution but sensitivity to environmental changes. Maintain consistent sleep patterns.",
    ],
  };

  const fortuneIdx = totalNeptu % 5;

  return {
    dayOfWeek,
    pasaran,
    weton,
    dayNeptu,
    pasaranNeptu,
    totalNeptu,
    interpretation: interpData.interp,
    traits: interpData.traits,
    fortuneAreas: {
      wealth: fortuneTemplates.wealth[fortuneIdx],
      love: fortuneTemplates.love[fortuneIdx],
      career: fortuneTemplates.career[fortuneIdx],
      health: fortuneTemplates.health[fortuneIdx],
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// NAME NUMEROLOGY
// ═══════════════════════════════════════════════════════════════

function calculateNumerology(name: string): NumerologyResult {
  const PYTHAGOREAN: Record<string, number> = {
    a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
    j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
    s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
  };

  const letters = name.toLowerCase().replace(/[^a-z]/g, "").split("");
  const letterValues = letters.map((l) => ({ letter: l, value: PYTHAGOREAN[l] || 0 }));
  const total = letterValues.reduce((sum, lv) => sum + lv.value, 0);

  // Digital root
  function digitalRoot(n: number): number {
    while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
      n = String(n).split("").reduce((s, d) => s + parseInt(d), 0);
    }
    return n;
  }

  const expression = digitalRoot(total);

  // Life path from name (as a flavor layer)
  const nameHash = hashString(name);
  const lifePath = digitalRoot(nameHash % 100);

  const interpretations: Record<number, { interp: string; traits: string[] }> = {
    1: { interp: "The Leader — You carry the vibration of beginnings and independence. Your name resonates with pioneering energy, self-reliance, and creative force.", traits: ["Independent", "Pioneer", "Innovative", "Self-reliant"] },
    2: { interp: "The Diplomat — Your name vibrates with harmony and partnership. You are a natural mediator, sensitive to others' needs, and gifted in cooperation.", traits: ["Diplomatic", "Sensitive", "Cooperative", "Peacemaker"] },
    3: { interp: "The Communicator — Your name carries the energy of expression and joy. Creativity flows through you naturally, and your words have the power to inspire.", traits: ["Expressive", "Creative", "Joyful", "Inspiring"] },
    4: { interp: "The Builder — Your name resonates with structure and foundation. You bring order to chaos, and your methodical approach creates lasting value.", traits: ["Organized", "Practical", "Dependable", "Hardworking"] },
    5: { interp: "The Adventurer — Your name vibrates with freedom and change. You thrive on variety and are drawn to experiences that expand your understanding of life.", traits: ["Adventurous", "Versatile", "Dynamic", "Freedom-loving"] },
    6: { interp: "The Nurturer — Your name carries the energy of love and responsibility. You are drawn to caring for others and creating beauty and harmony.", traits: ["Nurturing", "Responsible", "Loving", "Harmonious"] },
    7: { interp: "The Seeker — Your name resonates with wisdom and spiritual depth. You are drawn to the mysteries of life and seek truth beyond the surface.", traits: ["Analytical", "Spiritual", "Introspective", "Wise"] },
    8: { interp: "The Powerhouse — Your name vibrates with authority and abundance. You possess natural executive ability and are destined for material achievement.", traits: ["Authoritative", "Ambitious", "Strategic", "Successful"] },
    9: { interp: "The Humanitarian — Your name carries the energy of compassion and universal love. You are here to serve a higher purpose and uplift humanity.", traits: ["Compassionate", "Idealistic", "Generous", "Visionary"] },
    11: { interp: "The Illuminator — A master number! Your name vibrates at a higher frequency, carrying the energy of spiritual insight and inspirational leadership.", traits: ["Visionary", "Intuitive", "Inspiring", "Spiritually gifted"] },
    22: { interp: "The Master Builder — A master number! Your name resonates with the power to turn dreams into reality on a grand scale. You are here to build something lasting.", traits: ["Visionary builder", "Practical idealist", "Powerful manifestor", "Global impact"] },
    33: { interp: "The Master Teacher — A master number! Your name carries the highest vibration of compassion and spiritual guidance. You uplift through love and wisdom.", traits: ["Master healer", "Selfless", "Spiritually evolved", "Universal love"] },
  };

  const data = interpretations[expression] || interpretations[expression % 9 || 9];

  return {
    lifePath,
    expression,
    letterValues,
    interpretation: data.interp,
    traits: data.traits,
  };
}

// ═══════════════════════════════════════════════════════════════
// PREDICTION GENERATORS
// ═══════════════════════════════════════════════════════════════

function generateCoreDomains(rng: SeededRandom, bazi: BaZiResult, zodiac: WesternZodiac, weton: WetonResult): DomainPrediction[] {
  const categories: { cat: PredictionCategory; icon: string; title: string }[] = [
    { cat: "fortune", icon: "Sparkles", title: "Fortune & Luck" },
    { cat: "wealth", icon: "Coins", title: "Wealth & Finances" },
    { cat: "soulmate", icon: "Heart", title: "Soulmate & Romance" },
    { cat: "social", icon: "Users", title: "Social & Family" },
    { cat: "vitality", icon: "Activity", title: "Vitality & Milestones" },
    { cat: "personality", icon: "Brain", title: "Core Personality" },
  ];

  const fortuneSummaries = [
    "The stars align favorably for you. A natural aura of fortune surrounds your endeavors, drawing serendipitous encounters and timely opportunities.",
    "Fortune flows to you through perseverance. While not always immediately apparent, your luck compounds over time, rewarding patience and consistent effort.",
    "A dynamic fortune pattern marks your life. Peaks and valleys teach resilience, but the overall trajectory trends strongly upward across the decades.",
    "Your fortune is deeply tied to your relationships. Collaborative ventures and generous partnerships unlock your greatest opportunities.",
    "An unconventional path to fortune defines your journey. What others might see as setbacks become your stepping stones to extraordinary outcomes.",
  ];

  const wealthSummaries = [
    "Multiple income streams are favored in your chart. Diversification and early investment in knowledge-based assets yield the strongest returns over your lifetime.",
    "Property, real estate, and tangible assets are your strongest wealth vehicles. Your chart favors slow, steady accumulation over speculative gains.",
    "Your creative talents are your greatest financial asset. Monetizing your unique skills and vision leads to both fulfillment and prosperity.",
    "Financial discipline is your superpower. Budgeting and strategic planning turn modest beginnings into substantial long-term wealth.",
    "Entrepreneurial energy runs strong. Your ability to spot market gaps and take calculated risks drives significant wealth creation.",
  ];

  const soulmateSummaries = [
    "A profound soul connection awaits you. Your ideal partner shares your intellectual curiosity and emotional depth, creating a bond that transcends the ordinary.",
    "Romance enters your life through shared passions or creative pursuits. Look for someone who challenges you to grow while providing unwavering support.",
    "Your soulmate journey involves deep self-discovery first. Once you embrace your authentic self, the right partner appears as if drawn by cosmic magnetism.",
    "A warm, nurturing partnership is your destiny. Your ideal match values family, stability, and building a beautiful life together with shared purpose.",
    "An electrifying, passionate connection defines your romantic destiny. Your partner complements your energy and inspires your highest potential.",
  ];

  const socialSummaries = [
    "You are a natural community builder. Your warmth and genuine interest in others create a wide, loyal social network that supports you throughout life.",
    "Quality over quantity defines your social world. A small circle of deeply trusted companions provides more fulfillment than any crowd ever could.",
    "Family bonds are your bedrock. Investing in familial relationships brings the deepest satisfaction and creates generational positive impact.",
    "Your diplomatic nature makes you the mediator and peacekeeper. Social harmony follows you, and your presence elevates any group dynamic.",
    "An expansive social vision connects you with diverse communities. Cross-cultural friendships and professional networks enrich your life profoundly.",
  ];

  const vitalitySummaries = [
    "A strong vitality signature in your chart suggests robust health and long-term endurance. Key milestones cluster around periods of personal transformation and renewal.",
    "Your energy flows in cycles. High-output periods require deliberate rest and recovery. Honoring these rhythms maximizes both longevity and quality of life.",
    "Mind-body connection is central to your vitality. Practices that integrate mental clarity with physical strength — like yoga or tai chi — are especially beneficial.",
    "Your chart indicates strong regenerative capacity. You bounce back from challenges with remarkable resilience, growing stronger through each experience.",
    "A focus on preventive wellness serves you best. Early adoption of healthy habits compounds into extraordinary vitality in your later decades.",
  ];

  const personalitySummaries = [
    `As a ${zodiac.sign} with ${bazi.dayMaster} as your Day Master, you blend ${zodiac.traits.slice(0, 2).join(" and ").toLowerCase()} nature with ${bazi.dayMaster.toLowerCase()} element wisdom. This rare combination makes you both visionary and grounded.`,
    `Your ${zodiac.element} zodiac energy harmonizes with your ${bazi.dayMaster} Day Master to create a personality of remarkable depth. You navigate life with both intuition and logic in equal measure.`,
    `The fusion of ${zodiac.sign}'s ${zodiac.quality.toLowerCase()} energy and ${bazi.dayMaster}'s elemental force gives you a unique edge. You see opportunities others miss and act with confident precision.`,
    `With ${zodiac.sign}'s ${zodiac.traits[0].toLowerCase()} nature amplified by ${bazi.dayMaster} element energy, your personality is both magnetic and substantial. People are drawn to your authentic presence.`,
    `Your personality is a tapestry woven from ${zodiac.sign}'s cosmic influence and ${bazi.dayMaster}'s elemental power. This blend creates someone who is simultaneously a dreamer and a doer.`,
  ];

  const summaryArrays = [fortuneSummaries, wealthSummaries, soulmateSummaries, socialSummaries, vitalitySummaries, personalitySummaries];
  const detailTemplates = [
    "Your {element} energy interacts with {zodiac} influences to create a {adj} trajectory. The Javanese Neptu score of {neptu} further amplifies this energy, suggesting {outcome}. Trust in the cosmic timing of your life events.",
    "Drawing from {system}, your path reveals layers of {adj} potential. The interplay between your Four Pillars and Weton ({weton}) creates a unique energetic signature that guides you toward {outcome}.",
    "Multiple divination systems converge on this reading. Your {zodiac} nature, {element} Day Master, and Weton of {weton} all point toward {outcome}. This alignment is rare and significant.",
  ];

  const adjectives = ["remarkable", "transformative", "powerful", "auspicious", "dynamic", "profound"];
  const outcomes = [
    "periods of extraordinary growth and fulfillment",
    "deep connections that shape your legacy",
    "breakthroughs that redefine your trajectory",
    "harmony between ambition and contentment",
    "a life rich in both material and spiritual wealth",
  ];

  return categories.map((c, i) => {
    const summaryIdx = rng.nextInt(0, summaryArrays[i].length - 1);
    const detailIdx = rng.nextInt(0, detailTemplates.length - 1);
    const adj = rng.pick(adjectives);
    const outcome = rng.pick(outcomes);

    const detail = detailTemplates[detailIdx]
      .replace("{element}", bazi.dayMaster)
      .replace("{zodiac}", zodiac.sign)
      .replace("{adj}", adj)
      .replace("{neptu}", String(weton.totalNeptu))
      .replace("{weton}", weton.weton)
      .replace("{outcome}", outcome)
      .replace("{system}", rng.pick(["your BaZi chart", "the Saju Palja system", "Primbon wisdom"]));

    const advice = rng.pick([
      "Trust the process and remain patient. The cosmic wheels turn in your favor.",
      "Embrace change fearlessly — it is the universe reshaping your path for the better.",
      "Balance ambition with gratitude. Acknowledging blessings multiplies them.",
      "Seek wisdom from mentors and ancient practices. Your path benefits from guided growth.",
      "Invest in self-knowledge. Understanding your patterns unlocks your highest potential.",
      "Stay grounded during peaks and resilient during valleys. Both are temporary and purposeful.",
    ]);

    return {
      category: c.cat,
      icon: c.icon,
      title: c.title,
      summary: summaryArrays[i][summaryIdx],
      details: detail,
      score: rng.nextInt(5, 10),
      advice,
    };
  });
}

function generateYearlyPredictions(
  rng: SeededRandom,
  birthYear: number,
  bazi: BaZiResult,
  zodiac: WesternZodiac,
  weton: WetonResult,
  currentYear: number
): YearlyPrediction[] {
  const predictions: YearlyPrediction[] = [];

  const yearThemes = [
    "A Year of New Beginnings",
    "A Year of Building Foundations",
    "A Year of Creative Expression",
    "A Year of Stability & Structure",
    "A Year of Freedom & Change",
    "A Year of Love & Responsibility",
    "A Year of Inner Reflection",
    "A Year of Power & Achievement",
    "A Year of Humanitarian Purpose",
    "A Year of Completion & Renewal",
  ];

  for (let i = 0; i < 10; i++) {
    const year = currentYear + i;
    const age = year - birthYear;
    const themeIdx = (year + hashString(bazi.dayMaster)) % yearThemes.length;

    const categories: PredictionCategory[] = ["fortune", "wealth", "soulmate", "social", "vitality", "personality"];
    const categoryTitles: Record<PredictionCategory, string> = {
      fortune: "Fortune & Luck",
      wealth: "Wealth & Finances",
      soulmate: "Soulmate & Romance",
      social: "Social & Family",
      vitality: "Vitality & Health",
      personality: "Personal Growth",
    };

    const icons: Record<PredictionCategory, string> = {
      fortune: "Sparkles", wealth: "Coins", soulmate: "Heart",
      social: "Users", vitality: "Activity", personality: "Brain",
    };

    const domains: DomainPrediction[] = categories.map((cat) => {
      const seedVal = hashString(`${year}-${cat}-${bazi.dayMaster}-${weton.weton}`);
      const localRng = new SeededRandom(seedVal);
      const score = localRng.nextInt(4, 10);

      const summaries: Record<PredictionCategory, string[]> = {
        fortune: [
          `In ${year}, fortune smiles upon bold initiatives. Your ${zodiac.sign} energy aligns with cosmic currents favoring decisive action.`,
          `A year where patience is rewarded. Subtle opportunities emerge for those who remain vigilant and prepared.`,
          `Dynamic shifts in fortune create exciting possibilities. Embrace uncertainty as the doorway to remarkable outcomes.`,
          `Collaborative luck dominates — your fortune multiplies when shared with aligned partners and communities.`,
          `An auspicious year for long-term investments of time, energy, and resources. Plant seeds that will bear fruit for years.`,
        ],
        wealth: [
          `Financial prospects strengthen through disciplined planning. Your ${bazi.dayMaster} energy supports steady wealth accumulation.`,
          `Unexpected income sources may appear. Stay open to unconventional opportunities while maintaining fiscal prudence.`,
          `A year of financial consolidation. Focus on reducing liabilities and strengthening your financial foundations.`,
          `Investment in skills and education pays outsized dividends. Your knowledge becomes your most valuable asset.`,
          `Entrepreneurial opportunities shine brightly. Your unique perspective can unlock previously untapped revenue streams.`,
        ],
        soulmate: [
          `Romantic energy intensifies. Existing relationships deepen through honest communication and shared experiences.`,
          `New connections carry profound potential. Pay attention to people who enter your life during transitional moments.`,
          `A year for healing old relationship wounds. Forgiveness and self-love create space for authentic partnership.`,
          `Adventure and spontaneity revitalize your love life. Break routine to discover deeper layers of connection.`,
          `Commitment and devotion are highlighted. Meaningful gestures of loyalty strengthen your most important bonds.`,
        ],
        social: [
          `Your social network expands in meaningful ways. Quality connections form through professional and creative communities.`,
          `Family bonds require nurturing attention. Prioritizing home life brings unexpected joys and strengthened ties.`,
          `A natural leadership role emerges within your social circles. Your guidance is sought and your influence grows.`,
          `Cross-cultural connections enrich your perspective. Friendships with diverse backgrounds broaden your worldview.`,
          `A year for deepening existing friendships. Vulnerability and authenticity create unbreakable bonds of trust.`,
        ],
        vitality: [
          `Energy levels are strong. Channel this vitality into physical activities that bring both fitness and joy.`,
          `Focus on mental wellness alongside physical health. Mindfulness practices become especially valuable this year.`,
          `A year of robust health supported by positive lifestyle changes. Small daily habits compound into significant well-being.`,
          `Pay attention to rest and recovery. Your body communicates its needs — listening carefully prevents burnout.`,
          `Vitality surges through creative expression. Artistic pursuits and hobbies significantly boost overall well-being.`,
        ],
        personality: [
          `Personal growth accelerates through challenges that build character. Embrace discomfort as your greatest teacher.`,
          `Self-awareness deepens significantly. Journaling, meditation, or therapy unlock transformative personal insights.`,
          `Your authentic self emerges more strongly. Others notice and appreciate the genuine confidence you radiate.`,
          `A year of integrating past lessons into present wisdom. Your maturity and insight reach new heights.`,
          `Creative self-expression becomes a vehicle for profound personal transformation and identity refinement.`,
        ],
      };

      const summaryList = summaries[cat];
      const summary = summaryList[localRng.nextInt(0, summaryList.length - 1)];

      return {
        category: cat,
        icon: icons[cat],
        title: categoryTitles[cat],
        summary,
        details: `The ${bazi.dayMaster} element interacts with ${year}'s cosmic energy to shape your ${categoryTitles[cat].toLowerCase()} trajectory. Your Weton (${weton.weton}) adds a layer of Javanese wisdom to this prediction.`,
        score,
        advice: localRng.pick([
          "Stay open to unexpected turns — they often lead to the best destinations.",
          "Balance planning with spontaneity for optimal results this year.",
          "Seek guidance from trusted mentors during pivotal moments.",
          "Your intuition is especially sharp — trust it when logic falls short.",
          "Invest in relationships that challenge and inspire your growth.",
          "Practice gratitude daily — it amplifies positive cosmic energy.",
        ]),
      };
    });

    const luckyMonths = Array.from({ length: 3 }, () => rng.nextInt(1, 12)).sort((a, b) => a - b);
    const challengeMonths = Array.from({ length: 2 }, () => rng.nextInt(1, 12)).filter((m) => !luckyMonths.includes(m)).sort((a, b) => a - b);

    predictions.push({
      year,
      age,
      overallTheme: yearThemes[themeIdx],
      domains,
      luckyMonths: [...new Set(luckyMonths)],
      challengeMonths: [...new Set(challengeMonths)],
      keyAdvice: rng.pick([
        "This year rewards those who lead with courage and compassion in equal measure.",
        "Focus on what you can control and release attachment to outcomes beyond your influence.",
        "The universe conspires in favor of those who align their actions with their deepest values.",
        "Transformation is not always comfortable, but it is always purposeful. Trust the process.",
        "Your greatest growth this year comes from the intersection of discipline and creativity.",
      ]),
      misfortune: generateMisfortuneIndex(rng, year, bazi, weton, zodiac),
      adviceItems: generateYearlyAdvice(rng, year, bazi, zodiac, weton),
    });
  }

  return predictions;
}

function generateDecadePredictions(
  rng: SeededRandom,
  birthYear: number,
  bazi: BaZiResult,
  zodiac: WesternZodiac,
  weton: WetonResult
): DecadePrediction[] {
  const decades: DecadePrediction[] = [];
  const currentYear = new Date().getFullYear();

  const lifePhases = [
    "Awakening & Discovery",
    "Formation & Identity",
    "Exploration & Learning",
    "Building & Ambition",
    "Achievement & Influence",
    "Mastery & Legacy",
    "Wisdom & Reflection",
    "Transcendence & Peace",
    "Eternal Renewal",
  ];

  const decadeThemes = [
    "The seeds of your destiny are planted. Early experiences shape the foundation of your character and set the trajectory for decades to come.",
    "Identity crystallizes as you discover your unique gifts and passions. Key relationships and formative experiences forge the person you are becoming.",
    "The world expands before you. Education, travel, and new experiences broaden your perspective and build the skills that will define your career.",
    "Ambition takes center stage. Career milestones, romantic partnerships, and the pursuit of personal goals drive this dynamic and formative decade.",
    "The fruits of your earlier labors begin to ripen. Recognition, leadership, and significant achievements mark this powerful period of your life.",
    "Mastery and influence define this era. Your expertise is sought, your judgment is trusted, and your legacy begins to take shape.",
    "Deep wisdom and reflection characterize this enriching period. You harvest the insights of a life well-lived and share them generously.",
    "Inner peace and spiritual depth bring profound satisfaction. The boundaries between self and universe blur in the most beautiful way.",
    "A cycle of renewal and cosmic integration. Your spirit transcends ordinary concerns and touches the eternal.",
  ];

  const milestoneTemplates = [
    ["First conscious self-awareness", "Foundational family bonds", "Discovery of core temperament"],
    ["Academic breakthrough", "First deep friendship", "Emergence of core talents"],
    ["Educational milestone", "First significant relationship", "Discovery of life purpose"],
    ["Career establishment", "Deepening romantic partnership", "Financial foundation building"],
    ["Peak professional achievement", "Family expansion", "Community leadership"],
    ["Legacy project initiation", "Mentorship of next generation", "Wealth consolidation"],
    ["Spiritual deepening", "Knowledge synthesis", "Reconnection with core values"],
    ["Inner peace achievement", "Legacy completion", "Wisdom sharing"],
    ["Cosmic harmony", "Universal connection", "Transcendent fulfillment"],
  ];

  const startDecade = Math.floor(birthYear / 10) * 10;

  for (let i = 0; i < 9; i++) {
    const decadeStart = startDecade + i * 10;
    const decadeEnd = decadeStart + 9;
    const startAge = Math.max(0, decadeStart - birthYear);
    const endAge = decadeEnd - birthYear;

    if (endAge < 0) continue;
    if (startAge > 100) break;

    const categories: PredictionCategory[] = ["fortune", "wealth", "soulmate", "social", "vitality", "personality"];
    const categoryTitles: Record<PredictionCategory, string> = {
      fortune: "Fortune & Luck",
      wealth: "Wealth & Finances",
      soulmate: "Soulmate & Romance",
      social: "Social & Family",
      vitality: "Vitality & Milestones",
      personality: "Core Growth",
    };
    const icons: Record<PredictionCategory, string> = {
      fortune: "Sparkles", wealth: "Coins", soulmate: "Heart",
      social: "Users", vitality: "Activity", personality: "Brain",
    };

    const domains: DomainPrediction[] = categories.map((cat) => {
      const localSeed = hashString(`decade-${decadeStart}-${cat}-${bazi.dayMaster}`);
      const localRng = new SeededRandom(localSeed);
      return {
        category: cat,
        icon: icons[cat],
        title: categoryTitles[cat],
        summary: `During ages ${startAge}–${endAge}, your ${categoryTitles[cat].toLowerCase()} is shaped by the interplay of ${bazi.dayMaster} element energy and ${zodiac.sign}'s cosmic influence. This decade ${localRng.pick(["brings steady progress and quiet victories", "favors bold moves and transformative leaps", "rewards patience and strategic planning", "opens doors through unexpected connections", "deepens your understanding through meaningful challenges"])}.`,
        details: `Your BaZi chart shows the ${bazi.dayMaster} Day Master interacting with the Luck Cycle pillar for this period. The Weton energy of ${weton.weton} (Neptu: ${weton.totalNeptu}) adds a layer of Javanese spiritual significance.`,
        score: localRng.nextInt(5, 10),
        advice: localRng.pick([
          "Embrace the rhythm of this decade and trust in your inner guidance.",
          "Focus on building rather than breaking. Construction yields greater returns than destruction.",
          "Relationships formed in this period carry lasting significance — choose connections wisely.",
          "Your unique combination of elements gives you an edge — use it with intention.",
        ]),
      };
    });

    decades.push({
      startYear: decadeStart,
      endYear: decadeEnd,
      startAge: Math.max(0, startAge),
      endAge,
      lifePhase: lifePhases[Math.min(i, lifePhases.length - 1)],
      overallTheme: decadeThemes[Math.min(i, decadeThemes.length - 1)],
      domains,
      majorMilestones: milestoneTemplates[Math.min(i, milestoneTemplates.length - 1)],
      keyAdvice: rng.pick([
        "This decade's energy rewards those who balance ambition with inner peace.",
        "The cosmic currents of this period favor authentic expression over conformity.",
        "Growth comes not from what you acquire, but from what you become.",
        "Trust in the timing of your life. Every decade serves a sacred purpose in your journey.",
      ]),
      mortalityTheme: generateMortalityTheme(rng, decadeStart, bazi, weton),
      strategies: generateDecadeStrategies(rng, decadeStart, bazi, zodiac, weton),
    });
  }

  return decades;
}

// ═══════════════════════════════════════════════════════════════
// FENG SHUI — KUA NUMBER & DIRECTIONS
// ═══════════════════════════════════════════════════════════════

function calculateKuaNumber(year: number, gender: "male" | "female" | "other" | undefined): number {
  const g = gender === "female" ? "female" : "male";
  const digits = String(year).split("").reduce((s, d) => s + parseInt(d), 0);
  let reduced = digits;
  while (reduced > 9) reduced = String(reduced).split("").reduce((s, d) => s + parseInt(d), 0);
  if (g === "male") {
    let kua = 11 - reduced;
    if (kua > 9) kua = kua - 9;
    return kua === 5 ? 2 : kua;
  } else {
    let kua = reduced + 4;
    if (kua > 9) kua = kua - 9;
    return kua === 5 ? 8 : kua;
  }
}

function calculateFengShui(year: number, gender: "male" | "female" | "other" | undefined, rng: SeededRandom): FengShuiResult {
  const kua = calculateKuaNumber(year, gender);
  const eastGroup = [1, 3, 4, 9];
  const group: "East" | "West" = eastGroup.includes(kua) ? "East" : "West";

  const directionSets: Record<number, { lucky: DirectionInfo[]; unlucky: DirectionInfo[] }> = {
    1: {
      lucky: [
        { direction: "Southeast", category: "lucky", label: "Sheng Qi (Prosperity)", description: "Best direction for wealth generation and career advancement." },
        { direction: "East", category: "lucky", label: "Tian Yi (Health)", description: "Optimal direction for physical well-being and recovery." },
        { direction: "South", category: "lucky", label: "Yan Nian (Relationships)", description: "Enhances romantic and social connections." },
        { direction: "North", category: "lucky", label: "Fu Wei (Stability)", description: "Supports personal growth and inner clarity." },
      ],
      unlucky: [
        { direction: "West", category: "unlucky", label: "Huo Hai (Mishaps)", description: "Minor setbacks and frustrations may occur." },
        { direction: "Northeast", category: "unlucky", label: "Wu Gui (Five Ghosts)", description: "Risk of betrayal or hidden conflicts." },
        { direction: "Northwest", category: "unlucky", label: "Liu Sha (Six Killings)", description: "Legal or relational complications possible." },
        { direction: "Southwest", category: "unlucky", label: "Jue Ming (Total Loss)", description: "Most challenging direction — avoid for important activities." },
      ],
    },
    2: {
      lucky: [
        { direction: "Northeast", category: "lucky", label: "Sheng Qi (Prosperity)", description: "Best direction for wealth and success." },
        { direction: "West", category: "lucky", label: "Tian Yi (Health)", description: "Supports healing and wellness." },
        { direction: "Northwest", category: "lucky", label: "Yan Nian (Relationships)", description: "Strengthens bonds and partnerships." },
        { direction: "Southwest", category: "lucky", label: "Fu Wei (Stability)", description: "Grounds energy and supports focus." },
      ],
      unlucky: [
        { direction: "East", category: "unlucky", label: "Huo Hai (Mishaps)", description: "Minor obstacles and delays." },
        { direction: "Southeast", category: "unlucky", label: "Wu Gui (Five Ghosts)", description: "Hidden adversaries or misunderstandings." },
        { direction: "South", category: "unlucky", label: "Liu Sha (Six Killings)", description: "Potential for conflicts and disruptions." },
        { direction: "North", category: "unlucky", label: "Jue Ming (Total Loss)", description: "Avoid for critical decisions." },
      ],
    },
    3: {
      lucky: [
        { direction: "South", category: "lucky", label: "Sheng Qi (Prosperity)", description: "Peak direction for career and financial growth." },
        { direction: "North", category: "lucky", label: "Tian Yi (Health)", description: "Optimal for recovery and vitality." },
        { direction: "Southeast", category: "lucky", label: "Yan Nian (Relationships)", description: "Positive for love and social harmony." },
        { direction: "East", category: "lucky", label: "Fu Wei (Stability)", description: "Personal development and clarity." },
      ],
      unlucky: [
        { direction: "Southwest", category: "unlucky", label: "Huo Hai (Mishaps)", description: "Minor disruptions possible." },
        { direction: "Northwest", category: "unlucky", label: "Wu Gui (Five Ghosts)", description: "Watch for deception." },
        { direction: "Northeast", category: "unlucky", label: "Liu Sha (Six Killings)", description: "Relational friction likely." },
        { direction: "West", category: "unlucky", label: "Jue Ming (Total Loss)", description: "Most adverse — use caution." },
      ],
    },
    4: {
      lucky: [
        { direction: "North", category: "lucky", label: "Sheng Qi (Prosperity)", description: "Strongest wealth and opportunity direction." },
        { direction: "South", category: "lucky", label: "Tian Yi (Health)", description: "Best for health and healing." },
        { direction: "East", category: "lucky", label: "Yan Nian (Relationships)", description: "Enriches partnerships and connections." },
        { direction: "Southeast", category: "lucky", label: "Fu Wei (Stability)", description: "Supports steady personal growth." },
      ],
      unlucky: [
        { direction: "Northwest", category: "unlucky", label: "Huo Hai (Mishaps)", description: "Small setbacks and annoyances." },
        { direction: "Southwest", category: "unlucky", label: "Wu Gui (Five Ghosts)", description: "Hidden challenges." },
        { direction: "West", category: "unlucky", label: "Liu Sha (Six Killings)", description: "Conflict potential." },
        { direction: "Northeast", category: "unlucky", label: "Jue Ming (Total Loss)", description: "Avoid for major choices." },
      ],
    },
    6: {
      lucky: [
        { direction: "West", category: "lucky", label: "Sheng Qi (Prosperity)", description: "Strongest direction for success and wealth." },
        { direction: "Northeast", category: "lucky", label: "Tian Yi (Health)", description: "Optimal for wellness." },
        { direction: "Southwest", category: "lucky", label: "Yan Nian (Relationships)", description: "Best for love and family bonds." },
        { direction: "Northwest", category: "lucky", label: "Fu Wei (Stability)", description: "Personal clarity and peace." },
      ],
      unlucky: [
        { direction: "Southeast", category: "unlucky", label: "Huo Hai (Mishaps)", description: "Minor obstacles possible." },
        { direction: "East", category: "unlucky", label: "Wu Gui (Five Ghosts)", description: "Beware hidden adversaries." },
        { direction: "North", category: "unlucky", label: "Liu Sha (Six Killings)", description: "Potential relational conflicts." },
        { direction: "South", category: "unlucky", label: "Jue Ming (Total Loss)", description: "Most challenging — avoid." },
      ],
    },
    7: {
      lucky: [
        { direction: "Northwest", category: "lucky", label: "Sheng Qi (Prosperity)", description: "Best for wealth and advancement." },
        { direction: "Southwest", category: "lucky", label: "Tian Yi (Health)", description: "Peak direction for health." },
        { direction: "Northeast", category: "lucky", label: "Yan Nian (Relationships)", description: "Strengthens connections." },
        { direction: "West", category: "lucky", label: "Fu Wei (Stability)", description: "Supports grounding and focus." },
      ],
      unlucky: [
        { direction: "North", category: "unlucky", label: "Huo Hai (Mishaps)", description: "Small setbacks likely." },
        { direction: "South", category: "unlucky", label: "Wu Gui (Five Ghosts)", description: "Hidden problems." },
        { direction: "Southeast", category: "unlucky", label: "Liu Sha (Six Killings)", description: "Conflict and disruption." },
        { direction: "East", category: "unlucky", label: "Jue Ming (Total Loss)", description: "Avoid for critical moves." },
      ],
    },
    8: {
      lucky: [
        { direction: "Southwest", category: "lucky", label: "Sheng Qi (Prosperity)", description: "Peak prosperity direction." },
        { direction: "Northwest", category: "lucky", label: "Tian Yi (Health)", description: "Best for healing energy." },
        { direction: "West", category: "lucky", label: "Yan Nian (Relationships)", description: "Enriches love and friendship." },
        { direction: "Northeast", category: "lucky", label: "Fu Wei (Stability)", description: "Personal growth and clarity." },
      ],
      unlucky: [
        { direction: "South", category: "unlucky", label: "Huo Hai (Mishaps)", description: "Minor disruptions." },
        { direction: "North", category: "unlucky", label: "Wu Gui (Five Ghosts)", description: "Hidden challenges." },
        { direction: "East", category: "unlucky", label: "Liu Sha (Six Killings)", description: "Potential friction." },
        { direction: "Southeast", category: "unlucky", label: "Jue Ming (Total Loss)", description: "Most adverse direction." },
      ],
    },
    9: {
      lucky: [
        { direction: "East", category: "lucky", label: "Sheng Qi (Prosperity)", description: "Strongest wealth direction." },
        { direction: "Southeast", category: "lucky", label: "Tian Yi (Health)", description: "Best for vitality." },
        { direction: "North", category: "lucky", label: "Yan Nian (Relationships)", description: "Enhances bonds." },
        { direction: "South", category: "lucky", label: "Fu Wei (Stability)", description: "Supports inner clarity." },
      ],
      unlucky: [
        { direction: "Northeast", category: "unlucky", label: "Huo Hai (Mishaps)", description: "Small obstacles." },
        { direction: "West", category: "unlucky", label: "Wu Gui (Five Ghosts)", description: "Watch for deception." },
        { direction: "Southwest", category: "unlucky", label: "Liu Sha (Six Killings)", description: "Conflict potential." },
        { direction: "Northwest", category: "unlucky", label: "Jue Ming (Total Loss)", description: "Avoid for key decisions." },
      ],
    },
  };

  const dirs = directionSets[kua] || directionSets[1];
  const elementColors: Record<FiveElement, string[]> = {
    Wood: ["Green", "Brown", "Teal"],
    Fire: ["Red", "Orange", "Purple"],
    Earth: ["Yellow", "Beige", "Terracotta"],
    Metal: ["White", "Gold", "Silver"],
    Water: ["Blue", "Black", "Navy"],
  };
  const kuaElements: Record<number, FiveElement> = { 1: "Water", 2: "Earth", 3: "Wood", 4: "Wood", 6: "Metal", 7: "Metal", 8: "Earth", 9: "Fire" };
  const luckyElement = kuaElements[kua] || "Earth";

  const recommendations = [
    `Position your desk or workspace facing your Sheng Qi direction (${dirs.lucky[0].direction}) for maximum career success.`,
    `Sleep with your head pointing toward your Tian Yi direction (${dirs.lucky[1].direction}) for improved health and recovery.`,
    `Enhance the ${dirs.lucky[2].direction} sector of your home with ${luckyElement} element colors to attract love and harmony.`,
    `Avoid sitting with your back to your Jue Ming direction (${dirs.unlucky[3].direction}) during important meetings.`,
    `Wear ${elementColors[luckyElement].join(" or ").toLowerCase()} tones to harmonize with your personal element energy.`,
  ];

  return {
    kuaNumber: kua,
    group,
    luckyDirections: dirs.lucky,
    unluckyDirections: dirs.unlucky,
    luckyElement,
    luckyColors: elementColors[luckyElement],
    recommendations,
    flyingStarExplainer: {
      title: "Flying Star Feng Shui (Xuan Kong)",
      overview: "Flying Star Feng Shui maps time-based energy patterns onto a Lo Shu grid using your home's facing direction and construction period. Nine 'stars' (numbered 1–9) rotate through sectors, each carrying distinct influences on wealth, relationships, and health. The chart changes every 20-year period and shifts annually.",
      limitations: "A full Flying Star chart requires your home's exact facing direction and the year/period of construction — data this reading cannot collect. Without these inputs, we can provide general awareness but not a personalized house chart.",
      advice: "For a complete Flying Star analysis, consult a qualified Feng Shui practitioner who can take compass readings of your home. In the meantime, focus on your personal Kua directions above, which require only your birth data.",
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// MISFORTUNE & MORTALITY RULE PACK
// ═══════════════════════════════════════════════════════════════

function generateMisfortuneIndex(rng: SeededRandom, year: number, bazi: BaZiResult, weton: WetonResult, zodiac: WesternZodiac): MisfortuneIndex {
  const seed = hashString(`misfortune-${year}-${bazi.dayMaster}-${weton.totalNeptu}`);
  const localRng = new SeededRandom(seed);
  const clashScore = localRng.nextInt(1, 10);
  const neptuModifier = weton.totalNeptu > 14 ? -1 : weton.totalNeptu < 9 ? 1 : 0;
  const score = Math.max(1, Math.min(10, clashScore + neptuModifier));

  const themePool = [
    "Financial turbulence — unexpected expenses or investment losses",
    "Relationship friction — misunderstandings with close ones",
    "Career instability — shifting dynamics at work or business",
    "Health vulnerability — stress-related ailments or fatigue",
    "Legal or contractual complications",
    "Travel disruptions or relocation challenges",
    "Trust issues — deception from unexpected sources",
    "Emotional overwhelm — anxiety or decision fatigue",
  ];
  const triggerPool = [
    "Overcommitting without adequate reserves",
    "Ignoring early warning signs in health or finances",
    "Rushing major decisions under pressure",
    "Neglecting important relationships during busy periods",
    "Taking on excessive risk without proper due diligence",
  ];
  const protectionPool = [
    "Maintain emergency savings covering 3–6 months",
    "Schedule regular health check-ups and wellness routines",
    "Seek counsel before signing contracts or making large purchases",
    "Practice daily mindfulness or meditation for emotional resilience",
    "Strengthen communication with partner and family members",
    "Diversify income sources to buffer financial shocks",
    "Avoid impulsive travel or relocation decisions this period",
  ];
  const watchPool = [
    "Sudden changes in workplace dynamics or team composition",
    "Recurring health symptoms that persist beyond 2 weeks",
    "Financial patterns that deviate significantly from expectations",
    "Relationships that feel increasingly draining or one-sided",
    "Unusual series of minor accidents or equipment failures",
  ];

  const numThemes = score > 7 ? 3 : score > 4 ? 2 : 1;
  const themes = Array.from({ length: numThemes }, () => localRng.pick(themePool));
  const triggers = Array.from({ length: 2 }, () => localRng.pick(triggerPool));
  const protections = Array.from({ length: 3 }, () => localRng.pick(protectionPool));
  const watchIndicators = Array.from({ length: 2 }, () => localRng.pick(watchPool));

  return {
    score,
    themes: [...new Set(themes)],
    triggers: [...new Set(triggers)],
    protections: [...new Set(protections)],
    watchIndicators: [...new Set(watchIndicators)],
    explanation: `Misfortune index derived from ${bazi.dayMaster} Day Master interaction with ${year}'s annual energy, modulated by Neptu score (${weton.totalNeptu}) and ${zodiac.sign} cosmic tension points.`,
    signalsUsed: ["Saju/BaZi Pillar Clash", "Weton Neptu Range", `${zodiac.sign} Annual Transit`],
  };
}

function generateMortalityTheme(rng: SeededRandom, decadeStart: number, bazi: BaZiResult, weton: WetonResult): MortalityTheme {
  const seed = hashString(`mortality-${decadeStart}-${bazi.dayMaster}-${weton.totalNeptu}`);
  const localRng = new SeededRandom(seed);
  const baseScore = localRng.nextInt(1, 10);
  const ageModifier = decadeStart > 60 ? 2 : decadeStart > 40 ? 1 : -1;
  const score = Math.max(1, Math.min(10, baseScore + ageModifier));

  const themes = [
    "A period of profound endings and new beginnings",
    "Transition phase — closing one chapter to open another",
    "Releasing old patterns to make space for renewal",
    "Deep transformation through surrender and acceptance",
    "A crossroads requiring clarity of purpose and courage",
  ];
  const softLabels = [
    "Life Transitions & Renewal",
    "Endings That Create Beginnings",
    "Deep Cycle of Transformation",
    "Release & Regeneration Phase",
    "Crossroads of Purpose",
  ];
  const triggerPool = [
    "Accumulated stress from overwork without recovery",
    "Unresolved emotional patterns reaching critical mass",
    "Environmental or lifestyle factors requiring attention",
    "Neglecting preventive health measures over extended periods",
    "Major life transitions creating compound stress",
  ];
  const protectionPool = [
    "Regular preventive health screenings and proactive wellness",
    "Building and maintaining a strong emotional support network",
    "Practicing acceptance and emotional processing techniques",
    "Estate and legacy planning for peace of mind",
    "Developing spiritual practices that provide grounding and meaning",
  ];

  const idx = localRng.nextInt(0, themes.length - 1);
  return {
    score,
    theme: themes[idx],
    softLabel: softLabels[idx],
    triggers: Array.from({ length: 2 }, () => localRng.pick(triggerPool)),
    protections: Array.from({ length: 3 }, () => localRng.pick(protectionPool)),
    explanation: `Mortality theme computed from ${bazi.dayMaster} Day Master life-cycle position, ${bazi.weakestElement} element vulnerability, and Weton Neptu gravitational pull (${weton.totalNeptu}).`,
    signalsUsed: ["BaZi Luck Cycle Phase", `Weakest Element: ${bazi.weakestElement}`, "Weton Neptu Score"],
  };
}

// ═══════════════════════════════════════════════════════════════
// ADVICE GENERATORS
// ═══════════════════════════════════════════════════════════════

function generateYearlyAdvice(rng: SeededRandom, year: number, bazi: BaZiResult, zodiac: WesternZodiac, weton: WetonResult): AdviceItem[] {
  const seed = hashString(`advice-${year}-${bazi.dayMaster}-${weton.weton}`);
  const localRng = new SeededRandom(seed);
  const domains: Array<{ d: AdviceItem["domain"]; icon: string }> = [
    { d: "wealth", icon: "Coins" },
    { d: "love", icon: "Heart" },
    { d: "social", icon: "Users" },
    { d: "health", icon: "Activity" },
    { d: "spiritual", icon: "Sparkles" },
  ];
  const suggestions: Record<AdviceItem["domain"], { s: string; d: string; dont: string }[]> = {
    wealth: [
      { s: "Prioritize building an emergency fund this year.", d: "Set up automatic monthly savings transfers.", dont: "Don't make large speculative investments without thorough research." },
      { s: "Review and optimize your tax strategy.", d: "Consult a financial advisor for personalized planning.", dont: "Don't ignore small recurring expenses — they compound significantly." },
      { s: "Invest in skills that increase your earning potential.", d: "Take a course or certification in a high-demand field.", dont: "Don't rely on a single income source during this period." },
    ],
    love: [
      { s: "Prioritize quality time with your partner or loved ones.", d: "Schedule regular date nights or meaningful conversations.", dont: "Don't let work consume all your emotional energy." },
      { s: "Practice active listening and emotional vulnerability.", d: "Share your feelings openly and ask about theirs.", dont: "Don't make assumptions about your partner's needs without asking." },
      { s: "If single, expand your social circles authentically.", d: "Join interest-based communities where genuine connections form.", dont: "Don't rush into commitments — let relationships develop naturally." },
    ],
    social: [
      { s: "Strengthen your inner circle — quality over quantity.", d: "Reach out to 2–3 close friends you've been meaning to reconnect with.", dont: "Don't spread yourself thin across too many social obligations." },
      { s: "Take a leadership role in your community.", d: "Volunteer for a cause aligned with your values.", dont: "Don't engage in gossip or toxic group dynamics." },
      { s: "Nurture family bonds during holidays and milestones.", d: "Create meaningful traditions that deepen family connection.", dont: "Don't neglect elderly family members — their wisdom is invaluable." },
    ],
    health: [
      { s: "Establish a consistent exercise routine.", d: "Start with 20 minutes of movement daily and build from there.", dont: "Don't sacrifice sleep for productivity — it backfires." },
      { s: "Address mental health proactively.", d: "Schedule regular therapy or counseling sessions.", dont: "Don't self-medicate or ignore persistent symptoms." },
      { s: "Focus on nutrition and gut health.", d: "Add more whole foods and reduce processed food intake.", dont: "Don't skip regular health check-ups." },
    ],
    spiritual: [
      { s: "Develop a daily meditation or mindfulness practice.", d: "Start with 5-minute sessions and increase gradually.", dont: "Don't seek spiritual growth to escape real-world responsibilities." },
      { s: "Study the divination systems that resonate with you.", d: "Journal about how BaZi and Weton insights apply to your daily life.", dont: "Don't become rigidly attached to any single prediction framework." },
      { s: "Practice gratitude as a daily ritual.", d: "Write down 3 things you're grateful for each morning.", dont: "Don't compare your spiritual journey to others'." },
    ],
  };

  return domains.map(({ d, icon }) => {
    const items = suggestions[d];
    const item = items[localRng.nextInt(0, items.length - 1)];
    return {
      domain: d,
      icon,
      suggestion: item.s,
      doAction: item.d,
      dontAction: item.dont,
      signalsUsed: [`BaZi ${bazi.dayMaster} Day Master`, `${zodiac.sign} Transit`, `Weton ${weton.weton}`],
    };
  });
}

function generateDecadeStrategies(rng: SeededRandom, decadeStart: number, bazi: BaZiResult, zodiac: WesternZodiac, weton: WetonResult): DecadeStrategy[] {
  const seed = hashString(`strategy-${decadeStart}-${bazi.dayMaster}`);
  const localRng = new SeededRandom(seed);
  const templates: { domain: string; strategies: { s: string; r: string }[] }[] = [
    { domain: "Career & Wealth", strategies: [
      { s: "Build multiple income streams — diversify between active and passive revenue.", r: "Your element balance suggests vulnerability to single-source dependence." },
      { s: "Invest in real estate or tangible assets during this decade.", r: "Earth and Metal influences favor physical asset accumulation." },
      { s: "Position yourself as a domain expert and build thought leadership.", r: "Your BaZi pillar alignment supports authority-building in this period." },
    ]},
    { domain: "Relationships", strategies: [
      { s: "Define clear relationship boundaries while remaining emotionally available.", r: "Your Weton energy pattern suggests both deep connection needs and overwhelm risk." },
      { s: "Invest in partnerships that align with shared long-term vision.", r: "Zodiac and BaZi signals converge on the importance of aligned values." },
    ]},
    { domain: "Social & Community", strategies: [
      { s: "Build a mentorship network — both as mentor and mentee.", r: "Your luck cycle position favors knowledge transfer relationships." },
      { s: "Engage in community service that aligns with your elemental strengths.", r: "Social contribution amplifies your positive Neptu energy." },
    ]},
    { domain: "Health & Longevity", strategies: [
      { s: "Establish preventive health protocols appropriate for this life stage.", r: "Your weakest element signals potential vulnerability — proactive care is essential." },
      { s: "Balance high-intensity pursuits with restorative practices.", r: "Your Weton Neptu score suggests the need for energy management." },
    ]},
    { domain: "Legacy & Purpose", strategies: [
      { s: "Begin documenting and sharing the wisdom you've accumulated.", r: "Your BaZi luck cycle approaches a phase where teaching amplifies your influence." },
      { s: "Align major life decisions with your deepest values, not external expectations.", r: "Zodiac and Saju signals indicate maximum fulfillment through authentic expression." },
    ]},
  ];

  return templates.map(({ domain, strategies }) => {
    const strat = strategies[localRng.nextInt(0, strategies.length - 1)];
    return {
      domain,
      strategy: strat.s,
      rationale: strat.r,
      signalsUsed: [`BaZi ${bazi.dayMaster}`, `${zodiac.sign} Cycle`, `Neptu ${weton.totalNeptu}`],
    };
  });
}

// ═══════════════════════════════════════════════════════════════
// MAIN ENGINE — PUBLIC API
// ═══════════════════════════════════════════════════════════════

export function generateReading(profile: BirthProfile): ReadingResult {
  const dob = profile.dateOfBirth;
  const year = dob.getFullYear();
  const month = dob.getMonth() + 1;
  const day = dob.getDate();

  // Parse hour
  let hour = 12;
  if (profile.timeOfBirth) {
    const parts = profile.timeOfBirth.split(":");
    hour = parseInt(parts[0]) || 12;
  }

  // Create deterministic seed
  const seedStr = `${profile.fullName.toLowerCase().trim()}-${year}-${month}-${day}-${hour}`;
  const seed = hashString(seedStr);
  const rng = new SeededRandom(seed);

  // Generate all readings
  const westernZodiac = getWesternZodiac(month, day);
  const chineseZodiac = getChineseZodiac(year);
  const bazi = calculateBaZi(year, month, day, hour, rng);
  const weton = calculateWeton(dob, rng);
  const numerology = calculateNumerology(profile.fullName);

  const currentYear = new Date().getFullYear();
  const fengShui = calculateFengShui(year, profile.gender, rng);
  const coreDomains = generateCoreDomains(rng, bazi, westernZodiac, weton);
  const yearlyPredictions = generateYearlyPredictions(rng, year, bazi, westernZodiac, weton, currentYear);
  const decadePredictions = generateDecadePredictions(rng, year, bazi, westernZodiac, weton);

  return {
    profile,
    westernZodiac,
    chineseZodiac,
    bazi,
    weton,
    numerology,
    fengShui,
    coreDomains,
    yearlyPredictions,
    decadePredictions,
    generatedAt: new Date(),
  };
}
