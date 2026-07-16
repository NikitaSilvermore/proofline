> **TIER: REFERENCE** — deep-research report (Milestamp project-chat output, 2026-07-16). Evidence + recommendations, NOT decisions or design law. ⚠ Raises real schema (verification ladder / evidence table) + FTC/marketing decisions — see `docs/ops/research-triage-2026-07-16.md`.

# MileStamp Deep Research Report: Milestones, Measurement, and Verification for High-Ticket Coaching Programs

## TL;DR
- **Milestones work best when split into a shared craft spine (coach-confirmable behaviours and skills) and a per-student payoff track (outcomes that carry public claims and therefore need artefacts or third-party data).** The single most important design decision MileStamp faces is not *what* to measure but *how each milestone is verified* — because the FTC's post-2024 regime makes unsubstantiated outcome claims a civil-penalty risk (Publishing.com's principals paid $1.5M and are now permanently required to substantiate future earnings claims).
- **Build verification as an explicit five-rung ladder** (self-report → self-report + artefact → coach/practitioner attestation → third-party system-of-record → independently audited) and store a `verification_level` on every milestone plus a dedicated evidence/artefact table. Craft milestones can sit at rung 0–2; any payoff milestone that will ever appear in a testimonial, win card, or "MileStamp Verified" badge must reach rung 3+.
- **The financial/"make-money-online" verticals (NLS paid-speaker, Capital Closer, agency/FBA/publishing) are simultaneously the highest-value and highest-legal-risk, and their outcomes are the *most* verifiable** (Stripe, contracts, calendar/CRM). Health (ACL Rehab) is verifiable but regulated — it needs clinician sign-off and must avoid medical-device/treatment-claim territory. Relationship/dating and confidence-type outcomes are the *least* verifiable and should never anchor a public claim.

---

## Key Findings

**1. The craft/payoff split MileStamp already uses is strongly supported by measurement science.** The distinction maps almost exactly onto the leading-indicator/lagging-indicator and learning-goal/performance-goal literatures. Craft milestones are *leading indicators* (behaviours and inputs the student controls: pitches sent, reels published, calls made, rehab sessions completed). Payoff milestones are *lagging indicators* (outcomes the student only partly controls: first paid gig, fee target, return-to-sport, revenue). This is the same architecture the sales industry uses ("activity metrics are leading indicators of future pipeline; outcome metrics are lagging indicators of past performance") and that ICF/PwC coaching-ROI guidance uses (behavioural shifts appear at 4–6 months; financial/retention results require 12+ months).

**2. Leading indicators are what you coach on; lagging indicators are what you claim on.** Because leading indicators are self-controlled and appear early, they are ideal for the weekly check-in, red/amber/green triage, and the goal-gradient motivation effect (people accelerate as a visible goal nears — Hull 1932; the mechanism behind progress bars). Because lagging indicators are the ones prospects care about and regulators scrutinise, they are the ones that must be verified before they leave the platform as a claim.

**3. Self-report is adequate for coaching/triage but not for public claims.** The evidence on self-report bias is more nuanced than folklore suggests — one rigorous study of 331 chronic-disease self-management participants found change scores were *not* meaningfully biased by social desirability. But the risks that matter for MileStamp are specific and real: sandbagged baselines (students under-report at intake to make progress look bigger), survivorship bias in programme outcome claims (only winners get quoted), and regression to the mean in confidence scores. MileStamp's existing mitigations — immutable day-one baseline, identical weekly wording, trend-based rather than point-in-time flags — are the correct, literature-backed countermeasures.

**4. The FTC regime is the binding constraint on the entire product.** Three things matter: (a) the Consumer Reviews and Testimonials Rule (16 CFR Part 465, effective 21 October 2024) makes fake/false reviews and testimonials civil-penalty offences — in December 2025 warning letters the FTC cautioned that continued violations "may result in civil penalties of up to $53,088 per violation"; (b) the Publishing.com final order (July 2026, $1.5M, Commission vote 2-0) shows the FTC actively pursuing a MileStamp-adjacent ICP — the FTC alleged CEO Christian Mikkelsen told consumers they could "copy the EXACT system hundreds of my students use to make $1k to $3k a month in passive income" while "most consumers…never achieved the income the company promised," and the order now requires the company and its principals to substantiate earnings claims with "competent and reliable evidence" and disclose incentivised/insider endorsements; (c) the proposed Business Opportunity Rule expansion (January 2025) would define "business coaching opportunity" as "any program, plan, or product that is represented to train or teach a person how to establish or operate a business" and require written substantiation of earnings claims — squarely covering NLS, Capital Closer, and FBA/publishing clients. BCP Director Christopher Mufarrige framed the Publishing.com action as advancing "the Commission's priority of protecting American workers," aligned with the FTC's Joint Labor Task Force launched by Chairman Andrew Ferguson in February 2025. The proposed Biz Opp rule's fate is uncertain under current FTC leadership (a regulatory freeze and 3-2 partisan vote), so MileStamp should design to the *stricter* standard regardless.

