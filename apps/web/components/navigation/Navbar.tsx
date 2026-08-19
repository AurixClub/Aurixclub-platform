"use client";

import { useState, useEffect } from "react";
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
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { SessionData } from "@aurix/types";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [session, setSession] = useState<SessionData | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  // Check auth session
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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setSession(null);
      router.push("/login");
      router.refresh();
    } catch (e) {
      console.error("Logout failed", e);
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isScrolled
          ? "bg-[#0a0f1c]/90 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
          : isHome
          ? "bg-transparent border-b border-transparent"
          : "bg-[#0a0f1c]/70 backdrop-blur-md border-b border-white/5"
      }`}
    >
      <nav className="w-full px-4 sm:px-6 lg:px-10">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group relative z-10">
            <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-xl overflow-hidden shadow-lg group-hover:shadow-blue-500/40 group-hover:scale-105 transition-all duration-300 ring-1 ring-white/15 bg-slate-900">
              <Image
                src="/aurix-logo.jpeg"
                alt="AURIX Club Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                priority
              />
            </div>

            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-2">
                <span className="text-lg md:text-xl font-black tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-300 transition-all duration-300">
                  AURIX
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 font-semibold">
                  Dr. AIT
                </span>
              </div>
              <span className="text-[9px] uppercase font-mono tracking-[0.22em] text-blue-400/90 font-semibold -mt-0.5">
                Club • Bengaluru
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-2 text-sm font-medium transition-colors duration-300 group ${
                    isActive ? "text-white" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <span>{link.label}</span>
                  <span
                    className={`absolute left-3 right-3 -bottom-0.5 h-[2px] rounded-full transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 scale-x-100"
                        : "bg-white/40 scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions based on Auth */}
          <div className="hidden md:flex items-center gap-3">
            {session && session.user ? (
              <div className="flex items-center gap-3">
                {session.user.role === "super_admin" ? (
                  <>
                    <Link
                      href="/admin"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/40 text-violet-300 text-xs font-semibold shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all hover:scale-105"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-violet-400" />
                      <span>Admin Portal</span>
                    </Link>
                    <Link
                      href="/profile"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-300 hover:text-white text-xs font-medium transition-colors"
                    >
                      <User className="h-3.5 w-3.5 text-blue-400" />
                      <span>Profile</span>
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/profile"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 text-xs font-semibold transition-colors"
                  >
                    <User className="h-3.5 w-3.5 text-blue-400" />
                    <span>My Profile</span>
                  </Link>
                )}

                <div className="text-right pl-1 pr-1 hidden xl:block">
                  <div className="text-xs font-semibold text-white leading-tight">
                    {session.user.full_name}
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400">
                    {session.user.role}
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="inline-flex items-center gap-1 p-2 rounded-xl bg-white/[0.04] hover:bg-red-500/15 hover:text-red-300 border border-white/10 text-zinc-300 text-xs transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="text-sm font-medium text-zinc-300 hover:text-white transition-colors duration-300"
                >
                  Sign In
                </Link>

                <Link
                  href="/join"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span className="relative z-10">Join Now</span>
                  <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden relative z-10 flex h-10 w-10 items-center justify-center rounded-lg text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden border-t border-white/10 bg-[#0a0f1c]/95 backdrop-blur-xl"
          >
            <div className="px-4 py-5 space-y-1.5 max-h-[80vh] overflow-y-auto">
              {session && session.user && (
                <div className="p-3 mb-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {session.user.full_name}
                    </div>
                    <div className="text-xs font-mono text-zinc-400">
                      {session.user.email} • {session.user.role}
                    </div>
                  </div>
                  {session.user.role === "super_admin" ? (
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-2.5 py-1 rounded-lg bg-violet-600/30 text-violet-300 text-xs font-mono font-semibold"
                    >
                      Admin
                    </Link>
                  ) : (
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-2.5 py-1 rounded-lg bg-blue-600/30 text-blue-300 text-xs font-mono font-semibold"
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
                    className={`block px-4 py-2.5 rounded-lg text-base font-medium transition-colors ${
                      isActive
                        ? "bg-white/10 text-white font-semibold"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className="pt-4 mt-3 border-t border-white/10 space-y-3">
                {session && session.user ? (
                  <>
                    {session.user.role === "super_admin" ? (
                      <Link
                        href="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/30"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        <span>Open Admin Portal</span>
                      </Link>
                    ) : (
                      <Link
                        href="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
                      >
                        <User className="h-4 w-4" />
                        <span>My Profile & Passes</span>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="block w-full text-center px-4 py-2.5 rounded-lg border border-red-500/20 text-xs font-medium text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-center px-4 py-3 rounded-lg border border-white/15 text-sm font-medium text-white hover:bg-white/10 transition-colors"
                    >
                      Sign In
                    </Link>

                    <Link
                      href="/join"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-black"
                    >
                      Join Now
                      <ArrowRight className="h-4 w-4" />
                    </Link>
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