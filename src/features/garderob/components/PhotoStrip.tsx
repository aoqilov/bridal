import { MdAdd, MdClose } from 'react-icons/md';
import { cn } from '@/utils/cn';
import { MAX_PHOTOS, NO_CATEGORY, type PhotoStore } from '@/store/zustand';
import { useAddPhoto } from '../hooks/useAddPhoto';
import PhotoCircle, { CIRCLE_SIZE_CLASS, type CircleSize } from './PhotoCircle';
import StripBadge from './StripBadge';

const ADD_ICON: Record<CircleSize, number> = { md: 26, lg: 34 };

type Props = {
  /** Bo'lim sarlavhasi — "Выберите лицо" */
  title: string;
  /** Surat yo'q bo'lganda `+` yonidagi izoh */
  emptyHint: string;
  store: PhotoStore;
  size?: CircleSize;
  className?: string;
  /** Sarlavha yonidagi «обязательно» / «необязательно» belgisi */
  required?: boolean;
};

/**
 * Galereyadan yuklanadigan suratlar qatori (yuzlar): `+`, doiralar va sanoq.
 * Kiyim va fata qatorlari boshqacha — ular sevimlilardan olinadi, `OutfitStrip` ga qara.
 */
export default function PhotoStrip({
  title,
  emptyHint,
  store,
  size = 'md',
  className,
  required = false,
}: Props) {
  const items = store((s) => s.items);
  const selected = store((s) => s.selected);
  const select = store((s) => s.select);
  const remove = store((s) => s.remove);

  const { inputRef, busy, openPicker, handleChange } = useAddPhoto(store, NO_CATEGORY);

  return (
    <section aria-label={title} className={cn('pt-3', className)}>
      <div className="flex items-center justify-between px-4">
        <h2 className="flex items-baseline gap-1.5 text-sm font-semibold text-foreground">
          {title}
          <StripBadge required={required} />
        </h2>
        {/* Nechta surat saqlangani va chegara */}
        <span className="shrink-0 text-[11px] text-subtle">
          {items.length} из {MAX_PHOTOS}
        </span>
      </div>

      {/* py-2 — faol halqa va ✓ nishoni scroll konteyneri tomonidan qirqilmasin */}
      <div className="mt-1 flex items-center gap-3 overflow-x-auto px-4 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          onClick={openPicker}
          disabled={busy}
          aria-label="Добавить фото"
          className={cn(
            'grid shrink-0 place-items-center rounded-2xl border-2 border-dashed border-border text-muted transition-colors',
            'hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            CIRCLE_SIZE_CLASS[size],
            busy && 'opacity-60',
          )}
        >
          <MdAdd size={ADD_ICON[size]} />
        </button>

        {items.length === 0 ? (
          <p className="text-xs leading-relaxed text-muted">{emptyHint}</p>
        ) : (
          items.map((item) => {
            const active = selected[item.category] === item.id;
            return (
              <div key={item.id} className="relative shrink-0">
                <PhotoCircle
                  image={item.image}
                  label={item.name}
                  size={size}
                  active={active}
                  onClick={() => select(active ? null : item.id, item.category)}
                />

                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  aria-label={`Удалить ${item.name}`}
                  className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-overlay-dark text-white backdrop-blur transition hover:bg-danger focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <MdClose size={13} />
                </button>
              </div>
            );
          })
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleChange} />
    </section>
  );
}
