import type { PeriodInsight } from '@/types';

const PERIOD_THEMES: Record<number, {
  theme: string;
  daily: { guidance: string; opportunities: string[]; watchFor: string; affirmation: string };
  weekly: { guidance: string; opportunities: string[]; watchFor: string };
  monthly: { guidance: string; opportunities: string[]; watchFor: string };
}> = {
  1: {
    theme: 'New Beginnings & Self-Initiation',
    daily: {
      guidance: 'Today pulses with the energy of the pioneer. The universe is seeding fresh beginnings in the soil of your daily life. Act on your most inspired impulse — this is not the time for committee decisions. Trust your instinct and take one decisive step forward in a direction that is entirely your own.',
      opportunities: ['Starting a project you have been putting off', 'Asserting your perspective with confidence', 'Making an independent choice without seeking approval'],
      watchFor: 'Impatience and the tendency to force outcomes rather than initiating cleanly and allowing momentum to build naturally.',
      affirmation: 'I trust my own knowing. I begin boldly, and the universe meets my courage with support.',
    },
    weekly: {
      guidance: 'This week carries the charge of personal initiation. Something in your life is ready to begin — either you are beginning it now, or the universe will arrange circumstances to push you forward. Claim your right to be first, to be original, to stand out.',
      opportunities: ['Asserting leadership in your domain', 'Beginning new ventures', 'Clarifying your personal direction'],
      watchFor: 'Isolation that mistakes independence for connection\'s absence. You still need community, even as you lead.',
    },
    monthly: {
      guidance: 'This is a potent month for fresh starts. The energy of the 1 monthly cycle initiates a new nine-month arc in your life. Plant your seeds with intention — what you begin here will unfold for the next nine months. Be bold. Be specific about what you want.',
      opportunities: ['New business ventures', 'Personal rebranding or reinvention', 'Moving into new territory in any domain of life'],
      watchFor: 'The temptation to remain at the threshold rather than crossing it. The month of 1 rewards those who begin.',
    },
  },
  2: {
    theme: 'Partnership, Patience & Receptivity',
    daily: {
      guidance: 'Today invites you into the quiet power of receptivity and collaboration. Progress today comes not through forceful action but through active listening, attunement, and the willingness to work in partnership. Notice what arrives when you stop pushing and allow.',
      opportunities: ['Deepening a significant relationship', 'Listening more carefully than you speak', 'Finding the middle path in a situation that has felt polarized'],
      watchFor: 'Over-sensitivity or the tendency to lose yourself in another\'s emotional field. Your needs matter as much as theirs.',
      affirmation: 'I am the stillness in the center of relationship. I give and receive with equal grace.',
    },
    weekly: {
      guidance: 'Cooperation and diplomacy are the keys to this week. Your ability to bridge differences, see both sides, and facilitate harmony will be your most valuable resource. A relationship — personal or professional — deserves your full, undivided attention.',
      opportunities: ['Resolving a long-standing difference', 'Strengthening a partnership through vulnerable honesty', 'Collaborative creative work'],
      watchFor: 'Becoming so focused on maintaining peace that you suppress truths that need to be spoken.',
    },
    monthly: {
      guidance: 'This month unfolds through partnership and the sacred art of patience. Something is growing that cannot be rushed. Your relationships — personal, professional, and spiritual — hold the key to this month\'s most important revelations. Tend them with care.',
      opportunities: ['Committing more deeply to a significant relationship', 'Collaborative projects that build on each person\'s strengths', 'Inner work around self-worth and receptivity'],
      watchFor: 'Allowing the needs and energies of others to eclipse your own center. Relationship does not require self-loss.',
    },
  },
  3: {
    theme: 'Creativity, Expression & Joy',
    daily: {
      guidance: 'Today is alive with creative energy. Your joy is the most spiritual thing you can offer the world in this moment. Express yourself — through conversation, art, movement, or any form that lets what is inside come outside. Do not censor the spark.',
      opportunities: ['Creative expression in any medium', 'Lightening a heavy situation with humor or beauty', 'Saying the inspired thing you have been holding back'],
      watchFor: 'Scattering your energy across too many channels, leaving nothing completed and nothing deeply nourishing.',
      affirmation: 'My expression is my gift to the world. I speak, create, and play from the overflow of a joyful heart.',
    },
    weekly: {
      guidance: 'The joy frequency is high this week. Your creative gifts are the vehicle through which something meaningful wants to move. Let yourself play. Let yourself be seen. The work that emerges from this week\'s energy can be some of your most authentic.',
      opportunities: ['Artistic creation or performance', 'Social connection and celebration', 'Writing, speaking, or teaching from personal experience'],
      watchFor: 'The seduction of surface pleasures at the expense of the deeper creative work that is longing for your attention.',
    },
    monthly: {
      guidance: 'This is a month to let yourself be creatively alive. After the patience of the 2 month, the 3 invites you to breathe out — to express, to connect, to fill your life with the evidence of your imagination. Beauty is not a luxury this month; it is the medicine.',
      opportunities: ['Launching creative projects', 'Growing your social and professional network', 'Rekindling a passion that has been dormant'],
      watchFor: 'Allowing the lightness of this month to become an escape from necessary depth. Joy is the destination, not the avoidance.',
    },
  },
  4: {
    theme: 'Foundation, Work & Integrity',
    daily: {
      guidance: 'Today calls you into the sacred discipline of building. The work that gets done in a 4-day is not glamorous, but it is foundational — and what you lay down now will support everything that comes after. Honor your commitments, focus your attention, and do the thing that matters.',
      opportunities: ['Tackling the practical task you have been avoiding', 'Bringing order and system to a chaotic area of life', 'Laying the groundwork for a longer-term goal'],
      watchFor: 'Rigidity or perfectionism that prevents the work from proceeding. Good enough now, perfect never was never the foundation of anything great.',
      affirmation: 'I build with intention and integrity. Every brick I lay is an act of devotion to the life I am creating.',
    },
    weekly: {
      guidance: 'This week rewards methodical, unglamorous effort. Put your head down, commit to your process, and trust that the discipline of this week is building something of genuine value. The 4 week is not for inspiration — it is for implementation.',
      opportunities: ['Completing the practical work that underlies a larger dream', 'Establishing new habits or routines', 'Addressing responsibilities with greater clarity and organization'],
      watchFor: 'Becoming so consumed by obligation that you forget the purpose behind the work. Structure is in service to life, not a replacement for it.',
    },
    monthly: {
      guidance: 'The 4 month is the master builder\'s month — a time to strengthen your foundations across all domains. Health, finances, work, relationships: all of these benefit from your most focused, honest, and disciplined attention this month. What gets built now will carry you for years.',
      opportunities: ['Major life restructuring', 'Health and wellness commitments', 'Financial planning and security building'],
      watchFor: 'The heaviness that can come with the 4 month\'s demands. You are not a machine — rest is part of the architecture.',
    },
  },
  5: {
    theme: 'Change, Freedom & Adventure',
    daily: {
      guidance: 'Today crackles with the energy of change and possibility. Something in your life is ready to shift — do not grip so tightly to how things have been that you miss what is becoming available. Embrace a small risk. Try something different. Let yourself be surprised.',
      opportunities: ['Breaking out of a habitual pattern', 'Exploring something entirely new', 'Having a conversation you have been postponing because you didn\'t know how it would go'],
      watchFor: 'Change for its own sake — impulsive choices that prioritize novelty over wisdom. Not every door that opens needs to be walked through.',
      affirmation: 'I am free. I move through change like water through light, adapting and shining simultaneously.',
    },
    weekly: {
      guidance: 'Movement is the medicine of this week. If you have been feeling stuck, the 5 week is the universe\'s invitation to shift. Travel, explore, experiment, and engage with perspectives very different from your usual orbit. Let life surprise you.',
      opportunities: ['Travel or a significant change of scenery', 'Engaging with new ideas, cultures, or communities', 'Making a decision that breaks with the familiar'],
      watchFor: 'Restlessness that prevents you from harvesting what the change is actually showing you. When the universe speaks through disruption, it pays to listen carefully.',
    },
    monthly: {
      guidance: 'This is a month of dynamic change and expanded freedom. Expect the unexpected — in beautiful ways. The 5 month often brings pivotal encounters, surprising opportunities, and the long-awaited release of situations that have run their natural course. Stay light and responsive.',
      opportunities: ['Major life transitions that have been building', 'New relationships or collaborations that expand your world', 'Freedom from constraints that have been limiting your growth'],
      watchFor: 'Overextension — saying yes to every new thing until you no longer have the coherence to integrate what is actually being offered.',
    },
  },
  6: {
    theme: 'Love, Service & Harmony',
    daily: {
      guidance: 'Today asks for your heart in its fullest expression. The energy of the 6 day is oriented toward love, service, beauty, and the healing of what has been out of balance in your relationships and environment. Show up fully for the people in your life. Create something beautiful. Tend to what you love.',
      opportunities: ['Deepening connection with family or beloved community', 'Service that comes from the overflow of genuine care', 'Creating or beautifying your environment'],
      watchFor: 'Taking responsibility for what is not yours to carry. Love freely, but remember — you are allowed to have needs too.',
      affirmation: 'I give from abundance and receive with grace. Love flows through me and as me, without depletion.',
    },
    weekly: {
      guidance: 'Relationships and home are the domain of this week. Something in your closest bonds deserves your most attentive care. Be present. Be generous. Be honest. Whatever disharmony exists in your intimate circle, the 6 week is an excellent time to address it with love.',
      opportunities: ['Healing a strained relationship through compassionate honesty', 'Creating beauty in your physical environment', 'Acts of service that strengthen your sense of purpose'],
      watchFor: 'Perfectionism about how others should behave. Your job is to embody love — not to manage others toward it.',
    },
    monthly: {
      guidance: 'The 6 month is a time of deep nourishment — of relationships, of home, of your own need for beauty and harmony. You are being called to be the loving center of your world. This month, your capacity to give care and create harmony is the single most powerful resource you have.',
      opportunities: ['Deepening your most important relationships', 'Healing family or community dynamics', 'Creating a home environment that truly reflects your values and supports your flourishing'],
      watchFor: 'Losing your center in the needs of others. The 6 month asks you to love — not to disappear.',
    },
  },
  7: {
    theme: 'Reflection, Wisdom & Inner Truth',
    daily: {
      guidance: 'Today belongs to the interior. The 7 day energy draws you inward toward contemplation, silence, and the pursuit of deeper understanding. This is not a day for aggressive outward action — it is a day for thinking, studying, and listening to the quieter frequencies of your own knowing.',
      opportunities: ['Study, research, or deep reading', 'Meditation, prayer, or solitary reflection', 'Journal writing or any practice that helps you access your own inner guidance'],
      watchFor: 'The temptation to mistake withdrawal for avoidance. The 7 day asks for interiority, not isolation. You can be profoundly inner while remaining open.',
      affirmation: 'I trust the wisdom that lives beneath the noise. I go within and find the answer I was seeking in the world.',
    },
    weekly: {
      guidance: 'This is a week for depth over breadth, quality over quantity, and the slow, deliberate kind of knowing that only comes through sustained attention. Something is asking to be understood more deeply. Give it the space it needs.',
      opportunities: ['Solving a complex problem through patient analysis', 'Spiritual practice or philosophical inquiry', 'Rest and restoration that makes the coming weeks more productive'],
      watchFor: 'Retreating so far inward that you lose the thread connecting your insights to the world that needs them.',
    },
    monthly: {
      guidance: 'The 7 month is sacred time. You are being invited into a profound encounter with yourself — with the questions that matter most, the truths that have been seeking expression, and the wisdom that only emerges in stillness. This is not a month for networking or hustle; it is a month for going deep.',
      opportunities: ['Spiritual retreat or deepened contemplative practice', 'Research or study that feeds your soul as well as your mind', 'Solitude that replenishes rather than isolates'],
      watchFor: 'The ego\'s resistance to the quiet — the restlessness and distraction-seeking that prevents you from receiving what this month is trying to give you.',
    },
  },
  8: {
    theme: 'Power, Achievement & Abundance',
    daily: {
      guidance: 'Today carries the charge of material power and worldly effectiveness. The energy of the 8 day supports ambitious action, financial decisions, and the exercise of authority. Step into your power with the confidence of someone who has prepared for exactly this moment.',
      opportunities: ['Making significant financial or business decisions', 'Claiming authority or leadership in your domain', 'Setting goals that are worthy of your actual capacity'],
      watchFor: 'The abuse of power — toward others or toward yourself through overwork or impossible standards. True power is always in service to something greater.',
      affirmation: 'I claim my power with integrity. Abundance flows to me as I flow outward in service to what matters most.',
    },
    weekly: {
      guidance: 'Step into this week with the confidence of someone who knows what they\'re worth. The 8 week is a time for strategic moves, for claiming what you have earned, and for bringing the full force of your capability to bear on your most important goals.',
      opportunities: ['Negotiating for what you\'re worth', 'Taking on greater responsibility that reflects your actual capacity', 'Financial strategy and wealth-building action'],
      watchFor: 'Conflating success with worth. Your power does not come from what you achieve — it is the ground from which achievement grows.',
    },
    monthly: {
      guidance: 'The 8 month is a crucible of power and manifestation. Whatever relationship you have with abundance, authority, and material reality is up for examination and upgrade this month. This is an excellent time to take bold action in the material domain of your life.',
      opportunities: ['Major career moves or business initiatives', 'Financial planning and wealth-building', 'Stepping into expanded leadership'],
      watchFor: 'Using activity as an escape from the deeper question of what you actually want to create with the power you are being given.',
    },
  },
  9: {
    theme: 'Completion, Release & Compassion',
    daily: {
      guidance: 'Today asks you to complete, release, and forgive. The 9 day energy is oriented toward culmination — the natural ending of cycles. What is finished, what is asking to be let go, what person or situation is ready for you to release with love and gratitude? Honor the endings today, and make space.',
      opportunities: ['Completing long-running projects or obligations', 'Releasing grudges, resentments, or attachments that no longer serve', 'Acts of genuine compassion toward yourself or another'],
      watchFor: 'Clinging to what has run its course out of fear of the emptiness that follows completion. The space that remains after a 9-day release is where the next beginning will be planted.',
      affirmation: 'I complete with gratitude. I release with love. I trust the fertile emptiness that follows every ending.',
    },
    weekly: {
      guidance: 'This is a week of graceful completion. A cycle in your life is wrapping up — perhaps a project, a relationship chapter, an old belief system, or a way of moving through the world that has served its purpose. Honor what is ending with the fullness of your appreciation.',
      opportunities: ['Completing projects that have been lingering', 'Forgiveness work — with yourself and others', 'Service and generosity that come with no expectation of return'],
      watchFor: 'Dramatizing endings rather than completing them cleanly. Let what goes go with grace, not with spectacular exits.',
    },
    monthly: {
      guidance: 'The 9 month is the completion of your current nine-month cycle — a time of harvest, release, and generous giving. Be grateful for everything this cycle has brought — the gifts and the lessons equally. Clear the decks. Forgive thoroughly. The 1-month that follows will plant seeds of profound significance.',
      opportunities: ['Major completions and closures', 'Philanthropic or humanitarian service', 'Deep forgiveness and the release of old wounds'],
      watchFor: 'Sabotaging the natural completion by starting new things prematurely. Let this month be truly complete before you begin again.',
    },
  },
};

