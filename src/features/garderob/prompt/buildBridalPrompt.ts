import type { HemLength } from '@/features/catalog';
import { describeModel, EXPRESSION } from './modelOptions';

/**
 * Примерка prompti — modelga yuboriladigan yagona matn.
 *
 * MUHIM: promptdagi `IMAGE 1`, `IMAGE 2` raqamlari so'rovdagi `input_references`
 * massivining tartibiga bog'langan. Shuning uchun raqamlar qo'lda yozilmaydi —
 * `kinds` massividan hisoblanadi. Massiv tartibi o'zgarsa raqamlar o'zi suriladi.
 */

/** Referens rasm turi — tartibi `generateTryOn.ts` da yig'iladi */
export type RefKind =
  | 'face'
  | 'dress'
  | 'veil'
  | 'jewelry'
  | 'shoes'
  | 'pose'
  | 'hair'
  | 'scarf';

/** [2] → "IMAGE 2" · [2,3,4] → "IMAGES 2, 3 and 4" */
function imageLabel(numbers: number[]): string {
  if (numbers.length === 1) return `IMAGE ${numbers[0]}`;
  const head = numbers.slice(0, -1).join(', ');
  return `IMAGES ${head} and ${numbers[numbers.length - 1]}`;
}

/**
 * Har bir rasmning tavsifi. Uchta narsani aytadi: bu rasm nima, undan nima olinadi
 * va undan nima OLINMAYDI. Uchinchisi eng muhimi — mahsulot fotosida boshqa odam
 * turgan bo'lsa model uni ham chizishga urinadi.
 */
