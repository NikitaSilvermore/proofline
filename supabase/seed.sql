-- Proofline v1 — fake test student (Milestone 2 DoD: "one fake student").
-- Idempotent: fixed IDs + guards, so re-running never duplicates.
-- Run AFTER supabase/schema.sql. Supabase → SQL Editor → paste → Run.
--
-- Student "Jordan Ellis" mirrors the dashboard demo, on the paid_speaker track,
-- a few weeks in — enough data for the Milestone 4 progress page to look real.

-- Stable identifiers for the fake student.
--   id:    00000000-0000-0000-0000-000000000001
--   token: demo-jordan-token-0001  (student link: /p/demo-jordan-token-0001)

-- 1. Student ------------------------------------------------------------------
insert into students (id, name, email, phone, track, status, token, consent,
                      enrolled_at, intake_completed_at)
values (
  '00000000-0000-0000-0000-000000000001',
  'Jordan Ellis',
  'jordan.ellis@example.com',
  '+15551234567',
  'paid_speaker',
  'active',
  'demo-jordan-token-0001',
  jsonb_build_object(
    'programme_use', true, 'team_visible', true, 'public_optin', true,
    'at', now()
  ),
  now() - interval '35 days',
  now() - interval '33 days'
)
on conflict (id) do nothing;

-- 2. Baseline (immutable once locked) -----------------------------------------
insert into baselines (student_id, monthly_revenue, paid_gigs_12mo,
                       stage_confidence, target_monthly, blocker, own_words,
                       locked_at)
values (
  '00000000-0000-0000-0000-000000000001',
  6400, 0, 4, 12000,
  'No paid speaking pipeline yet',
  'Speaking hadn''t paid a cent — I was booking free gigs and hoping.',
  now() - interval '33 days'
)
on conflict (student_id) do nothing;

-- 3. Milestones — copy shared craft + paid_speaker payoff, then set states ----
-- Guard: only seed if this student has no milestones yet.
do $$
begin
  if not exists (
    select 1 from milestones
    where student_id = '00000000-0000-0000-0000-000000000001'
  ) then
    insert into milestones (student_id, position, label, layer)
    select '00000000-0000-0000-0000-000000000001', position, label, layer
    from milestone_templates
    where track in ('shared', 'paid_speaker')
    order by position;

    -- Craft progress: 1–3 done, 4 in progress, 5 not yet.
    update milestones set state = 'done', progress_pct = 100,
      achieved_at = now() - interval '20 days'
      where student_id = '00000000-0000-0000-0000-000000000001' and position <= 3;
    update milestones set state = 'current', progress_pct = 60
      where student_id = '00000000-0000-0000-0000-000000000001' and position = 4;
  end if;
end $$;

-- 4. Check-ins — three completed weeks -----------------------------------------
do $$
begin
  if not exists (
    select 1 from checkins
    where student_id = '00000000-0000-0000-0000-000000000001'
  ) then
    insert into checkins (student_id, week_no, sent_at, completed_at,
                          pitched_count, value_confirmed, confidence,
                          win_text, blocker) values
      ('00000000-0000-0000-0000-000000000001', 1,
        now() - interval '21 days', now() - interval '20 days',
        2, 0, 4, 'Pitched two local associations.', 'Nervous about fees'),
      ('00000000-0000-0000-0000-000000000001', 2,
        now() - interval '14 days', now() - interval '13 days',
        3, 0, 5, 'Got a warm reply from a conference organiser.', 'Nervous about fees'),
      ('00000000-0000-0000-0000-000000000001', 3,
        now() - interval '7 days', now() - interval '6 days',
        4, 750, 6, 'First paid booking confirmed — $750!', null);
  end if;
end $$;

-- 5. Flag (RAG) ---------------------------------------------------------------
insert into flags (student_id, rag, reasons, computed_at)
values (
  '00000000-0000-0000-0000-000000000001',
  'green',
  array['On track', 'Confidence trending up', 'First value confirmed'],
  now() - interval '6 days'
)
on conflict (student_id) do nothing;

-- 6. Event log ----------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from events
    where student_id = '00000000-0000-0000-0000-000000000001'
  ) then
    insert into events (student_id, type, payload, created_at) values
      ('00000000-0000-0000-0000-000000000001', 'note',
        jsonb_build_object('text', 'Seed data — fake student for local testing.'),
        now() - interval '33 days');
  end if;
end $$;
