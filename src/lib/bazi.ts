import type { BaziReading, Pillar, StemData, BranchData } from '@/types';
// @ts-ignore — astronomia has no TS declarations
import { julian, solar, base } from 'astronomia';

const STEMS: StemData[] = [
  { chinese: '甲', name: 'Yang Wood', pinyin: 'Jiǎ', element: 'Wood', polarity: 'Yang' },
  { chinese: '乙', name: 'Yin Wood',  pinyin: 'Yǐ',  element: 'Wood', polarity: 'Yin'  },
  { chinese: '丙', name: 'Yang Fire', pinyin: 'Bǐng', element: 'Fire', polarity: 'Yang' },
  { chinese: '丁', name: 'Yin Fire',  pinyin: 'Dīng', element: 'Fire', polarity: 'Yin'  },
  { chinese: '戊', name: 'Yang Earth', pinyin: 'Wù',  element: 'Earth', polarity: 'Yang' },
  { chinese: '己', name: 'Yin Earth', pinyin: 'Jǐ',  element: 'Earth', polarity: 'Yin'  },
  { chinese: '庚', name: 'Yang Metal', pinyin: 'Gēng', element: 'Metal', polarity: 'Yang' },
  { chinese: '辛', name: 'Yin Metal', pinyin: 'Xīn', element: 'Metal', polarity: 'Yin'  },
  { chinese: '壬', name: 'Yang Water', pinyin: 'Rén', element: 'Water', polarity: 'Yang' },
  { chinese: '癸', name: 'Yin Water', pinyin: 'Guǐ', element: 'Water', polarity: 'Yin'  },
];

const BRANCHES: BranchData[] = [
  { chinese: '子', name: 'Rat',     pinyin: 'Zǐ',   animal: 'Rat',     element: 'Water' },
  { chinese: '丑', name: 'Ox',      pinyin: 'Chǒu', animal: 'Ox',      element: 'Earth' },
  { chinese: '寅', name: 'Tiger',   pinyin: 'Yín',  animal: 'Tiger',   element: 'Wood'  },
  { chinese: '卯', name: 'Rabbit',  pinyin: 'Mǎo',  animal: 'Rabbit',  element: 'Wood'  },
  { chinese: '辰', name: 'Dragon',  pinyin: 'Chén', animal: 'Dragon',  element: 'Earth' },
  { chinese: '巳', name: 'Snake',   pinyin: 'Sì',   animal: 'Snake',   element: 'Fire'  },
  { chinese: '午', name: 'Horse',   pinyin: 'Wǔ',   animal: 'Horse',   element: 'Fire'  },
  { chinese: '未', name: 'Goat',    pinyin: 'Wèi',  animal: 'Goat',    element: 'Earth' },
  { chinese: '申', name: 'Monkey',  pinyin: 'Shēn', animal: 'Monkey',  element: 'Metal' },
  { chinese: '酉', name: 'Rooster', pinyin: 'Yǒu',  animal: 'Rooster', element: 'Metal' },
  { chinese: '戌', name: 'Dog',     pinyin: 'Xū',   animal: 'Dog',     element: 'Earth' },
  { chinese: '亥', name: 'Pig',     pinyin: 'Hài',  animal: 'Pig',     element: 'Water' },
];

