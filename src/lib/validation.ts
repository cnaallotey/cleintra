/**
 * Phone number normalization and validation.
 * Supports Ghanaian formats (e.g. 024XXXXXXX, +233XXXXXXXXX, 233XXXXXXXXX)
 * and international E.164 formats (+1234567890).
 */
export function normalizePhone(raw: string | null | undefined): { isValid: boolean; normalized: string | null; error?: string } {
  if (!raw || typeof raw !== "string") {
    return { isValid: true, normalized: null };
  }

  const trimmed = raw.trim();
  if (trimmed === "") {
    return { isValid: true, normalized: null };
  }

  // Remove spaces, dashes, dots, brackets
  const cleaned = trimmed.replace(/[\s\-\.\(\)]/g, "");

  // Match Ghana local format: 02X, 05X, 03X (10 digits total)
  if (/^0[235]\d{8}$/.test(cleaned)) {
    return { isValid: true, normalized: cleaned };
  }

  // Match Ghana international format with +233: +233[235]\d{8}
  if (/^\+233[235]\d{8}$/.test(cleaned)) {
    return { isValid: true, normalized: cleaned };
  }

  // Match Ghana international format without +: 233[235]\d{8}
  if (/^233[235]\d{8}$/.test(cleaned)) {
    return { isValid: true, normalized: `+${cleaned}` };
  }

  // General international format: starts with +, 7-15 digits
  if (/^\+\d{7,15}$/.test(cleaned)) {
    return { isValid: true, normalized: cleaned };
  }

  // Standard digits only (7 to 15 digits)
  if (/^\d{7,15}$/.test(cleaned)) {
    return { isValid: true, normalized: cleaned };
  }

  return {
    isValid: false,
    normalized: null,
    error: "Invalid phone number format"
  };
}

/**
 * Email normalization and validation.
 */
export function normalizeEmail(raw: string | null | undefined): { isValid: boolean; normalized: string | null; error?: string } {
  if (!raw || typeof raw !== "string") {
    return { isValid: true, normalized: null };
  }

  const trimmed = raw.trim().toLowerCase();
  if (trimmed === "") {
    return { isValid: true, normalized: null };
  }

  // Standard email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(trimmed)) {
    return { isValid: true, normalized: trimmed };
  }

  return {
    isValid: false,
    normalized: null,
    error: "Invalid email address format"
  };
}

export interface RowValidationResult {
  isValid: boolean;
  errors: string[];
  contact?: {
    name: string;
    phone: string | null;
    email: string | null;
    source: string | null;
    notes: string | null;
  };
}

/**
 * Validates a single row of contact data.
 * Criteria:
 * 1. Must have a Name.
 * 2. Must have at least one valid contact method (Phone or Email).
 */
export function validateContactRow(row: {
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  source?: string | null;
  notes?: string | null;
}): RowValidationResult {
  const errors: string[] = [];

  const rawName = row.name ? String(row.name).trim() : "";
  if (!rawName) {
    errors.push("Missing contact name");
  }

  const phoneCheck = normalizePhone(row.phone);
  if (!phoneCheck.isValid) {
    errors.push("Invalid phone number format");
  }

  const emailCheck = normalizeEmail(row.email);
  if (!emailCheck.isValid) {
    errors.push("Invalid email address format");
  }

  const hasPhone = Boolean(phoneCheck.normalized);
  const hasEmail = Boolean(emailCheck.normalized);

  if (!hasPhone && !hasEmail && phoneCheck.isValid && emailCheck.isValid) {
    errors.push("Missing phone number and email (at least one contact method is required)");
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      errors
    };
  }

  return {
    isValid: true,
    errors: [],
    contact: {
      name: rawName,
      phone: phoneCheck.normalized,
      email: emailCheck.normalized,
      source: row.source ? String(row.source).trim() || null : null,
      notes: row.notes ? String(row.notes).trim() || null : null
    }
  };
}
