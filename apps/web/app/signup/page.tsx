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
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col selection:bg-indigo-500/20 selection:text-indigo-900">
      {/* Navigation */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-grow pt-28 pb-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background ambient gradient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-gradient-to-tr from-indigo-100/40 via-violet-100/40 to-fuchsia-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Page Header */}
        <div className="mx-auto max-w-xl text-center space-y-3 mb-8">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900">
            Join the <span className="text-indigo-600">AURIX Movement.</span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-600 max-w-md mx-auto leading-relaxed">
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
