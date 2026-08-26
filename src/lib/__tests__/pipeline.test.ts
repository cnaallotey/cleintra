import { describe, it, expect, beforeEach } from "vitest";
import {
  getPipelineStages,
  savePipelineStages,
  getPipelineStagesWithCounts,
  createPipelineStage,
  updatePipelineStage,
  deletePipelineStage,
  updateContactStage,
  saveContacts,
  getStoredContacts,
  DEFAULT_PIPELINE_STAGES
} from "../contacts-store";
import { Contact } from "@/types/crm";

describe("Pipeline Stages and Status Tracking", () => {
  beforeEach(() => {
    savePipelineStages(DEFAULT_PIPELINE_STAGES);

    const testContacts: Contact[] = [
      {
        id: "c1",
        name: "Kwame Mensah",
        phone: "0241234567",
        email: "kwame@test.com",
        source: "Facebook",
        notes: null,
        status: "New Lead",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "c2",
        name: "Ama Osei",
        phone: "0559876543",
        email: null,
        source: "Referral",
        notes: null,
        status: "Contacted",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    saveContacts(testContacts);
  });

  it("should have sensible default pipeline stages pre-configured", () => {
    const stages = getPipelineStages();
    expect(stages.length).toBe(5);
    const names = stages.map((s) => s.name);
    expect(names).toEqual(["New Lead", "Contacted", "Follow-up", "Won", "Lost"]);
  });

  it("should calculate correct contact counts per stage", () => {
    const counts = getPipelineStagesWithCounts();
    const newLead = counts.find((s) => s.name === "New Lead");
    const contacted = counts.find((s) => s.name === "Contacted");
    const won = counts.find((s) => s.name === "Won");

    expect(newLead?.contactCount).toBe(1);
    expect(contacted?.contactCount).toBe(1);
    expect(won?.contactCount).toBe(0);
  });

  it("should update contact status and record stageChangedAt timestamp", () => {
    const updated = updateContactStage("c1", "Won");
    expect(updated).not.toBeNull();
    expect(updated?.status).toBe("Won");
    expect(updated?.stageChangedAt).toBeDefined();

    const stored = getStoredContacts().find((c) => c.id === "c1");
    expect(stored?.status).toBe("Won");
  });

  it("should create a new pipeline stage", () => {
    const newStage = createPipelineStage("In Negotiation", "purple");
    expect(newStage.name).toBe("In Negotiation");
    expect(newStage.color).toBe("purple");

    const stages = getPipelineStages();
    expect(stages.some((s) => s.name === "In Negotiation")).toBe(true);
  });

  it("should reject duplicate stage names", () => {
    expect(() => createPipelineStage("new lead")).toThrowError(
      'A stage named "new lead" already exists.'
    );
  });

  it("should rename a stage and cascade changes to all contacts in that stage", () => {
    const stages = getPipelineStages();
    const leadStage = stages.find((s) => s.name === "New Lead");
    expect(leadStage).toBeDefined();

    updatePipelineStage(leadStage!.id, { name: "Fresh Prospect" });

    // Verify stage name changed
    const updatedStages = getPipelineStages();
    expect(updatedStages.some((s) => s.name === "Fresh Prospect")).toBe(true);

    // Verify contact status cascaded
    const contact = getStoredContacts().find((c) => c.id === "c1");
    expect(contact?.status).toBe("Fresh Prospect");
  });

  it("should require reassignment when deleting a stage containing contacts", () => {
    const stages = getPipelineStages();
    const leadStage = stages.find((s) => s.name === "New Lead");

    // Deleting without reassignment should fail
    expect(() => deletePipelineStage(leadStage!.id)).toThrowError(
      "Please select another stage to move 1 contact(s) to."
    );

    // Deleting with reassignment
    const result = deletePipelineStage(leadStage!.id, "Contacted");
    expect(result.success).toBe(true);
    expect(result.reassignedCount).toBe(1);

    // Verify contact moved
    const contact = getStoredContacts().find((c) => c.id === "c1");
    expect(contact?.status).toBe("Contacted");
  });

  it("should allow deleting an empty stage without reassignment", () => {
    const stages = getPipelineStages();
    const wonStage = stages.find((s) => s.name === "Won");
    expect(wonStage).toBeDefined();

    const result = deletePipelineStage(wonStage!.id);
    expect(result.success).toBe(true);
    expect(result.reassignedCount).toBe(0);

    const updatedStages = getPipelineStages();
    expect(updatedStages.some((s) => s.name === "Won")).toBe(false);
  });

  it("should prevent deleting the last remaining stage", () => {
    savePipelineStages([DEFAULT_PIPELINE_STAGES[0]]);
    expect(() => deletePipelineStage(DEFAULT_PIPELINE_STAGES[0].id)).toThrowError(
      "You must have at least one pipeline stage."
    );
  });
});
