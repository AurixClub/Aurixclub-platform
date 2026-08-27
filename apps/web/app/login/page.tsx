import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthCard } from "@/components/auth/AuthCard";

// Auth Fuse reference shell: the shared AuthCard owns the split composition; auth behavior remains unchanged.

export const metadata: Metadata = {
  title: "Member Login & Account | AURIX",
  description:
    "Sign in or create your AURIX account to manage applications, access programs, and connect with members.",
};

export default function LoginPage() {
  return (
    <div className="auth-page-shell flex min-h-screen flex-col overflow-hidden bg-[#07090e] text-white selection:bg-blue-500/30 selection:text-white">
      <Navbar />
      <main className="relative flex flex-1 items-center overflow-hidden px-4 pb-20 pt-28 sm:px-6 lg:px-10 lg:pb-24 lg:pt-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_50%,rgba(75,85,180,0.18),transparent_35%),radial-gradient(circle_at_85%_55%,rgba(255,255,255,0.13),transparent_28%)]" />
        <section className="relative z-10 mx-auto w-full max-w-[1240px]" aria-label="AURIX member authentication">
          <AuthCard initialTab="signin" />
        </section>
      </main>
      <Footer />
    </div>
  );
}
