"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ContactGroupWithCount, 
  Contact, 
  PipelineStage 
} from "@/types/crm";
import { 
  getContactGroupsWithCounts, 
  createContactGroup, 
  updateContactGroup, 
  deleteContactGroup,
  getStoredContacts,
  getPipelineStages,
  getGroupMembers,
  removeContactFromGroup
} from "@/lib/contacts-store";
import { AuthGuard } from "@/components/AuthGuard";
import { ImportModal } from "@/components/ImportModal";
import { ShareDialerModal } from "@/components/ShareDialerModal";
import { StageBadge } from "@/components/StageBadge";
import { GroupsSkeleton } from "@/components/Skeletons";
import { 
  Folder, 
  FolderPlus, 
  Users, 
  UserMinus, 
  Edit3, 
  Trash2, 
  Upload, 
  Check, 
  X, 
  AlertCircle, 
  ChevronRight, 
  ChevronDown, 
  ExternalLink,
  Plus,
  ArrowRight,
  PhoneCall,
  Share2
} from "lucide-react";

export default function GroupsPage() {
  const [groups, setGroups] = useState<ContactGroupWithCount[]>([]);
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals & Panels State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);

  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editError, setEditError] = useState<string | null>(null);

  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);

  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [targetImportGroupId, setTargetImportGroupId] = useState<string | null>(null);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedShareGroup, setSelectedShareGroup] = useState<ContactGroupWithCount | null>(null);

  const [notification, setNotification] = useState<string | null>(null);

  const loadData = () => {
    const loadedGroups = getContactGroupsWithCounts();
    const loadedContacts = getStoredContacts();
    const loadedStages = getPipelineStages();
    setGroups(loadedGroups);
    setAllContacts(loadedContacts);
    setStages(loadedStages);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    try {
      const created = createContactGroup(newGroupName);
      setNewGroupName("");
      setIsCreateModalOpen(false);
      loadData();
      showNotification(`Group "${created.name}" created successfully.`);
    } catch (err: any) {
      setCreateError(err.message || "Failed to create group.");
    }
  };

  const handleStartRename = (group: ContactGroupWithCount) => {
    setEditingGroupId(group.id);
    setEditingName(group.name);
    setEditError(null);
  };

  const handleSaveRename = (groupId: string) => {
    setEditError(null);
    try {
      updateContactGroup(groupId, { name: editingName });
      setEditingGroupId(null);
      loadData();
      showNotification("Group name updated successfully.");
    } catch (err: any) {
      setEditError(err.message || "Failed to update group name.");
    }
  };

  const handleDeleteGroup = (groupId: string) => {
    try {
      deleteContactGroup(groupId);
      setDeletingGroupId(null);
      if (expandedGroupId === groupId) setExpandedGroupId(null);
      loadData();
      showNotification("Group deleted. Contacts remain safe in All Contacts.");
    } catch (err: any) {
      alert(err.message || "Failed to delete group.");
    }
  };

  const handleRemoveMember = (contactId: string, groupName: string) => {
    try {
      removeContactFromGroup(contactId);
      loadData();
      showNotification(`Contact removed from "${groupName}".`);
    } catch (err: any) {
      alert("Failed to remove contact from group.");
    }
  };

  const handleOpenImportForGroup = (groupId: string) => {
    setTargetImportGroupId(groupId);
    setIsImportModalOpen(true);
  };

  const handleImportSuccess = (count: number) => {
    setIsImportModalOpen(false);
    loadData();
    showNotification(`${count} contact(s) imported into group.`);
  };

  if (loading) {
    return <GroupsSkeleton />;
  }

  const unassignedContacts = allContacts.filter((c) => !c.groupId);
  const totalSegmentedContacts = groups.reduce((acc, g) => acc + g.contactCount, 0);

  return (
    <AuthGuard>
      <div className="space-y-6 animate-in fade-in duration-200">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#0A1D13] text-[#BEF264] px-2 py-0.5 border border-[#0A1D13]">
                SEGMENTATION
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Contact Groups
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 font-medium">
              Organize and segment your customer inquiries into dedicated business groups.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setNewGroupName("");
                setCreateError(null);
                setIsCreateModalOpen(true);
              }}
              className="inline-flex items-center gap-2 bg-[#BEF264] hover:bg-[#A3E635] text-[#0A1D13] border border-[#BEF264] px-4 py-2.5 text-xs sm:text-sm font-black transition-all"
            >
              <Plus className="w-4 h-4 text-[#0A1D13]" />
              <span>New Group</span>
            </button>
          </div>
        </div>

        {/* Notification Banner */}
        {notification && (
          <div className="flex items-center justify-between gap-3 bg-[#0A1D13] text-white p-4 border-l-4 border-l-[#BEF264] border border-[#0A1D13] animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center bg-[#BEF264] text-[#0A1D13] font-bold">
                <Check className="w-4 h-4" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-emerald-100">{notification}</p>
            </div>
            <button 
              type="button"
              onClick={() => setNotification(null)}
              className="p-1 text-slate-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Total Groups */}
          <div className="p-5 bg-white border border-slate-300 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center bg-[#0A1D13] text-[#BEF264] shrink-0 border border-[#0A1D13]">
              <Folder className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Groups</div>
              <div className="text-2xl font-black text-slate-900 mt-0.5">{groups.length}</div>
            </div>
          </div>

          {/* Segmented Contacts */}
          <div className="p-5 bg-white border border-slate-300 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center bg-[#0A1D13] text-[#BEF264] shrink-0 border border-[#0A1D13]">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Grouped Contacts</div>
              <div className="text-2xl font-black text-slate-900 mt-0.5">{totalSegmentedContacts}</div>
            </div>
          </div>

          {/* Unassigned Leads */}
          <div className="p-5 bg-white border border-slate-300 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center bg-slate-100 text-slate-700 shrink-0 border border-slate-300">
                <UserMinus className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Unassigned Leads</div>
                <div className="text-2xl font-black text-slate-900 mt-0.5">{unassignedContacts.length}</div>
              </div>
            </div>
            {unassignedContacts.length > 0 && (
              <Link
                href="/dashboard?group=unassigned"
                className="text-xs font-bold text-[#0A1D13] hover:underline flex items-center gap-1"
              >
                <span>VIEW</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

        </div>

        {/* Groups Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900 tracking-tight">All Contact Groups</h2>
            <span className="text-xs font-bold text-slate-500">
              {groups.length} {groups.length === 1 ? "group" : "groups"} configured
            </span>
          </div>

          {groups.length === 0 ? (
            <div className="bg-white p-12 text-center border-2 border-dashed border-slate-300 space-y-4">
              <div className="flex h-16 w-16 items-center justify-center bg-[#0A1D13] text-[#BEF264] mx-auto border border-[#0A1D13]">
                <FolderPlus className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-bold text-slate-900">No contact groups created yet</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                  Create groups like &quot;Wholesale Buyers&quot;, &quot;Retail Customers&quot;, or &quot;Instagram Inquiries&quot; to keep your contacts organized.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setNewGroupName("");
                  setCreateError(null);
                  setIsCreateModalOpen(true);
                }}
                className="inline-flex items-center gap-2 bg-[#BEF264] hover:bg-[#A3E635] text-[#0A1D13] border border-[#BEF264] px-5 py-2.5 text-xs font-black transition-all"
              >
                <FolderPlus className="w-4 h-4 text-[#0A1D13]" />
                <span>Create Your First Group</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groups.map((group) => {
                const isExpanded = expandedGroupId === group.id;
                const isEditing = editingGroupId === group.id;
                const isDeleting = deletingGroupId === group.id;
                const members = isExpanded ? getGroupMembers(group.id) : [];

                return (
                  <div
                    key={group.id}
                    className={`bg-white border transition-all ${
                      isExpanded 
                        ? "border-[#0A1D13] border-l-4 border-l-[#BEF264]" 
                        : "border-slate-300 hover:border-slate-400"
                    }`}
                  >
                    {/* Group Card Header */}
                    <div className="p-5 space-y-4">
                      
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-11 w-11 items-center justify-center bg-[#0A1D13] text-[#BEF264] font-black text-sm shrink-0 border border-[#0A1D13]">
                            {group.name.charAt(0).toUpperCase()}
                          </div>
                          
                          {isEditing ? (
                            <div className="flex-1 space-y-1.5 min-w-0">
                              <input
                                type="text"
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                autoFocus
                                className="w-full text-sm font-bold px-2.5 py-1.5 border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13]"
                              />
                              {editError && (
                                <p className="text-[11px] text-rose-600 font-bold">{editError}</p>
                              )}
                              <div className="flex items-center gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => handleSaveRename(group.id)}
                                  className="text-xs font-black bg-[#BEF264] text-[#0A1D13] border border-[#BEF264] px-2.5 py-1 cursor-pointer"
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingGroupId(null)}
                                  className="text-xs font-bold text-slate-700 px-2 py-1 border border-slate-300 hover:bg-slate-100 cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="min-w-0">
                              <h3 className="text-base font-black text-slate-900 truncate" title={group.name}>
                                {group.name}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 border border-slate-200">
                                  <Users className="w-3 h-3 text-slate-500" />
                                  <span>{group.contactCount} {group.contactCount === 1 ? "contact" : "contacts"}</span>
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {!isEditing && (
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleStartRename(group)}
                              title="Rename group"
                              className="p-1.5 text-slate-400 hover:text-black hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingGroupId(group.id)}
                              title="Delete group"
                              className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-200 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Deletion Confirmation Bar */}
                      {isDeleting && (
                        <div className="p-3.5 bg-rose-50 border border-rose-300 text-xs space-y-2 animate-in fade-in">
                          <div className="font-bold text-rose-900">
                            Delete &quot;{group.name}&quot;?
                          </div>
                          <p className="text-rose-700">
                            Contacts will not be deleted; they will stay safe in &quot;All Contacts&quot; as unassigned.
                          </p>
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => handleDeleteGroup(group.id)}
                              className="px-3 py-1.5 bg-rose-600 text-white font-bold hover:bg-rose-700 text-xs cursor-pointer"
                            >
                              Yes, Delete Group
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingGroupId(null)}
                              className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 text-xs cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Dedicated 2-Button Action Bar */}
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedShareGroup(group);
                            setIsShareModalOpen(true);
                          }}
                          className="inline-flex items-center justify-center gap-1.5 text-xs font-black text-[#0A1D13] bg-[#BEF264] hover:bg-[#A3E635] px-3 py-2 border border-[#BEF264] transition-colors cursor-pointer whitespace-nowrap shadow-none"
                          title="Share calling queue with customer agents"
                        >
                          <PhoneCall className="w-3.5 h-3.5 text-[#0A1D13] shrink-0" />
                          <span>Share Dial Link</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenImportForGroup(group.id)}
                          className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#0A1D13] bg-[#E2EFE4] hover:bg-[#C5DDC9] px-3 py-2 border border-[#C5DDC9] transition-colors cursor-pointer whitespace-nowrap shadow-none"
                        >
                          <Upload className="w-3.5 h-3.5 text-[#0A1D13] shrink-0" />
                          <span>Import CSV</span>
                        </button>
                      </div>

                      {/* Navigation & Drawer Toggle Strip */}
                      <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-200 text-xs">
                        <button
                          type="button"
                          onClick={() => setExpandedGroupId(isExpanded ? null : group.id)}
                          className="inline-flex items-center gap-1 font-bold text-slate-700 hover:text-[#0A1D13] px-2 py-1 hover:bg-[#F4F9F4] transition-colors cursor-pointer whitespace-nowrap"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronDown className="w-3.5 h-3.5 text-[#0A1D13]" />
                              <span>Hide Members</span>
                            </>
                          ) : (
                            <>
                              <ChevronRight className="w-3.5 h-3.5" />
                              <span>View Members ({group.contactCount})</span>
                            </>
                          )}
                        </button>

                        <Link
                          href={`/dashboard?group=${group.id}`}
                          className="inline-flex items-center gap-1 font-bold text-[#0A1D13] hover:underline px-2 py-1 hover:bg-[#E2EFE4] transition-colors whitespace-nowrap"
                        >
                          <span>Open Pipeline</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>

                      {/* Expandable Group Members Drawer */}
                      {isExpanded && (
                        <div className="pt-3 border-t border-slate-200 space-y-2 animate-in fade-in duration-150">
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Members of {group.name}
                          </div>

                          {members.length === 0 ? (
                            <div className="py-6 text-center text-xs text-slate-400 bg-[#F8FAF8] border border-dashed border-slate-300">
                              No contacts in this group yet. Import a CSV or assign contacts from the dashboard.
                            </div>
                          ) : (
                            <div className="max-h-60 overflow-y-auto divide-y divide-slate-200 border border-slate-200">
                              {members.map((member) => (
                                <div
                                  key={member.id}
                                  className="flex items-center justify-between p-2.5 bg-white hover:bg-[#F4F9F4] transition-colors text-xs"
                                >
                                  <div className="min-w-0 pr-2">
                                    <Link
                                      href={`/contacts/${member.id}`}
                                      className="font-bold text-slate-900 hover:text-[#0A1D13] hover:underline truncate block"
                                    >
                                      {member.name}
                                    </Link>
                                    <div className="text-[11px] text-slate-500 truncate">
                                      {member.phone || member.email || "No phone/email"}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    <StageBadge status={member.status} size="sm" />
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveMember(member.id, group.name)}
                                      title="Remove from this group"
                                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Create New Group Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="w-full max-w-md bg-white border-2 border-slate-300 space-y-4 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between p-4 bg-[#0A1D13] text-white border-b border-[#0A1D13]">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center bg-[#BEF264] text-[#0A1D13] font-bold">
                    <FolderPlus className="w-4 h-4" />
                  </div>
                  <h2 className="text-sm font-black text-white uppercase tracking-wider">Create New Contact Group</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1 text-slate-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                {createError && (
                  <div className="border border-rose-300 bg-rose-50 p-3 flex items-start gap-2 text-xs text-rose-800 font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                    <span>{createError}</span>
                  </div>
                )}

                <form onSubmit={handleCreateGroup} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs uppercase font-bold text-slate-700">
                      Group Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      autoFocus
                      required
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      placeholder="e.g. VIP Wholesale, Instagram Leads, Trade Fair 2026"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-bold border border-slate-300 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13]"
                    />
                    <p className="text-[11px] text-slate-500 font-medium">
                      Choose a clear label for segmenting your customer inquiries.
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setIsCreateModalOpen(false)}
                      className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-black text-[#0A1D13] bg-[#BEF264] hover:bg-[#A3E635] border border-[#BEF264]"
                    >
                      Create Group
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* CSV Import Modal with Pre-Selected Target Group */}
        <ImportModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onImportSuccess={handleImportSuccess}
          defaultGroupId={targetImportGroupId}
        />

        {/* Speed-Dialer Share Modal */}
        <ShareDialerModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          group={selectedShareGroup}
          stages={stages}
        />

      </div>
    </AuthGuard>
  );
}
