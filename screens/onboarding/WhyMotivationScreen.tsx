import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../navigation/types';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { OptionTile } from '../../components/OptionTile';
import { niche } from '../../config/niche';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useTheme } from '../../hooks/useTheme';
import { spacing, typography } from '../../config/theme';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'WhyMotivation'>;

export function WhyMotivationScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const whyMotivationId = useOnboardingStore((s) => s.whyMotivationId);
  const setWhyMotivation = useOnboardingStore((s) => s.setWhyMotivation);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[typography.h2, { color: theme.text, marginTop: spacing.lg }]}>
          What's your biggest reason for quitting?
        </Text>
        <Text style={[typography.body, { color: theme.textMuted, marginTop: spacing.xs }]}>
          We'll remind you of this when things get hard.
        </Text>
        <View style={{ marginTop: spacing.lg }}>
          {niche.whyMotivations.map((option) => (
            <OptionTile
              key={option.id}
              icon={option.icon}
              label={option.label}
              selected={whyMotivationId === option.id}
              onPress={() => setWhyMotivation(option.id)}
            />
          ))}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button
          label="Continue"
          onPress={() => navigation.navigate('CalculatorInputs')}
          disabled={!whyMotivationId}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, paddingBottom: spacing.lg },
  footer: { paddingBottom: spacing.lg },
});
