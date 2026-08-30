"use client";

import {
  Invoice,
  CreateInvoiceInput,
  UpdateInvoiceInput,
  InvoiceStatus,
  InvoicesDashboardMetrics
} from "@/types/invoices";
import {
  calculateInvoiceTotals,
  calculateDueDate,
  generateNextDocumentNumber
} from "./invoice-calculations";
import { getActiveBusinessId } from "./contacts-store";
import { syncInvoice, syncDeleteInvoice } from "./firestore-sync";

// Default demo invoices for demo account
export const DEFAULT_DEMO_INVOICES: Invoice[] = [
  {
    id: "inv_demo_1",
    businessId: "biz_demo_1",
    type: "invoice",
    documentNumber: "INV-2026-001",
    status: "paid",
    issueDate: new Date(Date.now() - 86400000 * 5).toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 86400000 * 9).toISOString().split("T")[0],
    dueDatePreset: "14d",
    paidAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    customer: {
      contactId: "demo_c1",
      name: "Kwame Mensah",
      email: "kwame.m@example.com",
      phone: "0244123456",
      address: "Accra, Ghana"
    },
    seller: {
      businessName: "Acme Logistics Ltd",
      ownerName: "Demo Business Owner",
      email: "demo@simplecrm.local",
      phone: "0551234567"
    },
    currency: "GHS",
    items: [
      {
        id: "item_1",
        description: "Express Cargo Delivery (50kg pallet)",
        quantity: 2,
        unitPrice: 1500,
        total: 3000
      },
      {
        id: "item_2",
        description: "Warehouse Handling & Offloading",
        quantity: 1,
        unitPrice: 350,
        total: 350
      }
    ],
    subtotal: 3350,
    discountPercentage: 5,
    discountAmount: 167.5,
    taxPercentage: 0,
    taxAmount: 0,
    total: 3182.5,
    notes: "Payment received via MTN Mobile Money. Thank you!",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "inv_demo_2",
    businessId: "biz_demo_1",
    type: "invoice",
    documentNumber: "INV-2026-002",
    status: "sent",
    issueDate: new Date(Date.now() - 86400000 * 2).toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split("T")[0],
    dueDatePreset: "7d",
    customer: {
      contactId: "demo_c2",
      name: "Ama Serwaa",
      email: "ama.serwaa@example.com",
      phone: "0209876543",
      address: "Kumasi, Ghana"
    },
    seller: {
      businessName: "Acme Logistics Ltd",
      ownerName: "Demo Business Owner",
      email: "demo@simplecrm.local",
      phone: "0551234567"
    },
    currency: "GHS",
    items: [
      {
        id: "item_1",
        description: "Consultation & Wholesale Order Processing",
        quantity: 1,
        unitPrice: 2200,
        total: 2200
      }
    ],
    subtotal: 2200,
    discountPercentage: 0,
    discountAmount: 0,
    taxPercentage: 0,
    taxAmount: 0,
    total: 2200,
    notes: "Please transfer to MTN MoMo: 0551234567 (Acme Logistics)",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

let memoryInvoices: Invoice[] = [...DEFAULT_DEMO_INVOICES];

function getTenantStorageKey(): string {
  const bizId = getActiveBusinessId();
  return `crm_${bizId}_invoices_v1`;
}

/**
 * Returns all invoices for the current active business.
 */
export function getInvoices(businessId?: string): Invoice[] {
  const targetBizId = businessId || getActiveBusinessId();
  if (typeof window === "undefined") {
    return memoryInvoices
      .filter((inv) => inv.businessId === targetBizId)
      .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
  }

  const key = `crm_${targetBizId}_invoices_v1`;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      const initial = targetBizId === "biz_demo_1" ? DEFAULT_DEMO_INVOICES : [];
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    const parsed: Invoice[] = JSON.parse(raw);
    return parsed.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
  } catch (e) {
    console.error("Failed to read invoices from localStorage:", e);
    return [];
  }
}

/**
 * Find invoice by ID.
 */
export function getInvoiceById(invoiceId: string): Invoice | null {
  const list = getInvoices();
  return list.find((inv) => inv.id === invoiceId) || null;
}

