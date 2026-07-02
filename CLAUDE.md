# Proofline — working notes for Claude Code

**Read [BUILD_SPEC.md](BUILD_SPEC.md) before any task.** It is the source of truth
for scope, data model, routes, flows, and security.

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
