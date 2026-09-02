"use client";

import React, { useState } from "react";
import { Calistoga } from "next/font/google";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/ui/ScrollReveal";

const displayFont = Calistoga({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

interface TeamMember {
  id: string;
  name: string;
  role: string;
  category?: "web" | "design" | "media" | "sponsorship" | "operation" | "technical";
  image: string;
  linkedin?: string;
}

const CORE_MEMBERS: TeamMember[] = [
  {
    id: "dr-bipin-rai",
    name: "Dr. Bipin Kumar Rai",
    role: "Faculty Coordinator",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
    linkedin: "https://linkedin.com",
  },
  {
    id: "trisha",
    name: "Trisha",
    role: "Student Coordinator",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
    linkedin: "https://linkedin.com",
  },
  {
    id: "s-shreenidhi",
    name: "S Shreenidhi",
    role: "Student Coordinator",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80",
    linkedin: "https://linkedin.com",
  },
  {
    id: "manavi-p",
    name: "Manavi P",
    role: "Web Team Lead",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80",
    linkedin: "https://linkedin.com",
  },
  {
    id: "harshith-gowda",
    name: "Harshith Gowda",
    role: "Club President",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
    linkedin: "https://linkedin.com",
  },
  {
    id: "advaith-kolkar",
    name: "Advaith Kolkar",
    role: "Lead Systems Architect",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80",
    linkedin: "https://linkedin.com",
  },
  {
    id: "anish-sharma",
    name: "Anish Sharma",
    role: "Operations & Partnerships",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=80",
    linkedin: "https://linkedin.com",
  },
  {
    id: "adithya-p",
    name: "Adithya P",
    role: "Event Management Head",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&auto=format&fit=crop&q=80",
    linkedin: "https://linkedin.com",
  },
];

const ENTIRE_TEAM_MEMBERS: TeamMember[] = [
  // Operations Team
  {
    id: "et-manavi-p",
    name: "Manavi P",
    role: "Operation Team Co Lead",
    category: "operation",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80",
    linkedin: "https://linkedin.com",
  },
  {
    id: "et-monisha-ns",
    name: "Monisha N S",
    role: "Operation Team",
    category: "operation",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
    linkedin: "https://linkedin.com",
  },
  {
    id: "et-meghana-kv",
    name: "Meghana K V",
    role: "Operation Team",
    category: "operation",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80",
    linkedin: "https://linkedin.com",
  },
  // Web Team
  {
    id: "et-rohan-k",
    name: "Rohan Kumar",
    role: "Full Stack Engineer",
    category: "web",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80",
    linkedin: "https://linkedin.com",
  },
  {
    id: "et-varun-m",
    name: "Varun Mohan",
    role: "Frontend Developer",
    category: "web",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80",
    linkedin: "https://linkedin.com",
  },
  // Design Team
  {
    id: "et-sneha-r",
    name: "Sneha Reddy",
    role: "UI/UX Design Lead",
    category: "design",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80",
    linkedin: "https://linkedin.com",
  },
  {
    id: "et-pranav-b",
    name: "Pranav Bhat",
    role: "Brand & Visual Designer",
    category: "design",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80",
    linkedin: "https://linkedin.com",
  },
  // Media Team
  {
    id: "et-kiran-k",
    name: "Kiran Kumar",
    role: "Media & Content Head",
    category: "media",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
    linkedin: "https://linkedin.com",
  },
  {
    id: "et-pooja-m",
    name: "Pooja Menon",
    role: "Social Media Strategist",
    category: "media",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80",
    linkedin: "https://linkedin.com",
  },
  // Sponsorship Team
  {
    id: "et-sony-k",
    name: "Sony",
    role: "Sponsorship Lead",
    category: "sponsorship",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
    linkedin: "https://linkedin.com",
  },
  {
    id: "et-rajveer-s",
    name: "Rajveer Singh",
    role: "Corporate Partnerships",
    category: "sponsorship",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&auto=format&fit=crop&q=80",
    linkedin: "https://linkedin.com",
  },
  // Technical Team
  {
    id: "et-tanmay-s",
    name: "Tanmay Sharma",
    role: "AI / Systems Engineer",
    category: "technical",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=80",
    linkedin: "https://linkedin.com",
  },
];

const DEPARTMENT_TABS = [
  { id: "web", label: "WEB TEAM" },
  { id: "design", label: "DESIGN TEAM" },
  { id: "media", label: "MEDIA TEAM" },
  { id: "sponsorship", label: "SPONSORSHIP TEAM" },
  { id: "operation", label: "OPERATION TEAM" },
  { id: "technical", label: "TECHNICAL TEAM" },
] as const;

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState<string>("operation");

  const filteredEntireTeam = ENTIRE_TEAM_MEMBERS.filter(
    (m) => m.category === activeTab
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f6fc] via-[#f7fafd] to-[#ffffff] text-zinc-900 flex flex-col selection:bg-blue-500/20 selection:text-blue-900 relative overflow-hidden">
      <ScrollProgress />
      <Navbar />

      {/* Radiant Soft Sunrise Ambient Glows - Subtle & Elegant */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] sm:w-[1200px] h-[480px] bg-gradient-to-b from-sky-200/20 via-blue-100/10 to-transparent rounded-full blur-[120px] pointer-events-none -z-0" />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[520px] h-[300px] bg-gradient-to-b from-amber-100/25 via-sky-100/15 to-transparent rounded-full blur-[90px] pointer-events-none -z-0" />
      {/* Subtle geometric morning dawn grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(37,99,235,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(37,99,235,0.025)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_50%,transparent_100%)] pointer-events-none -z-0" />

      <main className="flex-grow pt-16 sm:pt-20 pb-24 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-6xl">
          {/* Main Title Section */}
          <div className="text-center max-w-4xl mx-auto pb-4 space-y-2">
            <h1
              className={`${displayFont.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-[0.12em] sm:tracking-[0.16em] leading-tight select-none`}
            >
              <span className="text-zinc-900">MEET THE </span>
              <span className="text-blue-600 font-normal">TEAM</span>
            </h1>
          </div>

          {/* ══════════════ SECTION 1: CORE TEAM ══════════════ */}
          <div className="relative my-6 border-t-2 border-zinc-900 pt-5">
            <div className="text-center">
              <h2
                className={`${displayFont.className} inline-block text-xl sm:text-2xl md:text-3xl font-normal uppercase tracking-[0.15em] text-zinc-900 select-none`}
              >
                CORE TEAM
              </h2>
            </div>
          </div>

          {/* Core Team Cards Grid - Compact & Refined Size */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mt-8">
            {CORE_MEMBERS.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{
                  duration: 0.45,
                  delay: (index % 4) * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
                className="group relative rounded-xl border-2 border-zinc-900 bg-white overflow-hidden shadow-[4px_4px_0px_0px_#18181b] hover:shadow-[5px_5px_0px_0px_#2563eb] hover:-translate-y-1 hover:-translate-x-1 active:scale-[0.98] transition-all duration-200 flex flex-col justify-between"
              >
                {/* Photo Container */}
                <div className="relative aspect-square w-full bg-zinc-100 overflow-hidden border-b-2 border-zinc-900">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale contrast-105 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  />
                </div>

                {/* Card Content */}
                <div className="p-3 sm:p-3.5 flex flex-col justify-between flex-grow space-y-1.5 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <h3 className="font-montserrat text-xs sm:text-[14px] font-extrabold uppercase tracking-tight text-zinc-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-1 text-center">
                      {member.name}
                    </h3>
                    <p className="text-[9.5px] sm:text-[10.5px] font-mono uppercase tracking-wider text-zinc-500 font-semibold mt-0.5 truncate text-center">
                      {member.role}
                    </p>
                  </div>

                  {/* Dashed divider line from screenshot */}
                  <div className="border-b border-dashed border-zinc-300 my-1" />

                  {/* Footer with LinkedIn 'in' button on side */}
                  <div className="flex items-center justify-end pt-0.5">
                    {member.linkedin ? (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-zinc-900 group-hover:bg-blue-600 text-white flex items-center justify-center text-[10px] sm:text-[11px] font-bold transition-colors shadow-xs shrink-0"
                        aria-label={`${member.name} LinkedIn`}
                      >
                        in
                      </a>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ══════════════ SECTION 2: MEET THE ENTIRE TEAM ══════════════ */}
          <div className="relative mt-16 mb-6 border-t-2 border-zinc-900 pt-6">
            <div className="text-center">
              <h2
                className={`${displayFont.className} inline-block text-2xl sm:text-3xl md:text-4xl font-normal uppercase tracking-[0.14em] text-zinc-900 select-none`}
              >
                MEET THE ENTIRE TEAM
              </h2>
            </div>
          </div>

          {/* Filter Tabs without 'ALL' button, styled in website theme */}
          <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 my-6">
            {DEPARTMENT_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white border-2 border-zinc-900 shadow-[3px_3px_0px_0px_#18181b] -translate-y-0.5"
                      : "bg-white text-zinc-800 border-2 border-zinc-900 shadow-[2.5px_2.5px_0px_0px_#18181b] hover:shadow-[3px_3px_0px_0px_#2563eb] hover:-translate-y-0.5"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Entire Team Cards Grid - Compact & Refined Size */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mt-8">
            {filteredEntireTeam.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{
                  duration: 0.45,
                  delay: (index % 4) * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
                className="group relative rounded-xl border-2 border-zinc-900 bg-white overflow-hidden shadow-[4px_4px_0px_0px_#18181b] hover:shadow-[5px_5px_0px_0px_#2563eb] hover:-translate-y-1 hover:-translate-x-1 active:scale-[0.98] transition-all duration-200 flex flex-col justify-between"
              >
                {/* Photo Container */}
                <div className="relative aspect-square w-full bg-zinc-100 overflow-hidden border-b-2 border-zinc-900">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale contrast-105 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  />
                </div>

                {/* Card Content */}
                <div className="p-3 sm:p-3.5 flex flex-col justify-between flex-grow space-y-1.5 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <h3 className="font-montserrat text-xs sm:text-[14px] font-extrabold uppercase tracking-tight text-zinc-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-1 text-center">
                      {member.name}
                    </h3>
                    <p className="text-[9.5px] sm:text-[10.5px] font-mono uppercase tracking-wider text-zinc-500 font-semibold mt-0.5 truncate text-center">
                      {member.role}
                    </p>
                  </div>

                  {/* Dashed divider line from screenshot */}
                  <div className="border-b border-dashed border-zinc-300 my-1" />

                  {/* Footer with LinkedIn 'in' button on side */}
                  <div className="flex items-center justify-end pt-0.5">
                    {member.linkedin ? (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-zinc-900 group-hover:bg-blue-600 text-white flex items-center justify-center text-[10px] sm:text-[11px] font-bold transition-colors shadow-xs shrink-0"
                        aria-label={`${member.name} LinkedIn`}
                      >
                        in
                      </a>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
