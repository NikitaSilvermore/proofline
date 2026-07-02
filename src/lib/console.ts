// Console view model (BUILD_SPEC.md §3, §6.3). Groups the raw rows into a roster
// the team reads in thirty seconds: stat strip, needs-attention, harvest queue,
// and the RAG roster. Pure functions over already-fetched arrays.

export type CStudent = {
  id: string;
  name: string;
  token: string;
  status: string;
  enrolled_at: string | null;
  intake_completed_at: string | null;
};
export type CBaseline = { student_id: string; monthly_revenue: number | null };
export type CCheckin = {
  student_id: string;
  week_no: number | null;
  sent_at: string | null;
  completed_at: string | null;
  value_confirmed: number | null;
};
export type CMilestone = { student_id: string; state: string | null };
export type CFlag = { student_id: string; rag: string | null; reasons: string[] | null };
export type CEvent = {
  student_id: string;
  type: string | null;
  payload: unknown;
  created_at: string | null;
};

export type RosterRow = {
  id: string;
  name: string;
  initials: string;
  token: string;
  monthLabel: string;
  streak: number;
  lastCheckin: string;
  lastCheckinStale: boolean;
  vsBaseline: { text: string; dir: "pos" | "neg" | "flat" };
  milestonesLabel: string;
  rag: "red" | "amber" | "green" | "none";
  why: string;
};

export type ConsoleView = {
  now: string;
  activeCount: number;
  stats: {
    needsAttention: number;
    watch: number;
    onTrack: number;
    responseRate: number;
    milestonesThisWeek: number;
  };
  needsAttention: {
    id: string;
    name: string;
    initials: string;
    token: string;
    monthLabel: string;
    reason: string;
    nudged: boolean;
  }[];
  harvest: {
    id: string;
    name: string;
    initials: string;
    token: string;
    label: string;
    when: string;
    requested: boolean;
  }[];
  roster: RosterRow[];
};

const DAY = 24 * 60 * 60 * 1000;

function initials(name: string): string {
  const p = name.trim().split(/\s+/);
  return ((p[0]?.[0] ?? "") + (p[1]?.[0] ?? "")).toUpperCase() || "?";
}

function monthLabel(enrolled: string | null, now: Date): string {
  if (!enrolled) return "—";
  const days = (now.getTime() - new Date(enrolled).getTime()) / DAY;
  const m = Math.min(12, Math.max(1, Math.floor(days / 30) + 1));
  return `${m} / 12`;
}

function relDays(iso: string | null, now: Date): { text: string; days: number } {
  if (!iso) return { text: "Never", days: Infinity };
  const days = Math.floor((now.getTime() - new Date(iso).getTime()) / DAY);
  if (days <= 0) return { text: "Just now", days: 0 };
  if (days === 1) return { text: "1d ago", days };
  return { text: `${days}d ago`, days };
}

function streakOf(done: CCheckin[]): number {
  const weeks = done
    .filter((c) => c.completed_at && c.week_no != null)
    .map((c) => c.week_no as number)
    .sort((a, b) => a - b);
  if (!weeks.length) return 0;
  let s = 1;
  for (let i = weeks.length - 1; i > 0; i--) {
    if (weeks[i] - weeks[i - 1] === 1) s++;
    else break;
  }
  return s;
}

const RANK = { red: 0, amber: 1, green: 2, none: 3 } as const;

