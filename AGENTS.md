# Milestamp — full project briefing

Read this whole file before any task. It is the single source of truth for a
fresh session; Nikita states next steps in chat and expects full context from
here. **[BUILD_SPEC.md](BUILD_SPEC.md) is the frozen spec** (scope, data model,
routes, flows, security); **[RISK-REGISTER.md](RISK-REGISTER.md) is the threat
register + strike-order plan** from the 2026-07-11 red-team engagement — read it
before planning any milestone, it reordered the roadmap; **[PRICING.md](PRICING.md)
is the pricing source of truth** (2026-07-11 — supersedes every earlier price
anywhere, including older £-figures still visible in the register's history);
this file is the living session-to-session state —
**update "Live state", "Roadmap", "Accounts & env", and "Decisions" whenever
anything lands or is decided. Record account/domain/purchase/money facts
immediately, not "at the end" — those are the ones that slip.**

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

**Design = "Midnight & Brass"** — a luxe dark theme (deep ink ground `#0a1119`,
glowing brass/gold `#d8b978`/`#c6a15b`, glassy panels) applied across every
surface. The **student progress page and its glowing revenue graph are considered
perfect — do NOT restyle them without being asked** (Nikita said so twice). The
console carries extra glow (Nikita's request).

## People & accounts (roster)

- **Nikita Silvermore** (Nikita Bryant) — owner/builder. Emails:
  **`nikita.silvermore@gmail.com`** (use this — reliable) and
  `bryant.nikita@hotmail.com` (Hotmail silently drops transactional mail — avoid).
  GitHub **NikitaSilvermore**. Non-technical; builds via guided ELI5 steps.
- **Becky** — NLS partner; the second dog-food student for Milestone 8. Her own
  accountancy mentorship, **Six Figure Bookkeepers**, is one of the warm-four
  coach prospects.
- **Makenna** — **NLS CEO / head of operations.** Decisions ultimately route
  through her, but the day-to-day champion is Ted (below). She already
  white-labels software (her GHL white-label is **"GST"**) — hence the
  non-replication one-pager in RISK-REGISTER.md N2. May get console read access
  (placeholder email in `team_allowlist` — update before granting).
- **Ted** — Nikita's manager, NLS head of sales, owner of **All Out Sales** (the
  agency Makenna hired to run the NLS sales team). **He moved the sales team from
  GHL/GST to Close.io and pays for Close + the software stack** — Milestamp
  integrates into Close through his authority, and the licence agreement can be
  signed with him (a one-page Makenna acknowledgment covers data/brand/case-study
  rights — RISK-REGISTER.md N2). Saw the demos: "incredible". Next step with him =
  formalise agreement + action plan. **SMS verification is already accepted** on
  the Close side.
- **Cassie** — NLS support team, works under Ted; the main console touchpoint.
  Add her to `team_allowlist`; her weekly logins = the team-adoption metric.
- **Forbes** — the mentor behind NLS; **no involvement** in operations. Forbes
  Riley is a separate warm-coach conversation in her own right.
- **Warm four** (first external coaches after NLS proof, in order): Forbes Riley ·
  **ACL Rehab** (fork already live) · **Capital Closer** (taught Nikita closing;
  already on Close → first clone candidate) · **Six Figure Bookkeepers** (Becky's).
  Design partners get the **founding-partner rate: Standard at $397/mo, 12-month
  lock** (PRICING.md §2; sweeteners = lock length, never lower price; the earlier
  £33×3 idea is dead).
- **NLS Mentorship** — the speaking/coaching programme this pilot serves.
- **Domains: Nikita owns the Milestamp domains** (bought them; e.g. `.com`/`.app`
  — confirm the exact one to use when wiring). Plan: point a Milestamp domain at
  the Vercel app to **replace `proofline-rosy.vercel.app`**, and verify one in
  Resend for a branded email sender (`hello@<milestamp-domain>`). DNS: Nikita can
  manage it (did wordhoard.day on Cloudflare).

## Live state (as of 2026-07-11)

- **Red-team engagement captured (2026-07-11) → [RISK-REGISTER.md](RISK-REGISTER.md).**
  Two independent pre-mortems (run on claude.ai against BUILD_SPEC + external
  strategy docs not in this repo) were compounded, rebutted with Nikita's context,
  and distilled into a threat register + strike-order plan. Headline commercial
  facts that landed with it: **pilot reshaped to 6 months / ~100 students**
  (backfill 30–50 existing students, Jul–Aug 10–20 new/mo, Sep–Nov projected
  30–40/mo); **contract path = Ted** (All Out Sales) for licence/Close access
  **plus** a one-page Makenna acknowledgment (data/brand/case-study rights,
  non-replication). The intake "modest baseline" sandbag line was deleted the
  same day (register T14).
- **Pricing locked (2026-07-11, later the same day) → [PRICING.md](PRICING.md)** —
  supersedes the risk engagement's £99/£33 figures and closes register N4.
  **Three tiers: Core $397 / Standard $797 / Signature $2,497 per month** (USD,
  flat per programme, unlimited students, fair-use 1,000, annual = 2 months
  free; never per-student). **Founding-partner rate for the first 10 (incl. NLS
  + ACL): Standard at $397/mo, 12-month lock, list $797 stated in every
  contract.** NLS payment still starts day 90 from go-live. New facts inside:
  **NLS refunds claw back All Out Sales commission (~$400/$10k refund)** and the
  **NLS October target ≈ $500k/month collected** — Ted's ROI paragraph in
  PRICING.md §3 is built on both. Tier names Core/Standard/Signature await
  Nikita's veto (never "Lite", never "Gold").

- **https://proofline-rosy.vercel.app** — LIVE (temporary URL; to be replaced by a
  Milestamp domain). Vercel (team **"silvermore"**, Hobby) auto-deploys every push
  to `main` of **github.com/NikitaSilvermore/proofline**. **Pushing to main IS
  deploying** — `npm run build` must be green first.
- **⚠ Vercel seat-block warning (discovered 2026-07-11 via wordhoard):** the
  team's `milestamp-acl` project has ALL git deployments silently BLOCKED
  ("commit author does not have contributing access", seatBlock
  `TEAM_ACCESS_REQUIRED`) — same disease that froze wordhoard.day on a 3-day-old
  build. Cause: commits authored `bryant.nikita@hotmail.com` don't map to a
  member of the Pro team "silvermore". `proofline` itself deployed READY as of
  2026-07-11 16:44 UTC, but verify after pushes; if it flips to BLOCKED, the fix
  options live in the wordhoard `AGENTS.md` handoff (⚠ block at top): connect
  GitHub↔Vercel login / add the hotmail email to the GitHub account, or a
  one-off `npx vercel deploy --prod` (CLI authed on this machine).
- **§8 milestones 1–7 DONE**: deploy skeleton · schema+seeds · intake · progress
  page · weekly check-in loop + cron · team console · messaging/enrolment.
- **Design & brand DONE**: renamed **Proofline → Milestamp** (visible name only —
  hello page, `<title>`, console ribbon, "Powered by Milestamp" footers; repo/URL
  still "proofline"). **"Midnight & Brass" dark theme across every surface**
  (progress, intake, check-in, console, hello; `globals.css` body ground is now
  deep ink) + a console **glow pass** (glowing stat numbers, RAG pills/dots,
  medals, buttons, filters, red halos on needs-attention, ambient wash, title
  glow). The pivot that clicked ("I fking love it") after a subtle light "Dossier"
  version fell flat ("couldn't tell the difference"). **Student progress page +
  graph frozen — do not touch.**
- **Console login WORKS** end-to-end via Gmail. **Email fixed via Resend as
  Supabase custom SMTP** — Supabase's built-in emailer is unreliable (dropped mail
  to Hotmail *and* Gmail). Resend SMTP creds live in **Supabase → Auth → SMTP
  settings** (host `smtp.resend.com`, port 465, user `resend`, pass = Resend API
  key, sender `onboarding@resend.dev`). Resend is in **test mode** → can only email
  the Resend account owner (`nikita.silvermore@gmail.com`), which is why that Gmail
  is the console owner in `team_allowlist`.
