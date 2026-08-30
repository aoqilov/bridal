import { MdCheck } from 'react-icons/md';
import { cn } from '@/utils/cn';

/** md — yuz (64px), lg — kiyim (1.3x = 83px) */
export type CircleSize = 'md' | 'lg';

export const CIRCLE_SIZE_CLASS: Record<CircleSize, string> = {
  md: 'h-16 w-16',
  lg: 'h-[5.2rem] w-[5.2rem]',
};

const BADGE_CLASS: Record<CircleSize, string> = {
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

const BADGE_ICON: Record<CircleSize, number> = { md: 13, lg: 16 };

type Props = {
  image: string;
  label: string;
  active: boolean;
  onClick: () => void;
  size?: CircleSize;
  /** `rounded` — 10px burchakli kvadrat (kiyim qatori); `circle` — doira (yuzlar) */
  shape?: 'circle' | 'rounded';
};

/** Qatordagi rasm: doira yoki kvadrat + faol holatda oltin halqa va ✓ nishoni */
export default function PhotoCircle({
  image,
  label,
  active,
  onClick,
  size = 'md',
  shape = 'circle',
}: Props) {
  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-[10px]';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={cn(
        'relative shrink-0 transition',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        shapeClass,
        CIRCLE_SIZE_CLASS[size],
        !active && 'opacity-80 hover:opacity-100',
      )}
    >
      {/* Kesish faqat rasmga tegishli — nishon va halqa tashqarida qoladi */}
      <span
        className={cn(
          'block h-full w-full overflow-hidden bg-surface-2',
          shapeClass,
          active && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
        )}
      >
        <img src={image} alt="" className="h-full w-full object-cover" />
      </span>

      {active && (
        <span
          className={cn(
            'absolute -bottom-0.5 -right-0.5 grid place-items-center rounded-full bg-primary text-primary-fg ring-2 ring-background',
            BADGE_CLASS[size],
          )}
        >
          <MdCheck size={BADGE_ICON[size]} />
        </span>
      )}
    </button>
  );
}
