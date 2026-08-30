import { MdCheck } from 'react-icons/md';
import { cn } from '@/utils/cn';
import { defaultVariant, type CatalogItem } from '@/features/catalog';

type Props = {
  item: CatalogItem;
  selected: boolean;
  onToggle: () => void;
};

/**
 * Tanlash rejimidagi sevimli tovar — bosilsa tovar sahifasiga o'tmaydi,
 * garderobga olinadi/qaytariladi (`ItemThumb` ning tanlanadigan varianti).
 */
export default function FavoritePickThumb({ item, selected, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      aria-label={item.name}
      className={cn(
        'relative block aspect-[3/4] w-full overflow-hidden bg-surface-2 transition',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary',
        selected ? 'ring-2 ring-inset ring-primary' : 'opacity-90 hover:opacity-100',
      )}
    >
      <img
        src={defaultVariant(item).mainImage}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />

      {/* Belgilanmagan holatda ham bo'sh doira ko'rinadi — tanlash mumkinligi bilinsin */}
      <span
        className={cn(
          'absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full border-2 transition',
          selected
            ? 'border-primary bg-primary text-primary-fg'
            : 'border-white/80 bg-overlay-dark text-transparent',
        )}
      >
        <MdCheck size={14} />
      </span>
    </button>
  );
}
