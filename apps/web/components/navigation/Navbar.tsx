"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
  User,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { SessionData } from "@aurix/types";
import { ThreeDButton } from "@/components/ui/three-d-button";
import { ThemeToggle } from "@/components/navigation/ThemeToggle";

// Reference fidelity: this frontend-only header recreates the Limelight Nav active-tab treatment
// while preserving the official AurixClub routes, session actions, and backend boundaries.

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [session, setSession] = useState<SessionData | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        if (data.success && data.data) {
          setSession(data.data);
        } else {
          setSession(null);
        }
      } catch {
        setSession(null);
      }
    }
    fetchSession();
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setSession(null);
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/departments", label: "Departments" },
    { href: "/events", label: "Events" },
    { href: "/team", label: "Team" },
    { href: "/projects", label: "Projects" },
  ];

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 px-3 pt-3 transition-all duration-300 sm:px-5 sm:pt-5 lg:px-8 ${
        isScrolled || !isHome ? "" : "lg:pt-5"
      }`}
    >
      <nav
        aria-label="Primary navigation"
        className={`mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-2xl border px-2.5 py-2 shadow-2xl transition-all duration-300 sm:gap-6 sm:px-3 ${
          isScrolled || !isHome
            ? "border-white/15 bg-[#080b12]/90 shadow-black/40 backdrop-blur-2xl"
            : "border-white/10 bg-[#080b12]/65 shadow-black/20 backdrop-blur-xl"
        }`}
      >
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-2.5 rounded-xl px-1.5 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080b12]"
        >
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-900 ring-1 ring-white/15 transition-all duration-300 group-hover:scale-105 group-hover:ring-blue-400/50 sm:h-10 sm:w-10">
            <Image
              src="/aurix-logo.jpeg"
              alt="AURIX Club Logo"
              width={40}
              height={40}
              className="h-full w-full object-cover"
              priority
            />
          </span>
          <span className="flex min-w-0 flex-col leading-none">
            <span className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight text-white transition-colors group-hover:text-blue-200 sm:text-lg">
                AURIX
              </span>
              <span className="hidden rounded-full border border-blue-400/25 bg-blue-400/10 px-2 py-0.5 text-[9px] font-semibold text-blue-200 sm:inline-block">
                Dr. AIT
              </span>
            </span>
            <span className="truncate text-[8px] font-semibold uppercase tracking-[0.2em] text-blue-300/80 sm:text-[9px]">
              Club • Bengaluru
            </span>
          </span>
        </Link>

        <div className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
          <div className="flex items-center gap-0.5 rounded-xl border border-white/[0.07] bg-black/20 p-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`group relative rounded-lg px-3 py-2 text-xs font-medium transition-colors duration-200 xl:px-3.5 xl:text-sm ${
                    isActive ? "text-white" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="aurix-limelight"
                      transition={{ type: "spring", stiffness: 420, damping: 30 }}
                      className="absolute inset-0 -z-0 rounded-lg bg-gradient-to-b from-white/[0.15] to-white/[0.04] shadow-[0_0_22px_rgba(96,165,250,0.24)]"
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                  <span
                    className={`absolute inset-x-3 bottom-0.5 h-px origin-center rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 transition-transform duration-200 ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {session && session.user ? (
            <div className="flex items-center gap-2">
              {session.user.role === "super_admin" ? (
                <>
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-violet-400/30 bg-violet-400/10 px-3 py-2 text-xs font-semibold text-violet-200 transition-colors hover:bg-violet-400/20"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span className="hidden xl:inline">Admin Portal</span>
                  </Link>
                  <Link
                    href="/profile"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/[0.09] hover:text-white"
                  >
                    <User className="h-3.5 w-3.5 text-blue-300" />
                    <span className="hidden xl:inline">Profile</span>
                  </Link>
                </>
              ) : (
                <Link
                  href="/profile"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-blue-400/30 bg-blue-400/10 px-3 py-2 text-xs font-semibold text-blue-200 transition-colors hover:bg-blue-400/20"
                >
                  <User className="h-3.5 w-3.5" />
                  <span className="hidden xl:inline">My Profile</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                title="Sign Out"
                aria-label="Sign Out"
                className="inline-flex items-center rounded-xl border border-white/10 bg-white/[0.04] p-2 text-zinc-300 transition-colors hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-200"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-xl px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:text-white sm:text-sm"
              >
                Sign In
              </Link>
              <ThemeToggle />
              <ThreeDButton href="/join" className="px-3.5 py-2 text-xs sm:px-4 sm:text-sm">Join Now</ThreeDButton>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-300 transition-colors hover:bg-white/[0.1] hover:text-white md:hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isMobileMenuOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <X className="h-5 w-5" />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <Menu className="h-5 w-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="mx-auto mt-2 max-w-7xl overflow-hidden rounded-2xl border border-white/10 bg-[#080b12]/95 p-2 shadow-2xl shadow-black/40 backdrop-blur-2xl md:hidden"
          >
            <div className="max-h-[78vh] space-y-1 overflow-y-auto p-1">
              {session && session.user && (
                <div className="mb-2 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <div>
                    <div className="text-sm font-semibold text-white">{session.user.full_name}</div>
                    <div className="text-xs text-zinc-400">
                      {session.user.email} • {session.user.role}
                    </div>
                  </div>
                  {session.user.role === "super_admin" ? (
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="rounded-lg bg-violet-400/15 px-2.5 py-1 text-xs font-semibold text-violet-200"
                    >
                      Admin
                    </Link>
                  ) : (
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="rounded-lg bg-blue-400/15 px-2.5 py-1 text-xs font-semibold text-blue-200"
                    >
                      Profile
                    </Link>
                  )}
                </div>
              )}

              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`group relative flex items-center justify-between overflow-hidden rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      isActive ? "text-white" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="aurix-mobile-limelight"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/15 via-purple-400/10 to-transparent"
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                    <ArrowRight className="relative z-10 h-3.5 w-3.5 text-zinc-600 transition-transform group-hover:translate-x-1 group-hover:text-white" />
                  </Link>
                );
              })}

              <div className="mt-2 space-y-2 border-t border-white/10 px-1 pt-3">
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
                  <span className="text-xs font-medium text-zinc-400">Theme</span>
                  <ThemeToggle />
                </div>
                {session && session.user ? (
                  <>
                    {session.user.role === "super_admin" ? (
                      <Link
                        href="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        <span>Open Admin Portal</span>
                      </Link>
                    ) : (
                      <Link
                        href="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white"
                      >
                        <User className="h-4 w-4" />
                        <span>My Profile &amp; Passes</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full rounded-xl border border-red-400/20 px-4 py-3 text-center text-xs font-medium text-red-200 transition-colors hover:bg-red-400/10"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full rounded-xl border border-white/15 px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-white/10"
                    >
                      Sign In
                    </Link>
                    <ThreeDButton
                      href="/join"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full rounded-xl px-4 py-3 text-sm"
                    >
                      Join Now
                    </ThreeDButton>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
