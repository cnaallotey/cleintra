# Feature: Lightweight Invoice & Quote Generator (`/invoices`)

## Overview & Purpose
Feature 13 provides small business owners with a lightweight, client-side & cloud-synced Invoice and Quotation generator accessible at `/invoices` and embedded within Contact Profile records (`/contacts/[id]`). It allows businesses to draft professional quotes and invoices, calculate line totals, discounts, and taxes, track payment lifecycles (`Draft`, `Sent`, `Paid`, `Overdue`), generate 1-tap WhatsApp payment summaries, and print/export clean PDF documents.

---

### Data model & Collections

#### 1. Entity Types & Interfaces (`src/types/invoices.ts` & `src/types/crm.ts`)

```typescript
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
  dueDatePreset?: DueDatePreset; // Preset shortcut used
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
  documentNumber?: string; // Auto-generated if omitted
  status?: InvoiceStatus; // Defaults to "draft"
  issueDate?: string; // Defaults to today (YYYY-MM-DD)
  dueDate?: string; // Defaults based on preset or today
  dueDatePreset?: DueDatePreset;
  customer: InvoiceCustomer;
  seller?: Partial<InvoiceSeller>; // Populated from BusinessAccount if omitted
  currency?: string; // Populated from BusinessAccount if omitted
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
  totalInvoiced: number; // Sum of totals for non-draft invoices
  paidAmount: number; // Sum of totals for "paid" invoices
  outstandingAmount: number; // Sum of totals for "sent" + "overdue" invoices
  draftAmount: number; // Sum of totals for "draft" invoices
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
  q?: string | null; // Search term (matches documentNumber, customer name, phone, email)
}
```

#### 2. Firestore Document Hierarchy & Subcollections

In alignment with multi-tenant architecture and existing subcollections (`contacts`, `groups`, `stages`, `interactions`):

- **Invoice Documents Path:**
  `businesses/{businessId}/invoices/{invoiceId}`

- **Denormalization Strategy:**
  - `customer` snapshot is stored directly inside the invoice document to preserve historical recipient details at the time of invoicing even if contact records are later modified.
  - `seller` snapshot is embedded to preserve business profile information (business name, phone, email) as it existed when the invoice was issued.
  - `contactId` is indexed/stored inside `customer` to enable sub-millisecond lookups of all invoices belonging to a specific customer on `/contacts/[id]`.

---

### API / Store Contracts & Calculation Helpers

#### 1. Pure Calculation Helpers (`src/lib/invoice-calculations.ts`)

