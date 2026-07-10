# Milestamp — full project briefing

Read this whole file before any task. It is the single source of truth for a
fresh session; Nikita states next steps in chat and expects full context from
here. **[BUILD_SPEC.md](BUILD_SPEC.md) is the frozen spec** (scope, data model,
routes, flows, security); this file is the living session-to-session state —
**update "Live state" and "Roadmap" whenever something lands.**

> Repo/folder are still named **Proofline** (the old working title). The product
> is **Milestamp** (milestone + stamp). Students only ever see **NLS Mentorship**
> branding.

## What this is

**Milestamp** is a single-tenant student accountability app for the **NLS
Mentorship** pilot (one programme, ~25 students, 90 days, everything hardcoded to
NLS). A student is enrolled → completes a one-time **baseline intake** (locks
forever with a gold "stamp") → gets a private, unguessable link to a **progress
page** ("The Dossier") → answers a **45-second weekly check-in** every Monday
(confetti on submit) → the team watches everyone from a **console** with
red/amber/green flags. No student logins ever — access is signed tokens in links.
No LLM calls in v1: flags are rule-based, the case-study draft is template
interpolation.

**Design = "Midnight & Brass"** — a luxe dark theme (deep ink ground, glowing
brass/gold, glassy panels) applied across every surface. The student progress
page and its glowing revenue graph are **considered perfect — do not restyle them
without being asked.** The console carries extra glow (Nikita's request).

## Live state (as of 2026-07-08)

- **https://proofline-rosy.vercel.app** — LIVE. Vercel (team "silvermore", Hobby)
  auto-deploys every push to `main` of **github.com/NikitaSilvermore/proofline**.
  **Pushing to main IS deploying** — `npm run build` must be green first.
- **§8 milestones 1–7 DONE**: deploy skeleton · schema+seeds · intake · progress
  page · weekly check-in loop + cron · team console · messaging/enrolment.
- **Email works via Resend as Supabase's custom SMTP.** Supabase's built-in
  emailer is unreliable (dropped mail to Hotmail *and* Gmail) — replaced it.
  Sender `onboarding@resend.dev` (Resend **test mode**: can only email the Resend
  account owner, `nikita.silvermore@gmail.com`). Console magic-link login works to
  that Gmail. Resend SMTP creds live in Supabase → Auth → SMTP settings.
- **CRM = Close (close.com)**, swapped from GHL (Nikita has no GHL access) — see
  DECISIONS.md 2026-07-03. `src/lib/messaging.ts` defaults to
  `MESSAGING_PROVIDER=log` — **nothing sends to students live yet.** Enrolment
  webhook `/api/webhooks/close` is built and idempotent.
- **Console access**: Supabase magic-link + `team_allowlist` gate. Owner =
  `nikita.silvermore@gmail.com` (Hotmail is on the list but delivery is
  unreliable — prefer Gmail).
- **Vercel domain quirk (resolved, may recur):** `proofline-rosy.vercel.app` is
  the production alias but once served a **stale/pinned** old build for a while
  even though the dashboard showed the newest as current Production. It caught up
  on its own; browser cache also masked it — **hard-refresh** and, if a deploy
  seems "not live," verify via the top deployment's own **Visit** URL before
  assuming a build failure.
- **Test links** (from `supabase/seed.sql`): intake `/intake/demo-fresh-token-0002`
  (Sam, fresh) · progress `/p/demo-jordan-token-0001` (Jordan, rich) · check-in
  `/checkin/demo-jordan-token-0001` · `/console`. Re-run `seed.sql` to reset the
  12 mixed-state roster (the weekly cron recomputes flags and can flip the seeded
  colours — reseed to see the intended demo).

## Roadmap — done and remaining

- Milestones **1–7 ✅** (all built, deployed, mostly demonstrated live).
- **Turn on student email sending ⬜** — the app logs messages but sends none.
  To email real students: verify a domain in Resend (DNS records) → set Vercel env
  `MESSAGING_PROVIDER=resend` (or `close`), `RESEND_API_KEY`, `RESEND_FROM` (or the
  `CLOSE_*` set + point a Close webhook at `/api/webhooks/close`). Checklist in
  README. Open question: is the student rail **Close** (CRM+sender, Nikita's pick)
  or **Resend** (already wired for auth)? Confirm before wiring live.
- **Milestone 8 — dog-food gate ⬜** — Nikita + Becky enrol via the real trigger
  and live one full weekly cycle. **No real NLS student before this passes.**
- Status write-back (§6.4) — deferred nice-to-have. §10 deferrals unchanged.

## Architecture map

- **Routes** (`src/app/`): `/` (hello) · `/intake/[token]` (8-step wizard →
  server action locks baseline, builds milestone rail) · `/p/[token]` (progress,
  server-rendered from real rows only) · `/checkin/[token]` (5-Q wizard →
  celebration) · `/console` (+ `/console/login`) · `/auth/callback` (magic-link
  exchange) · `/api/webhooks/close` + `/api/webhooks/ghl` (enrolment) ·
  `/api/cron/weekly` (Monday send + flag recompute).
- **Logic** (`src/lib/`): `rag.ts` (deterministic §5 red/amber/green engine —
  10 unit scenarios pass) · `flags-service.ts` (recompute+persist, shared by
  submit + cron) · `progress.ts` + `console.ts` (view models) · `messaging.ts`
  (log/close/ghl/resend rail) · `token.ts` (nanoid-style link tokens) ·
  `intake-options.ts` · `clock.ts` (fake-clock for weekly-loop tests) ·
  `supabase/{client,server,middleware}.ts` (browser / service-role / session).
- **DB** (`supabase/`): `schema.sql` (tables + RLS + milestone templates +
  `team_allowlist`, idempotent) and `seed.sql` (12 mixed-state students,
  idempotent). Run both in Supabase SQL Editor **"without RLS"** (as owner).
- **Design**: brand tokens in `src/app/globals.css` (`:root`) + `tailwind.config.ts`;
  each page has its own `*.module.css` in the Midnight & Brass language. Body
  default ground is deep ink. `RevenueChart.tsx` = the glowing SVG graph (leave it).
- **Cron** scheduled in `vercel.json` (`0 12 * * 1`, ~Mon 08:00 ET);
  `?now=<ISO>` + `?secret=$CRON_SECRET` simulate Mondays for testing.

## Commands (build must be green before pushing = deploying)

- `npm run dev` — local dev server
- `npm run build` — production build (must pass before deploy)
- `npm run lint` — lint
- `node --experimental-strip-types <file>.mts` — run the pure-logic unit tests
  (rag/console) without a toolchain (see how they were written in git history).

## Environment gotchas (hard-won — trust these)

- **Hotmail/Outlook silently drops transactional mail** (Supabase auth, Resend
  verification — both failed to `bryant.nikita@hotmail.com`). Use
  **`nikita.silvermore@gmail.com`** for anything time-sensitive.
- **Supabase built-in email is test-only/unreliable** — Resend is wired as custom
  SMTP. For real student sends, verify a domain in Resend.
- **Run schema/seed SQL "without RLS"** in the Supabase SQL Editor (owner role);
  RLS would block the DDL + seed inserts.
- **Git identity is repo-local** (Nikita Bryant / bryant.nikita@hotmail.com); no
  global git identity on this machine. Commits get a `Co-Authored-By: Claude` line.
- **gh CLI** is installed/authed as NikitaSilvermore but NOT on PATH (and was
  absent this session): `C:\Users\Nikita_2\AppData\Local\Microsoft\WinGet\Links\gh.exe`.
- **Validate SQL before handing it to Nikita** with `pgsql-parser` (`npm i --no-save
  pgsql-parser` in a temp dir); the DB has no local psql/docker.
- **Windows**: avoid `:` in filenames (breaks writes); LF→CRLF git warnings on
  commit are harmless.
- **Vercel**: prior deploys occasionally lagged on the production alias — see the
  domain quirk under Live state. `next@15.1.x` is CVE-blocked by Vercel; stay on
  the patched `15.5.x` line.

## Working style with Nikita

Non-technical, builds via guided steps — **explain like to a five-year-old**, with
analogies. Claude does all code/git/build/verify; Nikita only does what needs his
accounts (Supabase SQL runs, Vercel env vars, Supabase auth config, viewing on his
phone). Build in small verified milestones; commit + push per completed piece; log
judgment calls (naming, pricing, tone) for review rather than deciding silently.