// For master numbers, use the reduced base or a default
function getThemeData(n: number) {
  const base = n > 9 ? ([n, 11, 22, 33].includes(n) ? Math.floor(n / 11) * 2 : n % 9 || 9) : n;
  return PERIOD_THEMES[base] ?? PERIOD_THEMES[9];
}

export function generateInsights(
  personalDay: number,
  personalMonth: number,
  personalYear: number,
): { daily: PeriodInsight; weekly: PeriodInsight; monthly: PeriodInsight } {
  const dayData = getThemeData(personalDay);
  const weekNum = personalDay <= 3 ? personalDay + 3 : personalDay - 3;
  const weekData = getThemeData(((weekNum - 1) % 9) + 1);
  const monthData = getThemeData(personalMonth);

  const daily: PeriodInsight = {
    period: 'daily',
    number: personalDay,
    theme: dayData.theme,
    guidance: dayData.daily.guidance,
    opportunities: dayData.daily.opportunities,
    watchFor: dayData.daily.watchFor,
    affirmation: dayData.daily.affirmation,
  };

  const weekly: PeriodInsight = {
    period: 'weekly',
    number: ((weekNum - 1) % 9) + 1,
    theme: weekData.theme,
    guidance: weekData.weekly.guidance,
    opportunities: weekData.weekly.opportunities,
    watchFor: weekData.weekly.watchFor,
  };

  const monthly: PeriodInsight = {
    period: 'monthly',
    number: personalMonth,
    theme: monthData.theme,
    guidance: monthData.monthly.guidance,
    opportunities: monthData.monthly.opportunities,
    watchFor: monthData.monthly.watchFor,
  };

  return { daily, weekly, monthly };
}
