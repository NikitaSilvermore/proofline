"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { recomputeFlags } from "@/lib/flags-service";

export type CheckinPayload = {
  pitched_count: number;
  value_confirmed: number;
  confidence: number;
  win_text: string;
  blocker: string;
};

export type CheckinResult =
  | {
      ok: true;
      weekNo: number;
      streak: number;
      milestoneEarned: string | null;
      rag: string;
    }
  | { ok: false; error: string };

type MilestoneRow = {
  id: string;
  position: number | null;
  label: string | null;
  layer: string | null;
  state: string | null;
};

// Streak = consecutive completed weeks ending at the latest.
function computeStreak(weeks: number[]): number {
  const sorted = [...weeks].sort((a, b) => a - b);
  if (sorted.length === 0) return 0;
  let streak = 1;
  for (let i = sorted.length - 1; i > 0; i--) {
    if (sorted[i] - sorted[i - 1] === 1) streak++;
    else break;
  }
  return streak;
}

// Weekly check-in submit (BUILD_SPEC.md §6.2). Stores answers on the open check-in
// (or creates one), auto-earns value-threshold milestones, recomputes flags, and
// returns the celebration payload. Server-side, service-role.
export async function submitCheckin(
  token: string,
  payload: CheckinPayload,
): Promise<CheckinResult> {
  const db = createServiceClient();
  const now = new Date();

  const { data: student } = await db
    .from("students")
    .select("id, status")
    .eq("token", token)
    .maybeSingle();
  if (!student) return { ok: false, error: "This check-in link is not valid." };

  // Find the open (sent, not completed) check-in; else create the next week.
  const { data: checkins } = await db
    .from("checkins")
    .select("id, week_no, sent_at, completed_at")
    .eq("student_id", student.id);

  const rows = checkins ?? [];
  const open = rows
    .filter((c: { completed_at: string | null }) => !c.completed_at)
    .sort((a: { week_no: number | null }, b: { week_no: number | null }) => (b.week_no ?? 0) - (a.week_no ?? 0))[0];

  const maxWeek = rows.reduce((m: number, c: { week_no: number | null }) => Math.max(m, c.week_no ?? 0), 0);

  let checkinId: string;
  let weekNo: number;

  if (open) {
    checkinId = open.id;
    weekNo = open.week_no ?? maxWeek;
  } else {
    weekNo = maxWeek + 1;
    const { data: created, error: createErr } = await db
      .from("checkins")
      .insert({ student_id: student.id, week_no: weekNo, sent_at: now.toISOString() })
      .select("id")
      .single();
    if (createErr || !created) return { ok: false, error: "Could not open your check-in." };
    checkinId = created.id;
  }

  // Store answers + complete it.
  const { error: updErr } = await db
    .from("checkins")
    .update({
      completed_at: now.toISOString(),
      pitched_count: Math.max(0, Math.round(payload.pitched_count || 0)),
      value_confirmed: Math.max(0, payload.value_confirmed || 0),
      confidence: Math.min(10, Math.max(1, Math.round(payload.confidence || 1))),
      win_text: payload.win_text.trim() || null,
      blocker: payload.blocker.trim() || null,
    })
    .eq("id", checkinId);
  if (updErr) return { ok: false, error: "Could not save your check-in." };

  // Auto-earn: first confirmed value ⇒ earn the first payoff milestone.
  let milestoneEarned: string | null = null;
  if ((payload.value_confirmed || 0) > 0) {
    const { data: milestones } = await db
      .from("milestones")
      .select("id, position, label, layer, state")
      .eq("student_id", student.id);
    const ms = (milestones ?? []) as MilestoneRow[];
    const paidDone = ms.some((m) => m.layer === "payoff" && m.state === "done");
    if (!paidDone) {
      const firstPayoff = ms
        .filter((m) => m.layer === "payoff")
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))[0];
      if (firstPayoff && firstPayoff.state !== "done") {
        await db
          .from("milestones")
          .update({ state: "done", progress_pct: 100, achieved_at: now.toISOString() })
          .eq("id", firstPayoff.id);
        milestoneEarned = firstPayoff.label;

        // Promote the next milestone on the rail to "current".
        const next = ms
          .filter((m) => (m.position ?? 0) > (firstPayoff.position ?? 0) && m.state === "todo")
          .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))[0];
        if (next) {
          await db.from("milestones").update({ state: "current" }).eq("id", next.id);
        }

        await db.from("events").insert({
          student_id: student.id,
          type: "milestone_earned",
          payload: { label: firstPayoff.label, via: "checkin", week_no: weekNo },
        });
      }
    }
  }

  // Activate the student if they were still 'invited'.
  if (student.status === "invited") {
    await db.from("students").update({ status: "active" }).eq("id", student.id);
  }

  const rag = await recomputeFlags(db, student.id, now);

  // Streak from all completed weeks (this one now included).
  const completedWeeks = rows
    .filter((c: { completed_at: string | null; week_no: number | null }) => c.completed_at && c.week_no != null)
    .map((c: { week_no: number | null }) => c.week_no as number);
  if (!completedWeeks.includes(weekNo)) completedWeeks.push(weekNo);

  return {
    ok: true,
    weekNo,
    streak: computeStreak(completedWeeks),
    milestoneEarned,
    rag: rag.rag,
  };
}
