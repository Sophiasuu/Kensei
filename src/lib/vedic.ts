import type { VedicReading } from '@/types';
// @ts-ignore — astronomia has no TS declarations
import { julian, solar, moonposition, base } from 'astronomia';

// Vedic Rashi (sidereal zodiac signs)
const RASHI = [
  {
    name: 'Mesha', symbol: '♈', element: 'Fire', modality: 'Cardinal',
    rulingPlanet: 'Mars',
    traits: ['Dynamic', 'Courageous', 'Fiery', 'Impulsive', 'Pioneer'],
    description: 'Mesha is the primal spark of the cosmic order — the first impulse of creation finding form. Governed by Mars, your soul entered this life charged with initiative, directness, and an innate hunger to blaze new trails. In the Vedic tradition, you carry the energy of Shakti in its most raw and powerful expression.'
  },
  {
    name: 'Vrishabha', symbol: '♉', element: 'Earth', modality: 'Fixed',
    rulingPlanet: 'Venus',
    traits: ['Steadfast', 'Sensual', 'Patient', 'Artistic', 'Reliable'],
    description: 'Vrishabha is the sacred bull of the earth — patient, fertile, and rooted in the richness of embodied existence. Ruled by Venus (Shukra), you carry an innate appreciation for beauty, pleasure, and the sacred in the material world. You are a builder of lasting things, a keeper of aesthetic truth.'
  },
  {
    name: 'Mithuna', symbol: '♊', element: 'Air', modality: 'Mutable',
    rulingPlanet: 'Mercury',
    traits: ['Curious', 'Communicative', 'Adaptable', 'Versatile', 'Dual-natured'],
    description: 'Mithuna is the divine twins in perpetual dialogue — the interplay of thought and speech, of knowing and communicating. Ruled by Mercury (Budha), you are a natural synthesizer of knowledge, a weaver of connections between disparate realms. Your mind is your most sacred instrument.'
  },
  {
    name: 'Karka', symbol: '♋', element: 'Water', modality: 'Cardinal',
    rulingPlanet: 'Moon',
    traits: ['Nurturing', 'Intuitive', 'Protective', 'Receptive', 'Emotional'],
    description: 'Karka is ruled by the Moon (Chandra), the celestial body closest to earthly life. You are deeply attuned to the rhythms of feeling, the currents of family, and the hidden tides of the psyche. In the Vedic view, your soul is practicing the sacred dharma of protection and unconditional nourishment.'
  },
  {
    name: 'Simha', symbol: '♌', element: 'Fire', modality: 'Fixed',
    rulingPlanet: 'Sun',
    traits: ['Regal', 'Creative', 'Generous', 'Dignified', 'Leadership'],
    description: 'Simha is the throne of the Sun (Surya) in the Vedic zodiac — a sign of royal authority, creative fire, and dharmic leadership. You are here to shine not for yourself but as a living example of what it means to embody one\'s highest self. Your gift is inspiration through authentic presence.'
  },
  {
    name: 'Kanya', symbol: '♍', element: 'Earth', modality: 'Mutable',
    rulingPlanet: 'Mercury',
    traits: ['Discerning', 'Healing', 'Precise', 'Modest', 'Service-oriented'],
    description: 'Kanya is the goddess of the harvest — the soul devoted to refinement, healing, and sacred service. Ruled by Mercury (Budha), your intelligence is applied not to accumulation but to improvement. The Vedic tradition sees Kanya as the bridge between the earthly and the divine through practical wisdom and skillful work.'
  },
  {
    name: 'Tula', symbol: '♎', element: 'Air', modality: 'Cardinal',
    rulingPlanet: 'Venus',
    traits: ['Balanced', 'Aesthetic', 'Diplomatic', 'Refined', 'Justice-seeking'],
    description: 'Tula is the scales of cosmic justice — the soul that seeks equilibrium in all domains of life. Ruled by Venus (Shukra), you have a refined aesthetic sense and a natural gift for harmonizing opposing forces. In the Vedic tradition, Tula represents the dharmic impulse toward right relationship.'
  },
  {
    name: 'Vrishchika', symbol: '♏', element: 'Water', modality: 'Fixed',
    rulingPlanet: 'Mars',
    traits: ['Intense', 'Perceptive', 'Transformative', 'Occult', 'Penetrating'],
    description: 'Vrishchika is the scorpion and the eagle — the sign of radical transformation, hidden knowledge, and the power of regeneration. Ruled by Mars, you are drawn to the depths of life\'s mysteries. The Vedic tradition associates this sign with tantra, the occult, and the mastery of pranic forces.'
  },
  {
    name: 'Dhanu', symbol: '♐', element: 'Fire', modality: 'Mutable',
    rulingPlanet: 'Jupiter',
    traits: ['Philosophical', 'Expansive', 'Righteous', 'Adventurous', 'Teaching'],
    description: 'Dhanu is the archer whose arrow is aimed at the highest truth. Ruled by Jupiter (Guru), you are a natural teacher, philosopher, and seeker of dharma. The Vedic tradition sees Dhanu as the sign of the highest form of fire — the flame of spiritual knowledge that lights the way for others.'
  },
  {
    name: 'Makara', symbol: '♑', element: 'Earth', modality: 'Cardinal',
    rulingPlanet: 'Saturn',
    traits: ['Disciplined', 'Karmic', 'Ambitious', 'Patient', 'Structured'],
    description: 'Makara is the cosmic crocodile — an ancient symbol of the slow, irresistible force of karma in action. Ruled by Saturn (Shani), you are here to master the lessons of time, discipline, and the fruits of sustained effort. In the Vedic tradition, Makara souls are old souls perfecting their dharmic duty.'
  },
  {
    name: 'Kumbha', symbol: '♒', element: 'Air', modality: 'Fixed',
    rulingPlanet: 'Saturn',
    traits: ['Humanitarian', 'Reformative', 'Intellectual', 'Detached', 'Universal'],
    description: 'Kumbha is the water-bearer who pours the waters of consciousness upon humanity. Ruled by Saturn, you carry a reformative vision — a desire to restructure society, challenge orthodoxy, and distribute wisdom broadly. The Vedic tradition associates Kumbha with the great rishis who worked for collective upliftment.'
  },
  {
    name: 'Meena', symbol: '♓', element: 'Water', modality: 'Mutable',
    rulingPlanet: 'Jupiter',
    traits: ['Mystical', 'Compassionate', 'Dissolving', 'Spiritual', 'Intuitive'],
    description: 'Meena is the point where all rivers return to the ocean — the sign of moksha, liberation, and the dissolution of individual ego into cosmic consciousness. Ruled by Jupiter (Guru), your soul is the most ancient in the zodiac, carrying lifetimes of accumulated wisdom, compassion, and the memory of unity.'
  },
];

