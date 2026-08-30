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
import { MOCK_CATALOG, getItemById, defaultVariant } from '@/features/catalog';
import GeneratingModal from './GeneratingModal';

/** Kutish vaqti — backend ulanganda o'rniga haqiqiy so'rov keladi */
const GENERATION_MS = 20_000;

type Props = {
  /** Rasm tayyor bo'lgach chaqiriladi — "Изображения" bo'limiga o'tish uchun */
  onDone: () => void;
  /** Balans yetmasa chaqiriladi — "Оплата" bo'limiga o'tish uchun */
  onNeedTopUp: () => void;
};

/**
 * "Генерация" bo'limining pastki paneli — образ yig'ilgach shu tugma bosiladi.
 * Birinchi generatsiya bepul, keyingilari hamyondan yechiladi.
 * Hozircha natija sifatida tanlangan ko'ylak rasmi saqlanadi (backend yo'q).
 */
export default function GenerateBar({ onDone, onNeedTopUp }: Props) {
  const faceId = useFacesStore((s) => s.selected[NO_CATEGORY]);
  const dressId = useWardrobeStore((s) => s.selected.dress);
  const addGenerated = useWardrobeStore((s) => s.addGenerated);

  const balance = useWalletStore((s) => s.balance);
  const freeUsed = useWalletStore((s) => s.freeUsed);
  const spend = useWalletStore((s) => s.spend);
  const useFree = useWalletStore((s) => s.useFree);

  const { show } = useToast();
  const [busy, setBusy] = useState(false);
  const timer = useRef<number>();

  // Sahifa almashsa kutish taymeri osilib qolmasin
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const ready = Boolean(faceId && dressId);
  const free = !freeUsed;

  const start = () => {
    if (!ready || busy) return;

    // Pul avval yechiladi — generatsiya boshlangach balans o'zgarmasin
    if (free) {
      useFree();
    } else if (!spend(GENERATION_PRICE, 'Генерация образа')) {
      show('Недостаточно средств — пополните кошелёк', 'error');
      onNeedTopUp();
      return;
    }

    setBusy(true);
    timer.current = window.setTimeout(() => {
      const dress = dressId ? getItemById(dressId, MOCK_CATALOG) : null;
      if (dress) addGenerated(defaultVariant(dress).mainImage);
      setBusy(false);
      onDone();
    }, GENERATION_MS);
  };

  return (
    <>
      <div className="sticky bottom-0 z-[9] mt-auto border-t border-border-subtle bg-background/95 px-4 py-3 backdrop-blur">
        <button
          type="button"
          onClick={start}
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