```typescript
export interface CalculationInput {
  items: Array<{ quantity: number; unitPrice: number }>;
  discountPercentage?: number;
  taxPercentage?: number;
}

export interface CalculationResult {
  itemsWithTotals: Array<{
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  taxPercentage: number;
  taxAmount: number;
  total: number;
}

/**
 * Rounds a number strictly to 2 decimal places to eliminate floating point rounding errors.
 */
export function roundToTwo(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

/**
 * Computes live invoice financials (Subtotal, Discount, Tax, and Final Total).
 */
export function calculateInvoiceTotals(
  items: Array<{ id?: string; description: string; quantity: number; unitPrice: number }>,
  discountPercentage = 0,
  taxPercentage = 0
): {
  itemsWithTotals: InvoiceLineItem[];
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  taxPercentage: number;
  taxAmount: number;
  total: number;
} {
  const safeDiscountPct = Math.max(0, Math.min(100, Number(discountPercentage) || 0));
  const safeTaxPct = Math.max(0, Math.min(100, Number(taxPercentage) || 0));

  const itemsWithTotals: InvoiceLineItem[] = items.map((item, index) => {
    const qty = Math.max(0, Number(item.quantity) || 0);
    const unitPrice = Math.max(0, Number(item.unitPrice) || 0);
    const total = roundToTwo(qty * unitPrice);

    return {
      id: item.id || `item_${index + 1}_${Math.random().toString(36).slice(2, 6)}`,
      description: item.description || "",
      quantity: qty,
      unitPrice: unitPrice,
      total: total
    };
  });

  const subtotal = roundToTwo(itemsWithTotals.reduce((sum, item) => sum + item.total, 0));
  const discountAmount = roundToTwo((subtotal * safeDiscountPct) / 100);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = roundToTwo((taxableAmount * safeTaxPct) / 100);
  const total = roundToTwo(taxableAmount + taxAmount);

  return {
    itemsWithTotals,
    subtotal,
    discountPercentage: safeDiscountPct,
    discountAmount,
    taxPercentage: safeTaxPct,
    taxAmount,
    total
  };
}

/**
 * Computes Due Date from issue date based on preset.
 */
export function calculateDueDate(
  issueDateStr: string,
  preset: DueDatePreset = "receipt",
  customDays = 0
): string {
  const issueDate = new Date(issueDateStr || new Date().toISOString().split("T")[0]);
  const targetDate = new Date(issueDate);

  switch (preset) {
    case "receipt":
      return issueDateStr;
    case "7d":
      targetDate.setDate(targetDate.getDate() + 7);
      break;
    case "14d":
      targetDate.setDate(targetDate.getDate() + 14);
      break;
    case "30d":
      targetDate.setDate(targetDate.getDate() + 30);
      break;
    case "custom":
      targetDate.setDate(targetDate.getDate() + (customDays || 0));
      break;
  }

  return targetDate.toISOString().split("T")[0];
}

/**
 * Generates the next sequential invoice or quotation document number.
 * Pattern: `INV-{YEAR}-{SEQ}` or `QUO-{YEAR}-{SEQ}` (e.g. INV-2026-001)
 */
export function generateNextDocumentNumber(
  existingInvoices: Invoice[],
  type: InvoiceType = "invoice",
  year: number = new Date().getFullYear()
): string {
  const prefix = type === "quote" ? `QUO-${year}-` : `INV-${year}-`;
  const matching = existingInvoices.filter((inv) =>
    inv.documentNumber.startsWith(prefix)
  );

  let highestSeq = 0;
  for (const inv of matching) {
    const numPart = inv.documentNumber.replace(prefix, "");
    const seq = parseInt(numPart, 10);
    if (!isNaN(seq) && seq > highestSeq) {
      highestSeq = seq;
    }
  }

  const nextSeq = highestSeq + 1;
  return `${prefix}${String(nextSeq).padStart(3, "0")}`;
}
```

#### 2. WhatsApp Formatter & Share Helper

