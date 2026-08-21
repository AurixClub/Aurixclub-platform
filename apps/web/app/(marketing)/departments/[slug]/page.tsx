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
      { name: "Member Name", role: "Lead", image: "" },
      { name: "Member Name", role: "Co-Lead", image: "" },
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
      { name: "Member Name", role: "Lead", image: "" },
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
      <div className="min-h-screen bg-[#07090e] text-white flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Department Not Found</h1>
            <Link href="/departments" className="text-blue-400 hover:text-blue-300 transition-colors">
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
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col selection:bg-blue-500/30 selection:text-white">
      <Navbar />

      <main className="flex-grow pt-36 pb-28 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Back link */}
          <ScrollReveal direction="left" duration={0.6}>
            <Link
              href="/departments"
              className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-10 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>All Departments</span>
            </Link>
          </ScrollReveal>

          {/* Header */}
          <ScrollReveal direction="up" duration={0.8}>
            <div className="flex items-start gap-5 mb-8">
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${dept.accentColor} text-white shadow-xl flex-shrink-0`}>
                <Icon className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-2">
                  {dept.name}
                </h1>
                <p className={`text-sm font-semibold ${dept.accentText}`}>{dept.tagline}</p>
              </div>
            </div>
          </ScrollReveal>

          {/* Description */}
          <ScrollReveal direction="up" duration={0.8} delay={0.1}>
            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-3xl mb-10">
              {dept.longDescription}
            </p>
          </ScrollReveal>

          {/* Focus Areas */}
          <ScrollReveal direction="up" duration={0.8} delay={0.15}>
            <div className="mb-16">
              <h2 className="text-lg font-bold text-white mb-4">Focus Areas</h2>
              <div className="flex flex-wrap gap-2">
                {dept.focusTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-white/[0.05] border border-white/10 px-3 py-1.5 text-sm text-zinc-300"
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
                <Users className="h-5 w-5 text-zinc-400" />
                <h2 className="text-lg font-bold text-white">Team Members</h2>
              </div>

              <StaggerContainer staggerDelay={0.08} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {members.map((member, i) => (
                  <StaggerItem key={i}>
                    <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center hover:bg-white/[0.06] hover:border-white/15 transition-all duration-300">
                      {/* Photo placeholder */}
                      <div className="relative w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border-2 border-white/10 bg-white/[0.04]">
                        {member.image ? (
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Users className="h-6 w-6 text-zinc-600" />
                          </div>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-white truncate">{member.name}</h3>
                      <p className={`text-xs ${dept.accentText} mt-0.5`}>{member.role}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </ScrollReveal>

          {/* Navigation between departments */}
          <ScrollReveal direction="up" duration={0.8} delay={0.25}>
            <div className="flex items-center justify-between pt-8 border-t border-white/10">
              {prevSlug ? (
                <Link
                  href={`/departments/${prevSlug}`}
                  className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors group"
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
                  className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors group"
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
