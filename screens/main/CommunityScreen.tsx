import React, { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useCommunityStore, streakLabelForHours, type FeedPost } from '../../store/communityStore';
import { useUserStore } from '../../store/userStore';
import { useTheme } from '../../hooks/useTheme';
import { radius, spacing, typography } from '../../config/theme';

function timeAgo(iso: string) {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function CommunityScreen() {
  const { theme } = useTheme();
  const posts = useCommunityStore((s) => s.posts);
  const loadFeed = useCommunityStore((s) => s.loadFeed);
  const addPost = useCommunityStore((s) => s.addPost);
  const toggleLike = useCommunityStore((s) => s.toggleLike);
  const quitDate = useUserStore((s) => s.quitDate);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    loadFeed();
  }, []);

  function handlePost() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    const streakHours = quitDate ? (Date.now() - new Date(quitDate).getTime()) / 3_600_000 : 0;
    addPost(trimmed, streakHours);
    setDraft('');
  }

  function renderPost({ item }: { item: FeedPost }) {
    return (
      <Card style={styles.postCard}>
        <View style={styles.postHeader}>
          <View style={[styles.badge, { backgroundColor: theme.primary + '1A' }]}>
            <Text style={[typography.caption, { color: theme.primary, fontWeight: '700' }]}>
              {streakLabelForHours(item.streakHoursAtPost)}
            </Text>
          </View>
          <Text style={[typography.caption, { color: theme.textMuted }]}>{timeAgo(item.createdAt)}</Text>
        </View>
        <Text style={[typography.body, { color: theme.text, marginTop: spacing.sm }]}>{item.body}</Text>
        <Pressable onPress={() => toggleLike(item.id)} style={styles.likeRow}>
          <Text style={{ fontSize: 16 }}>{item.likedByMe ? '❤️' : '🤍'}</Text>
          <Text style={[typography.caption, { color: theme.textMuted }]}>{item.likeCount}</Text>
        </Pressable>
      </Card>
    );
  }

  return (
    <Screen padded={false}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderPost}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <Text style={[typography.h2, { color: theme.text, marginTop: spacing.lg, marginBottom: spacing.md }]}>
              Community
            </Text>
          }
        />
        <View style={[styles.composer, { borderTopColor: theme.border, backgroundColor: theme.surface }]}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Share an update anonymously..."
            placeholderTextColor={theme.textMuted}
            style={[styles.input, { color: theme.text, borderColor: theme.border }]}
            multiline
          />
          <Button label="Post" onPress={handlePost} disabled={!draft.trim()} style={styles.postButton} />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  postCard: { marginBottom: spacing.sm },
  postHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.pill },
  likeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.sm },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxHeight: 80,
  },
  postButton: { paddingHorizontal: spacing.lg },
});
