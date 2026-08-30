"use client";

import React, { useState } from "react";
import { 
  Contact, 
  Interaction, 
  InteractionOutcome, 
  CreateInteractionInput, 
  UpdateInteractionInput 
} from "@/types/crm";
import { 
  logContactInteraction, 
  updateContactInteraction, 
  deleteContactInteraction 
} from "@/lib/contacts-store";
import { 
  Phone, 
  PhoneCall, 
  PhoneForwarded, 
  PhoneMissed, 
  Mail, 
  Users, 
  FileText, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Clock, 
  MessageSquare,
  History
} from "lucide-react";

interface InteractionTimelineProps {
  contact: Contact;
  interactions: Interaction[];
  onInteractionsChanged: (updatedContact: Contact) => void;
}

const OUTCOMES: { value: InteractionOutcome; label: string; icon: any; color: string }[] = [
  {
    value: "Call - Connected",
    label: "Call - Connected / Spoke with Client",
    icon: PhoneCall,
    color: "bg-[#E2EFE4] text-[#0A1D13] border-[#C5DDC9]"
  },
  {
    value: "Call - Left Voicemail",
    label: "Call - Left Voicemail / Voice Note",
    icon: PhoneForwarded,
    color: "bg-amber-50 text-amber-800 border-amber-300"
  },
  {
    value: "Call - No Answer",
    label: "Call - No Answer / Busy",
    icon: PhoneMissed,
    color: "bg-rose-50 text-rose-800 border-rose-300"
  },
  {
    value: "Email Sent",
    label: "Email / Quote Sent",
    icon: Mail,
    color: "bg-sky-50 text-sky-800 border-sky-300"
  },
  {
    value: "Meeting / Discussion",
    label: "In-Person Meeting / Discussion",
    icon: Users,
    color: "bg-purple-50 text-purple-800 border-purple-300"
  },
  {
    value: "Note / Other",
    label: "General Note / Other",
    icon: FileText,
    color: "bg-slate-50 text-slate-700 border-slate-300"
  }
];

function getOutcomeMeta(outcome: InteractionOutcome) {
  const match = OUTCOMES.find((o) => o.value === outcome);
  return match || {
    value: outcome,
    label: outcome,
    icon: FileText,
    color: "bg-slate-50 text-slate-700 border-slate-300"
  };
}

