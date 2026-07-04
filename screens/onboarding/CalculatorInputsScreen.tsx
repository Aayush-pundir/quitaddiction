import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../navigation/types';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { niche } from '../../config/niche';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useTheme } from '../../hooks/useTheme';
import { radius, spacing, typography } from '../../config/theme';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'CalculatorInputs'>;

export function CalculatorInputsScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const { calculator } = niche;
  const setCalculatorInputs = useOnboardingStore((s) => s.setCalculatorInputs);
  const [costPerUnit, setCostPerUnit] = useState(String(calculator.defaultCostPerUnit));
  const [unitsPerDay, setUnitsPerDay] = useState(String(calculator.defaultUnitsPerDay));

  function handleContinue() {
    setCalculatorInputs(parseFloat(costPerUnit) || 0, parseFloat(unitsPerDay) || 0);
    navigation.navigate('QuitDateReveal');
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={[typography.h2, { color: theme.text, marginTop: spacing.lg }]}>
            Let's see what quitting is worth
          </Text>
          <Text style={[typography.body, { color: theme.textMuted, marginTop: spacing.xs, marginBottom: spacing.lg }]}>
            This powers your "{calculator.moneySavedLabel}" and "{calculator.unitsAvoidedLabel}" counters.
          </Text>

          <Card style={{ marginBottom: spacing.md }}>
            <Text style={[typography.bodyBold, { color: theme.text, marginBottom: spacing.sm }]}>
              {calculator.costPerUnitQuestion}
            </Text>
            <View style={[styles.inputRow, { borderColor: theme.border }]}>
              <Text style={[typography.body, { color: theme.textMuted }]}>{calculator.currencySymbol}</Text>
              <TextInput
                value={costPerUnit}
                onChangeText={setCostPerUnit}
                keyboardType="decimal-pad"
                style={[typography.body, styles.input, { color: theme.text }]}
                placeholder="0.00"
                placeholderTextColor={theme.textMuted}
              />
            </View>
          </Card>

          <Card>
            <Text style={[typography.bodyBold, { color: theme.text, marginBottom: spacing.sm }]}>
              {calculator.unitsPerDayQuestion}
            </Text>
            <View style={[styles.inputRow, { borderColor: theme.border }]}>
              <TextInput
                value={unitsPerDay}
                onChangeText={setUnitsPerDay}
                keyboardType="decimal-pad"
                style={[typography.body, styles.input, { color: theme.text }]}
                placeholder="0"
                placeholderTextColor={theme.textMuted}
              />
              <Text style={[typography.body, { color: theme.textMuted }]}>/ day</Text>
            </View>
          </Card>
        </ScrollView>
        <View style={styles.footer}>
          <Button label="Continue" onPress={handleContinue} />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, paddingBottom: spacing.lg },
  footer: { paddingBottom: spacing.lg },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  input: { flex: 1 },
});