// Day Master descriptions (10 types based on Day Stem)
const DAY_MASTER_DESC: Record<string, { description: string; traits: string[] }> = {
  'Yang Wood': {
    description: 'Yang Wood (Jiǎ) is the great oak — upright, principled, and reaching inexorably toward the light. You possess the strength to weather storms while remaining true to your core nature. A natural leader who grows by lifting others.',
    traits: ['Principled', 'Growth-oriented', 'Resilient', 'Idealistic', 'Direct'],
  },
  'Yin Wood': {
    description: 'Yin Wood (Yǐ) is the climbing vine — flexible, adaptive, and quietly persistent. You advance through cooperation and the ability to gently wind your way through obstacles that would stop more rigid natures. Your softness is your greatest strength.',
    traits: ['Adaptable', 'Cooperative', 'Persistent', 'Creative', 'Nurturing'],
  },
  'Yang Fire': {
    description: 'Yang Fire (Bǐng) is the blazing sun — radiant, generous, and impossible to ignore. You illuminate whatever space you enter and have a natural gift for inspiring others toward their highest potential. Your warmth is both your gift and your responsibility.',
    traits: ['Radiant', 'Generous', 'Inspiring', 'Enthusiastic', 'Warm'],
  },
  'Yin Fire': {
    description: 'Yin Fire (Dīng) is the candle flame — warm, precise, and capable of illuminating the most intimate corners. You are a thoughtful light-bringer: your influence is personal, considered, and deeply felt. You work best when given space to glow steadily.',
    traits: ['Thoughtful', 'Precise', 'Warm', 'Refined', 'Intuitive'],
  },
  'Yang Earth': {
    description: 'Yang Earth (Wù) is the mountain — immovable, vast, and profoundly trustworthy. Others naturally lean on you for stability and wisdom. You process information slowly and thoroughly, and your judgments, though deliberate, carry the authority of deep consideration.',
    traits: ['Stable', 'Trustworthy', 'Thorough', 'Patient', 'Reliable'],
  },
  'Yin Earth': {
    description: 'Yin Earth (Jǐ) is fertile garden soil — receptive, nurturing, and capable of transforming whatever it receives into something nourishing. You are a caretaker by nature, with an exceptional ability to understand the needs of the people and situations around you.',
    traits: ['Nurturing', 'Receptive', 'Caring', 'Attentive', 'Practical'],
  },
  'Yang Metal': {
    description: 'Yang Metal (Gēng) is the blade — decisive, principled, and designed to cut through confusion to reveal clarity. You have a natural authority and a directness that, while sometimes confronting, is ultimately in service of truth and right action.',
    traits: ['Decisive', 'Principled', 'Direct', 'Authoritative', 'Disciplined'],
  },
  'Yin Metal': {
    description: 'Yin Metal (Xīn) is refined gold or precious jewel — exquisite, detail-oriented, and possessing an innate sense of what is truly valuable. You have high standards for yourself and others, and a gift for creating things of lasting beauty and precision.',
    traits: ['Refined', 'Aesthetic', 'Precise', 'Discerning', 'Exacting'],
  },
  'Yang Water': {
    description: 'Yang Water (Rén) is the ocean or the great river — vast, powerful, and containing multitudes. You move through the world with an unstoppable, flowing intelligence that is capable of eroding the hardest obstacles through patient persistence. Your mind is oceanic in depth.',
    traits: ['Intelligent', 'Flowing', 'Versatile', 'Ambitious', 'Profound'],
  },
  'Yin Water': {
    description: 'Yin Water (Guǐ) is the still mountain lake or morning dew — sensitive, reflective, and containing hidden depths. You perceive emotional and psychic currents with unusual clarity. Your power lies in your sensitivity and the ability to reflect the world back to itself.',
    traits: ['Sensitive', 'Intuitive', 'Perceptive', 'Mysterious', 'Empathic'],
  },
};

