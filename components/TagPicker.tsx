import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../hooks/useTheme';
import { radius, spacing, typography } from '../config/theme';
import type { TagOption } from '../config/niche';

interface TagPickerProps {
  tags: TagOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function TagPicker({ tags, selectedId, onSelect }: TagPickerProps) {
  const { theme } = useTheme();
  return (
    <View style={styles.wrap}>
      {tags.map((tag) => {
        const selected = selectedId === tag.id;
        return (
          <Pressable
            key={tag.id}
            onPress={() => {
              void Haptics.selectionAsync();
              onSelect(tag.id);
            }}
            accessibilityRole="button"
            accessibilityLabel={tag.label}
            accessibilityState={{ selected }}
            style={[
              styles.chip,
              {
                backgroundColor: selected ? theme.primary : theme.surface,
                borderColor: selected ? theme.primary : theme.border,
              },
            ]}
          >
            <Text style={{ fontSize: 14 }}>{tag.icon}</Text>
            <Text style={[typography.body, { color: selected ? theme.onPrimary : theme.text }]}>
              {tag.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1.5,
  },
});
