import { MdFavorite, MdHistory, MdStar } from 'react-icons/md';
import type { ReactNode } from 'react';

type Stat = {
  id: string;
  label: string;
  value: number;
  icon: ReactNode;
  /** Scroll qilinadigan bo'lim id'si */
  target: string;
};

type Props = {
  favorites: number;
  recent: number;
  reviews: number;
};

export default function ProfileStats({ favorites, recent, reviews }: Props) {
  const stats: Stat[] = [
    {
      id: 'fav',
      label: 'Избранное',
      value: favorites,
      icon: <MdFavorite size={16} className="text-danger" />,
      target: 'profile-favorites',
    },
    {
      id: 'recent',
      label: 'Просмотрено',
      value: recent,
      icon: <MdHistory size={16} className="text-primary" />,
      target: 'profile-recent',
    },
    {
      id: 'reviews',
      label: 'Отзывов',
      value: reviews,
      icon: <MdStar size={16} className="text-warning" />,
      target: 'profile-reviews',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 px-4">
      {stats.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() =>
            document
              .getElementById(s.target)
              ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
          className="flex flex-col items-center gap-0.5 rounded-2xl bg-surface p-3 shadow-card transition hover:bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {s.icon}
          <span className="text-base font-bold text-foreground">{s.value}</span>
          <span className="text-[10px] text-muted">{s.label}</span>
        </button>
      ))}
    </div>
  );
}
