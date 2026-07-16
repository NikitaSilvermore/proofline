# MileStamp — Pricing & Packaging (v1)

*July 2026. Companion to BUILD_SPEC.md and GROWTH_STRATEGY.md; lives in the repo root alongside them. This file is the pricing source of truth. It supersedes every earlier pricing idea discussed anywhere (per-student pricing, student bands, ticket bands, revenue-under-management bands — all rejected, reasons in §0). The **architecture** below is decided. The **specific dollar figures** are founding-era hypotheses: hold them with confidence in the Ted and ACL conversations, pressure-test them in the three external design-partner conversations, and firm them at the day-90 review.*

---

## 0. The law (add to DECISIONS.md verbatim)

> **MileStamp is priced per programme, flat fee, unlimited students. The price never moves when the roster does. Tiers are separated only by delivery richness, celebration art, and access — never by proof integrity, never by student count, never by the customer's revenue or ticket size. The proof engine is whole in every tier. The "Powered by MileStamp" mark is never for sale.**

Why each clause is load-bearing:

- **Never per student.** Headcount pricing creates the deactivate-to-save incentive — documented CoachAccountable user behaviour (their customers deactivate clients to keep the bill down) — and every deactivated student is a hole in the proof record. A product whose entire value is an unbroken evidentiary rail cannot have a pricing structure that ever rewards taking someone off the rail. It also collapses the buyer's mental model to $/head against a 14-year incumbent charging ~$4/head at scale. Disqualified on product grounds before positioning grounds.
- **Never revenue- or ticket-banded.** Ticket size alone mis-sorts operators: $10k × 12 months × 100 students and $2.5k × 3 months × 500 students are the same ~$1M/yr through the rail. Fixing that requires declared revenue, which means audit conversations with counterparties. Faff, refused.
- **Feature tiers instead.** The buyer segments themselves by what they want. Nothing about their business is ever measured, declared, or verified by us. Zero meter, zero audit, zero faff.
- **Proof whole in every tier.** Every P&L claim (refunds defended, renewals armed, testimonials with provenance) runs through baseline + check-ins + flags. A tier missing any part of that can only be sold as a tracker, and trackers price at £9/month (GROWTH_STRATEGY §3). Also: students don't know what tier their operator bought — a degraded student surface degrades the brand exactly where Loops 1 and 2 live (§5).
- **Powered-by never removable.** White-label is the classic top-tier upsell and it amputates Loop 1. The top tier gets *more*, never less-of-us-visible.

---

## 1. The three products

Working names: **MileStamp Core / MileStamp Standard / MileStamp Signature** (naming rationale §5 — Nikita has final veto).

| | **Core** | **Standard** | **Signature** |
|---|---|---|---|
| Monthly | $397 | $797 | $2,497 |
| Annual (2 months free) | $3,970 | $7,970 | $24,970 |
| Job | Catch-net for the price-blocked operator who'd otherwise drift to Skool/Circle | **The business.** Everything we're building. NLS-shaped operators live here | The Hormozi anchor: expect near-zero sales, be fully able to fulfil the rare yes, make Standard look obviously sensible |
| Students | Unlimited | Unlimited | Unlimited |
| Programmes | 1 | 1 | Up to 3 |

All tiers: flat, per programme, **unlimited active students** — said loudly, it's a weapon, not a concession (our incentives genuinely align with the roster growing: every student feeds the win-card loop, the powered-by loop, and the benchmark asset). Fair-use boundary of 1,000 active students per programme, enterprise terms beyond — a whale-guard written once in the contract, never a meter. Annual is the default (matches 12-month programme shapes and the churn-floor doctrine, GROWTH_STRATEGY §1); monthly available at list. Prices in USD.

### In every tier — the proof engine (never gated)

- Immutable day-one baseline (8-step intake + plain-English consent)
- Two-layer milestone rail (shared craft layer + payoff track)
- Weekly 5-question zero-login check-ins via magic links
- Branded student progress page
- Support console: stat strip, needs-attention triage with reasons attached, harvest queue, full roster with RAG filters
- Deterministic RAG flags (BUILD_SPEC §5), nudge actions, testimonial requests, auto-drafted case studies
- Win card on every `milestone_earned` (the *treatment* varies by tier; the existence never does)
- Data export any time + deletion; `/privacy` page; the full consent architecture
- "Powered by MileStamp" mark

