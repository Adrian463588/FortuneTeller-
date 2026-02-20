// ─── Core Input Types ─────────────────────────────────────────

export interface BirthProfile {
  fullName: string;
  dateOfBirth: Date;
  timeOfBirth?: string; // HH:mm format
  gender?: "male" | "female" | "other";
}

// ─── Zodiac Types ─────────────────────────────────────────────

export interface WesternZodiac {
  sign: string;
  symbol: string;
  element: string;
  quality: string;
  rulingPlanet: string;
  dateRange: string;
  traits: string[];
  strengths: string[];
  weaknesses: string[];
  description: string;
}

export interface ChineseZodiac {
  animal: string;
  element: string;
  yinYang: string;
  traits: string[];
  compatibility: string[];
  description: string;
}

// ─── BaZi / Saju Types ───────────────────────────────────────

export type HeavenlyStem =
  | "Jia"
  | "Yi"
  | "Bing"
  | "Ding"
  | "Wu"
  | "Ji"
  | "Geng"
  | "Xin"
  | "Ren"
  | "Gui";

export type EarthlyBranch =
  | "Zi"
  | "Chou"
  | "Yin"
  | "Mao"
  | "Chen"
  | "Si"
  | "Wu"
  | "Wei"
  | "Shen"
  | "You"
  | "Xu"
  | "Hai";

export type FiveElement = "Wood" | "Fire" | "Earth" | "Metal" | "Water";

export interface Pillar {
  heavenlyStem: HeavenlyStem;
  earthlyBranch: EarthlyBranch;
  stemElement: FiveElement;
  branchElement: FiveElement;
  stemChinese: string;
  branchChinese: string;
}

export interface BaZiResult {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar: Pillar;
  dayMaster: FiveElement;
  elementBalance: Record<FiveElement, number>;
  dominantElement: FiveElement;
  weakestElement: FiveElement;
  personality: string;
  strengths: string[];
  challenges: string[];
  luckCycles: LuckCycle[];
}

export interface LuckCycle {
  startAge: number;
  endAge: number;
  pillar: Pillar;
  theme: string;
  description: string;
}

// ─── Javanese Weton / Neptu Types ─────────────────────────────

export type Pasaran = "Legi" | "Pahing" | "Pon" | "Wage" | "Kliwon";
export type DayOfWeek =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export interface WetonResult {
  dayOfWeek: DayOfWeek;
  pasaran: Pasaran;
  weton: string; // Combined, e.g., "Senin Legi"
  dayNeptu: number;
  pasaranNeptu: number;
  totalNeptu: number;
  interpretation: string;
  traits: string[];
  fortuneAreas: {
    wealth: string;
    love: string;
    career: string;
    health: string;
  };
}

// ─── Name Numerology ──────────────────────────────────────────

export interface NumerologyResult {
  lifePath: number;
  expression: number;
  letterValues: { letter: string; value: number }[];
  interpretation: string;
  traits: string[];
}

// ─── Predictions ──────────────────────────────────────────────

export interface DomainPrediction {
  category: PredictionCategory;
  icon: string;
  title: string;
  summary: string;
  details: string;
  score: number; // 1-10 favorability
  advice: string;
}

export type PredictionCategory =
  | "fortune"
  | "wealth"
  | "soulmate"
  | "social"
  | "vitality"
  | "personality";

export interface YearlyPrediction {
  year: number;
  age: number;
  overallTheme: string;
  domains: DomainPrediction[];
  luckyMonths: number[];
  challengeMonths: number[];
  keyAdvice: string;
}

export interface DecadePrediction {
  startYear: number;
  endYear: number;
  startAge: number;
  endAge: number;
  lifePhase: string;
  overallTheme: string;
  domains: DomainPrediction[];
  majorMilestones: string[];
  keyAdvice: string;
}

// ─── Full Reading Result ──────────────────────────────────────

export interface ReadingResult {
  profile: BirthProfile;
  westernZodiac: WesternZodiac;
  chineseZodiac: ChineseZodiac;
  bazi: BaZiResult;
  weton: WetonResult;
  numerology: NumerologyResult;
  coreDomains: DomainPrediction[];
  yearlyPredictions: YearlyPrediction[];
  decadePredictions: DecadePrediction[];
  generatedAt: Date;
}
