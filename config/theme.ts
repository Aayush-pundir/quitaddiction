import { niche } from './niche';

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  danger: string;
  success: string;
  gradientStart: string;
  gradientEnd: string;
  onPrimary: string;
}

const shared = {
  primary: niche.colors.primary,
  primaryDark: niche.colors.primaryDark,
  secondary: niche.colors.secondary,
  accent: niche.colors.accent,
  gradientStart: niche.colors.gradientStart,
  gradientEnd: niche.colors.gradientEnd,
  onPrimary: '#FFFFFF',
};

export const lightTheme: ThemeColors = {
  ...shared,
  background: '#F7F8FB',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  text: '#1B1E28',
  textMuted: '#6B7280',
  border: '#E5E7EB',
  danger: '#E5566B',
  success: '#3FAF7A',
};

export const darkTheme: ThemeColors = {
  ...shared,
  background: '#0F1117',
  surface: '#181B24',
  surfaceElevated: '#20242F',
  text: '#F2F3F7',
  textMuted: '#9AA1B0',
  border: '#2A2E3A',
  danger: '#FF7A8A',
  success: '#4FC98A',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 16,
  lg: 24,
  pill: 999,
};

export const typography = {
  fontFamily: undefined as string | undefined,
  h1: { fontSize: 32, fontWeight: '700' as const },
  h2: { fontSize: 24, fontWeight: '700' as const },
  h3: { fontSize: 19, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  bodyBold: { fontSize: 16, fontWeight: '600' as const },
  caption: { fontSize: 13, fontWeight: '400' as const },
};

export type ThemeMode = 'light' | 'dark';

export function getTheme(mode: ThemeMode): ThemeColors {
  return mode === 'dark' ? darkTheme : lightTheme;
}
