import {
  isDress,
  type CatalogItem,
  type ItemVariant,
  type OfferType,
} from '@/features/catalog';
import Breadcrumb from './Breadcrumb';
import RatingStars from './RatingStars';
import ItemPricing from './ItemPricing';
import VariantPicker from './VariantPicker';
import SizePicker from './SizePicker';
import ItemAvailability from './ItemAvailability';
import ItemDescription from './ItemDescription';
import ItemPerks from './ItemPerks';

type Props = {
  item: CatalogItem;
  variant: ItemVariant;
  categoryId?: string;
  categoryName?: string;
  subcategoryId?: string;
  subcategoryName?: string;
  onVariantChange: (id: string) => void;
  selectedSize: string | null;
  onSizeChange: (label: string) => void;
  offer: OfferType;
  onOfferChange: (offer: OfferType) => void;
};

export default function ItemInfo({
  item,
  variant,
  categoryId,
  categoryName,
  subcategoryId,
  subcategoryName,
  onVariantChange,
  selectedSize,
  onSizeChange,
  offer,
  onOfferChange,
}: Props) {
  return (
    <section className="space-y-6 px-4 pt-5">
      <header className="space-y-2.5">
        <Breadcrumb
          categoryId={categoryId}
          categoryName={categoryName}
          subcategoryId={subcategoryId}
          subcategoryName={subcategoryName}
        />

        <h1 className="font-serif text-[26px] font-semibold leading-tight text-foreground">
          {item.name}
        </h1>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          {item.rating !== undefined && (
            <RatingStars rating={item.rating} reviewCount={item.reviewCount} />
          )}
          {item.sku && (
            <span className="text-xs text-subtle">Артикул {item.sku}</span>
          )}
        </div>

        {isDress(item) && item.isMaternityFriendly && (
          <span className="inline-flex rounded-full bg-accent px-2.5 py-1 text-[11px] font-medium text-accent-fg">
            Подходит будущим мамам
          </span>
        )}
      </header>

      <ItemPricing item={item} offer={offer} onOfferChange={onOfferChange} />

      <VariantPicker
        variants={item.variants}
        selected={variant}
        onChange={onVariantChange}
      />

      <SizePicker item={item} selected={selectedSize} onChange={onSizeChange} />

      <ItemAvailability item={item} />

      {item.description && <ItemDescription text={item.description} />}

      <ItemPerks />
    </section>
  );
}
