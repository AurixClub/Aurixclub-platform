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
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center pt-24 sm:pt-32 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-[#1e3a8a] via-[#2563eb] to-[#4f46e5]">
      {/* 3D Visual Layer */}
      <HeroCanvas3D />

      {/* Vibrant HackCulture Geometric White Grid Overlay Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none z-0" />

      {/* Radial Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-sky-400/30 via-blue-400/25 to-indigo-300/20 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Seamless bottom fade overlay to transition into crisp white sections */}
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-0 bg-gradient-to-b from-transparent via-white/70 to-white" />

      <div className="mx-auto max-w-5xl text-center z-10 space-y-6 sm:space-y-7">
        {/* Institution Spotlight Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="inline-flex items-center justify-center flex-nowrap whitespace-nowrap gap-2 rounded-full border border-white/30 bg-white/15 backdrop-blur-md px-4 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-lg hover:bg-white/20 transition-colors mb-2 max-w-[95vw] sm:max-w-fit mx-auto"
        >
          <Building2 className="h-3.5 w-3.5 text-sky-300 shrink-0" />
          <span className="truncate sm:overflow-visible">Dr. Ambedkar Institute of Technology</span>
          <span className="text-sky-200 shrink-0">• Bengaluru</span>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <h1 className="font-montserrat text-2xl sm:text-4xl md:text-6xl lg:text-6xl font-semibold uppercase tracking-tight text-white max-w-5xl mx-auto leading-[1.15] sm:leading-tight drop-shadow-sm">
            <span className="block sm:inline sm:whitespace-nowrap">WHERE STUDENT CURIOSITY</span>{" "}
            <br className="hidden sm:inline" />
            <span className="block sm:inline mt-1.5 sm:mt-0">
              BECOMES{" "}
              <span className="font-serif italic font-normal lowercase capitalize tracking-normal text-sky-200">
                Real Impact
              </span>
            </span>
          </h1>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-blue-100/90 leading-relaxed font-medium px-2 sm:px-0"
        >
          A student-led platform for corporate programs, hackathons, and capability building at <strong className="text-white font-bold">Dr. AIT, Bengaluru</strong>.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3 font-montserrat w-full sm:w-auto px-4 sm:px-0"
        >
          <Link
            href="/events"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-white text-[#1e3a8a] hover:bg-slate-100 px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold shadow-xl shadow-blue-950/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Explore Events</span>
            <ArrowRight className="ml-1.5 h-4 w-4 text-[#1e3a8a]" />
          </Link>

          <Link
            href="/join"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 border border-white/40 backdrop-blur-md px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            Join AURIX
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
