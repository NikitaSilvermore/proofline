# Claude Design prompt — Milestamp for NLS Mentorship

> **TIER: REFERENCE** — a brief, not law. BUILD_SPEC.md and DECISIONS.md still govern.
>
> **How to use:** pick ONE direction (§2), delete the other two, then paste from
> "THE BRIEF" down into Claude Design. Iterate from what comes back.
>
> Written 2026-08-29, after the same exercise produced the ACL fork's build in a
> single pass. **Read §1 before choosing — the NLS situation is NOT the ACL
> situation, and the honest recommendation here is more cautious.**

---

## 1. Read this first: what is genuinely at stake

The ACL fork had no design worth protecting, so a clean redesign was free. NLS
is different in three ways, and they should shape the decision:

1. **You already like what is there.** Midnight & Brass landed after a lighter
   version fell flat, and your words were "I f***ing love it". Replacing a
   design that works is a real cost, not a neutral move.
2. **The sensory pass already shipped** (DECISIONS.md 2026-07-16): gold-as-metal,
   the stamp-impression on lock and check-in, confetti retired for gold-leaf,
   and the console deliberately **calmed** rather than dramatised. Any new
   direction has to carry those rulings forward or consciously overturn them.
3. **This one is white-label.** ACL Rehab Online is one skin; the warm four are
   next. Whatever is built here must survive having someone else's name on it.

**The one genuine weakness of the current look:** a dark ground with glowing
gold stat cards is the single most common aesthetic that AI design tools emit.
Midnight & Brass is a *good* version of it, but it lives in a crowded room. If
you want the "nobody could guess which tool made this" quality that the ACL
build got, the fix is not a new palette — it is **craft that a generator does
not reach for**: print, letterpress, foil, real typographic hierarchy.

---

## 2. Choose a direction (delete the other two)

### Direction A — THE MARQUEE *(recommended for student surfaces)*
Keep the dark ground you already like, but replace the glowing-dashboard
vocabulary with **theatre print**: letterpress playbills, gold-leaf marquee
lettering, ruled show-bill typography, the student's name set as the headline
act. References: pre-war theatre bills, Glyndebourne and Wigmore Hall
programmes, letterpress fight posters, gold-blocked book spines.
*Strength:* thematically exact — this is a product about getting on stages —
and it keeps what you love while fixing the one thing that dates it. The
existing gold-as-metal work carries straight over.
*Risk:* playbill pastiche if the typography is anything less than excellent.

### Direction B — THE HOUSE ACCOUNT *(the bigger swing)*
A private bank's ledger: heavy ivory stock, ruled money columns, engraved
numerals, an embossed crest, ink not light. The subject is money earned from a
stage, and nothing reads "expensive" faster than a private-bank statement.
References: Coutts and C. Hoare & Co. stationery, share certificates, engraved
banknote guilloche, Aesop and Smythson packaging.
*Strength:* the most credible "this costs $797 a month" material there is, and
it makes the numbers the hero honestly.
*Risk:* a full reversal from dark to light. Discards the look you already
approved, and the ceremony work would need re-tuning for a paper ground.

### Direction C — MIDNIGHT & BRASS, HELD
Change nothing. Spend the effort on the parked sensory Stage 3 and on the
un-styled progress page + graph work instead.
*Strength:* zero risk, and there is real unfinished work already queued.
*Risk:* it stays in the crowded room.

> **Recommendation: A for the student surfaces; the console stays the calm
> instrument it was already ruled to be; borrow B's ledger discipline for the
> numerals only** (tabular figures, ruled columns, engraved weight). That
> preserves everything you approved, honours the sensory rulings, and fixes the
> one thing that makes the current page guessable. **If you would rather not
> touch it at all, C is a legitimate answer — say so and this stays in the
> drawer.**

---

# THE BRIEF

Design the product interface for **Milestamp**, used under the brand
**NLS Mentorship**. It is a private accountability and proof companion for
speakers and coaches building a business from the stage.

