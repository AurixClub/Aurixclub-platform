"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function AboutCTA() {
  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-blue-600/20 via-indigo-500/15 to-purple-600/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-4xl text-center space-y-8">
        <ScrollReveal direction="zoom" duration={0.85} distance={20}>
          <div className="rounded-3xl glass-panel p-8 sm:p-14 border border-white/10 relative shadow-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1 text-xs font-medium text-blue-300 mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Start Your Journey</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
              Have an Idea? <span className="text-gradient-primary">Build It With Us.</span>
            </h2>

            <div className="space-y-2 text-base sm:text-lg text-zinc-300 max-w-xl mx-auto mb-8">
              <p>You don&apos;t need to know everything before you start.</p>
              <p className="text-zinc-400 font-medium">You just need the curiosity to begin.</p>
            </div>

            <Link
              href="/join"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/45 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
            >
              <span>Join AURIX</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
