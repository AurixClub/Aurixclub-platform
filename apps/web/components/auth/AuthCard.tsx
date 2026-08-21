"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
  Phone,
  Building2,
  GraduationCap,
} from "lucide-react";
import { createClient } from "@aurix/supabase/client";

interface AuthCardProps {
  initialTab?: "signin" | "signup";
}

export function AuthCard({ initialTab = "signin" }: AuthCardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"signin" | "signup" | "forgotPassword">(initialTab);

  // Sign In State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Sign Up State
  const [fullName, setFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupBranch, setSignupBranch] = useState("");
  const [signupYear, setSignupYear] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState("");

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const clearAlerts = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    try {
      // When Supabase has the account, this also prevents unconfirmed users
      // from entering the application before clicking the confirmation link.
      const supabase = createClient();
      const { error: supabaseLoginError } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim(),
        password: loginPassword,
      });
      if (supabaseLoginError && /confirm/i.test(supabaseLoginError.message)) {
        setErrorMessage("Please confirm your email address before signing in.");
        setIsLoading(false);
        return;
      }

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error?.message || "Invalid email or password.");
        setIsLoading(false);
        return;
      }

      const redirectTarget = data.data?.redirect || "/";
      router.push(redirectTarget);
      router.refresh();
    } catch {
      setErrorMessage("Unable to connect to authentication service. Please try again.");
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();

    if (!fullName.trim() || !signupEmail.trim() || !signupPassword || !confirmPassword) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (signupPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (signupPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }

    if (!/[A-Z]/.test(signupPassword)) {
      setErrorMessage("Password must contain at least one uppercase letter.");
      return;
    }

    if (!/[a-z]/.test(signupPassword)) {
      setErrorMessage("Password must contain at least one lowercase letter.");
      return;
    }

    if (!/[0-9]/.test(signupPassword)) {
      setErrorMessage("Password must contain at least one digit.");
      return;
    }

    setIsLoading(true);
    try {
      // Supabase sends the confirmation email when email confirmation is
      // enabled in the Supabase dashboard.
      const supabase = createClient();
      const { data: supabaseSignup, error: supabaseError } = await supabase.auth.signUp({
        email: signupEmail.trim(),
        password: signupPassword,
        options: {
          data: { full_name: fullName.trim() },
          emailRedirectTo: `${window.location.origin}/login?confirmed=1`,
        },
      });
      if (supabaseError) {
        setErrorMessage(supabaseError.message);
        setIsLoading(false);
        return;
      }

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: signupEmail.trim(),
          password: signupPassword,
          phone: signupPhone.trim() || null,
          branch: signupBranch.trim() || null,
          year: signupYear ? parseInt(signupYear) : null,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error?.message || "Signup failed. Please try again.");
        setIsLoading(false);
        return;
      }

      setSuccessMessage(
        supabaseSignup.session
          ? "Account created. You can now sign in."
          : "Account created. Check your email to confirm your account before signing in."
      );
      setActiveTab("signin");
    } catch {
      setErrorMessage("Unable to complete signup. Please try again.");
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();

    if (!forgotEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      setErrorMessage("Please enter a valid registered email address.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error?.message || "Unable to send the password reset link.");
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
        className="rounded-3xl glass-panel p-6 sm:p-9 border border-white/10 shadow-2xl relative overflow-hidden bg-[#0d111c]/80 backdrop-blur-xl"
      >
        {/* Subtle accent glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Tab Selector (hidden in forgot password mode) */}
        {activeTab !== "forgotPassword" && (
          <div className="flex rounded-2xl bg-white/[0.04] p-1 border border-white/10 mb-8">
            <button
              type="button"
              onClick={() => {
                setActiveTab("signin");
                clearAlerts();
              }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 ${
                activeTab === "signin"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("signup");
                clearAlerts();
              }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 ${
                activeTab === "signup"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/25"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Feedback alerts */}
        <AnimatePresence mode="wait">
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-6 flex items-start gap-3 rounded-xl bg-red-500/10 border border-red-500/30 p-3.5 text-xs sm:text-sm text-red-300"
            >
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-6 flex items-start gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3.5 text-xs sm:text-sm text-emerald-300"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══════════════ TAB 1: SIGN IN ══════════════ */}
        {activeTab === "signin" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 pl-10 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition-colors disabled:opacity-50"
                />
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("forgotPassword");
                    clearAlerts();
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
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 pl-10 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition-colors disabled:opacity-50"
                />
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 py-3.5 px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>



            {/* Divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <span className="relative bg-[#0d111c] px-3 text-[11px] uppercase tracking-wider text-zinc-500 font-mono">
                Or continue with
              </span>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              disabled={isLoading}
              onClick={async () => {
                setIsLoading(true);
                try {
                  const { createClient } = await import("@aurix/supabase/client");
                  const supabase = createClient();
                  const { error } = await supabase.auth.signInWithOAuth({
                    provider: "google",
                    options: {
                      redirectTo: `${window.location.origin}/`,
                    },
                  });
                  if (error) {
                    setErrorMessage("Google Sign-In: " + error.message);
                    setIsLoading(false);
                  }
                } catch {
                  setErrorMessage("Google OAuth provider requires configuration in Supabase Dashboard -> Authentication -> Providers -> Google.");
                  setIsLoading(false);
                }
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

            {/* Footer switcher */}
            <div className="mt-6 pt-5 border-t border-white/[0.06] text-center space-y-1.5">
              <p className="text-xs text-zinc-400">Don&apos;t have an account yet?</p>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("signup");
                  clearAlerts();
                }}
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors group"
              >
                <span>Create an Account</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        )}

        {/* ══════════════ TAB 2: CREATE ACCOUNT ══════════════ */}
        {activeTab === "signup" && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Full Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Alex Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                  required
                  className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 pl-10 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition-colors disabled:opacity-50"
                />
                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Email Address <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 pl-10 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition-colors disabled:opacity-50"
                />
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                  disabled={isLoading}
                  className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 pl-10 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition-colors disabled:opacity-50"
                />
                <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Branch / Dept
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. CSE / ECE"
                    value={signupBranch}
                    onChange={(e) => setSignupBranch(e.target.value)}
                    disabled={isLoading}
                    className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-3.5 py-3 pl-9 text-xs text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition-colors disabled:opacity-50"
                  />
                  <Building2 className="absolute left-3 top-3.5 h-3.5 w-3.5 text-zinc-500" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Year of Study
                </label>
                <div className="relative">
                  <select
                    value={signupYear}
                    onChange={(e) => setSignupYear(e.target.value)}
                    disabled={isLoading}
                    className="w-full rounded-xl bg-[#0d111c] border border-white/10 px-3 py-3 text-xs text-white focus:border-blue-500 focus:outline-none transition-colors disabled:opacity-50"
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 pl-10 pr-10 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition-colors disabled:opacity-50"
                />
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Confirm Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 pl-10 pr-10 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition-colors disabled:opacity-50"
                />
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-3.5 text-zinc-500 hover:text-zinc-300"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 py-3.5 px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {/* Footer switcher */}
            <div className="mt-6 pt-5 border-t border-white/[0.06] text-center space-y-1.5">
              <p className="text-xs text-zinc-400">Already have an account?</p>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("signin");
                  clearAlerts();
                }}
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors group"
              >
                <span>Sign In</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        )}

        {/* ══════════════ TAB 3: FORGOT PASSWORD ══════════════ */}
        {activeTab === "forgotPassword" && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-1.5">
              <h4 className="text-base font-bold text-white">Reset Password</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Enter your registered email address and we&apos;ll send you a recovery link.
              </p>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Registered Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 pl-10 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition-colors disabled:opacity-50"
                />
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 px-6 text-sm font-semibold text-white shadow-lg transition-all disabled:opacity-50"
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
                setActiveTab("signin");
                clearAlerts();
              }}
              className="w-full inline-flex items-center justify-center gap-1.5 text-xs text-zinc-400 hover:text-white pt-2 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Sign In</span>
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
