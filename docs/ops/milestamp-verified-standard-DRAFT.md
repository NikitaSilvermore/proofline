> **TIER: REFERENCE (DRAFT — PROPOSED, NOT ADOPTED).** A parked standard, not law and not on the v1 build. Decision 2026-07-16: capture it, adopt its *claim discipline* now, but do **not** build the badge or third-party-data integrations until post-pilot (RISK-REGISTER T22). When/if adopted, it graduates into BUILD_SPEC (LAW) or its own SPEC doc.

# "MileStamp Verified" — proposed standard (parked)

Source: [`docs/research/milestones-measurement-verification-report.md`](../research/milestones-measurement-verification-report.md)
(Parts 3–4). This doc exists so the design isn't lost; it is **not** a commitment to
build. Status: **PARKED** — the cheap `verification_level` field rides along with the
T20 schema work; the badge, the evidence-integrations, and the public registry are
post-pilot.

## Why it could matter
The moat framing is "the Carfax of transformation": credibility comes from data pulled
from a system of record the student **cannot easily fake**, not from their assertion.
For an earnings vertical (NLS) under the FTC substantiation regime (T22), a verified,
typicality-contextualised outcome is the difference between a usable claim and a
liability.

## The five-rung verification ladder
Every milestone would carry a `verification_level` (0–4):

- **Rung 0 — pure self-report.** Student ticks it / reports a number. Coaching + triage
  only; never a public claim.
- **Rung 1 — self-report + artefact.** Screenshot, contract, booking confirmation,
  invoice, before/after, PROM form. Partial substantiation.
- **Rung 2 — coach/practitioner attestation.** Named coach (or, in health, a licensed
  clinician) signs off. Note: a coach is a company **insider** — must be labelled if
  surfaced publicly.
- **Rung 3 — third-party system-of-record.** Stripe/processor revenue, CRM/calendar
  bookings, contracts, credit bureau, bank aggregation. "Competent and reliable
  evidence" of the fact. **Minimum for any public claim / badge.**
- **Rung 4 — independently audited / tamper-evident.** Neutral review or a signed,
  tamper-evident record (Open Badges 3.0 model). Highest credibility; the flagship
  registry rung.

Craft milestones → rung 0–2 is fine. Any **payoff** milestone that becomes a
testimonial, win card, or badge → **rung 3 minimum**.

## The 7-point "Verified" standard (draft, veto-able)
A milestone may display the Verified mark only if ALL hold:
1. **Source independence** — corroborated at rung 3+ by a system of record independent
   of the student's unaided assertion.
2. **Immutable baseline** — a day-one baseline for the same metric exists, unaltered.
3. **Evidence retained** — the corroborating artefact/data snapshot stored with
   timestamp + source id, kept ≥3 years (FTC record-keeping horizon).
4. **Typicality context attached** — every publicly surfaced Verified outcome carries
   the cohort denominator + median/range, not just the individual figure.
5. **Material-connection labelling** — coach attestations / incentivised inputs labelled
   as insider / non-independent.
6. **Scope disclosure** — the mark states what was verified and what was **not** (the
   Carfax lesson): e.g. "Verified: $12,000 in Stripe-processed revenue during the
   programme. Not verified: profit, revenue outside Stripe."
7. **Success framing, not earnings promise** — "achieved first paid booking" (with
   disclosure), never "students earn $X."

## Health lane (ACL fork)
Clinical payoff milestones require licensed-practitioner sign-off (rung 2 min, ideally
rung 3 via clinic EMR); use validated PROMs (KOOS/IKDC/ACL-RSI) with MCID thresholds;
keep Milestamp a **progress record, not a medical device or treatment** (a treatment
claim triggers the FTC's higher "competent and reliable scientific evidence" bar +
possible FDA exposure). Add a `requires_clinician_attestation` flag when built.

## What to adopt NOW (vs park)
- **Adopt now (claim discipline):** success/typicality framing on any outcome; never
  imply a result is typical; the consent gate; honest single-story proof (per the
  MINIMAL marketing rule in `docs/marketing/POSTING-KIT.md`).
- **Adopt with schema T20 (cheap):** the `verification_level` enum field + an `evidence`
  table shape — record the rung even before integrations exist.
- **Park (post-pilot, real build):** third-party-data pulls (Stripe/CRM/bureau), the
  public "Verified" badge/mark, and the registry.
