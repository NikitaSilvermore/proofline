# Decisions

Log anything that deviates from or clarifies BUILD_SPEC.md. Newest first.

## 2026-07-02 — Milestone 1: repo + deploy skeleton

- **Spec file renamed** `proofline_v1_build_spec.md` → `BUILD_SPEC.md` to match the
  name §11 refers to.
- **Supabase env vars are `NEXT_PUBLIC_` prefixed** (`NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`) rather than the bare names in §9. Next.js only
  exposes `NEXT_PUBLIC_*` vars to the browser, which the anon client needs. The
  service-role key keeps its bare, server-only name (`SUPABASE_SERVICE_ROLE_KEY`).
- **Tailwind v3** (not v4) for a stable, well-understood config; demo tokens mapped
  in `tailwind.config.ts` and mirrored as CSS variables in `globals.css`.
- **Fonts loaded via Google Fonts `<link>`** in `layout.tsx`, exactly as the demos
  do, to keep the visual contract identical.
- **Deploy is a manual step for the repo owner.** This session builds and verifies
  the skeleton locally; connecting the repo to Vercel + setting env vars must be
  done by Nikita (needs Vercel auth). See README "Deploy" section. Milestone 1 DoD
  ("live URL exists") completes once that connect step runs.
