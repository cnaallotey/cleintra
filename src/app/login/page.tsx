"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { 
  Building2, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle, 
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { LoginSkeleton } from "@/components/Skeletons";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "signin";

  const { user, signIn, signUp, signInWithGoogle, error, clearError } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Auto redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Sync mode with query params if changed
  useEffect(() => {
    const urlMode = searchParams.get("mode");
    if (urlMode === "signup") {
      setMode("signup");
    } else if (urlMode === "signin") {
      setMode("signin");
    }
  }, [searchParams]);

  const switchMode = (newMode: "signin" | "signup") => {
    setMode(newMode);
    clearError();
    setLocalError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();
    setSubmitting(true);

    try {
      if (mode === "signup") {
        await signUp({
          businessName: businessName.trim(),
          email: email.trim(),
          password
        });
      } else {
        await signIn({
          email: email.trim(),
          password
        });
      }
      router.push("/dashboard");
    } catch (err: any) {
      setLocalError(err.message || "An unexpected authentication error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLocalError(null);
    clearError();
    setGoogleSubmitting(true);

    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (err: any) {
      setLocalError(err.message || "Google Sign In failed.");
    } finally {
      setGoogleSubmitting(false);
    }
  };

  const displayedError = localError || error;

  return (
    <div className="flex min-h-[75vh] items-center justify-center py-10 px-4">
      <div className="w-full max-w-md space-y-6">
        
        {/* Logo and Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center bg-[#0A1D13] text-[#BEF264] mb-1 border border-[#0A1D13]">
            <span className="font-black text-xl">S</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {mode === "signin" ? "Welcome back" : "Get started with your CRM"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xs mx-auto font-medium">
            {mode === "signin"
              ? "Sign in to manage your customer contacts and pipeline."
              : "Create a simple business account to organize your sales leads."}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 border border-slate-300 text-xs font-bold font-mono uppercase">
          <button
            type="button"
            onClick={() => switchMode("signin")}
            className={`py-2 transition-all cursor-pointer ${
              mode === "signin" 
                ? "bg-[#0A1D13] text-[#BEF264]" 
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchMode("signup")}
            className={`py-2 transition-all cursor-pointer ${
              mode === "signup" 
                ? "bg-[#0A1D13] text-[#BEF264]" 
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Container */}
        <div className="border border-slate-300 bg-white p-6 sm:p-8 space-y-5">
          
          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleSubmitting || submitting}
            className="w-full flex items-center justify-center gap-3 border border-slate-300 bg-white hover:bg-[#F8FAF8] py-2.5 px-4 text-xs sm:text-sm font-bold text-slate-800 transition-all disabled:opacity-50 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{googleSubmitting ? "Connecting with Google..." : "Continue with Google"}</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-mono uppercase font-bold text-slate-400 absolute">
              Or with email
            </span>
          </div>

          {/* Error Banner */}
          {displayedError && (
            <div className="border border-rose-300 bg-rose-50 p-3.5 flex items-start gap-2.5 text-xs text-rose-800 font-bold animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="leading-relaxed">{displayedError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Business Name Field (Sign Up Only) */}
            {mode === "signup" && (
              <div className="space-y-1.5 animate-in fade-in">
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
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase font-bold text-slate-700">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@adom.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-bold border border-slate-300 bg-[#F8FAF8] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13]"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase font-bold text-slate-700">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-bold border border-slate-300 bg-[#F8FAF8] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13]"
                />
              </div>
              {mode === "signup" && (
                <p className="text-[11px] text-slate-500 font-medium">Must be at least 6 characters</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || googleSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#BEF264] hover:bg-[#A3E635] text-[#0A1D13] border border-[#BEF264] py-3 px-4 text-xs sm:text-sm font-black transition-all disabled:opacity-50 cursor-pointer"
            >
              <span>
                {submitting
                  ? "Processing..."
                  : mode === "signin"
                  ? "Sign In to Dashboard"
                  : "Create Account & Go to Dashboard"}
              </span>
              <ArrowRight className="w-4 h-4 text-[#0A1D13]" />
            </button>

          </form>

        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginFormContent />
    </Suspense>
  );
}
