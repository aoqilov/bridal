import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const HomePage = lazy(() => import('@/pages/home'));
const CatalogPage = lazy(() => import('@/pages/catalog'));
const ItemPage = lazy(() => import('@/pages/item'));
const NewArrivalsPage = lazy(() => import('@/pages/new-arrivals'));
const BookingPage = lazy(() => import('@/pages/booking'));
const FavoritesPage = lazy(() => import('@/pages/favorites'));
const ReviewPage = lazy(() => import('@/pages/review'));
const ProfilePage = lazy(() => import('@/pages/profile'));
const PreviewPage = lazy(() => import('@/pages/preview'));
const PromotionsPage = lazy(() => import('@/pages/promotions'));
const PromotionDetailPage = lazy(() => import('@/pages/promotions/detail'));
const NewsPage = lazy(() => import('@/pages/news'));
const NewsDetailPage = lazy(() => import('@/pages/news/detail'));

function PageFallback() {
  return (
    <div className="flex h-full min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.CATALOG} element={<CatalogPage />} />
        <Route path={ROUTES.ITEM} element={<ItemPage />} />
        <Route path={ROUTES.NEW_ARRIVALS} element={<NewArrivalsPage />} />
        <Route path={ROUTES.BOOKING} element={<BookingPage />} />
        <Route path={ROUTES.FAVORITES} element={<FavoritesPage />} />
        <Route path={ROUTES.REVIEW} element={<ReviewPage />} />
        <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        <Route path={ROUTES.PREVIEW} element={<PreviewPage />} />
        <Route path={ROUTES.PROMOTIONS} element={<PromotionsPage />} />
        <Route path={ROUTES.PROMOTION_DETAIL} element={<PromotionDetailPage />} />
        <Route path={ROUTES.NEWS} element={<NewsPage />} />
        <Route path={ROUTES.NEWS_DETAIL} element={<NewsDetailPage />} />
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </Suspense>
  );
}
