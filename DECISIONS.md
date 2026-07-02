# Decisions

Log anything that deviates from or clarifies BUILD_SPEC.md. Newest first.

## 2026-07-02 — Milestone 6: team console

- **Auth: Supabase magic-link + email allowlist** (§2, §7). `/console/login` sends
  an OTP link → `/auth/callback` exchanges it → `/console` gates on `getUser()` AND
  membership in `team_allowlist`. `middleware.ts` refreshes the session on
  `/console` + `/auth`. Non-allowlisted users get a "not on the list" screen.
- **Console reads run server-side via the service client after the gate**; the
  allowlist check is the security boundary. `src/lib/console.ts` builds the view
  model (stat strip, needs-attention, harvest, roster) — unit-tested (11 scenarios).
- **Actions** (`src/app/console/actions.ts`, all `requireTeam()`-gated): nudge and
  request-testimonial log events (GHL send is Milestone 7); mark-next-milestone is
  the manual toggle (§6.3); draft-case-study interpolates baseline + latest numbers
  + own_words + best win into editable text and logs `case_study_drafted`.
- **Harvest queue** = students with a `milestone_earned` event in the last 14 days
  and no later `testimonial_requested` (§6.3).
- **Roster flags are seeded directly** so the mixed-state demo renders immediately.
  `reasons` is stored verbatim and shown in the "Why" column. Note: running the
  weekly cron recomputes flags from real data, which can change the seeded colours —
  view the console right after seeding to see the intended red/amber/green mix.
- **12-student roster** seeded (Jordan + Sam + 10) via a procedural block, each with
  baseline, milestone rail, check-ins, and a flag.

## 2026-07-02 — Milestone 5: check-in loop

- **RAG engine `src/lib/rag.ts`** implements §5 verbatim and is pure/deterministic.
  Verified with 10 unit scenarios (green/amber/red for each rule) via Node
  type-stripping. A "missed" check-in = a `sent_at`-set row with no `completed_at`.
- **`recomputeFlags` (`src/lib/flags-service.ts`)** is shared by the submit action
  and the cron so both apply identical rules; it upserts the `flags` row.
- **Auto-earned milestone:** first `value_confirmed > 0` earns the first *payoff*
  milestone (e.g. paid_speaker "First paid gig"), logs `milestone_earned`, and
  promotes the next milestone to `current` (§6.2).
- **Cron `/api/cron/weekly`** inserts a "sent" check-in per active student then
  recomputes all flags. Auth: `Authorization: Bearer $CRON_SECRET` (Vercel adds it)
  **or** `?secret=$CRON_SECRET`. Fake-clock testing: `?now=<ISO>` stamps `sent_at`,
  so two calls simulate two consecutive Mondays without waiting (the §8.5 DoD).
- **The GHL/email send is deferred to Milestone 7** — the cron creates rows and
  flips flags today; §6.2's actual send is a TODO in the route.
- **Cron schedule `0 12 * * 1` (UTC)** ≈ Mondays 08:00 ET during EDT. During EST
  (winter) this is 07:00 ET; acceptable for the pilot. Revisit if exact 08:00 ET
  year-round matters.

## 2026-07-02 — Milestone 4: progress page

- **Every number on `/p/[token]` is derived from real columns** (`src/lib/progress.ts`),
  never invented. Given the §4 schema, the three ledger cards are: **Confirmed from
  the stage** (Σ `checkins.value_confirmed`, $0 → total), **Stage confidence**
  (baseline → latest check-in), and **Milestones earned** (count of `done`). The
  demo's "paid gigs booked / fee per gig" cards aren't derivable from the schema, so
  these truthful equivalents replace them.
- **Chart = cumulative confirmed value by week**, always starting from a $0 baseline
  point — so a student with a single check-in still draws a clean two-point line
  (the §8.4 "one point must not look broken" requirement). No check-ins → an explicit
  empty-state card instead of a chart.
- **Week-1 empty states** throughout (hero, chart, wins, story) so a freshly-enrolled
  student never sees a broken page.
- **Check-in card links to `/checkin/[token]`** (built in Milestone 5); the demo's
  in-page check-in modal is deferred to that milestone.
- **Jordan's seed enriched** into a 9-week story (rising confidence, three paid
  bookings, 5 of 8 milestones) so his page recreates the dashboard demo. His child
  rows are rebuilt each seed run (delete-then-insert) for deterministic re-runs.

## 2026-07-02 — Milestone 2: schema + seeds

- **RLS enforcement model (clarifies §7).** RLS is ON for every table; the anon
  key can read/write nothing. Console access is gated by `is_team()` (a logged-in
  Supabase user whose email is in the new `team_allowlist` table). Students never
  log in — their `/intake`, `/p`, `/checkin` routes are served by server code that
  validates the signed token and uses the **service-role** key (which bypasses
  RLS). The server only ever selects the single row matching the token, so a
  student can only reach their own data — satisfying §7's guarantee while keeping
  v1 simple. Token-scoped RLS at the database layer can be added later if needed.
- **Added `team_allowlist` table** (not in §4) to hold the console allowlist as
  data rather than hardcoding emails in SQL. Seeded with Nikita; Makenna's email
  is a placeholder — update it.
- **Added `unique (track, position)` on `milestone_templates`** so reference-data
  seeding is idempotent (`on conflict`). §4 only specified a serial PK.
- **`on delete cascade`** added to child foreign keys (baselines, milestones,
  checkins, flags, events) so the §7 deletion/scrub path is clean.
- **Fake student = "Jordan Ellis"** (paid_speaker, 3 weeks in) to line up with the
  dashboard demo for the Milestone 4 progress page.
- **Fake-clock helper** added now (`src/lib/clock.ts`) per §11's "write it early".

## 2026-07-02 — Milestone 1: repo + deploy skeleton

- **Spec file renamed** `proofline_v1_build_spec.md` → `BUILD_SPEC.md` to match the
  name §11 refers to.
- **Supabase env vars are `NEXT_PUBLIC_` prefixed** (`NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`) rather than the bare names in §9. Next.js only
  exposes `NEXT_PUBLIC_*` vars to the browser, which the anon client needs. The
  service-role key keeps its bare, server-only name (`SUPABASE_SERVICE_ROLE_KEY`).
- **Tailwind v3** (not v4) for a stable, well-understood config; demo tokens mapped
  in `tailwind.config.ts` and mirrored as CSS variables in `globals.css`.
- **Fonts loaded via Google Fonts `<link>`** in `layout.tsx`, exactly as the demos
  do, to keep the visual contract identical.
- **Deploy is a manual step for the repo owner.** This session builds and verifies
  the skeleton locally; connecting the repo to Vercel + setting env vars must be
  done by Nikita (needs Vercel auth). See README "Deploy" section. Milestone 1 DoD
  ("live URL exists") completes once that connect step runs.
