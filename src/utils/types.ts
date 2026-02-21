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
  tenGods: TenGodRelation[];
  shenSha: ShenShaEntry[];
  yongShen: YongShenResult;
}

export interface LuckCycle {
  startAge: number;
  endAge: number;
  pillar: Pillar;
  theme: string;
  description: string;
}

// ─── Advanced BaZi — Ten Gods (十神) ──────────────────────────

export type TenGodName =
  | "Bi Jian" | "Jie Cai"
  | "Shi Shen" | "Shang Guan"
  | "Pian Cai" | "Zheng Cai"
  | "Qi Sha" | "Zheng Guan"
  | "Pian Yin" | "Zheng Yin";

export interface TenGodRelation {
  stem: HeavenlyStem;
  stemChinese: string;
  element: FiveElement;
  relation: TenGodName;
  chinese: string;
  english: string;
  meaning: string;
  pillar: "year" | "month" | "day" | "hour";
}

// ─── Advanced BaZi — Shen Sha (神煞 / Symbolic Stars) ─────────

export interface ShenShaEntry {
  name: string;
  chinese: string;
  type: "auspicious" | "inauspicious" | "neutral";
  meaning: string;
  triggerPillar: string; // which pillar triggered it
}

// ─── Advanced BaZi — Yong Shen (用神 / Useful God) ────────────

export interface YongShenResult {
  usefulElement: FiveElement;
  avoidElement: FiveElement;
  rationale: string;
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

// ─── Feng Shui Types ──────────────────────────────────────────

export type FengShuiDirection =
  | "North"
  | "South"
  | "East"
  | "West"
  | "Northeast"
  | "Northwest"
  | "Southeast"
  | "Southwest";

export interface DirectionInfo {
  direction: FengShuiDirection;
  category: "lucky" | "unlucky";
  label: string; // e.g., "Sheng Qi (Prosperity)", "Jue Ming (Total Loss)"
  description: string;
}

export interface FengShuiResult {
  kuaNumber: number;
  group: "East" | "West";
  luckyDirections: DirectionInfo[];
  unluckyDirections: DirectionInfo[];
  luckyElement: FiveElement;
  luckyColors: string[];
  recommendations: string[];
  flyingStarExplainer: {
    title: string;
    overview: string;
    limitations: string;
    advice: string;
  };
}

// ─── Misfortune & Mortality Types ─────────────────────────────

export interface MisfortuneIndex {
  score: number; // 1-10, higher = more challenging
  themes: string[];
  triggers: string[];
  protections: string[];
  watchIndicators: string[];
  explanation: string; // "Why this appears" rule trace
  signalsUsed: string[];
}

export interface MortalityTheme {
  score: number; // 1-10, higher = more caution warranted
  theme: string; // e.g., "Endings & Closures" or "Major Life Transition"
  softLabel: string; // Reframed - "transitions/closures" mode
  triggers: string[];
  protections: string[];
  explanation: string;
  signalsUsed: string[];
}

// ─── Advice Types ─────────────────────────────────────────────

export interface AdviceItem {
  domain: "wealth" | "love" | "social" | "health" | "spiritual";
  icon: string;
  suggestion: string;
  doAction: string;
  dontAction: string;
  signalsUsed: string[];
}

export interface DecadeStrategy {
  domain: string;
  strategy: string;
  rationale: string;
  signalsUsed: string[];
}

// ─── Enhanced Yearly & Decade Predictions ─────────────────────

export interface YearlyPrediction {
  year: number;
  age: number;
  overallTheme: string;
  domains: DomainPrediction[];
  luckyMonths: number[];
  challengeMonths: number[];
  keyAdvice: string;
  misfortune: MisfortuneIndex;
  adviceItems: AdviceItem[];
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
  mortalityTheme: MortalityTheme;
  strategies: DecadeStrategy[];
}

// ─── Full Reading Result ──────────────────────────────────────

export interface ReadingResult {
  profile: BirthProfile;
  westernZodiac: WesternZodiac;
  chineseZodiac: ChineseZodiac;
  bazi: BaZiResult;
  weton: WetonResult;
  numerology: NumerologyResult;
  fengShui: FengShuiResult;
  coreDomains: DomainPrediction[];
  yearlyPredictions: YearlyPrediction[];
  decadePredictions: DecadePrediction[];
  generatedAt: Date;
}

// ─── Couple Compatibility (合婚 / He Hun) Types ────────────────

export interface CoupleProfile {
  partnerA: BirthProfile;
  partnerB: BirthProfile;
}

export interface SystemScore {
  system: "bazi" | "weton" | "zodiac" | "shio";
  label: string;
  score: number; // 0–100
  summary: string;
  details: string[];
  signalsUsed: string[];
}

export interface PrimbonMatchClass {
  className: string;
  javanese: string;
  score: number;
  interpretation: string;
  advice: string;
}

export interface TimelineEntry {
  yearStart: number;
  yearEnd: number;
  phase: "easier" | "harder" | "neutral";
  description: string;
}

export interface CompatibilityResult {
  coupleProfile: CoupleProfile;
  combinedScore: number; // 0–100 weighted average
  systemScores: SystemScore[];
  primbonMatch: PrimbonMatchClass;
  timeline: TimelineEntry[];
  overallOutlook: string;
  strengths: string[];
  challenges: string[];
  advice: string[];
  generatedAt: Date;
}

// ─── Date Selection (择日 / Ze Ri) Types ──────────────────────

export interface DateCandidate {
  date: Date;
  dayPillar: Pillar;
  weton: string;
  pasaran: string;
  dayOfWeek: string;
}

export interface DateSignal {
  system: "bazi" | "weton" | "shenSha" | "yongShen";
  type: "positive" | "negative" | "neutral";
  label: string;
  description: string;
}

export interface DateEvaluation {
  candidate: DateCandidate;
  score: number; // 0–100
  rating: "auspicious" | "neutral" | "inauspicious";
  signals: DateSignal[];
  reasonTrace: string;
}

export interface DateRanking {
  bestDates: DateEvaluation[];
  avoidDates: DateEvaluation[];
  allDates: DateEvaluation[];
  coupleProfile: CoupleProfile;
  dateRange: { start: Date; end: Date };
  generatedAt: Date;
}

// ─── Recommendation Engine Types ──────────────────────────────

export type MatchMode = "romance" | "friend" | "colleague";

export interface RankedMatch {
  sign: string;           // Zodiac sign name or Shio animal name
  symbol: string;         // Emoji/symbol
  score: number;          // 0–100
  whySummary: string;     // 1–2 sentence rationale
  signalsUsed: string[];  // e.g. ["Element harmony", "六合 pair"]
  role?: string;          // colleague mode: "strategist" | "executor" | etc.
}

export interface CollaborationRisk {
  risk: string;
  mitigation: string;
}

export interface PairComparison {
  pairScore: number;      // 0–100
  systemBreakdown: {
    zodiac: number;
    shio: number;
    bazi: number;
    weton: number;
    fengShui: number;
  };
  strengths: string[];
  challenges: string[];
  signals: string[];
}

export interface RecommendationResult {
  mode: MatchMode;
  zodiacRanked: RankedMatch[];
  shioRanked: RankedMatch[];
  explanations: string[];
  collaborationRisks: CollaborationRisk[];  // colleague mode only
  pairComparison?: PairComparison;          // only when second person provided
}


