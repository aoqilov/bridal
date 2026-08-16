/**
 * Rus tilida son bilan kelgan so'z shakli.
 * forms: [1 uchun, 2–4 uchun, 5+ uchun] — masalan ['салон', 'салона', 'салонов']
 */
export function plural(count: number, forms: [string, string, string]): string {
  const n = Math.abs(count) % 100;
  const n1 = n % 10;
  if (n > 10 && n < 20) return forms[2];
  if (n1 > 1 && n1 < 5) return forms[1];
  if (n1 === 1) return forms[0];
  return forms[2];
}
