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

type SubtypeKey = 'vanguard' | 'steward' | 'weaver' | 'seer';

const SUBTYPE_PROFILES: Record<SubtypeKey, { label: string; symbol: string; essenceTone: string; gift: string }> = {
  vanguard: {
    label: 'Vanguard',
    symbol: '↑',
    essenceTone: 'expressed through decisive movement, initiation, and visible leadership',
    gift: 'You move first with conviction and make momentum contagious.',
  },
  steward: {
    label: 'Steward',
    symbol: '□',
    essenceTone: 'expressed through consistency, containment, and long-cycle mastery',
    gift: 'You stabilize complexity and turn vision into durable outcomes.',
  },
  weaver: {
    label: 'Weaver',
    symbol: '≈',
    essenceTone: 'expressed through adaptation, synthesis, and contextual intelligence',
    gift: 'You connect worlds and translate tension into workable patterns.',
  },
  seer: {
    label: 'Seer',
    symbol: '◌',
    essenceTone: 'expressed through pattern-recognition, timing sensitivity, and reflective depth',
    gift: 'You sense unseen currents early and act with unusual timing precision.',
  },
};

const OPPOSING_ELEMENT_PAIRS = new Set([
  'Fire-Water',
  'Water-Fire',
  'Air-Earth',
  'Earth-Air',
]);

function pairLabel(system: string, element: string): string {
  return `${system}: ${element}`;
}

function scoreAlignment(systemElements: Array<{ system: string; element: string }>, dominantCount: number, uniqueCount: number) {
  let agreements = 0;
  let conflicts = 0;
  const agreementNotes: string[] = [];
  const conflictNotes: string[] = [];

  for (let i = 0; i < systemElements.length; i++) {
    for (let j = i + 1; j < systemElements.length; j++) {
      const left = systemElements[i];
      const right = systemElements[j];
      if (left.element === right.element) {
        agreements += 1;
        agreementNotes.push(`${pairLabel(left.system, left.element)} aligns with ${pairLabel(right.system, right.element)}.`);
      } else if (OPPOSING_ELEMENT_PAIRS.has(`${left.element}-${right.element}`)) {
        conflicts += 1;
        conflictNotes.push(`${pairLabel(left.system, left.element)} clashes with ${pairLabel(right.system, right.element)}.`);
      }
    }
  }

  const agreementScore = Math.max(0, Math.min(100,
    Math.round(((agreements / 6) * 70) + ((dominantCount / 4) * 30)),
  ));
  const conflictScore = Math.max(0, Math.min(100,
    Math.round(((conflicts / 6) * 75) + (uniqueCount === 4 ? 25 : uniqueCount === 3 ? 12 : 0)),
  ));

  return { agreements, conflicts, agreementNotes, conflictNotes, agreementScore, conflictScore };
}

function selectSubtype(
  western: WesternReading,
  bazi: BaziReading,
  numerology: NumerologyReading,
  agreementScore: number,
  conflictScore: number,
): SubtypeKey {
  const modality = western.sunSign.modality?.toLowerCase() ?? '';
  const polarity = bazi.dayMaster.polarity;
  const lp = numerology.lifePath.number;

  if (agreementScore >= 72 && (polarity === 'Yang' || modality === 'cardinal')) return 'vanguard';
  if (agreementScore >= 68 && (modality === 'fixed' || [4, 8, 22].includes(lp))) return 'steward';
  if (conflictScore >= 55 || modality === 'mutable' || [5, 14].includes(lp)) return 'weaver';
  return 'seer';
}

function buildContradictions(
  elements: Record<string, number>,
  subtype: SubtypeKey,
  bazi: BaziReading,
  numerology: NumerologyReading,
): Array<{ title: string; narrative: string; guidance: string }> {
  const contradictions: Array<{ title: string; narrative: string; guidance: string }> = [];
  const has = (el: string) => (elements[el] ?? 0) > 0;

  if (has('Fire') && has('Water')) {
    contradictions.push({
      title: 'Urgency vs. Sensitivity',
      narrative: 'Your profile carries simultaneous pressure to act fast and to process deeply. This creates periods where your outer pace outruns your emotional integration.',
      guidance: 'Sequence decisions in two passes: immediate direction now, emotional calibration 24 hours later.',
    });
  }

  if (has('Air') && has('Earth')) {
    contradictions.push({
      title: 'Freedom vs. Structure',
      narrative: 'One part of you seeks open possibility and experimentation while another part requires clear systems, proof, and order.',
      guidance: 'Use bounded creativity: open ideation windows followed by non-negotiable execution blocks.',
    });
  }

  if (bazi.dayMaster.polarity === 'Yang' && has('Water')) {
    contradictions.push({
      title: 'Strong Signal, Soft Core',
      narrative: 'You can project certainty while internally registering subtle emotional data that others miss. People may misread this as inconsistency.',
      guidance: 'State your processing cadence up front so collaborators understand your rhythm.',
    });
  }

  if (numerology.lifePath.isMaster && subtype !== 'steward') {
    contradictions.push({
      title: 'Calling vs. Capacity',
      narrative: 'Master-number pressure can make every choice feel spiritually significant, which can overload practical bandwidth.',
      guidance: 'Anchor your higher calling to one measurable weekly commitment.',
    });
  }

  if (!contradictions.length) {
    contradictions.push({
      title: 'Depth vs. Simplicity',
      narrative: 'Your systems are relatively aligned, but your challenge is not overcomplication. You still need clear priorities to avoid dilution.',
      guidance: 'Keep one primary objective per domain and prune anything that does not serve it.',
    });
  }

  return contradictions.slice(0, 3);
}

