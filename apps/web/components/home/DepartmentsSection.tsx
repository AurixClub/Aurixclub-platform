"use client";

import React, { useEffect, useState } from "react";
import {
  Code,
  Handshake,
  Lightbulb,
  Megaphone,
  Rocket,
  CalendarDays,
  ArrowRight,
  Layers,
  Users,
} from "lucide-react";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { Department } from "@aurix/types";

const departmentDisplayNames: Record<string, string> = {
  "sponsors-industry-relations": "Industry & Sponsor Relationship",
  "innovation-research": "Research & Innovation",
  "social-media-marketing": "Social Media & Designing",
};

const upcomingDepartments = [
  "Quantum Department",
  "Space Science & Technology Department",
  "Gaming & Technology Department",
  "Student's Wellbeing & Counselling Department",
];

export function DepartmentsSection() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDepts() {
      try {
        const res = await fetch("/api/departments");
        const data = await res.json();
        if (data.success && data.data?.departments) {
          setDepartments(data.data.departments);
        }
      } catch (e) {
        console.error("Failed to load departments", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadDepts();
  }, []);

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-br from-indigo-900/10 via-purple-900/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <ScrollReveal direction="up" duration={0.8} distance={24}>
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3.5 py-1 text-xs font-medium text-purple-300">
              <Layers className="h-3.5 w-3.5" />
              <span>Core Domains & Structure</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Explore Our Core Departments
            </h2>
            <p className="text-base sm:text-lg text-zinc-400">
              Six specialized domains driving engineering, partnerships, deep-tech research, and events across AURIX.
            </p>
          </div>
        </ScrollReveal>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16 text-zinc-500 font-mono text-sm flex items-center justify-center gap-3">
            <span className="h-5 w-5 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
            <span>Loading Departments...</span>
          </div>
        )}

        {/* Clean Department Cards Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept, index) => (
              <div
                key={dept.id}
                id={dept.slug}
                className="rounded-3xl bg-[#0d111c]/90 border border-white/10 hover:border-violet-500/40 p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-violet-600/10 group space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-violet-400 font-bold block mb-1">
                        Domain 0{index + 1}
                      </span>
                      <h3 className="text-xl font-bold text-white group-hover:text-violet-300 transition-colors">
                        {departmentDisplayNames[dept.slug] ?? dept.name}
                      </h3>
                    </div>

                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-zinc-400 shrink-0">
                      {dept.members?.length || 0} Members
                    </span>
                  </div>

                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {dept.description}
                  </p>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
                  <Link
                    href={`/team#${dept.slug}`}
                    className="text-xs font-bold text-violet-400 hover:text-violet-300 inline-flex items-center gap-1.5 group-hover:translate-x-0.5 transition-all"
                  >
                    <Users className="h-3.5 w-3.5" />
                    <span>Meet the Team</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  <Link
                    href="/join"
                    className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/10 text-xs font-medium transition-colors"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            ))}
            {upcomingDepartments.map((name, index) => (
              <article
                key={name}
                className="group relative overflow-hidden rounded-3xl border border-dashed border-[#b8a7ff]/35 bg-[#0a0d16]/75 p-8 shadow-xl shadow-indigo-950/10 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#c7ff3d]/55"
              >
                <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[#b8a7ff]/10 blur-3xl" />
                <div className="relative flex min-h-[190px] flex-col justify-between gap-8">
                  <div>
                    <span className="mb-2 block text-[10px] font-mono font-bold uppercase tracking-wider text-violet-400">Upcoming 0{index + 1}</span>
                    <h3 className="text-xl font-bold leading-tight text-white transition-colors group-hover:text-[#c7ff3d]">{name}</h3>
                  </div>
                  <div className="flex items-center gap-2 border-t border-white/[0.08] pt-4 text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                    <span className="h-2 w-2 rounded-full bg-[#c7ff3d] shadow-[0_0_14px_rgba(199,255,61,0.75)]" />
                    <span>Launching soon</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
