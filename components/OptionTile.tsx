import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { radius, spacing, typography } from '../config/theme';

interface OptionTileProps {
  icon: string;
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function OptionTile({ icon, label, selected, onPress }: OptionTileProps) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        {
          backgroundColor: selected ? theme.primary + '1A' : theme.surface,
          borderColor: selected ? theme.primary : theme.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[typography.bodyBold, { color: theme.text, flex: 1 }]}>{label}</Text>
      {selected && <Text style={{ color: theme.primary, fontSize: 18 }}>✓</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    marginBottom: spacing.sm,
  },
  icon: { fontSize: 22 },
});
