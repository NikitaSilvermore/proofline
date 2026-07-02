"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { TRACK_VALUES } from "@/lib/intake-options";

export type IntakePayload = {
  monthly_revenue: number | null;
  paid_gigs_12mo: number;
  track: string;
  stage_confidence: number;
  target_monthly: number | null;
  blocker: string;
  own_words: string;
  consent: {
    programme_use: boolean;
    team_visible: boolean;
    public_optin: boolean;
  };
};

export type IntakeResult =
  | { ok: true }
  | { ok: false; error: string };

// Handles intake submit: validate → write baseline → lock student → create the
// student's milestone rail from templates. One-time; a locked intake is rejected
// (BUILD_SPEC.md §3, §6.1). Runs server-side with the service-role key.
export async function submitIntake(
  token: string,
  payload: IntakePayload,
): Promise<IntakeResult> {
  const db = createServiceClient();

  // 1. Resolve the token to a student.
  const { data: student, error: findErr } = await db
    .from("students")
    .select("id, intake_completed_at, track")
    .eq("token", token)
    .maybeSingle();

  if (findErr) return { ok: false, error: "Something went wrong. Please try again." };
  if (!student) return { ok: false, error: "This intake link is not valid." };

  // 2. Enforce one-time lock.
  if (student.intake_completed_at) {
    return { ok: false, error: "This baseline is already locked." };
  }

  // 3. Validate.
  if (!TRACK_VALUES.includes(payload.track as (typeof TRACK_VALUES)[number])) {
    return { ok: false, error: "Please choose a track." };
  }
  const confidence = Math.round(payload.stage_confidence);
  if (confidence < 1 || confidence > 10) {
    return { ok: false, error: "Confidence must be between 1 and 10." };
  }
  if (!payload.own_words.trim()) {
    return { ok: false, error: "Please tell us where you're starting from." };
  }
  if (!payload.consent.programme_use || !payload.consent.team_visible) {
    return {
      ok: false,
      error: "The first two permissions are required to run your programme.",
    };
  }

  const now = new Date().toISOString();

  // 4. Baseline (immutable once written).
  const { error: baseErr } = await db.from("baselines").upsert(
    {
      student_id: student.id,
      monthly_revenue: payload.monthly_revenue,
      paid_gigs_12mo: Math.max(0, Math.round(payload.paid_gigs_12mo)),
      stage_confidence: confidence,
      target_monthly: payload.target_monthly,
      blocker: payload.blocker || null,
      own_words: payload.own_words.trim(),
      locked_at: now,
    },
    { onConflict: "student_id" },
  );
  if (baseErr) return { ok: false, error: "Could not save your baseline." };

  // 5. Lock the student + store consent + activate.
  const { error: studErr } = await db
    .from("students")
    .update({
      track: payload.track,
      status: "active",
      intake_completed_at: now,
      consent: { ...payload.consent, at: now },
    })
    .eq("id", student.id);
  if (studErr) return { ok: false, error: "Could not lock your intake." };

  // 6. Build the milestone rail: shared craft + this track's payoff.
  //    Guarded so a retry never duplicates.
  const { count } = await db
    .from("milestones")
    .select("id", { count: "exact", head: true })
    .eq("student_id", student.id);

  if (!count) {
    const { data: templates } = await db
      .from("milestone_templates")
      .select("position, label, layer")
      .in("track", ["shared", payload.track])
      .order("position");

    if (templates?.length) {
      const rows = templates.map((t: { position: number; label: string; layer: string }) => ({
        student_id: student.id,
        position: t.position,
        label: t.label,
        layer: t.layer,
        // "Baseline set" (position 1) is earned the moment intake locks.
        state: t.position === 1 ? "done" : t.position === 2 ? "current" : "todo",
        progress_pct: t.position === 1 ? 100 : 0,
        achieved_at: t.position === 1 ? now : null,
      }));
      await db.from("milestones").insert(rows);
    }
  }

  // 7. Log the milestone event.
  await db.from("events").insert({
    student_id: student.id,
    type: "milestone_earned",
    payload: { label: "Baseline set", via: "intake" },
  });

  return { ok: true };
}
