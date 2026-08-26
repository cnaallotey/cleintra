import { describe, it, expect, beforeEach } from "vitest";
import { getContactById, getStoredContacts, saveContacts } from "../contacts-store";
import { Contact } from "@/types/crm";

describe("Contact Record View Queries", () => {
  const mockContacts: Contact[] = [
    {
      id: "test_1",
      name: "Kwame Mensah",
      phone: "0241234567",
      email: "kwame@example.com",
      source: "Facebook Ad",
      notes: "Interested in wholesale",
      status: "New Lead",
      createdAt: "2026-08-20T10:00:00Z",
      updatedAt: "2026-08-20T10:00:00Z"
    },
    {
      id: "test_2",
      name: "",
      phone: "0559876543",
      email: null,
      source: null,
      notes: null,
      status: "New Lead",
      createdAt: "2026-08-21T12:00:00Z",
      updatedAt: "2026-08-21T12:00:00Z"
    }
  ];

  beforeEach(() => {
    saveContacts(mockContacts);
  });

  it("should retrieve a contact by its unique ID", () => {
    const contact = getContactById("test_1");
    expect(contact).not.toBeNull();
    expect(contact?.name).toBe("Kwame Mensah");
    expect(contact?.phone).toBe("0241234567");
    expect(contact?.email).toBe("kwame@example.com");
  });

  it("should return null for non-existent contact ID", () => {
    const contact = getContactById("non_existent_id");
    expect(contact).toBeNull();
  });

  it("should handle contacts with empty optional fields", () => {
    const contact = getContactById("test_2");
    expect(contact).not.toBeNull();
    expect(contact?.email).toBeNull();
    expect(contact?.source).toBeNull();
    expect(contact?.notes).toBeNull();
  });
});
