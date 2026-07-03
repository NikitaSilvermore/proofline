"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { formatMoney } from "@/lib/intake-options";
import { sendMessage } from "@/lib/messaging";

// All console actions are gated: the caller must be signed in AND on the email
// allowlist (BUILD_SPEC.md §7). requireTeam throws otherwise.
async function requireTeam(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) throw new Error("Not signed in");
  const { data } = await supabase
    .from("team_allowlist")
    .select("email")
    .ilike("email", user.email)
    .maybeSingle();
  if (!data) throw new Error("Not authorised");
  return user.email;
}

// Nudge → send via the message rail (default "log" until a live rail is set).
// sendMessage records the nudge_sent event itself.
export async function nudgeStudent(studentId: string): Promise<void> {
  await requireTeam();
  const db = createServiceClient();
  const { data: s } = await db
    .from("students")
    .select("token, ghl_contact_id, close_lead_id, close_contact_id, name, email, phone")
    .eq("id", studentId)
    .maybeSingle();

  const base = (process.env.APP_BASE_URL ?? "").replace(/\/$/, "");
  await sendMessage("nudge", {
    studentId,
    ghlContactId: s?.ghl_contact_id ?? null,
    closeLeadId: s?.close_lead_id ?? null,
    closeContactId: s?.close_contact_id ?? null,
    name: s?.name ?? null,
    email: s?.email ?? null,
    phone: s?.phone ?? null,
    link: s?.token ? `${base}/checkin/${s.token}` : null,
  });
  revalidatePath("/console");
}

// Request testimonial → log testimonial_requested.
export async function requestTestimonial(studentId: string): Promise<void> {
  await requireTeam();
  const db = createServiceClient();
  await db.from("events").insert({
    student_id: studentId,
    type: "testimonial_requested",
    payload: { at: new Date().toISOString() },
  });
  revalidatePath("/console");
}

// Mark the current (or next todo) milestone done — a manual judgement call for
// craft milestones (§6.3). Promotes the following milestone to "current".
export async function markNextMilestone(studentId: string): Promise<void> {
  await requireTeam();
  const db = createServiceClient();
  const { data: ms } = await db
    .from("milestones")
    .select("id, position, label, state")
    .eq("student_id", studentId);
  const rows = (ms ?? []) as {
    id: string;
    position: number | null;
    label: string | null;
    state: string | null;
  }[];
  const target =
    rows.filter((m) => m.state === "current").sort((a, b) => (a.position ?? 0) - (b.position ?? 0))[0] ??
    rows.filter((m) => m.state === "todo").sort((a, b) => (a.position ?? 0) - (b.position ?? 0))[0];
  if (!target) return;

  await db
    .from("milestones")
    .update({ state: "done", progress_pct: 100, achieved_at: new Date().toISOString() })
    .eq("id", target.id);

  const next = rows
    .filter((m) => (m.position ?? 0) > (target.position ?? 0) && m.state === "todo")
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))[0];
  if (next) await db.from("milestones").update({ state: "current" }).eq("id", next.id);

  await db.from("events").insert({
    student_id: studentId,
    type: "milestone_earned",
    payload: { label: target.label, via: "console" },
  });
  revalidatePath("/console");
}

// Case-study draft: template interpolation from baseline + latest numbers +
// own_words + best win line (§6.3). Returns editable text; logs the event.
export async function draftCaseStudy(studentId: string): Promise<string> {
  await requireTeam();
  const db = createServiceClient();
  const [{ data: student }, { data: baseline }, { data: checkins }] = await Promise.all([
    db.from("students").select("name").eq("id", studentId).maybeSingle(),
    db
      .from("baselines")
      .select("monthly_revenue, stage_confidence, target_monthly, own_words")
      .eq("student_id", studentId)
      .maybeSingle(),
    db
      .from("checkins")
      .select("value_confirmed, confidence, win_text, completed_at")
      .eq("student_id", studentId),
  ]);

  const done = (checkins ?? []).filter((c: { completed_at: string | null }) => c.completed_at);
  const confirmed = done.reduce(
    (t: number, c: { value_confirmed: number | null }) => t + (c.value_confirmed ?? 0),
    0,
  );
  const latestConf =
    done
      .map((c: { confidence: number | null }) => c.confidence)
      .filter((x: number | null) => x != null)
      .at(-1) ?? baseline?.stage_confidence ?? null;
  const bestWin =
    done
      .filter((c: { win_text: string | null }) => c.win_text)
      .sort(
        (a: { value_confirmed: number | null }, b: { value_confirmed: number | null }) =>
          (b.value_confirmed ?? 0) - (a.value_confirmed ?? 0),
      )[0]?.win_text ?? null;

  const name = student?.name ?? "This student";
  const draft = [
    `${name} — case study draft`,
    ``,
    `When ${name} joined NLS, monthly revenue was ${formatMoney(
      baseline?.monthly_revenue ?? null,
    )} and stage confidence sat at ${baseline?.stage_confidence ?? "—"}/10.`,
    baseline?.own_words ? `In their words: "${baseline.own_words}"` : ``,
    ``,
    `Since then: ${formatMoney(confirmed)} confirmed from the stage across ${done.length} weekly check-in${
      done.length === 1 ? "" : "s"
    }, with confidence now at ${latestConf ?? "—"}/10.`,
    bestWin ? `Standout moment: "${bestWin}"` : ``,
    baseline?.target_monthly
      ? `Target: ${formatMoney(baseline.target_monthly)}/mo — and climbing.`
      : ``,
    ``,
    `— Drafted from real baseline + check-in data. Edit freely before sending.`,
  ]
    .filter((line) => line !== ``)
    .join("\n");

  await db.from("events").insert({
    student_id: studentId,
    type: "case_study_drafted",
    payload: { chars: draft.length },
  });
  revalidatePath("/console");
  return draft;
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/console/login");
}
