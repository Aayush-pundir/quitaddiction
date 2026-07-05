import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { logRelapse, logUrgeEvent, markLessonReadRemote } from '../lib/supabase/sync';
import { rescheduleAllNotifications, cancelAllScheduledNotifications } from '../lib/notifications';
import { useOnboardingStore } from './onboardingStore';

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
  setNotificationOptIn: (optIn: boolean) => Promise<boolean>;
  logRelapse: (entry: { triggerTagId: string | null; emotionTagId: string | null }) => void;
  logUrge: (entry: { triggerTagId: string | null }) => void;
  markLessonRead: (lessonId: string) => void;
  hardReset: () => void;
}

const initialState = {
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
} satisfies Partial<UserState>;

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      ...initialState,
      completeOnboarding: (data) => {
        set({
          hasCompletedOnboarding: true,
          quitDate: data.quitDate,
          whyMotivationId: data.whyMotivationId,
          costPerUnit: data.costPerUnit,
          unitsPerDay: data.unitsPerDay,
        });
        void rescheduleAllNotifications(new Date(data.quitDate), get().notificationOptIn);
      },
      setQuitDate: (quitDate) => {
        set({ quitDate });
        void rescheduleAllNotifications(new Date(quitDate), get().notificationOptIn);
      },
      setPremium: (isPremium) => set({ isPremium }),
      setNotificationOptIn: async (optIn) => {
        const quitDate = new Date(get().quitDate ?? Date.now());
        const granted = await rescheduleAllNotifications(quitDate, optIn);
        set({ notificationOptIn: granted });
        return granted;
      },
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
        void rescheduleAllNotifications(new Date(now), get().notificationOptIn);
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
      hardReset: () => {
        void cancelAllScheduledNotifications();
        set(initialState);
        useOnboardingStore.getState().reset();
      },
    }),
    {
      name: 'quitaddiction-user-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
