'use client';

import Image from 'next/image';

export type IllustrationName =
  | 'hourglass'
  | 'moon-mobile'
  | 'sleeping-moon'
  | 'all-seeing-eye'
  | 'tarot-cards'
  | 'crystal-ball'
  | 'moon-goddess'
  | 'saturn'
  | 'sun-face'
  | 'zodiac-wheel'
  | 'sacred-book'
  | 'potion-bottle'
  | 'crystals'
  | 'quill';

type Placement =
  | 'corner-tr'
  | 'corner-tl'
  | 'corner-br'
  | 'corner-bl'
  | 'float-left'
  | 'float-right'
  | 'center'
  | 'inline';

const PLACEMENT_CLASSES: Record<Placement, string> = {
  'corner-tr': 'mystic-ill--corner-tr',
  'corner-tl': 'mystic-ill--corner-tl',
  'corner-br': 'mystic-ill--corner-br',
  'corner-bl': 'mystic-ill--corner-bl',
  'float-left': 'mystic-ill--float-left',
  'float-right': 'mystic-ill--float-right',
  center: 'mystic-ill--center',
  inline: 'mystic-ill--inline',
};

interface Props {
  name: IllustrationName;
  placement?: Placement;
  size?: number;
  opacity?: number;
  className?: string;
}

export default function MysticIllustration({
  name,
  placement = 'inline',
  size = 120,
  opacity = 0.18,
  className = '',
}: Props) {
  return (
    <div
      className={`mystic-ill ${PLACEMENT_CLASSES[placement]} ${className}`}
      style={{ '--ill-size': `${size}px`, '--ill-opacity': opacity } as React.CSSProperties}
      aria-hidden="true"
    >
      <Image
        src={`/illustrations/${name}.png`}
        alt=""
        width={size}
        height={size}
        className="mystic-ill__img"
        draggable={false}
      />
    </div>
  );
}
