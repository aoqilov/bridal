import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MdClose, MdDelete, MdFileDownload } from 'react-icons/md';
import type { GeneratedImage } from '@/store/zustand';

type Props = {
  item: GeneratedImage | null;
  onClose: () => void;
  onDelete: (id: string) => void;
};

/** Tayyor rasmni to'liq ekranda ko'rish — yuklab olish va o'chirish tugmalari bilan */
export default function ImagePreview({ item, onClose, onDelete }: Props) {
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

      <div className="mx-auto flex w-full max-w-md gap-2 px-4 pb-6 pt-4">
        <button
          type="button"
          onClick={download}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-fg transition hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/10 py-3 text-sm font-semibold text-white transition hover:bg-danger focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <MdDelete size={18} />
          Удалить из памяти
        </button>
      </div>
    </div>,
    document.body,
  );
}