/**
 * Get all invoices created for a specific CRM contact.
 */
export function getInvoicesForContact(contactId: string): Invoice[] {
  const list = getInvoices();
  return list.filter((inv) => inv.customer.contactId === contactId);
}

/**
 * Computes dashboard financial metrics from list of invoices.
 */
export function getInvoicesDashboardMetrics(invoicesList?: Invoice[]): InvoicesDashboardMetrics {
  const list = invoicesList || getInvoices();
  const todayStr = new Date().toISOString().split("T")[0];

  let totalInvoiced = 0;
  let paidAmount = 0;
  let outstandingAmount = 0;
  let draftAmount = 0;

  let invoiceCount = 0;
  let quoteCount = 0;
  let paidCount = 0;
  let overdueCount = 0;
  let sentCount = 0;
  let draftCount = 0;

  list.forEach((inv) => {
    if (inv.type === "invoice") {
      invoiceCount++;
    } else {
      quoteCount++;
    }

    const isOverdue = inv.status === "sent" && inv.dueDate < todayStr;

    if (inv.status === "draft") {
      draftCount++;
      draftAmount += inv.total;
    } else if (inv.status === "paid") {
      paidCount++;
      paidAmount += inv.total;
      totalInvoiced += inv.total;
    } else if (inv.status === "sent" || inv.status === "overdue") {
      if (isOverdue || inv.status === "overdue") {
        overdueCount++;
      } else {
        sentCount++;
      }
      outstandingAmount += inv.total;
      totalInvoiced += inv.total;
    }
  });

  return {
    totalInvoiced,
    paidAmount,
    outstandingAmount,
    draftAmount,
    totalCount: list.length,
    invoiceCount,
    quoteCount,
    paidCount,
    overdueCount,
    sentCount,
    draftCount
  };
}

/**
 * Creates a new invoice or quotation.
 */
