import { useLocation } from 'react-router-dom';
import AppRoutes from '@/routes/AppRoutes';
import BottomNav from '@/layout/footer/BottomNav';
import Header from '@/layout/header/Header';
import { ROUTES } from '@/constants/routes';

/** Shu sahifalarda layout header ko'rinmaydi — ekran to'liq feature'ga beriladi */
const HIDDEN_HEADER_PATHS: string[] = [
  ROUTES.CATALOG,
  ROUTES.NEW_ARRIVALS,
  ROUTES.GARDEROB,
  ROUTES.PROFILE,
];

/** Ichki sahifalari ham headersiz — o'z "orqaga" tugmasi bor */
const HIDDEN_HEADER_PREFIXES: string[] = [
  `${ROUTES.CATALOG}/`,
  `${ROUTES.PROFILE}/`,
];

/**
 * Tovar sahifasida pastki navigatsiya ham yashiriladi — ekran to'liq modelga beriladi,
 * pastda esa feature'ning o'z paneli turadi ("Записаться на примерку").
 */
const HIDDEN_BOTTOM_NAV_PREFIXES: string[] = [`${ROUTES.CATALOG}/`];

export default function AppLayout() {
  const { pathname } = useLocation();
  const hideHeader =
    HIDDEN_HEADER_PATHS.includes(pathname) ||
    HIDDEN_HEADER_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const hideBottomNav = HIDDEN_BOTTOM_NAV_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  return (
    <div className="h-screen-safe flex flex-col overflow-hidden">
      {!hideHeader && <Header />}
      <main className="subtle-scrollbar flex-1 overflow-y-auto">
        <AppRoutes />
      </main>
      {!hideBottomNav && <BottomNav />}
    </div>
  );
}
