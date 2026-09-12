import { VIDEO_DURATION } from '../../api/video/model';
import { buildClaudeVideoPrompt } from './claudeVideoPrompt';
import { buildGptVideoPrompt } from './gptVideoPrompt';

/**
 * Video promptining variantlari — solishtirish uchun yonma-yon turadi.
 *
 * Yangi variant qo'shish: fayl yarating, shu yerga import qiling va
 * `BUILDERS` ga qator qo'shing. Almashtirish uchun faqat `VIDEO_PROMPT_VARIANT`
 * o'zgaradi — chaqiruv joyi (`generateTryOnVideo.ts`) tegilmaydi.
 *
 * Qaysi variant ishlagani konsolga ham yoziladi, shunda natijani prompt bilan
 * bog'lash oson bo'ladi.
 *
 * DIQQAT: `gpt` variantidagi vaqtlar matnda qo'lda yozilgan va 10 sekundga
 * moslangan — o'sha variant bilan `VIDEO_DURATION` 10 bo'lib turishi kerak.
 */
export type VideoPromptVariant = 'claude' | 'gpt';

/** Hozir ishlatilayotgan variant */
export const VIDEO_PROMPT_VARIANT: VideoPromptVariant = 'gpt';

const BUILDERS: Record<VideoPromptVariant, (duration: number) => string> = {
  claude: buildClaudeVideoPrompt,
  gpt: buildGptVideoPrompt,
};

export function buildVideoPrompt(duration: number = VIDEO_DURATION): string {
  return BUILDERS[VIDEO_PROMPT_VARIANT](duration);
}