**5. Verified-outcome registries already work in adjacent markets — and their failure modes are instructive.** Stripe-verified revenue (Indie Hackers), Carfax, and Open Badges/Credly all show the same pattern: credibility comes from pulling data from a system of record the subject cannot easily fake, not from the subject's assertion. Carfax's known weakness — it only shows events someone reported to it — is precisely the weakness a "MileStamp Verified" registry will inherit, and must disclose.

---

## Details

### Part 1 — Milestone taxonomy across the main coaching/expert verticals

Below, "craft layer" = shared skill/behaviour spine (leading indicators, coach-confirmable); "payoff layer" = personal outcome track (lagging indicators, claim-bearing). "Verification rung" refers to the ladder in Part 3.

**1.1 Speaker / stage-monetisation coaching (NLS-type).**
- *Craft (leading):* Baseline set → signature talk locked → speaker reel/assets live → pitch cadence established (industry benchmark: ~150 targeted contacts/month producing ~10–15 conversations and 1–2 bookings) → first booking → first talk delivered.
- *Payoff (lagging):* First paid gig → consistent booking rhythm (e.g. 3 stages/month) → fee target hit.
- *Metric units:* count (pitches, reels, bookings), currency (fee, £/$), events/month (booking rhythm).
- *Verifiability:* HIGH for bookings/fees (contracts, booking confirmations, eSpeakers/CRM, payment processor). Reels and pitches are self-reportable but artefact-backable (published URL, sent-email count).
- *Time to first result:* Associations plan 12–18 months ahead; realistic first *paid* gig in a 12-month programme is a mid-programme, not early, milestone.
- *FTC risk:* HIGH (earnings/fee claims).

**1.2 Business / entrepreneurship coaching (revenue, clients, launches).**
- *Craft:* Offer defined → pricing set → funnel/assets live → outreach cadence → first sales conversation.
- *Payoff:* First client → first $X revenue → consistent monthly revenue → revenue target.
- *Units:* currency (revenue, MRR), count (clients, calls).
- *Verifiability:* HIGH — Stripe/payment processor, invoices, contracts.
- *FTC risk:* HIGH (earnings claims; likely covered by proposed Biz Opp expansion).

**1.3 Sales training / closer academies (Capital Closer-type).**
- *Craft:* Script/framework learned → role-play reps completed (AI-roleplay research shows front-loaded practice cuts ramp ~37–40%) → first live call → first demo.
- *Payoff:* First close → consistent quota attainment (industry: sustainable productivity = consistently ≥80% of quota) → commission/earnings target.
- *Units:* count (calls, demos, closes), currency (commission), percentage (quota attainment).
- *Timeframes:* Median SDR ramp ~3.2 months to 80% of booked-meeting quota (Bridge Group 2024); AE first close typically months 2–3 (SMB) to 3–4 (mid-market); full quota 4–6 months.
- *Verifiability:* MEDIUM-HIGH — CRM data, commission statements (but often employer-owned data the student may not be able to share).
- *FTC risk:* HIGH (earnings claims).

