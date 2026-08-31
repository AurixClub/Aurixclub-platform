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
  "Sponsors & Industry Relations Department",
  "Innovation & Research Department",
  "Event Management Department",
  "Social Media & Marketing Department",
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
        className="max-w-2xl mx-auto my-12 rounded-3xl bg-white p-8 sm:p-14 text-center space-y-6 border border-emerald-200 shadow-xl shadow-slate-200/50"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-zinc-900">
            Application Submitted Successfully
          </h2>
          <p className="text-base text-zinc-600 max-w-md mx-auto leading-relaxed">
            Thank you for your interest in AURIX. Our team will review your application and get back to you soon.
          </p>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-sm font-semibold text-zinc-800 transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/events"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all"
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
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <div className="flex-1">
            <span>{serverError}</span>
            {serverError.includes("sign in") && (
              <Link href="/login" className="ml-2 underline text-red-800 hover:text-red-900 font-bold">
                Sign In now →
              </Link>
            )}
          </div>
        </div>
      )}

      {/* 2. Personal Information */}
      <div className="rounded-3xl bg-white p-6 sm:p-10 space-y-6 border border-zinc-200/90 shadow-xl shadow-slate-200/50">
        <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
          <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900">2. Personal Information</h3>
            <p className="text-xs text-zinc-500">Tell us how to reach and identify you</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="sm:col-span-2 space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`w-full rounded-xl bg-slate-50 border ${
                errors.fullName ? "border-red-400" : "border-zinc-200"
              } px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:bg-white focus:outline-none transition-colors`}
            />
            {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
          </div>

          {/* College Email */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700">
              College Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="you@university.edu"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full rounded-xl bg-slate-50 border ${
                  errors.email ? "border-red-400" : "border-zinc-200"
                } px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:bg-white focus:outline-none transition-colors`}
              />
            </div>
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full rounded-xl bg-slate-50 border ${
                  errors.phone ? "border-red-400" : "border-zinc-200"
                } px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:bg-white focus:outline-none transition-colors`}
              />
            </div>
            {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
          </div>
        </div>
      </div>

      {/* 3. Academic Details */}
      <div className="rounded-3xl bg-white p-6 sm:p-10 space-y-6 border border-zinc-200/90 shadow-xl shadow-slate-200/50">
        <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
          <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900">3. Academic Details</h3>
            <p className="text-xs text-zinc-500">Your current academic status at Dr. AIT</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Year of Study */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700">
              Year of Study <span className="text-red-500">*</span>
            </label>
            <select
              name="yearOfStudy"
              value={formData.yearOfStudy}
              onChange={handleInputChange}
              className={`w-full rounded-xl bg-slate-50 border ${
                errors.yearOfStudy ? "border-red-400" : "border-zinc-200"
              } px-4 py-3 text-sm text-zinc-900 focus:border-indigo-500 focus:bg-white focus:outline-none transition-colors`}
            >
              <option value="">Select Year</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {errors.yearOfStudy && <p className="text-xs text-red-500">{errors.yearOfStudy}</p>}
          </div>

          {/* Branch / Department */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700">
              Branch / Department <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="department"
              placeholder="e.g. CSE, ISE, ECE, Mechanical"
              value={formData.department}
              onChange={handleInputChange}
              className={`w-full rounded-xl bg-slate-50 border ${
                errors.department ? "border-red-400" : "border-zinc-200"
              } px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:bg-white focus:outline-none transition-colors`}
            />
            {errors.department && <p className="text-xs text-red-500">{errors.department}</p>}
          </div>
        </div>
      </div>

      {/* 4. Department Preferences */}
      <div className="rounded-3xl bg-white p-6 sm:p-10 space-y-6 border border-zinc-200/90 shadow-xl shadow-slate-200/50">
        <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
          <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900">4. Department Preferences</h3>
            <p className="text-xs text-zinc-500">Choose the domains you wish to contribute to</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Primary Preference */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700">
              Primary Preference <span className="text-red-500">*</span>
            </label>
            <select
              name="primaryDepartment"
              value={formData.primaryDepartment}
              onChange={handleInputChange}
              className={`w-full rounded-xl bg-slate-50 border ${
                errors.primaryDepartment ? "border-red-400" : "border-zinc-200"
              } px-4 py-3 text-sm text-zinc-900 focus:border-indigo-500 focus:bg-white focus:outline-none transition-colors`}
            >
              <option value="">Select Primary Domain</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {errors.primaryDepartment && (
              <p className="text-xs text-red-500">{errors.primaryDepartment}</p>
            )}
          </div>

          {/* Secondary Preference */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700">
              Secondary Preference <span className="text-zinc-400 font-normal">(Optional)</span>
            </label>
            <select
              name="secondaryDepartment"
              value={formData.secondaryDepartment}
              onChange={handleInputChange}
              className="w-full rounded-xl bg-slate-50 border border-zinc-200 px-4 py-3 text-sm text-zinc-900 focus:border-indigo-500 focus:bg-white focus:outline-none transition-colors"
            >
              <option value="">Select Secondary Domain</option>
              {departments
                .filter((d) => d !== formData.primaryDepartment)
                .map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* 5. Experience & Background */}
      <div className="rounded-3xl bg-white p-6 sm:p-10 space-y-6 border border-zinc-200/90 shadow-xl shadow-slate-200/50">
        <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
          <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900">5. Background & Motivation</h3>
            <p className="text-xs text-zinc-500">Share your interests, skills, and drive</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* About You */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700">
              Brief Intro / About Yourself <span className="text-red-500">*</span>
            </label>
            <textarea
              name="aboutYou"
              rows={3}
              placeholder="Tell us a bit about your background, passion, or hobbies..."
              value={formData.aboutYou}
              onChange={handleInputChange}
              className={`w-full rounded-xl bg-slate-50 border ${
                errors.aboutYou ? "border-red-400" : "border-zinc-200"
              } p-4 text-sm text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:bg-white focus:outline-none transition-colors resize-none`}
            />
            {errors.aboutYou && <p className="text-xs text-red-500">{errors.aboutYou}</p>}
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700">
              Skills & Interests <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="skills"
              placeholder="e.g. Python, React, Event Design, Public Speaking, UI/UX"
              value={formData.skills}
              onChange={handleInputChange}
              className={`w-full rounded-xl bg-slate-50 border ${
                errors.skills ? "border-red-400" : "border-zinc-200"
              } px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:bg-white focus:outline-none transition-colors`}
            />
            {errors.skills && <p className="text-xs text-red-500">{errors.skills}</p>}
          </div>

          {/* Motivation */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700">
              Why do you want to join AURIX? <span className="text-red-500">*</span>
            </label>
            <textarea
              name="motivation"
              rows={3}
              placeholder="What drives you to apply? What do you hope to learn or accomplish?"
              value={formData.motivation}
              onChange={handleInputChange}
              className={`w-full rounded-xl bg-slate-50 border ${
                errors.motivation ? "border-red-400" : "border-zinc-200"
              } p-4 text-sm text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:bg-white focus:outline-none transition-colors resize-none`}
            />
            {errors.motivation && <p className="text-xs text-red-500">{errors.motivation}</p>}
          </div>

          {/* Links */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700">
              Portfolio / GitHub / LinkedIn Links <span className="text-zinc-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              name="portfolioLinks"
              placeholder="github.com/username or linkedin.com/in/username"
              value={formData.portfolioLinks}
              onChange={handleInputChange}
              className="w-full rounded-xl bg-slate-50 border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:bg-white focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* 6. Availability & Final Step */}
      <div className="rounded-3xl bg-white p-6 sm:p-10 space-y-6 border border-zinc-200/90 shadow-xl shadow-slate-200/50">
        <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
          <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900">6. Availability & Final Step</h3>
            <p className="text-xs text-zinc-500">Confirm your commitment and submit</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Contribution Types */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700">
              How would you like to contribute? <span className="text-red-500">*</span>
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
                        ? "bg-indigo-50 border-indigo-300 text-indigo-900 font-semibold"
                        : "bg-slate-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                    }`}
                  >
                    <div
                      className={`h-4 w-4 rounded flex items-center justify-center border transition-colors ${
                        isChecked
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : "border-zinc-300 bg-white"
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
              <p className="text-xs text-red-500">{errors.contributionTypes}</p>
            )}
          </div>

          {/* Weekly Availability */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700">
              Weekly Availability <span className="text-red-500">*</span>
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
                        ? "bg-indigo-50 border-indigo-300 text-indigo-700 shadow-xs font-bold"
                        : "bg-slate-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                    }`}
                  >
                    {avail}
                  </button>
                );
              })}
            </div>
            {errors.weeklyAvailability && (
              <p className="text-xs text-red-500">{errors.weeklyAvailability}</p>
            )}
          </div>
        </div>

        {/* Declaration Checkbox */}
        <div className="pt-4 border-t border-zinc-100 space-y-4">
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
              className="mt-1 h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-xs sm:text-sm text-zinc-600 leading-relaxed hover:text-zinc-900 transition-colors">
              By submitting this application, I confirm that the information provided is accurate and agree to participate responsibly in AURIX activities.
            </span>
          </label>
          {errors.agreedToTerms && <p className="text-xs text-red-500">{errors.agreedToTerms}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 py-4 px-8 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
