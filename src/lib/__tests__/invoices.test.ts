import { describe, it, expect, beforeEach } from "vitest";
import {
  roundToTwo,
  calculateInvoiceTotals,
  calculateDueDate,
  generateNextDocumentNumber,
  formatInvoiceCurrency,
  generateWhatsAppInvoiceLink
} from "../invoice-calculations";
import {
  getInvoices,
  getInvoiceById,
  getInvoicesForContact,
  getInvoicesDashboardMetrics,
  createInvoice,
  updateInvoice,
  updateInvoiceStatus,
  deleteInvoice
} from "../invoices-store";
import { Invoice } from "@/types/invoices";

describe("Invoice Calculations Engine", () => {
  it("rounds numbers accurately to two decimal places", () => {
    expect(roundToTwo(10.555)).toBe(10.56);
    expect(roundToTwo(10.554)).toBe(10.55);
    expect(roundToTwo(0)).toBe(0);
  });

  it("calculates invoice subtotal, discount, tax, and final grand total correctly", () => {
    const items = [
      { id: "1", description: "Item 1", quantity: 2, unitPrice: 100 }, // 200
      { id: "2", description: "Item 2", quantity: 3, unitPrice: 50 }   // 150
    ];
    // Subtotal: 350
    // Discount 10%: 35 -> Taxable: 315
    // Tax 5%: 15.75
    // Total: 330.75
    const result = calculateInvoiceTotals(items, 10, 5);

    expect(result.subtotal).toBe(350);
    expect(result.discountPercentage).toBe(10);
    expect(result.discountAmount).toBe(35);
    expect(result.taxPercentage).toBe(5);
    expect(result.taxAmount).toBe(15.75);
    expect(result.total).toBe(330.75);
    expect(result.itemsWithTotals[0].total).toBe(200);
    expect(result.itemsWithTotals[1].total).toBe(150);
  });

  it("handles zero discount and zero tax gracefully", () => {
    const items = [{ id: "1", description: "Service", quantity: 1, unitPrice: 500 }];
    const result = calculateInvoiceTotals(items, 0, 0);

    expect(result.subtotal).toBe(500);
    expect(result.discountAmount).toBe(0);
    expect(result.taxAmount).toBe(0);
    expect(result.total).toBe(500);
  });

  it("calculates due dates accurately based on presets", () => {
    const issueDate = "2026-03-01";
    expect(calculateDueDate(issueDate, "receipt")).toBe("2026-03-01");
    expect(calculateDueDate(issueDate, "7d")).toBe("2026-03-08");
    expect(calculateDueDate(issueDate, "14d")).toBe("2026-03-15");
    expect(calculateDueDate(issueDate, "30d")).toBe("2026-03-31");
    expect(calculateDueDate(issueDate, "custom", 10)).toBe("2026-03-11");
  });

  it("generates sequential document numbers for invoices and quotations", () => {
    const dummyInvoices: Invoice[] = [
      {
        id: "1",
        businessId: "biz_1",
        type: "invoice",
        documentNumber: "INV-2026-001",
        status: "paid",
        issueDate: "2026-03-01",
        dueDate: "2026-03-08",
        customer: { name: "Test" },
        seller: { businessName: "Biz" },
        currency: "GHS",
        items: [],
        subtotal: 0,
        discountPercentage: 0,
        discountAmount: 0,
        taxPercentage: 0,
        taxAmount: 0,
        total: 0,
        createdAt: "",
        updatedAt: ""
      },
      {
        id: "2",
        businessId: "biz_1",
        type: "invoice",
        documentNumber: "INV-2026-005",
        status: "sent",
        issueDate: "2026-03-01",
        dueDate: "2026-03-08",
        customer: { name: "Test" },
        seller: { businessName: "Biz" },
        currency: "GHS",
        items: [],
        subtotal: 0,
        discountPercentage: 0,
        discountAmount: 0,
        taxPercentage: 0,
        taxAmount: 0,
        total: 0,
        createdAt: "",
        updatedAt: ""
      }
    ];

    expect(generateNextDocumentNumber(dummyInvoices, "invoice", 2026)).toBe("INV-2026-006");
    expect(generateNextDocumentNumber(dummyInvoices, "quote", 2026)).toBe("QUO-2026-001");
  });

  it("generates clean WhatsApp share link with Ghana country code conversion", () => {
    const mockInvoice: Invoice = {
      id: "inv_test",
      businessId: "biz_1",
      type: "invoice",
      documentNumber: "INV-2026-001",
      status: "sent",
      issueDate: "2026-03-01",
      dueDate: "2026-03-08",
      customer: {
        name: "Kofi Mensah",
        phone: "0244123456"
      },
      seller: {
        businessName: "Acme Store"
      },
      currency: "GHS",
      items: [
        { id: "1", description: "Bags of Cement", quantity: 10, unitPrice: 90, total: 900 }
      ],
      subtotal: 900,
      discountPercentage: 0,
      discountAmount: 0,
      taxPercentage: 0,
      taxAmount: 0,
      total: 900,
      notes: "MoMo: 0244000000",
      createdAt: "",
      updatedAt: ""
    };

    const { text, url } = generateWhatsAppInvoiceLink(mockInvoice);
    expect(text).toContain("INVOICE from Acme Store");
    expect(text).toContain("INV-2026-001");
    expect(text).toContain("Kofi Mensah");
    expect(text).toContain("TOTAL DUE:");
    expect(url).toContain("https://wa.me/233244123456?text=");
  });
});

