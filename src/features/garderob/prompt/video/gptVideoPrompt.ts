/**
 * VIDEO PROMPTI — "gpt" varianti.
 *
 * Matn qanday berilgan bo'lsa shundayligicha saqlangan: solishtirish toza
 * chiqishi uchun hech narsa tahrirlanmadi. Ikkinchi variant —
 * `claudeVideoPrompt.ts`; almashtirish `index.ts` dagi bitta konstanta orqali.
 *
 * DIQQAT — uchta nuqta:
 *
 * 1. Vaqtlar matnda qo'lda yozilgan (0.0–3.2 / 3.2–6.7 / 6.7–10.0), shuning
 *    uchun bu variant FAQAT `VIDEO_DURATION = 10` bilan mos keladi. Uzunlikni
 *    o'zgartirsangiz matndagi raqamlarni ham qo'lda yangilash kerak.
 *
 * 2. Matn "the provided wedding-dress image" va "the provided salon image" ga
 *    murojaat qiladi, biz esa modelga FAQAT bitta tayyor kadr yuboramiz —
 *    alohida ko'ylak va salon referenslari yo'q.
 *
 * 3. NEGATIVE REQUIREMENTS bo'limi taqiqlangan narsalarni nomma-nom sanaydi
 *    ("extra fingers", "deformed hands", ...). Loyihadagi inkor qoidasi
 *    (CLAUDE.md) bunga qarshi: rasm modellari inkorni emas, SO'ZLARNI ko'radi.
 *    Bu variantning qiymati ham shuni amalda tekshirishda.
 */

/**
 * Asl matn — 6471 belgi. Kling chegarasi 2500, shuning uchun bu qiymat
 * so'rovga TUSHMAYDI: u havola sifatida saqlanadi, ishlatiladigani — quyidagi
 * `PROMPT`. Boshqa modelga o'tilsa va chegara yetarli bo'lsa, `buildGptVideoPrompt`
 * shu konstantani qaytarishi kifoya.
 */
