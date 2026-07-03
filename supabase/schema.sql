-- Proofline v1 — schema, RLS, and reference-data seeds.
-- BUILD_SPEC.md §4 (data model), §5 (flags shape), §7 (security).
--
-- IDEMPOTENT: safe to run repeatedly. Uses "if not exists" for objects and
-- "on conflict" for reference data, so re-running never errors or duplicates
-- (Milestone 2 DoD: "SQL runs clean twice").
--
-- HOW TO RUN: Supabase dashboard → SQL Editor → paste this whole file → Run.
-- Then run supabase/seed.sql the same way to insert the fake test student.

-- ─────────────────────────────────────────────────────────────────────────────
-- 0. Extensions
-- ─────────────────────────────────────────────────────────────────────────────
-- gen_random_uuid() ships with Supabase Postgres; pgcrypto guarantees it.
create extension if not exists pgcrypto;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Tables (BUILD_SPEC §4)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  ghl_contact_id text unique,
  close_lead_id text,                     -- Close CRM lead id (enrolment + sending)
  close_contact_id text,                  -- Close CRM contact id
  name text not null,
  email text not null,
  phone text,
  track text check (track in ('paid_speaker','win_clients','sell_programme','raise_funds','grow_audience','custom')),
  status text default 'invited' check (status in ('invited','active','paused','completed','exited')),
  token text unique not null,             -- nanoid(24)+, used in all student links
  consent jsonb,                          -- {programme_use, team_visible, public_optin, at}
  enrolled_at timestamptz default now(),
  intake_completed_at timestamptz
);

create table if not exists baselines (
  student_id uuid primary key references students(id) on delete cascade,
  monthly_revenue numeric,
  paid_gigs_12mo int,
  stage_confidence int check (stage_confidence between 1 and 10),
  target_monthly numeric,
  blocker text,
  own_words text,                         -- the future case-study "before" quote
  locked_at timestamptz default now()     -- baselines are immutable after lock
);

create table if not exists milestone_templates (
  id serial primary key,
  track text not null,                    -- 'shared' for the craft layer
  position int not null,
  label text not null,
  layer text check (layer in ('craft','payoff'))
);
-- Backfill Close columns on databases created before Close support was added.
alter table students add column if not exists close_lead_id text;
alter table students add column if not exists close_contact_id text;
create index if not exists ix_students_close_lead on students (close_lead_id);

-- Natural key so reference-data seeding is idempotent.
create unique index if not exists ux_milestone_templates_track_pos
  on milestone_templates (track, position);

create table if not exists milestones (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  position int,
  label text,
  layer text,
  state text default 'todo' check (state in ('todo','current','done')),
  progress_pct int default 0,
  achieved_at timestamptz
);
create index if not exists ix_milestones_student on milestones (student_id);

create table if not exists checkins (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  week_no int,
  sent_at timestamptz,
  completed_at timestamptz,
  pitched_count int,
  value_confirmed numeric,                -- track-agnostic dollars
  confidence int check (confidence between 1 and 10),
  win_text text,
  blocker text
);
create index if not exists ix_checkins_student on checkins (student_id);

create table if not exists flags (
  student_id uuid primary key references students(id) on delete cascade,
  rag text check (rag in ('red','amber','green')),
  reasons text[],
  computed_at timestamptz
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  type text check (type in ('milestone_earned','nudge_sent','testimonial_requested','testimonial_received','case_study_drafted','note')),
  payload jsonb,
  created_at timestamptz default now()
);
create index if not exists ix_events_student on events (student_id);