- **CRM = Close (close.com)**, swapped from GHL — see DECISIONS.md 2026-07-03,
  now **confirmed by the org itself**: Ted moved the whole NLS sales team to Close
  and pays for it; the live webhook + env get wired **through Ted**.
  `src/lib/messaging.ts` defaults to `MESSAGING_PROVIDER=log` — **nothing sends to
  students live yet.** Enrolment webhook `/api/webhooks/close` is built and
  idempotent (no fallback yet — register N1 wants one). Rail decision (register
  N1): **trigger from Close, send from infrastructure we own (Resend)**.
- **Marketing posting kit built** — see the Marketing section.
- **Vercel domain quirk (resolved, may recur):** `proofline-rosy.vercel.app` once
  served a **stale/pinned** old build for a while even though the dashboard showed
  the newest as current Production+Ready; it caught up on its own, and browser
  cache also masked it. If a deploy seems "not live": **hard-refresh**, and verify
  via the top deployment's own **Visit** URL (`proofline-<hash>-silvermore.vercel.app`,
  SSO-protected — Nikita can open it while logged in) before assuming a build
  failure. NB: `proofline.vercel.app` is a DIFFERENT person's project — not ours.
- **Test links** (from `supabase/seed.sql`): intake `/intake/demo-fresh-token-0002`
  (Sam, fresh) · progress `/p/demo-jordan-token-0001` (Jordan, rich) · check-in
  `/checkin/demo-jordan-token-0001` · `/console`. Re-run `seed.sql` to reset the
  12 mixed-state roster (the weekly cron recomputes flags and can flip the seeded
  colours — reseed to see the intended demo).