```typescript
/**
 * Formats a clean, professional WhatsApp text summary and generates a wa.me link.
 */
export function generateWhatsAppInvoiceLink(
  invoice: Invoice,
  currencySymbol = "₵"
): { text: string; url: string } {
  const isQuote = invoice.type === "quote";
  const docTypeLabel = isQuote ? "QUOTATION" : "INVOICE";
  const symbol = invoice.currency || currencySymbol;

  const lines: string[] = [
    `🧾 *${docTypeLabel} from ${invoice.seller.businessName}*`,
    `📄 *Document #:* ${invoice.documentNumber}`,
    `📅 *Issue Date:* ${invoice.issueDate}`,
    `⏳ *Due Date:* ${invoice.dueDate}`,
    `👤 *Bill To:* ${invoice.customer.name}`,
    ``,
    `*Items Breakdown:*`
  ];

  invoice.items.forEach((item, index) => {
    lines.push(
      `${index + 1}. ${item.description} (${item.quantity} x ${symbol}${item.unitPrice.toFixed(2)}) = *${symbol}${item.total.toFixed(2)}*`
    );
  });

  lines.push(``);
  lines.push(`Subtotal: ${symbol}${invoice.subtotal.toFixed(2)}`);

  if (invoice.discountPercentage > 0) {
    lines.push(`Discount (${invoice.discountPercentage}%): -${symbol}${invoice.discountAmount.toFixed(2)}`);
  }

  if (invoice.taxPercentage > 0) {
    lines.push(`Tax/VAT (${invoice.taxPercentage}%): +${symbol}${invoice.taxAmount.toFixed(2)}`);
  }

  lines.push(`💰 *TOTAL DUE:* *${symbol}${invoice.total.toFixed(2)}*`);

  if (invoice.notes) {
    lines.push(``);
    lines.push(`*Payment Details & Instructions:*`);
    lines.push(invoice.notes);
  }

  lines.push(``);
  lines.push(`Thank you for your business! 🙏`);

  const rawText = lines.join("\n");
  const cleanPhone = (invoice.customer.phone || "").replace(/[^0-9+]/g, "").replace(/^\+/, "");
  const encodedText = encodeURIComponent(rawText);
  const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodedText}` : `https://wa.me/?text=${encodedText}`;

  return { text: rawText, url };
}
```

#### 3. Invoices Store Operations (`src/lib/invoices-store.ts`)

- **`getInvoices(businessId?: string): Invoice[]`**
  - Reads from local storage tenant key `crm_${bizId}_invoices_v1`.
  - Automatically handles status display for overdue documents.
  - Returns invoices sorted by `issueDate` / `createdAt` descending.

- **`getInvoiceById(invoiceId: string): Invoice | null`**
  - Finds matching invoice by ID.

- **`getInvoicesForContact(contactId: string): Invoice[]`**
  - Filters invoices where `customer.contactId === contactId`.

- **`getInvoicesDashboardMetrics(invoices?: Invoice[]): InvoicesDashboardMetrics`**
  - Computes `totalInvoiced`, `paidAmount`, `outstandingAmount`, `draftAmount`, and counts.

- **`createInvoice(input: CreateInvoiceInput): Invoice`**
  - Auto-fills seller details from active `BusinessAccount`.
  - Auto-assigns sequential `documentNumber` if not provided.
  - Computes all totals using `calculateInvoiceTotals`.
  - Saves to localStorage and syncs with Firestore via `syncInvoice()`.

- **`updateInvoice(invoiceId: string, input: UpdateInvoiceInput): Invoice | null`**
  - Recalculates totals and updates fields.
  - Syncs to Firestore.

- **`updateInvoiceStatus(invoiceId: string, status: InvoiceStatus): Invoice | null`**
  - Updates status (`draft` | `sent` | `paid` | `overdue`).
  - If `status === "paid"`, records `paidAt = new Date().toISOString()`. If unmarking, clears `paidAt`.
  - Syncs to Firestore.

- **`deleteInvoice(invoiceId: string): boolean`**
  - Deletes invoice from local cache and triggers `syncDeleteInvoice()`.

#### 4. Cloud Firestore Sync Methods (`src/lib/firestore-sync.ts`)

```typescript
export async function syncInvoice(businessId: string, invoice: Invoice): Promise<void> {
  if (!db) return;
  const docRef = doc(db, "businesses", businessId, "invoices", invoice.id);
  try {
    await setDoc(docRef, invoice, { merge: true });
  } catch (e) {
    console.warn("Firestore syncInvoice warning:", e);
  }
}

export async function syncDeleteInvoice(businessId: string, invoiceId: string): Promise<void> {
  if (!db) return;
  const docRef = doc(db, "businesses", businessId, "invoices", invoiceId);
  try {
    await deleteDoc(docRef);
  } catch (e) {
    console.warn("Firestore syncDeleteInvoice warning:", e);
  }
}

