-- 001_initial_schema.sql
-- AskAway user data schema. RLS enabled on every table; no table without policies.

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table public.user_progress (
  user_id uuid primary key references auth.users on delete cascade,
  mastery jsonb not null default '{}',
  completed_tabs text[] not null default '{}',
  current_track text,
  active_tab text,
  placement jsonb,
  updated_at timestamptz not null default now()
);

create table public.user_prompts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  client_id text not null,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  unique (user_id, client_id)
);

create table public.ai_usage (
  user_id uuid not null references auth.users on delete cascade,
  day date not null default current_date,
  tokens int not null default 0,
  requests int not null default 0,
  primary key (user_id, day)
);

alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;
alter table public.user_prompts enable row level security;
alter table public.ai_usage enable row level security;

create policy "own rows" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "own rows" on public.user_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own rows" on public.user_prompts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "read own" on public.ai_usage
  for select using (auth.uid() = user_id);

-- ai_usage is written only by server functions using the service role (RLS bypass).
create index on public.user_prompts(user_id, updated_at);
