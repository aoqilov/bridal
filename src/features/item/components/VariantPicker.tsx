import { FiCheck } from 'react-icons/fi';
import type { ItemVariant } from '@/features/catalog';
import { PLATE_FRAME, PLATE_BORDER, PLATE_BORDER_ACTIVE } from '@/components/ui';
import { cn } from '@/utils/cn';

type Props = {
  variants: ItemVariant[];
  selected: ItemVariant;
  onChange: (id: string) => void;
};

export default function VariantPicker({ variants, selected, onChange }: Props) {
  if (variants.length < 2) return null;

  return (
    <div>
      <p className="mb-2.5 text-[9.5px] uppercase tracking-[0.14em] text-subtle">Цвет</p>

      <div className="flex flex-wrap gap-2.5">
        {variants.map((v) => {
          const active = v.id === selected.id;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => onChange(v.id)}
              aria-label={v.colorName}
              aria-pressed={active}
              className="flex w-14 flex-col gap-1 focus:outline-none"
            >
              {/* Preview ramkasi — katalogdagi rasm ramkalari bilan bir xil */}
              <span
                className={cn(
                  PLATE_FRAME,
                  'block h-16 w-14',
                  active ? PLATE_BORDER_ACTIVE : cn(PLATE_BORDER, 'opacity-70 hover:opacity-100'),
                )}
              >
                <span className="relative block h-full w-full overflow-hidden rounded-sm">
                  <img
                    src={v.mainImage}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  {active && (
                    <span className="absolute inset-x-0 bottom-0 grid h-5 place-items-center bg-primary text-primary-fg">
                      <FiCheck size={12} />
                    </span>
                  )}
                  {!active && (
                    <span
                      className="absolute right-1 top-1 h-3.5 w-3.5 rounded-full border border-overlay-fg shadow"
                      style={{ backgroundColor: v.colorHex }}
                      aria-hidden
                    />
                  )}
                </span>
              </span>

              {/* Rang nomi — kartochka ostida */}
              <span
                className={cn(
                  'line-clamp-1 text-center text-[10px] leading-tight',
                  active ? 'text-foreground' : 'text-muted',
                )}
              >
                {v.colorName}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
