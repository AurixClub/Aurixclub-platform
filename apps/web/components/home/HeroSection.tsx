"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Compass, ShieldCheck, Sparkles, Building2, Cpu, Rocket } from "lucide-react";

// Dynamic import for Three.js Canvas with fallback
const HeroCanvas3D = dynamic(() => import("./HeroCanvas3D"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))] pointer-events-none -z-10" />
  ),
});

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* 3D Visual Layer */}
      <HeroCanvas3D />

      {/* Subtle background ambient gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-blue-600/20 via-indigo-500/15 to-purple-600/20 rounded-full blur-3xl pointer-events-none -z-20 animate-pulse" style={{ animationDuration: "8s" }} />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none -z-20" />

      <div className="mx-auto max-w-5xl text-center z-10 space-y-7">
        {/* Origin / Institution Spotlight Tag */}
        <motion.div
          initial={{ opacity: 0, y: -15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/40 backdrop-blur-md px-4 py-1.5 text-xs sm:text-sm font-medium text-blue-300 shadow-lg shadow-blue-900/20"
        >
          <Building2 className="h-4 w-4 text-blue-400" />
          <span className="font-semibold text-white/90">Dr. Ambedkar Institute of Technology</span>
          <span className="text-blue-400/80">• Bengaluru</span>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
            Where Student Curiosity <br className="hidden sm:inline" />
            Becomes <span className="text-gradient-primary">Real Impact.</span>
          </h1>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 25, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.85, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mx-auto max-w-xl text-base sm:text-lg text-zinc-300 leading-relaxed"
        >
          A student-led community at <strong className="text-white font-semibold">Dr. AIT, Bengaluru</strong> — learning, building, and launching impactful tech together.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3"
        >
          <Link
            href="/events"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 group hover:scale-[1.03] active:scale-[0.98] hover:border-white/30"
          >
            <Compass className="h-4 w-4 text-blue-400" />
            <span>Explore Events</span>
            <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:translate-x-1 group-hover:text-white transition-all duration-300" />
          </Link>

          <Link
            href="/join"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/45 transition-all duration-300 group hover:scale-[1.03] active:scale-[0.98]"
          >
            <span>Join AURIX</span>
            <ArrowRight className="h-4 w-4 text-white group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>

        {/* Feature quick indicators */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="pt-8 flex flex-wrap items-center justify-center gap-5 sm:gap-6 text-xs text-zinc-400"
        >
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-blue-400" />
            <span>Dr. AIT Student-Led</span>
          </div>
          <span className="hidden sm:inline text-zinc-700">•</span>
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-purple-400" />
            <span>6 Core Divisions</span>
          </div>
          <span className="hidden sm:inline text-zinc-700">•</span>
          <div className="flex items-center gap-2">
            <Rocket className="h-4 w-4 text-emerald-400" />
            <span>Deep Tech & Startups</span>
          </div>
          <span className="hidden sm:inline text-zinc-700">•</span>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-amber-400" />
            <span>Industry Mentorship</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
