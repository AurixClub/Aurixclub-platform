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
    <section className="relative min-h-[80vh] sm:min-h-[85vh] flex items-center justify-center pt-20 sm:pt-28 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* 3D Visual Layer */}
      <HeroCanvas3D />

      {/* Full gradient background — deep blue top → purple → pink bottom */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-gradient-to-b from-[#1e1b4b] via-[#4338ca]/60 to-[#c084fc]/25" />
      {/* Extra pink/lavender wash in the lower half */}
      <div className="absolute bottom-0 left-0 right-0 h-[50%] pointer-events-none z-0 bg-gradient-to-t from-[#e879f9]/20 via-[#a78bfa]/15 to-transparent" />
      {/* Seamless bottom fade overlay to blend smoothly into the black background (#07090e) */}
      <div className="absolute bottom-0 left-0 right-0 h-36 pointer-events-none z-0 bg-gradient-to-b from-transparent via-[#07090e]/60 to-[#07090e]" />
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      <div className="mx-auto max-w-5xl text-center z-10 space-y-5 sm:space-y-6">
        {/* Institution Spotlight Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="inline-flex items-center justify-center flex-nowrap whitespace-nowrap gap-1.5 sm:gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/40 backdrop-blur-md px-3 sm:px-4 py-1 sm:py-1.5 text-[11px] xs:text-xs sm:text-sm font-medium text-indigo-300 shadow-lg shadow-indigo-950/30 hover:border-indigo-400/50 transition-colors mb-2 sm:mb-3 max-w-[95vw] sm:max-w-fit mx-auto"
        >
          <Building2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-indigo-400 shrink-0" />
          <span className="font-semibold text-white/90 truncate sm:overflow-visible">Dr. Ambedkar Institute of Technology</span>
          <span className="text-indigo-400/80 shrink-0">• Bengaluru</span>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <h1 className="font-montserrat text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-wider text-white max-w-5xl mx-auto leading-[1.2] sm:leading-tight">
            <span className="block sm:inline sm:whitespace-nowrap">WHERE STUDENT CURIOSITY</span>{" "}
            <br className="hidden sm:inline" />
            <span className="block sm:inline mt-1.5 sm:mt-0">
              BECOMES{" "}
              <span className="font-serif italic font-normal lowercase capitalize tracking-normal text-white drop-shadow-md">
                Real Impact
              </span>
            </span>
          </h1>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 25, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.85, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mx-auto max-w-2xl text-sm sm:text-base md:text-lg text-zinc-300 leading-relaxed font-normal px-2 sm:px-0"
        >
          A student-led community at <strong className="text-white font-semibold">Dr. AIT, Bengaluru</strong> — learning, building, and launching impactful tech together.
        </motion.p>

        {/* CTA Buttons — HackCulture styled */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-3 font-montserrat w-full sm:w-auto px-4 sm:px-0"
        >
          <Link
            href="/events"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-white text-indigo-600 hover:bg-white/95 px-7 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold shadow-xl shadow-black/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            Explore Events
          </Link>

          <Link
            href="/join"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-white/[0.08] hover:bg-white/[0.16] border border-white/40 px-7 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            Join AURIX
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
