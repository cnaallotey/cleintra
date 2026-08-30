"use client";

import React, { useState } from "react";
import { 
  X, 
  Printer, 
  Share2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  Edit3, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  DollarSign
} from "lucide-react";
import { Invoice, InvoiceStatus } from "@/types/invoices";
import { 
  formatInvoiceCurrency, 
  generateWhatsAppInvoiceLink 
} from "@/lib/invoice-calculations";
import { updateInvoiceStatus, deleteInvoice } from "@/lib/invoices-store";

interface InvoiceViewModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (invoice: Invoice) => void;
  onDeleted: (invoiceId: string) => void;
  onStatusChanged: (updated: Invoice) => void;
}

export function InvoiceViewModal({
  invoice,
  isOpen,
  onClose,
  onEdit,
  onDeleted,
  onStatusChanged
}: InvoiceViewModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !invoice) return null;

  const isQuote = invoice.type === "quote";
  const docTitle = isQuote ? "QUOTATION" : "INVOICE";
  const currencyCode = invoice.currency || "GHS";
  const { url: whatsAppUrl } = generateWhatsAppInvoiceLink(invoice);

  const handleStatusChange = (newStatus: InvoiceStatus) => {
    const updated = updateInvoiceStatus(invoice.id, newStatus);
    if (updated) {
      onStatusChanged(updated);
    }
  };

  const handleDelete = () => {
    const success = deleteInvoice(invoice.id);
    if (success) {
      onDeleted(invoice.id);
      onClose();
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-black uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>PAID</span>
          </span>
        );
      case "sent":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>SENT (PENDING)</span>
          </span>
        );
      case "overdue":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-900 border border-rose-300 text-xs font-black uppercase tracking-wider">
            <AlertCircle className="w-3.5 h-3.5 text-rose-700" />
            <span>OVERDUE</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 border border-slate-300 text-xs font-black uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>DRAFT</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="w-full max-w-3xl bg-white border-2 border-slate-300 my-6 animate-in zoom-in-95 duration-150 flex flex-col max-h-[95vh] print:max-h-none print:border-none print:shadow-none print:w-full print:m-0">
        
        {/* Modal Controls Header (Hidden in Print) */}
        <div className="flex items-center justify-between p-4 bg-[#0A1D13] text-white border-b border-[#0A1D13] shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center bg-[#BEF264] text-[#0A1D13] font-black text-xs border border-[#BEF264]">
              {invoice.documentNumber.slice(0, 3)}
            </div>
            <div>
              <div className="text-sm font-black tracking-tight text-white flex items-center gap-2">
                <span>{invoice.documentNumber}</span>
                {getStatusBadge(invoice.status)}
              </div>
              <p className="text-[11px] text-slate-300">
                Created on {new Date(invoice.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Top Quick Actions */}
          <div className="flex items-center gap-2">
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#BEF264] hover:bg-[#A3E635] text-[#0A1D13] text-xs font-black px-3 py-1.5 border border-[#BEF264] transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-[#E2EFE4] hover:bg-[#C5DDC9] text-[#0A1D13] text-xs font-bold px-3 py-1.5 border border-[#C5DDC9] transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(invoice);
              }}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-emerald-900 transition-colors"
              title="Edit invoice"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-emerald-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Lifecycle Action Bar (Hidden in Print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#F8FAF8] border-b border-slate-200 text-xs shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-600 uppercase text-[10px] tracking-wider">
              Change Status:
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleStatusChange("draft")}
                className={`px-2.5 py-1 text-xs font-bold border transition-colors ${
                  invoice.status === "draft"
                    ? "bg-[#0A1D13] text-[#BEF264] border-[#0A1D13]"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                }`}
              >
                Draft
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange("sent")}
                className={`px-2.5 py-1 text-xs font-bold border transition-colors ${
                  invoice.status === "sent"
                    ? "bg-amber-500 text-white border-amber-500 font-black"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                }`}
              >
                Sent
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange("paid")}
                className={`px-2.5 py-1 text-xs font-bold border transition-colors ${
                  invoice.status === "paid"
                    ? "bg-emerald-600 text-white border-emerald-600 font-black"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                }`}
              >
                Paid ✓
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsDeleting(true)}
            className="text-xs font-bold text-rose-600 hover:text-rose-800 hover:underline flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Document</span>
          </button>
        </div>

        {/* Delete Confirmation Warning */}
        {isDeleting && (
          <div className="p-4 bg-rose-50 border-b border-rose-300 text-xs space-y-2 print:hidden animate-in fade-in">
            <div className="font-bold text-rose-900">
              Are you sure you want to delete {invoice.documentNumber}?
            </div>
            <p className="text-rose-700">
              This invoice record will be permanently deleted from your CRM and Cloud Firestore.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-1.5 bg-rose-600 text-white font-black hover:bg-rose-700 text-xs cursor-pointer"
              >
                Yes, Delete Permanently
              </button>
              <button
                type="button"
                onClick={() => setIsDeleting(false)}
                className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Printable Invoice Sheet */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 bg-white print:p-0 print:overflow-visible" id="printable-invoice">
          
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b-2 border-[#0A1D13] pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="h-6 w-6 bg-[#0A1D13] text-[#BEF264] font-black text-xs flex items-center justify-center border border-[#0A1D13]">
                  S
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {invoice.seller.businessName}
                </h1>
              </div>
              {invoice.seller.ownerName && (
                <p className="text-xs text-slate-600 font-medium">Attn: {invoice.seller.ownerName}</p>
              )}
              {invoice.seller.email && (
                <p className="text-xs text-slate-600">{invoice.seller.email}</p>
              )}
              {invoice.seller.phone && (
                <p className="text-xs text-slate-600">{invoice.seller.phone}</p>
              )}
            </div>

            <div className="sm:text-right space-y-1">
              <div className="text-2xl font-black tracking-tight text-[#0A1D13] uppercase">
                {docTitle}
              </div>
              <div className="text-sm font-black text-slate-800">
                #{invoice.documentNumber}
              </div>
              <div className="text-xs text-slate-600">
                <span className="font-bold">Date:</span> {invoice.issueDate}
              </div>
              <div className="text-xs text-slate-600">
                <span className="font-bold">Due Date:</span> {invoice.dueDate}
              </div>
              {invoice.paidAt && (
                <div className="text-xs font-bold text-emerald-700">
                  Paid on {new Date(invoice.paidAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>

          {/* Bill To Recipient */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#F8FAF8] p-4 border border-slate-200">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                BILL TO:
              </div>
              <div className="text-sm font-black text-slate-900">
                {invoice.customer.name}
              </div>
              {invoice.customer.phone && (
                <div className="text-xs text-slate-600 mt-0.5">
                  Tel: {invoice.customer.phone}
                </div>
              )}
              {invoice.customer.email && (
                <div className="text-xs text-slate-600">
                  Email: {invoice.customer.email}
                </div>
              )}
              {invoice.customer.address && (
                <div className="text-xs text-slate-600">
                  Address: {invoice.customer.address}
                </div>
              )}
            </div>

            <div className="sm:text-right flex flex-col justify-end">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Total Amount Due:
              </div>
              <div className="text-2xl font-black text-[#0A1D13]">
                {formatInvoiceCurrency(invoice.total, currencyCode)}
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-2">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0A1D13] text-[#BEF264] text-[10px] font-bold uppercase tracking-wider">
                  <th className="p-3">#</th>
                  <th className="p-3">Item Description</th>
                  <th className="p-3 text-right">Quantity</th>
                  <th className="p-3 text-right">Unit Price</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 border-b border-slate-300">
                {invoice.items.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-slate-50">
                    <td className="p-3 text-slate-400 font-bold">{idx + 1}</td>
                    <td className="p-3 font-bold text-slate-900">{item.description}</td>
                    <td className="p-3 text-right font-medium text-slate-700">{item.quantity}</td>
                    <td className="p-3 text-right font-medium text-slate-700">
                      {formatInvoiceCurrency(item.unitPrice, currencyCode)}
                    </td>
                    <td className="p-3 text-right font-black text-slate-900">
                      {formatInvoiceCurrency(item.total, currencyCode)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Financials & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
            
            {/* Notes / MoMo Details */}
            <div className="md:col-span-7 space-y-2">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Payment Instructions &amp; Notes
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200 text-xs text-slate-700 whitespace-pre-wrap font-medium">
                {invoice.notes || "Please make payment by the due date. Thank you for your business!"}
              </div>
            </div>

            {/* Totals Breakdown */}
            <div className="md:col-span-5 space-y-2">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200 text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-bold text-slate-900">
                    {formatInvoiceCurrency(invoice.subtotal, currencyCode)}
                  </span>
                </div>

                {invoice.discountPercentage > 0 && (
                  <div className="flex justify-between py-1 border-b border-slate-200 text-emerald-700">
                    <span>Discount ({invoice.discountPercentage}%):</span>
                    <span className="font-bold">
                      -{formatInvoiceCurrency(invoice.discountAmount, currencyCode)}
                    </span>
                  </div>
                )}

                {invoice.taxPercentage > 0 && (
                  <div className="flex justify-between py-1 border-b border-slate-200 text-slate-600">
                    <span>Tax/VAT ({invoice.taxPercentage}%):</span>
                    <span className="font-bold text-slate-900">
                      +{formatInvoiceCurrency(invoice.taxAmount, currencyCode)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between py-2 border-t-2 border-[#0A1D13] text-sm font-black text-[#0A1D13]">
                  <span>Total Due:</span>
                  <span>{formatInvoiceCurrency(invoice.total, currencyCode)}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Footer Thank You */}
          <div className="pt-6 border-t border-slate-200 text-center text-xs text-slate-500">
            Thank you for choosing <span className="font-bold text-slate-800">{invoice.seller.businessName}</span>!
          </div>

        </div>

      </div>
    </div>
  );
}
