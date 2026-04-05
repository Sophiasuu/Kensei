'use client';

import { useEffect, useRef, useState } from 'react';
import type { CosmicProfile } from '@/types';

const AXES: { key: keyof CosmicProfile; label: string; icon: string }[] = [
  { key: 'intuition',  label: 'Intuition',  icon: '◉' },
  { key: 'ambition',   label: 'Ambition',   icon: '↑' },
  { key: 'creativity', label: 'Creativity', icon: '✦' },
  { key: 'discipline', label: 'Discipline', icon: '◇' },
  { key: 'empathy',    label: 'Empathy',    icon: '♡' },
  { key: 'wisdom',     label: 'Wisdom',     icon: '∞' },
];

const CX = 150;
const CY = 150;
const R = 110;
const RINGS = [0.25, 0.5, 0.75, 1.0];

function polarToCart(angle: number, radius: number): [number, number] {
  const rad = (angle - 90) * (Math.PI / 180);
  return [CX + radius * Math.cos(rad), CY + radius * Math.sin(rad)];
}

function polygonPoints(values: number[]): string {
  const step = 360 / values.length;
  return values
    .map((v, i) => polarToCart(i * step, (v / 100) * R))
    .map(([x, y]) => `${x},${y}`)
    .join(' ');
}

export default function RadarChart({ profile }: { profile: CosmicProfile }) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  useEffect(() => {
    const delay = setTimeout(() => {
      startRef.current = performance.now();
      const duration = 1600;
      function tick(now: number) {
        const elapsed = now - startRef.current;
        const t = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - t, 3);
        setProgress(eased);
        if (t < 1) rafRef.current = requestAnimationFrame(tick);
      }
      rafRef.current = requestAnimationFrame(tick);
    }, 200);
    return () => { clearTimeout(delay); cancelAnimationFrame(rafRef.current); };
  }, []);

  const values = AXES.map(a => profile[a.key]);
  const animatedValues = values.map(v => v * progress);
  const step = 360 / AXES.length;

  return (
    <div className="radar-wrap">
      <svg
        viewBox="0 0 300 300"
        className="radar-svg"
        role="img"
        aria-label="Cosmic profile radar chart"
      >
        <defs>
          <radialGradient id="radar-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(93,186,125,0.15)" />
            <stop offset="100%" stopColor="rgba(93,186,125,0)" />
          </radialGradient>
          <filter id="radar-blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
          </filter>
        </defs>

        {/* Background glow */}
        <circle cx={CX} cy={CY} r={R + 10} fill="url(#radar-glow)" />

        {/* Grid rings */}
        {RINGS.map(pct => (
          <polygon
            key={pct}
            points={polygonPoints(AXES.map(() => pct * 100))}
            fill="none"
            stroke="var(--line)"
            strokeWidth={pct === 1 ? 1 : 0.5}
            opacity={pct === 1 ? 0.6 : 0.3}
          />
        ))}

        {/* Axis lines */}
        {AXES.map((_, i) => {
          const [x, y] = polarToCart(i * step, R);
          return (
            <line
              key={i}
              x1={CX} y1={CY} x2={x} y2={y}
              stroke="var(--line)"
              strokeWidth={0.5}
              opacity={0.4}
            />
          );
        })}

        {/* Data shape — soft glow layer */}
        <polygon
          points={polygonPoints(animatedValues)}
          fill="rgba(93,186,125,0.12)"
          stroke="none"
          filter="url(#radar-blur)"
        />

        {/* Data shape — main fill */}
        <polygon
          points={polygonPoints(animatedValues)}
          fill="rgba(93,186,125,0.08)"
          stroke="var(--gold)"
          strokeWidth={1.5}
          strokeLinejoin="round"
          opacity={progress > 0 ? 1 : 0}
        />

        {/* Axis labels */}
        {AXES.map((axis, i) => {
          const [x, y] = polarToCart(i * step, R + 24);
          return (
            <text
              key={axis.key}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              className="radar-label"
            >
              {axis.label}
            </text>
          );
        })}

        {/* Value labels near each point */}
        {AXES.map((_, i) => {
          const val = animatedValues[i];
          const [x, y] = polarToCart(i * step, (val / 100) * R - 14);
          return (
            <text
              key={`v-${i}`}
              x={progress > 0.05 ? x : CX}
              y={progress > 0.05 ? y : CY}
              textAnchor="middle"
              dominantBaseline="central"
              className="radar-value"
              opacity={progress > 0.1 ? Math.min(progress * 1.5, 1) : 0}
            >
              {Math.round(val)}
            </text>
          );
        })}
      </svg>

      {/* Stats legend below */}
      <div className="radar-legend">
        {AXES.map(axis => (
          <div key={axis.key} className="radar-legend-item">
            <span className="radar-legend-icon">{axis.icon}</span>
            <span className="radar-legend-label">{axis.label}</span>
            <span className="radar-legend-val">{profile[axis.key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
