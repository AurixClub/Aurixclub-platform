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
    <div className="min-h-screen bg-[#f5f8fc] text-zinc-900 flex flex-col selection:bg-indigo-500/20 selection:text-indigo-900">
      {/* Scroll Reading Progress Bar */}
      <ScrollProgress />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow bg-[#f5f8fc] pt-12 sm:pt-14">
        {/* 6 Department Cards */}
        <DepartmentsSection />

        {/* Bottom Callout */}
        <ScrollReveal direction="up" delay={0.2}>
          <section className="relative py-16 px-4 sm:px-6 lg:px-8 border-t border-blue-100/70 text-center bg-transparent">
            <div className="mx-auto max-w-3xl bg-gradient-to-br from-blue-50 via-indigo-50/60 to-sky-50/80 p-8 sm:p-10 rounded-3xl border border-blue-200/90 shadow-xl shadow-blue-500/5 space-y-5">
              <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900">
                Not sure which department fits you best?
              </h3>
              <p className="text-sm sm:text-base text-zinc-600 max-w-xl mx-auto leading-relaxed">
                You can apply with a primary and secondary preference in your application. Cross-department collaborations are actively encouraged!
              </p>
              <div>
                <Link
                  href="/join"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
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