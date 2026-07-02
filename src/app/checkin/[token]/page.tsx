import { createServiceClient } from "@/lib/supabase/server";
import CheckinWizard from "./CheckinWizard";
import styles from "./checkin.module.css";

// Weekly check-in entry /checkin/[token] (BUILD_SPEC.md §3, §6.2). Resolves the
// token, works out which week this is, and hands off to the wizard.

export const dynamic = "force-dynamic";

function firstNameOf(name: string): string {
  return name.trim().split(/\s+/)[0] || "there";
}

export default async function CheckinPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const db = createServiceClient();

  const { data: student } = await db
    .from("students")
    .select("id, name, intake_completed_at")
    .eq("token", token)
    .maybeSingle();

  if (!student) {
    return (
      <div className={styles.page}>
        <div className={styles.ribbon}>NLS Mentorship &middot; Weekly check-in</div>
        <div className={styles.stage}>
          <div className={styles.card}>
            <div className={styles.qLabel}>Link not recognised</div>
            <div className={styles.qTitle}>This check-in link isn&apos;t valid.</div>
          </div>
        </div>
      </div>
    );
  }

  // Need a baseline first — send them to intake if they haven't set one.
  if (!student.intake_completed_at) {
    return (
      <div className={styles.page}>
        <div className={styles.ribbon}>NLS Mentorship &middot; Weekly check-in</div>
        <div className={styles.stage}>
          <div className={styles.card}>
            <div className={styles.qLabel}>One step first</div>
            <div className={styles.qTitle}>Set your baseline before your first check-in.</div>
            <div className={styles.nav}>
              <span />
              <a className={styles.btnNext} href={`/intake/${token}`}>
                Set my baseline →
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Which week is this? Open (uncompleted) check-in, else the next one.
  const { data: checkins } = await db
    .from("checkins")
    .select("week_no, completed_at")
    .eq("student_id", student.id);

  const rows = checkins ?? [];
  const open = rows
    .filter((c: { completed_at: string | null }) => !c.completed_at)
    .sort((a: { week_no: number | null }, b: { week_no: number | null }) => (b.week_no ?? 0) - (a.week_no ?? 0))[0];
  const maxWeek = rows.reduce((m: number, c: { week_no: number | null }) => Math.max(m, c.week_no ?? 0), 0);
  const weekNo = open?.week_no ?? maxWeek + 1;

  return <CheckinWizard token={token} firstName={firstNameOf(student.name)} weekNo={weekNo} />;
}
