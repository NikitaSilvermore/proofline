import type { Metadata } from "next";
import { buildConsole } from "@/lib/console";
import Console from "../Console";
import { demoInput } from "./demo-data";

// Public, login-free DEMO of the support console (no auth gate, no database).
// Renders a hardcoded fake roster through the real buildConsole() + <Console>,
// with every action inert (demo mode). Safe to share / screenshot — no real
// student data is ever reachable here. The real console at /console stays gated.

export const metadata: Metadata = {
  title: "Console demo · Milestamp for NLS Mentorship",
  robots: { index: false, follow: false },
};

// Fully static — the data and `now` are fixed, so this caches and never drifts.
export const dynamic = "force-static";

export default function ConsoleDemoPage() {
  const view = buildConsole(demoInput);
  return <Console view={view} demo />;
}
