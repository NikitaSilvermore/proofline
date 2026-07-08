# Proofline (product name: **Milestamp**) — working notes for Claude Code

**Read [BUILD_SPEC.md](BUILD_SPEC.md) before any task.** It is the source of truth
for scope, data model, routes, flows, and security. This file's "Current
state" section is the session-to-session briefing — **update it whenever a
milestone lands or the state changes.**

- **Design reference lives in [`/design-reference/`](design-reference/).** The three
  demo HTML files are the pixel-level visual contract — port their tokens
  (colours, fonts, spacing) exactly. Tokens are already mapped in
  `tailwind.config.ts` and `src/app/globals.css`.
- **Work in BUILD_SPEC §8 milestone order**, one milestone per session. Each session
  ends with the milestone's Definition of Done demonstrated locally and deployed.
- **Commit small, deploy often.** Record any deviation from the spec in
  [DECISIONS.md](DECISIONS.md).
- **Security is non-negotiable** (§7): student access is signed tokens only (no
  logins); console is magic-link auth on an email allowlist; RLS on every table;
  no payment data ever; the service-role key is server-only.
- No LLM calls in v1 — flags are rule-based (§5), the case-study draft is template
  interpolation (§6.3).

## Stack
Next.js (App Router, TypeScript) · Supabase (Postgres + RLS + auth) · Tailwind ·
GHL for delivery (Resend fallback) · Vercel + Vercel Cron.

## Commands
- `npm run dev` — local dev server
- `npm run build` — production build (must pass before deploy)
- `npm run lint` — lint

## Current state (as of 2026-07-08)

- **Product renamed to Milestamp** (repo/folder still "Proofline").
- **§8 milestones 1–7 are DONE**: deploy skeleton, schema+seeds, intake,
  progress page ("The Dossier" treatment), weekly check-in loop + cron,
  team console (Supabase magic-link + `team_allowlist` gate), and
  messaging/enrolment — **CRM swapped from GHL to Close (close.com)**, see
  DECISIONS.md 2026-07-03. Message rail `src/lib/messaging.ts` defaults to
  `MESSAGING_PROVIDER=log` (nothing sends live) until Close env +
  `/api/webhooks/close` are configured; checklist in README.
- **Design**: "Midnight & Brass" dark treatment applied across progress
  page, intake/check-in wizards, console, and hello page.
- **Known quirk**: Hotmail blocks/junks console magic-link mail — a Gmail
  owner address was added to the allowlist; prefer Gmail for console login.
- **Remaining**: wire Close live (env + webhook → §8.7 DoD: a real
  enrolment produces a live intake email untouched), then **Milestone 8 —
  dog-food week gate** (Nikita + Becky live one full weekly cycle; no real
  NLS student before this passes). Status write-back (§6.4) still a
  deferred nice-to-have; §10 deferrals unchanged.
