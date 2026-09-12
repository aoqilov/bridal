import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MdAutoAwesome, MdClose, MdImage, MdMovie } from 'react-icons/md';
import { GENERATION_PRICE, VIDEO_TOTAL_PRICE } from '@/constants/pricing';
import { VIDEO_DURATION } from '../api/video/model';
import { formatCurrency } from '@/utils/formatCurrency';
import { cn } from '@/utils/cn';

/** Nima yasaymiz — rasm yoki video */
export type GenerateMode = 'image' | 'video';

type Props = {
  open: boolean;
  mode: GenerateMode;
  onModeChange: (mode: GenerateMode) => void;
  onClose: () => void;
  onStart: () => void;
  /** Birinchi generatsiya bepul — narx o'rnida "бесплатно" chiqadi */
  free: boolean;
  balance: number;
};

/**
 * "Генерация" bosilganda chiqadigan tanlov oynasi.
 * Rasm — hozirgi oqim. Video — avval rasm chiziladi, mijoz tasdiqlagach
 * o'sha kadrdan video yasaladi, shuning uchun narxi ham yig'ma.
 */
export default function GenerateModeModal({
  open,
  mode,
  onModeChange,
  onClose,
  onStart,
  free,
  balance,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onEsc);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onEsc);
    };
  }, [open, onClose]);

  if (!open) return null;

  const imagePrice = free ? 'бесплатно' : `${formatCurrency(GENERATION_PRICE)} сум`;
  // Bepul urinish rasm qismini qoplaydi — video rejimida faqat video puli qoladi
  const videoPrice = `${formatCurrency(
    free ? VIDEO_TOTAL_PRICE - GENERATION_PRICE : VIDEO_TOTAL_PRICE,
  )} сум`;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Что создать"
      className="fixed inset-0 z-50 grid place-items-center px-6"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-sm rounded border border-border bg-surface p-5 shadow-card-hover">
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
        >
          <MdClose size={18} />
        </button>

        <h2 className="pr-8 font-serif text-xl text-foreground">Что создать?</h2>
        <p className="mt-1 text-[11px] leading-relaxed text-muted">
          Образ уже собран — выберите формат результата.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <ModeCard
            active={mode === 'image'}
            icon={<MdImage size={22} />}
            title="Фото"
            note="Один кадр в полный рост"
            price={imagePrice}
            onClick={() => onModeChange('image')}
          />
          <ModeCard
            active={mode === 'video'}
            icon={<MdMovie size={22} />}
            title="Видео"
            note={`${VIDEO_DURATION} секунд, с движением`}
            price={videoPrice}
            onClick={() => onModeChange('video')}
          />
        </div>

        {/* Video oqimi rasmdan farq qiladi — mijoz buni oldindan bilishi kerak */}
        <p className="mt-3 rounded bg-surface-2 px-3 py-2.5 text-[11px] leading-relaxed text-muted">
          {mode === 'image'
            ? 'Сгенерируем изображение — его можно скачать и сохранить в галерее.'
            : 'Сначала создадим изображение и покажем его вам. Видео сделаем только после вашего подтверждения — если образ не понравится, стоимость видео вернётся на баланс.'}
        </p>

        <button
          type="button"
          onClick={onStart}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded bg-accent py-3 text-sm font-semibold text-accent-fg transition-colors hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <MdAutoAwesome size={18} />
          Генерация
        </button>

        <p className="mt-2 text-center text-[11px] text-subtle">
          Баланс: {formatCurrency(balance)} сум
        </p>
      </div>
    </div>,
    document.body,
  );
}

type CardProps = {
  active: boolean;
  icon: React.ReactNode;
  title: string;
  note: string;
  price: string;
  onClick: () => void;
};

function ModeCard({ active, icon, title, note, price, onClick }: CardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex flex-col items-center gap-1.5 rounded border px-2 py-4 text-center transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        active
          ? 'border-accent bg-accent-soft'
          : 'border-border bg-surface hover:bg-surface-2',
      )}
    >
      <span className={active ? 'text-primary' : 'text-muted'}>{icon}</span>
      <span className="text-[13px] text-foreground">{title}</span>
      <span className="text-[10px] leading-tight text-subtle">{note}</span>
      <span className="mt-0.5 text-[11px] font-semibold text-foreground tabular-nums">
        {price}
      </span>
    </button>
  );
}
