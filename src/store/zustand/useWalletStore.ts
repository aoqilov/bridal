import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WalletTx = {
  id: string;
  type: 'topup' | 'spend';
  amount: number;
  /** Ekranda ko'rinadigan izoh — "Пополнение (Payme)", "Генерация образа" */
  note: string;
  createdAt: string;
};

export type WalletState = {
  balance: number;
  transactions: WalletTx[];
  /** Birinchi generatsiya bepul — ishlatilganidan keyin `true` */
  freeUsed: boolean;
  topUp: (amount: number, note: string) => void;
  /** Pul yechish; balans yetmasa `false` qaytadi va hech narsa o'zgarmaydi */
  spend: (amount: number, note: string) => boolean;
  /** Bepul generatsiyani ishlatilgan deb belgilaydi */
  useFree: () => void;
  /** Generatsiya xato bilan tugasa bepul urinishni qaytaradi */
  refundFree: () => void;
};

function txId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Foydalanuvchi hamyoni — generatsiya uchun to'lov shu yerdan yechiladi */
export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      balance: 0,
      transactions: [],
      freeUsed: false,
      topUp: (amount, note) =>
        set((state) => ({
          balance: state.balance + amount,
          transactions: [
            { id: txId(), type: 'topup', amount, note, createdAt: new Date().toISOString() },
            ...state.transactions,
          ],
        })),
      spend: (amount, note) => {
        const state = get();
        if (state.balance < amount) return false;
        set({
          balance: state.balance - amount,
          transactions: [
            { id: txId(), type: 'spend', amount, note, createdAt: new Date().toISOString() },
            ...state.transactions,
          ],
        });
        return true;
      },
      useFree: () => set({ freeUsed: true }),
      refundFree: () => set({ freeUsed: false }),
    }),
    { name: 'bridal-wallet' },
  ),
);
