import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DepartmentsSection } from "@/components/home/DepartmentsSection";
import { ScrollProgress } from "@/components/ui/ScrollReveal";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Departments | AURIX",
  description:
    "Explore the six core departments driving innovation, technical development, research, event execution, and entrepreneurship at AURIX.",
};

export default function DepartmentsPage() {
  return (
    <div className="hero-page-shell min-h-screen bg-[#07090e] text-white flex flex-col selection:bg-blue-500/30 selection:text-white">
      {/* Scroll Reading Progress Bar */}
      <ScrollProgress />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow pt-24">
        {/* Dedicated Page Hero */}
        <section className="reference-editorial-section relative pt-24 pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-purple-600/15 via-blue-600/15 to-pink-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="mx-auto max-w-5xl space-y-4">

            <h1 className="max-w-3xl text-5xl sm:text-7xl font-semibold tracking-[-0.06em] text-white">
              Our <span className="text-gradient-primary">Departments</span>
            </h1>

            <p className="text-base sm:text-xl text-zinc-300 max-w-2xl leading-relaxed">
              Find where your passions align. Every department offers mentorship, hands-on leadership, and real-world project experience.
            </p>
          </div>
        </section>

        {/* 6 Department Cards */}
        <DepartmentsSection />

        {/* Bottom Callout */}
        <section className="reference-editorial-section relative py-24 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl border border-white/12 bg-white/[0.035] p-8 sm:p-12 space-y-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Not sure which department fits you best?
            </h3>
            <p className="text-sm sm:text-base text-zinc-400 max-w-xl leading-relaxed">
              You can apply with a primary and secondary preference in your application. Cross-department collaborations are actively encouraged!
            </p>
            <div>
              <Link
                href="/join"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Apply to Join Now</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
