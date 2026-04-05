'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage, LANGUAGES } from '@/context/LanguageContext';
import type { LangCode } from '@/context/LanguageContext';

export default function LanguageSelector({ compact, dropUp }: { compact?: boolean; dropUp?: boolean }) {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const current = LANGUAGES.find(l => l.code === lang);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="lang-globe-btn"
        aria-label="Change language"
        title="Change language"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
        </svg>
        {!compact && <span className="lang-globe-label">{current?.flag} {current?.label}</span>}
        {compact && <span className="lang-globe-label">{current?.flag}</span>}
      </button>

      {open && (
        <div className="lang-dropdown" style={dropUp ? {} : { bottom: 'auto', top: '100%', marginBottom: 0, marginTop: 6 }}>
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              className={`lang-option${l.code === lang ? ' active' : ''}`}
              onClick={() => { setLang(l.code as LangCode); setOpen(false); }}
            >
              <span>{l.flag}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
