"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { 
  Building2, 
  LogOut, 
  User, 
  ChevronDown, 
  LayoutDashboard, 
  ShieldCheck,
  Settings,
  Folder
} from "lucide-react";

export function AuthNavbar() {
  const { user, business, signOut, loading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const businessDisplayName = business?.name || user?.businessName || "My Business";

  const handleSignOut = async () => {
    setDropdownOpen(false);
    await signOut();
  };

  if (loading) {
    return (
      <div className="h-8 w-24 bg-slate-100 animate-pulse"></div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="inline-flex items-center px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <span>Sign In</span>
        </Link>
        <Link
          href="/login?mode=signup"
          className="inline-flex items-center bg-[#BEF264] hover:bg-[#A3E635] text-[#0A1D13] border border-[#BEF264] px-4 py-2 text-xs font-black transition-colors"
        >
          <span>Get Started</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/dashboard"
        className="hidden sm:inline-flex items-center gap-1.5 bg-[#0A1D13] border border-[#0A1D13] hover:bg-black px-3.5 py-1.5 text-xs font-bold text-[#BEF264] transition-all"
      >
        <LayoutDashboard className="w-3.5 h-3.5 text-[#BEF264]" />
        <span>Dashboard</span>
      </Link>

      <div className="relative">
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 border border-slate-300 bg-white hover:bg-[#F4F9F4] px-3.5 py-1.5 text-xs font-bold transition-all"
        >
          <div className="flex h-5 w-5 items-center justify-center bg-[#0A1D13] font-black text-[10px] text-[#BEF264] shrink-0 border border-[#0A1D13]">
            {businessDisplayName ? businessDisplayName.charAt(0).toUpperCase() : "B"}
          </div>
          <span className="font-bold text-slate-900 max-w-[130px] truncate">
            {businessDisplayName}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        </button>

        {dropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setDropdownOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-56 border-2 border-slate-300 bg-white p-2 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-slate-200 bg-[#F8FAF8]">
                <div className="text-xs font-black text-slate-900 truncate">
                  {businessDisplayName}
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">
                  {user.email}
                </div>
              </div>

              <div className="py-1 border-b border-slate-200">
                <Link
                  href="/dashboard"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-[#F4F9F4] hover:text-[#0A1D13] transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-slate-500" />
                  <span>Contacts &amp; Pipeline</span>
                </Link>
                <Link
                  href="/groups"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-[#F4F9F4] hover:text-[#0A1D13] transition-colors"
                >
                  <Folder className="w-3.5 h-3.5 text-slate-500" />
                  <span>Contact Groups</span>
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-[#F4F9F4] hover:text-[#0A1D13] transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-500" />
                  <span>Business Settings</span>
                </Link>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
