import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MdMovie } from 'react-icons/md';
import { PLATE_BORDER, PLATE_FRAME } from '@/components/ui';
import { VIDEO_DURATION } from '../api/video/model';
import { cn } from '@/utils/cn';

type Props = {
  /** Tasdiqlash kutilayotgan rasm; `null` — oyna yopiq */
  image: string | null;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * Video rejimidagi oraliq bosqich: rasm tayyor, mijoz uni ko'rib tasdiqlaydi.
 * Seedance aynan shu kadrni birinchi kadr sifatida oladi — shuning uchun
 * tasdiqlash muhim: yoqmagan obrazdan video yasash pulni behuda sarflaydi.
 *
 * Rasm har holda galereyada qoladi (puli to'langan), bekor qilinsa faqat
 * video qismi qaytariladi.
 */
export default function ConfirmLookModal({ image, onConfirm, onCancel }: Props) {
  useEffect(() => {
    if (!image) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [image]);

  if (!image) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Подтвердите образ"
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto px-6 py-8"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative w-full max-w-sm rounded border border-border bg-surface p-5 text-center shadow-card-hover">
        <h2 className="font-serif text-xl text-foreground">Нравится образ?</h2>
        <p className="mt-1 text-[11px] leading-relaxed text-muted">
          Видео на {VIDEO_DURATION} секунд будет создано из этого кадра — лицо,
          платье и фон останутся такими же.
        </p>

        <div className={cn(PLATE_FRAME, PLATE_BORDER, 'mx-auto mt-4 w-44')}>
          <div className="aspect-[3/4] overflow-hidden rounded-sm bg-surface-2">
            <img src={image} alt="" className="h-full w-full object-cover" />
          </div>
        </div>

        <button
          type="button"
          onClick={onConfirm}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded bg-accent py-3 text-sm font-semibold text-accent-fg transition-colors hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <MdMovie size={18} />
          Да, создать видео
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="mt-2 w-full rounded border border-border bg-surface py-3 text-sm text-foreground transition-colors hover:bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Оставить только фото
        </button>

        <p className="mt-2 text-[10px] leading-relaxed text-subtle">
          Изображение уже сохранено в «Рисунки». Если откажетесь — стоимость
          видео вернётся на баланс.
        </p>
      </div>
    </div>,
    document.body,
  );
}
