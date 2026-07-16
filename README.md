# Proofline

NLS Mentorship pilot — progress, proof, and payoff for every student.
Single-tenant, 90-day pilot. See [BUILD_SPEC.md](docs/BUILD_SPEC.md) for the full spec
and [CLAUDE.md](CLAUDE.md) → [AGENTS.md](AGENTS.md) for the working protocol.

**Stack:** Next.js (App Router, TypeScript) · Supabase · Tailwind · GHL delivery ·
Vercel + Vercel Cron.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in Supabase + GHL + secrets (see §9)
npm run dev                  # http://localhost:3000
```

`npm run build` must pass before every deploy.

## Deploy (Vercel)

Milestone 1's Definition of Done is "a live URL exists". The code is ready; the
one-time connect step needs your Vercel account:

1. Push this repo to GitHub (or run `npx vercel` from the repo root).
2. In Vercel, **Import Project** and select the repo. Framework auto-detects as
   Next.js — no build settings to change.
3. Add the environment variables from [`.env.example`](.env.example) in
   **Project → Settings → Environment Variables**.
4. Deploy. The hello page at `/` confirms the pipeline is live end-to-end.

> **Deploy first, build second** (BUILD_SPEC.md §8) — get the live URL working now
> so deployment is never the last-mile surprise.

## Database (Supabase)

Run these once in the Supabase dashboard → **SQL Editor** (paste → Run):

1. [`supabase/schema.sql`](supabase/schema.sql) — tables, RLS, milestone templates,
   console allowlist. Idempotent — safe to re-run.
2. [`supabase/seed.sql`](supabase/seed.sql) — one fake test student ("Jordan
   Ellis"). Idempotent.

Both are safe to run twice (Milestone 2 DoD). A clean second run returns
"Success. No rows returned" with no errors. Edit the allowlist emails at the
bottom of `schema.sql` to match your real team.

## Test links (from the seed)

- **Intake wizard** (fresh student): `/intake/demo-fresh-token-0002` — Sam Rivers,
  hasn't done intake yet. Complete it to create a baseline + milestone rail.
- **Locked intake** (already done): `/intake/demo-jordan-token-0001` — Jordan Ellis,
  shows the read-only locked baseline.
- **Progress page** (rich): `/p/demo-jordan-token-0001` — Jordan's dashboard, built
  from his baseline + 9 check-ins.
- **Progress page** (week-1 empty states): `/p/demo-fresh-token-0002` — Sam, after
  he completes intake.

- **Weekly check-in**: `/checkin/demo-jordan-token-0001` — 5 questions → celebration
  → back to the progress page.

Re-run `supabase/seed.sql` after pulling Milestone 4 to load Jordan's fuller story.

## Team console

`/console` — magic-link login at `/console/login`, restricted to emails in
`team_allowlist`. Requires Supabase Auth config (see below). Shows the stat strip,
needs-attention, harvest queue, and the RAG roster with filters and actions
(nudge, request testimonial, mark milestone, draft case study).

**Supabase Auth setup (one time):** in Supabase → Authentication → URL Configuration,
set **Site URL** to your Vercel URL and add these **Redirect URLs**:
`https://<app>.vercel.app/auth/callback` and `http://localhost:3000/auth/callback`.
Make sure your email is in `team_allowlist` (seeded with the owner's email).

## Messaging + enrolment (Close CRM)

Proofline is CRM-agnostic; the current rail is **Close (close.com)** as CRM + sender.
Nothing sends live until `MESSAGING_PROVIDER=close` and the `CLOSE_*` env are set —
the default `log` provider only records intent to the `events` table.

**Enrolment:** `POST /api/webhooks/close` creates the student + token and sends the
intake invite. Point a Close webhook (lead enters "Purchased") at this URL.

**Go-live checklist (when ready):**
1. Run the updated `supabase/schema.sql` (adds `close_lead_id`/`close_contact_id`).
2. In Vercel env: `MESSAGING_PROVIDER=close`, `CLOSE_API_KEY`, `CLOSE_SENDER`,
   `CLOSE_SIGNING_KEY`, and `MESSAGING_CHANNEL=email` (or `sms`/`both` +
   `CLOSE_SMS_NUMBER` once 10DLC is registered).
3. In Close, create a webhook subscription → URL `https://<app>/api/webhooks/close`.

**Test the enrolment plumbing without Close** (no live messages — provider `log`):
set `CLOSE_WEBHOOK_SECRET` in Vercel, then:
```
curl -X POST "https://<app>/api/webhooks/close?secret=$CLOSE_WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"data":{"lead":{"id":"lead_test","display_name":"Test Student",
       "contacts":[{"id":"cont_test","emails":[{"email":"you@example.com"}]}]}}}'
```
Returns `{ ok, student_id, token, intake_url }` — open the `intake_url` to continue.

## Weekly cron (the loop)

`GET /api/cron/weekly` inserts a "sent" check-in for each active student and
recomputes every RAG flag. Protected by `CRON_SECRET`. Vercel runs it Mondays via
`vercel.json`. To fire it manually / rehearse two Mondays with a **fake clock**:

```
# Monday one
curl "https://<app>/api/cron/weekly?secret=$CRON_SECRET&now=2026-07-06T12:00:00Z"
# Monday two (a week later)
curl "https://<app>/api/cron/weekly?secret=$CRON_SECRET&now=2026-07-13T12:00:00Z"
```

Each returns JSON like `{ ok, students, sent, flagged, at }`.

The intake server action needs `SUPABASE_SERVICE_ROLE_KEY` (the Supabase **Secret**
key) set in the environment — locally in `.env.local`, and in Vercel.

## Project layout

```
src/app/            App Router pages (hello page today; real surfaces per §3)
src/lib/supabase/   Supabase clients (browser, server, service-role)
AGENTS.md           BRAIN — living project briefing + handoff (root)
docs/BUILD_SPEC.md  LAW — the frozen spec (source of truth)
docs/PRICING.md     LAW — pricing source of truth
docs/RISK-REGISTER.md  SPEC — threat register + strike-order plan
docs/DECISIONS.md   BRAIN — deviations from the spec, newest first
docs/mockups/       The three demo HTML files — the visual contract (§11)
docs/legal/         Licence agreement + cover email
docs/marketing/     Posting kit + slide renders
docs/ops/           Ops notes / deploy runbooks (empty scaffold)
docs/historical/    Superseded docs (excluded from Claude-project sync)
```
