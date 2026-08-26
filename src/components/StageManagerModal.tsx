"use client";

import React, { useState } from "react";
import { PipelineStageWithCount, StageColor } from "@/types/crm";
import { 
  createPipelineStage, 
  updatePipelineStage, 
  deletePipelineStage 
} from "@/lib/contacts-store";
import { 
  X, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  AlertCircle, 
  Sliders, 
  ArrowRight
} from "lucide-react";
import { StageBadge } from "./StageBadge";

interface StageManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  stagesWithCounts: PipelineStageWithCount[];
  onStagesChanged: () => void;
}

const AVAILABLE_COLORS: StageColor[] = ["blue", "amber", "purple", "emerald", "rose", "indigo", "gray"];

export function StageManagerModal({
  isOpen,
  onClose,
  stagesWithCounts,
  onStagesChanged
}: StageManagerModalProps) {
  const [newStageName, setNewStageName] = useState("");
  const [newStageColor, setNewStageColor] = useState<StageColor>("blue");
  
  // Inline editing state
  const [editingStageId, setEditingStageId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState<StageColor>("blue");

  // Deletion reassignment state
  const [stageToDelete, setStageToDelete] = useState<PipelineStageWithCount | null>(null);
  const [reassignTarget, setReassignTarget] = useState<string>("");

  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddStage = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newStageName.trim()) return;

    try {
      createPipelineStage(newStageName.trim(), newStageColor);
      setNewStageName("");
      onStagesChanged();
    } catch (err: any) {
      setError(err.message || "Failed to add stage");
    }
  };

  const startEdit = (stage: PipelineStageWithCount) => {
    setEditingStageId(stage.id);
    setEditName(stage.name);
    setEditColor(stage.color);
    setError(null);
  };

  const handleSaveEdit = (stageId: string) => {
    setError(null);
    try {
      updatePipelineStage(stageId, { name: editName.trim(), color: editColor });
      setEditingStageId(null);
      onStagesChanged();
    } catch (err: any) {
      setError(err.message || "Failed to update stage");
    }
  };

  const confirmDelete = () => {
    if (!stageToDelete) return;
    setError(null);

    try {
      if (stageToDelete.contactCount > 0 && !reassignTarget) {
        setError("Please select another stage to move these contacts to.");
        return;
      }

      deletePipelineStage(stageToDelete.id, reassignTarget || undefined);
      setStageToDelete(null);
      setReassignTarget("");
      onStagesChanged();
    } catch (err: any) {
      setError(err.message || "Failed to delete stage");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white border-2 border-slate-300 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-[#0A1D13] text-white border-b border-[#0A1D13]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold uppercase bg-[#BEF264] text-[#0A1D13] px-2 py-0.5">
                FUNNEL CONFIG
              </span>
              <h2 className="text-base font-black text-white tracking-tight">Customize Pipeline Stages</h2>
            </div>
            <p className="text-xs text-slate-300 mt-1 font-medium">Add, rename, or recolor stages to match your business sales process.</p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {error && (
            <div className="border border-rose-300 bg-rose-50 p-3 text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="flex-1 font-bold">{error}</div>
            </div>
          )}

          {/* Delete Confirmation with Reassignment */}
          {stageToDelete && (
            <div className="border-2 border-rose-400 bg-rose-50/80 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase font-bold text-rose-900 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  Confirm Stage Deletion: &ldquo;{stageToDelete.name}&rdquo;
                </span>
                <button
                  type="button"
                  onClick={() => setStageToDelete(null)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>

              {stageToDelete.contactCount > 0 ? (
                <div className="space-y-2 text-xs text-rose-950">
                  <p>
                    There are <b>{stageToDelete.contactCount}</b> active contact(s) currently in this stage.
                    Select where they should be safely moved:
                  </p>
                  <select
                    value={reassignTarget}
                    onChange={(e) => setReassignTarget(e.target.value)}
                    className="w-full border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800"
                  >
                    <option value="">-- Choose destination stage --</option>
                    {stagesWithCounts
                      .filter((s) => s.id !== stageToDelete.id)
                      .map((s) => (
                        <option key={s.id} value={s.name}>
                          Move to: {s.name} ({s.contactCount} existing contacts)
                        </option>
                      ))}
                  </select>
                </div>
              ) : (
                <p className="text-xs text-rose-950">
                  This stage has no contacts. It will be permanently removed.
                </p>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setStageToDelete(null)}
                  className="px-3 py-1.5 text-xs font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="px-4 py-1.5 text-xs font-black bg-rose-600 text-white hover:bg-rose-700"
                >
                  Confirm Delete &amp; Move
                </button>
              </div>
            </div>
          )}

          {/* Existing Stages List */}
          {!stageToDelete && (
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase font-bold text-slate-700 block">
                Active Stages ({stagesWithCounts.length})
              </label>

              <div className="space-y-2">
                {stagesWithCounts.map((stage) => (
                  <div
                    key={stage.id}
                    className="flex items-center justify-between p-3 border border-slate-300 bg-[#F8FAF8] hover:bg-white transition-colors"
                  >
                    {editingStageId === stage.id ? (
                      /* Inline Edit Form */
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 text-xs font-bold border border-slate-300 px-2.5 py-1.5 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13]"
                          placeholder="Stage name"
                          autoFocus
                        />
                        <select
                          value={editColor}
                          onChange={(e) => setEditColor(e.target.value as StageColor)}
                          className="text-xs font-bold border border-slate-300 px-2 py-1.5 bg-white"
                        >
                          {AVAILABLE_COLORS.map((col) => (
                            <option key={col} value={col}>
                              {col}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(stage.id)}
                          className="p-1.5 bg-[#0A1D13] text-[#BEF264] hover:bg-black"
                          title="Save changes"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingStageId(null)}
                          className="p-1.5 text-slate-500 hover:bg-slate-200"
                          title="Cancel"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      /* Normal Display */
                      <>
                        <div className="flex items-center gap-3">
                          <StageBadge status={stage.name} color={stage.color} size="md" />
                          <span className="text-xs font-mono text-slate-500 font-bold">
                            {stage.contactCount} contact{stage.contactCount === 1 ? "" : "s"}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => startEdit(stage)}
                            className="p-1.5 text-slate-600 hover:text-black hover:bg-slate-200 transition-colors"
                            title="Rename stage"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {stagesWithCounts.length > 1 && (
                            <button
                              type="button"
                              onClick={() => { setStageToDelete(stage); setError(null); }}
                              className="p-1.5 text-slate-600 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                              title="Delete stage"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Stage Form */}
          {!stageToDelete && (
            <form onSubmit={handleAddStage} className="pt-3 border-t border-slate-200 space-y-2">
              <label className="text-xs font-mono uppercase font-bold text-slate-700 block">
                Add a New Stage
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Color Swatches */}
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-mono font-bold text-slate-500 mr-1 uppercase">Color:</span>
                  {AVAILABLE_COLORS.map((col) => {
                    const isSelected = newStageColor === col;
                    const bgColors: Record<StageColor, string> = {
                      blue: "bg-sky-500",
                      amber: "bg-amber-500",
                      purple: "bg-purple-500",
                      emerald: "bg-emerald-500",
                      rose: "bg-rose-500",
                      indigo: "bg-indigo-500",
                      gray: "bg-slate-500"
                    };
                    return (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setNewStageColor(col)}
                        className={`h-5 w-5 ${bgColors[col]} transition-transform ${
                          isSelected ? "ring-2 ring-offset-1 ring-slate-900 scale-110" : "opacity-70 hover:opacity-100"
                        }`}
                        title={col}
                      />
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 pt-1 w-full sm:w-auto flex-1">
                  <input
                    type="text"
                    value={newStageName}
                    onChange={(e) => setNewStageName(e.target.value)}
                    placeholder="e.g. Quoted, Demo Booked..."
                    className="flex-1 text-xs font-bold border border-slate-300 px-3 py-2 bg-[#F8FAF8] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13]"
                  />
                  <button
                    type="submit"
                    disabled={!newStageName.trim()}
                    className="inline-flex items-center gap-1.5 bg-[#BEF264] hover:bg-[#A3E635] text-[#0A1D13] border border-[#BEF264] px-4 py-2 text-xs font-black transition-all disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Stage</span>
                  </button>
                </div>
              </div>
            </form>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-4 border-t border-slate-200 bg-[#F8FAF8]">
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
