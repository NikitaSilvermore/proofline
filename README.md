# Proofline

NLS Mentorship pilot — progress, proof, and payoff for every student.
Single-tenant, 90-day pilot. See [BUILD_SPEC.md](BUILD_SPEC.md) for the full spec
and [CLAUDE.md](CLAUDE.md) for the working protocol.

**Stack:** Next.js (App Router, TypeScript) · Supabase · Tailwind · GHL delivery ·
Vercel + Vercel Cron.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in Supabase + GHL + secrets (see §9)
npm run dev                  # http://localhost:3000
```

`npm run build` must pass before every deploy.

## Deploy (Vercel)

Milestone 1's Definition of Done is "a live URL exists". The code is ready; the
one-time connect step needs your Vercel account:

1. Push this repo to GitHub (or run `npx vercel` from the repo root).
2. In Vercel, **Import Project** and select the repo. Framework auto-detects as
   Next.js — no build settings to change.
3. Add the environment variables from [`.env.example`](.env.example) in
   **Project → Settings → Environment Variables**.
4. Deploy. The hello page at `/` confirms the pipeline is live end-to-end.

> **Deploy first, build second** (BUILD_SPEC.md §8) — get the live URL working now
> so deployment is never the last-mile surprise.

## Project layout

```
src/app/            App Router pages (hello page today; real surfaces per §3)
src/lib/supabase/   Supabase clients (browser, server, service-role)
design-reference/   The three demo HTML files — the visual contract (§11)
BUILD_SPEC.md       Source of truth
DECISIONS.md        Deviations from the spec, newest first
```
