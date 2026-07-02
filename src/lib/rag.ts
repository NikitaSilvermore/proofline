// Deterministic RAG (red/amber/green) engine — BUILD_SPEC.md §5. No LLM, no
// guesswork: same inputs always give the same colour + human-readable reasons.
// Recomputed on every check-in submit and in the weekly cron. The `reasons`
// array populates the console "Why" column verbatim.

export type RagCheckin = {
  week_no: number | null;
  sent_at: string | null;
  completed_at: string | null;
  pitched_count: number | null;
  value_confirmed: number | null;
  confidence: number | null;
  blocker: string | null;
};

export type RagInput = {
  enrolled_at: string | null;
  intake_completed_at: string | null;
  checkins: RagCheckin[];
  hasPaidMilestone: boolean; // any payoff milestone already earned
  now: Date;
};

export type Rag = "red" | "amber" | "green";
export type RagResult = { rag: Rag; reasons: string[] };

const DAY = 24 * 60 * 60 * 1000;

// Sent-but-not-completed check-ins, most recent first.
function trailingMissed(checkins: RagCheckin[]): number {
  const sent = checkins
    .filter((c) => c.sent_at && c.week_no != null)
    .sort((a, b) => (b.week_no ?? 0) - (a.week_no ?? 0));
  let n = 0;
  for (const c of sent) {
    if (!c.completed_at) n++;
    else break;
  }
  return n;
}

// Completed check-ins, most recent first.
function completedDesc(checkins: RagCheckin[]): RagCheckin[] {
  return checkins
    .filter((c) => c.completed_at && c.week_no != null)
    .sort((a, b) => (b.week_no ?? 0) - (a.week_no ?? 0));
}

// Consecutive count from the most recent completed check-in where `pred` holds.
function trailingRun(done: RagCheckin[], pred: (c: RagCheckin) => boolean): number {
  let n = 0;
  for (const c of done) {
    if (pred(c)) n++;
    else break;
  }
  return n;
}

export function computeRag(input: RagInput): RagResult {
  const { checkins, now } = input;
  const done = completedDesc(checkins);
  const missed = trailingMissed(checkins);

  const red: string[] = [];
  const amber: string[] = [];

  // ── RED ─────────────────────────────────────────────────────────────────
  if (
    !input.intake_completed_at &&
    input.enrolled_at &&
    now.getTime() - new Date(input.enrolled_at).getTime() > 7 * DAY
  ) {
    red.push("Intake incomplete after 7 days — refund window");
  }
  if (missed >= 2) {
    red.push(`${missed} consecutive missed check-ins`);
  }
  // Confidence dropped ≥3 across the last 2 completed check-ins.
  if (done.length >= 2 && done[0].confidence != null && done[1].confidence != null) {
    const drop = done[1].confidence - done[0].confidence;
    if (drop >= 3) red.push(`Confidence dropped ${drop} points`);
  }
  // Same blocker 3 consecutive weeks.
  const blockerRun = done[0]?.blocker
    ? trailingRun(done, (c) => !!c.blocker && c.blocker === done[0].blocker)
    : 0;
  if (done[0]?.blocker && blockerRun >= 3) {
    red.push(`Same blocker 3 weeks running: "${done[0].blocker}"`);
  }

  if (red.length) return { rag: "red", reasons: red };

  // ── AMBER (only if not red) ──────────────────────────────────────────────
  if (missed === 1) {
    amber.push("1 missed check-in");
  }
  if (trailingRun(done, (c) => (c.pitched_count ?? 0) === 0) >= 3) {
    amber.push("No stages pitched for 3 weeks");
  }
  if (
    input.hasPaidMilestone &&
    trailingRun(done, (c) => (c.value_confirmed ?? 0) === 0) >= 4
  ) {
    amber.push("No confirmed value for 4 weeks since first paid gig");
  }
  if (done[0]?.blocker && blockerRun === 2) {
    amber.push(`Same blocker 2 weeks running: "${done[0].blocker}"`);
  }

  if (amber.length) return { rag: "amber", reasons: amber };

  // ── GREEN ────────────────────────────────────────────────────────────────
  const reasons: string[] = [];
  if (done.length >= 2 && done[0].confidence != null && done[1].confidence != null) {
    if (done[0].confidence > done[1].confidence) reasons.push("Confidence trending up");
  }
  if (done[0] && (done[0].value_confirmed ?? 0) > 0) reasons.push("Value confirmed this week");
  if (done.length > 0) reasons.push(`${done.length} check-in${done.length === 1 ? "" : "s"} logged`);
  if (reasons.length === 0) reasons.push("On track");

  return { rag: "green", reasons };
}
