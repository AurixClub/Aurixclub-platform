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
  category?: "leadership" | "events" | "sponsorship" | "technical" | "media" | "design";
  image: string;
  linkedin?: string;
}

const CORE_MEMBERS: TeamMember[] = [
  {
    id: "dr-shylaja-kr",
    name: "Dr. Shylaja K R",
    role: "Dean (Research & Development)",
    image: "/team/dr-shylaja-kr.jpg",
    linkedin: "https://linkedin.com",
  },
  {
    id: "dr-kumara-thanaiah",
    name: "Dr. Kumara Thanaiah",
    role: "Faculty Head - Entrepreneurship & Start-up",
    image: "/team/dr-kumara-thanaiah.jpg",
    linkedin: "https://linkedin.com",
  },
  {
    id: "dr-nagarathna-ml",
    name: "Dr. Nagarathna M. L",
    role: "Clinical Psychology, HHS Department",
    image: "/team/dr-nagarathna-ml.jpg",
    linkedin: "https://linkedin.com",
  },
  {
    id: "n-chethan",
    name: "N Chethan",
    role: "Student Welfare Officer (SWO)",
    image: "/team/n-chethan.jpg",
    linkedin: "https://linkedin.com",
  },
];

const ENTIRE_TEAM_MEMBERS: TeamMember[] = [
  // Leadership
  {
    id: "et-anish-kumar",
    name: "Anish Kumar",
    role: "President",
    category: "leadership",
    image: "/team/anish-kumar.jpg",
    linkedin: "https://linkedin.com",
  },
  {
    id: "et-advaith",
    name: "Advaith",
    role: "Chief Patron",
    category: "leadership",
    image: "/team/advaith-kolkar.jpg",
    linkedin: "https://linkedin.com",
  },
  // Event Management
  {
    id: "et-aditya-p",
    name: "Aditya P",
    role: "Event Management Head",
    category: "events",
    image: "/team/aditya-p.jpg",
    linkedin: "https://linkedin.com",
  },
  // IRS & Sponsorship Team
  {
    id: "et-sony-k",
    name: "Sony",
    role: "IRS Co-Lead",
    category: "sponsorship",
    image: "/team/sony.jpg",
    linkedin: "https://linkedin.com",
  },
  {
    id: "et-rajveer-s",
    name: "Rajveer Singh",
    role: "IRS Co-Lead",
    category: "sponsorship",
    image: "/team/rajveer-singh.jpg",
    linkedin: "https://linkedin.com",
  },
];

const DEPARTMENT_TABS = [
  { id: "all", label: "ALL DEPARTMENTS" },
  { id: "leadership", label: "LEADERSHIP" },
  { id: "events", label: "EVENT MANAGEMENT" },
  { id: "sponsorship", label: "IRS & SPONSORSHIP" },
  { id: "technical", label: "TECHNICAL TEAM" },
  { id: "media", label: "MEDIA & MARKETING" },
  { id: "design", label: "DESIGN TEAM" },
] as const;

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState<string>("all");

  const departmentsToRender =
    activeTab === "all"
      ? DEPARTMENT_TABS.filter(
          (tab) =>
            tab.id !== "all" &&
            ENTIRE_TEAM_MEMBERS.some((m) => m.category === tab.id)
        )
      : DEPARTMENT_TABS.filter((tab) => tab.id === activeTab);

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
                    <p className="text-[9.5px] sm:text-[10.5px] font-mono uppercase tracking-wider text-zinc-500 font-semibold mt-0.5 line-clamp-2 text-center">
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

          {/* Step-by-Step Department Sections */}
          <div className="space-y-12 sm:space-y-14 mt-8">
            {departmentsToRender.map((dept) => {
              const deptMembers = ENTIRE_TEAM_MEMBERS.filter(
                (m) => m.category === dept.id
              );

              return (
                <div key={dept.id} className="relative">
                  {/* Department Header */}
                  <div className="flex items-center gap-3 mb-6 pb-2 border-b border-zinc-200">
                    <h3
                      className={`${displayFont.className} text-lg sm:text-xl md:text-2xl uppercase tracking-wider text-zinc-900`}
                    >
                      {dept.label}
                    </h3>
                    <div className="h-[2px] flex-1 bg-zinc-200" />
                  </div>

                  {deptMembers.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                      {deptMembers.map((member, index) => (
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
                              <p className="text-[9.5px] sm:text-[10.5px] font-mono uppercase tracking-wider text-zinc-500 font-semibold mt-0.5 line-clamp-2 text-center">
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
                  ) : (
                    <div className="text-center py-14 px-4 text-zinc-500 bg-white/50 rounded-2xl border-2 border-dashed border-zinc-300 mt-4 max-w-md mx-auto">
                      <p className="font-mono text-xs uppercase tracking-wider font-semibold">
                        Department members being announced soon
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
