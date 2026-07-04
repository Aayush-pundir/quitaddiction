import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface UserState {
  hasCompletedOnboarding: boolean;
  quitDate: string | null;
  whyMotivationId: string | null;
  costPerUnit: number;
  unitsPerDay: number;
  isPremium: boolean;
  completeOnboarding: (data: {
    quitDate: string;
    whyMotivationId: string;
    costPerUnit: number;
    unitsPerDay: number;
  }) => void;
  setQuitDate: (quitDate: string) => void;
  setPremium: (isPremium: boolean) => void;
  resetOnboarding: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,
      quitDate: null,
      whyMotivationId: null,
      costPerUnit: 0,
      unitsPerDay: 0,
      isPremium: false,
      completeOnboarding: (data) =>
        set({
          hasCompletedOnboarding: true,
          quitDate: data.quitDate,
          whyMotivationId: data.whyMotivationId,
          costPerUnit: data.costPerUnit,
          unitsPerDay: data.unitsPerDay,
        }),
      setQuitDate: (quitDate) => set({ quitDate }),
      setPremium: (isPremium) => set({ isPremium }),
      resetOnboarding: () =>
        set({
          hasCompletedOnboarding: false,
          quitDate: null,
          whyMotivationId: null,
          costPerUnit: 0,
          unitsPerDay: 0,
        }),
    }),
    {
      name: 'quitaddiction-user-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
