import type {
  WesternReading, VedicReading, BaziReading, NumerologyReading,
  CardDeepDives, CardDeepDive, CardTableRow,
} from '@/types';

/* ── Western extras by sign ── */
const WESTERN_EXTRAS: Record<string, {
  house: string; houseTheme: string; luckyDay: string; luckyNumbers: string;
  compatible: string; opposite: string; bodyArea: string; season: string; tarot: string;
}> = {
  Aries:       { house: '1st', houseTheme: 'Self, Identity & Appearance', luckyDay: 'Tuesday', luckyNumbers: '1, 9', compatible: 'Leo, Sagittarius, Gemini', opposite: 'Libra', bodyArea: 'Head & Face', season: 'Early Spring', tarot: 'The Emperor' },
  Taurus:      { house: '2nd', houseTheme: 'Values, Possessions & Self-Worth', luckyDay: 'Friday', luckyNumbers: '2, 6', compatible: 'Virgo, Capricorn, Cancer', opposite: 'Scorpio', bodyArea: 'Throat & Neck', season: 'Late Spring', tarot: 'The Hierophant' },
  Gemini:      { house: '3rd', houseTheme: 'Communication, Learning & Siblings', luckyDay: 'Wednesday', luckyNumbers: '3, 5', compatible: 'Libra, Aquarius, Aries', opposite: 'Sagittarius', bodyArea: 'Arms, Hands & Lungs', season: 'Early Summer', tarot: 'The Lovers' },
  Cancer:      { house: '4th', houseTheme: 'Home, Family & Emotional Roots', luckyDay: 'Monday', luckyNumbers: '2, 7', compatible: 'Scorpio, Pisces, Taurus', opposite: 'Capricorn', bodyArea: 'Chest & Stomach', season: 'Mid Summer', tarot: 'The Chariot' },
  Leo:         { house: '5th', houseTheme: 'Creativity, Romance & Self-Expression', luckyDay: 'Sunday', luckyNumbers: '1, 4', compatible: 'Aries, Sagittarius, Libra', opposite: 'Aquarius', bodyArea: 'Heart & Spine', season: 'Late Summer', tarot: 'Strength' },
  Virgo:       { house: '6th', houseTheme: 'Health, Service & Daily Routines', luckyDay: 'Wednesday', luckyNumbers: '5, 6', compatible: 'Taurus, Capricorn, Cancer', opposite: 'Pisces', bodyArea: 'Digestive System', season: 'Early Autumn', tarot: 'The Hermit' },
  Libra:       { house: '7th', houseTheme: 'Partnerships, Marriage & Contracts', luckyDay: 'Friday', luckyNumbers: '4, 6', compatible: 'Gemini, Aquarius, Leo', opposite: 'Aries', bodyArea: 'Lower Back & Kidneys', season: 'Mid Autumn', tarot: 'Justice' },
  Scorpio:     { house: '8th', houseTheme: 'Transformation, Sexuality & Shared Resources', luckyDay: 'Tuesday', luckyNumbers: '8, 9', compatible: 'Cancer, Pisces, Virgo', opposite: 'Taurus', bodyArea: 'Reproductive System', season: 'Late Autumn', tarot: 'Death' },
  Sagittarius: { house: '9th', houseTheme: 'Philosophy, Travel & Higher Learning', luckyDay: 'Thursday', luckyNumbers: '3, 7', compatible: 'Aries, Leo, Aquarius', opposite: 'Gemini', bodyArea: 'Thighs & Liver', season: 'Early Winter', tarot: 'Temperance' },
  Capricorn:   { house: '10th', houseTheme: 'Career, Ambition & Public Image', luckyDay: 'Saturday', luckyNumbers: '4, 8', compatible: 'Taurus, Virgo, Scorpio', opposite: 'Cancer', bodyArea: 'Bones, Knees & Joints', season: 'Mid Winter', tarot: 'The Devil' },
  Aquarius:    { house: '11th', houseTheme: 'Community, Innovation & Future Vision', luckyDay: 'Saturday', luckyNumbers: '4, 7', compatible: 'Gemini, Libra, Sagittarius', opposite: 'Leo', bodyArea: 'Ankles & Circulation', season: 'Late Winter', tarot: 'The Star' },
  Pisces:      { house: '12th', houseTheme: 'Spirituality, Dreams & the Unconscious', luckyDay: 'Thursday', luckyNumbers: '3, 7', compatible: 'Cancer, Scorpio, Taurus', opposite: 'Virgo', bodyArea: 'Feet & Lymphatic System', season: 'Late Winter', tarot: 'The Moon' },
};

