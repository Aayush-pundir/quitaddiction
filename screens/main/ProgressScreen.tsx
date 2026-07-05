import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { niche } from '../../config/niche';
import { useUserStore } from '../../store/userStore';
import { useTheme } from '../../hooks/useTheme';
import { spacing, typography } from '../../config/theme';
import type { RecoveryStage } from '../../config/niche';

function elapsedHours(quitDateIso: string | null) {
  if (!quitDateIso) return 0;
  return (Date.now() - new Date(quitDateIso).getTime()) / 3_600_000;
}

function formatDuration(hours: number) {
  if (hours < 24) return `${hours < 1 ? Math.round(hours * 60) + ' min' : Math.round(hours) + ' hr'}`;
  const days = hours / 24;
  if (days < 30) return `${Math.round(days)} day${Math.round(days) === 1 ? '' : 's'}`;
  const months = days / 30;
  if (months < 12) return `${Math.round(months)} month${Math.round(months) === 1 ? '' : 's'}`;
  return `${Math.round(months / 12)} year${Math.round(months / 12) === 1 ? '' : 's'}`;
}

export function ProgressScreen() {
  const { theme } = useTheme();
  const quitDate = useUserStore((s) => s.quitDate);
  const [hours, setHours] = useState(() => elapsedHours(quitDate));

  useEffect(() => {
    const interval = setInterval(() => setHours(elapsedHours(quitDate)), 60_000);
    return () => clearInterval(interval);
  }, [quitDate]);

  const stages = [...niche.recoveryTimeline].sort((a, b) => a.hours - b.hours);

  function renderStage({ item, index }: { item: RecoveryStage; index: number }) {
    const reached = hours >= item.hours;
    return (
      <View style={styles.row}>
        <View style={styles.markerColumn}>
          <View
            style={[
              styles.dot,
              { backgroundColor: reached ? theme.primary : theme.surface, borderColor: theme.primary },
            ]}
          />
          {index < stages.length - 1 && (
            <View style={[styles.line, { backgroundColor: reached ? theme.primary : theme.border }]} />
          )}
        </View>
        <View style={styles.content}>
          <Text style={[typography.caption, { color: theme.textMuted }]}>{formatDuration(item.hours)}</Text>
          <Text
            style={[
              typography.bodyBold,
              { color: reached ? theme.text : theme.textMuted, marginTop: 2 },
            ]}
          >
            {item.title}
          </Text>
          <Text style={[typography.body, { color: theme.textMuted, marginTop: 4 }]}>{item.body}</Text>
        </View>
      </View>
    );
  }

  return (
    <Screen padded={false}>
      <FlatList
        data={stages}
        keyExtractor={(item) => `${item.hours}`}
        renderItem={renderStage}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={[typography.h2, { color: theme.text, marginTop: spacing.lg, marginBottom: spacing.md }]}>
            Recovery timeline
          </Text>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  row: { flexDirection: 'row' },
  markerColumn: { alignItems: 'center', width: 24 },
  dot: { width: 16, height: 16, borderRadius: 8, borderWidth: 2 },
  line: { width: 2, flex: 1, marginVertical: 2 },
  content: { flex: 1, paddingBottom: spacing.lg, paddingLeft: spacing.sm },
});
