import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress, ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import { Code2, ExternalLink, Github, Sparkles, Layers, Cpu, Globe, Rocket } from "lucide-react";
import Link from "next/link";
import { projectModel } from "@aurix/backend";
import type { Project } from "@aurix/types";

export const metadata: Metadata = {
  title: "Projects & Innovations | AURIX",
  description:
    "Discover open-source tools, autonomous robotics, AI models, and student-built applications created by AURIX members.",
};

// Fallback icons map based on tags/category
const iconMap: Record<string, React.ElementType> = {
  "robotics & embedded": Cpu,
  "ai & machine learning": Sparkles,
  "fullstack web & systems": Globe,
  "startup & venture": Rocket,
  "devops & infrastructure": Layers,
  "developer tools": Code2,
};

export default async function ProjectsPage() {
  let projects: Project[] = [];
  try {
    projects = await projectModel.getAll();
  } catch (error) {
    console.error("Failed to fetch projects:", error);
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col selection:bg-blue-500/30 selection:text-white">
      {/* Scroll Reading Progress Bar */}
      <ScrollProgress />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow pt-36 pb-28 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <ScrollReveal direction="up" duration={0.8}>
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
                Featured <span className="text-gradient-primary">Projects</span>
              </h1>
              <p className="text-base sm:text-lg text-zinc-400">
                From autonomous robotics and deep-learning models to open-source software and scalable web platforms.
              </p>
            </div>
          </ScrollReveal>

          {/* Projects Grid */}
          {projects.length > 0 ? (
            <StaggerContainer
              staggerDelay={0.1}
              delayChildren={0.15}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {projects.map((project) => {
                const Icon = iconMap[project.category.toLowerCase()] || Layers;
                return (
                  <StaggerItem key={project.id} duration={0.75} distance={25}>
                    <div className="group relative h-full rounded-2xl glass-card p-7 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 border border-white/[0.08] hover:border-white/20">
                      <div>
                        {/* Top icon and category */}
                        <div className="flex items-center justify-between gap-2 mb-5">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${project.accent || "from-blue-500 to-indigo-500"} text-white shadow-md group-hover:scale-110 transition-transform`}>
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
                        {project.tags && project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {project.tags.map((tag: string) => (
                              <span
                                key={tag}
                                className="rounded-md bg-white/[0.03] px-2 py-0.5 text-[11px] text-zinc-400 border border-white/[0.05]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Links */}
                        <div className="flex items-center gap-3 pt-1">
                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
                            >
                              <Github className="h-4 w-4" />
                              <span>Code Repository</span>
                            </a>
                          )}
                          {project.demo_url && (
                            <a
                              href={project.demo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span>Live Demo</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          ) : (
            <div className="text-center py-20 text-zinc-500">
              <p>Projects are currently being updated. Check back soon!</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
