# CLAUDE CODE — KICKOFF PROMPT (Milestamp)

Point a fresh code session at the law in the right order before it touches
anything. Everything below is already committed in this repo — **read it there.
The repo at HEAD is the source of truth; project attachments are not.** Never
copy a Claude-project attachment over a repo doc.

**Read first, in this order (all in-repo; do not skip):**
`docs/BUILD_SPEC.md` (LAW — scope, data model, routes, flows, security) →
`docs/PRICING.md` (LAW — pricing source of truth) →
`docs/RISK-REGISTER.md` (SPEC — threat register + strike-order; it reordered the
roadmap) → `AGENTS.md` (BRAIN — live state, roster, roadmap, commands, gotchas,
working style, and "THE SECOND CORPUS" standing rule).

## The laws (violating one fails the task, no exceptions)

- **The student progress page + its glowing revenue graph are PERFECT — do NOT
  restyle them without being asked** (Nikita has said so twice; `RevenueChart.tsx`
  is frozen).
- **Design = "Midnight & Brass"** across every surface (deep ink ground, glowing
  brass/gold, glassy panels). The console carries extra glow.
- **No student logins, ever** — access is signed, unguessable link tokens. **No
  LLM calls in v1** — flags are rule-based (`rag.ts`), the case-study draft is
  template interpolation.
- **Single-tenant NLS pilot** — everything hardcoded to NLS. Students only ever
  see **NLS Mentorship** branding; the product name "Milestamp" is internal/brand
  only.
- **Nothing sends to students live yet** (`MESSAGING_PROVIDER=log`), and **no real
  NLS student enrols before the dog-food gate + both signed papers** (see the
  roadmap in AGENTS.md).
- **Pushing to `main` IS deploying** (Vercel auto-deploy) — `npm run build` must be
  green first, and deploy/merge is Nikita's call.

## Stack (do not get this wrong)

**Next.js (App Router, TypeScript) · Supabase · Tailwind · Vercel + Vercel Cron**
— deploys via the Vercel team **"silvermore"**. **NOT Expo, NOT React Native**
(that's the other app, Wordhoard). Repo is `github.com/NikitaSilvermore/proofline`
(folder/URL still "proofline"; product is Milestamp). Commits must be authored
`nikita.silvermore@outlook.com` or Vercel silently blocks the deploy (AGENTS.md →
git identity).

Check battery green before every push: `npm run build`, `npm run lint`. Commit per
completed piece with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

## After any doc change

Re-run `node scripts/sync-claude-project.mjs` and re-upload the whole
`milestamp-claude-project/` folder to the Milestamp Claude project, in the same
turn (AGENTS.md → "THE SECOND CORPUS").