export function buildConsole(input: {
  students: CStudent[];
  baselines: CBaseline[];
  checkins: CCheckin[];
  milestones: CMilestone[];
  flags: CFlag[];
  events: CEvent[];
  now: Date;
}): ConsoleView {
  const { students, now } = input;

  const byStudent = <T extends { student_id: string }>(rows: T[]) => {
    const m = new Map<string, T[]>();
    for (const r of rows) {
      const arr = m.get(r.student_id) ?? [];
      arr.push(r);
      m.set(r.student_id, arr);
    }
    return m;
  };
  const baseMap = new Map(input.baselines.map((b) => [b.student_id, b]));
  const flagMap = new Map(input.flags.map((f) => [f.student_id, f]));
  const ckMap = byStudent(input.checkins);
  const msMap = byStudent(input.milestones);
  const evMap = byStudent(input.events);

  const roster: RosterRow[] = students.map((s) => {
    const cks = ckMap.get(s.id) ?? [];
    const done = cks.filter((c) => c.completed_at);
    const ms = msMap.get(s.id) ?? [];
    const flag = flagMap.get(s.id);
    const base = baseMap.get(s.id);
    const lastCompleted = done
      .map((c) => c.completed_at as string)
      .sort()
      .at(-1) ?? null;
    const rel = relDays(lastCompleted, now);

    const confirmed = done.reduce((t, c) => t + (c.value_confirmed ?? 0), 0);
    let vs: RosterRow["vsBaseline"];
    if (!base || base.monthly_revenue == null) {
      vs = { text: s.intake_completed_at ? "baseline set" : "no baseline", dir: "flat" };
    } else if (confirmed > 0 && base.monthly_revenue > 0) {
      const pct = Math.round((confirmed / base.monthly_revenue) * 100);
      vs = { text: `+${pct}%`, dir: "pos" };
    } else {
      vs = { text: "flat", dir: "flat" };
    }

    const doneCount = ms.filter((m) => m.state === "done").length;
    const total = ms.length || 8;
    const rag = (flag?.rag as RosterRow["rag"]) ?? "none";

    return {
      id: s.id,
      name: s.name,
      initials: initials(s.name),
      token: s.token,
      monthLabel: monthLabel(s.enrolled_at, now),
      streak: streakOf(cks),
      lastCheckin: rel.text,
      lastCheckinStale: rel.days >= 8,
      vsBaseline: vs,
      milestonesLabel: `${doneCount} / ${total}`,
      rag,
      why: (flag?.reasons ?? []).join("; ") || "—",
    };
  });

  // Reds first, then amber, green, none; within a rank, stalest first.
  roster.sort((a, b) => RANK[a.rag] - RANK[b.rag] || a.name.localeCompare(b.name));

  const activeCount = students.filter((s) => s.status === "active").length;
  const reds = roster.filter((r) => r.rag === "red");
  const ambers = roster.filter((r) => r.rag === "amber");
  const greens = roster.filter((r) => r.rag === "green");

  // Response rate: completed / sent across all check-ins.
  const totalSent = input.checkins.filter((c) => c.sent_at).length;
  const totalDone = input.checkins.filter((c) => c.completed_at).length;
  const responseRate = totalSent ? Math.round((totalDone / totalSent) * 100) : 0;

  // Milestones earned this week.
  const milestonesThisWeek = input.events.filter(
    (e) =>
      e.type === "milestone_earned" &&
      e.created_at &&
      now.getTime() - new Date(e.created_at).getTime() <= 7 * DAY,
  ).length;

  // Needs attention: reds, with the first reason as the headline.
  const nameById = new Map(students.map((s) => [s.id, s]));
  const needsAttention = reds.map((r) => {
    const evs = evMap.get(r.id) ?? [];
    const nudged = evs.some((e) => e.type === "nudge_sent");
    return {
      id: r.id,
      name: r.name,
      initials: r.initials,
      token: r.token,
      monthLabel: r.monthLabel,
      reason: r.why,
      nudged,
    };
  });

  // Harvest: milestone_earned in last 14 days with no later testimonial request.
  const harvest: ConsoleView["harvest"] = [];
  for (const [sid, evs] of evMap) {
    const earned = evs
      .filter((e) => e.type === "milestone_earned" && e.created_at)
      .sort((a, b) => (a.created_at! < b.created_at! ? 1 : -1))[0];
    if (!earned || !earned.created_at) continue;
    if (now.getTime() - new Date(earned.created_at).getTime() > 14 * DAY) continue;
    const requested = evs.some(
      (e) =>
        e.type === "testimonial_requested" &&
        e.created_at &&
        e.created_at > earned.created_at!,
    );
    const s = nameById.get(sid);
    if (!s) continue;
    const label =
      (earned.payload && typeof earned.payload === "object" && "label" in earned.payload
        ? String((earned.payload as { label: unknown }).label)
        : "Milestone earned");
    harvest.push({
      id: sid,
      name: s.name,
      initials: initials(s.name),
      token: s.token,
      label,
      when: relDays(earned.created_at, now).text,
      requested,
    });
  }
  harvest.sort((a, b) => a.name.localeCompare(b.name));

  return {
    now: now.toISOString(),
    activeCount,
    stats: {
      needsAttention: reds.length,
      watch: ambers.length,
      onTrack: greens.length,
      responseRate,
      milestonesThisWeek,
    },
    needsAttention,
    harvest,
    roster,
  };
}
