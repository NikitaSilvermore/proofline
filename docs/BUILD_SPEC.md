> **TIER: LAW** — the frozen build spec. Invariants that fail the task if violated (scope, data model, routes, flows, security). Do not edit the body without an explicit unfreeze.

# Proofline v1 — Build Spec (NLS Pilot)

*Source of truth for the build. Hand this file to Claude Code at the start of the project and keep it in the repo root. Working title "Proofline"; run the pilot on a neutral subdomain so the naming decision stays open.*

---

## 1. Scope statement

Single-tenant system for the NLS Mentorship pilot. One programme, up to ~25 students, 90 days. Everything is hardcoded to NLS branding and the NLS milestone templates. Multi-tenant, self-serve coach onboarding, payments, and the AI setup layer are all explicitly **out of scope for v1** (see §10).

The three demo HTML files are the pixel-level design reference — port their design tokens (colours, fonts, spacing) exactly:
- `nls_baseline_intake_demo.html` → intake flow
- `nls_student_dashboard_demo.html` → student progress page
- `nls_support_console_demo.html` → team console

## 2. Architecture

- **Next.js (App Router, TypeScript)** on **Vercel** — pages, API routes, and Vercel Cron for the weekly loop
- **Supabase** — Postgres, Row Level Security, auth for the console only (students never log in)
- **GHL (GoHighLevel)** as the message delivery rail — enrolment trigger, intake invite, weekly check-in sends, nudges. NLS already runs on GHL: existing deliverability, existing brand trust, zero new sender reputation to build. **Resend** is the fallback if GHL access is awkward.
- **Tailwind** with the demo palette as design tokens (`--ink #0E1A2B`, `--gold #C6A15B`, `--paper #F6F7F5`, etc.)
- No LLM calls in v1. Flags are rule-based; the case-study draft is template interpolation.

Students access everything through **signed, unguessable tokens in links** (no passwords, no logins — this is a product principle, not a shortcut). Console access is Supabase magic-link auth restricted to an email allowlist.

## 3. Routes / surfaces

| Route | Who | What |
|---|---|---|
| `/intake/[token]` | Student | 8-step baseline intake incl. track choice + consent. One-time; locks on submit. |
| `/p/[token]` | Student | Progress page: ledger, milestone rail, chart, wins, story card. |
| `/checkin/[token]` | Student | Weekly 5-question check-in; on submit → celebration → redirect to `/p/`. |
| `/console` | Team (allowlist) | Stat strip, needs-attention, harvest queue, roster with RAG filters. |
| `/api/webhooks/ghl` | GHL | Enrolment webhook (see §6.1). Verify shared secret. |
| `/api/cron/weekly` | Vercel Cron | Monday sends + flag recompute (see §6.2). Protect with cron secret. |
| `/privacy` | Public | Plain-English privacy page mirroring the intake consent items. |
| `/api/export/[student_id]` | Console auth | JSON export of a student's data (the "export any time" promise, made real). |

## 4. Data model (Postgres)

```sql
create table students (
  id uuid primary key default gen_random_uuid(),
  ghl_contact_id text unique,
  name text not null,
  email text not null,
  phone text,
  track text check (track in ('paid_speaker','win_clients','sell_programme','raise_funds','grow_audience','custom')),
  status text default 'invited' check (status in ('invited','active','paused','completed','exited')),
  token text unique not null,            -- nanoid(24)+, used in all student links
  consent jsonb,                          -- {programme_use: true, team_visible: true, public_optin: true, at: timestamptz}
  enrolled_at timestamptz default now(),
  intake_completed_at timestamptz
);

create table baselines (
  student_id uuid primary key references students(id),
  monthly_revenue numeric,
  paid_gigs_12mo int,
  stage_confidence int check (stage_confidence between 1 and 10),
  target_monthly numeric,
  blocker text,
  own_words text,                         -- the future case-study "before" quote
  locked_at timestamptz default now()     -- baselines are immutable after lock
);

create table milestone_templates (
  id serial primary key,
  track text not null,                    -- 'shared' for the craft layer
  position int not null,
  label text not null,
  layer text check (layer in ('craft','payoff'))
);

create table milestones (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id),
  position int,
  label text,
  layer text,
  state text default 'todo' check (state in ('todo','current','done')),
  progress_pct int default 0,
  achieved_at timestamptz
);

create table checkins (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id),
  week_no int,
  sent_at timestamptz,
  completed_at timestamptz,
  pitched_count int,
  value_confirmed numeric,                -- fees/client revenue/course sales/funds — track-agnostic dollars
  confidence int check (confidence between 1 and 10),
  win_text text,
  blocker text
);

create table flags (
  student_id uuid primary key references students(id),
  rag text check (rag in ('red','amber','green')),
  reasons text[],
  computed_at timestamptz
);

create table events (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id),
  type text check (type in ('milestone_earned','nudge_sent','testimonial_requested','testimonial_received','case_study_drafted','note')),
  payload jsonb,
  created_at timestamptz default now()
);
```

Seed `milestone_templates`: the **craft layer** (shared, positions 1–5): Baseline set → Signature talk locked → Speaker assets live → First booking → First talk delivered. The **payoff layer** (positions 6–8) per track, e.g. `paid_speaker`: First paid gig → Consistent booking rhythm → Fee target hit; `win_clients`: First leads from stage → First client closed → Client target hit; `sell_programme`, `raise_funds`, `grow_audience` analogous. On intake submit, copy shared + track rows into `milestones` for that student.

## 5. RAG rules (deterministic, v1)

