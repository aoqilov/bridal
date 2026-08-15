import { useLocation } from 'react-router-dom';
import AppRoutes from '@/routes/AppRoutes';
import BottomNav from '@/layout/footer/BottomNav';
import Header from '@/layout/header/Header';
import { ROUTES } from '@/constants/routes';

/** Shu sahifalarda layout header ko'rinmaydi — ekran to'liq feature'ga beriladi */
const HIDDEN_HEADER_PATHS: string[] = [ROUTES.CATALOG];

export default function AppLayout() {
  const { pathname } = useLocation();
  const hideHeader = HIDDEN_HEADER_PATHS.includes(pathname);

  return (
    <div className="h-screen-safe flex flex-col overflow-hidden">
      {!hideHeader && <Header />}
      <main className="flex-1 overflow-y-auto">
        <AppRoutes />
      </main>
      <BottomNav />
    </div>
  );
}
