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
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col selection:bg-purple-500/30 selection:text-white">
      <ScrollProgress />
      <Navbar />

      <main className="flex-grow pt-24">
        {/* Page Hero */}
        <section className="relative pt-16 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-blue-600/15 via-purple-600/15 to-pink-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="mx-auto max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3.5 py-1 text-xs font-medium text-purple-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AURIX Leadership & Department Rosters</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
              The People Behind <span className="text-gradient-primary">AURIX</span>
            </h1>
            <p className="text-base sm:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed">
              Meet our founders, executive leads, and department members building the community, organizing tech events, and pushing the boundaries of student innovation.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 1: FOUNDING LEADERSHIP (Advaith Kolkar & Anish Sharma)             */}
        {/* ========================================================================= */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="rounded-3xl bg-gradient-to-b from-purple-950/20 via-[#0d101e]/80 to-[#090b14]/90 border border-purple-500/20 p-6 sm:p-10 space-y-8 relative overflow-hidden backdrop-blur-2xl shadow-2xl">
            {/* Ambient Background Lights */}
            <div className="absolute -top-24 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                  <Crown className="h-3.5 w-3.5 text-amber-400" />
                  <span>Founding Office</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Executive Founders
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 pt-1">
                  The pioneers who established AURIX and established its vision, mission, and pillars.
                </p>
              </div>
            </div>

            {/* Founder Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {FOUNDERS.map((founder) => (
                <div
                  key={founder.name}
                  className="rounded-2xl p-7 bg-[#101424]/90 border border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-purple-500/10 flex flex-col sm:flex-row gap-6 items-center sm:items-start group"
                >
                  {/* Photo with Crown */}
                  <div className="relative shrink-0">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-slate-900 ring-2 ring-purple-500/40 group-hover:ring-purple-400 transition-all shadow-2xl">
                      <img
                        src={founder.avatar}
                        alt={founder.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black text-[10px] uppercase tracking-wider shadow-lg flex items-center gap-1">
                      <Crown className="h-3 w-3" />
                      {founder.badge}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 text-center sm:text-left flex-grow">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                        {founder.name}
                      </h3>
                      <p className="text-xs font-semibold text-purple-400 font-mono tracking-wide">
                        {founder.role}
                      </p>
                      <span className="text-[11px] text-zinc-400 font-mono">
                        {founder.department}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {founder.bio}
                    </p>

                    {/* Social links */}
                    <div className="pt-2 flex items-center justify-center sm:justify-start gap-3 border-t border-white/[0.06]">
                      {founder.github && (
                        <a
                          href={founder.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors"
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
                          className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-blue-400 transition-colors"
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

        {/* ========================================================================= */}
        {/* SECTION 2: DEPARTMENT-BY-DEPARTMENT ROSTERS                               */}
        {/* ========================================================================= */}
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-24 flex items-center justify-center gap-3 text-zinc-400 font-mono text-sm">
            <span className="h-5 w-5 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
            <span>Loading Department Team Rosters...</span>
          </div>
        )}

        {!isLoading && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-16">
            <div className="text-center space-y-2 pb-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-zinc-400 font-mono">
                <Layers className="h-3.5 w-3.5 text-purple-400" />
                <span>Department Teams</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Domain Leads & Specialized Members
              </h2>
            </div>

            {departments.map((dept, deptIndex) => {
              const members = dept.members || [];

              return (
                <div
                  key={dept.id}
                  id={dept.slug}
                  className="rounded-3xl bg-[#0a0d16]/80 border border-white/10 p-6 sm:p-10 space-y-8 relative overflow-hidden backdrop-blur-xl"
                >
                  {/* Subtle Background Glow per row */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-600/5 via-blue-600/5 to-transparent rounded-full blur-2xl pointer-events-none -z-10" />

                  {/* Department Row Header */}
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
                    <div className="space-y-1 max-w-2xl">
                      <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-300 text-[11px] font-mono font-bold uppercase tracking-wider">
                        <Layers className="h-3 w-3" />
                        <span>Department 0{deptIndex + 1}</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        {dept.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed pt-1">
                        {dept.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-mono px-3 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-zinc-300">
                        {members.length} {members.length === 1 ? "Profile" : "Profiles"} Listed
                      </span>
                      <Link
                        href="/join"
                        className="text-xs font-bold text-violet-400 hover:text-violet-300 inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Join Team</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Profile Cards Grid for This Department */}
                  {members.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {members.map((member) => {
                        const isLead = member.role.toLowerCase().includes("lead");

                        return (
                          <div
                            key={member.id}
                            className={`rounded-3xl p-4 flex flex-col justify-between space-y-4 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(139,92,246,0.22)] group ${
                              isLead
                                ? "bg-gradient-to-b from-[#141828] via-[#0e1220] to-[#090c15] border border-violet-500/40 hover:border-violet-400"
                                : "bg-gradient-to-b from-[#111422] to-[#090c15] border border-white/10 hover:border-violet-500/40"
                            }`}
                          >
                            <div className="space-y-4">
                              {/* Large Showcase Portrait Photo */}
                              <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden bg-slate-900/80 ring-1 ring-white/15 group-hover:ring-2 group-hover:ring-violet-400/80 transition-all duration-500 shadow-2xl">
                                {member.avatar_url ? (
                                  <img
                                    src={member.avatar_url}
                                    alt={member.name}
                                    className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-700 ease-out"
                                  />
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-blue-950 via-indigo-900 to-purple-950 text-white group-hover:scale-105 transition-transform duration-500">
                                    <span className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400">
                                      {member.name.charAt(0)}
                                    </span>
                                    <span className="text-xs text-zinc-400 font-mono mt-2 uppercase tracking-wider">{dept.name}</span>
                                  </div>
                                )}

                                {/* Gradient Vignette on bottom of image for text readability */}
                                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#090c15] via-transparent to-black/20 opacity-80 group-hover:opacity-40 transition-opacity duration-500" />

                                {isLead && (
                                  <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[11px] font-mono font-extrabold uppercase tracking-wider shadow-xl ring-2 ring-black/30 backdrop-blur-md">
                                    <Crown className="h-3.5 w-3.5 text-slate-950 fill-slate-950" />
                                    <span>Lead</span>
                                  </div>
                                )}
                              </div>

                              {/* Info Content */}
                              <div className="space-y-2 px-1">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <h4 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors leading-snug">
                                      {member.name}
                                    </h4>
                                    <span
                                      className={`inline-block text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold tracking-wider mt-1 ${
                                        isLead
                                          ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                                          : "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                                      }`}
                                    >
                                      {member.role}
                                    </span>
                                  </div>
                                </div>

                                {member.description && (
                                  <p className="text-xs text-zinc-300 line-clamp-3 leading-relaxed pt-1">
                                    {member.description}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Email / Contact Footer */}
                            {member.email && (
                              <div className="pt-3 border-t border-white/[0.06] px-1">
                                <a
                                  href={`mailto:${member.email}`}
                                  className="w-full py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-violet-600/20 border border-white/10 hover:border-violet-500/40 text-zinc-300 hover:text-white text-xs font-mono transition-all flex items-center justify-center gap-2 group/email"
                                >
                                  <Mail className="h-3.5 w-3.5 text-violet-400 group-hover/email:scale-110 transition-transform" />
                                  <span className="truncate">{member.email}</span>
                                </a>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 rounded-2xl border border-dashed border-white/10 text-center space-y-2">
                      <p className="text-xs text-zinc-400">No member profiles listed for {dept.name} yet.</p>
                      <Link
                        href="/join"
                        className="inline-block text-xs text-violet-400 hover:text-violet-300 font-semibold underline"
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
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] text-center">
          <div className="mx-auto max-w-3xl glass-card p-10 rounded-3xl border border-white/10 space-y-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Want to Lead & Build with Us?
            </h3>
            <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
              We are constantly looking for enthusiastic students to join our core department teams and take ownership of initiatives.
            </p>
            <div>
              <Link
                href="/join"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
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
