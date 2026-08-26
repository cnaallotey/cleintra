"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Loader2,
  Folder,
  FolderPlus
} from "lucide-react";
import { parseAndValidateCsv } from "@/lib/csv-parser";
import { ValidationSummary, ContactGroup } from "@/types/crm";
import { importBatchContacts, getContactGroups, createContactGroup } from "@/lib/contacts-store";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (count: number) => void;
  defaultGroupId?: string | null;
}

export function ImportModal({ 
  isOpen, 
  onClose, 
  onImportSuccess,
  defaultGroupId 
}: ImportModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [summary, setSummary] = useState<ValidationSummary | null>(null);
  const [showErrorDetails, setShowErrorDetails] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  
  // Group selection state
  const [groups, setGroups] = useState<ContactGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(defaultGroupId || "");
  const [isCreatingInlineGroup, setIsCreatingInlineGroup] = useState(false);
  const [inlineGroupName, setInlineGroupName] = useState("");
  const [inlineGroupError, setInlineGroupError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setGroups(getContactGroups());
      setSelectedGroupId(defaultGroupId || "");
      setIsCreatingInlineGroup(false);
      setInlineGroupName("");
      setInlineGroupError(null);
    }
  }, [isOpen, defaultGroupId]);

  if (!isOpen) return null;

  const resetState = () => {
    setFileError(null);
    setSummary(null);
    setShowErrorDetails(false);
    setIsImporting(false);
    setIsCreatingInlineGroup(false);
    setInlineGroupName("");
    setInlineGroupError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleCreateInlineGroup = (e: React.FormEvent) => {
    e.preventDefault();
    setInlineGroupError(null);
    try {
      const created = createContactGroup(inlineGroupName);
      const updatedGroups = getContactGroups();
      setGroups(updatedGroups);
      setSelectedGroupId(created.id);
      setIsCreatingInlineGroup(false);
      setInlineGroupName("");
    } catch (err: any) {
      setInlineGroupError(err.message || "Failed to create group.");
    }
  };

  const processFile = (file: File) => {
    setFileError(null);
    setSummary(null);

    // Validate file type (AC 4)
    const isCsvExtension = file.name.toLowerCase().endsWith(".csv");
    const isCsvMime = file.type === "text/csv" || file.type === "application/vnd.ms-excel" || file.type === "";

    if (!isCsvExtension && !isCsvMime) {
      setFileError("Invalid file type. Please upload a standard .csv spreadsheet file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text || text.trim().length === 0) {
          setFileError("The uploaded CSV file is empty. Please upload a file with contact records.");
          return;
        }

        const validationResult = parseAndValidateCsv(text, file.name);
        if (validationResult.error) {
          setFileError(validationResult.error);
          return;
        }

        if (validationResult.summary) {
          setSummary(validationResult.summary);
          if (validationResult.summary.totalRows === 0) {
            setFileError("The uploaded CSV file does not contain any contact rows.");
          }
        }
      } catch (err) {
        setFileError("Failed to parse the CSV file. Please verify it is a valid comma-separated spreadsheet.");
      }
    };

    reader.onerror = () => {
      setFileError("Failed to read the file from your disk. Please try again.");
    };

    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleConfirmImport = () => {
    if (!summary || summary.validCount === 0) return;

    setIsImporting(true);
    try {
      const targetGroup = selectedGroupId ? selectedGroupId : null;
      importBatchContacts(summary.validContacts, targetGroup);
      const count = summary.validCount;
      resetState();
      onImportSuccess(count);
    } catch (err) {
      setFileError("An error occurred while saving your contacts. Please try again.");
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white border-2 border-slate-300 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header (Deep Forest Green Banner) */}
        <div className="flex items-center justify-between p-5 bg-[#0A1D13] text-white border-b border-[#0A1D13]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold uppercase bg-[#BEF264] text-[#0A1D13] px-2 py-0.5">
                BULK INTAKE
              </span>
              <h2 className="text-base font-black text-white tracking-tight">Import Contacts (CSV)</h2>
            </div>
            <p className="text-xs text-slate-300 mt-1 font-medium">Upload a CSV spreadsheet to add multiple leads in 30 seconds.</p>
          </div>
          <button 
            type="button"
            onClick={handleClose}
            className="p-1 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* Target Group Selector */}
          <div className="border border-slate-300 bg-[#F8FAF8] p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Folder className="w-4 h-4 text-[#0A1D13]" />
                <span>Assign Imported Contacts to Group:</span>
              </label>
              {!isCreatingInlineGroup && (
                <button
                  type="button"
                  onClick={() => setIsCreatingInlineGroup(true)}
                  className="text-xs font-bold text-[#0A1D13] hover:underline inline-flex items-center gap-1"
                >
                  <FolderPlus className="w-3.5 h-3.5 text-[#0A1D13]" />
                  <span>+ New Group</span>
                </button>
              )}
            </div>

            {isCreatingInlineGroup ? (
              <div className="space-y-1.5 pt-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inlineGroupName}
                    onChange={(e) => setInlineGroupName(e.target.value)}
                    placeholder="Enter group name (e.g. VIP Wholesale)"
                    className="flex-1 border border-slate-300 px-3 py-1.5 text-xs bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13]"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleCreateInlineGroup}
                    disabled={!inlineGroupName.trim()}
                    className="bg-[#0A1D13] px-3 py-1.5 text-xs font-bold text-[#BEF264] hover:bg-black disabled:opacity-50"
                  >
                    Save Group
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingInlineGroup(false);
                      setInlineGroupName("");
                      setInlineGroupError(null);
                    }}
                    className="bg-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-300"
                  >
                    Cancel
                  </button>
                </div>
                {inlineGroupError && (
                  <p className="text-[11px] text-rose-600 font-bold">{inlineGroupError}</p>
                )}
              </div>
            ) : (
              <select
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="w-full border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm font-bold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13]"
              >
                <option value="">None (All Contacts / General)</option>
                {groups.map((grp) => (
                  <option key={grp.id} value={grp.id}>
                    📁 {grp.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Sample template link */}
          <div className="flex items-center justify-between bg-[#F8FAF8] p-3 text-xs text-slate-600 border border-slate-300">
            <span>Need standard CSV format with sample headers?</span>
            <a 
              href="/api/contacts/template" 
              download="sample_contacts.csv"
              className="inline-flex items-center gap-1.5 font-bold text-[#0A1D13] hover:underline"
            >
              <Download className="w-3.5 h-3.5" />
              Download Template
            </a>
          </div>

          {/* Error Banner */}
          {fileError && (
            <div className="border border-rose-300 bg-rose-50 p-3 text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="flex-1 font-bold">{fileError}</div>
            </div>
          )}

          {/* Upload Dropzone */}
          {!summary ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
                isDragging 
                  ? "border-[#0A1D13] bg-[#E2EFE4]/60" 
                  : "border-slate-400 hover:border-[#0A1D13] bg-[#F8FAF8] hover:bg-[#F4F9F4]"
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center bg-[#0A1D13] text-[#BEF264] mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-900">
                Click to browse or drag and drop your CSV file here
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Supports .csv files exported from Excel, Google Sheets, or mobile contacts
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv,application/vnd.ms-excel"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* File details banner */}
              <div className="flex items-center justify-between bg-slate-100 p-3 text-xs border border-slate-300 font-mono">
                <div className="flex items-center gap-2 text-slate-800 font-bold">
                  <FileText className="w-4 h-4 text-[#0A1D13]" />
                  <span>{summary.fileName || "Uploaded CSV"}</span>
                  <span className="text-slate-500 font-normal">({summary.totalRows} rows analyzed)</span>
                </div>
                <button
                  type="button"
                  onClick={resetState}
                  className="text-xs font-bold text-slate-700 hover:text-black underline cursor-pointer"
                >
                  Change file
                </button>
              </div>

              {/* Validation Summary Card */}
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-emerald-300 bg-[#E2EFE4] p-3.5 text-[#0A1D13]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider">Valid Contacts</span>
                  </div>
                  <div className="mt-1 text-2xl font-black font-mono">
                    {summary.validCount}
                  </div>
                  <p className="text-[11px] font-medium opacity-90 mt-0.5">Ready to be imported.</p>
                </div>

                <div className={`border p-3.5 ${
                  summary.errorCount > 0 
                    ? "border-amber-300 bg-amber-50 text-amber-900" 
                    : "border-slate-300 bg-slate-50 text-slate-600"
                }`}>
                  <div className="flex items-center gap-2">
                    <AlertCircle className={`w-4 h-4 ${summary.errorCount > 0 ? "text-amber-600" : "text-slate-400"}`} />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider">Invalid Rows</span>
                  </div>
                  <div className={`mt-1 text-2xl font-black font-mono ${summary.errorCount > 0 ? "text-amber-700" : "text-slate-700"}`}>
                    {summary.errorCount}
                  </div>
                  <p className="text-[11px] font-medium mt-0.5 opacity-80">
                    {summary.errorCount > 0 ? "Will be skipped safely." : "No errors found."}
                  </p>
                </div>
              </div>

              {/* Error Details Accordion */}
              {summary.errorCount > 0 && (
                <div className="border border-amber-300 bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowErrorDetails(!showErrorDetails)}
                    className="flex w-full items-center justify-between p-3 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 transition-colors"
                  >
                    <span>View {summary.errorCount} Row Errors (click to inspect)</span>
                    {showErrorDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {showErrorDetails && (
                    <div className="max-h-40 overflow-y-auto divide-y divide-slate-100 p-2 text-xs font-mono">
                      {summary.errors.map((err, i) => (
                        <div key={i} className="py-1.5 px-2 flex items-start gap-2">
                          <span className="font-bold text-amber-800 shrink-0">Row {err.rowNumber}:</span>
                          <span className="text-slate-700">{err.message}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Partial import note */}
              {summary.validCount > 0 && summary.errorCount > 0 && (
                <p className="text-xs text-slate-600 italic">
                  💡 Partial import: All {summary.validCount} valid contacts will be added. You can correct the {summary.errorCount} error row(s) and re-upload later.
                </p>
              )}

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-200 bg-[#F8FAF8]">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-200 border border-slate-300 transition-colors"
          >
            Cancel
          </button>
          
          {summary && summary.validCount > 0 && (
            <button
              type="button"
              onClick={handleConfirmImport}
              disabled={isImporting}
              className="inline-flex items-center gap-2 bg-[#BEF264] hover:bg-[#A3E635] text-[#0A1D13] border border-[#BEF264] px-5 py-2 text-xs sm:text-sm font-black transition-all disabled:opacity-50"
            >
              {isImporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Importing...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Import {summary.validCount} Contact{summary.validCount > 1 ? "s" : ""}</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
