import type { WesternReading } from '@/types';
// @ts-ignore — astronomia has no TS declarations
import { julian, solar, base } from 'astronomia';

const SIGNS = [
  {
    name: 'Capricorn', symbol: '♑', element: 'Earth', modality: 'Cardinal',
    rulingPlanet: 'Saturn',
    traits: ['Ambitious', 'Disciplined', 'Patient', 'Responsible', 'Structured'],
    description: 'Capricorn carries the weight of mountains and the wisdom of ages. Ruled by Saturn, you are built for the long game — methodical, disciplined, and profoundly capable of turning vision into tangible reality. Your soul understands that true achievement requires sacrifice, structure, and time.'
  },
  {
    name: 'Aquarius', symbol: '♒', element: 'Air', modality: 'Fixed',
    rulingPlanet: 'Uranus',
    traits: ['Innovative', 'Humanitarian', 'Independent', 'Intellectual', 'Visionary'],
    description: 'Aquarius is the visionary of the zodiac, born to disrupt the status quo and illuminate a better world. Ruled by Uranus, you think in systems and futures, seeing connections others miss. Your detachment is not coldness — it is the altitude of a mind that soars above convention.'
  },
  {
    name: 'Pisces', symbol: '♓', element: 'Water', modality: 'Mutable',
    rulingPlanet: 'Neptune',
    traits: ['Intuitive', 'Compassionate', 'Dreamy', 'Empathic', 'Creative'],
    description: 'Pisces dwells at the threshold between worlds, where the individual soul dissolves into the ocean of collective consciousness. Ruled by Neptune, you perceive the invisible threads connecting all beings. Your greatest gift is empathy — a capacity to hold the fullness of human experience without breaking.'
  },
  {
    name: 'Aries', symbol: '♈', element: 'Fire', modality: 'Cardinal',
    rulingPlanet: 'Mars',
    traits: ['Courageous', 'Pioneering', 'Bold', 'Energetic', 'Direct'],
    description: 'Aries is the eternal pioneer, the first spark of fire that ignites creation. Ruled by Mars, you are charged with primal vitality and an unquenchable drive to lead, to initiate, to conquer new horizons. You carry within you the archetype of the Warrior — not as one who destroys, but as one who breaks through.'
  },
  {
    name: 'Taurus', symbol: '♉', element: 'Earth', modality: 'Fixed',
    rulingPlanet: 'Venus',
    traits: ['Sensual', 'Patient', 'Reliable', 'Persistent', 'Grounded'],
    description: 'Taurus is the earthly expression of beauty and permanence, ruled by Venus. You understand that the sacred lives in the sensory world — in art, touch, taste, and the slow unfolding of seasons. Your gift is the ability to build things that last: relationships, works of beauty, and foundations of deep security.'
  },
  {
    name: 'Gemini', symbol: '♊', element: 'Air', modality: 'Mutable',
    rulingPlanet: 'Mercury',
    traits: ['Curious', 'Adaptable', 'Witty', 'Communicative', 'Versatile'],
    description: 'Gemini is the celestial messenger, perpetually in motion between worlds of thought. Ruled by Mercury, your mind operates at quicksilver speed — making connections, weaving patterns, and breathing life into language. You are the bridge between opposites, the chorus of voices that illuminates every angle of truth.'
  },
  {
    name: 'Cancer', symbol: '♋', element: 'Water', modality: 'Cardinal',
    rulingPlanet: 'Moon',
    traits: ['Nurturing', 'Intuitive', 'Protective', 'Emotional', 'Empathic'],
    description: 'Cancer is the primordial guardian of memory and belonging. Ruled by the Moon, you are in constant conversation with the tides — of emotion, of family, of ancestral inheritance. Your intuition operates like a sixth sense, reading the unspoken textures of any room or relationship with uncanny precision.'
  },
  {
    name: 'Leo', symbol: '♌', element: 'Fire', modality: 'Fixed',
    rulingPlanet: 'Sun',
    traits: ['Charismatic', 'Creative', 'Generous', 'Loyal', 'Radiant'],
    description: 'Leo is the radiant heart of the solar system, born to shine, to create, and to inspire. Ruled by the Sun itself, you carry a magnetic warmth that draws others into your orbit. Your gift is not merely performance — it is the generous pouring of your authentic self into everything you touch.'
  },
  {
    name: 'Virgo', symbol: '♍', element: 'Earth', modality: 'Mutable',
    rulingPlanet: 'Mercury',
    traits: ['Analytical', 'Precise', 'Humble', 'Discerning', 'Dedicated'],
    description: 'Virgo is the sacred craftsperson of the zodiac, devoted to the art of refinement. Ruled by Mercury, your mind excels at analysis — finding the flaw in the pattern, the grain in the wood. But beneath the precision lies a profound desire for wholeness: to heal, to serve, and to restore beauty through careful, devoted work.'
  },
  {
    name: 'Libra', symbol: '♎', element: 'Air', modality: 'Cardinal',
    rulingPlanet: 'Venus',
    traits: ['Diplomatic', 'Aesthetic', 'Fair-minded', 'Harmonious', 'Refined'],
    description: 'Libra is the keeper of the sacred balance, forever weighing beauty against truth, justice against peace. Ruled by Venus, you are deeply attuned to harmony — in relationships, art, and social dynamics. Your genius lies in your ability to see all perspectives and hold the tension of opposites with grace.'
  },
  {
    name: 'Scorpio', symbol: '♏', element: 'Water', modality: 'Fixed',
    rulingPlanet: 'Pluto',
    traits: ['Intense', 'Perceptive', 'Transformative', 'Passionate', 'Magnetic'],
    description: 'Scorpio dwells in the hidden corridors of existence — where power, truth, and transformation intersect. Ruled by Pluto, you penetrate beneath surfaces with surgical precision, seeking the raw truth of every situation. You understand death and rebirth not as metaphor but as the engine of your own becoming.'
  },
  {
    name: 'Sagittarius', symbol: '♐', element: 'Fire', modality: 'Mutable',
    rulingPlanet: 'Jupiter',
    traits: ['Philosophical', 'Adventurous', 'Optimistic', 'Freedom-loving', 'Expansive'],
    description: 'Sagittarius is the eternal seeker, the archer whose arrow eternally points toward the horizon. Ruled by Jupiter, you are expansive by nature — in thought, in geography, in spirit. Your quest is not just for experience but for meaning: to understand why the universe is organized as it is, and your place within the grand tapestry.'
  },
];

