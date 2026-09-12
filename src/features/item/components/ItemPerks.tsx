import type { ReactNode } from 'react';
import {
  MdOutlineCheckroom,
  MdOutlineContentCut,
  MdOutlineLocalLaundryService,
} from 'react-icons/md';

type Perk = {
  icon: ReactNode;
  title: string;
  note: string;
};

// Salon shartlari — haqiqiy shartlar bilan almashtiriladi
const PERKS: Perk[] = [
  {
    icon: <MdOutlineCheckroom size={20} />,
    title: 'Примерка',
    note: 'Бесплатно, без обязательств',
  },
  {
    icon: <MdOutlineContentCut size={20} />,
    title: 'Подгонка',
    note: 'По фигуре, в салоне',
  },
  {
    icon: <MdOutlineLocalLaundryService size={20} />,
    title: 'Химчистка',
    note: 'Уже включена в цену',
  },
];

export default function ItemPerks() {
  return (
    <ul className="grid grid-cols-3 gap-2">
      {PERKS.map((perk) => (
        <li
          key={perk.title}
          className="flex flex-col items-center gap-1.5 rounded border border-border bg-surface px-2 py-3.5 text-center"
        >
          <span className="text-primary">{perk.icon}</span>
          <span className="text-[12px] text-foreground">{perk.title}</span>
          <span className="text-[10px] leading-tight text-subtle">{perk.note}</span>
        </li>
      ))}
    </ul>
  );
}
