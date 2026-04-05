import type { WesternReading, VedicReading, BaziReading, NumerologyReading, DeepAnalysis } from '@/types';

/* ── Helpers ── */
const WE = '☽';
const VE = 'ॐ';
const BZ = '命';
const NU = '∞';
const WA = '#c9a052';
const VA = '#d06050';
const BA = '#4f8f6e';
const NA = '#7a63b5';

// Western element → love style
const WEST_LOVE: Record<string, string> = {
  Fire:  'bold, passionate, and magnetically spontaneous',
  Earth: 'steady, sensual, and devotedly loyal',
  Air:   'intellectually stimulating, communicative, and charming',
  Water: 'deeply empathic, intensely bonded, and intuitively attuned',
};
const WEST_LOVE_SHADOW: Record<string, string> = {
  Fire:  'impatience or the need to always lead can sometimes crowd a partner\'s space',
  Earth: 'possessiveness or difficulty adapting when relationships evolve',
  Air:   'emotional detachment — the mind can analyse love away before it has time to root',
  Water: 'merging too completely, losing the self in the mirroring of another\'s world',
};

// Western element → career
const WEST_CAREER: Record<string, string> = {
  Fire:  'entrepreneurship, leadership, performance, and any field that rewards initiative and charisma',
  Earth: 'management, finance, agriculture, architecture, medicine, and fields that reward methodical expertise',
  Air:   'communications, law, education, design, technology, and fields that reward original thinking',
  Water: 'healing arts, counselling, creative fields, oceanography, and fields that reward emotional intelligence',
};

// Western element → health
const WEST_HEALTH: Record<string, string> = {
  Fire:  'Regulate your fire — protect the heart, adrenals, and inflammatory pathways. Your high-burn energy needs grounding practices: a cold walk at dawn, intentional rest, and foods that cool and nourish rather than inflame.',
  Earth: 'You are prone to holding tension in the body — the neck and shoulders, the digestive system, and the joints. Move consistently and eat mindfully. Your health restores through rhythmic, unhurried physical engagement with the natural world.',
  Air:   'Your nervous system is your sensitivity instrument. Prioritise sleep, breath practices, and digital boundaries. Your health restores in silence and through activities that land you in the body rather than the mind.',
  Water: 'Your lymphatic system, kidneys, and immune system reflect your emotional life with precision. When you carry too much, the body whispers first and then shouts. Water, rest, creative expression, and regular emotional clearing are your medicine.',
};

// Bazi element → health
const BAZI_HEALTH: Record<string, string> = {
  Wood:  'Liver and gall bladder are your elemental organs in Chinese medicine — they govern vision, planning, and the capacity to grow. Protect them through early sleep, spring cleanses, and releasing unprocessed anger.',
  Fire:  'Heart health is paramount. Regulate your cardiovascular system through joy — literally. Bazi Fire thrives when the heart is light. Avoid excessive stimulants and honour the need for a quieter evening rhythm.',
  Earth: 'Spleen and stomach are your foundation organs. Digestive health is the barometer of your overall wellbeing. Warm, simple, regular meals and a worry-free mind are your most powerful medicine.',
  Metal: 'The lungs and large intestine reflect your elemental nature. Deep breathing, letting go, and clear boundaries protect your health. Metal types often need to release grief stored in the body through movement and expression.',
  Water: 'Kidney and adrenal vitality are your core focus. Fear and depletion both tax the Water element. Prioritise deep rest, sexual health, and the preservation of your vital reserves rather than spending them freely.',
};

// Bazi element → love
const BAZI_LOVE: Record<string, string> = {
  Wood:  'You grow toward the light of love — patient, expansive, and deeply committed once you choose. You need a partner who gives you room to grow and inspires your vision. Stagnant relationships wither you.',
  Fire:  'Your love burns brilliantly — warming everyone around you and drawing them in irresistibly. You give generously but need reciprocal warmth. Without it, your flame dims. Choose someone who fans you back.',
  Earth: 'You love through service, stability, and enduring loyalty. You are the partner who shows up, decade after decade. You need someone who can receive your care without taking it for granted.',
  Metal: 'You love with precision and depth rather than excess and display. Your loyalty is absolute when given, but you choose slowly and forgive only what you genuinely process. You need a partner as honest as you are.',
  Water: 'Deep, flowing, and adaptable — your love finds the shape of whatever vessel holds it. But without strong self-knowledge, you can lose yourself in the process. You thrive with a partner who honours both your depth and your boundaries.',
};

