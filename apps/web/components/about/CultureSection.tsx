"use client";

import React from "react";
import {
  Sparkles,
  Users,
  Lightbulb,
  ShieldAlert,
  Flame,
  HeartHandshake,
} from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";

export function CultureSection() {
  const values = [
    {
      title: "Curiosity",
      description: "Always ask why, explore what’s possible, and keep learning.",
      icon: Sparkles,
      accent: "text-blue-400",
      borderHover: "hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
    },
    {
      title: "Collaboration",
      description: "Great ideas become better when people build together.",
      icon: Users,
      accent: "text-indigo-400",
      borderHover: "hover:border-indigo-500/40 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]",
    },
    {
      title: "Innovation",
      description: "Challenge the ordinary and experiment with new possibilities.",
      icon: Lightbulb,
      accent: "text-amber-400",
      borderHover: "hover:border-amber-500/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]",
    },
    {
      title: "Ownership",
      description: "Take responsibility for your ideas, your work, and your community.",
      icon: ShieldAlert,
      accent: "text-pink-400",
      borderHover: "hover:border-pink-500/40 hover:shadow-[0_0_30px_rgba(244,63,94,0.15)]",
    },
    {
      title: "Impact",
      description: "Build things that create value beyond the classroom.",
      icon: Flame,
      accent: "text-emerald-400",
      borderHover: "hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",
    },
  ];

  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] bg-black/20 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <ScrollReveal direction="up" duration={0.8} distance={24}>
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-300">
              <HeartHandshake className="h-3.5 w-3.5" />
              <span>What We Believe</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Our Culture
            </h2>
            <p className="text-base sm:text-lg text-zinc-400">
              The shared values that unite our members and shape how we work together.
            </p>
          </div>
        </ScrollReveal>

        {/* 5-Culture Values Grid */}
        <StaggerContainer
          staggerDelay={0.1}
          delayChildren={0.15}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {values.map((val, index) => {
            const Icon = val.icon;
            const isLast = index === 4;

            return (
              <StaggerItem
                key={val.title}
                duration={0.75}
                distance={25}
                className={isLast ? "md:col-span-2 lg:col-span-1" : ""}
              >
                <div
                  className={`group relative h-full rounded-2xl glass-card p-8 transition-all duration-500 hover:-translate-y-2 border border-white/[0.08] ${val.borderHover}`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-white/[0.05] border border-white/10 group-hover:scale-110 group-hover:bg-white/[0.08] transition-all duration-300">
                      <Icon className={`h-6 w-6 ${val.accent}`} />
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                      {val.title}
                    </h3>
                  </div>

                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {val.description}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
