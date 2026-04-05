import type { BirthData, FullReading } from '@/types';
import { getWesternReading } from './western';
import { getVedicReading } from './vedic';
import { getBaziReading } from './bazi';
import { getNumerologyReading } from './numerology';
import { generateSynthesis } from './synthesis';
import { generateInsights } from './insights';
import { generateDeepAnalysis } from './deepAnalysis';

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

  return { western, vedic, bazi, numerology, synthesis, daily, weekly, monthly, deepAnalysis };
}
