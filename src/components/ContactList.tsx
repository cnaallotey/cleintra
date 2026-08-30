"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Contact, 
  PipelineStage, 
  PipelineStageWithCount, 
  ContactGroupWithCount,
  StageColor 
} from "@/types/crm";
import { 
  Search, 
  Upload, 
  Phone, 
  Mail, 
  Sliders, 
  X, 
  ChevronRight, 
  ExternalLink,
  ChevronDown,
  User,
  Users,
  Folder,
  FolderPlus,
  MessageCircle,
  ArrowRight
} from "lucide-react";
import { StageBadge } from "./StageBadge";
import { ShareDialerModal } from "./ShareDialerModal";

interface ContactListProps {
  contacts: Contact[];
  stages: PipelineStage[];
  stageSummaries?: PipelineStageWithCount[];
  groupSummaries?: ContactGroupWithCount[];
  unassignedGroupCount?: number;
  activeStage?: string;
  activeGroupId?: string;
  searchQuery?: string;
  onStageChange?: (stage: string) => void;
  onGroupChange?: (groupId: string) => void;
  onSearchChange?: (query: string) => void;
  onOpenImport: () => void;
  onOpenStageManager: () => void;
  onOpenGroupManager?: () => void;
  onQuickStageChange?: (contactId: string, newStage: string) => void;
}

