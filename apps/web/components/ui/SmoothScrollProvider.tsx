"use client";

import React, { useEffect } from "react";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let lenisInstance: any = null;

    async function initLenis() {
      try {
        // @ts-ignore
        const LenisModule = await import("lenis");
        const Lenis = LenisModule.default || LenisModule;
        lenisInstance = new Lenis({
          duration: 1.4,
          easing: (t: number) => 1 - Math.pow(1 - t, 4), // Quartic Out curve for buttery smooth stop
          orientation: "vertical",
          gestureOrientation: "vertical",
          smoothWheel: true,
          wheelMultiplier: 0.95,
          touchMultiplier: 1.6,
          infinite: false,
        });

        function raf(time: number) {
          lenisInstance?.raf(time);
          requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
      } catch (err) {
        // Fallback for native smooth scrolling
        document.documentElement.style.scrollBehavior = "smooth";
      }
    }

    initLenis();

    return () => {
      if (lenisInstance) {
        lenisInstance.destroy();
      }
    };
  }, []);

  return <>{children}</>;
}
