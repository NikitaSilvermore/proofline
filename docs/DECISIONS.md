> **TIER: BRAIN** — the running decision log; dated, newest first, may drift. Records deviations from and clarifications of the LAW; it is not itself design law.

# Decisions

Log anything that deviates from or clarifies BUILD_SPEC.md. Newest first.

## 2026-07-16 — Schema extension for measurement + verification (group A: design locked, build gated)

From the verification research report
([docs/research/milestones-measurement-verification-report.md](research/milestones-measurement-verification-report.md))
+ triage group A. Extends BUILD_SPEC §4/§5 (data model / flags) and register **T20**.
**Design only — no SQL/code changed yet.** The build is a **gated milestone** (it
deploys; Nikita's call), sequenced under T20 "before NLS go-live." Decision (Nikita,
2026-07-16): *design + record only; NLS-lean unit set.*

**The agreed shape:**

1. **Generalise the metric beyond dollars (T20).**
   - `checkins.value_confirmed numeric` → **`metric_value numeric` + `metric_unit text`**.
   - `milestones` gain **`metric_value numeric` + `metric_unit text`** so a payoff
     milestone can carry its figure (e.g. First paid gig = `4000` / `currency`).
     Milestones currently hold no number.
   - `baselines` stay as-is for the pilot — `monthly_revenue`/`paid_gigs_12mo`/
     `target_monthly` feed the **frozen** revenue graph; do NOT churn them. Generalise
     later only if a non-currency track needs a baseline. *(Logged.)*

2. **`metric_unit` = free text, app-validated against a canonical list** — NOT a DB
   `check` constraint, so a new unit never needs a migration. **NLS-lean canonical set
   (Nikita 2026-07-16):** `currency` · `count` · `events_per_month` · `percentage`,
   plus a free-text label for anything else. Health/finance units (`degrees`,
   `kg`/`lb`, `cm`/`inches`, `prom_points`, `credit_points`, `binary`) get added to the
   app list **when ACL or a finance coach actually needs them** — the column already
   stores them, so that's an app-list edit, not a schema change.

3. **Verification level (the cheap half of the parked "MileStamp Verified" — B7/T22).**
   - **`milestones.verification_level int default 0 check (verification_level between 0 and 4)`**
     — 0 self-report → 4 audited (ladder in
     [docs/ops/milestamp-verified-standard-DRAFT.md](ops/milestamp-verified-standard-DRAFT.md)).
     Milestones are the claim-bearing objects, so the rung lives there.
   - **Check-ins are inherently rung 0** (weekly self-report) — no column needed.
   - No public "Verified" language/badge ships until rung-3 machinery exists (T15 holds).

4. **New `evidence` table** (the filing cabinet), one row per artefact backing a milestone:
   ```
   evidence (
     id uuid primary key default gen_random_uuid(),
     milestone_id uuid references milestones(id) on delete cascade,
     evidence_type text,     -- screenshot|contract|booking|invoice|processor|prom|photo|attestation|other
     source text,            -- free text: 'Stripe','Close','coach:Cassie','clinic EMR'…
     artefact_url text,      -- link or storage path
     artefact_hash text,     -- optional integrity hash
     captured_at timestamptz default now(),
     verifier_identity text, -- who attests (named coach/clinician) — insider label per T22(5)
     scope_note text         -- what's verified vs NOT (Carfax lesson, T22(6))
   )
   ```
   Add `evidence` to the RLS loop (`team_all`; students never touch it — server /
   service-role only, like every other table).

5. **Health lane flag (A4) is OUT OF SCOPE here** — `requires_clinician_attestation`
   belongs to the **milestamp-acl fork's** schema (different repo). Carried there.

**Build ripple (for when greenlit):** the `value_confirmed → metric_value` rename
touches `rag.ts`, `flags-service.ts`, `progress.ts`, `console.ts`, `seed.sql`, and the
data source behind the **frozen** `RevenueChart` (plumbing only — the graph's look is
untouched). The additive parts (milestone `metric_value`/`metric_unit`/
`verification_level`, the `evidence` table) break nothing; all idempotent in
`schema.sql`. **Pushing the code change deploys — Nikita's call; needs a verify pass.**

## 2026-07-11 — Pricing & packaging locked (PRICING.md is the source of truth)

**The law (verbatim from PRICING.md §0):**

> **MileStamp is priced per programme, flat fee, unlimited students. The price
> never moves when the roster does. Tiers are separated only by delivery
> richness, celebration art, and access — never by proof integrity, never by
> student count, never by the customer's revenue or ticket size. The proof
> engine is whole in every tier. The "Powered by MileStamp" mark is never for
> sale.**

- **Supersedes ALL earlier pricing** from the same-day risk entry below and
  everywhere else: the £99/mo flat price, the warm-four £33×3 idea, the ACL
  $199–299 idea, and register N4's per-student alternative — all dead.
  Per-student / revenue-banded / ticket-banded pricing **rejected permanently**
  (reasons in PRICING.md §0).
- **Three tiers (working names, Nikita has veto): Core $397 / Standard $797 /
  Signature $2,497 per month**, annual = 2 months free, prices in USD, flat per
  programme, unlimited active students, fair-use 1,000/programme (contract
  clause, never a meter). Tier names never "Lite", never "Gold".
- **Founding-partner rate (first 10 customers incl. NLS + ACL): Standard at
  $397/mo** — list $797 always stated in the contract; 12-month lock,
  grandfathered while continuous; sweeteners = lock length, never lower price;
  design partners always pay real money (no £0 pilots).
