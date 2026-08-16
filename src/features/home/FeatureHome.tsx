import { useMemo } from 'react';
import { MOCK_CATEGORIES, MOCK_CATALOG } from '@/features/catalog';
import BrandHero from './components/BrandHero';
import AdvantagesClassic from './components/AdvantagesClassic';
import CategoryCircles from './components/CategoryCircles';
import ContactTiles from './components/ContactTiles';
import NewsSlider from './components/NewsSlider';

export default function FeatureHome() {
  const itemCount = useMemo(
    () => MOCK_CATALOG.filter((i) => i.isAvailable).length,
    [],
  );

  const subcategoryCount = useMemo(
    () => MOCK_CATEGORIES.reduce((sum, c) => sum + (c.subcategories?.length ?? 0), 0),
    [],
  );

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col gap-5 bg-background pb-8">
      <BrandHero
        categoryCount={MOCK_CATEGORIES.length}
        subcategoryCount={subcategoryCount}
        itemCount={itemCount}
      />

      <AdvantagesClassic />

      <CategoryCircles />

      <ContactTiles />

      <NewsSlider />
    </div>
  );
}
