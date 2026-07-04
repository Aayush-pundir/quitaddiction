import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Screen } from '../../components/Screen';
import { useTheme } from '../../hooks/useTheme';
import { spacing, typography } from '../../config/theme';

interface PlaceholderScreenProps {
  title: string;
  description: string;
}

export function PlaceholderScreen({ title, description }: PlaceholderScreenProps) {
  const { theme } = useTheme();
  return (
    <Screen style={styles.center}>
      <Text style={[typography.h2, { color: theme.text, textAlign: 'center' }]}>{title}</Text>
      <Text
        style={[typography.body, { color: theme.textMuted, textAlign: 'center', marginTop: spacing.sm }]}
      >
        {description}
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
