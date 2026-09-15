import {
  isDress,
  type CatalogItem,
  type ItemVariant,
  type OfferType,
} from '@/features/catalog';
import ItemReviews from './ItemReviews';
import ItemPricing from './ItemPricing';
import VariantPicker from './VariantPicker';
import ItemSizes from './ItemSizes';
import ItemDescription from './ItemDescription';

type Props = {
  item: CatalogItem;
  variant: ItemVariant;
  onVariantChange: (id: string) => void;
  offer: OfferType;
  onOfferChange: (offer: OfferType) => void;
};

export default function ItemInfo({
  item,
  variant,
  onVariantChange,
  offer,
  onOfferChange,
}: Props) {
  return (
    <section className="space-y-6 px-4 pt-5">
      <header className="space-y-3">
        <h1 className="font-serif text-[26px] font-medium leading-tight text-foreground">
          {item.name}
        </h1>

        {isDress(item) && item.isMaternityFriendly && (
          <span className="inline-flex rounded-full border border-border bg-surface px-2.5 py-1 text-[9.5px] uppercase tracking-[0.14em] text-muted">
            Подходит будущим мамам
          </span>
        )}

        <VariantPicker
          variants={item.variants}
          selected={variant}
          onChange={onVariantChange}
        />

        <ItemSizes item={item} />
      </header>

      <ItemPricing item={item} offer={offer} onOfferChange={onOfferChange} />

      <ItemReviews item={item} />

      {/* <ItemAvailability item={item} /> */}

      {item.description && <ItemDescription text={item.description} />}
    </section>
  );
}