### Core — $397/mo

The proof engine, plus: standard template library (the five stock payoff tracks), email delivery (Resend), a single clean win-card treatment, standard support.

### Standard — $797/mo ← where the business lives

Everything in Core, plus everything in the Build Spec + Milestone 9 as built:

- Full stamp-book win-card art system (four treatments, passport shapes, ink/gold laws — design ref `milestamp_stamp_book_reference.html`) and the completion-ceremony stamp book
- Day-one time capsule (the student's own intake words resurfaced at a late milestone)
- Harvest automation — "ask while it's hot" timing on testimonial requests
- SMS delivery; WhatsApp when SMS is proven (already decided: deferred, not dead)
- CRM write-back (Close.io / GHL custom fields)
- Custom milestone architecture configured at onboarding (labels, tracks, thresholds)
- Priority support

**Gating rule of thumb for all future decisions:** Standard-vs-Core separates on the *emotional and visible* layer. Standard must win every demo on sight, so Core stays a catch-net, never a temptation.

### Signature — $2,497/mo (the anchor)

Everything in Standard, plus **access** — expensive-feeling, strictly bounded, one-person-fulfillable:

- Multi-programme: up to three proof rails under one licence
- **Closer's demo kit** — a sanitised live demo environment their sales team can screen-share on calls (Beat 1 of the NLS pitch, productised)
- Milestone-architecture design session at onboarding (one, bounded)
- Quarterly proof review with the founder (four bounded sessions a year — never a standing meeting)
- Direct line
- First-in-line for the verification programme when it exists (early access to the *programme*; the "MileStamp Verified" mark itself stays unprinted until the standard is documented — GROWTH_STRATEGY §3/§4)

**Design constraint:** nothing in this tier may create unbounded founder hours. If a proposed Signature perk is a time-sink, it doesn't ship.

---

## 2. Founding-partner pricing (first 10 customers, incl. NLS + ACL)

- **One rate, not bespoke deals: Standard at $397/mo** — founding partners get Standard at Core's list price. 12-month lock, grandfathered for as long as the subscription is continuous, list price stated in every contract so the discount is visible and the reference point is protected.
- Scarcity is real: NLS + the first 10 external, then it's gone (GROWTH_STRATEGY §6, Phase 1).
- Sweeteners are **lock-length, never lower price** (e.g., an 18-month lock for ACL if needed). §12's own prospect theory: the price at signing is the reference point every renewal is judged against.
- Design partners always pay real money. A £0 pilot sets the reference point at zero and attracts non-buyers.

---

## 3. Ted / All Out Sales — licence terms (heads of terms; solicitor formalises)

- Licence of **MileStamp Standard** for the NLS Mentorship programme
- Fee: **$397/mo founding-partner rate** (list $797 stated in the contract)
- Payment starts **day 90 from go-live** (as agreed); 12-month term from first payment
- Unlimited active students; fair-use 1,000; rate locked and grandfathered
- **Flat — no calendar step, no growth linkage.** A stepped schedule invites negotiation on the schedule; simple closes. Trued up at renewal on actuals, against the list price that's been in the contract since day one. The day-90 free period *is* the scaling ramp: he pays nothing until roughly when the $500k/mo target lands.
- Remains a **separate document** from Makenna's acknowledgment (data, brand, case-study rights, non-replication) — two agreements, two signatories, never collapsed.
- A real monthly fee also gives the non-replication clause genuine commercial substance rather than a peppercorn — flag to the solicitor; their call on drafting.

**Ted's ROI paragraph (his language, commission-denominated — confirmed: refunds claw back commission):**

> Refunds claw back commission — every $10k student who refunds takes $400 back out of All Out Sales' pocket. MileStamp flags the drift weeks before it becomes a refund request, so one saved student a month covers the licence on clawback alone — before counting the metric-backed testimonial stack your closers get, or turning the screen around on a sales call and showing a prospect a real student's page. At the October target — $500k/month collected — the fee is eight basis points of cash and about 2% of your override. It's priced to be invisible at scale, and it doesn't start billing until day 90, when the scale is supposed to have arrived.

Numbers behind it: $500k × 4% = $20k/mo gross to All Out Sales; $397 ≈ 2.0% of the override ≈ 8bps of cash collected; clawback recovery per save = $400 ≈ one month's licence.

---

## 4. ACL Rehab — design-partner offer (Sept–Oct conversation)

- **Product: Standard.** They must experience the full stamp-book/celebration layer — they're proving the health-outcome template and becoming story #2.
- **Rate: the same founding $397/mo, 12-month lock** (18-month lock as the sweetener if needed — never a lower price). *Revises the earlier $199–299 idea: at ~$60k/month net income, price was never their constraint, and one clean founding rate beats bespoke deals.*
- In exchange, contractually: case-study rights (aggregate + consented individual stories), two reference calls, and co-design of the health-outcome template (the `metric_value` / `metric_unit` schema generalisation).
- Their ROI story is **outcomes-shaped, not refunds-shaped**: documented recovery deltas, adherence evidence, and referral-grade proof for physios and surgeons. The public value metric stays "programme revenue under management" precisely so the architecture stretches to health without a rewrite.
- Open input needed: their annual enrolment volume, to write their specific ROI sentence.

---

## 5. Naming notes

- **Never "Lite."** Names set price ceilings (GROWTH_STRATEGY §3); Lite prices like a diet product. Bottom tier is **Core**.
- **Never "Gold."** Collides with the design laws (stamp book: gold = earned, never given). A *purchasable* Gold tier contradicts the product's own gold semantics.
- Top-tier recommendation: **Signature** — ties to the seal/wordmark family, reads as premium without being cute. Alternative if it feels too close to NLS's "Signature talk" milestone: **Private**.
- Working set until vetoed: **Core / Standard / Signature.**

---

## 6. Pricing-page copy skeleton (post-trademark-gate only)

- Hero element: an **ROI calculator** (students × ticket × refund rate → dollars at risk vs. MileStamp cost), not a feature grid. Never publish a price without the maths next to it.
- Core sentence: *"One defended refund pays for months. Two pay for the year."* (at $2–5k tickets, $4,764/yr ≈ 1–2 refunds)
- Standard sentence: *"One $10k refund defended pays for the year — with room to spare."* ($9,564/yr < $10k)
- Signature sentence: *"For operators running proof across multiple programmes, with us in the room."*
- Every tier's card leads with **"Unlimited students, flat fee"** — it's the visible contrast with the per-head incumbent and the transaction-fee community platforms.
- Three tiers, middle anchored as the default choice; Signature exists partly to make Standard look sensible.

---

## 7. Build impact: none before pilot end — guard this

- v1 is single-tenant, hardcoded NLS (BUILD_SPEC §1). **Tiering is packaging and contracts today, not code.**
- The entitlement layer (per-customer feature flags) arrives with multi-tenant — explicitly post-pilot (§10).
- One engineering discipline now: as Milestone 9 features land, keep boundaries clean so a flag can wrap them later. Future flag seams: win-card treatments, harvest automation, SMS delivery, CRM write-back, multi-programme.
- If tier design starts generating build tasks before the pilot ends, that is scope creep in a pricing costume. Default answer: after the pilot.
- **Trademark gate:** the public pricing page is public material — nothing ships before UKIPO/USPTO clearance and the attorney knockout (the Milestone 9b hard block). Design-partner conversations are private and unaffected.

---

## 8. Market intel behind these numbers (July 2026 snapshot)

**The 2025 platform shakeout — durability is now a buying criterion.** Three coaching platforms died in 2025: Nudge Coach; Practice.do (shut 3 Nov 2025 after raising $10M — acquisition fell through); Profi (shut 31 Dec 2025; ~$8M raised; no customer data export existed, which became a scandal). Buyers now weigh platform sustainability alongside features, and bootstrapped/profitable reads as safer than VC-funded. Implications: strike Practice from the GROWTH_STRATEGY §11 map; MileStamp's export-before-first-student rule (BUILD_SPEC §7) is now a sales asset, not just ethics; expect the "you're one person — will you exist in a year?" objection and answer it with the licence terms, the export promise, and delivery running on the operator's own CRM rails. CoachAccountable absorbed much of the refugee traffic — the eventual head-to-head is most likely them.

**Competitor pricing (verified July 2026).** CoachAccountable: $20/mo entry scaling to ~$4/active client ($400/mo at 100 clients, $4,000/mo at 1,000); users report deactivating clients to control cost. Flat-fee coach-admin: Paperbell $57/mo ($47.50 annual), Delenta $29–49, Satori $33, Upcoach $29 — the tracker shelf; never be compared to it. ScoreApp (owns the intake moment; §11's one-to-watch): $39 / $99 / $149/mo, Enterprise from $799 — raised prices up to 25% in March 2025 and grandfathered existing customers; its $799 enterprise tier proves an adjacent operator-economics tool already commands ~$800/mo. Skool: $9/mo Hobby (10% transaction fee) / $99 Pro (2.9%) since July 2025 — the budget anchor in the buyer's head got cheaper at the door. Circle: $89 / $199/mo annual plus stacking add-ons. Testimonial harvesters (proof without provenance): Senja $29–59/mo, Testimonial.to ~$50+/mo — cheap is the point; MileStamp sells provenance, not collection.

**Pricing-model climate.** Hybrid and value-based pricing dominate 2026 B2B SaaS; pure per-seat is in visible decline; outcome-based is fashionable (roughly half of SaaS companies exploring, under 10% fully implemented). Outcome-based (% of saves) stays **rejected here for now**: save definitions don't exist until the day-90 decision document, attribution is already contested with All Out Sales, and a %-of-saves price hands the counterparty a permanent audit lever. Revisit post-pilot only as an optional success-fee *layer*, never the base. Market tolerates increases when value ships (SaaS pricing rose ~11% in 2025) — the stamp book and win-card launches are future re-price moments; founding partners stay grandfathered.

**Regulatory tailwind — confirmed, with teeth.** FTC Consumer Reviews and Testimonials Rule in force since Oct 2024; enforcement warning letters went out Dec 2025. Jan 2025: FTC proposed expanding the Business Opportunity Rule to "money-making opportunities" explicitly including business coaching, plus a new Earnings Claim Rule (rulemaking paused under a regulatory-freeze EO; enforcement under Section 5 continues regardless). 2026 enforcement directly in our ICP category: the Publishing.com action — a ~$2k course/coaching offer charged over unsubstantiated earnings claims, testimonials secretly written by employees/relatives or incentivised, and **refunds conditioned on positive testimonials**. Governing doctrine: testimonials are *typicality* claims — substantiate that the result is typical, or disclose generally expected results; a disclaimer that contradicts the net impression is treated as ineffective. Product consequences (already in the backlog, now validated): win-card redesign away from earnings claims with a light typicality disclosure on every card; delete the sandbagging intake copy (an understated baseline inflates the delta — a substantiation problem, not just data hygiene). Positioning rule: MileStamp sells **provenance and substantiation**; it never claims to make anyone "FTC compliant" — that's a lawyer's claim, and claims language goes into the solicitor review.

---

## 9. Open questions

1. Tier names — confirm or veto Core / Standard / Signature.
2. ~~Does NLS claw back commission on refunds?~~ **Confirmed yes** — reflected in Ted's ROI paragraph.
3. ACL annual enrolment volume — needed for their specific ROI sentence.
4. Signature price point ($2,497 = ~3× Standard) — anchor honestly today; revisit toward a larger multiple once 2–3 logos and case studies exist.
5. Closer's demo kit: ships as a Signature feature, and separately consider a MileStamp-owned version as a Loop 5 sales asset for the closer network — post-pilot decision.
6. Day-90 decision document to include: pilot-validated pricing review (do the founding numbers survive contact with the three external design-partner conversations?).

---

*Repo note (2026-07-11): this file arrived from the external pricing engagement. Its companion GROWTH_STRATEGY.md is an external document from that engagement and is NOT in this repo; BUILD_SPEC.md is. Where this file conflicts with anything earlier (including the £99/£33 pricing in RISK-REGISTER.md's history), THIS file wins — see DECISIONS.md 2026-07-11 (pricing).*