/* ── Personalised deep-dive narrative templates ── */

const WEST_ELEMENT_DIVE: Record<string, string> = {
  Fire:  'Fire signs carry the spark of creation itself. In your chart this manifests as a primal drive to initiate, to be seen, and to set the world in motion through sheer force of will. Your vitality burns brightest when you have a mission that is genuinely yours — not inherited, not assigned, but chosen. The shadow of Fire is burnout and ego inflation; the gift is the ability to warm every room you enter and ignite possibility where others see dead ends.',
  Earth: 'Earth signs anchor the zodiac in reality. For you, this means a bone-deep need for things you can touch, build, and rely on. Your relationship to the material world is not superficial — it is sacred. You understand that beauty, security, and lasting value are built slowly, through devotion to craft and an almost geological patience. The shadow is rigidity; the gift is the ability to create things that outlast you.',
  Air:   'Air signs circulate the life-breath of ideas through the collective. Your mind is your greatest instrument — restless, brilliant, and perpetually seeking new connections between seemingly unrelated things. You process the world through thought and communication, and your relationships thrive on intellectual stimulation. The shadow is detachment from the body and the emotions; the gift is perspective that liberates.',
  Water: 'Water signs carry the emotional memory of the cosmos. For you, feeling is not a weakness — it is a form of intelligence. You perceive undercurrents that others completely miss, and your capacity for empathy, healing, and creative depth is extraordinary. The shadow is overwhelm and the tendency to absorb everyone else\'s emotional weather; the gift is the ability to hold space for transformation in a way that nothing else can.',
};

const WEST_PLANET_DIVE: Record<string, string> = {
  Mars:    'Mars as your planetary ruler charges your life with a warrior\'s energy — direct, decisive, and unapologetically action-oriented. You are designed to move first and process later. This gives you an edge in any competitive or pioneering endeavour, but requires conscious management of anger and impatience.',
  Venus:   'Venus as your ruler colours your entire existence with an aesthetic sensibility. Beauty, pleasure, harmony, and the art of relationship are not luxuries for you — they are necessities. You instinctively create environments and connections that nourish the senses and the soul.',
  Mercury: 'Mercury as your ruler gifts you with a mind that never stops — curious, analytical, and extraordinarily versatile. Communication in all its forms is your native tongue. You translate complexity into clarity, and your happiest moments often involve learning something genuinely new.',
  Moon:    'The Moon as your ruler ties your identity to the tidal rhythms of emotion, memory, and instinct. You are profoundly affected by atmosphere, feeling, and the unspoken currents in any space. This sensitivity is both your vulnerability and your superpower.',
  Sun:     'The Sun as your ruler places you at the centre of your own solar system — not from ego, but from the natural radiance of a soul that is designed to shine. Your vitality, creativity, and sense of purpose all emanate from a core need to express your authentic self fully.',
  Jupiter: 'Jupiter as your ruler expands everything it touches — your vision, your optimism, your hunger for meaning, and your capacity for generosity. You are wired for growth, exploration, and the philosophical pursuit of truth. The risk is overextension; the gift is unshakeable faith in life\'s essential goodness.',
  Saturn:  'Saturn as your ruler demands mastery through discipline, time, and earned authority. Nothing comes easily or early for you — but what you build endures. Saturn rewards patience, structure, and the willingness to do the hard work that others avoid. Your late blooming is your greatest strength.',
  Uranus:  'Uranus as your ruler makes you a natural revolutionary — wired to innovate, disrupt, and reimagine what is possible. You are uncomfortable with convention and compelled toward the future. Your gift is vision; your challenge is learning to bring others along rather than leaving them behind.',
  Neptune: 'Neptune as your ruler dissolves the boundaries between self and other, between the rational and the mystical. You live in a world of impressions, dreams, and subtle knowing. This makes you extraordinarily creative and compassionate, but also vulnerable to illusion and emotional overwhelm.',
  Pluto:   'Pluto as your ruler gives you an unflinching relationship with power, death, and rebirth. You are drawn to the hidden mechanics of life — what lies beneath surfaces, what transforms in the dark. Your intensity can intimidate, but it also heals at a depth that nothing superficial ever reaches.',
};

