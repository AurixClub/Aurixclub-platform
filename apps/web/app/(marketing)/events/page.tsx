"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress, ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import { Calendar, Clock, MapPin, ArrowRight, CheckCircle2, AlertCircle, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Event, SessionData } from "@aurix/types";

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<SessionData | null>(null);
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

          // Fetch user's registered events
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

  const handleRegister = async (eventId: string) => {
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
        setMessage({ type: "success", text: "Successfully registered for this event!" });
        // Refresh event list to update count
        const evRes = await fetch("/api/events");
        const evData = await evRes.json();
        if (evData.success) setEvents(evData.data.events);
      } else {
        setMessage({ type: "error", text: data.error?.message || "Registration failed" });
      }
    } catch {
      setMessage({ type: "error", text: "An error occurred during registration." });
    } finally {
      setRegisteringId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col selection:bg-blue-500/30 selection:text-white">
      <ScrollProgress />
      <Navbar />

      <main className="flex-grow pt-36 pb-28 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
              Upcoming <span className="text-gradient-primary">Events</span>
            </h1>
            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
              Hackathons, deep-tech workshops, keynote sessions, and collaborative build sprints organized by AURIX.
            </p>

            {message && (
              <div
                className={`p-4 rounded-2xl max-w-md mx-auto text-xs font-semibold flex items-center justify-center gap-2 ${
                  message.type === "success"
                    ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
                    : "bg-red-500/15 border border-red-500/30 text-red-300"
                }`}
              >
                {message.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <span>{message.text}</span>
              </div>
            )}
          </div>

          {/* Events Grid */}
          {isLoading ? (
            <div className="text-center py-20 flex items-center justify-center gap-3 text-zinc-400">
              <span className="h-5 w-5 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
              <span>Loading events...</span>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20 text-zinc-400">No upcoming events scheduled right now.</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {events.map((event) => {
                const isRegistered = registeredIds.includes(event.id);
                const isFull = event.max_participants !== null && event.registration_count >= event.max_participants;

                return (
                  <div
                    key={event.id}
                    className="group relative h-full rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-white/20 hover:shadow-2xl flex flex-col justify-between"
                  >
                    <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

                    <div className="p-7 sm:p-8 flex flex-col flex-1">
                      {event.cover_image_url && (
                        <div className="h-44 -mx-7 sm:-mx-8 -mt-7 sm:-mt-8 mb-6 overflow-hidden relative bg-slate-900">
                          <img
                            src={event.cover_image_url}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-mono text-white uppercase font-bold">
                            {event.mode}
                          </span>
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-3 mb-4">
                        <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                          {event.status}
                        </span>

                        <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-blue-400" />
                          <span>{event.registration_count} / {event.max_participants ?? "∞"}</span>
                        </span>
                      </div>

                      <div className="flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-blue-300 transition-colors">
                          {event.title}
                        </h3>

                        <p className="text-xs text-zinc-300 leading-relaxed mb-6">
                          {event.description}
                        </p>

                        <div className="space-y-2 pt-4 mt-auto border-t border-white/[0.06] text-xs text-zinc-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                            <span>{new Date(event.starts_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                          </div>
                          {event.venue && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                              <span className="truncate">{event.venue}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-6 mt-6">
                        {isRegistered ? (
                          <button
                            disabled
                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600/20 border border-emerald-500/40 px-4 py-3 text-xs font-bold text-emerald-300 cursor-default"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            <span>You are Registered</span>
                          </button>
                        ) : isFull ? (
                          <button
                            disabled
                            className="w-full inline-flex items-center justify-center rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-xs font-semibold text-zinc-500 cursor-not-allowed"
                          >
                            Event Full
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRegister(event.id)}
                            disabled={registeringId === event.id}
                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:opacity-95 px-4 py-3 text-xs font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300"
                          >
                            {registeringId === event.id ? (
                              <span>Registering...</span>
                            ) : (
                              <>
                                <span>Register Now</span>
                                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
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

