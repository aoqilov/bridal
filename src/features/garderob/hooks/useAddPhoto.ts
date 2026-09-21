import { useRef, useState, type ChangeEvent } from 'react';
import { useToast } from '@/components/ui';
import { MAX_PHOTOS, NO_CATEGORY, type PhotoStore } from '@/store/zustand';
import { fileToSquarePhoto } from '../utils/fileToSquarePhoto';

/** Faylni saqlashga tayyor data URL ga o'giradigan funksiya */
type Transform = (file: File) => Promise<string>;

/**
 * Surat qo'shish mantig'i — yashirin fayl input'i, kichraytirish va chegara nazorati.
 * Qaytgan `inputRef` ni komponent o'zi `<input type="file" hidden>` ga ulaydi.
 *
 * `transform` — faylni qanday kichraytirish. Sukut bo'yicha kvadrat yuz kesimi;
 * sodda rejimdagi to'liq bo'y suratlari `fileToPortraitPhoto` ni beradi, chunki
 * u yerda nisbat saqlanishi kerak.
 */
export function useAddPhoto(
  store: PhotoStore,
  category: string = NO_CATEGORY,
  transform: Transform = fileToSquarePhoto,
) {
  const add = store((s) => s.add);
  const total = store((s) => s.items.length);
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const { show } = useToast();

  const openPicker = () => {
    if (total >= MAX_PHOTOS) {
      show(`Можно сохранить не больше ${MAX_PHOTOS} фото`, 'error');
      return;
    }
    inputRef.current?.click();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    void transform(file)
      .then((image) => add(image, category))
      .catch(() => show('Не удалось загрузить фото', 'error'))
      .finally(() => {
        setBusy(false);
        // Bir xil faylni qayta tanlash ham ishlashi uchun
        if (inputRef.current) inputRef.current.value = '';
      });
  };

  return { inputRef, busy, openPicker, handleChange };
}