const PROMPT_FULL = `Create a premium cinematic bridal fashion advertisement for an online wedding-dress try-on experience.

The video shows the SAME bride wearing the SAME wedding dress inside the SAME bridal salon throughout the entire video.

The purpose of this video is to show a customer how she could look wearing the selected wedding dress.

This must look like a real premium bridal fashion commercial, NOT like an AI-generated transformation.

TOTAL DURATION: 10 seconds.

Create exactly 3 distinct cinematic shots.

━━━━━━━━━━━━━━━━━━
SHOT 1 — ZOOM IN → ZOOM OUT
0.0–3.2 seconds
━━━━━━━━━━━━━━━━━━

The bride stands naturally in the center of the bridal salon.

Start with a slightly wider full-body composition.

Slowly zoom IN toward the bride.

During the zoom-in:

* reveal her face naturally
* show the neckline and upper details of the wedding dress
* maintain her exact facial identity
* maintain natural skin texture
* maintain realistic body proportions
* maintain the exact wedding dress design

The bride gives a subtle, confident and happy smile.

After reaching the closer composition, smoothly zoom OUT again to reveal the full wedding-dress silhouette.

The bride herself should remain mostly still.

The camera moves.
Do NOT make the bride rotate.

━━━━━━━━━━━━━━━━━━
SHOT 2 — FRONT-SIDE ORBIT / PAN
3.2–6.7 seconds
━━━━━━━━━━━━━━━━━━

The bride remains standing in the center.

Perform a slow cinematic front-side camera orbit/pan.

IMPORTANT CAMERA RESTRICTION:

The camera must NEVER move behind the bride.

Imagine a clock around the bride.

The bride is looking toward approximately 3 o'clock.

The camera is ONLY allowed to move through the front arc:

1 o'clock → 3 o'clock → 5 o'clock

The camera MUST NOT cross behind the bride.

Do NOT show:

* her back
* the back of the dress
* rear profile
* 6 o'clock
* 7–12 o'clock positions

Only show:

* front
* front-left three-quarter view
* front-right three-quarter view

The bride should NOT rotate around herself.

Only the CAMERA moves.

The purpose of this shot is to clearly show the FRONT DESIGN of the wedding dress:

* neckline
* bodice
* waist
* sleeves
* embroidery
* fabric
* skirt silhouette
* overall bridal look

Maintain exact dress consistency throughout the shot.

━━━━━━━━━━━━━━━━━━
SHOT 3 — BRIDAL BOUQUET / HERO FRAME
6.7–10.0 seconds
━━━━━━━━━━━━━━━━━━

The bride is now holding an elegant bridal bouquet.

The bouquet appears naturally in her hands.

She smiles warmly and looks genuinely happy.

Her emotional expression should communicate:

"I love how I look in this wedding dress."

The bride remains elegant and natural.

The camera makes a very subtle cinematic push-in.

End on a beautiful premium bridal advertising frame with:

* full or three-quarter view of the bride
* wedding dress clearly visible
* bouquet clearly visible
* beautiful salon background
* elegant lighting
* natural happy expression

The final frame should feel like a luxury wedding-dress advertisement.

━━━━━━━━━━━━━━━━━━
IDENTITY CONSISTENCY — CRITICAL
━━━━━━━━━━━━━━━━━━

The bride's identity MUST remain unchanged throughout the entire video.

Preserve:

* exact facial identity
* face shape
* eyes
* nose
* lips
* eyebrows
* skin tone
* hairstyle
* age appearance

Do NOT change the bride into another person.

Do NOT beautify or redesign the face.

Do NOT create an artificial face.

No face morphing.

No face flickering.

No facial deformation.

No changing facial features between shots.

━━━━━━━━━━━━━━━━━━
BODY / POSE CONSISTENCY — CRITICAL
━━━━━━━━━━━━━━━━━━

Maintain realistic and consistent body proportions.

Do NOT:

* change body shape
* change height
* stretch limbs
* slim the body artificially
* enlarge body parts
* deform shoulders
* deform waist
* distort arms
* distort hands

Natural elegant posture.

The bride should look like a real person standing in a real bridal salon.

━━━━━━━━━━━━━━━━━━
DRESS CONSISTENCY — CRITICAL
━━━━━━━━━━━━━━━━━━

The provided wedding-dress image is the absolute visual source of truth.

Preserve the exact:

* dress silhouette
* color
* neckline
* sleeves
* waist
* embroidery
* lace
* ornaments
* fabric
* train
* proportions
* construction
* details

Do NOT redesign the dress.

Do NOT invent another wedding dress.

Do NOT add random decorations.

Do NOT remove important dress details.

The same dress must remain recognizable in all three shots.

━━━━━━━━━━━━━━━━━━
SALON CONSISTENCY
━━━━━━━━━━━━━━━━━━

The provided salon image is the source of truth for the environment.

Keep:

* same interior
* same walls
* same mirrors
* same furniture
* same architectural details
* same overall lighting style

Do not teleport the bride to another environment.

Do not dramatically redesign the salon.

━━━━━━━━━━━━━━━━━━
MOVEMENT
━━━━━━━━━━━━━━━━━━

Movement must be realistic, elegant and physically plausible.

Use subtle:

* breathing
* natural blinking
* small facial movements
* natural hand movement
* realistic fabric movement

Avoid exaggerated motion.

No dancing.

No fast spinning.

No dramatic body movement.

The wedding dress should move naturally according to gravity and body motion.

━━━━━━━━━━━━━━━━━━
CAMERA STYLE
━━━━━━━━━━━━━━━━━━

Premium luxury bridal commercial.

Elegant cinematic camera movement.

Slow controlled camera motion.

Professional fashion-film cinematography.

Natural depth of field.

Realistic lighting.

Premium bridal salon atmosphere.

The camera should prioritize showing the wedding dress.

The bride should remain the visual hero.

━━━━━━━━━━━━━━━━━━
NEGATIVE REQUIREMENTS
━━━━━━━━━━━━━━━━━━

Absolutely avoid:

face deformation
identity change
face morphing
body deformation
extra fingers
missing fingers
deformed hands
unnatural arms
extra limbs
changing hairstyle
changing skin tone
changing age
changing dress
dress redesign
dress color change
dress texture change
random accessories
changing salon
camera going behind bride
showing the back of the bride
showing the back of the dress
full 360-degree orbit
bride rotating around herself
fast camera movement
unnatural movement
AI-looking skin
plastic skin
uncanny expression
exaggerated smile
exaggerated emotions
flickering
temporal inconsistency

The final result must look like a real premium bridal fashion advertisement filmed inside the selected salon.

The bride should look happy, confident, elegant and genuinely excited about her wedding dress.

The overall emotional message is:

"This is me. This is how I could look in this wedding dress."`;

