"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { AuthGuard } from "@/components/AuthGuard";
import { SettingsSkeleton } from "@/components/Skeletons";
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Briefcase, 
  Check, 
  AlertCircle, 
  ArrowLeft, 
  Save, 
  ShieldCheck, 
  Key, 
  Calendar,
  Sparkles
} from "lucide-react";

export default function SettingsPage() {
  const { user, business, updateBusinessProfile, error, clearError, loading } = useAuth();

  const [businessName, setBusinessName] = useState(business?.name || user?.businessName || "");
  const [ownerName, setOwnerName] = useState(business?.ownerName || "");
  const [supportEmail, setSupportEmail] = useState(business?.supportEmail || "");
  const [phone, setPhone] = useState(business?.phone || "");
  const [currency, setCurrency] = useState(business?.currency || "GHS");
  const [industry, setIndustry] = useState(business?.industry || "Services");

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (business) {
      setBusinessName(business.name);
      setOwnerName(business.ownerName || "");
      setSupportEmail(business.supportEmail || "");
      setPhone(business.phone || "");
      setCurrency(business.currency || "GHS");
      setIndustry(business.industry || "Services");
    } else if (user) {
      setBusinessName(user.businessName);
    }
  }, [business, user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();
    setSaving(true);
    setSuccessMessage(null);

    try {
      await updateBusinessProfile({
        name: businessName,
        ownerName: ownerName || null,
        supportEmail: supportEmail || null,
        phone: phone || null,
        currency,
        industry
      });

      setSuccessMessage("Business profile updated successfully!");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
    } catch (err: any) {
      setLocalError(err.message || "Failed to update business profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <SettingsSkeleton />;
  }

  const displayedError = localError || error;

  const formattedJoinDate = business?.createdAt
    ? new Date(business.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric"
      })
    : "Recently";

  return (
    <AuthGuard>
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
        
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-slate-700 hover:text-[#0A1D13] transition-colors py-1.5 px-2.5 bg-white border border-slate-300 hover:border-slate-400"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          {successMessage && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0A1D13] text-[#BEF264] text-xs font-mono font-bold uppercase animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>

        {/* Page Title & Profile Header */}
        <div className="bg-white p-6 sm:p-8 border border-slate-300 space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-200">
            <div className="flex h-16 w-16 items-center justify-center bg-[#0A1D13] text-[#BEF264] font-black text-2xl shrink-0 border border-[#0A1D13]">
              {businessName ? businessName.charAt(0).toUpperCase() : "B"}
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight truncate">
                {businessName || "Business Settings"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 font-medium">
                Manage your shop profile, regional currency, and contact information.
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {displayedError && (
            <div className="border border-rose-300 bg-rose-50 p-3.5 flex items-start gap-2.5 text-xs text-rose-800 font-bold animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="leading-relaxed">{displayedError}</div>
            </div>
          )}

          {/* Profile Form */}
          <form onSubmit={handleSave} className="space-y-5">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Business Name (Required) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase font-bold text-slate-700">
                  Business / Shop Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Adom Enterprise"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-bold border border-slate-300 bg-[#F8FAF8] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13]"
                  />
                </div>
              </div>

              {/* Owner Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase font-bold text-slate-700">
                  Owner Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. Kofi Mensah"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-bold border border-slate-300 bg-[#F8FAF8] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13]"
                  />
                </div>
              </div>

              {/* Support Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase font-bold text-slate-700">
                  Support / Business Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    placeholder="contact@yourbusiness.com"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-bold border border-slate-300 bg-[#F8FAF8] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13]"
                  />
                </div>
              </div>

              {/* Contact Phone */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase font-bold text-slate-700">
                  Contact Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0244123456 or +233244123456"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-bold border border-slate-300 bg-[#F8FAF8] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13]"
                  />
                </div>
              </div>

              {/* Currency / Region */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase font-bold text-slate-700">
                  Primary Currency / Region
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-bold border border-slate-300 bg-[#F8FAF8] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13] cursor-pointer"
                  >
                    <option value="GHS">GHS (₵) — Ghana Cedi</option>
                    <option value="USD">USD ($) — US Dollar</option>
                    <option value="EUR">EUR (€) — Euro</option>
                    <option value="GBP">GBP (£) — British Pound</option>
                    <option value="NGN">NGN (₦) — Nigerian Naira</option>
                    <option value="KES">KES (KSh) — Kenyan Shilling</option>
                  </select>
                </div>
              </div>

              {/* Industry Category */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase font-bold text-slate-700">
                  Business Industry
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-bold border border-slate-300 bg-[#F8FAF8] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13] cursor-pointer"
                  >
                    <option value="Retail">Retail &amp; Shop Sales</option>
                    <option value="Wholesale">Wholesale &amp; Distribution</option>
                    <option value="Services">Services &amp; Contracting</option>
                    <option value="Real Estate">Real Estate &amp; Properties</option>
                    <option value="Consulting">Consulting &amp; Agency</option>
                    <option value="Other">Other Small Business</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 bg-[#BEF264] hover:bg-[#A3E635] text-[#0A1D13] border border-[#BEF264] px-6 py-2.5 text-xs sm:text-sm font-black active:scale-[0.99] transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-[#0A1D13]" />
                <span>{saving ? "Saving Changes..." : "Save Profile Changes"}</span>
              </button>
            </div>

          </form>
        </div>

        {/* Account Information Card */}
        <div className="bg-white p-6 sm:p-8 border border-slate-300 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <ShieldCheck className="w-5 h-5 text-[#0A1D13]" />
            <h2 className="text-base font-black text-slate-900 tracking-tight">Account Summary</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 bg-[#F8FAF8] border border-slate-200 space-y-1">
              <div className="text-slate-500 font-mono font-bold uppercase tracking-wider text-[10px]">Account ID</div>
              <div className="font-mono font-bold text-slate-900 truncate" title={user?.uid}>
                {user?.uid || "biz_demo_1"}
              </div>
              <p className="text-[10px] text-slate-400">Your unique business reference</p>
            </div>

            <div className="p-3.5 bg-[#F8FAF8] border border-slate-200 space-y-1">
              <div className="text-slate-500 font-mono font-bold uppercase tracking-wider text-[10px]">Sign-in Email</div>
              <div className="font-bold text-slate-900 truncate font-mono" title={user?.email}>
                {user?.email || "owner@adom.com"}
              </div>
            </div>

            <div className="p-3.5 bg-[#F8FAF8] border border-slate-200 space-y-1">
              <div className="text-slate-500 font-mono font-bold uppercase tracking-wider text-[10px]">Member Since</div>
              <div className="font-bold text-slate-900 font-mono">
                {formattedJoinDate}
              </div>
            </div>
          </div>
        </div>

      </div>
    </AuthGuard>
  );
}
