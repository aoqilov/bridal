import { useState } from 'react';
import { NO_CATEGORY, useBodyPhotosStore, useWardrobeStore } from '@/store/zustand';
import { MOCK_CATALOG, getItemById, defaultVariant } from '@/features/catalog';
import GenerateBar from '../GenerateBar';
import BodyPickRow from './BodyPickRow';
import CategoryRow from './CategoryRow';
import OutfitPickRow from './OutfitPickRow';
import OutfitPreview from './OutfitPreview';

/** Sodda rejimning bo'limlari — ikkalasi ham majburiy */
type SimpleTab = 'photo' | 'dress';

const SIMPLE_TABS: SimpleTab[] = ['photo', 'dress'];

const SIMPLE_TAB_LABELS: Record<SimpleTab, string> = {
  photo: 'Ваше фото',
  dress: 'Платье',
};

const EMPTY_TEXT: Record<SimpleTab, string> = {
  photo: 'Добавьте своё фото в полный рост — оно появится здесь.',
  dress: 'Выберите платье — оно появится здесь.',
};

type Props = {
  /** Natija tayyor bo'lgach — "Изображения" bo'limiga o'tish */
  onDone: (kind: 'image' | 'video') => void;
  /** Balans yetmasa — "Оплата" bo'limiga o'tish */
  onNeedTopUp: () => void;
};

/**
 * Sodda generatsiya: mijozning tayyor to'liq bo'y suratidagi kiyim katalogdagi
 * ko'ylakka almashtiriladi.
 *
 * Bu yerda "Настройка модели", фата, украшения va туфли yo'q — va qasddan
 * yo'q. Poza, gavda, soch, fon va yorug'lik mijoz suratidan keladi, ya'ni
 * ularni sozlash faqat fotodagi haqiqiy holatga qarshi ishlardi. Ko'ylak
 * tanlash qatori to'liq rejim bilan umumiy (`OutfitPickRow`): ikkala rejim
 * ham bitta `useWardrobeStore.selected.dress` ni o'qiydi, shuning uchun
 * rejimni almashtirgan mijoz ko'ylakni qaytadan tanlamaydi.
 */
export default function SimpleGeneration({ onDone, onNeedTopUp }: Props) {
  const [tab, setTab] = useState<SimpleTab>('photo');

  const photos = useBodyPhotosStore((s) => s.items);
  const photoSelectedId = useBodyPhotosStore((s) => s.selected[NO_CATEGORY]);
  const dressId = useWardrobeStore((s) => s.selected.dress);

  const photo = photos.find((x) => x.id === photoSelectedId) ?? null;
  const dressItem = dressId ? getItemById(dressId, MOCK_CATALOG) : null;

  const previewImage =
    tab === 'photo'
      ? (photo?.image ?? null)
      : dressItem
        ? defaultVariant(dressItem).mainImage
        : null;

  const previewCaption =
    tab === 'photo' ? (photo?.name ?? null) : (dressItem?.name ?? null);

  const filled: Record<SimpleTab, boolean> = {
    photo: photo !== null,
    dress: Boolean(dressId),
  };

  return (
    <>
      <OutfitPreview
        image={previewImage}
        caption={previewCaption}
        emptyText={EMPTY_TEXT[tab]}
      />

      <div className="sticky bottom-0 z-[9] border-t border-border-subtle bg-background/95 backdrop-blur">
        <CategoryRow
          tabs={SIMPLE_TABS}
          labels={SIMPLE_TAB_LABELS}
          value={tab}
          onChange={setTab}
          filled={filled}
          required={SIMPLE_TABS}
        />

        {tab === 'photo' ? <BodyPickRow /> : <OutfitPickRow category="dress" />}

        <GenerateBar variant="simple" onDone={onDone} onNeedTopUp={onNeedTopUp} />
      </div>
    </>
  );
}
