import Papa from "papaparse";
import { validateContactRow } from "./validation";
import { ValidContactInput, RowValidationError, ValidationSummary } from "@/types/crm";

/**
 * Normalizes header strings into standard fields: name, phone, email, source, notes.
 */
function normalizeHeader(header: string): string {
  const clean = header.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  
  if (["name", "fullname", "contactname", "customername", "clientname"].includes(clean)) {
    return "name";
  }
  if (["phone", "phonenumber", "mobile", "tel", "cell", "telephone", "whatsapp"].includes(clean)) {
    return "phone";
  }
  if (["email", "emailaddress", "mail"].includes(clean)) {
    return "email";
  }
  if (["source", "leadsource", "channel", "medium"].includes(clean)) {
    return "source";
  }
  if (["notes", "note", "comment", "comments", "description", "details"].includes(clean)) {
    return "notes";
  }
  return clean;
}

export interface ParseCsvResult {
  summary?: ValidationSummary;
  error?: string;
}

/**
 * Parses raw CSV string and validates each contact row.
 */
export function parseAndValidateCsv(csvContent: string, fileName?: string): ParseCsvResult {
  const trimmed = csvContent.trim();
  if (!trimmed) {
    return {
      error: "No contacts found in the uploaded file."
    };
  }

  const parsed = Papa.parse<Record<string, string>>(trimmed, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (header) => normalizeHeader(header)
  });

  if (parsed.errors && parsed.errors.length > 0 && parsed.data.length === 0) {
    return {
      error: "Could not read CSV file. Please make sure it is a valid comma-separated text file."
    };
  }

  const dataRows = parsed.data;
  if (!dataRows || dataRows.length === 0) {
    return {
      error: "No contacts found in the uploaded file."
    };
  }

  const validContacts: ValidContactInput[] = [];
  const errors: RowValidationError[] = [];

  dataRows.forEach((row, index) => {
    // 1-indexed row number in spreadsheet (Row 1 is header, so first data row is Row 2)
    const rowNumber = index + 2;

    // Check if entire row is empty/whitespace
    const hasAnyContent = Object.values(row).some(val => val && String(val).trim() !== "");
    if (!hasAnyContent) {
      return;
    }

    const validation = validateContactRow({
      name: row.name,
      phone: row.phone,
      email: row.email,
      source: row.source,
      notes: row.notes
    });

    if (validation.isValid && validation.contact) {
      validContacts.push({
        tempId: `tmp_${Date.now()}_${index}`,
        name: validation.contact.name,
        phone: validation.contact.phone,
        email: validation.contact.email,
        source: validation.contact.source,
        notes: validation.contact.notes
      });
    } else {
      errors.push({
        rowNumber,
        message: validation.errors.join(". "),
        rawRow: row
      });
    }
  });

  if (validContacts.length === 0 && errors.length === 0) {
    return {
      error: "No contacts found in the uploaded file."
    };
  }

  return {
    summary: {
      totalRows: validContacts.length + errors.length,
      validCount: validContacts.length,
      errorCount: errors.length,
      validContacts,
      errors,
      fileName
    }
  };
}
