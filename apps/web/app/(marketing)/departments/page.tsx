import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DepartmentsSection } from "@/components/home/DepartmentsSection";
import { ScrollProgress, ScrollReveal } from "@/components/ui/ScrollReveal";
import { ArrowRight, Layers } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Departments | AURIX",
  description:
    "Explore the six core departments driving innovation, technical development, research, event execution, and entrepreneurship at AURIX.",
};

export default function DepartmentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f6fc] via-[#f7fafd] to-[#ffffff] text-zinc-900 flex flex-col selection:bg-blue-500/20 selection:text-blue-900 relative overflow-hidden">
      {/* Scroll Reading Progress Bar */}
      <ScrollProgress />

      {/* Radiant Soft Sunrise Ambient Glows - Subtle & Elegant */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] sm:w-[1200px] h-[480px] bg-gradient-to-b from-sky-200/20 via-blue-100/10 to-transparent rounded-full blur-[120px] pointer-events-none -z-0" />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[520px] h-[300px] bg-gradient-to-b from-amber-100/25 via-sky-100/15 to-transparent rounded-full blur-[90px] pointer-events-none -z-0" />
      {/* Subtle geometric morning dawn grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(37,99,235,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(37,99,235,0.025)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_50%,transparent_100%)] pointer-events-none -z-0" />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow pt-12 sm:pt-14 relative z-10">
        {/* 6 Department Cards */}
        <DepartmentsSection />

        {/* Bottom Callout */}
        <ScrollReveal direction="up" delay={0.2}>
          <section className="relative py-16 px-4 sm:px-6 lg:px-8 border-t border-blue-100/70 text-center bg-transparent">
            <div className="mx-auto max-w-3xl bg-white/85 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-blue-200/90 shadow-xl shadow-blue-500/5 space-y-5">
              <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900">
                Not sure which department fits you best?
              </h3>
              <p className="text-sm sm:text-base text-zinc-600 max-w-xl mx-auto leading-relaxed">
                You can apply with a primary and secondary preference in your application. Cross-department collaborations are actively encouraged!
              </p>
              <div>
                <Link
                  href="/join"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Apply to Join Now</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}