This is a **product UI, not a marketing site.** Do not design a landing page.

## The white-label rule — this shapes everything

Students must only ever see **NLS Mentorship**. Milestamp appears once, as a
quiet "Powered by Milestamp" in the footer. NLS is the first of several
programmes that will run on this system, so **design a shell, not a skin**: one
brand block (name, monogram, single accent colour) that can be swapped for the
next coaching business without touching structure, type scale or layout. If a
decision only works because the brand is called NLS, it is the wrong decision.

## Who uses it and what it is actually for

A twelve-month programme. Students learn a craft — the signature talk, the
speaker assets, getting booked — and then convert stages into a living.

The insight the product exists for: **you cannot see your own progress while
you are inside it.** A speaker who has gone from unpaid to two bookings a month
still feels like a beginner, because the change happened across dozens of
forgettable weeks. Money is the one thing that cannot be argued with, so the
product keeps the receipts and shows them back.

Two audiences, two moods:
- **The student** — ambitious, a little impostor-ridden, easily discouraged by
  a quiet month. Needs proof, ceremony, and a reason to keep filing the week.
- **The NLS support team** — scanning ~100 students on a Monday to decide who
  gets a phone call. Needs calm, dense, unemotional clarity. **This screen was
  deliberately ruled CALM: no glow, no ceremony, no stamps landing. The
  contrast between a ceremonial student page and a clinical console is itself
  the quality signal — preserve it.**

## What the product does

1. A one-time **baseline** is stamped at enrolment — where the student is
   starting from, in numbers and in their own words. It locks permanently and
   can never be edited. That irreversibility is the emotional heart.
2. Every week, a **45-second check-in**: stages pitched, value confirmed,
   stage confidence, the win, the blocker.
3. Their **progress page** turns that into the story: what the stage has
   returned so far, confidence climbing, milestones earned, wins dated.
4. A **console** shows the team everyone at once, flagged red / amber / green,
   with a queue of fresh wins worth asking about.

## The hard design problem — the unit is not always money

The schema now carries `metric_value` **and** `metric_unit`, because the five
tracks do not share a currency:

| Track | What the stage converts into | Unit |
|---|---|---|
| Get paid to speak | fees | currency |
| Win clients | clients closed | count |
| Sell my programme | revenue | currency |
| Raise funds | pledges | currency |
| Grow my audience | new followers / reach | count or percentage |

Canonical units: `currency` · `count` · `events_per_month` · `percentage`.

**So the hero figure has to carry a unit that changes between students without
ever looking like a bug or a placeholder.** "$8,700" and "14 clients" and "3
events a month" must each look native and deliberate in the same slot. Solve
this properly — it is the single most load-bearing detail in the layout.

## Design the innovation, not just the skin

Take at least three of these seriously:

- **The billing.** The student's name and what they are working toward should
  be set like the top of a show bill, not like a profile header. Their page
  should feel issued to them.
- **The takings should read as a ledger, not a chart.** Each confirmed booking
  is a dated line with a figure — evidence, in order. Keep a tally as well,
  but the proof is the list.
- **Confidence is the leading indicator, and should be treated as one.**
  Stage confidence moves weeks before the money does; a student whose
  confidence is climbing while the figure is flat is winning and does not know
  it. Do not bury it as a secondary stat.
- **The immutable before.** The baseline in the student's own words, quoted
  back at the foot of the page a year later, next to what changed.
- **The quiet weeks stay visible.** A month with nothing booked is part of the
  record, not something to hide.
- **Proof-grade surfaces.** Some of these screens become marketing. Any screen
  a student might screenshot as proof needs its results-are-not-typical line to
  be part of the design, not an afterthought bolted on later.

## Rulings you must honour (already decided — do not quietly overturn)

- **Gold means earned and immutable. Never decorative.** It marks things that
  cannot be taken back.
