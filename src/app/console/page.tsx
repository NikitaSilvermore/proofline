import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { buildConsole } from "@/lib/console";
import Console from "./Console";
import { signOut } from "./actions";
import styles from "./console.module.css";

// Team console /console (BUILD_SPEC.md §3, §6.3). Gated: must be signed in AND on
// the email allowlist. Data is read server-side after the gate.

export const dynamic = "force-dynamic";

export default async function ConsolePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/console/login");

  // Allowlist gate (§7).
  const { data: allow } = await supabase
    .from("team_allowlist")
    .select("email")
    .ilike("email", user.email ?? "")
    .maybeSingle();

  if (!allow) {
    return (
      <div className={styles.loginWrap}>
        <div className={styles.loginCard}>
          <div className={styles.loginTitle}>Not on the list</div>
          <div className={styles.loginSub}>
            <strong>{user.email}</strong> isn&apos;t authorised for the NLS support
            console. Ask Nikita to add you to the allowlist.
          </div>
          <form action={signOut}>
            <button className={styles.loginBtn} type="submit">
              Sign out
            </button>
          </form>
        </div>
      </div>
    );
  }

  const db = createServiceClient();
  const [
    { data: students },
    { data: baselines },
    { data: checkins },
    { data: milestones },
    { data: flags },
    { data: events },
  ] = await Promise.all([
    db.from("students").select("id, name, token, status, enrolled_at, intake_completed_at"),
    db.from("baselines").select("student_id, monthly_revenue"),
    db.from("checkins").select("student_id, week_no, sent_at, completed_at, metric_value"),
    db.from("milestones").select("student_id, state"),
    db.from("flags").select("student_id, rag, reasons"),
    db.from("events").select("student_id, type, payload, created_at"),
  ]);

  const view = buildConsole({
    students: students ?? [],
    baselines: baselines ?? [],
    checkins: checkins ?? [],
    milestones: milestones ?? [],
    flags: flags ?? [],
    events: events ?? [],
    now: new Date(),
  });

  return <Console view={view} />;
}
