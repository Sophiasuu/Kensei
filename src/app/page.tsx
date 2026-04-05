'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MeshGradient } from '@paper-design/shaders-react';
import StarField from '@/components/StarField';
import FadeIn from '@/components/FadeIn';
import Constellations from '@/components/Constellations';

const SYSTEMS = [
  { name: 'Western',    sub: 'Sun sign & archetypes',    icon: '☽' },
  { name: 'Vedic',      sub: 'Rashi & Nakshatra',        icon: 'ॐ' },
  { name: 'Bazi',       sub: 'Four Pillars of Destiny',  icon: '命' },
  { name: 'Numerology', sub: 'Life Path & cycles',       icon: '∞' },
];

const SYSTEM_ACCENTS = ['#C77DFF', '#FFD700', '#7B3FA0', '#B88AE8'];

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
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-8 sm:pt-16 overflow-hidden">
      {/* Mesh gradient background */}
      <MeshGradient
        className="!fixed inset-0 w-full h-full"
        style={{ position: 'fixed', inset: 0, zIndex: 0 }}
        colors={['#1A0A2E', '#220F40', '#2A1555', '#3C1A6B']}
        speed={0.3}
      />
      <StarField />
      <Constellations />

      <div className="relative z-10 w-full max-w-md text-center">
        <FadeIn>
          {/* Headline */}
          <h1
            className="mb-3 text-4xl sm:text-5xl gradient-gold"
            style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontStyle: 'italic', fontWeight: 400, letterSpacing: '0.04em' }}
          >
            Psychic Central
          </h1>
        </FadeIn>

        {/* Subtitle — delayed fade-in with upward drift */}
        <div
          className="subtitle-drift mb-6 text-sm leading-relaxed"
          style={{ color: 'var(--text-muted)', letterSpacing: '0.03em', fontFamily: 'var(--font-jost), system-ui, sans-serif', fontWeight: 300 }}
        >
          Your complete cosmic blueprint
        </div>

        <FadeIn>
          <div className="divider mb-6" />

          {/* System icons row */}
          <div className="grid grid-cols-4 gap-2 sm:gap-5 mb-8">
            {SYSTEMS.map((s, i) => (
              <div
                key={s.name}
                className="text-center"
                style={{
                  opacity: 0,
                  animation: `subtitleIn 2s ease-out ${0.6 + i * 0.4}s forwards`,
                }}
              >                <div
                  className="mx-auto mb-2 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: `${SYSTEM_ACCENTS[i]}0e`,
                    border: `1px solid ${SYSTEM_ACCENTS[i]}28`,
                  }}
                >
                  <span style={{
                    color: SYSTEM_ACCENTS[i],
                    fontSize: s.name === 'Western' ? '1.5rem' : s.name === 'Bazi' ? '1.2rem' : '1.5rem',
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
            className="rounded-2xl p-5 sm:p-8 text-left space-y-5"
            style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)' }}
          >
            <div>
              <label className="block mb-2 text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--text-muted)', letterSpacing: '0.16em' }}>
                Full Name <span style={{ color: 'var(--gold)' }}>*</span>
              </label>
              <input
                className="cosmic-input"
                type="text"
                placeholder="e.g. Luna Celestine"
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="off"
                required
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

            <p className="text-center" style={{ fontSize: '0.69rem', color: 'var(--text-dim)', marginBottom: 4 }}>* Required to generate your reading</p>

            <div className="pt-2 text-center">
              <button type="submit" className="btn-gold w-full">
                Reveal My Reading
              </button>
              <p style={{ marginTop: 14, fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 400 }}>
                Trusted by 40,000+ seekers
              </p>
            </div>
          </form>
        </FadeIn>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-12 mb-6 flex flex-col items-center gap-1" style={{ fontFamily: 'var(--font-jost), system-ui, sans-serif', fontWeight: 300 }}>
        <p className="text-xs tracking-widest" style={{ color: 'var(--text-dim)', letterSpacing: '0.2em' }}>
          ANCIENT WISDOM · MODERN CLARITY
        </p>
        <p className="text-xs" style={{ color: 'var(--text-dim)', opacity: 0.6, fontSize: '0.65rem', marginTop: 8 }}>
          © {new Date().getFullYear()} Psychic Central · Powered by Path to Life
        </p>
      </footer>
    </main>
  );
}

