import { create } from 'zustand';
import type { ThemeMode } from '../config/theme';

interface ThemeState {
  override: ThemeMode | 'system';
  setOverride: (mode: ThemeMode | 'system') => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  override: 'system',
  setOverride: (mode) => set({ override: mode }),
}));
