import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { radius, spacing, typography } from '../config/theme';
import type { Milestone } from '../config/niche';

interface MilestoneBadgesProps {
  milestones: Milestone[];
  elapsedHours: number;
}

export function MilestoneBadges({ milestones, elapsedHours }: MilestoneBadgesProps) {
  const { theme } = useTheme();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {milestones.map((milestone) => {
        const reached = elapsedHours >= milestone.hours;
        return (
          <View
            key={milestone.id}
            style={[
              styles.badge,
              {
                backgroundColor: reached ? theme.primary + '1A' : theme.surface,
                borderColor: reached ? theme.primary : theme.border,
              },
            ]}
          >
            <Text style={[styles.icon, { opacity: reached ? 1 : 0.35 }]}>{milestone.icon}</Text>
            <Text
              style={[
                typography.caption,
                { color: reached ? theme.text : theme.textMuted, fontWeight: reached ? '700' : '400' },
              ]}
            >
              {milestone.title}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: spacing.sm, paddingVertical: spacing.xs },
  badge: {
    width: 84,
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.md,
    borderWidth: 1.5,
  },
  icon: { fontSize: 26, marginBottom: spacing.xs },
});
