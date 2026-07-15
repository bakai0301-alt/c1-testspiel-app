create extension if not exists pgcrypto;

create table if not exists public.exercises (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  topic text not null,
  content jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id uuid not null,
  title text not null,
  score integer not null,
  total integer not null,
  answers jsonb not null,
  completed_at timestamptz not null default now()
);

create table if not exists public.saved_words (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id uuid,
  term text not null,
  article text not null default '—',
  meaning_en text not null,
  example text not null,
  created_at timestamptz not null default now(),
  unique (user_id, term)
);

alter table public.exercises enable row level security;
alter table public.attempts enable row level security;
alter table public.saved_words enable row level security;

create policy "Users read own exercises" on public.exercises
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users create own exercises" on public.exercises
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users delete own exercises" on public.exercises
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy "Users read own attempts" on public.attempts
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users create own attempts" on public.attempts
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users delete own attempts" on public.attempts
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy "Users read own words" on public.saved_words
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users create own words" on public.saved_words
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users delete own words" on public.saved_words
  for delete to authenticated using ((select auth.uid()) = user_id);

create index if not exists exercises_user_created_idx on public.exercises (user_id, created_at desc);
create index if not exists attempts_user_completed_idx on public.attempts (user_id, completed_at desc);
create index if not exists saved_words_user_created_idx on public.saved_words (user_id, created_at desc);
