-- 002_rls_cross_user_check.sql
-- Verification script: proves RLS blocks cross-user reads on every table.
-- Run against a real Supabase project (two test users, service-role setup).
-- Expectation: every cross-user SELECT returns 0 rows; every same-user SELECT returns 1 row.

-- Create two test users via Supabase Auth (or insert directly with auth.users for local testing).
-- Then, as user A (auth.uid() = user_a), insert one row per table.
-- Then switch context to user B and assert user B cannot read user A's rows.

-- Helper: set the current authenticated user context for the session.
-- In Supabase, RLS uses auth.uid() from the JWT, so switch JWTs to switch users.

-- 1. profiles
insert into public.profiles (id, display_name, created_at)
values ('user_a', 'User A', now());

-- 2. user_progress
insert into public.user_progress (user_id, mastery, completed_tabs, updated_at)
values ('user_a', '{}', '{}', now());

-- 3. user_prompts
insert into public.user_prompts (user_id, client_id, data, updated_at)
values ('user_a', 'prompt-1', '{}', now());

-- 4. ai_usage
insert into public.ai_usage (user_id, day, tokens, requests)
values ('user_a', current_date, 0, 0);

-- Cross-user read attempts (run with user B's JWT): each must return 0 rows.
select count(*) as profiles_visible_to_b from public.profiles where id = 'user_a';
select count(*) as progress_visible_to_b from public.user_progress where user_id = 'user_a';
select count(*) as prompts_visible_to_b from public.user_prompts where user_id = 'user_a';
select count(*) as usage_visible_to_b from public.ai_usage where user_id = 'user_a';

-- Same-user read (run with user A's JWT): each must return 1 row.
select count(*) as profiles_visible_to_a from public.profiles where id = 'user_a';
select count(*) as progress_visible_to_a from public.user_progress where user_id = 'user_a';
select count(*) as prompts_visible_to_a from public.user_prompts where user_id = 'user_a';
select count(*) as usage_visible_to_a from public.ai_usage where user_id = 'user_a';

-- Cleanup.
delete from public.ai_usage where user_id = 'user_a';
delete from public.user_prompts where user_id = 'user_a';
delete from public.user_progress where user_id = 'user_a';
delete from public.profiles where id = 'user_a';
