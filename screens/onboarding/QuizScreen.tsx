import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../navigation/types';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { OptionTile } from '../../components/OptionTile';
import { ProgressDots } from '../../components/ProgressDots';
import { niche } from '../../config/niche';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useTheme } from '../../hooks/useTheme';
import { spacing, typography } from '../../config/theme';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Quiz'>;

const questions = niche.onboardingQuiz;

export function QuizScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const [stepIndex, setStepIndex] = useState(0);
  const answers = useOnboardingStore((s) => s.answers);
  const setAnswer = useOnboardingStore((s) => s.setAnswer);

  const question = questions[stepIndex];
  const currentAnswer = answers[question.id];
  const selectedIds = new Set<string>(
    question.type === 'multi'
      ? Array.isArray(currentAnswer)
        ? currentAnswer
        : []
      : typeof currentAnswer === 'string'
        ? [currentAnswer]
        : []
  );

  const canContinue = selectedIds.size > 0;

  function toggleOption(optionId: string) {
    if (question.type === 'single') {
      setAnswer(question.id, optionId);
      return;
    }
    const next = new Set(selectedIds);
    if (next.has(optionId)) {
      next.delete(optionId);
    } else {
      next.add(optionId);
    }
    setAnswer(question.id, Array.from(next));
  }

  function handleContinue() {
    if (stepIndex < questions.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      navigation.navigate('WhyMotivation');
    }
  }

  function handleBack() {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    } else {
      navigation.goBack();
    }
  }

  return (
    <Screen>
      <ProgressDots total={questions.length} current={stepIndex} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[typography.h2, { color: theme.text, marginTop: spacing.lg }]}>{question.question}</Text>
        {question.subtitle && (
          <Text style={[typography.body, { color: theme.textMuted, marginTop: spacing.xs }]}>{question.subtitle}</Text>
        )}
        <View style={{ marginTop: spacing.lg }}>
          {question.options.map((option) => (
            <OptionTile
              key={option.id}
              icon={option.icon}
              label={option.label}
              selected={selectedIds.has(option.id)}
              onPress={() => toggleOption(option.id)}
            />
          ))}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button label="Back" variant="ghost" onPress={handleBack} style={{ marginBottom: spacing.sm }} />
        <Button label="Continue" onPress={handleContinue} disabled={!canContinue} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, paddingBottom: spacing.lg },
  footer: { paddingBottom: spacing.lg },
});