const BAZI_ELEMENT_DIVE: Record<string, string> = {
  Wood:  'Wood is the element of growth, vision, and benevolent expansion. As a Wood Day Master, your life force is oriented toward upward movement — like a tree reaching for light. You are happiest when growing, planning, and cultivating something meaningful. Stagnation is your kryptonite. Your relationships, career, and inner life all need room to develop over time. The Chinese philosophical tradition associates Wood with the virtue of Ren (仁) — humaneness and the capacity for compassionate authority.',
  Fire:  'Fire is the element of illumination, joy, and transformative power. As a Fire Day Master, you are designed to radiate — your presence is palpable and your capacity to inspire is instinctive. Fire in Bazi governs propriety and clear expression (Li, 禮). When balanced, you warm others and light the way. When unbalanced, you consume everything — including yourself. The key to your life is learning to burn steadily rather than explosively.',
  Earth: 'Earth is the element of stability, trustworthiness, and centring force. As an Earth Day Master, you are the gravitational centre in any system you inhabit. Others lean on you naturally because your reliability is not an act — it is who you are. Earth governs faith and integrity (Xin, 信). Your greatest contribution is your ability to hold things together when everything else is shifting. Your challenge is allowing yourself to be held in return.',
  Metal: 'Metal is the element of precision, justice, and refinement. As a Metal Day Master, you have an instinct for cutting through to what is true and discarding what is not. Metal governs righteousness (Yi, 義). You are principled, often to an exacting standard that others find demanding but ultimately respect. Your aesthetic sense is sharp, your standards are high, and your loyalty — once given — is absolute.',
  Water: 'Water is the element of wisdom, adaptability, and depth. As a Water Day Master, you are the most fluid and versatile of the five elements — capable of navigating around any obstacle with patient intelligence. Water governs wisdom (Zhi, 智). Your mind is your most powerful asset, and your ability to read people and situations is uncanny. The challenge for Water is learning to hold form — to commit fully rather than keeping options perpetually open.',
};

