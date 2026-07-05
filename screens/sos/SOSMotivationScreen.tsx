import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { TagPicker } from '../../components/TagPicker';
import { niche } from '../../config/niche';
import { useUserStore } from '../../store/userStore';
import { useTheme } from '../../hooks/useTheme';
import { spacing, typography } from '../../config/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'SOSMotivation'>;

export function SOSMotivationScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const logUrge = useUserStore((s) => s.logUrge);
  const [triggerTagId, setTriggerTagId] = useState<string | null>(null);

  const card = useMemo(
    () => niche.motivationalCards[Math.floor(Math.random() * niche.motivationalCards.length)],
    []
  );

  function handleDone() {
    logUrge({ triggerTagId });
    navigation.replace('Main');
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Card style={{ marginTop: spacing.lg }}>
          <Text style={styles.quoteMark}>"</Text>
          <Text style={[typography.h3, { color: theme.text, textAlign: 'center' }]}>{card.text}</Text>
        </Card>

        <Text style={[typography.bodyBold, { color: theme.text, marginTop: spacing.xl, marginBottom: spacing.sm }]}>
          What brought on this urge? (optional)
        </Text>
        <TagPicker tags={niche.triggerTags} selectedId={triggerTagId} onSelect={setTriggerTagId} />
      </ScrollView>
      <Button label="I'm okay now" onPress={handleDone} style={{ marginBottom: spacing.lg }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, paddingBottom: spacing.lg },
  quoteMark: { fontSize: 40, textAlign: 'center', opacity: 0.3 },
});