export function InteractionTimeline({
  contact,
  interactions,
  onInteractionsChanged
}: InteractionTimelineProps) {
  const [isLogging, setIsLogging] = useState(false);
  const [outcome, setOutcome] = useState<InteractionOutcome>("Call - Connected");
  const [date, setDate] = useState<string>(() => {
    const now = new Date();
    // format as YYYY-MM-DDTHH:mm for datetime-local input
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  });
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Edit log state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editOutcome, setEditOutcome] = useState<InteractionOutcome>("Call - Connected");
  const [editDate, setEditDate] = useState<string>("");
  const [editNotes, setEditNotes] = useState<string>("");

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!date) {
      setError("Please select a date and time for this interaction.");
      return;
    }

    try {
      const input: CreateInteractionInput = {
        date: new Date(date).toISOString(),
        outcome,
        notes: notes.trim()
      };

      const result = logContactInteraction(contact.id, input);
      if (result?.contact) {
        onInteractionsChanged(result.contact);
      }

      // Reset form
      setIsLogging(false);
      setNotes("");
      setOutcome("Call - Connected");
    } catch (err: any) {
      setError(err.message || "Failed to log interaction");
    }
  };

  const handleStartEdit = (item: Interaction) => {
    setEditingId(item.id);
    setEditOutcome(item.outcome);
    setEditNotes(item.notes || "");
    const d = new Date(item.date);
    setEditDate(new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
  };

  const handleSaveEdit = (interactionId: string) => {
    setError(null);
    try {
      const input: UpdateInteractionInput = {
        date: new Date(editDate).toISOString(),
        outcome: editOutcome,
        notes: editNotes.trim()
      };
      const result = updateContactInteraction(contact.id, interactionId, input);
      setEditingId(null);
      if (result?.contact) {
        onInteractionsChanged(result.contact);
      }
    } catch (err: any) {
      setError(err.message || "Failed to update interaction");
    }
  };

  const handleDelete = (interactionId: string) => {
    if (window.confirm("Are you sure you want to delete this interaction log?")) {
      try {
        const result = deleteContactInteraction(contact.id, interactionId);
        if (result?.contact) {
          onInteractionsChanged(result.contact);
        }
      } catch (err: any) {
        setError(err.message || "Failed to delete interaction");
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Activity Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-[#0A1D13]" />
          <h3 className="text-base font-black text-slate-900 tracking-tight">
            Activity &amp; Call Timeline ({interactions.length})
          </h3>
        </div>

        {!isLogging && (
          <button
            type="button"
            onClick={() => setIsLogging(true)}
            className="inline-flex items-center gap-1.5 bg-[#BEF264] hover:bg-[#A3E635] text-[#0A1D13] border border-[#BEF264] px-3.5 py-1.5 text-xs font-black transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Log Call / Interaction</span>
          </button>
        )}
      </div>

      {error && (
        <div className="border border-rose-300 bg-rose-50 p-3 text-xs text-rose-800 font-bold">
          {error}
        </div>
      )}

      {/* New Interaction Form Box */}
      {isLogging && (
        <form onSubmit={handleCreateLog} className="border-2 border-[#0A1D13] bg-[#F8FAF8] p-4 sm:p-5 space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-xs uppercase font-bold text-slate-900">
              Record New Interaction
            </span>
            <button
              type="button"
              onClick={() => setIsLogging(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Outcome Select */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Outcome / Channel <span className="text-rose-500">*</span>
              </label>
              <select
                value={outcome}
                onChange={(e) => setOutcome(e.target.value as InteractionOutcome)}
                className="w-full text-xs font-bold border border-slate-300 p-2 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13]"
              >
                {OUTCOMES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date / Time */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Date &amp; Time <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs font-bold border border-slate-300 p-2 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13]"
                required
              />
            </div>
          </div>

          {/* Notes textarea */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">
              Notes &amp; Next Steps <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Spoke with client. Very interested in wholesale pricing. Promised to send catalog by Friday."
              className="w-full text-xs border border-slate-300 p-2.5 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13]"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsLogging(false)}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 border border-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 bg-[#BEF264] hover:bg-[#A3E635] text-[#0A1D13] border border-[#BEF264] px-5 py-2 text-xs font-black transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Log</span>
            </button>
          </div>
        </form>
      )}

      {/* Timeline List */}
      {interactions.length === 0 ? (
        <div className="border border-dashed border-slate-300 bg-white p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center bg-slate-100 text-slate-400 mx-auto mb-3 border border-slate-200">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">No activity logged yet</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-4">
            Keep track of calls, WhatsApp conversations, or meetings by logging your first interaction above.
          </p>
          <button
            type="button"
            onClick={() => setIsLogging(true)}
            className="inline-flex items-center gap-1.5 bg-[#BEF264] hover:bg-[#A3E635] text-[#0A1D13] border border-[#BEF264] px-4 py-2 text-xs font-black transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log First Call</span>
          </button>
        </div>
      ) : (
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#0A1D13]">
          {interactions.map((act) => {
            const meta = getOutcomeMeta(act.outcome);
            const Icon = meta.icon;
            const formattedTime = new Date(act.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            });

            return (
              <div key={act.id} className="relative group">
                
                {/* Timeline Square Node */}
                <div className="absolute -left-6 top-1.5 flex h-5 w-5 items-center justify-center bg-[#0A1D13] text-[#BEF264]">
                  <div className="h-1.5 w-1.5 bg-[#BEF264]"></div>
                </div>

                {editingId === act.id ? (
                  /* Inline Edit Form */
                  <div className="border border-slate-300 bg-white p-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <select
                        value={editOutcome}
                        onChange={(e) => setEditOutcome(e.target.value as InteractionOutcome)}
                        className="text-xs font-bold border border-slate-300 p-2 bg-white"
                      >
                        {OUTCOMES.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="datetime-local"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="text-xs font-bold border border-slate-300 p-2 bg-white"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      className="w-full text-xs border border-slate-300 p-2.5 bg-white"
                      placeholder="Notes..."
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(act.id)}
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs font-black bg-[#BEF264] text-[#0A1D13] border border-[#BEF264]"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Standard Display Card */
                  <div className="border border-slate-300 bg-white p-4 hover:border-slate-400 transition-all space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold uppercase border ${meta.color}`}>
                          <Icon className="w-3.5 h-3.5" />
                          <span>{act.outcome}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          {formattedTime}
                        </span>

                        <div className="flex items-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity pl-2">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(act)}
                            title="Edit this log"
                            className="p-1 text-slate-500 hover:text-black hover:bg-slate-100 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(act.id)}
                            title="Delete this log"
                            className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {act.notes && (
                      <p className="text-xs text-slate-800 leading-relaxed font-medium bg-[#F8FAF8] p-3 border border-slate-200">
                        {act.notes}
                      </p>
                    )}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
