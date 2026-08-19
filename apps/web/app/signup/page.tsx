import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthCard } from "@/components/auth/AuthCard";

export const metadata: Metadata = {
  title: "Create Account | AURIX",
  description:
    "Create your AURIX account to join our builder community and access programs.",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col selection:bg-blue-500/30 selection:text-white">
      {/* Navigation */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-grow pt-36 pb-28 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background ambient gradient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-gradient-to-tr from-purple-600/15 via-indigo-500/15 to-blue-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Page Header */}
        <div className="mx-auto max-w-xl text-center space-y-3 mb-8">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Join the <span className="text-gradient-primary">AURIX Movement.</span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            Create an account to start collaborating on projects, attend workshops, and build together.
          </p>
        </div>

        {/* Unified Tabbed Auth Card starting on signup */}
        <AuthCard initialTab="signup" />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
