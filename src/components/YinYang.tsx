'use client';

import { useEffect, useId, useRef } from 'react';

/**
 * Animated Yin-Yang — two halves orbit each other
 * and slowly come together when the component mounts / becomes visible.
 */
export default function YinYang({ size = 160 }: { size?: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, '');

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    // Small delay so the initial (spread-apart) state paints first
    const t = requestAnimationFrame(() => el.classList.add('yy-play'));
    return () => cancelAnimationFrame(t);
  }, []);

  const r = size / 2;
  const sm = r / 2;
  const dot = size * 0.065;

  return (
    <div ref={wrapRef} className="yy-wrap" style={{ width: size, height: size }}>
      {/* ── Yin (dark) half ── */}
      <svg
        className="yy-half yy-yin"
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          <clipPath id={`yy-clip-yin-${id}`}>
            <path d={`M${r},0 A${r},${r} 0 0,1 ${r},${size} A${sm},${sm} 0 0,0 ${r},${r} A${sm},${sm} 0 0,1 ${r},0 Z`} />
          </clipPath>
        </defs>
        <circle cx={r} cy={r} r={r} clipPath={`url(#yy-clip-yin-${id})`} fill="var(--yy-dark, #0e0e12)" />
        <circle cx={r} cy={r + sm} r={dot} fill="var(--yy-light, #e8dcc8)" />
      </svg>

      {/* ── Yang (light) half ── */}
      <svg
        className="yy-half yy-yang"
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          <clipPath id={`yy-clip-yang-${id}`}>
            <path d={`M${r},0 A${r},${r} 0 0,0 ${r},${size} A${sm},${sm} 0 0,1 ${r},${r} A${sm},${sm} 0 0,0 ${r},0 Z`} />
          </clipPath>
        </defs>
        <circle cx={r} cy={r} r={r} clipPath={`url(#yy-clip-yang-${id})`} fill="var(--yy-light, #e8dcc8)" />
        <circle cx={r} cy={sm} r={dot} fill="var(--yy-dark, #0e0e12)" />
      </svg>

      {/* Glow behind */}
      <div className="yy-glow" />
    </div>
  );
}
