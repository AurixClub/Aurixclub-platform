"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import {
  Linkedin,
  Instagram,
  Youtube,
  Facebook,
  Mail,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";
import { motion, useInView, useReducedMotion } from "framer-motion";

// Reference fidelity: this frontend-only component adapts the 21st.dev Motion Footer visual language
// while preserving the official AurixClub information, links, and existing backend boundaries.

function XTwitterIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: true, margin: "-12% 0px" });
  const prefersReducedMotion = useReducedMotion();

  const navigationLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Departments", href: "/departments" },
    { name: "Events", href: "/events" },
    { name: "Projects", href: "/projects" },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      handle: "@aurixclub.drait",
      href: "https://www.instagram.com/aurixclub.drait?igsh=Y3Y1NHE0cmZqNDk5",
      icon: Instagram,
      hoverColor: "hover:text-pink-300 hover:border-pink-400/40",
      accentBg: "group-hover:bg-pink-400/10",
    },
    {
      name: "LinkedIn",
      handle: "aurix-club",
      href: "https://www.linkedin.com/company/aurix-club/",
      icon: Linkedin,
      hoverColor: "hover:text-blue-300 hover:border-blue-400/40",
      accentBg: "group-hover:bg-blue-400/10",
    },
    {
      name: "YouTube",
      handle: "@aurixclubofficial",
      href: "https://youtube.com/@aurixclubofficial?si=ZFEjzAjE1pkodJ8d",
      icon: Youtube,
      hoverColor: "hover:text-red-300 hover:border-red-400/40",
      accentBg: "group-hover:bg-red-400/10",
    },
    {
      name: "X (Twitter)",
      handle: "@AURIX_Club",
      href: "https://x.com/AURIX_Club",
      icon: XTwitterIcon,
      hoverColor: "hover:text-zinc-100 hover:border-zinc-300/40",
      accentBg: "group-hover:bg-white/10",
    },
    {
      name: "Facebook",
      handle: "AURIX Community",
      href: "https://www.facebook.com/share/1DCawjuqUc/",
      icon: Facebook,
      hoverColor: "hover:text-blue-300 hover:border-blue-500/40",
      accentBg: "group-hover:bg-blue-500/10",
    },
  ];

  const marqueeItems = [
    "Learn",
    "Build",
    "Connect",
    "Deep Tech",
    "Community",
    "Impact",
  ];

  return (
    <footer
      ref={footerRef}
      className="relative isolate overflow-hidden border-t border-white/[0.08] bg-[#05070b] text-white"
    >
      {/* Cinematic aurora and grid layers inspired by the public Motion Footer reference. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={isInView ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: prefersReducedMotion ? 0 : 1.2, ease: [0.23, 1, 0.32, 1] }}
          className="absolute -top-40 left-1/2 h-[34rem] w-[46rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(91,78,255,0.24)_0%,rgba(45,95,255,0.1)_42%,transparent_72%)] blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={isInView ? { opacity: 0.7, x: 0 } : undefined}
          transition={{ duration: prefersReducedMotion ? 0 : 1.3, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
          className="absolute -right-40 top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(205,74,255,0.18)_0%,transparent_70%)] blur-3xl"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.055)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:linear-gradient(to_bottom,black,transparent_76%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 sm:pt-12 lg:px-8">
        {/* Full-width motion-footer marquee. It uses existing brand language instead of adding new copy. */}
        <motion.div
          initial={{ opacity: 0, y: 24, rotate: 0 }}
          animate={isInView ? { opacity: 1, y: 0, rotate: 0 } : undefined}
          transition={{ duration: prefersReducedMotion ? 0 : 0.85, ease: [0.23, 1, 0.32, 1] }}
          className="aurix-marquee pointer-events-none absolute top-4 left-0 z-20 flex w-full overflow-hidden border-y border-white/[0.08] bg-white/[0.025] py-3 text-[10px] font-semibold uppercase tracking-[0.36em] text-zinc-500 sm:top-6 sm:text-xs"
          aria-hidden="true"
        >
          <div className="flex min-w-max animate-[marquee_26s_linear_infinite] items-center gap-7 whitespace-nowrap px-4">
            {[...marqueeItems, ...marqueeItems].map((item, index) => (
              <span key={`${item}-${index}`} className="inline-flex items-center gap-7">
                <span>{item}</span>
                <span className="h-1 w-1 rounded-full bg-blue-400/70" />
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: 0.12, ease: [0.23, 1, 0.32, 1] }}
          className="flex min-h-[20rem] flex-col justify-end pb-14 pt-32 sm:min-h-[24rem] sm:pb-20 sm:pt-40"
        >
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.28em] text-blue-300/80">
            Built by students for innovators &amp; builders
          </p>
          <div className="relative overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-[0.12em] h-px bg-gradient-to-r from-blue-400/80 via-purple-400/50 to-transparent"
            />
            <h2 className="select-none text-[clamp(4.5rem,17vw,13rem)] font-black leading-[0.74] tracking-[-0.1em] text-white/[0.94] [mask-image:linear-gradient(to_bottom,black_56%,transparent_100%)]">
              AURIX
            </h2>
          </div>
          <div className="mt-6 flex flex-col justify-between gap-4 text-sm text-zinc-400 sm:flex-row sm:items-center">
            <p className="max-w-md leading-relaxed">
              Learn. Build. Connect. Creating an impact that lasts across engineering, deep tech, and community.
            </p>
            <Link
              href="/join"
              className="group inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300/50 hover:bg-blue-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070b]"
            >
              Join AURIX
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>

        <div className="border-t border-white/[0.1] pt-10 sm:pt-12">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: prefersReducedMotion ? 0 : 0.65, delay: 0.18, ease: [0.23, 1, 0.32, 1] }}
              className="space-y-5 md:col-span-5"
            >
              <Link href="/" className="group inline-flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070b]">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-900 ring-1 ring-white/15 transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src="/aurix-logo.jpeg"
                    alt="AURIX Club Logo"
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </span>
                <span className="text-xl font-bold tracking-[0.16em] text-white">AURIX</span>
              </Link>

              <p className="max-w-sm text-sm leading-relaxed text-zinc-400">
                Initiated at <span className="font-medium text-zinc-200">Dr. Ambedkar Institute of Technology, Bengaluru</span>. Learn. Build. Connect. Creating an impact that lasts across engineering, deep tech, and community.
              </p>

              <a
                href="mailto:aurixclub.drait@gmail.com"
                className="inline-flex items-center gap-2 py-1 text-xs text-zinc-400 transition-colors hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>aurixclub.drait@gmail.com</span>
              </a>

              <div className="flex items-center gap-3 text-xs text-zinc-500">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                <span>Applications open for new cohort</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: prefersReducedMotion ? 0 : 0.65, delay: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className="md:col-span-3"
            >
              <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-300">Explore</h3>
              <ul className="space-y-3">
                {navigationLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    >
                      <span>{link.name}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 -translate-y-0.5 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: prefersReducedMotion ? 0 : 0.65, delay: 0.32, ease: [0.23, 1, 0.32, 1] }}
              className="md:col-span-4"
            >
              <h3 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-300">Official Channels</h3>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {socialLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.025] p-2.5 text-xs text-zinc-400 transition-all duration-300 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${item.hoverColor}`}
                      >
                        <span className={`rounded-lg border border-white/10 bg-white/[0.04] p-1.5 transition-transform duration-300 group-hover:scale-105 ${item.accentBg}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="flex min-w-0 flex-col">
                          <span className="truncate font-medium">{item.name}</span>
                          <span className="truncate text-[10px] text-zinc-500">{item.handle}</span>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/[0.07] pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center">
            <p>© 2026 AURIX. Initiated at Dr. Ambedkar Institute of Technology, Bengaluru.</p>
            <p>Built by students for innovators &amp; builders</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
