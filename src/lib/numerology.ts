import type { NumerologyReading, LifePathData } from '@/types';

function reduceNumber(n: number, allowMaster = true): number {
  if (allowMaster && (n === 11 || n === 22 || n === 33)) return n;
  if (n <= 9) return n;
  const sum = String(n).split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
  return reduceNumber(sum, allowMaster);
}

function sumDigits(n: number): number {
  return String(n).split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
}

export function calculateLifePath(date: Date): number {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  // Sum month digits + day digits + year digits, then reduce
  const total = sumDigits(month) + sumDigits(day) + sumDigits(year);
  return reduceNumber(total);
}

export function calculatePersonalYear(date: Date, year: number): number {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const sum = sumDigits(month) + sumDigits(day) + sumDigits(year);
  return reduceNumber(sum);
}

export function calculatePersonalMonth(personalYear: number, month: number): number {
  return reduceNumber(personalYear + month);
}

export function calculatePersonalDay(personalMonth: number, day: number): number {
  return reduceNumber(personalMonth + day);
}

const LIFE_PATHS: Record<number, LifePathData> = {
  1: {
    number: 1, isMaster: false,
    description: 'Life Path 1 is the path of the pioneer — the soul who has come to forge new ground, lead by example, and embody radical independence. You are here to discover the power of your own originality and the courage to act on your own inner authority without waiting for external validation.',
    traits: ['Independent', 'Courageous', 'Pioneering', 'Creative', 'Decisive'],
    challenge: 'The shadow of the 1 is ego — the fear that creates domination or isolation in place of authentic leadership. Your growth lies in learning to lead from service rather than ego.',
    keywords: ['Leadership', 'Originality', 'Independence', 'Initiative'],
  },
  2: {
    number: 2, isMaster: false,
    description: 'Life Path 2 is the path of the diplomat — the soul who has come to master the subtle art of cooperation, sensitivity, and the building of bridges between opposing forces. You carry extraordinary emotional intelligence and an innate attunement to the needs of others.',
    traits: ['Diplomatic', 'Empathic', 'Cooperative', 'Patient', 'Intuitive'],
    challenge: 'The shadow of the 2 is self-erasure — giving so much to others that your own needs go unmet. Your growth lies in cultivating the courage to honor your own voice while remaining beautifully attuned to others.',
    keywords: ['Partnership', 'Harmony', 'Balance', 'Sensitivity'],
  },
  3: {
    number: 3, isMaster: false,
    description: 'Life Path 3 is the path of the creative messenger — the soul who has come to express the full spectrum of human emotion, beauty, and joy through art, communication, and inspired living. You carry the gift of the Muse: the ability to bring delight and meaning through your unique voice.',
    traits: ['Creative', 'Expressive', 'Joyful', 'Communicative', 'Inspiring'],
    challenge: 'The shadow of the 3 is scattered energy and fear of depth — using charm to avoid vulnerability. Your growth lies in committing your creative gifts to something that truly matters to you.',
    keywords: ['Creativity', 'Expression', 'Joy', 'Communication', 'Art'],
  },
  4: {
    number: 4, isMaster: false,
    description: 'Life Path 4 is the path of the builder — the soul who has come to create lasting structures: systems, foundations, and works of enduring value. You carry the gift of discipline, practical intelligence, and the rare ability to see a vision through from concept to solid reality.',
    traits: ['Disciplined', 'Reliable', 'Methodical', 'Honest', 'Dedicated'],
    challenge: 'The shadow of the 4 is rigidity — mistaking the map for the territory, or becoming so focused on the structure that you lose touch with the spirit within it. Your growth lies in learning to hold form and flow simultaneously.',
    keywords: ['Foundation', 'Discipline', 'Security', 'Stability', 'Legacy'],
  },
  5: {
    number: 5, isMaster: false,
    description: 'Life Path 5 is the path of the freedom seeker — the soul who has come to master change, embody freedom, and transmit the liberating knowledge that comes from direct experience. You are a living demonstration that life is richest when met with curiosity and open hands.',
    traits: ['Adventurous', 'Versatile', 'Freedom-loving', 'Curious', 'Sensory'],
    challenge: 'The shadow of the 5 is addiction to stimulation — escaping into endless change to avoid the depth that comes from commitment. Your growth lies in discovering that true freedom is found within, not in the next experience.',
    keywords: ['Freedom', 'Adventure', 'Change', 'Experience', 'Versatility'],
  },
  6: {
    number: 6, isMaster: false,
    description: 'Life Path 6 is the path of the cosmic parent — the soul who has come to embody love in action, to heal and harmonize, and to take responsibility for the wellbeing of the communities they inhabit. You carry an extraordinary capacity for beauty, care, and the creation of nurturing environments.',
    traits: ['Nurturing', 'Responsible', 'Harmonious', 'Protective', 'Artistic'],
    challenge: 'The shadow of the 6 is martyrdom — taking on so much responsibility that it curdles into resentment or control. Your growth lies in learning to love without losing yourself, to give without demanding perfection in return.',
    keywords: ['Service', 'Nurturing', 'Harmony', 'Responsibility', 'Beauty'],
  },
  7: {
    number: 7, isMaster: false,
    description: 'Life Path 7 is the path of the seeker — the soul who has come to penetrate the mysteries of existence through study, contemplation, and the direct experience of the sacred. You belong to the tradition of the sage, the mystic, and the philosopher who cannot rest until reality itself has been understood.',
    traits: ['Analytical', 'Spiritual', 'Introspective', 'Perceptive', 'Scholarly'],
    challenge: 'The shadow of the 7 is isolation — using the pursuit of knowledge as a way to avoid the vulnerabilities of human connection. Your growth lies in learning to share your wisdom and trust the imperfect, magnificent messiness of intimacy.',
    keywords: ['Wisdom', 'Mysticism', 'Analysis', 'Solitude', 'Truth'],
  },
  8: {
    number: 8, isMaster: false,
    description: 'Life Path 8 is the path of the master of power — the soul who has come to understand the laws of material manifestation, exercise authority wisely, and demonstrate that spiritual integrity and worldly achievement are not opposites but partners.',
    traits: ['Ambitious', 'Powerful', 'Strategic', 'Authoritative', 'Resilient'],
    challenge: 'The shadow of the 8 is the abuse of power — whether through domination of others or self-destructive patterns of boom and bust. Your growth lies in aligning personal power with universal law and the service of the greater good.',
    keywords: ['Power', 'Abundance', 'Authority', 'Manifestation', 'Legacy'],
  },
  9: {
    number: 9, isMaster: false,
    description: 'Life Path 9 is the path of the humanitarian — the soul who has come to embody compassion, wisdom, and the understanding that we are all one family. You carry the accumulated experience of many lifetimes and a deep knowing of the human condition that transcends personal circumstance.',
    traits: ['Compassionate', 'Wise', 'Humanitarian', 'Artistic', 'Idealistic'],
    challenge: 'The shadow of the 9 is the wound of separation — a deep loneliness born of giving without knowing how to receive. Your growth lies in accepting love as freely as you give it, and releasing the need to carry the world\'s suffering alone.',
    keywords: ['Compassion', 'Wisdom', 'Humanity', 'Completion', 'Service'],
  },
  11: {
    number: 11, isMaster: true,
    description: 'Life Path 11 is a Master Number — the Illuminator. You carry an extraordinary nervous system designed to receive and transmit higher frequencies of insight and inspiration. Your purpose is to be a living bridge between the ordinary and the transcendent, an intuitive channel whose very presence raises the consciousness of rooms and conversations.',
    traits: ['Intuitive', 'Inspirational', 'Spiritual', 'Visionary', 'Sensitive'],
    challenge: 'The master number brings master challenges: the 11 often lives with intense anxiety, nervous energy, and the weight of gifts that feel too large to bear. Your growth lies in learning to ground your visionary energy and trust that you are strong enough for your own light.',
    keywords: ['Intuition', 'Inspiration', 'Illumination', 'Spiritual Mastery', 'Vision'],
  },
  22: {
    number: 22, isMaster: true,
    description: 'Life Path 22 is the Master Builder — the soul who carries the most expansive creative potential in all of numerology. You have come to translate cosmic vision into concrete reality at a scale that serves humanity. Your gift is the rare combination of visionary imagination and the pragmatic intelligence to realize it.',
    traits: ['Visionary', 'Pragmatic', 'Powerful', 'Disciplined', 'Humanitarian'],
    challenge: 'The master number brings master pressure: the 22 often feels crushed by the weight of unfulfilled potential or retreats into the lesser expression of the 4. Your growth lies in accepting the magnitude of your calling and trusting that the support will arise as you commit to your highest work.',
    keywords: ['Mastery', 'Manifestation', 'Vision', 'Legacy', 'Humanitarian Leadership'],
  },
  33: {
    number: 33, isMaster: true,
    description: 'Life Path 33 is the Master Teacher — the embodiment of unconditional love and the highest expression of compassionate service. Rare and demanding, this path calls you to transcend personal agenda entirely and become a living vessel for healing wisdom. You are here to teach through being, not merely doing.',
    traits: ['Compassionate', 'Healing', 'Wise', 'Selfless', 'Inspiring'],
    challenge: 'The 33 must guard against self-sacrifice that destroys rather than serves — martyrdom clothed in spiritual language. Your growth lies in understanding that you cannot give from an empty vessel, and that self-care is the prerequisite for genuine service.',
    keywords: ['Unconditional Love', 'Healing', 'Teaching', 'Service', 'Christ Consciousness'],
  },
};

export function getNumerologyReading(date: Date, today: Date): NumerologyReading {
  const lifePath = calculateLifePath(date);
  const lpData = LIFE_PATHS[lifePath] ?? LIFE_PATHS[9];

  const personalYear = calculatePersonalYear(date, today.getFullYear());
  const personalMonth = calculatePersonalMonth(personalYear, today.getMonth() + 1);
  const personalDay = calculatePersonalDay(personalMonth, today.getDate());

  return {
    lifePath: lpData,
    personalYear,
    personalMonth,
    personalDay,
  };
}
