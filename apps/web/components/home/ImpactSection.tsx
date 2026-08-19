"use client";

import { Users, Calendar, Code2, Presentation, TrendingUp } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";

export function ImpactSection() {
  const stats = [
    {
      value: "500+",
      label: "Members",
      description: "Active innovators, designers, and developers",
      icon: Users,
      color: "from-blue-500/20 to-cyan-500/20",
      accent: "text-blue-400",
      borderColor: "hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
    },
    {
      value: "25+",
      label: "Programs",
      description: "Workshops, hackathons, and technical bootcamps",
      icon: Calendar,
      color: "from-indigo-500/20 to-purple-500/20",
      accent: "text-indigo-400",
      borderColor: "hover:border-indigo-500/40 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]",
    },
    {
      value: "15+",
      label: "Projects",
      description: "Built, deployed, and scaled across domains",
      icon: Code2,
      color: "from-purple-500/20 to-pink-500/20",
      accent: "text-purple-400",
      borderColor: "hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]",
    },
    {
      value: "10+",
      label: "Industry Sessions",
      description: "Direct mentorship and masterclasses with industry leaders",
      icon: Presentation,
      color: "from-emerald-500/20 to-teal-500/20",
      accent: "text-emerald-400",
      borderColor: "hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",
    },
  ];

  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 border-y border-white/[0.06] bg-gradient-to-b from-black/40 via-blue-950/10 to-black/40 overflow-hidden">
      {/* Background glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <ScrollReveal direction="up" duration={0.8} distance={24}>
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-xs font-medium text-indigo-300">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Our Impact</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              More Than a Club.{" "}
              <span className="text-gradient-primary">A Community in Motion.</span>
            </h2>
            <p className="text-base sm:text-lg text-zinc-400">
              Empowering students to step outside the classroom and build real solutions that matter.
            </p>
          </div>
        </ScrollReveal>

        {/* Stats Grid */}
        <StaggerContainer
          staggerDelay={0.12}
          delayChildren={0.1}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <StaggerItem key={stat.label} duration={0.75} distance={30}>
                <div
                  className={`group relative h-full rounded-2xl glass-card p-6 sm:p-8 transition-all duration-500 hover:-translate-y-2 border border-white/[0.08] ${stat.borderColor}`}
                >
                  {/* Background soft glow */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}
                  />

                  <div className="flex items-center justify-between mb-5">
                    <div className="p-3 rounded-xl bg-white/[0.05] border border-white/10 group-hover:scale-110 group-hover:bg-white/[0.08] transition-all duration-300">
                      <Icon className={`h-6 w-6 ${stat.accent}`} />
                    </div>
                    <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 group-hover:text-zinc-300 transition-colors">
                      0{index + 1}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-mono group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-200 transition-all">
                      {stat.value}
                    </h3>
                    <div className="text-base font-semibold text-zinc-200">{stat.label}</div>
                    <p className="text-xs text-zinc-400 leading-relaxed pt-1">
                      {stat.description}
                    </p>
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
