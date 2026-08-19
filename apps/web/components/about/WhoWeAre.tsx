"use client";

import React from "react";
import { Users2, Lightbulb, Compass, Code, Rocket } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";

export function WhoWeAre() {
  const highlights = [
    {
      icon: Code,
      title: "Technical Projects",
      desc: "Real-world engineering, open-source software, and hardware prototyping.",
    },
    {
      icon: Lightbulb,
      title: "Research & Innovation",
      desc: "Exploration of emerging tech, AI breakthroughs, and scientific publications.",
    },
    {
      icon: Rocket,
      title: "Student Entrepreneurship",
      desc: "Incubating ideas into startup prototypes and venture opportunities.",
    },
    {
      icon: Compass,
      title: "Community & Connections",
      desc: "Cross-disciplinary collaboration and mentorship from industry leaders.",
    },
  ];

  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] bg-black/20 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column Text */}
          <div className="lg:col-span-6 space-y-6">
            <ScrollReveal direction="left" duration={0.8} distance={30}>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-xs font-medium text-indigo-300">
                <Users2 className="h-3.5 w-3.5" />
                <span>Who We Are</span>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="left" duration={0.85} delay={0.1} distance={30}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                Built by Students. <br />
                <span className="text-gradient-primary">Driven by Curiosity.</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal direction="left" duration={0.85} delay={0.2} distance={25}>
              <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
                AURIX brings together students from different backgrounds and interests who share one thing — <span className="text-white font-medium">the desire to create</span>.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="left" duration={0.85} delay={0.3} distance={20}>
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                From technical projects and research to entrepreneurship, industry connections, and community initiatives, AURIX provides a space where students can turn their ideas into action.
              </p>
            </ScrollReveal>
          </div>

          {/* Right Column Cards */}
          <div className="lg:col-span-6">
            <StaggerContainer
              staggerDelay={0.12}
              delayChildren={0.15}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <StaggerItem key={item.title} duration={0.75} distance={25}>
                    <div className="h-full rounded-2xl glass-card p-6 border border-white/[0.06] hover:border-white/20 transition-all duration-500 hover:-translate-y-1.5 group">
                      <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 w-fit mb-4 group-hover:scale-110 group-hover:bg-blue-500/10 group-hover:border-blue-500/30 transition-all duration-300">
                        <Icon className="h-5 w-5 text-blue-400" />
                      </div>
                      <h3 className="text-base font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
