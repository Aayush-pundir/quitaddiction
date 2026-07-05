import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { TagPicker } from '../../components/TagPicker';
import { niche } from '../../config/niche';
import { useUserStore } from '../../store/userStore';
import { useTheme } from '../../hooks/useTheme';
import { spacing, typography } from '../../config/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Relapse'>;

export function RelapseScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const logRelapse = useUserStore((s) => s.logRelapse);
  const [triggerTagId, setTriggerTagId] = useState<string | null>(null);
  const [emotionTagId, setEmotionTagId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    logRelapse({ triggerTagId, emotionTagId });
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Screen style={styles.center}>
        <Text style={styles.icon}>💛</Text>
        <Text style={[typography.h2, { color: theme.text, textAlign: 'center' }]}>
          That's okay. You're not starting from zero.
        </Text>
        <Text
          style={[typography.body, { color: theme.textMuted, textAlign: 'center', marginTop: spacing.sm }]}
        >
          A {niche.relapseTerm} is information, not a failure. Your new streak starts right now.
        </Text>
        <Button
          label="Back to today"
          onPress={() => navigation.replace('Main')}
          style={{ marginTop: spacing.xl }}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[typography.h2, { color: theme.text, marginTop: spacing.lg }]}>
          Thanks for being honest with yourself
        </Text>
        <Text style={[typography.body, { color: theme.textMuted, marginTop: spacing.xs, marginBottom: spacing.lg }]}>
          A {niche.relapseTerm} doesn't erase your progress. Let's understand what happened so next time is easier.
        </Text>

        <Text style={[typography.bodyBold, { color: theme.text, marginBottom: spacing.sm }]}>
          What triggered it?
        </Text>
        <TagPicker tags={niche.triggerTags} selectedId={triggerTagId} onSelect={setTriggerTagId} />

        <Text style={[typography.bodyBold, { color: theme.text, marginTop: spacing.lg, marginBottom: spacing.sm }]}>
          How were you feeling?
        </Text>
        <TagPicker tags={niche.emotionTags} selectedId={emotionTagId} onSelect={setEmotionTagId} />
      </ScrollView>
      <View style={styles.footer}>
        <Button label="Log it and keep going" onPress={handleSubmit} />
        <Button
          label="Cancel"
          variant="ghost"
          onPress={() => navigation.goBack()}
          style={{ marginTop: spacing.sm }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, paddingBottom: spacing.lg },
  footer: { paddingBottom: spacing.lg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  icon: { fontSize: 48, marginBottom: spacing.md },
});
