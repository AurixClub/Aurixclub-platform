"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@aurix/supabase/client";

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Completing Google sign-in...");

  useEffect(() => {
    let cancelled = false;
    async function completeOAuth() {
      const code = searchParams.get("code");
      if (!code) {
        setMessage("This confirmation link is invalid or has expired. Please request a new one.");
        return;
      }

      const supabase = createClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error || !data.session?.access_token || !data.user?.email) {
        setMessage(error?.message || "Unable to complete Google sign-in.");
        return;
      }

      const response = await fetch("/api/auth/oauth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: data.session.access_token }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        setMessage(result.error?.message || "Unable to create application session.");
        return;
      }

      if (!cancelled) {
        window.location.assign(searchParams.get("redirect") || result.data?.redirect || "/dashboard");
      }
    }

    completeOAuth().catch(() => setMessage("Unable to complete Google sign-in."));
    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-[#07090e] text-white flex items-center justify-center px-6">
      <div className="text-center space-y-4">
        <span className="mx-auto block h-6 w-6 rounded-full border-2 border-blue-500/30 border-t-blue-400 animate-spin" />
        <p className="text-sm text-zinc-300">{message}</p>
        <a href="/login" className="text-sm text-blue-400 underline hover:text-blue-300">Return to sign in</a>
      </div>
    </main>
  );
}
