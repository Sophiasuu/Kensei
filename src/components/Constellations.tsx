'use client';

/**
 * Sparse peripheral constellation animations.
 * 3 constellations with staggered fade-in/hold/fade-out cycles.
 * Lines trace via stroke-dashoffset animation.
 */

type Star = [number, number];
type Line = [number, number]; // indices into stars array

interface ConstellationDef {
  stars: Star[];
  lines: Line[];
  offset: number; // animation delay in seconds
  pos: { top?: string; bottom?: string; left?: string; right?: string };
  size: number; // viewBox dimension
}

const CONSTELLATIONS: ConstellationDef[] = [
  // Top-right corner — 5 stars
  {
    stars: [[18, 22], [45, 12], [70, 30], [55, 55], [30, 48]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]],
    offset: 0,
    pos: { top: '6%', right: '4%' },
    size: 90,
  },
  // Bottom-left corner — 4 stars
  {
    stars: [[10, 15], [38, 8], [55, 32], [22, 45]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0]],
    offset: 5.5,
    pos: { bottom: '12%', left: '3%' },
    size: 70,
  },
  // Mid-right — 6 stars, elongated
  {
    stars: [[8, 20], [25, 8], [50, 15], [65, 35], [42, 50], [15, 42]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [1, 4]],
    offset: 11,
    pos: { top: '55%', right: '2%' },
    size: 80,
  },
];

function lineLength(stars: Star[], a: number, b: number) {
  const dx = stars[b][0] - stars[a][0];
  const dy = stars[b][1] - stars[a][1];
  return Math.sqrt(dx * dx + dy * dy);
}

export default function Constellations() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden hidden sm:block" aria-hidden="true">
      {CONSTELLATIONS.map((c, ci) => {
        const cycleDuration = 16; // 4s in + 8s hold + 4s out
        return (
          <svg
            key={ci}
            className="absolute"
            style={{
              ...c.pos,
              width: `${c.size + 40}px`,
              height: `${c.size + 40}px`,
              animation: `constellationCycle ${cycleDuration}s ease-in-out ${c.offset}s infinite`,
              opacity: 0,
            }}
            viewBox={`-5 -5 ${c.size + 10} ${c.size + 10}`}
            fill="none"
          >
            {/* Connecting lines — trace in via dashoffset */}
            {c.lines.map(([a, b], li) => {
              const len = lineLength(c.stars, a, b);
              return (
                <line
                  key={`l-${li}`}
                  x1={c.stars[a][0]}
                  y1={c.stars[a][1]}
                  x2={c.stars[b][0]}
                  y2={c.stars[b][1]}
                  stroke="var(--text-dim)"
                  strokeWidth={0.5}
                  strokeOpacity={0.25}
                  strokeDasharray={len}
                  strokeDashoffset={len}
                  style={{
                    ['--dash-len' as string]: len,
                    animation: `traceLine ${cycleDuration}s ease-in-out ${c.offset + 0.3 + li * 0.4}s infinite`,
                  }}
                />
              );
            })}
            {/* Star dots */}
            {c.stars.map(([x, y], si) => (
              <circle
                key={`s-${si}`}
                cx={x}
                cy={y}
                r={si % 3 === 0 ? 1.5 : 1}
                fill="var(--text-muted)"
                opacity={0}
                style={{
                  animation: `constellationCycle ${cycleDuration}s ease-in-out ${c.offset + si * 0.15}s infinite`,
                }}
              />
            ))}
          </svg>
        );
      })}
    </div>
  );
}
