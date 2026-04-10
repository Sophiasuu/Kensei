'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FadeIn from '@/components/FadeIn';
import RadarChart from '@/components/RadarChart';
import StarField from '@/components/StarField';
import { generateFullReading } from '@/lib/reading';
import type { CardDeepDive, DeepSection, FullReading, LoveSection, PeriodInsight } from '@/types';

type ForecastKey = 'daily' | 'weekly' | 'monthly';
type DeepKey = 'general' | 'love' | 'careerFinance' | 'health' | 'pastLife';
type SystemKey = 'western' | 'vedic' | 'bazi' | 'numerology';

const SYSTEM_ICONS: Record<SystemKey, string> = {
  western: '☽',
  vedic: 'ॐ',
  bazi: '命',
  numerology: '∞',
};

const SYSTEM_ACCENTS: Record<SystemKey, string> = {
  western: 'oklch(55% 0.08 42)',
  vedic: 'oklch(53% 0.08 150)',
  bazi: 'oklch(43% 0.04 45)',
  numerology: 'oklch(64% 0.08 22)',
};

const FORECAST_LABELS: Record<ForecastKey, string> = {
  daily: 'Daily Pulse',
  weekly: 'Weekly Drift',
  monthly: 'Monthly Arc',
};

const DEEP_TABS: Array<{ id: DeepKey; label: string }> = [
  { id: 'general', label: 'General' },
  { id: 'love', label: 'Love' },
  { id: 'careerFinance', label: 'Career' },
  { id: 'health', label: 'Health' },
  { id: 'pastLife', label: 'Past Life' },
];

