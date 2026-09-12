import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

type Props = {
  children: ReactNode;
  /** O'ng tomondagi qo'shimcha element — havola yoki tugma */
  action?: ReactNode;
  className?: string;
};

/** Tovar sahifasidagi bo'lim sarlavhasi — brend uslubi uchun serif */
export default function SectionTitle({ children, action, className }: Props) {
  return (
    <div className={cn('mb-3 flex items-baseline justify-between gap-3', className)}>
      <h2 className="font-serif text-[19px] leading-tight text-foreground">{children}</h2>
      {action}
    </div>
  );
}
