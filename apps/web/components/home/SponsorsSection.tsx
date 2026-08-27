"use client";

import { ArrowUpRight } from "lucide-react";

const sponsors = [
  { name: "Supabase", category: "Infrastructure Partner", tag: "Database & Auth" },
  { name: "Vercel", category: "Cloud & Deployment", tag: "Next.js & Edge" },
  { name: "GitHub", category: "Developer Community", tag: "Open Source" },
  { name: "AWS Educate", category: "Cloud Credits", tag: "Compute & AI" },
  { name: "Intel AI Labs", category: "Research Sponsor", tag: "Hardware & Vision" },
  { name: "Postman", category: "API Partner", tag: "Tooling & Training" },
];

export function SponsorsSection() {
  return (
    <section className="reference-editorial-section px-4 py-24 text-white sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
          <div>
            <p className="reference-editorial-label">Partners &amp; Sponsors</p>
            <h2 className="mt-5 max-w-md text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">Backed by People Who Believe in What We Build</h2>
          </div>
          <div>
            <p className="max-w-xl text-base leading-7 text-white/52">Organizations, developer networks, and technology companies empowering the next generation of builders.</p>
            <div className="mt-10 grid grid-cols-2 border-t border-white/12 sm:grid-cols-3">
              {sponsors.map((sponsor) => (
                <div key={sponsor.name} className="group border-b border-r border-white/12 px-4 py-7 first:pl-0 sm:px-6 sm:py-8 [&:nth-child(3n)]:border-r-0">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-lg font-semibold text-white/88 transition-colors group-hover:text-white">{sponsor.name}</span>
                    <ArrowUpRight className="h-4 w-4 text-white/25 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white/70" />
                  </div>
                  <p className="mt-4 text-xs uppercase tracking-[0.14em] text-white/42">{sponsor.category}</p>
                  <p className="mt-2 text-sm text-white/55">{sponsor.tag}</p>
                </div>
              ))}
            </div>
            <p className="mt-9 text-sm text-white/48">Interested in partnering with AURIX? <a href="mailto:sponsors@aurix.club" className="text-white underline decoration-white/35 underline-offset-4 hover:decoration-white">Connect with our Sponsorships Team →</a></p>
          </div>
        </div>
      </div>
    </section>
  );
}
