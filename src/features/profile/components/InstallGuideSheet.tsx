import { MdIosShare, MdMoreVert, MdAddToHomeScreen } from 'react-icons/md';
import type { ReactNode } from 'react';
import { CusSheet } from '@/components/ui';

type Props = {
  open: boolean;
  onClose: () => void;
  /** iOS'da o'rnatish faqat Safari'dagi «Поделиться» orqali */
  isIos: boolean;
};

type Step = {
  icon: ReactNode;
  text: string;
};

const IOS_STEPS: Step[] = [
  { icon: <MdIosShare size={20} />, text: 'Откройте сайт в Safari и нажмите «Поделиться»' },
  { icon: <MdAddToHomeScreen size={20} />, text: 'Выберите «На экран „Домой“»' },
  { icon: <MdAddToHomeScreen size={20} />, text: 'Нажмите «Добавить» — иконка появится на экране' },
];

const OTHER_STEPS: Step[] = [
  { icon: <MdMoreVert size={20} />, text: 'Откройте меню браузера (три точки в углу)' },
  { icon: <MdAddToHomeScreen size={20} />, text: 'Выберите «Установить приложение» или «Добавить на главный экран»' },
  { icon: <MdAddToHomeScreen size={20} />, text: 'Подтвердите — приложение откроется в отдельном окне' },
];

export default function InstallGuideSheet({ open, onClose, isIos }: Props) {
  const steps = isIos ? IOS_STEPS : OTHER_STEPS;

  return (
    <CusSheet open={open} onClose={onClose} title="Установка на телефон">
      <ol className="space-y-3">
        {steps.map((step, idx) => (
          <li key={step.text} className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
              {step.icon}
            </span>
            <span className="pt-1.5 text-sm leading-snug text-foreground">
              <span className="mr-1.5 font-semibold text-primary">{idx + 1}.</span>
              {step.text}
            </span>
          </li>
        ))}
      </ol>

      <p className="mt-4 rounded-xl bg-surface p-3 text-xs leading-relaxed text-muted">
        Приложение не занимает места как обычная программа: это тот же каталог, но с
        иконкой на экране и без адресной строки. Работает и без интернета — открываются
        уже просмотренные страницы.
      </p>
    </CusSheet>
  );
}
