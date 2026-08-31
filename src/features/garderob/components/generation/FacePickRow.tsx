import { MdAdd } from 'react-icons/md';
import { cn } from '@/utils/cn';
import { MAX_PHOTOS, NO_CATEGORY, useFacesStore } from '@/store/zustand';
import { useAddPhoto } from '../../hooks/useAddPhoto';
import PickRowShell, { TILE_CLASS, TILE_FRAME_CLASS } from './PickRowShell';
import PickTile from './PickTile';

/**
 * "Лицо" qatori — suratlar galereyadan yuklanadi va data URL bo'lib saqlanadi.
 * Shu sababli chegara `MAX_PHOTOS` (kichik): har bir surat localStorage'da yotadi.
 */
export default function FacePickRow() {
  const items = useFacesStore((s) => s.items);
  const selected = useFacesStore((s) => s.selected);
  const select = useFacesStore((s) => s.select);
  const remove = useFacesStore((s) => s.remove);

  const { inputRef, busy, openPicker, handleChange } = useAddPhoto(
    useFacesStore,
    NO_CATEGORY,
  );

  return (
    <PickRowShell
      count={items.length}
      max={MAX_PHOTOS}
      hint="Добавьте своё фото — примерим образ на вас."
      empty={items.length === 0}
    >
      <button
        type="button"
        onClick={openPicker}
        disabled={busy}
        aria-label="Добавить фото"
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
            shape="circle"
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
