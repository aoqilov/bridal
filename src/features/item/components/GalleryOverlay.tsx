import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiShare2, FiHeart } from 'react-icons/fi';
import { cn } from '@/utils/cn';

type Props = {
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onShare: () => void;
};

export default function GalleryOverlay({ isFavorite, onToggleFavorite, onShare }: Props) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/search');
  };

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between p-3">
      <button
        type="button"
        onClick={handleBack}
        aria-label="Назад"
        className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-overlay-dark text-white backdrop-blur transition hover:bg-overlay-dark-strong"
      >
        <FiArrowLeft size={20} />
      </button>

      <div className="pointer-events-auto flex gap-2">
        <button
          type="button"
          onClick={onShare}
          aria-label="Поделиться"
          className="grid h-10 w-10 place-items-center rounded-full bg-overlay-dark text-white backdrop-blur transition hover:bg-overlay-dark-strong"
        >
          <FiShare2 size={18} />
        </button>
        <button
          type="button"
          onClick={onToggleFavorite}
          aria-label={isFavorite ? 'Убрать из избранного' : 'В избранное'}
          className={cn(
            'grid h-10 w-10 place-items-center rounded-full backdrop-blur transition',
            isFavorite
              ? 'bg-danger text-white'
              : 'bg-overlay-dark text-white hover:bg-overlay-dark-strong',
          )}
        >
          <FiHeart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  );
}
