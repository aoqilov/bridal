import { useMemo } from 'react';
import { MOCK_CATEGORIES, MOCK_CATALOG } from '@/features/catalog';
import { ROUTES } from '@/constants/routes';
import BrandHero from './components/BrandHero';
import FeaturedItems from './components/FeaturedItems';
import SocialLinks from './components/SocialLinks';
import AddressInfo from './components/AddressInfo';
import NewsSlider from './components/NewsSlider';
import PromoSlider from './components/PromoSlider';
import AboutSection from './components/AboutSection';

export default function FeatureHome() {
  const available = useMemo(() => MOCK_CATALOG.filter((i) => i.isAvailable), []);

  const dressCount = available.filter((i) => i.kind === 'dress').length;
  const accessoryCount = available.filter((i) => i.kind === 'accessory').length;
  const categoryCount = MOCK_CATEGORIES.length;

  const featured = useMemo(
    () => available.filter((i) => i.isFeatured).slice(0, 8),
    [available],
  );
  const newArrivals = useMemo(
    () => available.filter((i) => i.isNew).slice(0, 8),
    [available],
  );
  const accessories = useMemo(
    () => available.filter((i) => i.kind === 'accessory').slice(0, 8),
    [available],
  );

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col gap-6 bg-background pb-8">
      <BrandHero
        categoryCount={categoryCount}
        dressCount={dressCount}
        accessoryCount={accessoryCount}
      />

      <FeaturedItems
        items={featured}
        title="Выбор салона"
        moreTo={`${ROUTES.CATALOG}?kind=dress`}
      />

      <FeaturedItems
        items={newArrivals}
        title="Новинки"
        moreTo={ROUTES.NEW_ARRIVALS}
      />

      <PromoSlider />

      <FeaturedItems
        items={accessories}
        title="Аксессуары"
        moreTo={`${ROUTES.CATALOG}?kind=accessory`}
      />

      <NewsSlider />

      <AboutSection />
      <AddressInfo />

      <div className="px-4">
        <SocialLinks />
      </div>
    </div>
  );
}
