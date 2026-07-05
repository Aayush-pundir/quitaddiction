import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { logRelapse, logUrgeEvent, markLessonReadRemote } from '../lib/supabase/sync';

export interface RelapseLogEntry {
  id: string;
  occurredAt: string;
  triggerTagId: string | null;
  emotionTagId: string | null;
}

export interface UrgeLogEntry {
  id: string;
  occurredAt: string;
  triggerTagId: string | null;
}

interface UserState {
  hasCompletedOnboarding: boolean;
  quitDate: string | null;
  whyMotivationId: string | null;
  costPerUnit: number;
  unitsPerDay: number;
  isPremium: boolean;
  notificationOptIn: boolean;
  relapseHistory: RelapseLogEntry[];
  urgeHistory: UrgeLogEntry[];
  readLessonIds: string[];
  completeOnboarding: (data: {
    quitDate: string;
    whyMotivationId: string;
    costPerUnit: number;
    unitsPerDay: number;
  }) => void;
  setQuitDate: (quitDate: string) => void;
  setPremium: (isPremium: boolean) => void;
  setNotificationOptIn: (optIn: boolean) => void;
  logRelapse: (entry: { triggerTagId: string | null; emotionTagId: string | null }) => void;
  logUrge: (entry: { triggerTagId: string | null }) => void;
  markLessonRead: (lessonId: string) => void;
  resetOnboarding: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      hasCompletedOnboarding: false,
      quitDate: null,
      whyMotivationId: null,
      costPerUnit: 0,
      unitsPerDay: 0,
      isPremium: false,
      notificationOptIn: false,
      relapseHistory: [],
      urgeHistory: [],
      readLessonIds: [],
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
      setNotificationOptIn: (notificationOptIn) => set({ notificationOptIn }),
      logRelapse: (entry) => {
        const now = new Date().toISOString();
        set({
          quitDate: now,
          relapseHistory: [
            { id: `${Date.now()}`, occurredAt: now, ...entry },
            ...get().relapseHistory,
          ],
        });
        void logRelapse(entry);
      },
      logUrge: (entry) => {
        const now = new Date().toISOString();
        set({
          urgeHistory: [{ id: `${Date.now()}`, occurredAt: now, ...entry }, ...get().urgeHistory],
        });
        void logUrgeEvent(entry);
      },
      markLessonRead: (lessonId) => {
        if (get().readLessonIds.includes(lessonId)) return;
        set({ readLessonIds: [...get().readLessonIds, lessonId] });
        void markLessonReadRemote(lessonId);
      },
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
