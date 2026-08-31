import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DepartmentsSection } from "@/components/home/DepartmentsSection";
import { ScrollProgress, ScrollReveal } from "@/components/ui/ScrollReveal";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Departments | AURIX",
  description:
    "Explore the six core departments driving innovation, technical development, research, event execution, and entrepreneurship at AURIX.",
};

export default function DepartmentsPage() {
  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col selection:bg-blue-500/30 selection:text-white">
      {/* Scroll Reading Progress Bar */}
      <ScrollProgress />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow pt-24">
        {/* Dedicated Page Hero */}
      

        {/* 6 Department Cards */}
        <DepartmentsSection />

        {/* Bottom Callout */}
        <ScrollReveal direction="up" delay={0.2}>
          <section className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] text-center">
            <div className="mx-auto max-w-3xl glass-card p-10 rounded-3xl border border-white/10 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                Not sure which department fits you best?
              </h3>
              <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
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
        </ScrollReveal>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}