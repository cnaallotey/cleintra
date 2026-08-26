import { describe, it, expect } from "vitest";
import { UpdateBusinessProfileInput } from "@/types/auth";

describe("Feature 9: Business Profile & Settings", () => {
  const validateProfileInput = (input: UpdateBusinessProfileInput) => {
    const trimmedName = input.name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      throw new Error("Business name must be at least 2 characters.");
    }

    if (input.supportEmail && input.supportEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.supportEmail.trim())) {
        throw new Error("Please enter a valid support email address.");
      }
    }

    const validCurrencies = ["GHS", "USD", "EUR", "GBP", "NGN", "KES"];
    if (input.currency && !validCurrencies.includes(input.currency)) {
      throw new Error("Invalid currency selection.");
    }

    return true;
  };

  it("should validate valid business profile input", () => {
    const valid: UpdateBusinessProfileInput = {
      name: "Adom Retail Enterprise",
      ownerName: "Kwame Mensah",
      supportEmail: "support@adom.com",
      phone: "0244123456",
      currency: "GHS",
      industry: "Retail"
    };

    expect(validateProfileInput(valid)).toBe(true);
  });

  it("should reject invalid or too short business names", () => {
    expect(() => validateProfileInput({ name: "" })).toThrow("Business name must be at least 2 characters.");
    expect(() => validateProfileInput({ name: "A" })).toThrow("Business name must be at least 2 characters.");
    expect(() => validateProfileInput({ name: "   " })).toThrow("Business name must be at least 2 characters.");
  });

  it("should validate support email format when provided", () => {
    expect(() =>
      validateProfileInput({
        name: "Valid Name",
        supportEmail: "not-an-email"
      })
    ).toThrow("Please enter a valid support email address.");

    expect(
      validateProfileInput({
        name: "Valid Name",
        supportEmail: "help@shop.com"
      })
    ).toBe(true);
  });
});
