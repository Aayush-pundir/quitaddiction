import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from './types';
import { WelcomeScreen } from '../screens/onboarding/WelcomeScreen';
import { QuizScreen } from '../screens/onboarding/QuizScreen';
import { WhyMotivationScreen } from '../screens/onboarding/WhyMotivationScreen';
import { CalculatorInputsScreen } from '../screens/onboarding/CalculatorInputsScreen';
import { QuitDateRevealScreen } from '../screens/onboarding/QuitDateRevealScreen';
import { PaywallScreen } from '../screens/onboarding/PaywallScreen';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen name="WhyMotivation" component={WhyMotivationScreen} />
      <Stack.Screen name="CalculatorInputs" component={CalculatorInputsScreen} />
      <Stack.Screen name="QuitDateReveal" component={QuitDateRevealScreen} />
      <Stack.Screen name="Paywall" component={PaywallScreen} />
    </Stack.Navigator>
  );
}
