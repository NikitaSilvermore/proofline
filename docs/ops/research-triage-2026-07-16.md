> **TIER: BRAIN** — a worklist of open decisions distilled from two research reports; dated, may drift. Not itself law; each item becomes law/spec only when Nikita rules and it's written into the governing doc named.

# Research triage — 2026-07-16

Two deep-research reports landed from the Milestamp project chat (both in
`docs/research/`, REFERENCE tier):

- **[sensory-design-report.md](../research/sensory-design-report.md)** — how to make
  the app *feel* like a $10k programme (gold rendering, depth, motion/ceremony,
  sound, haptics, celebration, peak-end + ethics).
- **[milestones-measurement-verification-report.md](../research/milestones-measurement-verification-report.md)**
  — craft/payoff milestones, self-report validity, the FTC regime, a five-rung
  verification ladder, a draft "MileStamp Verified" standard, per-vertical taxonomy,
  NLS implementation.

Reports are **evidence, not decisions**. Below are the concrete calls they raise,
grouped by where a decision would land. **Nothing here is actioned** — each needs
Nikita's ruling first.

## A. Schema / BUILD_SPEC — ✅ DESIGN LOCKED 2026-07-16 (build gated; DECISIONS.md 2026-07-16)

Ruling (Nikita): **design + record only** — no SQL/code changed; build is a gated
milestone under T20. **NLS-lean unit set.** Full design in
[DECISIONS.md](../DECISIONS.md) 2026-07-16. In brief:

1. ✅ **DESIGNED — `verification_level` (0–4) on `milestones`** (the claim-bearing
   object; check-ins are inherently rung 0). Cheap half of the parked Verified work.
2. ✅ **DESIGNED — `evidence` table** (milestone_id, evidence_type, source,
   artefact_url/hash, captured_at, verifier_identity, scope_note) + its RLS.
3. ✅ **DESIGNED — metric generalisation:** `checkins.value_confirmed` →
   `metric_value` + `metric_unit`; `milestones` gain the same pair. `metric_unit` =
   free text (no DB enum → no future migration), canonical NLS-lean set
   **currency · count · events_per_month · percentage** + free-text label; health/
   finance units added to the app list when ACL/finance need them. Extends T20.
4. ➡ **CARRIED to the ACL fork** — `requires_clinician_attestation` is milestamp-acl's
   schema, not this repo.

⬜ **Build remains:** apply the additive columns + evidence table (idempotent
`schema.sql`, no deploy) and the `value_confirmed→metric_value` rename (ripples through
rag/progress/console/seed + the frozen graph's data source; **deploys — Nikita's call**).

## B. FTC / legal / marketing — ✅ RULED 2026-07-16 (walked through with Nikita)

5. ✅ **DONE — FTC threat added to [RISK-REGISTER.md](../RISK-REGISTER.md) as T22**
   (Testimonials Rule 16 CFR 465, Publishing.com $1.5M order, proposed Biz Opp Rule).
6. ✅ **RULED — marketing disclosure = MINIMAL** (Nikita's call): consent
   (`public_optin`) + no false/misleading claims, per-post judgement — no mandatory
   typicality boilerplate yet. The fuller cohort-denominator + median/range format is
   **documented as the escalation** to switch on before scaled/paid proof marketing.
   Written into `docs/marketing/POSTING-KIT.md`. ⚠ *Judgment call logged: Claude
   flagged Minimal as light for an earnings vertical; Nikita chose it — the escalation
   is one edit away.*
7. ✅ **RULED — "MileStamp Verified" PARKED** as a documented standard →
   [`milestamp-verified-standard-DRAFT.md`](milestamp-verified-standard-DRAFT.md).
   Adopt its claim discipline now; `verification_level` field rides with schema group A
   (T20); badge + integrations are post-pilot. Not built in v1.
8. ⬜ **CARRIED to the Makenna one-pager** — the Ted agreement already routes
   "case-study and testimonial rights" to that paper (clause D) and treats
   refund/payment gains as joint (clause 7.2). The one-pager (still to draft) must add:
   grant to publish verified outcomes with student consent + commit published claims to
   the typicality standard. Flagged in RISK-REGISTER T22(d) + strike-order.

## C. Sensory / design — ⚠ proposals against a FROZEN surface

9. **The frozen line holds.** Several top recs (animate the gold rail fill, pulse the
   current milestone, re-render gold as metal, stamp-down ceremony) would touch the
   **student progress page + revenue graph, which are frozen** ("do NOT restyle
   without being asked" — Nikita, twice). Treat every progress-page/graph rec as a
   *proposal that needs explicit go*, not a to-do.
10. **Safe-to-explore now (don't touch the frozen graph):** gold-gradient rendering as
    a token, reduced-motion tokens, the **console calm-down** (strip ceremony — it's
    not frozen), sound system design (default-OFF), haptics as Android-only
    enhancement. *Sensory report Recommendations "Stage 1".*
11. **Ethics/brand line** (gold = earned/immutable, never celebrate the company's
    milestone — the Robinhood confetti precedent) aligns with existing law; worth
    lifting into BUILD_SPEC §1-adjacent copy when the ceremony work is scoped.

## D. Naming
12. **Both reports spell it "MileStamp" (capital S).** Feeds the open "MileStamp vs
    Milestamp" spelling question to settle before the trademark filing (recent commit).

## Suggested order (for when Nikita rules)
Schema decisions (A) gate the verification product; FTC (B) gates any public proof
marketing and should be ruled before the first proof post; sensory Stage-1 items (C10)
are safe parallel polish; the frozen-graph recs (C9) wait for an explicit design go.
