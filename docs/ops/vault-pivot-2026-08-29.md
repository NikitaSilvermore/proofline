> **TIER: REFERENCE** — analysis of a strategy proposal, with rulings. Not law.
> Prices stay as PRICING.md states them. Nothing here is legal advice; the
> FTC/CMA points listed as ⚠ are for the attorney booked under Milestone 9b.

# The vault pivot — verify the wins, not the roster (2026-08-29)

Nikita brought a proposal (drafted with another AI) to stop positioning
Milestamp as an auditor of a coach's whole roster, and instead sell verification
of the individual case studies a coach already markets with. This is the
granular pass over it: **every extractable claim, one line each, with a ruling**.

**The one-line answer: yes, coaches will pay for this — but not for the reason
the proposal gives.** Verifying individual testimonials fixes *falsity*. It does
not fix *typicality*, which is the leg that actually catches info-product
sellers. The thing worth paying for is the file that answers both, and only
someone holding the whole cohort's baselines can produce it.

---

## 1. The granular pass

| # | Claim in the proposal | Tag | Ruling |
|---|---|---|---|
| 1 | Course completion rates run ~5–15%; success rates lower | market | **Accept as directional.** Widely cited, poorly sourced, varies enormously by price point and format. Do not put a number in marketing without a citation we can defend. |
| 2 | A model that forces a coach to broadcast a 10% success rate kills their business | market | **Accept.** No coach will buy a product whose output is a public grade of them. This is the correct read of why "audit the roster" fails commercially. |
| 3 | The industry's failure rate is the market opportunity | strategy | **Accept, with a twist.** The opportunity is not that everyone fails — it is that nobody can *prove* the ones who didn't. |
| 4 | Measure individual Verified Milestone Case Studies, not institutional performance | model | **Accept as the unit of sale.** It matches what is already built: verification attaches to a milestone, not to a programme. |
| 5 | We are not an accreditation university grading the coach | positioning | **Accept.** Also matches the standing rule: *certify method, not outcome* — notary, not auditor. |
| 6 | Position as an Independent Evidence Vault for their best wins | positioning | **Accept as the entry product**, not as the whole business. A vault is a service; the mark is the asset. Sell the vault, build towards the mark. |
| 7 | A coach doesn't need 100% success — only that the testimonials they publish are 100% real | legal | ⚠ **Correct this. It is the load-bearing error.** A *truthful* testimonial of an *atypical* result is still deceptive under the FTC Endorsement Guides unless the ad conveys the generally expected result. "Real" is necessary and not sufficient. |
| 8 | Pitch: "I'm here to legally lock down your top 20 testimonials" | sales | **Use the shape, fix the promise.** Say *substantiation file*, never *legal shield*. Promising a legal outcome is itself a claim we would have to substantiate. |
| 9 | Coaches pay to track an active case-study cohort, or individual winners, rather than everyone | model | ⚠ **Accept only with the enrolment basis disclosed.** If the coach picks who gets a baseline, selection happens *before* the record starts and the moat is gone. Hard rule below. |
| 10 | Fear: Meta/Google ban coaching ads because claims can't be verified | market | **Half true, and do not sell it.** Ad platforms have no intake for third-party verification and will not lift a ban because we vouch. Bans are policy-driven and appealed in-platform. |
| 11 | Fear: Stripe/PayPal hold 20–50% in reserves over refunds and lack of delivery proof | market | **Real, and partly addressable.** Reserves are risk-priced, not evidence-priced — but engagement and delivery records are exactly what wins *chargeback representment*. Sell that, precisely. |
| 12 | Fear: agencies fine info-businesses over unverified earnings and health claims | legal | **Accept — this is the sharp one.** Earnings claims and health transformations are the two categories under active scrutiny on both sides of the Atlantic. |
| 13 | Deliverable: a "Verified Asset Safe Link" to send to Stripe or Facebook | product | **Build the link (it exists: `/v/[code]`), drop the word "Safe".** Frame: *here is the contemporaneous record behind this claim*, not *here is your immunity*. |
| 14 | The console shows where students drop off (e.g. 40% stall at week 3) | product | **Already built** — retention ledger, at-risk register, drift caught / acted on / came back. This is the existing $797 argument, unchanged. |
| 15 | Market the platform as a Churn Prevention & Success System | positioning | **Accept as the buying reason for the console.** It is the half of the product a coach uses weekly; verification is the half they use quarterly. |
| 16 | New angle: not "we prove how many of your students fail" | messaging | **Accept.** Nothing we publish should ever be a scorecard of a coach. |
| 17 | Would a high-ticket coach pay for this? | question | **Yes — see §3.** With the caveat that what they will pay *most* for is the thing the proposal treats as a liability: the cohort data. |

