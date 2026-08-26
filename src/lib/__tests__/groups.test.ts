import { describe, it, expect, beforeEach } from "vitest";
import { 
  getContactGroups, 
  saveContactGroups, 
  createContactGroup, 
  updateContactGroup, 
  deleteContactGroup,
  getContactGroupsWithCounts,
  updateContactGroupAssignment,
  importBatchContacts,
  getDashboardContacts,
  saveContacts,
  getStoredContacts
} from "../contacts-store";
import { Contact, ValidContactInput } from "@/types/crm";

describe("Feature 8: Contact Groups & Group-based Import", () => {
  beforeEach(() => {
    saveContactGroups([]);
    saveContacts([
      {
        id: "cnt_t1",
        name: "Akosua Mensah",
        phone: "0244000111",
        email: "akosua@gmail.com",
        source: "Instagram",
        notes: null,
        status: "New Lead",
        groupId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "cnt_t2",
        name: "Kwaku Boateng",
        phone: "0559000222",
        email: "kwaku@gmail.com",
        source: "Walk-in",
        notes: null,
        status: "Contacted",
        groupId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]);
  });

  it("should create a new contact group with unique name", () => {
    const group = createContactGroup("Wholesale Leads");
    expect(group.id).toBeDefined();
    expect(group.name).toBe("Wholesale Leads");

    const allGroups = getContactGroups();
    expect(allGroups.length).toBe(1);
    expect(allGroups[0].name).toBe("Wholesale Leads");
  });

  it("should reject empty or duplicate group names", () => {
    expect(() => createContactGroup("")).toThrow("Group name cannot be empty.");
    expect(() => createContactGroup("   ")).toThrow("Group name cannot be empty.");

    createContactGroup("Retail");
    expect(() => createContactGroup("Retail")).toThrow('A group named "Retail" already exists.');
    expect(() => createContactGroup("retail")).toThrow('A group named "retail" already exists.');
    expect(() => createContactGroup("All Contacts")).toThrow('"All Contacts" is a reserved system name.');
  });

  it("should calculate group contact counts correctly", () => {
    const group1 = createContactGroup("Wholesale");
    const group2 = createContactGroup("Retail");

    updateContactGroupAssignment("cnt_t1", group1.id);

    const summaries = getContactGroupsWithCounts();
    const sum1 = summaries.find((g) => g.id === group1.id);
    const sum2 = summaries.find((g) => g.id === group2.id);

    expect(sum1?.contactCount).toBe(1);
    expect(sum2?.contactCount).toBe(0);
  });

  it("should rename a group and keep contacts intact", () => {
    const group = createContactGroup("Wholesale");
    updateContactGroupAssignment("cnt_t1", group.id);

    const updated = updateContactGroup(group.id, { name: "VIP Wholesale" });
    expect(updated?.name).toBe("VIP Wholesale");

    const contact = getStoredContacts().find((c) => c.id === "cnt_t1");
    expect(contact?.groupId).toBe(group.id);
  });

  it("should delete a group and safely unassign contacts without deleting them", () => {
    const group = createContactGroup("Exhibition 2026");
    updateContactGroupAssignment("cnt_t1", group.id);

    const res = deleteContactGroup(group.id);
    expect(res.success).toBe(true);
    expect(res.unassignedCount).toBe(1);

    const allGroups = getContactGroups();
    expect(allGroups.length).toBe(0);

    const contact = getStoredContacts().find((c) => c.id === "cnt_t1");
    expect(contact).toBeDefined();
    expect(contact?.groupId).toBeNull();
  });

  it("should import batch contacts and assign them to target group", () => {
    const group = createContactGroup("Trade Show Batch");

    const inputs: ValidContactInput[] = [
      {
        tempId: "tmp_1",
        name: "Ama Serwaa",
        phone: "0201112233",
        email: "ama@trade.com",
        source: "Trade Show",
        notes: null
      },
      {
        tempId: "tmp_2",
        name: "Kofi Annan",
        phone: "0274445566",
        email: null,
        source: "Trade Show",
        notes: null
      }
    ];

    importBatchContacts(inputs, group.id);

    const allContacts = getStoredContacts();
    const importedAma = allContacts.find((c) => c.name === "Ama Serwaa");
    const importedKofi = allContacts.find((c) => c.name === "Kofi Annan");

    expect(importedAma?.groupId).toBe(group.id);
    expect(importedKofi?.groupId).toBe(group.id);
  });

  it("should filter dashboard contacts by group and unassigned", () => {
    const group = createContactGroup("Wholesale");
    updateContactGroupAssignment("cnt_t1", group.id);

    // Filter by specific group
    const resGroup = getDashboardContacts({ groupId: group.id });
    expect(resGroup.contacts.length).toBe(1);
    expect(resGroup.contacts[0].id).toBe("cnt_t1");

    // Filter by unassigned
    const resUnassigned = getDashboardContacts({ groupId: "unassigned" });
    expect(resUnassigned.contacts.length).toBe(1);
    expect(resUnassigned.contacts[0].id).toBe("cnt_t2");

    // Filter by all
    const resAll = getDashboardContacts({});
    expect(resAll.contacts.length).toBe(2);
  });
});
