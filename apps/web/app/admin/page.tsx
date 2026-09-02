"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  LogOut,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Sparkles,
  Layers,
  Calendar,
  UserCheck,
  Mail,
  Plus,
  Trash2,
  ExternalLink,
  RefreshCw,
  Check,
  X,
  ChevronRight,
  Globe,
  UserPlus,
  UserMinus,
  Image as ImageIcon,
  Crown,
  Sparkle,
  Megaphone,
  Github,
  Code2,
} from "lucide-react";
import type {
  SessionData,
  UserProfile,
  Department,
  DepartmentMember,
  JoinApplication,
  Event,
  EventRegistration,
  EmailCampaign,
} from "@aurix/types";

type AdminTab =
  | "overview"
  | "applications"
  | "events"
  | "emails"
  | "projects"
  | "announcements";

export default function AdminPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Data states
  const [overview, setOverview] = useState<any>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [applications, setApplications] = useState<JoinApplication[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [emails, setEmails] = useState<EmailCampaign[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);

  // Announcement State
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", message: "", link_text: "", link_url: "", is_active: false });
  const [isCreatingAnnouncement, setIsCreatingAnnouncement] = useState(false);

  // Modals & UI helpers
  const [appReviewNotes, setAppReviewNotes] = useState("");
  const [selectedEventForRegs, setSelectedEventForRegs] = useState<Event | null>(null);
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>([]);
  const [appStatusFilter, setAppStatusFilter] = useState("all");

  // Event Creation Modal State
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDesc, setNewEventDesc] = useState("");
  const [newEventMode, setNewEventMode] = useState<"in_person" | "online" | "hybrid">("in_person");
  const [newEventStartsAt, setNewEventStartsAt] = useState("");
  const [newEventEndsAt, setNewEventEndsAt] = useState("");
  const [newEventVenue, setNewEventVenue] = useState("");
  const [newEventMeetingLink, setNewEventMeetingLink] = useState("");
  const [newEventMaxParticipants, setNewEventMaxParticipants] = useState("100");
  const [newEventCoverImage, setNewEventCoverImage] = useState("");
  const [newEventDeptId, setNewEventDeptId] = useState("");
  const [newEventTags, setNewEventTags] = useState("hackathon, workshop");
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  // Project Creation Modal State
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectCategory, setNewProjectCategory] = useState("Fullstack Web & Systems");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [newProjectCoverImage, setNewProjectCoverImage] = useState("");
  const [newProjectGithub, setNewProjectGithub] = useState("");
  const [newProjectDemo, setNewProjectDemo] = useState("");
  const [newProjectTags, setNewProjectTags] = useState("React, TypeScript, Next.js");
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  // File Upload Helper
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setter(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Initial Auth Check
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        if (data.success && data.data) {
          setSession(data.data);
        }
      } catch (e) {
        console.error("Session check failed", e);
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, []);

  // Fetch data when session confirmed or tab changes
  const loadData = async () => {
    if (!session || session.user.role !== "super_admin") return;
    setIsRefreshing(true);
    try {
      if (activeTab === "overview") {
        const res = await fetch("/api/admin/overview");
        const d = await res.json();
        if (d.success) setOverview(d.data);
      } else if (activeTab === "applications") {
        const url = appStatusFilter !== "all" ? `/api/applications?status=${appStatusFilter}` : "/api/applications";
        const res = await fetch(url);
        const d = await res.json();
        if (d.success) setApplications(d.data.applications);
      } else if (activeTab === "events") {
        const res = await fetch("/api/events");
        const d = await res.json();
        if (d.success) setEvents(d.data.events);
      } else if (activeTab === "emails") {
        const res = await fetch("/api/email/campaigns");
        const d = await res.json();
        if (d.success) setEmails(d.data.campaigns);
      } else if (activeTab === "projects") {
        const res = await fetch("/api/projects");
        const d = await res.json();
        if (d.success) setProjects(d.data.projects);
      } else if (activeTab === "announcements") {
        const res = await fetch("/api/announcements");
        if (res.ok) {
          const d = await res.json();
          setAnnouncements(Array.isArray(d) ? d : []);
        } else {
          setAnnouncements([]);
        }
      }
    } catch (e) {
      console.error("Failed to load admin data", e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (session?.user?.role === "super_admin") {
      loadData();
    }
  }, [session, activeTab, appStatusFilter]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (e) {
      console.error("Logout failed", e);
    }
  };


  // Actions: Applications
  const handleReviewApplication = async (appId: string, status: "approved" | "rejected" | "waitlisted") => {
    const res = await fetch(`/api/applications/${appId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, admin_notes: appReviewNotes || null }),
    });
    if (res.ok) {
      setAppReviewNotes("");
      loadData();
    }
  };

  const handleDeleteApplication = async (appId: string) => {
    if (!confirm("Delete this application permanently?")) return;
    const res = await fetch(`/api/applications/${appId}`, { method: "DELETE" });
    if (res.ok) loadData();
  };

  // Actions: Events
  const handleToggleEventStatus = async (eventId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "published" ? "draft" : "published";
    const res = await fetch(`/api/events/${eventId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    if (res.ok) loadData();
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Delete this event? All registrations will also be removed.")) return;
    const res = await fetch(`/api/events/${eventId}`, { method: "DELETE" });
    if (res.ok) loadData();
  };

  const handleOpenEventRegistrations = async (ev: Event) => {
    setSelectedEventForRegs(ev);
    try {
      const res = await fetch(`/api/events/${ev.id}/registrations`);
      const d = await res.json();
      if (d.success) setEventRegistrations(d.data.registrations);
    } catch {
      setEventRegistrations([]);
    }
  };

  const handleUpdateAttendeeStatus = async (eventId: string, regId: string, status: "attended" | "cancelled") => {
    const res = await fetch(`/api/events/${eventId}/registrations/${regId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok && selectedEventForRegs) {
      handleOpenEventRegistrations(selectedEventForRegs);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) {
      alert("Please enter an event title.");
      return;
    }

    setIsCreatingEvent(true);
    try {
      const starts_at = newEventStartsAt ? new Date(newEventStartsAt).toISOString() : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      const ends_at = newEventEndsAt ? new Date(newEventEndsAt).toISOString() : new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString();

      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newEventTitle.trim(),
          description: newEventDesc.trim() || "A premier technical workshop and hackathon organized by AURIX.",
          mode: newEventMode,
          venue: newEventVenue.trim() || null,
          meeting_link: newEventMeetingLink.trim() || null,
          starts_at,
          ends_at,
          max_participants: parseInt(newEventMaxParticipants) || 100,
          cover_image_url: newEventCoverImage.trim() || null,
          department_id: newEventDeptId || null,
          tags: newEventTags.split(",").map((t) => t.trim()).filter(Boolean),
          // The admin action is explicitly labelled Create & Publish.
          status: "published",
        }),
      });

      if (res.ok) {
        setShowCreateEventModal(false);
        setNewEventTitle("");
        setNewEventDesc("");
        setNewEventVenue("");
        setNewEventMeetingLink("");
        setNewEventCoverImage("");
        loadData();
      } else {
        const d = await res.json();
        alert(d.error?.message || "Failed to create event");
      }
    } catch (err) {
      console.error("Create event error", err);
    } finally {
      setIsCreatingEvent(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim() || !newProjectCategory.trim() || !newProjectDesc.trim()) {
      alert("Please fill in Title, Category, and Description.");
      return;
    }
    setIsCreatingProject(true);
    try {
      const tagsArray = newProjectTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newProjectTitle.trim(),
          category: newProjectCategory.trim(),
          description: newProjectDesc.trim(),
          icon: newProjectCoverImage.trim() || null,
          github_url: newProjectGithub.trim() || null,
          demo_url: newProjectDemo.trim() || null,
          tags: tagsArray,
        }),
      });

      if (res.ok) {
        setShowCreateProjectModal(false);
        setNewProjectTitle("");
        setNewProjectCategory("Fullstack Web & Systems");
        setNewProjectDesc("");
        setNewProjectCoverImage("");
        setNewProjectGithub("");
        setNewProjectDemo("");
        setNewProjectTags("React, TypeScript, Next.js");
        loadData();
      } else {
        const d = await res.json().catch(() => ({}));
        alert(d.error?.message || "Failed to create project");
      }
    } catch (err) {
      console.error("Create project error", err);
      alert("Failed to create project");
    } finally {
      setIsCreatingProject(false);
    }
  };


  if (isLoading) {
    return (
      <div className="admin-shell min-h-screen bg-[#07090e] text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500 font-mono text-sm">
          <span className="h-5 w-5 rounded-full border-2 border-rose-200 border-t-violet-500 animate-spin" />
          <span>Authenticating Super Admin Portal...</span>
        </div>
      </div>
    );
  }

  if (!session || !session.user || session.user.role !== "super_admin") {
    return (
      <div className="admin-shell min-h-screen bg-[#07090e] text-white flex flex-col items-center justify-center px-4 relative">
        <div className="w-full max-w-md p-8 rounded-3xl bg-[#111521]/95 border border-red-500/20 text-center shadow-2xl backdrop-blur-xl">
          <div className="inline-flex p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 mb-5">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Restricted Access</h1>
          <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
            This module requires <span className="text-red-300 font-semibold">Super Admin</span> authorization.
          </p>

          <div className="space-y-3">
            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 font-semibold text-sm text-white hover:opacity-95 transition-opacity"
            >
              <Lock className="h-4 w-4" />
              <span>Sign in as Super Admin</span>
            </Link>
            <Link
              href="/"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs text-zinc-400 hover:text-white border border-white/10 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Return to Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell min-h-screen bg-[#07090e] text-white flex flex-col selection:bg-violet-500/30">
      <header className="border-b border-white/[0.06] bg-[#07090e]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="font-black text-xl tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                AURIX
              </span>
            </Link>

            <span className="text-xs px-2.5 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 font-mono flex items-center gap-1.5 font-semibold">
              <ShieldCheck className="h-3.5 w-3.5 text-violet-400" />
              Super Admin Portal
            </span>

            {/* Quick Live Website Link */}
            <Link
              href="/"
              target="_blank"
              className="hidden md:inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors"
            >
              <Globe className="h-3.5 w-3.5 text-blue-400" />
              <span>View Live Website</span>
              <ExternalLink className="h-3 w-3 text-gray-400" />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={isRefreshing}
              title="Refresh Data"
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin text-violet-400" : ""}`} />
            </button>

            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-white">{session.user.full_name}</div>
              <div className="text-[10px] font-mono text-violet-400">{session.user.email}</div>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-white/[0.04] hover:bg-red-500/15 hover:text-red-300 border border-white/10 text-xs font-medium text-zinc-400 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="border-t border-white/[0.06] bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
            {[
              { id: "overview", label: "Overview", icon: Sparkles },
              { id: "applications", label: "Applications", icon: UserCheck },
              { id: "events", label: "Events", icon: Calendar },
              { id: "emails", label: "Emails", icon: Mail },
              { id: "projects", label: "Projects", icon: Layers },
              { id: "announcements", label: "Announcements", icon: Megaphone },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as AdminTab);
                  }}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20 font-bold"
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* ─── TAB: OVERVIEW ────────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Metrics Counters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Announcements", value: announcements.length, sub: "Published updates", icon: Megaphone, color: "text-blue-400", tab: "announcements" },
                { label: "Pending Apps", value: overview?.counts?.pending_applications ?? "-", sub: `${overview?.counts?.total_applications ?? 0} total apps`, icon: UserCheck, color: "text-amber-400", tab: "applications" },
                { label: "Events", value: overview?.counts?.events ?? "-", sub: `${overview?.counts?.published_events ?? 0} published`, icon: Calendar, color: "text-emerald-400", tab: "events" },
                { label: "Emails", value: overview?.counts?.email_campaigns ?? "-", sub: "Campaigns sent", icon: Mail, color: "text-pink-400", tab: "emails" },
              ].map((m, idx) => {
                const Icon = m.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(m.tab as AdminTab)}
                    className="p-4 rounded-2xl bg-[#12162180] border border-white/[0.06] hover:border-violet-500/40 text-left transition-all hover:scale-[1.02] group backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-gray-500">
                        {m.label}
                      </span>
                      <Icon className={`h-4 w-4 ${m.color} group-hover:scale-110 transition-transform`} />
                    </div>
                    <div className="text-2xl font-black text-gray-900">{m.value}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{m.sub}</div>
                  </button>
                );
              })}
            </div>

            {/* Two Column Layout: Recent Applications & Upcoming Events */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Applications Queue */}
              <div className="p-6 rounded-2xl bg-[#12162180] border border-white/[0.06] space-y-4 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-amber-400" />
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600">
                      Recent Join Applications
                    </h2>
                  </div>
                  <button
                    onClick={() => setActiveTab("applications")}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-500 inline-flex items-center gap-1"
                  >
                    <span>View All</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {overview?.recent_applications?.length > 0 ? (
                    overview.recent_applications.map((app: any) => (
                      <div
                        key={app.id}
                        className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-gray-900 truncate">{app.full_name}</div>
                          <div className="text-[11px] text-gray-500 font-mono truncate">{app.email}</div>
                          <div className="text-[10px] text-gray-500 mt-0.5">
                            {app.branch} • Year {app.year}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span
                            className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold ${
                              app.status === "approved"
                                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                                : app.status === "rejected"
                                ? "bg-red-500/15 text-red-300 border border-red-500/30"
                                : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                            }`}
                          >
                            {app.status}
                          </span>
                          {app.status === "pending" && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleReviewApplication(app.id, "approved")}
                                title="Approve"
                                className="p-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleReviewApplication(app.id, "rejected")}
                                title="Reject"
                                className="p-1 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-500 text-center py-6">No applications submitted yet.</div>
                  )}
                </div>
              </div>

              {/* Upcoming Events / Hackathons */}
              <div className="p-6 rounded-2xl bg-[#12162180] border border-white/[0.06] space-y-4 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-emerald-400" />
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600">
                      Published Events
                    </h2>
                  </div>
                  <button
                    onClick={() => setActiveTab("events")}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-500 inline-flex items-center gap-1"
                  >
                    <span>Manage Events</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {overview?.upcoming_events?.length > 0 ? (
                    overview.upcoming_events.map((ev: any) => (
                      <div
                        key={ev.id}
                        className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-gray-900 truncate">{ev.title}</div>
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            Mode: <span className="font-mono text-gray-600">{ev.mode}</span> • Max: {ev.max_participants ?? "Unlimited"}
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <div className="text-xs font-bold text-emerald-400">
                            {ev.registration_count} registered
                          </div>
                          <button
                            onClick={() => handleOpenEventRegistrations(ev)}
                            className="text-[10px] text-gray-500 hover:text-gray-900 underline mt-0.5"
                          >
                            View list
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-500 text-center py-6">No events scheduled.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB: APPLICATIONS ────────────────────────────────────────── */}
        {activeTab === "applications" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gradient-primary">Join Applications</h2>
                <p className="text-xs text-gray-500">Review student club applications and send approvals.</p>
              </div>

              <div className="flex items-center gap-2">
                {["all", "pending", "approved", "rejected", "waitlisted"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setAppStatusFilter(status)}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-semibold uppercase transition-all ${
                      appStatusFilter === status
                        ? "bg-rose-500 text-white"
                        : "bg-white/[0.06] text-zinc-400 hover:text-white hover:bg-white/[0.1]"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-4 hover:border-violet-500/30 transition-all backdrop-blur-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-gray-900">{app.full_name}</h3>
                      <p className="text-xs font-mono text-gray-500">{app.email} • {app.phone}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {app.college} • {app.branch} (Year {app.year})
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-full font-bold ${
                        app.status === "approved"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : app.status === "rejected"
                          ? "bg-red-500/20 text-red-300 border border-red-500/30"
                          : app.status === "waitlisted"
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  {app.department_interests?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {app.department_interests.map((dept, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-gray-50 text-[10px] font-mono text-gray-600 border border-white/[0.08]"
                        >
                          {dept}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-slate-300 leading-relaxed">
                    <span className="text-[10px] font-mono uppercase text-gray-500 block mb-1">Statement:</span>
                    {app.why_join}
                  </div>

                  {app.skills && (
                    <div className="text-xs text-gray-500">
                      <span className="font-semibold text-gray-600">Skills:</span> {app.skills}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReviewApplication(app.id, "approved")}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 text-xs font-semibold transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReviewApplication(app.id, "rejected")}
                        className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-300 text-xs font-semibold transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleReviewApplication(app.id, "waitlisted")}
                        className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 text-xs font-semibold transition-colors"
                      >
                        Waitlist
                      </button>
                    </div>

                    <button
                      onClick={() => handleDeleteApplication(app.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete application"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB: EVENTS ──────────────────────────────────────────────── */}
        {activeTab === "events" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gradient-primary">Events & Hackathons</h2>
                <p className="text-xs text-gray-500">Create, schedule, publish events and track attendee registrations.</p>
              </div>

              <button
                onClick={() => setShowCreateEventModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-lg shadow-rose-500/20 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Create Event</span>
              </button>
            </div>

            {/* Create Event Modal */}
            {showCreateEventModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="w-full max-w-2xl rounded-3xl bg-[#0d111c]/98 border border-violet-500/20 p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto backdrop-blur-xl">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-rose-600" />
                      <h3 className="text-xl font-bold text-gray-900">Create New Event / Hackathon</h3>
                    </div>
                    <button
                      onClick={() => setShowCreateEventModal(false)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-white/10"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
                    <div>
                      <label className="text-gray-500 font-mono block mb-1">Event Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. AURIX Flagship Hackathon 2026"
                        value={newEventTitle}
                        onChange={(e) => setNewEventTitle(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-gray-500 font-mono block mb-1">Event Mode</label>
                        <select
                          value={newEventMode}
                          onChange={(e) => setNewEventMode(e.target.value as any)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-violet-500"
                        >
                          <option value="in_person">In-Person (Campus)</option>
                          <option value="online">Online / Virtual</option>
                          <option value="hybrid">Hybrid</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-gray-500 font-mono block mb-1">Hosting Department</label>
                        <select
                          value={newEventDeptId}
                          onChange={(e) => setNewEventDeptId(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-violet-500"
                        >
                          <option value="">All / Club-Wide</option>
                          {departments.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-gray-500 font-mono block mb-1">Start Date & Time</label>
                        <input
                          type="datetime-local"
                          value={newEventStartsAt}
                          onChange={(e) => setNewEventStartsAt(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-violet-500"
                        />
                      </div>

                      <div>
                        <label className="text-gray-500 font-mono block mb-1">End Date & Time</label>
                        <input
                          type="datetime-local"
                          value={newEventEndsAt}
                          onChange={(e) => setNewEventEndsAt(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-violet-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-gray-500 font-mono block mb-1">Venue / Location</label>
                        <input
                          type="text"
                          placeholder="e.g. Main Auditorium / CSE Seminar Hall"
                          value={newEventVenue}
                          onChange={(e) => setNewEventVenue(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500"
                        />
                      </div>

                      <div>
                        <label className="text-gray-500 font-mono block mb-1">Max Capacity / Seats</label>
                        <input
                          type="number"
                          placeholder="100"
                          value={newEventMaxParticipants}
                          onChange={(e) => setNewEventMaxParticipants(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 font-mono"
                        />
                      </div>
                    </div>

                    {/* Cover Photo Upload with Live Preview */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-gray-500 font-mono">Event Cover Poster / Banner</label>
                        <label className="cursor-pointer text-[11px] text-rose-600 hover:text-rose-500 font-mono underline flex items-center gap-1">
                          <ImageIcon className="h-3 w-3" />
                          <span>Upload File from Device</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, setNewEventCoverImage)}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Upload image or paste poster URL..."
                          value={newEventCoverImage}
                          onChange={(e) => setNewEventCoverImage(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 font-mono text-[11px]"
                        />

                        {newEventCoverImage && (
                          <div className="relative w-full h-36 rounded-xl overflow-hidden border border-violet-500/40 bg-black/40">
                            <img src={newEventCoverImage} alt="cover preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setNewEventCoverImage("")}
                              className="absolute top-2 right-2 p-1 rounded-md bg-black/70 text-gray-600 hover:text-gray-900 text-[10px]"
                            >
                              Remove Photo
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-500 font-mono block mb-1">Event Description & Agenda *</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Detail the event format, prerequisites, schedule, and benefits..."
                        value={newEventDesc}
                        onChange={(e) => setNewEventDesc(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-violet-500 text-xs"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setShowCreateEventModal(false)}
                        className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-zinc-400 hover:text-white border border-white/10 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isCreatingEvent || !newEventTitle.trim()}
                        className="px-6 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 disabled:opacity-40 text-white font-bold shadow-lg shadow-violet-500/20 transition-all"
                      >
                        {isCreatingEvent ? "Publishing..." : "Create & Publish Event"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-4 hover:border-violet-500/30 transition-all flex flex-col justify-between backdrop-blur-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-bold text-gray-900">{ev.title}</h3>
                      <button
                        onClick={() => handleToggleEventStatus(ev.id, ev.status)}
                        className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold transition-all ${
                          ev.status === "published"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30"
                        }`}
                      >
                        {ev.status}
                      </button>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                      {ev.description}
                    </p>

                    <div className="text-xs text-gray-500 space-y-1 font-mono">
                      <div>Mode: <span className="text-gray-900">{ev.mode}</span></div>
                      <div>Registered: <span className="text-emerald-400 font-bold">{ev.registration_count}</span> / {ev.max_participants ?? "∞"}</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                    <button
                      onClick={() => handleOpenEventRegistrations(ev)}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold text-zinc-400 hover:text-white border border-white/10 transition-colors"
                    >
                      Attendees ({ev.registration_count})
                    </button>

                    <button
                      onClick={() => handleDeleteEvent(ev.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete Event"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB: EMAILS ──────────────────────────────────────────────── */}
        {activeTab === "emails" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gradient-primary">Email Campaigns & Broadcasts</h2>
                <p className="text-xs text-gray-500">Broadcast updates to all members or specific event attendees.</p>
              </div>

              <button
                onClick={async () => {
                  const subject = prompt("Email Subject:");
                  if (!subject) return;
                  const body = prompt("Email Message Body (minimum 10 characters):");
                  if (!body) return;
                  const res = await fetch("/api/email/send", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      subject,
                      body,
                      audience: "all",
                    }),
                  });
                  if (res.ok) {
                    alert("Email campaign dispatched successfully!");
                    loadData();
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-lg shadow-rose-500/20 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Send Broadcast</span>
              </button>
            </div>

            <div className="space-y-4">
              {emails.map((camp) => (
                <div
                  key={camp.id}
                  className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-gray-900">{camp.subject}</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase">
                      {camp.status} ({camp.recipient_count} recipients)
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-white/[0.03] p-3 rounded-xl border border-white/[0.06]">
                    {camp.body}
                  </p>

                  <div className="text-[11px] font-mono text-gray-400 flex items-center justify-between pt-1">
                    <span>Audience: {camp.audience}</span>
                    <span>Sent: {new Date(camp.created_at).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB: PROJECTS ────────────────────────────────────────────── */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gradient-primary">Projects Management</h2>
                <p className="text-xs text-gray-500">Manage platform showcase projects dynamically with cover banners and links.</p>
              </div>

              <button
                type="button"
                onClick={() => setShowCreateProjectModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-lg shadow-rose-500/20 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Add Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.length > 0 ? (
                projects.map((project: any) => (
                  <div
                    key={project.id}
                    className="group rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex flex-col justify-between hover:border-violet-500/40 hover:bg-white/[0.05] transition-all backdrop-blur-sm shadow-md"
                  >
                    <div>
                      {/* Box-Type Image Banner (Same as Events Card) */}
                      <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-zinc-800 border border-white/10">
                        {project.icon ? (
                          <img
                            src={project.icon}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-violet-950/40 via-indigo-950/30 to-purple-950/40 flex flex-col items-center justify-center gap-1.5 p-3 text-center">
                            <Code2 className="h-7 w-7 text-rose-400" />
                            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-rose-300">
                              AURIX Project
                            </span>
                          </div>
                        )}

                        {/* Category Badge Overlay */}
                        <div className="absolute top-2 left-2">
                          <span className="text-[9.5px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold bg-black/70 text-white backdrop-blur-md border border-white/20 shadow-xs">
                            {project.category}
                          </span>
                        </div>

                        {/* Delete Button */}
                        <div className="absolute top-2 right-2">
                          <button
                            onClick={async () => {
                              if (!confirm(`Delete project "${project.title}"?`)) return;
                              const res = await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
                              if (res.ok) loadData();
                            }}
                            className="p-1.5 rounded-lg bg-black/70 text-red-400 hover:text-white hover:bg-red-600 transition-colors shadow-xs"
                            title="Delete project"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-1 mb-1">
                        {project.title}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                        {project.description}
                      </p>

                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {project.tags.map((t: string) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 rounded-md bg-white/[0.04] text-[10px] font-mono text-zinc-300 border border-white/[0.08]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
                          >
                            <Github className="h-3.5 w-3.5" />
                            <span>Code</span>
                          </a>
                        )}
                        {project.demo_url && (
                          <a
                            href={project.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span>Live Demo</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-sm text-zinc-400 bg-white/[0.02] rounded-2xl border border-white/10">
                  No projects added yet. Click "Add Project" to add your first showcase innovation!
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── MODAL: CREATE PROJECT ─────────────────────────────────────── */}
        {showCreateProjectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-xl rounded-3xl bg-[#111521] border border-white/10 p-6 sm:p-7 space-y-5 shadow-2xl my-8">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-md">
                    <Code2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Add New Project</h3>
                    <p className="text-xs text-zinc-400">Fill in the form to showcase a new club innovation</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreateProjectModal(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-zinc-400 font-mono block mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Autonomous Ground Vehicle Simulator"
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-rose-500 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-400 font-mono block mb-1">Category *</label>
                    <select
                      value={newProjectCategory}
                      onChange={(e) => setNewProjectCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1f2e] border border-white/10 text-white focus:outline-none focus:border-rose-500"
                    >
                      <option value="Fullstack Web & Systems">Fullstack Web & Systems</option>
                      <option value="AI & Machine Learning">AI & Machine Learning</option>
                      <option value="Robotics & Embedded">Robotics & Embedded</option>
                      <option value="DevOps & Infrastructure">DevOps & Infrastructure</option>
                      <option value="Open Source & Tools">Open Source & Tools</option>
                      <option value="Startup & Venture">Startup & Venture</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-zinc-400 font-mono block mb-1">Tags (Comma-separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. React, ROS2, Python, PyTorch"
                      value={newProjectTags}
                      onChange={(e) => setNewProjectTags(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-rose-500 font-mono text-[11px]"
                    />
                  </div>
                </div>

                {/* Banner / Poster Upload or URL */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-zinc-400 font-mono">Cover Image / Banner URL</label>
                    <label className="cursor-pointer text-[10px] text-rose-400 hover:text-rose-300 font-mono flex items-center gap-1">
                      <ImageIcon className="h-3 w-3" />
                      <span>Upload File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, setNewProjectCoverImage)}
                      />
                    </label>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Paste image URL or use file upload..."
                      value={newProjectCoverImage}
                      onChange={(e) => setNewProjectCoverImage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-rose-500 font-mono text-[11px]"
                    />

                    {newProjectCoverImage && (
                      <div className="relative w-full h-32 rounded-xl overflow-hidden border border-rose-500/40 bg-black/40">
                        <img src={newProjectCoverImage} alt="cover preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setNewProjectCoverImage("")}
                          className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/80 text-zinc-300 hover:text-white text-[10px]"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-zinc-400 font-mono block mb-1">Description *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="What does this project do, what technologies were used, and what impact does it have?..."
                    value={newProjectDesc}
                    onChange={(e) => setNewProjectDesc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-rose-500 text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-400 font-mono block mb-1">GitHub URL</label>
                    <input
                      type="url"
                      placeholder="https://github.com/aurixclub/..."
                      value={newProjectGithub}
                      onChange={(e) => setNewProjectGithub(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-rose-500 font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-400 font-mono block mb-1">Live Demo URL</label>
                    <input
                      type="url"
                      placeholder="https://demo.aurix.club/..."
                      value={newProjectDemo}
                      onChange={(e) => setNewProjectDemo(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-rose-500 font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowCreateProjectModal(false)}
                    className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-zinc-400 hover:text-white border border-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingProject || !newProjectTitle.trim() || !newProjectDesc.trim()}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:opacity-90 disabled:opacity-40 text-white font-bold shadow-lg shadow-rose-500/20 transition-all flex items-center gap-1.5"
                  >
                    {isCreatingProject && <span className="h-3 w-3 rounded-full border border-white border-t-transparent animate-spin" />}
                    <span>{isCreatingProject ? "Creating..." : "Create Project"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── TAB: ANNOUNCEMENTS ────────────────────────────────────────── */}
        {activeTab === "announcements" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gradient-primary">Global Announcements</h2>
                <p className="text-xs text-gray-500">Manage the front-page popup announcement.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/[0.06] space-y-4 backdrop-blur-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Create Announcement</h3>
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setIsCreatingAnnouncement(true);
                    try {
                      const res = await fetch("/api/announcements", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(newAnnouncement),
                      });
                      if (res.ok) {
                        setNewAnnouncement({ title: "", message: "", link_text: "", link_url: "", is_active: false });
                        loadData();
                      }
                    } finally {
                      setIsCreatingAnnouncement(false);
                    }
                  }}
                  className="space-y-4 text-xs"
                >
                  <div>
                    <label className="text-gray-500 font-mono block mb-1">Title *</label>
                    <input
                      type="text"
                      required
                      value={newAnnouncement.title}
                      onChange={e => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-violet-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 font-mono block mb-1">Message *</label>
                    <textarea
                      required
                      rows={3}
                      value={newAnnouncement.message}
                      onChange={e => setNewAnnouncement({...newAnnouncement, message: e.target.value})}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-violet-500 outline-none resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-500 font-mono block mb-1">Link URL</label>
                      <input
                        type="url"
                        value={newAnnouncement.link_url}
                        onChange={e => setNewAnnouncement({...newAnnouncement, link_url: e.target.value})}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-violet-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-gray-500 font-mono block mb-1">Link Text</label>
                      <input
                        type="text"
                        value={newAnnouncement.link_text}
                        onChange={e => setNewAnnouncement({...newAnnouncement, link_text: e.target.value})}
                        placeholder="e.g. Learn More"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:border-violet-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <input 
                      type="checkbox" 
                      id="is_active" 
                      checked={newAnnouncement.is_active}
                      onChange={e => setNewAnnouncement({...newAnnouncement, is_active: e.target.checked})}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-violet-500" 
                    />
                    <label htmlFor="is_active" className="text-gray-600 font-semibold cursor-pointer">Set as Active Immediately</label>
                  </div>
                  <button
                    type="submit"
                    disabled={isCreatingAnnouncement}
                    className="w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold transition-all disabled:opacity-50 mt-4"
                  >
                    {isCreatingAnnouncement ? "Creating..." : "Create Announcement"}
                  </button>
                </form>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900">Previous Announcements</h3>
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {announcements.map(ann => (
                    <div key={ann.id} className={`p-4 rounded-2xl border transition-all ${ann.is_active ? 'bg-violet-900/20 border-violet-500/50' : 'bg-white/[0.03] border-white/[0.06]'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-bold text-gray-900">{ann.title}</h4>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={async () => {
                              await fetch(`/api/announcements/${ann.id}`, {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ is_active: !ann.is_active })
                              });
                              loadData();
                            }}
                            className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${ann.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-gray-500'}`}
                          >
                            {ann.is_active ? 'Active' : 'Inactive'}
                          </button>
                          <button 
                            onClick={async () => {
                              if(confirm("Delete this announcement?")) {
                                await fetch(`/api/announcements/${ann.id}`, { method: "DELETE" });
                                loadData();
                              }
                            }}
                            className="text-gray-400 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{ann.message}</p>
                      {ann.link_url && (
                        <a href={ann.link_url} target="_blank" rel="noreferrer" className="text-xs text-rose-600 hover:underline">
                          {ann.link_text || "Link"} &rarr;
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Attendees Modal */}
      {selectedEventForRegs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-3xl bg-[#0d111c]/98 border border-white/[0.08] p-6 space-y-6 max-h-[85vh] flex flex-col backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedEventForRegs.title}</h3>
                <p className="text-xs text-gray-500">Registered Attendees List ({eventRegistrations.length})</p>
              </div>
              <button
                onClick={() => setSelectedEventForRegs(null)}
                className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-3">
              {eventRegistrations.length > 0 ? (
                eventRegistrations.map((reg: any) => (
                  <div
                    key={reg.id}
                    className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-gray-900">{reg.full_name}</div>
                      <div className="text-[11px] font-mono text-gray-500">{reg.email} • {reg.branch} (Yr {reg.year})</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold ${
                          reg.status === "attended"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : reg.status === "cancelled"
                            ? "bg-red-500/20 text-red-300"
                            : "bg-blue-500/20 text-blue-300"
                        }`}
                      >
                        {reg.status}
                      </span>

                      {reg.status !== "attended" && (
                        <button
                          onClick={() => handleUpdateAttendeeStatus(selectedEventForRegs.id, reg.id, "attended")}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 text-xs font-semibold"
                        >
                          Mark Attended
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-gray-400 text-center py-8">No members registered yet.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
