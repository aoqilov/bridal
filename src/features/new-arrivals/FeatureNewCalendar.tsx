import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { ROUTES, newArrivalsDatePath } from '@/constants/routes';
import { useNewArrivalGroups } from './hooks/useNewArrivalGroups';
import MediaCalendar from './components/MediaCalendar';

/**
 * Kalendar alohida sahifa sifatida: kun tanlangach lentaga `?date=` bilan
 * qaytadi va o'sha kun guruhi ochiladi.
 */
export default function FeatureNewCalendar() {
  const navigate = useNavigate();
  const { groups } = useNewArrivalGroups();

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate(ROUTES.NEW_ARRIVALS);
  };

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col">
      <header className="sticky top-0 z-10 flex items-center gap-2 border-b border-border-subtle bg-background px-3 py-2.5">
        <button
          type="button"
          onClick={handleBack}
          aria-label="Назад"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-foreground transition-colors hover:bg-surface-2"
        >
          <FiArrowLeft size={20} />
        </button>

        <h1 className="min-w-0 flex-1 truncate px-1 font-serif text-lg text-foreground">
          Календарь
        </h1>
      </header>

      <div className="flex-1 px-4 pb-8 pt-2">
        <MediaCalendar
          groups={groups}
          onPick={(date) => navigate(newArrivalsDatePath(date))}
          stickyTop="top-14"
        />
      </div>
    </div>
  );
}
