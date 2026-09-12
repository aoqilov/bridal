import { useEffect, useMemo, useState } from 'react';
import { NO_CATEGORY, useFacesStore, useWardrobeStore } from '@/store/zustand';
import { MOCK_CATALOG, getItemById, defaultVariant, showsFeet } from '@/features/catalog';
import GenerateBar from '../GenerateBar';
import { MODEL_GROUP_COUNT, useModelChosenCount } from '../ModelSetup';
import CategoryRow, { PICK_TABS, type PickTab } from './CategoryRow';
import FacePickRow from './FacePickRow';
import ModelSetupSheet from './ModelSetupSheet';
import OutfitPickRow from './OutfitPickRow';
import OutfitPreview from './OutfitPreview';

/** Faol bo'limda hech narsa tanlanmaganda preview'da chiqadigan matn */
const EMPTY_TEXT: Record<PickTab, string> = {
  face: 'Добавьте своё фото — оно появится здесь.',
  dress: 'Выберите платье — оно появится здесь.',
  veil: 'Выберите фату или оставьте образ без неё.',
  jewelry: 'Выберите украшения или оставьте образ без них.',
  shoes: 'Выберите туфли — под коротким платьем их будет видно.',
};

type Props = {
  /** Natija tayyor bo'lgach — "Изображения" bo'limiga o'tish */
  onDone: (kind: 'image' | 'video') => void;
  /** Balans yetmasa — "Оплата" bo'limiga o'tish */
  onNeedTopUp: () => void;
};

/**
 * "Генерация" bosqichi: yuqorida katta rasm, pastda ikki qator.
 *
 * 1-qator bo'limni tanlaydi (Лицо / Платье / Фата / Украшения), 2-qator o'sha
 * bo'limning rasmlarini ko'rsatadi, katta rasm esa o'sha bo'limda nima
 * tanlanganini ko'rsatadi — ya'ni uchalasi bitta `tab` ga bog'langan.
 *
 * `tab` global state'ga chiqarilmagan: uni boshqa hech kim o'qimaydi va
 * saqlanishi ham shart emas.
 */
export default function GenerationStep({ onDone, onNeedTopUp }: Props) {
  const [tab, setTab] = useState<PickTab>('face');
  const [setupOpen, setSetupOpen] = useState(false);

  const faces = useFacesStore((s) => s.items);
  const faceSelectedId = useFacesStore((s) => s.selected[NO_CATEGORY]);
  const selected = useWardrobeStore((s) => s.selected);

  // Tanlangan ko'ylak etagi kalta bo'lsagina tufli bo'limi chiqadi: polgacha
  // ko'ylakda oyoq etak ostida qoladi va tanlangan tufli natijada ko'rinmaydi
  const dressItem = selected.dress ? getItemById(selected.dress, MOCK_CATALOG) : null;
  const feetVisible = showsFeet(dressItem);
  const tabs = useMemo<PickTab[]>(
    () => (feetVisible ? [...PICK_TABS, 'shoes'] : PICK_TABS),
    [feetVisible],
  );

  // Uzun ko'ylakka almashtirilsa tufli bo'limi yo'qoladi — bo'sh tabda qolmaslik uchun
  useEffect(() => {
    if (!tabs.includes(tab)) setTab('face');
  }, [tabs, tab]);

  const setupChosen = useModelChosenCount();

  const face = faces.find((x) => x.id === faceSelectedId) ?? null;

  /** Bo'limda tanlangan katalog tovari — yuz bo'limi bundan tashqarida */
  const outfitId = tab === 'face' ? null : selected[tab];
  const outfitItem = outfitId ? getItemById(outfitId, MOCK_CATALOG) : null;

  const previewImage =
    tab === 'face'
      ? (face?.image ?? null)
      : outfitItem
        ? defaultVariant(outfitItem).mainImage
        : null;

  const previewCaption = tab === 'face' ? (face?.name ?? null) : (outfitItem?.name ?? null);

  const filled: Record<PickTab, boolean> = {
    face: face !== null,
    dress: Boolean(selected.dress),
    veil: Boolean(selected.veil),
    jewelry: Boolean(selected.jewelry),
    shoes: Boolean(selected.shoes),
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
          tabs={tabs}
          value={tab}
          onChange={setTab}
          filled={filled}
          onOpenSetup={() => setSetupOpen(true)}
          setupChosen={setupChosen}
          setupTotal={MODEL_GROUP_COUNT}
        />

        {tab === 'face' ? <FacePickRow /> : <OutfitPickRow category={tab} />}

        <GenerateBar onDone={onDone} onNeedTopUp={onNeedTopUp} />
      </div>

      <ModelSetupSheet open={setupOpen} onClose={() => setSetupOpen(false)} />
    </>
  );
}
