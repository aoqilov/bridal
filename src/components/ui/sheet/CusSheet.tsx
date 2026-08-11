import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  side?: 'bottom' | 'right';
};

export default function CusSheet({
  open,
  onClose,
  title,
  children,
  side = 'bottom',
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

  return createPortal(
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'relative z-10 bg-background text-foreground shadow-xl',
          side === 'bottom' && 'mt-auto w-full max-h-[85vh] rounded-t-2xl',
          side === 'right' && 'ml-auto h-full w-full max-w-sm rounded-l-2xl',
        )}
      >
        {side === 'bottom' && (
          <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-border" />
        )}

        {title && (
          <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
            <h2 className="text-base font-semibold">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1 text-muted hover:bg-surface-2 hover:text-foreground"
              aria-label="Закрыть"
            >
              ✕
            </button>
          </div>
        )}

        <div className="overflow-y-auto p-4">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