-- Console access allowlist (BUILD_SPEC §7). Only these emails may use /console.
create table if not exists team_allowlist (
  email text primary key,
  note text,
  added_at timestamptz default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Row Level Security (BUILD_SPEC §7)
-- ─────────────────────────────────────────────────────────────────────────────
-- Model:
--   • RLS is ON for every table; the anon (public) key can read/write NOTHING.
--     A leaked anon key exposes no student data — this is defense in depth.
--   • Console (team) = a logged-in Supabase user whose email is in
--     team_allowlist. is_team() gates full access.
--   • Students never log in. Their /intake, /p, /checkin routes are served by
--     server code that validates the signed token and uses the service-role
--     key, which bypasses RLS by design. The server only ever selects the one
--     row matching the token, so a student can only ever reach their own data
--     (satisfies §7's guarantee). See DECISIONS.md for the rationale.

create or replace function is_team()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from team_allowlist
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

do $$
declare t text;
begin
  foreach t in array array[
    'students','baselines','milestone_templates','milestones',
    'checkins','flags','events','team_allowlist'
  ] loop
    execute format('alter table %I enable row level security;', t);
    -- Team members get full access on every table.
    execute format('drop policy if exists team_all on %I;', t);
    execute format(
      'create policy team_all on %I for all to authenticated using (is_team()) with check (is_team());',
      t
    );
  end loop;
end $$;

-- Milestone templates are non-sensitive reference data; let any signed-in user
-- read them (used when copying rows on intake).
drop policy if exists templates_read on milestone_templates;
create policy templates_read on milestone_templates
  for select to authenticated using (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Reference data — milestone templates (BUILD_SPEC §4 seed note)
-- ─────────────────────────────────────────────────────────────────────────────
-- Craft layer: shared across all tracks (positions 1–5).
insert into milestone_templates (track, position, label, layer) values
  ('shared', 1, 'Baseline set',          'craft'),
  ('shared', 2, 'Signature talk locked', 'craft'),
  ('shared', 3, 'Speaker assets live',   'craft'),
  ('shared', 4, 'First booking',         'craft'),
  ('shared', 5, 'First talk delivered',  'craft')
on conflict (track, position) do update
  set label = excluded.label, layer = excluded.layer;

-- Payoff layer: per track (positions 6–8).
insert into milestone_templates (track, position, label, layer) values
  -- paid_speaker
  ('paid_speaker',   6, 'First paid gig',              'payoff'),
  ('paid_speaker',   7, 'Consistent booking rhythm',   'payoff'),
  ('paid_speaker',   8, 'Fee target hit',              'payoff'),
  -- win_clients
  ('win_clients',    6, 'First leads from stage',      'payoff'),
  ('win_clients',    7, 'First client closed',         'payoff'),
  ('win_clients',    8, 'Client target hit',           'payoff'),
  -- sell_programme
  ('sell_programme', 6, 'First programme sale',        'payoff'),
  ('sell_programme', 7, 'Consistent enrolment rhythm', 'payoff'),
  ('sell_programme', 8, 'Revenue target hit',          'payoff'),
  -- raise_funds
  ('raise_funds',    6, 'First pledge from stage',     'payoff'),
  ('raise_funds',    7, 'Consistent donor meetings',   'payoff'),
  ('raise_funds',    8, 'Fundraising target hit',      'payoff'),
  -- grow_audience
  ('grow_audience',  6, 'First audience surge',        'payoff'),
  ('grow_audience',  7, 'Consistent follower growth',  'payoff'),
  ('grow_audience',  8, 'Audience target hit',         'payoff'),
  -- custom
  ('custom',         6, 'First payoff signal',         'payoff'),
  ('custom',         7, 'Consistent momentum',         'payoff'),
  ('custom',         8, 'Custom target hit',           'payoff')
on conflict (track, position) do update
  set label = excluded.label, layer = excluded.layer;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Console allowlist seed (BUILD_SPEC §7). Edit emails to match reality.
-- ─────────────────────────────────────────────────────────────────────────────
insert into team_allowlist (email, note) values
  ('bryant.nikita@hotmail.com', 'Nikita — owner'),
  ('makenna@example.com',       'Makenna — read access (update email)')
on conflict (email) do nothing;
