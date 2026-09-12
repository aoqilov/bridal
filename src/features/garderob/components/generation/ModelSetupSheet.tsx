import CusSheet from '@/components/ui/sheet/CusSheet';
import { ModelSetupGroups } from '../ModelSetup';

type Props = {
  open: boolean;
  onClose: () => void;
};

/**
 * "Настройка модели" — pastki paneldagi "Настройка →" katagi ochadigan oyna.
 *
 * Akkordeon o'rniga sheet: poza va soch kartochkalari rasmli bo'lgani uchun
 * ularga joy kerak, akkordeon ichida esa siqilib qolardi.
 *
 * Katalogdagi filtr paneli kabi o'ngdan butun ekranga ochiladi — guruhlar ko'p
 * va pastdan chiqadigan panelning `max-h-[85vh]` balandligiga sig'maydi.
 */
export default function ModelSetupSheet({ open, onClose }: Props) {
  return (
    <CusSheet
      open={open}
      onClose={onClose}
      title="Настройка модели"
      side="right"
      panelClassName="rounded-none"
      contentClassName="p-0"
    >
      {/* px-4 — guruh kartochkalari `-mx-4` bilan chetdan boshlanadi */}
      <div className="mx-auto max-w-md px-4 pb-6 pt-2">
        <ModelSetupGroups />
      </div>
    </CusSheet>
  );
}
