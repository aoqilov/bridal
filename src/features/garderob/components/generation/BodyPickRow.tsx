import { MdAdd } from 'react-icons/md';
import { cn } from '@/utils/cn';
import { MAX_PHOTOS, NO_CATEGORY, useBodyPhotosStore } from '@/store/zustand';
import { useAddPhoto } from '../../hooks/useAddPhoto';
import { fileToPortraitPhoto } from '../../utils/fileToPortraitPhoto';
import PickRowShell, { TILE_CLASS, TILE_FRAME_CLASS } from './PickRowShell';
import PickTile from './PickTile';

/**
 * Sodda rejimdagi "Ваше фото" qatori — mijozning TO'LIQ BO'Y suratlari.
 *
 * `FacePickRow` bilan deyarli bir xil ko'rinadi, lekin manbasi boshqa store
 * (`useBodyPhotosStore`) va fayl boshqacha kichraytiriladi
 * (`fileToPortraitPhoto` — nisbat saqlanadi). Kataklar kvadrat, doira emas:
 * doira to'liq bo'y kadrning faqat o'rtasini ko'rsatadi va mijoz qaysi suratni
 * tanlayotganini ajrata olmaydi.
 */
export default function BodyPickRow() {
  const items = useBodyPhotosStore((s) => s.items);
  const selected = useBodyPhotosStore((s) => s.selected);
  const select = useBodyPhotosStore((s) => s.select);
  const remove = useBodyPhotosStore((s) => s.remove);

  const { inputRef, busy, openPicker, handleChange } = useAddPhoto(
    useBodyPhotosStore,
    NO_CATEGORY,
    fileToPortraitPhoto,
  );

  return (
    <PickRowShell
      count={items.length}
      max={MAX_PHOTOS}
      hint="Добавьте своё фото в полный рост — платье примерим прямо на нём."
      empty={items.length === 0}
    >
      <button
        type="button"
        onClick={openPicker}
        disabled={busy}
        aria-label="Добавить фото в полный рост"
        className={cn(
          TILE_FRAME_CLASS,
          TILE_CLASS,
          'border-2 border-dashed border-border text-muted hover:border-primary hover:text-primary',
          busy && 'opacity-60',
        )}
      >
        <MdAdd size={28} />
      </button>

      {items.map((item) => {
        const active = selected[item.category] === item.id;
        return (
          <PickTile
            key={item.id}
            image={item.image}
            label={item.name}
            active={active}
            onClick={() => select(active ? null : item.id, item.category)}
            onRemove={() => remove(item.id)}
            removeLabel={`Удалить ${item.name}`}
          />
        );
      })}

      <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleChange} />
    </PickRowShell>
  );
}
