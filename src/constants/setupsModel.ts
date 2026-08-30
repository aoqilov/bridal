/**
 * "Настройка модели" bo'limi ma'lumoti — примерка uchun model parametrlari.
 *
 * Rasmlar `public/assets/setup/` da turadi, yo'l `public/` ga nisbatan yoziladi.
 * `image` bo'sh bo'lsa kartochkada ikonkali placeholder chiziladi (poza va soch
 * turmagi rasmlari hali tayyor emas).
 */

export type ModelGroupKey = 'height' | 'build' | 'pose' | 'hair';

export type ModelOption = {
  value: string;
  label: string;
  /** Yorliq ostidagi qisqa izoh */
  hint?: string;
  /** Masalan `/assets/setup/height-1.jpg` */
  image?: string;
};

export type ModelGroup = {
  key: ModelGroupKey;
  title: string;
  options: ModelOption[];
};

/** Bo'y bo'limining hamma variantlari uchun bitta rasm */
const HEIGHT_IMAGE = '/assets/setup/height-1.jpg';

export const MODEL_POSE = [
  {
    id: 'pose_01',

    image: '/assets/setup/pose-1.png',

    coordinates: {
      nose: [0.393, 0.125],

      left_shoulder: [0.331, 0.184],
      right_shoulder: [0.510, 0.184],

      left_elbow: [0.283, 0.319],
      right_elbow: [0.566, 0.171],

      left_wrist: [0.186, 0.462],
      right_wrist: [0.497, 0.115],

      left_hip: [0.331, 0.385],
      right_hip: [0.531, 0.385],

      left_knee: [0.366, 0.607],
      right_knee: [0.483, 0.607],

      left_ankle: [0.407, 0.832],
      right_ankle: [0.510, 0.854],

      left_foot: [0.400, 0.890],
      right_foot: [0.566, 0.918]
    },

    aiPromptText: `
Analyze ONLY the person's full-body pose.

Ignore clothing, clothing style, colors, hairstyle, face,
body attractiveness and background.

Detect the exact human body pose and preserve anatomical
left/right orientation.

The person is standing upright.
The torso is slightly rotated.
The head is turned toward the person's left.
The person's right arm is bent upward with the hand near
the neck/face.
The person's left arm hangs naturally downward.
The legs are crossed, with one leg positioned in front
of the other.
Both feet are visible.

Preserve the exact body orientation, limb positions,
leg crossing and hand position.

Return normalized coordinates from 0.0 to 1.0.
x = left to right.
y = top to bottom.

Return ONLY valid JSON.
`
  },

  {
    id: 'pose_02',

   image: '/assets/setup/pose-2.png',

    coordinates: {
      nose: [0.393, 0.125],

      left_shoulder: [0.331, 0.184],
      right_shoulder: [0.510, 0.184],

      left_elbow: [0.283, 0.319],
      right_elbow: [0.566, 0.171],

      left_wrist: [0.186, 0.462],
      right_wrist: [0.497, 0.115],

      left_hip: [0.331, 0.385],
      right_hip: [0.531, 0.385],

      left_knee: [0.366, 0.607],
      right_knee: [0.483, 0.607],

      left_ankle: [0.407, 0.832],
      right_ankle: [0.510, 0.854],

      left_foot: [0.400, 0.890],
      right_foot: [0.566, 0.918]
    },

    aiPromptText: `
Analyze ONLY the person's full-body pose.

Ignore clothing, colors, hairstyle, face and background.

The person is standing upright with the torso slightly
rotated toward the person's left.

The head is turned toward the person's left.

One arm is bent upward and the hand is positioned close
to the neck/face.

The opposite arm hangs naturally downward.

The legs are crossed in a fashion-model standing pose.
One leg is positioned in front of the other.

Preserve:
- exact body orientation
- head rotation
- shoulder position
- elbow position
- wrist position
- hip position
- knee position
- ankle position
- foot position
- leg crossing

Use anatomical left/right.

Return normalized 0.0–1.0 coordinates.

Return ONLY valid JSON.
`
  },

  {
    id: 'pose_03',

   image: '/assets/setup/pose-3.png',

    coordinates: {
      nose: [0.359, 0.104],

      left_shoulder: [0.262, 0.214],
      right_shoulder: [0.531, 0.211],

      left_elbow: [0.269, 0.330],
      right_elbow: [0.607, 0.327],

      left_wrist: [0.434, 0.382],
      right_wrist: [0.352, 0.376],

      left_hip: [0.297, 0.420],
      right_hip: [0.545, 0.420],

      left_knee: [0.310, 0.651],
      right_knee: [0.524, 0.651],

      left_ankle: [0.297, 0.868],
      right_ankle: [0.510, 0.860],

      left_foot: [0.241, 0.940],
      right_foot: [0.559, 0.926]
    },

    aiPromptText: `
Analyze ONLY the person's full-body pose.

Ignore clothing, clothing color, hairstyle, facial appearance
and background.

The person is standing upright.

The torso is mostly facing forward with a slight rotation
toward the person's left.

The head is turned toward the person's left.

Both arms are bent and crossed in front of the torso.

The forearms overlap/cross horizontally in front of the body.
Both hands are positioned near the opposite arms.

The hips and legs face mostly forward.

One leg is slightly positioned in front of the other.
The ankles are close together.

Both feet are visible and the person is wearing heels.

The most important characteristics are:
1. crossed arms
2. head rotation
3. upright torso
4. narrow leg position
5. one leg slightly in front of the other

Preserve the exact body orientation and limb positions.

Use anatomical left/right.

Return normalized coordinates from 0.0 to 1.0.

Return ONLY valid JSON.
`
  }
] as const;

