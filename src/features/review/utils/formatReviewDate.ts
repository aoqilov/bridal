import { APP_LOCALE } from '@/constants/app';

const rtf = new Intl.RelativeTimeFormat(APP_LOCALE, { numeric: 'auto' });

/** "2 дня назад" uslubidagi nisbiy sana */
export function formatReviewDate(iso: string): string {
  const diffMs = new Date(iso).getTime() - Date.now();

  const minutes = Math.round(diffMs / 60_000);
  if (Math.abs(minutes) < 60) return rtf.format(minutes, 'minute');

  const hours = Math.round(diffMs / 3_600_000);
  if (Math.abs(hours) < 24) return rtf.format(hours, 'hour');

  const days = Math.round(diffMs / 86_400_000);
  if (Math.abs(days) < 30) return rtf.format(days, 'day');

  const months = Math.round(days / 30);
  if (Math.abs(months) < 12) return rtf.format(months, 'month');

  return rtf.format(Math.round(months / 12), 'year');
}
