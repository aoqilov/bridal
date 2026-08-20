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
import ItemAvailability from './ItemAvailability';
import ItemDescription from './ItemDescription';
import ItemPerks from './ItemPerks';

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
      <header className="space-y-2.5">
        <h1 className="font-serif text-[26px] font-semibold leading-tight text-foreground">
          {item.name}
        </h1>

        {isDress(item) && item.isMaternityFriendly && (
          <span className="inline-flex rounded-full bg-accent px-2.5 py-1 text-[11px] font-medium text-accent-fg">
            Подходит будущим мамам
          </span>
        )}

        <ItemReviews item={item} />
      </header>

      <ItemPricing item={item} offer={offer} onOfferChange={onOfferChange} />

      <VariantPicker
        variants={item.variants}
        selected={variant}
        onChange={onVariantChange}
      />

      <ItemSizes item={item} />

      <ItemAvailability item={item} />

      {item.description && <ItemDescription text={item.description} />}

      <ItemPerks />
    </section>
  );
}
