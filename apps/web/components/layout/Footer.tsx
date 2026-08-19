"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Linkedin,
  Instagram,
  Youtube,
  Facebook,
  Mail,
  ArrowUpRight,
} from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

// Custom modern X (formerly Twitter) icon component
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
      hoverColor: "hover:text-pink-400 hover:border-pink-500/40",
      accentBg: "group-hover:bg-pink-500/10",
    },
    {
      name: "LinkedIn",
      handle: "aurix-club",
      href: "https://www.linkedin.com/company/aurix-club/",
      icon: Linkedin,
      hoverColor: "hover:text-blue-400 hover:border-blue-500/40",
      accentBg: "group-hover:bg-blue-500/10",
    },
    {
      name: "YouTube",
      handle: "@aurixclubofficial",
      href: "https://youtube.com/@aurixclubofficial?si=ZFEjzAjE1pkodJ8d",
      icon: Youtube,
      hoverColor: "hover:text-red-400 hover:border-red-500/40",
      accentBg: "group-hover:bg-red-500/10",
    },
    {
      name: "X (Twitter)",
      handle: "@AURIX_Club",
      href: "https://x.com/AURIX_Club",
      icon: XTwitterIcon,
      hoverColor: "hover:text-zinc-200 hover:border-zinc-400/40",
      accentBg: "group-hover:bg-white/10",
    },
    {
      name: "Facebook",
      handle: "AURIX Community",
      href: "https://www.facebook.com/share/1DCawjuqUc/",
      icon: Facebook,
      hoverColor: "hover:text-blue-500 hover:border-blue-600/40",
      accentBg: "group-hover:bg-blue-600/10",
    },
  ];

  return (
    <footer className="relative border-t border-white/[0.08] bg-black/40 backdrop-blur-xl overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <ScrollReveal direction="up" duration={0.8} distance={20}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
            {/* Brand Col */}
            <div className="md:col-span-5 space-y-4">
              <Link href="/" className="inline-flex items-center gap-2.5 group">
                <div className="flex-shrink-0 w-9 h-9 rounded-xl overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-300 ring-1 ring-white/15 bg-slate-900">
                  <Image
                    src="/aurix-logo.jpeg"
                    alt="AURIX Club Logo"
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xl font-bold tracking-wider text-white">AURIX</span>
              </Link>
              <p className="max-w-sm text-sm text-zinc-400 leading-relaxed">
                Initiated at <span className="text-zinc-200 font-medium">Dr. Ambedkar Institute of Technology, Bengaluru</span>. Learn. Build. Connect. Creating an impact that lasts across engineering, deep tech, and community.
              </p>

              {/* Email direct contact */}
              <div className="pt-2">
                <a
                  href="mailto:contact@aurix.club"
                  className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-blue-400 transition-colors py-1"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>contact@aurix.club</span>
                </a>
              </div>

              <div className="pt-2 flex items-center gap-3 text-xs text-zinc-500">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Applications open for new cohort</span>
              </div>
            </div>

            {/* Navigation Col */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-mono">
                Explore
              </h4>
              <ul className="space-y-2.5">
                {navigationLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                    >
                      <span>{link.name}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-y-0.5 group-hover:opacity-100 transition-all duration-200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Connect Col */}
            <div className="md:col-span-4 space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-mono">
                Official Channels
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {socialLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2.5 p-2 rounded-xl border border-white/[0.05] bg-white/[0.02] text-xs text-zinc-400 hover:text-white transition-all duration-300 group ${item.hoverColor}`}
                      >
                        <div className={`p-1.5 rounded-lg bg-white/[0.04] border border-white/10 group-hover:scale-105 transition-all ${item.accentBg}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium truncate">{item.name}</span>
                          <span className="text-[10px] text-zinc-500 truncate">{item.handle}</span>
                        </div>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Bottom copyright */}
          <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <p>© 2026 AURIX. Initiated at Dr. Ambedkar Institute of Technology, Bengaluru.</p>
            <p className="flex items-center gap-2">
              <span>Built by students for innovators & builders</span>
            </p>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
}
