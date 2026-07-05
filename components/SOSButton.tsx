import React from 'react';
import { Platform, Pressable, StyleSheet, Text } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../hooks/useTheme';
import { radius, spacing, typography } from '../config/theme';
import type { RootStackParamList } from '../navigation/types';

export function SOSButton() {
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  function handlePress() {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('SOSBreathing');
  }

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel="SOS, get urge help now"
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme.danger, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <Text style={styles.icon}>🆘</Text>
      <Text style={[typography.caption, styles.label]}>SOS</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: spacing.lg,
    bottom: Platform.select({ ios: 96, android: 88, default: 88 }),
    width: 60,
    height: 60,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  icon: { fontSize: 20 },
  label: { color: '#FFFFFF', fontWeight: '700' },
});
