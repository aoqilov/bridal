import AppRoutes from '@/routes/AppRoutes';
import BottomNav from '@/layout/footer/BottomNav';
import Header from '@/layout/header/Header';

export default function AppLayout() {
  return (
    <div className="flex h-[100dvh] flex-col">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <AppRoutes />
      </main>
      <BottomNav />
    </div>
  );
}
