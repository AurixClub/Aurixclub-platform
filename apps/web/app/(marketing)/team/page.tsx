"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/ui/ScrollReveal";
import {
  Users,
  Crown,
  Sparkles,
  ArrowRight,
  Mail,
  Layers,
  Linkedin,
  Github,
  Award,
  Globe,
  Compass,
} from "lucide-react";
import type { Department } from "@aurix/types";

interface FounderProfile {
  name: string;
  role: string;
  badge: string;
  avatar: string;
  bio: string;
  department: string;
  github?: string;
  linkedin?: string;
}

const FOUNDERS: FounderProfile[] = [
  {
    name: "Advaith Kolkar",
    role: "Founder & Lead Architect",
    badge: "FOUNDER",
    avatar: "/team/team-4.png",
    bio: "Founding visionary of AURIX club. Architecting distributed platforms, engineering curricula, and inspiring the next generation of builders and technology leaders.",
    department: "Executive & Core Engineering",
    github: "https://github.com/advaithkolkar",
    linkedin: "https://linkedin.com/in/advaithkolkar",
  },
  {
    name: "Anish Sharma",
    role: "Co-Founder & Head of Operations",
    badge: "CO-FOUNDER",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80",
    bio: "Co-founder spearheading club growth, corporate partnerships, flagship ecosystem programs, and cross-department collaboration across universities.",
    department: "Executive & Global Strategy",
    github: "https://github.com/anishsharma",
    linkedin: "https://linkedin.com/in/anishsharma",
  },
];

import { PageHeaderBanner } from "@/components/ui/PageHeaderBanner";