const NAKSH_DIVE: Record<string, string> = {
  'Ashwini':           'Ashwini, the Star of Transport, carries the energy of the cosmic physicians — the Ashwini Kumaras. Your soul is wired for swiftness, healing, and the miraculous ability to restore what is broken. You move through life at extraordinary speed, and your impatience is actually the urgency of a healer who knows that suffering is unnecessary.',
  'Bharani':           'Bharani is the Star of Restraint, governed by Yama — the lord of death and dharmic justice. This nakshatra carries immense creative and destructive power. You understand the full cycle of life — birth, death, rebirth — at a cellular level. Your capacity to endure and to transform is unparalleled.',
  'Krittika':          'Krittika, the Star of Fire, is ruled by Agni — the sacred flame. You carry the purifying energy of spiritual fire: the ability to burn away what is false and leave only what is essential. This gives you extraordinary discernment and a sharp, penetrating intelligence.',
  'Rohini':            'Rohini, the Star of Ascent, is blessed by Brahma — the creator. It is considered the most beautiful and fertile of all nakshatras. Your life is marked by abundance, sensual appreciation, and a magnetic quality that draws opportunities and people to you naturally.',
  'Mrigashira':        'Mrigashira, the Searching Star, carries the energy of Soma — the divine nectar seeker. You are a perpetual searcher, driven by an insatiable curiosity that extends across subjects, cultures, and modes of understanding. Your restlessness is sacred — it is the soul\'s hunger for truth.',
  'Ardra':             'Ardra, the Star of Sorrow, is governed by Rudra — the storm deity. You carry the power of destruction that clears the way for genuine renewal. Your life may involve intense experiences of loss or upheaval that ultimately serve a transformative purpose far larger than personal comfort.',
  'Punarvasu':         'Punarvasu, the Star of Renewal, is blessed by Aditi — the mother of the gods and a symbol of infinite space. You carry the gift of regeneration: no matter how far you fall or how lost you become, you find your way back. Renewal is written into your soul\'s code.',
  'Pushya':            'Pushya, the Star of Nourishment, is one of the most auspicious nakshatras — governed by Brihaspati (Jupiter). You carry the energy of the wise counsellor: nourishing, stabilising, and capable of providing genuine sustenance to everyone in your orbit.',
  'Ashlesha':          'Ashlesha, the Clinging Star, is ruled by the Nagas — the serpent deities. You carry deep mystical knowledge, extraordinary psychological perception, and a serpentine intelligence that sees through pretence instantly. Your power is occult, subtle, and often misunderstood.',
  'Magha':             'Magha, the Star of Power, is governed by the Pitris — the ancestral spirits. You carry a regal quality that commands natural respect. Lineage, heritage, and the honouring of what came before you are central themes of your incarnation.',
  'Purva Phalguni':    'Purva Phalguni, the Star of Good Fortune, is blessed by Bhaga — the god of marital bliss and prosperity. You carry the energy of celebration, creative enjoyment, and the deep understanding that pleasure and spiritual life are not opposites.',
  'Uttara Phalguni':   'Uttara Phalguni, the Star of Patronage, is governed by Aryaman — the god of sacred contracts. You carry natural authority in matters of justice, social order, and the building of trustworthy partnerships. People instinctively rely on your word.',
  'Hasta':             'Hasta, the Star of the Hand, is ruled by Savitar — the creative solar deity. You carry the gift of skilful creation: the ability to manifest ideas through the work of your hands, your craft, and your meticulous attention to detail.',
  'Chitra':            'Chitra, the Star of Opportunity, is governed by Tvastar — the celestial architect. You carry the blueprint of beauty: a deep drive to create, design, and bring magnificent form into being. You see potential structure in raw material.',
  'Swati':             'Swati, the Star of Independence, is blessed by Vayu — the wind god. You carry the energy of freedom, movement, and the ability to adapt to any environment. Your diplomacy and social intelligence make you a natural bridge-builder.',
  'Vishakha':          'Vishakha, the Star of Purpose, is governed by Indra-Agni — the twin deities of power and purification. You carry extraordinary determination and single-pointed focus. When you choose a goal, your pursuit of it is almost unstoppable.',
  'Anuradha':          'Anuradha, the Star of Success, is blessed by Mitra — the god of friendship and sacred alliance. You carry the gift of devotional connection: the ability to form bonds of profound loyalty and to succeed through the power of genuine relationship.',
  'Jyeshtha':          'Jyeshtha, the Star of the Elder, is governed by Indra — the king of the gods. You carry natural authority and the weight of seniority: others look to you for leadership, protection, and the wisdom that comes from having endured and prevailed.',
  'Mula':              'Mula, the Root Star, is ruled by Nirrriti — the goddess of dissolution. You carry the power to uproot what is false at the deepest level. Your life may involve intense periods of destruction that ultimately reveal the unshakeable foundation of who you truly are.',
  'Purva Ashadha':     'Purva Ashadha, the Star of Invincibility, is blessed by Apas — the water deity. You carry an inexhaustible energy for truth-seeking and philosophical exploration. Your confidence is deep-rooted and your capacity for persuasion is formidable.',
  'Uttara Ashadha':    'Uttara Ashadha, the Star of the Universal, is governed by the Vishvedevas — the universal gods. You carry the energy of indomitable victory that serves a cause greater than the self. Your authority is earned through sacrifice and integrity.',
  'Shravana':          'Shravana, the Star of Learning, is blessed by Vishnu — the preserver. You carry the gift of deep listening: the ability to absorb knowledge, wisdom, and the subtle messages of the cosmos through an organism finely tuned to sound and meaning.',
  'Dhanishtha':        'Dhanishtha, the Star of Symphony, is governed by the Vasus — the elemental deities. You carry the rhythm of abundance: a natural gift for creating wealth, music, and prosperity through attuned action and collective harmony.',
  'Shatabhisha':       'Shatabhisha, the Hundred Healers, is ruled by Varuna — the cosmic lord of waters and truth. You carry mystical healing power that operates at the intersection of medicine and magic. Your soul is drawn to the hidden causes of suffering and the ancient technologies of restoration.',
  'Purva Bhadrapada':  'Purva Bhadrapada, the Burning Star, is governed by Aja Ekapada — the one-footed serpent of cosmic fire. You carry transformative power of extraordinary intensity. Your spiritual path involves burning through the ego\'s final defences to reach the truth that lies beyond all form.',
  'Uttara Bhadrapada': 'Uttara Bhadrapada, the Star of the Deep, is blessed by Ahir Budhnya — the serpent of the cosmic depths. You carry the wisdom of the most ancient and patient forces in creation. Your spiritual power is vast but operates quietly, like the tectonic movements that shape continents.',
  'Revati':            'Revati, the Star of Wealth, is governed by Pushan — the shepherd of souls. You carry the gentlest and most compassionate energy in the entire nakshatra system. You are a guide, a nourisher, and a keeper of safe passage for those transitioning between worlds.',
};

