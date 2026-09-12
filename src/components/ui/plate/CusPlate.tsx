import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

/**
 * Rasm ramkasi — yupqa chegara, ichkarida oq maydon va yumshoq soya.
 * Klasslar konstanta sifatida ham chiqarilgan: `motion.div` kabi
 * o'z elementini talab qiladigan joylar shu qiymatlarni ishlatadi,
 * shunda ramka ko'rinishi bitta joydan boshqariladi.
 */
export const PLATE_FRAME = 'rounded border bg-surface p-1 shadow-plate transition-colors';
export const PLATE_BORDER = 'border-border';
export const PLATE_BORDER_ACTIVE = 'border-primary';
export const PLATE_INNER = 'relative overflow-hidden rounded-sm bg-surface-2';

type Props = {
  /** Ichki rasm nisbati — Tailwind `aspect-*` klassi */
  ratio?: string;
  /** Tanlangan holat — ramka oltin-jigarrangga o'tadi */
  active?: boolean;
  className?: string;
  innerClassName?: string;
  /** Rasm va uning ustidagi belgilar */
  children: ReactNode;
};

export default function CusPlate({
  ratio = 'aspect-square',
  active,
  className,
  innerClassName,
  children,
}: Props) {
  return (
    <div
      className={cn(
        PLATE_FRAME,
        active ? PLATE_BORDER_ACTIVE : PLATE_BORDER,
        className,
      )}
    >
      <div className={cn(PLATE_INNER, ratio, innerClassName)}>{children}</div>
    </div>
  );
}
