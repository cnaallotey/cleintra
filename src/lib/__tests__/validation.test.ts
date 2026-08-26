import { describe, it, expect } from "vitest";
import { normalizePhone, normalizeEmail, validateContactRow } from "../validation";
import { parseAndValidateCsv } from "../csv-parser";

describe("Validation Logic", () => {
  describe("normalizePhone", () => {
    it("should accept and normalize Ghana local numbers (024XXXXXXX, 055XXXXXXX)", () => {
      const res1 = normalizePhone("0241234567");
      expect(res1.isValid).toBe(true);
      expect(res1.normalized).toBe("0241234567");

      const res2 = normalizePhone("055 987 6543");
      expect(res2.isValid).toBe(true);
      expect(res2.normalized).toBe("0559876543");
    });

    it("should accept Ghana international format (+23324XXXXXXX and 23324XXXXXXX)", () => {
      const res1 = normalizePhone("+233241234567");
      expect(res1.isValid).toBe(true);
      expect(res1.normalized).toBe("+233241234567");

      const res2 = normalizePhone("233241234567");
      expect(res2.isValid).toBe(true);
      expect(res2.normalized).toBe("+233241234567");
    });

    it("should accept international E.164 numbers", () => {
      const res = normalizePhone("+14155552671");
      expect(res.isValid).toBe(true);
      expect(res.normalized).toBe("+14155552671");
    });

    it("should reject invalid phone strings", () => {
      const res = normalizePhone("12345");
      expect(res.isValid).toBe(false);
    });

    it("should handle empty or null values gracefully", () => {
      expect(normalizePhone("").isValid).toBe(true);
      expect(normalizePhone(null).isValid).toBe(true);
    });
  });

  describe("normalizeEmail", () => {
    it("should accept and normalize valid emails to lowercase", () => {
      const res = normalizeEmail(" Kwame@Example.COM ");
      expect(res.isValid).toBe(true);
      expect(res.normalized).toBe("kwame@example.com");
    });

    it("should reject invalid email formats", () => {
      const res = normalizeEmail("not-an-email");
      expect(res.isValid).toBe(false);
    });
  });

  describe("validateContactRow", () => {
    it("should pass when name and phone are provided", () => {
      const res = validateContactRow({
        name: "Kwame Mensah",
        phone: "0241234567"
      });
      expect(res.isValid).toBe(true);
      expect(res.contact?.name).toBe("Kwame Mensah");
      expect(res.contact?.phone).toBe("0241234567");
    });

    it("should pass when name and email are provided (no phone)", () => {
      const res = validateContactRow({
        name: "Ama Osei",
        email: "ama@gmail.com"
      });
      expect(res.isValid).toBe(true);
      expect(res.contact?.name).toBe("Ama Osei");
      expect(res.contact?.email).toBe("ama@gmail.com");
    });

    it("should fail when name is missing", () => {
      const res = validateContactRow({
        name: "",
        phone: "0241234567"
      });
      expect(res.isValid).toBe(false);
      expect(res.errors).toContain("Missing contact name");
    });

    it("should fail when both phone and email are missing", () => {
      const res = validateContactRow({
        name: "Kofi Boateng",
        phone: "",
        email: ""
      });
      expect(res.isValid).toBe(false);
      expect(res.errors).toContain("Missing phone number and email (at least one contact method is required)");
    });
  });

  describe("parseAndValidateCsv", () => {
    it("should return error for empty CSV string", () => {
      const res = parseAndValidateCsv("");
      expect(res.error).toBe("No contacts found in the uploaded file.");
    });

    it("should parse and validate CSV with header variations", () => {
      const csv = `Full Name,Mobile,Email Address,Lead Source,Comments
Kwame Mensah,0241234567,kwame@example.com,Facebook Ad,Interested in order
Ama Osei,+233501234567,,Referral,Follow up
`;
      const res = parseAndValidateCsv(csv, "contacts.csv");
      expect(res.error).toBeUndefined();
      expect(res.summary?.totalRows).toBe(2);
      expect(res.summary?.validCount).toBe(2);
      expect(res.summary?.errorCount).toBe(0);
      expect(res.summary?.validContacts[0].name).toBe("Kwame Mensah");
      expect(res.summary?.validContacts[1].name).toBe("Ama Osei");
    });

    it("should handle mixed valid and invalid rows with correct 1-indexed row numbers", () => {
      const csv = `Name,Phone,Email,Source,Notes
Valid Contact 1,0241234567,,,First note
,0551112233,,Instagram,Missing name row
Valid Contact 2,,valid@example.com,Website,Second note
No Contact Info Row,,,,Missing phone and email
`;
      const res = parseAndValidateCsv(csv, "mixed.csv");
      expect(res.summary?.totalRows).toBe(4);
      expect(res.summary?.validCount).toBe(2);
      expect(res.summary?.errorCount).toBe(2);

      // Row numbers: Header is Row 1, so data rows are 2, 3, 4, 5
      expect(res.summary?.errors[0].rowNumber).toBe(3);
      expect(res.summary?.errors[0].message).toContain("Missing contact name");

      expect(res.summary?.errors[1].rowNumber).toBe(5);
      expect(res.summary?.errors[1].message).toContain("Missing phone number and email");
    });
  });
});