function getNakshatraDive(name: string): string {
  for (const key of Object.keys(NAKSH_DIVE)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return NAKSH_DIVE[key];
  }
  return `Your nakshatra carries a distinctive soul signature that colours your entire chart with its specific qualities and ancestral resonance.`;
}

/* ── Life Path deep dives ── */
const LP_DIVE: Record<number, string> = {
  1:  'The 1 vibration is the primal creative force — the first number, the beginning of all sequences. In your chart, this translates to a soul that is designed to originate rather than follow. You are here to discover what you are capable of when no one else\'s blueprint is available, when the road ahead is genuinely unmarked. The 1 learns leadership not through authority over others but through absolute fidelity to its own vision. Every challenge you face is, at its core, an invitation to trust yourself more completely.',
  2:  'The 2 vibration is the cosmic bridge — the first number of relationship, of duality, of the space between. Your soul operates in the connective tissue of life: mediating, sensing, harmonising. You are wired for partnership at every level, and your growth comes not from standing alone but from learning to stand beside another without losing yourself. The 2\'s power is subtle but immense — like the unseen force that holds two atoms together.',
  3:  'The 3 vibration is the number of creation made manifest — the child of 1 and 2, where thought meets feeling and expression is born. Your soul is a creative engine, designed to take the raw material of experience and transform it into something that moves, inspires, or delights others. The 3 must create or it withers. Your happiest moments and your deepest purpose are found where authentic expression meets genuine vulnerability.',
  4:  'The 4 vibration is the foundation stone — the only number that forms a perfect square, capable of supporting weight from all directions. Your soul is here to build what lasts: systems, structures, relationships, and work that endure beyond the moment. The 4 does not do things halfway. Your integrity is your most valuable asset, and your life\'s architecture — however long it takes to complete — will stand as proof that patience and devotion have their own kind of genius.',
  5:  'The 5 vibration sits at the exact centre of the numerological spectrum — the fulcrum, the sensory gateway, the number of direct experience. Your soul learns through encounter rather than theory. Freedom is not a preference for you — it is a spiritual requirement. The 5 must taste, travel, touch, and test life in all its variety. Your challenge is transmuting that raw experience into transmittable wisdom rather than simply accumulating stories.',
  6:  'The 6 vibration is the cosmic heart — the number of love, service, and sacred responsibility. Your soul is here to answer the question: what does love look like when it shows up as action? You are wired for nurturing, creating beauty, and taking responsibility for the wellbeing of others. The 6\'s deepest lesson is learning that self-sacrifice without self-care is not love — it is depletion wearing a beautiful mask.',
  7:  'The 7 vibration is the seeker\'s number — the mystic, the analyst, the one who looks behind the curtain of consensual reality. Your soul requires solitude, depth, and genuine inquiry. Surface-level living feels physically uncomfortable to you. The 7 is drawn to the hidden patterns — in nature, in consciousness, in the architecture of existence itself. Your mind is your temple, and the wisdom you cultivate there is your primary contribution to the world.',
  8:  'The 8 vibration is the number of power in material form — the infinite loop of giving and receiving, the energetic law of cause and effect made visible. Your soul is here to master the relationship between effort and abundance, between authority and service. The 8 does not do things small. Money, influence, and structural power are your classroom — not because you are materialistic, but because the physical world is where your soul does its deepest learning.',
  9:  'The 9 vibration is the number of completion and universal compassion — the final single digit, containing the essence of all that came before. Your soul carries the accumulated wisdom of the entire numerical cycle. You are here to give, to release, to serve the collective, and to model what it looks like to hold the broadest perspective. The 9\'s challenge is allowing itself to receive as generously as it gives.',
  11: 'Master Number 11 carries double the voltage of the 1 — visionary inspiration amplified to a frequency that can be both exhilarating and overwhelming. Your soul is designed to act as a channel between the invisible and the visible, translating higher wisdom into forms that ordinary consciousness can use. This is an extraordinary gift that demands extraordinary self-care. The 11 who manages their sensitivity becomes a genuine light-bearer.',
  22: 'Master Number 22 is the Master Builder — the most materially powerful vibration in all of numerology. Your soul has come with the blueprints for something vast: an institution, a system, a body of work that transforms the landscape for others. The 22 combines the spiritual vision of the 11 with the practical mastery of the 4. When aligned, you don\'t just dream — you build the dream in physical reality at a scale that leaves a permanent mark.',
  33: 'Master Number 33 is the Master Teacher — the rarest and most spiritually demanding vibration. Your soul carries the combined gifts of the 11 and the 22, channelled through the loving frequency of the 6. You are here to teach not through words alone but through the embodiment of unconditional love expressed as practical, transformative action. The 33 who has done their inner work becomes one of the most healing presences on earth.',
};

