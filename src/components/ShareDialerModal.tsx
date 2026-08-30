"use client";

import React, { useState, useEffect } from "react";
import { 
  ContactGroupWithCount, 
  PipelineStage 
} from "@/types/crm";
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  PhoneCall, 
  Users, 
  Sparkles,
  Smartphone,
  QrCode
} from "lucide-react";

interface ShareDialerModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: ContactGroupWithCount | { id: string; name: string; contactCount: number } | null;
  stages: PipelineStage[];
}

export function ShareDialerModal({
  isOpen,
  onClose,
  group,
  stages
}: ShareDialerModalProps) {
  const [copied, setCopied] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [baseUrl, setBaseUrl] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
  }, []);

  if (!isOpen || !group) return null;

  const queueUrl = `${baseUrl}/dial/${group.id}${
    statusFilter !== "All" ? `?status=${encodeURIComponent(statusFilter)}` : ""
  }`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(queueUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border-2 border-slate-300 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 bg-[#0A1D13] text-white border-b border-[#0A1D13]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center bg-[#BEF264] text-[#0A1D13] font-black">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-[#BEF264] tracking-wider">
                  AGENT SPEED-DIALER
                </span>
              </div>
              <h2 className="text-base font-black text-white tracking-tight">
                Share Follow-Up Calling Link
              </h2>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          
          {/* Group Overview Banner */}
          <div className="flex items-center justify-between p-4 bg-[#F8FAF8] border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center bg-[#0A1D13] text-[#BEF264] font-black text-sm border border-[#0A1D13]">
                {group.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 truncate">
                  {group.name}
                </h3>
                <p className="text-xs text-slate-500 font-bold">
                  {group.contactCount} contact{group.contactCount === 1 ? "" : "s"} ready in queue
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 bg-[#E2EFE4] text-[#0A1D13] border border-[#C5DDC9] px-2.5 py-1 text-xs font-bold uppercase">
              <Smartphone className="w-3.5 h-3.5 text-[#0A1D13]" />
              Mobile Ready
            </span>
          </div>

          {/* Optional Stage Filter */}
          <div className="space-y-1.5">
            <label className="text-xs uppercase font-bold text-slate-700 block">
              Optional Filter by Stage
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs font-bold border border-slate-300 p-2.5 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13] uppercase cursor-pointer"
            >
              <option value="All">All Contacts in Group ({group.contactCount})</option>
              {stages.map((st) => (
                <option key={st.id} value={st.name}>
                  Only &quot;{st.name}&quot; Leads
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 font-medium">
              Filter leads so your agent only works on specific stages (e.g. &quot;New Lead&quot; or &quot;Follow-up Needed&quot;).
            </p>
          </div>

          {/* Shareable Link Box */}
          <div className="space-y-2">
            <label className="text-xs uppercase font-bold text-slate-700 block">
              Shareable Queue URL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={queueUrl}
                className="flex-1 text-xs font-bold border border-slate-300 p-2.5 bg-[#F8FAF8] text-slate-800 select-all"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-black transition-all cursor-pointer border ${
                  copied
                    ? "bg-[#0A1D13] text-[#BEF264] border-[#0A1D13]"
                    : "bg-[#BEF264] hover:bg-[#A3E635] text-[#0A1D13] border-[#BEF264]"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* How It Works Checklist */}
          <div className="p-4 bg-[#F4F9F4] border border-[#C5DDC9] space-y-2 text-xs text-slate-800">
            <div className="font-bold text-[#0A1D13] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#0A1D13]" />
              <span>How your customer agent uses this:</span>
            </div>
            <ul className="space-y-1.5 list-disc list-inside text-slate-700 font-medium">
              <li>Open link on their smartphone (no app installation needed).</li>
              <li>1-tap to **Call**, **WhatsApp**, or **SMS** each customer.</li>
              <li>Log call outcome &amp; notes, then tap **Save &amp; Next** to advance.</li>
              <li>All call outcomes and notes sync in real-time to your CRM dashboard.</li>
            </ul>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-200 bg-[#F8FAF8]">
          <a
            href={queueUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A1D13] hover:underline"
          >
            <span>Open &amp; Test Dialer Tab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="bg-[#0A1D13] text-[#BEF264] px-5 py-2 text-xs font-bold hover:bg-black transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