---

## 2. The correction that changes the business

The proposal treats the roster as the problem to be hidden. It is the product.

**Typicality is a separate legal requirement from truth.** An advertiser using a
testimonial must convey the results consumers can generally expect. A disclaimer
along the lines of "results not typical" has not been an accepted cure since the
Guides were revised in 2009. So a coach who publishes twenty individually
verified wins and nothing else is still exposed — arguably *more* exposed, since
they now look diligent.

Producing an honest typicality figure requires exactly one thing: **an
unaltered, before-the-outcome baseline for everyone who enrolled, not just the
winners.** That is what this product already collects and nobody else has.

So the sellable file is two documents, not one:

1. **The published claim** — the verified case study, at a rung, with its scope
   disclosure. Public, at `/v/[code]`.
2. **The private substantiation file** — the cohort figure behind the claim,
   held ready and produced when a regulator, processor or platform asks.

The second one never gets published. It is not a grade. It is the answer to the
question the coach currently cannot answer at all, and it is worth more than the
first.

### The hard rule that keeps the mark credible

> **Every public proof page states the enrolment basis.** "Verified from a
> cohort of 12 athletes selected by the programme" is honest and sellable.
> "Verified across all 140 athletes enrolled in 2026" is worth far more, and
> that difference is the upgrade path. A mark that hides which one it is
> collapses the first time somebody asks how the twenty were chosen.

This is a small addition to the scope disclosure already in
`src/lib/verification.ts` (`scopeDisclosure()`), not a new subsystem.

---

## 3. Three products, and what each is worth

| | **A · The Vault** | **B · The Compliance File** | **C · The Mark** |
|---|---|---|---|
| What the coach buys | Verification of named case studies | A standing substantiation file: verified wins **plus** the cohort figure behind them | A public certification mark on their marketing |
| Unit | Per case study, or a pack | Per programme, monthly | Licence + audit |
| Who it answers | Trolls, screenshotters | Regulators, processors, chargebacks, due diligence | The buying public |
| Effort | Low — it's built | Medium — needs whole-roster enrolment + a cohort report | High — trademark, standard, adoption |
| Price it supports | Low hundreds, transactional | **The $797 tier, and above** | Whatever adoption earns |
| Weakness | A service, not a moat; easy to copy | Requires the coach to enrol everyone, which is the harder sell | Slow; worthless until adopted |

**Recommendation: sell B, deliver A as its visible output, build towards C.**

A alone is a nice service that anyone with a Notion template can imitate within a
quarter. B is defensible because it requires the baseline discipline nobody else
has, and it is the only one of the three that answers the question that actually
costs coaches money. A is what B looks like from the outside, so nothing is
wasted — the vault *is* the shop window.

### What to say, and what not to

- ✅ "When someone asks you to prove that testimonial, you send a link."
- ✅ "You'll have the typicality number ready, instead of hoping nobody asks."
- ✅ "It shows you where people stall, so fewer of them leave." (the console)
- ❌ "This protects you legally." — a legal-outcome promise, and not ours to make.
- ❌ "Send this to Meta and they'll unban you." — they will not.
- ❌ Anything that implies we vouch for the coach's *programme* rather than for
  the record behind one named claim.

---

## 4. What this changes in the build

Nothing is urgent, and nothing here overrides PRICING.md.

- ⬜ **Enrolment basis on the proof page** — extend `scopeDisclosure()` and
  `/v/[code]` to state the cohort the claim came from. Small, and it is the
  difference between a credible mark and a press liability.
- ⬜ **The cohort report** — a private, dated PDF/page per programme: enrolled,
  completed, the distribution of outcomes. This is product B and it does not
  exist yet.
- ⬜ **Chargeback pack** — the delivery-and-engagement evidence for one athlete,
  exportable. Answers the Stripe fear precisely, unlike the "safe link".
- ⚠ **For the attorney (add to the Milestone 9b brief):** typicality disclosure
  duties for a service that packages other people's testimonials; whether
  Milestamp carries any facilitation exposure for claims its customers publish;
  and the certification-mark registration route already logged.
- 🔗 Related: [verification-business-2026-08-29.md](verification-business-2026-08-29.md) ·
  [milestamp-verified-standard-DRAFT.md](milestamp-verified-standard-DRAFT.md) ·
  RISK-REGISTER T22 (FTC exposure) · [value-gap-2026-08-29.md](value-gap-2026-08-29.md)
