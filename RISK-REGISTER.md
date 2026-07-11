# Milestamp risk register

**Provenance (2026-07-11):** two independent red-team "pre-mortem" engagements were
run on claude.ai against BUILD_SPEC plus external strategy docs that are NOT in this
repo (a partner brief and a growth-strategy doc). Their findings were compounded —
**[BOTH]** means both runs found it independently (treat as true until disproven).
Nikita then supplied corrective context (see "Corrective facts") and replied to every
threat; the verdicts below are the post-rebuttal state. Both runs converged on the
same most-likely cause of death: **the free anchor pilot absorbs the only build
window and never converts to cash, while nothing installable exists for anyone else.**
Post-context odds estimate: ~1-in-3 (was ~1-in-5/1-in-8), conditional on N1+N2 landing.

## Corrective facts (superseded the reports' assumptions — also in AGENTS.md)

- **Makenna is NLS's CEO / head of operations** (not just an ops gatekeeper). She
  hired **Ted** and his company **All Out Sales** to run the NLS sales team. Ted is
  Nikita's manager / head of sales.
- **Ted moved the whole sales team off GHL (Makenna's white-label "GST") onto
  Close.io** and pays for Close + the software stack. Milestamp integrates into
  Close **through Ted's authority**; the licence agreement can be signed with Ted.
  Ted has seen the demos and called them "incredible" — next step is formalising an
  agreement + action plan with him. Decisions still ultimately route through Makenna.
- **SMS verification is already accepted** (on the Close side, per Nikita) — the
  10DLC blocker in DECISIONS 2026-07-03 is likely resolved; confirm the sending
  number/rail before flipping `MESSAGING_CHANNEL`.
- **Cassie** (works under Ted) = NLS support-team main touchpoint; gets console
  access; her weekly logins become the team-adoption metric.
- **Pilot shape changed: 6-month pilot, ~100 students minimum.** Backfill 30–50
  students from the last two months; Jul–Aug 10–20 new/month; Sep–Nov projected
  30–40/month (treat projections as ceilings, plan on the floor). Measures refund
  rate, payment-plan drop-off, and testimonials with real n.
- ~~Price: £99/month; warm four £33×3~~ **SUPERSEDED later the same day by
  [PRICING.md](PRICING.md)**: three tiers Core $397 / Standard $797 / Signature
  $2,497 (USD, flat per programme, unlimited students); **founding-partner rate
  for NLS + first 10 = Standard at $397/mo**, list $797 stated in contract.
  Still never free; **payment for NLS starts by day 90** even though measurement
  runs 6 months.
- **Warm four** (first external coaches, in order): **Forbes Riley** (separate
  discussion), **ACL Rehab** (Nikita healed his knee with them, knows the owner —
  fork already live), **Capital Closer** (taught Nikita closing; already on Close →
  first clone candidate), **Six Figure Bookkeepers** (Becky's accountancy
  mentorship; she thinks they'll love it).
- **Forbes (the mentor) has no involvement** in NLS operations.

## New findings from the engagement (N)

- **N1 — rail migration. LARGELY DONE IN CODE ALREADY.** The reports assumed the
  build was GHL-coupled; this repo swapped to Close on 2026-07-03 (webhook
  `/api/webhooks/close`, `messaging.ts` close/resend rails). Remaining: wire the
  live Close webhook + env **via Ted**, keep sends on infrastructure we own
  (Resend), and add an enrolment fallback path (webhook has none).
- **N2 — contract party mismatch. OPEN, CRITICAL.** Ted can sign licence/payment/
  Close access, but **cannot** grant NLS student-data authority, NLS branding,
  case-study rights, or bind NLS against cloning (Makenna's GST = she white-labels
  software already). Fix: **two papers** — Ted licence (price, day-90 payment
  start, Close access) + a one-page Makenna acknowledgment (data, brand,
  case-study rights, one non-replication line). Both signed **before student #1**.
- **N3 — attribution confound. OPEN.** New sales agency + new CRM + Milestamp land
  together; any refund/drop-off improvement has three fathers. Pre-agree in writing
  what Milestamp uniquely owns (response rate, documented saves, testimonial
  count); report refund movement as joint.
- **N4 — pricing model. RESOLVED 2026-07-11 by [PRICING.md](PRICING.md).**
  Per-student pricing **permanently rejected** (deactivate-to-save incentive
  punches holes in the proof rail — documented CoachAccountable behaviour); flat
  per-programme tiers won, at proof-layer (not tracker) price points: Core $397 /
  Standard $797 / Signature $2,497. Survival math fixed too: ~10 Standard-list
  logos ≈ the old 40+ at £99.

## Threat register (T1–T21, post-rebuttal status)

| # | Threat | Status | Action / owner |
|---|---|---|---|
| T1 | No price anywhere → free forever [BOTH] | **CLOSED by PRICING.md** | Founding rate $397/mo (list $797) + day-90 start, written into the Ted paper |
| T2 | Founder capacity 2–3 FTE vs ≤0.5 [BOTH] | **SURVIVES** — root risk | "Hermes"/AI-agent research = deferred scope (BUILD_SPEC §10). Only capacity-saving AI before day 90. Canary: a skipped Friday update |
| T3 | Launch number unprovable in 90d/n≈25 [BOTH] | LARGELY KILLED | 6-month/~100-student pilot fixes n. Refund baseline still Makenna-gated (→ N2 paper). Payment still starts day 90 |
| T4 | Check-in response decay [BOTH] | ACCEPTED — contingency ladder | Wk4 <60% → cut to 3 questions; wk6 → SMS-first + send-time test; wk8 <40% → human-touch reds only, redesign loop. Streak "stamp" reward: build. SMS first, WhatsApp after |
| T5 | Contractor agreement unread; prior vendor cloning [BOTH] | **SURVIVES until read** | Get BOTH agreements from Ted (Nikita↔All Out Sales; All Out Sales↔NLS); solicitor eyeball for IP-assignment. Nikita |
| T6 | Single-relationship concentration [BOTH] | TRANSFORMED | Now a chain: Makenna + Ted + their relationship. Ted's agency is churnable (6–18mo typical). Mitigation = N2's two papers |
| T7 | Customer #2 unservable (hardcoded NLS) [BOTH] | DIRECTION SET | Repo-clone tenancy per coach (ACL fork proves it). First real clone = 1–2 wks, not "under a day". Cap at NLS + one (Capital Closer) until day 45 |
| T8 | GHL rail/access fragility [BOTH] | REPLACED by N1 | Close trigger + Resend sends; enrolment fallback still to add |
| T9 | Enrolment pace unknown [BOTH] | KILLED by T3 numbers | Backfill consent path needed (as-of-today baselines) |
| T10 | Demo fiction sets expectations [BOTH] | MOSTLY KILLED | Label seeded/demo data "Sample data —"; never show fabricated results unlabelled on sales calls. NB: live `/p/` page's "nothing here is a guess" is TRUE (real rows only) — leave it |
| T11 | Proof paradox — measurement scares weak coaches [BOTH] | REBUTTAL SURVIVES | Adverse selection = the filter; sell to good-outcome coaches. Lead with proof/testimonials, demote refund-defence. Still design the stalled-student page state |
| T12 | Saves unprovable [BOTH] | ACCEPTED — definition | Save = red flag → logged intervention → green ≤21 days with payment plan intact, written up that week, Cassie-acknowledged. Count nothing else |
| T13 | NLS team never touches product [BOTH] | IMPROVED | Cassie on `team_allowlist`; Friday updates → Ted + Cassie; her logins = adoption metric |
| T14 | Intake coaches sandbagging [BOTH] | **CLOSED 2026-07-11** | Line deleted from `IntakeWizard.tsx` (this commit) |
| T15 | "Verified" = self-report + timestamp [BOTH] | CLOSED (policy) | No verification-flavoured language anywhere public until machinery exists |
| T16 | Win cards = income claims (FTC) [A] | MOSTLY CLOSED | Cards = wins not money; translate money milestone labels in card copy ("Her biggest stage yet"); light disclosure line; don't forecast on virality |
| T17 | Day-45 kill switch at worst week [A] | ACCEPTED — chain | Day 45 = health check; day 90 = kill-or-pay; measurement to month 6 AFTER money starts |
| T18 | Tracker-price anchoring (Skool/Senja) [B] | CLOSED by PRICING.md | Tiers priced above tracker shelf by design; "unlimited students, flat fee" is the anti-per-head contrast; price goes in design-partner LOIs |
| T19 | Trademark unclear before public marks [B] | OPEN — action | UKIPO + USPTO + attorney knockout booked this month; win-cards/powered-by (Milestone 9b) HARD-BLOCKED until clear. Nikita |
| T20 | Money-only schema doesn't generalise [A] | HALF-SURVIVES → build item | `value_confirmed` → generic `metric_value` + `metric_unit` per track (~2h) so knees/commissions/clients fit. Do before NLS go-live. Form→AI template generator = post-pilot (§10) |
| T21 | Hygiene: GDPR rectification, WhatsApp promise, Vercel Hobby [A] | OPEN — actions | Audited-amendment path for baseline typos (superseded_by, never silent edit); Vercel → paid plan (Hobby bans commercial use); WhatsApp queued behind SMS |

Left alone deliberately: the check-in "$ 0 is a fine answer" placeholder (T4 flagged
the emotional cost; no decision to change — revisit if response decays).

## Kill criteria (spreadsheet-checkable; dates from the engagement)

1. **Signature gate:** both papers signed before student #1 enrols. Unsigned
   enrolment = knowingly accepting the clone risk → halt.
2. Demo done; **comms sign-off ≤14 days** after. Stall → drop-dead 31 Aug 2026.
3. Go-live by ~1 Sep 2026; ≥10 students by 1 Oct (backfill makes this easy — miss
   means process failure, not demand failure).
4. **Response:** week-4 ≥60%, week-8 ≥45%. Below → run the T4 ladder once; still
   <40% at week 8 → core loop broken for this ICP; change mechanism.
5. Day-45: ≥1 written, operator-acknowledged save AND ≥5 testimonials. Zero saves →
   stop selling operator economics.
6. **NLS pays the founding rate ($397/mo, PRICING.md §3) from day 91
   post-go-live.** No payment → anchor is a free-rider: freeze NLS at
   maintenance, move capacity to externals.
7. Externals: 3 live conversations by ~15 Aug 2026; 1 signed LOI with a price in it
   by ~day 120.
8. **Portability:** by 31 Jan 2027 a second programme goes live in ≤2 founder-days
   via repo-clone tenancy (ACL fork already points the way).
9. Capacity: 2 skipped Friday updates in a month → mandatory scope cut that week;
   two such months consecutively → re-plan around reality.
10. Trademark clear before ANY public win card / powered-by link ships.

## Strike-order to-do (agreed 2026-07-11)

**This week — blockers (mostly Nikita):**
1. Get + read both agreements (T5); solicitor eyeball.
2. Draft the two papers (N2/T1/T17): **Ted licence DRAFTED ✅ 2026-07-11,
   re-issued same day at PRICING.md §3 terms** ($397/mo founding rate, list
   $797 stated, 12-month Initial Term from first payment, unlimited students +
   fair-use 1,000) → `legal/Milestamp-Pilot-Licence-Agreement-DRAFT.docx`
   (+ cover email with Ted's ROI paragraph in `legal/ted-cover-email.md`;
   blanks to fill: entity names/addresses, Ted + Cassie surnames, payment
   method, governing law — then solicitor review).
   **Makenna one-pager still to draft ⬜.**
3. ~~Delete the sandbag line~~ ✅ done 2026-07-11. (T14)
4. Vercel Hobby → paid plan. (T21)
5. Book UKIPO + USPTO + attorney trademark searches. (T19)

**Before more feature code ships (build side):**
6. Wire the live rail: Close opportunity-won webhook (via Ted) + Resend sends we
   own + an enrolment fallback. (N1/T8)
7. Schema generalisation: `metric_value` + `metric_unit` per track. (T20)
8. Label demo/seeded data "Sample data —". (T10)

**Before go-live:**
9. Cassie on the console allowlist; Friday updates → Ted + Cassie. (T13)
10. Backfill consent path for the 30–50 existing students. (T3/T21)
11. Day-90 decision doc: who decides, success metrics 90 days can produce, the
    save definition, attribution split with All Out Sales. (T12/T17/N3)
12. Audited-amendment flow for baseline corrections. (T21)
13. SMS send-time segmentation; write down the T4 contingency ladder. (T4)

**During pilot:** win-card copy translation + disclosure (T16); payment-plan-missed
as a red-flag category for Cassie (T12); Sep–Oct: ACL Rehab template on the new
schema → live demo → founding offer ($397/mo Standard, 12-month lock, PRICING.md
§4); Capital Closer clone after NLS launch (T7/T20).

**Parked until post-pilot:** Hermes/AI agents, WhatsApp (behind SMS), form→template
generator, everything in BUILD_SPEC §10.
