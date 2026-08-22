import { useState } from 'react';
import { FiMapPin, FiPhone } from 'react-icons/fi';
import { ADDRESSES, CONTACTS, PRIMARY_CONTACT } from '@/constants/contact';
import { SOCIALS } from '@/constants/social';
import { cn } from '@/utils/cn';
import { plural } from '@/utils/plural';
import SocialSheet from './SocialSheet';
import AddressSheet from './AddressSheet';
import ContactSheet from './ContactSheet';

type SheetKey = 'social' | 'address' | 'contact' | null;

/** 3 ustunli plitka — ijtimoiy tarmoqlar, manzillar va telefonlar */
export default function ContactTiles() {
  const [sheet, setSheet] = useState<SheetKey>(null);

  const socialCount = SOCIALS.length;
  const addressCount = ADDRESSES.length;
  const contactCount = CONTACTS.length;

  // 4 tadan ko'p bo'lsa — 3 ta logotip va "+N" katakchasi
  const visibleSocials = SOCIALS.slice(0, socialCount > 4 ? 3 : 4);
  const restSocials = socialCount - visibleSocials.length;

  return (
    <>
      <section className="grid grid-cols-3 gap-2.5 px-4">
        <Tile
          title="Соцсети"
          subtitle={`${socialCount} ${plural(socialCount, ['площадка', 'площадки', 'площадок'])}`}
          onClick={() => setSheet('social')}
        >
          {/* Logotiplar bir-birining ustiga chiqib turadi */}
          <div className="flex items-center justify-center -space-x-2">
            {visibleSocials.map((s) => {
              const Icon = s.icon;
              return (
                <span
                  key={s.id}
                  className={cn(
                    'grid h-8 w-8 place-items-center rounded-full ring-2 ring-surface',
                    s.color,
                  )}
                >
                  <Icon size={15} />
                </span>
              );
            })}
            {restSocials > 0 && (
              <span className="grid h-8 w-8 place-items-center rounded-full bg-surface-2 text-[11px] font-semibold text-muted ring-2 ring-surface">
                +{restSocials}
              </span>
            )}
          </div>
        </Tile>

        <Tile
          title="Адреса"
          subtitle={`${addressCount} ${plural(addressCount, ['салон', 'салона', 'салонов'])}`}
          onClick={() => setSheet('address')}
        >
          <div className="flex flex-col items-center gap-1.5">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-soft text-primary">
              <FiMapPin size={18} />
            </span>
            <p className="line-clamp-2 text-[10px] leading-tight text-muted">
              {ADDRESSES[0]?.address}
            </p>
          </div>
        </Tile>

        <Tile
          title="Контакты"
          subtitle={`${contactCount} ${plural(contactCount, ['номер', 'номера', 'номеров'])}`}
          onClick={() => setSheet('contact')}
        >
          <div className="flex flex-col items-center gap-1.5">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-accent-soft text-accent">
              <FiPhone size={18} />
            </span>
            <p className="line-clamp-1 text-[10px] font-semibold leading-tight text-foreground">
              {PRIMARY_CONTACT?.name}
            </p>
          </div>
        </Tile>
      </section>

      <SocialSheet open={sheet === 'social'} onClose={() => setSheet(null)} />
      <AddressSheet open={sheet === 'address'} onClose={() => setSheet(null)} />
      <ContactSheet open={sheet === 'contact'} onClose={() => setSheet(null)} />
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
      className="flex min-h-[8.75rem] min-w-0 flex-col items-center justify-center gap-3 rounded-2xl bg-surface p-2.5 text-center shadow-card transition hover:shadow-card-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="flex w-full min-w-0 flex-1 flex-col items-center justify-center">
        {children}
      </div>

      <div className="w-full min-w-0">
        <p className="line-clamp-1 text-[13px] font-semibold text-foreground">
          {title}
        </p>
        <p className="line-clamp-1 text-[10px] text-muted">{subtitle}</p>
      </div>
    </button>
  );
}
