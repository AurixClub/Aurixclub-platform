// Reference fidelity: the fallback page stays within the frontend-only boundary and preserves the AURIX dark visual language.
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07090e] px-6 text-white">
      <div className="max-w-md text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-blue-300/80">AURIX</p>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Page not found</h1>
        <p className="mt-4 text-sm leading-relaxed text-zinc-400">
          The page you are looking for does not exist or may have moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07090e]"
        >
          Return to AURIX
        </Link>
      </div>
    </main>
  );
}
