// Fake-clock helper (BUILD_SPEC.md §11): "testing weekly logic in real time is
// misery." Everything time-dependent — the weekly cron, streaks, RAG windows —
// must read "now" through this, never `new Date()` directly, so tests can jump
// the clock forward days/weeks without waiting.

let override: Date | null = null;

/** Current time. Returns the override when set, else the real clock. */
export function now(): Date {
  return override ? new Date(override) : new Date();
}

/** Pin the clock to a fixed instant (tests / local weekly-loop rehearsal). */
export function setNow(instant: Date | string | number): void {
  override = new Date(instant);
}

/** Advance the pinned clock. No-op if the clock isn't currently overridden. */
export function advance(ms: number): void {
  if (override) override = new Date(override.getTime() + ms);
}

/** Convenience: advance by whole days. */
export function advanceDays(days: number): void {
  advance(days * 24 * 60 * 60 * 1000);
}

/** Drop the override and return to the real system clock. */
export function resetClock(): void {
  override = null;
}

/** True when a fake time is pinned — guard test-only code paths with this. */
export function isOverridden(): boolean {
  return override !== null;
}
