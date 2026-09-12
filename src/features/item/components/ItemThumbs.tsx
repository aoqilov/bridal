import { PLATE_FRAME, PLATE_BORDER, PLATE_BORDER_ACTIVE } from '@/components/ui';
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
              PLATE_FRAME,
              'h-20 w-16 shrink-0 transition-all duration-200',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              active
                ? PLATE_BORDER_ACTIVE
                : cn(PLATE_BORDER, 'opacity-60 hover:opacity-100'),
            )}
          >
            <span className="block h-full w-full overflow-hidden rounded-sm">
              <img
                src={src}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </span>
          </button>
        );
      })}
    </div>
  );
}
