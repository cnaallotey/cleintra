"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Contact, 
  PipelineStage, 
  Interaction, 
  ContactGroup,
  StageColor 
} from "@/types/crm";
import { 
  getContactById, 
  getPipelineStages, 
  updateContactStage, 
  getContactInteractions,
  getContactGroups,
  updateContactGroupAssignment
} from "@/lib/contacts-store";
import { 
  Phone, 
  Mail, 
  Calendar, 
  User, 
  Tag, 
  ArrowLeft, 
  Copy, 
  Check, 
  MessageCircle, 
  ExternalLink,
  ChevronDown,
  Clock,
  History,
  FileText,
  Folder
} from "lucide-react";
import { StageBadge } from "@/components/StageBadge";
import { InteractionTimeline } from "@/components/InteractionTimeline";
import { AuthGuard } from "@/components/AuthGuard";
import { ContactDetailSkeleton } from "@/components/Skeletons";

export default function ContactDetailPage() {
  const params = useParams();
  const router = useRouter();
  const contactId = params?.id as string;

  const [contact, setContact] = useState<Contact | null>(null);
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [groups, setGroups] = useState<ContactGroup[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  const loadData = () => {
    if (contactId) {
      const found = getContactById(contactId);
      const loadedStages = getPipelineStages();
      const loadedGroups = getContactGroups();
      const loadedInteractions = getContactInteractions(contactId);
      setContact(found);
      setStages(loadedStages);
      setGroups(loadedGroups);
      setInteractions(loadedInteractions);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [contactId]);

  const handleCopyPhone = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleStageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStage = e.target.value;
    if (!contact) return;

    const updated = updateContactStage(contact.id, newStage);
    if (updated) {
      setContact(updated);
      setStatusNotification(`Stage updated to "${newStage}"`);
      setTimeout(() => setStatusNotification(null), 3500);
    }
  };

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGroupId = e.target.value === "" ? null : e.target.value;
    if (!contact) return;

    const updated = updateContactGroupAssignment(contact.id, newGroupId);
    if (updated) {
      setContact(updated);
      const groupName = groups.find((g) => g.id === newGroupId)?.name || "Unassigned";
      setStatusNotification(`Group updated to "${groupName}"`);
      setTimeout(() => setStatusNotification(null), 3500);
    }
  };

  const handleInteractionsChanged = (updatedContact: Contact) => {
    setContact(updatedContact);
    setInteractions(getContactInteractions(contactId));
  };

  if (loading) {
    return <ContactDetailSkeleton />;
  }

  if (!contact) {
    return (
      <AuthGuard>
        <div className="bg-white p-10 text-center border-2 border-slate-300 max-w-md mx-auto my-8">
          <div className="flex h-14 w-14 items-center justify-center bg-slate-100 text-slate-400 mx-auto mb-4 border border-slate-200">
            <User className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Contact Not Found</h2>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            This contact record could not be found or may have been removed.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-[#0A1D13] text-[#BEF264] px-5 py-2.5 text-sm font-bold hover:bg-black transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Contacts</span>
          </Link>
        </div>
      </AuthGuard>
    );
  }

  const formattedDate = contact.createdAt 
    ? new Date(contact.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
      })
    : "—";

  const formattedLastContacted = contact.lastContactedAt
    ? new Date(contact.lastContactedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    : "Never contacted";

  // Clean and format phone number for WhatsApp URL (convert 024... -> 23324...)
  let whatsappNumber: string | null = null;
  if (contact.phone) {
    const digits = contact.phone.replace(/[^0-9]/g, "");
    if (digits.startsWith("0") && digits.length === 10) {
      whatsappNumber = `233${digits.substring(1)}`;
    } else if (digits.startsWith("233")) {
      whatsappNumber = digits;
    } else {
      whatsappNumber = digits;
    }
  }

  const assignedGroupName = groups.find((g) => g.id === contact.groupId)?.name;

  return (
    <AuthGuard>
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
        
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold font-mono uppercase text-slate-700 hover:text-[#0A1D13] transition-colors py-1.5 px-2.5 bg-white border border-slate-300 hover:border-slate-400"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Contacts</span>
          </Link>

          {statusNotification && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0A1D13] text-[#BEF264] text-xs font-mono font-bold uppercase animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>{statusNotification}</span>
            </div>
          )}
        </div>

        {/* Main Profile Header Card */}
        <div className="bg-white p-6 sm:p-8 border border-slate-300 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center bg-[#0A1D13] text-[#BEF264] font-black text-2xl shrink-0 border border-[#0A1D13]">
                {contact.name ? contact.name.charAt(0).toUpperCase() : "?"}
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight truncate">
                  {contact.name || "Unnamed Contact"}
                </h1>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  {/* Lead Source Badge */}
                  {contact.source && (
                    <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 text-xs font-mono font-bold text-slate-700 border border-slate-300 uppercase">
                      <Tag className="w-3 h-3 text-slate-500" />
                      {contact.source}
                    </span>
                  )}
                  {/* Group Badge */}
                  {assignedGroupName && (
                    <span className="inline-flex items-center gap-1 bg-[#E2EFE4] px-2 py-0.5 text-xs font-mono font-bold text-[#0A1D13] border border-[#C5DDC9] uppercase">
                      <Folder className="w-3 h-3 text-[#0A1D13]" />
                      {assignedGroupName}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Stage Selector Dropdown */}
            <div className="flex flex-col sm:items-end gap-1">
              <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                Pipeline Stage
              </label>
              <div className="relative">
                <select
                  value={contact.status}
                  onChange={handleStageChange}
                  className="w-full sm:w-auto border border-slate-300 bg-white py-2 pl-3.5 pr-8 text-xs font-bold text-slate-900 hover:border-slate-400 focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13] appearance-none cursor-pointer font-mono uppercase"
                >
                  {stages.map((st) => (
                    <option key={st.id} value={st.name}>
                      {st.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Quick Action Contact Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {contact.phone ? (
              <>
                <a
                  href={`tel:${contact.phone}`}
                  className="inline-flex items-center justify-center gap-2 bg-[#0A1D13] text-[#BEF264] px-4 py-2.5 text-xs font-black hover:bg-black active:scale-[0.99] transition-all border border-[#0A1D13]"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {contact.phone}</span>
                </a>

                {whatsappNumber ? (
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#25D366] px-4 py-2.5 text-xs font-black text-[#0A1D13] hover:bg-[#20bd5a] active:scale-[0.99] transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                ) : null}
              </>
            ) : null}

            {contact.email ? (
              <a
                href={`mailto:${contact.email}`}
                className="inline-flex items-center justify-center gap-2 bg-slate-800 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-900 active:scale-[0.99] transition-all border border-slate-800"
              >
                <Mail className="w-4 h-4" />
                <span>Send Email</span>
              </a>
            ) : null}
          </div>

          {/* Contact Details & Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            
            {/* Phone Number */}
            <div className="flex items-start gap-3.5 p-3.5 bg-[#F8FAF8] border border-slate-200">
              <div className="flex h-10 w-10 items-center justify-center bg-white text-[#0A1D13] border border-slate-300 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Phone Number</div>
                {contact.phone ? (
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <a 
                      href={`tel:${contact.phone}`} 
                      className="text-base font-bold text-slate-900 hover:text-[#0A1D13] font-mono truncate"
                    >
                      {contact.phone}
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopyPhone(contact.phone!)}
                      title="Copy phone number"
                      className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      {copiedPhone ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                ) : (
                  <div className="text-sm font-medium text-slate-400 mt-1">—</div>
                )}
              </div>
            </div>

            {/* Email Address */}
            <div className="flex items-start gap-3.5 p-3.5 bg-[#F8FAF8] border border-slate-200">
              <div className="flex h-10 w-10 items-center justify-center bg-white text-[#0A1D13] border border-slate-300 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Email Address</div>
                {contact.email ? (
                  <a 
                    href={`mailto:${contact.email}`} 
                    className="text-base font-bold text-slate-900 hover:text-[#0A1D13] block mt-1 truncate text-xs sm:text-sm font-mono"
                  >
                    {contact.email}
                  </a>
                ) : (
                  <div className="text-sm font-medium text-slate-400 mt-1">—</div>
                )}
              </div>
            </div>

            {/* Assigned Group Selector */}
            <div className="flex items-start gap-3.5 p-3.5 bg-[#F8FAF8] border border-slate-200">
              <div className="flex h-10 w-10 items-center justify-center bg-white text-[#0A1D13] border border-slate-300 shrink-0">
                <Folder className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Assigned Group</div>
                <div className="relative mt-1">
                  <select
                    value={contact.groupId || ""}
                    onChange={handleGroupChange}
                    className="w-full border border-slate-300 bg-white py-1.5 pl-2.5 pr-7 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13] appearance-none font-mono"
                  >
                    <option value="">None (Unassigned / General)</option>
                    {groups.map((grp) => (
                      <option key={grp.id} value={grp.id}>
                        {grp.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Last Contacted */}
            <div className="flex items-start gap-3.5 p-3.5 bg-[#F8FAF8] border border-slate-200">
              <div className="flex h-10 w-10 items-center justify-center bg-white text-[#0A1D13] border border-slate-300 shrink-0">
                <History className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Last Contacted</div>
                <div className="text-xs sm:text-sm font-bold font-mono text-slate-900 mt-1">
                  {formattedLastContacted}
                </div>
              </div>
            </div>

          </div>

          {/* Initial Notes Box */}
          {contact.notes && (
            <div className="pt-2 border-t border-slate-200">
              <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-slate-500 mb-2">
                <FileText className="w-4 h-4 text-slate-400" />
                Initial Import Note
              </div>
              <div className="bg-[#F8FAF8] p-3.5 border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium">
                {contact.notes}
              </div>
            </div>
          )}

        </div>

        {/* Activity Timeline Card */}
        <div className="bg-white p-6 sm:p-8 border border-slate-300">
          <InteractionTimeline
            contact={contact}
            interactions={interactions}
            onInteractionsChanged={handleInteractionsChanged}
          />
        </div>

      </div>
    </AuthGuard>
  );
}
