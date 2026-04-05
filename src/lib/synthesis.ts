import type { Synthesis, WesternReading, VedicReading, BaziReading, NumerologyReading } from '@/types';

// Map each system's element to a canonical Western element
function baziElementToWestern(element: string): string {
  const map: Record<string, string> = {
    Wood: 'Air',
    Fire: 'Fire',
    Earth: 'Earth',
    Metal: 'Air',
    Water: 'Water',
  };
  return map[element] ?? element;
}

function vedicElementToWestern(element: string): string {
  // Vedic elements roughly map: Agni=Fire, Prithvi=Earth, Vayu=Air, Jala=Water
  const map: Record<string, string> = {
    Fire: 'Fire',
    Earth: 'Earth',
    Air: 'Air',
    Water: 'Water',
  };
  return map[element] ?? element;
}

function numerologyElementFromLP(lp: number): string {
  const map: Record<number, string> = {
    1: 'Fire', 2: 'Water', 3: 'Air', 4: 'Earth', 5: 'Air',
    6: 'Earth', 7: 'Air', 8: 'Earth', 9: 'Fire',
    11: 'Air', 22: 'Earth', 33: 'Fire',
  };
  return map[lp] ?? 'Fire';
}

const ARCHETYPES: Record<string, { name: string; symbol: string; essence: string; superpower: string }> = {
  'Fire-Fire': {
    name: 'The Luminary', symbol: '☀',
    essence: 'You burn with a multidimensional fire — a soul born to ignite, inspire, and blaze a trail that others will follow for generations. Across Western, Vedic, and Chinese traditions, the element of fire dominates your chart, marking you as a being of extraordinary generative power. You do not merely participate in life; you catalyze it.',
    superpower: 'Your superpower is the ability to see possibility where others see only limitation, and to inspire that same vision in others through the sheer force of your authentic presence and enthusiasm.',
  },
  'Fire-Earth': {
    name: 'The Alchemist', symbol: '⚗',
    essence: 'Your chart weaves fire and earth into the ancient formula of the alchemist — the one who transforms raw potential into enduring gold. You inhabit the sacred tension between inspiration and manifestation, between the visionary spark and the patient work of bringing it into form. This combination is rare and profoundly powerful.',
    superpower: 'Your superpower is the ability to hold a vision long enough and discipline yourself deeply enough to actually build something that lasts. You dream in fire and build in stone.',
  },
  'Fire-Air': {
    name: 'The Visionary', symbol: '✦',
    essence: 'Fire and Air conspire in your chart to create a mind of extraordinary creative and intellectual power. You move at the speed of thought, and your thoughts carry the heat of genuine passion. You are designed to generate ideas that illuminate the path forward — for yourself, your communities, and your era.',
    superpower: 'Your superpower is the marriage of imagination and intelligence — the ability to see what could be and articulate it with a precision and passion that makes others believe it is possible too.',
  },
  'Fire-Water': {
    name: 'The Mystic Warrior', symbol: '◈',
    essence: 'The meeting of fire and water in your chart is the crucible of steam power — the paradox of opposites that generates tremendous creative and transformative energy. You live in the tension between action and feeling, between the warrior\'s courage and the mystic\'s depth. This tension is not a contradiction — it is your greatest gift.',
    superpower: 'Your superpower is emotional courage — the ability to feel everything fully and still act with decisive clarity. Where others are paralyzed by depth or blinded by urgency, you inhabit both simultaneously.',
  },
  'Earth-Fire': {
    name: 'The Builder', symbol: '◻',
    essence: 'Earth grounds your chart as the primary element, with fire as your animating force. You are a builder in the deepest sense — someone who takes the long view, lays foundations with care, and understands that legacy is built one day of disciplined work at a time. Your roots run deep, and that is what allows you to grow tall.',
    superpower: 'Your superpower is the capacity for sustained, purposeful effort — the ability to keep building when others have stopped, and to create structures of lasting value that outlive any single season of inspiration.',
  },
  'Earth-Earth': {
    name: 'The Sage Builder', symbol: '⬡',
    essence: 'Your chart is saturated with earth energy across multiple traditions — a rare concentration of the grounding, manifesting, and stabilizing principle. You are here to be a foundation: for your family, your community, and perhaps for civilization itself. The world needs your steadiness more than it knows.',
    superpower: 'Your superpower is the ability to create security — tangible, lasting, and genuinely sustaining — for the systems and people you commit to. You build from wisdom, not just effort.',
  },
  'Earth-Air': {
    name: 'The Architect', symbol: '⬗',
    essence: 'Earth and Air combine in your chart to produce the natural architect — the one who can conceive structures of great complexity and beauty, and then actually build them. You think in systems and then labor to implement them. Your gift is making the abstract concrete and the theoretical practical.',
    superpower: 'Your superpower is systems intelligence — the ability to see how the parts relate to the whole across any domain, and to design interventions that create structural change.',
  },
  'Earth-Water': {
    name: 'The Healer', symbol: '☿',
    essence: 'Earth and Water flow together in your chart — the conditions for deep healing, nourishment, and the cultivation of fertile ground. You carry the gifts of both the therapist and the gardener: you know how to tend to what is growing and how to create the conditions in which healing can occur naturally.',
    superpower: 'Your superpower is the rare combination of emotional intelligence and practical wisdom — you understand what people need at a level below words and can provide it through skillful, grounded action.',
  },
  'Air-Fire': {
    name: 'The Catalyst', symbol: '⚡',
    essence: 'Air and Fire create the dynamics of a great catalytic force in your chart — the wind that fans the flame of transformation. You move through the world as a force of inspiration and intellectual vitality, sparking new thought and igniting possibility wherever the conditions are right.',
    superpower: 'Your superpower is the ability to change the atmosphere of a conversation, a room, or a culture through the quality of your ideas and the infectious energy with which you communicate them.',
  },
  'Air-Earth': {
    name: 'The Strategist', symbol: '★',
    essence: 'Air and Earth combine in your chart to produce a mind that is simultaneously expansive and grounded — the rare strategist who can see the long game and also understand the moves required to play it. You think beautifully and build wisely. These are not common gifts; in combination, they are extraordinary.',
    superpower: 'Your superpower is strategic foresight — the ability to perceive the shape of the future and then take the methodical, pragmatic steps required to meet it on your own terms.',
  },
  'Air-Air': {
    name: 'The Philosopher', symbol: '∞',
    essence: 'Air moves through your chart like the breath of being itself — carried in multiple traditions, pointing to a soul designed for thought, communication, and the distillation of wisdom. You are a natural philosopher, a maker of connections, and a messenger who finds the words for what others are only beginning to feel.',
    superpower: 'Your superpower is language in its highest form — the ability to articulate what is invisible, to name patterns that liberate people from confusion, and to make complexity feel simple and beautiful.',
  },
  'Air-Water': {
    name: 'The Empath', symbol: '◇',
    essence: 'Air and Water collaborate in your chart to produce exceptional emotional and intellectual depth. You feel what others think and understand what others feel — the porous boundary between sensation and idea makes you a rare translator of the human interior. Your gift is understanding.',
    superpower: 'Your superpower is empathic intelligence — the ability to enter the felt sense of another\'s reality so completely that you can advocate for them, create for them, or heal them with a precision no purely intellectual or purely emotional approach could match.',
  },
  'Water-Fire': {
    name: 'The Transformer', symbol: '⟳',
    essence: 'Water and Fire meet in your chart in the primordial dance of creation and dissolution. You are a transformer — someone whose deepest nature is not fixed but fluid, whose power comes from the capacity to be completely remade by experience while retaining the essential heat of your creative core. You are forged in paradox.',
    superpower: 'Your superpower is the ability to transform — yourself, situations, and the stuck places in others — through the combination of deep emotional attunement and fiercely directed creative will.',
  },
  'Water-Earth': {
    name: 'The Keeper', symbol: '⊕',
    essence: 'Water and Earth converge in your chart to create the qualities of the deep keeper — someone who holds space, preserves what is sacred, and nourishes the roots of growth in their communities. You understand that not all power is visible and that some of the most essential work happens quietly, below the surface.',
    superpower: 'Your superpower is the ability to hold — to hold space, to hold complexity without collapsing it, to hold what is fragile long enough for it to become strong. This is a rarer and more powerful gift than it appears.',
  },
  'Water-Air': {
    name: 'The Intuitive', symbol: '◯',
    essence: 'Water and Air dance through your chart in the pattern of the great intuitive — the one who thinks in feeling and feels through thought, where the boundary between perception and understanding is permanently dissolved. You receive information through channels that bypass ordinary cognition.',
    superpower: 'Your superpower is pure intuition in its highest form — the ability to know what you cannot rationally know, and the courage to act on that knowing in ways that consistently prove to be correct.',
  },
  'Water-Water': {
    name: 'The Oracle', symbol: '◉',
    essence: 'Water flows through your chart in wave after wave across multiple traditions — the ocean of consciousness expressing itself through a single soul. You are among the most psychically receptive natures, carrying an extraordinary sensitivity to the subtle currents of the collective psyche. You feel what is coming before it arrives.',
    superpower: 'Your superpower is prophetic sensitivity — the ability to sense the undercurrents of collective change before they become visible, and to serve as a clear channel for the wisdom that humanity needs before it knows it needs it.',
  },
};

