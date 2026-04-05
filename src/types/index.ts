export interface BirthData {
  name?: string;
  dateOfBirth: Date;
  timeOfBirth?: string; // "HH:MM"
}

export interface SignData {
  name: string;
  symbol: string;
  element: string;
  modality?: string;
  rulingPlanet: string;
  traits: string[];
  description: string;
}

export interface WesternReading {
  sunSign: SignData;
}

export interface NakshatraData {
  name: string;
  englishMeaning: string;
  symbol: string;
  deity: string;
  ruling: string;
  pada: number;
  qualities: string[];
  description: string;
}

export interface VedicReading {
  rashi: SignData;
  nakshatra: NakshatraData;
}

export interface StemData {
  chinese: string;
  name: string;
  pinyin: string;
  element: string;
  polarity: 'Yang' | 'Yin';
}

export interface BranchData {
  chinese: string;
  name: string;
  pinyin: string;
  animal: string;
  element: string;
}

export interface Pillar {
  stem: StemData;
  branch: BranchData;
  label: string;
}

export interface BaziReading {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar?: Pillar;
  dayMaster: {
    element: string;
    polarity: 'Yang' | 'Yin';
    description: string;
    traits: string[];
  };
}

export interface LifePathData {
  number: number;
  isMaster: boolean;
  description: string;
  traits: string[];
  challenge: string;
  keywords: string[];
}

export interface NumerologyReading {
  lifePath: LifePathData;
  personalYear: number;
  personalMonth: number;
  personalDay: number;
}

export interface Synthesis {
  archetype: string;
  archetypeSymbol: string;
  dominantElement: string;
  essence: string;
  superpower: string;
  coreStrengths: string[];
  growthAreas: string[];
}

export interface PeriodInsight {
  period: 'daily' | 'weekly' | 'monthly';
  number: number;
  theme: string;
  guidance: string;
  opportunities: string[];
  watchFor: string;
  affirmation?: string;
}

export interface DeepLens {
  tradition: string;
  icon: string;
  accent: string;
  insight: string;
}

export interface DeepSection {
  overview: string;
  lenses: DeepLens[];
  themes: string[];
  guidance: string;
}

/* ── Extended Love section ── */
export interface LoveTimeline {
  period: string;       // e.g. "2025 – 2026", "Age 32-35"
  theme: string;
  description: string;
}

export interface PartnerProfile {
  archetype: string;          // e.g. "The Quiet Builder"
  element: string;            // complementary element
  traits: string[];           // 4-5 traits
  dynamicDescription: string; // paragraph about their personality
  whatTheyBring: string;      // what they contribute to the relationship
  recognitionSign: string;    // how user will know they've found them
}

export interface LoveStyle {
  mode: string;               // e.g. "Devotional Protector"
  languages: string[];        // love languages (3)
  attractionEnergy: string;   // what draws people in
  commitmentStyle: string;    // how they commit
  conflictStyle: string;      // how they handle conflict
}

export interface LoveSection extends DeepSection {
  loveStyle: LoveStyle;
  partnerProfile: PartnerProfile;
  timelines: LoveTimeline[];
  compatibilityElements: string[];  // top 3 compatible elements
  redFlags: string[];               // patterns to avoid
}

export interface DeepAnalysis {
  general: DeepSection;
  love: LoveSection;
  careerFinance: DeepSection;
  health: DeepSection;
  pastLife: DeepSection;
}

export interface CosmicProfile {
  intuition: number;
  ambition: number;
  creativity: number;
  discipline: number;
  empathy: number;
  wisdom: number;
}

export interface FullReading {
  western: WesternReading;
  vedic: VedicReading;
  bazi: BaziReading;
  numerology: NumerologyReading;
  synthesis: Synthesis;
  daily: PeriodInsight;
  weekly: PeriodInsight;
  monthly: PeriodInsight;
  deepAnalysis: DeepAnalysis;
  cosmicProfile: CosmicProfile;
}
