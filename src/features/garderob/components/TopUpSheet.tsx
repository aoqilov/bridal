import { useState } from 'react';
import { CusSheet, useToast } from '@/components/ui';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatCurrency';
import { PAYMENT_METHODS, type PaymentMethod } from '@/constants/pricing';
import { useWalletStore } from '@/store/zustand';

/** Mock to'lov "kutish" vaqti — haqiqiy API ulanganda o'rniga so'rov keladi */
const PAY_MS = 1_500;

type Props = {
  /** To'ldiriladigan summa; `null` — oyna yopiq */
  amount: number | null;
  /** Tranzaksiya izohi uchun qo'shimcha ("Пакет 5 генераций") */
  note?: string;
  onClose: () => void;
};

/** To'lov usulini tanlash — hozircha mock, balans darrov to'ldiriladi */
export default function TopUpSheet({ amount, note, onClose }: Props) {
  const topUp = useWalletStore((s) => s.topUp);
  const { show } = useToast();
  const [paying, setPaying] = useState<PaymentMethod | null>(null);

  const pay = (method: PaymentMethod) => {
    if (amount === null || paying) return;
    setPaying(method);
    // TODO: haqiqiy to'lov API (Payme/Click/Uzum) shu yerga ulanadi
    window.setTimeout(() => {
      topUp(amount, note ? `${note} (${method})` : `Пополнение (${method})`);
      setPaying(null);
      onClose();
      show('Кошелёк пополнен', 'success');
    }, PAY_MS);
  };

  return (
    <CusSheet open={amount !== null} onClose={onClose} title="Способ оплаты">
      <p className="text-sm text-muted">
        К оплате{' '}
        <span className="font-semibold text-foreground">
          {formatCurrency(amount ?? 0)} сум
        </span>
      </p>

      <div className="mt-4 space-y-2">
        {PAYMENT_METHODS.map((method) => (
          <button
            key={method}
            type="button"
            onClick={() => pay(method)}
            disabled={paying !== null}
            className={cn(
              'flex w-full items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-semibold text-foreground transition',
              'hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              paying !== null && paying !== method && 'opacity-50',
            )}
          >
            {method}
            {paying === method ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-primary" />
            ) : (
              <span className="text-xs font-normal text-subtle">Оплатить</span>
            )}
          </button>
        ))}
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-subtle">
        Оплата пока работает в тестовом режиме — деньги не списываются, баланс
        пополняется сразу.
      </p>
    </CusSheet>
  );
}
