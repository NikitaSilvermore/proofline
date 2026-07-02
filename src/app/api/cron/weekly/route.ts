import { createServiceClient } from "@/lib/supabase/server";
import { recomputeFlags } from "@/lib/flags-service";

// Weekly loop (BUILD_SPEC.md §6.2). Mondays 08:00 ET via Vercel Cron: for each
// active student, insert a "sent" check-in row, then recompute every active
// student's RAG flag.
//
// The actual GHL/email send of /checkin/[token] lands in Milestone 7; here we
// create the check-in rows and flip flags so the loop is provably correct.
//
// Auth: Vercel includes `Authorization: Bearer $CRON_SECRET` on cron calls.
// For fake-clock testing you may also pass ?secret=$CRON_SECRET and ?now=<ISO>
// to simulate a specific Monday without waiting.

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const auth = req.headers.get("authorization");
  const secret = url.searchParams.get("secret");
  const expected = process.env.CRON_SECRET;

  if (!expected || (auth !== `Bearer ${expected}` && secret !== expected)) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Optional fake clock. Accepts full ISO ("2026-07-06T12:00:00Z"), a
  // space-separated variant, or date-only ("2026-07-06"). Omit it to use real time.
  let now = new Date();
  const nowParam = url.searchParams.get("now");
  if (nowParam) {
    const cleaned = nowParam.trim().replace(" ", "T");
    const parsed = new Date(/^\d{4}-\d{2}-\d{2}$/.test(cleaned) ? cleaned + "T12:00:00Z" : cleaned);
    if (Number.isNaN(parsed.getTime())) {
      return new Response(`Bad 'now' parameter: "${nowParam}". Try 2026-07-06`, { status: 400 });
    }
    now = parsed;
  }

  const db = createServiceClient();

  const { data: students } = await db
    .from("students")
    .select("id, intake_completed_at")
    .eq("status", "active");

  const active = (students ?? []) as { id: string; intake_completed_at: string | null }[];

  let sent = 0;
  for (const s of active) {
    // Next week number for this student (any open row from last week becomes a miss).
    const { data: cks } = await db
      .from("checkins")
      .select("week_no")
      .eq("student_id", s.id);
    const maxWeek = (cks ?? []).reduce(
      (m: number, c: { week_no: number | null }) => Math.max(m, c.week_no ?? 0),
      0,
    );

    const { error } = await db.from("checkins").insert({
      student_id: s.id,
      week_no: maxWeek + 1,
      sent_at: now.toISOString(),
    });
    if (!error) sent++;
    // TODO (Milestone 7): trigger GHL send of APP_BASE_URL/checkin/<token>.
  }

  // Recompute flags for everyone active (catches new misses, streak drops, etc.).
  let flagged = 0;
  for (const s of active) {
    await recomputeFlags(db, s.id, now);
    flagged++;
  }

  return Response.json({
    ok: true,
    at: now.toISOString(),
    students: active.length,
    sent,
    flagged,
  });
}
