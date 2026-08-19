import { useState } from 'react';
import { cn } from '@/utils/cn';

type Props = {
  text: string;
  /** Shu uzunlikdan oshsa — yig'iladi */
  collapseAfter?: number;
};

export default function ItemDescription({ text, collapseAfter = 180 }: Props) {
  const collapsible = text.length > collapseAfter;
  const [open, setOpen] = useState(false);

  return (
    <div>
      <h2 className="mb-1.5 text-sm font-semibold text-foreground">Описание</h2>

      <div className="relative">
        <p
          className={cn(
            'text-sm leading-relaxed text-foreground/80',
            collapsible && !open && 'line-clamp-3',
          )}
        >
          {text}
        </p>
        {collapsible && !open && (
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-background to-transparent" />
        )}
      </div>

      {collapsible && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="mt-1.5 text-xs font-medium text-primary transition-colors hover:text-primary-hover"
        >
          {open ? 'Свернуть' : 'Читать полностью'}
        </button>
      )}
    </div>
  );
}
