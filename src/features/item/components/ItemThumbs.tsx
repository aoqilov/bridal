import { cn } from '@/utils/cn';

type Props = {
  images: string[];
  activeIndex: number;
  onSelect: (index: number) => void;
  className?: string;
};

/** Qolgan rasmlar lentasi — asosiy rasmdan alohida, kartochka ichida */
export default function ItemThumbs({
  images,
  activeIndex,
  onSelect,
  className,
}: Props) {
  if (images.length < 2) return null;

  return (
    <div
      className={cn(
        'flex gap-2 overflow-x-auto px-4',
        '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className,
      )}
    >
      {images.map((src, idx) => {
        const active = activeIndex === idx;
        return (
          <button
            key={src}
            type="button"
            onClick={() => onSelect(idx)}
            aria-label={`Фото ${idx + 1}`}
            aria-current={active}
            className={cn(
              'h-20 w-16 shrink-0 overflow-hidden rounded-xl border transition-all duration-200',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              active
                ? 'border-primary ring-2 ring-primary-soft'
                : 'border-border-subtle opacity-60 hover:opacity-100',
            )}
          >
            <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
          </button>
        );
      })}
    </div>
  );
}
