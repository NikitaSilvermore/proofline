"use client";

import { useMemo, useState, useTransition } from "react";
import styles from "./intake.module.css";
import {
  TRACK_OPTIONS,
  BLOCKER_OPTIONS,
  GIGS_WORDS,
  CONFIDENCE_WORDS,
  formatMoney,
  trackShort,
  parseMoney,
} from "@/lib/intake-options";
import { submitIntake } from "./actions";

// Faithful port of design-reference/nls_baseline_intake_demo.html, wired to real
// data. Welcome → 7 questions → consent → lock (BUILD_SPEC.md §3, §6.1).

const TOTAL_QUESTIONS = 8; // revenue, gigs, track, confidence, target, blocker, own words, consent

export default function IntakeWizard({
  token,
  firstName,
}: {
  token: string;
  firstName: string;
}) {
  const [cur, setCur] = useState(0); // 0 = welcome, 1..8 = questions
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // answers
  const [revenue, setRevenue] = useState(""); // digits only
  const [gigs, setGigs] = useState(0);
  const [track, setTrack] = useState("");
  const [confidence, setConfidence] = useState(5);
  const [target, setTarget] = useState("");
  const [blocker, setBlocker] = useState("");
  const [ownWords, setOwnWords] = useState("");
  const [consent, setConsent] = useState({
    programme_use: true,
    team_visible: true,
    public_optin: true,
  });

  const revenueNum = revenue ? Number(revenue) : null;
  const targetNum = target ? Number(target) : null;

  const canProceed = useMemo(() => {
    switch (cur) {
      case 1:
        return revenue.length > 0;
      case 3:
        return track !== "";
      case 5:
        return target.length > 0;
      case 6:
        return blocker !== "";
      case 7:
        return ownWords.trim().length > 0;
      case 8:
        return consent.programme_use && consent.team_visible;
      default:
        return true;
    }
  }, [cur, revenue, track, target, blocker, ownWords, consent]);

  const barWidth = ((cur + 1) / (TOTAL_QUESTIONS + 1)) * 100;
  const stepCount = cur === 0 ? "Start" : `${cur} of ${TOTAL_QUESTIONS}`;

  function next() {
    setError(null);
    if (cur < TOTAL_QUESTIONS) setCur(cur + 1);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function back() {
    setError(null);
    if (cur > 0) setCur(cur - 1);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function lock() {
    setError(null);
    startTransition(async () => {
      const res = await submitIntake(token, {
        monthly_revenue: revenueNum,
        paid_gigs_12mo: gigs,
        track,
        stage_confidence: confidence,
        target_monthly: targetNum,
        blocker,
        own_words: ownWords,
        consent,
      });
      if (res.ok) {
        setLocked(true);
        if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <div className={styles.page}>
      <div className={styles.ribbon}>NLS Mentorship &middot; Baseline intake</div>

      <header className={styles.masthead}>
        <div className={styles.mastheadInner}>
          <div className={styles.brand}>
            <div className={styles.monogram}>NLS</div>
            <div>
              <div className={styles.brandName}>NLS Mentorship</div>
              <div className={styles.brandSub}>Baseline intake</div>
            </div>
          </div>
          <div className={styles.stepCount}>{locked ? "Complete" : stepCount}</div>
        </div>
      </header>

      <div className={styles.stage}>
        <div className={styles.wizard}>
          {!locked && (
            <div className={styles.bar}>
              <div className={styles.barFill} style={{ width: `${barWidth}%` }} />
            </div>
          )}

          {locked ? (
            <Stamp
              firstName={firstName}
              revenueNum={revenueNum}
              gigs={gigs}
              confidence={confidence}
              targetNum={targetNum}
              track={track}
              blocker={blocker}
              ownWords={ownWords}
              token={token}
            />
          ) : (
            <div className={styles.step} key={cur}>
              {cur === 0 && (
                <>
                  <div className={styles.qLabel}>Welcome to NLS, {firstName}</div>
                  <div className={styles.qTitle}>
                    The most important five minutes of your first month.
                  </div>
                  <p className={styles.qHelp}>
                    Before anything else, we capture exactly where you&apos;re starting
                    from. Here&apos;s why it matters:
                  </p>
                  <div className={styles.welcomePoints}>
                    <div className={styles.wp}>
                      <span className={styles.n}>01</span>
                      <span>
                        Twelve months from now, you&apos;ll see precisely how far
                        you&apos;ve come — in your numbers, not your memory.
                      </span>
                    </div>
                    <div className={styles.wp}>
                      <span className={styles.n}>02</span>
                      <span>
                        Your milestones get set against <em>your</em> starting point.
                        Nobody else&apos;s.
                      </span>
                    </div>
                    <div className={styles.wp}>
                      <span className={styles.n}>03</span>
                      <span>
                        Honest numbers only. This isn&apos;t a test — a modest baseline
                        just makes the climb look bigger.
                      </span>
                    </div>
                  </div>
                  <div className={styles.nav}>
                    <span />
                    <button className={styles.btnNext} onClick={next}>
                      Set my baseline
                    </button>
                  </div>
                  <div className={styles.timeHint}>
                    7 questions &middot; about 5 minutes
                  </div>
                </>
              )}

              {cur === 1 && (
                <>
                  <div className={styles.qLabel}>Question 1 &middot; Where you are</div>
                  <div className={styles.qTitle}>
                    What&apos;s your monthly revenue right now?
                  </div>
                  <p className={styles.qHelp}>
                    Average of the last three months is perfect. Ballpark honesty beats
                    precise optimism.
                  </p>
                  <div className={styles.qBody}>
                    <input
                      className={styles.bigInput}
                      type="text"
                      inputMode="numeric"
                      autoFocus
                      placeholder="$ 0"
                      value={revenue ? "$ " + Number(revenue).toLocaleString("en-US") : ""}
                      onChange={(e) =>
                        setRevenue(e.target.value.replace(/[^0-9]/g, ""))
                      }
                      aria-label="Current monthly revenue"
                    />
                    <div className={styles.inputHint}>USD / month</div>
                  </div>
                  <Nav onBack={back} onNext={next} canProceed={canProceed} />
                </>
              )}

              {cur === 2 && (
                <>
                  <div className={styles.qLabel}>Question 2 &middot; Where you are</div>
                  <div className={styles.qTitle}>
                    How many paid speaking gigs in the last 12 months?
                  </div>
                  <p className={styles.qHelp}>
                    Free stages count for experience — not for this number. We&apos;re
                    marking the money line.
                  </p>
                  <div className={styles.qBody}>
                    <div className={styles.sliderVal}>
                      {gigs}
                      {gigs === 10 ? "+" : ""}
                    </div>
                    <div className={styles.sliderWord}>{GIGS_WORDS[gigs]}</div>
                    <input
                      className={styles.range}
                      type="range"
                      min={0}
                      max={10}
                      value={gigs}
                      onChange={(e) => setGigs(Number(e.target.value))}
                      aria-label="Paid speaking gigs in the last twelve months"
                    />
                    <div className={styles.sliderScale}>
                      <span>0 &middot; not yet</span>
                      <span>10+ &middot; working speaker</span>
                    </div>
                  </div>
                  <Nav onBack={back} onNext={next} canProceed={canProceed} />
                </>
              )}

              {cur === 3 && (
                <>
                  <div className={styles.qLabel}>
                    Question 3 &middot; What it&apos;s all for
                  </div>
                  <div className={styles.qTitle}>
                    When you&apos;re on a stage — what&apos;s it for?
                  </div>
                  <p className={styles.qHelp}>
                    Every NLS student masters the same craft: the talk, the assets,
                    getting booked. What the stage converts into is yours. This choice
                    shapes the bottom half of your milestone rail.
                  </p>
                  <div className={styles.qBody}>
                    <div className={styles.chips}>
                      {TRACK_OPTIONS.map((t) => (
                        <button
                          key={t.value}
                          type="button"
                          className={track === t.value ? styles.sel : ""}
                          onClick={() => setTrack(t.value)}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Nav onBack={back} onNext={next} canProceed={canProceed} />
                </>
              )}

              {cur === 4 && (
                <>
                  <div className={styles.qLabel}>Question 4 &middot; Where you are</div>
                  <div className={styles.qTitle}>
                    How confident are you on stage, today?
                  </div>
                  <p className={styles.qHelp}>
                    Gut answer. You&apos;ll score this same question every week — watching
                    it climb is half the fun.
                  </p>
                  <div className={styles.qBody}>
                    <div className={styles.sliderVal}>{confidence}</div>
                    <div className={styles.sliderWord}>
                      {CONFIDENCE_WORDS[confidence]}
                    </div>
                    <input
                      className={styles.range}
                      type="range"
                      min={1}
                      max={10}
                      value={confidence}
                      onChange={(e) => setConfidence(Number(e.target.value))}
                      aria-label="Stage confidence from 1 to 10"
                    />
                    <div className={styles.sliderScale}>
                      <span>1 &middot; shaky</span>
                      <span>10 &middot; unstoppable</span>
                    </div>
                  </div>
                  <Nav onBack={back} onNext={next} canProceed={canProceed} />
                </>
              )}

              {cur === 5 && (
                <>
                  <div className={styles.qLabel}>
                    Question 5 &middot; Where you&apos;re going
                  </div>
                  <div className={styles.qTitle}>
                    Twelve months from now — what&apos;s your monthly revenue target?
                  </div>
                  <p className={styles.qHelp}>
                    Fees plus business won from the stage. This sets the top of your
                    milestone rail — ambitious and real.
                  </p>
                  <div className={styles.qBody}>
                    <input
                      className={styles.bigInput}
                      type="text"
                      inputMode="numeric"
                      autoFocus
                      placeholder="$ 0"
                      value={target ? "$ " + Number(target).toLocaleString("en-US") : ""}
                      onChange={(e) =>
                        setTarget(e.target.value.replace(/[^0-9]/g, ""))
                      }
                      aria-label="Twelve month monthly revenue target"
                    />
                    <div className={styles.inputHint}>USD / month</div>
                  </div>
                  <Nav onBack={back} onNext={next} canProceed={canProceed} />
                </>
              )}

              {cur === 6 && (
                <>
                  <div className={styles.qLabel}>
                    Question 6 &middot; Where you&apos;re going
                  </div>
                  <div className={styles.qTitle}>
                    What&apos;s the biggest thing in your way right now?
                  </div>
                  <p className={styles.qHelp}>
                    Pick the one that stings. Team NLS sees this on day one.
                  </p>
                  <div className={styles.qBody}>
                    <div className={styles.chips}>
                      {BLOCKER_OPTIONS.map((b) => (
                        <button
                          key={b}
                          type="button"
                          className={blocker === b ? styles.sel : ""}
                          onClick={() => setBlocker(b)}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Nav onBack={back} onNext={next} canProceed={canProceed} />
                </>
              )}

              {cur === 7 && (
                <>
                  <div className={styles.qLabel}>
                    Question 7 &middot; In your own words
                  </div>
                  <div className={styles.qTitle}>
                    Describe where you are right now. Honestly.
                  </div>
                  <p className={styles.qHelp}>
                    A line or two. These exact words become the opening of your success
                    story — the &quot;before&quot; you&apos;ll read back in twelve months.
                  </p>
                  <div className={styles.qBody}>
                    <textarea
                      className={styles.textarea}
                      value={ownWords}
                      onChange={(e) => setOwnWords(e.target.value)}
                      placeholder="Where you are right now, in your own words…"
                      aria-label="Where you are right now, in your own words"
                    />
                  </div>
                  <Nav onBack={back} onNext={next} canProceed={canProceed} />
                </>
              )}

              {cur === 8 && (
                <>
                  <div className={styles.qLabel}>
                    Last step &middot; Your data, your rules
                  </div>
                  <div className={styles.qTitle}>Before we lock it in.</div>
                  <p className={styles.qHelp}>Plain-English permissions — no small print.</p>
                  <div className={`${styles.qBody} ${styles.consent}`}>
                    <label>
                      <input
                        type="checkbox"
                        checked={consent.programme_use}
                        onChange={(e) =>
                          setConsent({ ...consent, programme_use: e.target.checked })
                        }
                      />
                      <span>
                        My answers and weekly check-ins are used to run <b>my</b>{" "}
                        programme — tracking my progress and building my milestones.
                      </span>
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={consent.team_visible}
                        onChange={(e) =>
                          setConsent({ ...consent, team_visible: e.target.checked })
                        }
                      />
                      <span>
                        Team NLS can see my progress page, so they can support me and step
                        in if I stall.
                      </span>
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={consent.public_optin}
                        onChange={(e) =>
                          setConsent({ ...consent, public_optin: e.target.checked })
                        }
                      />
                      <span>
                        Nothing about me is ever shared publicly unless I approve it first,
                        in writing. I can export or delete my data any time.
                      </span>
                    </label>
                  </div>
                  {error && <div className={styles.errText}>{error}</div>}
                  <div className={styles.nav}>
                    <button className={styles.btnBack} onClick={back} disabled={pending}>
                      Back
                    </button>
                    <button
                      className={`${styles.btnNext} ${styles.gold}`}
                      onClick={lock}
                      disabled={pending || !canProceed}
                    >
                      {pending ? "Locking…" : "Lock my baseline"}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Nav({
  onBack,
  onNext,
  canProceed,
}: {
  onBack: () => void;
  onNext: () => void;
  canProceed: boolean;
}) {
  return (
    <div className={styles.nav}>
      <button className={styles.btnBack} onClick={onBack}>
        Back
      </button>
      <button className={styles.btnNext} onClick={onNext} disabled={!canProceed}>
        Next
      </button>
    </div>
  );
}

function Stamp({
  firstName,
  revenueNum,
  gigs,
  confidence,
  targetNum,
  track,
  blocker,
  ownWords,
  token,
}: {
  firstName: string;
  revenueNum: number | null;
  gigs: number;
  confidence: number;
  targetNum: number | null;
  track: string;
  blocker: string;
  ownWords: string;
  token: string;
}) {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <div className={styles.stampWrap}>
      <div className={styles.stamp}>
        <div className={styles.seal}>NLS</div>
        <div className={styles.stampEyebrow}>Baseline &middot; locked {today}</div>
        <h2>Day one, {firstName}.</h2>
        <div className={styles.stampRows}>
          <div className={styles.srow}>
            <span>Monthly revenue</span>
            <b>{formatMoney(revenueNum)}</b>
          </div>
          <div className={styles.srow}>
            <span>Paid gigs, last 12 months</span>
            <b>{gigs}</b>
          </div>
          <div className={styles.srow}>
            <span>Stage confidence</span>
            <b>{confidence} / 10</b>
          </div>
          <div className={styles.srow}>
            <span>Twelve-month target</span>
            <b>{formatMoney(targetNum)} / mo</b>
          </div>
          <div className={styles.srow}>
            <span>Track</span>
            <b>{trackShort(track)}</b>
          </div>
          <div className={styles.srow}>
            <span>Biggest blocker</span>
            <b>{blocker || "—"}</b>
          </div>
        </div>
        {ownWords.trim() && (
          <div className={styles.stampQuote}>&ldquo;{ownWords.trim()}&rdquo;</div>
        )}
        <div className={styles.stampMeta}>
          These numbers can&apos;t be edited later. That&apos;s the point.
        </div>
      </div>
      <p className={styles.stampNext}>
        Your progress page is live. Your first check-in lands Monday morning — 45
        seconds, from your inbox.
      </p>
      <a className={styles.stampCta} href={`/p/${token}`}>
        See my progress →
      </a>
    </div>
  );
}
