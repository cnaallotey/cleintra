import { Invoice, InvoiceLineItem, InvoiceType, DueDatePreset } from "@/types/invoices";

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
      return issueDateStr || new Date().toISOString().split("T")[0];
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

/**
 * Formats currency display based on business code/symbol.
 */
export function formatInvoiceCurrency(amount: number, currency = "GHS"): string {
  const symbolMap: Record<string, string> = {
    GHS: "GH₵",
    USD: "$",
    EUR: "€",
    GBP: "£",
    NGN: "₦",
    KES: "KSh"
  };

  const symbol = symbolMap[currency] || currency;
  return `${symbol}${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Formats a clean, professional WhatsApp text summary and generates a wa.me link.
 */
export function generateWhatsAppInvoiceLink(
  invoice: Invoice
): { text: string; url: string } {
  const isQuote = invoice.type === "quote";
  const docTypeLabel = isQuote ? "QUOTATION" : "INVOICE";
  const formattedTotal = formatInvoiceCurrency(invoice.total, invoice.currency);
  const formattedSubtotal = formatInvoiceCurrency(invoice.subtotal, invoice.currency);

  const lines: string[] = [
    `🧾 *${docTypeLabel} from ${invoice.seller.businessName || "Our Shop"}*`,
    `📄 *Doc #:* ${invoice.documentNumber}`,
    `📅 *Date:* ${invoice.issueDate}`,
    `⏳ *Due:* ${invoice.dueDate}`,
    `👤 *Bill To:* ${invoice.customer.name}`,
    ``,
    `*Items Breakdown:*`
  ];

  invoice.items.forEach((item, index) => {
    const itemPrice = formatInvoiceCurrency(item.unitPrice, invoice.currency);
    const itemTotal = formatInvoiceCurrency(item.total, invoice.currency);
    lines.push(
      `${index + 1}. ${item.description} (${item.quantity} x ${itemPrice}) = *${itemTotal}*`
    );
  });

  lines.push(``);
  lines.push(`Subtotal: ${formattedSubtotal}`);

  if (invoice.discountPercentage > 0) {
    const discAmt = formatInvoiceCurrency(invoice.discountAmount, invoice.currency);
    lines.push(`Discount (${invoice.discountPercentage}%): -${discAmt}`);
  }

  if (invoice.taxPercentage > 0) {
    const taxAmt = formatInvoiceCurrency(invoice.taxAmount, invoice.currency);
    lines.push(`Tax/VAT (${invoice.taxPercentage}%): +${taxAmt}`);
  }

  lines.push(`💰 *TOTAL DUE:* *${formattedTotal}*`);

  if (invoice.notes) {
    lines.push(``);
    lines.push(`*Payment Details & Instructions:*`);
    lines.push(invoice.notes);
  }

  lines.push(``);
  lines.push(`Thank you for your business! 🙏`);

  const rawText = lines.join("\n");
  
  // Format international phone number for Ghana/global standard
  let cleanPhone = (invoice.customer.phone || "").replace(/[^0-9+]/g, "");
  if (cleanPhone.startsWith("+")) {
    cleanPhone = cleanPhone.slice(1);
  } else if (cleanPhone.startsWith("0") && cleanPhone.length === 10) {
    // Convert Ghana 0244123456 -> 233244123456
    cleanPhone = `233${cleanPhone.slice(1)}`;
  }

  const encodedText = encodeURIComponent(rawText);
  const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodedText}` : `https://wa.me/?text=${encodedText}`;

  return { text: rawText, url };
}
