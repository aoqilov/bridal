import { useState } from 'react';
import { MdAccountBalanceWallet, MdAdd, MdRemove } from 'react-icons/md';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/formatCurrency';
import {
  GENERATION_PACKS,
  GENERATION_PRICE,
  TOPUP_PRESETS,
  packDiscount,
} from '@/constants/pricing';
import { useWalletStore } from '@/store/zustand';
import TopUpSheet from './TopUpSheet';

/** "Оплата" bo'limi — hamyon, to'ldirish, tariflar va amallar tarixi */
export default function WalletPanel() {
  const balance = useWalletStore((s) => s.balance);
  const transactions = useWalletStore((s) => s.transactions);
  const freeUsed = useWalletStore((s) => s.freeUsed);

  // Ochilgan to'lov varaqchasining summasi va izohi
  const [topUp, setTopUp] = useState<{ amount: number; note?: string } | null>(null);

  const left = Math.floor(balance / GENERATION_PRICE);

  return (
    <div className="px-4 pb-8 pt-4">
      {/* Hamyon */}
      <div className="rounded-2xl bg-brand-gradient p-[1px]">
        <div className="rounded-2xl bg-surface px-4 py-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-muted">
            <MdAccountBalanceWallet size={16} className="text-primary" />
            Кошелёк
          </p>
          <p className="mt-1 font-serif text-3xl font-semibold text-foreground">
            {formatCurrency(balance)} <span className="text-base">сум</span>
          </p>
          <p className="mt-1 text-[11px] text-subtle">
            {left > 0
              ? `Хватит на ${left} ${plural(left, 'генерацию', 'генерации', 'генераций')}`
              : 'Пополните кошелёк, чтобы создавать образы'}
            {!freeUsed && ' · первая генерация бесплатно'}
          </p>
        </div>
      </div>

      {/* Tez to'ldirish */}
      <p className="mb-2 mt-5 text-sm font-semibold text-foreground">Пополнить</p>
      <div className="grid grid-cols-2 gap-2">
        {TOPUP_PRESETS.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => setTopUp({ amount })}
            className="rounded-xl border border-border py-2.5 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            + {formatCurrency(amount)}
          </button>
        ))}
      </div>

      {/* Tariflar */}
      <p className="mb-2 mt-5 text-sm font-semibold text-foreground">Тарифы</p>
      <div className="space-y-2">
        <div className="flex items-center justify-between rounded-xl bg-surface px-4 py-3">
          <span className="text-sm text-foreground">1 генерация</span>
          <span className="text-sm font-semibold text-foreground">
            {formatCurrency(GENERATION_PRICE)} сум
          </span>
        </div>

        {GENERATION_PACKS.map((pack) => (
          <button
            key={pack.count}
            type="button"
            onClick={() =>
              setTopUp({ amount: pack.price, note: `Пакет ${pack.count} генераций` })
            }
            className="flex w-full items-center justify-between rounded-xl border border-border px-4 py-3 text-left transition hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span className="flex items-center gap-2 text-sm text-foreground">
              {pack.count} генераций
              <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-fg">
                −{packDiscount(pack)}%
              </span>
            </span>
            <span className="text-sm font-semibold text-foreground">
              {formatCurrency(pack.price)} сум
            </span>
          </button>
        ))}
      </div>

      {/* Tarix */}
      {transactions.length > 0 && (
        <>
          <p className="mb-2 mt-5 text-sm font-semibold text-foreground">История</p>
          <ul className="space-y-1.5">
            {transactions.map((tx) => (
              <li
                key={tx.id}
                className="flex items-center gap-2 rounded-xl bg-surface px-3 py-2"
              >
                <span
                  className={cn(
                    'grid h-7 w-7 shrink-0 place-items-center rounded-full',
                    tx.type === 'topup'
                      ? 'bg-success-soft text-success'
                      : 'bg-surface-2 text-muted',
                  )}
                >
                  {tx.type === 'topup' ? <MdAdd size={15} /> : <MdRemove size={15} />}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs text-foreground">{tx.note}</span>
                  <span className="block text-[10px] text-subtle">
                    {new Date(tx.createdAt).toLocaleString('ru-RU', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </span>

                <span
                  className={cn(
                    'shrink-0 text-xs font-semibold',
                    tx.type === 'topup' ? 'text-success' : 'text-foreground',
                  )}
                >
                  {tx.type === 'topup' ? '+' : '−'}
                  {formatCurrency(tx.amount)}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}

      <TopUpSheet
        amount={topUp?.amount ?? null}
        note={topUp?.note}
        onClose={() => setTopUp(null)}
      />
    </div>
  );
}

/** Ruscha son shakllari: 1 генерацию, 2 генерации, 5 генераций */
function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}