- **One-shot sheen on the earning moment only** — never a constant shimmer.
- **The stamp-impression is the celebration**, at baseline lock and at each
  check-in: approach, impact, ink-spread, settle. Generic confetti is retired;
  slow gold-leaf flecks are reserved for rare payoff milestones.
- **Reduced motion removes the movement, not the stamp.** The stamp still
  appears — it is proof, which is essential information, not decoration.
- **The "this cannot be edited later" line lands AT the peak of the lock**, not
  in the small print.
- **Never celebrate the company's milestone, only the student's.**
- The console is **calm**: instant state changes, hairline structure, mono
  data, whitespace. No glow, no ceremony.

## Hard constraints — the anti-generic list

Do NOT use: violet/indigo gradients · glassmorphism · Inter, Poppins,
Montserrat or Space Grotesk · a centred hero above three rounded feature cards ·
**glowing stat cards** · gradient-filled text · emoji or stock icon sets ·
sparkle motifs · decorative bento grids · drop shadows as ornament · uniform
rounded cards stacked down a column · lorem ipsum or invented placeholder copy.

Do instead: real typographic hierarchy with a display face that has character ·
tabular figures for every number · hairlines and edges rather than shadows ·
deliberate asymmetry · generous negative space · one restrained accent used
sparingly · motion with mass that settles once and never rebounds.

Use only fonts available from Google Fonts so the design renders. Strong
non-default choices: Playfair Display is overused — prefer Bodoni Moda,
Instrument Serif, Fraunces, Libre Caslon Display, Newsreader, Redaction
(display); Instrument Sans, Public Sans, Libre Franklin (text); IBM Plex Mono,
JetBrains Mono, Martian Mono (figures).

## Use this real content — do not invent copy

Student: **Jordan Ellis**, month 3 of 12, track "Get paid to speak".
Baseline: **$6,400/month**, **0 paid gigs** in the last twelve months, stage
confidence **4/10**, twelve-month target **$20,000/month**, biggest blocker
"Finding stages". Now: **$8,700 confirmed from the stage** across nine weekly
check-ins, confidence **8/10**, five of eight milestones earned.

Baseline, in their own words:
*"I've spoken free twice and loved every second — but I've never been paid for it."*

Milestone rail, in order: Baseline set · Signature talk locked · Speaker assets
live · First booking · First talk delivered · First paid gig · Consistent
booking rhythm · Fee target hit.

Real logged wins, with their weeks:
- W04 — *"First paid gig — $1,200 summit breakout!"*
- W06 — *"Tampa chamber keynote — $2,500 at full fee."*
- W08 — *"Second $2,500 booking confirmed."*
- W09 — *"Third keynote booked — the rhythm is building."*

Console reasons, verbatim product strings: "3 missed check-ins" · "Confidence
dropped 8 to 3 in two weeks" · "Intake incomplete, day 9 — refund window" ·
"No stages pitched in 3 weeks" · "Renewal conversation ready — numbers
attached".

Footer on every student surface: **Powered by Milestamp**.

## Screens to design

1. **The progress page** — mobile first, then desktop. The takings, confidence,
   the milestone rail, the wins, the baseline quoted back. This is the screen
   that has to be beautiful, and the one a student screenshots.
2. **One baseline intake step** — a single question, full screen, unhurried.
3. **The moment the baseline locks** — the stamp being struck, with the
   immutability line as the peak. The emotional high point of the product.
4. **The weekly check-in** — one question at a time, 45 seconds total.
5. **The team console** — ~100 students, scannable in thirty seconds, reds
   first. Calm and clinical by ruling.
6. **A specimen sheet** — type scale, palette with hex values, the milestone
   stamp set, motion notes, and **the brand block that gets swapped per
   programme**, shown once as NLS and once as a generic second coach.

## The bar

A student should want to screenshot their page and send it to someone. The team
should be able to run a Monday from the console without thinking about it. And
nobody should be able to guess which tool made either.
