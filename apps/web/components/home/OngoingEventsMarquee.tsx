"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import React, { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, ArrowRight, Users, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { Event } from "@aurix/types";

interface EventCardProps {
  event: Event;
}

function EventCard({ event }: EventCardProps) {
  const isFull = event.max_participants !== null && event.registration_count >= event.max_participants;
  const isPast = new Date(event.ends_at) < new Date();
  const isOngoing = new Date(event.starts_at) <= new Date() && new Date(event.ends_at) >= new Date();

  const getStatusVariant = () => {
    if (isPast) return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    if (isOngoing) return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    return "bg-blue-500/20 text-blue-300 border-blue-500/30";
  };

  const getStatusText = () => {
    if (isPast) return "Completed";
    if (isOngoing) return "Live Now";
    return "Upcoming";
  };

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex-shrink-0 w-[360px] sm:w-[380px] md:w-[400px] rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6 transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl flex flex-col justify-between min-h-[420px]"
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-full font-bold border ${getStatusVariant()}`}>
          {getStatusText()}
        </span>

        <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
          <Users className="h-3.5 w-3.5 text-blue-400" />
          <span>{event.registration_count} / {event.max_participants ?? "8"}</span>
        </span>
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-blue-300 transition-colors line-clamp-2">
          {event.title}
        </h3>

        <p className="text-xs text-zinc-300 leading-relaxed mb-6 line-clamp-3 flex-1">
          {event.short_description || event.description}
        </p>

        <div className="space-y-2 pt-4 mt-auto border-t border-white/[0.06] text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-blue-400 shrink-0" />
            <span>{new Date(event.starts_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-purple-400 shrink-0" />
            <span>
              {new Date(event.starts_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} -{" "}
              {new Date(event.ends_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          {event.venue && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-purple-400 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          )}
          {event.mode === "online" && event.meeting_link && (
            <a
              href={event.meeting_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Join Online</span>
            </a>
          )}
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-white/[0.06]">
        <span className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 group-hover:opacity-95 group-hover:shadow-blue-500/40 w-full">
          <span>View Details</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  );
}

export function OngoingEventsMarquee() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        if (data.success && data.data?.events) {
          const upcomingAndOngoing = data.data.events.filter(
            (e: Event) => e.status === "published" && new Date(e.ends_at) >= new Date()
          );
          setEvents(upcomingAndOngoing.slice(0, 8));
        }
      } catch (e) {
        console.error("Failed to load events", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadEvents();
  }, []);

  if (isLoading) {
    return (
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3.5 py-1 text-xs font-medium text-purple-300">
              <span className="h-3.5 w-3.5 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
              <span>Loading Events...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="relative pt-6 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden font-montserrat">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <h2 className="font-montserrat text-3xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-wider text-white">
              FEATURED PROGRAMS
            </h2>
            <p className="font-montserrat text-base text-zinc-400">No programs scheduled at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  const duplicatedEvents = [...events, ...events, ...events];

  return (
    <section className="relative pt-6 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden font-montserrat">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-br from-blue-900/10 via-indigo-900/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl">
        <ScrollReveal direction="up" duration={0.8}>
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <h2 className="font-montserrat text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-wider text-white">
              FEATURED PROGRAMS
            </h2>
            <p className="font-montserrat text-base sm:text-lg text-zinc-400">
              Hackathons, deep-tech workshops, keynote sessions, and collaborative build sprints.
            </p>
          </div>
        </ScrollReveal>

        <div className="relative">
          <div className="flex gap-6 animate-marquee-[20s] hover:pause-animation" style={{ willChange: "transform" }}>
            {duplicatedEvents.map((event, index) => (
              <EventCard key={`${event.id}-${index}`} event={event} />
            ))}
          </div>

          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#07090e] via-transparent to-[#07090e] z-10" />
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-\[20s\] {
          animation: marquee 20s linear infinite;
        }
        .hover\:pause-animation:hover {
          animation-play-state: paused;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}
