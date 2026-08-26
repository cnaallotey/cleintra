import { describe, it, expect, beforeEach } from "vitest";
import {
  saveContacts,
  savePipelineStages,
  getDashboardContacts,
  DEFAULT_PIPELINE_STAGES
} from "../contacts-store";
import { Contact } from "@/types/crm";

describe("Dashboard Query and Filtering", () => {
  const mockContacts: Contact[] = [
    {
      id: "cnt_1",
      name: "Kwame Mensah",
      phone: "0241234567",
      email: "kwame@example.com",
      source: "Facebook Ad",
      notes: "Interested in rice bags",
      status: "New Lead",
      lastContactedAt: null,
      createdAt: "2026-08-20T10:00:00Z",
      updatedAt: "2026-08-20T10:00:00Z"
    },
    {
      id: "cnt_2",
      name: "Ama Osei",
      phone: "0559876543",
      email: "ama@gmail.com",
      source: "Referral",
      notes: "Follow up Thursday",
      status: "Follow-up",
      lastContactedAt: "2026-08-22T14:00:00Z",
      createdAt: "2026-08-21T10:00:00Z",
      updatedAt: "2026-08-22T14:00:00Z"
    },
    {
      id: "cnt_3",
      name: "Kofi Boateng",
      phone: "0205557788",
      email: null,
      source: "Walk-in",
      notes: "Paid deposit",
      status: "Won",
      lastContactedAt: "2026-08-23T09:00:00Z",
      createdAt: "2026-08-22T10:00:00Z",
      updatedAt: "2026-08-23T09:00:00Z"
    }
  ];

  beforeEach(() => {
    savePipelineStages(DEFAULT_PIPELINE_STAGES);
    saveContacts(mockContacts);
  });

  it("should return all contacts and full stage counts when no filters are set", () => {
    const res = getDashboardContacts();
    expect(res.totalCount).toBe(3);
    expect(res.filteredCount).toBe(3);
    expect(res.contacts.length).toBe(3);

    const newLeadSummary = res.stageSummaries.find((s) => s.name === "New Lead");
    const followUpSummary = res.stageSummaries.find((s) => s.name === "Follow-up");
    const wonSummary = res.stageSummaries.find((s) => s.name === "Won");

    expect(newLeadSummary?.contactCount).toBe(1);
    expect(followUpSummary?.contactCount).toBe(1);
    expect(wonSummary?.contactCount).toBe(1);
  });

  it("should filter contacts by specific status", () => {
    const res = getDashboardContacts({ status: "Follow-up" });
    expect(res.totalCount).toBe(3);
    expect(res.filteredCount).toBe(1);
    expect(res.contacts[0].name).toBe("Ama Osei");
  });

  it("should filter contacts by search query across name, phone, email, and source", () => {
    // Name search
    const byName = getDashboardContacts({ q: "Kofi" });
    expect(byName.filteredCount).toBe(1);
    expect(byName.contacts[0].name).toBe("Kofi Boateng");

    // Phone search
    const byPhone = getDashboardContacts({ q: "055987" });
    expect(byPhone.filteredCount).toBe(1);
    expect(byPhone.contacts[0].name).toBe("Ama Osei");

    // Source search
    const bySource = getDashboardContacts({ q: "Facebook" });
    expect(bySource.filteredCount).toBe(1);
    expect(bySource.contacts[0].name).toBe("Kwame Mensah");
  });

  it("should support compound filtering (status AND search query)", () => {
    // Search for 'kwame' in 'New Lead' -> 1 match
    const match = getDashboardContacts({ status: "New Lead", q: "Kwame" });
    expect(match.filteredCount).toBe(1);

    // Search for 'kwame' in 'Follow-up' -> 0 matches
    const noMatch = getDashboardContacts({ status: "Follow-up", q: "Kwame" });
    expect(noMatch.filteredCount).toBe(0);
  });

  it("should return empty contacts list when no contacts match", () => {
    const res = getDashboardContacts({ q: "NonExistentName" });
    expect(res.filteredCount).toBe(0);
    expect(res.contacts).toEqual([]);
    expect(res.totalCount).toBe(3);
  });
});
