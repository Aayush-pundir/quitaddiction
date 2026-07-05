import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { niche } from '../../config/niche';
import { useUserStore } from '../../store/userStore';
import { useTheme } from '../../hooks/useTheme';
import { spacing, typography } from '../../config/theme';
import type { EducationLesson } from '../../config/niche';

function daysSince(quitDateIso: string | null) {
  if (!quitDateIso) return 0;
  return Math.floor((Date.now() - new Date(quitDateIso).getTime()) / 86_400_000);
}

export function EducationScreen() {
  const { theme } = useTheme();
  const quitDate = useUserStore((s) => s.quitDate);
  const readLessonIds = useUserStore((s) => s.readLessonIds);
  const markLessonRead = useUserStore((s) => s.markLessonRead);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const currentDay = daysSince(quitDate);
  const lessons = useMemo(
    () => [...niche.education].sort((a, b) => a.unlockDay - b.unlockDay),
    []
  );

  function renderLesson({ item }: { item: EducationLesson }) {
    const unlocked = currentDay >= item.unlockDay;
    const isRead = readLessonIds.includes(item.id);
    const expanded = expandedId === item.id;

    return (
      <Pressable
        disabled={!unlocked}
        onPress={() => {
          setExpandedId(expanded ? null : item.id);
          if (!isRead) markLessonRead(item.id);
        }}
      >
        <Card style={[styles.card, { opacity: unlocked ? 1 : 0.5 }]}>
          <View style={styles.row}>
            <Text style={styles.icon}>{item.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[typography.bodyBold, { color: theme.text }]}>{item.title}</Text>
              <Text style={[typography.caption, { color: theme.textMuted, marginTop: 2 }]}>
                {unlocked ? (isRead ? 'Read' : `Day ${item.unlockDay}`) : `Unlocks on day ${item.unlockDay}`}
              </Text>
            </View>
            {isRead && <Text style={{ color: theme.primary }}>✓</Text>}
          </View>
          {expanded && unlocked && (
            <Text style={[typography.body, { color: theme.text, marginTop: spacing.md, lineHeight: 22 }]}>
              {item.body}
            </Text>
          )}
        </Card>
      </Pressable>
    );
  }

  return (
    <Screen padded={false}>
      <FlatList
        data={lessons}
        keyExtractor={(item) => item.id}
        renderItem={renderLesson}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={[typography.h2, { color: theme.text, marginTop: spacing.lg, marginBottom: spacing.md }]}>
            Education
          </Text>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  card: { marginBottom: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  icon: { fontSize: 26 },
});