// Life path → general soul mission
const LP_MISSION: Record<number, string> = {
  1: 'Your soul\'s central work in this lifetime is the development of authentic individuality and courageous self-expression. You did not come here to blend in — you came to lead, initiate, and demonstrate what it looks like to stand fully in your own light.',
  2: 'Cooperation, sensitivity, and the art of sacred relationship form the core of your soul\'s curriculum. You are here to master the alchemy of partnership — to teach the world that real strength is relational, and that gentleness is a form of power.',
  3: 'Creative expression in all its forms is the spine of your soul\'s purpose. You are here to bring beauty, joy, and authentic communication into the world. Your word, your art, and your laughter are literally medicine for collective suffering.',
  4: 'The sacred architecting of form — building systems, structures, and foundations that endure — is your soul\'s primary work. You are here to demonstrate that discipline and devotion to reality create miracles that inspiration alone never could.',
  5: 'Freedom, adaptability, and the experience of life in all its multidimensional richness define your soul\'s journey. You are here to show that change is not the enemy of stability but its most intelligent expression.',
  6: 'Service through love — the cultivation of beauty, family, and healing community — is the core of your soul\'s purpose. You are the natural guardian of what matters most: the relationships and spaces in which human beings grow.',
  7: 'The deep interior life — study, contemplation, mystery, and the search for truth — is your soul\'s most essential terrain. You are a seeker and a knower. Your purpose is to bring the light of genuine wisdom to whatever world you inhabit.',
  8: 'The right use of power — material, institutional, and personal — is the central curriculum of your incarnation. You are here to master the dance between abundance and stewardship, between authority and accountability.',
  9: 'The completion and integration of the human journey is expressed through you. You are here to serve the collective — to give, release, and universalise what has been learned. Your compassion, when earned and not performed, is one of the great gifts of the 9.',
  11: 'As a Master 11, you carry the voltage of the spiritual messenger. Your soul\'s work is to bridge the invisible and the visible — to translate higher wisdom into forms that illuminate ordinary life. This calling requires exceptional self-care and discernment.',
  22: 'As a Master 22, you are the Master Builder. Your soul has come to manifest something of enduring value in the physical world — systems, institutions, or movements that transform life for others at scale.',
  33: 'As a Master 33, you embody the archetype of the Master Teacher-Healer. Your purpose transcends personal ambition. You are here to serve the evolution of human consciousness through unconditional love expressed as skillful action.',
};

// Life path → love
const LP_LOVE: Record<number, string> = {
  1: 'You bring leadership into relationship — a quality that inspires when expressed with emotional warmth, and overwhelms when expressed as control. Your deepest love flourishes with a partner who is genuinely secure in their own individuality.',
  2: 'Partnership is not just your style — it is your spiritual path. The 2 Life Path experiences love as the highest form of purpose, and you give yourself completely when you feel genuinely safe. The challenge is learning to receive as generously as you give.',
  3: 'Joy and creative spark are the love languages you speak most fluently. You need a partner who can play with you, express with you, and keep life interesting. Depth arrives when you stop performing love and start living inside it.',
  4: 'You love through reliability, through showing up, through providing. What you may take longer to understand is that your partner also needs the version of you that is spontaneous, vulnerable, and openly affectionate. Let that self come out.',
  5: 'Freedom within commitment is your paradox to integrate. You are magnetic — and the partners you attract often want to keep you closer than you want to be kept. True intimacy for you lives not in possession but in chosen return.',
  6: 'You are the natural nurturer — deeply devoted and aesthetically generous. You create beauty in relationship and often sacrifice your own needs silently. Your greatest love lesson is learning that what you give to others, you must first give to yourself.',
  7: 'You love deeply in the interior while often presenting as emotionally contained. The right partner will understand that your silences are not absence — they are depth. You need someone who can wait at the threshold of your inner world without intruding.',
  8: 'Power and resource dynamics play a central role in your love story. You are generous when thriving and controlling when afraid. The love that frees you is with someone whose power you can genuinely respect — and who respects yours in return.',
  9: 'You love the world, which can make it harder to love one person completely. The 9 Life Path must learn that universal compassion and intimate devotion are not opposites. Your partner needs to know they are chosen, not simply included.',
  11: 'Intuitive connection is everything to you in love. You sense people\'s inner worlds with uncanny accuracy and need a partner whose interior depth matches your perception. The challenge: your sensitivity amplifies both joy and friction. Choose wisely.',
  22: 'Your love carries the gravitas of your mission. You are looking for a co-builder — someone who understands that the relationship itself is a structure, and that what you build together matters beyond the two of you.',
  33: 'Unconditional love is your aspiration in all things, including relationship. But first you must love yourself unconditionally. The 33 who hasn\'t completed this inner work gives until depleted. The one who has gives from bottomless generosity.',
};

