// Intake option sets. Labels are exactly the demo's; values map to the DB enums
// (BUILD_SPEC.md §4). Keeping this in one place so the form, the server action,
// and the locked stamp all agree.

export const TRACK_OPTIONS = [
  { value: "paid_speaker", label: "Get paid to speak", short: "Paid speaker" },
  { value: "win_clients", label: "Win clients", short: "Win clients" },
  { value: "sell_programme", label: "Sell my programme", short: "Sell programme" },
  { value: "raise_funds", label: "Raise funds", short: "Raise funds" },
  { value: "grow_audience", label: "Grow my audience", short: "Grow audience" },
] as const;

export type TrackValue = (typeof TRACK_OPTIONS)[number]["value"];

export const TRACK_VALUES = TRACK_OPTIONS.map((t) => t.value);

export function trackShort(value: string | null | undefined): string {
  return TRACK_OPTIONS.find((t) => t.value === value)?.short ?? "—";
}

export const BLOCKER_OPTIONS = [
  "Finding stages",
  "Getting booked",
  "My talk",
  "Fees",
  "Stage nerves",
  "Time",
] as const;

// Slider caption text, ported from the demo script.
export const GIGS_WORDS = [
  "Not yet paid — that changes now",
  "One — the seal is broken",
  "A couple — the door is open",
  "A few — momentum starting",
  "Getting booked — now for the fees",
  "Working the circuit",
  "Working the circuit",
  "Regularly booked — now scale the fee",
  "Regularly booked — now scale the fee",
  "A busy speaker already",
  "A busy speaker already",
];

export const CONFIDENCE_WORDS: Record<number, string> = {
  1: "Rough waters",
  2: "Rough waters",
  3: "Finding your feet",
  4: "Finding your feet",
  5: "Steady, building",
  6: "Steady, building",
  7: "Warming up nicely",
  8: "Owning the room",
  9: "Owning the room",
  10: "Unstoppable",
};

/** "$ 6,400" / "6400" / "6,400" → 6400. Returns null for blank/garbage. */
export function parseMoney(raw: string): number | null {
  const digits = raw.replace(/[^0-9]/g, "");
  if (!digits) return null;
  return Number(digits);
}

/** 6400 → "$6,400". */
export function formatMoney(n: number | null | undefined): string {
  if (n == null) return "—";
  return "$" + n.toLocaleString("en-US");
}
