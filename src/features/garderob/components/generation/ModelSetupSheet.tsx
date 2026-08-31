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
 */
export default function ModelSetupSheet({ open, onClose }: Props) {
  return (
    <CusSheet open={open} onClose={onClose} title="Настройка модели">
      {/* px-4 — guruh kartochkalari `-mx-4` bilan chetdan boshlanadi */}
      <div className="px-4 pb-6 pt-2">
        <ModelSetupGroups />
      </div>
    </CusSheet>
  );
}
