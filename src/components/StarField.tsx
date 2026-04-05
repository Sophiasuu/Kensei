'use client';

import { useEffect, useRef } from 'react';

export default function StarField() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < 220; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 2 + 0.5;
      star.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        width: ${size}px;
        height: ${size}px;
        animation-duration: ${2.5 + Math.random() * 4}s;
        animation-delay: ${Math.random() * 4}s;
      `;
      fragment.appendChild(star);
    }
    container.appendChild(fragment);
    return () => { container.innerHTML = ''; };
  }, []);

  return (
    <>
      <div ref={ref} className="fixed inset-0 pointer-events-none z-0 overflow-hidden" />
      {/* Gradient orbs */}
      <div
        className="orb fixed pointer-events-none z-0"
        style={{
          width: '600px', height: '600px',
          top: '-200px', left: '-200px',
          background: 'radial-gradient(circle, rgba(139,111,199,0.12) 0%, transparent 70%)',
          animationDuration: '14s',
        }}
      />
      <div
        className="orb fixed pointer-events-none z-0"
        style={{
          width: '500px', height: '500px',
          bottom: '-150px', right: '-150px',
          background: 'radial-gradient(circle, rgba(212,168,83,0.08) 0%, transparent 70%)',
          animationDuration: '18s',
          animationDelay: '6s',
        }}
      />
    </>
  );
}