// 27 Nakshatras — each spans 13°20' of the sidereal zodiac
const NAKSHATRAS = [
  {
    name: 'Ashwini', englishMeaning: 'The Horse Twins', symbol: 'Horse head',
    deity: 'Ashwini Kumaras', ruling: 'Ketu',
    qualities: ['Swift', 'Healing', 'Pioneering', 'Courageous'],
    description: 'Ashwini carries the energy of the divine healers — swift, luminous, and concerned with the restoration of vitality. Born under this nakshatra, you possess remarkable capacity for healing, whether of body, mind, or spirit. Your energy is quick-acting and rejuvenating, with an innate drive toward beginnings.'
  },
  {
    name: 'Bharani', englishMeaning: 'The Bearer', symbol: 'Yoni',
    deity: 'Yama', ruling: 'Venus',
    qualities: ['Creative', 'Determined', 'Transformative', 'Intense'],
    description: 'Bharani is governed by Yama, the lord of dharma and cosmic law. This nakshatra carries the energy of cycles — birth, death, and rebirth. Those born here possess extraordinary creative power and an uncompromising relationship with truth. You understand sacrifice as the gateway to transformation.'
  },
  {
    name: 'Krittika', englishMeaning: 'The Cutter', symbol: 'Razor / Flame',
    deity: 'Agni', ruling: 'Sun',
    qualities: ['Sharp', 'Purifying', 'Determined', 'Critical'],
    description: 'Krittika is ruled by Agni, the celestial fire that purifies by burning away what is inessential. Those born here carry a penetrating intelligence and an uncompromising dedication to excellence. You are the refiner, the critic, the one whose high standards ultimately serve the good.'
  },
  {
    name: 'Rohini', englishMeaning: 'The Growing One', symbol: 'Chariot',
    deity: 'Brahma', ruling: 'Moon',
    qualities: ['Creative', 'Sensual', 'Fertile', 'Magnetic'],
    description: 'Rohini is the most beloved nakshatra of the Moon — lush, fertile, and overflowing with creative abundance. Those born here radiate beauty, sensuality, and a rare magnetism. You are a natural cultivator of beauty in all its forms — in art, in relationship, in the landscapes of daily life.'
  },
  {
    name: 'Mrigashira', englishMeaning: 'The Deer Head', symbol: 'Deer',
    deity: 'Soma', ruling: 'Mars',
    qualities: ['Seeking', 'Gentle', 'Curious', 'Restless'],
    description: 'Mrigashira is the eternal seeker — the deer forever moving through the forest in search of the source of the celestial fragrance. Those born here are gifted with a gentle intelligence, an insatiable curiosity, and a poetic sensitivity to beauty. The search itself is your deepest spiritual practice.'
  },
  {
    name: 'Ardra', englishMeaning: 'The Moist One', symbol: 'Teardrop',
    deity: 'Rudra', ruling: 'Rahu',
    qualities: ['Intense', 'Transformative', 'Stormy', 'Renewed'],
    description: 'Ardra is the storm that breaks the drought — raw, intense, and ultimately a vehicle of renewal. Governed by Rudra (Shiva in his fierce aspect), those born here are agents of necessary destruction and radical change. Your intensity is not a flaw but a cosmic function: clearing the old to make way for the new.'
  },
  {
    name: 'Punarvasu', englishMeaning: 'Return of the Light', symbol: 'Quiver of Arrows',
    deity: 'Aditi', ruling: 'Jupiter',
    qualities: ['Optimistic', 'Abundant', 'Renewing', 'Philosophical'],
    description: 'Punarvasu is ruled by Aditi, the infinite cosmic mother — the nakshatra of return, renewal, and the restoration of abundance after difficulty. Those born here carry an innate optimism and a remarkable ability to bounce back. You are a vessel for Jupiter\'s boundless grace and expansive wisdom.'
  },
  {
    name: 'Pushya', englishMeaning: 'The Nourisher', symbol: 'Lotus / Udder',
    deity: 'Brihaspati', ruling: 'Saturn',
    qualities: ['Nourishing', 'Caring', 'Protective', 'Wise'],
    description: 'Pushya is considered the most auspicious of all nakshatras — the great nourisher and sustainer. Governed by Brihaspati (Jupiter), the divine preceptor, those born here carry a gift for healing, teaching, and providing sustenance — spiritual and material — to all who enter their sphere.'
  },
  {
    name: 'Ashlesha', englishMeaning: 'The Embracer', symbol: 'Serpent',
    deity: 'Nagas', ruling: 'Mercury',
    qualities: ['Mystical', 'Perceptive', 'Intense', 'Clairvoyant'],
    description: 'Ashlesha is the coiled serpent of kundalini power — the nakshatra of deep psychic perception, occult mastery, and the ability to penetrate the veil between worlds. Those born here have extraordinary intuitive gifts and a penetrating intelligence that sees through illusion to hidden truth.'
  },
  {
    name: 'Magha', englishMeaning: 'The Mighty One', symbol: 'Royal Throne',
    deity: 'Pitrs (Ancestors)', ruling: 'Ketu',
    qualities: ['Regal', 'Ancestral', 'Authoritative', 'Noble'],
    description: 'Magha is the throne of royal authority — the nakshatra of ancestral legacy and dharmic leadership. Those born here carry the blessings and karmic imprints of their lineage. You are designed for positions of authority and are guided by the wisdom of those who came before you.'
  },
  {
    name: 'Purva Phalguni', englishMeaning: 'Former Red One', symbol: 'Hammock',
    deity: 'Bhaga', ruling: 'Venus',
    qualities: ['Creative', 'Pleasure-seeking', 'Generous', 'Artistic'],
    description: 'Purva Phalguni is governed by Bhaga, the deity of pleasure, beauty, and marital bliss. Those born here are blessed with creative gifts, a magnetic charm, and a deep appreciation for the sensory richness of life. You understand that joy is a form of worship and beauty a path to the sacred.'
  },
  {
    name: 'Uttara Phalguni', englishMeaning: 'Latter Red One', symbol: 'Cot',
    deity: 'Aryaman', ruling: 'Sun',
    qualities: ['Service-oriented', 'Dutiful', 'Steady', 'Dignified'],
    description: 'Uttara Phalguni is governed by Aryaman, the deity of contracts, unions, and social order. Those born here possess a rare combination of warmth and reliability — you are the one others can always count on. Your capacity for sustained, generous service is your most defining spiritual gift.'
  },
  {
    name: 'Hasta', englishMeaning: 'The Hand', symbol: 'Hand',
    deity: 'Savitar', ruling: 'Moon',
    qualities: ['Skilled', 'Healing', 'Nimble', 'Crafty'],
    description: 'Hasta is the nakshatra of the skilled hands — the healer, the craftsperson, the one who manifests through touch and dexterity. Governed by Savitar, the creative aspect of the Sun, those born here have remarkable practical intelligence and the ability to bring ideas into physical form with grace.'
  },
  {
    name: 'Chitra', englishMeaning: 'The Brilliant', symbol: 'Pearl / Bright Jewel',
    deity: 'Vishvakarma', ruling: 'Mars',
    qualities: ['Creative', 'Artistic', 'Dazzling', 'Architectural'],
    description: 'Chitra is the nakshatra of divine craftsmanship — the bright jewel of artistic genius. Governed by Vishvakarma, the celestial architect, those born here possess an extraordinary aesthetic vision and the technical mastery to realize it. You are a creator of luminous, enduring beauty in any medium.'
  },
  {
    name: 'Swati', englishMeaning: 'The Sword / Independent', symbol: 'Young Sprout in Wind',
    deity: 'Vayu', ruling: 'Rahu',
    qualities: ['Independent', 'Flexible', 'Diplomatic', 'Restless'],
    description: 'Swati is the young shoot that bends in the wind without breaking — the nakshatra of independence, adaptability, and diplomatic intelligence. Governed by Vayu, the wind deity, those born here move through life with a flexible grace, their greatest strength being the ability to navigate change without losing their center.'
  },
  {
    name: 'Vishakha', englishMeaning: 'The Forked One', symbol: 'Triumphal Arch',
    deity: 'Indra & Agni', ruling: 'Jupiter',
    qualities: ['Purposeful', 'Determined', 'Ambitious', 'Intense'],
    description: 'Vishakha is the nakshatra of focused determination — the archer who does not lower the bow until the target is reached. Governed by the combined force of Indra and Agni, those born here possess a rare capacity for sustained effort toward their chosen purpose. You are formidable when aligned with your dharma.'
  },
  {
    name: 'Anuradha', englishMeaning: 'Following Radha', symbol: 'Lotus',
    deity: 'Mitra', ruling: 'Saturn',
    qualities: ['Devoted', 'Friendly', 'Occult', 'Determined'],
    description: 'Anuradha is the lotus blooming in deep water — the soul whose deepest gifts emerge through the practice of devotion and friendship. Governed by Mitra, the deity of sacred covenants, those born here carry an extraordinary capacity for loyalty, spiritual depth, and the navigation of occult mysteries.'
  },
  {
    name: 'Jyeshtha', englishMeaning: 'The Eldest', symbol: 'Circular Amulet',
    deity: 'Indra', ruling: 'Mercury',
    qualities: ['Protective', 'Senior', 'Intense', 'Powerful'],
    description: 'Jyeshtha is the nakshatra of the elder — the one who carries authority through experience and the willingness to bear responsibility. Governed by Indra, the king of the gods, those born here possess natural leadership, protective instincts, and a depth of character forged through meeting life\'s greatest challenges.'
  },
  {
    name: 'Mula', englishMeaning: 'The Root', symbol: 'Tied Bundle of Roots',
    deity: 'Nirriti', ruling: 'Ketu',
    qualities: ['Investigative', 'Transformative', 'Philosophical', 'Rooting'],
    description: 'Mula is the nakshatra of radical roots — the energy that strips away what is inessential to reveal the core truth. Governed by Nirriti, the goddess of dissolution and cosmic undoing, those born here are agents of deep transformation, philosophical inquiry, and the courage to destroy what is false.'
  },
  {
    name: 'Purva Ashadha', englishMeaning: 'Former Invincible One', symbol: 'Fan / Winnowing Basket',
    deity: 'Apas', ruling: 'Venus',
    qualities: ['Purifying', 'Invincible', 'Idealistic', 'Persuasive'],
    description: 'Purva Ashadha is the nakshatra of the undefeated — the soul who possesses an inner invincibility that cannot be broken by outer circumstances. Governed by Apas, the deity of celestial waters, those born here have the gift of purification, the power of the spoken word, and an energy that invigorates all they touch.'
  },
  {
    name: 'Uttara Ashadha', englishMeaning: 'Latter Invincible One', symbol: 'Elephant Tusk',
    deity: 'Vishwadevas', ruling: 'Sun',
    qualities: ['Righteous', 'Victorious', 'Introspective', 'Universal'],
    description: 'Uttara Ashadha represents the final and lasting victory — not the victory of conquest but the triumph of righteousness. Governed by the Vishwadevas, the universal deities, those born here carry a broad, inclusive wisdom and a sense of responsibility toward the whole of creation. Your victory is meant to benefit all.'
  },
  {
    name: 'Shravana', englishMeaning: 'The Ear / Hearing', symbol: 'Ear / Three Footprints',
    deity: 'Vishnu', ruling: 'Moon',
    qualities: ['Listening', 'Learning', 'Connecting', 'Perceptive'],
    description: 'Shravana is the nakshatra of sacred listening — the soul whose greatest wisdom comes through deep receptivity to the voice of the universe. Governed by Vishnu, the preserver, those born here are masters of connection, learning, and the ability to synthesize diverse streams of knowledge into a coherent understanding.'
  },
  {
    name: 'Dhanishtha', englishMeaning: 'The Wealthiest', symbol: 'Drum',
    deity: 'Ashta Vasus', ruling: 'Mars',
    qualities: ['Musical', 'Prosperous', 'Dynamic', 'Courageous'],
    description: 'Dhanishtha is the nakshatra of cosmic rhythm and material abundance. Governed by the eight Vasus, the celestial manifestations of natural forces, those born here possess an innate sense of rhythm — musical, social, and cosmic. You are designed for both material prosperity and the generous sharing of your gifts.'
  },
  {
    name: 'Shatabhisha', englishMeaning: 'The Hundred Healers', symbol: 'Empty Circle',
    deity: 'Varuna', ruling: 'Rahu',
    qualities: ['Healing', 'Mysterious', 'Independent', 'Scientific'],
    description: 'Shatabhisha is the nakshatra of the hundred physicians — the sign of healing, mystery, and the penetration of esoteric knowledge. Governed by Varuna, the keeper of cosmic law and the depths of the ocean, those born here are solitary seekers with extraordinary healing gifts and a mastery of hidden sciences.'
  },
  {
    name: 'Purva Bhadrapada', englishMeaning: 'Former Happy Feet', symbol: 'Sword / Two-faced Man',
    deity: 'Aja Ekapada', ruling: 'Jupiter',
    qualities: ['Intense', 'Ascetic', 'Transformative', 'Purifying'],
    description: 'Purva Bhadrapada is the nakshatra of fierce purification — the consuming fire of spiritual transformation. Governed by Aja Ekapada, the one-footed goat who supports the entire cosmos, those born here possess an intensity that transforms everything it touches, burning away the dross to reveal the gold.'
  },
  {
    name: 'Uttara Bhadrapada', englishMeaning: 'Latter Happy Feet', symbol: 'Twins / Snake in Water',
    deity: 'Ahir Budhnya', ruling: 'Saturn',
    qualities: ['Deep', 'Wise', 'Serpentine', 'Compassionate'],
    description: 'Uttara Bhadrapada is the nakshatra of the cosmic serpent in the depths — the wisdom that comes from having explored the full range of experience. Governed by Ahir Budhnya, the serpent of the deep, those born here possess a profound, soulful wisdom and a quiet power that is felt more than seen.'
  },
  {
    name: 'Revati', englishMeaning: 'The Wealthy / Prosperous', symbol: 'Fish',
    deity: 'Pushan', ruling: 'Mercury',
    qualities: ['Compassionate', 'Musical', 'Protective', 'Journeying'],
    description: 'Revati is the final nakshatra — the completion of the zodiacal journey. Governed by Pushan, the nourishing guide of souls, those born here carry the accumulated wisdom of all prior nakshatras. You are a guardian of transitions, a gentle lamp for those navigating thresholds, and a natural keeper of sacred traditions.'
  },
];

