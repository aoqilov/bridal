import type { HemLength } from '@/features/catalog';

/**
 * Sodda примерка prompti — mijozning TAYYOR suratidagi kiyimni katalogdagi
 * ko'ylakka almashtiradi.
 *
 * `buildBridalPrompt` dan tubdan farq qiladi va shuning uchun alohida fayl:
 * u yerda surat noldan quriladi (fon, poza, gavda, soch — hammasi promptdan),
 * bu yerda esa surat allaqachon bor va undan FAQAT bitta narsa o'zgaradi.
 * Ikkalasini bitta funksiyaga qo'shsak, bir-biriga zid qulflar (BACKGROUND LOCK
 * ↔ PHOTOGRAPH LOCK, BODY ↔ mijozning haqiqiy gavdasi) shartlar ichida
 * chalkashib ketadi.
 *
 * MUHIM: promptdagi `IMAGE 1`, `IMAGE 2` raqamlari so'rovdagi `input_references`
 * massivining tartibiga bog'langan. Raqamlar qo'lda yozilmaydi — `kinds`
 * massividan hisoblanadi.
 *
 * INKOR QOIDASI (CLAUDE.md) shu yerda ham amal qiladi: taqiqlangan narsaning
 * nomini promptga yozmang, nima BO'LISHI kerakligini ayting.
 */

/** Referens rasm turi — tartibi `generateSwap.ts` da yig'iladi */
export type SwapRefKind = 'photo' | 'dress';

/** [2] → "IMAGE 2" · [2,3,4] → "IMAGES 2, 3 and 4" */
function imageLabel(numbers: number[]): string {
  if (numbers.length === 1) return `IMAGE ${numbers[0]}`;
  const head = numbers.slice(0, -1).join(', ');
  return `IMAGES ${head} and ${numbers[numbers.length - 1]}`;
}

/**
 * Har bir rasmning tavsifi — bu rasm nima, undan nima olinadi, nima olinmaydi.
 *
 * To'liq rejimdagidan teskari: u yerda har bir referensdan "joy, yorug'lik va
 * soyalar olinmaydi" deyiladi, bu yerda esa aynan mijoz fotosining joyi va
 * yorug'ligi SAQLANADI, ko'ylak fotosiniki esa tashlab ketiladi.
 */
function referenceText(kind: SwapRefKind, isFirstDress: boolean): string {
  switch (kind) {
    case 'photo':
      return 'THE WOMAN AND HER SETTING — she is the person to dress in the gown, and this is the place she is photographed in. Take from it everything about her and about the picture: who she is, her face, her hair, her skin, her body and its real proportions, her stance, the position of her arms, hands and legs, whatever she holds, the place she is standing in, everything behind and around her, the ground under her feet, the light falling on her, the direction and softness of her shadows, the colour of that light, the camera angle, the distance, the framing, and the grain and sharpness of the photograph. Take one thing from it and one thing only differently: the clothing on her body, which is replaced by the wedding gown described below.';

    case 'dress':
      return isFirstDress
        ? 'the WEDDING DRESS — THE GARMENT REFERENCE and the ground truth for the gown. Reproduce this exact physical dress: its cut, length, hemline, neckline height and shape, shoulders, sleeves (whether it has any at all, and if so their exact length, width and sheerness), straps, back, waistline, bodice construction, skirt shape and volume, fabric type and sheen, train, colour, and every piece of lace, embroidery, beading and appliqué on it. This is not style inspiration and not a starting point. Take from this image the GARMENT AND NOTHING ELSE. If a model or mannequin is wearing the dress, ignore them entirely — never their face, hair, body, stance or proportions. Ignore just as completely the place where this photo was taken and the photograph it is: its background, its walls, its floor, its scenery, its daylight, its shadows, its colour cast, its exposure and its grain all stay behind. The gown is rebuilt inside the photograph of IMAGE 1, under the light that is already there.'
        : 'ANOTHER VIEW OF THE SAME WEDDING DRESS shown in the previous image — not a second dress and not a design variant. Read it together with the other dress photos and merge them into one complete model of one physical garment: use whichever view shows an area most clearly as the truth for that area. Take the garment and nothing else: if a model or mannequin is wearing it, ignore them entirely, and ignore the place this photo was taken in — its background, floor, daylight, shadows and colour stay behind.';
  }
}