/* ── Generator ── */

export function generateCardDeepDives(
  western: WesternReading,
  vedic: VedicReading,
  bazi: BaziReading,
  numerology: NumerologyReading,
): CardDeepDives {
  const we = western.sunSign;
  const vi = vedic.rashi;
  const nk = vedic.nakshatra;
  const dm = bazi.dayMaster;
  const lp = numerology.lifePath;
  const wExtra = WESTERN_EXTRAS[we.name] ?? WESTERN_EXTRAS['Aries'];
  const pillars = [bazi.yearPillar, bazi.monthPillar, bazi.dayPillar, ...(bazi.hourPillar ? [bazi.hourPillar] : [])];

  /* ── Western ── */
  const westernDive: CardDeepDive = {
    title: `${we.symbol} ${we.name}`,
    icon: '☽',
    accent: '#C77DFF',
    table: [
      { label: 'Sun Sign', value: `${we.symbol} ${we.name}` },
      { label: 'Element', value: we.element },
      { label: 'Modality', value: we.modality ?? '—' },
      { label: 'Ruling Planet', value: we.rulingPlanet },
      { label: 'Natural House', value: `${wExtra.house} House — ${wExtra.houseTheme}` },
      { label: 'Compatible Signs', value: wExtra.compatible },
      { label: 'Opposite Sign', value: wExtra.opposite },
      { label: 'Tarot Card', value: wExtra.tarot },
      { label: 'Body Rulership', value: wExtra.bodyArea },
      { label: 'Lucky Day', value: wExtra.luckyDay },
      { label: 'Lucky Numbers', value: wExtra.luckyNumbers },
      { label: 'Season', value: wExtra.season },
      { label: 'Key Traits', value: we.traits.join(', ') },
    ],
    deepDive: `${we.description}\n\n${WEST_ELEMENT_DIVE[we.element] ?? ''}\n\n${WEST_PLANET_DIVE[we.rulingPlanet] ?? ''} Your ${we.modality ?? 'unique'} modality means you ${we.modality === 'Cardinal' ? 'initiate — you are wired to start things, to set direction, and to move first when others hesitate' : we.modality === 'Fixed' ? 'sustain — you carry whatever you commit to with extraordinary endurance and depth, holding the course long after others have moved on' : 'adapt — you are the shape-shifter of the zodiac, capable of adjusting your approach to meet whatever the moment requires without losing your essence'}. The ${wExtra.house} House association connects your solar identity to ${wExtra.houseTheme.toLowerCase()}, making this life domain a particularly potent arena for your growth and self-expression.`,
  };

  /* ── Vedic ── */
  const vedicDive: CardDeepDive = {
    title: vi.name,
    icon: 'ॐ',
    accent: '#FFD700',
    table: [
      { label: 'Rashi (Moon Sign)', value: `${vi.symbol} ${vi.name}` },
      { label: 'Rashi Element', value: vi.element },
      { label: 'Ruling Planet', value: vi.rulingPlanet },
      { label: 'Nakshatra', value: nk.name },
      { label: 'Nakshatra Meaning', value: nk.englishMeaning },
      { label: 'Nakshatra Symbol', value: nk.symbol },
      { label: 'Presiding Deity', value: nk.deity },
      { label: 'Nakshatra Ruler', value: nk.ruling },
      { label: 'Pada', value: `${nk.pada} — ${['Dharma (Purpose)', 'Artha (Prosperity)', 'Kama (Desire)', 'Moksha (Liberation)'][nk.pada - 1] ?? 'Sacred Path'}` },
      { label: 'Core Qualities', value: nk.qualities.join(', ') },
      { label: 'Rashi Traits', value: vi.traits.join(', ') },
    ],
    deepDive: `${vi.description}\n\n${getNakshatraDive(nk.name)}\n\nYour Pada ${nk.pada} placement within ${nk.name} activates the ${['dharmic — your soul\'s primary impulse is toward purpose, duty, and the fulfilment of your cosmic role. Action comes naturally, and the question driving your life is not "what do I want?" but "what am I here to do?"' , 'artha — your soul is oriented toward creating tangible value, security, and prosperity. This is not materialism; it is the spiritual understanding that resources enable purpose and that building something real is a form of sacred work.', 'kama — your soul expresses itself through desire, relationship, and the pursuit of what brings genuine pleasure and connection. You learn through feeling, through attraction, and through the embodied experience of what it means to want and to receive.', 'moksha — your soul is oriented toward liberation, spiritual depth, and the dissolution of everything that stands between you and ultimate truth. This pada gives your nakshatra its most transcendent and searching expression.'][nk.pada - 1] ?? 'sacred'} quarter of this star\'s energy. The symbol of ${nk.symbol} reflects the essential nature of your soul\'s work in this lifetime — ${nk.deity}\'s blessing gives you access to the specific cosmic frequencies that ${nk.qualities.slice(0, 2).join(' and ')} draw from.`,
  };

  /* ── Bazi ── */
  const baziDive: CardDeepDive = {
    title: `${dm.polarity} ${dm.element} Day Master`,
    icon: '命',
    accent: '#E07A5F',
    table: [
      { label: 'Day Master', value: `${dm.polarity} ${dm.element} (${bazi.dayPillar.stem.chinese} ${bazi.dayPillar.stem.pinyin})` },
      ...pillars.map(p => ({
        label: p.label,
        value: `${p.stem.chinese}${p.branch.chinese} — ${p.stem.name} / ${p.branch.animal} (${p.branch.element})`,
      })),
      { label: 'Day Master Traits', value: dm.traits.join(', ') },
      { label: 'Year Animal', value: `${bazi.yearPillar.branch.chinese} ${bazi.yearPillar.branch.animal}` },
      { label: 'Day Animal', value: `${bazi.dayPillar.branch.chinese} ${bazi.dayPillar.branch.animal}` },
    ],
    deepDive: `${dm.description}\n\n${BAZI_ELEMENT_DIVE[dm.element] ?? ''}\n\nThe Four Pillars of your chart tell a deeper story. Your Year Pillar (${bazi.yearPillar.stem.chinese}${bazi.yearPillar.branch.chinese} — ${bazi.yearPillar.stem.name} / ${bazi.yearPillar.branch.animal}) represents your ancestral inheritance and the face you show the outer world. The Month Pillar (${bazi.monthPillar.stem.chinese}${bazi.monthPillar.branch.chinese} — ${bazi.monthPillar.stem.name} / ${bazi.monthPillar.branch.animal}) governs your career, your parents\' influence, and the conditions of your early adult life. The Day Pillar (${bazi.dayPillar.stem.chinese}${bazi.dayPillar.branch.chinese} — ${bazi.dayPillar.stem.name} / ${bazi.dayPillar.branch.animal}) is the most personal — it is your true self and the intimate nature only those closest to you will ever see. The ${bazi.dayPillar.branch.animal} in your Day Branch colours your most private relationships: ${bazi.dayPillar.branch.animal === 'Rat' || bazi.dayPillar.branch.animal === 'Pig' ? 'resourceful cleverness and a hidden warmth that reveals itself slowly' : bazi.dayPillar.branch.animal === 'Ox' || bazi.dayPillar.branch.animal === 'Goat' ? 'patient devotion and a nurturing quality that anchors those around you' : bazi.dayPillar.branch.animal === 'Tiger' || bazi.dayPillar.branch.animal === 'Dragon' ? 'magnetic boldness and a larger-than-life presence in intimate settings' : bazi.dayPillar.branch.animal === 'Rabbit' || bazi.dayPillar.branch.animal === 'Rooster' ? 'refined sensitivity and a keen eye for beauty and truth in close relationships' : bazi.dayPillar.branch.animal === 'Snake' || bazi.dayPillar.branch.animal === 'Monkey' ? 'sharp perceptiveness and a strategic intelligence in emotional matters' : 'steady loyalty and a warmth that creates safety for those you love'}.${bazi.hourPillar ? ` Your Hour Pillar (${bazi.hourPillar.stem.chinese}${bazi.hourPillar.branch.chinese} — ${bazi.hourPillar.stem.name} / ${bazi.hourPillar.branch.animal}) reveals your inner aspirations and the legacy you are building toward.` : ''}`,
  };

  /* ── Numerology ── */
  const numerologyDive: CardDeepDive = {
    title: lp.isMaster ? `Master Number ${lp.number}` : `Life Path ${lp.number}`,
    icon: '∞',
    accent: '#B88AE8',
    table: [
      { label: 'Life Path', value: `${lp.number}${lp.isMaster ? ' (Master Number)' : ''}` },
      { label: 'Keywords', value: lp.keywords.join(', ') },
      { label: 'Core Traits', value: lp.traits.join(', ') },
      { label: 'Key Challenge', value: lp.challenge },
      { label: 'Personal Year', value: `${numerology.personalYear} — ${numerology.personalYear === 1 ? 'New Beginnings' : numerology.personalYear === 2 ? 'Patience & Partnership' : numerology.personalYear === 3 ? 'Expansion & Expression' : numerology.personalYear === 4 ? 'Foundation Building' : numerology.personalYear === 5 ? 'Change & Freedom' : numerology.personalYear === 6 ? 'Responsibility & Love' : numerology.personalYear === 7 ? 'Introspection & Wisdom' : numerology.personalYear === 8 ? 'Abundance & Authority' : 'Completion & Release'}` },
      { label: 'Personal Month', value: String(numerology.personalMonth) },
      { label: 'Personal Day', value: String(numerology.personalDay) },
    ],
    deepDive: `${lp.description}\n\n${LP_DIVE[lp.number] ?? LP_DIVE[1]}\n\nYou are currently in Personal Year ${numerology.personalYear}, which flavours the entire year with the energy of ${numerology.personalYear === 1 ? 'fresh starts, bold action, and the planting of seeds that will define the next nine-year cycle of your life. What you initiate now has disproportionate significance' : numerology.personalYear === 2 ? 'patience, diplomacy, and the quiet work of building relationships and alliances. This is a year that rewards waiting and cooperating rather than pushing. Trust the process' : numerology.personalYear === 3 ? 'creative expansion, social connection, and the joy of authentic expression. Opportunities multiply now, particularly through communication and creative projects. Say yes to what excites you' : numerology.personalYear === 4 ? 'structure, discipline, and foundation-building. This is a year for putting in the work: systems, health, financial foundations, and the honest assessment of what is real and what is not' : numerology.personalYear === 5 ? 'change, freedom, and unexpected shifts that ultimately liberate. Travel, new experiences, and the willingness to release what has become too small for you are all favoured. Expect the unexpected' : numerology.personalYear === 6 ? 'home, family, love, and sacred responsibility. Relationships deepen, commitments solidify, and the quality of your inner life becomes the most important thing. Beauty and nurturing are your medicine' : numerology.personalYear === 7 ? 'introspection, solitude, and the deeper questions. This is a year for going inward, for study, for spiritual growth, and for trusting the wisdom that emerges from genuine quiet. Less is more' : numerology.personalYear === 8 ? 'material abundance, career advancement, and the right use of power. Financial and professional matters reach a peak. What you have built is becoming visible, and authority — earned, not taken — is yours to claim' : 'completion, release, and the clearing of space for the next cycle. Let go of what is finished. Forgive. Simplify. The 9 year asks you to trust that what is ending is creating room for something your current self cannot yet imagine'}. This numerological weather combines with your Life Path ${lp.number} to create a highly specific energetic climate for growth.`,
  };

  return { western: westernDive, vedic: vedicDive, bazi: baziDive, numerology: numerologyDive };
}