// Life path → career
const LP_CAREER: Record<number, string> = {
  1: 'Entrepreneurship, independent leadership, and pioneering work are your career north stars. You are at your best when you have genuine autonomy and a vision that is truly your own. Working for someone else\'s dream without breathing room stifles you.',
  2: 'Diplomacy, collaboration, human resources, counselling, and any field that pairs people with the right outcomes are your native career terrain. You excel when you can use your extraordinary sensitivity as a professional asset.',
  3: 'Communication, the arts, education, public relations, coaching, and any field that rewards authentic self-expression and the ability to inspire are your career sweet spots. You do your best work when creative freedom is part of the job description.',
  4: 'Engineering, administration, finance, construction, project management, and anywhere that rewards precision, reliability, and long-term thinking are your career strengths. You build careers the way you build everything else — deliberately.',
  5: 'Sales, travel, journalism, media, public speaking, consulting, and any field with dynamic variety and the freedom to roam suit your energy. The 5 burns out in routine and thrives under intelligent chaos.',
  6: 'Medicine, design, social work, teaching, food, hospitality, counselling, and the healing arts are where your gifts are most at home. You are a natural at creating beauty and care in the world — and these vocations honour that.',
  7: 'Research, philosophy, psychology, academia, spirituality, technology, and any field in which depth of specialisation is rewarded suits your soul. You do your best work in conditions of quiet, autonomy, and intellectual rigour.',
  8: 'Business, law, finance, real estate, executive leadership, and any field in which material command and strategic intelligence are rewarded suit the 8 Life Path. You are here to experience — and master — abundance on a significant scale.',
  9: 'The humanitarian fields — nonprofit leadership, international work, the arts, medicine, education, and any vocation in which you give back to the many — align with your soul\'s purpose. The 9 career always has a service dimension.',
  11: 'Spiritual leadership, psychology, counselling, the arts, public speaking, writing, and any field in which you can carry a visionary message to a wide audience honour the 11. Your career must feel meaningful or it feels empty.',
  22: 'Architecture, institutional leadership, large-scale social enterprise, policy, and any career in which you can build something that outlasts you are the 22\'s territory. You need scale and significance, not just comfort.',
  33: 'Teaching, healing, spiritual work, arts, social change, and any field in which love expressed as service can transform lives honour the 33. Your career is your calling. The distinction between vocation and purpose dissolves for you.',
};

// Life path → past life themes
const LP_PAST: Record<number, string> = {
  1: 'Your soul carries lifetimes of following — years spent in service to others\' visions, in submission to collective will, or in identities that were assigned rather than chosen. The courage to lead, the willingness to be seen, the right to occupy your own singular space — these were earned across many incarnations.',
  2: 'Your past lives were likely filled with solitude: the hermit, the monk, the isolated scholar. You developed extraordinary interior wisdom but little of the skill of genuine partnership. This lifetime is the curriculum of relationship — of learning to need, to depend, and to be needed in return.',
  3: 'Your soul has known silence — lifetimes in which the expressive self was suppressed, censored, or punished. The joy and creative freedom you carry in this life is a hard-won inheritance. You are here, in part, to heal the collective memory of creative suppression.',
  4: 'Past lives of chaos, impermanence, and instability have shaped your soul\'s deep longing for order and foundation. You have known the devastation of what happens when structures fail. This life, you build them — not from fear but from earned wisdom about what endures.',
  5: 'Your soul knows restriction in its bones — lifetimes of rigid structure, enforced conformity, and claustrophobic limitation. The freedom you crave in this incarnation is the promised land your soul has been moving toward for many lifetimes.',
  6: 'Past lives of unconditional service — the devoted parent, the committed healer, the self-sacrificing caregiver — have left a beautiful and weighty inheritance. You know how to give. This life invites you to learn that receiving is equally sacred.',
  7: 'Your soul has lived many lives in the marketplace — in commerce, in community, in the noise of collective interaction. What your past selves lacked — and what this lifetime provides — is the solitude, the depth, and the permission to go inward and know.',
  8: 'Past lives of material poverty, powerlessness, or the opposite — abuses of power and authority — are the karmic material you are integrating in this lifetime. You are here to find the right relationship to power and resource: neither grasping nor rejecting them.',
  9: 'Your soul is ancient. Nine is the number of completion — of a full cycle of incarnational experience. You carry the residue of every kind of human experience. The compassion in you is not sentiment; it is the distilled understanding of having lived everything.',
  11: 'You have incarnated in powerful but largely invisible roles — the spiritual guide behind the scenes, the seer whose visions were not yet credible to the time. This lifetime calls you into visibility. The world is finally ready to hear what you carry.',
  22: 'Your soul has been the dreamer who could not yet build. Across past lives, your vision was there but the means, the timing, or the form were not. This iteration of your soul\'s journey is the convergence — the life in which the dreaming and the building finally merge.',
  33: 'Your soul has climbed every mountain of human experience across countless lifetimes. The 33 is the soul that has earned the right to teach not through authority but through embodied love. The past lives are less important than what you do with their accumulated learning now.',
};

