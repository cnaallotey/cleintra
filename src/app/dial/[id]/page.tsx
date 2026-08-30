"use client";

import React, { useState, useEffect, useMemo, use } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Contact, 
  PipelineStage, 
  InteractionOutcome, 
  DialerQueueResponse 
} from "@/types/crm";
import { 
  getDialerQueue, 
  logDialerInteraction, 
  getPipelineStages,
  getContactInteractions
} from "@/lib/contacts-store";
import { 
  Phone, 
  PhoneCall, 
  PhoneForwarded, 
  PhoneMissed, 
  Mail, 
  MessageSquare, 
  MessageCircle, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  SkipForward, 
  Sparkles, 
  Tag, 
  Clock, 
  History, 
  ArrowLeft, 
  Trophy, 
  User, 
  FileText, 
  AlertCircle,
  ExternalLink,
  Smartphone,
  CheckCircle2,
  RefreshCw
} from "lucide-react";
import { StageBadge } from "@/components/StageBadge";

const OUTCOMES: { value: InteractionOutcome; label: string; icon: any; color: string }[] = [
  {
    value: "Call - Connected",
    label: "Connected / Spoke",
    icon: PhoneCall,
    color: "bg-[#E2EFE4] text-[#0A1D13] border-[#C5DDC9] hover:bg-[#cbe2cd]"
  },
  {
    value: "Call - Left Voicemail",
    label: "Left Voicemail / Audio",
    icon: PhoneForwarded,
    color: "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
  },
  {
    value: "Call - No Answer",
    label: "No Answer / Busy",
    icon: PhoneMissed,
    color: "bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100"
  },
  {
    value: "Email Sent",
    label: "Email / Quote Sent",
    icon: Mail,
    color: "bg-sky-50 text-sky-800 border-sky-300 hover:bg-sky-100"
  },
  {
    value: "Meeting / Discussion",
    label: "Meeting / Follow-up Booked",
    icon: MessageSquare,
    color: "bg-purple-50 text-purple-800 border-purple-300 hover:bg-purple-100"
  },
  {
    value: "Note / Other",
    label: "Note / Other",
    icon: FileText,
    color: "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
  }
];

