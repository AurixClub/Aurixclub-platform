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

  const isTransparentHero = (isHome || pathname === "/events") && !isScrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${isTransparentHero
          ? "bg-gradient-to-b from-blue-950/40 via-blue-900/20 to-transparent backdrop-blur-xs border-b border-white/10 text-white"
          : isScrolled
            ? "bg-white/95 backdrop-blur-xl border-b border-zinc-200 shadow-md text-zinc-900"
            : "bg-white/85 backdrop-blur-md border-b border-zinc-200/80 text-zinc-900 shadow-xs"
        }`}
    >
      <nav className="w-full px-4 sm:px-6 lg:px-10">
        <div className="flex h-12 md:h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group relative z-10">
            <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-xl overflow-hidden shadow-md group-hover:scale-105 transition-all duration-300 ring-1 ring-white/30 bg-white">
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
                <span
                  className={`text-lg md:text-xl font-black tracking-tight transition-colors duration-300 ${isTransparentHero ? "text-white" : "text-zinc-900 group-hover:text-indigo-600"
                    }`}
                >
                  AURIX
                </span>
                <span
                  className={`hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold border ${isTransparentHero
                      ? "bg-white/15 border-white/30 text-white"
                      : "bg-indigo-50 border-indigo-200 text-indigo-700"
                    }`}
                >
                  Dr. AIT
                </span>
              </div>
              <span
                className={`text-[9px] uppercase font-mono tracking-[0.22em] font-semibold -mt-0.5 ${isTransparentHero ? "text-blue-200" : "text-indigo-600"
                  }`}
              >
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
                  className={`relative px-3.5 py-2 text-sm font-semibold transition-colors duration-300 group ${isTransparentHero
                      ? isActive
                        ? "text-white font-bold"
                        : "text-white/80 hover:text-white"
                      : isActive
                        ? "text-indigo-600 font-bold"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                >
                  <span>{link.label}</span>
                  <span
                    className={`absolute left-3 right-3 -bottom-0.5 h-[2px] rounded-full transition-all duration-300 ${isTransparentHero
                        ? isActive
                          ? "bg-white scale-x-100"
                          : "bg-white/50 scale-x-0 group-hover:scale-x-100"
                        : isActive
                          ? "bg-indigo-600 scale-x-100"
                          : "bg-indigo-600/40 scale-x-0 group-hover:scale-x-100"
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
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all hover:scale-105 border ${isTransparentHero
                          ? "bg-white/15 border-white/30 text-white hover:bg-white/25"
                          : "bg-violet-50 hover:bg-violet-100 border-violet-200 text-violet-700"
                        }`}
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Admin Portal</span>
                    </Link>
                    <Link
                      href="/profile"
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border ${isTransparentHero
                          ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                          : "bg-zinc-100 hover:bg-zinc-200/80 border-zinc-200 text-zinc-800"
                        }`}
                    >
                      <User className="h-3.5 w-3.5" />
                      <span>Profile</span>
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/profile"
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border ${isTransparentHero
                        ? "bg-white/15 border-white/30 text-white hover:bg-white/25"
                        : "bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700"
                      }`}
                  >
                    <User className="h-3.5 w-3.5" />
                    <span>My Profile</span>
                  </Link>
                )}

                <div className="text-right pl-1 pr-1 hidden xl:block">
                  <div className={`text-xs font-semibold leading-tight ${isTransparentHero ? "text-white" : "text-zinc-900"}`}>
                    {session.user.full_name}
                  </div>
                  <div className={`text-[10px] font-mono ${isTransparentHero ? "text-blue-200" : "text-zinc-500"}`}>
                    {session.user.role}
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className={`inline-flex items-center gap-1 p-2 rounded-xl text-xs border ${isTransparentHero
                      ? "bg-white/10 border-white/20 text-white hover:bg-red-500/20 hover:border-red-400"
                      : "bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-red-50 hover:text-red-600"
                    }`}
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className={`text-sm font-semibold transition-colors duration-300 ${isTransparentHero
                      ? "text-white/90 hover:text-white"
                      : "text-zinc-700 hover:text-zinc-900"
                    }`}
                >
                  Sign In
                </Link>

                <Link
                  href="/join"
                  className={`group relative inline-flex items-center gap-2 overflow-hidden rounded-xl px-5 py-2.5 text-sm font-bold shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${isTransparentHero
                      ? "bg-white text-indigo-900 hover:bg-slate-100 shadow-blue-950/40"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20"
                    }`}
                >
                  <span className="relative z-10">Join Now</span>
                  <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden relative z-10 flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${isTransparentHero
                ? "text-white hover:bg-white/10"
                : "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100"
              }`}
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
            className="lg:hidden overflow-hidden border-t border-zinc-200 bg-white/95 backdrop-blur-xl shadow-xl"
          >
            <div className="px-4 py-5 space-y-1.5 max-h-[80vh] overflow-y-auto">
              {session && session.user && (
                <div className="p-3 mb-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-zinc-900">
                      {session.user.full_name}
                    </div>
                    <div className="text-xs font-mono text-zinc-500">
                      {session.user.email} • {session.user.role}
                    </div>
                  </div>
                  {session.user.role === "super_admin" ? (
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-2.5 py-1 rounded-lg bg-violet-100 text-violet-700 text-xs font-mono font-semibold"
                    >
                      Admin
                    </Link>
                  ) : (
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-mono font-semibold"
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
                    className={`block px-4 py-2.5 rounded-lg text-base font-medium transition-colors ${isActive
                        ? "bg-indigo-50 text-indigo-600 font-semibold"
                        : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                      }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className="pt-4 mt-3 border-t border-zinc-200 space-y-3">
                {session && session.user ? (
                  <>
                    {session.user.role === "super_admin" ? (
                      <Link
                        href="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-violet-500/20"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        <span>Open Admin Portal</span>
                      </Link>
                    ) : (
                      <Link
                        href="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white"
                      >
                        <User className="h-4 w-4" />
                        <span>My Profile & Passes</span>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="block w-full text-center px-4 py-2.5 rounded-lg border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-center px-4 py-3 rounded-lg border border-zinc-200 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 transition-colors"
                    >
                      Sign In
                    </Link>

                    <Link
                      href="/join"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md"
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