// Cusp dates fallback — only used if astronomia fails at runtime
const SIGN_END_DATES: [number, number][] = [
  [1, 19], [2, 18], [3, 20], [4, 19], [5, 20], [6, 20],
  [7, 22], [8, 22], [9, 22], [10, 22], [11, 21], [12, 21],
];

function sunLongitudeDeg(date: Date): number {
  // JDE at noon UTC on birth date
  const jde = julian.CalendarGregorianToJD(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate() + 0.5
  );
  const T = base.J2000Century(jde);
  const radians = solar.apparentLongitude(T);
  return ((radians * 180 / Math.PI) + 360) % 360;
}

export function getWesternReading(date: Date): WesternReading {
  try {
    const lon = sunLongitudeDeg(date);
    // Aries starts at 0°; sign index = floor(lon / 30), but SIGNS array starts with Capricorn
    // Tropical order: Aries=0, Taurus=1, ... Capricorn=9, Aquarius=10, Pisces=11
    // Our SIGNS array order: Capricorn(0), Aquarius(1), Pisces(2), Aries(3), ... Sagittarius(11)
    // Aries = lon 0–30 → array index 3
    const tropicalIndex = Math.floor(lon / 30); // 0=Aries … 11=Pisces
    // Map tropical index to our SIGNS array offset (Capricorn=index 9 in tropical, index 0 in array)
    const arrayIndex = ((tropicalIndex - 9) + 12) % 12;
    return { sunSign: { ...SIGNS[arrayIndex] } };
  } catch {
    // Fallback to table method
    const month = date.getMonth() + 1;
    const day = date.getDate();
    for (let i = 0; i < SIGN_END_DATES.length; i++) {
      const [endMonth, endDay] = SIGN_END_DATES[i];
      if (month < endMonth || (month === endMonth && day <= endDay)) {
        return { sunSign: { ...SIGNS[i] } };
      }
    }
    return { sunSign: { ...SIGNS[0] } };
  }
}
