'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useMemo, useState } from 'react';
import StarField from '@/components/StarField';
import FadeIn from '@/components/FadeIn';
import RadarChart from '@/components/RadarChart';
import { generateFullReading } from '@/lib/reading';
import type { FullReading, Pillar, PeriodInsight, DeepSection, LoveSection } from '@/types';

/* ─────────────────────────────────────────────────────────────────
   Vertical icons — distinct glyphs for each tradition
───────────────────────────────────────────────────────────────── */
const ICONS = {
  western:    '☽',   // Crescent moon / celestial
  vedic:      'ॐ',   // Om — Sanskrit symbol for Vedic tradition
  bazi:       '命',   // Mìng — destiny/fate in Chinese
  numerology: '∞',   // Infinity
} as const;

/* ─────────────────────────────────────────────────────────────────
   Shared primitives
───────────────────────────────────────────────────────────────── */
function Tag({ label, accent }: { label: string; accent?: string }) {
  return (
    <span
      className="pill"
      style={{
        background: accent ? `${accent}13` : 'var(--surface)',
        border: `1px solid ${accent ? `${accent}30` : 'var(--border)'}`,
        color: accent ?? 'var(--text-muted)',
      }}
    >
      {label}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>
      {children}
    </p>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="section-sep">
      <span className="section-sep-label">{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Bazi pillar card
───────────────────────────────────────────────────────────────── */
const ELEM_COL: Record<string, string> = {
  Wood: '#7B3FA0', Fire: '#c46a3a', Earth: '#b89038', Metal: '#8098b0', Water: '#4278c0',
};

function PillarCard({ pillar }: { pillar: Pillar }) {
  const col = ELEM_COL[pillar.stem.element] ?? '#888';
  return (
    <div
      className="rounded-xl p-3 text-center relative overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid var(--line)' }}
    >
      {/* thin top accent */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: col, opacity: 0.5 }} />
      <p className="text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--text-dim)' }}>{pillar.label}</p>
      <div className="text-3xl leading-none mb-0.5" style={{ fontFamily: 'serif', color: col }}>{pillar.stem.chinese}</div>
      <div className="text-3xl leading-none mb-2" style={{ fontFamily: 'serif', color: 'rgba(255,255,255,0.25)' }}>{pillar.branch.chinese}</div>
      <p className="text-xs font-semibold" style={{ color: col }}>{pillar.stem.polarity} {pillar.stem.element}</p>
      <p className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>{pillar.branch.animal}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Insight panel (daily / weekly / monthly)
───────────────────────────────────────────────────────────────── */
function InsightPanel({ insight, personalYear }: { insight: PeriodInsight; personalYear: number }) {
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-4">
        <div className="num-badge flex-shrink-0" style={{ width: 44, height: 44, fontSize: '1rem' }}>{insight.number}</div>
        <div>
          <p className="text-xs tracking-widest uppercase mb-0.5" style={{ color: 'var(--text-muted)' }}>
            Personal {insight.period.charAt(0).toUpperCase() + insight.period.slice(1)} · Year {personalYear}
          </p>
          <h3 className="font-display text-base font-semibold" style={{ color: 'var(--gold)' }}>{insight.theme}</h3>
        </div>
      </div>

      <p className="text-sm leading-relaxed" style={{ color: 'var(--text)', lineHeight: 1.9 }}>{insight.guidance}</p>

      <div>
        <SectionLabel>Opportunities</SectionLabel>
        <ul className="mt-2 space-y-1.5">
          {insight.opportunities.map((opp, i) => (
            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              <span style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 3 }}>—</span>{opp}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl p-4" style={{ background: 'rgba(199,125,255,0.06)', border: '1px solid rgba(199,125,255,0.15)' }}>
        <SectionLabel>Watch for</SectionLabel>
        <p className="text-sm leading-relaxed mt-1" style={{ color: 'var(--text-muted)' }}>{insight.watchFor}</p>
      </div>

      {insight.affirmation && (
        <div className="rounded-xl p-4 text-center" style={{ background: 'var(--gold-dim)', border: '1px solid var(--border-gold)' }}>
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--gold)' }}>Affirmation</p>
          <p className="font-display text-sm italic" style={{ color: 'var(--gold-light)' }}>&ldquo;{insight.affirmation}&rdquo;</p>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Deep-dive accordion
───────────────────────────────────────────────────────────────── */
function Accordion({
  icon, label, accent, children,
}: {
  icon: string; label: string; accent: string; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative overflow-hidden"
      style={{
        borderRadius: 12,
        border: `1px solid ${accent}22`,
        background: 'rgba(255,255,255,0.018)',
      }}
    >
      {/* thin top accent line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, opacity: 0.6 }} />

      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-6 py-4 text-left transition-colors"
        style={{ background: open ? `${accent}09` : 'transparent' }}
      >
        {/* vertical icon */}
        <span
          className="v-icon flex-shrink-0"
          style={{ color: accent, fontFamily: icon === ICONS.vedic ? 'serif' : 'inherit', width: 28, textAlign: 'center' }}
        >
          {icon}
        </span>
        <span className="text-sm font-semibold tracking-wide flex-1" style={{ color: open ? accent : 'var(--text)', letterSpacing: '0.03em' }}>
          {label}
        </span>
        <span
          className="text-base leading-none transition-transform duration-300"
          style={{ color: accent, transform: open ? 'rotate(45deg)' : 'none', display: 'inline-block' }}
        >
          +
        </span>
      </button>

      {open && (
        <div className="px-6 pb-6 pt-2" style={{ borderTop: `1px solid ${accent}12` }}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Deep Analysis — sectional life-area panels
───────────────────────────────────────────────────────────────── */
const DEEP_TABS = [
  { id: 'general'       as const, label: 'General',        icon: '✦', accent: '#C77DFF' },
  { id: 'love'          as const, label: 'Love',            icon: '♡', accent: '#D08AE8' },
  { id: 'careerFinance' as const, label: 'Career',          icon: '◈', accent: '#9B59D6' },
  { id: 'health'        as const, label: 'Health',          icon: '◎', accent: '#7B3FA0' },
  { id: 'pastLife'      as const, label: 'Past Life',       icon: '∞', accent: '#B88AE8' },
] as const;

type DeepTabId = typeof DEEP_TABS[number]['id'];

import type { DeepAnalysis } from '@/types';

function DeepPanel({ section, accent }: { section: DeepSection; accent: string }) {
  return (
    <div className="space-y-5 mt-6">
      {/* Overview */}
      <FadeIn>
        <div
          className="rounded-2xl p-6 sm:p-8 relative overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.018)', border: `1px solid ${accent}22` }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, opacity: 0.55 }} />
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text)', lineHeight: 2.0 }}>
            {section.overview}
          </p>
        </div>
      </FadeIn>

      {/* 4 Tradition lenses */}
      <div className="grid sm:grid-cols-2 gap-3">
        {section.lenses.map((lens, i) => (
          <FadeIn key={lens.tradition} delay={i * 55}>
            <div
              className="rounded-xl p-5 h-full relative overflow-hidden"
              style={{ background: `${lens.accent}09`, border: `1px solid ${lens.accent}20` }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: lens.accent, opacity: 0.35 }} />
              <div className="flex items-center gap-2 mb-3">
                <span style={{ color: lens.accent, fontSize: '1rem', lineHeight: 1 }}>{lens.icon}</span>
                <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: lens.accent, letterSpacing: '0.12em' }}>
                  {lens.tradition}
                </p>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)', lineHeight: 1.85 }}>
                {lens.insight}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Key themes */}
      <FadeIn delay={80}>
        <div
          className="rounded-xl p-5"
          style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}
        >
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--text-dim)', letterSpacing: '0.18em' }}>
            Key Themes
          </p>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
            {section.themes.map((theme, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span style={{ color: accent, flexShrink: 0, marginTop: 2, fontSize: '0.6rem' }}>◆</span>
                <span className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{theme}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Guidance */}
      <FadeIn delay={120}>
        <div
          className="rounded-xl p-6"
          style={{ background: `${accent}0e`, border: `1px solid ${accent}2c` }}
        >
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: accent, letterSpacing: '0.18em' }}>
            Guidance
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text)', lineHeight: 1.95 }}>
            {section.guidance}
          </p>
        </div>
      </FadeIn>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Love Panel — expanded premium love section
───────────────────────────────────────────────────────────────── */
function LovePanel({ love }: { love: LoveSection }) {
  const accent = '#D08AE8';
  return (
    <div className="space-y-6 mt-6">

      {/* ── Overview ── */}
      <FadeIn>
        <div
          className="rounded-2xl p-6 sm:p-8 relative overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.018)', border: `1px solid ${accent}22` }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, opacity: 0.55 }} />
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text)', lineHeight: 2.0 }}>
            {love.overview}
          </p>
        </div>
      </FadeIn>

      {/* ── Your Love Style — visual card ── */}
      <FadeIn delay={40}>
        <div className="love-style-card">
          <div className="love-style-header">
            <div className="love-style-icon">♡</div>
            <div>
              <p className="love-style-mode">{love.loveStyle.mode}</p>
              <p className="love-style-subtitle">Your Love Style</p>
            </div>
          </div>
          <div className="love-style-langs">
            {love.loveStyle.languages.map((lang, i) => (
              <span key={i} className="love-lang-tag">{lang}</span>
            ))}
          </div>
          <div className="love-style-grid">
            <div className="love-style-cell">
              <p className="love-cell-label">Attraction Energy</p>
              <p className="love-cell-text">{love.loveStyle.attractionEnergy}</p>
            </div>
            <div className="love-style-cell">
              <p className="love-cell-label">Commitment Style</p>
              <p className="love-cell-text">{love.loveStyle.commitmentStyle}</p>
            </div>
            <div className="love-style-cell">
              <p className="love-cell-label">In Conflict</p>
              <p className="love-cell-text">{love.loveStyle.conflictStyle}</p>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ── Your Ideal Partner — visual card ── */}
      <FadeIn delay={80}>
        <div className="partner-card">
          <div className="partner-header">
            <div className="partner-icon-wrap">
              <span className="partner-icon">✦</span>
            </div>
            <div>
              <p className="partner-archetype">{love.partnerProfile.archetype}</p>
              <p className="partner-element">Complementary Energy: {love.partnerProfile.element}</p>
            </div>
          </div>
          <p className="partner-desc">{love.partnerProfile.dynamicDescription}</p>
          <div className="partner-traits">
            {love.partnerProfile.traits.map((t, i) => (
              <span key={i} className="partner-trait-tag">{t}</span>
            ))}
          </div>
          <div className="partner-section">
            <p className="partner-section-label">What They Bring</p>
            <p className="partner-section-text">{love.partnerProfile.whatTheyBring}</p>
          </div>
          <div className="partner-recognition">
            <p className="partner-section-label">How You&apos;ll Recognise Them</p>
            <p className="partner-section-text">{love.partnerProfile.recognitionSign}</p>
          </div>
        </div>
      </FadeIn>

      {/* ── Love Timeline — visual timeline ── */}
      <FadeIn delay={120}>
        <div className="love-timeline-card">
          <p className="love-timeline-title">Love Timeline</p>
          <p className="love-timeline-subtitle">Key periods shaping your romantic destiny</p>
          <div className="love-timeline-track">
            {love.timelines.map((tl, i) => (
              <div key={i} className="love-tl-item">
                <div className="love-tl-dot-wrap">
                  <div className="love-tl-dot" />
                  {i < love.timelines.length - 1 && <div className="love-tl-line" />}
                </div>
                <div className="love-tl-content">
                  <div className="love-tl-header">
                    <span className="love-tl-period">{tl.period}</span>
                    <span className="love-tl-theme">{tl.theme}</span>
                  </div>
                  <p className="love-tl-desc">{tl.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ── 4 Tradition Lenses ── */}
      <div className="grid sm:grid-cols-2 gap-3">
        {love.lenses.map((lens, i) => (
          <FadeIn key={lens.tradition} delay={160 + i * 55}>
            <div
              className="rounded-xl p-5 h-full relative overflow-hidden"
              style={{ background: `${lens.accent}09`, border: `1px solid ${lens.accent}20` }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: lens.accent, opacity: 0.35 }} />
              <div className="flex items-center gap-2 mb-3">
                <span style={{ color: lens.accent, fontSize: '1rem', lineHeight: 1 }}>{lens.icon}</span>
                <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: lens.accent, letterSpacing: '0.12em' }}>
                  {lens.tradition}
                </p>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)', lineHeight: 1.85 }}>
                {lens.insight}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* ── Compatibility & Red Flags side by side ── */}
      <div className="grid sm:grid-cols-2 gap-3">
        <FadeIn delay={200}>
          <div className="love-compat-card">
            <p className="love-mini-label" style={{ color: '#7B3FA0' }}>Compatible Energies</p>
            <div className="love-compat-elements">
              {love.compatibilityElements.map((el, i) => (
                <span key={i} className="compat-el-tag">{el}</span>
              ))}
            </div>
          </div>
        </FadeIn>
        <FadeIn delay={240}>
          <div className="love-redflag-card">
            <p className="love-mini-label" style={{ color: '#D08AE8' }}>Patterns to Avoid</p>
            <div className="love-redflags">
              {love.redFlags.map((rf, i) => (
                <div key={i} className="love-rf-item">
                  <span className="love-rf-icon">⚠</span>
                  <span>{rf}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>

      {/* ── Themes ── */}
      <FadeIn delay={260}>
        <div
          className="rounded-xl p-5"
          style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}
        >
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--text-dim)', letterSpacing: '0.18em' }}>
            Key Themes
          </p>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
            {love.themes.map((theme, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span style={{ color: accent, flexShrink: 0, marginTop: 2, fontSize: '0.6rem' }}>◆</span>
                <span className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{theme}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ── Guidance ── */}
      <FadeIn delay={300}>
        <div
          className="rounded-xl p-6"
          style={{ background: `${accent}0e`, border: `1px solid ${accent}2c` }}
        >
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: accent, letterSpacing: '0.18em' }}>
            Guidance
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text)', lineHeight: 1.95 }}>
            {love.guidance}
          </p>
        </div>
      </FadeIn>
    </div>
  );
}

function DeepAnalysisSection({
  deepAnalysis,
  deepTab,
  setDeepTab,
}: {
  deepAnalysis: DeepAnalysis;
  deepTab: DeepTabId;
  setDeepTab: (t: DeepTabId) => void;
}) {
  const activeTab = DEEP_TABS.find(t => t.id === deepTab) ?? DEEP_TABS[0];
  const activeSection = deepAnalysis[deepTab];

  return (
    <section>
      <FadeIn>
        <SectionDivider label="Deep Analysis" />
      </FadeIn>

      <FadeIn delay={50}>
        <p
          className="text-center text-sm mb-8"
          style={{ color: 'var(--text-muted)', lineHeight: 1.9 }}
        >
          Your chart illuminates every domain of life. Explore each dimension below.
        </p>
      </FadeIn>

      {/* Tab bar */}
      <FadeIn delay={100}>
        <div className="deep-tab-bar">
          {DEEP_TABS.map(tab => (
            <button
              key={tab.id}
              className={`deep-tab-btn${deepTab === tab.id ? ' active' : ''}`}
              style={deepTab === tab.id
                ? { '--da': tab.accent } as React.CSSProperties
                : undefined}
              onClick={() => setDeepTab(tab.id)}
            >
              <span className="deep-tab-icon">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </FadeIn>

      {/* Active panel */}
      <DeepPanel key={deepTab} section={activeSection} accent={activeTab.accent} />
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Page section navigation (sticky left sidebar)
───────────────────────────────────────────────────────────────── */
const NAV_SECTIONS = [
  { id: 'sec-overview',  label: 'Overview',      icon: '✦' },
  { id: 'sec-synthesis', label: 'Synthesis',      icon: '◈' },
  { id: 'sec-chart',     label: 'Chart Details',  icon: '☽' },
  { id: 'sec-general',   label: 'General',        icon: '✧' },
  { id: 'sec-love',      label: 'Love',           icon: '♡' },
  { id: 'sec-career',    label: 'Career',         icon: '◈' },
  { id: 'sec-health',    label: 'Health',         icon: '◎' },
  { id: 'sec-pastlife',  label: 'Past Life',      icon: '∞' },
] as const;

function SideNav({ name, onChatOpen, onReturn }: { name: string | null; onChatOpen: () => void; onReturn: () => void }) {
  const [active, setActive] = useState(NAV_SECTIONS[0].id as string);

  useEffect(() => {
    const els = NAV_SECTIONS.map(({ id }) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }); },
      { rootMargin: '-15% 0px -60% 0px', threshold: 0 },
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <nav className="reading-sidenav" aria-label="Page sections" style={{ fontSize: '1rem' }}>
      <button className="sidenav-return-btn" style={{ fontSize: '0.95rem' }} onClick={onReturn}>← Return</button>
      {name && <p className="sidenav-name" style={{ fontSize: '1.15rem' }}>{name}</p>}
      <div className="sidenav-divider" />
      <p className="sidenav-title" style={{ fontSize: '0.8rem' }}>Sections</p>
      {NAV_SECTIONS.map(sec => (
        <button
          key={sec.id}
          className={`sidenav-item${active === sec.id ? ' active' : ''}`}
          style={{ fontSize: '1rem' }}
          onClick={() => document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        >
          <span className="sidenav-item-icon" style={{ fontSize: '1.15rem' }}>{sec.icon}</span>
          <span>{sec.label}</span>
        </button>
      ))}
      <div style={{ flex: 1 }} />
      <div className="sidenav-divider" />
      <button className="sidenav-oracle-btn" style={{ fontSize: '1rem' }} onClick={onChatOpen}>
        <span>✦</span>
        Ask Oracle
      </button>
    </nav>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Cosmic Advisor chat panel
───────────────────────────────────────────────────────────────── */
type ChatMessage = { role: 'user' | 'oracle'; text: string; id: number };

const CHAT_SUGGESTIONS = [
  'What is my greatest strength?',
  'Tell me about my love life',
  'What career suits my chart?',
  "What is my soul's purpose?",
];

function ChatPanel({ open, onClose, name }: { open: boolean; onClose: () => void; name: string | null }) {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: 'oracle',
    text: `Greetings${name ? `, ${name}` : ''}. I have read your chart across four ancient traditions — Western, Vedic, Bazi, and Numerology. Ask me anything about your cosmic blueprint.`,
    id: 0,
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 350);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function send() {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setMessages(prev => [...prev, { role: 'user', text, id: Date.now() }]);
    setInput('');
    setLoading(true);
    // TODO: connect to AI
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { role: 'oracle', text: 'The cosmic AI connection is being woven. Soon I will answer your deepest questions from the full knowledge of your chart.', id: Date.now() + 1 },
      ]);
      setLoading(false);
    }, 900);
  }

  return (
    <>
      {open && <div className="chat-overlay" onClick={onClose} aria-hidden="true" />}
      <div className={`chat-panel${open ? ' open' : ''}`} role="complementary" aria-label="Cosmic advisor">
        {/* Header */}
        <div className="chat-header">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
              style={{ background: 'rgba(199,125,255,0.12)', border: '1px solid rgba(199,125,255,0.3)', color: 'var(--gold)' }}
            >✦</div>
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--gold)', letterSpacing: '0.16em' }}>Cosmic Advisor</p>
              <p className="text-xs" style={{ color: 'var(--text-dim)' }}>AI · Coming soon</p>
            </div>
          </div>
          <button className="chat-close-btn" onClick={onClose} aria-label="Close chat">×</button>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`chat-bubble ${msg.role}`}>
              {msg.role === 'oracle' && <p className="chat-oracle-label">✦ Oracle</p>}
              <p>{msg.text}</p>
            </div>
          ))}
          {loading && (
            <div className="chat-bubble oracle">
              <p className="chat-oracle-label">✦ Oracle</p>
              <div className="chat-dots"><span /><span /><span /></div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestion pills */}
        {messages.length === 1 && (
          <div className="chat-suggestions">
            {CHAT_SUGGESTIONS.map(s => (
              <button
                key={s}
                className="chat-suggestion-btn"
                onClick={() => { setInput(s); inputRef.current?.focus(); }}
              >{s}</button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="chat-input-area">
          <textarea
            ref={inputRef}
            className="chat-input"
            placeholder="Ask your cosmic advisor…"
            value={input}
            rows={1}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          />
          <button
            className="chat-send-btn"
            onClick={send}
            disabled={!input.trim() || loading}
            aria-label="Send"
          >↑</button>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────────────────── */
export default function ReadingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [insightTab, setInsightTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [chatOpen, setChatOpen] = useState(false);

  const name = searchParams.get('name');
  const dob = searchParams.get('dob');
  const tob = searchParams.get('tob') ?? undefined;

  const reading: FullReading | null = useMemo(() => {
    if (!dob) return null;
    try {
      const [y, m, d] = dob.split('-').map(Number);
      const date = new Date(y, m - 1, d, 12, 0, 0);
      if (isNaN(date.getTime())) return null;
      return generateFullReading({ name: name ?? undefined, dateOfBirth: date, timeOfBirth: tob });
    } catch { return null; }
  }, [name, dob, tob]);

  if (!reading) {
    return (
      <main className="relative min-h-screen flex flex-col items-center justify-center px-4">
        <StarField />
        <div className="relative z-10 text-center">
          <p className="mb-6" style={{ color: 'var(--text-muted)' }}>No birth data found.</p>
          <button className="btn-gold" onClick={() => router.push('/')}>Return to Home</button>
        </div>
      </main>
    );
  }

  const { western, vedic, bazi, numerology, synthesis, daily, weekly, monthly } = reading;
  const pillars = [bazi.yearPillar, bazi.monthPillar, bazi.dayPillar, ...(bazi.hourPillar ? [bazi.hourPillar] : [])];

  const elemAccent: Record<string, string> = { Fire: '#c46a3a', Earth: '#b89038', Air: '#B88AE8', Water: '#4278c0' };
  const domColor = elemAccent[synthesis.dominantElement] ?? '#C77DFF';

  /* ── Section 1: Four system glance cards ── */
  const glanceCards = [
    {
      id: 'western', icon: ICONS.western, accent: '#C77DFF',
      system: 'Western', value: `${western.sunSign.symbol} ${western.sunSign.name}`,
      sub: `${western.sunSign.element} · ${western.sunSign.modality}`,
      meta: `Ruled by ${western.sunSign.rulingPlanet}`,
      traits: western.sunSign.traits.slice(0, 3),
    },
    {
      id: 'vedic', icon: ICONS.vedic, accent: '#FFD700',
      system: 'Vedic', value: vedic.rashi.name,
      sub: `${vedic.rashi.element} · ${vedic.rashi.rulingPlanet}`,
      meta: `${vedic.nakshatra.name} Nakshatra`,
      traits: vedic.rashi.traits.slice(0, 3),
    },
    {
      id: 'bazi', icon: ICONS.bazi, accent: '#7B3FA0',
      system: 'Bazi', value: `${bazi.dayMaster.polarity} ${bazi.dayMaster.element}`,
      sub: 'Day Master',
      meta: `${bazi.dayPillar.stem.chinese}${bazi.dayPillar.branch.chinese} · ${bazi.yearPillar.branch.animal} Year`,
      traits: bazi.dayMaster.traits.slice(0, 3),
    },
    {
      id: 'numerology', icon: ICONS.numerology, accent: '#B88AE8',
      system: 'Numerology',
      value: numerology.lifePath.isMaster ? `Master ${numerology.lifePath.number}` : `Life Path ${numerology.lifePath.number}`,
      sub: numerology.lifePath.keywords.slice(0, 2).join(' · '),
      meta: `Personal Year ${numerology.personalYear}`,
      traits: numerology.lifePath.traits.slice(0, 3),
    },
  ];

  return (
    <main className="reading-main relative min-h-screen pb-28 overflow-x-hidden">
      <StarField />
      <SideNav name={name} onChatOpen={() => setChatOpen(true)} onReturn={() => router.push('/')} />

      {/* ── Mobile top bar ──────────────────────────────── */}
      <div className="reading-topnav-mobile">
        <button
          onClick={() => router.push('/')}
          className="text-xs tracking-widest uppercase transition-opacity hover:opacity-50"
          style={{ color: 'var(--text-dim)', letterSpacing: '0.18em' }}
        >
          ← Return
        </button>
        {name && (
          <span className="font-display text-sm tracking-widest" style={{ color: 'var(--text-muted)' }}>{name}</span>
        )}
        <button
          className="chat-fab-mobile"
          onClick={() => setChatOpen(o => !o)}
          aria-label="Open cosmic advisor"
        >✦</button>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 pt-14 space-y-24">

        {/* ══════════════════════════════════════════════════
            SECTION 1 — Four Systems at a glance
        ══════════════════════════════════════════════════ */}
        <section id="sec-overview">
          <FadeIn>
            <div className="text-center mb-12">
              <p
                className="text-xs tracking-widest uppercase mb-4"
                style={{ color: 'var(--text-dim)', letterSpacing: '0.22em' }}
              >
                Cosmic Coordinates
              </p>
              {name && (
                <h1 className="font-display text-3xl sm:text-4xl font-semibold gradient-gold mb-2 tracking-wide">
                  {name}
                </h1>
              )}
              <div className="divider mt-5" />
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {glanceCards.map((card, i) => (
              <FadeIn key={card.id} delay={i * 80}>
                <div
                  className="rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden h-full"
                  style={{ background: `${card.accent}08`, border: `1px solid ${card.accent}22` }}
                >
                  {/* thin top accent */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${card.accent}, transparent)`, opacity: 0.7 }} />

                  {/* Icon + system name */}
                  <div className="flex items-center gap-2.5">
                    <span
                      className="v-icon"
                      style={{
                        color: card.accent,
                        fontFamily: card.id === 'vedic' ? 'serif' : 'inherit',
                        fontSize: card.id === 'bazi' ? '1.2rem' : '1.5rem',
                      }}
                    >
                      {card.icon}
                    </span>
                    <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: card.accent, opacity: 0.85 }}>
                      {card.system}
                    </span>
                  </div>

                  {/* Main value */}
                  <div>
                    <p className="font-display text-lg sm:text-xl font-semibold leading-tight" style={{ color: 'var(--text)' }}>
                      {card.value}
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{card.sub}</p>
                  </div>

                  {/* Meta */}
                  <p className="text-xs" style={{ color: card.accent, opacity: 0.75 }}>{card.meta}</p>

                  {/* Traits */}
                  <div className="flex flex-col gap-1 mt-auto pt-1" style={{ borderTop: '1px solid var(--line)' }}>
                    {card.traits.map(t => (
                      <span key={t} className="text-xs" style={{ color: 'var(--text-dim)' }}>— {t}</span>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            Cosmic Profile — Radar Chart
        ══════════════════════════════════════════════════ */}
        <FadeIn>
          <div
            className="rounded-2xl p-6 sm:p-10 relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.018)', border: '1px solid var(--border)' }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', opacity: 0.4 }} />
            <div className="text-center mb-6">
              <p className="text-xs tracking-widest uppercase mb-2" style={{ color: 'var(--text-dim)', letterSpacing: '0.22em' }}>Cosmic Profile</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
                Your strengths across six dimensions, derived from all four traditions.
              </p>
            </div>
            <RadarChart profile={reading.cosmicProfile} />
          </div>
        </FadeIn>

        {/* ══════════════════════════════════════════════════
            SECTION 2 — Summary / Synthesis
        ══════════════════════════════════════════════════ */}
        <section id="sec-synthesis">
          <FadeIn>
            <SectionDivider label="Synthesis" />
          </FadeIn>

          <FadeIn delay={60}>
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: `1px solid ${domColor}28`, background: 'rgba(255,255,255,0.018)' }}
            >
              {/* Archetype header */}
              <div
                className="px-7 py-6 flex items-center gap-5 relative overflow-hidden"
                style={{ borderBottom: `1px solid ${domColor}1a` }}
              >
                {/* Subtle accent line at top */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${domColor}, transparent)`, opacity: 0.5 }} />

                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: `${domColor}18`, border: `1px solid ${domColor}3a`, color: domColor }}
                >
                  {synthesis.archetypeSymbol}
                </div>
                <div className="flex-1">
                  <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--text-dim)', letterSpacing: '0.18em' }}>Your Archetype</p>
                  <h2 className="font-display text-xl font-semibold" style={{ color: 'var(--gold-light)', letterSpacing: '0.04em' }}>
                    {synthesis.archetype}
                  </h2>
                </div>
                <div className="hidden sm:flex flex-wrap gap-2 justify-end">
                  <Tag label={western.sunSign.name} accent="#C77DFF" />
                  <Tag label={vedic.rashi.name} accent="#FFD700" />
                  <Tag label={`${bazi.dayMaster.polarity} ${bazi.dayMaster.element}`} accent="#7B3FA0" />
                  <Tag label={`LP ${numerology.lifePath.number}`} accent="#B88AE8" />
                </div>
              </div>

              <div className="px-7 py-7 space-y-6">
                <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text)', lineHeight: 2.0 }}>
                  {synthesis.essence}
                </p>

                {/* Superpower */}
                <div
                  className="rounded-xl p-5"
                  style={{ background: `${domColor}0b`, border: `1px solid ${domColor}22` }}
                >
                  <p className="text-xs tracking-widest uppercase mb-2" style={{ color: domColor, letterSpacing: '0.16em' }}>Core Gift</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text)', lineHeight: 1.9 }}>
                    {synthesis.superpower}
                  </p>
                </div>

                {/* Strengths + Growth */}
                <div className="grid sm:grid-cols-2 gap-6 pt-2" style={{ borderTop: '1px solid var(--line)' }}>
                  <div>
                    <SectionLabel>Core Strengths</SectionLabel>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {synthesis.coreStrengths.map(s => <Tag key={s} label={s} accent={domColor} />)}
                    </div>
                  </div>
                  <div>
                    <SectionLabel>Areas to Grow</SectionLabel>
                    <ul className="space-y-2 mt-2">
                      {synthesis.growthAreas.map((g, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-xs mt-0.5 flex-shrink-0" style={{ color: 'var(--text-dim)' }}>◇</span>
                          <span className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{g}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Insight tabs */}
                <div style={{ borderTop: '1px solid var(--line)', paddingTop: '1.5rem' }}>
                  <div className="flex items-center justify-between mb-5">
                    <SectionLabel>Current Energies</SectionLabel>
                    <div className="flex gap-1.5">
                      {(['daily', 'weekly', 'monthly'] as const).map(t => (
                        <button
                          key={t}
                          className={`tab-btn ${insightTab === t ? 'active' : ''}`}
                          onClick={() => setInsightTab(t)}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {insightTab === 'daily' && <InsightPanel insight={daily} personalYear={numerology.personalYear} />}
                  {insightTab === 'weekly' && <InsightPanel insight={weekly} personalYear={numerology.personalYear} />}
                  {insightTab === 'monthly' && <InsightPanel insight={monthly} personalYear={numerology.personalYear} />}
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ══════════════════════════════════════════════════
            Sign-up CTA — after the hook
        ══════════════════════════════════════════════════ */}
        <FadeIn>
          <div className="signup-cta">
            <div className="signup-cta-glow" />
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--gold)', letterSpacing: '0.2em' }}>
              ✦ Save Your Reading
            </p>
            <h3 className="font-display text-xl sm:text-2xl font-semibold mb-3" style={{ color: 'var(--text)' }}>
              Your cosmic blueprint is ready
            </h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)', lineHeight: 1.85, maxWidth: 480 }}>
              Create a free account to save your full reading, track daily insights, unlock the AI Oracle, and revisit your chart anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="signup-cta-btn primary">
                Create Free Account
              </button>
              <button className="signup-cta-btn secondary">
                Continue Reading
              </button>
            </div>
          </div>
        </FadeIn>

        {/* ══════════════════════════════════════════════════
            SECTION 3 — System Details (accordion)
        ══════════════════════════════════════════════════ */}
        <section id="sec-chart">
          <FadeIn>
            <SectionDivider label="Chart Details" />
          </FadeIn>

          <div className="space-y-3">
            {/* Western */}
            <FadeIn delay={0}>
              <Accordion
                icon={ICONS.western}
                label={`Western Astrology — ${western.sunSign.symbol} ${western.sunSign.name}`}
                accent="#C77DFF"
              >
                <div className="space-y-5 pt-2">
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)', lineHeight: 1.9 }}>
                    {western.sunSign.description}
                  </p>
                  <div>
                    <SectionLabel>Traits</SectionLabel>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {western.sunSign.traits.map(t => <Tag key={t} label={t} accent="#C77DFF" />)}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center text-xs">
                    {[
                      { label: 'Element', val: western.sunSign.element },
                      { label: 'Modality', val: western.sunSign.modality ?? '—' },
                      { label: 'Ruler', val: western.sunSign.rulingPlanet },
                    ].map(({ label, val }) => (
                      <div key={label} className="rounded-xl p-3 relative overflow-hidden" style={{ background: 'rgba(199,125,255,0.06)', border: '1px solid rgba(199,125,255,0.18)' }}>
                        <p style={{ color: 'var(--text-dim)' }}>{label}</p>
                        <p className="font-semibold mt-1" style={{ color: '#C77DFF' }}>{val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Accordion>
            </FadeIn>

            {/* Vedic */}
            <FadeIn delay={60}>
              <Accordion
                icon={ICONS.vedic}
                label={`Vedic Astrology — ${vedic.rashi.name} · ${vedic.nakshatra.name}`}
                accent="#FFD700"
              >
                <div className="space-y-5 pt-2">
                  <div>
                    <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#FFD700', letterSpacing: '0.15em' }}>Rashi (Sidereal Sun Sign)</p>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)', lineHeight: 1.9 }}>
                      {vedic.rashi.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {vedic.rashi.traits.map(t => <Tag key={t} label={t} accent="#FFD700" />)}
                    </div>
                  </div>
                  <div className="rounded-xl p-5 space-y-3" style={{ background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.18)' }}>
                    <div className="flex items-baseline gap-2">
                      <p className="font-display text-base font-semibold" style={{ color: 'var(--text)' }}>{vedic.nakshatra.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-dim)' }}>· Pada {vedic.nakshatra.pada} · {vedic.nakshatra.englishMeaning}</p>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
                      Deity: {vedic.nakshatra.deity} · Ruling planet: {vedic.nakshatra.ruling}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)', lineHeight: 1.85 }}>
                      {vedic.nakshatra.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {vedic.nakshatra.qualities.map(q => <Tag key={q} label={q} accent="#FFD700" />)}
                    </div>
                  </div>
                </div>
              </Accordion>
            </FadeIn>

            {/* Bazi */}
            <FadeIn delay={120}>
              <Accordion
                icon={ICONS.bazi}
                label={`Bazi · ${bazi.dayMaster.polarity} ${bazi.dayMaster.element} Day Master`}
                accent="#7B3FA0"
              >
                <div className="space-y-5 pt-2">
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)', lineHeight: 1.9 }}>
                    {bazi.dayMaster.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {bazi.dayMaster.traits.map(t => <Tag key={t} label={t} accent="#7B3FA0" />)}
                  </div>
                  <div>
                    <p className="text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--text-dim)', letterSpacing: '0.16em' }}>Four Pillars</p>
                    <div className={`grid gap-2 ${pillars.length === 4 ? 'grid-cols-4' : 'grid-cols-3'}`}>
                      {pillars.map(p => <PillarCard key={p.label} pillar={p} />)}
                    </div>
                  </div>
                </div>
              </Accordion>
            </FadeIn>

            {/* Numerology */}
            <FadeIn delay={180}>
              <Accordion
                icon={ICONS.numerology}
                label={`Numerology — ${numerology.lifePath.isMaster ? `Master ${numerology.lifePath.number}` : `Life Path ${numerology.lifePath.number}`}`}
                accent="#B88AE8"
              >
                <div className="space-y-5 pt-2">
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)', lineHeight: 1.9 }}>
                    {numerology.lifePath.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {numerology.lifePath.traits.map(t => <Tag key={t} label={t} accent="#B88AE8" />)}
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    {[
                      { label: 'Personal Year', value: numerology.personalYear },
                      { label: 'Personal Month', value: numerology.personalMonth },
                      { label: 'Personal Day', value: numerology.personalDay },
                    ].map(({ label, value }) => (
                      <div key={label} className="rounded-xl p-4 relative overflow-hidden" style={{ background: 'rgba(123,63,160,0.08)', border: '1px solid rgba(123,63,160,0.22)' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: '#B88AE8', opacity: 0.4 }} />
                        <div className="text-2xl font-bold mb-1" style={{ color: '#B88AE8' }}>{value}</div>
                        <p className="text-xs" style={{ color: 'var(--text-dim)' }}>{label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl p-4" style={{ background: 'rgba(123,63,160,0.06)', border: '1px solid rgba(123,63,160,0.18)' }}>
                    <SectionLabel>The Shadow</SectionLabel>
                    <p className="text-sm leading-relaxed mt-1" style={{ color: 'var(--text-muted)' }}>
                      {numerology.lifePath.challenge}
                    </p>
                  </div>
                </div>
              </Accordion>
            </FadeIn>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            SECTION 4 — General Reading
        ══════════════════════════════════════════════════ */}
        <section id="sec-general">
          <FadeIn><SectionDivider label="General Reading" /></FadeIn>
          <DeepPanel section={reading.deepAnalysis.general} accent="#C77DFF" />
        </section>

        {/* ══════════════════════════════════════════════════
            SECTION 5 — Love & Relationships
        ══════════════════════════════════════════════════ */}
        <section id="sec-love">
          <FadeIn><SectionDivider label="Love & Relationships" /></FadeIn>
          <LovePanel love={reading.deepAnalysis.love} />
        </section>

        {/* ══════════════════════════════════════════════════
            SECTION 6 — Career & Finance
        ══════════════════════════════════════════════════ */}
        <section id="sec-career">
          <FadeIn><SectionDivider label="Career & Finance" /></FadeIn>
          <DeepPanel section={reading.deepAnalysis.careerFinance} accent="#9B59D6" />
        </section>

        {/* ══════════════════════════════════════════════════
            SECTION 7 — Health & Vitality
        ══════════════════════════════════════════════════ */}
        <section id="sec-health">
          <FadeIn><SectionDivider label="Health & Vitality" /></FadeIn>
          <DeepPanel section={reading.deepAnalysis.health} accent="#7B3FA0" />
        </section>

        {/* ══════════════════════════════════════════════════
            SECTION 8 — Past Life & Soul Purpose
        ══════════════════════════════════════════════════ */}
        <section id="sec-pastlife">
          <FadeIn><SectionDivider label="Past Life & Soul Purpose" /></FadeIn>
          <DeepPanel section={reading.deepAnalysis.pastLife} accent="#B88AE8" />
        </section>

      </div>

      <footer className="relative z-10 mt-20 text-center pb-8">
        <div className="divider mb-6" />
        <p className="text-xs tracking-widest uppercase" style={{ color: 'var(--text-dim)', letterSpacing: '0.22em' }}>
          Psychic Central · Ancient Wisdom · Modern Clarity
        </p>
      </footer>

      <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} name={name} />
    </main>
  );
}

