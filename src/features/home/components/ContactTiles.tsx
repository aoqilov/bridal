import { useState } from 'react';
import { FiMapPin } from 'react-icons/fi';
import { ADDRESSES } from '@/constants/contact';
import { SOCIALS } from '@/constants/social';
import { cn } from '@/utils/cn';
import { plural } from '@/utils/plural';
import SocialSheet from './SocialSheet';
import AddressSheet from './AddressSheet';

type SheetKey = 'social' | 'address' | null;

/** 2 ustunli plitka — chapda ijtimoiy tarmoqlar, o'ngda manzillar */
export default function ContactTiles() {
  const [sheet, setSheet] = useState<SheetKey>(null);

  const socialCount = SOCIALS.length;
  const addressCount = ADDRESSES.length;

  return (
    <>
      <section className="grid grid-cols-2 gap-3 px-4">
        <Tile
          title="Мы в соцсетях"
          subtitle={`${socialCount} ${plural(socialCount, ['площадка', 'площадки', 'площадок'])}`}
          onClick={() => setSheet('social')}
        >
          <div className="flex flex-wrap gap-1.5">
            {SOCIALS.slice(0, 4).map((s) => {
              const Icon = s.icon;
              return (
                <span
                  key={s.id}
                  className={cn(
                    'grid h-9 w-9 place-items-center rounded-xl',
                    s.color,
                  )}
                >
                  <Icon size={18} />
                </span>
              );
            })}
            {socialCount > 4 && (
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-surface-2 text-[11px] font-semibold text-muted">
                +{socialCount - 4}
              </span>
            )}
          </div>
        </Tile>

        <Tile
          title="Адреса"
          subtitle={`${addressCount} ${plural(addressCount, ['салон', 'салона', 'салонов'])} в Ташкенте`}
          onClick={() => setSheet('address')}
        >
          <div className="flex flex-col gap-1">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary">
              <FiMapPin size={18} />
            </span>
            <p className="line-clamp-2 text-[11px] leading-tight text-muted">
              {ADDRESSES[0]?.address}
            </p>
          </div>
        </Tile>
      </section>

      <SocialSheet open={sheet === 'social'} onClose={() => setSheet(null)} />
      <AddressSheet open={sheet === 'address'} onClose={() => setSheet(null)} />
    </>
  );
}

type TileProps = {
  title: string;
  subtitle: string;
  onClick: () => void;
  children: React.ReactNode;
};

function Tile({ title, subtitle, onClick, children }: TileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[9.5rem] flex-col justify-between rounded-2xl bg-surface p-3 text-left shadow-card transition hover:shadow-card-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {children}

      <div className="mt-3">
        <p className="line-clamp-1 text-sm font-semibold text-foreground">{title}</p>
        <p className="line-clamp-1 text-[11px] text-muted">{subtitle}</p>
      </div>
    </button>
  );
}
