import { useEffect, useRef, useState } from 'react';
import { MdAutoAwesome } from 'react-icons/md';
import { useToast } from '@/components/ui';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatCurrency';
import { GENERATION_PRICE } from '@/constants/pricing';
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
} from '@/features/catalog';
import { generateTryOn } from '../api/generateTryOn';
import GeneratingModal from './GeneratingModal';

type Props = {
  /** Rasm tayyor bo'lgach chaqiriladi — "Изображения" bo'limiga o'tish uchun */
  onDone: () => void;
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
 * "Генерация" bo'limining pastki paneli — образ yig'ilgach shu tugma bosiladi.
 * Birinchi generatsiya bepul, keyingilari hamyondan yechiladi.
 *
 * Pul so'rovdan oldin yechiladi (generatsiya davomida balans o'zgarmasin), xato
 * bo'lsa qaytariladi — foydalanuvchi rasm olmagan holda pul to'lab qolmasligi kerak.
 */
export default function GenerateBar({ onDone, onNeedTopUp }: Props) {
  const faceImage = useFacesStore(
    (s) => s.items.find((x) => x.id === s.selected[NO_CATEGORY])?.image ?? null,
  );
  const dressId = useWardrobeStore((s) => s.selected.dress);
  const veilId = useWardrobeStore((s) => s.selected.veil);
  const jewelryId = useWardrobeStore((s) => s.selected.jewelry);
  const model = useWardrobeStore((s) => s.model);
  const addGenerated = useWardrobeStore((s) => s.addGenerated);

  const balance = useWalletStore((s) => s.balance);
  const freeUsed = useWalletStore((s) => s.freeUsed);
  const spend = useWalletStore((s) => s.spend);
  const useFree = useWalletStore((s) => s.useFree);
  const refundFree = useWalletStore((s) => s.refundFree);
  const topUp = useWalletStore((s) => s.topUp);

  const { show } = useToast();
  const [busy, setBusy] = useState(false);

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

  const start = async () => {
    if (!ready || busy || !faceImage) return;

    // Pul avval yechiladi — generatsiya davomida balans o'zgarmasin
    if (free) {
      useFree();
    } else if (!spend(GENERATION_PRICE, 'Генерация образа')) {
      show('Недостаточно средств — пополните кошелёк', 'error');
      onNeedTopUp();
      return;
    }

    setBusy(true);
    try {
      const result = await generateTryOn({
        faceImage,
        dressImages: itemImages(dressId),
        veilImage: itemImages(veilId)[0] ?? null,
        jewelryImage: itemImages(jewelryId)[0] ?? null,
        model,
        // Hijab ko'ylagi bo'lsa bosh sukut bo'yicha ro'mol bilan chiziladi —
        // "Настройка модели" ni ochmagan mijoz ham to'g'ri natija oladi
        hijab: isHijabItem(item(dressId)),
      });

      if (!alive.current) return;
      addGenerated(result.image);
      onDone();
    } catch (err) {
      // Rasm chiqmadi — to'lov qaytariladi
      if (free) refundFree();
      else topUp(GENERATION_PRICE, 'Возврат за неудачную генерацию');

      if (!alive.current) return;
      show(
        err instanceof Error ? err.message : 'Не удалось создать изображение',
        'error',
      );
    } finally {
      if (alive.current) setBusy(false);
    }
  };

  return (
    <>
      {/* Joylashuvni ota-komponent belgilaydi — bu yerda faqat ichki bo'shliq */}
      <div className="border-t border-border-subtle px-4 py-3">
        <button
          type="button"
          onClick={() => void start()}
          disabled={!ready || busy}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            ready
              ? 'bg-primary text-primary-fg hover:bg-primary-hover'
              : 'cursor-not-allowed bg-surface-2 text-subtle',
          )}
        >
          <MdAutoAwesome size={18} />
          Сгенерировать образ
          <span className="font-normal opacity-90">
            · {free ? 'бесплатно' : `${formatCurrency(GENERATION_PRICE)} сум`}
          </span>
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

      <GeneratingModal open={busy} />
    </>
  );
}
