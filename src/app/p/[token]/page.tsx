import { createServiceClient } from "@/lib/supabase/server";
import { buildProgress } from "@/lib/progress";
import { formatMoney } from "@/lib/intake-options";
import RevenueChart from "./RevenueChart";
import styles from "./progress.module.css";

// Student progress page /p/[token] (BUILD_SPEC.md §3). Rendered entirely from
// real rows via the buildProgress view model. Handles week-1 empty states so a
// brand-new student never sees a broken page.

export const dynamic = "force-dynamic";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

function fmtDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default async function ProgressPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const db = createServiceClient();

  const { data: student } = await db
    .from("students")
    .select("id, name, track, status")
    .eq("token", token)
    .maybeSingle();

  if (!student) {
    return (
      <div className={styles.page}>
        <div className={styles.ribbon}>NLS Mentorship &middot; Student progress</div>
        <main className={styles.main}>
          <section className={styles.hero}>
            <div className={styles.eyebrow}>Link not recognised</div>
            <h1 className={styles.h1}>This progress link isn&apos;t valid.</h1>
            <p className={styles.heroSub}>
              It may have been mistyped or expired. Reply to your NLS welcome email
              and we&apos;ll send a fresh one.
            </p>
          </section>
        </main>
      </div>
    );
  }

  const [{ data: baseline }, { data: checkins }, { data: milestones }, { data: flag }] =
    await Promise.all([
      db
        .from("baselines")
        .select("monthly_revenue, paid_gigs_12mo, stage_confidence, target_monthly, blocker, own_words")
        .eq("student_id", student.id)
        .maybeSingle(),
      db
        .from("checkins")
        .select("week_no, completed_at, pitched_count, value_confirmed, confidence, win_text")
        .eq("student_id", student.id),
      db
        .from("milestones")
        .select("position, label, layer, state, progress_pct, achieved_at")
        .eq("student_id", student.id),
      db.from("flags").select("rag, reasons").eq("student_id", student.id).maybeSingle(),
    ]);

  const v = buildProgress({
    student,
    baseline: baseline ?? null,
    checkins: checkins ?? [],
    milestones: milestones ?? [],
    flag: flag ?? null,
  });

  // Rail geometry: spread nodes 5%..95%, fill up to the current (or last done) node.
  const total = v.milestones.length || 1;
  const nodeLeft = (i: number) => (total > 1 ? 5 + (i / (total - 1)) * 90 : 50);
  const currentIdx = v.milestones.findIndex((m) => m.state === "current");
  const lastDoneIdx = v.milestones.map((m) => m.state === "done").lastIndexOf(true);
  const fillIdx = currentIdx >= 0 ? currentIdx : lastDoneIdx;
  const fillWidth = fillIdx >= 0 ? nodeLeft(fillIdx) : 0;

  return (
    <div className={styles.page}>
      <div className={styles.ribbon}>NLS Mentorship &middot; Student progress</div>

      <header className={styles.masthead}>
        <div className={styles.mastheadInner}>
          <div className={styles.brand}>
            <div className={styles.monogram}>NLS</div>
            <div>
              <div className={styles.brandName}>NLS Mentorship</div>
              <div className={styles.brandSub}>Student progress</div>
            </div>
          </div>
          <div className={styles.mastheadRight}>
            <span className={styles.chip}>
              <span className={styles.dot} />
              {v.milestonesDone} of {v.milestonesTotal} milestones
            </span>
            {v.streak > 0 && (
              <span className={styles.chip}>
                <span className={styles.dot} />
                {v.streak}-week streak
              </span>
            )}
            <div className={styles.avatar} aria-label={student.name}>
              {initials(student.name)}
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {/* HERO */}
        <section className={styles.hero}>
          <div className={styles.eyebrow}>Your progress &middot; {v.firstName}</div>
          {v.hasCheckins ? (
            <>
              <h1 className={styles.h1}>
                From $0 to{" "}
                <span className={styles.gold}>{formatMoney(v.confirmedTotal)}</span> from the
                stage.
              </h1>
              <p className={styles.heroSub}>
                {v.weeksLogged} weekly check-in{v.weeksLogged === 1 ? "" : "s"} logged,{" "}
                {v.milestonesDone} milestone{v.milestonesDone === 1 ? "" : "s"} down.
                Everything below is built from your baseline and your check-ins — nothing
                here is a guess.
              </p>
            </>
          ) : (
            <>
              <h1 className={styles.h1}>
                Your baseline is <span className={styles.gold}>set</span>. Week one starts
                now.
              </h1>
              <p className={styles.heroSub}>
                This page fills in as you go. Your first weekly check-in takes 45 seconds —
                and everything here updates the moment you finish it.
              </p>
            </>
          )}

          <div className={styles.ledger}>
            <div className={styles.ledgerCard}>
              <div className={styles.ledgerLabel}>Confirmed from the stage</div>
              <div className={styles.ledgerRow}>
                <span>
                  <span className={styles.was}>$0</span>
                  <span className={styles.wasTag}>at baseline</span>
                </span>
                <span className={styles.arrow}>&rarr;</span>
                <span className={styles.now}>{formatMoney(v.confirmedTotal)}</span>
              </div>
              <span className={`${styles.delta} ${v.confirmedTotal > 0 ? "" : styles.deltaMuted}`}>
                {v.confirmedTotal > 0 ? `+${formatMoney(v.confirmedTotal)}` : "Not yet"}
              </span>
            </div>

            <div className={styles.ledgerCard}>
              <div className={styles.ledgerLabel}>Stage confidence</div>
              <div className={styles.ledgerRow}>
                <span>
                  <span className={styles.was}>{v.confidenceBaseline ?? "—"}/10</span>
                  <span className={styles.wasTag}>at baseline</span>
                </span>
                <span className={styles.arrow}>&rarr;</span>
                <span className={styles.now}>{v.confidenceLatest ?? "—"}/10</span>
              </div>
              <span
                className={`${styles.delta} ${
                  v.confidenceDelta && v.confidenceDelta > 0 ? "" : styles.deltaMuted
                }`}
              >
                {v.confidenceDelta == null
                  ? "—"
                  : v.confidenceDelta > 0
                    ? `+${v.confidenceDelta} points`
                    : v.confidenceDelta === 0
                      ? "Holding steady"
                      : `${v.confidenceDelta} points`}
              </span>
            </div>

            <div className={styles.ledgerCard}>
              <div className={styles.ledgerLabel}>Milestones earned</div>
              <div className={styles.ledgerRow}>
                <span>
                  <span className={styles.was}>0</span>
                  <span className={styles.wasTag}>at baseline</span>
                </span>
                <span className={styles.arrow}>&rarr;</span>
                <span className={styles.now}>
                  {v.milestonesDone} of {v.milestonesTotal}
                </span>
              </div>
              <span className={`${styles.delta} ${v.milestonesDone > 0 ? "" : styles.deltaMuted}`}>
                {v.milestonesDone > 0 ? "On the rail" : "Starting out"}
              </span>
            </div>
          </div>
        </section>

        {/* JOURNEY RAIL */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.h2}>Your milestones</h2>
            <span className={styles.sectionNote}>
              Earned at your pace — nothing on this rail is given.
            </span>
          </div>
          <div className={styles.railWrap}>
            <div className={styles.rail}>
              <div className={styles.railTrack} />
              <div className={styles.railFill} style={{ width: `${fillWidth}%` }} />
              {v.milestones.map((m, i) => {
                const state = m.state === "done" ? "done" : m.state === "current" ? "current" : "todo";
                return (
                  <div
                    key={i}
                    className={`${styles.node} ${styles[state]}`}
                    style={{ left: `${nodeLeft(i)}%` }}
                  >
                    <div className={styles.nodeDot}>{state === "done" ? "✓" : ""}</div>
                    <div className={styles.nodeMonth}>Step {m.position}</div>
                    <div className={styles.nodeLabel}>{m.label}</div>
                    {state === "current" && (m.progress_pct ?? 0) > 0 && (
                      <span className={styles.nodeProg}>{m.progress_pct}%</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CHART + CHECK-IN */}
        <section className={`${styles.section} ${styles.grid2}`}>
          <div className={styles.panel}>
            <h3>Confirmed value from the stage</h3>
            <div className={styles.panelSub}>Baseline to now</div>
            {v.hasCheckins ? (
              <>
                <div className={styles.chartBox}>
                  <RevenueChart chart={v.chart} chartMax={v.chartMax} />
                </div>
                <div className={styles.chartCaption}>
                  Plotted from {v.weeksLogged} weekly check-in
                  {v.weeksLogged === 1 ? "" : "s"} &middot; 45 seconds each
                </div>
              </>
            ) : (
              <div className={styles.chartEmpty}>
                Your chart draws itself here after your first check-in. One point on
                Monday, a line by week three.
              </div>
            )}
          </div>

          <div className={styles.checkin}>
            <span className={styles.dueChip}>
              {v.hasCheckins ? `Week ${v.weeksLogged + 1} · soon` : "Week 1 · soon"}
            </span>
            <h3>This week&apos;s check-in</h3>
            <p className={styles.panelSub}>
              Five quick questions. Your answers update everything on this page — and Team
              NLS sees them the moment you&apos;re done.
            </p>
            {v.streak > 0 && (
              <div className={styles.streakLine}>
                <span className={styles.streakNum}>{v.streak}</span>
                <span>week{v.streak === 1 ? "" : "s"} in a row. Keep it going.</span>
              </div>
            )}
            <a className={styles.checkinBtn} href={`/checkin/${token}`}>
              Start check-in &middot; 45 seconds
            </a>
            <p className={styles.checkinFine}>
              No logins. This link arrives by email every Monday.
            </p>
          </div>
        </section>

        {/* WINS */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.h2}>Recent wins</h2>
            <span className={styles.sectionNote}>Captured the moment they happened</span>
          </div>
          {v.wins.length > 0 ? (
            <div className={styles.wins}>
              {v.wins.map((w, i) => (
                <div key={i} className={`${styles.win} ${w.medal === "★" ? "" : styles.plain}`}>
                  <div className={styles.winMedal}>{w.medal}</div>
                  <div className={styles.winBody}>
                    <div className={styles.winTitle}>{w.title}</div>
                    <div className={styles.winDetail}>{w.detail}</div>
                  </div>
                  <div className={styles.winDate}>{fmtDate(w.date)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyCard}>
              Your wins land here as you log them. The first one is always the sweetest —
              go get it.
            </div>
          )}
        </section>

        {/* STORY */}
        <section className={styles.section}>
          <div className={styles.story}>
            <div className={styles.eyebrow}>Your story so far</div>
            {v.hasCheckins ? (
              <p className={styles.storyText}>
                When {v.firstName} set their baseline, revenue was{" "}
                <b>{formatMoney(v.baseline?.monthly_revenue ?? null)} a month</b> and stage
                confidence sat at {v.confidenceBaseline ?? "—"} out of 10.{" "}
                {v.weeksLogged} check-in{v.weeksLogged === 1 ? "" : "s"} in:{" "}
                <b>{formatMoney(v.confirmedTotal)} confirmed from the stage</b>, confidence
                at {v.confidenceLatest ?? "—"}, and {v.milestonesDone} milestone
                {v.milestonesDone === 1 ? "" : "s"} earned.
                {v.currentMilestone ? ` Next on the rail: ${v.currentMilestone.label}.` : ""}
              </p>
            ) : (
              <p className={styles.storyText}>
                {v.baseline?.own_words ? (
                  <>&ldquo;{v.baseline.own_words}&rdquo;</>
                ) : (
                  <>Day one is logged.</>
                )}{" "}
                <b>That&apos;s the &ldquo;before.&rdquo;</b> Twelve months from now, this
                paragraph rewrites itself in your numbers.
              </p>
            )}
            <div className={styles.storyMeta}>
              Drafted automatically from your baseline + weekly check-ins. Nothing added,
              nothing invented.
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.lock}>
          <svg width="13" height="15" viewBox="0 0 13 15" fill="none" aria-hidden="true">
            <rect x="1" y="6" width="11" height="8" rx="2" stroke="#64748B" strokeWidth="1.4" />
            <path d="M3.5 6V4.5a3 3 0 016 0V6" stroke="#64748B" strokeWidth="1.4" />
          </svg>
          Only you and the NLS support team can see this page.
        </div>
        <div className={styles.powered}>Powered by Milestamp</div>
      </footer>
    </div>
  );
}
