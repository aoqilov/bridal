import { useState } from 'react';
import CusSegment, { type SegmentItem } from '@/components/ui/segment/CusSegment';
import FullGeneration from './FullGeneration';
import SimpleGeneration from './SimpleGeneration';

/**
 * Generatsiya rejimi:
 * - `full` — mijoz yuz suratini beradi, qolgani (gavda, poza, soch, fon)
 *   "Настройка модели" va promptdan quriladi;
 * - `simple` — mijoz o'zining to'liq bo'y suratini beradi va unda faqat
 *   ko'ylak almashadi.
 */
type Mode = 'full' | 'simple';

const MODES: SegmentItem<Mode>[] = [
  { value: 'full', label: 'Обычная' },
  { value: 'simple', label: 'Простая' },
];

/** Faol rejimda nima bo'lishini bir qatorda tushuntiradi */
const MODE_NOTE: Record<Mode, string> = {
  full: 'Ваше лицо + платье. Позу, фигуру и фон соберём сами — их можно настроить.',
  simple: 'Ваше фото в полный рост + платье. Поза, фигура и фон останутся вашими.',
};

type Props = {
  /** Natija tayyor bo'lgach — "Изображения" bo'limiga o'tish */
  onDone: (kind: 'image' | 'video') => void;
  /** Balans yetmasa — "Оплата" bo'limiga o'tish */
  onNeedTopUp: () => void;
};

/**
 * "Генерация" bosqichi — faqat rejim almashtirgichi.
 *
 * Ikkala rejimning ichki tuzilishi butunlay boshqa (manba suratlar ham,
 * bo'limlar ham, prompt ham), shuning uchun ular ikkita alohida komponent:
 * `FullGeneration` va `SimpleGeneration`. Umumiy qismlar — ko'ylak qatori
 * (`OutfitPickRow`), preview (`OutfitPreview`), chiplar (`CategoryRow`) va
 * pastki panel (`GenerateBar`).
 *
 * `mode` global state'ga chiqarilmagan: uni boshqa hech kim o'qimaydi va
 * saqlanishi ham shart emas — `tab` bilan bir xil sabab.
 */
export default function GenerationStep({ onDone, onNeedTopUp }: Props) {
  const [mode, setMode] = useState<Mode>('full');

  return (
    <>
      <div className="px-4 pt-3">
        <CusSegment items={MODES} value={mode} onChange={setMode} size="sm" fullWidth />
        <p className="mt-1.5 text-center text-[11px] leading-relaxed text-subtle">
          {MODE_NOTE[mode]}
        </p>
      </div>

      {mode === 'full' ? (
        <FullGeneration onDone={onDone} onNeedTopUp={onNeedTopUp} />
      ) : (
        <SimpleGeneration onDone={onDone} onNeedTopUp={onNeedTopUp} />
      )}
    </>
  );
}
