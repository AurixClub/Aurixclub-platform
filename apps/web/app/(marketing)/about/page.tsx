import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/layout/Footer";
import AboutPageClient from "@/components/about/AboutPageClient";

export const metadata: Metadata = {
  title: "About AURIX | More Than a Club",
  description:
    "Learn about AURIX — a student-driven community at Dr. Ambedkar Institute of Technology, Bengaluru. Our mission, vision, culture, and journey.",
};

export default function AboutPage() {
  return (
    <div className="hero-page-shell min-h-screen bg-[#07090e] text-white flex flex-col selection:bg-blue-500/30 selection:text-white">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow">
        <AboutPageClient />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
