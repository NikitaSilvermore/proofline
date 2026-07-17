// Derives the progress-page view model from real rows only (BUILD_SPEC.md §3, §4).
// Nothing here is invented — every number traces to a baseline or a check-in,
// which is the promise the page makes to the student ("nothing here is a guess").

export type StudentRow = {
  id: string;
  name: string;
  track: string | null;
  status: string;
};

export type BaselineRow = {
  monthly_revenue: number | null;
  paid_gigs_12mo: number | null;
  stage_confidence: number | null;
  target_monthly: number | null;
  blocker: string | null;
  own_words: string | null;
} | null;

export type CheckinRow = {
  week_no: number | null;
  completed_at: string | null;
  pitched_count: number | null;
  metric_value: number | null;
  confidence: number | null;
  win_text: string | null;
};

export type MilestoneRow = {
  position: number | null;
  label: string | null;
  layer: string | null;
  state: string | null;
  progress_pct: number | null;
  achieved_at: string | null;
};

export type FlagRow = { rag: string | null; reasons: string[] | null } | null;

export type ChartPoint = { label: string; value: number };

export type ProgressView = {
  firstName: string;
  hasCheckins: boolean;
  // ledger
  confirmedTotal: number;
  confidenceBaseline: number | null;
  confidenceLatest: number | null;
  confidenceDelta: number | null;
  milestonesDone: number;
  milestonesTotal: number;
  // rail
  milestones: MilestoneRow[];
  currentMilestone: MilestoneRow | null;
  // streak / weeks
  streak: number;
  weeksLogged: number;
  // chart
  chart: ChartPoint[];
  chartMax: number;
  // wins
  wins: { title: string; detail: string; date: string | null; medal: string }[];
  // story
  baseline: BaselineRow;
  targetMonthly: number | null;
};

function firstNameOf(name: string): string {
  return name.trim().split(/\s+/)[0] || "there";
}

function completed(checkins: CheckinRow[]): CheckinRow[] {
  return checkins
    .filter((c) => c.completed_at && c.week_no != null)
    .sort((a, b) => (a.week_no ?? 0) - (b.week_no ?? 0));
}

// Consecutive completed weeks ending at the most recent one.
function computeStreak(done: CheckinRow[]): number {
  if (done.length === 0) return 0;
  let streak = 1;
  for (let i = done.length - 1; i > 0; i--) {
    const gap = (done[i].week_no ?? 0) - (done[i - 1].week_no ?? 0);
    if (gap === 1) streak++;
    else break;
  }
  return streak;
}

export function buildProgress(input: {
  student: StudentRow;
  baseline: BaselineRow;
  checkins: CheckinRow[];
  milestones: MilestoneRow[];
  flag: FlagRow;
}): ProgressView {
  const { student, baseline } = input;
  const done = completed(input.checkins);

  const confirmedTotal = done.reduce((s, c) => s + (c.metric_value ?? 0), 0);
  const confidenceBaseline = baseline?.stage_confidence ?? null;
  const latest = done.length ? done[done.length - 1] : null;
  const confidenceLatest = latest?.confidence ?? confidenceBaseline;
  const confidenceDelta =
    confidenceLatest != null && confidenceBaseline != null
      ? confidenceLatest - confidenceBaseline
      : null;

  const milestones = [...input.milestones].sort(
    (a, b) => (a.position ?? 0) - (b.position ?? 0),
  );
  const milestonesTotal = milestones.length || 8;
  const milestonesDone = milestones.filter((m) => m.state === "done").length;
  const currentMilestone = milestones.find((m) => m.state === "current") ?? null;

  // Chart: cumulative confirmed value, starting from a $0 baseline point.
  const chart: ChartPoint[] = [{ label: "Start", value: 0 }];
  let running = 0;
  for (const c of done) {
    running += c.metric_value ?? 0;
    chart.push({ label: `W${c.week_no}`, value: running });
  }
  const chartMax = Math.max(1000, ...chart.map((p) => p.value));

  // Wins: check-ins that carried a win line, newest first.
  const wins = [...done]
    .reverse()
    .filter((c) => c.win_text && c.win_text.trim())
    .slice(0, 5)
    .map((c) => ({
      title: c.win_text!.trim(),
      detail:
        c.metric_value && c.metric_value > 0
          ? `Week ${c.week_no} · $${c.metric_value.toLocaleString("en-US")} confirmed.`
          : `Week ${c.week_no} check-in.`,
      date: c.completed_at,
      medal: c.metric_value && c.metric_value > 0 ? "★" : "↗",
    }));

  return {
    firstName: firstNameOf(student.name),
    hasCheckins: done.length > 0,
    confirmedTotal,
    confidenceBaseline,
    confidenceLatest,
    confidenceDelta,
    milestonesDone,
    milestonesTotal,
    milestones,
    currentMilestone,
    streak: computeStreak(done),
    weeksLogged: done.length,
    chart,
    chartMax,
    wins,
    baseline,
    targetMonthly: baseline?.target_monthly ?? null,
  };
}