function gregorianToJDN(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y +
    Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

// Lahiri ayanamsa (IAU 1956 values): ~23.86° in 2000, precessing at 50.3"/year (≈0.01397°/year)
function getLahiriAyanamsa(year: number): number {
  return 23.86 + 0.01397 * (year - 2000);
}

// Accurate moon ecliptic longitude using astronomia moonposition module
function getMoonTropicalLongitude(date: Date): number {
  const jde = julian.CalendarGregorianToJD(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate() + 0.5
  );
  const pos = moonposition.position(jde);
  return ((pos.lon * 180 / Math.PI) + 360) % 360;
}

// Accurate sun longitude for sidereal Rashi determination
function getSunTropicalLongitude(date: Date): number {
  const jde = julian.CalendarGregorianToJD(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate() + 0.5
  );
  const T = base.J2000Century(jde);
  return ((solar.apparentLongitude(T) * 180 / Math.PI) + 360) % 360;
}

export function getVedicReading(date: Date): VedicReading {
  const year = date.getFullYear();
  let ayanamsa: number;
  let tropicalSun: number;
  let moonTropical: number;

  try {
    ayanamsa = getLahiriAyanamsa(year);
    tropicalSun = getSunTropicalLongitude(date);
    moonTropical = getMoonTropicalLongitude(date);
  } catch {
    // Graceful fallback using mean motion
    const jdn = gregorianToJDN(year, date.getMonth() + 1, date.getDate());
    const daysSinceJ2000 = jdn - 2451545.0;
    ayanamsa = getLahiriAyanamsa(year);
    const start = new Date(year, 0, 1);
    const dayOfYear = Math.floor((date.getTime() - start.getTime()) / 86400000) + 1;
    tropicalSun = ((dayOfYear - 79) * (360 / 365.25) + 360) % 360;
    const meanMoon = (218.31 + 13.176 * daysSinceJ2000) % 360;
    moonTropical = ((meanMoon % 360) + 360) % 360;
  }

  // Sidereal sun longitude for Rashi
  const siderealSun = ((tropicalSun - ayanamsa) % 360 + 360) % 360;
  const rashiIndex = Math.floor(siderealSun / 30);
  const rashi = { ...RASHI[rashiIndex % 12] };

  // Sidereal moon longitude for Nakshatra
  const siderealMoon = ((moonTropical - ayanamsa) % 360 + 360) % 360;
  const nakshatraIndex = Math.floor(siderealMoon / (360 / 27));
  const nakshatraData = NAKSHATRAS[nakshatraIndex % 27];
  const longInNakshatra = siderealMoon % (360 / 27);
  const pada = Math.min(Math.floor(longInNakshatra / (360 / 27 / 4)) + 1, 4);

  const nakshatra: VedicReading['nakshatra'] = { ...nakshatraData, pada };

  return { rashi, nakshatra };
}
