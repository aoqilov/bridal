import { useEffect, useRef, useState } from 'react';
import { MdAutoAwesome } from 'react-icons/md';
import { useToast } from '@/components/ui';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatCurrency';
import { GENERATION_PRICE, VIDEO_PRICE, VIDEO_TOTAL_PRICE } from '@/constants/pricing';
import {
  NO_CATEGORY,
  useFacesStore,
  useWalletStore,
  useWardrobeStore,
} from '@/store/zustand';
import {
  MOCK_CATALOG,
  getItemById,
  defaultVariant,
  isHijabItem,
  hemLengthOf,
} from '@/features/catalog';
import { generateTryOn } from '../api/generateTryOn';
import { useVideoGeneration } from '../hooks/useVideoGeneration';
import GeneratingModal from './GeneratingModal';
import GenerateModeModal, { type GenerateMode } from './GenerateModeModal';
import ConfirmLookModal from './ConfirmLookModal';

type Props = {
  /** Natija tayyor bo'lgach chaqiriladi — "Изображения" bo'limiga o'tish uchun */
  onDone: (kind: GenerateMode) => void;
  /** Balans yetmasa chaqiriladi — "Оплата" bo'limiga o'tish uchun */
  onNeedTopUp: () => void;
};

/** Katalogdagi tovar — tanlanmagan bo'lsa `null` */
function item(id: string | null | undefined) {
  return id ? getItemById(id, MOCK_CATALOG) : null;
}

/** Katalogdagi tovarning rasm(lar)i — tanlanmagan bo'lsa bo'sh ro'yxat */
function itemImages(id: string | null | undefined): string[] {
  const found = item(id);
  if (!found) return [];
  const variant = defaultVariant(found);
  return [variant.mainImage, ...variant.otherImages].filter(Boolean);
}

/**
 * "Генерация" bo'limining pastki paneli. Tugma bosilganda avval rejim tanlanadi:
 * рисунок yoki видео.
 *
 * Pul so'rovdan oldin yechiladi (generatsiya davomida balans o'zgarmasin), xato
 * bo'lsa qaytariladi. Video rejimida to'liq summa boshida yechiladi: rasm
 * chiqqach mijoz uni tasdiqlaydi va faqat o'shandan keyin video yasaladi —
 * tasdiqlamasa video qismi qaytariladi, rasm esa galereyada qoladi.
 */
