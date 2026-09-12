import { useState } from 'react';
import { MdMovie, MdPhotoLibrary, MdPlayArrow } from 'react-icons/md';
import { PiCoatHangerBold } from 'react-icons/pi';
import CusSegment, { type SegmentItem } from '@/components/ui/segment/CusSegment';
import { useWardrobeStore } from '@/store/zustand';
import GenerationStep from './components/generation/GenerationStep';
import ImagePreview from './components/ImagePreview';
import VideoPreview from './components/VideoPreview';
import GeneratingModal from './components/GeneratingModal';
import WalletPanel from './components/WalletPanel';
import { useVideoGeneration } from './hooks/useVideoGeneration';

/** Ekran bosqichlari: образ yig'ish → tayyor natijalar → to'lov */
type Step = 'generation' | 'images' | 'payment';

/** Natijalar ichidagi tab — rasmlar va videolar alohida lentada */
type ResultTab = 'images' | 'videos';

const STEPS: SegmentItem<Step>[] = [
  { value: 'generation', label: 'Генерация' },
  { value: 'images', label: 'Изображения' },
  { value: 'payment', label: 'Оплата' },
];

const RESULT_TABS: SegmentItem<ResultTab>[] = [
  { value: 'images', label: 'Рисунки' },
  { value: 'videos', label: 'Видео' },
];

/**
 * Гардероб — примерка ekrani: yuz, kiyim va model sozlamalari shu yerda yig'iladi,
 * keyingi bosqichlarda tayyor natijalar va to'lov bo'ladi.
 */
export default function FeatureGarderob() {
  const [step, setStep] = useState<Step>('generation');
  const [tab, setTab] = useState<ResultTab>('images');

  const generated = useWardrobeStore((s) => s.generated);
  const videos = useWardrobeStore((s) => s.videos);
  const removeGenerated = useWardrobeStore((s) => s.removeGenerated);
  const removeVideo = useWardrobeStore((s) => s.removeVideo);

  // Ochilgan natija — id bo'yicha, o'chirilsa oyna o'zi yopiladi
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const preview = generated.find((x) => x.id === previewId) ?? null;
  const video = videos.find((x) => x.id === videoId) ?? null;

  // Galereyadagi tayyor rasmdan video — faqat video narxi yechiladi
  const videoGen = useVideoGeneration();

  const handleCreateVideo = async (image: string) => {
    setPreviewId(null);
    const ok = await videoGen.run(image);
    if (ok) setTab('videos');
  };

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col">
      <div className="sticky top-0 z-10 border-b border-border-subtle bg-background px-4 py-3">
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
          onDone={(kind) => {
            setTab(kind === 'video' ? 'videos' : 'images');
            setStep('images');
          }}
          onNeedTopUp={() => setStep('payment')}
        />
      )}

      {step === 'images' && (
        <>
          <div className="px-4 pt-3">
            <CusSegment items={RESULT_TABS} value={tab} onChange={setTab} size="sm" fullWidth />
          </div>

          {tab === 'images' &&
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

          {tab === 'videos' &&
            (videos.length > 0 ? (
              <div className="mt-3 grid grid-cols-3 gap-0.5">
                {videos.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setVideoId(item.id)}
                    aria-label="Открыть видео"
                    className="relative block aspect-[3/4] w-full overflow-hidden bg-surface-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary active:scale-[0.98]"
                  >
                    {/* Muqova — video yasalgan kadr; havola o'lsa ham nima borligi ko'rinadi */}
                    <img
                      src={item.poster}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute inset-0 grid place-items-center bg-overlay-dark text-overlay-fg">
                      <MdPlayArrow size={28} />
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <StepPlaceholder
                icon={<MdMovie size={28} />}
                title="Видео пока нет"
                text="Откройте готовый рисунок и создайте из него видео — или выберите «Видео» при генерации."
              />
            ))}
        </>
      )}

      {step === 'payment' && <WalletPanel />}

      <ImagePreview
        item={preview}
        onClose={() => setPreviewId(null)}
        onDelete={removeGenerated}
        onCreateVideo={(image) => void handleCreateVideo(image)}
      />

      <VideoPreview item={video} onClose={() => setVideoId(null)} onDelete={removeVideo} />

      <GeneratingModal open={videoGen.busy} kind="video" />
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
