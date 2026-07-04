import { useColorScheme } from 'react-native';
import { getTheme, type ThemeMode } from '../config/theme';
import { useThemeStore } from '../store/themeStore';

export function useTheme() {
  const systemScheme = useColorScheme();
  const override = useThemeStore((s) => s.override);
  const mode: ThemeMode = override === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : override;
  return { theme: getTheme(mode), mode };
}