export default function GenerateBar({ onDone, onNeedTopUp }: Props) {
  const faceImage = useFacesStore(
    (s) => s.items.find((x) => x.id === s.selected[NO_CATEGORY])?.image ?? null,
  );
  const dressId = useWardrobeStore((s) => s.selected.dress);
  const veilId = useWardrobeStore((s) => s.selected.veil);
  const jewelryId = useWardrobeStore((s) => s.selected.jewelry);
  const shoesId = useWardrobeStore((s) => s.selected.shoes);
  const model = useWardrobeStore((s) => s.model);
  const addGenerated = useWardrobeStore((s) => s.addGenerated);

  const balance = useWalletStore((s) => s.balance);
  const freeUsed = useWalletStore((s) => s.freeUsed);
  const spend = useWalletStore((s) => s.spend);
  const useFree = useWalletStore((s) => s.useFree);
  const refundFree = useWalletStore((s) => s.refundFree);
  const topUp = useWalletStore((s) => s.topUp);

  const { show } = useToast();
  const video = useVideoGeneration();

  const [busy, setBusy] = useState(false);
  const [modeOpen, setModeOpen] = useState(false);
  const [mode, setMode] = useState<GenerateMode>('image');
  /** Tasdiqlash kutayotgan rasm — video oqimining oraliq bosqichi */
  const [pendingImage, setPendingImage] = useState<string | null>(null);

  // Sahifa almashsa tugagan so'rov o'chirilgan komponentga tegmasin
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const ready = Boolean(faceImage && dressId);
  const free = !freeUsed;

  /** Rasm generatsiyasi — ikkala rejimda ham birinchi qadam */
  const createImage = async (): Promise<string | null> => {
    if (!faceImage) return null;

    // Etak polgacha bo'lsa tufli natijada ko'rinmaydi — tanlangan bo'lsa ham
    // yuborilmaydi. Bo'lim ham o'sha shart bilan ochiladi (`GenerationStep`),
    // lekin ko'ylak keyin almashtirilgan bo'lishi mumkin.
    const hemLength = hemLengthOf(item(dressId));

    const result = await generateTryOn({
      faceImage,
      dressImages: itemImages(dressId),
      veilImage: itemImages(veilId)[0] ?? null,
      jewelryImage: itemImages(jewelryId)[0] ?? null,
      shoesImage: hemLength === 'floor' ? null : (itemImages(shoesId)[0] ?? null),
      hemLength,
      model,
      // Hijab ko'ylagi bo'lsa bosh sukut bo'yicha ro'mol bilan chiziladi —
      // "Настройка модели" ni ochmagan mijoz ham to'g'ri natija oladi
      hijab: isHijabItem(item(dressId)),
    });

    // Tannarx — `GENERATION_PRICE` ni shu raqamga qarab belgilaymiz
    console.info(
      `[image] ✓ tayyor · ${
        result.cost === null ? 'narx qaytarilmadi' : `$${result.cost.toFixed(4)}`
      }`,
    );

    return result.image;
  };

  /** Faqat rasm — eski oqim */
  const startImage = async () => {
    if (free) {
      useFree();
    } else if (!spend(GENERATION_PRICE, 'Генерация образа')) {
      show('Недостаточно средств — пополните кошелёк', 'error');
      onNeedTopUp();
      return;
    }

    setBusy(true);
    try {
      const image = await createImage();
      if (!image) return;
      if (!alive.current) return;
      addGenerated(image);
      onDone('image');
    } catch (err) {
      // Rasm chiqmadi — to'lov qaytariladi
      if (free) refundFree();
      else topUp(GENERATION_PRICE, 'Возврат за неудачную генерацию');

      if (!alive.current) return;
      show(err instanceof Error ? err.message : 'Не удалось создать изображение', 'error');
    } finally {
      if (alive.current) setBusy(false);
    }
  };

  /**
   * Video oqimi: pul boshida to'liq yechiladi, rasm chiziladi va tasdiqlashga
   * beriladi. Video o'zi `ConfirmLookModal` tasdiqlangach boshlanadi.
   */
  const startVideo = async () => {
    // Bepul urinish rasm qismini qoplaydi — qolgani hamyondan
    const charge = free ? VIDEO_PRICE : VIDEO_TOTAL_PRICE;

    if (free) useFree();
    if (!spend(charge, 'Генерация видео')) {
      if (free) refundFree();
      show('Недостаточно средств — пополните кошелёк', 'error');
      onNeedTopUp();
      return;
    }

    setBusy(true);
    try {
      const image = await createImage();
      if (!image) return;
      if (!alive.current) return;

      // Rasm har holda galereyada qoladi — tasdiqlanmasa ham
      addGenerated(image);
      setPendingImage(image);
    } catch (err) {
      // Rasm chiqmadi — hammasi qaytariladi
      if (free) refundFree();
      topUp(charge, 'Возврат за неудачную генерацию');

      if (!alive.current) return;
      show(err instanceof Error ? err.message : 'Не удалось создать изображение', 'error');
    } finally {
      if (alive.current) setBusy(false);
    }
  };

  const handleStart = () => {
    setModeOpen(false);
    if (mode === 'video') void startVideo();
    else void startImage();
  };

  /** Mijoz obrazni tasdiqladi — endi Seedance shu kadrdan video yasaydi */
  const handleConfirm = async () => {
    const image = pendingImage;
    setPendingImage(null);
    if (!image) return;

    const ok = await video.run(image, { prepaid: true });
    onDone(ok ? 'video' : 'image');
  };

  /** Obraz yoqmadi — video puli qaytadi, rasm galereyada qoladi */
  const handleCancel = () => {
    setPendingImage(null);
    topUp(VIDEO_PRICE, 'Возврат: видео не создано');
    show('Изображение сохранено, стоимость видео возвращена', 'success');
    onDone('image');
  };

  return (
    <>
      {/* Joylashuvni ota-komponent belgilaydi — bu yerda faqat ichki bo'shliq */}
      <div className="border-t border-border-subtle px-4 py-3">
        <button
          type="button"
          onClick={() => setModeOpen(true)}
          disabled={!ready || busy || video.busy}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded py-3 text-sm font-semibold transition',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            ready
              ? 'bg-accent text-accent-fg hover:bg-accent-hover'
              : 'cursor-not-allowed bg-surface-2 text-subtle',
          )}
        >
          <MdAutoAwesome size={18} />
          Сгенерировать образ
        </button>

        {ready ? (
          <p className="mt-1.5 text-center text-[11px] text-subtle">
            {free
              ? 'Первая генерация бесплатно'
              : `Баланс: ${formatCurrency(balance)} сум`}
          </p>
        ) : (
          <p className="mt-1.5 text-center text-[11px] text-subtle">
            Выберите фото и платье — остальное по желанию.
          </p>
        )}
      </div>

      <GenerateModeModal
        open={modeOpen}
        mode={mode}
        onModeChange={setMode}
        onClose={() => setModeOpen(false)}
        onStart={handleStart}
        free={free}
        balance={balance}
      />

      <ConfirmLookModal
        image={pendingImage}
        onConfirm={() => void handleConfirm()}
        onCancel={handleCancel}
      />

      <GeneratingModal open={busy || video.busy} kind={video.busy ? 'video' : 'image'} />
    </>
  );
}
