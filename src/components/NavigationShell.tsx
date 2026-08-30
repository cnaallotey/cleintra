"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { AuthNavbar } from "@/components/AuthNavbar";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface NavigationShellProps {
  children: React.ReactNode;
}

export function NavigationShell({ children }: NavigationShellProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const isLandingPage = pathname === "/";
  const isLoginPage = pathname === "/login";
  const isDialerPage = pathname?.startsWith("/dial");

  if (isDialerPage) {
    return <>{children}</>;
  }

  if (isLandingPage) {
    return (
      <div className="min-h-screen bg-[#06180E] text-slate-100 flex flex-col selection:bg-[#BEF264] selection:text-[#0A1D13]">
        {/* Top Announcement Bar */}
        <div className="bg-[#0A1D13] border-b border-emerald-900/40 text-center py-2 px-4 text-xs font-medium text-emerald-300 flex items-center justify-center gap-2">
          <span className="flex h-2 w-2 bg-[#BEF264] animate-pulse"></span>
          <span>Simple CRM v2.0 is live • Built for fast sales lead tracking</span>
          <Link href="/login?mode=signup" className="underline font-bold text-[#BEF264] hover:text-white transition-colors ml-1">
            Try it Free &rarr;
          </Link>
        </div>

        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-emerald-900/60 bg-[#06180E]/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
            
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 hover:opacity-95 transition-opacity">
              <div className="flex h-9 w-9 items-center justify-center bg-[#BEF264] text-[#0A1D13] font-black text-lg">
                S
              </div>
              <div>
                <span className="text-base font-extrabold text-white tracking-tight leading-tight block">Simple CRM</span>
                <span className="text-[11px] text-[#8FA396] font-medium block">Lead &amp; Sales Tracker</span>
              </div>
            </Link>

            {/* Desktop Navigation Anchors */}
            <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-[#8FA396]">
              <a href="#how-it-works" className="hover:text-[#BEF264] transition-colors">
                How It Works
              </a>
              <a href="#features" className="hover:text-[#BEF264] transition-colors">
                Features
              </a>
              <a href="#compare" className="hover:text-[#BEF264] transition-colors">
                Compare
              </a>
              <a href="#faq" className="hover:text-[#BEF264] transition-colors">
                FAQ
              </a>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {user ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 bg-[#BEF264] hover:bg-[#A3E635] text-[#0A1D13] font-extrabold px-4 py-2 text-xs transition-all"
                >
                  <span>Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/login?mode=signin"
                    className="inline-flex items-center px-3.5 py-2 text-xs font-bold text-slate-200 hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/login?mode=signup"
                    className="inline-flex items-center gap-1.5 bg-[#BEF264] hover:bg-[#A3E635] text-[#0A1D13] font-extrabold px-4 py-2 text-xs transition-all"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </>
              )}
            </div>

          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 w-full">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-emerald-900/60 bg-[#06180E] py-12 px-4 sm:px-6 text-center text-xs text-[#8FA396]">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-6 w-6 items-center justify-center bg-[#BEF264] text-[#0A1D13] font-black text-xs">
                S
              </div>
              <span className="font-bold text-white text-sm">Simple CRM</span>
            </div>
            <p className="text-[#8FA396]">
              &copy; {new Date().getFullYear()} Simple CRM. Built for small businesses, shops, and traders.
            </p>
            <div className="flex items-center gap-4 text-xs font-semibold text-[#8FA396]">
              <Link href="/login" className="hover:text-[#BEF264] transition-colors">Sign In</Link>
              <Link href="/login?mode=signup" className="hover:text-[#BEF264] transition-colors">Register Free</Link>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
            <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 font-bold text-white">
                S
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 leading-tight">Simple CRM</h1>
                <p className="text-[11px] text-slate-500">Sales &amp; Follow-up Tracker</p>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <AuthNavbar />
            </div>
          </div>
        </header>

        <main className="flex-1 mx-auto max-w-6xl px-4 py-6 sm:px-6 w-full">
          {children}
        </main>
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
