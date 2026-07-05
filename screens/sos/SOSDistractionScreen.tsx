import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { niche } from '../../config/niche';
import { useTheme } from '../../hooks/useTheme';
import { spacing, typography } from '../../config/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'SOSDistraction'>;

export function SOSDistractionScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const activity = useMemo(
    () => niche.distractionActivities[Math.floor(Math.random() * niche.distractionActivities.length)],
    []
  );
  const [secondsLeft, setSecondsLeft] = useState(activity.durationSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  return (
    <Screen style={styles.center}>
      <Text style={[typography.body, { color: theme.textMuted }]}>A quick reset</Text>
      <Card style={styles.card}>
        <Text style={styles.icon}>⏱️</Text>
        <Text style={[typography.h2, { color: theme.text, textAlign: 'center', marginTop: spacing.sm }]}>
          {activity.title}
        </Text>
        <Text
          style={[typography.body, { color: theme.textMuted, textAlign: 'center', marginTop: spacing.sm }]}
        >
          {activity.instructions}
        </Text>
        <Text style={[typography.h1, { color: theme.primary, marginTop: spacing.lg }]}>
          {secondsLeft > 0 ? secondsLeft : "Done"}
        </Text>
      </Card>
      <Button
        label="Continue"
        onPress={() => navigation.replace('SOSMotivation')}
        style={{ marginTop: spacing.xl, width: '100%' }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { alignItems: 'center', marginTop: spacing.lg, width: '100%' },
  icon: { fontSize: 40 },
});
