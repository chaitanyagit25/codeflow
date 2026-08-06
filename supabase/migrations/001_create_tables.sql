-- ============================================================
-- CodeFlow — Supabase schema
-- Run this in the Supabase SQL Editor (or via supabase db push)
-- ============================================================

-- 1. Lessons table
create table if not exists public.lessons (
  id          uuid primary key default gen_random_uuid(),
  title       text    not null,
  snippet_text text   not null,
  language    text    not null,          -- e.g. 'javascript', 'python'
  difficulty  text    not null default 'beginner'
                      check (difficulty in ('beginner', 'intermediate', 'advanced')),
  order_index integer not null default 0,
  created_at  timestamptz not null default now()
);

-- 2. Progress table (references auth.users for Supabase Auth)
create table if not exists public.progress (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  lesson_id    uuid not null references public.lessons(id) on delete cascade,
  wpm          integer not null default 0,
  accuracy     numeric(5,2) not null default 0,   -- e.g. 98.50
  completed_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_progress_user   on public.progress(user_id);
create index if not exists idx_progress_lesson on public.progress(lesson_id);
create index if not exists idx_lessons_order   on public.lessons(order_index);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

-- Lessons: readable by everyone, writable only by service role (admin)
alter table public.lessons enable row level security;

create policy "Lessons are viewable by everyone"
  on public.lessons for select
  using (true);

-- Progress: users can only read/write their own rows
alter table public.progress enable row level security;

create policy "Users can view own progress"
  on public.progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.progress for update
  using (auth.uid() = user_id);