/**
 * Kling chegarasiga (2500 belgi) siqilgan versiya — 1841 belgi.
 *
 * Asl matnning MAZMUNI saqlangan: uchta kadr va ularning vaqtlari, kamera
 * faqat old yoyda harakatlanishi, kelinning o'zi burilmasligi, 3-kadrdagi
 * guldasta, qiyofa/ko'ylak/salon qulflari, harakat va suratga olish uslubi.
 *
 * Olib tashlangani — `NEGATIVE REQUIREMENTS` ro'yxati: u bir o'zi 1200 belgidan
 * ko'p joy egallardi va loyihadagi inkor qoidasiga ham zid edi (CLAUDE.md).
 * Uning o'rniga eng muhim bandi ijobiy shaklda yozilgan: barmoqlar soni
 * "beshta" deb aytiladi, "extra fingers" deyilmaydi.
 */
const PROMPT = `Premium cinematic bridal fashion commercial. The still image is the first frame: the same bride, the same dress and the same salon continue exactly as they appear in it. Ten seconds, three shots.

SHOT 1 (0.0-3.2s) — She stands in the centre of the salon. The camera starts on a wide full-body framing, pushes in slowly to reveal her face, the neckline and the bodice detail, then pulls smoothly back out to the full silhouette. Only the camera moves; she stays in place and gives a subtle, confident smile.

SHOT 2 (3.2-6.7s) — A slow cinematic front-side orbit. She stays in place, facing the camera; only the camera travels, and it stays on the front arc, swinging between the front-left three-quarter view and the front-right three-quarter view with her face and the front of the dress in view the whole time. This shot reads the front design: neckline, bodice, waist, sleeves, embroidery, fabric, skirt silhouette.

SHOT 3 (6.7-10.0s) — She now holds an elegant bridal bouquet, resting naturally in both hands in front of her. She smiles warmly, genuinely happy with how she looks. A very subtle push-in ends on a hero frame: three-quarter view, dress and bouquet clearly visible, elegant salon light.

CONSISTENCY — Her face, hairstyle, skin tone, age and body proportions stay exactly as in the first frame. The dress keeps the same silhouette, colour, neckline, sleeves, embroidery, lace, fabric and train. The salon keeps the same walls, mirrors, furniture and lighting. Her hands keep their natural shape, five fingers on each hand, in every frame.

MOTION — Gentle and realistic: breathing, natural blinking, small facial movement, fabric falling with its own weight. Slow controlled camera, natural depth of field, professional fashion-film cinematography, premium bridal salon atmosphere. She looks happy, confident and elegant.`;

/**
 * `duration` qabul qilinadi, lekin ishlatilmaydi: matndagi vaqtlar qo'lda
 * yozilgan va 10 sekundga moslangan (yuqoridagi izohga qarang).
 */
export function buildGptVideoPrompt(_duration: number): string {
  return PROMPT;
}

/** Asl, siqilmagan matn — solishtirish va boshqa modelga o'tish uchun */
export const GPT_VIDEO_PROMPT_FULL = PROMPT_FULL;
