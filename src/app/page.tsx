'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FadeIn from '@/components/FadeIn';
import MysticIllustration from '@/components/MysticIllustration';
import Splash from '@/components/Splash';

const SYSTEMS = [
  { name: 'Western', sub: 'Sun sign, modality, and core archetype', icon: '☽' },
  { name: 'Vedic', sub: 'Rashi, nakshatra, and karmic tone', icon: 'ॐ' },
  { name: 'Bazi', sub: 'Four Pillars, Day Master, and timing', icon: '命' },
  { name: 'Numerology', sub: 'Life Path, personal year, and cycles', icon: '∞' },
];

const RITUAL_STEPS = [
  'Enter your birth date and optional birth time.',
  'We synthesize four traditions into one clear narrative.',
  'You receive instant themes, timing, and deep-dive guidance.',
];

const READING_SECTIONS = [
  {
    title: 'Unified Archetype',
    text: 'A single editorial summary distilling what all four systems agree on about your nature, gifts, and growth edge.',
  },
  {
    title: 'Current Timing',
    text: 'Daily, weekly, and monthly atmosphere translated into practical language, not abstract jargon.',
  },
  {
    title: 'Deep Inquiry',
    text: 'Focused guidance on love, career, health, and long-range patterns once the core reading is established.',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [splashPhase, setSplashPhase] = useState<'loading' | 'exiting' | 'done'>('loading');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [tob, setTob] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const exitTimer = window.setTimeout(() => setSplashPhase('exiting'), 1400);
    const doneTimer = window.setTimeout(() => setSplashPhase('done'), 3800);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!dob) { setError('Please enter your date of birth.'); return; }
    setError('');
    const params = new URLSearchParams();
    if (name.trim()) params.set('name', name.trim());
    params.set('dob', dob);
    if (tob) params.set('tob', tob);
    router.push(`/reading?${params.toString()}`);
  }

  return (
    <>
      {splashPhase !== 'done' ? <Splash exiting={splashPhase === 'exiting'} /> : null}

      <main className="relative overflow-hidden px-5 pb-16 pt-6 sm:px-8 lg:px-10">
        {/* Co-Star style floating background illustrations */}
        <div className="mystic-bg-illustration" style={{ top: '4%', right: '18%', width: 400, height: 400, animationDuration: '18s' }}>
          <img src="/illustrations/moon-mobile.png" alt="" width={400} height={400} draggable={false} />
        </div>
        <div className="mystic-bg-illustration" style={{ top: '52%', left: '35%', width: 380, height: 380, animationDuration: '22s', animationDelay: '3s' }}>
          <img src="/illustrations/saturn.png" alt="" width={380} height={380} draggable={false} />
        </div>
        <div className="mystic-bg-illustration" style={{ top: '32%', right: '10%', width: 340, height: 340, animationDuration: '20s', animationDelay: '6s' }}>
          <img src="/illustrations/crystals.png" alt="" width={340} height={340} draggable={false} />
        </div>
        <div className="mystic-bg-illustration" style={{ bottom: '12%', left: '40%', width: 320, height: 320, animationDuration: '24s', animationDelay: '2s' }}>
          <img src="/illustrations/potion-bottle.png" alt="" width={320} height={320} draggable={false} />
        </div>

        <div className="mx-auto max-w-7xl">
        <section className="grid gap-12 lg:min-h-[calc(100vh-3rem)] lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="space-y-10">
            <FadeIn>
              <div className="flex flex-wrap items-center gap-3">
                <p className="eyebrow">Ceremonial Multi-System Reading</p>
                <span className="rounded-full border border-[var(--line)] px-3 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-[var(--text-soft)]">
                  No signup required
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={80}>
              <div className="grid gap-8 md:items-end">
                <div className="space-y-5">
                  <h1 className="max-w-[11ch] font-display text-[clamp(2.5rem,8.2vw,6.9rem)] leading-[0.96] text-[var(--text-strong)]">
                    Four ancient systems, one exact reading.
                  </h1>
                  <p className="max-w-[38rem] text-[1.05rem] leading-8 text-[var(--text-muted)] sm:text-[1.12rem]">
                    Psychic Central translates your birth data into an editorial-grade reading across Western astrology,
                    Vedic astrology, Bazi, and numerology, then resolves them into one clear narrative.
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={140}>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="surface-panel">
                  <MysticIllustration name="all-seeing-eye" placement="corner-br" size={72} opacity={1} />
                  <p className="section-kicker">Immediate Clarity</p>
                  <p className="panel-copy">See your dominant archetype, elemental balance, and current timing inside a single guided report.</p>
                </div>
                <div className="surface-panel">
                  <MysticIllustration name="sacred-book" placement="corner-br" size={68} opacity={1} />
                  <p className="section-kicker">Interpretation First</p>
                  <p className="panel-copy">The output is written for humans. The systems stay precise, but the language stays readable.</p>
                </div>
                <div className="surface-panel">
                  <MysticIllustration name="hourglass" placement="corner-br" size={68} opacity={1} />
                  <p className="section-kicker">Optional Birth Time</p>
                  <p className="panel-copy">Add a birth time when you have it to unlock the Hour Pillar and a sharper timing layer.</p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <div className="ritual-listing">
                {SYSTEMS.map((system) => (
                  <article key={system.name} className="ritual-system-row">
                    <div className="ritual-system-icon" aria-hidden="true">{system.icon}</div>
                    <div className="space-y-1">
                      <p className="section-kicker">{system.name}</p>
                      <p className="panel-copy">{system.sub}</p>
                    </div>
                  </article>
                ))}
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={260}>
            <aside className="ritual-panel lg:ml-auto lg:max-w-[34rem]">
              <MysticIllustration name="crystal-ball" placement="corner-tl" size={100} opacity={1} />
              <MysticIllustration name="quill" placement="corner-br" size={80} opacity={1} />
              <div className="space-y-3">
                <p className="eyebrow">Begin The Reading</p>
                <h2 className="font-display text-[clamp(1.85rem,4.7vw,3.25rem)] leading-[1.04] text-[var(--text-strong)]">
                  Enter the coordinates.
                </h2>
                <p className="max-w-[34rem] text-base leading-7 text-[var(--text-muted)]">
                  Start with the essentials. The report generates instantly and stays focused on synthesis, timing, and practical guidance.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5 text-left">
                <div>
                  <label className="form-label" htmlFor="name">Name</label>
                  <input
                    id="name"
                    className="ritual-input"
                    type="text"
                    placeholder="Optional, but useful for a more personal tone"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label className="form-label" htmlFor="dob">Date of Birth</label>
                  <input
                    id="dob"
                    className="ritual-input"
                    type="date"
                    value={dob}
                    onChange={(e) => {
                      setDob(e.target.value);
                      setError('');
                    }}
                    max={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div>
                  <label className="form-label" htmlFor="tob">
                    Time of Birth
                    <span className="label-note">Optional, for Hour Pillar timing</span>
                  </label>
                  <input
                    id="tob"
                    className="ritual-input"
                    type="time"
                    value={tob}
                    onChange={(e) => setTob(e.target.value)}
                  />
                </div>

                {error && <p className="form-error">{error}</p>}

                <button type="submit" className="ritual-button w-full">
                  Generate My Reading
                </button>

                <div className="ritual-footnote-grid">
                  <p>Private reading. No account wall.</p>
                  <p>Optimized for mobile and desktop.</p>
                </div>
              </form>
            </aside>
          </FadeIn>
        </section>

        {/* Mystic divider between sections */}
        <div className="mystic-divider mt-16">
          <img src="/illustrations/sun-face.png" alt="" width={44} height={44} draggable={false} />
        </div>

        <section className="mt-6 grid gap-10 lg:grid-cols-[0.86fr_1.14fr]">
          <FadeIn>
            <div className="space-y-5">
              <p className="eyebrow">How It Reads</p>
              <h2 className="max-w-[12ch] font-display text-[clamp(1.95rem,5.2vw,4.2rem)] leading-[1.01] text-[var(--text-strong)]">
                Structured like a dossier, not a toy.
              </h2>
              <p className="max-w-[37rem] text-base leading-8 text-[var(--text-muted)]">
                The site is designed to feel ceremonial and exacting. Every section exists to move you from raw symbolic material into one readable report you can actually use.
              </p>

              <div className="space-y-3">
                {RITUAL_STEPS.map((step, index) => (
                  <div key={step} className="ritual-step-row">
                    <span className="ritual-step-index">0{index + 1}</span>
                    <p className="panel-copy text-[var(--text-muted)]">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <div className="grid gap-4 md:grid-cols-3">
            {READING_SECTIONS.map((section, index) => {
              const cornerIcons: Array<'zodiac-wheel' | 'tarot-cards' | 'moon-goddess'> = ['zodiac-wheel', 'tarot-cards', 'moon-goddess'];
              return (
                <FadeIn key={section.title} delay={index * 70}>
                  <article className="surface-panel h-full">
                    <MysticIllustration name={cornerIcons[index]} placement="corner-tr" size={64} opacity={1} />
                    <p className="section-kicker">{section.title}</p>
                    <p className="panel-copy mt-4">{section.text}</p>
                  </article>
                </FadeIn>
              );
            })}
          </div>
        </section>

        {/* Footer divider */}
        <div className="mystic-divider mt-16">
          <img src="/illustrations/sleeping-moon.png" alt="" width={36} height={36} draggable={false} />
        </div>

        <footer className="mt-4 flex flex-col gap-3 border-t border-[var(--line)] pt-6 text-sm text-[var(--text-soft)] sm:flex-row sm:items-center sm:justify-between">
          <p>Psychic Central arranges ancient systems into one coherent modern report.</p>
          <p>© {new Date().getFullYear()} Psychic Central</p>
        </footer>
        </div>
      </main>
    </>
  );
}