**1.4 Health / rehab / physio outcome programmes (ACL Rehab-type).**
- *Craft:* Baseline assessment → phase progressions (range-of-motion, strength) → return-to-sport testing battery.
- *Payoff:* Clinical milestones — limb symmetry index ≥90% (most commonly reported functional criterion), IKDC and KOOS thresholds, ACL-RSI psychological readiness, return to sport.
- *Units:* degrees (flexion/ROM), kg or %LSI (strength), PROM points (KOOS 0–100, IKDC 0–100), pain scale (NPRS 0–10).
- *Key benchmarks (from clinical literature):* IKDC ≥85.6 or KOOS ≥89 gave a 95% probability of returning to sport at pre-injury level in one cohort; other protocols require IKDC ≥90, KOOS-Sport >90%, ACL-RSI ≥65 (some require 90). Return before 6 months carried a ~5x re-injury risk vs 8–12 months.
- *MCID (minimal clinically important difference):* the smallest change a patient perceives as beneficial (Jaeschke, Singer & Guyatt 1989 — "the smallest difference in score…which patients perceive as beneficial and which would mandate…a change in the patient's management"). For IKDC after ACL reconstruction, MCID ≈ 7.1–16.2 points (anchor-based) / 7.6–10.5 (distribution-based); KOOS subscale MCID commonly ~8–10 points. **These are context-specific ranges, not fixed numbers** — the same instrument has yielded MCIDs from ~1.8 to ~25.9 points depending on method.
- *Verifiability:* HIGH but REGULATED — needs practitioner/clinician sign-off; MileStamp must stay in the "progress record" lane and avoid making medical/treatment claims that would put it in medical-device or health-claim territory (which triggers the FTC's higher "competent and reliable scientific evidence" standard).
- *FTC risk:* HIGH if health outcomes are claimed in marketing; MEDIUM if kept as internal progress records with clinician attestation.

**1.5 Fitness / weight-loss / body-transformation coaching.**
- *Craft:* Baseline → nutrition/training plan set → adherence tracking (steps, sessions, food logging) → habit consistency.
- *Payoff:* Weight/body-composition change, measurements, strength PRs.
- *Units:* kg/lb, cm/inches (waist), %body-fat, reps/load.
- *Timeframes/benchmarks:* Realistic ~0.5–1 kg/week; ~12% body-weight loss over 12 weeks reported in intensive coaching contexts. For context clients may cite: in the STEP 1 semaglutide trial (Wilding et al., NEJM 2021), mean body-weight change to week 68 was −14.9% with semaglutide vs −2.4% with placebo, with 50.5% achieving ≥15% loss vs 4.9% on placebo — trial-grade results that real-world coaching will rarely match. First-month weight loss predicts longer-term loss; adherence commonly drops after weeks 4–6.
- *Verifiability:* MEDIUM — scale/photo self-report is easily gamed; smart-scale or clinician weigh-in raises rung. Before/after photos are testimonial gold but the FTC treats them as claims requiring typicality disclosure.
- *FTC risk:* HIGH (health + body-transformation claims are heavily enforced; NordicTrack precedent).

**1.6 Executive / leadership / career coaching.**
- *Craft:* 360/baseline assessment → development goals → behavioural practice → stakeholder feedback loop.
- *Payoff:* Promotion, role change, comp increase, 360-score delta, retention.
- *Units:* events (promotion=binary), currency (comp), score deltas (360, competency frameworks).
- *Verifiability:* MEDIUM — promotions/comp verifiable via offer letter/LinkedIn but privacy-sensitive; 360 deltas are defensible internal measures. ICF guidance stresses locking outcome metrics with the sponsor *before* coaching begins to support causal attribution.
- *FTC risk:* LOW-MEDIUM (usually B2B, fewer consumer earnings claims).

**1.7 Relationship / dating coaching.**
- *Craft:* Profile/approach skills → conversation practice → first date secured.
- *Payoff:* Relationship formed, dates/month, subjective satisfaction.
- *Units:* count (dates, matches), 1–10 satisfaction.
- *Verifiability:* LOW — almost entirely self-report and subjective; screenshots are weak and privacy-fraught.
- *FTC risk:* MEDIUM (testimonials still covered; "results" claims hard to substantiate). **Recommendation: never anchor a public/verified claim on this vertical; use craft milestones + confidence trend only.**

**1.8 Financial coaching (debt payoff, savings, credit).**
- *Craft:* Baseline financial snapshot → budget built → automatic-savings set up → debt plan.
- *Payoff:* Credit-score increase, debt reduction, savings balance.
- *Units:* credit-score points, currency (debt, savings).
- *Benchmarks (best available RCT evidence):* The Urban Institute/CFPB randomised evaluation of financial coaching (Theodos et al. 2015; the field's first RCT, N=945 at Branches in Miami and The Financial Clinic in NYC) found the treatment group at The Financial Clinic increased account balances by $1,187 and credit scores by 21 points relative to control (33 points among those who actually took up coaching); at Branches the treatment group reduced debt by $10,644 relative to control. Effects were site-specific and not uniformly significant — a useful, honest illustration that even well-run programmes produce heterogeneous results.
- *Verifiability:* HIGH — credit-bureau pull, bank-balance data, Plaid-style integration.
- *FTC risk:* MEDIUM-HIGH (financial outcome claims).

**1.9 Agency/freelancer growth & e-commerce/Amazon FBA/publishing "make money online".**
- *Craft:* Niche/offer → store/portfolio live → traffic/outreach → first listing/pitch.
- *Payoff:* First sale, monthly revenue, profit.
- *Units:* currency (revenue, profit), count (clients, sales).
- *Reality check:* Median monthly revenue across 5,079 Stripe-verified indie projects was $169 — half made less than that, and only 48 projects (0.9%) cleared >$10K/month revenue with >50%/month growth (Indie Hackers/TrustMRR analysis). This is the survivorship-bias reality that makes typicality disclosures essential.
- *Verifiability:* HIGH — Stripe, Amazon Seller/marketplace dashboards.
- *FTC risk:* HIGHEST — this is the exact profile of Publishing.com, DK Automation, and the proposed Biz Opp Rule expansion.

### Part 2 — How to measure milestones effectively and causally

**2.1 Goal design: combine specific outcome goals with learning goals, and let students self-generate them.** The goal-setting literature is not the simple "SMART goals win" story often assumed. When a task exceeds someone's current ability (true of most coaching students early on), *learning goals* outperform specific performance goals (Locke & Latham 2019), because performance pressure suppresses exploration of strategy. For novel/creative work, "do-your-best" and open goals performed no worse than SMART goals in controlled studies, and goals are most effective when self-generated and self-referenced to one's own trajectory. **Implication for MileStamp:** craft milestones should be framed as learning/behavioural goals early; payoff milestones as specific outcome goals later. The immutable baseline makes every goal self-referenced, which the literature says is optimal.

**2.2 Use the goal-gradient effect deliberately.** Visible progress toward a near goal increases effort (Hull 1932; the documented mechanism behind progress bars and completion meters). MileStamp's two-layer rail and student progress page are well-designed for this; the design lever is to always show the *nearest* upcoming milestone prominently.

**2.3 Borrow the right outcome-measurement frameworks:**
- *Kirkpatrick's four levels* (Reaction → Learning → Behaviour → Results, 1959; New World revision) map cleanly: weekly confidence/win = Reaction/Learning; craft milestones = Behaviour; payoff milestones = Results. Kirkpatrick's core teaching — plan backward from Level 4 Results — argues MileStamp should define the payoff milestone first and derive the craft spine from it.
- *Clinical PROMs and MCID* give MileStamp a rigorous template for non-monetary verticals: define a baseline, a validated instrument, and a *minimum meaningful change* threshold rather than celebrating any movement.
- *OKRs* supply the leading/lagging pairing (key results = lagging; initiatives = leading).
- *ICF/PwC ROI guidance* supplies the honest-attribution playbook: lock metrics with the sponsor before starting; expect behavioural change at 4–6 months and financial results at 12+ months; treat survey-only data as *input signal, not outcome*.

**2.4 Self-report reliability — design mitigations MileStamp should keep/add:**
- Keep identical weekly wording (prevents instrument drift).
- Keep the immutable baseline (prevents retrospective baseline inflation; counters sandbagging only if the baseline is captured before the student is incentivised to look bad — so capture it at intake, which MileStamp does).
- Use trend-based flags, not single-week reads (counters regression to the mean in the 1–10 confidence score).
- Add a random-responding / straight-lining check (EMA best practice: detect inconsistent responses via standard-deviation across items).
- Flag survivorship bias explicitly in any aggregate claim: report denominators (how many students, not just how many succeeded).

**2.5 Causal attribution — what MileStamp can and cannot honestly claim.** Without RCTs (which coaching businesses will not run), MileStamp cannot claim the programme *caused* an outcome, because motivated students self-select into paid programmes (selection effect). What is defensible:
- *Within-student before/after* (baseline vs current) — honest if framed as "change during the programme," not "change caused by the programme."
- *Cohort comparisons* (this cohort vs prior cohorts) — stronger, still not causal.
- *Named, dated, verified individual outcomes* with typicality context — the FTC-safe path.
The honest public claim format is: "Among [N] students who completed the programme, [X] achieved [milestone]; typical results were [median/range]," never "students earn $Y."

**2.6 Check-in cadence and question design.** Ecological momentary assessment research is directly applicable to the weekly magic-link check-in:
- Median EMA adherence is >80% in well-designed studies; early adherence strongly predicts long-run adherence — so onboarding the first 1–2 check-ins matters most.
- SMS prompts outperformed email; repeat/auditory reminders raised response rates (one trial: 60% vs 40%).
- Longer schedules with fewer prompts can outperform dense short bursts; reward changes did *not* reliably move response rates — so MileStamp should not over-invest in incentives and should instead minimise burden (5 questions, zero login is the right instinct).
- Keep the count + value + 1–10 confidence + free-text win + blocker-chip structure; it balances quantitative trend data with qualitative case-study fuel.

### Part 3 — Verification depth: the evidence ladder (core framework)

**The MileStamp Verification Ladder.** Every milestone should carry a `verification_level` (0–4). Higher rungs cost friction, buy credibility and FTC-substantiation value.

- **Rung 0 — Pure self-report.** Student ticks the milestone or reports a number in the check-in. *Friction:* none. *Credibility:* low. *FTC value:* none (cannot substantiate a public claim). *Use for:* craft milestones used only for coaching/triage.
- **Rung 1 — Self-report + artefact upload.** Student uploads a screenshot, contract, booking confirmation, invoice, before/after photo, or PROM form. *Friction:* low. *Credibility:* medium (artefacts can be faked/cherry-picked). *FTC value:* partial — supports "reasonable basis" if the artefact is genuine and retained. *Use for:* payoff milestones not yet ready for a public badge.
- **Rung 2 — Coach/practitioner attestation.** A named coach (or, in health, a licensed clinician) signs off that they witnessed/verified the milestone. *Friction:* low-medium. *Credibility:* medium-high for craft; for health, clinician sign-off is the appropriate standard. *FTC value:* medium; note the insider-endorsement disclosure rule (a coach is a company insider — their attestation is not independent and must be labelled as such if surfaced publicly).
- **Rung 3 — Third-party system-of-record corroboration.** Data pulled from an independent source the student cannot easily fake: Stripe/payment-processor revenue, calendar/CRM booking data, eSpeakers/contract records, credit-bureau pull, bank aggregation (Plaid). *Friction:* medium (integration/OAuth). *Credibility:* high. *FTC value:* HIGH — this is "competent and reliable evidence" of the fact of the outcome. *Use for:* any payoff milestone that will appear in a testimonial, win card, or Verified badge.
- **Rung 4 — Independently audited/attested.** A neutral third party (or MileStamp acting under a documented, consistently applied standard) reviews the source data and issues a signed, tamper-evident record — analogous to ISO/certification audits, clinical outcome registries, or cryptographically signed Open Badges 3.0 (which embed issuer, criteria, evidence, and a signature that invalidates on tampering). *Friction:* high. *Credibility:* highest. *FTC value:* highest. *Use for:* the flagship "MileStamp Verified" registry entries.

**Precedents studied and what transfers:**
- *Stripe-verified revenue (Indie Hackers):* read-only OAuth into the processor; MRR normalised across plans (annual plans normalised, one-off charges separated). Transfers directly as rung 3 for revenue verticals. Lesson: verification only covers what flows through the connected account (PayPal/wire revenue is missed) — disclose scope.
- *Carfax:* aggregates from 100,000+ reporting sources; trusted because data comes from parties other than the seller. Directly analogous to "MileStamp Verified." Known limit — only shows *reported* events — must be disclosed ("absence of a verified milestone is not proof it didn't happen").
- *Open Badges / Credly:* metadata (issuer, criteria, evidence, dates) baked into a cryptographically verifiable credential; Open Badges 3.0 is a W3C Verifiable Credential, signature-checkable without contacting the issuer. Transfers as the technical model for tamper-evident Verified records at rung 4.
- *TrustMRR/Stripe-verified datasets:* enabled honest base rates (median $169/mo across 5,079 projects) — the antidote to survivorship bias and the raw material for typicality disclosures.

**Verification level appropriate per milestone type:** craft milestones → rung 0–2 (coach-confirmed is fine); payoff milestones carrying public claims → rung 3 minimum; anything earning a "MileStamp Verified" badge or feeding an earnings/results testimonial → rung 3–4 with a retained evidence record and typicality disclosure.

**Health-vertical specifics (ACL Rehab):** outcomes are clinical, so (a) require licensed-practitioner sign-off (rung 2 minimum, ideally rung 3 via clinic EMR data), (b) keep MileStamp positioned as a *progress-record and adherence tool*, not a medical device or treatment — avoid any claim that the programme diagnoses, treats, or produces a clinical outcome, which would trigger the FTC's "competent and reliable scientific evidence" (RCT-adjacent) bar and potential FDA/medical-claims exposure, and (c) use validated PROMs (KOOS/IKDC/ACL-RSI) with MCID thresholds rather than ad-hoc scores.

### Part 4 — FTC substantiation and the "MileStamp Verified" standard

**What the FTC expects.** For any objective/earnings/results claim, the advertiser must hold a "reasonable basis" consisting of "competent and reliable evidence" *before* the claim is made (FTC Advertising Substantiation Policy Statement). Earnings claims are treated as *typicality* claims — a "$10k first month" testimonial implies a typical consumer can expect that, so the advertiser must either substantiate that most achieve it or clearly and conspicuously disclose generally-expected results. Health claims face a higher "competent and reliable scientific evidence" standard. The Testimonials Rule (16 CFR Part 465) additionally bans fake/insider testimonials and requires disclosure of material connections.

**Draft "MileStamp Verified" standard (recommended, veto-able).** A milestone may display the Verified mark only if ALL of the following hold:
1. **Source independence:** the underlying fact is corroborated at rung 3+ by a system of record independent of the student's unaided assertion (payment processor, CRM/calendar, contract, credit bureau, or licensed-clinician record).
2. **Immutable baseline:** a day-one baseline for the same metric exists and is unaltered.
3. **Evidence retained:** the corroborating artefact/data snapshot is stored with a timestamp and source identifier, retained for at least the FTC record-keeping horizon the proposed rules contemplate (the Biz Opp/Earnings proposals contemplate multi-year retention; use 3 years minimum).
4. **Typicality context attached:** every Verified outcome that is surfaced publicly carries the cohort denominator and median/range, not just the individual figure.
5. **Material-connection labelling:** coach attestations and any incentivised inputs are labelled as insider/non-independent.
6. **Scope disclosure:** the mark states what was verified and what was not (Carfax lesson) — e.g. "Verified: $12,000 in Stripe-processed revenue during the programme. Not verified: profit, revenue outside Stripe."
7. **Success framing, not earnings promise:** win cards use success/typicality framing ("achieved first paid booking," with disclosure) rather than earnings promises — the redesign already underway is the correct direction.

This standard is defensible as substantiation because it rests on independent competent-and-reliable evidence, retains it, and pairs every figure with typicality context — the three things the Publishing.com order and the Substantiation Policy Statement demand.

### Part 5 — NLS / Forbes Factor implementation

**Speaking-industry proof artefacts (what verifiable evidence actually exists):**
- *First paid gig / fee:* signed speaker contract or engagement agreement; payment-processor or invoice record; eSpeakers/CRM booking record. Bureau commissions typically run 20–30% of fee (a $10k gig → $2.5–3k commission), so gross fee vs net take-home should be captured separately.
- *Booking rhythm ("3 stages/month"):* calendar/CRM confirmed-status events; eSpeakers EventCX pipeline; the industry distinguishes lead/hold/confirmed statuses — verify on *confirmed*.
- *Assets live:* published URLs (reel on YouTube/Vimeo, eSpeakers profile live, LinkedIn presence) — rung 1 artefacts, auto-checkable.

**NLS's five tracks ranked by verifiability, with recommended `metric_unit`:**
1. **Paid speaker — STRONGEST.** `metric_value` = fee, `metric_unit` = currency; plus count (confirmed bookings) and events/month. Verify at rung 3 (contract + payment + calendar).
2. **Win clients — STRONG.** `metric_value` = contract value/revenue, `metric_unit` = currency; count (clients signed). Rung 3 (Stripe/invoice/contract).
3. **Sell programme — STRONG.** `metric_value` = programme revenue, `metric_unit` = currency; count (enrolments). Rung 3 (processor).
4. **Raise funds — MEDIUM.** `metric_value` = amount raised, `metric_unit` = currency. Verifiable via bank/deal docs but often confidential/lumpy; rung 2–3, expect delays and privacy limits.
5. **Grow audience — WEAKEST (verifiable count, weak causal link to income).** `metric_value` = followers/subscribers/email list, `metric_unit` = count. Easy to verify at rung 1–3 (platform screenshots/API) but the FTC Testimonials Rule specifically bans fake social-media indicators, and audience size is a poor proxy for the monetisation outcome NLS sells — so treat it as a craft/leading indicator, not a payoff claim.

**Leading indicators that predict speaking success (what the industry says to coach on):** targeted outbound volume (~150 contacts/month → ~1–2 bookings is the industry math), a strong reel (planners decide in <2 minutes of video; open with the strongest 10 seconds), specific positioning/topic titles that match planner search language, consistent LinkedIn/YouTube publishing (1–2x/week), a live calendar that lets planners see availability, and follow-up discipline. These are all rung 0–1 craft milestones MileStamp can capture in the weekly check-in (pitches sent, reels published, follow-ups).

**Recommended NLS milestone rail (craft spine + paid-speaker payoff), with measurement method and verification rung:**

| Milestone | Layer | Measure | Method | Rung |
|---|---|---|---|---|
| Baseline set | Craft | intake snapshot | check-in | 0 (immutable) |
| Signature talk locked | Craft | binary | coach attestation | 2 |
| Speaker reel + profile live | Craft | published URLs | auto URL check | 1 |
| Pitch cadence established | Craft | pitches/week (count) | weekly check-in | 0 |
| First booking (unpaid or paid) | Craft→payoff | booking confirmed | calendar/contract | 3 |
| First talk delivered | Craft | binary + date | contract/photo/agenda | 1–2 |
| First paid gig | Payoff | fee (currency) | contract + payment | 3 |
| Consistent booking rhythm (3/mo) | Payoff | confirmed events/month | calendar/CRM | 3 |
| Fee target hit | Payoff | fee (currency) | contract + payment | 3 |

### Part 6 — Per-vertical reference table

| Vertical | Craft milestones (leading) | Payoff milestones (lagging) | Metric units | Verification rung (payoff) | FTC risk |
|---|---|---|---|---|---|
| Speaker/stage (NLS) | talk locked, reel live, pitch cadence, first booking | first paid gig, 3 stages/mo, fee target | currency, count, events/mo | 3 | HIGH |
| Business/entrepreneurship | offer, pricing, funnel, first sales convo | first client, first $X, revenue target | currency, count | 3 | HIGH |
| Sales/closer (Capital Closer) | framework, role-plays, first call/demo | first close, ≥80% quota, commission target | count, currency, % | 2–3 (employer data limits) | HIGH |
| Health/rehab (ACL) | ROM/strength phases, RTS test battery | LSI ≥90%, IKDC/KOOS thresholds, RTS | degrees, kg/%LSI, PROM points | 2–3 clinician sign-off | HIGH (regulated) |
| Fitness/weight-loss | plan set, adherence, habit consistency | weight/body-comp change, PRs | kg/lb, cm/in, %BF | 1–3 (smart-scale/clinician) | HIGH |
| Executive/leadership | 360 baseline, dev goals, feedback loop | promotion, comp increase, 360 delta | events, currency, score delta | 2–3 | LOW-MED |
| Relationship/dating | profile, conversation practice, first date | relationship, dates/mo, satisfaction | count, 1–10 | 0–1 (do not claim publicly) | MED |
| Financial | budget, auto-savings, debt plan | credit-score +pts, debt −$, savings +$ | credit pts, currency | 3 (bureau/bank) | MED-HIGH |
| Agency/FBA/publishing | niche/offer, store live, outreach | first sale, monthly revenue, profit | currency, count | 3 (Stripe/marketplace) | HIGHEST |

---

## Recommendations

**1. Adopt the five-rung verification ladder as a first-class data model.** Add `verification_level` (0–4) to every milestone and a separate `evidence` table (fields: milestone_id, evidence_type, source, artefact_url/hash, captured_at, verifier_identity, scope_note). This is the single most important schema change and everything else depends on it. *(Schema change beyond metric_value/metric_unit — flagged.)*

**2. Generalise the metric schema now, and add units beyond currency.** `metric_value` + `metric_unit` must support at least: currency, count, events/period, percentage, degrees (ROM), kg/lb, cm/in, PROM points (0–100), credit-score points, and binary events (promotion). Store `metric_unit` as an enum plus a free-text label for edge cases.

**3. Gate the "MileStamp Verified" badge on rung 3+ and the seven-point standard in Part 4.** Do not let any rung 0–2 milestone earn the public mark. Document this standard publicly and early — it is both a legal shield and the core moat ("the Carfax of transformation" only works if the standard is credible and consistently applied).

**4. Redesign win cards to success/typicality framing (continue the work already started).** Every publicly surfaced outcome must carry (a) cohort denominator + median/range and (b) a material-connection label where relevant. Ban raw earnings promises. This directly tracks the Publishing.com order.

**5. Treat health (ACL Rehab) as a separate compliance lane.** Require clinician sign-off for clinical payoff milestones; use validated PROMs (KOOS/IKDC/ACL-RSI) with MCID thresholds; keep MileStamp positioned as a progress record, not a medical device or treatment; add a `requires_clinician_attestation` flag on health milestones. *(Schema change — flagged.)*

**6. Coach on leading indicators, claim on verified lagging indicators.** Configure red/amber/green triage on craft-layer trends (pitch cadence, adherence, confidence trend), and reserve verification friction (rung 3 integrations) for the payoff milestones that will leave the platform as claims.

**7. Optimise the weekly check-in per EMA evidence.** Use SMS (not just email) magic links, add a gentle reminder, keep it to 5 questions/zero login, and invest heavily in nailing the *first two* check-ins (early adherence predicts long-run adherence). Add a straight-lining/consistency check to protect data honesty.

**8. Build the base-rate/typicality engine as a feature, not an afterthought.** Because you hold verified cohort data, you can generate honest denominators automatically — turning the FTC's biggest requirement (typicality disclosure) into a defensible product feature and a differentiator versus programmes that can't prove their numbers.

**Thresholds that would change these recommendations:** If the FTC's proposed Business Opportunity Rule expansion is *finalised* (currently frozen/uncertain), rung 3 verification and written earnings substantiation move from "best practice" to legally mandatory for NLS/Capital Closer/FBA clients — raise the default gate accordingly. If a design partner's data source has no API (e.g. a bureau that won't integrate), fall back to rung 1 artefact + rung 2 attestation and *label the badge's scope honestly* rather than overclaiming.

---

## Caveats

- **Evidence quality varies sharply by vertical.** Financial, sales, business, and speaker-fee outcomes have strong, verifiable, system-of-record data. Relationship/dating and pure-confidence outcomes are weakly verifiable and should never anchor a public claim — be unhedged about this with clients.
- **Coaching-ROI statistics are self-selected and self-reported.** The widely cited ICF/PwC "5–7x ROI" and "86% positive ROI" figures come from surveys of people who *chose* coaching and estimate their own financial impact; treat them as directional, not causal, and do not repeat them as MileStamp claims.
- **MCID and clinical thresholds are context-specific ranges, not universal constants.** Cite them as ranges tied to the specific ACL-reconstruction literature; the same instrument yields very different MCIDs by method and population.
- **The proposed Biz Opp Rule expansion is not in force and its future is uncertain** (regulatory freeze, 3-2 partisan vote, dissenting incoming leadership). Design to the stricter standard anyway, but do not describe it as current law.
- **Verified ≠ complete (the Carfax problem).** Any registry only reflects what was reported/connected; absence of a verified milestone is not proof it didn't happen, and revenue outside a connected processor is invisible. Disclose scope on every badge.
- **Some sourced figures come from vendor/marketing content** (eSpeakers, sales-enablement vendors, coaching-ROI pages) and should be read as industry-directional rather than peer-reviewed; the clinical (NEJM, PubMed), FTC, EMA, and Urban Institute/CFPB figures are from primary/academic/government sources and are the ones safe to lean on hardest.