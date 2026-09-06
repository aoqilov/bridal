/**
 * "Настройка модели" tanlovlarini promptga tushadigan inglizcha bo'laklarga o'giradi.
 *
 * Kalitlar va qiymatlar manbasi — `@/constants/setupsModel` dagi `MODEL_GROUPS`.
 * O'sha yerga yangi variant qo'shsangiz, shu fayldagi mos jadvalga ham qator qo'shing:
 * jadvalda yo'q qiymat promptga umuman tushmaydi (tanlanmagan deb hisoblanadi).
 *
 * UI matni rus tilida, prompt — inglizcha. Aralashtirilmaydi.
 */

import {
  headMode,
  MODEL_GROUPS,
  MODEL_POSE,
  SCARF_GROUP,
} from '@/constants/setupsModel';

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

/**
 * Ro'mol o'rami — `SCARF_GROUP` (hijab ko'ylagida "Причёска" o'rniga chiqadi).
 *
 * Soch jadvali kabi bu yerda ham GEOMETRIYA yoziladi: mato qayerdan boshlanadi,
 * nimani yopadi, uchi qayerga tushadi. Har bir tavsifda uchta narsa bo'lishi
 * SHART — toj/chakka/quloq, bo'yin va yuzning ochiqligi. Bittasi tushib qolsa
 * model o'sha joyni "odatiy" qilib chizadi.
 *
 * INKOR QOIDASI (CLAUDE.md): bu yerga taqiqni yozmang. "sochi ko'rinmasin"
 * emas — "mato tojni, chakkani, quloqni va butun bo'ynini yopadi" deb yoziladi.
 */
const SCARF: Record<string, string> = {
  classic:
    'wrapped closely and smoothly around the head: its front edge sits across the forehead just above the eyebrows, the fabric passes back over the crown, down over the temples and the ears, comes forward along both sides of the jaw, crosses under the chin and is pinned there, and the ends are tucked in under the neckline of the dress so the throat and the whole neck stay covered. The fabric lies flat and close, following the natural round shape of the head, with one clean unbroken edge framing the face',

  draped:
    'wrapped closely over the crown, the temples, the ears and the whole neck, with its front edge across the forehead just above the eyebrows and its edge pinned under the chin, and one long end left free: that end is carried back over the shoulder and falls down the front of the bodice in soft vertical folds, long enough to reach the waist, its weight visible in the drape',

  turban:
    'wound in a turban style: a close under-layer first covers the ears, the jawline and the whole neck and is tucked into the neckline of the dress, then the outer fabric is wrapped over it in several smooth overlapping bands that rise from the forehead back across the crown and finish in a soft folded knot set to one side above the temple. The wrap has visible sculpted volume on top of the head, and the front edge still crosses the forehead just above the eyebrows so the face stays open',

  smooth:
    'wrapped as a single sleek layer that follows the shape of the head exactly: the front edge across the forehead just above the eyebrows, the fabric flat and unbroken over the crown, the temples, the ears and the whole neck, pinned invisibly and tucked into the neckline, with a smooth matte surface and no volume on the crown, so that a veil laid over it reads clearly against it',
};

/** Ro'mol rejimida variant tanlanmaganda — eng neytral yopiq o'ram */
const DEFAULT_SCARF =
  'wrapped closely and smoothly around the head: its front edge across the forehead just above the eyebrows, the fabric covering the crown, the temples, the ears and the whole neck, pinned under the chin and tucked in under the neckline of the dress, lying flat and following the natural round shape of the head';

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
  /**
   * Bosh — soch turmagi YOKI ro'mol o'rami. Ikkalasidan aynan bittasi `null`
   * bo'lmaydi: `headMode` qaysi rejim ekanini hal qiladi, prompt esa mos
   * bo'limni chizadi. Ikkalasi bir vaqtda bo'lsa model ikkisini aralashtiradi.
   */
  hair: string | null;
  scarf: string | null;
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
export function hairReferenceImage(
  model: Record<string, string>,
  hijab = false,
): string | null {
  // Ro'mol rejimida ochiq sochli maneken rasmi o'ramga qarshi ishlaydi
  if (headMode(model, hijab) === 'scarf') return null;
  if (!HAIR[model.hair]) return null;
  const group = MODEL_GROUPS.find((item) => item.key === 'hair');
  return group?.options.find((opt) => opt.value === model.hair)?.image ?? null;
}

/**
 * Tanlangan ro'mol o'ramining referens rasmi.
 *
 * `SCARF_GROUP` da hozircha rasm yo'q — funksiya `null` qaytaradi va o'ram faqat
 * matn bilan ishlaydi (soch kabi, hech narsa buzilmaydi). `scarf-N.png` lar
 * qo'shilib `image` yozilgach, rasm o'zi referenslarga qo'shiladi.
 */
export function scarfReferenceImage(
  model: Record<string, string>,
  hijab = false,
): string | null {
  if (headMode(model, hijab) !== 'scarf') return null;
  if (!SCARF[model.scarf]) return null;
  return SCARF_GROUP.options.find((opt) => opt.value === model.scarf)?.image ?? null;
}

/**
 * `useWardrobeStore.model` dagi tanlovlarni prompt bo'laklariga aylantiradi.
 *
 * Bo'y va gavda ixtiyoriy; poza uchun har doim qiymat bo'ladi (default bilan).
 * Bosh — `headMode` bo'yicha: soch YOKI ro'mol, hech qachon ikkalasi.
 * `hijab` — hijab kategoriyasidagi ko'ylak tanlanganmi (`isHijabItem`).
 */
export function describeModel(
  model: Record<string, string>,
  hijab = false,
): ModelPrompt {
  const scarfMode = headMode(model, hijab) === 'scarf';

  return {
    height: HEIGHT[model.height] ?? null,
    build: BUILD[model.build] ?? null,
    pose: POSE[model.pose] ?? DEFAULT_POSE,
    hair: scarfMode ? null : (HAIR[model.hair] ?? DEFAULT_HAIR),
    scarf: scarfMode ? (SCARF[model.scarf] ?? DEFAULT_SCARF) : null,
  };
}
