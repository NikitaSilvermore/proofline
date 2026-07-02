import { createServiceClient } from "@/lib/supabase/server";
import { formatMoney, trackShort } from "@/lib/intake-options";
import IntakeWizard from "./IntakeWizard";
import styles from "./intake.module.css";

// Server entry for /intake/[token] (BUILD_SPEC.md §3). Resolves the signed token
// to a student, then: unknown token → friendly error; already locked → read-only
// baseline; otherwise → the intake wizard. One-time by construction.

export const dynamic = "force-dynamic";

function firstNameOf(name: string): string {
  return name.trim().split(/\s+/)[0] || "there";
}

export default async function IntakePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const db = createServiceClient();

  const { data: student } = await db
    .from("students")
    .select("id, name, intake_completed_at, track")
    .eq("token", token)
    .maybeSingle();

  if (!student) {
    return (
      <div className={styles.page}>
        <div className={styles.ribbon}>NLS Mentorship &middot; Baseline intake</div>
        <div className={styles.stage}>
          <div className={styles.wizard}>
            <div className={styles.qLabel}>Link not recognised</div>
            <div className={styles.qTitle}>This intake link isn&apos;t valid.</div>
            <p className={styles.qHelp}>
              It may have been mistyped or expired. Reply to your NLS welcome email
              and we&apos;ll send a fresh one.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Already completed → immutable, read-only summary (no re-submitting).
  if (student.intake_completed_at) {
    const { data: baseline } = await db
      .from("baselines")
      .select("monthly_revenue, paid_gigs_12mo, stage_confidence, target_monthly, blocker, own_words")
      .eq("student_id", student.id)
      .maybeSingle();

    const lockedOn = new Date(student.intake_completed_at).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return (
      <div className={styles.page}>
        <div className={styles.ribbon}>NLS Mentorship &middot; Baseline locked</div>
        <div className={styles.stage}>
          <div className={styles.wizard}>
            <div className={styles.stampWrap}>
              <div className={styles.stamp}>
                <div className={styles.seal}>NLS</div>
                <div className={styles.stampEyebrow}>Baseline &middot; locked {lockedOn}</div>
                <h2>Already set, {firstNameOf(student.name)}.</h2>
                <div className={styles.stampRows}>
                  <div className={styles.srow}>
                    <span>Monthly revenue</span>
                    <b>{formatMoney(baseline?.monthly_revenue)}</b>
                  </div>
                  <div className={styles.srow}>
                    <span>Paid gigs, last 12 months</span>
                    <b>{baseline?.paid_gigs_12mo ?? "—"}</b>
                  </div>
                  <div className={styles.srow}>
                    <span>Stage confidence</span>
                    <b>{baseline?.stage_confidence ?? "—"} / 10</b>
                  </div>
                  <div className={styles.srow}>
                    <span>Twelve-month target</span>
                    <b>{formatMoney(baseline?.target_monthly)} / mo</b>
                  </div>
                  <div className={styles.srow}>
                    <span>Track</span>
                    <b>{trackShort(student.track)}</b>
                  </div>
                  <div className={styles.srow}>
                    <span>Biggest blocker</span>
                    <b>{baseline?.blocker || "—"}</b>
                  </div>
                </div>
                {baseline?.own_words && (
                  <div className={styles.stampQuote}>&ldquo;{baseline.own_words}&rdquo;</div>
                )}
                <div className={styles.stampMeta}>
                  Your baseline is locked — that&apos;s by design.
                </div>
              </div>
              <a className={styles.stampCta} href={`/p/${token}`}>
                See my progress →
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <IntakeWizard token={token} firstName={firstNameOf(student.name)} />;
}
