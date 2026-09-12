import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  side?: 'bottom' | 'right';
  /** Kontent o'ramining klasslari — standart ichki bo'shliqni almashtirish uchun */
  contentClassName?: string;
  /**
   * Panelning o'zi uchun klasslar — o'lcham va radiusni bosib o'tish uchun
   * (masalan butun ekranni egallovchi filtr: `max-w-none rounded-none`).
   */
  panelClassName?: string;
};

export default function CusSheet({
  open,
  onClose,
  title,
  children,
  side = 'bottom',
  contentClassName,
  panelClassName,
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
      <div className="animate-overlay-in absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          // flex-ustun — uzun kontent panel ichida scroll bo'lsin, tashqariga chiqib ketmasin
          'relative z-10 flex flex-col overflow-hidden bg-background text-foreground shadow-xl',
          side === 'bottom' && 'animate-sheet-up mt-auto max-h-[85vh] w-full rounded-t-2xl',
          side === 'right' && 'animate-sheet-right ml-auto h-full w-full max-w-sm rounded-l-2xl',
          panelClassName,
        )}
      >
        {/* Tortish tayoqchasi — pastdagi panelda gorizontal, yondagida vertikal */}
        {side === 'bottom' ? (
          <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-border" />
        ) : (
          <div className="absolute left-1.5 top-1/2 h-10 w-1 -translate-y-1/2 rounded-full bg-border" />
        )}

        {title && (
          <div className="flex shrink-0 items-center justify-between border-b border-border-subtle px-4 py-3">
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

        <div
          className={cn(
            'subtle-scrollbar min-h-0 flex-1 overflow-y-auto',
            contentClassName ?? 'p-4',
          )}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