type Options = {
  /**
   * Hijab kategoriyasidagi ko'ylak (`isHijabItem`). Ikki narsani yoqadi:
   * yopiq образ (yeng, bo'yin, orqa) va boshdagi ro'mol.
   */
  hijab?: boolean;
  /** Ko'ylak etagi qayerda tugaydi (`hemLengthOf`) — LENGTH LOCK shunga qarab yoziladi */
  hemLength?: HemLength;
};

export function buildSwapPrompt(
  kinds: SwapRefKind[],
  { hijab = false, hemLength = 'floor' }: Options = {},
): string {
  const photoNumber = kinds.indexOf('photo') + 1;
  const dressNumbers = kinds
    .map((kind, index) => (kind === 'dress' ? index + 1 : 0))
    .filter(Boolean);

  const photoImage = `IMAGE ${photoNumber}`;
  const dressImage = imageLabel(dressNumbers);
  const manyDressViews = dressNumbers.length > 1;

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
      return `IMAGE ${index + 1} reference is ${referenceText(kind, isFirstDress)}`;
    })
    .join('\n\n');

  /**
   * Yopiq образ — `buildBridalPrompt` dagi bilan bir xil mantiq: bu band
   * `DRESS LOCK` ning "referensda yo'q yengni o'ylab topma" qoidasiga qarshi
   * turadi, shuning uchun ustuvorlik promptda ochiq yozilgan.
   *
   * Ro'mol ham shu yerda: hijab ko'ylagi ochiq soch bilan mijozga keraksiz
   * natija beradi. Yuz baribir tegilmaydi — o'ram faqat sochni yopadi.
   */
  const modestSection = hijab
    ? `

=== MODEST COVERAGE — HIGHER PRIORITY THAN THE DRESS LOCK ===
This is a hijab outfit, so the gown covers her, and where the reference garment does not, the gown is rebuilt here so that it does.
Both arms are covered in fabric from the shoulder all the way down to the wrist, and each sleeve ends at the wrist bone with a finished cuff. The shoulders, the collarbones and the upper chest are covered. The neckline closes high at the base of the throat. The back is closed all the way up to the neck.
Wherever the reference garment leaves an area of the body open, that area is covered here by the gown itself: carry the same cloth over it, in the same colour, the same fabric and the same finish as the bodice, cut and seamed as though the gown had always been made this way — a full-length sleeve to the wrist where the reference shows a short one or shows the arm, a closed high neck where the reference shows an open one, and a smooth panel across the chest, the shoulders and the back where the reference is cut away.
This is the ONLY thing about the gown that may differ from the reference. Everything the reference does cover still follows the DRESS LOCK exactly: the same silhouette, the same length, the same lace, the same embroidery and beading, in the same places and at the same density. The cloth added for coverage is plain and quiet unless a pattern from the reference runs naturally onto it.

=== HEADSCARF — PART OF THIS OUTFIT ===
Her head is wrapped in a bridal headscarf that belongs to this gown: made of the same fabric and the same colour as the dress, plain and smooth where the gown is decorated, sitting close to the head, keeping the natural round shape of her skull, falling in soft folds with real fabric weight and ending in a clean, finished edge.
The wrap covers the crown, the temples, the ears, the sides of the jaw and the whole neck down to the neckline of the gown. Above her shoulders the only skin in the picture is her face itself: the forehead below the edge of the wrap, the eyes, the nose, the cheeks, the mouth and the chin, all of them open, evenly lit and clearly visible.
Her face inside that wrap is exactly the face in ${photoImage} — the same shape, the same features, the same expression, the same skin, at the same angle and in the same light. The wrap is the only thing added above her shoulders, and it changes nothing about who she is.
The edge of the wrap rests ON her skin: the fabric overlaps the forehead and the sides of the face with a soft contact shadow where it lies against her, and light bounced off the pale cloth fills the underside of the chin. Wrap and face are the same photograph — the same grain, the same focus, the same colour of light.`
    : '';

  /** Boshga tegilmaydigan rejim — soch fotodagidek qoladi */
  const hairLine = hijab
    ? 'Her hair is covered by the wrap described in the HEADSCARF section, and her face stays exactly as it is.'
    : `Her hair stays exactly as ${photoImage} shows it: the same style, the same parting, the same volume, the same colour, the same length, the same texture and the same loose strands, falling in the same places and catching the light in the same way.`;

  return `Photorealistic photograph of the woman from ${photoImage} WEARING THE WEDDING DRESS documented in ${dressImage}.

SHE IS DRESSED IN THAT WEDDING GOWN. It is on her body in this photograph, covering her from the neckline down to its own hem, and it is the reason this image is being made. An output in which she is still dressed the way ${photoImage} dresses her has failed, however well everything else is rendered.

Everything else about ${photoImage} — who she is, her face, her hair, her body, her stance, the place, the light and the camera — she keeps, and that is set out further down. Do not invent a wedding dress and do not produce a "similar" or "inspired by" dress: take the garment documented in ${dressImage} and put that same physical gown on her, exactly where she stands and exactly as she stands. Use the ${kinds.length} reference images provided.

${referenceBlock}
${
    manyDressViews
      ? `
