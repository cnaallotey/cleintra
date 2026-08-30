"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Plus, 
  Trash2, 
  Calculator, 
  UserCheck, 
  Building, 
  Calendar, 
  Percent, 
  FileText,
  AlertCircle
} from "lucide-react";
import { 
  Invoice, 
  InvoiceType, 
  InvoiceStatus, 
  DueDatePreset, 
  CreateInvoiceInput, 
  UpdateInvoiceInput 
} from "@/types/invoices";
import { Contact } from "@/types/crm";
import { 
  calculateInvoiceTotals, 
  calculateDueDate, 
  generateNextDocumentNumber,
  formatInvoiceCurrency 
} from "@/lib/invoice-calculations";
import { getInvoices, createInvoice, updateInvoice } from "@/lib/invoices-store";
import { getStoredContacts } from "@/lib/contacts-store";
import { useAuth } from "@/lib/auth-context";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (invoice: Invoice) => void;
  editInvoice?: Invoice | null;
  preSelectedContactId?: string | null;
  defaultType?: InvoiceType;
}

export function InvoiceModal({
  isOpen,
  onClose,
  onSaved,
  editInvoice,
  preSelectedContactId,
  defaultType = "invoice"
}: InvoiceModalProps) {
  const { business, user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);

  // Form State
  const [type, setType] = useState<InvoiceType>(editInvoice?.type || defaultType);
  const [documentNumber, setDocumentNumber] = useState<string>("");
  const [status, setStatus] = useState<InvoiceStatus>(editInvoice?.status || "draft");
  const [issueDate, setIssueDate] = useState<string>(
    editInvoice?.issueDate || new Date().toISOString().split("T")[0]
  );
  const [dueDatePreset, setDueDatePreset] = useState<DueDatePreset>(
    editInvoice?.dueDatePreset || "7d"
  );
  const [dueDate, setDueDate] = useState<string>(
    editInvoice?.dueDate || calculateDueDate(issueDate, "7d")
  );

  // Customer
  const [selectedContactId, setSelectedContactId] = useState<string>(
    editInvoice?.customer.contactId || preSelectedContactId || ""
  );
  const [customerName, setCustomerName] = useState<string>(editInvoice?.customer.name || "");
  const [customerEmail, setCustomerEmail] = useState<string>(editInvoice?.customer.email || "");
  const [customerPhone, setCustomerPhone] = useState<string>(editInvoice?.customer.phone || "");
  const [customerAddress, setCustomerAddress] = useState<string>(editInvoice?.customer.address || "");

  // Line items
  const [items, setItems] = useState<Array<{ id: string; description: string; quantity: number; unitPrice: number }>>(
    editInvoice?.items.map((it) => ({ ...it })) || [
      { id: "item_1", description: "", quantity: 1, unitPrice: 0 }
    ]
  );

  const [discountPercentage, setDiscountPercentage] = useState<number>(
    editInvoice?.discountPercentage || 0
  );
  const [taxPercentage, setTaxPercentage] = useState<number>(
    editInvoice?.taxPercentage || 0
  );
  const [notes, setNotes] = useState<string>(
    editInvoice?.notes || (business?.phone ? `Please make payment to MoMo / Bank: ${business.phone}` : "")
  );

  const [error, setError] = useState<string | null>(null);

  // Load contacts for dropdown
  useEffect(() => {
    try {
      const allContacts = getStoredContacts();
      setContacts(allContacts);

      if (preSelectedContactId && !editInvoice) {
        const found = allContacts.find((c: Contact) => c.id === preSelectedContactId);
        if (found) {
          setSelectedContactId(found.id);
          setCustomerName(found.name);
          setCustomerEmail(found.email || "");
          setCustomerPhone(found.phone || "");
        }
      }
    } catch (e) {
      // safe fallback
    }
  }, [preSelectedContactId, editInvoice]);

  // Set document number
  useEffect(() => {
    if (editInvoice) {
      setDocumentNumber(editInvoice.documentNumber);
      setType(editInvoice.type);
      setStatus(editInvoice.status);
      setIssueDate(editInvoice.issueDate);
      setDueDate(editInvoice.dueDate);
      setDueDatePreset(editInvoice.dueDatePreset || "custom");
      setCustomerName(editInvoice.customer.name);
      setCustomerEmail(editInvoice.customer.email || "");
      setCustomerPhone(editInvoice.customer.phone || "");
      setCustomerAddress(editInvoice.customer.address || "");
      setItems(editInvoice.items.map((it) => ({ ...it })));
      setDiscountPercentage(editInvoice.discountPercentage || 0);
      setTaxPercentage(editInvoice.taxPercentage || 0);
      setNotes(editInvoice.notes || "");
    } else {
      const existingInvoices = getInvoices();
      setDocumentNumber(generateNextDocumentNumber(existingInvoices, type));
    }
  }, [editInvoice, type]);

  // Update Due Date when Preset or IssueDate changes
  const handlePresetChange = (newPreset: DueDatePreset) => {
    setDueDatePreset(newPreset);
    if (newPreset !== "custom") {
      setDueDate(calculateDueDate(issueDate, newPreset));
    }
  };

  const handleIssueDateChange = (newDate: string) => {
    setIssueDate(newDate);
    if (dueDatePreset !== "custom") {
      setDueDate(calculateDueDate(newDate, dueDatePreset));
    }
  };

  // Handle Contact Dropdown selection
  const handleContactSelect = (contactId: string) => {
    setSelectedContactId(contactId);
    if (!contactId) return;
    const found = contacts.find((c: Contact) => c.id === contactId);
    if (found) {
      setCustomerName(found.name);
      setCustomerEmail(found.email || "");
      setCustomerPhone(found.phone || "");
    }
  };

  // Line item handlers
  const handleItemChange = (index: number, field: "description" | "quantity" | "unitPrice", value: any) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: field === "description" ? value : Math.max(0, Number(value) || 0)
      };
      return updated;
    });
  };

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { id: `item_${Date.now()}_${prev.length + 1}`, description: "", quantity: 1, unitPrice: 0 }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Live Calculations
  const calculated = calculateInvoiceTotals(items, discountPercentage, taxPercentage);
  const currencyCode = business?.currency || "GHS";

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim()) {
      setError("Customer name is required.");
      return;
    }

    const validItems = items.filter((it) => it.description.trim().length > 0);
    if (validItems.length === 0) {
      setError("Please add at least one line item with a description.");
      return;
    }

    try {
      if (editInvoice) {
        const updated = updateInvoice(editInvoice.id, {
          type,
          documentNumber,
          status,
          issueDate,
          dueDate,
          dueDatePreset,
          customer: {
            contactId: selectedContactId || null,
            name: customerName.trim(),
            email: customerEmail.trim() || null,
            phone: customerPhone.trim() || null,
            address: customerAddress.trim() || null
          },
          seller: {
            businessName: business?.name || user?.businessName || "My Business",
            ownerName: business?.ownerName || null,
            email: business?.supportEmail || user?.email || null,
            phone: business?.phone || null
          },
          currency: currencyCode,
          items: validItems,
          discountPercentage,
          taxPercentage,
          notes: notes.trim() || null
        });

        if (updated) {
          onSaved(updated);
          onClose();
        } else {
          setError("Failed to update invoice.");
        }
      } else {
        const created = createInvoice({
          type,
          documentNumber,
          status,
          issueDate,
          dueDate,
          dueDatePreset,
          customer: {
            contactId: selectedContactId || null,
            name: customerName.trim(),
            email: customerEmail.trim() || null,
            phone: customerPhone.trim() || null,
            address: customerAddress.trim() || null
          },
          seller: {
            businessName: business?.name || user?.businessName || "My Business",
            ownerName: business?.ownerName || null,
            email: business?.supportEmail || user?.email || null,
            phone: business?.phone || null
          },
          currency: currencyCode,
          items: validItems,
          discountPercentage,
          taxPercentage,
          notes: notes.trim() || null
        });

        onSaved(created);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-4xl bg-white border-2 border-slate-300 my-8 animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 bg-[#0A1D13] text-white border-b border-[#0A1D13] shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center bg-[#BEF264] text-[#0A1D13] font-black text-sm border border-[#BEF264]">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight text-white">
                {editInvoice ? `Edit ${editInvoice.type === "quote" ? "Quotation" : "Invoice"}` : `Create New ${type === "quote" ? "Quotation" : "Invoice"}`}
              </h2>
              <p className="text-xs text-slate-300">
                {type === "quote" ? "Estimate and pricing quotation for client" : "Professional sales bill and payment invoice"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-emerald-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Type Toggle & Document Number Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[#F8FAF8] border border-slate-200">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Document Type
              </label>
              <div className="grid grid-cols-2 gap-1 border border-slate-300 p-1 bg-white">
                <button
                  type="button"
                  onClick={() => setType("invoice")}
                  className={`py-1.5 text-xs font-black transition-colors ${
                    type === "invoice"
                      ? "bg-[#0A1D13] text-[#BEF264]"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Invoice
                </button>
                <button
                  type="button"
                  onClick={() => setType("quote")}
                  className={`py-1.5 text-xs font-black transition-colors ${
                    type === "quote"
                      ? "bg-[#0A1D13] text-[#BEF264]"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Quotation
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Document Number
              </label>
              <input
                type="text"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                required
                className="w-full text-xs font-bold px-3 py-2 border border-slate-300 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
                className="w-full text-xs font-bold px-3 py-2 border border-slate-300 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13]"
              >
                <option value="draft">Draft (Unsent)</option>
                <option value="sent">Sent (Awaiting Payment)</option>
                <option value="paid">Paid (Completed)</option>
              </select>
            </div>
          </div>

          {/* Dates & Payment Terms */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Issue Date
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => handleIssueDateChange(e.target.value)}
                required
                className="w-full text-xs font-bold px-3 py-2 border border-slate-300 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Payment Terms
              </label>
              <select
                value={dueDatePreset}
                onChange={(e) => handlePresetChange(e.target.value as DueDatePreset)}
                className="w-full text-xs font-bold px-3 py-2 border border-slate-300 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13]"
              >
                <option value="receipt">Due Upon Receipt (Today)</option>
                <option value="7d">Net 7 Days</option>
                <option value="14d">Net 14 Days</option>
                <option value="30d">Net 30 Days</option>
                <option value="custom">Custom Date</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  setDueDatePreset("custom");
                }}
                required
                className="w-full text-xs font-bold px-3 py-2 border border-slate-300 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13]"
              />
            </div>
          </div>

          {/* Customer / Client Details Section */}
          <div className="border border-slate-200 p-4 space-y-3 bg-[#F8FAF8]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#0A1D13]" />
                <h3 className="text-xs font-black uppercase tracking-wider text-[#0A1D13]">
                  Bill To / Client Details
                </h3>
              </div>

              {/* CRM Contact Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 font-bold whitespace-nowrap">
                  Choose Existing Contact:
                </span>
                <select
                  value={selectedContactId}
                  onChange={(e) => handleContactSelect(e.target.value)}
                  className="text-xs font-bold px-2.5 py-1 border border-slate-300 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13]"
                >
                  <option value="">-- Manual / New Client --</option>
                  {contacts.map((c: Contact) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.phone ? `(${c.phone})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Client Name *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Kwame Mensah"
                  required
                  className="w-full text-xs font-bold px-3 py-2 border border-slate-300 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. 0244123456"
                  className="w-full text-xs font-bold px-3 py-2 border border-slate-300 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g. kwame@example.com"
                  className="w-full text-xs font-bold px-3 py-2 border border-slate-300 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Billing Address / Location
                </label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="e.g. Accra, Ghana"
                  className="w-full text-xs font-bold px-3 py-2 border border-slate-300 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13]"
                />
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#0A1D13] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0A1D13]" />
                <span>Line Items &amp; Pricing ({currencyCode})</span>
              </h3>

              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1.5 text-xs font-black text-[#0A1D13] bg-[#BEF264] hover:bg-[#A3E635] px-3 py-1.5 border border-[#BEF264] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="border border-slate-300 overflow-hidden bg-white">
              <div className="grid grid-cols-12 gap-2 p-2.5 bg-[#0A1D13] text-[#BEF264] text-[10px] font-bold uppercase tracking-wider">
                <div className="col-span-6">Item Description</div>
                <div className="col-span-2 text-right">Quantity</div>
                <div className="col-span-2 text-right">Unit Price</div>
                <div className="col-span-2 text-right">Line Total</div>
              </div>

              <div className="divide-y divide-slate-200">
                {items.map((item, index) => {
                  const lineTotal = (item.quantity || 0) * (item.unitPrice || 0);

                  return (
                    <div key={item.id || index} className="grid grid-cols-12 gap-2 p-2.5 items-center hover:bg-[#F8FAF8]">
                      <div className="col-span-6 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          disabled={items.length === 1}
                          title="Remove item"
                          className="p-1 text-slate-300 hover:text-rose-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, "description", e.target.value)}
                          placeholder="e.g. 50kg Rice Bags / Delivery Service"
                          required
                          className="w-full text-xs font-bold px-2 py-1.5 border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13]"
                        />
                      </div>

                      <div className="col-span-2">
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                          className="w-full text-xs font-bold text-right px-2 py-1.5 border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13]"
                        />
                      </div>

                      <div className="col-span-2">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)}
                          className="w-full text-xs font-bold text-right px-2 py-1.5 border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13]"
                        />
                      </div>

                      <div className="col-span-2 text-right pr-2 text-xs font-black text-slate-900">
                        {formatInvoiceCurrency(lineTotal, currencyCode)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Financial Calculation & Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* Notes & Payment Instructions */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Notes &amp; Payment Instructions
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="e.g. MTN MoMo: 0244123456 (Account Name: Kwame Enterprises). Thank you for your patronage!"
                className="w-full text-xs font-medium p-3 border border-slate-300 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A1D13]"
              />
              <p className="text-[11px] text-slate-500">
                This note will be printed on the invoice and sent in the 1-tap WhatsApp message.
              </p>
            </div>

            {/* Subtotal, Discounts, Tax & Grand Total Card */}
            <div className="border border-slate-300 bg-[#F8FAF8] p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-700">
                <span className="font-bold">Subtotal:</span>
                <span className="font-black text-slate-900">
                  {formatInvoiceCurrency(calculated.subtotal, currencyCode)}
                </span>
              </div>

              {/* Discount Input */}
              <div className="flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700">Discount (%):</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
                    className="w-16 text-xs font-bold text-right px-2 py-1 border border-slate-300 bg-white"
                  />
                </div>
                <span className="font-bold text-emerald-700">
                  -{formatInvoiceCurrency(calculated.discountAmount, currencyCode)}
                </span>
              </div>

              {/* Tax / VAT Input */}
              <div className="flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700">Tax / VAT (%):</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={taxPercentage}
                    onChange={(e) => setTaxPercentage(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
                    className="w-16 text-xs font-bold text-right px-2 py-1 border border-slate-300 bg-white"
                  />
                </div>
                <span className="font-bold text-slate-700">
                  +{formatInvoiceCurrency(calculated.taxAmount, currencyCode)}
                </span>
              </div>

              {/* Grand Total Bar */}
              <div className="pt-3 border-t-2 border-slate-300 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Grand Total
                  </div>
                  <div className="text-xl font-black text-[#0A1D13]">
                    {formatInvoiceCurrency(calculated.total, currencyCode)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    Currency: {currencyCode}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </form>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-end gap-3 p-4 bg-[#F8FAF8] border-t border-slate-200 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 text-xs font-black text-[#0A1D13] bg-[#BEF264] hover:bg-[#A3E635] border border-[#BEF264] transition-colors cursor-pointer"
          >
            {editInvoice ? "Save Changes" : `Create ${type === "quote" ? "Quotation" : "Invoice"}`}
          </button>
        </div>

      </div>
    </div>
  );
}
