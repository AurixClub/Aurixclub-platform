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
        filter: "blur(6px)",
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: {
          duration: 0.85,
          ease: [0.16, 1, 0.3, 1],
          delay: (index % 6) * 0.08,
        },
      },
    };
  };

  return (
    <section className="relative pt-8 sm:pt-12 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-transparent">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-blue-200/30 via-indigo-100/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-sky-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_60%,transparent_100%)] pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-5"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-medium text-indigo-700 shadow-sm">
            <Layers className="h-3.5 w-3.5" />
            <span>Core Domains & Structure</span>
          </div>

          <h2 className="font-montserrat text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900">
            Explore Our Core Departments
          </h2>

          <p className="text-base sm:text-lg text-zinc-600 leading-relaxed">
            Six specialized domains driving engineering, partnerships,
            deep-tech research, and events across AURIX.
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="h-10 w-10 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
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
                  <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-indigo-500/0 via-violet-500/0 to-fuchsia-500/0 group-hover:from-indigo-500/20 group-hover:via-violet-500/15 group-hover:to-fuchsia-500/20 transition-all duration-500 opacity-0 group-hover:opacity-100 blur-[1px]" />

                  {/* Card Container */}
                  <div className="relative h-full rounded-2xl bg-zinc-100 border border-zinc-200/80 group-hover:border-indigo-300 p-4 sm:p-5 flex flex-col justify-between shadow-sm group-hover:shadow-lg transition-all duration-400 overflow-hidden">
                    {/* Ambient corner glow */}
                    <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <div className="relative z-10 space-y-3">
                      {/* Department Logo Container */}
                      <div className="flex items-center justify-between gap-3 min-h-[56px]">
                        {customLogo ? (
                          <div className="flex h-14 items-center justify-start group-hover:scale-105 transition-transform duration-300">
                            <img src={customLogo} alt={dept.name} className="h-14 w-auto max-w-[160px] object-contain rounded-lg" />
                          </div>
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                            <Icon className="h-6 w-6" />
                          </div>
                        )}
                      </div>

                      {/* Department Title & Description */}
                      <div className="space-y-1.5">
                        <h3 className="font-montserrat text-base font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors duration-300">
                          {dept.name}
                        </h3>

                        <p className="text-xs text-zinc-600 leading-relaxed group-hover:text-zinc-800 transition-colors duration-300 line-clamp-3">
                          {dept.description}
                        </p>
                      </div>
                    </div>

                    {/* Clean Action Footer */}
                    <div className="relative z-10 pt-4 mt-4 border-t border-zinc-200/60 flex items-center justify-between gap-3">
                      <Link
                        href={`/departments/${dept.slug}`}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1.5 transition-all group/link"
                      >
                        <Users className="h-3.5 w-3.5" />
                        <span>Explore Domain</span>
                        <ArrowRight className="h-3.5 w-3.5 opacity-70 group-hover/link:translate-x-1 group-hover/link:opacity-100 transition-all duration-300" />
                      </Link>

                      <Link
                        href="/join"
                        className="px-3.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-indigo-50 hover:border-indigo-200 text-zinc-800 hover:text-indigo-700 border border-zinc-200 text-xs font-semibold transition-all duration-300"
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