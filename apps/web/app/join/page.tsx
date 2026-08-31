import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/layout/Footer";
import { JoinForm } from "@/components/auth/JoinForm";
import { Sparkles } from "lucide-react";

import { PageHeaderBanner } from "@/components/ui/PageHeaderBanner";

export const metadata: Metadata = {
  title: "Join AURIX | Student Application Form",
  description:
    "Apply to join AURIX — a student community where builders, innovators, and creators collaborate.",
};

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col selection:bg-indigo-500/20 selection:text-indigo-900">
      {/* Navigation */}
      <Navbar />

      {/* Page Header Banner */}
      <PageHeaderBanner
        badge="Application Open"
        title="Ready To Be Part Of"
        highlightTitle="AURIX?"
        description="Join a community of students who learn, build, collaborate, and create opportunities together at Dr. AIT."
      />

      {/* Main Container */}
      <main className="flex-grow pt-4 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Form Sections (2 through 6) */}
        <JoinForm />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
