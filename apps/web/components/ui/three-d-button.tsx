"use client";

import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";
import { ArrowRight } from "lucide-react";

// Join Now-only 3D CTA: compact on desktop, full-width on mobile, and touch-safe without hover dependence.
interface ThreeDButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

export function ThreeDButton({ href, children, className = "", onClick }: ThreeDButtonProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group relative inline-flex min-h-11 items-center justify-center gap-2 overflow-visible rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#07090e] shadow-[0_4px_0_#7c82a8] transition-transform duration-150 hover:-translate-y-0.5 hover:bg-blue-50 active:translate-y-0.5 active:shadow-[0_2px_0_#7c82a8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080b12] ${className}`}
    >
      <span>{children}</span>
      <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
    </Link>
  );
}
