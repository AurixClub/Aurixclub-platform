"use client";

import Link from "next/link";
import { ArrowUpRight, Building2, Compass, Cpu, Rocket, ShieldCheck } from "lucide-react";
import HeroCanvas3D from "./HeroCanvas3D";

// Reference fidelity: the 21st.dev Hero reference drives this full-bleed blue,
// reduced editorial type composition. AurixClub content, links, and backend boundaries stay unchanged.

const proofPoints = [
  { label: "Dr. AIT Student-Led", icon: Building2, tone: "text-cyan-200" },
  { label: "6 Core Divisions", icon: Cpu, tone: "text-[#b8a7ff]" },
  { label: "Deep Tech & Startups", icon: Rocket, tone: "text-yellow-200" },
  { label: "Industry Mentorship", icon: ShieldCheck, tone: "text-fuchsia-200" },
];

export function HeroSection() {
  return (
    <section className="relative isolate min-h-[calc(100svh-1rem)] overflow-hidden bg-[#08080b] px-4 pb-16 pt-28 text-white sm:px-6 sm:pb-24 sm:pt-32 lg:px-8 lg:pt-36">
      <HeroCanvas3D className="pointer-events-none inset-x-[-12%] top-[20%] z-0 h-[76%] w-[124%] opacity-25 mix-blend-screen lg:left-[34%] lg:top-[13%] lg:h-[88%] lg:w-[72%] lg:opacity-45" />

      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_72%_48%,rgba(54,71,170,0.16),transparent_38%),radial-gradient(circle_at_18%_88%,rgba(111,72,160,0.1),transparent_36%)]" />
      <div className="pointer-events-none absolute -right-32 top-24 z-0 h-80 w-80 rounded-full border border-white/20 bg-white/[0.045] blur-[1px]" />
      <div className="pointer-events-none absolute -left-24 bottom-12 z-0 h-64 w-64 rounded-full border border-lime-200/30 bg-lime-300/[0.04]" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1360px] flex-col">
        <div className="mb-12 flex items-center gap-2 text-xs font-semibold tracking-wide text-white/90 sm:mb-16">
          <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1.5 backdrop-blur-md">Dr. Ambedkar Institute of Technology</span>
          <span className="text-[#b8a7ff]">• Bengaluru</span>
        </div>

        <div className="grid items-end gap-10 lg:grid-cols-1 lg:gap-16">
          <div className="relative max-w-3xl">
            <div className="pointer-events-none absolute -left-8 top-12 hidden h-28 w-28 rounded-full border-2 border-lime-200/75 sm:block" />
            <div className="pointer-events-none absolute -left-2 top-[7.5rem] hidden h-8 w-8 rotate-45 border-l-2 border-t-2 border-lime-200 sm:block" />

            <h1 className="relative max-w-3xl text-[clamp(2.6rem,4.8vw,4.9rem)] font-black uppercase leading-[0.9] tracking-[-0.07em] text-white">
              <span className="block">Where Student</span>
              <span className="block">Curiosity</span>
              <span className="block text-[#eaff22] [text-shadow:0_4px_0_rgba(8,22,117,0.3)]">Becomes Real</span>
              <span className="block">Impact.</span>
            </h1>

            <p className="mt-9 max-w-xl text-base leading-relaxed text-blue-50/90 sm:text-lg">
              A multidisciplinary club and student-led community at <strong className="font-semibold text-white">Dr. AIT, Bengaluru</strong> — learning, building, and launching impactful tech together.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/events" className="group inline-flex items-center gap-3 rounded-2xl border border-white/25 bg-[#071baf]/80 px-5 py-3.5 text-sm font-semibold text-white shadow-xl shadow-[#06157c]/25 backdrop-blur-md transition hover:-translate-y-1 hover:bg-[#06158f] active:scale-[0.98]">
                <Compass className="h-4 w-4 text-[#b8a7ff]" />
                <span>Explore Events</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link href="/join" className="group inline-flex items-center gap-3 rounded-2xl bg-[#d9d3ff] px-5 py-3.5 text-sm font-bold text-[#15131f] shadow-xl shadow-lime-300/25 transition hover:-translate-y-1 hover:bg-[#eeeaff] active:scale-[0.98]">
                <span>Join AURIX</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-2 gap-x-5 gap-y-4 border-t border-white/20 pt-5 sm:grid-cols-4">
              {proofPoints.map(({ label, icon: Icon, tone }) => (
                <div key={label} className="flex items-center gap-2 text-[11px] font-medium leading-tight text-white/85">
                  <Icon className={`h-4 w-4 shrink-0 ${tone}`} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
