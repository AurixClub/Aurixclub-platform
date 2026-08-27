"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  User,
  GraduationCap,
  Building2,
  Phone,
  Mail,
  Layers,
  FileText,
  Clock,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Briefcase,
  Link2,
} from "lucide-react";

export interface JoinFormData {
  fullName: string;
  email: string;
  phone: string;
  yearOfStudy: string;
  department: string;
  primaryDepartment: string;
  secondaryDepartment: string;
  aboutYou: string;
  skills: string;
  motivation: string;
  previousExperience: string;
  portfolioLinks: string;
  contributionTypes: string[];
  weeklyAvailability: string;
  agreedToTerms: boolean;
}

const initialFormData: JoinFormData = {
  fullName: "",
  email: "",
  phone: "",
  yearOfStudy: "",
  department: "",
  primaryDepartment: "",
  secondaryDepartment: "",
  aboutYou: "",
  skills: "",
  motivation: "",
  previousExperience: "",
  portfolioLinks: "",
  contributionTypes: [],
  weeklyAvailability: "",
  agreedToTerms: false,
};

const departments = [
  "Technical Department",
  "Industry & Sponsor Relationship Department",
  "Research & Innovation Department",
  "Event Management Department",
  "Social Media & Designing Department",
  "Entrepreneurship & Startup Department",
];

const yearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Other"];

const contributionOptions = [
  "Build technical projects",
  "Organize events and workshops",
  "Research and innovation",
  "Connect with industry and sponsors",
  "Marketing and social media",
  "Entrepreneurship and startup initiatives",
  "Community building",
];

const availabilityOptions = ["1–3 hours", "3–5 hours", "5+ hours"];

