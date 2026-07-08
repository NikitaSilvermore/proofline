// Milestone 1 hello page (BUILD_SPEC.md §8.1) — now in the Midnight & Brass
// visual language. Proves the deploy pipeline; real surfaces live at
// /intake, /p, /checkin, /console.

const envReady =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const shell: React.CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(90% 50% at 78% -8%, rgba(198,161,91,0.16), transparent 60%), linear-gradient(180deg, #0e1a2b 0%, #0a1119 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
};

export default function Home() {
  return (
    <main style={shell}>
      <div style={{ width: "100%", maxWidth: "40rem" }}>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#d8b978",
          }}
        >
          NLS Mentorship pilot
        </span>
        <h1
          style={{
            marginTop: 16,
            fontFamily: "var(--display)",
            fontWeight: 800,
            fontSize: "clamp(44px, 8vw, 72px)",
            lineHeight: 1,
            letterSpacing: "-0.03em",
            color: "#fff",
          }}
        >
          Milestamp
        </h1>
        <p
          style={{
            marginTop: 18,
            maxWidth: "32rem",
            fontSize: "18px",
            lineHeight: 1.6,
            color: "#92a2b8",
          }}
        >
          Progress, proof, and payoff for every student — one weekly loop at a time.
        </p>

        <div
          style={{
            marginTop: 36,
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.035)",
            backdropFilter: "blur(6px)",
            padding: "22px 24px",
            boxShadow: "0 24px 60px -30px rgba(0,0,0,0.7)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#6b7d95",
              }}
            >
              Skeleton health
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                borderRadius: 999,
                background: "rgba(23,122,83,0.2)",
                color: "#6ee0ac",
                padding: "5px 12px",
                fontFamily: "var(--mono)",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#6ee0ac",
                  boxShadow: "0 0 8px 1px rgba(110,224,172,0.7)",
                }}
              />
              deployed
            </span>
          </div>
          <dl
            style={{
              marginTop: 18,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
              fontSize: 14,
            }}
          >
            {[
              ["Framework", "Next.js (App Router)"],
              ["Data", "Supabase"],
              ["Supabase env", envReady ? "configured" : "not set"],
              ["Milestone", "1 · skeleton"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt style={{ color: "#6b7d95" }}>{k}</dt>
                <dd style={{ fontWeight: 500, color: "#eef2f8", marginTop: 2 }}>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </main>
  );
}
