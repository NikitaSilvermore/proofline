import type { Config } from "tailwindcss";

// Design tokens ported verbatim from the three demo HTML files in /design-reference/.
// These are the visual contract — do not drift from them (BUILD_SPEC.md §2, §11).
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0E1A2B",
          2: "#16263C",
          3: "#1E3049",
        },
        paper: "#F6F7F5",
        card: "#FFFFFF",
        gold: {
          DEFAULT: "#C6A15B",
          deep: "#A8863F",
          soft: "#F3EAD8",
        },
        green: {
          DEFAULT: "#177A53",
          soft: "#E4F2EB",
        },
        amber: {
          DEFAULT: "#B9791B",
          soft: "#F8EEDC",
        },
        red: {
          DEFAULT: "#B8433A",
          soft: "#F8E8E6",
        },
        text: "#24344D",
        muted: "#64748B",
        line: "#E4E7EC",
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', '"Avenir Next"', '"Segoe UI"', "sans-serif"],
        body: ['"Schibsted Grotesk"', "-apple-system", '"Segoe UI"', "Roboto", "sans-serif"],
        mono: ['"Spline Sans Mono"', "ui-monospace", '"SF Mono"', "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