export function subscribeToInvoices(
  businessId: string,
  onUpdate: (invoices: Invoice[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const colRef = collection(db, "businesses", businessId, "invoices");
  if (!colRef) return () => {};

  return onSnapshot(
    colRef,
    (snapshot) => {
      const invoices: Invoice[] = snapshot.docs.map((d) => d.data() as Invoice);
      onUpdate(invoices);
    },
    (err) => {
      console.warn("Firestore invoices subscription error:", err);
      if (onError) onError(err);
    }
  );
}
```

---

### Validation rules

1. **Document Numbering:**
   - Must be non-empty and unique per business account.
   - Default format: `INV-YYYY-XXX` or `QUO-YYYY-XXX`.
2. **Customer / Recipient Details:**
   - `customer.name` is required (minimum 2 characters).
   - If `customer.phone` or `customer.email` are provided, they must conform to standard contact formatting.
3. **Line Items:**
   - An invoice must have at least one line item (`items.length >= 1`).
   - Every line item must have a non-empty `description`.
   - `quantity` must be a positive number (`> 0`).
   - `unitPrice` must be a non-negative number (`>= 0`).
4. **Discounts & Taxes:**
   - `discountPercentage` must be between `0` and `100`.
   - `taxPercentage` must be between `0` and `100`.
5. **Dates:**
   - `issueDate` must be a valid ISO date string (`YYYY-MM-DD`).
   - `dueDate` must be a valid ISO date string (`YYYY-MM-DD`).
   - `dueDate` should be on or after `issueDate`.
6. **WhatsApp Sharing Phone Number:**
   - Phone numbers are stripped of non-digit characters (`+`, spaces, dashes, parentheses).
   - If phone is missing, the WhatsApp link generates without a phone number prefix, allowing the user to choose a contact in WhatsApp.

---

### Firestore security rules

Invoices are isolated under the `businesses/{businessId}` subcollection tree. The Firestore rules are extended as follows:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Business Account Document & Subcollections
    match /businesses/{businessId} {
      allow read, write: if request.auth != null && request.auth.uid == businessId;
      
      // Contacts Subcollection
      match /contacts/{contactId} {
        allow read, write: if request.auth != null && request.auth.uid == businessId;
      }
      
      // Contact Groups Subcollection
      match /groups/{groupId} {
        allow read, write: if request.auth != null && request.auth.uid == businessId;
      }
      
      // Pipeline Stages Subcollection
      match /stages/{stageId} {
        allow read, write: if request.auth != null && request.auth.uid == businessId;
      }
      
      // Interactions Subcollection
      match /interactions/{interactionId} {
        allow read, write: if request.auth != null && request.auth.uid == businessId;
      }

      // Invoices & Quotes Subcollection (Feature 13)
      match /invoices/{invoiceId} {
        allow read, write: if request.auth != null && request.auth.uid == businessId;
      }
    }
  }
}
```

---

### Conflicts / dependencies with prior features

1. **Dependency on Feature 09 (Business Profile & Settings):**
   - Reuses `BusinessAccount` profile fields (`name`, `phone`, `email`, `currency`, `ownerName`) to populate seller headers on invoices.
2. **Dependency on Feature 02 (Contact Record View):**
   - Contact Profile `/contacts/[id]` is extended to display an "Invoices & Quotes" tab and quick "+ New Invoice" button pre-populating recipient fields.
3. **Dependency on Feature 11 (Firestore Cloud Sync):**
   - Incorporates `syncInvoice()`, `syncDeleteInvoice()`, and `subscribeToInvoices()` in `src/lib/firestore-sync.ts`.
4. **Navigation Shell Integration:**
   - `/invoices` is registered as a first-class route in the main sidebar and mobile navigation.
5. **No Schema Breaking Changes:**
   - Existing collections (`contacts`, `groups`, `stages`, `interactions`) remain unmodified.

---

### Open questions for Product Owner

1. **Auto-Overdue Status Transition:**
   - When viewing an invoice list, should invoices with `status === "sent"` and `dueDate < today` automatically display with an "Overdue" visual indicator, or should the underlying stored document status be permanently updated to `"overdue"`? *(Recommendation: Treat "overdue" as a dynamic presentation status computed from `dueDate < today && status === "sent"`, while allowing manual status overrides).*
2. **Sequential Numbering Across Device Restarts:**
   - In offline scenarios, sequential numbering scans local invoices. Should the user be allowed to manually customize the invoice document number before saving? *(Recommendation: Yes, provide a default auto-generated number with an editable text input).*
3. **Print / PDF Layout Standard:**
   - The spec uses client-side `@media print` CSS styling to strip navigation and render a clean, high-contrast A4 invoice. Does PO want additional browser-side PDF download (`html2canvas` / `jsPDF`), or is native browser Print / Save-as-PDF sufficient? *(Recommendation: Browser Print dialog via `window.print()` delivers crisp vector typography and zero bundle overhead).*
