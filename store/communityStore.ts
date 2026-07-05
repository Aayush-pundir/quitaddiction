import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase/client';
import { niche, ACTIVE_NICHE } from '../config/niche';

export interface FeedPost {
  id: string;
  body: string;
  streakHoursAtPost: number;
  likeCount: number;
  likedByMe: boolean;
  createdAt: string;
}

const MOCK_POSTS: FeedPost[] = [
  {
    id: 'mock-1',
    body: `Day 4 and the mornings are getting easier. Remembering my why is what keeps me going.`,
    streakHoursAtPost: 96,
    likeCount: 12,
    likedByMe: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'mock-2',
    body: `Had a rough craving during my commute today but used the SOS breathing exercise and it actually passed. Small win.`,
    streakHoursAtPost: 26,
    likeCount: 8,
    likedByMe: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
  },
  {
    id: 'mock-3',
    body: `One month today. Didn't think I'd make it this far but here we are.`,
    streakHoursAtPost: 720,
    likeCount: 34,
    likedByMe: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
  },
];

interface CommunityState {
  posts: FeedPost[];
  loaded: boolean;
  loadFeed: () => Promise<void>;
  addPost: (body: string, streakHoursAtPost: number) => Promise<void>;
  toggleLike: (postId: string) => void;
}

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set, get) => ({
      posts: MOCK_POSTS,
      loaded: false,

      loadFeed: async () => {
        try {
          const { data, error } = await supabase
            .from('feed_posts')
            .select('id, body, streak_hours_at_post, created_at')
            .eq('niche_id', ACTIVE_NICHE)
            .order('created_at', { ascending: false })
            .limit(50);
          if (error || !data || data.length === 0) throw error ?? new Error('empty');
          set({
            posts: data.map((row) => ({
              id: row.id,
              body: row.body,
              streakHoursAtPost: row.streak_hours_at_post ?? 0,
              likeCount: 0,
              likedByMe: false,
              createdAt: row.created_at,
            })),
            loaded: true,
          });
        } catch (err) {
          console.warn('[supabase] loadFeed falling back to locally persisted posts (non-fatal)', err);
          set({ loaded: true });
        }
      },

      addPost: async (body, streakHoursAtPost) => {
        const optimistic: FeedPost = {
          id: `local-${Date.now()}`,
          body,
          streakHoursAtPost,
          likeCount: 0,
          likedByMe: false,
          createdAt: new Date().toISOString(),
        };
        set({ posts: [optimistic, ...get().posts] });

        try {
          const { data: session } = await supabase.auth.getSession();
          if (!session.session) return;
          await supabase.from('feed_posts').insert({
            user_id: session.session.user.id,
            niche_id: ACTIVE_NICHE,
            body,
            streak_hours_at_post: streakHoursAtPost,
          });
        } catch (err) {
          console.warn('[supabase] addPost remote insert failed (kept locally)', err);
        }
      },

      toggleLike: (postId) => {
        set({
          posts: get().posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likedByMe: !post.likedByMe,
                  likeCount: post.likeCount + (post.likedByMe ? -1 : 1),
                }
              : post
          ),
        });
      },
    }),
    {
      name: 'quitaddiction-community-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ posts: state.posts }),
    }
  )
);

export function streakLabelForHours(hours: number): string {
  if (hours < 24) return `${Math.floor(hours)}h ${niche.streakNoun}`;
  return `${Math.floor(hours / 24)}d ${niche.streakNoun}`;
}
