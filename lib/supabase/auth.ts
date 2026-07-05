import { supabase } from './client';

/**
 * Best-effort anonymous session bootstrap. Community posts/likes and event
 * logging are scoped to auth.uid() via RLS (see schema.sql), so we sign in
 * anonymously on launch to get a stable id without requiring email signup.
 * Silently no-ops if EXPO_PUBLIC_SUPABASE_* isn't configured yet.
 */
export async function ensureSession() {
  try {
    const { data } = await supabase.auth.getSession();
    if (data.session) return data.session;
    const { data: signInData, error } = await supabase.auth.signInAnonymously();
    if (error) throw error;
    return signInData.session;
  } catch (err) {
    console.warn('[supabase] No session available (check EXPO_PUBLIC_SUPABASE_* env vars).', err);
    return null;
  }
}

export async function signUpWithEmail(email: string, password: string) {
  return supabase.auth.signUp({ email, password });
}

export async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export interface AuthStatus {
  signedIn: boolean;
  isAnonymous: boolean;
  email: string | null;
}

export async function getAuthStatus(): Promise<AuthStatus> {
  try {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user ?? null;
    return {
      signedIn: !!user,
      isAnonymous: !!user?.is_anonymous,
      email: user?.email ?? null,
    };
  } catch (err) {
    console.warn('[supabase] getAuthStatus failed (non-fatal)', err);
    return { signedIn: false, isAnonymous: false, email: null };
  }
}
