"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function AboutHero() {
  return (
    <section className="relative pt-36 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-blue-600/20 via-indigo-500/15 to-purple-600/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" style={{ animationDuration: "8s" }} />

      <div className="mx-auto max-w-4xl text-center space-y-6">
        {/* Badge */}
        <ScrollReveal direction="down" duration={0.7} distance={15}>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/40 backdrop-blur-md px-4 py-1.5 text-xs font-medium text-blue-300 shadow-lg shadow-blue-900/20">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span className="font-mono uppercase tracking-widest text-[11px]">About AURIX</span>
          </div>
        </ScrollReveal>

        {/* Headline */}
        <ScrollReveal direction="up" duration={0.85} delay={0.1} distance={25}>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white">
            More Than a <span className="text-gradient-primary">Club.</span>
          </h1>
        </ScrollReveal>

        {/* Narrative */}
        <ScrollReveal direction="up" duration={0.85} delay={0.2} distance={20}>
          <div className="space-y-4 text-base sm:text-xl text-zinc-300 leading-relaxed max-w-3xl mx-auto">
            <p>
              AURIX is a community of students who come together to learn, build, experiment, and create an impact beyond the classroom.
            </p>
            <p className="text-sm sm:text-lg text-zinc-400">
              We believe the best way to learn technology is to build with it, share it, and grow together.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
