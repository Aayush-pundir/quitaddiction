import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { GradientBackground } from '../../components/GradientBackground';
import { Button } from '../../components/Button';
import { spacing, typography } from '../../config/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'SOSBreathing'>;

const BREATH_SECONDS = 4;
const TOTAL_CYCLES = 4;

export function SOSBreathingScreen({ navigation }: Props) {
  const scale = useSharedValue(1);
  const [phase, setPhase] = useState<'in' | 'out'>('in');
  const [cyclesLeft, setCyclesLeft] = useState(TOTAL_CYCLES);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.4, { duration: BREATH_SECONDS * 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: BREATH_SECONDS * 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    const interval = setInterval(() => {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setPhase((prev) => (prev === 'in' ? 'out' : 'in'));
      setCyclesLeft((prev) => (phase === 'out' ? Math.max(0, prev - 1) : prev));
    }, BREATH_SECONDS * 1000);

    return () => clearInterval(interval);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <GradientBackground style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>Let's ride this out together</Text>
        <View style={styles.circleWrap}>
          <Animated.View style={[styles.circle, animatedStyle]} accessibilityElementsHidden importantForAccessibility="no" />
          <Text style={styles.phaseText} accessibilityLiveRegion="polite">
            {phase === 'in' ? 'Breathe in' : 'Breathe out'}
          </Text>
        </View>
        <Text style={styles.hint}>
          {cyclesLeft > 0 ? `${cyclesLeft} more breath${cyclesLeft === 1 ? '' : 's'}` : 'Great job'}
        </Text>
      </View>
      <View style={styles.footer}>
        <Button
          label="Continue"
          variant="secondary"
          onPress={() => navigation.replace('SOSDistraction')}
        />
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.xxl },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  eyebrow: { ...typography.body, color: '#FFFFFFCC', marginBottom: spacing.xl },
  circleWrap: { width: 180, height: 180, alignItems: 'center', justifyContent: 'center' },
  circle: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFFFFF3D',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  phaseText: { ...typography.bodyBold, color: '#FFFFFF' },
  hint: { ...typography.body, color: '#FFFFFFCC', marginTop: spacing.xl },
  footer: { paddingBottom: spacing.lg },
});
