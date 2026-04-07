'use client';

import { memo } from 'react';

/* ──────── geometry (ported from RN version) ──────── */

const CX = 100;
const CY = 152;

const CORE_D = 'M0,0 C-6,-22 -5,-52 0,-68 C5,-52 6,-22 0,0Z';
const MED_D  = 'M0,0 C-8,-18 -8,-46 0,-62 C8,-46 8,-18 0,0Z';
const WIDE_D = 'M0,0 C-10,-15 -10,-40 0,-56 C10,-40 10,-15 0,0Z';

type PetalDef = {
  tier: 1 | 2 | 3;
  angle: number;
  d: string;
  grad: string;
};

const PETALS: PetalDef[] = [
  // Tier 3 — outer ring
  { tier: 3, angle: -62, d: WIDE_D, grad: 'gO' },
  { tier: 3, angle:  62, d: WIDE_D, grad: 'gO' },
  { tier: 3, angle: -48, d: WIDE_D, grad: 'gO' },
  { tier: 3, angle:  48, d: WIDE_D, grad: 'gO' },
  { tier: 3, angle: -34, d: WIDE_D, grad: 'gO' },
  { tier: 3, angle:  34, d: WIDE_D, grad: 'gO' },
  { tier: 3, angle: -18, d: MED_D,  grad: 'gO' },
  { tier: 3, angle:  18, d: MED_D,  grad: 'gO' },
  // Tier 2 — inner ring
  { tier: 2, angle: -22, d: MED_D, grad: 'gI' },
  { tier: 2, angle:  22, d: MED_D, grad: 'gI' },
  { tier: 2, angle:  -8, d: MED_D, grad: 'gI' },
  { tier: 2, angle:   8, d: MED_D, grad: 'gI' },
  // Tier 1 — core
  { tier: 1, angle: 0, d: CORE_D, grad: 'gC' },
];

const STEM_D = `M${CX},${CY} Q${CX - 2},${CY + 22} ${CX},${CY + 48}`;

const SEEDS = [
  { cx: CX, cy: CY - 5 },
  { cx: CX - 3.5, cy: CY - 9 },
  { cx: CX + 3.5, cy: CY - 9 },
  { cx: CX, cy: CY - 13 },
];

/** Map tier → animation delay in ms — cascade effect */
function tierDelay(tier: 1 | 2 | 3): number {
  if (tier === 1) return 300;   // core first
  if (tier === 2) return 800;   // inner ring
  return 1400;                  // outer ring
}

function tierDuration(tier: 1 | 2 | 3): number {
  if (tier === 1) return 1600;
  if (tier === 2) return 1800;
  return 2000;
}

/* ──────── main component ──────── */

function LotusBloom({ size = 240 }: { size?: number }) {
  return (
    <div className="lotus-wrap">
      <div className="lotus-breathe" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 200 210"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="lotus-aura">
              <stop offset="0%" stopColor="#8C7AAE" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#8C7AAE" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="gC" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#E8E6E3" />
              <stop offset="100%" stopColor="#A8A4A0" />
            </linearGradient>
            <linearGradient id="gI" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#D8D5D2" />
              <stop offset="100%" stopColor="#908C88" />
            </linearGradient>
            <linearGradient id="gO" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#CCCAC7" />
              <stop offset="100%" stopColor="#787572" />
            </linearGradient>
            <linearGradient id="gStem" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B0ADA8" />
              <stop offset="100%" stopColor="#8A8784" />
            </linearGradient>
          </defs>

          {/* Aura glow */}
          <circle cx={CX} cy={CY - 20} r={80} fill="url(#lotus-aura)" />

          {/* Stem */}
          <path
            className="lotus-stem"
            d={STEM_D}
            stroke="url(#gStem)"
            strokeWidth={1.8}
            fill="none"
            strokeLinecap="round"
          />

          {/* Petals */}
          {PETALS.map((p, i) => (
            <g
              key={i}
              className="lotus-petal"
              style={{
                transformOrigin: `${CX}px ${CY}px`,
                animationDelay: `${tierDelay(p.tier)}ms`,
                animationDuration: `${tierDuration(p.tier)}ms`,
                '--petal-angle': `${p.angle}deg`,
                '--petal-scale': p.tier === 1 ? '0.5' : '0.6',
              } as React.CSSProperties}
            >
              <path
                d={p.d}
                fill={`url(#${p.grad})`}
                stroke="rgba(46,42,39,0.25)"
                strokeWidth={0.7}
                strokeLinecap="round"
                strokeLinejoin="round"
                transform={`translate(${CX},${CY})`}
              />
            </g>
          ))}

          {/* Center seed dots */}
          {SEEDS.map((s, i) => (
            <circle
              key={`s-${i}`}
              className="lotus-seed"
              cx={s.cx}
              cy={s.cy}
              r={2}
              fill="#9A9692"
              style={{ animationDelay: `${1800 + i * 120}ms` }}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

export default memo(LotusBloom);
