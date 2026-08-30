import { describe, it, expect, beforeEach } from "vitest";
import { 
  getDialerQueue, 
  logDialerInteraction, 
  saveContacts, 
  saveContactGroups, 
  savePipelineStages,
  DEFAULT_PIPELINE_STAGES,
  saveAllInteractions
} from "../contacts-store";
import { Contact, ContactGroup } from "@/types/crm";

describe("Speed-Dialer Queue & Outreach Logging", () => {
  const mockGroups: ContactGroup[] = [
    {
      id: "grp_wholesale",
      name: "Wholesale Buyers",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z"
    },
    {
      id: "grp_retail",
      name: "Retail Inquiries",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z"
    }
  ];

  const mockContacts: Contact[] = [
    {
      id: "c_1",
      name: "Kofi Mensah",
      phone: "0244123456",
      email: "kofi@example.com",
      source: "WhatsApp",
      notes: "Interested in bulk rice",
      status: "New Lead",
      groupId: "grp_wholesale",
      lastContactedAt: null, // Never contacted
      createdAt: "2026-01-01T10:00:00.000Z",
      updatedAt: "2026-01-01T10:00:00.000Z"
    },
    {
      id: "c_2",
      name: "Ama Serwaa",
      phone: "0201987654",
      email: "ama@example.com",
      source: "Instagram",
      notes: "Wants price list",
      status: "Called",
      groupId: "grp_wholesale",
      lastContactedAt: "2026-01-02T12:00:00.000Z", // Contacted previously
      createdAt: "2026-01-01T11:00:00.000Z",
      updatedAt: "2026-01-02T12:00:00.000Z"
    },
    {
      id: "c_3",
      name: "Kwame Osei",
      phone: "0555112233",
      email: null,
      source: "Referral",
      notes: "Shop owner",
      status: "New Lead",
      groupId: "grp_retail",
      lastContactedAt: null,
      createdAt: "2026-01-01T12:00:00.000Z",
      updatedAt: "2026-01-01T12:00:00.000Z"
    },
    {
      id: "c_4",
      name: "Akosua Boateng",
      phone: "0244998877",
      email: null,
      source: "Website",
      notes: null,
      status: "New Lead",
      groupId: null, // Unassigned
      lastContactedAt: null,
      createdAt: "2026-01-01T13:00:00.000Z",
      updatedAt: "2026-01-01T13:00:00.000Z"
    }
  ];

  beforeEach(() => {
    savePipelineStages(DEFAULT_PIPELINE_STAGES);
    saveContactGroups(mockGroups);
    saveContacts(mockContacts);
    saveAllInteractions([]);
  });

  it("should retrieve all contacts queue when queueId is 'all'", () => {
    const queue = getDialerQueue("all");
    expect(queue.queueId).toBe("all");
    expect(queue.totalLeads).toBe(4);
    expect(queue.neverContactedCount).toBe(3);
    // Never contacted should appear before previously contacted
    expect(queue.contacts[0].lastContactedAt).toBeNull();
  });

  it("should retrieve contacts filtered by specific contact group", () => {
    const queue = getDialerQueue("grp_wholesale");
    expect(queue.queueId).toBe("grp_wholesale");
    expect(queue.group?.name).toBe("Wholesale Buyers");
    expect(queue.totalLeads).toBe(2);
    expect(queue.contacts.map((c) => c.name)).toEqual(["Kofi Mensah", "Ama Serwaa"]);
  });

  it("should filter queue by status filter", () => {
    const queue = getDialerQueue("grp_wholesale", { statusFilter: "New Lead" });
    expect(queue.totalLeads).toBe(1);
    expect(queue.contacts[0].name).toBe("Kofi Mensah");
    expect(queue.contacts[0].status).toBe("New Lead");
  });

  it("should retrieve unassigned queue when queueId is 'unassigned'", () => {
    const queue = getDialerQueue("unassigned");
    expect(queue.totalLeads).toBe(1);
    expect(queue.contacts[0].name).toBe("Akosua Boateng");
  });

  it("should handle non-existent group ID gracefully", () => {
    const queue = getDialerQueue("non_existent_group");
    expect(queue.queueTitle).toBe("Queue Not Found");
    expect(queue.totalLeads).toBe(0);
    expect(queue.contacts).toHaveLength(0);
  });

  it("should atomically log interaction and update contact status and lastContactedAt", () => {
    const result = logDialerInteraction({
      contactId: "c_1",
      outcome: "Call - Connected",
      newStatus: "Called",
      notes: "Spoke with client, confirmed order."
    });

    expect(result.interaction.outcome).toBe("Call - Connected");
    expect(result.interaction.notes).toBe("Spoke with client, confirmed order.");
    expect(result.updatedContact.status).toBe("Called");
    expect(result.updatedContact.lastContactedAt).toBeTruthy();

    // Verify queue re-sorts updated contact
    const refreshedQueue = getDialerQueue("grp_wholesale");
    expect(refreshedQueue.contacts.find((c) => c.id === "c_1")?.status).toBe("Called");
  });
});
