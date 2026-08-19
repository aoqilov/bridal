import { CusSheet } from '@/components/ui';
import { cn } from '@/utils/cn';
import { RU_SIZE_CHART } from '../utils/sizeChart';

type Props = {
  open: boolean;
  onClose: () => void;
  /** Salonda hozir mavjud RU o'lchamlar — jadvalda ajratib ko'rsatiladi */
  availableRu: number[];
};

export default function SizeChartSheet({ open, onClose, availableRu }: Props) {
  return (
    <CusSheet open={open} onClose={onClose} title="Таблица размеров">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] border-separate border-spacing-0 text-sm">
          <thead>
            <tr className="text-left text-xs text-muted">
              <th className="pb-2 pr-3 font-medium">Размер</th>
              <th className="pb-2 pr-3 font-medium">Грудь</th>
              <th className="pb-2 pr-3 font-medium">Талия</th>
              <th className="pb-2 font-medium">Бёдра</th>
            </tr>
          </thead>
          <tbody>
            {RU_SIZE_CHART.map((row) => {
              const inStock = availableRu.includes(row.ru);
              return (
                <tr
                  key={row.ru}
                  className={cn(!inStock && availableRu.length > 0 && 'text-subtle')}
                >
                  <td className="border-t border-border-subtle py-2.5 pr-3">
                    <span className="font-semibold">{row.ru}</span>
                    <span className="ml-1.5 text-xs opacity-70">{row.alias}</span>
                    {inStock && (
                      <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-success align-middle" />
                    )}
                  </td>
                  <td className="border-t border-border-subtle py-2.5 pr-3">{row.bust}</td>
                  <td className="border-t border-border-subtle py-2.5 pr-3">{row.waist}</td>
                  <td className="border-t border-border-subtle py-2.5">{row.hips}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {availableRu.length > 0 && (
        <p className="mt-3 flex items-center gap-2 text-xs text-muted">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" />
          Размеры, которые есть в салоне прямо сейчас
        </p>
      )}

      <p className="mt-3 text-xs leading-relaxed text-muted">
        Мерки снимаем по белью, сантиметр держим свободно. На примерке подберём
        размер и подгоним платье по фигуре.
      </p>
    </CusSheet>
  );
}
