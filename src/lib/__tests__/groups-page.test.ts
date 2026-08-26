import { describe, it, expect, beforeEach } from "vitest";
import { 
  createContactGroup, 
  saveContactGroups, 
  saveContacts, 
  getGroupMembers, 
  getUnassignedContacts, 
  removeContactFromGroup,
  getContactGroupsWithCounts,
  deleteContactGroup
} from "../contacts-store";
import { Contact } from "@/types/crm";

describe("Feature 10: Groups Management Route & Store Functions", () => {
  beforeEach(() => {
    saveContactGroups([]);
    saveContacts([
      {
        id: "cnt_gp_1",
        name: "Abena Mansa",
        phone: "0240001122",
        email: "abena@gmail.com",
        source: "Instagram",
        notes: null,
        status: "New Lead",
        groupId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "cnt_gp_2",
        name: "Kwadwo Asare",
        phone: "0551112233",
        email: "kwadwo@gmail.com",
        source: "Walk-in",
        notes: null,
        status: "Contacted",
        groupId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]);
  });

  it("should return empty group members initially and 2 unassigned contacts", () => {
    const unassigned = getUnassignedContacts();
    expect(unassigned.length).toBe(2);
  });

  it("should return correct group members when contacts are assigned", () => {
    const group = createContactGroup("Wholesale VIP");

    saveContacts([
      {
        id: "cnt_gp_1",
        name: "Abena Mansa",
        phone: "0240001122",
        email: "abena@gmail.com",
        source: "Instagram",
        notes: null,
        status: "New Lead",
        groupId: group.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "cnt_gp_2",
        name: "Kwadwo Asare",
        phone: "0551112233",
        email: "kwadwo@gmail.com",
        source: "Walk-in",
        notes: null,
        status: "Contacted",
        groupId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]);

    const members = getGroupMembers(group.id);
    expect(members.length).toBe(1);
    expect(members[0].name).toBe("Abena Mansa");

    const unassigned = getUnassignedContacts();
    expect(unassigned.length).toBe(1);
    expect(unassigned[0].name).toBe("Kwadwo Asare");
  });

  it("should remove a contact from a group cleanly", () => {
    const group = createContactGroup("Retail Shoppers");

    saveContacts([
      {
        id: "cnt_gp_1",
        name: "Abena Mansa",
        phone: "0240001122",
        email: "abena@gmail.com",
        source: "Instagram",
        notes: null,
        status: "New Lead",
        groupId: group.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]);

    expect(getGroupMembers(group.id).length).toBe(1);

    const updated = removeContactFromGroup("cnt_gp_1");
    expect(updated?.groupId).toBeNull();
    expect(getGroupMembers(group.id).length).toBe(0);
    expect(getUnassignedContacts().length).toBe(1);
  });

  it("should update group counts accurately after group creation and deletion", () => {
    const group1 = createContactGroup("Group A");
    const group2 = createContactGroup("Group B");

    let counts = getContactGroupsWithCounts();
    expect(counts.length).toBe(2);
    expect(counts[0].contactCount).toBe(0);

    deleteContactGroup(group1.id);
    counts = getContactGroupsWithCounts();
    expect(counts.length).toBe(1);
    expect(counts[0].name).toBe("Group B");
  });
});
