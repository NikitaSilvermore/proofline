import type { ChartPoint } from "@/lib/progress";

// Pure SVG line/area chart of cumulative confirmed value, built from the check-in
// series (BUILD_SPEC.md §3). Always renders with the $0 start point, so even one
// check-in draws a clean two-point line — never a broken single dot.

const W = 560;
const H = 240;
const X_LEFT = 60;
const X_RIGHT = 540;
const Y_TOP = 45;
const Y_BOTTOM = 205;

function money(n: number): string {
  if (n >= 1000) return "$" + (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + "k";
  return "$" + n;
}

export default function RevenueChart({
  chart,
  chartMax,
}: {
  chart: ChartPoint[];
  chartMax: number;
}) {
  const n = chart.length;
  const x = (i: number) =>
    n <= 1 ? X_RIGHT : X_LEFT + (i / (n - 1)) * (X_RIGHT - X_LEFT);
  const y = (v: number) =>
    Y_BOTTOM - (v / chartMax) * (Y_BOTTOM - Y_TOP);

  const pts = chart.map((p, i) => ({ px: x(i), py: y(p.value), ...p }));
  const line = pts.map((p) => `${p.px},${p.py}`).join(" ");
  const area =
    `${pts[0].px},${Y_BOTTOM} ` +
    pts.map((p) => `${p.px},${p.py}`).join(" ") +
    ` ${pts[n - 1].px},${Y_BOTTOM}`;

  const last = pts[n - 1];
  const gridVals = [1, 0.75, 0.5, 0.25].map((f) => chartMax * f);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="auto"
      role="img"
      aria-label="Confirmed value from the stage, by week"
    >
      <defs>
        <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D8B978" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#D8B978" stopOpacity="0" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* gridlines + y labels */}
      <g stroke="rgba(255,255,255,0.09)" strokeWidth={1}>
        {gridVals.map((v, i) => {
          const gy = y(v);
          return <line key={i} x1={40} y1={gy} x2={545} y2={gy} />;
        })}
      </g>
      <g fontFamily="Spline Sans Mono, monospace" fontSize={11} fill="#6b7d95">
        {gridVals.map((v, i) => (
          <text key={i} x={6} y={y(v) + 4}>
            {money(Math.round(v))}
          </text>
        ))}
      </g>

      {/* area + line */}
      <polygon points={area} fill="url(#fillGrad)" />
      <polyline
        points={line}
        fill="none"
        stroke="#D8B978"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
      />

      {/* points */}
      <g fill="#D8B978">
        {pts.slice(0, -1).map((p, i) => (
          <circle key={i} cx={p.px} cy={p.py} r={3.5} opacity={0.7} />
        ))}
      </g>
      <circle cx={last.px} cy={last.py} r={6.5} fill="#D8B978" stroke="#0a1119" strokeWidth={2.5} filter="url(#glow)" />

      {/* x labels */}
      <g
        fontFamily="Spline Sans Mono, monospace"
        fontSize={11.5}
        fill="#6b7d95"
        textAnchor="middle"
      >
        {pts.map((p, i) => (
          <text
            key={i}
            x={p.px}
            y={226}
            fill={i === n - 1 ? "#D8B978" : "#6b7d95"}
            fontWeight={i === n - 1 ? 700 : 400}
          >
            {p.label}
          </text>
        ))}
      </g>
      <text
        x={last.px}
        y={last.py - 14}
        textAnchor="middle"
        fontFamily="Spline Sans Mono, monospace"
        fontSize={13}
        fontWeight={700}
        fill="#D8B978"
      >
        {"$" + last.value.toLocaleString("en-US")}
      </text>
    </svg>
  );
}
