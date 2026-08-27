import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress, ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import { Code2, ExternalLink, Github, Sparkles, Layers, Cpu, Globe, Rocket } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Projects & Innovations | AURIX",
  description:
    "Discover open-source tools, autonomous robotics, AI models, and student-built applications created by AURIX members.",
};

export default function ProjectsPage() {
  const projects = [
    {
      title: "AURIX Autonomous Rover",
      category: "Robotics & Embedded",
      description:
        "Terrain-mapping autonomous robotic platform powered by ROS 2, LiDAR navigation, and edge compute for search & rescue simulation.",
      tags: ["ROS 2", "Python", "LiDAR", "C++", "Computer Vision"],
      icon: Cpu,
      accent: "from-blue-500 to-cyan-500",
      github: "https://github.com",
    },
    {
      title: "NeuroMesh AI Pipeline",
      category: "AI & Machine Learning",
      description:
        "Distributed multi-agent neural network benchmark for low-latency edge inference on embedded devices.",
      tags: ["PyTorch", "FastAPI", "ONNX", "Docker", "TypeScript"],
      icon: Sparkles,
      accent: "from-purple-500 to-indigo-500",
      github: "https://github.com",
    },
    {
      title: "Campus Pulse Web Platform",
      category: "Fullstack Web & Systems",
      description:
        "Real-time event discovery and collaborative student portal with instant notifications, auth, and analytics dashboard.",
      tags: ["Next.js 15", "TypeScript", "Tailwind CSS", "Supabase", "Prisma"],
      icon: Globe,
      accent: "from-emerald-500 to-teal-500",
      github: "https://github.com",
    },
    {
      title: "VentureLaunch Pitch OS",
      category: "Startup & Venture",
      description:
        "Interactive deck creator and feedback engine for student founders preparing for pitch competitions and seed programs.",
      tags: ["React", "Node.js", "PostgreSQL", "Tailwind CSS"],
      icon: Rocket,
      accent: "from-amber-500 to-orange-500",
      github: "https://github.com",
    },
    {
      title: "OpenTelemetry Club Analytics",
      category: "DevOps & Infrastructure",
      description:
        "Observability dashboard monitoring club server infrastructure, workshop attendee metrics, and deployed project uptime.",
      tags: ["Grafana", "Prometheus", "Docker", "Go", "Next.js"],
      icon: Layers,
      accent: "from-rose-500 to-pink-500",
      github: "https://github.com",
    },
    {
      title: "CodeCraft Algorithmic Judge",
      category: "Developer Tools",
      description:
        "Custom competitive programming sandbox engine for club coding rounds with real-time testcase execution and ranking.",
      tags: ["Rust", "WebSockets", "React", "Linux Containers"],
      icon: Code2,
      accent: "from-indigo-500 to-blue-500",
      github: "https://github.com",
    },
  ];

  return (
    <div className="hero-page-shell min-h-screen bg-[#07090e] text-white flex flex-col selection:bg-blue-500/30 selection:text-white">
      {/* Scroll Reading Progress Bar */}
      <ScrollProgress />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="reference-editorial-section flex-grow pt-36 pb-28 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <ScrollReveal direction="up" duration={0.8}>
            <div className="max-w-3xl mb-16 space-y-4">

              <h1 className="max-w-4xl text-5xl sm:text-7xl font-semibold tracking-[-0.06em] text-white">
                Featured <span className="text-gradient-primary">Projects</span>
              </h1>
              <p className="text-base sm:text-lg text-zinc-400">
                From autonomous robotics and deep-learning models to open-source software and scalable web platforms.
              </p>
            </div>
          </ScrollReveal>

          {/* Projects Grid */}
          <StaggerContainer
            staggerDelay={0.1}
            delayChildren={0.15}
            className="grid grid-cols-1 border-t border-white/12 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-0"
          >
            {projects.map((project) => {
              const Icon = project.icon;
              return (
                <StaggerItem key={project.title} duration={0.75} distance={25}>
                  <div className="group relative h-full border-b border-white/12 bg-transparent p-7 flex flex-col justify-between transition-colors duration-500 hover:bg-white/[0.035]">
                    <div>
                      {/* Top icon and category */}
                      <div className="flex items-center justify-between gap-2 mb-5">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${project.accent} text-white shadow-md group-hover:scale-110 transition-transform`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="rounded-full px-2.5 py-0.5 text-[11px] font-mono text-zinc-400 bg-white/[0.04] border border-white/10">
                          {project.category}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                        {project.title}
                      </h3>

                      <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                        {project.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/[0.06] space-y-4">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-white/[0.03] px-2 py-0.5 text-[11px] text-zinc-400 border border-white/[0.05]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Links */}
                      <div className="flex items-center gap-3 pt-1">
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
                        >
                          <Github className="h-4 w-4" />
                          <span>Code Repository</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
