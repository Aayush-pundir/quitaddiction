import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../navigation/types';
import { GradientBackground } from '../../components/GradientBackground';
import { Button } from '../../components/Button';
import { niche } from '../../config/niche';
import { useOnboardingStore } from '../../store/onboardingStore';
import { spacing, typography } from '../../config/theme';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'QuitDateReveal'>;

export function QuitDateRevealScreen({ navigation }: Props) {
  const whyMotivationId = useOnboardingStore((s) => s.whyMotivationId);
  const setQuitDate = useOnboardingStore((s) => s.setQuitDate);

  const whyLabel = useMemo(
    () => niche.whyMotivations.find((m) => m.id === whyMotivationId)?.label ?? 'yourself',
    [whyMotivationId]
  );
  const whyIcon = useMemo(
    () => niche.whyMotivations.find((m) => m.id === whyMotivationId)?.icon ?? '💛',
    [whyMotivationId]
  );

  const quitDate = useMemo(() => new Date(), []);
  const formattedDate = quitDate.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  function handleContinue() {
    setQuitDate(quitDate);
    navigation.navigate('Paywall');
  }

  return (
    <GradientBackground style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>{whyIcon}</Text>
        <Text style={styles.eyebrow}>Your quit journey starts</Text>
        <Text style={styles.date}>{formattedDate}</Text>
        <Text style={styles.reason}>
          Every time it gets hard, remember: you're doing this for{'\n'}
          <Text style={styles.reasonBold}>{whyLabel.toLowerCase()}</Text>.
        </Text>
      </View>
      <View style={styles.footer}>
        <Button label="I'm ready" variant="secondary" onPress={handleContinue} />
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.xxl },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  icon: { fontSize: 56, marginBottom: spacing.md },
  eyebrow: { ...typography.body, color: '#FFFFFFCC', marginBottom: spacing.xs },
  date: { ...typography.h1, color: '#FFFFFF', textAlign: 'center', marginBottom: spacing.lg },
  reason: { ...typography.body, color: '#FFFFFFE6', textAlign: 'center', lineHeight: 24 },
  reasonBold: { fontWeight: '700' },
  footer: { paddingBottom: spacing.lg },
});