=== HOW TO READ ${dressImage} — SEVERAL VIEWS OF ONE DRESS ===
${dressImage} are photographs of ONE AND THE SAME wedding dress from different viewpoints and distances. Never treat them as different dresses, as design options or as different outfits, and never put more than one dress in the output.
Merge every view into ONE single, complete model of the dress before drawing anything. Where two views show the same area, the closer view wins on detail and texture, and the wider view wins on placement, scale and proportion. A detail that is clear in only one view is still real and still belongs on the dress.
The output is one continuous photograph: no panels, no grid, no borders, no repeated views, and none of the dress-reference backgrounds.
`
      : ''
  }
=== THE OUTPUT FRAME — WHAT THE FINISHED PICTURE SHOWS ===
The finished picture shows THE WOMAN FROM ${photoImage}, standing where she stands, in her own surroundings, photographed by the same camera at the same distance — and the wedding dress from ${dressImage} is what she has on.
Both halves are equally binding and neither one may swallow the other. A picture of the gown on its own, on a mannequin, on a model from the dress photographs, or in the room where those photographs were taken, is the wrong picture. A picture of her still dressed as ${photoImage} dresses her is the wrong picture too. The right picture is her, in her place, in that gown.
The canvas, the composition and the subject come from ${photoImage}. Only the cloth on her body comes from ${dressImage}.

=== THE GOWN ON HER — WHAT THIS PICTURE IS FOR ===
From the shoulders down, what her body wears is the wedding gown from ${dressImage}. Its bodice is on her torso. Its sleeves, straps or shoulders sit on her shoulders and arms exactly as the reference cuts them. Its skirt falls from her waist and runs down her legs to its own hem. Every part of her that ${photoImage} shows covered by her own clothing is covered by this gown instead, and what appears there is the gown's own fabric, its own colour, its own lace and its own beading.
Build the gown onto her as real cloth on a real body: it wraps around her, it has thickness at its edges, it presses and creases where her arm or her stance pushes against it, and it hangs and swings away from her where nothing holds it. It is worn, not laid over the picture.
Where the gown leaves an area of her body open, what shows there is her own skin from ${photoImage}, continuing exactly as it does everywhere else in the photograph.
This is the entire point of the image: she is in a wedding dress she was not wearing before, and that dress is the one in ${dressImage}.

=== WHAT SHE KEEPS FROM ${photoImage} ===
The gown is the one thing that is new. Everything below belongs to her and to her photograph, and it comes through into the output as it already is.

HER FACE AND HAIR: she must read instantly as the same woman. Her face keeps its shape, its eyes, nose, lips and brows, its skin tone, its texture and its marks, her age, her expression, the angle of her head and her gaze. Do not beautify, idealise, slim, smooth, retouch or "improve" her in any way. ${hairLine}

HER BODY: her real proportions as the photograph shows them — the width of her shoulders, the length and thickness of her arms, her bust, her waist, her stomach, her hips, her thighs and her height, all exactly as they already are. The gown is made in her size and fitted to that body. Bridal photography leans hard towards a slim fashion-model figure; that pull is wrong here, because the body in this picture is already decided and it is hers.

HER HEIGHT AND PROPORTIONS: she stands exactly as tall as she stands in ${photoImage}, and she is built to the same proportions. Her head is the same size against her body. Her legs run the same share of her full height, and they are the same length from hip to knee and from knee to ankle. Her waist, her hips and her knees sit at the same heights on her, and her shoulders are the same width against her hips.
Read this off the frame and hold it there: the top of her head and the soles of her feet sit at the same heights in the picture as they do in ${photoImage}, and her waist and her knees fall at the same points between them. Her whole figure is drawn at that one scale — a long skirt covers her legs, but it does not change how long they are underneath it.

HER POSE: her stance, her weight on the same leg, the turn of her torso, the position of every arm, elbow, wrist and hand, her fingers doing the same thing, and the same objects still held in the same grip. Her hands, her skin and anything on them — rings, a watch, a bracelet, glasses on her face — all come through.

THE PLACE: the background behind her in full, with its walls, surfaces, scenery, depth, horizon and blur, and the ground under her feet. Whatever else stands in that scene stands where it is.

THE PHOTOGRAPH: the camera position, the angle, the distance, the focal length and perspective, the crop and framing, the depth of field, the exposure, the white balance, the colour, the contrast, the grain and the sharpness.

=== DRESS LOCK — THE GARMENT ITSELF ===
${dressImage} is the ground truth for the gown. Match it exactly in cut, length, hemline, neckline, shoulders and sleeves, waistline position, bodice construction, skirt shape and volume, fabric type and sheen, train, and colour.
"Cut" means the design of the dress — A-line, mermaid, ball gown, sheath and so on. It does NOT mean the body of whoever wears the dress in the reference photo: the body in the output is the body already in ${photoImage}, and it is never taken from the dress reference.

REMOVE NOTHING.
Every sleeve, strap, collar, panel, pattern, motif, lace panel, embroidery run, appliqué, bead, crystal, pearl, sequin, ruffle, layer, seam, button and trim that is visible in the dress reference must appear in the output, in the same place, at the same scale and at the same density. Nothing may be dropped, faded, thinned out, blurred away, flattened into plain fabric, replaced with a generic texture or "simplified for the render". If the lace is intricate, draw it as intricate: reproduce the actual motif shapes, not a vague suggestion of lace.

ADD NOTHING — equally binding in the other direction.
Copy only the decoration that is actually visible in the reference, in the same places, at the same density and the same scale:
- no invented patterns, motifs, prints or ornament
- no added lace, appliqué or embroidery
- no added beading, crystals, sequins, pearls, glitter, shimmer or sparkle
- no added ruffles, frills, ruching, gathers, pleats, rosettes or bows
- no tulle layers, overskirts, capes, belts or sashes that the reference does not have
- ${
    hijab
      ? 'the sleeves, the neckline and the back follow the MODEST COVERAGE section below, which is the one exception to this list; everywhere else the decoration is copied exactly, and a sleeve or strap that IS in the reference is never taken away or shortened'
      : 'do not invent sleeves or straps where the reference has none, and do not lengthen or widen the ones it does have — but never take away or shorten a sleeve or strap that IS there'
  }
- no added seams, panels or texture on plain fabric
Whatever is plain in the reference stays plain, and whatever is decorated stays decorated, with that same decoration. If an area is unclear in every reference view, reproduce it as simple plain fabric in the same colour and material.

=== FIT — THE GOWN IS REMADE IN HER SIZE ===
The gown is cut and sewn for the woman in ${photoImage}: the seams, darts and waistline sit on her real measurements, the bodice follows her actual torso, and the fabric tensions, gathers, folds and drapes according to her shape and the pose she is already in. Where her arm crosses her body or her hip carries her weight, the cloth answers that — it creases, pulls and falls the way real fabric does on a real person standing like that.
Her size changes only the FIT of the gown — never its design, length, hemline, cut or decoration, and never the scale of its lace and beading. The pattern keeps its own size on the cloth whatever her measurements are.

=== COVERAGE LOCK — AS BINDING AS THE DRESS LOCK ===
${
    hijab
      ? 'Whatever the dress covers in the reference, it covers in the output, and wherever the reference leaves the body open the MODEST COVERAGE section below closes it. How much of the body the gown covers is set by that section and by this one, never by styling.'
      : 'Whatever the dress covers in the reference, it covers in the output; whatever it leaves bare stays bare. How much of the body the gown covers is part of the garment’s design, never a styling choice.'
  }
Copy exactly, without simplifying: the sleeves — whether they exist at all, their length, width, cut and how sheer they are — cap sleeves, straps, off-shoulder bands, the height and shape of the neckline, any collar or high neck, the depth and shape of the back, and any lace that continues over the shoulders, arms, chest or upper back.
Sheer lace, tulle, mesh and illusion fabric are real parts of the dress, not empty space. Where the reference shows lace lying over the skin, draw that lace over the skin, with its motifs and its edge. Never read a sheer panel as bare skin, never replace it with a plain edge, and never let a pale or delicate sleeve disappear into the background.
${
    hijab
      ? 'Both arms stay covered in cloth from the shoulder to the wrist, the shoulders and the chest stay covered, the neckline stays closed at the throat and the back stays closed — for the whole photograph and in every part of it, exactly as the MODEST COVERAGE section sets out.'
      : 'Never convert the dress into a strapless, sleeveless, bare-shouldered, open-backed or lower-cut version of itself, and never close up or raise a neckline that the reference leaves open. Arms and shoulders are bare in the output ONLY if they are bare in the reference.'
  }${modestSection}

=== LENGTH LOCK ===
${
    feetVisible
      ? `The gown is exactly as long as the reference dress, and this reference dress ends above the floor: its hem sits ${hemWords}. On her, the hem reaches that same height on the leg, with the same hemline shape and the same edge, so her lower legs and her feet stay in full view below it — wearing whatever ${photoImage} already shows on her feet, unchanged.