function referenceText(
  kind: RefKind,
  isFirstDress: boolean,
  scarfMode: boolean,
): string {
  switch (kind) {
    case 'face':
      // Ro'mol rejimida sochning rangi/uzunligi bandi olib tashlanadi — o'ram
      // bilan ziddiyatga tushadi va model boshni ochib qo'yadi
      return scarfMode
        ? 'the FACE — identity reference only. Preserve the exact facial identity from this image: same face shape, eyes, nose, lips and skin tone. Do not beautify, idealize, slim, age or otherwise alter the face, and never substitute a different person; the only thing that may differ from this image is her expression, which is described in the FACE section. Take nothing but the identity from this image — no clothing, no pose, no background, and none of the photograph itself: its lighting, its exposure, its colour cast, its white balance, its grain and its sharpness stay behind, and her face is rebuilt under the studio light described in the FACE LIGHTING section. Everything above her forehead, beside her cheeks and around her jaw in the output is the fabric of the wrap described in the HEADSCARF section, whatever this photograph shows there.'
        : 'the FACE — identity reference only. Preserve the exact facial identity from this image: same face shape, eyes, nose, lips and skin tone, plus the natural hair color, length and texture. Do not beautify, idealize, slim, age or otherwise alter the face, and never substitute a different person; the only thing that may differ from this image is her expression, which is described in the FACE section. Take nothing but the identity from this image — no clothing, no pose, no background, and none of the photograph itself: its lighting, its exposure, its colour cast, its white balance, its grain and its sharpness stay behind, and her face is rebuilt under the studio light described in the FACE LIGHTING section.';

    case 'dress':
      return isFirstDress
        ? 'the WEDDING DRESS — THE PRIMARY GARMENT REFERENCE and the ground truth for the garment. Reproduce this exact physical dress: its cut, length, hemline, neckline height and shape, shoulders, sleeves (whether it has any at all, and if so their exact length, width and sheerness), straps, back, waistline, bodice construction, skirt shape and volume, fabric type and sheen, train, color, and every piece of lace, embroidery, beading and appliqué on it. This is not style inspiration and not a starting point. Take from this image the GARMENT AND NOTHING ELSE. If a model or mannequin is wearing the dress, ignore them completely — never their face, hair or body. Ignore just as completely the place where this photo was taken: its background, its walls, its floor, its scenery, its daylight, its shadows and its colour cast stay out of the output. This photograph was taken somewhere else; the picture you are making is taken on the set described in the BACKGROUND LOCK.'
        : 'ANOTHER VIEW OF THE SAME WEDDING DRESS shown in the previous image — not a second dress and not a design variant. Read it together with the other dress photos and merge them into one complete model of one physical garment: use whichever view shows an area most clearly as the truth for that area. Take the garment and nothing else: if a model or mannequin is wearing it, ignore them completely, and ignore the place this photo was taken in — its background, walls, floor, scenery, daylight and shadows stay out of the output.';

    case 'veil':
      return scarfMode
        ? 'the BRIDAL VEIL / HEADPIECE — product reference only. Reproduce its exact shape, length, fabric and embellishment, laid over the headscarf so that the wrap stays fully visible underneath it. If another person, model or mannequin is visible in this image, ignore them completely: take only the veil itself, never their face, hair, body or dress, and never the place this photo was taken in — its background, lighting and shadows stay out of the output. It must not cover, shorten or alter the dress.'
        : 'the BRIDAL VEIL / HEADPIECE — product reference only. Reproduce its exact shape, length, fabric and embellishment, placed naturally on the head. If another person, model or mannequin is visible in this image, ignore them completely: take only the veil itself, never their face, hair, body or dress, and never the place this photo was taken in — its background, lighting and shadows stay out of the output. It must not cover, shorten or alter the dress.';

    case 'jewelry':
      return 'the JEWELLERY — product reference only. Reproduce its exact shape, material and color, worn naturally in its proper place (necklace at the neck, earrings at the ears, bracelet on the wrist). If another person, model or mannequin is visible in this image, ignore them completely: take only the jewellery, never the place this photo was taken in — its background, lighting and shadows stay out of the output. It must not cover or alter the dress.';

    case 'shoes':
      return 'the BRIDAL SHOES — product reference only. Reproduce this exact pair: the shape of the shoe, the height and shape of the heel, the toe, the straps, the material, the colour and every piece of decoration on them. The same pair goes on both feet, worn normally and standing flat on the floor. If another person, model or mannequin appears in this image, take the shoes alone from it — never their body, their legs or their clothing — and never the place this photo was taken in: its background, its surface, its lighting and its shadows stay out of the output. The shoes change nothing about the dress: its hemline stays exactly where the dress reference puts it.';

    case 'hair':
      return 'the HAIRSTYLE REFERENCE — styling reference only. Take from it ONLY the way the hair is styled: its shape, where it is parted, how it is swept back, where the volume sits, how the bun, braid or ponytail is formed and placed, and which strands are left loose around the face. The head it sits on is a faceless display mannequin, not a person. Everything else in this image stays out of the output: the mannequin itself, its skin, its neck and shoulders, any garment or fabric at the edge of the frame, any earring or other jewellery, and the background. Her HAIR COLOUR, HAIR LENGTH and HAIR TEXTURE come from the face reference image and from there alone — this image never changes them. If the face reference shows red hair, the hair stays red; if it shows short hair, it stays short and is styled as closely to this shape as that length allows.';

    case 'scarf':
      return 'the HEADSCARF REFERENCE — wrapping reference only. Take from it ONLY the way the fabric is wrapped: where its front edge sits, how it passes over the crown, how it covers the ears and the neck, where the folds and the volume are, how it is fastened and where any free end falls. The head it sits on is a faceless display mannequin, not a person. Everything else in this image stays out of the output: the mannequin itself, its skin and shoulders, the colour and the material of the fabric shown here, any garment at the edge of the frame, any jewellery, and the background. The colour and the material of her wrap come from the dress, as the HEADSCARF section describes.';

    case 'pose':
      return 'the POSE DIAGRAM — body position reference only, and the authority on where the arms and hands go. Copy the body position from it: the angle of the torso, the exact position of each arm, elbow and hand, and how the legs and weight are placed. Read this diagram from the neck down only — the head is NOT taken from it. Her head is set by the HEAD ANGLE LOCK and stays square to the camera even where the drawing shows it turned to the side. Match the arms and hands to this diagram precisely — do not lower a raised arm, do not move a hand to the waist or the hip, and do not replace the position with a more ordinary one. Take NOTHING else from this image. It is a stylized drawing, not a photograph: ignore its drawing style, lighting, background, clothing, face, hair, skin and body size. The woman drawn in it is not the person being photographed — the dress comes from the dress reference, the face from the face reference, and the body proportions from the BODY section.';
  }
}

/**
 * Fon — hamma generatsiya uchun BITTA studiya: oq devor + jigarrang pol.
 * Pol jigarrang, chunki oq ko'ylak etagi oq polda ko'rinmay ketadi.
 *
 * Matn qasddan juda aniq yozilgan: qanchalik aniq bo'lsa, rasmlar bir-biriga
 * shuncha o'xshash chiqadi. Baribir matn piksel darajasida bir xillikni
 * bermaydi — buning uchun tayyor fon rasmi kerak. O'sha rasm paydo bo'lsa,
 * uni referens sifatida yuboring (`RefKind` ga `background` qo'shib) va bu
 * matnni o'sha rasmga havola bilan almashtiring.
 *
 * DIQQAT: bu yerga taqiqlangan narsalarning NOMINI yozmang (`no rugs`,
 * `no windows`) — CLAUDE.md dagi inkor qoidasiga qarang. Fon nima EKANLIGI
 * aytiladi, nima emasligi emas.
 */
