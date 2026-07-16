import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Milestamp",
  description: "NLS Mentorship pilot — progress, proof, and payoff.",
};

// Demo fonts (Bricolage Grotesque / Schibsted Grotesk / Spline Sans Mono) are
// loaded from Google Fonts, matching the docs/mockups/ demos exactly.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Schibsted+Grotesk:wght@400;500;600;700&family=Spline+Sans+Mono:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
