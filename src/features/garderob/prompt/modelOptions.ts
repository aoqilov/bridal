/**
 * "Настройка модели" tanlovlarini promptga tushadigan inglizcha bo'laklarga o'giradi.
 *
 * Kalitlar va qiymatlar manbasi — `@/constants/setupsModel` dagi `MODEL_GROUPS`.
 * O'sha yerga yangi variant qo'shsangiz, shu fayldagi mos jadvalga ham qator qo'shing:
 * jadvalda yo'q qiymat promptga umuman tushmaydi (tanlanmagan deb hisoblanadi).
 *
 * UI matni rus tilida, prompt — inglizcha. Aralashtirilmaydi.
 */

import { MODEL_GROUPS, MODEL_POSE } from '@/constants/setupsModel';

/** Bo'y — `MODEL_GROUPS[height]` */
const HEIGHT: Record<string, string> = {
  '150-160': 'petite (~155cm), shorter legs, compact proportions',
  '160-170': 'average height (~165cm), balanced natural proportions',
  '170-180': 'tall (~175cm), long legs, elongated silhouette',
  '180-190': 'very tall (~185cm), notably long legs and an elongated silhouette',
};

/** Gavda tavsifi: `short` — promptning birinchi qatoriga, `full` — BODY bo'limiga */
export type BuildDescription = { short: string; full: string };

/**
 * Gavda — `MODEL_GROUPS[build]`.
 *
 * MUHIM: bu yerga yorliq emas, ANATOMIYA yoziladi. Model "plus-size" degan
 * so'zga deyarli reaksiya qilmaydi — uning "kelin fotosi = ozg'in manekenchi"
 * moyilligi juda kuchli va mavhum yorliq uni yengmaydi. Yelka, qo'l, ko'krak,
 * qorin, son va yuz — har biri alohida aytilganda natija o'zgaradi.
 */
const BUILD: Record<string, BuildDescription> = {
  '45-55': {
    short: 'a slim, slender body',
    full: 'slim and slender: narrow shoulders, a flat stomach, a small bust, narrow hips, thin arms and thighs with a clear gap between them, visible collarbones, a delicate neck and a narrow face',
  },
  '55-65': {
    short: 'an average, balanced body',
    full: 'average and balanced: shoulders and hips of similar width, a softly defined waist, a moderate bust, arms and thighs of normal everyday thickness, and a face of normal width',
  },
  '65-85': {
    short: 'a full, heavy-set body, clearly larger than a fashion model',
    full: 'noticeably fuller and heavier than average: rounded shoulders, thick upper arms, a full bust, a soft stomach with no defined waist, wide hips and full thighs that touch, and a fuller, rounder face with a soft neck',
  },
  '85-100': {
    short: 'a large, heavy, plus-size body, far larger than a fashion model',
    full: 'large, heavy and plus-size, unmistakably much bigger than a fashion model: broad rounded shoulders, thick heavy upper arms, a large full bust, a round protruding stomach that is the widest part of the torso, very wide hips, thick thighs pressed together with no gap, a full round face with a soft double chin, and a thick neck',
  },
};

/**
 * Poza — `MODEL_POSE` dagi `id` lar, ya'ni UI dagi `pose-1..3.png` rasmlari.
 *
 * Tavsiflar professional kelin fotografi bergan ko'rsatmaday yoziladi: og'irlik
 * qaysi oyoqda, yelka va iyak qanday, tirsak tanadan uzoqdami, barmoqlar qanday.
 * Model shu detallardan poza quradi; "modeldek turadi" kabi umumiy ibora esa
 * unga hech narsa bermaydi.
 *
 * Chap/o'ng — DOIM modelning o'z tanasiga nisbatan (anatomik), kadrga nisbatan emas.
 *
 * `MODEL_POSE[].aiPromptText` va `coordinates` — pozani taniash uchun yozilgan
 * eski ma'lumot, hech qayerda ishlatilmaydi va generatsiyaga ta'sir qilmaydi.
 */
