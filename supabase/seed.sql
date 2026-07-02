-- Proofline v1 — seed data (Milestone 2 DoD: "one fake student"; enriched in
-- Milestone 4 so the progress page recreates the dashboard demo from real rows).
-- Run AFTER supabase/schema.sql. Supabase → SQL Editor → paste → Run.
--
-- Idempotent: fixed IDs; Jordan's child rows are rebuilt each run (delete then
-- insert) so re-running always converges to the same canonical demo state.
--
-- Students:
--   Jordan Ellis  — id ...0001, token demo-jordan-token-0001  (rich, mid-programme)
--   Sam Rivers    — id ...0002, token demo-fresh-token-0002    (fresh, no intake yet)

-- ── Jordan: student + baseline (baseline immutable → do nothing on re-run) ─────
insert into students (id, name, email, phone, track, status, token, consent,
                      enrolled_at, intake_completed_at)
values (
  '00000000-0000-0000-0000-000000000001',
  'Jordan Ellis', 'jordan.ellis@example.com', '+15551234567',
  'paid_speaker', 'active', 'demo-jordan-token-0001',
  jsonb_build_object('programme_use', true, 'team_visible', true,
                     'public_optin', true, 'at', now()),
  now() - interval '70 days', now() - interval '68 days'
)
on conflict (id) do nothing;

insert into baselines (student_id, monthly_revenue, paid_gigs_12mo,
                       stage_confidence, target_monthly, blocker, own_words, locked_at)
values (
  '00000000-0000-0000-0000-000000000001',
  6400, 0, 4, 20000, 'Finding stages',
  'I''ve spoken free twice and loved every second — but I''ve never been paid for it.',
  now() - interval '68 days'
)
on conflict (student_id) do nothing;

-- ── Jordan: milestone rail (rebuilt each run) ─────────────────────────────────
-- shared craft (1–5) + paid_speaker payoff (6–8). 1–5 done, 6 current @ 78%.
delete from milestones where student_id = '00000000-0000-0000-0000-000000000001';
insert into milestones (student_id, position, label, layer, state, progress_pct, achieved_at)
select '00000000-0000-0000-0000-000000000001', position, label, layer,
       case when position <= 5 then 'done'
            when position = 6 then 'current'
            else 'todo' end,
       case when position <= 5 then 100
            when position = 6 then 78
            else 0 end,
       case when position <= 5 then now() - ((6 - position) * interval '10 days')
            else null end
from milestone_templates
where track in ('shared', 'paid_speaker');

-- ── Jordan: check-ins (rebuilt each run) — rising confidence + confirmed value ─
delete from checkins where student_id = '00000000-0000-0000-0000-000000000001';
insert into checkins (student_id, week_no, sent_at, completed_at,
                      pitched_count, value_confirmed, confidence, win_text, blocker)
values
  ('00000000-0000-0000-0000-000000000001', 1, now()-interval '63 days', now()-interval '62 days', 4, 0,    4, 'Pitched four local associations.',                 'Finding stages'),
  ('00000000-0000-0000-0000-000000000001', 2, now()-interval '56 days', now()-interval '55 days', 5, 0,    5, 'Two warm replies from organisers.',                'Finding stages'),
  ('00000000-0000-0000-0000-000000000001', 3, now()-interval '49 days', now()-interval '48 days', 6, 0,    5, 'Booked my first (free) stage — 200 seats.',        'Getting booked'),
  ('00000000-0000-0000-0000-000000000001', 4, now()-interval '42 days', now()-interval '41 days', 8, 1200, 6, 'First paid gig — $1,200 summit breakout!',          null),
  ('00000000-0000-0000-0000-000000000001', 5, now()-interval '35 days', now()-interval '34 days', 6, 0,    6, 'Followed up with ten past organisers.',            'Fees'),
  ('00000000-0000-0000-0000-000000000001', 6, now()-interval '28 days', now()-interval '27 days', 9, 2500, 7, 'Tampa chamber keynote — $2,500 at full fee.',       null),
  ('00000000-0000-0000-0000-000000000001', 7, now()-interval '21 days', now()-interval '20 days', 7, 0,    7, 'Refined my fee conversation with a mentor.',       'Fees'),
  ('00000000-0000-0000-0000-000000000001', 8, now()-interval '14 days', now()-interval '13 days', 10,2500, 8, 'Second $2,500 booking confirmed.',                  null),
  ('00000000-0000-0000-0000-000000000001', 9, now()-interval '7 days',  now()-interval '6 days',  12,2500, 8, 'Third keynote booked — the rhythm is building.',    null);

-- ── Jordan: flag + events (rebuilt each run) ──────────────────────────────────
insert into flags (student_id, rag, reasons, computed_at)
values ('00000000-0000-0000-0000-000000000001', 'green',
        array['Confidence trending up', 'Value confirmed 3 of last 6 weeks', 'On streak'],
        now() - interval '6 days')
on conflict (student_id) do update
  set rag = excluded.rag, reasons = excluded.reasons, computed_at = excluded.computed_at;

delete from events where student_id = '00000000-0000-0000-0000-000000000001';
insert into events (student_id, type, payload, created_at) values
  ('00000000-0000-0000-0000-000000000001', 'milestone_earned',
    jsonb_build_object('label', 'First paid gig'), now()-interval '41 days'),
  ('00000000-0000-0000-0000-000000000001', 'note',
    jsonb_build_object('text', 'Seed data — canonical demo student.'), now()-interval '68 days');

-- ── Sam: a FRESH student who has NOT done intake yet ──────────────────────────
-- Test the intake wizard as Sam: /intake/demo-fresh-token-0002
-- After Sam completes intake, /p/demo-fresh-token-0002 shows the week-1 empty states.
insert into students (id, name, email, phone, track, status, token,
                      enrolled_at, intake_completed_at)
values (
  '00000000-0000-0000-0000-000000000002',
  'Sam Rivers', 'sam.rivers@example.com', '+15557654321',
  null, 'invited', 'demo-fresh-token-0002',
  now() - interval '1 day', null
)
on conflict (id) do nothing;