- **Ted/All Out Sales heads of terms:** MileStamp Standard for NLS; $397/mo
  founding rate (list $797 in contract); payment starts day 90 from go-live;
  12-month term from first payment; flat, no calendar step, no growth linkage;
  still two separate documents (Ted licence ≠ Makenna acknowledgment).
  **Confirmed fact: NLS refunds claw back All Out Sales commission** (~$400 per
  $10k refund) — Ted's ROI paragraph in PRICING.md §3 is commission-denominated.
  New fact: **NLS October target ≈ $500k/month collected.**
- **ACL Rehab offer (Sept–Oct):** Standard at the same $397/mo founding rate,
  12-month lock (18-month lock as sweetener); in exchange: case-study rights,
  two reference calls, co-design of the health-outcome template. Open input:
  their annual enrolment volume.
- **Outcome-based pricing (% of saves) rejected** for now — no save definition
  until day-90 doc, attribution contested, audit lever. Revisit post-pilot as an
  optional layer only.
- **Build impact: none before pilot end.** Tiering is packaging + contracts, not
  code; entitlement flags arrive with multi-tenant (§10). Only discipline now:
  keep Milestone 9 feature boundaries flag-wrappable.
- Dollar figures are founding-era hypotheses — held firm with Ted/ACL,
  pressure-tested with three external design partners, firmed at day-90 review.

## 2026-07-11 — Risk engagement outcomes (commercial + product)

Full register: [RISK-REGISTER.md](RISK-REGISTER.md). Decisions locked with Nikita:

- ~~Price: £99/month post-pilot; warm four £33×3; N4 open~~ — **SUPERSEDED later
  the same day by the pricing entry above / PRICING.md** (founding rate $397/mo,
  list $797; per-student rejected permanently). Still true: never free; **NLS
  payment starts by day 90** post-go-live even though measurement runs 6 months.
- **Pilot reshaped: 6 months, ~100 students min** (supersedes the spec's 90-day/
  ~25 framing for measurement purposes; the day-90 kill-or-pay gate remains).
  Backfill 30–50 students enrolled in the last two months (consent path needed).
- **Contract = two papers before student #1**: Ted/All Out Sales licence (price,
  payment start, Close access) + Makenna one-page acknowledgment (student-data
  authority, NLS branding, case-study rights, non-replication). Signature is a
  hard enrolment gate.
- **Rail confirmed (N1): trigger from Close, send from Resend** (infrastructure we
  own). Enrolment webhook needs a fallback path. SMS verification already accepted
  on Close — email-first launch anyway.
- **Save definition (T12):** red flag → logged intervention → green within 21 days
  with payment plan intact, written up that week, acknowledged by Cassie. Nothing
  else counts as a save.
- **Response-decay contingency (T4):** wk4 <60% → 3 questions; wk6 → SMS-first +
  send-time test; wk8 <40% → human-touch reds only + loop redesign. Streak
  "stamp" reward to build. Plan on 45–55% response, not 60%+.
- **Schema generalisation (T20, deviates from §4):** `value_confirmed` → generic
  `metric_value` + `metric_unit` per track, so non-money tracks (ACL knees,
  closer commissions, bookkeeping clients) fit without a rewrite. ~2h; before
  NLS go-live.
- **Intake copy (T14):** deleted "a modest baseline just makes the climb look
  bigger" — it coached students to sandbag the baseline the whole product's trust
  rests on. Replaced with an honesty line without the incentive.
- **Win cards (T16):** virality via wins, not money — translate money-flavoured
  milestone labels in card copy; light disclosure line; no income figures without
  opt-in. Trademark knockout (UKIPO/USPTO/attorney) required before ANY public
  card ships (T19).
- **Demo honesty (T10):** seeded/demo data gets a "Sample data" label; the live
  progress page's "nothing here is a guess" stays — it's true there (real rows
  only).

## 2026-07-03 — Milestone 7: messaging + enrolment (Close CRM)

- **CRM switched from GHL to Close (close.com)** at the user's request — they don't
  have GHL access and are moving to Close as their CRM + sender. This is a §2
  "delivery rail" swap, not an architecture change; GHL code is kept for reference.
- **Message rail abstraction `src/lib/messaging.ts`**, provider chosen by
  `MESSAGING_PROVIDER`: **log** (default — records intent, sends nothing external),
  **close** (Close API: logs an outbound email and/or SMS activity on the lead,
  which Close sends from the connected NLS account), plus **ghl** and **resend**
  (fallback) still present. `MESSAGING_CHANNEL` = email|sms|both for Close. Every
  send is also logged to `events`. Default stays **log** so nothing sends live until
  the user sets `MESSAGING_PROVIDER=close` + `CLOSE_*` env.
- **Enrolment webhook `/api/webhooks/close`** (§6.1 equivalent): verifies Close's
  HMAC signature (`CLOSE_SIGNING_KEY`) or a shared secret for manual tests; creates
  the student + token (`src/lib/token.ts`); idempotent by `close_lead_id`; sends the
  intake invite via the rail.
- **Students gained `close_lead_id` / `close_contact_id`** (idempotent
  `alter table … add column if not exists` in schema.sql). Cron + nudge pass these
  through so Close can address the right lead.
- **US students** → SMS needs 10DLC registration (a US carrier requirement, tool-
  independent); Close guides that setup. Recommendation to the user: **email-only
  first**, add SMS post-registration. `MESSAGING_CHANNEL=email` by default.
- **Live connection deferred by choice** — plumbing built now; the §8.7 DoD (a real
  enrolment produces a live intake email, no human touch) completes once Close env +
  webhook are configured. Checklist in README.
- **Status write-back (§6.4)** remains a deferred nice-to-have.

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