export function JoinForm() {
  const [formData, setFormData] = useState<JoinFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleCheckboxToggle = (option: string) => {
    setFormData((prev) => {
      const exists = prev.contributionTypes.includes(option);
      const updated = exists
        ? prev.contributionTypes.filter((item) => item !== option)
        : [...prev.contributionTypes, option];
      return { ...prev, contributionTypes: updated };
    });
    if (errors.contributionTypes) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.contributionTypes;
        return next;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "College email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.yearOfStudy) newErrors.yearOfStudy = "Please select your year of study";
    if (!formData.department.trim()) newErrors.department = "Branch / Department is required";
    if (!formData.primaryDepartment) newErrors.primaryDepartment = "Please select a primary department";
    if (!formData.aboutYou.trim()) newErrors.aboutYou = "Please tell us briefly about yourself";
    if (!formData.skills.trim()) newErrors.skills = "Please list your skills or interests";
    if (!formData.motivation.trim()) newErrors.motivation = "Please tell us why you want to join AURIX";
    if (formData.contributionTypes.length === 0) {
      newErrors.contributionTypes = "Select at least one way you would like to contribute";
    }
    if (!formData.weeklyAvailability) newErrors.weeklyAvailability = "Please select your weekly availability";
    if (!formData.agreedToTerms) newErrors.agreedToTerms = "You must accept the declaration to submit";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      window.scrollTo({ top: 300, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    try {
      const whyJoinText = `${formData.aboutYou}\n\nMotivation: ${formData.motivation}\nExperience: ${formData.previousExperience || "N/A"}\nAvailability: ${formData.weeklyAvailability}`;
      const deptInterests = [formData.primaryDepartment].filter(Boolean);

      const payload = {
        full_name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        college: "Dr. Ambedkar Institute of Technology",
        branch: formData.department.trim(),
        year: parseInt(formData.yearOfStudy) || 1,
        department_interests: deptInterests.length > 0 ? deptInterests : ["Technical Department"],
        why_join: whyJoinText.length >= 50 ? whyJoinText : `${whyJoinText} - I am dedicated and excited to contribute actively to AURIX projects and club activities.`,
        skills: formData.skills.trim() || null,
        portfolio_url: formData.portfolioLinks.trim() ? (formData.portfolioLinks.startsWith("http") ? formData.portfolioLinks : `https://${formData.portfolioLinks}`) : null,
      };

      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsSubmitted(true);
        window.scrollTo({ top: 150, behavior: "smooth" });
      } else if (res.status === 401) {
        setServerError("Please sign in or create an account first to submit your application.");
        window.scrollTo({ top: 250, behavior: "smooth" });
      } else {
        setServerError(data.error?.message || "Failed to submit application. Please check your inputs.");
        window.scrollTo({ top: 250, behavior: "smooth" });
      }
    } catch (err) {
      setServerError("A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto my-12 rounded-3xl glass-panel p-8 sm:p-14 text-center space-y-6 border border-emerald-500/30"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-white">
            Application Submitted Successfully
          </h2>
          <p className="text-base text-zinc-300 max-w-md mx-auto leading-relaxed">
            Thank you for your interest in AURIX. Our team will review your application and get back to you soon.
          </p>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 text-sm font-semibold text-white transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/events"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all"
          >
            <span>Explore Events</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
      {serverError && (
        <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-sm font-semibold flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
          <div className="flex-1">
            <span>{serverError}</span>
            {serverError.includes("sign in") && (
              <Link href="/login" className="ml-2 underline text-white hover:text-blue-300 font-bold">
                Sign In now →
              </Link>
            )}
          </div>
        </div>
      )}

      {/* 2. Personal Information */}
      <div className="rounded-3xl glass-panel p-6 sm:p-10 space-y-6 border border-white/[0.08]">
        <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">2. Personal Information</h3>
            <p className="text-xs text-zinc-400">Tell us how to reach and identify you</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="sm:col-span-2 space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`w-full rounded-xl bg-white/[0.04] border ${
                errors.fullName ? "border-red-500/60" : "border-white/10"
              } px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition-colors`}
            />
            {errors.fullName && <p className="text-xs text-red-400">{errors.fullName}</p>}
          </div>

          {/* College Email */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
              College Email <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="you@university.edu"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full rounded-xl bg-white/[0.04] border ${
                  errors.email ? "border-red-500/60" : "border-white/10"
                } px-4 py-3 pl-10 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition-colors`}
              />
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
            </div>
            {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Phone Number <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                placeholder="Enter your contact number"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full rounded-xl bg-white/[0.04] border ${
                  errors.phone ? "border-red-500/60" : "border-white/10"
                } px-4 py-3 pl-10 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition-colors`}
              />
              <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
            </div>
            {errors.phone && <p className="text-xs text-red-400">{errors.phone}</p>}
          </div>

          {/* Year of Study */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Year of Study <span className="text-red-400">*</span>
            </label>
            <select
              name="yearOfStudy"
              value={formData.yearOfStudy}
              onChange={handleInputChange}
              className={`w-full rounded-xl bg-[#0d111c] border ${
                errors.yearOfStudy ? "border-red-500/60" : "border-white/10"
              } px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors`}
            >
              <option value="">Select your year</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {errors.yearOfStudy && <p className="text-xs text-red-400">{errors.yearOfStudy}</p>}
          </div>

          {/* Branch / Department */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Branch / Department <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="department"
              placeholder="e.g. Computer Science, Robotics, ECE"
              value={formData.department}
              onChange={handleInputChange}
              className={`w-full rounded-xl bg-white/[0.04] border ${
                errors.department ? "border-red-500/60" : "border-white/10"
              } px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition-colors`}
            />
            {errors.department && <p className="text-xs text-red-400">{errors.department}</p>}
          </div>
        </div>
      </div>

      {/* 3. Department Preference */}
      <div className="rounded-3xl glass-panel p-6 sm:p-10 space-y-6 border border-white/[0.08]">
        <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">3. Department Preference</h3>
            <p className="text-xs text-zinc-400">Where Would You Like to Contribute?</p>
          </div>
        </div>

        <div>
          {/* Department Interest */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Department Interest <span className="text-red-400">*</span>
            </label>
            <select
              name="primaryDepartment"
              value={formData.primaryDepartment}
              onChange={handleInputChange}
              className={`w-full rounded-xl bg-[#0d111c] border ${
                errors.primaryDepartment ? "border-red-500/60" : "border-white/10"
              } px-4 py-3 text-sm text-white focus:border-purple-500 focus:outline-none transition-colors`}
            >
              <option value="">Select department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {errors.primaryDepartment && (
              <p className="text-xs text-red-400">{errors.primaryDepartment}</p>
            )}
          </div>
        </div>
      </div>

      {/* 4. About You */}
      <div className="rounded-3xl glass-panel p-6 sm:p-10 space-y-6 border border-white/[0.08]">
        <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">4. About You</h3>
            <p className="text-xs text-zinc-400">Your background, interests, and aspirations</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Tell us about yourself */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Tell us about yourself <span className="text-red-400">*</span>
            </label>
            <textarea
              name="aboutYou"
              rows={3}
              placeholder="Briefly introduce yourself, your interests, and what you would like to explore at AURIX."
              value={formData.aboutYou}
              onChange={handleInputChange}
              className={`w-full rounded-xl bg-white/[0.04] border ${
                errors.aboutYou ? "border-red-500/60" : "border-white/10"
              } px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none transition-colors`}
            />
            {errors.aboutYou && <p className="text-xs text-red-400">{errors.aboutYou}</p>}
          </div>

          {/* Skills & Interests */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Skills & Interests <span className="text-red-400">*</span>
            </label>
            <textarea
              name="skills"
              rows={2}
              placeholder="What skills, technologies, or areas are you interested in?"
              value={formData.skills}
              onChange={handleInputChange}
              className={`w-full rounded-xl bg-white/[0.04] border ${
                errors.skills ? "border-red-500/60" : "border-white/10"
              } px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none transition-colors`}
            />
            {errors.skills && <p className="text-xs text-red-400">{errors.skills}</p>}
          </div>

          {/* Why do you want to join AURIX? */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Why do you want to join AURIX? <span className="text-red-400">*</span>
            </label>
            <textarea
              name="motivation"
              rows={3}
              placeholder="Tell us what motivates you to become part of the community."
              value={formData.motivation}
              onChange={handleInputChange}
              className={`w-full rounded-xl bg-white/[0.04] border ${
                errors.motivation ? "border-red-500/60" : "border-white/10"
              } px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none transition-colors`}
            />
            {errors.motivation && <p className="text-xs text-red-400">{errors.motivation}</p>}
          </div>

          {/* Previous Experience */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Previous Experience <span className="text-zinc-500 font-normal">(Optional)</span>
            </label>
            <textarea
              name="previousExperience"
              rows={2}
              placeholder="Optional — projects, hackathons, internships, leadership roles, events, or other relevant experience."
              value={formData.previousExperience}
              onChange={handleInputChange}
              className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Portfolio / GitHub / LinkedIn */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Portfolio / GitHub / LinkedIn <span className="text-zinc-500 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="portfolioLinks"
                placeholder="https://github.com/... or https://linkedin.com/in/..."
                value={formData.portfolioLinks}
                onChange={handleInputChange}
                className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 pl-10 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none transition-colors"
              />
              <Link2 className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
            </div>
            <p className="text-[11px] text-zinc-500">
              Optional — share links to your work or professional profile.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Availability & Contribution */}
      <div className="rounded-3xl glass-panel p-6 sm:p-10 space-y-6 border border-white/[0.08]">
        <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">5. Availability & Contribution</h3>
            <p className="text-xs text-zinc-400">How you would like to be involved</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* How would you like to contribute? */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
              How would you like to contribute? <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {contributionOptions.map((option) => {
                const isChecked = formData.contributionTypes.includes(option);
                return (
                  <button
                    type="button"
                    key={option}
                    onClick={() => handleCheckboxToggle(option)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all ${
                      isChecked
                        ? "bg-blue-600/20 border-blue-500 text-white font-medium shadow-inner"
                        : "bg-white/[0.02] border-white/10 text-zinc-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <div
                      className={`h-4 w-4 rounded flex items-center justify-center border transition-colors ${
                        isChecked
                          ? "bg-blue-600 border-blue-500 text-white"
                          : "border-zinc-600 bg-transparent"
                      }`}
                    >
                      {isChecked && <CheckCircle2 className="h-3.5 w-3.5" />}
                    </div>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>
            {errors.contributionTypes && (
              <p className="text-xs text-red-400">{errors.contributionTypes}</p>
            )}
          </div>

          {/* Weekly Availability */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Weekly Availability <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {availabilityOptions.map((avail) => {
                const isSelected = formData.weeklyAvailability === avail;
                return (
                  <button
                    type="button"
                    key={avail}
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, weeklyAvailability: avail }));
                      if (errors.weeklyAvailability) {
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.weeklyAvailability;
                          return next;
                        });
                      }
                    }}
                    className={`p-3.5 rounded-xl border text-center text-sm font-semibold transition-all ${
                      isSelected
                        ? "bg-emerald-600/20 border-emerald-500 text-white shadow-inner"
                        : "bg-white/[0.02] border-white/10 text-zinc-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {avail}
                  </button>
                );
              })}
            </div>
            {errors.weeklyAvailability && (
              <p className="text-xs text-red-400">{errors.weeklyAvailability}</p>
            )}
          </div>
        </div>
      </div>

      {/* 6. Final Step */}
      <div className="rounded-3xl glass-panel p-6 sm:p-10 space-y-6 border border-white/[0.08]">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">6. Final Step</h3>
          <p className="text-sm font-medium text-gradient-primary">
            Let&apos;s Build Something Together.
          </p>
        </div>

        {/* Declaration Checkbox */}
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={formData.agreedToTerms}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, agreedToTerms: e.target.checked }));
              if (errors.agreedToTerms) {
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.agreedToTerms;
                  return next;
                });
              }
            }}
            className="mt-1 h-4 w-4 rounded border-zinc-600 bg-white/5 text-blue-600 focus:ring-0 focus:ring-offset-0"
          />
          <span className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            By submitting this application, I confirm that the information provided is accurate and agree to participate responsibly in AURIX activities.
          </span>
        </label>
        {errors.agreedToTerms && <p className="text-xs text-red-400">{errors.agreedToTerms}</p>}

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 py-4 px-8 text-base font-semibold text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                <span>Processing Application...</span>
              </div>
            ) : (
              <>
                <span>Submit Application</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
