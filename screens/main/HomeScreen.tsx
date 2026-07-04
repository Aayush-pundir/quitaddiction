import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { niche } from '../../config/niche';
import { useUserStore } from '../../store/userStore';
import { useTheme } from '../../hooks/useTheme';
import { spacing, typography } from '../../config/theme';

function elapsedParts(quitDate: Date) {
  const ms = Math.max(0, Date.now() - quitDate.getTime());
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return { days, hours, minutes, totalHours: ms / 3_600_000 };
}

export function HomeScreen() {
  const { theme } = useTheme();
  const quitDateIso = useUserStore((s) => s.quitDate);
  const whyMotivationId = useUserStore((s) => s.whyMotivationId);
  const costPerUnit = useUserStore((s) => s.costPerUnit);
  const unitsPerDay = useUserStore((s) => s.unitsPerDay);

  const quitDate = quitDateIso ? new Date(quitDateIso) : new Date();
  const [elapsed, setElapsed] = useState(() => elapsedParts(quitDate));

  useEffect(() => {
    const interval = setInterval(() => setElapsed(elapsedParts(quitDate)), 1000 * 30);
    return () => clearInterval(interval);
  }, [quitDateIso]);

  const why = niche.whyMotivations.find((m) => m.id === whyMotivationId);
  const unitsAvoided = Math.floor((elapsed.totalHours / 24) * unitsPerDay);
  const moneySaved = unitsAvoided * costPerUnit;

  return (
    <Screen>
      <Text style={[typography.h2, { color: theme.text, marginTop: spacing.lg }]}>{niche.streakNoun}</Text>
      <Card style={{ marginTop: spacing.md }}>
        <View style={styles.counterRow}>
          <CounterBlock value={elapsed.days} label="days" theme={theme} />
          <CounterBlock value={elapsed.hours} label="hrs" theme={theme} />
          <CounterBlock value={elapsed.minutes} label="min" theme={theme} />
        </View>
      </Card>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={[typography.caption, { color: theme.textMuted }]}>{niche.calculator.moneySavedLabel}</Text>
          <Text style={[typography.h3, { color: theme.primary, marginTop: spacing.xs }]}>
            {niche.calculator.currencySymbol}
            {moneySaved.toFixed(2)}
          </Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={[typography.caption, { color: theme.textMuted }]}>{niche.calculator.unitsAvoidedLabel}</Text>
          <Text style={[typography.h3, { color: theme.primary, marginTop: spacing.xs }]}>{unitsAvoided}</Text>
        </Card>
      </View>

      {why && (
        <Card style={{ marginTop: spacing.md }}>
          <Text style={[typography.caption, { color: theme.textMuted }]}>Your why</Text>
          <Text style={[typography.bodyBold, { color: theme.text, marginTop: spacing.xs }]}>
            {why.icon} {why.label}
          </Text>
        </Card>
      )}
    </Screen>
  );
}

function CounterBlock({ value, label, theme }: { value: number; label: string; theme: ReturnType<typeof useTheme>['theme'] }) {
  return (
    <View style={styles.counterBlock}>
      <Text style={[typography.h1, { color: theme.text }]}>{value}</Text>
      <Text style={[typography.caption, { color: theme.textMuted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  counterRow: { flexDirection: 'row', justifyContent: 'space-around' },
  counterBlock: { alignItems: 'center' },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  statCard: { flex: 1 },
});
