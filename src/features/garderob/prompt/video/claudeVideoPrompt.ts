import { VIDEO_DURATION } from '../../api/video/model';

/**
 * VIDEO PROMPTI — "claude" varianti.
 *
 * Ikkinchi variant (`gptVideoPrompt.ts`) bilan solishtirish uchun alohida faylda.
 * Qaysi biri ishlatilishi — `prompt/video/index.ts` dagi bitta konstanta.
 *
 * Video prompti — birinchi kadr sifatida tayyor примерка rasmi yuboriladi,
 * shuning uchun bu yerda ko'ylak, yuz yoki fon TA'RIFLANMAYDI. Ular kadrda
 * allaqachon bor va model ularni o'zgartirmasligi kerak; promptning yagona
 * vazifasi — harakatni aytish.
 *
 * INKOR QOIDASI bu yerda ham amal qiladi (`buildBridalPrompt.ts` ga qarang):
 * "no extra fingers" deb yozilsa model "fingers" so'ziga e'tibor qaratadi va
 * aynan qo'llarni buzadi. Shuning uchun hamma narsa ijobiy aytiladi — nima
 * BO'LISHI kerakligi yoziladi, nima bo'lmasligi emas.
 *
 * QO'L HARAKATI QASDDAN KAM: video modellari barmoqlarni eng yomon chizadi.
 * Qo'llar tanadan uzoqlashmaydi va hech narsa ushlamaydi — guldasta qo'shsangiz
 * model uni yo'qdan yaratadi va panja shaklini buzadi.
 *
 * BOSH KAMERAGA QAYTADI: tana buriladi, lekin yuz oxirida yana kameraga qaraydi.
 * Yuz uzoq vaqt yon tomonda tursa model qiyofani o'zicha to'qib ketadi.
 */

/** Uch bosqichning chegaralari — uzunlik o'zgarsa matn o'zi moslashadi */
function beats(duration: number): [number, number] {
  return [Math.round(duration * 0.3), Math.round(duration * 0.6)];
}

export function buildClaudeVideoPrompt(duration: number = VIDEO_DURATION): string {
  const [first, second] = beats(duration);

  return [
    'The still image is the first frame of this video. The same woman, the same wedding dress and the same room continue exactly as they appear in it.',
    '',
    `TIMING — one unbroken ${duration}-second take`,
    `0–${first} s: She settles into the pose. She breathes softly, blinks once, and a warm genuine smile grows on her face — it starts in the eyes and reaches the mouth. Her weight shifts a little from one foot to the other and the skirt settles with that movement.`,
    `${first}–${second} s: She lowers her chin and glances down along the dress, the way a bride checks how it falls on her, then lifts her eyes back to the camera. Her shoulders turn a few degrees and the fabric sways gently behind her.`,
    `${second}–${duration} s: She turns her body slowly, about a quarter turn, so the silhouette and the back of the dress come into view, then turns back and faces the camera again. The smile stays and warms. The clip ends on a calm, steady frame with her looking straight into the lens.`,
    '',
    'CAMERA',
    'A single continuous take from the first frame to the last, as if the camera sits on a slow slider that pushes in gradually and ends slightly closer than it began. The movement is smooth, steady and gentle throughout.',
    '',
    'HANDS',
    'Her hands stay relaxed and open at her sides through the whole clip, fingers loose and empty, resting near the skirt. They stay close to her body and keep their natural shape in every frame.',
    '',
    'WHAT STAYS',
    'Her face, hairstyle, skin tone and body proportions stay exactly as in the first frame. The dress keeps the same silhouette, neckline, sleeves, embroidery, colour and length. The walls, floor, furniture, lighting and shadows of the room hold still.',
    '',
    'PHYSICS AND TEXTURE',
    'Fabric moves with its own weight: heavy satin falls slowly and keeps its folds, tulle and lace float a moment behind the body, the train trails along the floor as she turns. Skin keeps its real texture and soft highlights. The overall look is calm, elegant, premium bridal cinematography.',
  ].join('\n');
}
