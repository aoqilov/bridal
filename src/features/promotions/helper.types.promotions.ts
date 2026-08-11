export type Promotion = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  cover: string;
  discountPercent?: number;
  startsAt: string;   // ISO
  endsAt: string;     // ISO
  description: string;
  conditions?: string[]; // ["Только аренда", "Не суммируется с другими скидками"]
  ctaLabel?: string;
  ctaUrl?: string;    // masalan "/catalog?kind=dress"
  accentColor?: 'primary' | 'accent' | 'danger';
};
