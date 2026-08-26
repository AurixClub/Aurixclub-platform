"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@aurix/supabase/client";

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Verifying authentication...");

  useEffect(() => {
    let cancelled = false;

    async function handleAuthCallback() {
      const code = searchParams.get("code");
      const supabase = createClient();

      let accessToken: string | undefined;

      // 1. Check for PKCE authorization code (?code=...)
      if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error && data.session?.access_token) {
          accessToken = data.session.access_token;
        }
      }

      // 2. Check for hash parameters (#access_token=... from email confirmation or implicit OAuth)
      if (!accessToken && typeof window !== "undefined" && window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        accessToken = hashParams.get("access_token") || undefined;
      }

      // 3. Fallback: Check active Supabase session
      if (!accessToken) {
        const { data: sessionData } = await supabase.auth.getSession();
        accessToken = sessionData.session?.access_token;
      }

      if (!accessToken) {
        // If confirmation link was clicked, attempt direct login fallback
        if (!cancelled) {
          setMessage("Email confirmed successfully! Redirecting to home page...");
          setTimeout(() => {
            window.location.assign("/");
          }, 1200);
        }
        return;
      }

      // Exchange access_token with backend to set session cookie
      try {
        const response = await fetch("/api/auth/oauth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: accessToken }),
        });
        const result = await response.json();

        if (response.ok && result.success) {
          if (!cancelled) {
            window.location.assign(result.data?.redirect || "/");
          }
          return;
        }
      } catch (err) {
        console.error("Session creation error:", err);
      }

      if (!cancelled) {
        window.location.assign("/");
      }
    }

    handleAuthCallback().catch((err) => {
      console.error("Auth callback exception:", err);
      if (!cancelled) window.location.assign("/");
    });

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-[#07090e] text-white flex flex-col items-center justify-center px-6">
      <div className="flex items-center gap-3 text-zinc-300 text-sm font-medium">
        <span className="h-5 w-5 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
        <span>{message}</span>
      </div>
    </main>
  );
}
