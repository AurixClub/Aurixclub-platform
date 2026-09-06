"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/ui/ScrollReveal";
import {
  Search,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowUpDown,
  Zap,
  Building2,
  ChevronRight,
  Filter,
} from "lucide-react";
import type { Event, SessionData } from "@aurix/types";

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<SessionData | null>(null);
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyMyPrograms, setShowOnlyMyPrograms] = useState(false);

  // Featured rotating card state
  const [featuredIndex, setFeaturedIndex] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const [evRes, sessRes] = await Promise.all([
          fetch("/api/events"),
          fetch("/api/auth/session"),
        ]);
        const evData = await evRes.json();
        const sessData = await sessRes.json();

        if (evData.success && evData.data?.events) {
          setEvents(evData.data.events);
        }

        if (sessData.success && sessData.data?.authenticated) {
          setSession(sessData.data);
          const myRegsRes = await fetch("/api/events/my-registrations");
          const myRegsData = await myRegsRes.json();
          if (myRegsData.success && myRegsData.data?.registrations) {
            setRegisteredIds(myRegsData.data.registrations.map((r: any) => r.registration.event_id));
          }
        }
      } catch (e) {
        console.error("Failed to load events", e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  // Cycle the featured card every 2.5 seconds among existing events
  useEffect(() => {
    if (events.length <= 1) return;
    const timer = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % events.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [events.length]);

  const handleRegister = async (eventId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session || !session.user) {
      router.push("/login?redirect=/events");
      return;
    }

    setRegisteringId(eventId);
    setMessage(null);

    try {
      const res = await fetch(`/api/events/${eventId}/register`, { method: "POST" });
      const data = await res.json();

      if (data.success) {
        setRegisteredIds((prev) => [...prev, eventId]);
        setMessage({ type: "success", text: "Successfully registered for this opportunity!" });
      } else {
        setMessage({ type: "error", text: data.error?.message || "Registration failed" });
      }
    } catch {
      setMessage({ type: "error", text: "An error occurred during registration." });
    } finally {
      setRegisteringId(null);
    }
  };

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      if (showOnlyMyPrograms && !registeredIds.includes(ev.id)) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = ev.title?.toLowerCase().includes(q);
        const matchDesc = ev.description?.toLowerCase().includes(q);
        const matchVenue = ev.venue?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchVenue) return false;
      }

      return true;
    });
  }, [events, searchQuery, showOnlyMyPrograms, registeredIds]);

  const formatDateRange = (startsAt: string, endsAt: string) => {
    try {
      const s = new Date(startsAt);
      const e = new Date(endsAt);
      const startStr = s.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const endStr = e.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      return `${startStr} - ${endStr}`;
    } catch {
      return "Dates TBA";
    }
  };

  const currentFeatured = events.length > 0 ? events[featuredIndex % events.length] : null;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-zinc-900 flex flex-col selection:bg-blue-500/20 selection:text-blue-900">
      <ScrollProgress />
      <Navbar />

      {/* ══════════════ HERO SECTION (Sunrise Soft Blue Atmosphere) ══════════════ */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1d4ed8] via-[#2563eb] to-[#38bdf8] text-white overflow-hidden shadow-sm">
        {/* Geometric White Grid Pattern Overlay (Soft Contrast) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none z-0" />

        {/* Ambient Radial Sunrise Glow (Warm Dawn + Sky Light) */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[520px] bg-gradient-to-tr from-amber-200/25 via-sky-300/30 to-blue-200/20 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute top-0 right-1/4 w-[400px] h-[300px] bg-amber-100/20 rounded-full blur-[100px] pointer-events-none z-0" />

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-100 leading-tight">
                Where Ideas Meet Opportunity
              </h1>

              <p className="text-blue-100/90 text-sm sm:text-base max-w-xl leading-relaxed font-normal">
                Explore opportunities that match your interests, sharpen your skills, and give you a platform to build something extraordinary.
              </p>

              {/* Search & "My Programs" Bar */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-xl">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search hiring hackathons..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white text-zinc-900 placeholder:text-zinc-400 text-sm border-0 focus:ring-2 focus:ring-blue-300 outline-none shadow-sm font-medium"
                  />
                </div>

                {/* My Programs Button (Permanent White Background) */}
                <button
                  onClick={() => {
                    if (!session || !session.user) {
                      router.push("/login?redirect=/events");
                      return;
                    }
                    setShowOnlyMyPrograms(true);
                    const el = document.getElementById("opportunities-grid");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all border shadow-xs whitespace-nowrap bg-white text-blue-700 hover:bg-blue-50 border-white"
                >
                  <span>My Programs</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Right Featured Opportunity Card (Cycles every 2-3 sec of existing events) */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-zinc-900 aspect-[16/10] sm:aspect-[16/9]">
                {currentFeatured ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentFeatured.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="absolute inset-0"
                    >
                      <Link href={`/events/${currentFeatured.slug}`} className="block w-full h-full relative group">
                        {currentFeatured.cover_image_url ? (
                          <Image
                            src={currentFeatured.cover_image_url}
                            alt={currentFeatured.title}
                            fill
                            unoptimized
                            className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.85]"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex flex-col items-center justify-center p-4">
                            <Calendar className="h-10 w-10 text-sky-300/70 mb-2" />
                            <span className="text-xs font-mono uppercase tracking-wider text-sky-200">AURIX Featured Event</span>
                          </div>
                        )}

                        {/* Bottom Overlay Info */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-5 text-left z-10">
                          <h3 className="text-lg sm:text-xl font-bold text-white leading-tight mb-1 line-clamp-1 group-hover:text-sky-300 transition-colors">
                            {currentFeatured.title}
                          </h3>
                          <div className="flex items-center justify-between text-xs text-zinc-300 font-medium">
                            <span>
                              {formatDateRange(currentFeatured.starts_at, currentFeatured.ends_at)} •{" "}
                              {currentFeatured.venue?.split(",")[0] || (currentFeatured.mode === "online" ? "Online" : "Dr. AIT")}
                            </span>
                            <span className="text-sky-300 text-[11px] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                              View Event <ArrowRight className="h-3 w-3" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-900/60 to-indigo-900/60 flex flex-col items-center justify-center p-6 text-center">
                    <Calendar className="h-8 w-8 text-sky-300 mb-2" />
                    <span className="text-sm font-semibold text-white">Upcoming Programs</span>
                    <span className="text-xs text-blue-200 mt-1">Check back soon for new announcements</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ MAIN CONTENT & OPPORTUNITIES ══════════════ */}
      <main id="opportunities-grid" className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {message && (
            <div
              className={`p-3.5 rounded-xl max-w-md mx-auto text-xs font-semibold flex items-center justify-center gap-2 mb-6 shadow-sm ${
                message.type === "success"
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              {message.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <span>{message.text}</span>
            </div>
          )}

          {/* Active "My Programs" Filter Banner */}
          {showOnlyMyPrograms && (
            <div className="flex items-center justify-between bg-blue-50 border border-blue-200/90 rounded-2xl px-5 py-3.5 mb-8 shadow-xs">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-blue-900">
                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Showing your registered programs ({filteredEvents.length})</span>
              </div>
              <button
                onClick={() => setShowOnlyMyPrograms(false)}
                className="text-xs font-bold text-blue-700 hover:text-blue-900 underline transition-colors"
              >
                View All Events
              </button>
            </div>
          )}

          {/* Opportunities Cards (Sized identically to Home Page Featured Programs Cards: w-72 sm:w-80) */}
          {isLoading ? (
            <div className="flex flex-wrap justify-center sm:justify-start gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="w-72 sm:w-80 rounded-2xl border border-zinc-200/80 bg-zinc-100 p-5 flex flex-col justify-between animate-pulse"
                >
                  <div>
                    <div className="w-full aspect-[16/10] bg-zinc-200 rounded-xl mb-4" />
                    <div className="h-5 w-3/4 bg-zinc-200 rounded mb-2" />
                    <div className="h-3 w-full bg-zinc-200 rounded mb-4" />
                  </div>
                  <div className="pt-3 border-t border-zinc-200/70 space-y-2">
                    <div className="h-3 w-1/2 bg-zinc-200 rounded" />
                    <div className="h-8 w-full bg-zinc-200 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-zinc-200/80 p-8 max-w-xl mx-auto">
              <Calendar className="h-10 w-10 text-zinc-400 mx-auto mb-3" />
              <p className="text-base font-semibold text-zinc-800 mb-1">
                {showOnlyMyPrograms ? "No registered programs yet" : "No upcoming events scheduled right now"}
              </p>
              <p className="text-xs text-zinc-500 mb-4">
                {showOnlyMyPrograms
                  ? "You haven't registered for any opportunities yet. Browse available events and click 'Register Now' to join!"
                  : "New hackathons and workshops will be published soon."}
              </p>
              {searchQuery || showOnlyMyPrograms ? (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setShowOnlyMyPrograms(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
                >
                  {showOnlyMyPrograms ? "Explore All Programs" : "Reset Search"}
                </button>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-wrap justify-center sm:justify-start gap-6">
              {filteredEvents.map((event, idx) => {
                const isPast = new Date(event.ends_at) < new Date();
                const isOngoing = new Date(event.starts_at) <= new Date() && new Date(event.ends_at) >= new Date();

                const getStatusVariant = () => {
                  if (isPast) return "bg-slate-200/80 text-slate-700 border-slate-300";
                  if (isOngoing) return "bg-emerald-100 text-emerald-800 border-emerald-300";
                  return "bg-indigo-100 text-indigo-800 border-indigo-200";
                };

                const getStatusText = () => {
                  if (isPast) return "Completed";
                  if (isOngoing) return "Live Now";
                  return "Upcoming";
                };

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 22, scale: 0.97 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{
                      duration: 0.45,
                      delay: (idx % 4) * 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
                    className="flex-shrink-0"
                  >
                    <Link
                      href={`/events/${event.slug}`}
                      className="group block w-72 sm:w-80 rounded-2xl border border-zinc-200/80 bg-zinc-100 p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-300 hover:bg-zinc-50 hover:shadow-xl active:scale-[0.98] shadow-sm flex flex-col justify-between cursor-pointer overflow-hidden h-full"
                    >
                      <div>
                        {/* Box-Type Image / Banner (Exact Same as OngoingEventsMarquee) */}
                        <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-4 bg-slate-200 ring-1 ring-zinc-200/90 shadow-xs">
                          {event.cover_image_url ? (
                            <Image
                              src={event.cover_image_url}
                              alt={event.title}
                              fill
                              unoptimized
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-indigo-500/15 via-blue-500/10 to-indigo-600/25 flex flex-col items-center justify-center gap-1 p-3 text-center">
                              <Calendar className="h-7 w-7 text-indigo-600/80" />
                              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-indigo-700">
                                AURIX Event
                              </span>
                            </div>
                          )}

                          {/* Status Overlay */}
                          <div className="absolute top-2.5 left-2.5">
                            <span
                              className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold border backdrop-blur-md shadow-xs ${getStatusVariant()}`}
                            >
                              {getStatusText()}
                            </span>
                          </div>

                          {event.max_participants && (
                            <div className="absolute top-2.5 right-2.5">
                              <span className="text-[10px] font-mono bg-white/90 backdrop-blur-md text-zinc-700 px-2 py-0.5 rounded-full border border-zinc-200 font-semibold flex items-center gap-1 shadow-xs">
                                <Users className="h-3 w-3 text-indigo-600" />
                                <span>{event.registration_count}/{event.max_participants}</span>
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Title & Description */}
                        <h3 className="text-base font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-1.5">
                          {event.title}
                        </h3>

                        <p className="text-xs text-zinc-600 leading-relaxed line-clamp-2 mb-4">
                          {event.description}
                        </p>
                      </div>

                      {/* Footer Details */}
                      <div className="pt-3 border-t border-zinc-200/70 space-y-3">
                        <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
                          <div className="flex items-center gap-1.5 truncate">
                            <Calendar className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                            <span>{new Date(event.starts_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                          </div>
                          {event.venue ? (
                            <div className="flex items-center gap-1 truncate max-w-[140px]">
                              <MapPin className="h-3.5 w-3.5 text-violet-600 shrink-0" />
                              <span className="truncate">{event.venue}</span>
                            </div>
                          ) : event.mode === "online" ? (
                            <span className="text-indigo-600 font-semibold">Online</span>
                          ) : null}
                        </div>

                        <span className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-all duration-300 group-hover:bg-indigo-700 w-full mt-1">
                          <span>View Details</span>
                          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
