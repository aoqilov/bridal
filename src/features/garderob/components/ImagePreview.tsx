import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MdClose, MdDelete, MdFileDownload, MdMovie } from 'react-icons/md';
import { VIDEO_PRICE } from '@/constants/pricing';
import type { GeneratedImage } from '@/store/zustand';
import { formatCurrency } from '@/utils/formatCurrency';

type Props = {
  item: GeneratedImage | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  /** Berilsa — shu kadrdan video yasash tugmasi chiqadi */
  onCreateVideo?: (image: string) => void;
};

/** Tayyor rasmni to'liq ekranda ko'rish — yuklab olish va o'chirish tugmalari bilan */
export default function ImagePreview({
  item,
  onClose,
  onDelete,
  onCreateVideo,
}: Props) {
  useEffect(() => {
    if (!item) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onEsc);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onEsc);
    };
  }, [item, onClose]);

  if (!item) return null;

  // Rasm o'z domenimizdan — `download` atributi bilan saqlanadi
  const download = () => {
    const link = document.createElement('a');
    link.href = item.image;
    link.download = `amira-obraz-${item.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Просмотр изображения"
      className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-sm"
    >
      <div className="flex justify-end p-3">
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <MdClose size={22} />
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center px-4">
        <img
          src={item.image}
          alt=""
          className="max-h-full max-w-full rounded-xl object-contain"
        />
      </div>

      <div className="mx-auto w-full max-w-md px-4 pb-6 pt-4">
        {/* Tayyor kadrdan video — rasm qayta chizilmaydi, faqat video puli yechiladi */}
        {onCreateVideo && (
          <button
            type="button"
            onClick={() => onCreateVideo(item.image)}
            className="mb-2 flex w-full items-center justify-center gap-2 rounded bg-accent py-3 text-sm font-semibold text-accent-fg transition hover:bg-accent-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <MdMovie size={18} />
            Создать видео
            <span className="font-normal opacity-90">
              · {formatCurrency(VIDEO_PRICE)} сум
            </span>
          </button>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={download}
            className="flex flex-1 items-center justify-center gap-2 rounded border border-white/20 bg-white/10 py-3 text-sm font-semibold text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <MdFileDownload size={18} />
            Скачать
          </button>

          <button
            type="button"
            onClick={() => {
              onDelete(item.id);
              onClose();
            }}
            className="flex flex-1 items-center justify-center gap-2 rounded bg-white/10 py-3 text-sm font-semibold text-white transition hover:bg-danger focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <MdDelete size={18} />
            Удалить из памяти
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
