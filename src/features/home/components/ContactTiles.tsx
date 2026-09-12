import { useState, type ComponentType, type ReactNode } from 'react';
import { FiInstagram, FiMapPin, FiPhone } from 'react-icons/fi';
import { ADDRESSES, CONTACTS } from '@/constants/contact';
import { SOCIALS } from '@/constants/social';
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

  return (
    <>
      <section className="grid grid-cols-3 gap-2.5 px-4">
        <Tile
          icon={FiInstagram}
          title="Соцсети"
          caption={`${socialCount} ${plural(socialCount, ['площадка', 'площадки', 'площадок'])}`}
          onClick={() => setSheet('social')}
        />

        <Tile
          icon={FiMapPin}
          title="Адреса"
          caption={`${addressCount} ${plural(addressCount, ['салон', 'салона', 'салонов'])}`}
          onClick={() => setSheet('address')}
        />

        <Tile
          icon={FiPhone}
          title="Контакты"
          caption={`${contactCount} ${plural(contactCount, ['номер', 'номера', 'номеров'])}`}
          onClick={() => setSheet('contact')}
        />
      </section>

      <SocialSheet open={sheet === 'social'} onClose={() => setSheet(null)} />
      <AddressSheet open={sheet === 'address'} onClose={() => setSheet(null)} />
      <ContactSheet open={sheet === 'contact'} onClose={() => setSheet(null)} />
    </>
  );
}

type TileProps = {
  icon: ComponentType<{ size?: number; className?: string }>;
  title: string;
  caption: string;
  onClick: () => void;
};

function Tile({ icon: Icon, title, caption, onClick }: TileProps): ReactNode {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[6.5rem] min-w-0 flex-col items-center justify-center gap-2 border border-border-subtle bg-surface px-2 py-4 text-center transition-colors hover:border-border hover:bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <Icon size={19} className="shrink-0 text-primary" />

      <span className="w-full min-w-0">
        <span className="line-clamp-1 block font-serif text-[15px] leading-tight text-primary">
          {title}
        </span>
        <span className="mt-1 line-clamp-1 block text-[9.5px] uppercase tracking-[0.14em] text-subtle">
          {caption}
        </span>
      </span>
    </button>
  );
}
