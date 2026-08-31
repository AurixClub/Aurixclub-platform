"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Code,
  Handshake,
  Lightbulb,
  CalendarDays,
  Megaphone,
  Rocket,
  ArrowLeft,
  ArrowRight,
  Users,
} from "lucide-react";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import type { DepartmentMember } from "@aurix/types";

/* ───── Department Data ───── */

const departments: Record<
  string,
  {
    name: string;
    tagline: string;
    description: string;
    longDescription: string;
    icon: typeof Code;
    accentColor: string;
    accentText: string;
    focusTags: string[];
    members: { name: string; role: string; image: string }[];
  }
> = {
  technical: {
    name: "Technical Department",
    tagline: "Engineering & Architecture",
    description:
      "Build, experiment, and solve real-world problems through cutting-edge technology and engineering.",
    longDescription:
      "The Technical Department is the engine of AURIX. We design, develop, and deploy real-world solutions across software engineering, AI/ML, robotics, IoT, and systems architecture. From open-source contributions to hackathon projects, this is where code meets impact.",
    icon: Code,
    accentColor: "from-blue-500 to-indigo-500",
    accentText: "text-blue-400",
    focusTags: ["Web & App Dev", "AI & ML", "Robotics", "Systems", "Cloud & DevOps", "Open Source"],
    members: [
      { name: "Member Name", role: "Lead", image: "" },
      { name: "Member Name", role: "Co-Lead", image: "" },
      { name: "Member Name", role: "Core Member", image: "" },
      { name: "Member Name", role: "Core Member", image: "" },
    ],
  },
  "sponsors-industry": {
    name: "Sponsors & Industry Relations",
    tagline: "Partnerships & Networks",
    description:
      "Connect AURIX with leading tech companies, alumni networks, venture partners, and sponsors.",
    longDescription:
      "The Sponsors & Industry Relations department bridges the gap between campus and industry. We build partnerships with tech companies, secure sponsorships for events, coordinate mentorship programs, and create networking opportunities that give students real-world exposure.",
    icon: Handshake,
    accentColor: "from-indigo-500 to-violet-500",
    accentText: "text-indigo-400",
    focusTags: ["Sponsorships", "Corporate Relations", "Mentorship", "Alumni Network", "Industry Talks"],
    members: [
      { name: "Member Name", role: "Core Member", image: "" },
    ],
  },
  "innovation-research": {
    name: "Innovation & Research",
    tagline: "R&D & Deep Tech",
    description:
      "Explore emerging technologies, publish scientific papers, and turn breakthrough ideas into reality.",
    longDescription:
      "The Innovation & Research department pushes boundaries. We explore emerging technologies, conduct experiments, publish research papers, contribute to patents, and create prototypes that test the limits of what's possible. Curiosity drives everything we do.",
    icon: Lightbulb,
    accentColor: "from-amber-500 to-orange-500",
    accentText: "text-amber-400",
    focusTags: ["Paper Publishing", "R&D Labs", "Open Source", "Patents", "Deep Tech", "Experiments"],
    members: [
      { name: "Member Name", role: "Lead", image: "" },
      { name: "Member Name", role: "Co-Lead", image: "" },
      { name: "Member Name", role: "Core Member", image: "" },
    ],
  },
  "event-management": {
    name: "Event Management",
    tagline: "Operations & Experience",
    description:
      "Plan, organize, and orchestrate flagship hackathons, tech fests, workshops, and immersive community experiences.",
    longDescription:
      "The Event Management department is the operational backbone of AURIX. From flagship hackathons and tech fests to workshops and guest lectures, we plan, coordinate, and execute events that bring the community together and create unforgettable experiences.",
    icon: CalendarDays,
    accentColor: "from-purple-500 to-fuchsia-500",
    accentText: "text-purple-400",
    focusTags: ["Hackathons", "Tech Fests", "Guest Talks", "Operations", "Logistics", "Experience Design"],
    members: [
      { name: "Adithya P", role: "Department Head", image: "/team/team-1.jpg" },
      { name: "Member Name", role: "Co-Lead", image: "" },
      { name: "Member Name", role: "Core Member", image: "" },
    ],
  },
  "social-marketing": {
    name: "Social Media & Marketing",
    tagline: "Content & Brand Growth",
    description:
      "Craft stories, create digital design assets, expand reach, and bring AURIX culture to the global stage.",
    longDescription:
      "The Social Media & Marketing department is the voice of AURIX. We craft compelling stories, design visual content, manage social media platforms, run campaigns, and build a strong digital presence that amplifies the work of every department and member.",
    icon: Megaphone,
    accentColor: "from-pink-500 to-rose-500",
    accentText: "text-pink-400",
    focusTags: ["Design & Media", "Campaigns", "Content Strategy", "PR", "Brand Identity", "Analytics"],
    members: [
      { name: "Member Name", role: "Lead", image: "" },
      { name: "Member Name", role: "Co-Lead", image: "" },
      { name: "Member Name", role: "Core Member", image: "" },
    ],
  },
  "entrepreneurship-startup": {
    name: "Entrepreneurship & Startup",
    tagline: "Venture & Incubation",
    description:
      "Turn prototypes into scalable ventures, connect with accelerators, and build products that make real market impact.",
    longDescription:
      "The Entrepreneurship & Startup department turns ideas into ventures. We help students validate ideas, build prototypes, pitch to investors, connect with accelerators, and take their first steps toward building real companies. This is where builders become founders.",
    icon: Rocket,
    accentColor: "from-emerald-500 to-teal-500",
    accentText: "text-emerald-400",
    focusTags: ["Pitch Nights", "Product Strategy", "Seed Prep", "Incubation", "Market Research", "MVP Building"],
    members: [
      { name: "Member Name", role: "Lead", image: "" },
      { name: "Member Name", role: "Co-Lead", image: "" },
      { name: "Member Name", role: "Core Member", image: "" },
    ],
  },
};