Recompute on every check-in submit and in the weekly cron.

**Red** if any of:
- Intake not completed within 7 days of enrolment
- 2+ consecutive missed check-ins
- Confidence dropped ≥3 points across the last 2 completed check-ins
- Same blocker reported 3 consecutive weeks

**Amber** if any of (and not red):
- 1 missed check-in
- `pitched_count = 0` for 3 consecutive weeks
- `value_confirmed = 0` for 4 consecutive weeks after first paid milestone
- Same blocker 2 consecutive weeks

**Green** otherwise. Always store human-readable `reasons` (these populate the console "Why" column verbatim).

## 6. Flows

### 6.1 Enrolment (zero team touch)
GHL workflow (trigger: NLS purchase tag) → POST to `/api/webhooks/ghl` with contact id/name/email/phone → create `students` row + token → respond with the intake URL → GHL writes it to a contact custom field (`proofline_intake_url`) and sends the intake invite from the NLS sender. Reminders at day 3 and day 6 via GHL if `intake_completed_at` is null. Day 7 null → red flag ("intake incomplete — refund window").

### 6.2 Weekly loop
Vercel Cron, Mondays 08:00 ET: for each active student, insert a `checkins` row (sent), then trigger the GHL send (per-student webhook or tag flip) containing `/checkin/[token]`. On submit: store answers, recompute streak, milestone progress, and flags; auto-earn value-threshold milestones (e.g. first `value_confirmed > 0` on `paid_speaker` ⇒ "First paid gig" done + `milestone_earned` event); show the celebration screen.

### 6.3 Console actions
- **Nudge** → fires a GHL message from a saved template; logs `nudge_sent`; button flips to "Sent ✓"
- **Mark milestone** → manual done-toggle for judgement calls (craft milestones especially)
- **Request testimonial** → GHL templated ask; logs event; harvest queue shows anything `milestone_earned` in the last 14 days without a request
- **Case study draft** → template interpolation: baseline numbers + latest numbers + `own_words` + best `win_text` lines → editable text block; logs `case_study_drafted`

### 6.4 Status write-back (nice-to-have, cheap)
Push each student's RAG value to a GHL custom field so the team sees red/amber/green inside the CRM they already live in.

## 7. Security & privacy (non-negotiable)

- RLS on: student-token routes can only ever read/write their own rows; console role required for everything else
- Tokens: `nanoid(24)`+, rotatable; never enumerate; no student PII in URLs beyond the token
- Console allowlist: Nikita (+ Makenna if she wants read access)
- Consent captured at intake exactly as the three checkboxes state; `/privacy` mirrors them in plain English
- Export endpoint working before the first real student enrols; deletion = status `exited` + PII scrub function
- No payment data anywhere in this system, ever

## 8. Build order (each milestone has a definition of done)

1. **Repo + deploy skeleton (day 1).** Next.js + Supabase wired, deployed to Vercel with a hello page. *DoD: live URL exists.* Deploy first, build second — never let deployment be the last-mile surprise.
2. **Schema + seeds (days 1–2).** Tables, RLS policies, milestone templates seeded, one fake student inserted by script. *DoD: SQL runs clean twice (idempotent).*
3. **Intake (days 2–4).** Port the demo intake against real tables; lock-on-submit; consent stored. *DoD: fake student completes intake on a phone; baseline row + milestones created.*
4. **Progress page (days 4–7).** Port the dashboard template; render from DB; empty states for week-1 students (chart with one point must not look broken). *DoD: Jordan's demo recreated from real data.*
5. **Check-in loop (week 2).** Check-in route, submit pipeline, streak + flags + auto-milestones, celebration. Cron sending. *DoD: two consecutive Mondays fire correctly against test students (fake the clock).*
6. **Console (week 2–3).** Stat strip, needs-attention, roster, filters, nudge/testimonial/case-study actions. *DoD: seeded roster of 12 mixed-state students renders like the demo.*
7. **GHL integration (week 3).** Webhook enrolment end-to-end from a test purchase tag; sends via GHL. *DoD: tagging a test contact in GHL produces a live intake email with a working link, no human touch.*
8. **Dog-food week (gate).** Nikita and Becky enrol as students via the real GHL trigger and live one full weekly cycle. Fix everything that annoys. *No real NLS student enrols before this gate passes.*

## 9. Environment

`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server only), `GHL_API_KEY`, `GHL_WEBHOOK_SECRET`, `CRON_SECRET`, `APP_BASE_URL`. Costs: Supabase free tier, Vercel hobby, GHL already paid for — effectively £0/month for the pilot.

## 10. Explicitly deferred (do not build in v1)

Payments/Stripe · multi-tenant + coach onboarding UI · AI template generator ("paste your offer doc") · AI check-in summaries and risk language detection · WhatsApp Business API (GHL SMS/email covers the pilot) · white-label settings UI (NLS is hardcoded) · native apps · community/content features · fancy analytics. Every one of these gets rebuilt better after the pilot teaches us what matters.

## 11. Working protocol with Claude Code

- This file lives in the repo root; also create a short `CLAUDE.md` pointing to it ("read BUILD_SPEC.md before any task; design reference lives in /design-reference/").
- Copy the three demo HTML files into `/design-reference/` in the repo — they are the visual contract.
- Work strictly in the §8 milestone order; one milestone per session; each session ends with the DoD demonstrated locally and deployed.
- Ask Claude Code to write a seed script and a fake-clock helper early — testing weekly logic in real time is misery.
- Commit small, deploy often, keep a `DECISIONS.md` for anything that deviates from this spec.
