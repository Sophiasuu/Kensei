'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StarField from '@/components/StarField';
import FadeIn from '@/components/FadeIn';

const SYSTEMS = [
  { name: 'Western',    sub: 'Sun sign & archetypes',    icon: '☽' },
  { name: 'Vedic',      sub: 'Rashi & Nakshatra',        icon: 'ॐ' },
  { name: 'Bazi',       sub: 'Four Pillars of Destiny',  icon: '命' },
  { name: 'Numerology', sub: 'Life Path & cycles',       icon: '∞' },
];

const SYSTEM_ACCENTS = ['#c9a052', '#d06050', '#4f8f6e', '#7a63b5'];

export default function HomePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [tob, setTob] = useState('');
  const [error, setError] = useState('');

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
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      <StarField />

      <div className="relative z-10 w-full max-w-md text-center">
        <FadeIn>
          {/* Symbol */}
          <div
            className="mx-auto mb-8 w-14 h-14 rounded-full flex items-center justify-center text-xl"
            style={{ background: 'var(--gold-dim)', border: '1px solid var(--border-gold)' }}
          >
            ◉
          </div>

          {/* Headline */}
          <h1 className="mb-3 font-display text-4xl sm:text-5xl font-semibold gradient-gold" style={{ letterSpacing: '0.04em' }}>
            Psychic Central
          </h1>
          <p className="mb-3 text-sm leading-relaxed" style={{ color: 'var(--text-muted)', letterSpacing: '0.03em' }}>
            Your complete cosmic blueprint
          </p>
          <div className="divider mb-10" />

          {/* System icons row */}
          <div className="grid grid-cols-4 gap-3 mb-10">
            {SYSTEMS.map((s, i) => (
              <div key={s.name} className="text-center">
                <div
                  className="mx-auto mb-2 w-11 h-11 rounded-full flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: `${SYSTEM_ACCENTS[i]}0e`,
                    border: `1px solid ${SYSTEM_ACCENTS[i]}28`,
                  }}
                >
                  <span style={{
                    color: SYSTEM_ACCENTS[i],
                    fontSize: s.name === 'Western' ? '1.25rem' : s.name === 'Bazi' ? '1rem' : '1.25rem',
                    fontFamily: s.name === 'Vedic' ? 'serif' : 'inherit',
                  }}>
                    {s.icon}
                  </span>
                </div>
                <p className="text-xs font-semibold tracking-wide" style={{ color: 'var(--text-muted)' }}>{s.name}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-dim)', fontSize: '0.65rem' }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Form */}
        <FadeIn delay={120}>
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl p-8 text-left space-y-5"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--line)', backdropFilter: 'blur(12px)' }}
          >
            <div>
              <label className="block mb-2 text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--text-muted)', letterSpacing: '0.16em' }}>
                Full Name <span style={{ color: 'var(--text-dim)', textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
              </label>
              <input
                className="cosmic-input"
                type="text"
                placeholder="e.g. Luna Celestine"
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="off"
              />
            </div>

            <div>
              <label className="block mb-2 text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--text-muted)', letterSpacing: '0.16em' }}>
                Date of Birth <span style={{ color: 'var(--gold)' }}>*</span>
              </label>
              <input
                className="cosmic-input"
                type="date"
                value={dob}
                onChange={e => { setDob(e.target.value); setError(''); }}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--text-muted)', letterSpacing: '0.16em' }}>
                Time of Birth <span style={{ color: 'var(--text-dim)', textTransform: 'none', letterSpacing: 0 }}>(optional — unlocks Hour Pillar)</span>
              </label>
              <input
                className="cosmic-input"
                type="time"
                value={tob}
                onChange={e => setTob(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-sm" style={{ color: '#c05050' }}>{error}</p>
            )}

            <div className="pt-3 text-center">
              <button type="submit" className="btn-gold w-full">
                Reveal My Reading
              </button>
            </div>
          </form>
        </FadeIn>
      </div>

      {/* Footer */}
      <p className="relative z-10 mt-12 text-xs tracking-widest" style={{ color: 'var(--text-dim)', letterSpacing: '0.2em' }}>
        ANCIENT WISDOM · MODERN CLARITY
      </p>
    </main>
  );
}