/**
 * Poza kartochkalarining yorliqlari — `MODEL_POSE` dagi `id` ga bog'langan.
 * Yangi poza qo'shilsa shu yerga ham nom yoziladi.
 */
const POSE_TITLES: Record<string, { label: string; hint?: string }> = {
  pose_01: { label: 'Рука у лица', hint: 'ноги скрещены' },
  pose_02: { label: 'Модельная стойка', hint: 'поворот корпуса' },
  pose_03: { label: 'Руки скрещены', hint: 'прямая стойка' },
};

/** Poza variantlari `MODEL_POSE` dan tuziladi — rasm va id o'sha yerdan keladi */
const POSE_OPTIONS: ModelOption[] = MODEL_POSE.map((pose) => ({
  value: pose.id,
  label: POSE_TITLES[pose.id]?.label ?? pose.id,
  hint: POSE_TITLES[pose.id]?.hint,
  image: pose.image,
}));

export const MODEL_GROUPS: ModelGroup[] = [
  {
    key: 'height',
    title: 'Рост',
    options: [
      { value: '150-160', label: '150–160', hint: 'см', image: HEIGHT_IMAGE },
      { value: '160-170', label: '160–170', hint: 'см', image: HEIGHT_IMAGE },
      { value: '170-180', label: '170–180', hint: 'см', image: HEIGHT_IMAGE },
      { value: '180-190', label: '180–190', hint: 'см', image: HEIGHT_IMAGE },
    ],
  },
  {
    key: 'build',
    title: 'Телосложение',
    options: [
      {
        value: '45-55',
        label: 'Худощавое',
        hint: '45–55 кг',
        image: '/assets/setup/55.jpg',
      },
      {
        value: '55-65',
        label: 'Среднее',
        hint: '55–65 кг',
        image: '/assets/setup/65.jpg',
      },
      {
        value: '65-85',
        label: 'Плотное',
        hint: '65–85 кг',
        image: '/assets/setup/85.jpg',
      },
      {
        value: '85-100',
        label: 'Полное',
        hint: '85–100+ кг',
        image: '/assets/setup/100.jpg',
      },
    ],
  },
  {
    key: 'pose',
    title: 'Поза',
    options: POSE_OPTIONS,
  },
  {
    key: 'hair',
    title: 'Причёска',
    options: [
      { value: 'classic', label: 'Собранные', hint: 'классические' },
      { value: 'loose', label: 'Распущенные' },
      { value: 'top-bun', label: 'Верхний пучок' },
      { value: 'low-bun', label: 'Нижний пучок' },
      { value: 'curls', label: 'Локоны' },
    ],
  },
];