The hemline comes from ${dressImage} and from nothing else. Keep it at exactly that height whatever her height, her stance or the framing of the photograph. Extending the skirt down towards the ground is as wrong as raising it.`
      : `The gown is exactly as long as the reference dress, which reaches the ground: on her it runs all the way down to the ground she is standing on, covers her ankles and pools or breaks on that surface exactly as the reference does, with the same hemline and the same train.
The hem lies on the real ground of ${photoImage} — the same floor, pavement, grass or step she is already standing on — and it lies there the way heavy fabric lies, with a contact shadow where cloth meets ground.
NEVER shorten the dress. Do not turn it into a mini, short, knee-length, midi, tea-length or cocktail dress. Do not raise, re-cut, angle, slit or restyle the hemline for any reason — not for the framing, not for the aspect ratio, not to show her feet, and not for her stance.
If the photograph is cropped above the ground, the skirt still runs the full way down and simply continues past the bottom edge of the frame; it is never cut short to fit.`
  }

=== LIGHT MATCH — THE GOWN IS LIT BY THIS PHOTOGRAPH ===
The gown is lit by the light that is already in ${photoImage} and by nothing else: the same source from the same direction and the same height, the same hardness or softness, the same white balance and colour cast, the same intensity and the same falloff that fall on her face, her arms and the scene behind her.
Highlights on satin and silk sit where that light would put them; the folds fall into shadow on the side away from it; and the gown casts its own shadow on her body and on the ground in the same direction, and with the same softness, as every other shadow in the picture.
${dressImage} shows you the garment. It does not give you the light: the exposure, the colour, the flash, the white balance, the contrast, the grain and the sharpness of those photographs belong to a different room, and they stay there. Rebuild the gown here, in this light, at this resolution, with the same grain and the same sharpness as the rest of the picture — so that gown and woman read as one exposure of one moment, not as a garment pasted onto a photo.

=== OUTPUT ===
Exactly one woman, one gown, one continuous photograph, in the same place, at the same moment, from the same camera as ${photoImage}.
The picture shows a PERSON IN A PLACE who happens to be wearing this gown — a photograph of her, framed as ${photoImage} frames her, with her face, her body and her surroundings all in it. It is not a product photograph of the dress, and it is not any of the reference images handed back.

Before finishing, check the gown first: she must be dressed in the wedding dress from ${dressImage}, on her body, in this picture. If she is still in the clothing that ${photoImage} puts on her, or if her outfit is only partly the gown, the image has failed at its one job and must be redrawn with the wedding dress on her.
Then compare that gown against ${dressImage} part by part: sleeves, neckline, shoulders, back, waistline, hem length, and every piece of lace and beading. Anything that is in the reference but missing from the output — a sleeve above all — means the image is wrong and must be redrawn with that part in place.
Then compare the rest against ${photoImage} part by part: her face, her hair, her skin, her body and its proportions, her stance, her arms and hands, the background, the ground, the light, the shadows, the framing and the grain. Anything there that came out different must be redrawn as it was — above all her face: if the woman in the output reads as a different, slimmer or younger person, the image has failed.
Then measure her against the frame: the top of her head, her waist, her knees and the soles of her feet must sit at the same heights in the picture as they do in ${photoImage}. If she has come out shorter, wider-built or shorter in the leg than ${photoImage} shows her, the image is wrong — redraw her at her own height, with her legs at their own length.${
    hijab
      ? `
