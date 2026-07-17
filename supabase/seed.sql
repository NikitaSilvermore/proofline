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
                      pitched_count, metric_value, confidence, win_text, blocker)
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

-- ── Roster: 10 mixed-state students (Milestone 6 DoD: "12 mixed-state students")
-- Together with Jordan (green) and Sam (fresh) this fills the console roster.
-- Flags are seeded directly (§5 stores computed flags; the console reads the
-- stored `reasons` verbatim). Child rows rebuilt each run for determinism.
do $$
declare
  s record;
  wk int;
begin
  for s in
    select * from (values
      ('00000000-0000-0000-0000-0000000000a1'::uuid,'Marcus Webb','marcus.webb@example.com','paid_speaker','active',60,5000::numeric,1,2,1,19,0::numeric,'red',   array['3 missed check-ins','instalment 2 of 4 due Friday'], false),
      ('00000000-0000-0000-0000-0000000000a2'::uuid,'Priya Shah','priya.shah@example.com',null,'invited',9,null::numeric,0,0,0,0,0::numeric,'red',   array['Intake incomplete, day 9 — refund window'], false),
      ('00000000-0000-0000-0000-0000000000a3'::uuid,'Dana Okafor','dana.okafor@example.com','win_clients','active',180,4000::numeric,4,5,6,2,3000::numeric,'red',   array['Confidence dropped 8 to 3 in two weeks','blocker "stage nerves"'], false),
      ('00000000-0000-0000-0000-0000000000a4'::uuid,'Tom Callahan','tom.callahan@example.com','paid_speaker','active',90,4000::numeric,2,3,5,8,1000::numeric,'amber', array['Missed last week''s check-in'], false),
      ('00000000-0000-0000-0000-0000000000a5'::uuid,'Aisha Bello','aisha.bello@example.com','sell_programme','active',240,5000::numeric,5,6,6,1,0::numeric,'amber', array['No stages pitched in 3 weeks','milestone 6 stalled'], false),
      ('00000000-0000-0000-0000-0000000000a6'::uuid,'Ryan Kessler','ryan.kessler@example.com','paid_speaker','active',60,3500::numeric,2,3,7,2,800::numeric,'amber', array['Blocker "finding stages" two weeks running'], false),
      ('00000000-0000-0000-0000-0000000000a7'::uuid,'Sofia Marin','sofia.marin@example.com','paid_speaker','active',330,6000::numeric,7,8,8,1,15000::numeric,'green', array['Renewal conversation ready — numbers attached'], true),
      ('00000000-0000-0000-0000-0000000000a8'::uuid,'Ben Osei','ben.osei@example.com','win_clients','active',150,5000::numeric,4,5,8,1,3000::numeric,'green', array['Milestone earned yesterday'], true),
      ('00000000-0000-0000-0000-0000000000a9'::uuid,'David Park','david.park@example.com','grow_audience','active',210,5500::numeric,6,7,9,3,9000::numeric,'green', array['Case study draft ready for review'], true),
      ('00000000-0000-0000-0000-0000000000aa'::uuid,'Emma Riley','emma.riley@example.com','paid_speaker','active',270,5000::numeric,6,7,9,2,12000::numeric,'green', array['On pace for milestone 7 this month'], false)
    ) as t(id, name, email, track, status, enrolled_days,
           monthly_revenue, done_ms, current_ms, weeks, last_gap,
           value_total, rag, reasons, harvest)
  loop
    insert into students (id, name, email, track, status, token, enrolled_at, intake_completed_at, consent)
    values (
      s.id, s.name, s.email, s.track, s.status,
      'demo-' || replace(lower(s.name), ' ', '-'),
      now() - make_interval(days => s.enrolled_days),
      case when s.monthly_revenue is null then null else now() - make_interval(days => s.enrolled_days - 2) end,
      jsonb_build_object('programme_use', true, 'team_visible', true, 'public_optin', true)
    )
    on conflict (id) do nothing;

    if s.monthly_revenue is not null then
      insert into baselines (student_id, monthly_revenue, paid_gigs_12mo, stage_confidence,
                             target_monthly, blocker, own_words, locked_at)
      values (s.id, s.monthly_revenue, 0, 4, s.monthly_revenue * 2, 'Finding stages',
              'Starting out — here to change the numbers.',
              now() - make_interval(days => s.enrolled_days - 2))
      on conflict (student_id) do nothing;
    end if;

    delete from milestones where student_id = s.id;
    insert into milestones (student_id, position, label, layer, state, progress_pct, achieved_at)
    select s.id, position, label, layer,
      case when position <= s.done_ms then 'done'
           when position = s.current_ms then 'current' else 'todo' end,
      case when position <= s.done_ms then 100
           when position = s.current_ms then 50 else 0 end,
      case when position <= s.done_ms then now() - make_interval(days => s.enrolled_days - position * 3) else null end
    from milestone_templates
    where track in ('shared', coalesce(s.track, 'paid_speaker'));

    delete from checkins where student_id = s.id;
    if s.weeks > 0 then
      for wk in 1..s.weeks loop
        insert into checkins (student_id, week_no, sent_at, completed_at,
                              pitched_count, metric_value, confidence, win_text, blocker)
        values (s.id, wk,
          now() - make_interval(days => s.last_gap + (s.weeks - wk) * 7),
          now() - make_interval(days => s.last_gap + (s.weeks - wk) * 7),
          3, case when wk = s.weeks then s.value_total else 0 end,
          least(10, 3 + wk), null, null);
      end loop;
    end if;

    insert into flags (student_id, rag, reasons, computed_at)
    values (s.id, s.rag, s.reasons, now() - interval '12 hours')
    on conflict (student_id) do update
      set rag = excluded.rag, reasons = excluded.reasons, computed_at = excluded.computed_at;

    delete from events where student_id = s.id;
    if s.harvest then
      insert into events (student_id, type, payload, created_at)
      values (s.id, 'milestone_earned',
              jsonb_build_object('label', 'Milestone ' || s.done_ms || ' earned'),
              now() - interval '2 days');
    end if;
  end loop;
end $$;
