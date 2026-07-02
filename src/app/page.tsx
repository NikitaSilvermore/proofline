// Milestone 1 hello page (BUILD_SPEC.md §8.1). Purpose: prove the deploy
// pipeline end-to-end — a live URL that renders with the demo design tokens.
// Real surfaces (/intake, /p, /checkin, /console) land in later milestones.

const envReady =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-8 px-6 py-16">
      <div>
        <span className="font-mono text-[11px] uppercase tracking-wider text-gold-deep">
          NLS Mentorship pilot
        </span>
        <h1 className="mt-3 font-display text-5xl font-extrabold text-ink">
          Proofline
        </h1>
        <p className="mt-4 max-w-md text-lg text-muted">
          Progress, proof, and payoff for every student — one weekly loop at a
          time. This is the deploy skeleton; the real thing is being built in
          milestone order.
        </p>
      </div>

      <div className="rounded-xl border border-line bg-card p-5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-wide text-muted">
            Skeleton health
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-green-soft px-3 py-1 font-mono text-xs font-semibold text-green">
            <span className="h-2 w-2 rounded-full bg-green" /> deployed
          </span>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-muted">Framework</dt>
            <dd className="font-medium text-text">Next.js (App Router)</dd>
          </div>
          <div>
            <dt className="text-muted">Data</dt>
            <dd className="font-medium text-text">Supabase</dd>
          </div>
          <div>
            <dt className="text-muted">Supabase env</dt>
            <dd className="font-medium text-text">
              {envReady ? "configured" : "not set"}
            </dd>
          </div>
          <div>
            <dt className="text-muted">Milestone</dt>
            <dd className="font-medium text-text">1 · skeleton</dd>
          </div>
        </dl>
      </div>
    </main>
  );
}