const deptOrder = [
  "technical",
  "sponsors-industry",
  "innovation-research",
  "event-management",
  "social-marketing",
  "entrepreneurship-startup",
];

export default function DepartmentDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const dept = departments[slug];
  const [liveMembers, setLiveMembers] = useState<DepartmentMember[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/departments")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !data.success) return;
        const current = data.data?.departments?.find(
          (department: { slug: string }) => department.slug === slug
        );
        if (!cancelled && current) setLiveMembers(current.members ?? []);
      })
      .catch(() => {
        // Keep the editorial fallback if the public API is temporarily unavailable.
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!dept) {
    return (
      <div className="min-h-screen bg-white text-zinc-900 flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-zinc-900">Department Not Found</h1>
            <Link href="/departments" className="text-indigo-600 hover:text-indigo-700 transition-colors">
              ← Back to Departments
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const Icon = dept.icon;
  const members = liveMembers
    ? liveMembers.map((member) => ({
      name: member.name,
      role: member.role,
      image: member.avatar_url ?? "",
    }))
    : dept.members;
  const currentIndex = deptOrder.indexOf(slug);
  const prevSlug = currentIndex > 0 ? deptOrder[currentIndex - 1] : null;
  const nextSlug = currentIndex < deptOrder.length - 1 ? deptOrder[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-[#f5f8fc] text-zinc-900 flex flex-col selection:bg-indigo-500/20 selection:text-indigo-900">
      <Navbar />

      {/* Light Subtle Blue Top Banner */}
      <section className="relative pt-28 pb-14 sm:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-blue-100/70 via-indigo-50/40 to-[#f5f8fc] text-zinc-900 border-b border-blue-100/70">
        {/* Subtle Geometric Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c70a_1px,transparent_1px),linear-gradient(to_bottom,#0284c70a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none z-0" />

        {/* Light Ambient Glow Orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[260px] bg-gradient-to-tr from-blue-400/20 via-indigo-300/20 to-sky-300/15 rounded-full blur-[90px] pointer-events-none z-0" />

        <div className="mx-auto max-w-5xl relative z-10">
          {/* Back link */}
          <ScrollReveal direction="left" duration={0.6}>
            <Link
              href="/departments"
              className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-indigo-600 transition-colors mb-6 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>All Departments</span>
            </Link>
          </ScrollReveal>

          {/* Department Title & Badge */}
          <ScrollReveal direction="up" duration={0.8}>
            <div className="flex items-center gap-4 sm:gap-5 mb-2">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-zinc-200 text-indigo-600 shadow-sm flex-shrink-0">
                <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 mb-1">
                  {dept.name}
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-indigo-600 font-mono tracking-wide">{dept.tagline}</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <main className="flex-grow pt-8 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">

          {/* Description */}
          <ScrollReveal direction="up" duration={0.8} delay={0.1}>
            <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-3xl mb-10">
              {dept.longDescription}
            </p>
          </ScrollReveal>

          {/* Focus Areas */}
          <ScrollReveal direction="up" duration={0.8} delay={0.15}>
            <div className="mb-16">
              <h2 className="text-lg font-bold text-zinc-900 mb-4">Focus Areas</h2>
              <div className="flex flex-wrap gap-2">
                {dept.focusTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-slate-50 border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Team Members */}
          <ScrollReveal direction="up" duration={0.8} delay={0.2}>
            <div className="mb-16">
              <div className="flex items-center gap-2 mb-6">
                <Users className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-zinc-900">Team Members</h2>
              </div>
              <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((member, i) => (
                  <StaggerItem key={i}>
                    <div className="group rounded-3xl border border-zinc-200 bg-white p-4 text-center hover:border-indigo-300 shadow-md shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500">
                      {/* Large Photo showcase */}
                      <div className="relative w-full aspect-[3/4] max-h-72 mx-auto mb-4 rounded-2xl overflow-hidden ring-1 ring-zinc-200 group-hover:ring-2 group-hover:ring-indigo-500 bg-slate-100 shadow-sm transition-all duration-500">
                        {member.image ? (
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-indigo-50 text-indigo-700">
                            <span className="text-4xl font-black text-indigo-600">{member.name.charAt(0)}</span>
                            <span className="text-[10px] text-indigo-500 font-mono mt-1 uppercase tracking-wider">{dept.name}</span>
                          </div>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors truncate">{member.name}</h3>
                      <p className="text-xs font-mono font-semibold text-indigo-600 mt-1">{member.role}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </ScrollReveal>

          {/* Navigation between departments */}
          <ScrollReveal direction="up" duration={0.8} delay={0.25}>
            <div className="flex items-center justify-between pt-8 border-t border-zinc-200">
              {prevSlug ? (
                <Link
                  href={`/departments/${prevSlug}`}
                  className="flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-indigo-600 transition-colors group"
                >
                  <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
                  <span>{departments[prevSlug]?.name}</span>
                </Link>
              ) : (
                <div />
              )}
              {nextSlug ? (
                <Link
                  href={`/departments/${nextSlug}`}
                  className="flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-indigo-600 transition-colors group"
                >
                  <span>{departments[nextSlug]?.name}</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              ) : (
                <div />
              )}
            </div>
          </ScrollReveal>
        </div>
      </main>

      <Footer />
    </div>
  );
}
