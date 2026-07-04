import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../navigation/types';
import { GradientBackground } from '../../components/GradientBackground';
import { Button } from '../../components/Button';
import { niche } from '../../config/niche';
import { spacing, typography } from '../../config/theme';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Welcome'>;

export function WelcomeScreen({ navigation }: Props) {
  return (
    <GradientBackground style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <Text style={styles.appName}>{niche.appName}</Text>
        <Text style={styles.tagline}>{niche.tagline}</Text>
      </View>
      <View style={styles.footer}>
        <Button label="Get started" variant="secondary" onPress={() => navigation.navigate('Quiz')} />
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.xxl },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  appName: { ...typography.h1, color: '#FFFFFF', marginBottom: spacing.sm },
  tagline: { ...typography.body, color: '#FFFFFFCC', textAlign: 'center' },
  footer: { paddingBottom: spacing.lg },
});
