"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Megaphone, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AnnouncementPopup() {
  const [announcement, setAnnouncement] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true); // default true until we check localStorage

  useEffect(() => {
    async function fetchActiveAnnouncement() {
      try {
        const res = await fetch("/api/announcements/active");
        if (res.ok) {
          const data = await res.json();
          if (data.active) {
            setAnnouncement(data.active);
            
            // Check if dismissed
            const dismissedId = localStorage.getItem("dismissedAnnouncementId");
            if (dismissedId !== data.active.id) {
              setIsDismissed(false);
              
              // Slight delay before showing for effect
              setTimeout(() => {
                setIsVisible(true);
              }, 1500);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch active announcement", err);
      }
    }

    fetchActiveAnnouncement();
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    if (announcement) {
      localStorage.setItem("dismissedAnnouncementId", announcement.id);
    }
  };

  if (!announcement || isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6 pointer-events-none">
          {/* Subtle backdrop overlay for mobile to focus attention, hidden on desktop so it doesn't block interactions */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] sm:hidden pointer-events-auto"
            onClick={handleDismiss}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-[#0a0d16]/90 backdrop-blur-xl border border-violet-500/30 rounded-3xl p-6 shadow-2xl shadow-violet-900/20 pointer-events-auto"
          >
            {/* Glossy gradient accent */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500/10 via-transparent to-emerald-500/10 pointer-events-none" />
            <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-32 h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-50" />
            
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors z-10"
              aria-label="Close announcement"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex gap-4 relative z-10">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <Megaphone className="w-6 h-6 text-white" />
              </div>
              
              <div className="flex-1 pt-1">
                <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                  {announcement.title}
                </h3>
                <p className="text-sm text-zinc-300 mb-4 leading-relaxed">
                  {announcement.message}
                </p>
                
                {announcement.link_url && (
                  <Link 
                    href={announcement.link_url}
                    onClick={handleDismiss}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-colors group"
                  >
                    <span>{announcement.link_text || "Learn More"}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
