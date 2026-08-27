"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Lightbulb,
  Users,
  Rocket,
  Target,
  Heart,
  Compass,
  Building2,
  Cpu,
  FlaskConical,
  Briefcase,
  Megaphone,
} from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";

/* ───── Data ───── */

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


const cultureValues = [
  {
    icon: Compass,
    title: "Curiosity",
    desc: "Always ask why. Explore what's possible and never stop learning.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    icon: Users,
    title: "Collaboration",
    desc: "Great things happen when different minds come together and build as one.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    desc: "Challenge the ordinary, experiment boldly, and look for better ways to solve problems.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: Target,
    title: "Ownership",
    desc: "Take responsibility for your ideas, your work, and the community you are part of.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: Heart,
    title: "Impact",
    desc: "Build with purpose and create value that extends beyond the classroom.",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
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
  return (
    <>
      {/* ═══════════ JOURNEY ═══════════ */}
      <section className="reference-editorial-section py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal direction="up">
            <div className="space-y-3 mb-12 max-w-3xl">
              <p className="text-sm font-mono uppercase tracking-widest text-emerald-400/80">
                The AURIX Journey
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                From Campus to <span className="text-white/45">Community.</span>
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.1}>
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden backdrop-blur-md shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 sm:h-80 lg:h-auto min-h-[280px] overflow-hidden">
                  <Image
                    src="/drait-campus.jpg"
                    alt="Dr. Ambedkar Institute of Technology Bengaluru Campus"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-5 left-5 sm:bottom-6 sm:left-6">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/15 px-3 py-1.5 text-xs font-semibold text-white">
                      <Building2 className="h-3.5 w-3.5 text-blue-400" />
                      Dr. AIT, Bengaluru
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center space-y-4">
                  <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                    AURIX began at Dr. Ambedkar Institute of Technology, Bengaluru, with a simple idea — students shouldn&apos;t have to wait until graduation to start building meaningful things.
                  </p>
                  <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                    What started as a student community is growing into an ecosystem where students can learn from each other, work on real projects, explore new possibilities, connect with industry, and turn ideas into action.
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-200 pt-1">
                    Our journey is not defined by where we started, but by what we continue to build together.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════ WHO WE ARE ═══════════ */}
      <section className="reference-editorial-section py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal direction="up">
            <div className="max-w-3xl mb-14 space-y-3">
              <p className="text-sm font-mono uppercase tracking-widest text-indigo-400/80">
                Who We Are
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                Built by Students. <span className="text-white/45">Driven by Curiosity.</span>
              </h2>
            </div>
          </ScrollReveal>

          <StaggerContainer
            staggerDelay={0.08}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {pillars.map((p) => (
              <StaggerItem key={p.title}>
                <div
                  className={`group relative h-full rounded-2xl border ${p.border} bg-white/[0.03] backdrop-blur-sm p-6 transition-all duration-300 hover:bg-white/[0.06] hover:shadow-2xl ${p.glow} hover:border-white/15`}
                >
                  <div
                    className={`inline-flex items-center justify-center h-11 w-11 rounded-xl bg-gradient-to-br ${p.color} mb-4 shadow-lg`}
                  >
                    <p.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{p.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{p.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════ GALLERY ═══════════ */}
      <section className="reference-editorial-section py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal direction="up">
            <div className="mb-12 space-y-3 max-w-3xl">
              <p className="text-sm font-mono uppercase tracking-widest text-blue-400/80">
                Gallery
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                Life at <span className="text-white/45">AURIX</span>
              </h2>
            </div>
          </ScrollReveal>

          <StaggerContainer
            staggerDelay={0.06}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 auto-rows-[180px] sm:auto-rows-[200px] gap-4"
          >
            {galleryImages.map((img) => (
              <StaggerItem key={img.id} className={img.span}>
                <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] group cursor-pointer">
                  {img.src ? (
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-white/[0.04] to-white/[0.01]">
                      <div className="h-10 w-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-zinc-500" />
                      </div>
                      <span className="text-xs text-zinc-500 font-medium px-3 text-center">
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
      <section className="reference-editorial-section py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal direction="up">
            <div className="max-w-3xl mb-6 space-y-3">
              <p className="text-sm font-mono uppercase tracking-widest text-blue-400/80">
                Our Mission
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                Learn. Build. <span className="text-white/45">Lead.</span>
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.1}>
            <p className="text-zinc-400 max-w-3xl mb-14 leading-relaxed">
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
                  className={`relative h-full rounded-2xl border ${s.border} ${s.bg} p-7 sm:p-8 transition-all duration-300 hover:border-white/20`}
                >
                  <div className="flex items-center gap-2 mb-5">
                    <span className={`text-xs font-mono font-bold tracking-wider ${s.color}`}>
                      {s.num} / {s.label}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
                    {s.title}
                  </h3>
                  <p className={`text-sm font-semibold ${s.color} mb-4`}>{s.subtitle}</p>
                  <p className="text-sm text-zinc-400 leading-relaxed">{s.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>


      {/* ═══════════ CULTURE / VALUES ═══════════ */}
      <section className="reference-editorial-section py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal direction="up">
            <div className="max-w-3xl mb-6 space-y-3">
              <p className="text-sm font-mono uppercase tracking-widest text-rose-400/80">
                What We Believe
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                Our <span className="text-white/45">Culture</span>
              </h2>
              <p className="text-zinc-400 leading-relaxed">
                The values that shape how we learn, build, collaborate, and grow at AURIX.
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer
            staggerDelay={0.08}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12"
          >
            {cultureValues.map((v) => (
              <StaggerItem key={v.title}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-7 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/15">
                  <div
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${v.bg} mb-4`}
                  >
                    <v.icon className={`h-5 w-5 ${v.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{v.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{v.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="py-24 sm:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent pointer-events-none -z-10" />

        <div className="mx-auto max-w-3xl text-center">
          <ScrollReveal direction="up">
            <p className="text-sm font-mono uppercase tracking-widest text-blue-400/80 mb-4">
              Start Your Journey
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-6">
              Have an Idea? <span className="text-white/45">Build It With Us.</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.1}>
            <div className="space-y-2 text-zinc-400 mb-8">
              <p>You don&apos;t need to know everything before you start.</p>
              <p>You don&apos;t need to have the perfect idea.</p>
              <p className="text-zinc-300 font-semibold">You just need the curiosity to begin.</p>
            </div>

            <p className="text-sm text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Whether you want to build, research, experiment, start something new, connect with industry, or simply learn alongside people who are curious like you — there&apos;s a place for you at AURIX.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <Link
              href="/join"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 group hover:scale-[1.03] active:scale-[0.98]"
            >
              <span>Join AURIX</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <p className="mt-8 text-sm font-mono text-zinc-500 tracking-wider">
              Learn. Build. Lead.
            </p>
            <p className="text-xs text-zinc-600 mt-1">
              Let&apos;s build what comes next — together.
            </p>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}