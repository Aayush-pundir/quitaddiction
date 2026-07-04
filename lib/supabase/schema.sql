-- Run this in the Supabase SQL editor for your project.
-- Row Level Security is enabled everywhere; every table scopes writes to auth.uid().

create extension if not exists "uuid-ossp";

-- Profiles: one row per authenticated user, holds onboarding + quit-plan state.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  niche_id text not null default 'quit-vaping',
  display_name text,
  quit_date timestamptz,
  why_motivation_id text,
  severity_answer_id text,
  trigger_answer_ids text[] default '{}',
  past_attempts_answer_id text,
  cost_per_unit numeric default 0,
  units_per_day numeric default 0,
  onboarding_completed_at timestamptz,
  notification_opt_in boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: select own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles: insert own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id);

-- Relapse / slip log, feeds the streak reset and the "why did this happen" micro-survey.
create table if not exists public.relapses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  occurred_at timestamptz not null default now(),
  trigger_tag_id text,
  emotion_tag_id text,
  note text,
  created_at timestamptz not null default now()
);

alter table public.relapses enable row level security;

create policy "relapses: select own" on public.relapses
  for select using (auth.uid() = user_id);
create policy "relapses: insert own" on public.relapses
  for insert with check (auth.uid() = user_id);

-- Urge / SOS panic-button events, for later insights on trigger patterns.
create table if not exists public.urge_events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  occurred_at timestamptz not null default now(),
  trigger_tag_id text,
  resolved boolean default true,
  created_at timestamptz not null default now()
);

alter table public.urge_events enable row level security;

create policy "urge_events: select own" on public.urge_events
  for select using (auth.uid() = user_id);
create policy "urge_events: insert own" on public.urge_events
  for insert with check (auth.uid() = user_id);

-- Education lesson read-state, keyed by lesson id from config/niche.ts.
create table if not exists public.lesson_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id text not null,
  read_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

alter table public.lesson_progress enable row level security;

create policy "lesson_progress: select own" on public.lesson_progress
  for select using (auth.uid() = user_id);
create policy "lesson_progress: upsert own" on public.lesson_progress
  for insert with check (auth.uid() = user_id);

-- Anonymous community feed. Posts are public-read once posted; write is owner-only.
create table if not exists public.feed_posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  niche_id text not null default 'quit-vaping',
  body text not null check (char_length(body) between 1 and 500),
  streak_hours_at_post numeric default 0,
  created_at timestamptz not null default now()
);

alter table public.feed_posts enable row level security;

create policy "feed_posts: select all" on public.feed_posts
  for select using (true);
create policy "feed_posts: insert own" on public.feed_posts
  for insert with check (auth.uid() = user_id);
create policy "feed_posts: delete own" on public.feed_posts
  for delete using (auth.uid() = user_id);

create table if not exists public.feed_likes (
  post_id uuid not null references public.feed_posts (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

alter table public.feed_likes enable row level security;

create policy "feed_likes: select all" on public.feed_likes
  for select using (true);
create policy "feed_likes: insert own" on public.feed_likes
  for insert with check (auth.uid() = user_id);
create policy "feed_likes: delete own" on public.feed_likes
  for delete using (auth.uid() = user_id);
