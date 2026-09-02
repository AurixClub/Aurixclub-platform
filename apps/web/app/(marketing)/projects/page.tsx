import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import { Code2, ExternalLink, Github, Sparkles, Layers, Cpu, Globe, Rocket } from "lucide-react";
import { projectModel } from "@aurix/backend";
import type { Project } from "@aurix/types";

export const metadata: Metadata = {
  title: "Projects & Innovations | AURIX",
  description:
    "Discover open-source tools, autonomous robotics, AI models, and student-built applications created by AURIX members at Dr. AIT.",
};

// Fallback icons map based on tags/category
const iconMap: Record<string, React.ElementType> = {
  "robotics & embedded": Cpu,
  "ai & machine learning": Sparkles,
  "fullstack web & systems": Globe,
  "startup & venture": Rocket,
  "devops & infrastructure": Layers,
  "open source & tools": Code2,
  "developer tools": Code2,
};

const FALLBACK_PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "Autonomous Navigation Rover (AURIX-AGV)",
    category: "Robotics & Embedded",
    description: "Indoor SLAM and path planning mobile robot utilizing LiDAR, ROS2, and stereo cameras for autonomous obstacle evasion at Dr. AIT.",
    tags: ["ROS2", "Python", "LiDAR", "C++"],
    icon: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80",
    accent: null,
    github_url: "https://github.com/aurixclub",
    demo_url: "https://aurix.club",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "proj-2",
    title: "Neural Vision Defect Detector",
    category: "AI & Machine Learning",
    description: "Deep learning model trained with PyTorch and YOLOv8 for automated hardware and PCB solder joint anomaly detection.",
    tags: ["PyTorch", "Computer Vision", "YOLOv8", "OpenCV"],
    icon: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&auto=format&fit=crop&q=80",
    accent: null,
    github_url: "https://github.com/aurixclub",
    demo_url: "https://aurix.club",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "proj-3",
    title: "AURIX Smart Campus Hub",
    category: "Fullstack Web & Systems",
    description: "Modern club community hub featuring role-based authentication, event registration, QR ticketing, and department governance.",
    tags: ["Next.js", "TypeScript", "TailwindCSS", "Supabase"],
    icon: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
    accent: null,
    github_url: "https://github.com/aurixclub",
    demo_url: "https://aurix.club",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "proj-4",
    title: "Telemetry & Sensor Fusion Gateway",
    category: "DevOps & Infrastructure",
    description: "Lightweight MQTT IoT data pipeline collecting real-time environmental telemetry across engineering labs.",
    tags: ["IoT", "MQTT", "Grafana", "Docker"],
    icon: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
    accent: null,
    github_url: "https://github.com/aurixclub",
    demo_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "proj-5",
    title: "Edge AI Voice Command Assistant",
    category: "Open Source & Tools",
    description: "Offline edge-computing speech recognizer running on Raspberry Pi and Jetson Nano with custom keyword spotting.",
    tags: ["Edge AI", "TensorFlow Lite", "Embedded"],
    icon: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
    accent: null,
    github_url: "https://github.com/aurixclub",
    demo_url: "https://aurix.club",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "proj-6",
    title: "DevSprint Student Hackathon Platform",
    category: "Startup & Venture",
    description: "Collaborative portal for team formation, real-time code submission, and automated rubric scoring for tech events.",
    tags: ["Next.js", "Node.js", "PostgreSQL"],
    icon: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
    accent: null,
    github_url: "https://github.com/aurixclub",
    demo_url: "https://aurix.club",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default async function ProjectsPage() {
  let dbProjects: Project[] = [];
  try {
    dbProjects = await projectModel.getAll();
  } catch (error) {
    console.error("Failed to fetch projects:", error);
  }

  const projects = dbProjects.length > 0 ? dbProjects : FALLBACK_PROJECTS;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f6fc] via-[#f7fafd] to-[#ffffff] text-zinc-900 flex flex-col selection:bg-blue-500/20 selection:text-blue-900 relative overflow-hidden">
      {/* Scroll Reading Progress Bar */}
      <ScrollProgress />

      {/* Radiant Soft Sunrise Ambient Glows - Subtle & Elegant */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] sm:w-[1200px] h-[480px] bg-gradient-to-b from-sky-200/20 via-blue-100/10 to-transparent rounded-full blur-[120px] pointer-events-none -z-0" />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[520px] h-[300px] bg-gradient-to-b from-amber-100/25 via-sky-100/15 to-transparent rounded-full blur-[90px] pointer-events-none -z-0" />
      {/* Subtle geometric morning dawn grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(37,99,235,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(37,99,235,0.025)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_50%,transparent_100%)] pointer-events-none -z-0" />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow pt-24 sm:pt-28 pb-24 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="mb-10 text-left">
            <h1 className="font-montserrat text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
              Projects & Innovations
            </h1>
            <p className="text-zinc-600 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Explore autonomous robotics, deep-learning models, and production web applications built by AURIX members at Dr. AIT.
            </p>
          </div>

          {/* Projects Grid (Styled Identically to Event Cards) */}
          <StaggerContainer
            staggerDelay={0.08}
            delayChildren={0.1}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {projects.map((project) => {
              const Icon = iconMap[project.category.toLowerCase()] || Code2;
              return (
                <StaggerItem key={project.id} duration={0.5} distance={18}>
                  <div className="group flex-shrink-0 w-full rounded-2xl border border-zinc-200/80 bg-zinc-100 p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-300 hover:bg-zinc-50 hover:shadow-xl active:scale-[0.98] shadow-sm flex flex-col justify-between overflow-hidden h-full">
                    <div>
                      {/* Box-Type Image / Banner (Exact Same as Events Card) */}
                      <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-4 bg-slate-200 ring-1 ring-zinc-200/90 shadow-xs">
                        {project.icon ? (
                          <img
                            src={project.icon}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-indigo-500/15 via-blue-500/10 to-indigo-600/25 flex flex-col items-center justify-center gap-1.5 p-3 text-center">
                            <Icon className="h-8 w-8 text-indigo-600/80" />
                            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-indigo-700">
                              AURIX Project
                            </span>
                          </div>
                        )}

                        {/* Category Badge Overlay */}
                        <div className="absolute top-2.5 left-2.5">
                          <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold border backdrop-blur-md shadow-xs bg-indigo-100/95 text-indigo-800 border-indigo-200">
                            {project.category}
                          </span>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h2 className="text-base sm:text-lg font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-1.5">
                        {project.title}
                      </h2>

                      <p className="text-xs text-zinc-600 leading-relaxed line-clamp-2 mb-4">
                        {project.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-zinc-200/70 space-y-3 mt-auto">
                      {/* Tags */}
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {project.tags.map((tag: string) => (
                            <span
                              key={tag}
                              className="rounded-md bg-white px-2 py-0.5 text-[10px] font-mono text-zinc-600 border border-zinc-200 font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Links / Action Buttons */}
                      <div className="flex items-center gap-2.5 pt-1">
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 transition-all shadow-xs"
                          >
                            <Github className="h-3.5 w-3.5" />
                            <span>Code</span>
                          </a>
                        )}
                        {project.demo_url && (
                          <a
                            href={project.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white transition-all shadow-xs"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
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
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
