"use client";

import React from "react";
import Link from "next/link";
import { Handshake, ArrowRight, Sparkles, Building2, Globe2, ShieldCheck } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const PARTNERS = [
  { name: "Tech & Cloud Giants", category: "Cloud & Dev Infra", icon: Globe2 },
  { name: "AI & Innovation Labs", category: "Research & Compute", icon: Sparkles },
  { name: "Ecosystem Accelerators", category: "Startup & Incubation", icon: Building2 },
  { name: "Industry Leaders", category: "Talent & Hackathons", icon: ShieldCheck },
];

export function SponsorsSection() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-zinc-200 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl">
        <ScrollReveal direction="up" duration={0.8}>
          <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-medium text-indigo-700 shadow-sm">
              <Handshake className="h-3.5 w-3.5 text-indigo-600" />
              <span>Industry & Corporate Partnerships</span>
            </div>
            <h2 className="font-montserrat text-3xl sm:text-5xl font-extrabold text-zinc-900 tracking-tight">
              Backed by Industry <span className="text-indigo-600">Collaborators</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
              AURIX collaborates with leading technology organizations, startup venture networks, and campus alumni to bring real-world opportunities to students.
            </p>
          </div>
        </ScrollReveal>

        {/* Partner Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {PARTNERS.map((partner, idx) => {
            const Icon = partner.icon;
            return (
              <ScrollReveal key={partner.name} direction="up" delay={idx * 0.1} duration={0.6}>
                <div className="group rounded-2xl p-6 bg-white border border-zinc-200 shadow-md shadow-slate-200/50 hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="h-12 w-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 mb-1 group-hover:text-indigo-600 transition-colors">
                    {partner.name}
                  </h3>
                  <p className="text-xs text-zinc-500 font-mono">
                    {partner.category}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* CTA to Connect for Collaborations */}
        <ScrollReveal direction="up" delay={0.3} duration={0.6}>
          <div className="text-center">
            <Link
              href="/departments/sponsors-industry-relations"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors group"
            >
              <span>Contact for Collaborations</span>
              <ArrowRight className="h-4 w-4 text-indigo-600 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default SponsorsSection;
