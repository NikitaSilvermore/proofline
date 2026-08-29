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
| 17 | Would a high-ticket coach pay for this? | question | **Yes, but not for compliance — see §3b.** With the caveat that what they will pay *most* for is the thing the proposal treats as a liability: the cohort data. |

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

**Recommendation: sell B, deliver A as its visible output, build towards C** —
⚠ **as a BUILD order only. See §3b: this was wrong as a go-to-market. The
compliance file is never the pitch; retention is.**

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

## 3a. "But the average student makes nothing" (Nikita, same day)

The obvious objection to §2, and the one that decides whether any of this
sells: if a coach's median student gets no result, does making them hold a
typicality figure simply make them unmarketable — and therefore make us
unsellable?

**First, the uncomfortable fact.** The duty already applies. A coach posting
their best students today owes an accurate impression of generally expected
results whether or not anyone measured. *Not* measuring is not a defence; it is
the aggravating fact, because there is then no substantiation at all. We do not
create that exposure. We make it visible — which is a real sales problem and an
honest one.

**Second, the mechanism that saves it: the denominator is chosen in advance.**
"Generally expected results" attaches to the population the ad implies, and
there are legitimate narrowings — *students who completed*, *students who did
the work* — provided the threshold is **declared before outcomes are known** and
applied to everyone who meets it. That is precisely the difference between:

- **cherry-picking** — selecting after you see who won (indefensible), and
- **a criterion** — "completed all twelve weeks", set on day one, applied
  blind (defensible, and far more flattering).

An immutable baseline plus a weekly record is the only way to prove which one
you did. So the sellable, honest claim is not "our students make £50k". It is:

> "Of the 61 students who completed all twelve weeks, the median revenue change
> was £X. 38% saw no change. 12 did not complete."

That number is dramatically better than the raw average, it is defensible
*because* the threshold predates the outcomes, and the ad must carry the
denominator with it — quoting the completer figure while implying the buyer
figure is the trap.

**Third, who this is actually for.** Be blunt in the sales conversation:

- ✅ **Coaches who do get results but cannot prove them.** The largest honest
  segment, and the one Nikita sits inside (NLS, ACL).
- ✅ **Coaches who are already frightened** — an ad account gone, a chargeback
  cluster, a processor reserve, a refund wave.
- ✅ **Coaches raising price, selling to enterprise, or being acquired**, where
  diligence asks these questions and nobody has an answer.
- ❌ **Coaches whose programme genuinely does not work.** No framing fixes this.
  They will not buy, and they must not be reference customers: their failure
  becomes the mark's failure.

**Fourth, the ladder that gets past the fear.** Do not open with earnings.
Adherence is the on-ramp: *"83% of your students were still logging at week
eight"* is a number a decent coach is proud of, carries almost no legal heat,
and works in the health lane where money data does not exist. The outcome record
then accumulates on its own, and the compliance file is the upgrade.

### The rule that has to be in the licence

> **Milestamp never publishes a coach's cohort figure. Only the coach can.**
> We hold it, we produce it to them, and we will confirm it if *they* put it
> forward. Without this in writing, nobody signs — a coach cannot hand their
> failure rate to a third party who might one day publish it.

The mark stays clean without ever publishing anyone's failure rate, via the
enrolment-basis rule in §2: the proof page states the population a claim came
from, and a coach who refuses that does not get the mark.

⚠ For the attorney: whether a pre-declared completer denominator is an accepted
basis for a typicality statement, and how it must be worded in the ad.

---

## 3b. ⚠ SUPERSEDES §3's go-to-market — never sell the breach (Nikita, same day)

Nikita, on the §2/§3a pitch: *"even good coaches who have success rates will be
posting online in breach of what you have outlined. Coming to them and saying
hey if you pay me you can post worse adverts that won't be in breach and pay me
for it will not sell anything. They'll say go away and let me forget you ever
told me I am in breach."*

**He is right, and this kills the pitch, not the product.** The analysis in §2
and §3a stands as *what to build*. It was wrong as *what to say*.

**Why it fails, precisely:**

1. **Compliance is a post-pain purchase.** Nobody buys it before the ban, the
   reserve, the chargeback wave or the letter. Selling it to a coach whose
   marketing is currently working is selling a problem, not a solution.
2. **You become the messenger.** Telling someone they are in breach creates a
   liability *for them* the moment they know — a knowing violation is worse than
   an unknowing one. The rational response is to avoid the person who told them.
3. **The offer, read plainly, is "pay me to make your adverts worse."** Weaker
   claims, more caveats, lower conversion, and a monthly invoice for the
   privilege. No.

### What leads instead

| | Lead | Why it works | Proof it lands |
|---|---|---|---|
| 1 | **Retention** — "fewer of them leave" | Hits the P&L inside 60 days, in numbers they already track. Refunds and drop-offs cost real cash (at NLS a refund also claws back ~$400 of commission). | The retention ledger is already built: drifts flagged / acted on / came back. |
| 2 | **The testimonial engine** — "twenty case studies with real numbers instead of three vague screenshots" | Coaches buy conversion. Captured at the peak, with the figure and the video, automatically. | Win cards, the peak prompt, `/story`, the proof page — all built. |
| 3 | **Compliance** | Only to the already-burned, or where diligence is imposed on them. | The substantiation file. |

**Recommendation: lead 1, show 2, never volunteer 3.**

### Compliance becomes a silent by-product

It still gets built exactly as §2 describes. It is simply never the reason to
buy. At most one line, framed as reassurance rather than diagnosis:

> ✅ "And because it's collected this way — dated, before the outcome, never
> edited — if anyone ever asks you to back a claim up, you just send the link."

Never: *"your current adverts are non-compliant."* Not in a deck, not in a call,
not in a DM. It is true, it is unwelcome, and it is not our business.

### Design consequence: the mark certifies records, not advertising

If the mark required a coach to fix their marketing to qualify, almost nobody
would qualify and the mark would have no market. So:

> **We certify the record behind one named claim, and state the population it
> came from. We do not review, approve, or police anybody's advertising.** What
> the coach puts in their ads is their decision and their exposure.

That keeps us out of the "you're in breach" conversation permanently, and it
keeps us from becoming an unpaid compliance department that inherits liability
for a customer's copy.

### The one segment where compliance leads

They arrive already bleeding — ad account gone, processor holding a reserve, a
chargeback cluster, a lawyer's letter — or they are being pushed into diligence
by someone bigger (an acquisition, an enterprise contract, an affiliate network
demanding substantiation). Narrow, rich, and inbound. Do not chase it; be
findable by it.

### And for the mark itself

A certification mark only becomes valuable when **the student**, not the coach,
starts asking whether a claim is verified. That is demand-side, and it is a
marketing problem rather than a compliance one. Nothing about coach-side fear
gets us there.

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
