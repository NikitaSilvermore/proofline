"use client";

import { useEffect, useState, useTransition } from "react";
import styles from "./checkin.module.css";
import { submitCheckin, type CheckinResult } from "./actions";

// Weekly 5-question check-in, ported from the dashboard demo modal (§6.2).
// On submit → celebration (confetti) → link back to /p/[token].

const BLOCKERS = ["Nothing", "Finding stages", "Getting booked", "Fees", "Stage nerves", "Time"];
const TOTAL = 5;

export default function CheckinWizard({
  token,
  firstName,
  weekNo,
}: {
  token: string;
  firstName: string;
  weekNo: number;
}) {
  const [cur, setCur] = useState(0);
  const [done, setDone] = useState<Extract<CheckinResult, { ok: true }> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const [pitched, setPitched] = useState("");
  const [value, setValue] = useState("");
  const [confidence, setConfidence] = useState(6);
  const [win, setWin] = useState("");
  const [blocker, setBlocker] = useState("Nothing");

  function next() {
    setError(null);
    if (cur < TOTAL - 1) setCur(cur + 1);
    else submit();
  }
  function back() {
    setError(null);
    if (cur > 0) setCur(cur - 1);
  }

  function submit() {
    setError(null);
    startTransition(async () => {
      const res = await submitCheckin(token, {
        pitched_count: pitched ? Number(pitched) : 0,
        metric_value: value ? Number(value) : 0,
        confidence,
        win_text: win,
        blocker: blocker === "Nothing" ? "" : blocker,
      });
      if (res.ok) setDone(res);
      else setError(res.error);
    });
  }

  return (
    <div className={styles.page}>
      <div className={styles.ribbon}>NLS Mentorship &middot; Weekly check-in</div>
      <header className={styles.masthead}>
        <div className={styles.mastheadInner}>
          <div className={styles.brand}>
            <div className={styles.monogram}>NLS</div>
            <div>
              <div className={styles.brandName}>NLS Mentorship</div>
              <div className={styles.brandSub}>Weekly check-in</div>
            </div>
          </div>
          <div className={styles.weekTag}>{done ? "Logged" : `Week ${weekNo}`}</div>
        </div>
      </header>

      <div className={styles.stage}>
        <div className={styles.card}>
          {done ? (
            <Success done={done} token={token} />
          ) : (
            <>
              <div className={styles.dots}>
                {Array.from({ length: TOTAL }).map((_, i) => (
                  <span key={i} className={i <= cur ? styles.on : ""} />
                ))}
              </div>

              {cur === 0 && (
                <>
                  <div className={styles.qLabel}>Question 1 of 5</div>
                  <div className={styles.qTitle}>
                    How many stages did you pitch this week, {firstName}?
                  </div>
                  <div className={styles.qBody}>
                    <input
                      className={styles.numInput}
                      type="text"
                      inputMode="numeric"
                      autoFocus
                      placeholder="0"
                      value={pitched}
                      onChange={(e) => setPitched(e.target.value.replace(/[^0-9]/g, ""))}
                      aria-label="Stages pitched this week"
                    />
                  </div>
                </>
              )}

              {cur === 1 && (
                <>
                  <div className={styles.qLabel}>Question 2 of 5</div>
                  <div className={styles.qTitle}>Fees or value confirmed this week?</div>
                  <div className={styles.qBody}>
                    <input
                      className={styles.numInput}
                      type="text"
                      inputMode="numeric"
                      autoFocus
                      placeholder="$ 0 is a fine answer"
                      value={value ? "$ " + Number(value).toLocaleString("en-US") : ""}
                      onChange={(e) => setValue(e.target.value.replace(/[^0-9]/g, ""))}
                      aria-label="Value confirmed this week"
                    />
                  </div>
                </>
              )}

              {cur === 2 && (
                <>
                  <div className={styles.qLabel}>Question 3 of 5</div>
                  <div className={styles.qTitle}>Stage confidence this week?</div>
                  <div className={styles.qBody}>
                    <div className={styles.sliderVal}>{confidence}</div>
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
                </>
              )}

              {cur === 3 && (
                <>
                  <div className={styles.qLabel}>Question 4 of 5</div>
                  <div className={styles.qTitle}>Biggest win of the week?</div>
                  <div className={styles.qBody}>
                    <input
                      className={styles.textInput}
                      type="text"
                      autoFocus
                      placeholder="One line is plenty"
                      value={win}
                      onChange={(e) => setWin(e.target.value)}
                      aria-label="Biggest win of the week"
                    />
                  </div>
                </>
              )}

              {cur === 4 && (
                <>
                  <div className={styles.qLabel}>Question 5 of 5</div>
                  <div className={styles.qTitle}>Anything slowing you down?</div>
                  <div className={styles.qBody}>
                    <div className={styles.chips}>
                      {BLOCKERS.map((b) => (
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
                </>
              )}

              {error && <div className={styles.errText}>{error}</div>}

              <div className={styles.nav}>
                <button
                  className={`${styles.btnBack} ${cur === 0 ? styles.hidden : ""}`}
                  onClick={back}
                  disabled={pending}
                >
                  Back
                </button>
                <button className={styles.btnNext} onClick={next} disabled={pending}>
                  {cur === TOTAL - 1 ? (pending ? "Submitting…" : "Submit check-in") : "Next"}
                </button>
              </div>
              <div className={styles.timerHint}>Average completion: 45 seconds</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Success({
  done,
  token,
}: {
  done: Extract<CheckinResult, { ok: true }>;
  token: string;
}) {
  // Sensory pass (DECISIONS.md 2026-07-16): generic confetti retired. The stamp
  // press IS the reward (CSS on .bigCheck). A restrained, slow gold-leaf drift —
  // few, large, gold-only flecks — is reserved for rare payoff (milestone-earned)
  // moments only. Reduced-motion skips it entirely.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !done.milestoneEarned) return;
    const golds = ["#f3ead8", "#e8d9b8", "#c6a15b", "#a8863f"];
    const nodes: HTMLDivElement[] = [];
    for (let i = 0; i < 16; i++) {
      const c = document.createElement("div");
      c.className = styles.goldLeaf;
      c.style.left = Math.random() * 100 + "vw";
      const s = 9 + Math.random() * 9;
      c.style.width = s + "px";
      c.style.height = s + "px";
      c.style.background = golds[Math.floor(Math.random() * golds.length)];
      c.style.animationDuration = 2.6 + Math.random() * 2 + "s";
      c.style.animationDelay = Math.random() * 0.5 + "s";
      c.style.opacity = String(0.55 + Math.random() * 0.35);
      document.body.appendChild(c);
      nodes.push(c);
    }
    const t = setTimeout(() => nodes.forEach((n) => n.remove()), 5200);
    return () => {
      clearTimeout(t);
      nodes.forEach((n) => n.remove());
    };
  }, [done.milestoneEarned]);

  return (
    <div className={styles.success}>
      <div className={styles.bigCheck}>✓</div>
      <h4>Week {done.weekNo} logged.</h4>
      <p>Your page just updated — and Team NLS can already see this week&apos;s numbers.</p>
      {done.streak > 1 && (
        <span className={styles.streakBump}>
          Streak: {done.streak} week{done.streak === 1 ? "" : "s"} in a row
        </span>
      )}
      {done.milestoneEarned && (
        <span className={styles.progBump}>🏅 Milestone earned: {done.milestoneEarned}</span>
      )}
      <div>
        <a className={styles.finishBtn} href={`/p/${token}`}>
          See my progress →
        </a>
      </div>
    </div>
  );
}
