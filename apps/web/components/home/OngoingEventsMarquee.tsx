"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Calendar, Clock, MapPin, ArrowRight, Users, ExternalLink, Sparkles } from "lucide-react";
import Link from "next/link";
import type { Event } from "@aurix/types";

interface EventCardProps {
  event: Event;
}

function EventCard({ event }: EventCardProps) {
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
    <Link
      href={`/events/${event.slug}`}
      className="group flex-shrink-0 w-72 sm:w-80 rounded-2xl border border-zinc-200/80 bg-zinc-100 p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-300 hover:bg-zinc-50 hover:shadow-xl shadow-sm flex flex-col justify-between cursor-pointer overflow-hidden"
    >
      <div>
        {/* Box-Type Image / Banner */}
        <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-4 bg-slate-200 ring-1 ring-zinc-200/90 shadow-xs">
          {event.banner_url ? (
            <Image
              src={event.banner_url}
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
            <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold border backdrop-blur-md shadow-xs ${getStatusVariant()}`}>
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

        {/* Title */}
        <h3 className="font-montserrat text-base sm:text-lg font-bold text-zinc-900 leading-snug mb-1.5 group-hover:text-indigo-600 transition-colors line-clamp-2">
          {event.title}
        </h3>

        {/* Short description */}
        <p className="text-xs text-zinc-600 leading-relaxed mb-4 line-clamp-2">
          {event.short_description || event.description}
        </p>
      </div>

      {/* Meta & CTA Footer */}
      <div className="pt-3 border-t border-zinc-200/70 space-y-2">
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
  );
}

function EventCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-72 sm:w-80 rounded-2xl border border-zinc-200/80 bg-zinc-100 p-5 flex flex-col justify-between animate-pulse">
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

  const duplicatedEvents = events.length > 0 ? [...events, ...events, ...events] : [];

  return (
    <section className="relative pt-6 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden font-montserrat bg-white">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-br from-indigo-100/40 via-violet-100/30 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl">
        <ScrollReveal direction="up" duration={0.8}>
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <h2 className="font-montserrat text-3xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-wider text-zinc-900">
              FEATURED PROGRAMS
            </h2>
            <p className="font-montserrat text-base text-zinc-600">
              {isLoading || events.length > 0
                ? "Hackathons, deep-tech workshops, keynote sessions, and collaborative build sprints."
                : "No programs scheduled at the moment."}
            </p>
          </div>
        </ScrollReveal>

        {isLoading ? (
          <div className="flex gap-6 overflow-hidden justify-center py-2">
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
          </div>
        ) : events.length > 0 ? (
          <div className="relative">
            <div className="flex gap-6 animate-marquee-[20s] hover:pause-animation" style={{ willChange: "transform" }}>
              {duplicatedEvents.map((event, index) => (
                <EventCard key={`${event.id}-${index}`} event={event} />
              ))}
            </div>

            <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-white via-transparent to-white z-10" />
          </div>
        ) : null}
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
