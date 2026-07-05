import React from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { OnboardingNavigator } from './OnboardingNavigator';
import { MainNavigator } from './MainNavigator';
import { SOSBreathingScreen } from '../screens/sos/SOSBreathingScreen';
import { SOSDistractionScreen } from '../screens/sos/SOSDistractionScreen';
import { SOSMotivationScreen } from '../screens/sos/SOSMotivationScreen';
import { RelapseScreen } from '../screens/main/RelapseScreen';
import { useUserStore } from '../store/userStore';
import { useTheme } from '../hooks/useTheme';

const Stack = createNativeStackNavigator<RootStackParamList>();

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
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!hasCompletedOnboarding ? (
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainNavigator} />
            <Stack.Group screenOptions={{ presentation: 'modal' }}>
              <Stack.Screen name="SOSBreathing" component={SOSBreathingScreen} />
              <Stack.Screen name="SOSDistraction" component={SOSDistractionScreen} />
              <Stack.Screen name="SOSMotivation" component={SOSMotivationScreen} />
              <Stack.Screen name="Relapse" component={RelapseScreen} />
            </Stack.Group>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
