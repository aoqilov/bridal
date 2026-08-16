import { useRef, useState } from 'react';
import { MdPhotoCamera } from 'react-icons/md';
import { useToast } from '@/components/ui';
import { cn } from '@/utils/cn';

const AVATAR_SIZE = 256;

type Props = {
  value?: string;
  fallback: string;
  onChange: (dataUrl: string) => void;
  className?: string;
};

/**
 * Rasmni 256×256 ga kichraytirib data URL qaytaradi.
 * Original faylni saqlash localStorage kvotasini to'ldirib qo'yadi.
 */
async function fileToAvatar(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = AVATAR_SIZE;
  canvas.height = AVATAR_SIZE;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas context yo\'q');

  // "cover" kesim — markazdan
  const scale = Math.max(AVATAR_SIZE / bitmap.width, AVATAR_SIZE / bitmap.height);
  const w = bitmap.width * scale;
  const h = bitmap.height * scale;
  ctx.drawImage(bitmap, (AVATAR_SIZE - w) / 2, (AVATAR_SIZE - h) / 2, w, h);
  bitmap.close();

  return canvas.toDataURL('image/jpeg', 0.85);
}

export default function AvatarPicker({
  value,
  fallback,
  onChange,
  className,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { show } = useToast();
  const [busy, setBusy] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      onChange(await fileToAvatar(file));
    } catch {
      show('Не удалось загрузить фото', 'error');
    } finally {
      setBusy(false);
      // Bir xil faylni qayta tanlash ham ishlashi uchun
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className={cn('relative inline-block', className)}>
      <span className="grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-brand-gradient p-[3px]">
        {value ? (
          <img
            src={value}
            alt=""
            className="h-full w-full rounded-full border-2 border-background object-cover"
          />
        ) : (
          <span className="grid h-full w-full place-items-center rounded-full border-2 border-background bg-surface-2 text-2xl font-bold text-foreground">
            {fallback}
          </span>
        )}
      </span>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        aria-label="Изменить фото"
        className={cn(
          'absolute bottom-0 right-0 grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-fg shadow-card ring-2 ring-background transition',
          'hover:bg-primary-hover focus:outline-none focus-visible:ring-primary',
          busy && 'opacity-60',
        )}
      >
        <MdPhotoCamera size={16} />
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
