import { useMemo } from 'react';
import { useFavoritesStore, useRecentlyViewedStore } from '@/store/zustand';
import { MOCK_REVIEWS, CURRENT_USER_ID } from '@/features/review';
import ProfileHeader from './components/ProfileHeader';
import ProfileStats from './components/ProfileStats';
import FavoritesSection from './components/FavoritesSection';
import RecentlyViewed from './components/RecentlyViewed';
import MyReviewsSection from './components/MyReviewsSection';
import SettingsSection from './components/SettingsSection';
import HelpSection from './components/HelpSection';
import AboutSection from './components/AboutSection';

export default function FeatureProfile() {
  const favoritesCount = useFavoritesStore((s) => s.ids.length);
  const recentCount = useRecentlyViewedStore((s) => s.ids.length);

  const reviewsCount = useMemo(
    () => MOCK_REVIEWS.filter((r) => r.author.id === CURRENT_USER_ID).length,
    [],
  );

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col gap-6 bg-background pb-8">
      <ProfileHeader />

      <ProfileStats
        favorites={favoritesCount}
        recent={recentCount}
        reviews={reviewsCount}
      />

      <FavoritesSection />
      <RecentlyViewed />
      <MyReviewsSection />
      <SettingsSection />
      <HelpSection />
      <AboutSection />
    </div>
  );
}