// Nakshatra → past life connection
const NAKSH_PAST: Record<string, string> = {
  'Ashwini':    'warrior traditions and the healing arts of ancient cultures',
  'Bharani':    'rituals of death, rebirth, and the keeper of life-force mysteries',
  'Krittika':   'priesthood, sacred fire tending, and the purification of collective karma',
  'Rohini':     'artistic patronage, abundance cultivation, and the sacred feminine mysteries',
  'Mrigashira': 'seekers of sacred knowledge across many civilisations and traditions',
  'Ardra':      'storm clearing and the dissolution of form that no longer serves higher purpose',
  'Punarvasu':  'teachers, wanderers, and wisdom keepers between worlds',
  'Pushya':     'wise kings, benevolent priests, and the nourishing of communities through tumultuous eras',
  'Ashlesha':   'serpent wisdom, mystical arts, and the hidden healing traditions of antiquity',
  'Magha':      'ancestral royalty, lineage healing, and the honouring of what has gone before',
  'Purva Phalguni': 'pleasure and creative patronage in courts of high culture and artistic refinement',
  'Uttara Phalguni': 'sacred contracts, governance, and the establishment of civilised social order',
  'Hasta':      'the skilled artisan, the healer with hands, and the craftswoman of form',
  'Chitra':     'architects of sacred structures, artists, and makers of beauty in divine service',
  'Swati':      'merchants of wisdom, social diplomats, and the bridgers between worlds',
  'Vishakha':   'the one who waits for the harvest — the patient seeker and the focused warrior',
  'Anuradha':   'devoted friendships spanning lifetimes, cosmic alliances, and sacred loyalty',
  'Jyeshtha':   'the elder, the authority figure, and the one who carries the weight of collective responsibility',
  'Mula':       'the destructress who must destroy old roots to allow genuinely new growth',
  'Purva Ashadha': 'ancient seafarers, explorers, and those who sought truth in the world\'s far edges',
  'Uttara Ashadha': 'the invincible warrior-king serving a cause greater than personal glory',
  'Shravana':   'sacred listeners, scholars, and the preservers of oral wisdom traditions',
  'Dhanishtha': 'the musician of the spheres, the rhythm keeper, and the builder of collective wealth',
  'Shatabhisha': 'the healer of multitudes, the mystic physician, and the keeper of medicinal mysteries',
  'Purva Bhadrapada': 'those who burned through ego on the purification fires of extreme experience',
  'Uttara Bhadrapada': 'the cosmic serpent\'s wisdom keeper — ancient beyond reckoning, patient beyond measure',
  'Revati':     'the final steps of the soul\'s long journey — shepherd, guide, and the last lamp before the new cycle',
};

function getNakshatraPast(name: string): string {
  for (const key of Object.keys(NAKSH_PAST)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return NAKSH_PAST[key];
  }
  return 'ancient wisdom traditions across many civilisations';
}

// Bazi element → career
const BAZI_CAREER: Record<string, string> = {
  Wood:  'Innovation, growth strategy, environmental work, medicine, law, and any field calling for long-range vision suit your Wood Day Master energy. You plant seeds and tend them patiently — a quality that creates extraordinary outcomes when paired with the right vision.',
  Fire:  'Performance, public speaking, entrepreneurship, marketing, the arts, and spiritual leadership draw the Fire Day Master\'s energy into its full expression. Your presence alone is a resource — use it consciously.',
  Earth: 'Real estate, finance, agriculture, food, mediation, and the administrative arts are where Earth Day Masters thrive. You hold organisations together through the gravity of your reliability and your rare capacity for practical wisdom.',
  Metal: 'Law, surgery, military strategy, precision crafts, gemology, and any field demanding exactness, honesty, and cutting clarity suit Metal Day Masters. You cut away what is false and leave only what is real.',
  Water: 'Commerce, travel, diplomacy, psychology, creative arts, and any field requiring fluidity, adaptability, and deep sensitivity to human dynamics serve the Water Day Master\'s gifts. You flow around obstacles that stop others cold.',
};

