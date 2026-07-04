import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../navigation/types';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { niche } from '../../config/niche';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useUserStore } from '../../store/userStore';
import { purchaseAnnualPackage, restorePurchases } from '../../lib/revenuecat';
import { useTheme } from '../../hooks/useTheme';
import { spacing, typography } from '../../config/theme';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Paywall'>;

export function PaywallScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const { paywall } = niche;
  const [loading, setLoading] = useState<'purchase' | 'restore' | null>(null);

  const { quitDate, whyMotivationId, costPerUnit, unitsPerDay } = useOnboardingStore();
  const completeOnboarding = useUserStore((s) => s.completeOnboarding);
  const setPremium = useUserStore((s) => s.setPremium);

  function finishOnboarding(isPremium: boolean) {
    completeOnboarding({
      quitDate: (quitDate ?? new Date()).toISOString(),
      whyMotivationId: whyMotivationId ?? '',
      costPerUnit,
      unitsPerDay,
    });
    setPremium(isPremium);
  }

  async function handlePurchase() {
    setLoading('purchase');
    const result = await purchaseAnnualPackage();
    setLoading(null);
    finishOnboarding(result.isPremium);
  }

  async function handleRestore() {
    setLoading('restore');
    const result = await restorePurchases();
    setLoading(null);
    finishOnboarding(result.isPremium);
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[typography.h2, { color: theme.text, marginTop: spacing.lg }]}>{paywall.headline}</Text>
        <Text style={[typography.body, { color: theme.textMuted, marginTop: spacing.xs, marginBottom: spacing.lg }]}>
          {paywall.subheadline}
        </Text>

        {paywall.features.map((feature) => (
          <View key={feature} style={styles.featureRow}>
            <Text style={{ color: theme.primary, fontSize: 16 }}>✓</Text>
            <Text style={[typography.body, { color: theme.text, flex: 1 }]}>{feature}</Text>
          </View>
        ))}

        <Card style={{ marginTop: spacing.lg }}>
          <Text style={[typography.bodyBold, { color: theme.text }]}>
            {paywall.trialDays}-day free trial
          </Text>
          <Text style={[typography.body, { color: theme.textMuted, marginTop: spacing.xs }]}>
            Then {paywall.currencySymbol}
            {paywall.annualPrice.toFixed(2)}/year ({paywall.currencySymbol}
            {(paywall.annualPrice / 12).toFixed(2)}/mo). Cancel anytime.
          </Text>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={`Start ${paywall.trialDays}-day free trial`}
          onPress={handlePurchase}
          loading={loading === 'purchase'}
          disabled={loading !== null}
        />
        <Button
          label="Restore purchases"
          variant="ghost"
          onPress={handleRestore}
          loading={loading === 'restore'}
          disabled={loading !== null}
          style={{ marginTop: spacing.sm }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, paddingBottom: spacing.lg },
  footer: { paddingBottom: spacing.lg },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
});
