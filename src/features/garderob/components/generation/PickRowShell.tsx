import type { ReactNode } from 'react';

/** Qatordagi kataklarning yagona o'lchami — `+`, "Без …" va rasmlar bir xil */
export const TILE_CLASS = 'h-[4.5rem] w-[4.5rem]';

/** `+` va "Без …" kataklari uchun umumiy chegara/fokus klasslari */
export const TILE_FRAME_CLASS =
  'grid shrink-0 place-items-center rounded-[10px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary';

type Props = {
  /** Nechta buyum olingani — o'ng tomondagi sanoq uchun */
  count: number;
  max: number;
  /** Ro'yxat bo'sh bo'lganda `+` yonida ko'rinadigan izoh */
  hint: string;
  empty: boolean;
  /** `+` katagi, "Без …" katagi va rasmlar — chaqiruvchi o'zi joylaydi */
  children: ReactNode;
};

/**
 * Pastki paneldagi 2-qatorning umumiy qobig'i: sanoq va gorizontal scroll.
 *
 * Ichini `FacePickRow` (galereyadan yuklangan suratlar) va `OutfitPickRow`
 * (sevimlilardan olingan tovarlar) to'ldiradi — ikkalasining manbasi butunlay
 * boshqa, faqat ko'rinishi bir xil.
 */
export default function PickRowShell({ count, max, hint, empty, children }: Props) {
  return (
    <div>
      <div className="flex justify-end px-4">
        <span className="text-[11px] text-subtle">
          {count} из {max}
        </span>
      </div>

      {/* py-2 — faol halqa va ✓ nishoni scroll konteyneri tomonidan qirqilmasin */}
      <div className="flex items-center gap-3 overflow-x-auto px-4 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {children}
        {empty && <p className="text-xs leading-relaxed text-muted">{hint}</p>}
      </div>
    </div>
  );
}
