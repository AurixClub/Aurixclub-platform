"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Layers,
  Users,
  Code,
  Handshake,
  Lightbulb,
  Megaphone,
  Rocket,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import type { Department } from "@aurix/types";

// Optional: map department names/slugs to icons if you want custom icons
const iconMap: Record<string, React.ElementType> = {
  technical: Code,
  partnerships: Handshake,
  research: Lightbulb,
  marketing: Megaphone,
  startups: Rocket,
  events: CalendarDays,
};

// Map department names/slugs to custom logo image URLs
const deptLogoMap: Record<string, string> = {
  // Technical
  "technical": "https://cdn-icons-png.flaticon.com/512/1005/1005141.png",
  "tech": "https://cdn-icons-png.flaticon.com/512/1005/1005141.png",

  // Sponsors & Industry Relations
  "sponsors-industry-relations": "https://e7.pngegg.com/pngimages/481/578/png-clipart-winnipeg-transit-logo-management-business-sponsorship-text-service-thumbnail.png",
  "sponsors-industry": "https://e7.pngegg.com/pngimages/481/578/png-clipart-winnipeg-transit-logo-management-business-sponsorship-text-service-thumbnail.png",
  "sponsors": "https://e7.pngegg.com/pngimages/481/578/png-clipart-winnipeg-transit-logo-management-business-sponsorship-text-service-thumbnail.png",

  // Innovation & Research
  "innovation-research": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSkJetsPr-kFzYQ6LL5hcpffFw8csd9n0OD8ofCm3SnHLN1fnXjXrIit8Q&s=10",
  "research": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSkJetsPr-kFzYQ6LL5hcpffFw8csd9n0OD8ofCm3SnHLN1fnXjXrIit8Q&s=10",

  // Event Management
  "event-management": "https://cdn-icons-png.flaticon.com/512/3652/3652191.png",
  "events": "https://cdn-icons-png.flaticon.com/512/3652/3652191.png",

  // Social Media & Marketing
  "social-media-marketing": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-st4Zv2miBT1ZTKa72G46VBUqjnfYtumQmoC4MIhSDg&s=10",
  "social-marketing": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-st4Zv2miBT1ZTKa72G46VBUqjnfYtumQmoC4MIhSDg&s=10",
  "marketing": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-st4Zv2miBT1ZTKa72G46VBUqjnfYtumQmoC4MIhSDg&s=10",

  // Entrepreneurship & Startup
  "entrepreneurship-startup": "https://cdn-icons-png.flaticon.com/512/1086/1086741.png",
  "startups": "https://cdn-icons-png.flaticon.com/512/1086/1086741.png",
  "entrepreneurship": "https://cdn-icons-png.flaticon.com/512/1086/1086741.png",
};

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

  // Dynamic entrance variants (ultra-smooth floating entry optimized for mobile and desktop)
  const getCardVariants = (index: number): Variants => {
    const col = index % 3;
    const xOffset = col === 0 ? -40 : col === 2 ? 40 : 0;

    return {
      hidden: {
        opacity: 0,
        x: xOffset,
        y: 45,
        scale: 0.95,
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.75,
          ease: [0.21, 0.47, 0.32, 0.98],
          delay: (index % 6) * 0.08,
        },
      },
    };
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-indigo-600/15 via-violet-600/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_60%,transparent_100%)] pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-5"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 backdrop-blur-md px-4 py-1.5 text-xs font-medium text-violet-300 shadow-lg shadow-violet-950/20">
            <Layers className="h-3.5 w-3.5" />
            <span>Core Domains & Structure</span>
          </div>

          <h2
            className="font-montserrat text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white"
            style={{
              textShadow: "0 2px 20px rgba(0,0,0,0.5)",
            }}
          >
            Explore Our Core Departments
          </h2>

          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
            Six specialized domains driving engineering, partnerships,
            deep-tech research, and events across AURIX.
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="h-10 w-10 rounded-full border-2 border-violet-500/30 border-t-violet-400 animate-spin" />
            <span className="text-sm text-zinc-500 font-medium tracking-wide">
              Loading Departments...
            </span>
          </div>
        )}

        {/* Cards Grid with Smooth Staggered Scroll-In */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {departments.map((dept, index) => {
              const slugKey = dept.slug?.toLowerCase() || "";
              const nameKey = dept.name?.toLowerCase() || "";

              const Icon =
                iconMap[slugKey] ||
                iconMap[nameKey] ||
                Layers;

              const customLogo =
                deptLogoMap[slugKey] ||
                deptLogoMap[nameKey] ||
                (slugKey.includes("tech") || nameKey.includes("tech") ? deptLogoMap["technical"] : undefined) ||
                (slugKey.includes("sponsor") || nameKey.includes("sponsor") ? deptLogoMap["sponsors-industry-relations"] : undefined) ||
                (slugKey.includes("social") || slugKey.includes("media") || slugKey.includes("marketing") || nameKey.includes("marketing") || nameKey.includes("social") ? deptLogoMap["social-media-marketing"] : undefined) ||
                (slugKey.includes("research") || slugKey.includes("innovation") || nameKey.includes("research") || nameKey.includes("innovation") ? deptLogoMap["innovation-research"] : undefined) ||
                (slugKey.includes("event") || nameKey.includes("event") ? deptLogoMap["event-management"] : undefined) ||
                (slugKey.includes("startup") || slugKey.includes("entrepreneur") || nameKey.includes("startup") || nameKey.includes("entrepreneur") ? deptLogoMap["entrepreneurship-startup"] : undefined);

              return (
                <motion.div
                  key={dept.id}
                  id={dept.slug}
                  variants={getCardVariants(index)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  whileHover={{ y: -8, transition: { duration: 0.25 } }}
                  style={{ willChange: "transform, opacity" }}
                  className="group relative h-full"
                >
                  {/* Subtle Gradient Glow Ring on Hover */}
                  <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-indigo-500/0 via-violet-500/0 to-fuchsia-500/0 group-hover:from-indigo-500/30 group-hover:via-violet-500/25 group-hover:to-fuchsia-500/30 transition-all duration-500 opacity-0 group-hover:opacity-100 blur-[1px]" />

                  {/* Card Container */}
                  <div className="relative h-full rounded-3xl bg-gradient-to-b from-[#0f1322]/90 via-[#0a0d18]/90 to-[#070912]/95 backdrop-blur-xl border border-white/[0.08] group-hover:border-violet-500/30 p-5 sm:p-6 flex flex-col justify-between shadow-xl shadow-black/30 group-hover:shadow-[0_20px_50px_rgba(99,102,241,0.18)] transition-all duration-400 overflow-hidden">
                    {/* Ambient corner glow */}
                    <div className="absolute top-0 right-0 w-36 h-36 bg-violet-600/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <div className="relative z-10 space-y-5">
                      {/* Department Logo Container */}
                      <div className="flex items-center justify-between gap-3 min-h-[56px]">
                        {customLogo ? (
                          <div className="flex h-14 items-center justify-start group-hover:scale-105 transition-transform duration-300">
                            <img src={customLogo} alt={dept.name} className="h-12 w-auto max-w-[160px] object-contain rounded-lg" />
                          </div>
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/15 via-violet-500/15 to-purple-500/15 border border-violet-500/25 text-violet-300 group-hover:scale-105 group-hover:text-white group-hover:border-violet-400/40 transition-all duration-300 shadow-md">
                            <Icon className="h-6 w-6" />
                          </div>
                        )}
                      </div>

                      {/* Department Title & Description */}
                      <div className="space-y-2.5">
                        <h3 className="font-montserrat text-xl font-bold text-white group-hover:text-violet-200 transition-colors duration-300">
                          {dept.name}
                        </h3>

                        <p className="text-sm text-zinc-300 leading-relaxed group-hover:text-zinc-200 transition-colors duration-300">
                          {dept.description}
                        </p>
                      </div>
                    </div>

                    {/* Clean Action Footer */}
                    <div className="relative z-10 pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between gap-3">
                      <Link
                        href={`/departments/${dept.slug}`}
                        className="text-xs font-semibold text-violet-400 hover:text-violet-300 inline-flex items-center gap-1.5 transition-all group/link"
                      >
                        <Users className="h-3.5 w-3.5" />
                        <span>Explore Domain</span>
                        <ArrowRight className="h-3.5 w-3.5 opacity-70 group-hover/link:translate-x-1 group-hover/link:opacity-100 transition-all duration-300" />
                      </Link>

                      <Link
                        href="/join"
                        className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-violet-600/20 text-zinc-300 hover:text-white border border-white/10 hover:border-violet-500/40 text-xs font-medium transition-all duration-300"
                      >
                        Apply Now
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}