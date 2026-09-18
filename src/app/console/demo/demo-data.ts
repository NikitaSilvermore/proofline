// Hardcoded fake roster for the public /console/demo route. NO database access —
// this can never leak a real student row, and a fixed `now` keeps screenshots
// stable. Shaped as buildConsole()'s input so the demo renders through the exact
// same view-model + component as the live console (just with actions inert).

import type {
  CStudent,
  CBaseline,
  CCheckin,
  CMilestone,
  CFlag,
  CEvent,
} from "@/lib/console";

const DAY = 24 * 60 * 60 * 1000;
export const demoNow = new Date("2026-09-14T09:00:00Z"); // a fixed Monday
const ago = (d: number) => new Date(demoNow.getTime() - d * DAY).toISOString();

// A completed check-in.
const done = (
  student_id: string,
  week_no: number,
  daysAgo: number,
  metric_value: number,
): CCheckin => ({
  student_id,
  week_no,
  sent_at: ago(daysAgo + 0.1),
  completed_at: ago(daysAgo),
  metric_value,
});
// A sent-but-not-completed check-in (a miss).
const missed = (student_id: string, week_no: number, daysAgo: number): CCheckin => ({
  student_id,
  week_no,
  sent_at: ago(daysAgo),
  completed_at: null,
  metric_value: null,
});
const rail = (n: number): CMilestone[] =>
  Array.from({ length: 8 }, (_, i) => ({ student_id: "", state: i < n ? "done" : "todo" }));
const railFor = (id: string, n: number): CMilestone[] =>
  rail(n).map((m) => ({ ...m, student_id: id }));

const students: CStudent[] = [];
const baselines: CBaseline[] = [];
const checkins: CCheckin[] = [];
const milestones: CMilestone[] = [];
const flags: CFlag[] = [];
const events: CEvent[] = [];

function add(opts: {
  id: string;
  name: string;
  enrolledDaysAgo: number;
  intakeDone?: boolean;
  baseline: number | null;
  checkins: CCheckin[];
  milestonesDone: number;
  rag: "red" | "amber" | "green" | "none";
  reasons: string[];
  events?: CEvent[];
}) {
  students.push({
    id: opts.id,
    name: opts.name,
    token: `demo-${opts.id}`,
    status: "active",
    enrolled_at: ago(opts.enrolledDaysAgo),
    intake_completed_at: opts.intakeDone === false ? null : ago(opts.enrolledDaysAgo - 0.2),
  });
  baselines.push({ student_id: opts.id, monthly_revenue: opts.baseline });
  checkins.push(...opts.checkins);
  milestones.push(...railFor(opts.id, opts.milestonesDone));
  flags.push({ student_id: opts.id, rag: opts.rag, reasons: opts.reasons });
  if (opts.events) events.push(...opts.events);
}

const earned = (id: string, label: string, daysAgo: number): CEvent => ({
  student_id: id,
  type: "milestone_earned",
  payload: { label },
  created_at: ago(daysAgo),
});

// ── GREENS ──────────────────────────────────────────────────────────────────
add({
  id: "jordan",
  name: "Jordan Ellis",
  enrolledDaysAgo: 63,
  baseline: 6400,
  checkins: [
    done("jordan", 4, 35, 1200),
    done("jordan", 6, 21, 2500),
    done("jordan", 8, 7, 2500),
    done("jordan", 9, 2, 2500),
  ],
  milestonesDone: 5,
  rag: "green",
  reasons: ["Confidence trending up", "Value confirmed this week", "9 check-ins logged"],
  events: [earned("jordan", "First paid gig", 4)],
});
add({
  id: "amara",
  name: "Amara Okafor",
  enrolledDaysAgo: 120,
  baseline: 9000,
  checkins: [done("amara", 14, 14, 4000), done("amara", 15, 6, 5500)],
  milestonesDone: 7,
  rag: "green",
  reasons: ["Value confirmed this week", "15 check-ins logged"],
  events: [earned("amara", "Fee target hit", 5)],
});
add({
  id: "ben",
  name: "Ben Carter",
  enrolledDaysAgo: 47,
  baseline: 3200,
  checkins: [done("ben", 5, 12, 0), done("ben", 6, 4, 1500)],
  milestonesDone: 4,
  rag: "green",
  reasons: ["Confidence trending up", "6 check-ins logged"],
  events: [earned("ben", "First booking", 3)],
});
add({
  id: "chloe",
  name: "Chloe Kim",
  enrolledDaysAgo: 30,
  baseline: 5000,
  checkins: [done("chloe", 3, 9, 0), done("chloe", 4, 3, 800)],
  milestonesDone: 3,
  rag: "green",
  reasons: ["4 check-ins logged"],
});
add({
  id: "ravi",
  name: "Ravi Patel",
  enrolledDaysAgo: 82,
  baseline: 7500,
  checkins: [done("ravi", 10, 10, 3000), done("ravi", 11, 5, 3000)],
  milestonesDone: 6,
  rag: "green",
  reasons: ["Value confirmed this week", "11 check-ins logged"],
});

// ── AMBERS ──────────────────────────────────────────────────────────────────
add({
  id: "leo",
  name: "Leo Tran",
  enrolledDaysAgo: 54,
  baseline: 4200,
  checkins: [done("leo", 5, 21, 0), done("leo", 6, 14, 0), done("leo", 7, 6, 0)],
  milestonesDone: 3,
  rag: "amber",
  reasons: ["No stages pitched for 3 weeks"],
});
add({
  id: "sofia",
  name: "Sofia Reyes",
  enrolledDaysAgo: 38,
  baseline: 2800,
  checkins: [done("sofia", 3, 15, 500), missed("sofia", 4, 8), done("sofia", 5, 5, 900)],
  milestonesDone: 2,
  rag: "amber",
  reasons: ["1 missed check-in"],
});

// ── REDS ────────────────────────────────────────────────────────────────────
add({
  id: "marcus",
  name: "Marcus Webb",
  enrolledDaysAgo: 9,
  intakeDone: false,
  baseline: null,
  checkins: [],
  milestonesDone: 0,
  rag: "red",
  reasons: ["Intake incomplete after 7 days — refund window"],
});
add({
  id: "dana",
  name: "Dana Cross",
  enrolledDaysAgo: 66,
  baseline: 5500,
  checkins: [
    done("dana", 5, 35, 1000),
    missed("dana", 6, 21),
    missed("dana", 7, 14),
    missed("dana", 8, 7),
  ],
  milestonesDone: 3,
  rag: "red",
  reasons: ["3 consecutive missed check-ins"],
});
add({
  id: "priya",
  name: "Priya Shah",
  enrolledDaysAgo: 90,
  baseline: 8200,
  checkins: [done("priya", 11, 12, 0), done("priya", 12, 5, 0)],
  milestonesDone: 5,
  rag: "red",
  reasons: ['Confidence dropped 5 points', 'Same blocker 3 weeks running: "Pricing my talk"'],
});

export const demoInput = {
  students,
  baselines,
  checkins,
  milestones,
  flags,
  events,
  now: demoNow,
};
