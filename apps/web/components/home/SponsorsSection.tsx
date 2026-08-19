"use client";

import { Award } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";

export function SponsorsSection() {
  const sponsors = [
    {
      name: "Supabase",
      category: "Infrastructure Partner",
      tag: "Database & Auth",
    },
    {
      name: "Vercel",
      category: "Cloud & Deployment",
      tag: "Next.js & Edge",
    },
    {
      name: "GitHub",
      category: "Developer Community",
      tag: "Open Source",
    },
    {
      name: "AWS Educate",
      category: "Cloud Credits",
      tag: "Compute & AI",
    },
    {
      name: "Intel AI Labs",
      category: "Research Sponsor",
      tag: "Hardware & Vision",
    },
    {
      name: "Postman",
      category: "API Partner",
      tag: "Tooling & Training",
    },
  ];

  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] bg-black/20 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <ScrollReveal direction="up" duration={0.8} distance={24}>
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-300">
              <Award className="h-3.5 w-3.5" />
              <span>Partners & Sponsors</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Backed by People Who Believe in What We Build
            </h2>
            <p className="text-base sm:text-lg text-zinc-400">
              Organizations, developer networks, and technology companies empowering the next generation of builders.
            </p>
          </div>
        </ScrollReveal>

        {/* Clean Modern Sponsor Grid */}
        <StaggerContainer
          staggerDelay={0.08}
          delayChildren={0.1}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6"
        >
          {sponsors.map((sponsor) => (
            <StaggerItem key={sponsor.name} duration={0.7} distance={20}>
              <div className="group relative h-full flex flex-col items-center justify-center p-6 rounded-2xl glass-card border border-white/[0.06] hover:border-white/25 transition-all duration-500 hover:bg-white/[0.04] hover:-translate-y-1.5 text-center">
                {/* Monogram / Brand Icon */}
                <div className="h-11 w-11 mb-3 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center font-mono font-bold text-sm text-zinc-300 group-hover:scale-110 group-hover:border-blue-500/50 group-hover:text-white transition-all duration-300">
                  {sponsor.name.slice(0, 2).toUpperCase()}
                </div>

                <div className="font-bold text-sm sm:text-base text-zinc-200 group-hover:text-white transition-colors">
                  {sponsor.name}
                </div>

                <div className="text-[11px] text-zinc-400 mt-1">
                  {sponsor.category}
                </div>

                <span className="mt-3 inline-block text-[10px] font-mono text-zinc-400 bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.05]">
                  {sponsor.tag}
                </span>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Sponsor Callout */}
        <ScrollReveal direction="up" delay={0.2} duration={0.7}>
          <div className="mt-14 text-center">
            <p className="text-xs sm:text-sm text-zinc-400">
              Interested in partnering with AURIX?{" "}
              <a
                href="mailto:sponsors@aurix.club"
                className="font-medium text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors"
              >
                Connect with our Sponsorships Team →
              </a>
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