export function createInvoice(input: CreateInvoiceInput): Invoice {
  const bizId = getActiveBusinessId();
  const currentInvoices = getInvoices(bizId);

  const docNumber =
    input.documentNumber?.trim() ||
    generateNextDocumentNumber(currentInvoices, input.type);

  const issueDate = input.issueDate || new Date().toISOString().split("T")[0];
  const dueDate =
    input.dueDate ||
    calculateDueDate(issueDate, input.dueDatePreset || "receipt");

  const calculated = calculateInvoiceTotals(
    input.items,
    input.discountPercentage || 0,
    input.taxPercentage || 0
  );

  const now = new Date().toISOString();
  const newInvoice: Invoice = {
    id: `inv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    businessId: bizId,
    type: input.type,
    documentNumber: docNumber,
    status: input.status || "draft",
    issueDate,
    dueDate,
    dueDatePreset: input.dueDatePreset || "receipt",
    paidAt: input.status === "paid" ? now : null,
    customer: {
      contactId: input.customer.contactId || null,
      name: input.customer.name.trim(),
      email: input.customer.email?.trim() || null,
      phone: input.customer.phone?.trim() || null,
      address: input.customer.address?.trim() || null
    },
    seller: {
      businessName: input.seller?.businessName || "My Business",
      ownerName: input.seller?.ownerName || null,
      email: input.seller?.email || null,
      phone: input.seller?.phone || null,
      address: input.seller?.address || null
    },
    currency: input.currency || "GHS",
    items: calculated.itemsWithTotals,
    subtotal: calculated.subtotal,
    discountPercentage: calculated.discountPercentage,
    discountAmount: calculated.discountAmount,
    taxPercentage: calculated.taxPercentage,
    taxAmount: calculated.taxAmount,
    total: calculated.total,
    notes: input.notes?.trim() || null,
    createdAt: now,
    updatedAt: now
  };

  const updatedList = [newInvoice, ...currentInvoices];

  if (typeof window !== "undefined") {
    localStorage.setItem(getTenantStorageKey(), JSON.stringify(updatedList));
  }
  memoryInvoices = updatedList;

  // Cloud Firestore Sync
  syncInvoice(bizId, newInvoice);

  return newInvoice;
}

/**
 * Updates an existing invoice.
 */
export function updateInvoice(
  invoiceId: string,
  input: UpdateInvoiceInput
): Invoice | null {
  const bizId = getActiveBusinessId();
  const currentInvoices = getInvoices(bizId);
  const existingIndex = currentInvoices.findIndex((inv) => inv.id === invoiceId);

  if (existingIndex === -1) return null;
  const existing = currentInvoices[existingIndex];

  const type = input.type || existing.type;
  const documentNumber = input.documentNumber?.trim() || existing.documentNumber;
  const status = input.status || existing.status;
  const issueDate = input.issueDate || existing.issueDate;
  const dueDate = input.dueDate || existing.dueDate;
  const dueDatePreset = input.dueDatePreset || existing.dueDatePreset;

  const itemsToCalc = input.items || existing.items;
  const discountPct = input.discountPercentage !== undefined ? input.discountPercentage : existing.discountPercentage;
  const taxPct = input.taxPercentage !== undefined ? input.taxPercentage : existing.taxPercentage;

  const calculated = calculateInvoiceTotals(itemsToCalc, discountPct, taxPct);
  const now = new Date().toISOString();

  let paidAt = existing.paidAt;
  if (status === "paid" && !paidAt) {
    paidAt = now;
  } else if (status !== "paid") {
    paidAt = null;
  }

  const updatedInvoice: Invoice = {
    ...existing,
    type,
    documentNumber,
    status,
    issueDate,
    dueDate,
    dueDatePreset,
    paidAt,
    customer: {
      contactId: input.customer ? input.customer.contactId : existing.customer.contactId,
      name: input.customer ? input.customer.name.trim() : existing.customer.name,
      email: input.customer ? (input.customer.email?.trim() || null) : existing.customer.email,
      phone: input.customer ? (input.customer.phone?.trim() || null) : existing.customer.phone,
      address: input.customer ? (input.customer.address?.trim() || null) : existing.customer.address
    },
    seller: {
      ...existing.seller,
      ...(input.seller || {})
    },
    currency: input.currency || existing.currency,
    items: calculated.itemsWithTotals,
    subtotal: calculated.subtotal,
    discountPercentage: calculated.discountPercentage,
    discountAmount: calculated.discountAmount,
    taxPercentage: calculated.taxPercentage,
    taxAmount: calculated.taxAmount,
    total: calculated.total,
    notes: input.notes !== undefined ? (input.notes?.trim() || null) : existing.notes,
    updatedAt: now
  };

  currentInvoices[existingIndex] = updatedInvoice;

  if (typeof window !== "undefined") {
    localStorage.setItem(getTenantStorageKey(), JSON.stringify(currentInvoices));
  }
  memoryInvoices = currentInvoices;

  // Cloud Firestore Sync
  syncInvoice(bizId, updatedInvoice);

  return updatedInvoice;
}

/**
 * Fast 1-click status update (e.g. Draft -> Sent -> Paid).
 */
export function updateInvoiceStatus(
  invoiceId: string,
  status: InvoiceStatus
): Invoice | null {
  return updateInvoice(invoiceId, { status });
}

/**
 * Deletes an invoice.
 */
export function deleteInvoice(invoiceId: string): boolean {
  const bizId = getActiveBusinessId();
  const currentInvoices = getInvoices(bizId);
  const filtered = currentInvoices.filter((inv) => inv.id !== invoiceId);

  if (filtered.length === currentInvoices.length) return false;

  if (typeof window !== "undefined") {
    localStorage.setItem(getTenantStorageKey(), JSON.stringify(filtered));
  }
  memoryInvoices = filtered;

  // Cloud Firestore Sync
  syncDeleteInvoice(bizId, invoiceId);

  return true;
}

/**
 * Overrides local cache with snapshot from Firestore.
 */
export function setInitialInvoices(invoices: Invoice[]): void {
  const bizId = getActiveBusinessId();
  if (typeof window !== "undefined") {
    localStorage.setItem(getTenantStorageKey(), JSON.stringify(invoices));
  }
  memoryInvoices = invoices;
}
