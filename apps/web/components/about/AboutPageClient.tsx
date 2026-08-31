"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Users,
  Rocket,
  Building2,
  Cpu,
  FlaskConical,
  Briefcase,
  Megaphone,
  Award,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Quote,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";

/* ───── Data ───── */

const facultyCoordinators = [
  {
    name: "Dr. B. S. Shylaja",
    role: "Chief Faculty Advisor",
    designation: "Professor & Academic Mentor",
    dept: "Dept. of Computer Science & Engineering",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
    bio: "Empowering students to transform foundational computer science concepts into scalable, real-world systems and open technology ecosystems.",
    tags: ["Systems Architecture", "Open Source", "Student Mentorship"],
  },
  {
    name: "Dr. K. N. Anuradha",
    role: "Faculty Project Mentor",
    designation: "Associate Professor & Research Lead",
    dept: "Dept. of Electronics & Communication",
    image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=600&auto=format&fit=crop",
    bio: "Championing hands-on robotics, IoT engineering, competition excellence, and patent-driven student innovations across university hackathons.",
    tags: ["Robotics & IoT", "Patent Research", "Hardware Prototyping"],
  },
  {
    name: "Prof. Rajesh Kumar",
    role: "Faculty Industry Liaison",
    designation: "Assistant Professor & Corporate Coordinator",
    dept: "Dept. of Information Science & Engineering",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop",
    bio: "Creating strategic industry bridges, venture incubation pathways, and corporate collaborations that launch student careers into top-tier tech.",
    tags: ["Startup Incubation", "Corporate Hackathons", "Industry Relations"],
  },
  {
    name: "Dr. M. V. Vijaya Kumar",
    role: "AI & ML Technical Advisor",
    designation: "Professor & Innovation Mentor",
    dept: "Dept. of Artificial Intelligence & ML",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
    bio: "Guiding deep learning architectures, intelligent agents, and machine intelligence research initiatives at AURIX.",
    tags: ["Machine Learning", "Neural Systems", "Research"],
  },
  {
    name: "Dr. Jyothi P.",
    role: "Student Innovation Mentor",
    designation: "Associate Professor & Program Lead",
    dept: "Dept. of Data Science & Engineering",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=600&auto=format&fit=crop",
    bio: "Nurturing interdisciplinary hackathon teams, analytics competitions, and inclusive builder initiatives across Dr. AIT.",
    tags: ["Data Engineering", "Hackathons", "Mentorship"],
  },
];

const pillars = [
  {
    icon: Cpu,
    title: "Technical Projects",
    desc: "Build real-world solutions through software, hardware, emerging technologies, and open-source collaboration.",
    color: "from-blue-500 to-cyan-400",
    border: "border-blue-500/20",
    glow: "group-hover:shadow-blue-500/10",
  },
  {
    icon: FlaskConical,
    title: "Research & Innovation",
    desc: "Explore emerging technologies, experiment with new ideas, and turn curiosity into meaningful research and innovation.",
    color: "from-purple-500 to-pink-400",
    border: "border-purple-500/20",
    glow: "group-hover:shadow-purple-500/10",
  },
  {
    icon: Briefcase,
    title: "Industry Relations",
    desc: "Connect students with industry professionals, organizations, mentors, and opportunities beyond the campus.",
    color: "from-amber-500 to-orange-400",
    border: "border-amber-500/20",
    glow: "group-hover:shadow-amber-500/10",
  },
  {
    icon: Rocket,
    title: "Entrepreneurship & Startups",
    desc: "Transform ideas into prototypes, explore business opportunities, and take the first steps toward building ventures.",
    color: "from-emerald-500 to-teal-400",
    border: "border-emerald-500/20",
    glow: "group-hover:shadow-emerald-500/10",
  },
  {
    icon: Megaphone,
    title: "Community & Marketing",
    desc: "Share ideas, amplify student initiatives, and build a strong digital presence for the AURIX community.",
    color: "from-rose-500 to-pink-400",
    border: "border-rose-500/20",
    glow: "group-hover:shadow-rose-500/10",
  },
  {
    icon: Award,
    title: "Events & Competitions",
    desc: "Organize high-impact hackathons, bootcamps, workshops, and competitive tech challenges for student builders.",
    color: "from-cyan-500 to-blue-400",
    border: "border-cyan-500/20",
    glow: "group-hover:shadow-cyan-500/10",
  },
];

