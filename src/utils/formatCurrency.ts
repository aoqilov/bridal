export function formatCurrency(amount: number, locale = 'ru-RU'): string {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(amount);
}
