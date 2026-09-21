import { MdImageNotSupported } from 'react-icons/md';

type Props = {
  /** Faol bo'limda tanlangan buyum rasmi — tanlanmagan bo'lsa `null` */
  image: string | null;
  /** Rasm ostidagi nom — tanlangan buyumniki */
  caption: string | null;
  /** Rasm yo'q bo'lgandagi izoh — bo'limga qarab o'zgaradi */
  emptyText: string;
};

/**
 * Ekranning yuqori qismi — faol bo'limda hozir nima tanlanganini ko'rsatadi.
 * Pastdagi bo'lim almashsa, bu rasm ham almashadi.
 *
 * Rasm maydonni to'liq yopmaydi: nisbati saqlanadi (`object-contain`) va
 * bo'sh joy ramka bo'lib qoladi — ko'ylak fotolari turli nisbatda keladi,
 * `object-cover` ularning etagini yoki yuzini qirqib tashlardi.
 *
 * Nom rasmning TAGIDA, oddiy oqimda turadi. Konteyner pastiga `absolute` bilan
 * yopishtirilsa u rasmdan ajralib, alohida quti bo'lib ko'rinadi — rasm
 * konteynerni to'ldirmagani uchun ular orasida bo'sh joy qoladi.
 *
 * DIQQAT: bu yerda `h-full` ishlatmang. Konteyner `flex-1` bilan o'lchanadi va
 * foizli balandlik ishonchsiz — rasm `flex-1` + `min-h-0` bilan qisqaradi.
 *
 * Bu tayyor образ emas — образ faqat generatsiyadan keyin paydo bo'ladi
 * ("Изображения" bo'limida).
 */
export default function OutfitPreview({ image, caption, emptyText }: Props) {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 overflow-hidden  p-3">
      {image ? (
        <>
          <img
            src={image}
            alt={caption ?? ''}
            className="max-h-[400px] w-auto max-w-full flex-1 rounded-lg object-contain "
          />
          {caption && (
            <p className="max-w-full shrink-0 truncate text-xs font-medium text-muted">
              {caption}
            </p>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center gap-2 px-8 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full border-2 border-border text-muted">
            <MdImageNotSupported size={24} />
          </span>
          <p className="max-w-[15rem] text-xs leading-relaxed text-muted">{emptyText}</p>
        </div>
      )}
    </div>
  );
}
