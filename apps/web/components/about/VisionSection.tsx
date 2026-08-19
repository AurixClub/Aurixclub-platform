"use client";

import React from "react";
import { Eye, CheckCircle2 } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function VisionSection() {
  const visionPoints = [
    "Curiosity becomes practical, industry-grade capability",
    "Creative ideas transition into scalable technical innovation",
    "Students take charge of their future and career readiness",
  ];

  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-5xl">
        <ScrollReveal direction="zoom" duration={0.85} distance={20}>
          <div className="rounded-3xl glass-panel p-8 sm:p-12 lg:p-16 border border-white/10 relative overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3.5 py-1 text-xs font-medium text-purple-300 mb-6">
              <Eye className="h-3.5 w-3.5" />
              <span>Our Vision</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Creating Tomorrow&apos;s <span className="text-gradient-primary">Builders.</span>
            </h2>

            <p className="text-base sm:text-xl text-zinc-300 leading-relaxed max-w-3xl mb-10">
              We envision a student community where curiosity becomes capability, ideas become innovation, and students are empowered to build the future.
            </p>

            {/* Key Bullet Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-white/10">
              {visionPoints.map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-zinc-300 leading-normal">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