const BACKGROUND =
  'Every photograph is taken on one and the same set, described here precisely so that it comes out the same every time.\n\nTHIS SET IS THE ONLY PLACE THAT APPEARS IN THE PICTURE. Every reference image was photographed somewhere else, under different light, and none of those places carry over: not their walls, not their floors, not their scenery, not their sunlight, not their shadows and not their colour. Read every reference image for the object it documents — the dress, the veil, the jewellery, the hair, the face — and rebuild that object here, in this studio, under this light. The set below is described from scratch and owes nothing to any reference photograph.\n\nTHE WALL: a plain, bright white wall standing directly behind her — one single unbroken plane of smooth matte white paint, the same clean white from edge to edge and from the floor to the top of the frame, evenly lit and free of any pattern, marking or texture.\n\nTHE FLOOR: a warm mid-brown wooden floor running from the foot of that wall toward the camera — matte, evenly toned, its surface one continuous run of plain boards with only a soft natural wood grain. The brown is deep enough that a white dress reads clearly against it, so the hem and the train stand out sharply where they lie on the floor.\n\nTHE JOIN: the white wall meets the brown floor in one straight, clean horizontal line behind her, low in the frame, running level from one side of the picture to the other.\n\nTHE LIGHT: soft, even, frontal studio light with a neutral white balance and no colour cast. She casts a soft contact shadow on the floor at her feet, so she reads as standing in the room rather than pasted onto it.\n\nEnough of the brown floor is in frame for the whole hem and the whole train to lie on it and stay fully visible. The set holds nothing but the white wall, the brown floor and the woman standing alone on it — she is the only thing in the photograph.';

/**
 * @param hijab hijab kategoriyasidagi ko'ylak tanlanganmi (`isHijabItem`) —
 *   `headMode` shu bo'yicha sukut qiymatni oladi (ro'mol yoki soch).
 */
