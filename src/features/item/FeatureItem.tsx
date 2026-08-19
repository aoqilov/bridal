import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useToast } from '@/components/ui';
import { useFavoritesStore, useRecentlyViewedStore } from '@/store/zustand';
import {
  MOCK_CATALOG,
  getItemBySlug,
  getRelatedItems,
  type CatalogItem,
} from '@/features/catalog';
import { buildTelegramItemLink } from '@/constants/contact';
import { ROUTES } from '@/constants/routes';
import ItemTopBar from './components/ItemTopBar';
import ItemGallery from './components/ItemGallery';
import ItemThumbs from './components/ItemThumbs';
import ItemInfo from './components/ItemInfo';
import ItemSpecs from './components/ItemSpecs';
import ItemActions from './components/ItemActions';
import RelatedItems from './components/RelatedItems';
import { useItemSelection } from './hooks/useItemSelection';
import { useGallery } from './hooks/useGallery';

export default function FeatureItem() {
  const { slug = '' } = useParams<{ slug: string }>();
  const item = useMemo(() => getItemBySlug(slug, MOCK_CATALOG), [slug]);

  if (!item) return <ItemNotFound />;

  return <ItemView item={item} />;
}

function ItemNotFound() {
  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <h1 className="font-serif text-2xl font-semibold text-foreground">
        Модель не найдена
      </h1>
      <p className="text-sm text-muted">
        Возможно, ссылка неверна или модель больше не в наличии.
      </p>
      <Link
        to={ROUTES.CATALOG}
        className="mt-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-fg transition-colors hover:bg-primary-hover"
      >
        В каталог
      </Link>
    </div>
  );
}

function ItemView({ item }: { item: CatalogItem }) {
  const toast = useToast();
  const favorite = useFavoritesStore();
  const isFavorite = favorite.ids.includes(item.id);

  const { variant, size, offer, setVariantId, setSize, setOffer } =
    useItemSelection(item);
  const gallery = useGallery(variant);

  const related = useMemo(() => getRelatedItems(item, MOCK_CATALOG, 6), [item]);

  // Profildagi "Просмотренные" ro'yxati uchun
  const pushRecent = useRecentlyViewedStore((s) => s.push);
  useEffect(() => {
    pushRecent(item.id);
  }, [item.id, pushRecent]);

  const currentUrl = window.location.href;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast.show('Ссылка скопирована', 'success');
    } catch {
      toast.show('Не удалось скопировать', 'error');
    }
  };

  const handleShare = async () => {
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: item.name, text: item.name, url: currentUrl });
        return;
      } catch {
        // Foydalanuvchi bekor qildi yoki qo'llab-quvvatlanmaydi — havolani nusxalaymiz
      }
    }
    handleCopy();
  };

  const handleTelegram = () => {
    const link = buildTelegramItemLink(item.name, currentUrl);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleToggleFavorite = () => {
    favorite.toggle(item.id);
    toast.show(isFavorite ? 'Удалено из избранного' : 'Добавлено в избранное', 'success');
  };

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col bg-background">
      <ItemTopBar
        title={item.name}
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
        onShare={handleShare}
      />

      {/* Rasm scroll paytida joyida qoladi — pastdagi kartochka uning ustidan ko'tariladi */}
      <div className="sticky top-0 z-0">
        <ItemGallery
          images={gallery.images}
          variant={variant}
          itemName={item.name}
          activeIndex={gallery.activeIndex}
          onActiveIndexChange={gallery.setActiveIndex}
          onSwiper={gallery.setSwiper}
        />
      </div>

      {/* Kontent kartochkasi — badge qatoridan boshlab rasm ustiga chiqadi */}
      <div className="relative z-10 -mt-10 rounded-t-3xl border-t border-border-subtle bg-background pt-4 shadow-sheet">
        <ItemThumbs
          images={gallery.images}
          activeIndex={gallery.activeIndex}
          onSelect={gallery.goTo}
        />

        <ItemInfo
          item={item}
          variant={variant}
          onVariantChange={setVariantId}
          selectedSize={size}
          onSizeChange={setSize}
          offer={offer}
          onOfferChange={setOffer}
        />

        <ItemSpecs item={item} />

        <RelatedItems items={related} />

        <div className="h-6" />
      </div>

      <ItemActions item={item} offer={offer} onTelegram={handleTelegram} />
    </div>
  );
}