export default function SpeedDialerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const queueId = resolvedParams.id;
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status") || "All";

  const [queueData, setQueueData] = useState<DialerQueueResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Form State for Active Lead
  const [selectedOutcome, setSelectedOutcome] = useState<InteractionOutcome>("Call - Connected");
  const [nextStage, setNextStage] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [sessionCompletedCount, setSessionCompletedCount] = useState(0);
  const [isQueueComplete, setIsQueueComplete] = useState(false);

  const loadQueue = () => {
    if (queueId) {
      const response = getDialerQueue(queueId, {
        statusFilter: statusFilter !== "All" ? statusFilter : undefined
      });
      setQueueData(response);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, [queueId, statusFilter]);

  const currentContact: Contact | undefined = queueData?.contacts[currentIndex];

  // Sync initial form values when currentContact changes
  useEffect(() => {
    if (currentContact) {
      setNextStage(currentContact.status);
      setSelectedOutcome("Call - Connected");
      setNotes("");
      setSaveSuccess(false);
    }
  }, [currentIndex, currentContact]);

  // Clean phone number for WhatsApp (e.g. 0244... -> 233244...)
  const whatsappNumber = useMemo(() => {
    if (!currentContact?.phone) return null;
    const digits = currentContact.phone.replace(/[^0-9]/g, "");
    if (digits.startsWith("0") && digits.length === 10) {
      return `233${digits.substring(1)}`;
    }
    return digits;
  }, [currentContact]);

  const handleSaveAndNext = () => {
    if (!currentContact) return;
    setIsSubmitting(true);

    try {
      logDialerInteraction({
        contactId: currentContact.id,
        outcome: selectedOutcome,
        newStatus: nextStage !== currentContact.status ? nextStage : undefined,
        notes: notes.trim() ? notes.trim() : undefined,
        date: new Date().toISOString()
      });

      setSaveSuccess(true);
      setSessionCompletedCount((prev) => prev + 1);

      // Short visual confirmation before moving to next lead
      setTimeout(() => {
        if (queueData && currentIndex + 1 < queueData.contacts.length) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          setIsQueueComplete(true);
        }
        setIsSubmitting(false);
      }, 400);

    } catch (err) {
      alert("Failed to log interaction. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    if (queueData && currentIndex + 1 < queueData.contacts.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsQueueComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleRestartQueue = () => {
    loadQueue();
    setCurrentIndex(0);
    setIsQueueComplete(false);
    setSessionCompletedCount(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAF8] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center bg-[#0A1D13] text-[#BEF264] mx-auto border border-[#0A1D13] animate-pulse">
            <PhoneCall className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Loading speed-dialer queue...
          </p>
        </div>
      </div>
    );
  }

  // Invalid queue state
  if (!queueData || queueData.queueTitle === "Queue Not Found") {
    return (
      <div className="min-h-screen bg-[#F8FAF8] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border-2 border-slate-300 p-8 text-center space-y-4">
          <div className="flex h-14 w-14 items-center justify-center bg-rose-100 text-rose-800 mx-auto border border-rose-200">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-black text-slate-900">Calling Queue Not Found</h2>
          <p className="text-xs text-slate-600 font-medium">
            This contact group link may have expired or been removed by your administrator.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-[#0A1D13] text-[#BEF264] px-5 py-2.5 text-xs font-black hover:bg-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  // Empty queue state
  if (queueData.contacts.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAF8] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border-2 border-slate-300 p-8 text-center space-y-4">
          <div className="flex h-14 w-14 items-center justify-center bg-[#0A1D13] text-[#BEF264] mx-auto border border-[#0A1D13]">
            <PhoneCall className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-black text-slate-900">{queueData.queueTitle}</h2>
          <p className="text-xs text-slate-600 font-medium">
            There are currently no contacts in this queue matching your filter criteria ({statusFilter}).
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-[#BEF264] hover:bg-[#A3E635] text-[#0A1D13] border border-[#BEF264] px-5 py-2.5 text-xs font-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#0A1D13]" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  // Completed queue celebration screen
  if (isQueueComplete) {
    return (
      <div className="min-h-screen bg-[#F8FAF8] flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-white border-2 border-slate-300 overflow-hidden space-y-6">
          
          {/* Header Banner */}
          <div className="bg-[#0A1D13] text-white p-6 text-center border-b border-[#0A1D13] space-y-2">
            <div className="flex h-16 w-16 items-center justify-center bg-[#BEF264] text-[#0A1D13] mx-auto border border-[#BEF264]">
              <Trophy className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-black text-white tracking-tight uppercase">
              Queue Completed! 🎉
            </h1>
            <p className="text-xs text-emerald-200 font-medium">
              You have completed all follow-up leads in this session.
            </p>
          </div>

          {/* Session Statistics */}
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-4 bg-[#F8FAF8] border border-slate-200">
                <div className="text-[10px] font-bold uppercase text-slate-500">Leads Processed</div>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {sessionCompletedCount} / {queueData.totalLeads}
                </div>
              </div>
              <div className="p-4 bg-[#E2EFE4] border border-[#C5DDC9]">
                <div className="text-[10px] font-bold uppercase text-[#0A1D13]">Status</div>
                <div className="text-2xl font-black text-[#0A1D13] mt-1">
                  100% DONE
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 text-center font-medium">
              All interaction notes and stage updates have been saved to the CRM in real-time.
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={handleRestartQueue}
                className="w-full flex items-center justify-center gap-2 bg-[#BEF264] hover:bg-[#A3E635] text-[#0A1D13] border border-[#BEF264] py-3 text-xs font-black cursor-pointer transition-colors"
              >
                <RefreshCw className="w-4 h-4 text-[#0A1D13]" />
                <span>Review or Restart Queue</span>
              </button>

              <Link
                href="/dashboard"
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 py-3 text-xs font-bold transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-slate-600" />
                <span>Return to CRM Dashboard</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    );
  }

  const progressPercentage = Math.round(((currentIndex + 1) / queueData.totalLeads) * 100);

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-slate-900 flex flex-col selection:bg-[#BEF264] selection:text-[#0A1D13]">
      
      {/* Top Mobile Sticky Header */}
      <header className="sticky top-0 z-30 bg-[#0A1D13] text-white border-b border-[#0A1D13] shadow-xs">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Link
              href="/dashboard"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Exit Speed-Dialer"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] uppercase font-bold text-[#BEF264] tracking-wider">
                  SPEED-DIALER
                </span>
                {statusFilter !== "All" && (
                  <span className="text-[9px] uppercase font-bold bg-white/10 px-1.5 py-0.2 text-slate-200">
                    {statusFilter}
                  </span>
                )}
              </div>
              <h1 className="text-xs sm:text-sm font-black text-white truncate">
                {queueData.queueTitle}
              </h1>
            </div>
          </div>

          {/* Lead Counter Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-black bg-[#BEF264] text-[#0A1D13] px-2.5 py-1 border border-[#BEF264]">
              {currentIndex + 1} / {queueData.totalLeads}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-emerald-950 h-1.5 overflow-hidden">
          <div 
            className="bg-[#BEF264] h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </header>

      {/* Main Dialer Screen */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 space-y-4">
        
        {currentContact && (
          <div className="bg-white border-2 border-slate-300 space-y-5 animate-in fade-in duration-150">
            
            {/* Contact Details Header Box */}
            <div className="p-5 sm:p-6 bg-white border-b border-slate-200 space-y-4">
              
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex h-12 w-12 items-center justify-center bg-[#0A1D13] text-[#BEF264] font-black text-lg shrink-0 border border-[#0A1D13]">
                    {currentContact.name ? currentContact.name.charAt(0).toUpperCase() : "?"}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
                      {currentContact.name || "Unnamed Contact"}
                    </h2>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <StageBadge status={currentContact.status} size="sm" />
                      {currentContact.source && (
                        <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 border border-slate-300 uppercase">
                          <Tag className="w-2.5 h-2.5 text-slate-500" />
                          {currentContact.source}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Direct Link to Contact Record */}
                <Link
                  href={`/contacts/${currentContact.id}`}
                  target="_blank"
                  className="p-2 text-slate-400 hover:text-black hover:bg-slate-100 transition-colors shrink-0"
                  title="View Full Profile"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>

              {/* Phone & Email Display Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                <div className="p-2.5 bg-[#F8FAF8] border border-slate-200 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Phone</span>
                  <span className="font-black text-slate-900 text-sm">
                    {currentContact.phone || "No phone"}
                  </span>
                </div>
                <div className="p-2.5 bg-[#F8FAF8] border border-slate-200 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Last Contact</span>
                  <span className="font-bold text-slate-700">
                    {currentContact.lastContactedAt 
                      ? new Date(currentContact.lastContactedAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short"
                        })
                      : "Never"}
                  </span>
                </div>
              </div>

              {/* Notes Context */}
              {currentContact.notes && (
                <div className="p-3 bg-[#F4F9F4] border border-[#C5DDC9] text-xs text-slate-800 font-medium">
                  <span className="text-[10px] font-bold uppercase text-[#0A1D13] block mb-0.5">
                    Lead Context / Initial Notes:
                  </span>
                  {currentContact.notes}
                </div>
              )}
            </div>

            {/* 1-Tap Action Deck */}
            <div className="px-5 sm:px-6 space-y-2">
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                1-Tap Direct Outreach
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                
                {/* 1. Call Button */}
                {currentContact.phone ? (
                  <a
                    href={`tel:${currentContact.phone}`}
                    className="flex items-center justify-center gap-2 bg-[#0A1D13] hover:bg-black text-[#BEF264] border border-[#0A1D13] py-3.5 px-4 text-xs font-black active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4 text-[#BEF264]" />
                    <span>Call Phone</span>
                  </a>
                ) : (
                  <button disabled className="opacity-40 py-3.5 px-4 text-xs font-bold border border-slate-200">
                    No Phone
                  </button>
                )}

                {/* 2. WhatsApp Button */}
                {whatsappNumber ? (
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-[#0A1D13] border border-[#25D366] py-3.5 px-4 text-xs font-black active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-[#0A1D13]" />
                    <span>WhatsApp</span>
                  </a>
                ) : null}

                {/* 3. SMS Button */}
                {currentContact.phone ? (
                  <a
                    href={`sms:${currentContact.phone}`}
                    className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white border border-slate-800 py-3.5 px-4 text-xs font-bold active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send SMS</span>
                  </a>
                ) : null}

              </div>
            </div>

            {/* Outcome & Logging Section */}
            <div className="px-5 sm:px-6 space-y-4 pt-2 border-t border-slate-200">
              
              {/* Call Result Outcome Selector */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-700 block">
                  Select Call / Outreach Result <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {OUTCOMES.map((item) => {
                    const Icon = item.icon;
                    const isSelected = selectedOutcome === item.value;
                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setSelectedOutcome(item.value)}
                        className={`flex items-center gap-2 p-2.5 text-xs font-bold border transition-all text-left cursor-pointer ${
                          isSelected
                            ? "bg-[#0A1D13] text-[#BEF264] border-[#0A1D13] ring-1 ring-[#0A1D13]"
                            : item.color
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-[#BEF264]" : ""}`} />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Next Stage Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-700 block">
                  Move Contact to Stage
                </label>
                <select
                  value={nextStage}
                  onChange={(e) => setNextStage(e.target.value)}
                  className="w-full text-xs font-bold border border-slate-300 p-2.5 bg-[#F8FAF8] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13] uppercase cursor-pointer"
                >
                  {queueData.stages.map((st) => (
                    <option key={st.id} value={st.name}>
                      {st.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Notes */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-700 block">
                  Call Notes &amp; Follow-up Details <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Spoke with Kofi. Wants catalog sent on WhatsApp. Follow up on Monday."
                  className="w-full text-xs font-medium border border-slate-300 p-2.5 bg-[#F8FAF8] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13]"
                />
              </div>

            </div>

            {/* Stepper Footer Action Bar */}
            <div className="p-4 sm:p-5 bg-[#F8FAF8] border-t border-slate-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0 || isSubmitting}
                  className="px-3 py-2.5 text-xs font-bold border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Previous lead"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleSkip}
                  disabled={isSubmitting}
                  className="px-3.5 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors"
                >
                  <span>Skip</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleSaveAndNext}
                disabled={isSubmitting}
                className={`inline-flex items-center gap-2 px-6 py-2.5 text-xs font-black transition-all cursor-pointer border ${
                  saveSuccess
                    ? "bg-[#0A1D13] text-[#BEF264] border-[#0A1D13]"
                    : "bg-[#BEF264] hover:bg-[#A3E635] text-[#0A1D13] border-[#BEF264]"
                }`}
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Saved! Next &rarr;</span>
                  </>
                ) : (
                  <>
                    <span>Submit &amp; Next Lead</span>
                    <ChevronRight className="w-4 h-4 text-[#0A1D13]" />
                  </>
                )}
              </button>
            </div>

          </div>
        )}

      </main>

    </div>
  );
}
