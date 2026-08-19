import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/layout/Footer";
import { JoinForm } from "@/components/auth/JoinForm";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Join AURIX | Student Application Form",
  description:
    "Apply to join AURIX — a student community where builders, innovators, and creators collaborate.",
};

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col selection:bg-blue-500/30 selection:text-white">
      {/* Navigation */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-grow pt-36 pb-28 px-4 sm:px-6 lg:px-8">
        {/* 1. Introduction Section Header */}
        <div className="mx-auto max-w-3xl text-center space-y-5 mb-14">

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
            Ready to Be Part of <span className="text-gradient-primary">AURIX?</span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl mx-auto">
            Join a community of students who learn, build, collaborate, and create opportunities together.
          </p>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto border-t border-white/[0.06] pt-4">
            Applications are open to students who are curious, committed, and ready to contribute.
          </p>
        </div>

        {/* Form Sections (2 through 6) */}
        <JoinForm />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