- **Sibling fork exists (2026-07-10): Milestamp ACL Recovery** — full adaptation for
  **ACL Rehab** (brand name exactly that; @theaclrehabguy is only the IG handle.
  Nikita is a client — partial tear, non-surgical; they'll be the FIRST coach pitched
  once NLS students are in and working). Lives at `Desktop\milestamp-acl` /
  github.com/NikitaSilvermore/milestamp-acl (private; own briefing in its `AGENTS.md`).
  **LIVE at https://milestamp-acl.vercel.app since 2026-07-11** (own Supabase project;
  push to its main = deploy).
  ACL Rehab's stack: TrueCoach (routines + workout logging) + a university-study Excel
  outcome measure — Milestamp complements both (drop-off reduction + proof/testimonials),
  never replaces them. Nothing in this repo changed; the NLS roadmap below is untouched.

## Roadmap — done and remaining

- Milestones **1–7 ✅** (built, deployed, demonstrated live) + design/brand ✅ +
  posting kit ✅ + risk register ✅ (2026-07-11; sandbag line deleted same day).
- **The full ordered plan now lives in RISK-REGISTER.md → "Strike-order to-do".**
  Summary of what's next:
- **Nikita-side blockers (this week, need his identity — prep so his part is
  copy-paste):** get + read both agreements from Ted (his ↔ All Out Sales, and
  All Out Sales ↔ NLS; solicitor eyeball for IP-assignment) ⬜ · the **two
  papers** — **Ted licence DRAFTED ✅ at PRICING.md §3 terms** ($397 founding /
  list $797 / 12-month Initial Term; `legal/Milestamp-Pilot-Licence-Agreement-DRAFT.docx`
  + cover email `legal/ted-cover-email.md`; Nikita fills the yellow blanks +
  solicitor review; regenerate from `legal/ted-agreement.html` via Word COM if
  edited) · Makenna one-pager ⬜ — **both signed before student #1 enrols, no
  momentum exceptions** · **Vercel Hobby → paid**
  (Hobby bans commercial use) ⬜ · book UKIPO + USPTO + attorney trademark
  searches (Milestone 9b hard-blocked until clear) ⬜.
