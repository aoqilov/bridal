import { MdCheck, MdImage } from 'react-icons/md';
import { PiCoatHangerBold } from 'react-icons/pi';
import CusAccordion from '@/components/ui/accordion/CusAccordion';
import { cn } from '@/utils/cn';
import { useWardrobeStore } from '@/store/zustand';
import {
  MODEL_GROUPS,
  type ModelGroup,
  type ModelOption,
} from '@/constants/setupsModel';

/**
 * Sozlama guruhlarining o'zi — o'ramchisiz.
 * Akkordeon ichida ham (`ModelSetup`), sheet ichida ham (`ModelSetupSheet`)
 * shu bir xil ro'yxat ko'rsatiladi.
 */
export function ModelSetupGroups() {
  const model = useWardrobeStore((s) => s.model);
  const setModelOption = useWardrobeStore((s) => s.setModelOption);

  return (
    <div className="space-y-4">
      {MODEL_GROUPS.map((group) => (
        <Group
          key={group.key}
          group={group}
          value={model[group.key] ?? null}
          onSelect={(value) => setModelOption(group.key, value)}
        />
      ))}
    </div>
  );
}

/** Nechta guruh tanlangani — sarlavhadagi "4 из 4" uchun */
export function useModelChosenCount(): number {
  const model = useWardrobeStore((s) => s.model);
  return MODEL_GROUPS.filter((group) => model[group.key]).length;
}

/** Jami guruhlar soni */
export const MODEL_GROUP_COUNT = MODEL_GROUPS.length;

/**
 * "Настройка модели" — примерка modelining bo'yi, gavdasi, pozasi va sochi.
 * Tanlov darrov saqlanadi (`useWardrobeStore.model`), alohida tugma kerak emas.
 */
export default function ModelSetup() {
  const chosen = useModelChosenCount();

  return (
    <section aria-label="Настройка модели" className="w-full pb-6 pt-4">
      <CusAccordion
        // Ekran kengligiga to'liq yotadi — yon paddingsiz
        className="w-full"
        type="single"
        items={[
          {
            id: 'model',
            icon: <PiCoatHangerBold size={18} className="text-primary" />,
            title:
              chosen > 0
                ? `Настройка модели · ${chosen} из ${MODEL_GROUPS.length}`
                : 'Настройка модели',
            content: <ModelSetupGroups />,
          },
        ]}
      />
    </section>
  );
}

type GroupProps = {
  group: ModelGroup;
  value: string | null;
  onSelect: (value: string | null) => void;
};

function Group({ group, value, onSelect }: GroupProps) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-foreground">{group.title}</p>

      {/* Kartochkalar chetdan boshlanadi va gorizontal scroll bo'ladi */}
      <div className="-mx-4 flex gap-3 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {group.options.map((option) => (
          <OptionCard
            key={option.value}
            option={option}
            active={value === option.value}
            // Qayta bosilsa tanlov bekor bo'ladi
            onClick={() => onSelect(value === option.value ? null : option.value)}
          />
        ))}
      </div>
    </div>
  );
}

type OptionCardProps = {
  option: ModelOption;
  active: boolean;
  onClick: () => void;
};

function OptionCard({ option, active, onClick }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'group w-[100px] shrink-0 overflow-hidden rounded-[10px] border bg-surface-2 text-left transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        active ? 'border-primary' : 'border-border hover:border-primary',
      )}
    >
      {/* 3:4 nisbatdan 10px past — qator ixchamroq bo'lsin */}
      <span className="relative block h-[110px] w-full bg-surface">
        {option.image ? (
          <img
            src={option.image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          // Rasm hali qo'shilmagan — o'rnida ikonka turadi
          <span className="grid h-full w-full place-items-center text-subtle">
            <MdImage size={22} />
          </span>
        )}

        {active && (
          <span className="absolute bottom-1 right-1 grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-fg">
            <MdCheck size={12} />
          </span>
        )}
      </span>

      <span
        className={cn(
          'block px-1.5 py-1 text-center text-[10px] font-medium leading-tight',
          active ? 'text-primary' : 'text-foreground',
        )}
      >
        {option.label}
        {option.hint && (
          <span className="block text-[9px] font-normal text-subtle">{option.hint}</span>
        )}
      </span>
    </button>
  );
}
