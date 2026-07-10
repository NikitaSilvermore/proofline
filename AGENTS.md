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

## Live state (as of 2026-07-10)

- **https://proofline-rosy.vercel.app** — LIVE. Vercel (team "silvermore", Hobby)
  auto-deploys every push to `main` of **github.com/NikitaSilvermore/proofline**.
  **Pushing to main IS deploying** — `npm run build` must be green first.
- **§8 milestones 1–7 DONE**: deploy skeleton · schema+seeds · intake · progress
  page · weekly check-in loop + cron · team console · messaging/enrolment.
- **Design & brand DONE**: renamed **Proofline → Milestamp** (visible name; repo
  still "proofline"). **"Midnight & Brass" dark theme applied across every surface**
  (progress, intake, check-in, console, hello) + a console **glow pass** (Nikita's
  request). The **student progress page + its glowing graph are considered
  perfect — do NOT restyle them.** Design was the pivot that clicked ("I fking
  love it") after a subtle light version fell flat.
- **Console login WORKS** end-to-end via Gmail (Resend SMTP). Marketing **posting
  kit built** — see the Marketing section below.
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

- Milestones **1–7 ✅** (all built, deployed, demonstrated live) + design/brand ✅.
- **▶ NEXT SESSION STARTS HERE — turn on student email sending ⬜.** The app logs
  messages but sends none (`MESSAGING_PROVIDER=log`). **Resend is already proven**
  (it powers console-login email as Supabase SMTP), so the easy path is Resend for
  students too: **verify a domain in Resend (DNS records) → in Resend switch the
  sender from `onboarding@resend.dev` to `hello@<domain>` → set Vercel env
  `MESSAGING_PROVIDER=resend`, `RESEND_API_KEY`, `RESEND_FROM`.** (Alt rail = Close:
  `CLOSE_*` env + point a Close webhook at `/api/webhooks/close`; Nikita picked
  Close as CRM+sender but Resend is the faster path.) **Open question to ask Nikita
  first:** does he have DNS access for a domain to verify? US students → SMS needs
  10DLC; recommend email-only to start.
- **Milestone 8 — dog-food gate ⬜** — Nikita + Becky enrol via the real trigger
  and live one full weekly cycle. **No real NLS student before this passes.** This
  also unlocks the first real **proof** marketing posts.
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

## Marketing / posting kit

`marketing/POSTING-KIT.md` + `marketing/captions.md` — the go-to-market kit.
Two voices: **@milestamp** (product/brand IG + other platforms) and **nikita.hts**
(Nikita's personal founder account — his audience is high-ticket coaches + top
closers; NOT the Silvermore brand). Angle: build-in-public *and* product.
**Hard rule: nothing posts until Milestamp is live with real NLS students**, and
any student shown as "proof" must have ticked the intake public-sharing consent
(`consent.public_optin`). Launch sequence + captions/carousels/reels are drafted
with `[[slots]]` for real numbers.

**Rendered slide designs**: `marketing/carousels.html` is the on-brand (Midnight &
Brass) source for **19 IG 4:5 slides** — 2 carousels (how-it-works, "5 signs a
client is about to ghost"), 3 quote cards, 3 reel covers, 1 proof template. Render
to PNGs with `node marketing/make-cards.mjs` → `marketing/cards/` (gitignored,
regenerable; uses puppeteer-core + system Chrome). Nikita's verdict: "absolutely
superb." Not-yet-done: live-app **screenshot** showcase cards (the glowing graph /
console) — the best asset, but needs a real student + console access first.

## Working style with Nikita

Non-technical, builds via guided steps — **explain like to a five-year-old**, with
analogies. Claude does all code/git/build/verify; Nikita only does what needs his
accounts (Supabase SQL runs, Vercel env vars, Supabase auth config, viewing on his
phone). Build in small verified milestones; commit + push per completed piece; log
judgment calls (naming, pricing, tone) for review rather than deciding silently.
