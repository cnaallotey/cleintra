import { describe, it, expect, beforeEach } from "vitest";
import {
  saveContacts,
  getStoredContacts,
  saveAllInteractions,
  getContactInteractions,
  logContactInteraction,
  updateContactInteraction,
  deleteContactInteraction
} from "../contacts-store";
import { Contact } from "@/types/crm";

describe("Call & Interaction Logging", () => {
  const testContact: Contact = {
    id: "cnt_test_user",
    name: "Ama Osei",
    phone: "0241234567",
    email: "ama@example.com",
    source: "Facebook",
    notes: "First inquiry",
    status: "New Lead",
    lastContactedAt: null,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString()
  };

  beforeEach(() => {
    saveContacts([testContact]);
    saveAllInteractions([]);
  });

  it("should start with empty interaction history and null lastContactedAt", () => {
    const list = getContactInteractions("cnt_test_user");
    expect(list).toEqual([]);

    const contact = getStoredContacts().find((c) => c.id === "cnt_test_user");
    expect(contact?.lastContactedAt).toBeNull();
  });

  it("should log a new call interaction and automatically update lastContactedAt", () => {
    const nowIso = new Date().toISOString();
    const result = logContactInteraction("cnt_test_user", {
      outcome: "Call - Connected",
      date: nowIso,
      notes: "Customer interested in bulk discount."
    });

    expect(result.interaction).toBeDefined();
    expect(result.interaction.outcome).toBe("Call - Connected");
    expect(result.interaction.notes).toBe("Customer interested in bulk discount.");

    // Check contact lastContactedAt
    expect(result.contact.lastContactedAt).toBe(nowIso);

    // Verify stored interactions
    const list = getContactInteractions("cnt_test_user");
    expect(list.length).toBe(1);
    expect(list[0].id).toBe(result.interaction.id);
  });

  it("should sort multiple interactions in reverse chronological order (newest first)", () => {
    const pastDate = new Date(Date.now() - 86400000 * 2).toISOString();
    const recentDate = new Date().toISOString();

    logContactInteraction("cnt_test_user", {
      outcome: "Call - No Answer",
      date: pastDate,
      notes: "Tried calling morning."
    });

    logContactInteraction("cnt_test_user", {
      outcome: "Call - Connected",
      date: recentDate,
      notes: "Spoke in afternoon."
    });

    const list = getContactInteractions("cnt_test_user");
    expect(list.length).toBe(2);
    expect(list[0].outcome).toBe("Call - Connected");
    expect(list[1].outcome).toBe("Call - No Answer");

    const contact = getStoredContacts().find((c) => c.id === "cnt_test_user");
    expect(contact?.lastContactedAt).toBe(recentDate);
  });

  it("should allow editing a logged interaction", () => {
    const { interaction } = logContactInteraction("cnt_test_user", {
      outcome: "Call - No Answer",
      notes: "Initial attempt"
    });

    const updated = updateContactInteraction("cnt_test_user", interaction.id, {
      outcome: "Call - Left Voicemail",
      notes: "Left voicemail asking to call back"
    });

    expect(updated).not.toBeNull();
    expect(updated?.interaction.outcome).toBe("Call - Left Voicemail");
    expect(updated?.interaction.notes).toBe("Left voicemail asking to call back");
  });

  it("should allow deleting an interaction and recalculate lastContactedAt", () => {
    const oldDate = new Date(Date.now() - 86400000 * 3).toISOString();
    const newDate = new Date().toISOString();

    const first = logContactInteraction("cnt_test_user", {
      outcome: "Email Sent",
      date: oldDate
    });

    const second = logContactInteraction("cnt_test_user", {
      outcome: "Meeting / Discussion",
      date: newDate
    });

    // Delete the newest interaction
    const deleteResult = deleteContactInteraction("cnt_test_user", second.interaction.id);
    expect(deleteResult.success).toBe(true);

    // lastContactedAt should fall back to oldDate
    expect(deleteResult.contact?.lastContactedAt).toBe(oldDate);

    // Delete the remaining one
    const deleteLast = deleteContactInteraction("cnt_test_user", first.interaction.id);
    expect(deleteLast.contact?.lastContactedAt).toBeNull();
  });
});
