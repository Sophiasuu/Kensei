'use client';

import LotusBloom from '@/components/LotusBloom';

export default function Splash() {
  return (
    <div className="splash" aria-hidden="true">
      <LotusBloom size={200} />
      <span className="splash-title">Psychic Central</span>
      <div className="splash-line" />
      <span className="splash-sub">Ancient Wisdom · Modern Clarity</span>
    </div>
  );
}