export function buildBridalPrompt(
  kinds: RefKind[],
  model: Record<string, string>,
  hijab = false,
  hemLength: HemLength = 'floor',
): string {
  const { height, build, pose, hair, scarf } = describeModel(model, hijab);

  // Raqamlar — massivdagi o'rniga qarab (1 dan boshlab)
  const faceNumber = kinds.indexOf('face') + 1;
  const dressNumbers = kinds
    .map((kind, index) => (kind === 'dress' ? index + 1 : 0))
    .filter(Boolean);
  const veilNumber = kinds.indexOf('veil') + 1;
  const jewelryNumber = kinds.indexOf('jewelry') + 1;
  const shoesNumber = kinds.indexOf('shoes') + 1;
  const poseNumber = kinds.indexOf('pose') + 1;
  const hairNumber = kinds.indexOf('hair') + 1;
  const scarfNumber = kinds.indexOf('scarf') + 1;

  const faceImage = `IMAGE ${faceNumber}`;
  const dressImage = imageLabel(dressNumbers);
  const manyDressViews = dressNumbers.length > 1;

  /**
   * Etak polgacha yetmasa oyoq ko'rinadi — va shu bilan promptning bir nechta
   * bandi o'zgaradi: LENGTH LOCK, FOOTWEAR va DO NOT ro'yxati.
   *
   * Polgacha ko'ylakda `DO NOT` da "no short dress, no mini dress" turadi —
   * kalta ko'ylakda o'sha band aynan kerakli natijani taqiqlab qo'yadi.
   */
  const feetVisible = hemLength !== 'floor';
  const hemWords =
    hemLength === 'short'
      ? 'at or above the knee, exactly where the reference puts it'
      : 'at mid-calf, exactly where the reference puts it';

  let seenDress = false;
  const referenceBlock = kinds
    .map((kind, index) => {
      const isFirstDress = kind === 'dress' && !seenDress;
      if (kind === 'dress') seenDress = true;
      return `IMAGE ${index + 1} reference is ${referenceText(kind, isFirstDress, scarf !== null)}`;
    })
    .join('\n\n');

  // Faqat tanlangan sozlamalar qatorga tushadi
  const bodyLines = [
    build && `The body of the person wearing the dress is ${build.full}.`,
    height && `Her height is ${height}.`,
  ]
    .filter(Boolean)
    .join('\n');

  /**
   * Gavda tanlangan bo'lsa u promptning BIRINCHI qatoriga ham tushadi.
   * Sabab: modelning "kelin fotosi = ozg'in manekenchi" moyilligi shunchalik
   * kuchliki, ko'ylak qoidalari orasida ko'milgan bitta jumla uni yengmaydi.
   */
  const buildOpening = build ? ` with ${build.short},` : '';

  /** Referens fotodagi manekenchining gavdasini nusxalashni alohida taqiqlaymiz */
  const buildEmphasis = build
    ? `The woman in the dress reference photo is a different person with a different body: never copy her figure, her weight or her proportions. Do not fall back on the slim fashion-model body that bridal photography usually shows. Draw the described figure literally — the width of the shoulders, the thickness of the arms, the bust, the stomach, the hips and the thighs, and the fullness of the face and neck must all match the description. A slim body in a wider dress is a failed result.`
    : '';

  const accessoryLines = [
    veilNumber > 0 &&
      (scarf
        ? `She wears the veil from IMAGE ${veilNumber}, laid over the headscarf and pinned above it, so the wrap stays fully visible underneath and keeps covering the crown, the ears and the neck, and without covering or shortening the dress.`
        : `She wears the veil from IMAGE ${veilNumber}, placed over or behind the hairstyle without flattening, hiding or replacing it, and without covering or shortening the dress.`),
    jewelryNumber > 0 &&
      `She wears the jewellery from IMAGE ${jewelryNumber}, in its proper place and at a natural scale.`,
    'HER HANDS ARE EMPTY. Both hands are bare and open, the fingers visible and relaxed, resting exactly where the pose puts them and carrying nothing whatsoever — she holds no object of any kind, and nothing rests in, hangs from or is gripped by either hand.',
    scarf
      ? 'Everything she wears is accounted for above. The dress, the wrap on her head, and whatever a reference image shows are the complete list: anything not named there is simply absent from this photograph. Her head carries nothing but that wrap unless a reference image shows a headpiece, her arms and hands are bare unless a reference image shows something on them, and her waist is exactly as the dress reference shows it.'
      : 'Everything she wears is accounted for above. The dress, the hair, and whatever a reference image shows are the complete list: anything not named there is simply absent from this photograph. Her head carries nothing but her own hair unless a reference image shows a headpiece, her arms and hands are bare unless a reference image shows something on them, and her waist is exactly as the dress reference shows it.',
  ]
    .filter(Boolean)
    .join('\n');

  /**
   * Bosh bo'limi — soch YOKI ro'mol, hech qachon ikkalasi.
   *
   * Ro'mol rejimida `HAIR` bo'limi butunlay olib tashlanadi: soch haqidagi
   * bitta jumla qolsa ham model boshni ochib qo'yadi. Shu sababli o'ram
   * matnida taqiq emas, nima YOPILGANI va yuzning qayer qismi ochiqligi
   * aytiladi (CLAUDE.md — inkor qoidasi).
   */
  /**
   * Yopiq образ — hijab ko'ylagining o'zi hal qiladi, bosh rejimi emas: mijoz
   * ro'mol o'rniga sochni tanlasa ham hijab ko'ylagi yopiq bo'lib qoladi.
   *
   * Qoida: hijabda yeng hech qachon ochiq bo'lmaydi. Bu `DRESS LOCK` ning
   * "referensda yo'q yengni o'ylab topma" bandiga qarshi turadi, shuning uchun
   * ustuvorlik promptda OCHIQ yozilgan va o'sha band shu rejimda almashtiriladi.
   * Aks holda model ikkita qarama-qarshi buyruqdan birini tasodifan tanlaydi.
   */
  const modest = hijab;

  /** Yopiq образ talabi — `COVERAGE LOCK` dan keyin, undan yuqori ustuvorlikda */
  const modestSection = modest
    ? `
=== MODEST COVERAGE — HIGHER PRIORITY THAN THE DRESS LOCK ===
This is a hijab outfit, so the gown covers her, and where the reference garment does not, the gown is rebuilt here so that it does.
Both arms are covered in fabric from the shoulder all the way down to the wrist, and each sleeve ends at the wrist bone with a finished cuff. The shoulders, the collarbones and the upper chest are covered. The neckline closes high at the base of the throat and meets the edge of the headscarf, so gown and wrap read as one continuous covering. The back is closed all the way up to the neck.
Wherever the reference garment leaves an area of the body open, that area is covered here by the gown itself: carry the same cloth over it, in the same colour, the same fabric and the same finish as the bodice, cut and seamed as though the gown had always been made this way — a full-length sleeve to the wrist where the reference shows a short one or shows the arm, a closed high neck where the reference shows an open one, and a smooth panel across the chest, the shoulders and the back where the reference is cut away.
This is the ONLY thing about the gown that may differ from the reference. Everything the reference does cover still follows the DRESS LOCK exactly: the same silhouette, the same length, the same lace, the same embroidery and beading, in the same places and at the same density. The cloth added for coverage is plain and quiet unless a pattern from the reference runs naturally onto it.
`
    : '';

  /**
   * Oyoq kiyim — faqat etak polgacha yetmaganda. Polgacha ko'ylakda oyoq etak
   * ostida qoladi, ya'ni bu bo'lim ham, tufli referensi ham keraksiz.
   *
   * Tufli tanlanmagan bo'lsa ham bo'lim yoziladi: oyoq ko'rinib turganda model
   * baribir biror poyabzal chizadi — qanday bo'lishini aytmasak, u har safar
   * boshqacha va ko'pincha ko'ylakdan diqqatni tortadigan narsa chizadi.
   * "Yalangoyoq emas" deb yozib bo'lmaydi (inkor qoidasi) — nima borligi aytiladi.
   */
  const footwearSection = !feetVisible
    ? ''
    : shoesNumber > 0
      ? `

=== FOOTWEAR ===
She wears the shoes from IMAGE ${shoesNumber}: the same pair on both feet, matching that image in the shape of the shoe, the height and shape of the heel, the toe, the straps, the material, the colour and every piece of decoration, worn normally and standing flat on the floor.
They sit below the hem and leave it exactly where ${dressImage} puts it — the skirt keeps its own length and its own edge, and the shoes are simply visible beneath it.`
      : `

=== FOOTWEAR ===
Her feet are in a plain pair of closed bridal pumps in soft ivory satin with a modest heel — the same shoe on both feet, smooth and undecorated, so that the dress stays the subject of the photograph.`;

  const headSection = scarf
    ? `=== HEADSCARF — AS BINDING AS THE COVERAGE LOCK ===
Her head is wrapped in a bridal headscarf, and the wrap is ${scarf}.${
        scarfNumber > 0
          ? `
IMAGE ${scarfNumber} shows this wrap. Follow it for the SHAPE of the wrapping only — where the front edge sits, how the fabric passes over the crown, where the folds and the volume are, and where any free end falls.`
          : ''
      }
The fabric covers the crown, the temples, the ears, the sides of the jaw and the whole neck down to the neckline of the dress, and it stays that way for the entire photograph. Above the shoulders the only skin in the picture is her face itself: the forehead below the edge of the wrap, the eyes, the nose, the cheeks, the mouth and the chin, all of them open, evenly lit and clearly visible, so she stays recognisable as the person in ${faceImage}.
The wrap is made of the same fabric and the same colour as the dress and reads as part of the same outfit, plain and smooth where the dress is decorated so that the neckline of the gown keeps its detail. It sits close to the head, keeps the natural round shape of the skull, falls in soft folds with real fabric weight, and ends in a clean, finished edge.
This wrap belongs to the outfit exactly as the dress does: whatever the pose, the veil or the framing does, her head stays wrapped as described here.`
    : `=== HAIR ===
The hair is ${hair}.${
        hairNumber > 0
          ? `
IMAGE ${hairNumber} shows this hairstyle. Follow it for the SHAPE of the style — the part, the sweep, where the volume sits, how the bun, braid or ponytail is formed and placed, and which strands fall loose around the face. Read it for styling only.`
          : ''
      }
Her hair colour, length and texture come from ${faceImage} and from nowhere else: the same shade, the same natural length, the same thickness and the same wave or straightness she already has. Only the styling changes, and the hairline stays exactly as it is in ${faceImage}. The only things in her hair are the hair itself and, if a reference image shows one, that headpiece — her hair is otherwise completely bare.`;

  return `Photorealistic full-body bridal studio photograph of ONE woman${buildOpening} wearing the EXACT wedding dress documented in ${dressImage}, with the face from ${faceImage}.

This is a GARMENT TRANSFER task, not a design task. Do not invent a wedding dress and do not produce a "similar" or "inspired by" dress: take the garment documented in ${dressImage} and put that same physical dress on the person. Use the ${kinds.length} reference images provided.

${referenceBlock}
${
  manyDressViews
    ? `
=== HOW TO READ ${dressImage} — SEVERAL VIEWS OF ONE DRESS ===
${dressImage} are photographs of ONE AND THE SAME wedding dress from different viewpoints and distances. Never treat them as different dresses, as design options or as different outfits, and never put more than one dress in the output.
Merge every view into ONE single, complete model of the dress before drawing anything. Where two views show the same area, the closer view wins on detail and texture, and the wider view wins on placement, scale and proportion. A detail that is clear in only one view is still real and still belongs on the dress.
The output is one continuous photograph: no panels, no grid, no borders, no repeated views, and none of the reference backgrounds.
`
    : ''
}
=== DRESS LOCK — HIGHEST PRIORITY ===
${dressImage} is the ground truth for the garment. Match it exactly in cut, length, hemline, neckline, shoulders and sleeves, waistline position, bodice construction, skirt shape and volume, fabric type and sheen, train, and color.
"Cut" means the design of the dress — A-line, mermaid, ball gown, sheath and so on. It does NOT mean the body shape of whoever is wearing the dress in the reference photo: the body is defined in the BODY section below and is never taken from this image.

REMOVE NOTHING.
Every sleeve, strap, collar, panel, pattern, motif, lace panel, embroidery run, appliqué, bead, crystal, pearl, sequin, ruffle, layer, seam, button and trim that is visible in the dress reference must appear in the output, in the same place, at the same scale and at the same density. Nothing may be dropped, faded, thinned out, blurred away, flattened into plain fabric, replaced with a generic texture or "simplified for the render". If the lace is intricate, draw it as intricate: reproduce the actual motif shapes, not a vague suggestion of lace.
This applies to the construction of the dress just as much as to its decoration: a part of the garment is never left out because it is small, sheer, pale or hard to see.

ADD NOTHING — equally binding in the other direction.
Copy only the decoration that is actually visible in the reference, in the same places, at the same density and the same scale. Never enrich, embellish, upgrade or "improve" the dress:
- no invented patterns, motifs, prints or ornament
- no added lace, appliqué or embroidery
- no added beading, crystals, sequins, pearls, glitter, shimmer or sparkle
- no added ruffles, frills, ruching, gathers, pleats, rosettes or bows
- no tulle layers, overskirts, capes, belts or sashes that the reference does not have
- ${
    modest
      ? 'the sleeves, the neckline and the back follow the MODEST COVERAGE section below, which is the one exception to this list; everywhere else the decoration is copied exactly, and a sleeve or strap that IS in the reference is never taken away or shortened'
      : 'do not invent sleeves or straps where the reference has none, and do not lengthen or widen the ones it does have — but never take away or shorten a sleeve or strap that IS there'
  }
- no added seams, panels or texture on plain fabric
Whatever is plain in the reference stays plain, and whatever is decorated stays decorated, with that same decoration.
If an area is unclear in every reference view, reproduce it as simple plain fabric in the same color and material, and never invent a decorative detail to fill the gap.
Copy the amount of detail exactly: do not increase it and do not reduce it.

=== LENGTH LOCK — THE SINGLE MOST IMPORTANT RULE ===
${
    feetVisible
      ? `The dress must stay exactly as long as it is in the reference, and this reference dress ends above the floor: its hem sits ${hemWords}. The output dress ends at that same height on the leg, with the same hemline shape and the same edge, so her lower legs and her feet stay in full view below it.
The hemline comes from ${dressImage} and from nothing else. Keep it at exactly that height whatever the framing, the aspect ratio, the body type, her height or the pose. Extending the skirt down towards the floor is as wrong as raising it.`
      : `The dress must stay exactly as long as it is in the reference. If the reference dress is floor-length, the output dress is floor-length: it reaches the floor, covers the ankles and pools or breaks on the ground exactly as the reference does.
NEVER shorten the dress. Do not turn it into a mini, short, knee-length, midi, tea-length or cocktail dress. Do not raise, re-cut, angle, slit or restyle the hemline for any reason — not for framing, not for the aspect ratio, not to show the feet, not for the body type or height, and not for the pose.`
  }${footwearSection}

=== COVERAGE LOCK — AS BINDING AS THE LENGTH LOCK ===
${
    modest
      ? 'Whatever the dress covers in the reference, it covers in the output, and wherever the reference leaves the body open the MODEST COVERAGE section below closes it. How much of the body the dress covers is set by that section and by this one, never by styling.'
      : 'Whatever the dress covers in the reference, it covers in the output; whatever it leaves bare stays bare. How much of the body the dress covers is part of the garment’s design, never a styling choice.'
  }
Copy exactly, without simplifying: the sleeves — whether they exist at all, their length, width, cut and how sheer they are — cap sleeves, straps, off-shoulder bands, the height and shape of the neckline, any collar or high neck, the depth and shape of the back, and any lace that continues over the shoulders, arms, chest or upper back.
Sheer lace, tulle, mesh and illusion fabric are real parts of the dress, not empty space. Where the reference shows lace lying over the skin, draw that lace over the skin, with its motifs and its edge. Never read a sheer panel as bare skin, never replace it with a plain edge, and never let a pale or delicate sleeve disappear into the background.
If the reference dress has sleeves, the output dress has those same sleeves. If it has a high or closed neck, the output has that same neck. If its shoulders are covered, they stay covered.
${
    modest
      ? 'Both arms stay covered in cloth from the shoulder to the wrist, the shoulders and the chest stay covered, the neckline stays closed at the throat and the back stays closed — for the whole photograph and in every part of it, exactly as the MODEST COVERAGE section sets out.'
      : 'Never convert the dress into a strapless, sleeveless, bare-shouldered, open-backed or lower-cut version of itself, and never close up or raise a neckline that the reference leaves open. Arms and shoulders are bare in the output ONLY if they are bare in the reference.'
  }
${modestSection}${
  bodyLines
    ? `
=== BODY — AS BINDING AS THE DRESS LOCK ===
${bodyLines}
This is a requirement, not a hint. Build the person's real physical proportions from this description FIRST, then put the dress on that body.
${buildEmphasis}
The dress is made in her size and re-cut to fit this body, so the seams, darts and waistline sit on her real measurements and the fabric tensions, gathers and drapes according to her shape.
The body changes only the FIT of the dress — never its design, length, hemline, cut, decoration, or the scale of its lace and beading, and it must never stretch, shrink, thin out or wash away the pattern. On a petite person the same dress still reaches the floor; on a tall person it still reaches the floor.
`
    : ''
}
=== FACE ===
Preserve the exact facial identity from ${faceImage}: same face shape, eyes, nose, lips and skin tone. Do not beautify, idealize, slim or replace the person, and do not narrow the face or the neck to make her look more like a fashion model — the fullness of the face follows the BODY section. ${
    scarf
      ? 'What covers her head is defined in the HEADSCARF section below.'
      : 'The hairstyle is defined in the HAIR section below.'
  }

Her expression is ${EXPRESSION}.
The expression is the ONLY thing that may differ from ${faceImage}. Move the mouth and the eyes just as much as a gentle smile needs, and change nothing else: not the shape of the face, jaw, nose, lips or eyes, not the proportions, and not the age. If she is not smiling in ${faceImage}, give her this smile while keeping her unmistakably the same person.
ONLY ${faceImage} defines who the person is. The other reference images are product photos: if a model or mannequin appears in any of them, ignore that person entirely — do not take their face, hair or body, and do not blend them with the person from ${faceImage}. The output contains exactly one person, and that person is the one from ${faceImage}.

=== FACE LIGHTING — SHE IS PHOTOGRAPHED HERE, NOT PLACED HERE ===
Her face is lit by the studio light described in the BACKGROUND LOCK and by nothing else: the same soft frontal source, from the same direction and the same height, with the same neutral white balance and the same gentle falloff that light her gown and the wall behind her.
${faceImage} gives you who she is — the shape of the face, every feature, and her own complexion and undertone. It does not give you the light. The exposure, the colour cast, the flash, the white balance, the contrast, the grain and the sharpness of that photograph belong to the room where it was taken; rebuild her face here, under this studio light, at this resolution.
Her skin reads as one continuous body across the whole picture: the brightness, the warmth and the depth of tone on her face match her hands exactly, and the skin is rendered with the same texture, the same fine detail and the same focus everywhere. Head and body are one exposure of one person at one moment — the light travels around her jaw, her chin and her cheekbones the way it travels around her shoulders and her arms, and the shadows on her face fall on the same side, with the same softness, as the shadows on her gown.${
    scarf
      ? `
The edge of the wrap rests ON her skin, and skin and cloth meet as one surface: the fabric overlaps the forehead and the sides of the face with a soft contact shadow where it lies against her, and the skin carries on underneath it instead of stopping at a drawn line. Light bounced off the pale fabric fills the underside of the chin and the sides of the face, while the front edge lays a gentle shadow across the top of the forehead. Face and wrap are the same photograph: the same grain, the same focus, the same colour of light.`
      : ''
  }

=== HEAD ANGLE LOCK — WHAT KEEPS HER RECOGNISABLE ===
Her head stays square to the camera for the whole photograph. The face is frontal: both eyes, both cheeks and both sides of the jaw are equally visible, the nose is centred between them, and she looks straight down the lens.
This holds no matter what the body is doing. When the pose turns the torso, ONLY the torso turns — the neck brings the head back around so the face is presented flat to the camera, at the same angle it has in ${faceImage}.
A frontal face is the whole reason she stays recognisable: the further the head rotates, the less of her real face is left visible and the more the result slides into a different person. Keep the head at the angle it has in ${faceImage} — at most a very slight tilt of the chin, with the face always flat to the camera and both sides of it in view.

${headSection}

=== ACCESSORIES ===
${accessoryLines}

=== POSE AND FRAMING ===
The person is ${pose}.${
    poseNumber > 0
      ? `
IMAGE ${poseNumber} shows this same pose as a diagram. Where the words and the diagram describe the same thing, the diagram is the authority on the position of the arms, the elbows and the hands — read it carefully and place them exactly as they are drawn there. Take only the body position from it, nothing else.`
      : ''
  }
Hold the pose calm and natural, the way a professional bridal photographer would set it, and place the arms and hands exactly where the description above puts them — the arms are the part of a pose that is most often "corrected" into something more ordinary, and doing that here is a failure. Keep the back straight without arching it, keep the twist gentle, and keep the stance asymmetric rather than stiff and frontal.
Whatever the pose, the hands and arms must never cover, flatten, crush or hide the bodice, the neckline, the lace or the front of the skirt — the dress stays fully readable. Hands are always drawn with correct anatomy: five fingers, natural length, soft and slightly parted, never fused, bent backwards or hidden behind the back to avoid drawing them.
Both hands stay empty throughout. A pose is never "completed" by putting something into her hands: whatever the hands are doing, they are doing it with nothing in them.
Full body, head to toe. The ENTIRE wedding dress must be visible from the neckline to the hem, with the hem and the floor beneath it inside the frame. Nothing is cropped. Leave clear space above the head and below the hem.
"Full body" means the whole person AND the whole dress. If the dress is long, show more of the studio floor around it — never shorten the dress to make it fit the frame, and never change the pose in a way that hides or shortens the skirt.
Even at full-body distance the decoration must stay sharp and readable: render the lace, embroidery and beadwork as real, resolved textile detail, never as a soft blur or a flat printed shape.

=== BACKGROUND LOCK — THE SAME SET EVERY TIME ===
${BACKGROUND}

=== OUTPUT ===
Exactly one woman, one dress, one continuous photograph. Professional bridal studio photography, realistic skin texture, realistic fabric physics and weight, high-detail textile texture with crisp lace, embroidery and beadwork.

Before finishing, compare the dress in the output against ${dressImage} part by part: sleeves, neckline, shoulders, back, waistline, hem length, and every piece of lace and beading. Anything that is in the reference but missing from the output — a sleeve above all — means the image is wrong and must be redrawn with that part in place.${
    modest
      ? `
Then check the coverage: cloth must run along both arms from the shoulder to the wrist, over both shoulders, across the chest and the upper back, and the neckline must close at the throat. If any of those runs short, the image is wrong — redraw it with the gown covering them as the MODEST COVERAGE section describes.`
      : ''
  }
${
    shoesNumber > 0
      ? `
Then check her feet: both of them must wear the shoes from IMAGE ${shoesNumber}, matching that image in shape, heel, material, colour and decoration. If the shoes differ from it, or if the two feet do not match each other, the image is wrong — redraw it with that pair on both feet.`
      : ''
  }
Then check her hands and the room: if she is holding anything at all, or if anything besides her appears in the studio, the image is wrong — redraw it with her hands empty and the studio bare. The wall behind her must be bright white and the floor beneath her must be warm brown wood, with the hem and train lying visibly on that brown floor.
Finally check her head: her face must be square to the camera, with both cheeks in view, and must read as the same person as ${faceImage}. If the head has rotated to one side or the face no longer matches, the image is wrong — redraw it with the face frontal.
Then check how her face is lit: it must sit in the same light as the rest of the picture, with the same brightness, the same warmth, the same softness of shadow and the same sharpness as her hands and her gown. If the face reads as brighter, darker, cooler, warmer, flatter or crisper than the body — if it looks placed into the picture rather than photographed in it — the image is wrong and must be redrawn with the face lit by this studio.${
    scarf
      ? `
Check the wrap in the same way: the crown, the temples, the ears, the jawline and the whole neck must be covered by its fabric, and her face must be fully open and clearly visible inside it. If any of those areas is uncovered, the image is wrong — redraw it with the wrap sitting as the HEADSCARF section describes.`
      : ''
  }${
    build
      ? `
Check the body against the BODY section in the same way: if the woman in the output looks slimmer than described, the image is wrong — redraw her at the described size.`
      : ''
  }

=== DO NOT ===
${
    build
      ? 'No slimmed-down body, no default slim fashion-model figure, no body copied from the dress reference photo, no narrowed face or neck, no body that is smaller than the BODY section describes.\n'
      : ''
  }${
    // Bu yerga "no loose hair" kabi ibora YOZILMAYDI — model o'sha otni ko'radi
    // va aynan o'shani chizadi. Faqat nima bo'lishi kerakligi aytiladi.
    scarf
      ? 'Nothing above her shoulders except her open face and the fabric of the wrap, which stays over the crown, the ears, the jawline and the whole neck throughout.\n'
      : ''
  }${
    modest
      ? 'Cloth along the whole of both arms down to the wrist, cloth over both shoulders and across the chest and the upper back, and a neckline closed at the throat — in every part of the picture.\n'
      : ''
  }${
    // Etagi kalta ko'ylakda "no short dress" bandi kerakli natijaning o'zini
    // taqiqlaydi — shuning uchun u yerda taqiq emas, talab yoziladi
    feetVisible
      ? 'A hemline at exactly the height the dress reference shows, with her lower legs and both feet in clear view below it, no altered hemline, '
      : 'No short dress, no mini dress, no cocktail dress, no knee-length or midi dress, no altered or raised hemline, '
  }no open mouth, no teeth or gums showing, no grin, no laugh, no arm moved out of the pose, no hand resting on the waist or hip unless the pose diagram shows it there, no redesigned dress, no different dress, ${
    // Yopiq образ rejimida bu yerga "sleeveless", "bare arms" kabi otlar
    // yozilmaydi — inkor qoidasi (CLAUDE.md): model otni ko'radi, "no" ni emas.
    modest
      ? 'no changed silhouette, no shortened sleeve, sheer lace panels drawn as lace with their motifs,'
      : 'no changed neckline, no changed silhouette, no missing or shortened sleeves, no dress turned strapless or sleeveless, no bare shoulders or bare arms where the reference is covered, no sheer lace panel replaced by bare skin, no lowered or raised neckline, no opened back,'
  } no invented pattern, no added lace, no added beading or sparkle, no added ruffles, no extra decoration of any kind, no missing pattern, no lost or faded lace or embroidery, no simplified or smoothed-out decoration, no plain fabric where the reference is decorated, no blurred or mushy textile texture, nothing held or carried in either hand, ${scarf ? 'nothing laid on top of the wrap that no reference image shows' : 'nothing added to her hair'}, nothing worn that no reference image shows, no busy or outdoor background, no venue scene, no object standing anywhere in the studio, no extra person, no mannequin, no second dress, no collage, no grid, no panels, no split frame, no repeated views, no text, no watermark, no logo, no extra limbs.`;
}
