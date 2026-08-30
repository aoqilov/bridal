import { cn } from '@/utils/cn';

type Props = {
  className?: string;
};

/**
 * Ogohlantirish — generatsiya faqat taxminiy tasavvur beradi,
 * haqiqiy примерка o'rnini bosmaydi. Ko'zga tashlanishi uchun qizil rangda.
 */
export default function GenerationNote({ className }: Props) {
  return (
    <p className={cn('text-[11px] font-medium leading-relaxed text-danger', className)}>
      Это лишь примерная визуализация — чтобы на глаз прикинуть, как наряд смотрится
      на вас. Она не передаёт посадку так точно, как настоящая примерка. Ждём вас в
      салоне!
    </p>
  );
}