function ForecastPanel({ insight, personalYear }: { insight: PeriodInsight; personalYear: number }) {
  return (
    <div className="insight-panel space-y-6">
      <div className="space-y-3">
        <p className="section-kicker">{FORECAST_LABELS[insight.period]}</p>
        <div className="flex flex-wrap items-center gap-3">
          <span className="report-chip">
            <span className="report-chip-icon">{insight.number}</span>
            Personal Year {personalYear}
          </span>
          <span className="report-chip">{insight.theme}</span>
        </div>
      </div>

      <p className="forecast-copy">{insight.guidance}</p>

      <div className="forecast-grid">
        <div className="forecast-card">
          <p className="section-kicker mb-3">Opportunities</p>
          <ul className="divider-list">
            {insight.opportunities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="forecast-card">
          <p className="section-kicker mb-3">Watch For</p>
          <p className="panel-copy max-w-none">{insight.watchFor}</p>
        </div>
      </div>

      {insight.affirmation ? (
        <div className="rounded-[1.25rem] border border-[var(--line)] bg-[var(--surface-tint)] px-5 py-4">
          <p className="section-kicker mb-3">Affirmation</p>
          <p className="font-display text-xl leading-8 text-[var(--text-strong)]">“{insight.affirmation}”</p>
        </div>
      ) : null}
    </div>
  );
}

function DeepSectionView({ section }: { section: DeepSection | LoveSection }) {
  const love = 'loveStyle' in section ? section : null;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <p className="deep-copy">{section.overview}</p>
      </div>

      {love ? (
        <div className="detail-grid">
          <div className="summary-stat">
            <p className="section-kicker mb-3">Love Style</p>
            <p className="font-display text-2xl text-[var(--text-strong)]">{love.loveStyle.mode}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {love.loveStyle.languages.map((language) => (
                <span key={language} className="pill-tag">{language}</span>
              ))}
            </div>
            <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--text-muted)]">
              <p><strong className="text-[var(--text)]">Attraction:</strong> {love.loveStyle.attractionEnergy}</p>
              <p><strong className="text-[var(--text)]">Commitment:</strong> {love.loveStyle.commitmentStyle}</p>
              <p><strong className="text-[var(--text)]">Conflict:</strong> {love.loveStyle.conflictStyle}</p>
            </div>
          </div>

          <div className="summary-stat">
            <p className="section-kicker mb-3">Partner Pattern</p>
            <p className="font-display text-2xl text-[var(--text-strong)]">{love.partnerProfile.archetype}</p>
            <p className="mt-2 text-sm uppercase tracking-[0.16em] text-[var(--text-soft)]">
              Complementary Element: {love.partnerProfile.element}
            </p>
            <p className="mt-4 panel-copy max-w-none">{love.partnerProfile.dynamicDescription}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {love.partnerProfile.traits.map((trait) => (
                <span key={trait} className="pill-tag">{trait}</span>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div className="lens-grid">
        {section.lenses.map((lens) => (
          <article key={lens.tradition} className="lens-card">
            <div className="mb-3 flex items-center gap-2">
              <span aria-hidden="true" style={{ color: lens.accent }}>{lens.icon}</span>
              <p className="section-kicker" style={{ color: lens.accent }}>{lens.tradition}</p>
            </div>
            <p className="panel-copy max-w-none">{lens.insight}</p>
          </article>
        ))}
      </div>

      {love ? (
        <div className="detail-grid">
          <div className="summary-stat">
            <p className="section-kicker mb-3">Love Timeline</p>
            <div className="space-y-4">
              {love.timelines.map((timeline) => (
                <div key={`${timeline.period}-${timeline.theme}`} className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
                  <p className="section-kicker mb-2">{timeline.period}</p>
                  <p className="font-display text-xl text-[var(--text-strong)]">{timeline.theme}</p>
                  <p className="mt-2 panel-copy max-w-none">{timeline.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="summary-stat">
            <p className="section-kicker mb-3">Relationship Signals</p>
            <div className="space-y-4 text-sm leading-7 text-[var(--text-muted)]">
              <p><strong className="text-[var(--text)]">What they bring:</strong> {love.partnerProfile.whatTheyBring}</p>
              <p><strong className="text-[var(--text)]">How you’ll recognise them:</strong> {love.partnerProfile.recognitionSign}</p>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
                <p className="section-kicker mb-3">Compatible Energies</p>
                <div className="flex flex-wrap gap-2">
                  {love.compatibilityElements.map((item) => (
                    <span key={item} className="pill-tag">{item}</span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
                <p className="section-kicker mb-3">Patterns To Avoid</p>
                <ul className="divider-list">
                  {love.redFlags.map((flag) => (
                    <li key={flag}>{flag}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="detail-grid">
        <div className="summary-stat">
          <p className="section-kicker mb-3">Key Themes</p>
          <ul className="divider-list">
            {section.themes.map((theme) => (
              <li key={theme}>{theme}</li>
            ))}
          </ul>
        </div>

        <div className="summary-stat">
          <p className="section-kicker mb-3">Guidance</p>
          <p className="deep-copy">{section.guidance}</p>
        </div>
      </div>
    </div>
  );
}

export default function ReadingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeSystem, setActiveSystem] = useState<SystemKey>('western');
  const [activeForecast, setActiveForecast] = useState<ForecastKey>('daily');
  const [activeDeep, setActiveDeep] = useState<DeepKey>('general');

  const name = searchParams.get('name');
  const dob = searchParams.get('dob');
  const tob = searchParams.get('tob') ?? undefined;

  const { reading, birthDate } = useMemo(() => {
    if (!dob) return { reading: null as FullReading | null, birthDate: null as Date | null };

    try {
      const [year, month, day] = dob.split('-').map(Number);
      const nextDate = new Date(year, month - 1, day, 12, 0, 0);
      if (Number.isNaN(nextDate.getTime())) {
        return { reading: null as FullReading | null, birthDate: null as Date | null };
      }

      return {
        reading: generateFullReading({
          name: name ?? undefined,
          dateOfBirth: nextDate,
          timeOfBirth: tob,
        }),
        birthDate: nextDate,
      };
    } catch {
      return { reading: null as FullReading | null, birthDate: null as Date | null };
    }
  }, [dob, name, tob]);

  if (!reading) {
    return (
      <main className="relative min-h-screen overflow-hidden px-5 py-10 sm:px-8 lg:px-10">
        <StarField />
        <div className="report-shell flex min-h-[calc(100vh-5rem)] items-center justify-center">
          <div className="empty-panel max-w-xl text-center">
            <p className="eyebrow">Reading Unavailable</p>
            <h1 className="mt-4 font-display text-[clamp(2.4rem,7vw,4.2rem)] leading-[0.98] text-[var(--text-strong)]">
              No birth data was provided.
            </h1>
            <p className="mx-auto mt-5 max-w-[32rem] text-base leading-8 text-[var(--text-muted)]">
              Return to the opening ritual, enter your birth details, and the report will generate instantly.
            </p>
            <button className="ritual-button mt-8" onClick={() => router.push('/')}>
              Return Home
            </button>
          </div>
        </div>
      </main>
    );
  }

  const formattedDate = birthDate
    ? new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(birthDate)
    : null;

  const pillars = [reading.bazi.yearPillar, reading.bazi.monthPillar, reading.bazi.dayPillar, ...(reading.bazi.hourPillar ? [reading.bazi.hourPillar] : [])];

  const cardDiveMap: Record<SystemKey, CardDeepDive> = {
    western: reading.cardDeepDives.western,
    vedic: reading.cardDeepDives.vedic,
    bazi: reading.cardDeepDives.bazi,
    numerology: reading.cardDeepDives.numerology,
  };

  const forecastMap: Record<ForecastKey, PeriodInsight> = {
    daily: reading.daily,
    weekly: reading.weekly,
    monthly: reading.monthly,
  };

  const deepMap: Record<DeepKey, DeepSection | LoveSection> = {
    general: reading.deepAnalysis.general,
    love: reading.deepAnalysis.love,
    careerFinance: reading.deepAnalysis.careerFinance,
    health: reading.deepAnalysis.health,
    pastLife: reading.deepAnalysis.pastLife,
  };

  const systemSummaries = [
    {
      id: 'western' as const,
      label: 'Western',
      title: `${reading.western.sunSign.symbol} ${reading.western.sunSign.name}`,
      meta: `${reading.western.sunSign.element}${reading.western.sunSign.modality ? ` · ${reading.western.sunSign.modality}` : ''}`,
      text: reading.western.sunSign.description,
      traitLabel: `Ruled by ${reading.western.sunSign.rulingPlanet}`,
      traits: reading.western.sunSign.traits,
    },
    {
      id: 'vedic' as const,
      label: 'Vedic',
      title: `${reading.vedic.rashi.name} · ${reading.vedic.nakshatra.name}`,
      meta: `${reading.vedic.rashi.element} · ${reading.vedic.nakshatra.englishMeaning}`,
      text: reading.vedic.nakshatra.description,
      traitLabel: `${reading.vedic.nakshatra.deity} · ${reading.vedic.nakshatra.ruling}`,
      traits: reading.vedic.rashi.traits,
    },
    {
      id: 'bazi' as const,
      label: 'Bazi',
      title: `${reading.bazi.dayMaster.polarity} ${reading.bazi.dayMaster.element}`,
      meta: `${reading.bazi.dayPillar.stem.chinese}${reading.bazi.dayPillar.branch.chinese} Day Master`,
      text: reading.bazi.dayMaster.description,
      traitLabel: `${reading.bazi.yearPillar.branch.animal} year influence`,
      traits: reading.bazi.dayMaster.traits,
    },
    {
      id: 'numerology' as const,
      label: 'Numerology',
      title: reading.numerology.lifePath.isMaster
        ? `Master ${reading.numerology.lifePath.number}`
        : `Life Path ${reading.numerology.lifePath.number}`,
      meta: `Personal Year ${reading.numerology.personalYear}`,
      text: reading.numerology.lifePath.description,
      traitLabel: reading.numerology.lifePath.challenge,
      traits: reading.numerology.lifePath.keywords,
    },
  ];

  const activeDive = cardDiveMap[activeSystem];
  const activeInsight = forecastMap[activeForecast];
  const activeDeepSection = deepMap[activeDeep];

  return (
    <main className="relative min-h-screen overflow-hidden px-5 pb-20 pt-6 sm:px-8 lg:px-10">
      <StarField />

      <div className="report-shell space-y-12">
        <header className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <FadeIn>
            <div className="space-y-5">
              <button className="ghost-button" onClick={() => router.push('/')}>
                ← Return Home
              </button>

              <div className="space-y-4">
                <p className="eyebrow">Ceremonial Dossier</p>
                <h1 className="font-display text-[clamp(3rem,8vw,6.4rem)] leading-[0.94] text-[var(--text-strong)]">
                  {name ? `${name}'s` : 'Your'} cosmic dossier
                </h1>
                <p className="max-w-[40rem] text-base leading-8 text-[var(--text-muted)] sm:text-[1.05rem]">
                  A unified reading assembled from Western astrology, Vedic astrology, Bazi, and numerology, then edited into one report built for actual decision-making.
                </p>
              </div>

              <div className="report-meta-row">
                {formattedDate ? <span className="report-chip">Born {formattedDate}</span> : null}
                {tob ? <span className="report-chip">Birth Time {tob}</span> : null}
                <span className="report-chip">Four-system synthesis</span>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={90}>
            <section className="summary-hero-panel">
              <div className="grid gap-6 md:grid-cols-[0.92fr_1.08fr] md:items-center">
                <div className="space-y-4">
                  <p className="section-kicker">Unified Archetype</p>
                  <h2 className="font-display text-[clamp(2rem,5vw,3.4rem)] leading-[1.02] text-[var(--text-strong)]">
                    {reading.synthesis.archetypeSymbol} {reading.synthesis.archetype}
                  </h2>
                  <p className="story-copy">{reading.synthesis.essence}</p>
                  <div className="summary-grid">
                    <div className="summary-stat">
                      <p className="section-kicker mb-3">Core Strengths</p>
                      <div className="flex flex-wrap gap-2">
                        {reading.synthesis.coreStrengths.map((strength) => (
                          <span key={strength} className="pill-tag">{strength}</span>
                        ))}
                      </div>
                    </div>

                    <div className="summary-stat">
                      <p className="section-kicker mb-3">Growth Edge</p>
                      <div className="flex flex-wrap gap-2">
                        {reading.synthesis.growthAreas.map((item) => (
                          <span key={item} className="pill-tag">{item}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm leading-7 text-[var(--text-muted)]">
                    <strong className="text-[var(--text)]">Superpower:</strong> {reading.synthesis.superpower}
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="section-kicker">Cosmic Profile</p>
                  <div className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)] p-4">
                    <RadarChart profile={reading.cosmicProfile} />
                  </div>
                </div>
              </div>
            </section>
          </FadeIn>
        </header>

        <section className="detail-grid">
          {systemSummaries.map((summary, index) => (
            <FadeIn key={summary.id} delay={index * 60}>
              <article className="system-mini-card h-full">
                <div className="mb-4 flex items-center gap-3">
                  <span className="report-chip-icon" style={{ color: SYSTEM_ACCENTS[summary.id] }}>
                    {SYSTEM_ICONS[summary.id]}
                  </span>
                  <div>
                    <p className="section-kicker">{summary.label}</p>
                    <p className="mt-1 font-display text-2xl leading-8 text-[var(--text-strong)]">{summary.title}</p>
                  </div>
                </div>
                <p className="mb-3 text-sm uppercase tracking-[0.16em] text-[var(--text-soft)]">{summary.meta}</p>
                <p className="panel-copy max-w-none">{summary.text}</p>
                <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">{summary.traitLabel}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {summary.traits.slice(0, 4).map((trait) => (
                    <span key={trait} className="pill-tag">{trait}</span>
                  ))}
                </div>
              </article>
            </FadeIn>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <FadeIn>
            <div className="report-block space-y-6">
              <div className="space-y-3">
                <p className="eyebrow">Tradition Breakdown</p>
                <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-[1.02] text-[var(--text-strong)]">
                  Move between the four source systems.
                </h2>
                <p className="story-copy">
                  Each tradition contributes a different lens. Use the tabs to inspect its key symbols, then read the deeper interpretation below the table.
                </p>
              </div>

              <div className="system-tabs">
                {systemSummaries.map((summary) => (
                  <button
                    key={summary.id}
                    type="button"
                    className="system-tab"
                    data-active={activeSystem === summary.id}
                    onClick={() => setActiveSystem(summary.id)}
                  >
                    <span className="system-tab-icon">{SYSTEM_ICONS[summary.id]}</span>
                    {summary.label}
                  </button>
                ))}
              </div>

              <div className="system-detail-panel space-y-6">
                <div className="space-y-2">
                  <p className="section-kicker" style={{ color: SYSTEM_ACCENTS[activeSystem] }}>
                    {systemSummaries.find((item) => item.id === activeSystem)?.label}
                  </p>
                  <h3 className="font-display text-[clamp(1.7rem,3vw,2.6rem)] leading-[1.06] text-[var(--text-strong)]">
                    {activeDive.title}
                  </h3>
                </div>

                <table className="detail-table">
                  <tbody>
                    {activeDive.table.map((row) => (
                      <tr key={row.label}>
                        <td>{row.label}</td>
                        <td>{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="space-y-4">
                  {activeDive.deepDive.split('\n\n').filter(Boolean).map((paragraph, index) => (
                    <p key={`${activeDive.title}-${index}`} className="deep-copy">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>

          <div className="space-y-6">
            <FadeIn delay={60}>
              <div className="report-block space-y-6">
                <div className="space-y-3">
                  <p className="eyebrow">Current Timing</p>
                  <p className="story-copy">
                    Numerology and synthesis combine into a practical forecast layer. Read the period that matches how far ahead you’re planning.
                  </p>
                </div>

                <div className="insight-tabs">
                  {(Object.keys(FORECAST_LABELS) as ForecastKey[]).map((key) => (
                    <button
                      key={key}
                      type="button"
                      className="insight-tab"
                      data-active={activeForecast === key}
                      onClick={() => setActiveForecast(key)}
                    >
                      {FORECAST_LABELS[key]}
                    </button>
                  ))}
                </div>

                <ForecastPanel insight={activeInsight} personalYear={reading.numerology.personalYear} />
              </div>
            </FadeIn>

            <FadeIn delay={120}>
              <div className="report-block space-y-6">
                <div className="space-y-3">
                  <p className="eyebrow">Structural Markers</p>
                  <p className="story-copy">
                    These are the fixed coordinates anchoring the reading: your Bazi pillars, life-path sequence, and the dominant element driving the synthesis.
                  </p>
                </div>

                <div className="pillar-grid">
                  {pillars.map((pillar) => (
                    <div key={pillar.label} className="pillar-card">
                      <p className="section-kicker mb-2">{pillar.label}</p>
                      <p className="font-display text-2xl text-[var(--text-strong)]">
                        {pillar.stem.chinese}{pillar.branch.chinese}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                        {pillar.stem.name} {pillar.branch.name}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="summary-grid">
                  <div className="summary-stat">
                    <p className="section-kicker mb-3">Numerology Sequence</p>
                    <p className="text-sm leading-7 text-[var(--text-muted)]">
                      Personal Year {reading.numerology.personalYear}, Personal Month {reading.numerology.personalMonth}, Personal Day {reading.numerology.personalDay}
                    </p>
                  </div>

                  <div className="summary-stat">
                    <p className="section-kicker mb-3">Dominant Element</p>
                    <p className="font-display text-2xl text-[var(--text-strong)]">{reading.synthesis.dominantElement}</p>
                    <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                      This is the element repeated most strongly across the unified reading.
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.84fr_1.16fr] lg:items-start">
          <FadeIn>
            <div className="space-y-5">
              <p className="eyebrow">Deep Inquiry</p>
              <h2 className="max-w-[12ch] font-display text-[clamp(2.2rem,5vw,4.2rem)] leading-[0.98] text-[var(--text-strong)]">
                Choose the area you want interpreted in full.
              </h2>
              <p className="max-w-[37rem] text-base leading-8 text-[var(--text-muted)]">
                Once the overall pattern is stable, the report opens into specific life domains. Each section retains the cross-tradition method instead of switching into generic advice.
              </p>
              <div className="report-meta-row">
                {DEEP_TABS.map((tab) => (
                  <span key={tab.id} className="report-chip">{tab.label}</span>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={90}>
            <div className="deep-panel space-y-6">
              <div className="deep-tabs">
                {DEEP_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className="deep-tab"
                    data-active={activeDeep === tab.id}
                    onClick={() => setActiveDeep(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <DeepSectionView section={activeDeepSection} />
            </div>
          </FadeIn>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <FadeIn>
            <div className="report-block space-y-5">
              <p className="eyebrow">Carry Forward</p>
              <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-[1.02] text-[var(--text-strong)]">
                The reading resolves into one working instruction.
              </h2>
              <p className="deep-copy">
                Use the archetype for identity, the forecast for timing, and the deep sections for area-specific judgment. The point is not to collect symbols. The point is to act with sharper self-knowledge.
              </p>
              <div className="summary-grid">
                <div className="summary-stat">
                  <p className="section-kicker mb-3">Primary Gift</p>
                  <p className="font-display text-2xl text-[var(--text-strong)]">{reading.synthesis.superpower}</p>
                </div>
                <div className="summary-stat">
                  <p className="section-kicker mb-3">Main Challenge</p>
                  <p className="panel-copy max-w-none">{reading.numerology.lifePath.challenge}</p>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={90}>
            <div className="report-block space-y-5">
              <p className="eyebrow">Next Move</p>
              <p className="panel-copy max-w-none">
                Generate another reading, compare patterns for someone close to you, or return to the opening ritual when you want a fresh pass with updated context.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="ritual-button" onClick={() => router.push('/')}>
                  Start Another Reading
                </button>
                <button className="secondary-button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  Back To Top
                </button>
              </div>
            </div>
          </FadeIn>
        </section>
      </div>
    </main>
  );
}