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
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: "vertical",
          gestureOrientation: "vertical",
          smoothWheel: true,
          wheelMultiplier: 1.0,
          touchMultiplier: 1.5,
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
