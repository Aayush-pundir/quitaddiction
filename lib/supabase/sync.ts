import { supabase } from './client';

/**
 * Fire-and-forget writes to Supabase. The app is local-first (zustand +
 * AsyncStorage is the source of truth for this MVP), so a missing/unreachable
 * Supabase project must never block the UI - these just log a warning.
 */
export async function logRelapse(row: {
  triggerTagId: string | null;
  emotionTagId: string | null;
}) {
  try {
    const { data } = await supabase.auth.getSession();
    if (!data.session) return;
    await supabase.from('relapses').insert({
      user_id: data.session.user.id,
      trigger_tag_id: row.triggerTagId,
      emotion_tag_id: row.emotionTagId,
    });
  } catch (err) {
    console.warn('[supabase] logRelapse failed (non-fatal)', err);
  }
}

export async function logUrgeEvent(row: { triggerTagId: string | null }) {
  try {
    const { data } = await supabase.auth.getSession();
    if (!data.session) return;
    await supabase.from('urge_events').insert({
      user_id: data.session.user.id,
      trigger_tag_id: row.triggerTagId,
    });
  } catch (err) {
    console.warn('[supabase] logUrgeEvent failed (non-fatal)', err);
  }
}

export async function markLessonReadRemote(lessonId: string) {
  try {
    const { data } = await supabase.auth.getSession();
    if (!data.session) return;
    await supabase.from('lesson_progress').upsert({
      user_id: data.session.user.id,
      lesson_id: lessonId,
    });
  } catch (err) {
    console.warn('[supabase] markLessonReadRemote failed (non-fatal)', err);
  }
}