export default function TeamPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDepartments() {
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
    fetchDepartments();
  }, []);

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col selection:bg-indigo-500/20 selection:text-indigo-900">
      <ScrollProgress />
      <Navbar />

      <PageHeaderBanner
        badge="AURIX Leadership & Department Rosters"
        title="The People Behind"
        highlightTitle="AURIX"
        description="Meet our founders, executive leads, and department members building the community, organizing tech events, and pushing the boundaries of student innovation."
      />

      <main className="flex-grow pt-8">

        {/* SECTION 1: FOUNDING LEADERSHIP */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="rounded-3xl bg-slate-50 border border-zinc-200 p-6 sm:p-10 space-y-8 relative overflow-hidden shadow-xl shadow-slate-200/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                  <Crown className="h-3.5 w-3.5 text-amber-600" />
                  <span>Founding Office</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
                  Executive Founders
                </h2>
                <p className="text-xs sm:text-sm text-zinc-600 pt-1">
                  The pioneers who established AURIX and established its vision, mission, and pillars.
                </p>
              </div>
            </div>

            {/* Founder Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {FOUNDERS.map((founder) => (
                <div
                  key={founder.name}
                  className="rounded-2xl p-7 bg-white border border-zinc-200 shadow-md shadow-slate-200/50 hover:border-indigo-300 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl flex flex-col sm:flex-row gap-6 items-center sm:items-start group"
                >
                  <div className="relative shrink-0">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-slate-100 ring-2 ring-indigo-200 group-hover:ring-indigo-500 transition-all shadow-md">
                      <img
                        src={founder.avatar}
                        alt={founder.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-md bg-amber-500 text-white font-black text-[10px] uppercase tracking-wider shadow-md flex items-center gap-1">
                      <Crown className="h-3 w-3" />
                      {founder.badge}
                    </span>
                  </div>

                  <div className="space-y-3 text-center sm:text-left flex-grow">
                    <div>
                      <h3 className="text-xl font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors">
                        {founder.name}
                      </h3>
                      <p className="text-xs font-semibold text-indigo-600 font-mono tracking-wide">
                        {founder.role}
                      </p>
                      <span className="text-[11px] text-zinc-500 font-mono">
                        {founder.department}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-600 leading-relaxed">
                      {founder.bio}
                    </p>

                    <div className="pt-2 flex items-center justify-center sm:justify-start gap-3 border-t border-zinc-100">
                      {founder.github && (
                        <a
                          href={founder.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-900 transition-colors"
                          aria-label={`${founder.name} GitHub`}
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                      {founder.linkedin && (
                        <a
                          href={founder.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-zinc-100 hover:bg-indigo-50 text-zinc-700 hover:text-indigo-600 transition-colors"
                          aria-label={`${founder.name} LinkedIn`}
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                      <span className="text-[11px] font-mono text-zinc-500 ml-auto">
                        AURIX Core
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2: DEPARTMENT-BY-DEPARTMENT ROSTERS */}
        {isLoading && (
          <div className="text-center py-24 flex items-center justify-center gap-3 text-zinc-500 font-mono text-sm">
            <span className="h-5 w-5 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
            <span>Loading Department Team Rosters...</span>
          </div>
        )}

        {!isLoading && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-16">
            <div className="text-center space-y-2 pb-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-slate-50 px-3 py-1 text-xs font-medium text-zinc-600 font-mono shadow-xs">
                <Layers className="h-3.5 w-3.5 text-indigo-600" />
                <span>Department Teams</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900">
                Domain Leads & Specialized Members
              </h2>
            </div>

            {departments.map((dept, deptIndex) => {
              const members = dept.members || [];

              return (
                <div
                  key={dept.id}
                  id={dept.slug}
                  className="rounded-3xl bg-white border border-zinc-200/90 p-6 sm:p-10 space-y-8 relative overflow-hidden shadow-lg shadow-slate-200/50"
                >
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-100 pb-6">
                    <div className="space-y-1 max-w-2xl">
                      <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-mono font-bold uppercase tracking-wider">
                        <Layers className="h-3 w-3" />
                        <span>Department 0{deptIndex + 1}</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
                        {dept.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed pt-1">
                        {dept.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-mono px-3 py-1 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-700 font-medium">
                        {members.length} {members.length === 1 ? "Profile" : "Profiles"} Listed
                      </span>
                      <Link
                        href="/join"
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Join Team</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>

                  {members.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
                      {members.map((member) => {
                        const isLead = member.role.toLowerCase().includes("lead");

                        return (
                          <div
                            key={member.id}
                            className="rounded-3xl p-4 flex flex-col justify-between space-y-4 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl bg-slate-50 border border-zinc-200/80 hover:border-indigo-300 group h-full"
                          >
                            <div className="space-y-4">
                              <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-slate-100 ring-1 ring-zinc-200 group-hover:ring-2 group-hover:ring-indigo-500 transition-all duration-500 shadow-md">
                                {member.avatar_url ? (
                                  <img
                                    src={member.avatar_url}
                                    alt={member.name}
                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                                  />
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center bg-indigo-50 text-indigo-700 group-hover:scale-105 transition-transform duration-500">
                                    <span className="text-5xl font-black text-indigo-600">
                                      {member.name.charAt(0)}
                                    </span>
                                    <span className="text-xs text-indigo-500 font-mono mt-2 uppercase tracking-wider">{dept.name}</span>
                                  </div>
                                )}

                                {isLead && (
                                  <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[11px] font-mono font-extrabold uppercase tracking-wider shadow-md">
                                    <Crown className="h-3.5 w-3.5 text-slate-950 fill-slate-950" />
                                    <span>Lead</span>
                                  </div>
                                )}
                              </div>

                              <div className="space-y-2 px-1">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <h4 className="text-lg font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors leading-snug">
                                      {member.name}
                                    </h4>
                                    <span
                                      className={`inline-block text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold tracking-wider mt-1 ${
                                        isLead
                                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                                          : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                                      }`}
                                    >
                                      {member.role}
                                    </span>
                                  </div>
                                </div>

                                {member.description && (
                                  <p className="text-xs text-zinc-600 line-clamp-3 leading-relaxed pt-1">
                                    {member.description}
                                  </p>
                                )}
                              </div>
                            </div>

                            {member.email && (
                              <div className="pt-3 border-t border-zinc-200 px-1">
                                <a
                                  href={`mailto:${member.email}`}
                                  className="w-full py-2 px-3 rounded-xl bg-white hover:bg-indigo-50 border border-zinc-200 hover:border-indigo-200 text-zinc-700 hover:text-indigo-700 text-xs font-mono transition-all flex items-center justify-center gap-2 group/email shadow-xs"
                                >
                                  <Mail className="h-3.5 w-3.5 text-indigo-600 group-hover/email:scale-110 transition-transform" />
                                  <span className="truncate">{member.email}</span>
                                </a>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 rounded-2xl border border-dashed border-zinc-200 text-center space-y-2 bg-slate-50">
                      <p className="text-xs text-zinc-500">No member profiles listed for {dept.name} yet.</p>
                      <Link
                        href="/join"
                        className="inline-block text-xs text-indigo-600 hover:text-indigo-700 font-semibold underline"
                      >
                        Apply to lead or join {dept.name} →
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}

        {/* Join CTA */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-zinc-200 text-center bg-slate-50">
          <div className="mx-auto max-w-3xl bg-white p-10 rounded-3xl border border-zinc-200 shadow-xl shadow-slate-200/50 space-y-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900">
              Want to Lead & Build with Us?
            </h3>
            <p className="text-sm sm:text-base text-zinc-600 max-w-xl mx-auto leading-relaxed">
              We are constantly looking for enthusiastic students to join our core department teams and take ownership of initiatives.
            </p>
            <div>
              <Link
                href="/join"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Submit Join Application</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
