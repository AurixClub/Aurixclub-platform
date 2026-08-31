"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface PageHeaderBannerProps {
  badge?: string;
  title: string;
  highlightTitle?: string;
  description: string;
  children?: React.ReactNode;
}

export function PageHeaderBanner({
  badge,
  title,
  highlightTitle,
  description,
  children,
}: PageHeaderBannerProps) {
  return (
    <section className="relative pt-28 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-blue-50/90 via-indigo-50/40 to-white text-zinc-900 border-b border-zinc-100/80">
      {/* Subtle Geometric Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c70a_1px,transparent_1px),linear-gradient(to_bottom,#0284c70a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none z-0" />

      {/* Light Ambient Glow Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-gradient-to-tr from-blue-400/15 via-indigo-300/15 to-sky-300/10 rounded-full blur-[90px] pointer-events-none z-0" />

      <div className="mx-auto max-w-4xl text-center z-10 space-y-3.5 relative">
        {badge && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-white/90 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-indigo-700 shadow-xs mb-1"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>{badge}</span>
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight uppercase leading-tight text-zinc-900"
        >
          {title}{" "}
          {highlightTitle && (
            <span className="font-serif italic font-normal lowercase capitalize tracking-normal text-indigo-600">
              {highlightTitle}
            </span>
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto max-w-2xl text-sm sm:text-base md:text-lg text-zinc-600 leading-relaxed font-normal"
        >
          {description}
        </motion.p>

        {children && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="pt-2"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
