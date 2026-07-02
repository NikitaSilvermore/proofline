import { computeRag, type RagResult, type RagCheckin } from "@/lib/rag";

// Recompute and persist a student's RAG flag (BUILD_SPEC.md §5). Shared by the
// check-in submit pipeline and the weekly cron so both use identical rules.
// `db` is a service-role Supabase client. `now` is injected for fake-clock tests.
export async function recomputeFlags(
  db: ReturnType<typeof import("@/lib/supabase/server").createServiceClient>,
  studentId: string,
  now: Date,
): Promise<RagResult> {
  const [{ data: student }, { data: checkins }, { data: milestones }] = await Promise.all([
    db
      .from("students")
      .select("enrolled_at, intake_completed_at")
      .eq("id", studentId)
      .maybeSingle(),
    db
      .from("checkins")
      .select("week_no, sent_at, completed_at, pitched_count, value_confirmed, confidence, blocker")
      .eq("student_id", studentId),
    db.from("milestones").select("layer, state").eq("student_id", studentId),
  ]);

  const hasPaidMilestone = (milestones ?? []).some(
    (m: { layer: string | null; state: string | null }) =>
      m.layer === "payoff" && m.state === "done",
  );

  const result = computeRag({
    enrolled_at: student?.enrolled_at ?? null,
    intake_completed_at: student?.intake_completed_at ?? null,
    checkins: (checkins ?? []) as RagCheckin[],
    hasPaidMilestone,
    now,
  });

  await db.from("flags").upsert(
    {
      student_id: studentId,
      rag: result.rag,
      reasons: result.reasons,
      computed_at: now.toISOString(),
    },
    { onConflict: "student_id" },
  );

  return result;
}
