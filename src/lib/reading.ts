import type { BirthData, FullReading, CosmicProfile } from '@/types';
import { getWesternReading } from './western';
import { getVedicReading } from './vedic';
import { getBaziReading } from './bazi';
import { getNumerologyReading } from './numerology';
import { generateSynthesis } from './synthesis';
import { generateInsights } from './insights';
import { generateDeepAnalysis } from './deepAnalysis';

/* ─── Derive a 6-axis cosmic profile from all four systems ────────────── */
function generateCosmicProfile(
  westernEl: string,
  vedicEl: string,
  baziEl: string,
  baziPolarity: string,
  lifePath: number,
  nakshatraQualities: string[],
): CosmicProfile {
  // Seed a deterministic base from life path
  const base = (n: number) => 40 + ((lifePath * 7 + n * 13) % 45);

  // Element affinity boosts
  const elBoost = (target: string, ...els: string[]) =>
    els.filter(e => e.toLowerCase() === target).length * 12;

  const qualStr = nakshatraQualities.join(' ').toLowerCase();

  const intuition = Math.min(98, base(1)
    + elBoost('water', westernEl, vedicEl, baziEl)
    + (qualStr.includes('spiritual') || qualStr.includes('mystical') ? 10 : 0)
    + ([7, 9, 11].includes(lifePath) ? 12 : 0));

  const ambition = Math.min(98, base(2)
    + elBoost('fire', westernEl, vedicEl, baziEl)
    + (baziPolarity === 'Yang' ? 8 : 0)
    + ([1, 8, 22].includes(lifePath) ? 12 : 0));

  const creativity = Math.min(98, base(3)
    + elBoost('air', westernEl, vedicEl, baziEl)
    + (qualStr.includes('creative') || qualStr.includes('artistic') ? 10 : 0)
    + ([3, 5, 11].includes(lifePath) ? 12 : 0));

  const discipline = Math.min(98, base(4)
    + elBoost('earth', westernEl, vedicEl, baziEl)
    + (baziPolarity === 'Yin' ? 6 : 0)
    + ([4, 8, 22].includes(lifePath) ? 12 : 0));

  const empathy = Math.min(98, base(5)
    + elBoost('water', westernEl, vedicEl, baziEl)
    + (qualStr.includes('compassion') || qualStr.includes('healing') ? 10 : 0)
    + ([2, 6, 9, 33].includes(lifePath) ? 12 : 0));

  const wisdom = Math.min(98, base(6)
    + elBoost('air', westernEl, vedicEl, baziEl)
    + elBoost('earth', westernEl, vedicEl, baziEl)
    + ([7, 9, 11, 22].includes(lifePath) ? 12 : 0));

  return { intuition, ambition, creativity, discipline, empathy, wisdom };
}

export function generateFullReading(input: BirthData): FullReading {
  const today = new Date();
  const western = getWesternReading(input.dateOfBirth);
  const vedic = getVedicReading(input.dateOfBirth);
  const bazi = getBaziReading(input.dateOfBirth, input.timeOfBirth);
  const numerology = getNumerologyReading(input.dateOfBirth, today);
  const synthesis = generateSynthesis(western, vedic, bazi, numerology);
  const { daily, weekly, monthly } = generateInsights(
    numerology.personalDay,
    numerology.personalMonth,
    numerology.personalYear,
  );
  const deepAnalysis = generateDeepAnalysis(western, vedic, bazi, numerology);
  const cosmicProfile = generateCosmicProfile(
    western.sunSign.element,
    vedic.rashi.element,
    bazi.dayMaster.element,
    bazi.dayMaster.polarity,
    numerology.lifePath.number,
    vedic.nakshatra.qualities,
  );

  return { western, vedic, bazi, numerology, synthesis, daily, weekly, monthly, deepAnalysis, cosmicProfile };
}
