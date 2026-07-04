import React from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { OnboardingNavigator } from './OnboardingNavigator';
import { MainNavigator } from './MainNavigator';
import { useUserStore } from '../store/userStore';
import { useTheme } from '../hooks/useTheme';

export function RootNavigator() {
  const hasCompletedOnboarding = useUserStore((s) => s.hasCompletedOnboarding);
  const { theme, mode } = useTheme();

  const navigationTheme = {
    ...(mode === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(mode === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      background: theme.background,
      card: theme.surface,
      text: theme.text,
      border: theme.border,
      primary: theme.primary,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      {hasCompletedOnboarding ? <MainNavigator /> : <OnboardingNavigator />}
    </NavigationContainer>
  );
}
