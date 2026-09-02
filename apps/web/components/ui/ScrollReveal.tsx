"use client";

import React, { ReactNode } from "react";
import { motion, useScroll, useSpring, Variants } from "framer-motion";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right" | "fade" | "zoom" | "blur";
  duration?: number;
  delay?: number;
  distance?: number;
  className?: string;
  once?: boolean;
  amount?: number | "some" | "all";
}

// Ultra-smooth 60/120fps natural cubic bezier easing
const customEasing: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function ScrollReveal({
  children,
  direction = "up",
  duration = 0.65,
  delay = 0,
  distance = 28,
  className = "",
  once = true,
  amount = 0.1,
}: ScrollRevealProps) {
  const getVariants = (): Variants => {
    switch (direction) {
      case "up":
        return {
          hidden: { opacity: 0, y: distance },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration, delay, ease: customEasing },
          },
        };
      case "down":
        return {
          hidden: { opacity: 0, y: -distance },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration, delay, ease: customEasing },
          },
        };
      case "left":
        return {
          hidden: { opacity: 0, x: distance },
          visible: {
            opacity: 1,
            x: 0,
            transition: { duration, delay, ease: customEasing },
          },
        };
      case "right":
        return {
          hidden: { opacity: 0, x: -distance },
          visible: {
            opacity: 1,
            x: 0,
            transition: { duration, delay, ease: customEasing },
          },
        };
      case "zoom":
        return {
          hidden: { opacity: 0, scale: 0.95 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: { duration, delay, ease: customEasing },
          },
        };
      case "blur":
      case "fade":
      default:
        return {
          hidden: { opacity: 0, y: 12 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration, delay, ease: customEasing },
          },
        };
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={getVariants()}
      className={className}
      style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  delayChildren?: number;
  className?: string;
  once?: boolean;
  amount?: number | "some" | "all";
}

export function StaggerContainer({
  children,
  staggerDelay = 0.08,
  delayChildren = 0.04,
  className = "",
  once = true,
  amount = 0.08,
}: StaggerContainerProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={containerVariants}
      className={className}
      style={{ willChange: "opacity" }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  distance?: number;
  duration?: number;
}

export function StaggerItem({
  children,
  className = "",
  distance = 22,
  duration = 0.55,
}: StaggerItemProps) {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: distance, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration,
        ease: customEasing,
      },
    },
  };

  return (
    <motion.div
      variants={itemVariants}
      className={className}
      style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
    >
      {children}
    </motion.div>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 origin-left z-50 shadow-[0_0_12px_rgba(99,102,241,0.6)]"
      style={{ scaleX }}
    />
  );
}
