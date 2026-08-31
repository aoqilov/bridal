import { useState } from 'react';
import { MdPhotoLibrary } from 'react-icons/md';
import { PiCoatHangerBold } from 'react-icons/pi';
import CusSegment, { type SegmentItem } from '@/components/ui/segment/CusSegment';
import { useWardrobeStore } from '@/store/zustand';
import GenerationStep from './components/generation/GenerationStep';
import ImagePreview from './components/ImagePreview';
import WalletPanel from './components/WalletPanel';

/** Ekran bosqichlari: образ yig'ish → tayyor rasmlar → to'lov */
type Step = 'generation' | 'images' | 'payment';

const STEPS: SegmentItem<Step>[] = [
  { value: 'generation', label: 'Генерация1' },
  { value: 'images', label: 'Изображения' },
  { value: 'payment', label: 'Оплата' },
];

/**
 * Гардероб — примерка ekrani: yuz, kiyim va model sozlamalari shu yerda yig'iladi,
 * keyingi bosqichlarda tayyor rasmlar va to'lov bo'ladi.
 */
export default function FeatureGarderob() {
  const [step, setStep] = useState<Step>('generation');

  const generated = useWardrobeStore((s) => s.generated);
  const removeGenerated = useWardrobeStore((s) => s.removeGenerated);

  // Ochilgan rasm — id bo'yicha, o'chirilsa oyna o'zi yopiladi
  const [previewId, setPreviewId] = useState<string | null>(null);
  const preview = generated.find((x) => x.id === previewId) ?? null;

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col">
      <div className="sticky top-0 z-10 border-b border-border-subtle bg-background/95 px-4 py-3 backdrop-blur">
        <h1 className="flex items-center gap-1.5 text-lg font-bold text-foreground">
          <PiCoatHangerBold size={22} className="text-primary" />
          Гардероб
        </h1>
        <p className="text-[11px] text-muted">Ваши образы и подборки</p>
      </div>

      <div className="px-4 pt-3">
        <CusSegment items={STEPS} value={step} onChange={setStep} size="sm" fullWidth />
      </div>

      {step === 'generation' && (
        <GenerationStep
          onDone={() => setStep('images')}
          onNeedTopUp={() => setStep('payment')}
        />
      )}

      {step === 'images' &&
        (generated.length > 0 ? (
          <div className="mt-3 grid grid-cols-3 gap-0.5">
            {generated.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setPreviewId(item.id)}
                aria-label="Открыть изображение"
                className="block aspect-[3/4] w-full overflow-hidden bg-surface-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary active:scale-[0.98]"
              >
                <img
                  src={item.image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        ) : (
          <StepPlaceholder
            icon={<MdPhotoLibrary size={28} />}
            title="Изображений пока нет"
            text="Соберите образ на вкладке «Генерация» — готовые примерки появятся здесь."
          />
        ))}

      {step === 'payment' && <WalletPanel />}

      <ImagePreview
        item={preview}
        onClose={() => setPreviewId(null)}
        onDelete={removeGenerated}
      />
    </div>
  );
}

type PlaceholderProps = {
  icon: React.ReactNode;
  title: string;
  text: string;
};

/** Hali tayyor bo'lmagan bosqich uchun bo'sh holat */
function StepPlaceholder({ icon, title, text }: PlaceholderProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 py-16 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-full border-2 border-border text-muted">
        {icon}
      </span>
      <p className="text-base font-semibold text-foreground">{title}</p>
      <p className="max-w-[16rem] text-xs leading-relaxed text-muted">{text}</p>
    </div>
  );
}
