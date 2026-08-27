"use client";

import { Users, Calendar, Code2, Presentation } from "lucide-react";

// Editorial reference treatment: asymmetric section rhythm, quiet rules, and typography-led proof.
const stats = [
  { value: "75+", label: "Members", description: "Active innovators, designers, and developers", icon: Users },
  { value: "10+", label: "Programs", description: "Workshops, hackathons, and technical bootcamps", icon: Calendar },
  { value: "5+", label: "Projects", description: "Built, deployed, and scaled across domains", icon: Code2 },
  { value: "5+", label: "Upcoming Industry Sessions", description: "", icon: Presentation },
];

export function ImpactSection() {
  return (
    <section className="reference-editorial-section relative overflow-hidden px-4 py-24 text-white sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div>
            <p className="reference-editorial-label">Our Impact</p>
            <h2 className="mt-5 max-w-xl text-4xl font-semibold tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl">
              More Than a Club. <span className="text-white/45">A Community in Motion.</span>
            </h2>
            <p className="mt-7 max-w-md text-base leading-7 text-white/55">
              Empowering students to step outside the classroom and build real solutions that matter.
            </p>
          </div>

          <div className="grid grid-cols-1 border-t border-white/12 sm:grid-cols-2">
            {stats.map(({ value, label, description, icon: Icon }, index) => (
              <article key={label} className="group border-b border-white/12 py-7 sm:border-r sm:px-7 sm:first:pl-0 sm:nth-[2n]:border-r-0 lg:py-9">
                <div className="flex items-start justify-between gap-5">
                  <span className="text-6xl font-semibold tracking-[-0.08em] text-white transition-colors group-hover:text-[#b8a7ff] sm:text-7xl">{value}</span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/55"><Icon className="h-4 w-4" /></span>
                </div>
                <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-white/82">{label}</p>
                {description && <p className="mt-3 max-w-xs text-sm leading-6 text-white/45">{description}</p>}
                <p className="mt-7 text-xs font-mono text-white/28">0{index + 1} / AURIX</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