const POSE: Record<string, string> = {
  // pose-1.png — to'g'ri, kameraga qarab, qo'llar pastda
  pose_01:
    'standing tall and facing the camera almost square-on, her weight settled onto her back foot with the front knee softly bent so the hips sit at a gentle angle rather than dead level; shoulders drawn down and back, neck long, chin brought slightly forward and a touch down; both arms hang relaxed along her sides and are held a little away from the body so the elbows never press flat into the waist; the hands are soft and open with the fingers gently curved and slightly parted, turned so the camera sees the narrow edge of the hand rather than a flat palm or the back of the hand; she looks straight into the lens',

  // pose-2.png — yarim burilgan, o'ng qo'l pastda, chap qo'l yelka oldida
  pose_02:
    "standing in a three-quarter stance with her body turned about forty-five degrees away from the camera, the far shoulder set back and the near shoulder forward, her weight carried on the back leg with the front knee softly bent; her head brought all the way back round over the front shoulder so her face is square to the camera, chin slightly lowered; her right arm hangs long, relaxed and a little away from her side; her left arm is raised and bent with the elbow held out and away from the ribs, the hand lifted to just below the collarbone beside the shoulder and face, the fingers soft, relaxed and slightly parted, resting lightly without gripping and without covering her face or her jaw; she looks into the lens",

  // pose-3.png — qo'llar kindik sathida yumshoq birlashtirilgan
  pose_03:
    'standing upright and facing the camera, her weight on one leg with the other knee softly bent and that foot set slightly forward; shoulders down and back, neck long, chin a little forward; both arms come down along the body and the hands meet low in front at the level of the navel, the fingers of one hand resting softly over the other with the wrists relaxed and the elbows held slightly away from the waist so the arms keep a clear gap from the torso; the hands rest lightly against the dress without pressing into it, gripping it or bunching the fabric; she looks straight into the lens',
};

/**
 * Yuz ifodasi — hozircha sozlama emas, hamma generatsiyada bir xil.
 * Foydalanuvchiga tanlov berilsa: `MODEL_GROUPS` ga guruh qo'shib, shu qatorni
 * `POSE` kabi jadvalga aylantiring.
 */
export const EXPRESSION =
  'a gentle smile made with the lips closed. Her lips stay sealed and touching along their whole length for the entire photograph, and the smile is formed only by lifting the corners of the mouth a little and by the warmth in her eyes and slightly raised cheeks. Keep it small, calm and unforced — the quiet half-smile of a bride, with a closed, relaxed mouth and a soft, alive gaze. Her mouth stays shut: the smile never opens the lips, never separates them, never shows the teeth or the gums, and never becomes a grin or a laugh';

/**
 * Soch turmagi — `MODEL_GROUPS[hair]`.
 *
 * Poza kabi, bu yerga ham geometriya yoziladi: soch qayerdan ajratilgan, quloq
 * ko'rinadimi, hajm qayerda, turmak boshning qaysi qismida o'tiradi. "Chiroyli
 * yig'ilgan" kabi ibora modelga hech narsa bermaydi.
 *
 * Rang, uzunlik va tuzilish bu yerda AYTILMAYDI — ular yuz suratidan olinadi
 * (promptning `HAIR` bo'limiga qarang).
 */
