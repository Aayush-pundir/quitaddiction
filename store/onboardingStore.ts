import { create } from 'zustand';
import { niche } from '../config/niche';

interface OnboardingState {
  answers: Record<string, string | string[]>;
  whyMotivationId: string | null;
  costPerUnit: number;
  unitsPerDay: number;
  quitDate: Date | null;
  completed: boolean;
  setAnswer: (questionId: string, value: string | string[]) => void;
  setWhyMotivation: (id: string) => void;
  setCalculatorInputs: (costPerUnit: number, unitsPerDay: number) => void;
  setQuitDate: (date: Date) => void;
  complete: () => void;
  reset: () => void;
}

const initialState = {
  answers: {},
  whyMotivationId: null,
  costPerUnit: niche.calculator.defaultCostPerUnit,
  unitsPerDay: niche.calculator.defaultUnitsPerDay,
  quitDate: null,
  completed: false,
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...initialState,
  setAnswer: (questionId, value) =>
    set((state) => ({ answers: { ...state.answers, [questionId]: value } })),
  setWhyMotivation: (id) => set({ whyMotivationId: id }),
  setCalculatorInputs: (costPerUnit, unitsPerDay) => set({ costPerUnit, unitsPerDay }),
  setQuitDate: (date) => set({ quitDate: date }),
  complete: () => set({ completed: true }),
  reset: () => set({ ...initialState, answers: {} }),
}));