- **▶ Build side starts here — turn on student email sending ⬜** (= the "sends we
  own" half of register N1). Nikita **owns the Milestamp domains**, so DNS is not
  a blocker. Steps: **verify a Milestamp domain in Resend** (add its DNS records —
  guide him like wordhoard.day) → **switch the Resend sender** from
  `onboarding@resend.dev` to `hello@<milestamp-domain>` (lifts test-mode) → set
  Vercel env `MESSAGING_PROVIDER=resend`, `RESEND_API_KEY`, `RESEND_FROM`,
  `MESSAGING_CHANNEL=email`. While in DNS: **point a Milestamp domain at the
  Vercel app** to replace `proofline-rosy` (update Supabase Auth Site URL +
  redirect + `APP_BASE_URL` after). **SMS: verification is already accepted on
  Close (per Nikita 2026-07-11)** — still launch email-first, add SMS once the
  Close wiring lands.
- **Then, before go-live** (register items): live Close webhook via Ted +
  enrolment fallback ⬜ · schema generalisation `metric_value`/`metric_unit` ⬜ ·
  label seeded demo data ⬜ · Cassie on `team_allowlist` ⬜ · backfill consent
  path for the 30–50 existing students ⬜ · day-90 decision doc ⬜ · audited
  baseline-amendment flow ⬜ · T4 response-decay contingency ladder written ⬜.
- **Milestone 8 — dog-food gate ⬜** — Nikita + **Becky** enrol via the real
  trigger and live one full weekly cycle. **No real NLS student before this
  passes.** This also unlocks the first real **proof** marketing posts.
- Status write-back (§6.4) — deferred nice-to-have. §10 deferrals unchanged
  (Hermes/AI-agent ideas, WhatsApp, form→template generator all live there —
  post-pilot).

## Architecture map

- **Routes** (`src/app/`): `/` (hello) · `/intake/[token]` (8-step wizard →
  `submitIntake` server action locks the immutable baseline + builds the milestone
  rail) · `/p/[token]` (progress, server-rendered from real rows only, week-1 empty
  states) · `/checkin/[token]` (5-Q wizard → celebration/confetti) · `/console`
  (+ `/console/login`) · `/auth/callback` (magic-link code exchange) ·
  `/api/webhooks/close` + `/api/webhooks/ghl` (enrolment) · `/api/cron/weekly`
  (Monday send + flag recompute).
- **Logic** (`src/lib/`): `rag.ts` (deterministic §5 red/amber/green engine —
  10 unit scenarios pass) · `flags-service.ts` (recompute+persist, shared by
  submit + cron) · `progress.ts` + `console.ts` (view models; console has 11 unit
  scenarios) · `messaging.ts` (log/close/ghl/resend rail; `MESSAGING_CHANNEL`
  email|sms|both) · `token.ts` (nanoid-style link tokens) · `intake-options.ts` ·
  `clock.ts` (fake-clock for weekly-loop tests) · `supabase/{client,server,
  middleware}.ts` (browser / service-role / session).
- **DB** (`supabase/`): `schema.sql` (tables + RLS + milestone templates +
  `team_allowlist` + `students.close_lead_id/close_contact_id`, idempotent) and
  `seed.sql` (12 mixed-state students, idempotent). Run both in Supabase SQL Editor
  **"without RLS"** (owner role). Console gate = Supabase magic-link + membership in
  `team_allowlist`.
- **Console actions** (`src/app/console/actions.ts`, all `requireTeam()`-gated):
  nudge · request testimonial · mark next milestone · draft case study (template
  interpolation) · sign out.
- **Design**: brand tokens in `src/app/globals.css` (`:root`) + `tailwind.config.ts`;
  each page has its own `*.module.css` in the Midnight & Brass language.
  `RevenueChart.tsx` = the glowing SVG graph (leave it). Fonts: Bricolage Grotesque
  (display) · Schibsted Grotesk (body) · Spline Sans Mono (mono), via Google Fonts.
- **Cron** scheduled in `vercel.json` (`0 12 * * 1`, ~Mon 08:00 ET); test with
  `?secret=$CRON_SECRET` + optional `?now=<ISO or YYYY-MM-DD>` to simulate Mondays.

## Accounts & env

- **Vercel** (team "silvermore", Hobby) — env vars currently set:
  `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET`. **To add for student email:**
  `MESSAGING_PROVIDER=resend`, `RESEND_API_KEY`, `RESEND_FROM`, `MESSAGING_CHANNEL`,
  `APP_BASE_URL`. (Close alt: `CLOSE_API_KEY`, `CLOSE_SENDER`, `CLOSE_SMS_NUMBER`,
  `CLOSE_SIGNING_KEY`, `CLOSE_WEBHOOK_SECRET`.) Supabase keys are the new
  **Publishable** (→ anon) and **Secret** (→ service role) keys.
- **Supabase** — Auth → URL Configuration set to the Vercel URL + `/auth/callback`
  redirect. Custom SMTP = Resend (see Live state). Run schema/seed "without RLS".
- **Resend** — signed up with `nikita.silvermore@gmail.com`; test-mode sender
  `onboarding@resend.dev`. API key powers Supabase SMTP now; will also power app
  student sends once `MESSAGING_PROVIDER=resend`.
- **GitHub** — NikitaSilvermore/proofline (connected to Vercel; push = deploy).

## Commands (build must be green before pushing = deploying)

- `npm run dev` — local dev server
- `npm run build` — production build (must pass before deploy)
- `npm run lint` — lint
- `node --experimental-strip-types <file>.mts` — run the pure-logic unit tests
  (rag/console). On Windows, import the target with a **relative** specifier +
  `.ts` extension (absolute `C:\` paths fail the ESM URL scheme).
- `node marketing/make-cards.mjs` — render the posting-kit slides to PNGs.

## Environment gotchas (hard-won — trust these)

- **Hotmail/Outlook silently drops transactional mail** (Supabase auth, Resend
  verification — both failed to `bryant.nikita@hotmail.com`). Use
  **`nikita.silvermore@gmail.com`** for anything time-sensitive.
- **Supabase built-in email is test-only/unreliable** — Resend is wired as custom
  SMTP. For real student sends (to anyone but the Resend owner), **verify a domain
  in Resend**.
- **Run schema/seed SQL "without RLS"** in the Supabase SQL Editor (owner role);
  RLS would block the DDL + seed inserts.
- **Git identity is repo-local** (Nikita Bryant / bryant.nikita@hotmail.com); no
  global git identity. Commits get a `Co-Authored-By: Claude` line.
- **gh CLI** is installed/authed as NikitaSilvermore but NOT on PATH (absent this
  session): `C:\Users\Nikita_2\AppData\Local\Microsoft\WinGet\Links\gh.exe`.
- **Validate SQL before handing it to Nikita** with `pgsql-parser` (`npm i --no-save
  pgsql-parser` in a temp dir); the DB has no local psql/docker. NB: pgsql-parser
  checks grammar, not semantics (it passed a `VALUES` alias that Postgres rejected —
  aliases take column *names* only, no types).
- **Windows**: avoid `:` in filenames (breaks writes + curl `-o`); LF→CRLF git
  warnings on commit are harmless.
- **Vercel**: prior deploys occasionally lagged on the production alias — see the
  domain quirk under Live state. `next@15.1.x` is **CVE-blocked by Vercel**
  (CVE-2025-66478) — stay on the patched `15.5.x` line.

## Marketing / posting kit

`marketing/POSTING-KIT.md` + `marketing/captions.md` — the go-to-market kit.
Two voices: **@milestamp** (product/brand IG + other platforms) and **nikita.hts**
(Nikita's personal founder account — his audience is high-ticket coaches + top
closers who follow him; NOT the Silvermore brand). Angle: build-in-public *and*
product. **Hard rule: nothing posts until Milestamp is live with real NLS
students**, and any student shown as "proof" must have ticked the intake
public-sharing consent (`consent.public_optin`). Launch sequence + captions/
carousels/reels drafted with `[[slots]]` for real numbers.

**Rendered slide designs**: `marketing/carousels.html` is the on-brand (Midnight &
Brass) source for **19 IG 4:5 slides** — 2 carousels (how-it-works, "5 signs a
client is about to ghost"), 3 quote cards, 3 reel covers, 1 proof template. Render
to PNGs with `node marketing/make-cards.mjs` → `marketing/cards/` (gitignored,
regenerable; uses puppeteer-core + system Chrome). Nikita's verdict: "absolutely
superb." Not-yet-done: live-app **screenshot** showcase cards (the glowing graph /
console) — the best asset, but needs a real student + console access first.
(Wordhoard marketing goes on Nikita's *personal* once its Android app is live;
Milestamp does NOT go on Silvermore.)

## Working style with Nikita

Non-technical, builds via guided steps — **explain like to a five-year-old**, with
analogies. Claude does all code/git/build/verify; Nikita only does what needs his
accounts (Supabase SQL runs, Vercel env vars, Supabase auth config, DNS, viewing
on his phone). Build in small verified milestones; commit + push per completed
piece; **log judgment calls** (naming, pricing, tone) for review rather than
deciding silently. **Keep this briefing current — capturing decisions here (not
just in chat) is the whole point; a missed account/domain fact is a real failure.**
