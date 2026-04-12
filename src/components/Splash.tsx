'use client';

export default function Splash({ exiting = false }: { exiting?: boolean }) {
  return (
    <div className="splash" data-exiting={exiting} aria-hidden="true">
      <div className="splash-icon-wrap">
        <img src="/illustrations/moon-mobile.png" alt="" width={120} height={120} draggable={false} className="splash-icon" />
      </div>
      <span className="splash-sub">Ancient Wisdom · Modern Clarity</span>
    </div>
  );
}
