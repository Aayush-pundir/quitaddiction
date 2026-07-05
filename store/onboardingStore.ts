import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { niche } from '../config/niche';

interface OnboardingState {
  answers: Record<string, string | string[]>;
  whyMotivationId: string | null;
  costPerUnit: number;
  unitsPerDay: number;
  quitDate: Date | null;
  setAnswer: (questionId: string, value: string | string[]) => void;
  setWhyMotivation: (id: string) => void;
  setCalculatorInputs: (costPerUnit: number, unitsPerDay: number) => void;
  setQuitDate: (date: Date) => void;
  reset: () => void;
}

const initialState = {
  answers: {},
  whyMotivationId: null,
  costPerUnit: niche.calculator.defaultCostPerUnit,
  unitsPerDay: niche.calculator.defaultUnitsPerDay,
  quitDate: null,
} satisfies Partial<OnboardingState>;

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...initialState,
      setAnswer: (questionId, value) =>
        set((state) => ({ answers: { ...state.answers, [questionId]: value } })),
      setWhyMotivation: (id) => set({ whyMotivationId: id }),
      setCalculatorInputs: (costPerUnit, unitsPerDay) => set({ costPerUnit, unitsPerDay }),
      setQuitDate: (date) => set({ quitDate: date }),
      reset: () => set(initialState),
    }),
    {
      name: 'quitaddiction-onboarding-store',
      storage: createJSONStorage(() => AsyncStorage),
      // quitDate is a transient Date used only between QuitDateRevealScreen and
      // PaywallScreen in the same session - it must not round-trip through
      // JSON as a plain string, so it's excluded from persistence.
      partialize: (state) => ({
        answers: state.answers,
        whyMotivationId: state.whyMotivationId,
        costPerUnit: state.costPerUnit,
        unitsPerDay: state.unitsPerDay,
      }),
    }
  )
);
