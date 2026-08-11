import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useToast } from '@/components/ui';
import { useFavoritesStore, useRecentlyViewedStore } from '@/store/zustand';
import {
  MOCK_CATEGORIES,
  MOCK_CATALOG,
  getItemBySlug,
  getRelatedItems,
  isDress,
} from '@/features/catalog';
import { buildTelegramItemLink } from '@/constants/contact';
import { ROUTES } from '@/constants/routes';
import ItemGallery from './components/ItemGallery';
import GalleryOverlay from './components/GalleryOverlay';
import ItemInfo from './components/ItemInfo';
import ItemSpecs from './components/ItemSpecs';
import ItemActions from './components/ItemActions';
import RelatedItems from './components/RelatedItems';

export default function FeatureItem() {
  const { slug = '' } = useParams<{ slug: string }>();
  const item = useMemo(() => getItemBySlug(slug, MOCK_CATALOG), [slug]);

  const toast = useToast();
  const favorite = useFavoritesStore();
  const isFavorite = item ? favorite.ids.includes(item.id) : false;

  const [variantId, setVariantId] = useState(item?.defaultVariantId ?? '');
  const [selectedSize, setSelectedSize] = useState<string | null>(() => {
    if (!item) return null;
    if (isDress(item)) return item.sizes.find((s) => s.available)?.label ?? null;
    return item.sizeLabels?.[0] ?? null;
  });

  const related = useMemo(
    () => (item ? getRelatedItems(item, MOCK_CATALOG, 6) : []),
    [item],
  );

  // Profildagi "Просмотренные" ro'yxati uchun
  const pushRecent = useRecentlyViewedStore((s) => s.push);
  useEffect(() => {
    if (item) pushRecent(item.id);
  }, [item, pushRecent]);

  if (!item) {
    return (
      <div className="mx-auto flex min-h-full max-w-md flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <h1 className="text-lg font-semibold text-foreground">Модель не найдена</h1>
        <p className="text-sm text-muted">
          Возможно, ссылка неверна или модель больше не в наличии.
        </p>
        <Link
          to={ROUTES.CATALOG}
          className="mt-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-fg hover:bg-primary-hover"
        >
          В каталог
        </Link>
      </div>
    );
  }

  const variant = item.variants.find((v) => v.id === variantId) ?? item.variants[0];

  const category = MOCK_CATEGORIES.find((c) => c.id === item.categoryId);
  const subcategory = category?.subcategories?.find((s) => s.id === item.subcategoryId);

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
        await navigator.share({
          title: item.name,
          text: item.name,
          url: currentUrl,
        });
        return;
      } catch {
        // fallthrough to copy
      }
    }
    handleCopy();
  };

  const handleTelegram = () => {
    const link = buildTelegramItemLink(item.name, currentUrl);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col bg-background">
      <div className="relative">
        <GalleryOverlay
          isFavorite={isFavorite}
          onToggleFavorite={() => favorite.toggle(item.id)}
          onShare={handleShare}
        />
        <ItemGallery variant={variant} itemName={item.name} />
      </div>

      <ItemInfo
        item={item}
        variant={variant}
        categoryName={category?.name}
        subcategoryName={subcategory?.name}
        onVariantChange={setVariantId}
        selectedSize={selectedSize}
        onSizeChange={setSelectedSize}
      />

      <ItemSpecs item={item} />

      <RelatedItems items={related} />

      <div className="h-4" />

      <ItemActions itemId={item.id} onTelegram={handleTelegram} onCopy={handleCopy} />
    </div>
  );
}