export function generateDeepAnalysis(
  western: WesternReading,
  vedic: VedicReading,
  bazi: BaziReading,
  numerology: NumerologyReading,
): DeepAnalysis {
  const we = western.sunSign;
  const vi = vedic.rashi;
  const nk = vedic.nakshatra;
  const dm = bazi.dayMaster;
  const lp = numerology.lifePath;
  const lpNum = lp.number;

  /* ── GENERAL ── */
  const general = {
    overview: `You are a ${we.element} ${we.name} walking the path of Life Path ${lpNum} — ${lp.keywords.slice(0, 2).join(' and ')}. ${LP_MISSION[lpNum] ?? LP_MISSION[1]} Your sidereal moon falls in ${vi.name} — ${vi.traits.slice(0, 2).join(' and ')} — while your Bazi Day Master is ${dm.polarity} ${dm.element}, the ${dm.polarity === 'Yang' ? 'outwardly expressive' : 'inwardly refined'} face of that elemental force. Across every tradition consulted for this reading, one truth emerges: you are here to ${we.element === 'Fire' || dm.element === 'Fire' ? 'ignite and lead' : we.element === 'Earth' || dm.element === 'Earth' ? 'build and sustain' : we.element === 'Air' || dm.element === 'Wood' || dm.element === 'Metal' ? 'illumine and connect' : 'heal and perceive'}. Your ${nk.name} Nakshatra — ruled by ${nk.ruling} and guarded by ${nk.deity} — marks the precise frequency at which your soul operates in the subtle field.`,
    lenses: [
      { tradition: 'Western Astrology', icon: WE, accent: WA, insight: `As a ${we.name}, your solar essence radiates through the lens of ${we.element} — ${we.description.split('.')[0]}.` },
      { tradition: 'Vedic Astrology', icon: VE, accent: VA, insight: `Your sidereal ${vi.name} expresses through ${vi.element} — ${vi.traits.join(', ')}. The ${nk.name} Nakshatra deepens this with the qualities of ${nk.qualities.slice(0, 3).join(', ')}.` },
      { tradition: 'Bazi / Four Pillars', icon: BZ, accent: BA, insight: `Your ${dm.polarity} ${dm.element} Day Master governs your deepest nature. ${dm.description.split('.')[0]}.` },
      { tradition: 'Numerology', icon: NU, accent: NA, insight: `Life Path ${lpNum} carries the mission of ${lp.keywords.join(', ')}. ${lp.description.split('.')[0]}.` },
    ],
    themes: [
      `${we.name} solar energy filtered through ${lp.keywords[0] ?? 'purpose'}`,
      `${nk.name} Nakshatra soul frequency — ${nk.englishMeaning}`,
      `${dm.polarity} ${dm.element} Day Master depth and ${dm.polarity === 'Yang' ? 'outward drive' : 'inward precision'}`,
      `Life Path ${lpNum} destiny arc — ${lp.keywords.slice(-1)[0] ?? 'evolution'}`,
    ],
    guidance: `Live your chart consciously by embodying the strengths of each tradition and being honest about the shadows. Your ${we.element} nature wants to ${we.element === 'Fire' ? 'ignite' : we.element === 'Earth' ? 'ground' : we.element === 'Air' ? 'soar' : 'flow'}. Your ${dm.polarity} ${dm.element} Day Master wants to ${dm.polarity === 'Yang' ? 'express outwardly' : 'refine inwardly'}. The gift of a multi-system reading is the permission it gives you to hold all of yourself — not just the parts that fit comfortably.`,
  };

  /* ── LOVE ── */
  const love = {
    overview: `In love, you are ${WEST_LOVE[we.element] ?? 'multi-dimensional and layered'}. Your ${we.name} solar energy draws people in through its ${we.traits[0] ?? 'distinctive'} quality, and your ${vi.name} sidereal nature brings ${vi.traits[1] ?? 'depth'} to how you bond over time. ${LP_LOVE[lpNum] ?? LP_LOVE[1]} Your ${dm.polarity} ${dm.element} Bazi Day Master shapes your relational style at the most instinctive level. ${BAZI_LOVE[dm.element] ?? ''} The shadow to watch: ${WEST_LOVE_SHADOW[we.element] ?? 'the tendency to give love in the form you wish to receive it, rather than the form your partner actually needs'}.`,
    lenses: [
      { tradition: 'Western Astrology', icon: WE, accent: WA, insight: `${we.name}, ruled by ${we.rulingPlanet}, brings ${WEST_LOVE[we.element] ?? 'unique relational energy'} into its bonds. The relational shadow for ${we.element} energy: ${WEST_LOVE_SHADOW[we.element] ?? 'over-giving'}.` },
      { tradition: 'Vedic Astrology', icon: VE, accent: VA, insight: `Your ${nk.name} Nakshatra carries the relational imprint of ${nk.deity} — ${nk.qualities.includes('devotion') ? 'profound devotion and loyalty' : nk.qualities.includes('wisdom') ? 'wise, measured love that deepens with time' : 'a love that seeks meaning as much as feeling'}. The 7th house from your rashi shapes what you attract.` },
      { tradition: 'Bazi / Four Pillars', icon: BZ, accent: BA, insight: `${BAZI_LOVE[dm.element] ?? `Your ${dm.polarity} ${dm.element} Day Master loves through ${dm.traits[0] ?? 'its distinctive nature'}`} The Day Branch of your chart — ${bazi.dayPillar.branch.animal} — colours the intimate self that only close partners see.` },
      { tradition: 'Numerology', icon: NU, accent: NA, insight: `${LP_LOVE[lpNum] ?? 'Your Life Path shapes your deepest love patterns significantly.'} In a Personal Year ${numerology.personalYear}, relational themes carry particular weight and visibility right now.` },
    ],
    themes: [
      `Attraction pattern rooted in ${we.element} solar magnetism`,
      `Relational depth shaped by ${nk.name} Nakshatra karma`,
      `Intimacy style expressed through ${dm.polarity} ${dm.element} instinct`,
      `Love destiny arc aligned with Life Path ${lpNum}`,
    ],
    guidance: `The most powerful shift available to you in love right now is to close the gap between what you need and what you ask for. Your ${we.name} nature and ${lp.keywords[0] ?? 'path'} suggest that your greatest love is possible — but only when you are fully, vulnerably yourself inside it. Choose partners who are curious about your whole chart, not just the easy parts.`,
  };

  /* ── CAREER / FINANCE ── */
  const careerFinance = {
    overview: `Vocationally, you are designed for ${WEST_CAREER[we.element] ?? 'distinctive work that serves the world'}. ${LP_CAREER[lpNum] ?? LP_CAREER[1]} Your Bazi Day Master — ${dm.polarity} ${dm.element} — shapes how you work at the level of instinct and daily energy: ${BAZI_CAREER[dm.element] ?? `${dm.description.split('.')[0]}`}. Your ${nk.name} Nakshatra reflects a soul trajectory connected to ${getNakshatraPast(nk.name)}, which often translates into a vocational calling with depth, heritage, or transformative purpose.`,
    lenses: [
      { tradition: 'Western Astrology', icon: WE, accent: WA, insight: `${we.name}'s natural domain is ${WEST_CAREER[we.element] ?? 'meaningful, self-expressive work'}. ${we.rulingPlanet} as your ruling planet shapes the flavour of your ambition and your relationship to authority in professional settings.` },
      { tradition: 'Vedic Astrology', icon: VE, accent: VA, insight: `Your ${vi.name} rashi contributes ${vi.traits.slice(1, 3).join(' and ')} to your professional identity. The ${nk.name} Nakshatra, ruled by ${nk.ruling}, marks careers that are never purely about income — they carry a spiritual signature.` },
      { tradition: 'Bazi / Four Pillars', icon: BZ, accent: BA, insight: `${BAZI_CAREER[dm.element] ?? `Your ${dm.polarity} ${dm.element} Day Master defines a distinctive professional path.`} The Wealth element in Bazi is what controls your element — understanding this cycle reveals your most natural path to financial abundance.` },
      { tradition: 'Numerology', icon: NU, accent: NA, insight: `${LP_CAREER[lpNum] ?? 'Your Life Path points to a vocation with depth and soul-alignment.'} In Personal Year ${numerology.personalYear}, the numerological energy currently emphasises ${numerology.personalYear % 9 === 1 ? 'new beginnings and bold moves' : numerology.personalYear % 9 === 4 ? 'structure, foundations, and practical consolidation' : numerology.personalYear % 9 === 8 ? 'abundance, authority, and material achievement' : 'alignment and steady progress'} in your career arc.` },
    ],
    themes: [
      `Vocational element: ${WEST_CAREER[we.element]?.split(',')[0] ?? we.element + ' domain work'}`,
      `${nk.name} Nakshatra professional calling — service with soul`,
      `${dm.polarity} ${dm.element} Day Master work instinct and financial magnetism`,
      `Life Path ${lpNum} career north star`,
    ],
    guidance: `Your finances and career flourish most when they are anchored in genuine purpose rather than compensation alone. The ${dm.polarity} ${dm.element} Day Master accumulates wealth through ${dm.element === 'Water' ? 'adaptability and flow — savings and flexibility over rigid structures' : dm.element === 'Fire' ? 'visibility and boldness — your income follows your willingness to be seen' : dm.element === 'Earth' ? 'steady accumulation and patient investment — land, property, and tangible assets resonate with you' : dm.element === 'Wood' ? 'growth-oriented thinking — invest in futures, in learning, in expanding your range' : 'precision and selectivity — quality over quantity in every financial decision'}. Align the work with the soul and the wealth follows.`,
  };

  /* ── HEALTH ── */
  const health = {
    overview: `Your elemental profile creates a distinctive health signature. In Western terms, ${we.element} energy governs your vitality pattern: ${WEST_HEALTH[we.element] ?? 'honour your element and your system stays in balance'}. Your Bazi Day Master adds another layer: ${BAZI_HEALTH[dm.element] ?? `the ${dm.element} element in Chinese medicine maps to specific organ systems and seasonal rhythms that reflect your baseline constitution.`} The ${nk.name} Nakshatra — symbol of ${nk.symbol} — carries a psycho-spiritual health dimension: the quality of your inner life directly influences your body\'s coherence and resilience.`,
    lenses: [
      { tradition: 'Western Astrology', icon: WE, accent: WA, insight: `${WEST_HEALTH[we.element] ?? `As a ${we.element} sign, your body responds to your elemental balance.`}` },
      { tradition: 'Vedic Astrology', icon: VE, accent: VA, insight: `In Ayurveda, ${vi.element} corresponds to specific constitutional tendencies. The ${nk.name} Nakshatra — ruled by ${nk.ruling} — points to ${nk.ruling === 'Moon' ? 'the mind-body link as your primary health lever: emotional regulation is foundational to physical wellbeing' : nk.ruling === 'Sun' ? 'vitality and heart health as your primary focus — your energy levels mirror your alignment with purpose' : nk.ruling === 'Mars' ? 'inflammation, heat, and the importance of channelling your drive into movement rather than tension' : nk.ruling === 'Saturn' ? 'the skeletal system, longevity practices, and the wisdom of pacing rather than burning out' : 'the nervous system and the quality of your spiritual connection as primary health modulators'}.` },
      { tradition: 'Bazi / Four Pillars', icon: BZ, accent: BA, insight: `${BAZI_HEALTH[dm.element] ?? `Your ${dm.element} Day Master maps to specific organ systems in Chinese medicine that repay conscious attention.`} Your birth season (${bazi.monthPillar.branch.animal} month) reflects the elemental conditions at your physical entry — the strength or vulnerability of your natal energy blueprint.` },
      { tradition: 'Numerology', icon: NU, accent: NA, insight: `Life Path ${lpNum} carries ${lp.number % 2 === 0 ? 'yin, receptive energy — your health restores through receiving, resting, and nourishing' : 'yang, expressive energy — your health restores through movement, creation, and purposeful output'}. In a Personal Year ${numerology.personalYear}, pay particular attention to ${numerology.personalYear % 9 === 4 || numerology.personalYear % 9 === 6 ? 'the body\'s foundational needs: sleep, nutrition, and consistent physical care' : 'how your emotional landscape is showing up in the body right now'}.` },
    ],
    themes: [
      `${we.element} elemental health pattern — honour your medicine`,
      `${dm.element} organ system map in Chinese medicine`,
      `${nk.name} Nakshatra psycho-spiritual health signature`,
      `Life Path ${lpNum} vitality rhythm — yin or yang restoration`,
    ],
    guidance: `Your health is not a separate concern from your purpose — it is the vehicle through which that purpose moves. The most profound health practice for your chart is ${we.element === 'Fire' ? 'learning to rest completely and without guilt — your body is a high-performance engine that requires real recovery' : we.element === 'Earth' ? 'moving your body consistently and eating in rhythm with the seasons — predictability and routine are your health medicine' : we.element === 'Air' ? 'grounding your nervous system through breath, body, and digital boundaries — your mind needs landing zones' : 'clearing emotional weight regularly through expression, water, and spacious solitude — your body speaks your inner world fluently'}. Begin with whatever on that list you have been avoiding longest.`,
  };

  /* ── PAST LIFE ── */
  const pastLife = {
    overview: `The karmic signature of your chart points to a rich soul history rooted in ${getNakshatraPast(nk.name)}. Your ${nk.name} Nakshatra — presided over by ${nk.deity} — carries a specific ancestral transmission: the qualities of ${nk.qualities.slice(0, 3).join(', ')} were forged through repeated encounter across multiple lifetimes before they became natural gifts. The ${dm.polarity} ${dm.element} Day Master speaks to karmic patterns that repeat in the physical world — in your relationship to ${dm.element === 'Wood' ? 'growth, authority, and the use of power to protecting or expand life' : dm.element === 'Fire' ? 'visibility, self-expression, and the risks of brilliance in times that didn\'t always reward it' : dm.element === 'Earth' ? 'security, resource, and the sacred work of holding things together for others' : dm.element === 'Metal' ? 'justice, purity, and the cutting away of what is false — even when it is beloved' : 'depth, flow, and the wisdom that comes only from having traversed the darkest emotional terrain'}. ${LP_PAST[lpNum] ?? LP_PAST[1]}`,
    lenses: [
      { tradition: 'Western Astrology', icon: WE, accent: WA, insight: `${we.name}\'s soul history often includes ${we.element === 'Fire' ? 'lives of leadership, sometimes glory, sometimes martyrdom — souls who stepped forward when the moment demanded' : we.element === 'Earth' ? 'lives of patient stewardship — the farmer, the builder, the one who held the land while others moved through it' : we.element === 'Air' ? 'lives of ideas, messages, and the transmission of knowledge across cultures and generations' : 'lives of deep psychic sensitivity — the healer, the seer, the one who held space for collective grief'}. ${we.rulingPlanet}\'s position in your past life story suggests soul contracts still completing through this incarnation.` },
      { tradition: 'Vedic Astrology', icon: VE, accent: VA, insight: `The ${nk.name} Nakshatra is one of the most reliable past-life indicators in the Vedic system. Its connection to ${nk.deity} marks a consistent soul theme: ${getNakshatraPast(nk.name)}. The ${nk.englishMeaning} — ${nk.name}\'s English meaning — reveals what your soul has been practising across many lifetimes. Pada ${nk.pada} places you in the ${['dharmic', 'artha-seeking', 'relationship-focused', 'moksha-oriented'][nk.pada - 1] ?? 'dharmic'} quarter of this Nakshatra\'s expression.` },
      { tradition: 'Bazi / Four Pillars', icon: BZ, accent: BA, insight: `In Bazi, the Year Pillar (${bazi.yearPillar.stem.chinese}${bazi.yearPillar.branch.chinese} — ${bazi.yearPillar.branch.animal} Year) carries the ancestral and karmic inheritance. Your birth year\'s energy predisposed you to certain patterns from the very beginning of this incarnation. The ${dm.polarity} ${dm.element} Day Master represents what your soul is actively refining — the clay still being shaped rather than the finished vessel.` },
      { tradition: 'Numerology', icon: NU, accent: NA, insight: `${LP_PAST[lpNum] ?? 'The Life Path number carries powerful past-life resonance.'} In numerology, Life Path ${lpNum} suggests a soul that has earned this particular curriculum through prior lifetimes of ${lpNum <= 3 ? 'developing the self and creative expression' : lpNum <= 6 ? 'building, serving, and relating' : 'seeking wisdom, mastering power, and preparing for universal service'}. The challenges you face feel familiar because, at the soul level, they are.` },
    ],
    themes: [
      `${nk.name} Nakshatra ancestral transmission — ${nk.englishMeaning}`,
      `${dm.polarity} ${dm.element} karmic refinement in progress`,
      `${we.name} solar karmic imprint — ${we.element} soul history`,
      `Life Path ${lpNum} — soul stage and accumulated wisdom`,
    ],
    guidance: `The past life read is not a burden — it is a map of your soul\'s accumulated intelligence. The ${nk.name} Nakshatra gifts you have brought forward — ${nk.qualities.slice(0, 2).join(' and ')} — are already yours. The work is to trust them, to stop second-guessing the knowing that arrives without explanation. Your ${we.element} nature, your ${dm.polarity} ${dm.element} instinct, and your Life Path ${lpNum} arc are not random — they are the precise set of tools your soul selected for this incarnation\'s curriculum. Use them without apology.`,
  };

  return { general, love, careerFinance, health, pastLife };
}
