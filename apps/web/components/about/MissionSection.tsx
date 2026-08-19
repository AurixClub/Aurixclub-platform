"use client";

import React from "react";
import { BookOpen, Hammer, Compass, Target } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";

export function MissionSection() {
  const pillars = [
    {
      title: "Learn",
      tagline: "Knowledge in Action",
      description:
        "Explore new technologies, develop practical skills, and learn from peers and industry professionals.",
      icon: BookOpen,
      color: "from-blue-500/20 to-cyan-500/20",
      accent: "text-blue-400",
      borderColor: "hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
      badge: "01 / FOUNDATION",
    },
    {
      title: "Build",
      tagline: "Hands-on Engineering",
      description:
        "Turn ideas into projects, experiments, and solutions that solve real problems.",
      icon: Hammer,
      color: "from-indigo-500/20 to-purple-500/20",
      accent: "text-indigo-400",
      borderColor: "hover:border-indigo-500/40 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]",
      badge: "02 / EXECUTION",
    },
    {
      title: "Lead",
      tagline: "Empowering Communities",
      description:
        "Take initiative, collaborate with others, and create opportunities for the community around you.",
      icon: Compass,
      color: "from-purple-500/20 to-pink-500/20",
      accent: "text-purple-400",
      borderColor: "hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]",
      badge: "03 / IMPACT",
    },
  ];

  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] bg-gradient-to-b from-black/40 via-blue-950/10 to-black/40 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <ScrollReveal direction="up" duration={0.8} distance={24}>
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1 text-xs font-medium text-blue-300">
              <Target className="h-3.5 w-3.5" />
              <span>Our Mission</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Learn. Build. Lead.
            </h2>
            <p className="text-base sm:text-lg text-zinc-400">
              The core philosophy that guides every workshop, initiative, and project at AURIX.
            </p>
          </div>
        </ScrollReveal>

        {/* 3 Pillar Cards */}
        <StaggerContainer
          staggerDelay={0.15}
          delayChildren={0.1}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <StaggerItem key={pillar.title} duration={0.8} distance={30}>
                <div
                  className={`group relative h-full rounded-2xl glass-card p-8 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 border border-white/[0.08] ${pillar.borderColor}`}
                >
                  {/* Gradient background hover effect */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${pillar.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}
                  />

                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3.5 rounded-xl bg-white/[0.05] border border-white/10 group-hover:scale-110 group-hover:bg-white/[0.08] transition-all duration-300">
                        <Icon className={`h-6 w-6 ${pillar.accent}`} />
                      </div>
                      <span className="font-mono text-xs text-zinc-400 tracking-wider">
                        {pillar.badge}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                      {pillar.title}
                    </h3>
                    <div className="text-xs font-medium text-zinc-400 mb-4">
                      {pillar.tagline}
                    </div>

                    <p className="text-sm text-zinc-300 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/[0.06]">
                    <div className="h-1 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:w-full transition-all duration-500" />
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
