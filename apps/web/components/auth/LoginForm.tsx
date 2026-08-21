"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

export function LoginForm() {
  const [mode, setMode] = useState<"login" | "forgotPassword">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setErrorMessage(data.error?.message || "Invalid email or password.");
        return;
      }
      window.location.assign(data.data?.redirect || "/");
    } catch {
      setErrorMessage("Unable to connect to authentication service. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!forgotEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      setErrorMessage("Please enter a valid registered email address.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail.trim() }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setErrorMessage(data.error?.message || "Unable to send the reset link.");
        return;
      }
      setSuccessMessage("If that account exists, a password reset link has been sent. Check your inbox.");
    } catch {
      setErrorMessage("Unable to connect to password recovery service. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl glass-panel p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden"
      >
        {/* Subtle accent glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Feedback alerts */}
        <AnimatePresence mode="wait">
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 flex items-start gap-3 rounded-2xl bg-red-500/10 border border-red-500/30 p-4 text-xs sm:text-sm text-red-300"
            >
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 flex items-start gap-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-xs sm:text-sm text-emerald-300"
            >
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {mode === "login" ? (
          /* Sign In Form */
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email field */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 pl-10 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition-colors disabled:opacity-50"
                />
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setMode("forgotPassword");
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 pl-10 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition-colors disabled:opacity-50"
                />
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 py-3.5 px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  <span>Signing you in...</span>
                </div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <span className="relative bg-[#0d111c] px-3 text-xs uppercase tracking-wider text-zinc-500 font-mono">
                Or continue with
              </span>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  setSuccessMessage(
                    "Welcome back to AURIX! Redirecting you to your dashboard..."
                  );
                }, 1000);
              }}
              className="w-full flex items-center justify-center gap-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 py-3 px-4 text-sm font-medium text-white transition-colors disabled:opacity-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.2-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>
        ) : (
          /* Forgot Password Flow */
          <form onSubmit={handleForgotPassword} className="space-y-5">
            <div className="space-y-2">
              <h4 className="text-base font-bold text-white">Reset Password</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Enter your registered email and we&apos;ll send you a password reset link.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Registered Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 pl-10 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition-colors disabled:opacity-50"
                />
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 px-6 text-sm font-semibold text-white shadow-lg transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span>Sending reset link...</span>
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("login");
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className="w-full inline-flex items-center justify-center gap-1.5 text-xs text-zinc-400 hover:text-white pt-2 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Sign In</span>
            </button>
          </form>
        )}

        {/* New to AURIX Footer */}
        <div className="mt-8 pt-6 border-t border-white/[0.06] text-center space-y-2">
          <p className="text-xs text-zinc-400">
            Don&apos;t have an account yet?
          </p>
          <Link
            href="/join"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors group"
          >
            <span>Join the AURIX Community</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
