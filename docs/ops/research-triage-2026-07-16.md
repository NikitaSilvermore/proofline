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

## A. Schema / BUILD_SPEC (LAW) — needs a spec decision, not a tweak

1. **Verification ladder as a first-class field.** Add `verification_level` (0–4) to
   every milestone (0 self-report → 4 independently audited). *Source: Verification
   report Part 3.* — This is bigger than the `metric_value`/`metric_unit`
   generalisation already on the roadmap.
2. **Evidence table.** A dedicated `evidence` table (milestone_id, evidence_type,
   source, artefact_url/hash, captured_at, verifier_identity, scope_note). *Part 3 +
   Rec 1.*
3. **Generalise `metric_unit` beyond currency** — enum covering currency · count ·
   events/period · percentage · degrees (ROM) · kg/lb · cm/in · PROM points (0–100) ·
   credit-score points · binary, plus a free-text label. *Rec 2.* — extends the
   roadmap's schema-generalisation item.
4. **Health lane flag.** A `requires_clinician_attestation` flag on health milestones
   (ACL). *Rec 5.* — belongs with the milestamp-acl fork's schema, not necessarily NLS.

## B. FTC / legal / marketing — real exposure, likely a RISK-REGISTER + PRICING/legal call

5. **Add an FTC unsubstantiated-claims threat to [RISK-REGISTER.md](../RISK-REGISTER.md).**
   The Testimonials Rule (16 CFR 465, live since Oct 2024), the Publishing.com $1.5M
   order against a *MileStamp-adjacent* ICP, and the proposed Biz Opp Rule make
   outcome claims a civil-penalty risk. *Verification report Key Finding 4.* — propose
   a new threat entry; Nikita's ruling to add.
6. **Marketing captions must carry typicality disclosure.** Any "proof" post with an
   earnings/results figure needs cohort denominator + median/range, never "students
   earn $Y." Reinforces (does not replace) the existing consent hard-rule in
   `docs/marketing/POSTING-KIT.md`. *Rec 4 + Part 4.*
7. **Draft "MileStamp Verified" standard** (7-point, rung 3+ gated). A new product
   concept — where it lives (BUILD_SPEC? a new spec doc?) is Nikita's call. *Part 4.*
8. **Case-study/claim rights** intersect the Ted/Makenna papers — verified-outcome
   rights + who can publish what. Cross-check against `docs/legal/`.

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