const missionSteps = [
  {
    num: "01",
    label: "FOUNDATION",
    title: "Learn",
    subtitle: "Knowledge in Action",
    desc: "Explore new technologies, develop practical skills, and learn from peers, mentors, and industry professionals.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    num: "02",
    label: "EXECUTION",
    title: "Build",
    subtitle: "Hands-on Engineering",
    desc: "Turn ideas into projects, prototypes, experiments, and solutions that address real-world challenges.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
  },
  {
    num: "03",
    label: "IMPACT",
    title: "Lead",
    subtitle: "Creating Opportunities",
    desc: "Take initiative, collaborate with others, and create opportunities that make a lasting impact on the student community.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
];




const galleryImages = [
  {
    id: 1,
    src: "/drait-campus.jpg",
    alt: "Dr. Ambedkar Institute of Technology Campus",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    id: 2,
    src: "/drait-campus-2.webp",
    alt: "Dr. AIT Campus Grounds",
    span: "",
  },
  {
    id: 3,
    src: "",
    alt: "Workshop & Innovation Lab",
    span: "",
  },
  {
    id: 4,
    src: "",
    alt: "Flagship Hackathon Event",
    span: "md:col-span-2",
  },
  {
    id: 5,
    src: "",
    alt: "Community Meetup",
    span: "",
  },
  {
    id: 6,
    src: "",
    alt: "Project Demo Day",
    span: "",
  },
];

export default function AboutPageClient() {
  // Ultra-smooth 60fps GPU-accelerated entrance variants from outside inward
  const getPillarCardVariants = (index: number): Variants => {
    const col = index % 3;
    const xOffset = col === 0 ? -50 : col === 2 ? 50 : 0;
    const yOffset = col === 1 ? 40 : 25;

    return {
      hidden: {
        opacity: 0,
        x: xOffset,
        y: yOffset,
        scale: 0.96,
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.75,
          ease: [0.22, 1, 0.36, 1], // Natural cubic deceleration
          delay: (index % 6) * 0.08,
        },
      },
    };
  };

  return (
    <>
      {/* ═══════════ JOURNEY HERO (Light Subtle Blue Grid Background) ═══════════ */}
      <section className="relative pt-28 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-blue-100/70 via-indigo-50/40 to-[#f5f8fc] text-zinc-900 border-b border-blue-100/70">
        {/* Subtle Geometric Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c70a_1px,transparent_1px),linear-gradient(to_bottom,#0284c70a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none z-0" />

        {/* Ambient Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-gradient-to-tr from-blue-400/20 via-indigo-300/20 to-sky-300/15 rounded-full blur-[90px] pointer-events-none z-0" />

        <div className="mx-auto max-w-5xl relative z-10">
          <ScrollReveal direction="up">
            <div className="text-center space-y-3 mb-10">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-white/90 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-indigo-700 shadow-xs mb-1">
                <span>The AURIX Journey</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900">
                From Campus to <span className="font-serif italic font-normal lowercase capitalize tracking-normal text-indigo-600">Community.</span>
              </h1>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.1}>
            <div className="rounded-3xl border border-zinc-200/90 bg-white text-zinc-900 overflow-hidden shadow-lg shadow-slate-200/50">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 sm:h-80 lg:h-auto min-h-[280px] overflow-hidden">
                  <Image
                    src="/drait-campus.jpg"
                    alt="Dr. Ambedkar Institute of Technology Bengaluru Campus"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
                  <div className="absolute bottom-5 left-5 sm:bottom-6 sm:left-6">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/90 backdrop-blur-md border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-900 shadow-sm">
                      <Building2 className="h-3.5 w-3.5 text-indigo-600" />
                      Dr. AIT, Bengaluru
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center space-y-4">
                  <p className="text-sm sm:text-base text-zinc-700 leading-relaxed">
                    AURIX began at Dr. Ambedkar Institute of Technology, Bengaluru, with a simple idea — students shouldn&apos;t have to wait until graduation to start building meaningful things.
                  </p>
                  <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
                    What started as a student community is growing into an ecosystem where students can learn from each other, work on real projects, explore new possibilities, connect with industry, and turn ideas into action.
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-indigo-600 pt-1">
                    Our journey is not defined by where we started, but by what we continue to build together.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════ WHO WE ARE ═══════════ */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#f5f8fc] border-t border-blue-100/70">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal direction="up">
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
              <p className="text-sm font-mono uppercase tracking-widest text-indigo-600 font-bold">
                Who We Are
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900">
                Built by Students. <span className="text-indigo-600">Driven by Curiosity.</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pillars.map((p, index) => (
              <motion.div
                key={p.title}
                variants={getPillarCardVariants(index)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
                className="group relative h-full rounded-2xl border border-zinc-200/80 bg-zinc-100 p-6 shadow-sm hover:shadow-xl hover:border-indigo-300 hover:bg-zinc-50 transition-colors duration-300 flex flex-col justify-between"
              >
                <div>
                  <div
                    className="inline-flex items-center justify-center h-11 w-11 rounded-xl bg-white border border-zinc-200 text-indigo-600 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-sm"
                  >
                    <p.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-zinc-900 mb-2 group-hover:text-indigo-600 transition-colors">{p.title}</h3>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed group-hover:text-zinc-700 transition-colors">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ GALLERY ═══════════ */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#eef4fb]/80 border-t border-blue-100/70">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal direction="up">
            <div className="text-center mb-12 space-y-3">
              <p className="text-sm font-mono uppercase tracking-widest text-indigo-600 font-bold">
                Gallery
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900">
                Life at <span className="text-indigo-600">AURIX</span>
              </h2>
            </div>
          </ScrollReveal>

          <StaggerContainer
            staggerDelay={0.06}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 auto-rows-[180px] sm:auto-rows-[200px] gap-4"
          >
            {galleryImages.map((img) => (
              <StaggerItem key={img.id} className={img.span}>
                <div className="relative w-full h-full rounded-2xl overflow-hidden border border-zinc-200 bg-white group cursor-pointer shadow-sm">
                  {img.src ? (
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-50">
                      <div className="h-10 w-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shadow-xs">
                        <Building2 className="h-5 w-5 text-indigo-600" />
                      </div>
                      <span className="text-xs text-zinc-600 font-medium px-3 text-center">
                        {img.alt}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-sm font-medium text-white">{img.alt}</span>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════ MISSION ═══════════ */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#f5f8fc] border-t border-blue-100/70">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal direction="up">
            <div className="text-center max-w-3xl mx-auto mb-6 space-y-3">
              <p className="text-sm font-mono uppercase tracking-widest text-indigo-600 font-bold">
                Our Mission
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900">
                Learn. Build. <span className="text-indigo-600">Lead.</span>
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.1}>
            <p className="text-center text-zinc-600 max-w-3xl mx-auto mb-14 leading-relaxed">
              Our mission is to create an environment where students move beyond theoretical learning and develop the confidence to learn continuously, build fearlessly, and lead meaningfully.
            </p>
          </ScrollReveal>

          <StaggerContainer
            staggerDelay={0.12}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {missionSteps.map((s) => (
              <StaggerItem key={s.num}>
                <div
                  className="group relative h-full rounded-2xl border border-zinc-200/90 bg-zinc-100 p-7 sm:p-8 transition-all duration-300 hover:shadow-xl hover:border-indigo-300 hover:bg-zinc-50 hover:-translate-y-1.5 shadow-sm"
                >
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 mb-1 group-hover:text-indigo-600 transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-sm font-semibold text-indigo-600 mb-4">{s.subtitle}</p>
                  <p className="text-sm text-zinc-600 leading-relaxed group-hover:text-zinc-700 transition-colors">{s.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════ FACULTY COORDINATORS & ADVISORS ═══════════ */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#eef4fb] via-[#f5f8fc] to-[#e4eefb] border-t border-blue-100/70 overflow-hidden">
        {/* Subtle Ambient Section Glows */}
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-100/40 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-10 right-1/4 translate-x-1/2 w-[500px] h-[300px] bg-sky-100/30 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="mx-auto max-w-6xl">
          <ScrollReveal direction="up">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-2.5">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900">
                Faculty Advisors & <span className="text-indigo-600">Coordinators</span>
              </h2>
              <p className="text-zinc-600 leading-relaxed text-sm sm:text-base max-w-2xl mx-auto font-medium">
                Guiding Excellence, Inspiring Innovation
              </p>
            </div>
          </ScrollReveal>

          {/* Infinite Smooth Right-to-Left Flowing Faculty Cards Marquee */}
          <div className="relative w-full overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <motion.div
              className="flex gap-6 w-max"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                repeat: Infinity,
                repeatType: "loop",
                duration: 25,
                ease: "linear",
              }}
              whileHover={{ animationPlayState: "paused" }}
              style={{ willChange: "transform" }}
            >
              {[...facultyCoordinators, ...facultyCoordinators].map((faculty, i) => (
                <div
                  key={`${faculty.name}-${i}`}
                  className="group relative w-72 sm:w-80 rounded-2xl border border-zinc-200/80 bg-zinc-100 p-6 text-center shadow-sm hover:shadow-xl hover:border-indigo-300 hover:bg-zinc-50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-center flex-shrink-0 cursor-pointer overflow-hidden"
                >
                  {/* Round Centered Photo (Enlarged) */}
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-4 ring-3 ring-zinc-200/90 group-hover:ring-indigo-500 group-hover:scale-105 transition-all duration-300 shadow-md bg-slate-200">
                    <Image
                      src={faculty.image}
                      alt={faculty.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>

                  {/* Text Outside the Photo */}
                  <h3 className="font-montserrat text-base sm:text-lg font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors">
                    {faculty.name}
                  </h3>

                  <p className="text-xs font-semibold text-indigo-600 mt-1">
                    {faculty.role}
                  </p>

                  <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">
                    {faculty.dept}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}