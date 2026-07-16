> **TIER: REFERENCE** — deep-research report (Milestamp project-chat output, 2026-07-16). Evidence + recommendations, NOT decisions or design law. ⚠ Several recs touch the FROZEN student progress page + revenue graph — do not act on those without Nikita's explicit go. Open decisions distilled in `docs/ops/research-triage-2026-07-16.md`.

# MileStamp Sensory Design: How to Make a Web App Feel Like a $10k Programme

## TL;DR
- **Build the feeling from restraint, weight, and craft — not effects.** Your palette and metaphors are already right; the premium signal comes from how gold is *rendered* (metal, never flat yellow), how motion *settles* (spring physics with soft landings, not bounce), and how celebration reads as *earned ceremony* rather than slot-machine confetti. The signature stamp-impression moment is your single highest-leverage upgrade.
- **On the three "physical" channels, be honest: motion carries almost all the weight, sound is a deliberate opt-in, and haptics is a graceful-degradation bonus.** iOS Safari exposes no Vibration API in any version, so haptics will only fire for your Android/Chrome minority; sound must be default-OFF (browsers block autoplay anyway) with a beautiful unlock moment; motion works everywhere and is where you should invest.
- **Anchor every sensory peak to a real, immutable achievement (peak-end rule), and never manufacture one.** The ethics line is also the brand line: gold = earned, ceremonies mark facts that "can't be edited later." That constraint is what separates you from Duolingo — and from Robinhood, whose confetti became a regulatory liability.

## Key Findings

1. **Premium ≠ decorated. Premium = restrained + crafted microstates.** The recurring lesson from Stripe, Linear, and Vercel is that perceived quality lives in the states most teams ignore (hover, focus, active, disabled, loading, empty) and in disciplined restraint of colour, not in ornamentation. Copy the *process*, not hex values.
2. **Flat gold looks cheap for a physical, verifiable reason.** Real gold reads as gold because it tints its *specular reflection* — a moving highlight. A single flat fill has no highlight, so the eye reads "yellow," not "metal." You must simulate the highlight with a multi-stop gradient and, ideally, a slow-moving sheen.
3. **A trust/proof brand should lean tactile-paper + institutional depth, not glassmorphism.** Glassmorphism reads "futuristic consumer tech" and has real contrast/legibility problems; letterpress/emboss, grain, and hairline-plus-tinted-shadow depth read "document, ledger, passport." That matches "passport office crossed with a private bank."
4. **The Web Vibration API is unsupported on iOS Safari — full stop.** Per MDN/caniuse, `navigator.vibrate()` is supported in Chrome 30+, Edge 79+, Opera 17+, and Samsung Internet/Android Browser 4.4+, while "Safari does not support the Vibration API on macOS, iPadOS, or iOS in any version" (and Firefox 129 removed it in 2024); global support sits around 77% as of mid-2026. Since your students arrive via magic links on phones and a large share are on iPhones, haptics is a progressive enhancement, never a load-bearing part of a ceremony.
5. **Browsers block audio autoplay; UI sound must be unlocked by a user gesture.** This is actually a gift: it forces sound to be opt-in, which is best practice anyway. The right pattern is default-OFF with a single, tasteful "turn sound on" moment.
6. **Apple's own audio-haptic design rests on three principles — Causality, Harmony, Utility — and the Apple Pay confirmation is "two simple taps" sharing the same tempo as a clean, two-tone chime.** These principles are your blueprint for the stamp-down moment.
7. **Generic confetti now reads as cheap because it's everywhere and rarely earned.** The fix isn't a fancier confetti — it's tying the celebration to the user's real milestone and making the *mechanism itself* (the stamp landing) the reward.
8. **The peak-end rule means a few well-designed peaks and endings outweigh uniform polish** — but the same literature warns that celebrating the *company's* milestone (or a fake one) backfires and reads as manipulation.

## Details

### 1. Colour & material — rendering gold as earned metal

**Why flat gold fails.** In physical reality, metals tint their specular reflection: a gold surface throws a yellowish *highlight* that moves as the object or light moves. A flat `#C6A15B` fill has no highlight and no movement, so the visual system classifies it as "a yellow rectangle," not "gold." The print world proves the same point from the other side: a "flat gold" CMYK print looks like "a flat, yellowish-brown colour," which is exactly why luxury stationery pays for *foil stamping* or metallic Pantone inks — and why **raised foil**, which "stands up slightly so it catches light," reads as more premium than flat foil. Screens can't emboss, but they can fake the highlight.

