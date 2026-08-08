-- ============================================================
-- CodeFlow — Streak tracking
-- Run this in the Supabase SQL Editor (or via supabase db push)
-- ============================================================

-- 1. User streaks table
create table if not exists public.user_streaks (
  user_id            uuid primary key references auth.users(id) on delete cascade,
  current_streak     integer not null default 0,
  longest_streak     integer not null default 0,
  last_practice_date date
);

-- 2. Row Level Security
alter table public.user_streaks enable row level security;

-- Users can read their own streak
drop policy if exists "Users can view own streak" on public.user_streaks;
create policy "Users can view own streak"
  on public.user_streaks for select
  using (auth.uid() = user_id);

-- Users can insert their own row (initial creation)
drop policy if exists "Users can insert own streak" on public.user_streaks;
create policy "Users can insert own streak"
  on public.user_streaks for insert
  with check (auth.uid() = user_id);

-- No client-side UPDATE policy — only the trigger (SECURITY DEFINER) can update

-- 3. Trigger function: runs AFTER INSERT on progress
create or replace function public.update_user_streak()
returns trigger
language plpgsql
security definer          -- bypasses RLS so it can update user_streaks
set search_path = public  -- security best practice for SECURITY DEFINER
as $$
declare
  v_today         date := current_date;
  v_last_date     date;
  v_current       integer;
  v_longest       integer;
begin
  -- Try to fetch the existing streak row
  select last_practice_date, current_streak, longest_streak
    into v_last_date, v_current, v_longest
    from public.user_streaks
   where user_id = new.user_id;

  if not found then
    -- First ever completion: create the row
    insert into public.user_streaks (user_id, current_streak, longest_streak, last_practice_date)
    values (new.user_id, 1, 1, v_today);

  elsif v_last_date = v_today then
    -- Already practiced today — do nothing
    null;

  elsif v_last_date = v_today - 1 then
    -- Practiced yesterday — extend the streak
    v_current := v_current + 1;
    if v_current > v_longest then
      v_longest := v_current;
    end if;

    update public.user_streaks
       set current_streak     = v_current,
           longest_streak     = v_longest,
           last_practice_date = v_today
     where user_id = new.user_id;

  else
    -- Gap of 2+ days — reset streak
    v_current := 1;
    if v_current > v_longest then
      v_longest := v_current;
    end if;

    update public.user_streaks
       set current_streak     = v_current,
           longest_streak     = v_longest,
           last_practice_date = v_today
     where user_id = new.user_id;
  end if;

  return new;
end;
$$;

-- 4. Attach trigger to progress table
drop trigger if exists trg_update_streak on public.progress;

create trigger trg_update_streak
  after insert on public.progress
  for each row
  execute function public.update_user_streak();