function getArchetypeKey(dominant: string, secondary: string): string {
  const key = `${dominant}-${secondary}`;
  return key in ARCHETYPES ? key : `${dominant}-${dominant}`;
}

export function generateSynthesis(
  western: WesternReading,
  vedic: VedicReading,
  bazi: BaziReading,
  numerology: NumerologyReading
): Synthesis {
  const westernEl = western.sunSign.element;
  const vedicEl = vedicElementToWestern(vedic.rashi.element);
  const baziEl = baziElementToWestern(bazi.dayMaster.element);
  const numEl = numerologyElementFromLP(numerology.lifePath.number);

  const counts: Record<string, number> = {};
  [westernEl, vedicEl, baziEl, numEl].forEach(el => {
    counts[el] = (counts[el] ?? 0) + 1;
  });

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const dominant = sorted[0]?.[0] ?? 'Fire';
  const secondary = sorted[1]?.[0] ?? dominant;

  const archetypeKey = getArchetypeKey(dominant, secondary);
  const archetype = ARCHETYPES[archetypeKey] ?? ARCHETYPES['Fire-Fire'];

  const coreStrengths = [
    ...western.sunSign.traits.slice(0, 2),
    ...vedic.rashi.traits.slice(0, 2),
    bazi.dayMaster.traits[0],
    numerology.lifePath.traits[0],
  ].filter(Boolean).slice(0, 6) as string[];

  const growthAreas = [
    numerology.lifePath.challenge.split('.')[0] + '.',
    `Integrating the ${bazi.dayMaster.polarity} ${bazi.dayMaster.element} nature of your Day Master more fully into daily expression.`,
    `Honoring the ${vedic.nakshatra.name} nakshatra\'s call toward ${vedic.nakshatra.qualities[vedic.nakshatra.qualities.length - 1].toLowerCase()} awareness.`,
  ];

  return {
    archetype: archetype.name,
    archetypeSymbol: archetype.symbol,
    dominantElement: dominant,
    essence: archetype.essence,
    superpower: archetype.superpower,
    coreStrengths,
    growthAreas,
  };
}