describe("Invoices Store Operations", () => {
  beforeEach(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
  });

  it("creates, updates, and fetches an invoice with valid totals", () => {
    const created = createInvoice({
      type: "invoice",
      customer: {
        contactId: "contact_123",
        name: "Ama Serwaa",
        phone: "0201112222"
      },
      items: [
        { description: "Product A", quantity: 2, unitPrice: 250 }
      ],
      discountPercentage: 10,
      notes: "Cash on delivery"
    });

    expect(created.id).toBeDefined();
    expect(created.documentNumber).toMatch(/^INV-\d{4}-\d{3}$/);
    expect(created.subtotal).toBe(500);
    expect(created.discountAmount).toBe(50);
    expect(created.total).toBe(450);

    const fetched = getInvoiceById(created.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.customer.name).toBe("Ama Serwaa");

    const contactInvoices = getInvoicesForContact("contact_123");
    expect(contactInvoices.length).toBe(1);
    expect(contactInvoices[0].id).toBe(created.id);
  });

  it("updates invoice status to paid and records paidAt timestamp", () => {
    const created = createInvoice({
      type: "invoice",
      customer: { name: "John Doe" },
      items: [{ description: "Consulting", quantity: 1, unitPrice: 1000 }]
    });

    expect(created.status).toBe("draft");
    expect(created.paidAt).toBeNull();

    const updated = updateInvoiceStatus(created.id, "paid");
    expect(updated?.status).toBe("paid");
    expect(updated?.paidAt).toBeDefined();
  });

  it("calculates dashboard financial metrics correctly", () => {
    const invoices = getInvoices();
    const metrics = getInvoicesDashboardMetrics(invoices);

    expect(metrics.totalCount).toBeGreaterThanOrEqual(0);
    expect(metrics.totalInvoiced).toBeGreaterThanOrEqual(0);
    expect(metrics.paidAmount).toBeGreaterThanOrEqual(0);
  });

  it("deletes invoice properly", () => {
    const created = createInvoice({
      type: "invoice",
      customer: { name: "To Delete" },
      items: [{ description: "Item", quantity: 1, unitPrice: 100 }]
    });

    const deleted = deleteInvoice(created.id);
    expect(deleted).toBe(true);

    const found = getInvoiceById(created.id);
    expect(found).toBeNull();
  });
});