export function ContactList({
  contacts,
  stages,
  stageSummaries,
  groupSummaries = [],
  unassignedGroupCount = 0,
  activeStage = "All",
  activeGroupId = "All",
  searchQuery = "",
  onStageChange,
  onGroupChange,
  onSearchChange,
  onOpenImport,
  onOpenStageManager,
  onOpenGroupManager,
  onQuickStageChange
}: ContactListProps) {
  const [selectedStage, setSelectedStage] = useState<string>(activeStage);
  const [selectedGroup, setSelectedGroup] = useState<string>(activeGroupId);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const stagesWithCounts = stageSummaries || stages.map((s) => ({ ...s, contactCount: 0 }));

  const handleSelectStage = (stageName: string | null) => {
    const val = stageName || "All";
    setSelectedStage(val);
    if (onStageChange) onStageChange(val);
  };

  const handleSelectGroup = (groupId: string | null) => {
    const val = groupId || "All";
    setSelectedGroup(val);
    if (onGroupChange) onGroupChange(val);
  };

  const handleQuickStageChange = (e: React.ChangeEvent<HTMLSelectElement>, contactId: string) => {
    e.stopPropagation();
    const newStage = e.target.value;
    if (onQuickStageChange) {
      onQuickStageChange(contactId, newStage);
    }
  };

  const handleClearAllFilters = () => {
    handleSelectStage("All");
    handleSelectGroup("All");
    if (onSearchChange) onSearchChange("");
  };

  const selectedStageFilter = activeStage !== "All" ? activeStage : null;
  const selectedGroupFilter = activeGroupId !== "All" ? activeGroupId : null;
  const totalAllContacts = stagesWithCounts.reduce((acc, s) => acc + s.contactCount, 0);

  return (
    <div className="space-y-4">
      
      {/* Group Selector Segment Bar (Sharp Brutalist Tabs) */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200">
        <div className="flex items-center gap-1.5 flex-nowrap shrink-0">
          <button
            type="button"
            onClick={() => handleSelectGroup(null)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all border ${
              selectedGroupFilter === null || selectedGroupFilter === "All"
                ? "bg-[#0A1D13] text-[#BEF264] border-[#0A1D13]"
                : "bg-white text-slate-700 hover:bg-[#F4F9F4] border-slate-300"
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            <span>All Groups</span>
            <span className={`px-1.5 py-0.2 text-[10px] font-bold ${
              selectedGroupFilter === null || selectedGroupFilter === "All"
                ? "bg-[#BEF264] text-[#0A1D13]" 
                : "bg-slate-100 text-slate-700"
            }`}>
              {totalAllContacts}
            </span>
          </button>

          {groupSummaries.map((group) => {
            const isSelected = selectedGroupFilter === group.id;
            return (
              <button
                key={group.id}
                type="button"
                onClick={() => handleSelectGroup(group.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all border ${
                  isSelected
                    ? "bg-[#0A1D13] text-[#BEF264] border-[#0A1D13]"
                    : "bg-white text-slate-700 hover:bg-[#F4F9F4] border-slate-300"
                }`}
              >
                <span>{group.name}</span>
                <span className={`px-1.5 py-0.2 text-[10px] font-bold ${
                  isSelected
                    ? "bg-[#BEF264] text-[#0A1D13]" 
                    : "bg-slate-100 text-slate-700"
                }`}>
                  {group.contactCount}
                </span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => handleSelectGroup("unassigned")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all border ${
              selectedGroupFilter === "unassigned"
                ? "bg-[#0A1D13] text-[#BEF264] border-[#0A1D13]"
                : "bg-white text-slate-500 hover:bg-slate-100 border-slate-300"
            }`}
          >
            <span>Unassigned</span>
            {unassignedGroupCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-bold bg-slate-100 text-slate-700">
                {unassignedGroupCount}
              </span>
            )}
          </button>
        </div>

        <Link
          href="/groups"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#0A1D13] hover:text-emerald-700 hover:underline shrink-0 pl-2"
        >
          <FolderPlus className="w-3.5 h-3.5" />
          <span>Manage Groups</span>
        </Link>
      </div>

      {/* Stage Filter Tabs with Contact Counts */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1.5 flex-nowrap shrink-0">
          <button
            type="button"
            onClick={() => handleSelectStage(null)}
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold transition-all border ${
              selectedStageFilter === null || selectedStageFilter === "All"
                ? "bg-[#0A1D13] text-[#BEF264] border-[#0A1D13]"
                : "bg-white text-slate-700 hover:bg-slate-100 border-slate-300"
            }`}
          >
            <span className="uppercase text-[11px]">All Stages</span>
            <span className={`px-1.5 py-0.2 text-[10px] font-bold ${
              selectedStageFilter === null || selectedStageFilter === "All"
                ? "bg-[#BEF264] text-[#0A1D13]" 
                : "bg-slate-100 text-slate-700"
            }`}>
              {totalAllContacts}
            </span>
          </button>

          {stagesWithCounts.map((stage) => {
            const isSelected = selectedStageFilter?.toLowerCase() === stage.name.toLowerCase();
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => handleSelectStage(stage.name)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold transition-all border ${
                  isSelected
                    ? "bg-[#0A1D13] text-[#BEF264] border-[#0A1D13]"
                    : "bg-white text-slate-700 hover:bg-slate-100 border-slate-300"
                }`}
              >
                <span className="uppercase text-[11px]">{stage.name}</span>
                <span className={`px-1.5 py-0.2 text-[10px] font-bold ${
                  isSelected 
                    ? "bg-[#BEF264] text-[#0A1D13]" 
                    : "bg-slate-100 text-slate-700"
                }`}>
                  {stage.contactCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Clear Filters indicator */}
        {(selectedStageFilter || (selectedGroupFilter && selectedGroupFilter !== "All") || searchQuery) && (
          <button
            type="button"
            onClick={handleClearAllFilters}
            className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 hover:text-rose-900 transition-colors shrink-0 bg-rose-50 px-2.5 py-1 border border-rose-300"
          >
            <X className="w-3 h-3" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Action Header: Instant Search Bar + Upload Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 sm:p-4 border border-slate-300">
        
        {/* Real-time search query box */}
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search by name, phone, email, or source..."
            className="w-full pl-10 pr-8 py-2 text-xs sm:text-sm border border-slate-300 bg-[#F8FAF8] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13] focus:border-[#0A1D13] transition-all font-medium"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange && onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Buttons: Speed-Dialer + Import */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0A1D13] hover:bg-black px-4 py-2.5 text-xs sm:text-sm font-bold text-[#BEF264] border border-[#0A1D13] active:scale-[0.99] transition-all shrink-0 cursor-pointer"
            title="Open or share 1-by-1 speed-dialer calling queue"
          >
            <Phone className="w-4 h-4 text-[#BEF264]" />
            <span>Speed-Dialer Queue</span>
          </button>

          <button
            type="button"
            onClick={onOpenImport}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#BEF264] hover:bg-[#A3E635] px-4 py-2.5 text-xs sm:text-sm font-black text-[#0A1D13] border border-[#BEF264] active:scale-[0.99] transition-all shrink-0 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-[#0A1D13]" />
            <span>Import Contacts (CSV)</span>
          </button>
        </div>
      </div>

      {/* Main Contacts Table Card */}
      <div className="border border-slate-300 bg-white overflow-hidden">
        {contacts.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center bg-slate-100 text-slate-400 border border-slate-200">
              <Users className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                {searchQuery || selectedStageFilter || selectedGroupFilter
                  ? "No matching contacts found" 
                  : "No contacts in your CRM yet"}
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                {searchQuery || selectedStageFilter || selectedGroupFilter
                  ? "Try clearing your search query, selecting another stage, or changing your group filter."
                  : "Upload a CSV spreadsheet or add leads to start organizing your sales follow-ups."}
              </p>
            </div>
            {(searchQuery || selectedStageFilter || selectedGroupFilter) ? (
              <button
                type="button"
                onClick={handleClearAllFilters}
                className="inline-flex items-center gap-1.5 border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear Active Filters</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenImport}
                className="inline-flex items-center gap-2 bg-[#BEF264] hover:bg-[#A3E635] px-4 py-2 text-xs font-black text-[#0A1D13] border border-[#BEF264] transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Contacts CSV</span>
              </button>
            )}
          </div>
        ) : (
          <div>
            {/* Table Header (Deep Forest Green Strip) */}
            <div className="hidden md:grid md:grid-cols-12 md:gap-4 px-6 py-3 bg-[#0A1D13] border-b border-[#0A1D13] text-[10px] font-bold text-[#BEF264] uppercase tracking-wider">
              <div className="col-span-4">Contact Name &amp; Group</div>
              <div className="col-span-3">Phone &amp; Email</div>
              <div className="col-span-2">Last Contacted</div>
              <div className="col-span-3 text-right">Pipeline Stage &amp; Actions</div>
            </div>

            {/* Table Body Rows */}
            <div className="divide-y divide-slate-200">
              {contacts.map((contact) => {
                const groupName = groupSummaries.find((g) => g.id === contact.groupId)?.name;
                const formattedDate = contact.createdAt 
                  ? new Date(contact.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short"
                    })
                  : "";

                const formattedLastContact = contact.lastContactedAt
                  ? new Date(contact.lastContactedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit"
                    })
                  : "Never";

                const currentStageObj = stages.find(
                  (s) => s.name.toLowerCase() === contact.status.toLowerCase()
                );
                const stageColor = currentStageObj?.color || "gray";

                return (
                  <div
                    key={contact.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-4 sm:px-6 py-3.5 hover:bg-[#F4F9F4] transition-colors items-center group"
                  >
                    {/* Name, Source, Group */}
                    <div className="col-span-4 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center bg-[#0A1D13] text-[#BEF264] font-black text-xs shrink-0 border border-[#0A1D13]">
                        {contact.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Link
                            href={`/contacts/${contact.id}`}
                            className="font-black text-sm text-slate-900 hover:text-[#0A1D13] hover:underline truncate"
                          >
                            {contact.name}
                          </Link>
                          {groupName && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 bg-[#E2EFE4] text-[#0A1D13] border border-[#C5DDC9] text-[10px] font-bold uppercase">
                              <Folder className="w-2.5 h-2.5 text-[#0A1D13]" />
                              {groupName}
                            </span>
                          )}
                        </div>
                        {contact.source && (
                          <span className="inline-block text-[10px] text-slate-500 uppercase truncate">
                            Source: {contact.source}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Phone & Email */}
                    <div className="col-span-3 text-xs space-y-0.5 font-medium">
                      {contact.phone ? (
                        <div className="flex items-center gap-1.5 text-slate-800">
                          <Phone className="w-3 h-3 text-slate-500 shrink-0" />
                          <a 
                            href={`tel:${contact.phone}`} 
                            className="hover:text-[#0A1D13] hover:underline text-xs truncate"
                          >
                            {contact.phone}
                          </a>
                        </div>
                      ) : (
                        <div className="text-slate-400 italic text-[11px]">No phone number</div>
                      )}

                      {contact.email && (
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <a 
                            href={`mailto:${contact.email}`} 
                            className="hover:text-[#0A1D13] hover:underline truncate text-[11px]"
                          >
                            {contact.email}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Last Contacted */}
                    <div className="col-span-2 text-xs">
                      <div className="md:hidden text-[10px] font-bold text-slate-400 uppercase">Last Contact:</div>
                      <div className="text-slate-600 text-xs">
                        <span className={contact.lastContactedAt ? "text-slate-900 font-bold text-[11px]" : "text-slate-400 text-[11px]"}>
                          {formattedLastContact}
                        </span>
                      </div>
                    </div>

                    {/* Status Selector & Details Link */}
                    <div className="col-span-3 flex md:justify-end items-center gap-2">
                      <div className="relative">
                        <select
                          value={contact.status}
                          onChange={(e) => handleQuickStageChange(e, contact.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[10px] uppercase font-bold border border-slate-300 bg-white py-1.5 pl-3 pr-7 focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13] cursor-pointer appearance-none text-slate-900"
                        >
                          {stagesWithCounts.map((st) => (
                            <option key={st.id} value={st.name}>
                              {st.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-600 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>

                      <Link
                        href={`/contacts/${contact.id}`}
                        className="inline-flex items-center gap-1 bg-[#0A1D13] text-[#BEF264] hover:bg-black px-2.5 py-1.5 text-xs font-bold border border-[#0A1D13] transition-colors"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Speed-Dialer Share Modal */}
      <ShareDialerModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        group={
          selectedGroup === "unassigned"
            ? { id: "unassigned", name: "Unassigned Leads", contactCount: unassignedGroupCount }
            : selectedGroup !== "All"
            ? groupSummaries.find((g) => g.id === selectedGroup) || { id: selectedGroup, name: "Selected Group", contactCount: contacts.length }
            : { id: "all", name: "All Contacts", contactCount: totalAllContacts }
        }
        stages={stages}
      />

    </div>
  );
}
