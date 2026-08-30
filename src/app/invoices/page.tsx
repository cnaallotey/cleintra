"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Receipt, 
  Share2, 
  Printer, 
  Eye, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText,
  DollarSign,
  Users,
  ChevronRight,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { AuthGuard } from "@/components/AuthGuard";
import { Invoice, InvoiceStatus, InvoiceType } from "@/types/invoices";
import { 
  getInvoices, 
  getInvoicesDashboardMetrics, 
  deleteInvoice 
} from "@/lib/invoices-store";
import { 
  formatInvoiceCurrency, 
  generateWhatsAppInvoiceLink 
} from "@/lib/invoice-calculations";
import { InvoiceModal } from "@/components/InvoiceModal";
import { InvoiceViewModal } from "@/components/InvoiceViewModal";
import { useAuth } from "@/lib/auth-context";

export default function InvoicesPage() {
  const { business } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalType, setCreateModalType] = useState<InvoiceType>("invoice");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  // Reload invoices
  const reloadInvoices = () => {
    try {
      const list = getInvoices();
      setInvoices(list);
    } catch (e) {
      console.error("Failed to load invoices:", e);
    }
  };

  useEffect(() => {
    reloadInvoices();
  }, []);

  // Compute metrics
  const metrics = useMemo(() => {
    return getInvoicesDashboardMetrics(invoices);
  }, [invoices]);

  const currencyCode = business?.currency || "GHS";
  const todayStr = new Date().toISOString().split("T")[0];

  // Filtered list
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      // Type filter
      if (typeFilter !== "all" && inv.type !== typeFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== "all") {
        if (statusFilter === "overdue") {
          const isOverdue = inv.status === "overdue" || (inv.status === "sent" && inv.dueDate < todayStr);
          if (!isOverdue) return false;
        } else if (inv.status !== statusFilter) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const docMatch = inv.documentNumber.toLowerCase().includes(q);
        const nameMatch = inv.customer.name.toLowerCase().includes(q);
        const phoneMatch = inv.customer.phone?.toLowerCase().includes(q);
        const emailMatch = inv.customer.email?.toLowerCase().includes(q);
        if (!docMatch && !nameMatch && !phoneMatch && !emailMatch) {
          return false;
        }
      }

      return true;
    });
  }, [invoices, typeFilter, statusFilter, searchQuery, todayStr]);

  const handleOpenCreate = (docType: InvoiceType = "invoice") => {
    setEditingInvoice(null);
    setCreateModalType(docType);
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setIsCreateModalOpen(true);
  };

  const handleOpenView = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsViewModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteInvoice(id);
    reloadInvoices();
    if (selectedInvoice?.id === id) {
      setIsViewModalOpen(false);
      setSelectedInvoice(null);
    }
  };

  return (
    <AuthGuard>
      <div className="space-y-6 pb-12">
        
        {/* Top Header & Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0A1D13] bg-[#BEF264] px-2 py-0.5 border border-[#BEF264]">
                Sales &amp; Billing
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Invoices &amp; Quotations
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
              Generate, print, and WhatsApp-share professional invoices and track payments in real time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleOpenCreate("quote")}
              className="inline-flex items-center gap-1.5 bg-[#E2EFE4] hover:bg-[#C5DDC9] text-[#0A1D13] font-bold px-3.5 py-2.5 text-xs border border-[#C5DDC9] transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#0A1D13]" />
              <span>New Quotation</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenCreate("invoice")}
              className="inline-flex items-center gap-1.5 bg-[#BEF264] hover:bg-[#A3E635] text-[#0A1D13] font-black px-4 py-2.5 text-xs border border-[#BEF264] transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#0A1D13]" />
              <span>New Invoice</span>
            </button>
          </div>
        </div>

        {/* Dashboard Financial Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-4 bg-white border border-slate-300 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Total Invoiced
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#0A1D13]">
              {formatInvoiceCurrency(metrics.totalInvoiced, currencyCode)}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              {metrics.totalCount} total documents ({metrics.invoiceCount} invoices, {metrics.quoteCount} quotes)
            </div>
          </div>

          <div className="p-4 bg-[#F4F9F4] border border-emerald-300 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
              Paid Revenue
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-900">
              {formatInvoiceCurrency(metrics.paidAmount, currencyCode)}
            </div>
            <div className="text-[11px] text-emerald-700 font-bold">
              {metrics.paidCount} paid invoices
            </div>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-300 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
              Outstanding / Pending
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-950">
              {formatInvoiceCurrency(metrics.outstandingAmount, currencyCode)}
            </div>
            <div className="text-[11px] text-amber-800 font-bold">
              {metrics.sentCount} sent awaiting payment
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-300 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
              Drafts (Unsent)
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-800">
              {formatInvoiceCurrency(metrics.draftAmount, currencyCode)}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              {metrics.draftCount} draft documents
            </div>
          </div>

        </div>

        {/* Filter & Search Controls Deck */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 border border-slate-300">
          
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by client name, document #, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-bold pl-9 pr-3 py-2 border border-slate-300 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13]"
            />
          </div>

          {/* Type & Status Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Type Selector */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs font-bold px-3 py-2 border border-slate-300 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13]"
            >
              <option value="all">All Document Types</option>
              <option value="invoice">Invoices Only</option>
              <option value="quote">Quotations Only</option>
            </select>

            {/* Status Pills */}
            <div className="flex items-center gap-1 border border-slate-300 p-1 bg-slate-50">
              {[
                { id: "all", label: "All" },
                { id: "draft", label: "Draft" },
                { id: "sent", label: "Sent" },
                { id: "paid", label: "Paid" },
                { id: "overdue", label: "Overdue" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-2.5 py-1 text-xs font-bold transition-colors cursor-pointer ${
                    statusFilter === tab.id
                      ? "bg-[#0A1D13] text-[#BEF264]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Invoices List Table */}
        <div className="bg-white border border-slate-300 overflow-hidden">
          {filteredInvoices.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center bg-slate-100 text-slate-400 border border-slate-200">
                <Receipt className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                    ? "No matching invoices found"
                    : "No invoices created yet"}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                    ? "Try adjusting your search query, document type, or status filter."
                    : "Create professional invoices or quotes for your customers and share them instantly on WhatsApp."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenCreate("invoice")}
                className="inline-flex items-center gap-2 bg-[#BEF264] hover:bg-[#A3E635] text-[#0A1D13] border border-[#BEF264] px-4 py-2 text-xs font-black transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Your First Invoice</span>
              </button>
            </div>
          ) : (
            <div>
              {/* Table Header (Deep Forest Green Strip) */}
              <div className="hidden md:grid md:grid-cols-12 md:gap-4 px-6 py-3 bg-[#0A1D13] border-b border-[#0A1D13] text-[10px] font-bold text-[#BEF264] uppercase tracking-wider">
                <div className="col-span-3">Document &amp; Client</div>
                <div className="col-span-3">Dates (Issue / Due)</div>
                <div className="col-span-2 text-right">Amount</div>
                <div className="col-span-2 text-center">Status</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-slate-200">
                {filteredInvoices.map((inv) => {
                  const isOverdue = inv.status === "sent" && inv.dueDate < todayStr;
                  const displayStatus = isOverdue ? "overdue" : inv.status;
                  const { url: whatsAppUrl } = generateWhatsAppInvoiceLink(inv);

                  return (
                    <div
                      key={inv.id}
                      className="p-4 sm:px-6 md:py-3.5 hover:bg-[#F8FAF8] transition-colors md:grid md:grid-cols-12 md:gap-4 md:items-center space-y-3 md:space-y-0"
                    >
                      {/* Document & Client */}
                      <div className="md:col-span-3 min-w-0">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenView(inv)}
                            className="font-black text-slate-900 hover:text-[#0A1D13] hover:underline text-xs tracking-tight truncate cursor-pointer text-left"
                          >
                            {inv.documentNumber}
                          </button>
                          <span
                            className={`text-[9px] font-bold uppercase px-1.5 py-0.5 border ${
                              inv.type === "quote"
                                ? "bg-purple-100 text-purple-800 border-purple-200"
                                : "bg-blue-100 text-blue-800 border-blue-200"
                            }`}
                          >
                            {inv.type}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-slate-700 truncate mt-0.5">
                          {inv.customer.name}
                        </div>
                        {inv.customer.phone && (
                          <div className="text-[11px] text-slate-500 truncate">
                            {inv.customer.phone}
                          </div>
                        )}
                      </div>

                      {/* Dates */}
                      <div className="md:col-span-3 text-xs text-slate-600 space-y-0.5">
                        <div>
                          <span className="font-bold text-slate-700">Issued:</span> {inv.issueDate}
                        </div>
                        <div>
                          <span className="font-bold text-slate-700">Due:</span>{" "}
                          <span className={isOverdue ? "text-rose-600 font-bold" : ""}>
                            {inv.dueDate}
                          </span>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="md:col-span-2 md:text-right">
                        <div className="text-xs font-black text-slate-900">
                          {formatInvoiceCurrency(inv.total, inv.currency)}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium">
                          {inv.items.length} {inv.items.length === 1 ? "item" : "items"}
                        </div>
                      </div>

                      {/* Status */}
                      <div className="md:col-span-2 flex justify-start md:justify-center">
                        {displayStatus === "paid" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-black uppercase">
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                            <span>Paid</span>
                          </span>
                        )}
                        {displayStatus === "sent" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black uppercase">
                            <Clock className="w-3 h-3 text-amber-700" />
                            <span>Sent</span>
                          </span>
                        )}
                        {displayStatus === "overdue" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-rose-100 text-rose-900 border border-rose-300 text-[10px] font-black uppercase">
                            <AlertCircle className="w-3 h-3 text-rose-700" />
                            <span>Overdue</span>
                          </span>
                        )}
                        {displayStatus === "draft" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 text-slate-800 border border-slate-300 text-[10px] font-black uppercase">
                            <FileText className="w-3 h-3 text-slate-500" />
                            <span>Draft</span>
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="md:col-span-2 flex items-center justify-end gap-1.5">
                        <a
                          href={whatsAppUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Share on WhatsApp"
                          className="p-1.5 text-slate-700 hover:text-[#0A1D13] hover:bg-[#BEF264] border border-slate-300 hover:border-[#BEF264] transition-colors"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </a>

                        <button
                          type="button"
                          onClick={() => handleOpenView(inv)}
                          title="View / Print Document"
                          className="p-1.5 text-slate-700 hover:text-[#0A1D13] hover:bg-[#E2EFE4] border border-slate-300 hover:border-[#C5DDC9] transition-colors cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(inv)}
                          title="Edit Document"
                          className="p-1.5 text-slate-700 hover:text-black hover:bg-slate-100 border border-slate-300 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(inv.id)}
                          title="Delete Document"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Invoices Create / Edit Modal */}
        {isCreateModalOpen && (
          <InvoiceModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSaved={() => {
              reloadInvoices();
              setIsCreateModalOpen(false);
            }}
            editInvoice={editingInvoice}
            defaultType={createModalType}
          />
        )}

        {/* Invoice View & Print Modal */}
        {isViewModalOpen && selectedInvoice && (
          <InvoiceViewModal
            isOpen={isViewModalOpen}
            invoice={selectedInvoice}
            onClose={() => {
              setIsViewModalOpen(false);
              setSelectedInvoice(null);
            }}
            onEdit={(inv) => {
              setIsViewModalOpen(false);
              handleOpenEdit(inv);
            }}
            onDeleted={(id) => {
              handleDelete(id);
            }}
            onStatusChanged={(updated) => {
              setSelectedInvoice(updated);
              reloadInvoices();
            }}
          />
        )}

      </div>
    </AuthGuard>
  );
}
