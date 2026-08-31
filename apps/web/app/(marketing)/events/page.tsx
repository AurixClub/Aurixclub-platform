"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress, ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import { Calendar, Clock, MapPin, ArrowRight, CheckCircle2, AlertCircle, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Event, SessionData } from "@aurix/types";

import { PageHeaderBanner } from "@/components/ui/PageHeaderBanner";

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
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col selection:bg-indigo-500/20 selection:text-indigo-900">
      <ScrollProgress />
      <Navbar />

      <PageHeaderBanner
        badge="AURIX Programs"
        title="Upcoming"
        highlightTitle="Events"
        description="Hackathons, deep-tech workshops, keynote sessions, and collaborative build sprints organized by AURIX."
      />

      <main className="flex-grow pt-8 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {message && (
            <div
              className={`p-4 rounded-2xl max-w-md mx-auto text-xs font-semibold flex items-center justify-center gap-2 mb-8 ${
                message.type === "success"
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              {message.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <span>{message.text}</span>
            </div>
          )}

          {/* Events Grid */}
          {isLoading ? (
            <div className="text-center py-20 flex items-center justify-center gap-3 text-zinc-500">
              <span className="h-5 w-5 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
              <span>Loading events...</span>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20 text-zinc-500">No upcoming events scheduled right now.</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {events.map((event) => {
                const isRegistered = registeredIds.includes(event.id);
                const isFull = event.max_participants !== null && event.registration_count >= event.max_participants;

                return (
                  <div
                    key={event.id}
                    className="group relative h-full rounded-3xl border border-zinc-200/90 bg-white overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-indigo-300 shadow-lg shadow-slate-200/50 hover:shadow-xl flex flex-col justify-between"
                  >
                    <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

                    <div className="p-7 sm:p-8 flex flex-col flex-1">
                      {event.cover_image_url && (
                        <div className="h-44 -mx-7 sm:-mx-8 -mt-7 sm:-mt-8 mb-6 overflow-hidden relative bg-slate-100">
                          <img
                            src={event.cover_image_url}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200 text-[10px] font-mono text-zinc-800 uppercase font-bold shadow-sm">
                            {event.mode}
                          </span>
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-3 mb-4">
                        <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {event.status}
                        </span>

                        <span className="text-xs font-mono text-zinc-500 flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-indigo-600" />
                          <span>{event.registration_count} / {event.max_participants ?? "∞"}</span>
                        </span>
                      </div>

                      <div className="flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-zinc-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
                          {event.title}
                        </h3>

                        <p className="text-xs text-zinc-600 leading-relaxed mb-6">
                          {event.description}
                        </p>

                        <div className="space-y-2 pt-4 mt-auto border-t border-zinc-100 text-xs text-zinc-500">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                            <span>{new Date(event.starts_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                          </div>
                          {event.venue && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3.5 w-3.5 text-violet-600 shrink-0" />
                              <span className="truncate">{event.venue}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-6 mt-6 border-t border-zinc-100">
                        {isRegistered ? (
                          <button
                            disabled
                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs font-bold text-emerald-700 cursor-default"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            <span>You are Registered</span>
                          </button>
                        ) : isFull ? (
                          <button
                            disabled
                            className="w-full inline-flex items-center justify-center rounded-xl bg-zinc-100 border border-zinc-200 px-4 py-3 text-xs font-semibold text-zinc-400 cursor-not-allowed"
                          >
                            Event Full
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRegister(event.id)}
                            disabled={registeringId === event.id}
                            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-3 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 transition-all duration-300"
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