function buildDomainVariants(
  baseName: string,
  subtypeLabel: string,
  dominant: string,
  secondary: string,
): Array<{ domain: 'love' | 'career' | 'spirituality' | 'healing'; archetype: string; narrative: string; focus: string[] }> {
  return [
    {
      domain: 'love',
      archetype: `${baseName} in Love (${subtypeLabel})`,
      narrative: `In relationships, your ${dominant.toLowerCase()} core seeks emotional truth while your ${secondary.toLowerCase()} layer determines how quickly trust is earned.`,
      focus: ['Attachment pacing', 'Repair after conflict', 'Emotional transparency'],
    },
    {
      domain: 'career',
      archetype: `${baseName} at Work (${subtypeLabel})`,
      narrative: `Professionally, this pattern excels when strategy and execution are linked. Your strongest output appears where ownership is clear and standards are explicit.`,
      focus: ['Decision rights', 'Execution cadence', 'Leadership footprint'],
    },
    {
      domain: 'spirituality',
      archetype: `${baseName} on the Path (${subtypeLabel})`,
      narrative: `Spiritually, your chart develops through disciplined reflection plus embodied practice. Insight deepens when lived, not only contemplated.`,
      focus: ['Daily ritual', 'Meaning integration', 'Inner alignment'],
    },
    {
      domain: 'healing',
      archetype: `${baseName} in Healing (${subtypeLabel})`,
      narrative: `Your recovery arc responds best to methods that integrate nervous-system regulation with narrative reframing and concrete habit change.`,
      focus: ['Regulation first', 'Story revision', 'Sustainable habits'],
    },
  ];
}

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

  const systemElements = [
    { system: 'Western', element: westernEl },
    { system: 'Vedic', element: vedicEl },
    { system: 'Bazi', element: baziEl },
    { system: 'Numerology', element: numEl },
  ];

  const dominantCount = sorted[0]?.[1] ?? 1;
  const uniqueCount = sorted.length;
  const alignment = scoreAlignment(systemElements, dominantCount, uniqueCount);
  const subtype = selectSubtype(western, bazi, numerology, alignment.agreementScore, alignment.conflictScore);
  const subtypeProfile = SUBTYPE_PROFILES[subtype];

  const archetypeKey = getArchetypeKey(dominant, secondary);
  const baseArchetype = ARCHETYPES[archetypeKey] ?? ARCHETYPES['Fire-Fire'];
  const archetypeId = `${archetypeKey}-${subtype}`;
  const contradictions = buildContradictions(counts, subtype, bazi, numerology);
  const domainVariants = buildDomainVariants(baseArchetype.name, subtypeProfile.label, dominant, secondary);
  const alignmentSynthesis = alignment.conflicts > alignment.agreements
    ? 'Your systems are tension-rich: growth comes from integrating opposing drives instead of forcing one dominant identity.'
    : 'Your systems show meaningful coherence: when you commit, momentum compounds quickly across life domains.';

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
    archetypeId,
    archetype: `${baseArchetype.name} — ${subtypeProfile.label}`,
    archetypeSymbol: `${baseArchetype.symbol}${subtypeProfile.symbol}`,
    archetypeBase: baseArchetype.name,
    subtype: subtypeProfile.label,
    dominantElement: dominant,
    secondaryElement: secondary,
    agreementScore: alignment.agreementScore,
    conflictScore: alignment.conflictScore,
    systemElements: {
      western: westernEl,
      vedic: vedicEl,
      bazi: baziEl,
      numerology: numEl,
    },
    elementDistribution: sorted.map(([element, count]) => ({
      element,
      count,
      percentage: Math.round((count / 4) * 100),
    })),
    alignmentNotes: {
      agreements: alignment.agreementNotes.slice(0, 4),
      conflicts: alignment.conflictNotes.slice(0, 4),
      synthesis: alignmentSynthesis,
    },
    contradictions,
    domainVariants,
    essence: `${baseArchetype.essence} In this chart, it is ${subtypeProfile.essenceTone}.`,
    superpower: `${baseArchetype.superpower} ${subtypeProfile.gift}`,
    coreStrengths,
    growthAreas,
  };
}