**How to render your gold.** Never paint gold as a single value. Use a multi-stop linear gradient that runs dark→light→dark so a bright band sits in the middle, simulating a specular highlight. A strong, restrained recipe built from *your* tokens:

- **Static "earned" gold surface (stamps, seals, medal fills):**
  `linear-gradient(135deg, #A8863F 0%, #C6A15B 35%, #F3EAD8 50%, #C6A15B 65%, #A8863F 100%)`
  The `#F3EAD8` soft-gold band is the highlight; the `#A8863F` deep-gold ends are the shadowed edges. This is the on-screen equivalent of the "dark ends → light centre" gold recipe that designers use precisely because it "creates an illusion of light reflecting off" the surface.
- **Gold text (milestone titles, earned counts):** use `background-clip: text` with the same gradient and `-webkit-text-fill-color: transparent`. This is crisp at any DPI, selectable, screen-reader-readable, and ~50 bytes vs a PNG.
- **The "moment of earning" sheen sweep:** on the instant a gold stamp lands, run a one-shot diagonal white-to-transparent highlight across it (`background-clip`/surface, animate `background-position` once, ~600–900ms). Reserve this animated sheen for the earning moment — a *continuously* shimmering gold everywhere reads as cheap and busy. A slow, once-per-earn glint reads as "light catching real metal."

**Discipline: gold = earned, never given.** Keep this semantic ironclad in code (a single `--gold-earned` token used only on earned states). The restraint *is* the luxury signal — Stripe/Linear-type interfaces read as confident precisely because they don't spray accent colour on everything.

**Dark-surface convention.** Your deep navy inks (`#0E1A2B`, `#16263C`) are the correct "private bank" ground. Follow the premium-fintech convention: never pure black; use a warm-tinted near-black (your navy already does this), and tint your shadows with the surface colour rather than using neutral grey/black. Reserve the warm paper `#F6F7F5` for "document" surfaces (the stamp book, the baseline record) so the app physically alternates between *ledger* (navy) and *paper* (warm) the way a passport does.

### 2. Texture & depth — tactile paper, not glass

For a proof/permanence brand, choose the **letterpress/emboss + grain + institutional-shadow** direction over glassmorphism. Glassmorphism (frosted translucency) is beautiful but (a) reads as consumer-futuristic, (b) has documented contrast/legibility problems, and (c) depends on a busy background to work — the opposite of a calm ledger. Apple's 2025 "Liquid Glass" is a native OS material you can only approximate on the web, so chasing it is a trap.

Concrete depth system:
- **Grain:** a very low-opacity (2–4%) SVG `feTurbulence` noise overlay on paper surfaces gives the "warm paper" real tooth without image weight. Keep it off text.
- **Letterpress/emboss for stamps and headings:** simulate ink pressed *into* paper with a tight inset text-shadow (`text-shadow: 0 1px 0 rgba(255,255,255,.5), 0 -1px 1px rgba(14,26,43,.15)`), inverting the usual "raised" shadow. Ink stamps should sit slightly *in* the page; gold seals can sit slightly *above* it (a hint of raised foil).
- **Elevation:** hairline borders (1px, low-contrast) for structure — the Linear approach — plus a single soft, *navy-tinted* shadow for genuinely elevated objects (modals, the landing stamp). Two-layer shadows (a tinted far shadow + a tight neutral near shadow) create "parallax-grade depth"; use that only on the hero ceremony moments.

### 3. Motion — the language of ceremony vs. everyday

**The core split:** everyday micro-interactions must be *fast and invisible* (<150ms, seen dozens of times a day); ceremony moments can be *slow and expressive* (seen rarely, so they earn duration). Every serious system (Material, IBM Carbon, Atlassian, Uber) encodes this "productive vs. expressive" duality. Frequency, not importance, sets the budget: "if someone triggers this dozens of times a day, keep it under 150ms; if they see it once a session, you have room for more expression."

**Named curves and durations (build these as tokens):**

