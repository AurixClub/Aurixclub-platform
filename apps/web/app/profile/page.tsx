"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/ui/ScrollReveal";
import {
  User,
  LogOut,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  FileText,
  Clock,
  Sparkles,
  Edit3,
  Save,
  Globe,
  ExternalLink,
  ChevronRight,
  MapPin,
  Tag,
  AlertCircle,
} from "lucide-react";
import type { SessionData, UserProfile, EventRegistration, Event, JoinApplication } from "@aurix/types";

export default function ProfilePage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [registrations, setRegistrations] = useState<{ registration: EventRegistration; event: Event }[]>([]);
  const [applications, setApplications] = useState<JoinApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const sessRes = await fetch("/api/auth/session");
        const sessData = await sessRes.json();

        if (sessData.success && sessData.data?.authenticated) {
          setSession(sessData.data);

          // Fetch profile, registrations, and applications
          const [profRes, regRes, appRes] = await Promise.all([
            fetch("/api/profile"),
            fetch("/api/events/my-registrations"),
            fetch("/api/applications/my"),
          ]);

          const profData = await profRes.json();
          const regData = await regRes.json();
          const appData = await appRes.json();

          if (profData.success && profData.data?.profile) {
            setProfile(profData.data.profile);
            setBio(profData.data.profile.bio || "");
            setPhone(profData.data.profile.phone || "");
            setBranch(profData.data.profile.branch || "");
            setYear(profData.data.profile.year || 1);
          }

          if (regData.success && regData.data?.registrations) {
            setRegistrations(regData.data.registrations);
          }

          if (appData.success && appData.data?.applications) {
            setApplications(appData.data.applications);
          }
        }
      } catch (e) {
        console.error("Profile load failed", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bio: bio || null,
          phone: phone || null,
          branch: branch || null,
          year: Number(year) || 1,
        }),
      });
      const data = await res.json();
      if (data.success && data.data?.profile) {
        setProfile(data.data.profile);
        setIsEditing(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      console.error("Failed to save profile", e);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07090e] text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-400 font-mono text-sm">
          <span className="h-5 w-5 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
          <span>Loading Member Profile...</span>
        </div>
      </div>
    );
  }

  if (!session || !session.user) {
    return (
      <div className="min-h-screen bg-[#07090e] text-white flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md p-8 rounded-3xl bg-[#0d111c]/90 border border-white/10 text-center shadow-2xl backdrop-blur-xl">
          <div className="inline-flex p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 mb-5">
            <User className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Sign In Required</h1>
          <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
            Please sign in to view your AURIX member profile and activity passes.
          </p>

          <div className="space-y-3">
            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold text-sm text-white hover:opacity-95 transition-opacity"
            >
              <span>Go to Sign In</span>
            </Link>
            <Link
              href="/"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col selection:bg-blue-500/30">
      <ScrollProgress />
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Profile Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-purple-900/30 border border-blue-500/20 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 ring-2 ring-white/20 flex items-center justify-center text-2xl font-black text-white shadow-xl">
              {session.user.full_name?.charAt(0) || "U"}
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono mb-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Role: {session.user.role.toUpperCase()}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {profile?.full_name || session.user.full_name}
              </h1>
              <p className="text-xs sm:text-sm font-mono text-zinc-400">
                {profile?.email || session.user.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {session.user.role === "super_admin" && (
              <Link
                href="/admin"
                className="px-4 py-2 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/40 text-xs font-bold text-violet-200 shadow-lg shadow-violet-600/20 transition-all flex items-center gap-1.5"
              >
                <ShieldCheck className="h-4 w-4 text-violet-400" />
                <span>Admin Portal</span>
              </Link>
            )}

            <Link
              href="/events"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 transition-all"
            >
              Browse Events
            </Link>

            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-red-500/15 hover:text-red-300 border border-white/10 text-xs font-medium text-zinc-300 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>Profile information updated successfully!</span>
          </div>
        )}

        {/* 3 Column Grid: Profile Information (1 col) + Applications & Passes (2 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="p-6 rounded-3xl bg-[#0d111c]/90 border border-white/10 space-y-6 self-start">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-400" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
                  Profile Details
                </h2>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
              </button>
            </div>

            {isEditing ? (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-zinc-400 font-mono block mb-1">Branch / Department</label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-mono block mb-1">Year of Study (1-5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-mono block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 font-mono block mb-1">Short Bio</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself and what you build..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-blue-500 leading-relaxed"
                  />
                </div>

                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            ) : (
              <dl className="space-y-3.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                  <dt className="text-zinc-400">Full Name</dt>
                  <dd className="font-semibold text-white">{profile?.full_name || session.user.full_name}</dd>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                  <dt className="text-zinc-400">Email</dt>
                  <dd className="font-mono text-zinc-300">{profile?.email || session.user.email}</dd>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                  <dt className="text-zinc-400">College</dt>
                  <dd className="text-white">{profile?.college || "Dr. Ambedkar Institute of Technology"}</dd>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                  <dt className="text-zinc-400">Branch</dt>
                  <dd className="text-white">{profile?.branch || "Not specified"}</dd>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                  <dt className="text-zinc-400">Year</dt>
                  <dd className="text-white">{profile?.year ? `Year ${profile.year}` : "Not set"}</dd>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                  <dt className="text-zinc-400">Phone</dt>
                  <dd className="font-mono text-zinc-300">{profile?.phone || "Not set"}</dd>
                </div>
                {profile?.bio && (
                  <div className="pt-2 text-zinc-300 leading-relaxed">
                    <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Bio</span>
                    {profile.bio}
                  </div>
                )}
              </dl>
            )}
          </div>

          {/* Activity Center: Applications & Event Passes (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* My Event Passes */}
            <div className="p-6 rounded-3xl bg-[#0d111c]/90 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-emerald-400" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
                    My Event Passes ({registrations.length})
                  </h2>
                </div>
                <Link href="/events" className="text-xs text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1">
                  <span>Browse Events</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {registrations.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {registrations.map(({ registration, event }) => (
                    <div
                      key={registration.id}
                      className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-3 hover:border-emerald-500/30 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-bold text-white leading-snug">{event.title}</h3>
                          <span
                            className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold flex-shrink-0 ${
                              registration.status === "attended"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            }`}
                          >
                            {registration.status}
                          </span>
                        </div>

                        <div className="text-xs text-zinc-400 space-y-1 font-mono">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-blue-400" />
                            <span>{new Date(event.starts_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-purple-400" />
                            <span>{event.mode.toUpperCase()} {event.venue ? `• ${event.venue}` : ""}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-[10px] font-mono text-zinc-500 pt-2 border-t border-white/[0.04]">
                        Pass ID: {registration.id}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 px-4 text-xs text-zinc-400 border border-dashed border-white/10 rounded-2xl space-y-2">
                  <p>You have not registered for any events or hackathons yet.</p>
                  <Link href="/events" className="inline-block text-blue-400 hover:text-blue-300 font-semibold underline">
                    Explore upcoming hackathons & workshops →
                  </Link>
                </div>
              )}
            </div>

            {/* My Club Applications */}
            <div className="p-6 rounded-3xl bg-[#0d111c]/90 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-purple-400" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
                    My Join Applications ({applications.length})
                  </h2>
                </div>
                <Link href="/join" className="text-xs text-purple-400 hover:text-purple-300 font-semibold inline-flex items-center gap-1">
                  <span>New Application</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {applications.length > 0 ? (
                <div className="space-y-3">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-3 hover:border-purple-500/30 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-bold text-white">
                            {app.department_interests?.join(", ") || "General Application"}
                          </div>
                          <div className="text-xs text-zinc-400 mt-0.5">
                            Submitted on {new Date(app.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-mono uppercase px-3 py-1 rounded-full font-bold ${
                            app.status === "approved"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : app.status === "rejected"
                              ? "bg-red-500/20 text-red-300 border border-red-500/30"
                              : app.status === "waitlisted"
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          }`}
                        >
                          Status: {app.status}
                        </span>
                      </div>

                      {app.why_join && (
                        <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.04]">
                          {app.why_join}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 px-4 text-xs text-zinc-400 border border-dashed border-white/10 rounded-2xl space-y-2">
                  <p>You have not submitted a join application yet.</p>
                  <Link href="/join" className="inline-block text-purple-400 hover:text-purple-300 font-semibold underline">
                    Apply to join AURIX departments & teams →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