function gregorianToJDN(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y +
    Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function getDayPillar(date: Date): Pillar {
  const jdn = gregorianToJDN(date.getFullYear(), date.getMonth() + 1, date.getDate());
  // Reference: Jan 1, 2000 (JDN 2451545) = sexagenary index 52 (Bing-Chen 丙辰)
  const sexa = ((jdn + 47) % 60 + 60) % 60;
  const stem = STEMS[sexa % 10];
  const branch = BRANCHES[sexa % 12];
  return { stem, branch, label: 'Day' };
}

// ─── Accurate sun longitude via astronomia ──────────────────────────────────
function getSunLongitude(date: Date): number {
  const jde = julian.CalendarGregorianToJD(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate() + 0.5
  );
  const T = base.J2000Century(jde);
  return ((solar.apparentLongitude(T) * 180 / Math.PI) + 360) % 360;
}

// Solar term Jie longitudes that START each Bazi month (ecliptic degrees):
//   Lichun 315°, Jingzhe 345°, Qingming 15°, Lixia 45°, Mangzhong 75°,
//   Xiaoshu 105°, Liqiu 135°, Bailu 165°, Hanlu 195°, Lidong 225°,
//   Daxue 255°, Xiaohan 285°
// → monthIdx = floor(((sunLon - 315 + 360) % 360) / 30) → 0=Tiger..11=Ox
function getSolarTermMonthIndex(sunLon: number): number {
  return Math.floor(((sunLon - 315 + 360) % 360) / 30);
}

// Solar term Jie longitudes fallback (fixed dates)
const SOLAR_TERM_DAYS: [number, number][] = [
  [2, 4], [3, 6], [4, 5], [5, 6], [6, 6], [7, 7],
  [8, 7], [9, 8], [10, 8], [11, 7], [12, 7], [1, 6],
];

function getChineseMonthBranchFallback(month: number, day: number): number {
  for (let i = SOLAR_TERM_DAYS.length - 1; i >= 0; i--) {
    const [stMonth, stDay] = SOLAR_TERM_DAYS[i];
    if (month > stMonth || (month === stMonth && day >= stDay) || (i === 11 && month === 1 && day >= stDay)) {
      return i;
    }
  }
  return 11;
}

function getMonthPillar(date: Date, yearStemIndex: number): Pillar {
  let monthBranchIndex: number;
  try {
    const sunLon = getSunLongitude(date);
    monthBranchIndex = getSolarTermMonthIndex(sunLon);
  } catch {
    monthBranchIndex = getChineseMonthBranchFallback(date.getMonth() + 1, date.getDate());
  }
  // Branch: Tiger=Yin=index 2 in BRANCHES array (0=Rat), so offset by 2
  const branchActualIndex = (monthBranchIndex + 2) % 12;
  const branch = BRANCHES[branchActualIndex];
  // Month stem derived from year stem
  const monthStemBase = [2, 4, 6, 8, 0][yearStemIndex % 5];
  const stemIndex = (monthStemBase + monthBranchIndex) % 10;
  const stem = STEMS[stemIndex];
  return { stem, branch, label: 'Month' };
}

function getYearPillar(date: Date): { pillar: Pillar; stemIndex: number } {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  // Bazi year changes at Lichun (sun ≈ 315°). Use accurate sun longitude in early Feb.
  let baziYear = year;
  try {
    if (month === 1 || (month === 2 && day <= 10)) {
      const sunLon = getSunLongitude(date);
      // Before Lichun (315°): the sun is in Aquarius/Capricorn range, roughly < 315° or > 345°
      // If the month index is 11 (Chou/Ox, before Tiger=0), we're in prev year
      if (getSolarTermMonthIndex(sunLon) === 11) {
        baziYear = year - 1;
      }
    }
  } catch {
    if (month < 2 || (month === 2 && day < 4)) {
      baziYear = year - 1;
    }
  }
  const stemIndex = ((baziYear - 4) % 10 + 10) % 10;
  const branchIndex = ((baziYear - 4) % 12 + 12) % 12;
  return {
    pillar: { stem: STEMS[stemIndex], branch: BRANCHES[branchIndex], label: 'Year' },
    stemIndex,
  };
}

function getHourPillar(dayStemIndex: number, hour: number): Pillar {
  // Hour branch: Zi(23-1), Chou(1-3), Yin(3-5), ... 
  const hourBranchIndex = hour === 23 ? 0 : Math.floor((hour + 1) / 2) % 12;
  const branch = BRANCHES[hourBranchIndex];
  // Hour stem base from day stem
  const hourStemBase = [0, 2, 4, 6, 8][dayStemIndex % 5];
  const stemIndex = (hourStemBase + hourBranchIndex) % 10;
  return { stem: STEMS[stemIndex], branch, label: 'Hour' };
}

export function getBaziReading(date: Date, timeOfBirth?: string): BaziReading {
  const { pillar: yearPillar, stemIndex: yearStemIndex } = getYearPillar(date);
  const monthPillar = getMonthPillar(date, yearStemIndex);
  const dayPillar = getDayPillar(date);

  let hourPillar: Pillar | undefined;
  if (timeOfBirth) {
    const [hStr] = timeOfBirth.split(':');
    const hour = parseInt(hStr, 10);
    const dayStemIndex = STEMS.indexOf(dayPillar.stem);
    hourPillar = getHourPillar(dayStemIndex, hour);
  }

  const dayMasterName = dayPillar.stem.name;
  const dmData = DAY_MASTER_DESC[dayMasterName] ?? {
    description: 'Your Day Master reveals your core nature and the lens through which you experience the world.',
    traits: [],
  };

  return {
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    dayMaster: {
      element: dayPillar.stem.element,
      polarity: dayPillar.stem.polarity,
      description: dmData.description,
      traits: dmData.traits,
    },
  };
}