- **Everyday ease-out (enter, hover, state change):** `cubic-bezier(0, 0, 0.2, 1)` (decelerate), **120–200ms**. Ease-out is the default because it "feels responsive but allows the eye time to focus on the element as it comes to rest."
- **Exit / dismiss:** `cubic-bezier(0.4, 0, 1, 1)` (accelerate), **100–150ms** — exits are faster because they need less attention.
- **Standard move (both ends on-screen):** `cubic-bezier(0.4, 0, 0.2, 1)`, **200–300ms**.
- **Ceremony / expressive** (baseline lock, stamp landing, celebration): longer, **400–600ms**, with a snappy take-off and a *very soft* landing.
- **Progress-fill (gold rail):** ease-out, **600–900ms**, so the fill visibly *travels* and settles rather than snapping.

**Spring physics (for the stamp and celebration).** Springs feel more "right" than duration-based tweens for physical objects because they carry momentum and settle. But your brand is *weight and gravity*, not *play* — so avoid bouncy, oscillating springs. Use a heavy, near-critically-damped spring so the stamp lands with authority and barely overshoots:

- **Stamp-down ("heavy, decisive, minimal bounce"):** `stiffness: 320, damping: 30, mass: 1.1` (Framer Motion / react-spring). This gives a fast approach and a firm, almost-no-overshoot landing — the feel of a hand pressing a rubber stamp, not a beach ball.
- **Seal/medal settle:** slightly softer, `stiffness: 260, damping: 26`.
- **Avoid** the "gentle/bouncy" presets (`damping: 8–12`) — visible oscillation reads playful/consumer, the Duolingo register you want to avoid.

