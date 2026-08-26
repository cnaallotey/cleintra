"use client";

import React, { useState } from "react";
import { 
  ContactGroupWithCount 
} from "@/types/crm";
import { 
  createContactGroup, 
  updateContactGroup, 
  deleteContactGroup 
} from "@/lib/contacts-store";
import { 
  X, 
  FolderPlus, 
  Folder, 
  Edit2, 
  Trash2, 
  Check, 
  AlertCircle, 
  Users 
} from "lucide-react";

interface GroupManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupsWithCounts: ContactGroupWithCount[];
  onGroupsChanged: () => void;
}

export function GroupManagerModal({
  isOpen,
  onClose,
  groupsWithCounts,
  onGroupsChanged,
}: GroupManagerModalProps) {
  const [newGroupName, setNewGroupName] = useState("");
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      createContactGroup(newGroupName);
      setNewGroupName("");
      onGroupsChanged();
    } catch (err: any) {
      setError(err.message || "Failed to create group.");
    }
  };

  const handleStartEdit = (group: ContactGroupWithCount) => {
    setEditingGroupId(group.id);
    setEditingName(group.name);
    setError(null);
  };

  const handleSaveEdit = (groupId: string) => {
    setError(null);
    try {
      updateContactGroup(groupId, { name: editingName });
      setEditingGroupId(null);
      onGroupsChanged();
    } catch (err: any) {
      setError(err.message || "Failed to update group.");
    }
  };

  const handleDeleteGroup = (groupId: string, name: string, count: number) => {
    const confirmMsg = count > 0
      ? `Are you sure you want to delete "${name}"? Its ${count} contact${count > 1 ? "s" : ""} will remain safe in "All Contacts" (Unassigned).`
      : `Are you sure you want to delete "${name}"?`;

    if (window.confirm(confirmMsg)) {
      setError(null);
      try {
        deleteContactGroup(groupId);
        onGroupsChanged();
      } catch (err: any) {
        setError(err.message || "Failed to delete group.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border-2 border-slate-300 overflow-hidden flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 bg-[#0A1D13] text-white border-b border-[#0A1D13]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center bg-[#BEF264] text-[#0A1D13]">
              <Folder className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-tight">
                Manage Contact Groups
              </h2>
              <p className="text-xs text-slate-300 font-medium">Segment your customer leads</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Error Message */}
          {error && (
            <div className="border border-rose-300 bg-rose-50 p-3 text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="flex-1 font-bold">{error}</div>
            </div>
          )}

          {/* Create Group Form */}
          <form onSubmit={handleCreateGroup} className="space-y-2">
            <label className="text-xs font-mono uppercase font-bold text-slate-700 block">
              Create New Group
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="e.g. Wholesale, Instagram, VIP"
                className="flex-1 border border-slate-300 px-3 py-2 text-xs font-bold bg-[#F8FAF8] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13]"
              />
              <button
                type="submit"
                disabled={!newGroupName.trim()}
                className="inline-flex items-center gap-1 bg-[#BEF264] hover:bg-[#A3E635] text-[#0A1D13] border border-[#BEF264] px-4 py-2 text-xs font-black transition-all disabled:opacity-40"
              >
                <FolderPlus className="w-4 h-4" />
                <span>Create</span>
              </button>
            </div>
          </form>

          {/* Existing Groups List */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase font-bold text-slate-700 block">
              Your Groups ({groupsWithCounts.length})
            </label>

            {groupsWithCounts.length === 0 ? (
              <div className="border border-dashed border-slate-300 bg-[#F8FAF8] p-6 text-center text-xs text-slate-500">
                No groups created yet. Create a group above to segment your contacts.
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-200 border border-slate-300">
                {groupsWithCounts.map((group) => (
                  <div
                    key={group.id}
                    className="flex items-center justify-between p-3 bg-white hover:bg-[#F4F9F4] transition-colors"
                  >
                    {editingGroupId === group.id ? (
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="flex-1 text-xs font-bold border border-slate-300 px-2.5 py-1.5 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13]"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(group.id)}
                          className="p-1.5 bg-[#0A1D13] text-[#BEF264]"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingGroupId(null)}
                          className="p-1.5 text-slate-500 hover:bg-slate-100"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Folder className="w-4 h-4 text-[#0A1D13] shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-black text-slate-900 truncate">
                              {group.name}
                            </p>
                            <span className="font-mono text-[10px] text-slate-500 font-bold">
                              {group.contactCount} contact{group.contactCount === 1 ? "" : "s"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(group)}
                            className="p-1.5 text-slate-500 hover:text-black hover:bg-slate-100 transition-colors"
                            title="Rename Group"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteGroup(group.id, group.name, group.contactCount)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Group"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end p-4 border-t border-slate-200 bg-[#F8FAF8]">
          <button
            type="button"
            onClick={onClose}
            className="bg-[#0A1D13] text-[#BEF264] px-5 py-2 text-xs font-bold hover:bg-black transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
