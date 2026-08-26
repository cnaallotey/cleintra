"use client";

import { useState, useEffect } from "react";
import { Contact, PipelineStage, DashboardContactsResponse } from "@/types/crm";
import { 
  getDashboardContacts, 
  getStoredContacts, 
  getPipelineStages,
  updateContactStage 
} from "@/lib/contacts-store";
import { ContactList } from "@/components/ContactList";
import { ImportModal } from "@/components/ImportModal";
import { StageManagerModal } from "@/components/StageManagerModal";
import { GroupManagerModal } from "@/components/GroupManagerModal";
import { AuthGuard } from "@/components/AuthGuard";
import { useAuth } from "@/lib/auth-context";
import { DashboardSkeleton } from "@/components/Skeletons";
import { 
  Sliders, 
  CheckCircle, 
  X, 
  Users, 
  FolderPlus,
  Sparkles,
  Upload
} from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardContactsResponse>({
    contacts: [],
    totalCount: 0,
    filteredCount: 0,
    stageSummaries: [],
    groupSummaries: [],
    unassignedGroupCount: 0
  });

  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [activeStage, setActiveStage] = useState<string>("All");
  const [activeGroupId, setActiveGroupId] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isStageManagerOpen, setIsStageManagerOpen] = useState(false);
  const [isGroupManagerOpen, setIsGroupManagerOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { user, business } = useAuth();
  const businessName = business?.name || user?.businessName || "My Business";

  // Reload contacts and summaries based on filters
  const refreshData = () => {
    const response = getDashboardContacts({
      status: activeStage,
      groupId: activeGroupId,
      q: searchQuery
    });
    setData(response);
    setStages(getPipelineStages());
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, [activeStage, activeGroupId, searchQuery]);

  const handleImportSuccess = () => {
    setIsImportModalOpen(false);
    refreshData();
    setSuccessMessage("Contacts imported successfully into your CRM pipeline.");
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4500);
  };

  const handleStagesUpdated = () => {
    refreshData();
  };

  const handleGroupsUpdated = () => {
    refreshData();
  };

  const handleQuickStageChange = (contactId: string, newStageName: string) => {
    updateContactStage(contactId, newStageName);
    refreshData();
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  const allContactsCount = getStoredContacts().length;

  return (
    <AuthGuard>
      <div className="space-y-6 animate-in fade-in duration-200">
        
        {/* Workspace Title & Stats Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider bg-[#0A1D13] text-[#BEF264] px-2 py-0.5 border border-[#0A1D13]">
                ACTIVE PIPELINE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Contacts &amp; Pipeline
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 font-medium">
              Track leads, manage follow-ups, and move deals through your sales funnel.
            </p>
          </div>

          {/* Quick Stats & Action Controls */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 border border-slate-300 text-xs font-bold text-slate-800">
              <Users className="w-4 h-4 text-[#0A1D13]" />
              <span className="font-mono text-[11px] text-slate-500 uppercase">Total:</span>
              <span className="text-slate-900 font-mono font-black">{allContactsCount}</span>
            </div>

            <button
              onClick={() => setIsGroupManagerOpen(true)}
              className="inline-flex items-center gap-1.5 bg-white px-3.5 py-2 border border-slate-300 text-xs font-bold text-slate-800 hover:bg-[#F4F9F4] hover:text-[#0A1D13] hover:border-slate-400 transition-colors"
            >
              <FolderPlus className="w-4 h-4 text-[#0A1D13]" />
              <span>Manage Groups</span>
            </button>

            <button
              onClick={() => setIsStageManagerOpen(true)}
              className="inline-flex items-center gap-1.5 bg-white px-3.5 py-2 border border-slate-300 text-xs font-bold text-slate-800 hover:bg-[#F4F9F4] hover:text-[#0A1D13] hover:border-slate-400 transition-colors"
            >
              <Sliders className="w-4 h-4 text-slate-600" />
              <span>Customize Stages</span>
            </button>

            <button
              onClick={() => setIsImportModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-[#BEF264] hover:bg-[#A3E635] text-[#0A1D13] font-black px-4 py-2 text-xs border border-[#BEF264] transition-all"
            >
              <Upload className="w-4 h-4 text-[#0A1D13]" />
              <span>Import CSV</span>
            </button>
          </div>
        </div>

        {/* Success Notification Banner */}
        {successMessage && (
          <div className="flex items-center justify-between gap-3 bg-[#0A1D13] text-white p-4 border-l-4 border-l-[#BEF264] border border-[#0A1D13] animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center bg-[#BEF264] text-[#0A1D13] font-bold">
                <CheckCircle className="w-4 h-4" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-emerald-100">{successMessage}</p>
            </div>
            <button 
              onClick={() => setSuccessMessage(null)}
              className="p-1 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Main Contacts List with Search, Group Tabs & Stage Filters */}
        <ContactList
          contacts={data.contacts}
          stages={stages}
          stageSummaries={data.stageSummaries}
          groupSummaries={data.groupSummaries}
          unassignedGroupCount={data.unassignedGroupCount}
          activeStage={activeStage}
          activeGroupId={activeGroupId}
          searchQuery={searchQuery}
          onStageChange={setActiveStage}
          onGroupChange={setActiveGroupId}
          onSearchChange={setSearchQuery}
          onOpenImport={() => setIsImportModalOpen(true)}
          onOpenStageManager={() => setIsStageManagerOpen(true)}
          onOpenGroupManager={() => setIsGroupManagerOpen(true)}
          onQuickStageChange={handleQuickStageChange}
        />

        {/* CSV Import Modal with Target Group Support */}
        <ImportModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onImportSuccess={handleImportSuccess}
        />

        {/* Pipeline Stage Customizer Modal */}
        <StageManagerModal
          isOpen={isStageManagerOpen}
          onClose={() => setIsStageManagerOpen(false)}
          stagesWithCounts={data.stageSummaries}
          onStagesChanged={handleStagesUpdated}
        />

        {/* Group Manager Modal */}
        <GroupManagerModal
          isOpen={isGroupManagerOpen}
          onClose={() => setIsGroupManagerOpen(false)}
          groupsWithCounts={data.groupSummaries}
          onGroupsChanged={handleGroupsUpdated}
        />

      </div>
    </AuthGuard>
  );
}