Then check the coverage: cloth must run along both arms from the shoulder to the wrist, over both shoulders, across the chest and the upper back, the neckline must close at the throat, and the wrap must cover the crown, the temples, the ears, the jawline and the whole neck with her face fully open inside it. If any of those runs short, the image is wrong — redraw it as the MODEST COVERAGE and HEADSCARF sections describe.`
      : ''
  }
Finally check the light: if the gown reads as brighter, darker, cooler, warmer, flatter or crisper than her face and the scene around her — if it looks placed into the picture rather than photographed in it — the image is wrong and must be redrawn with the gown lit by this photograph.

=== DO NOT ===
She is dressed in the wedding gown from ${dressImage} in every part of the picture, from the neckline to the hem.
Her own face, hair${
    // DIQQAT: ro'yxat ko'ylak TALABI bilan boshlanadi va bu yerda "no original
    // outfit", "no changed background" kabi bandlar YO'Q — inkor qoidasi
    // (CLAUDE.md): model "no" ni emas, otni ko'radi. O'sha bandlar tufayli
    // birinchi variant rasmni umuman o'zgartirmay qaytargan edi.
    hijab ? ' under the wrap described above' : ''
  }, body, stance, hands, surroundings, ground, light and camera frame all stay as ${photoImage} has them.
No different woman, no beautified, retouched, smoothed or younger face, no slimmed-down body, no default slim fashion-model figure, no body copied from the dress reference photo, no narrowed face or neck, no studio backdrop, ${
    // Etagi kalta ko'ylakda "no short dress" bandi kerakli natijaning o'zini
    // taqiqlaydi — shuning uchun u yerda taqiq emas, talab yoziladi
    feetVisible
      ? 'a hemline at exactly the height the dress reference shows, with her lower legs and both feet in clear view below it, no altered hemline, '
      : 'no short dress, no mini dress, no cocktail dress, no knee-length or midi dress, no altered or raised hemline, '
  }no redesigned dress, no different dress, ${
    // Yopiq образ rejimida bu yerga "sleeveless", "bare arms" kabi otlar
    // yozilmaydi — inkor qoidasi (CLAUDE.md): model otni ko'radi, "no" ni emas.
    hijab
      ? 'no changed silhouette, no shortened sleeve, sheer lace panels drawn as lace with their motifs,'
      : 'no changed neckline, no changed silhouette, no missing or shortened sleeves, no dress turned strapless or sleeveless, no bare shoulders or bare arms where the reference is covered, no sheer lace panel replaced by bare skin, no lowered or raised neckline, no opened back,'
  } no invented pattern, no added lace, no added beading or sparkle, no added ruffles, no extra decoration of any kind, no missing pattern, no lost or faded lace or embroidery, no simplified or smoothed-out decoration, no plain fabric where the reference is decorated, no blurred or mushy textile texture, no lighting borrowed from the dress photographs, no extra person, no mannequin, no second dress, no collage, no grid, no panels, no split frame, no repeated views, no text, no watermark, no logo, no extra limbs.`;
}
