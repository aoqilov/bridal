import { MOCK_PROMOTIONS } from './mockdata.promotions';
import PromoCard from './components/PromoCard';

export default function FeaturePromotions() {
  return (
    <div className="mx-auto max-w-md px-4 py-4">
      <h1 className="mb-4 text-2xl font-bold text-foreground">Акции</h1>
      <div className="grid gap-4">
        {MOCK_PROMOTIONS.map((promo) => (
          <PromoCard key={promo.id} promo={promo} />
        ))}
      </div>
    </div>
  );
}
