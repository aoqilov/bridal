import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserProfile = {
  name: string;
  phone?: string;
  city?: string;
  avatar?: string;
};

type User = ({ id: string; email?: string } & UserProfile) | null;

type UserState = {
  user: User;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  /** Backendsiz lokal profil — ism/telefon/shahar tahriri */
  updateProfile: (patch: Partial<UserProfile>) => void;
  logout: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      updateProfile: (patch) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, ...patch }
            : { id: 'local', name: '', ...patch },
        })),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'bridal-user' },
  ),
);
