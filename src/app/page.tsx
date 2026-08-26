"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { 
  ArrowRight, 
  Check, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Upload, 
  PhoneCall, 
  MessageCircle, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Sliders, 
  FileSpreadsheet, 
  TrendingUp,
  FolderPlus,
  Zap,
  Globe
} from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeRevenueStep, setActiveRevenueStep] = useState<number>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const industries = [
    { label: "Retail Shops & Boutiques", icon: "🏪" },
    { label: "Wholesale Distributors", icon: "📦" },
    { label: "Real Estate Agencies", icon: "🏢" },
    { label: "Professional Services", icon: "💼" },
    { label: "Field Sales & Logistics", icon: "🛵" },
    { label: "Social Commerce Traders", icon: "📱" },
  ];

  const faqs = [
    {
      q: "How is Simple CRM different from Microsoft Excel or Google Sheets?",
      a: "Spreadsheets don't remind you to follow up, validate messy phone numbers, or let you log calls and WhatsApp conversations in one tap. Simple CRM provides a purpose-built customer pipeline that prevents lost leads without spreadsheet formula errors or accidental row deletions."
    },
    {
      q: "How long does it take to import my existing customer list?",
      a: "Under 30 seconds. Download your contacts as a CSV from Excel or Google Sheets and drop it into Simple CRM. Our smart importer auto-maps columns, validates phone numbers, and assigns them to groups immediately."
    },
    {
      q: "Does Simple CRM support international and Ghana phone number formats?",
      a: "Yes! Whether your contacts use standard local formats (0244..., 055...) or international prefixes (+233, +1, +44), Simple CRM automatically cleans and standardizes them so you can dial or message with one click."
    },
    {
      q: "Can I customize my sales pipeline stages?",
      a: "Absolutely. You can create, rename, recolor, and reorder stages to match your exact business workflow (e.g., New Lead, Quoted, Meeting Booked, Follow-up Needed, Won, Closed)."
    },
    {
      q: "Is my customer data private and secure?",
      a: "Yes. Your data is encrypted at rest and in transit using enterprise-grade Google Cloud Firestore security. Each business account has strictly isolated data access."
    },
    {
      q: "Do I need a credit card or long-term contract to get started?",
      a: "No credit card is required. You can create a free business account in 30 seconds, import your contacts, and start tracking deals immediately."
    }
  ];

  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION WITH AUTHENTIC PHOTOGRAPHY & BENTO TEASER                */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 px-4 text-center max-w-6xl mx-auto space-y-8">
        
        {/* Top Eyebrow Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#BEF264]/10 border border-[#BEF264]/40 text-[#BEF264] text-xs font-mono font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#BEF264]" />
          <span>Zero-Onboarding Sales Engine • 60-Second Setup</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] max-w-5xl mx-auto">
          Stop losing leads in messy spreadsheets and buried chats.{" "}
          <span className="text-[#BEF264]">Turn every inquiry into closed revenue.</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-xl text-[#8FA396] max-w-2xl mx-auto leading-relaxed">
          The lightweight, high-velocity CRM crafted specifically for shop owners, wholesale traders, and nimble sales teams. Import customer lists in seconds, dial or chat in one tap, and never miss a follow-up.
        </p>

        {/* Dual CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          {user ? (
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#BEF264] hover:bg-[#A3E635] text-[#0A1D13] font-black px-8 py-4 text-base transition-all active:scale-[0.99] border border-[#BEF264]"
            >
              <span>Go to Your Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/login?mode=signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#BEF264] hover:bg-[#A3E635] text-[#0A1D13] font-black px-8 py-4 text-base transition-all active:scale-[0.99] border border-[#BEF264]"
              >
                <span>Get Started Free in 30s</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login?mode=signin"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0D2A1C] hover:bg-[#123826] text-white font-bold px-7 py-4 text-base transition-all border border-emerald-800/60"
              >
                <span>Sign In to Account</span>
              </Link>
            </>
          )}
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-6 text-xs text-[#8FA396] pt-2 flex-wrap font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#BEF264]" />
            <span>No Credit Card Required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#BEF264]" />
            <span>Auto-Standardizes Ghana &amp; Global Numbers</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#BEF264]" />
            <span>Real-Time Cloud Persistence</span>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* HERO COMPOSITION: HERO IMAGE + SPLIT BENTO PREVIEW            */}
        {/* ------------------------------------------------------------- */}
        <div className="pt-8 max-w-5xl mx-auto space-y-4">
          
          {/* Main Hero Lifestyle / Business Team Image */}
          <div className="border border-emerald-800/60 bg-[#0D2A1C] p-2 overflow-hidden">
            <div className="relative h-64 sm:h-80 lg:h-96 w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=80"
                alt="Sales team and small business owners tracking customer leads on Simple CRM"
                className="w-full h-full object-cover object-center brightness-90 hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06180E] via-transparent to-transparent"></div>
              
              <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3.5 bg-[#06180E]/90 border border-emerald-800/80 backdrop-blur-sm text-left">
                <div className="flex items-center gap-2.5">
                  <div className="h-3 w-3 bg-[#BEF264] animate-ping"></div>
                  <span className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                    Live Workspace • 10,000+ Deals Tracked Daily
                  </span>
                </div>
                <span className="text-xs font-bold text-[#BEF264]">
                  99.9% Uptime &bull; Firestore Real-time Sync
                </span>
              </div>
            </div>
          </div>

          {/* Bento Teaser Split Cards */}
          <div className="border border-emerald-800/50 bg-[#0D2A1C] p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            
            {/* Left Sub-Card: Cream Importer Preview */}
            <div className="bg-[#F4F9F4] text-[#0A1D13] p-5 sm:p-6 border border-[#D1E3D5] flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 border border-emerald-200">
                    Instant CSV Import
                  </span>
                  <span className="text-xs font-bold text-emerald-700">100% Validated</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  Drop Your Spreadsheet &amp; Launch
                </h3>
                <p className="text-xs text-slate-600">
                  Auto-detects phone columns, eliminates duplicates, and assigns contacts to groups automatically.
                </p>
              </div>

              <div className="p-3 bg-white border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-700 font-semibold">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>wholesale_leads_2026.csv</span>
                  </div>
                  <span className="text-[11px] text-emerald-600 font-bold">248 leads parsed</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-emerald-600 w-full"></div>
                </div>
              </div>
            </div>

            {/* Right Sub-Card: Dark Pine 1-Tap Action Lead */}
            <div className="bg-[#06180E] text-white p-5 sm:p-6 border border-emerald-800/40 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#BEF264] bg-[#BEF264]/10 border border-[#BEF264]/20 px-2 py-0.5">
                    1-Tap Lead Action
                  </span>
                  <span className="text-xs font-bold text-[#BEF264]">Stage: Follow-up</span>
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-base font-bold text-white">Kojo Ansah • Apex Distro</h4>
                  <p className="text-xs text-[#8FA396]">+233 24 412 3456 • Accra, Ghana</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] text-[#8FA396] bg-[#0D2A1C] p-2.5 border border-emerald-800/40">
                  💬 Last interaction: &quot;Requested wholesale catalog for 500 units.&quot;
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="inline-flex items-center justify-center gap-1.5 bg-[#25D366] text-[#0A1D13] font-bold text-xs py-2">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </div>
                  <div className="inline-flex items-center justify-center gap-1.5 bg-[#BEF264] text-[#0A1D13] font-bold text-xs py-2">
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call Client</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. INDUSTRY PROOF TICKER (SHARP RECTANGLE CHIPS)                          */}
      {/* ========================================================================= */}
      <section className="border-y border-emerald-900/60 bg-[#0A1D13] py-10 px-4">
        <div className="max-w-6xl mx-auto space-y-5 text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-[#8FA396]">
            Built for High-Velocity Sales Teams Across Key Sectors
          </p>
          <div className="flex flex-wrap justify-center items-center gap-2.5">
            {industries.map((ind, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0D2A1C] border border-emerald-800/50 text-xs sm:text-sm font-semibold text-emerald-200 hover:border-[#BEF264]/40 transition-colors"
              >
                <span>{ind.icon}</span>
                <span>{ind.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE SPLIT TRANSFORMATION ENGINE (RE-DESIGNED)                  */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#BEF264]/10 border border-[#BEF264]/30 text-[#BEF264] text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#BEF264]" />
            <span>The 4-Step Revenue Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            How Simple CRM Turns Raw Data into <span className="text-[#BEF264]">Closed Deals</span>
          </h2>
          <p className="text-sm sm:text-base text-[#8FA396] leading-relaxed">
            A frictionless sales engine engineered to take chaotic spreadsheets and convert them into organized, revenue-generating customer conversations.
          </p>
        </div>

        {/* Main Split Interactive Transformation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pt-2">
          
          {/* LEFT 5-COL: INTERACTIVE STEP SELECTORS */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
            {[
              {
                id: 0,
                stepNumber: "01",
                title: "Raw CSV / Excel Drop",
                tagline: "30-Second Ingest",
                badge: "Zero Setup Required",
                description: "Drop your existing contact list directly from Google Sheets or Excel. The intelligent parser auto-maps columns and eliminates formatting errors.",
                stats: "1,250 Contacts Processed in 1.8s"
              },
              {
                id: 1,
                stepNumber: "02",
                title: "Auto-Clean Standardizer",
                tagline: "100% Dialable E.164",
                badge: "+233 & Global Formats",
                description: "Instantly fixes missing prefixes, strips spaces & hyphens, and standardizes numbers into 1-click dialable records across Ghana and worldwide.",
                stats: "99.8% Accuracy • Zero Lost Leads"
              },
              {
                id: 2,
                stepNumber: "03",
                title: "Visual Pipeline & Groups",
                tagline: "Smart Segmentation",
                badge: "Custom Kanban Funnel",
                description: "Segment leads into actionable stages (New Lead → Quoted → Won). Tag VIP wholesale accounts or retail customers for targeted follow-ups.",
                stats: "Custom Colors & Reorderable Stages"
              },
              {
                id: 3,
                stepNumber: "04",
                title: "1-Tap WhatsApp & Closing",
                tagline: "High-Velocity Outreach",
                badge: "Closed Deals ✓",
                description: "Engage prospects in 1 tap on WhatsApp or direct cellular call. Log conversation notes in 5 seconds so your team knows the exact deal status.",
                stats: "+38% Faster Sales Velocity"
              }
            ].map((step, idx) => {
              const isActive = activeRevenueStep === idx;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveRevenueStep(idx)}
                  onMouseEnter={() => setActiveRevenueStep(idx)}
                  className={`w-full text-left p-4 sm:p-5 transition-all relative border text-white group cursor-pointer ${
                    isActive
                      ? "bg-[#0D2A1C] border-[#BEF264] border-l-4 border-l-[#BEF264]"
                      : "bg-[#06180E] border-emerald-900/60 hover:bg-[#0D2A1C]/60 hover:border-emerald-700/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`h-8 w-8 flex items-center justify-center font-mono font-black text-xs shrink-0 transition-colors ${
                          isActive
                            ? "bg-[#BEF264] text-[#0A1D13]"
                            : "bg-[#0D2A1C] text-emerald-400 border border-emerald-800/80 group-hover:border-[#BEF264]/40"
                        }`}
                      >
                        {step.stepNumber}
                      </span>
                      <div>
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider block ${
                          isActive ? "text-[#BEF264]" : "text-emerald-500/80"
                        }`}>
                          {step.tagline}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
                          {step.title}
                        </h3>
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 shrink-0 hidden sm:inline-block ${
                      isActive 
                        ? "bg-[#BEF264]/20 text-[#BEF264] border border-[#BEF264]/30" 
                        : "bg-emerald-950/60 text-[#8FA396] border border-emerald-900/40"
                    }`}>
                      {step.badge}
                    </span>
                  </div>

                  {isActive && (
                    <div className="mt-3 pt-3 border-t border-emerald-800/40 space-y-2 animate-in fade-in duration-200">
                      <p className="text-xs text-[#8FA396] leading-relaxed">
                        {step.description}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#BEF264] font-bold">
                        <Zap className="w-3 h-3 text-[#BEF264]" />
                        <span>{step.stats}</span>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* RIGHT 7-COL: DYNAMIC LIVE TRANSFORMATION VIEWPORT CANVAS */}
          <div className="lg:col-span-7 bg-[#0D2A1C] border border-emerald-800/60 p-5 sm:p-7 flex flex-col justify-between relative overflow-hidden min-h-[440px]">
            
            {/* Watermark Step Number */}
            <div className="absolute top-2 right-4 opacity-10 font-mono text-8xl font-black text-[#BEF264] select-none pointer-events-none">
              0{activeRevenueStep + 1}
            </div>

            {/* Canvas Header Bar */}
            <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3.5 relative z-10">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-[#BEF264] animate-pulse"></div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#BEF264]">
                  Stage 0{activeRevenueStep + 1} • Live Transformation Engine
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#8FA396] bg-[#06180E] px-2 py-0.5 border border-emerald-900/80">
                Simple CRM Engine v2.4
              </span>
            </div>

            {/* Dynamic Step Mockup */}
            <div className="my-4 relative z-10 flex-1 flex flex-col justify-center">
              
              {/* STEP 0: RAW SPREADSHEET PARSER */}
              {activeRevenueStep === 0 && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="bg-[#06180E] border border-emerald-800/50 p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-white font-mono font-bold">
                        <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                        <span>wholesale_leads_accra.csv</span>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-900/60 text-emerald-300 font-mono text-[10px] border border-emerald-700/50">
                        1,250 ROWS DETECTED
                      </span>
                    </div>

                    <div className="space-y-1.5 font-mono text-[11px]">
                      <div className="grid grid-cols-3 gap-2 bg-[#0D2A1C] p-2 text-emerald-400 font-bold border-b border-emerald-800/60 text-[10px]">
                        <span>RAW CLIENT NAME</span>
                        <span>PHONE (MESSY)</span>
                        <span>VALUE / GROUP</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 bg-[#06180E] p-2 text-slate-300 border border-emerald-950">
                        <span className="truncate">Kojo Mensah</span>
                        <span className="text-rose-300 truncate">024 412 3456</span>
                        <span className="text-[#BEF264] truncate">GH₵18,500 (Wholesale)</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 bg-[#06180E] p-2 text-slate-300 border border-emerald-950">
                        <span className="truncate">Ama Serwaa Ent.</span>
                        <span className="text-rose-300 truncate">+233-55-987-6543</span>
                        <span className="text-[#BEF264] truncate">GH₵6,200 (Boutique)</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 bg-[#06180E] p-2 text-slate-300 border border-emerald-950">
                        <span className="truncate">Nana Osei</span>
                        <span className="text-rose-300 truncate">0208112233</span>
                        <span className="text-[#BEF264] truncate">GH₵24,000 (VIP Bulk)</span>
                      </div>
                    </div>

                    <div className="p-2.5 bg-[#BEF264]/10 border border-[#BEF264]/30 flex items-center justify-between text-xs">
                      <span className="text-[#BEF264] font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#BEF264]" />
                        Auto-Mapper: 100% matched to CRM fields
                      </span>
                      <span className="text-[10px] font-mono text-white">0 ERRORS</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 1: BEFORE / AFTER PHONE SANITIZER */}
              {activeRevenueStep === 1 && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* Before (Messy) */}
                    <div className="bg-[#06180E] border border-rose-900/40 p-3.5 space-y-2">
                      <span className="text-[10px] font-mono uppercase font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 border border-rose-800/60 inline-block">
                        ✕ Raw Input (Breaks Dialers)
                      </span>
                      <div className="space-y-1.5 font-mono text-xs text-rose-300/90 pt-1">
                        <div className="p-2 bg-[#0D2A1C]/50 border border-rose-900/30 line-through">024 412 3456</div>
                        <div className="p-2 bg-[#0D2A1C]/50 border border-rose-900/30 line-through">+233-55-987-6543</div>
                        <div className="p-2 bg-[#0D2A1C]/50 border border-rose-900/30 line-through">233208112233</div>
                      </div>
                      <p className="text-[10px] text-rose-400/80 font-mono pt-1">
                        Missing codes &amp; invalid spacing.
                      </p>
                    </div>

                    {/* After (Cleaned) */}
                    <div className="bg-[#06180E] border border-[#BEF264]/50 p-3.5 space-y-2">
                      <span className="text-[10px] font-mono uppercase font-bold text-[#BEF264] bg-[#BEF264]/10 px-2 py-0.5 border border-[#BEF264]/30 inline-block">
                        ✓ Simple CRM E.164 Cleaned
                      </span>
                      <div className="space-y-1.5 font-mono text-xs text-[#BEF264] pt-1">
                        <div className="p-2 bg-[#0D2A1C] border border-[#BEF264]/30 flex justify-between items-center">
                          <span>+233 24 412 3456</span>
                          <span className="text-[9px] bg-[#BEF264] text-[#0A1D13] font-bold px-1">READY</span>
                        </div>
                        <div className="p-2 bg-[#0D2A1C] border border-[#BEF264]/30 flex justify-between items-center">
                          <span>+233 55 987 6543</span>
                          <span className="text-[9px] bg-[#BEF264] text-[#0A1D13] font-bold px-1">READY</span>
                        </div>
                        <div className="p-2 bg-[#0D2A1C] border border-[#BEF264]/30 flex justify-between items-center">
                          <span>+233 20 811 2233</span>
                          <span className="text-[9px] bg-[#BEF264] text-[#0A1D13] font-bold px-1">READY</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-[#BEF264] font-mono pt-1">
                        1-click WhatsApp &amp; cellular dialable.
                      </p>
                    </div>

                  </div>
                </div>
              )}

              {/* STEP 2: PIPELINE KANBAN & GROUPS */}
              {activeRevenueStep === 2 && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="grid grid-cols-3 gap-2">
                    
                    {/* Column 1 */}
                    <div className="bg-[#06180E] border border-sky-800/40 p-2.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-sky-400 uppercase">New Lead</span>
                        <span className="text-[9px] bg-sky-950 text-sky-300 px-1 font-mono">14</span>
                      </div>
                      <div className="bg-[#0D2A1C] p-2 border border-sky-900/50 space-y-1 text-left">
                        <p className="text-xs font-bold text-white">Ama Serwaa</p>
                        <p className="text-[10px] text-[#8FA396]">GH₵6,200</p>
                        <span className="text-[9px] font-mono text-sky-300 bg-sky-950/80 px-1 block w-max">Boutique</span>
                      </div>
                    </div>

                    {/* Column 2 */}
                    <div className="bg-[#06180E] border border-amber-800/40 p-2.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">Quoted</span>
                        <span className="text-[9px] bg-amber-950 text-amber-300 px-1 font-mono">8</span>
                      </div>
                      <div className="bg-[#0D2A1C] p-2 border border-amber-900/50 space-y-1 text-left">
                        <p className="text-xs font-bold text-white">Nana Osei</p>
                        <p className="text-[10px] text-[#BEF264] font-bold">GH₵24,000</p>
                        <span className="text-[9px] font-mono text-amber-300 bg-amber-950/80 px-1 block w-max">Wholesale</span>
                      </div>
                    </div>

                    {/* Column 3 */}
                    <div className="bg-[#06180E] border border-[#BEF264]/40 p-2.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-[#BEF264] uppercase">Won Deal</span>
                        <span className="text-[9px] bg-[#BEF264] text-[#0A1D13] px-1 font-mono font-bold">28</span>
                      </div>
                      <div className="bg-[#0D2A1C] p-2 border border-[#BEF264]/40 space-y-1 text-left">
                        <p className="text-xs font-bold text-white">Kojo Mensah</p>
                        <p className="text-[10px] text-[#BEF264] font-bold">GH₵18,500</p>
                        <span className="text-[9px] font-mono text-[#0A1D13] bg-[#BEF264] px-1 font-bold block w-max">PAID ✓</span>
                      </div>
                    </div>

                  </div>

                  <div className="p-2.5 bg-[#06180E] border border-emerald-800/40 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Sliders className="w-3.5 h-3.5 text-[#BEF264]" />
                      <span>Filtered by: <b className="text-white font-mono">Wholesale &bull; Retail &bull; VIP</b></span>
                    </div>
                    <span className="text-[#BEF264] font-mono font-bold">Pipeline: GH₵148,700</span>
                  </div>
                </div>
              )}

              {/* STEP 3: 1-TAP WHATSAPP & CLOSING CARD */}
              {activeRevenueStep === 3 && (
                <div className="space-y-3.5 animate-in fade-in duration-200">
                  <div className="bg-[#06180E] border-2 border-[#BEF264] p-4 sm:p-5 text-white space-y-3.5">
                    <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-white">Kojo Mensah</h4>
                          <span className="text-[10px] font-mono font-bold uppercase bg-[#BEF264] text-[#0A1D13] px-1.5 py-0.5">
                            STAGE: WON DEAL
                          </span>
                        </div>
                        <p className="text-xs font-mono text-[#8FA396]">+233 24 412 3456 • Apex Supermarkets Hub</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-mono font-black text-[#BEF264]">GH₵18,500</span>
                        <p className="text-[10px] font-mono text-emerald-400">Order Confirmed</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="inline-flex items-center justify-center gap-1.5 bg-[#25D366] text-[#0A1D13] font-black text-xs py-2.5">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>1-Tap WhatsApp</span>
                      </div>
                      <div className="inline-flex items-center justify-center gap-1.5 bg-[#BEF264] text-[#0A1D13] font-black text-xs py-2.5">
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Call Client Now</span>
                      </div>
                    </div>

                    <div className="p-2.5 bg-[#0D2A1C] border border-emerald-800/40 text-xs flex items-center justify-between">
                      <span className="text-[#8FA396]">💬 Interaction Note: &quot;Payment verified via Mobile Money.&quot;</span>
                      <span className="text-[10px] font-mono text-[#BEF264]">LOGGED TODAY</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Progress Controls */}
            <div className="flex items-center justify-between pt-3 border-t border-emerald-800/60 relative z-10 text-xs font-mono">
              <span className="text-[#8FA396]">Click steps on the left or advance &rarr;</span>
              <button
                type="button"
                onClick={() => setActiveRevenueStep((prev) => (prev + 1) % 4)}
                className="inline-flex items-center gap-1.5 bg-[#BEF264] hover:bg-[#A3E635] text-[#0A1D13] font-bold px-3 py-1 text-xs cursor-pointer"
              >
                <span>Next Stage (0{(activeRevenueStep + 1) % 4 + 1})</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

          </div>

        </div>

        {/* 4-Pillar Pipeline Summary Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {[
            { step: "01", name: "Spreadsheet Ingest", sub: "Drop CSV / Excel" },
            { step: "02", name: "Data Sanitizer", sub: "Auto +233 standard" },
            { step: "03", name: "Visual Stages", sub: "Group & track deals" },
            { step: "04", name: "1-Tap Close", sub: "WhatsApp & call logs" }
          ].map((item, i) => (
            <div
              key={i}
              onClick={() => setActiveRevenueStep(i)}
              className={`p-3.5 border text-center transition-all cursor-pointer ${
                activeRevenueStep === i
                  ? "bg-[#BEF264] text-[#0A1D13] border-[#BEF264] font-bold"
                  : "bg-[#06180E] text-[#8FA396] border-emerald-900/60 hover:border-emerald-700 hover:text-white"
              }`}
            >
              <div className="text-[10px] font-mono uppercase tracking-widest font-bold">PILLAR {item.step}</div>
              <div className="text-xs sm:text-sm font-black text-white mt-0.5" style={{ color: activeRevenueStep === i ? "#0A1D13" : "inherit" }}>
                {item.name}
              </div>
              <div className="text-[11px] opacity-80 mt-0.5">{item.sub}</div>
            </div>
          ))}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 4. ASYMMETRIC BENTO FEATURE GRID (WITH UNSPLASH CONTEXT PHOTOS)           */}
      {/* ========================================================================= */}
      <section id="features" className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-[#BEF264] bg-[#BEF264]/10 border border-[#BEF264]/20 px-3 py-1 inline-block">
            Engineered for High-Conversion
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Everything You Need. Nothing You Don&apos;t.
          </h2>
          <p className="text-sm text-[#8FA396] max-w-xl mx-auto">
            Zero complex menus or multi-week software training. Just clear tools designed to help you sell more every single day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4">
          
          {/* Card 1: 7-Column Dark Pine - CSV Importer with Context Photo */}
          <div className="md:col-span-7 bg-[#0D2A1C] border border-emerald-800/50 p-6 sm:p-8 flex flex-col justify-between space-y-6 text-white hover:border-[#BEF264]/40 transition-colors">
            <div className="space-y-3">
              <div className="flex h-11 w-11 items-center justify-center bg-[#BEF264] text-[#0A1D13]">
                <Upload className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">
                Instant CSV Spreadsheet Importer
              </h3>
              <p className="text-xs sm:text-sm text-[#8FA396] leading-relaxed">
                Bring thousands of contacts into your workspace in under 30 seconds. The intelligent parser maps columns automatically, cleans names, and eliminates formatting errors before they touch your pipeline.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="relative h-32 w-full overflow-hidden border border-emerald-800/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=600&q=80"
                  alt="Retail customer records management"
                  className="w-full h-full object-cover brightness-90"
                />
                <div className="absolute bottom-1.5 left-1.5 bg-[#06180E]/90 px-2 py-0.5 text-[10px] font-mono text-[#BEF264] border border-emerald-800">
                  RETAIL LEADS
                </div>
              </div>

              <div className="bg-[#06180E] p-3 border border-emerald-800/40 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-[#8FA396] text-[10px]">
                  <span>COLUMN MAPPING</span>
                  <span className="text-[#BEF264] font-bold">100% OK</span>
                </div>
                <div className="space-y-1 text-slate-300 text-[11px]">
                  <div className="bg-[#0D2A1C] p-1.5 border border-emerald-800/40">✓ Name &rarr; Client</div>
                  <div className="bg-[#0D2A1C] p-1.5 border border-emerald-800/40">✓ Phone &rarr; +233...</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: 5-Column Vibrant Lime - 1-Tap WhatsApp & Calls */}
          <div className="md:col-span-5 bg-[#BEF264] text-[#0A1D13] border border-[#BEF264] p-6 sm:p-8 flex flex-col justify-between space-y-6 transition-colors">
            <div className="space-y-3">
              <div className="flex h-11 w-11 items-center justify-center bg-[#0A1D13] text-[#BEF264]">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-black tracking-tight">
                1-Tap WhatsApp &amp; Quick Calls
              </h3>
              <p className="text-xs sm:text-sm text-[#0A1D13]/85 font-medium leading-relaxed">
                Connect with prospects in one click. Open direct WhatsApp conversations or dial numbers on your phone without copy-pasting numbers.
              </p>
            </div>

            <div className="bg-[#0A1D13] text-white p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#BEF264] font-bold">Speed to Lead</span>
                <span className="text-[11px] text-[#8FA396]">35% Faster Conversions</span>
              </div>
              <div className="flex gap-2 pt-1">
                <div className="flex-1 bg-[#25D366] text-[#0A1D13] font-bold text-center py-2 text-xs flex items-center justify-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </div>
                <div className="flex-1 bg-white text-[#0A1D13] font-bold text-center py-2 text-xs flex items-center justify-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Now</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: 5-Column Cream - Custom Pipeline Stages */}
          <div className="md:col-span-5 bg-[#F4F9F4] text-[#0A1D13] border border-[#D1E3D5] p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex h-11 w-11 items-center justify-center bg-emerald-800 text-white">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                Customizable Pipeline Stages
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tailor your sales funnel to your exact business cycle. Add stages, rename them, choose colors, and filter deals instantly.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-3 py-1 text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
                New Lead (12)
              </span>
              <span className="px-3 py-1 text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                Price Quoted (8)
              </span>
              <span className="px-3 py-1 text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                Follow-up (5)
              </span>
              <span className="px-3 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Won &amp; Paid (24)
              </span>
            </div>
          </div>

          {/* Card 4: 7-Column Dark Pine - Timeline & Distribution Context */}
          <div className="md:col-span-7 bg-[#0D2A1C] border border-emerald-800/50 p-6 sm:p-8 flex flex-col justify-between space-y-6 text-white hover:border-[#BEF264]/40 transition-colors">
            <div className="space-y-3">
              <div className="flex h-11 w-11 items-center justify-center bg-[#BEF264] text-[#0A1D13]">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">
                Chronological Call &amp; Note Timeline
              </h3>
              <p className="text-xs sm:text-sm text-[#8FA396] leading-relaxed">
                Keep the complete history of every customer in one place. Record conversation outcomes (Interested, Callback, Closed) so your team never forgets what was promised.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="bg-[#06180E] p-3.5 border border-emerald-800/40 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[10px] text-[#8FA396]">
                  <span className="font-bold text-emerald-300">TODAY &bull; 10:45 AM</span>
                  <span className="px-1.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-mono">INTERESTED</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  &quot;Client confirmed Mobile Money transfer. Delivery scheduled for tomorrow morning.&quot;
                </p>
              </div>

              <div className="relative h-28 w-full overflow-hidden border border-emerald-800/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80"
                  alt="Wholesale supplies and distribution order fulfillment"
                  className="w-full h-full object-cover brightness-90"
                />
                <div className="absolute bottom-1.5 left-1.5 bg-[#06180E]/90 px-2 py-0.5 text-[10px] font-mono text-[#BEF264] border border-emerald-800">
                  ORDER FULFILLED
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. EDITORIAL CUSTOMER TESTIMONIAL BLOCK (WITH UNSPLASH HEADSHOT)          */}
      {/* ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-[#F4F9F4] border border-[#D1E3D5] p-8 sm:p-14 text-[#0A1D13] relative overflow-hidden space-y-6">
          
          {/* Oversized Quote Mark Glyph Watermark */}
          <div className="text-[#BEF264] text-9xl font-serif font-black select-none pointer-events-none absolute -top-8 -left-2 opacity-60 leading-none">
            &ldquo;
          </div>

          <div className="relative z-10 space-y-4">
            <p className="text-lg sm:text-2xl font-extrabold text-[#0A1D13] leading-snug">
              &quot;We replaced our 700-row Google Sheet with Simple CRM in less than 2 minutes. Our sales reps now respond to WhatsApp inquiries in seconds instead of digging through tabs. We closed 38% more wholesale orders in our first month and saved at least 12 hours of manual entry every week.&quot;
            </p>
          </div>

          <div className="relative z-10 pt-4 border-t border-[#D1E3D5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 overflow-hidden border border-slate-300 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80"
                  alt="Kofi Mensah, Managing Director at Apex Distribution & Wholesale Hub"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-extrabold text-slate-900">Kofi Mensah</p>
                <p className="text-xs text-slate-600 font-medium">Managing Director, Apex Distribution Hub</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono font-bold">
              <span className="bg-emerald-200/80 text-emerald-900 px-2.5 py-1">
                ⚡ 12 hrs/wk saved
              </span>
              <span className="bg-emerald-200/80 text-emerald-900 px-2.5 py-1">
                📈 +38% close rate
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. COMPARISON MATRIX (EXCEL VS ENTERPRISE CRM VS SIMPLE CRM)              */}
      {/* ========================================================================= */}
      <section id="compare" className="max-w-5xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-[#BEF264] bg-[#BEF264]/10 border border-[#BEF264]/20 px-3 py-1 inline-block">
            Honest Comparison
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Why Businesses Switch from Spreadsheets
          </h2>
          <p className="text-sm text-[#8FA396] max-w-lg mx-auto">
            Spreadsheets break easily. Enterprise CRMs cost thousands and require training. Simple CRM gives you clarity in 60 seconds.
          </p>
        </div>

        <div className="border border-emerald-800/50 bg-[#0D2A1C] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#06180E] border-b border-emerald-900/60 text-slate-300 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-4 px-5 sm:px-6">Workflow Feature</th>
                  <th className="py-4 px-4 text-[#8FA396]">Excel / Google Sheets</th>
                  <th className="py-4 px-4 text-[#8FA396]">Enterprise CRMs</th>
                  <th className="py-4 px-5 sm:px-6 bg-[#BEF264]/15 text-[#BEF264] font-black border-l border-emerald-700/50">Simple CRM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/40 text-slate-300">
                <tr className="hover:bg-[#06180E]/40 transition-colors">
                  <td className="py-4 px-5 sm:px-6 font-bold text-white">Setup &amp; Onboarding Time</td>
                  <td className="py-4 px-4 text-rose-400">Hours of manual formatting</td>
                  <td className="py-4 px-4 text-rose-400">3–8 weeks consultant setup</td>
                  <td className="py-4 px-5 sm:px-6 bg-[#BEF264]/10 font-bold text-[#BEF264] border-l border-emerald-700/50">Under 60 seconds (Drop CSV &amp; go)</td>
                </tr>
                <tr className="hover:bg-[#06180E]/40 transition-colors">
                  <td className="py-4 px-5 sm:px-6 font-bold text-white">1-Tap WhatsApp &amp; Calls</td>
                  <td className="py-4 px-4 text-rose-400">✕ Manual copy-pasting</td>
                  <td className="py-4 px-4 text-amber-400">⚠️ Paid add-on plugins</td>
                  <td className="py-4 px-5 sm:px-6 bg-[#BEF264]/10 font-bold text-[#BEF264] border-l border-emerald-700/50">✓ Built-in 1-tap dialer &amp; WhatsApp</td>
                </tr>
                <tr className="hover:bg-[#06180E]/40 transition-colors">
                  <td className="py-4 px-5 sm:px-6 font-bold text-white">Phone Standardizer (+233 &amp; Global)</td>
                  <td className="py-4 px-4 text-rose-400">✕ Formats break easily</td>
                  <td className="py-4 px-4 text-amber-400">⚠️ Complex regex rules</td>
                  <td className="py-4 px-5 sm:px-6 bg-[#BEF264]/10 font-bold text-[#BEF264] border-l border-emerald-700/50">✓ Automatic E.164 cleaning</td>
                </tr>
                <tr className="hover:bg-[#06180E]/40 transition-colors">
                  <td className="py-4 px-5 sm:px-6 font-bold text-white">Pipeline Stages &amp; Follow-up Alerts</td>
                  <td className="py-4 px-4 text-rose-400">✕ Static rows; leads forgotten</td>
                  <td className="py-4 px-4 text-amber-400">⚠️ 100+ confusing menus</td>
                  <td className="py-4 px-5 sm:px-6 bg-[#BEF264]/10 font-bold text-[#BEF264] border-l border-emerald-700/50">✓ Clear color-coded stages</td>
                </tr>
                <tr className="hover:bg-[#06180E]/40 transition-colors">
                  <td className="py-4 px-5 sm:px-6 font-bold text-white">Learning Curve for Team</td>
                  <td className="py-4 px-4">Formula errors occur</td>
                  <td className="py-4 px-4 text-rose-400">Steep (Requires training)</td>
                  <td className="py-4 px-5 sm:px-6 bg-[#BEF264]/10 font-bold text-[#BEF264] border-l border-emerald-700/50">✓ Zero training needed</td>
                </tr>
                <tr className="hover:bg-[#06180E]/40 transition-colors">
                  <td className="py-4 px-5 sm:px-6 font-bold text-white">Monthly Cost</td>
                  <td className="py-4 px-4">Free (costs lost deals)</td>
                  <td className="py-4 px-4 text-rose-400">$50–$300 / user / mo</td>
                  <td className="py-4 px-5 sm:px-6 bg-[#BEF264]/10 font-bold text-[#BEF264] border-l border-emerald-700/50">Free forever tier</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. HIGH-CONTRAST ACCORDION FAQ                                            */}
      {/* ========================================================================= */}
      <section id="faq" className="max-w-3xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-[#BEF264] bg-[#BEF264]/10 border border-[#BEF264]/20 px-3 py-1 inline-block">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Got Questions? We&apos;ve Got Answers.
          </h2>
          <p className="text-sm text-[#8FA396]">
            Everything you need to know about setting up and running Simple CRM.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className={`border transition-colors ${
                  isOpen
                    ? "bg-[#0D2A1C] border-[#BEF264]/40"
                    : "bg-[#0A1D13] border-emerald-900/50 hover:border-emerald-800"
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between p-5 text-left text-xs sm:text-sm font-bold text-white hover:text-[#BEF264] transition-colors"
                >
                  <span className="pr-4">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#BEF264] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#8FA396] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#8FA396] leading-relaxed border-t border-emerald-900/60 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. GIANT LETTERMARK BRAND WATERMARK & FINAL CTA FOOTER                    */}
      {/* ========================================================================= */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-[#BEF264] text-[#0A1D13] p-8 sm:p-14 text-center relative overflow-hidden border border-[#BEF264] space-y-6">
          
          {/* Giant Background Lettermark Watermark "S" */}
          <div className="text-[#0A1D13] text-[180px] sm:text-[260px] font-black select-none pointer-events-none absolute -bottom-20 -right-8 opacity-10 leading-none">
            S
          </div>

          <div className="relative z-10 space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0A1D13] leading-tight">
              Start Closing Leads in Under 60 Seconds.
            </h2>
            <p className="text-xs sm:text-base text-[#0A1D13]/85 font-medium leading-relaxed">
              Join hundreds of shop owners, traders, and fast-growing teams who replaced spreadsheet chaos with Simple CRM.
            </p>
          </div>

          <div className="pt-2 relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={user ? "/dashboard" : "/login?mode=signup"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0A1D13] hover:bg-[#06180E] text-white font-extrabold px-9 py-4 text-sm sm:text-base transition-all active:scale-[0.99]"
            >
              <span>{user ? "Open Your Dashboard" : "Create Free Account Now"}</span>
              <ArrowRight className="w-4 h-4 text-[#BEF264]" />
            </Link>
          </div>

          <p className="text-[11px] text-[#0A1D13]/70 font-semibold relative z-10">
            No credit card required • Instant CSV spreadsheet upload • Free forever tier
          </p>
        </div>
      </section>

    </div>
  );
}
