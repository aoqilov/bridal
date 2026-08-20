import { cn } from '@/utils/cn';
import type { ItemVariant } from '../helper.types.catalog';

type Props = {
  variants: ItemVariant[];
  /** `sm` — 2 ustunli karta, `md` — post lentasi (rasm kattaroq) */
  size?: 'sm' | 'md';
  /** Joylashuv rasmni o'rab turgan blokdan beriladi (`absolute bottom-2 left-2` kabi) */
  className?: string;
};

/** Rasmning pastki burchagidagi rang indikatori — bitta variant bo'lsa ko'rsatilmaydi */
const MAX_DOTS = 4;

export default function ItemColorDots({ variants, size = 'sm', className }: Props) {
  if (variants.length < 2) return null;

  const rest = variants.length - MAX_DOTS;

  return (
    <div
      className={cn(
        'flex items-center gap-1 rounded-full bg-overlay-light px-1.5 py-1 backdrop-blur',
        className,
      )}
    >
      {variants.slice(0, MAX_DOTS).map((v) => (
        <span
          key={v.id}
          className={cn(
            'rounded-full border border-white/60',
            size === 'md' ? 'h-3 w-3' : 'h-2.5 w-2.5',
          )}
          style={{ backgroundColor: v.colorHex }}
          title={v.colorName}
        />
      ))}
      {rest > 0 && (
        <span
          className={cn(
            'ml-0.5 font-medium text-overlay-fg-dark',
            size === 'md' ? 'text-[11px]' : 'text-[10px]',
          )}
        >
          +{rest}
        </span>
      )}
    </div>
  );
}