**Choreography of the stamp-down (signature interaction), ~450–600ms total:**
1. **Approach (0–180ms):** the stamp scales from ~2.5× down to 1×, drops in from slightly above, opacity 0→1, with a tiny random rotation (−4° to −15°, matching your "slight rotation" spec). This mirrors the classic stamp-approval CSS pattern (scale-down + rotate + settle).
2. **Impact (at ~180ms):** the moment of contact — this is where sound + haptic + a screen "response" all fire simultaneously (Apple's synchronization rule).
3. **Ink spread / seal impression (180–420ms):** an ink-bleed reveal. The cheap-and-reliable web technique is a PNG sprite sheet stepped with CSS `steps()` (24–39 frames of an ink blot growing) — no video, no heavy canvas. For gold seals, replace ink-spread with a one-shot specular sheen sweep across the seal.
4. **Paper response (200–300ms, subtle):** the page/card beneath dips ~2–3px and returns, or a soft navy-tinted shadow blooms under the stamp, selling the physical press.
5. **Settle:** spring resolves; the sheen finishes.

**Count-ups for numbers.** Your Spline Sans Mono data numbers should animate on reveal with a count-up (CountUp.js, `easeOutExpo`, ~2s, `tabular-nums` on to prevent jitter). For the *headline* earned metric on a payoff milestone, consider the **odometer** (rolling digits) variant — it reads "mechanical, tactile, earned" and is exactly the "make the number feel earned" tool. Use odometer sparingly (payoff milestones only); use plain count-up elsewhere. Note: Stripe's dashboard famously rolls numbers "into place like a slot machine" — effective, but keep the *character* weighty, not gamified.

**Reduced motion is mandatory, not optional.** Honour `prefers-reduced-motion: reduce` on every animation. Best practice is *replace, don't just delete*: swap movement/scale/rotation for a simple opacity crossfade and near-zero duration, keeping state legible. Centralise via CSS custom properties:
```css
:root { --dur-fast: 150ms; --dur-ceremony: 500ms; }
@media (prefers-reduced-motion: reduce) {
  :root { --dur-fast: 0.01ms; --dur-ceremony: 0.01ms; }
  /* stamp still appears — it just doesn't fly, spin, or spread */
}
```
The stamp must still *appear* (it's essential information — proof of a milestone); it simply arrives via fade instead of impact. Consider also an in-app sound/motion toggle for users on shared devices who haven't set the OS flag.

### 4. Glow & light — candlelight, not neon

Glow reads premium when it's **warm, low-saturation, and specular** (a highlight on metal, a candle-warm halo) and cheap when it's **saturated, neon, and bloomy**. Rules:
- **"Current" state pulse:** for the active milestone on the rail, a slow, subtle pulse — but pulse *opacity/soft-shadow*, not size (scaling large objects is a vestibular trigger and reads cheap). ~2–3s cycle, warm gold glow at low alpha (`box-shadow: 0 0 0 rgba` → `0 0 24px rgba(198,161,91,.35)` and back). Gate it behind `prefers-reduced-motion`.
- **Specular sheen on gold** (see §1) is your premium "light" effect — light *catching* metal, not light *emitting* from UI.
- **Cursor-follow glow** (the Linear/Stripe card-border flashlight effect) is tasteful on a desktop marketing page but skip it in the mobile-first product; it doesn't exist on touch and adds nothing to the ceremony.
- **Never** use saturated neon bloom, coloured drop-shadows on text, or glow on error/red states.

### 5. Sound — yes, but earned, opt-in, and tiny

**Decision: YES to sound, but default-OFF, unlocked by a deliberate user gesture, and reserved almost entirely for the earning moments.** Rationale:
- Browsers *force* your hand: audio can't autoplay; an `AudioContext` must be created/resumed inside a user gesture. So default-OFF isn't a compromise, it's the only compliant path — and it happens to be UX best practice ("sound should never automatically play... users should have on-demand, ultra-obvious mute control").
- Sound is the cheapest way to add "physical confirmation" weight that works identically on iOS and Android (unlike haptics). For a brand whose whole thesis is *this moment is real and permanent*, a single, beautifully designed confirmation sound at the stamp-down is worth more than any visual flourish.

**What the sound should be — follow Apple's three principles.** Per Apple's WWDC19 session *Designing Audio-Haptic Experiences* (interaction designer Camille Moussette and sound designer Hugo Verweij): "First is causality. Then we have harmony and lastly we have utility." Applied to MileStamp:
- **Causality:** the sound fires *exactly* at stamp impact, so cause (press) and effect (thunk) are unmistakably linked. Latency kills it — Apple warns that with latency "the illusion... is completely not there."
- **Harmony** — defined by Apple as "things should feel the way they look, the way they sound." An ink craft-stamp = a low, soft, woody **"thunk"** (rounded attack). A gold payoff seal = that thunk *plus* a short, bright, two-tone **chime** on top (the "earned" layer). Apple rejected Apple Pay candidates for being "too happy and frivolous" and "too harsh" — aim for "not too serious, and clearly a confirmation."
- **Utility:** use it *only* at real earned moments (stamp-down, baseline lock, milestone). Never on navigation, hover, or form input. Apple: if tempted to add more, "maybe don't... it will diminish the value of what's really important."

**Specs:** confirmation sounds should be ~**100–300ms**, **consonant** (a pleasant two-tone interval, not a single beep), clean, warm, mono. Design two: `stamp_ink` (thunk only) and `stamp_gold` (thunk + chime). Implement with a tiny library (`use-sound`/Howler, ~1KB + ~10KB) and preload. Keep an obvious sound toggle in the UI, remember the preference, and always pair sound with the visual so nothing depends on audio (accessibility).

**The unlock moment:** the first ceremony (baseline lock) is the natural place to offer "🔊 turn sound on for this" as a one-tap, clearly-optional choice — the gesture both unlocks the AudioContext and opts the user in.

### 6. Haptics — a bonus for Android, never a dependency

**Honest reality:** **iOS Safari (WebKit) exposes no public vibration or haptics API in any version** — Apple WebKit has not shipped `navigator.vibrate`, and there is no Safari Technology Preview flag that turns it on. `navigator.vibrate()` works on Android Chrome/Firefox/Samsung Internet; it does nothing on iPhone. There is a narrow iOS-18+ trick — a `<input type="checkbox" switch>` toggled via its label emits a system haptic — but it is confirmed as a WebKit hack, not a public API: it requires a real DOM switch and label-propagated click, and is not general-purpose. Do not build your ceremony around it.

**Recommendation:** implement haptics as pure progressive enhancement:
```js
if ('vibrate' in navigator) navigator.vibrate([18, 40, 18]); // "two taps," Apple Pay-style
```
- Fire it *with* the sound and visual at stamp impact, sharing the same tempo (Apple's "two instruments, same tempo" rule — two short taps map to the two-tone chime).
- Patterns: stamp-down `[18, 40, 18]` (two firm taps); baseline lock a single heavier `[30]`; keep every pattern short (spec caps and rate-limits apply; requires a user gesture; silent/DND can suppress it).
- Because it's absent on most of your users' devices, treat any haptic as icing — the moment must feel complete on sound + motion alone.

### 7. Celebration design — weight, not confetti

**Retire generic confetti as the primary celebration.** Confetti now reads cheap for two documented reasons: it's *everywhere* (thousands of stock confetti animations; it's on "every complete page we land on"), and it's usually *unearned*. The literature's rule: celebrate **the user's real milestone**, at the moment it becomes true, or it's "just noise."

The cautionary tale is directly relevant to a money-adjacent, trust-coded brand: **Robinhood removed its confetti animation on March 31, 2021**, after the Massachusetts Securities Division's December 2020 complaint cited "colorful confetti raining down" as a gamification tactic. Per CNBC, Robinhood said it would replace it with "new, dynamic visual experiences that cheer on customers through the milestones in their financial journeys" (the firm later settled the Massachusetts matter for $7.5M in January 2024). Notably, regulators objected that the confetti fired on *company* "firsts" — per CNN, Robinhood displayed it "when they initially deposit money... make their first trade and upgrade to a premium membership." That is exactly the trap MileStamp must avoid: celebrating the business's milestone with the user's reward vocabulary.

**What to do instead — make the mechanism the reward.** The **stamp-impression is the celebration.** A single, weighty stamp landing on the page — with ink spread (or gold sheen), a paper dip, the thunk, and (where available) two haptic taps — is more satisfying and far more *on-brand* than particles. It says "this is now recorded, permanently," which is your entire thesis. Supporting elements, in priority order:
1. The stamp-down choreography (§3) — the hero.
2. A slow gold progress-fill advancing on the rail immediately after, so the earn visibly *moves you forward*.
3. The count-up/odometer of the milestone's number.
4. *Optionally*, for the rarest payoff milestones only, a restrained, slow-falling **gold-leaf/foil-fleck** drift (a few large, slow, low-opacity flecks catching light) — the "premium confetti" that reads like a bank's congratulations, not a game's. Never small, fast, multicoloured particles.

**Console = calm and clinical.** The support/coach console must feel like a reading room, not a party. No stamps landing, no sound, no glow, no count-ups. Instant state changes (100–150ms fades), hairline structure, monospaced data, generous whitespace. The *contrast* between the calm console and the ceremonial student view is itself a quality signal — it shows the celebration is reserved and therefore meaningful.

### 8. Behavioural grounding & ethics

**Peak-end rule.** The foundational study is Kahneman, Fredrickson, Schreiber & Redelmeier (1993), "When More Pain Is Preferred to Less: Adding a Better End," *Psychological Science* 4(6): 401–405; the follow-up colonoscopy trial (Redelmeier, Katz & Kahneman, 2003, *Pain*) found patients whose procedure ended less painfully rated the overall experience as less aversive. People remember an experience by its most intense moment (the peak) and its end, not the average. This is the scientific licence for concentrating your sensory budget: a few extraordinary peaks (stamp-down, baseline lock, payoff milestone) and strong endings (the check-in celebration screen, the stamp-book view) will define how a student remembers the whole programme — far more than uniform polish.

**The ethics line, which is also the brand line.** The same behavioural toolkit can manufacture false progress (fake milestones, celebrating account creation, dark-pattern nudges). For MileStamp this is doubly dangerous because the brand *promises* proof and permanence. Rules to encode:
- A celebration may only fire on a **real, verified, immutable** achievement — the same numbers the "baseline locked" ceremony froze.
- Never celebrate the company's milestone (signup, upgrade) with the earned-gold vocabulary. Gold is the student's, always. (This is precisely the line Robinhood crossed.)
- The "these numbers can't be edited later" copy is a *feature of the celebration*, not fine print — say it at the peak. Honesty is the premium signal.

## Recommendations

**Prioritised shortlist — the 5–8 highest-impact sensory upgrades:**

1. **Rebuild the stamp-impression as a true skeuomorphic ceremony (highest leverage).** Approach-scale-rotate → synchronized impact (sound + haptic + paper-dip) → ink-spread sprite (or gold sheen) → heavy spring settle (`stiffness 320, damping 30`). ~500ms. This one interaction carries the brand. *Benchmark to change course: if it doesn't feel "decisive" in user testing, increase mass/lower overshoot before adding effects.*
2. **Fix gold rendering everywhere: replace flat `#C6A15B` with the dark→highlight→dark gradient, plus a one-shot sheen sweep on earning.** Kill any flat-gold fill. This is a cheap change with an outsized "is this expensive?" payoff.
3. **Baseline-lock ceremony: slow it down and make it feel irreversible.** A deliberate, 500–600ms sequence — numbers count up into place, a heavy navy "LOCKED" seal presses in with an emboss/letterpress effect, a single low haptic thud (Android) and confirmation sound, and the immutable-copy line stated plainly. This is your first and most important peak; it sets the trust contract.
4. **Weekly check-in celebration: replace confetti with the stamp + gold-fill + count-up.** Reserve any falling element for rare payoff milestones, and make it slow gold-leaf flecks, not particles. Tie the celebration copy to the *user's* real gain.
5. **Progress page: animate the gold rail fill (600–900ms ease-out) and pulse only the "current" milestone (opacity/soft-glow, ~2.5s, reduced-motion-gated).** Everything earned uses rendered-metal gold; everything unearned stays ink/paper. The page should read at a glance as "how much gold have I earned."
6. **Sound system: default-OFF, one-gesture unlock at baseline lock, two tiny consonant sounds (`stamp_ink`, `stamp_gold`), fired only at earned moments, with a persistent toggle.**
7. **Haptics: progressive enhancement only — `navigator.vibrate([18,40,18])` at impact, same tempo as the sound, silently absent on iOS.**
8. **Support console: strip all ceremony. Calm, clinical, instant, monospaced.** The restraint here makes the ceremony elsewhere feel earned.

**Staging:**
- **Stage 1 (do first, pure CSS/JS, no dependencies):** gold-gradient rendering (#2), reduced-motion tokens, console calm-down (#8), progress-rail fill (#5). Low risk, high perceived-quality gain.
- **Stage 2:** the stamp-impression ceremony (#1) and baseline lock (#3) with spring physics (add Motion/Framer Motion) and the ink-sprite. This is the brand-defining work; give it the most polish time.
- **Stage 3:** sound (#6) and haptics (#7) once the visual ceremonies feel right — they *amplify* a good moment but can't rescue a weak one.

**Thresholds that would change the advice:**
- If analytics show a high sound-mute rate after opt-in, the sound character is wrong (likely too frequent or too "happy") — reduce to stamp-down only and re-voice.
- If you ever ship a native/PWA wrapper, revisit haptics (Capacitor/Tauri haptics plugins give real iOS Taptic Engine access) — that's the one change that would make haptics load-bearing.
- If usability testing shows the ceremony slows down power users (coaches), keep ceremonies student-side only and confirm the console stays instant.

## Caveats

- **iOS haptics may change.** Alternative browser engines are beginning to roll out on iOS (starting in some regions from around iOS 26.2), which could eventually expose the Vibration API in non-WebKit browsers — but assume no iOS haptics for the foreseeable future.
- **Some sources are practitioner blogs, not peer-reviewed.** The sound-duration (100–300ms), loudness (LUFS) figures, and "premium sound" characteristics are industry rules-of-thumb, not hard standards; the Apple WWDC principles and the peak-end research are authoritative. Validate sound choices with real users.
- **Spring values are starting points.** The exact `stiffness/damping/mass` figures are calibrated recommendations, not gospel — tune them on-device, because perceived weight differs across screen sizes and refresh rates.
- **Effect performance on low-end phones.** SVG turbulence grain, backdrop blur, and multi-layer shadows can cost frames on cheap Android devices; test on real hardware and be ready to drop grain/shadow complexity before you drop the core ceremony.
- **"Liquid Glass" is native-only.** Any attempt to replicate Apple's 2025 glass material faithfully on the web will disappoint; the tactile-paper direction sidesteps this entirely and suits the brand better.