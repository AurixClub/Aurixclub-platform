import type { Metadata } from "next";
import "./globals.css";

// Reference fidelity: the Hero-inspired global frame is shared by every route.
// It is visual-only and does not change page content, routing, auth, or backend behavior.

export const metadata: Metadata = {
  title: "AURIX | Advanced Robotics & Innovation Club",
  description: "Official portal for the AURIX club.",
};

function HeroInspiredFrame() {
  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden" aria-hidden="true">
      <div className="hero-global-grid absolute inset-0 opacity-70" />
      <div className="hero-global-vignette absolute inset-0" />
      <div className="hero-global-orbit hero-global-orbit-one absolute" />
      <div className="hero-global-orbit hero-global-orbit-two absolute" />
      <div className="hero-global-beam hero-global-beam-one absolute" />
      <div className="hero-global-beam hero-global-beam-two absolute" />
      <div className="hero-global-node hero-global-node-one absolute" />
      <div className="hero-global-node hero-global-node-two absolute" />
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try { const isLight = localStorage.getItem("aurix-theme") === "light"; document.documentElement.dataset.theme = isLight ? "light" : "dark"; document.documentElement.classList.toggle("dark", !isLight); } catch (_) { document.documentElement.dataset.theme = "dark"; document.documentElement.classList.add("dark"); } })();`,
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <HeroInspiredFrame />
        <div className="relative z-20 isolate">{children}</div>
      </body>
    </html>
  );
}
