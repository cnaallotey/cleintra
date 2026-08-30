export type InvoiceType = "invoice" | "quote";

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export type DueDatePreset = "receipt" | "7d" | "14d" | "30d" | "custom";

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number; // Computed: quantity * unitPrice
}

export interface InvoiceCustomer {
  contactId?: string | null; // Nullable if created for an ad-hoc recipient
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}

export interface InvoiceSeller {
  businessName: string;
  ownerName?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}

export interface Invoice {
  id: string; // e.g. "inv_1724912000000_abc12"
  businessId: string; // Multi-tenant owner UID
  type: InvoiceType; // "invoice" | "quote"
  documentNumber: string; // e.g. "INV-2026-001" or "QUO-2026-001"
  status: InvoiceStatus; // "draft" | "sent" | "paid" | "overdue"
  issueDate: string; // ISO date string (YYYY-MM-DD)
  dueDate: string; // ISO date string (YYYY-MM-DD)
  dueDatePreset?: DueDatePreset;
  paidAt?: string | null; // ISO 8601 timestamp when marked as paid

  // Customer & Seller Snapshots
  customer: InvoiceCustomer;
  seller: InvoiceSeller;

  // Financial Line Items & Calculations
  currency: string; // e.g. "GHS", "$", "₵", "USD", "EUR"
  items: InvoiceLineItem[];
  subtotal: number; // Sum of items[i].total
  discountPercentage: number; // 0 to 100 (%)
  discountAmount: number; // (subtotal * discountPercentage) / 100
  taxPercentage: number; // 0 to 100 (%)
  taxAmount: number; // ((subtotal - discountAmount) * taxPercentage) / 100
  total: number; // subtotal - discountAmount + taxAmount

  // Notes & Instructions
  notes?: string | null; // Payment instructions (MoMo #, bank info, terms)

  // Audit Timestamps
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface CreateInvoiceInput {
  type: InvoiceType;
  documentNumber?: string;
  status?: InvoiceStatus;
  issueDate?: string;
  dueDate?: string;
  dueDatePreset?: DueDatePreset;
  customer: InvoiceCustomer;
  seller?: Partial<InvoiceSeller>;
  currency?: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
  discountPercentage?: number;
  taxPercentage?: number;
  notes?: string | null;
}

export interface UpdateInvoiceInput {
  type?: InvoiceType;
  documentNumber?: string;
  status?: InvoiceStatus;
  issueDate?: string;
  dueDate?: string;
  dueDatePreset?: DueDatePreset;
  paidAt?: string | null;
  customer?: InvoiceCustomer;
  seller?: Partial<InvoiceSeller>;
  currency?: string;
  items?: Array<{
    id?: string;
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
  discountPercentage?: number;
  taxPercentage?: number;
  notes?: string | null;
}

export interface InvoicesDashboardMetrics {
  totalInvoiced: number;
  paidAmount: number;
  outstandingAmount: number;
  draftAmount: number;
  totalCount: number;
  invoiceCount: number;
  quoteCount: number;
  paidCount: number;
  overdueCount: number;
  sentCount: number;
  draftCount: number;
}

export interface InvoicesFilterParams {
  status?: InvoiceStatus | "all";
  type?: InvoiceType | "all";
  contactId?: string | null;
  q?: string | null;
}