const HAIR: Record<string, string> = {
  // hair-1.png
  'low-bun':
    'gathered into a sleek, polished low bun at the nape of the neck: the hair drawn back from a clean side part, brushed flat and glossy over the ears with no loose strands anywhere, and wound into a smooth rolled bun that sits low and wide just above the neck. The whole surface stays sleek and shining, and the face, ears and neck are left completely clear',

  // hair-2.png
  'half-up':
    'worn half up and half down: the top section from the crown and the temples is drawn back and secured at the back of the head, giving soft height and volume over the crown, while the rest of the length falls loose over the shoulders and down the back in wide, soft waves. The front is swept back off the face so the forehead and cheeks stay clear',

  // hair-3.png
  'messy-bun':
    'gathered into a soft, loosely textured low bun: the hair swept back with volume and movement rather than brushed flat, pinned into a full, slightly undone bun low at the back of the head, with a few fine wavy tendrils left loose in front of the ears and along the jaw. Deliberately soft and romantic rather than sleek, but the face itself stays clear',

  // hair-4.png
  braid:
    'drawn back into one soft braid: the hair swept smoothly back from a side part, gathered low at the nape and plaited into a single loose, chunky braid that falls down the back of the head and over the shoulder. The braid is relaxed and slightly pulled open rather than tight and thin, and the front is brushed back so the face stays clear',

  // hair-5.png
  'braided-crown':
    'styled into a braided crown: one braid runs across the head like a headband, from above one temple around the top of the head toward the other side, with the remaining hair gathered underneath into a soft, full low updo at the back. Fine wavy tendrils are left loose in front of the ears and at the nape, and the face is left clear',

  // hair-6.png
  ponytail:
    'drawn up into a high ponytail: the hair swept up smoothly from the nape and the sides, with soft volume over the crown, and tied high at the back of the head; the length then falls from the tie in long, loose waves down the back and over one shoulder. The front is brushed back cleanly so the face, ears and neck stay clear',
};

/** Poza tanlanmaganda — neytral, to'liq bo'y kadr uchun eng xavfsiz turish */
const DEFAULT_POSE =
  'standing straight and facing the camera, weight settled evenly, shoulders down and back, both arms relaxed along her sides and held a little away from the body, hands soft with the fingers gently curved; she looks into the lens';

/**
 * Soch tanlanmaganda — yuz rasmidagi turmak saqlanadi.
 * "O'zgartirma" deyish "biror narsa o'ylab top" deyishdan xavfsizroq.
 */
const DEFAULT_HAIR =
  'exactly as it is in the face reference image — do not restyle it in any way';

export type ModelPrompt = {
  /** Tanlanmagan bo'lsa `null` — promptga o'sha qator umuman qo'shilmaydi */
  height: string | null;
  build: BuildDescription | null;
  pose: string;
  hair: string;
};

/**
 * Tanlangan pozaning diagramma rasmi (`/assets/setup/pose-N.png`).
 *
 * Matn bilan berilgan poza modelga yetarli emas — u qo'llarni "odatiyroq"
 * holatga tortadi (masalan belga). Shuning uchun rasm ham referens sifatida
 * yuboriladi; promptda uning raqami `poseNumber` orqali ko'rsatiladi.
 * Poza tanlanmagan bo'lsa `null` — rasm ham, raqam ham qo'shilmaydi.
 */
export function poseReferenceImage(model: Record<string, string>): string | null {
  if (!POSE[model.pose]) return null;
  return MODEL_POSE.find((item) => item.id === model.pose)?.image ?? null;
}

/**
 * Tanlangan soch turmagining referens rasmi (`/assets/setup/hair-N.png`).
 *
 * Rasm `MODEL_GROUPS` dagi `image` maydonidan olinadi — ya'ni rasmi bor variant
 * referens bilan, rasmi yo'q variant faqat matn bilan ishlaydi. Yangi turmak
 * qo'shganda rasmni keyinroq qo'ysangiz ham hech narsa buzilmaydi.
 */
export function hairReferenceImage(model: Record<string, string>): string | null {
  if (!HAIR[model.hair]) return null;
  const group = MODEL_GROUPS.find((item) => item.key === 'hair');
  return group?.options.find((opt) => opt.value === model.hair)?.image ?? null;
}

/**
 * `useWardrobeStore.model` dagi tanlovlarni prompt bo'laklariga aylantiradi.
 * Bo'y va gavda ixtiyoriy; poza va soch uchun har doim qiymat bo'ladi (default bilan).
 */
export function describeModel(model: Record<string, string>): ModelPrompt {
  return {
    height: HEIGHT[model.height] ?? null,
    build: BUILD[model.build] ?? null,
    pose: POSE[model.pose] ?? DEFAULT_POSE,
    hair: HAIR[model.hair] ?? DEFAULT_HAIR,
  };
}
