import {
  BirthProfile,
  ReadingResult,
  WesternZodiac,
  ChineseZodiac,
  BaZiResult,
  WetonResult,
  NumerologyResult,
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

function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

class SeededRandom {
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

const HEAVENLY_STEMS: { name: HeavenlyStem; chinese: string; element: FiveElement }[] = [
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

const EARTHLY_BRANCHES: { name: EarthlyBranch; chinese: string; element: FiveElement; animal: string }[] = [
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

function getWesternZodiac(month: number, day: number): WesternZodiac {
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

function getChineseZodiac(year: number): ChineseZodiac {
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

function getStemBranch(stemIdx: number, branchIdx: number): Pillar {
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

function calculateBaZi(year: number, month: number, day: number, hour: number, rng: SeededRandom): BaZiResult {
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
  };
}

// ═══════════════════════════════════════════════════════════════
// WETON / NEPTU (JAVANESE) CALCULATOR
// ═══════════════════════════════════════════════════════════════

function calculateWeton(dob: Date, rng: SeededRandom): WetonResult {
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
    });
  }

  return decades;
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
    coreDomains,
    yearlyPredictions,
    decadePredictions,
    generatedAt: new Date(),
  };
}
