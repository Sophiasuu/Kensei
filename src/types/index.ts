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

export interface DeepAnalysis {
  general: DeepSection;
  love: DeepSection;
  careerFinance: DeepSection;
  health: DeepSection;
  pastLife: DeepSection;
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
}
