"use client";

import { 
  Contact, 
  ValidContactInput, 
  PipelineStage, 
  PipelineStageWithCount, 
  StageColor,
  ContactGroup,
  ContactGroupWithCount,
  CreateContactGroupInput,
  UpdateContactGroupInput,
  Interaction,
  InteractionOutcome,
  CreateInteractionInput,
  UpdateInteractionInput,
  DashboardFilterParams,
  DashboardContactsResponse,
  DialerQueueOptions,
  DialerQueueResponse,
  LogDialerInteractionInput
} from "@/types/crm";
import {
  syncContact,
  syncBatchContacts,
  syncDeleteContact,
  syncGroup,
  syncDeleteGroup,
  syncStages,
  syncDeleteStage,
  syncInteraction,
  syncDeleteInteraction
} from "./firestore-sync";

const CONTACTS_STORAGE_KEY = "simple_crm_contacts_v1";
const STAGES_STORAGE_KEY = "simple_crm_stages_v1";
const INTERACTIONS_STORAGE_KEY = "simple_crm_interactions_v1";
const GROUPS_STORAGE_KEY = "simple_crm_groups_v1";

export const DEFAULT_PIPELINE_STAGES: PipelineStage[] = [
  {
    id: "stage_new_lead",
    name: "New Lead",
    order: 0,
    color: "blue",
    isDefault: true,
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: "stage_contacted",
    name: "Contacted",
    order: 1,
    color: "amber",
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: "stage_follow_up",
    name: "Follow-up",
    order: 2,
    color: "purple",
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: "stage_won",
    name: "Won",
    order: 3,
    color: "emerald",
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: "stage_lost",
    name: "Lost",
    order: 4,
    color: "gray",
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
];

export const DEFAULT_INITIAL_CONTACTS: Contact[] = [
  {
    id: "cnt_demo_1",
    name: "Kwame Mensah",
    phone: "0244123456",
    email: "kwame.mensah@gmail.com",
    source: "Instagram DM",
    notes: "Interested in 50 bags of Jasmine Rice wholesale.",
    status: "New Lead",
    groupId: null,
    stageChangedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    lastContactedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: "cnt_demo_2",
    name: "Abena Serwaa",
    phone: "0559876543",
    email: "abena.serwaa@outlook.com",
    source: "Store Walk-in",
    notes: "Asked about delivery terms to Kumasi.",
    status: "Contacted",
    groupId: null,
    stageChangedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    lastContactedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "cnt_demo_3",
    name: "Kofi Owusu",
    phone: "0201122334",
    email: "kofi.owusu@yahoo.com",
    source: "WhatsApp Referral",
    notes: "Requires quote for solar inverter installation.",
    status: "Follow-up",
    groupId: null,
    stageChangedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    lastContactedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: "cnt_demo_4",
    name: "Ama Boateng",
    phone: "0278899001",
    email: "ama.boateng@gmail.com",
    source: "Facebook Ad",
    notes: "Paid full invoice for corporate gift boxes.",
    status: "Won",
    groupId: null,
    stageChangedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    lastContactedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 6).toISOString()
  },
  {
    id: "cnt_demo_5",
    name: "Yaw Asante",
    phone: "0245566778",
    email: "yaw.asante@gmail.com",
    source: "Cold Call",
    notes: "Budget mismatch for premium package.",
    status: "Lost",
    groupId: null,
    stageChangedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    lastContactedAt: new Date(Date.now() - 86400000 * 9).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 9).toISOString()
  }
];

export const DEFAULT_INITIAL_INTERACTIONS: Interaction[] = [
  {
    id: "act_demo_1",
    contactId: "cnt_demo_1",
    outcome: "Call - Connected",
    date: new Date(Date.now() - 86400000 * 1).toISOString(),
    notes: "Called Kwame to verify order size. Confirmed 50 bags needed for next Tuesday.",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: "act_demo_2",
    contactId: "cnt_demo_2",
    outcome: "Meeting / Discussion",
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    notes: "In-store meeting. Gave product samples and price catalog.",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "act_demo_3",
    contactId: "cnt_demo_3",
    outcome: "Call - Connected",
    date: new Date(Date.now() - 3600000 * 5).toISOString(),
    notes: "Sent invoice PDF via WhatsApp. Promised to follow up by 4pm tomorrow.",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: "act_demo_4",
    contactId: "cnt_demo_4",
    outcome: "Call - Connected",
    date: new Date(Date.now() - 86400000 * 6).toISOString(),
    notes: "Confirmed MoMo payment received in full. Scheduled delivery for Friday.",
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 6).toISOString()
  },
  {
    id: "act_demo_5",
    contactId: "cnt_demo_5",
    outcome: "Call - No Answer",
    date: new Date(Date.now() - 86400000 * 9).toISOString(),
    notes: "Followed up on discounted offer. Client opted for lower tier competitor.",
    createdAt: new Date(Date.now() - 86400000 * 9).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 9).toISOString()
  }
];

// In-memory fallbacks
let memoryContacts: Contact[] = [...DEFAULT_INITIAL_CONTACTS];
let memoryStages: PipelineStage[] = [...DEFAULT_PIPELINE_STAGES];
let memoryInteractions: Interaction[] = [...DEFAULT_INITIAL_INTERACTIONS];
let memoryGroups: ContactGroup[] = [];

export function getActiveBusinessId(): string {
  if (typeof window === "undefined") return "biz_demo_1";
  try {
    const raw = localStorage.getItem("simple_crm_auth_user_v1");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.uid) return parsed.uid;
    }
  } catch (e) {
    console.error("Failed to read active user:", e);
  }
  return "biz_demo_1";
}

function getTenantStorageKey(type: "contacts" | "stages" | "interactions" | "groups"): string {
  const bizId = getActiveBusinessId();
  return `crm_${bizId}_${type}_v1`;
}

/* -------------------------------------------------------------
 * Groups Store
 * ------------------------------------------------------------- */

export function getContactGroups(): ContactGroup[] {
  if (typeof window === "undefined") {
    return [...memoryGroups].sort((a, b) => a.name.localeCompare(b.name));
  }
  const key = getTenantStorageKey("groups");
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return [];
    }
    const parsed: ContactGroup[] = JSON.parse(raw);
    return parsed.sort((a, b) => a.name.localeCompare(b.name));
  } catch (e) {
    console.error("Failed to read groups from storage:", e);
    return [];
  }
}

export function saveContactGroups(groups: ContactGroup[]): void {
  if (typeof window === "undefined") {
    memoryGroups = [...groups];
    return;
  }
  const key = getTenantStorageKey("groups");
  try {
    localStorage.setItem(key, JSON.stringify(groups));
  } catch (e) {
    console.error("Failed to save groups to storage:", e);
  }
}

export function getContactGroupsWithCounts(): ContactGroupWithCount[] {
  const groups = getContactGroups();
  const contacts = getStoredContacts();

  return groups.map((grp) => {
    const contactCount = contacts.filter((c) => c.groupId === grp.id).length;
    return {
      ...grp,
      contactCount
    };
  });
}

export function createContactGroup(name: string): ContactGroup {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error("Group name cannot be empty.");
  }
  if (trimmed.length > 50) {
    throw new Error("Group name must be 50 characters or fewer.");
  }
  if (trimmed.toLowerCase() === "all contacts" || trimmed.toLowerCase() === "unassigned") {
    throw new Error(`"${trimmed}" is a reserved system name.`);
  }

  const current = getContactGroups();
  const duplicate = current.find((g) => g.name.toLowerCase() === trimmed.toLowerCase());
  if (duplicate) {
    throw new Error(`A group named "${trimmed}" already exists.`);
  }

  const now = new Date().toISOString();
  const newGroup: ContactGroup = {
    id: `grp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: trimmed,
    createdAt: now,
    updatedAt: now
  };

  const updated = [...current, newGroup];
  saveContactGroups(updated);

  // Sync to Cloud Firestore
  syncGroup(getActiveBusinessId(), newGroup);

  return newGroup;
}

export function updateContactGroup(
  groupId: string,
  updates: UpdateContactGroupInput
): ContactGroup | null {
  const current = getContactGroups();
  const index = current.findIndex((g) => g.id === groupId);
  if (index === -1) return null;

  const trimmed = updates.name.trim();
  if (!trimmed) {
    throw new Error("Group name cannot be empty.");
  }
  if (trimmed.length > 50) {
    throw new Error("Group name must be 50 characters or fewer.");
  }
  if (trimmed.toLowerCase() === "all contacts" || trimmed.toLowerCase() === "unassigned") {
    throw new Error(`"${trimmed}" is a reserved system name.`);
  }

  const duplicate = current.find(
    (g) => g.name.toLowerCase() === trimmed.toLowerCase() && g.id !== groupId
  );
  if (duplicate) {
    throw new Error(`A group named "${trimmed}" already exists.`);
  }

  const now = new Date().toISOString();
  const updatedGroup: ContactGroup = {
    ...current[index],
    name: trimmed,
    updatedAt: now
  };

  current[index] = updatedGroup;
  saveContactGroups(current);

  // Sync to Cloud Firestore
  syncGroup(getActiveBusinessId(), updatedGroup);

  return updatedGroup;
}

export function deleteContactGroup(groupId: string): { success: boolean; unassignedCount: number } {
  const current = getContactGroups();
  const target = current.find((g) => g.id === groupId);
  if (!target) return { success: false, unassignedCount: 0 };

  const contacts = getStoredContacts();
  let unassignedCount = 0;
  const affectedContacts: Contact[] = [];

  const updatedContacts = contacts.map((c) => {
    if (c.groupId === groupId) {
      unassignedCount++;
      const updated = {
        ...c,
        groupId: null,
        updatedAt: new Date().toISOString()
      };
      affectedContacts.push(updated);
      return updated;
    }
    return c;
  });

  if (unassignedCount > 0) {
    saveContacts(updatedContacts);
  }

  const remaining = current.filter((g) => g.id !== groupId);
  saveContactGroups(remaining);

  // Sync to Cloud Firestore
  syncDeleteGroup(getActiveBusinessId(), groupId, affectedContacts);

  return { success: true, unassignedCount };
}

export function updateContactGroupAssignment(contactId: string, groupId: string | null): Contact | null {
  const contacts = getStoredContacts();
  const index = contacts.findIndex((c) => c.id === contactId);
  if (index === -1) return null;

  const updatedContact: Contact = {
    ...contacts[index],
    groupId: groupId || null,
    updatedAt: new Date().toISOString()
  };

  contacts[index] = updatedContact;
  saveContacts(contacts);

  // Sync to Cloud Firestore
  syncContact(getActiveBusinessId(), updatedContact);

  return updatedContact;
}

export function getGroupMembers(groupId: string): Contact[] {
  const contacts = getStoredContacts();
  return contacts.filter((c) => c.groupId === groupId);
}

export function getUnassignedContacts(): Contact[] {
  const contacts = getStoredContacts();
  return contacts.filter((c) => !c.groupId);
}

export function removeContactFromGroup(contactId: string): Contact | null {
  return updateContactGroupAssignment(contactId, null);
}

/* -------------------------------------------------------------
 * Interactions Store
 * ------------------------------------------------------------- */

export function getAllInteractions(): Interaction[] {
  if (typeof window === "undefined") {
    return [...memoryInteractions];
  }
  const key = getTenantStorageKey("interactions");
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      const initial = getActiveBusinessId() === "biz_demo_1" ? DEFAULT_INITIAL_INTERACTIONS : [];
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to read interactions from storage:", e);
    return [];
  }
}

export function saveAllInteractions(interactions: Interaction[]): void {
  if (typeof window === "undefined") {
    memoryInteractions = [...interactions];
    return;
  }
  const key = getTenantStorageKey("interactions");
  try {
    localStorage.setItem(key, JSON.stringify(interactions));
  } catch (e) {
    console.error("Failed to save interactions to storage:", e);
  }
}

export function getContactInteractions(contactId: string): Interaction[] {
  const all = getAllInteractions();
  return all
    .filter((a) => a.contactId === contactId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function syncContactLastContacted(contactId: string): Contact | null {
  const interactions = getContactInteractions(contactId);
  const contacts = getStoredContacts();
  const index = contacts.findIndex((c) => c.id === contactId);
  if (index === -1) return null;

  const latest = interactions[0];
  const lastContactedAt = latest ? latest.date : null;

  const updatedContact: Contact = {
    ...contacts[index],
    lastContactedAt,
    updatedAt: new Date().toISOString()
  };

  contacts[index] = updatedContact;
  saveContacts(contacts);

  return updatedContact;
}

export function logContactInteraction(
  contactId: string,
  input: CreateInteractionInput
): { interaction: Interaction; contact: Contact } {
  const all = getAllInteractions();
  const now = new Date().toISOString();

  const newInteraction: Interaction = {
    id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    contactId,
    outcome: input.outcome,
    date: input.date || now,
    notes: input.notes ? input.notes.trim() || null : null,
    createdAt: now,
    updatedAt: now
  };

  saveAllInteractions([...all, newInteraction]);
  const updatedContact = syncContactLastContacted(contactId);

  // Sync to Cloud Firestore
  syncInteraction(getActiveBusinessId(), newInteraction, updatedContact);

  return {
    interaction: newInteraction,
    contact: updatedContact || getContactById(contactId)!
  };
}

export function updateContactInteraction(
  arg1: string,
  arg2: string | UpdateInteractionInput,
  arg3?: UpdateInteractionInput
): { interaction: Interaction; contact: Contact } | null {
  const interactionId = typeof arg2 === "string" ? arg2 : arg1;
  const updates: UpdateInteractionInput = typeof arg2 === "string" ? (arg3 || {}) : arg2;

  const all = getAllInteractions();
  const index = all.findIndex((a) => a.id === interactionId);
  if (index === -1) return null;

  const existing = all[index];
  const now = new Date().toISOString();

  const updatedInteraction: Interaction = {
    ...existing,
    outcome: updates.outcome || existing.outcome,
    date: updates.date || existing.date,
    notes: updates.notes !== undefined ? (updates.notes ? updates.notes.trim() : null) : existing.notes,
    updatedAt: now
  };

  all[index] = updatedInteraction;
  saveAllInteractions(all);
  const updatedContact = syncContactLastContacted(existing.contactId);

  // Sync to Cloud Firestore
  syncInteraction(getActiveBusinessId(), updatedInteraction, updatedContact);

  return {
    interaction: updatedInteraction,
    contact: updatedContact || getContactById(existing.contactId)!
  };
}

export function deleteContactInteraction(
  arg1: string,
  arg2?: string
): { success: boolean; contact: Contact | null } {
  const interactionId = typeof arg2 === "string" ? arg2 : arg1;

  const all = getAllInteractions();
  const target = all.find((a) => a.id === interactionId);
  if (!target) return { success: false, contact: null };

  const remaining = all.filter((a) => a.id !== interactionId);
  saveAllInteractions(remaining);
  const updatedContact = syncContactLastContacted(target.contactId);

  // Sync to Cloud Firestore
  syncDeleteInteraction(getActiveBusinessId(), interactionId, updatedContact);

  return { success: true, contact: updatedContact };
}

/* -------------------------------------------------------------
 * Stages Store
 * ------------------------------------------------------------- */

export function getPipelineStages(): PipelineStage[] {
  if (typeof window === "undefined") {
    return [...memoryStages].sort((a, b) => a.order - b.order);
  }
  const key = getTenantStorageKey("stages");
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(DEFAULT_PIPELINE_STAGES));
      return [...DEFAULT_PIPELINE_STAGES];
    }
    const parsed: PipelineStage[] = JSON.parse(raw);
    return parsed.sort((a, b) => a.order - b.order);
  } catch (e) {
    console.error("Failed to read stages from storage:", e);
    return [...DEFAULT_PIPELINE_STAGES];
  }
}

export function savePipelineStages(stages: PipelineStage[]): void {
  if (typeof window === "undefined") {
    memoryStages = [...stages];
    return;
  }
  const key = getTenantStorageKey("stages");
  try {
    localStorage.setItem(key, JSON.stringify(stages));
  } catch (e) {
    console.error("Failed to save stages to storage:", e);
  }
}

export function getPipelineStagesWithCounts(): PipelineStageWithCount[] {
  const stages = getPipelineStages();
  const contacts = getStoredContacts();

  return stages.map((st) => {
    const count = contacts.filter(
      (c) => c.status.toLowerCase() === st.name.toLowerCase()
    ).length;
    return {
      ...st,
      contactCount: count,
    };
  });
}

export function createPipelineStage(
  name: string,
  color: StageColor = "blue"
): PipelineStage {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error("Stage name cannot be empty.");
  }
  if (trimmed.length > 40) {
    throw new Error("Stage name must be 40 characters or fewer.");
  }

  const current = getPipelineStages();
  const duplicate = current.find(
    (s) => s.name.toLowerCase() === trimmed.toLowerCase()
  );
  if (duplicate) {
    throw new Error(`A stage named "${trimmed}" already exists.`);
  }

  const newStage: PipelineStage = {
    id: `stage_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: trimmed,
    order: current.length,
    color,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updated = [...current, newStage];
  savePipelineStages(updated);

  // Sync to Cloud Firestore
  syncStages(getActiveBusinessId(), updated);

  return newStage;
}

export function updatePipelineStage(
  stageId: string,
  updates: { name?: string; color?: StageColor; order?: number }
): PipelineStage | null {
  const current = getPipelineStages();
  const index = current.findIndex((s) => s.id === stageId);
  if (index === -1) return null;

  const existing = current[index];
  let newName = existing.name;

  if (updates.name !== undefined) {
    const trimmed = updates.name.trim();
    if (!trimmed) {
      throw new Error("Stage name cannot be empty.");
    }
    if (trimmed.length > 40) {
      throw new Error("Stage name must be 40 characters or fewer.");
    }
    const duplicate = current.find(
      (s) => s.name.toLowerCase() === trimmed.toLowerCase() && s.id !== stageId
    );
    if (duplicate) {
      throw new Error(`A stage named "${trimmed}" already exists.`);
    }
    newName = trimmed;
  }

  const updatedStage: PipelineStage = {
    ...existing,
    name: newName,
    color: updates.color || existing.color,
    order: updates.order !== undefined ? updates.order : existing.order,
    updatedAt: new Date().toISOString(),
  };

  // Cascade name changes to contacts if renamed
  if (newName !== existing.name) {
    const contacts = getStoredContacts();
    const updatedContacts = contacts.map((c) => {
      if (c.status.toLowerCase() === existing.name.toLowerCase()) {
        return {
          ...c,
          status: newName,
          updatedAt: new Date().toISOString(),
        };
      }
      return c;
    });
    saveContacts(updatedContacts);
  }

  current[index] = updatedStage;
  savePipelineStages(current);

  // Sync to Cloud Firestore
  syncStages(getActiveBusinessId(), current);

  return updatedStage;
}

export function deletePipelineStage(
  stageId: string, 
  reassignToStageName?: string
): { success: boolean; reassignedCount: number } {
  const current = getPipelineStages();
  if (current.length <= 1) {
    throw new Error("You must have at least one pipeline stage.");
  }

  const target = current.find((s) => s.id === stageId);
  if (!target) return { success: false, reassignedCount: 0 };

  const contacts = getStoredContacts();
  const affectedContacts = contacts.filter(
    (c) => c.status.toLowerCase() === target.name.toLowerCase()
  );

  if (affectedContacts.length > 0 && !reassignToStageName) {
    throw new Error(
      `Please select another stage to move ${affectedContacts.length} contact(s) to.`
    );
  }

  let reassignedCount = 0;
  const reassignedList: Contact[] = [];

  if (reassignToStageName) {
    const targetReassignStage = current.find(
      (s) => s.name.toLowerCase() === reassignToStageName.toLowerCase() && s.id !== stageId
    );
    if (!targetReassignStage) {
      throw new Error("Target reassignment stage does not exist.");
    }

    const updatedContacts = contacts.map((c) => {
      if (c.status.toLowerCase() === target.name.toLowerCase()) {
        reassignedCount++;
        const updated = {
          ...c,
          status: targetReassignStage.name,
          stageChangedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        reassignedList.push(updated);
        return updated;
      }
      return c;
    });

    if (reassignedCount > 0) {
      saveContacts(updatedContacts);
    }
  }

  const remaining = current.filter((s) => s.id !== stageId);
  savePipelineStages(remaining);

  // Sync to Cloud Firestore
  syncDeleteStage(getActiveBusinessId(), stageId, reassignedList);

  return { success: true, reassignedCount };
}

/* -------------------------------------------------------------
 * Contacts Store
 * ------------------------------------------------------------- */

export function getStoredContacts(): Contact[] {
  if (typeof window === "undefined") {
    return memoryContacts;
  }
  const key = getTenantStorageKey("contacts");
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      const initial = getActiveBusinessId() === "biz_demo_1" ? DEFAULT_INITIAL_CONTACTS : [];
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to read contacts from storage:", e);
    return [];
  }
}

export function getContactById(contactId: string): Contact | null {
  const contacts = getStoredContacts();
  return contacts.find((c) => c.id === contactId) || null;
}

export function saveContacts(contacts: Contact[]): void {
  if (typeof window === "undefined") {
    memoryContacts = [...contacts];
    return;
  }
  const key = getTenantStorageKey("contacts");
  try {
    localStorage.setItem(key, JSON.stringify(contacts));
  } catch (e) {
    console.error("Failed to save contacts to storage:", e);
  }
}

export function updateContactStage(contactId: string, newStageName: string): Contact | null {
  const contacts = getStoredContacts();
  const index = contacts.findIndex((c) => c.id === contactId);
  if (index === -1) return null;

  const now = new Date().toISOString();
  const updatedContact: Contact = {
    ...contacts[index],
    status: newStageName,
    stageChangedAt: now,
    updatedAt: now
  };

  contacts[index] = updatedContact;
  saveContacts(contacts);

  // Sync to Cloud Firestore
  syncContact(getActiveBusinessId(), updatedContact);

  return updatedContact;
}

export function importBatchContacts(
  newInputs: ValidContactInput[], 
  targetGroupId?: string | null
): Contact[] {
  const current = getStoredContacts();
  const stages = getPipelineStages();
  const defaultStage = stages.find((s) => s.isDefault)?.name || stages[0]?.name || "New Lead";
  const now = new Date().toISOString();

  const importedList: Contact[] = newInputs.map((item, idx) => ({
    id: `cnt_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 6)}`,
    name: item.name,
    phone: item.phone || null,
    email: item.email || null,
    source: item.source || "CSV Import",
    notes: item.notes || null,
    status: item.status || defaultStage,
    groupId: targetGroupId || item.groupId || null,
    importedAt: now,
    createdAt: now,
    updatedAt: now
  }));

  const updated = [...importedList, ...current];
  saveContacts(updated);

  // Sync batch to Cloud Firestore
  syncBatchContacts(getActiveBusinessId(), importedList);

  return updated;
}

/* -------------------------------------------------------------
 * Dashboard Filtering Query
 * ------------------------------------------------------------- */

export function getDashboardContacts(
  params: DashboardFilterParams = {}
): DashboardContactsResponse {
  const allContacts = getStoredContacts();
  const stageSummaries = getPipelineStagesWithCounts();
  const groupSummaries = getContactGroupsWithCounts();

  let filtered = [...allContacts];

  // 1. Filter by Pipeline Stage Status
  if (params.status && params.status !== "All") {
    filtered = filtered.filter(
      (c) => c.status.toLowerCase() === params.status!.toLowerCase()
    );
  }

  // 2. Filter by Contact Group
  if (params.groupId && params.groupId !== "All") {
    if (params.groupId === "unassigned") {
      filtered = filtered.filter((c) => !c.groupId);
    } else {
      filtered = filtered.filter((c) => c.groupId === params.groupId);
    }
  }

  // 3. Filter by Search Query
  if (params.q && params.q.trim()) {
    const q = params.q.toLowerCase().trim();
    filtered = filtered.filter((c) => {
      const matchName = c.name.toLowerCase().includes(q);
      const matchPhone = c.phone ? c.phone.toLowerCase().includes(q) : false;
      const matchEmail = c.email ? c.email.toLowerCase().includes(q) : false;
      const matchSource = c.source ? c.source.toLowerCase().includes(q) : false;
      return matchName || matchPhone || matchEmail || matchSource;
    });
  }

  const unassignedGroupCount = allContacts.filter((c) => !c.groupId).length;

  return {
    contacts: filtered,
    totalCount: allContacts.length,
    filteredCount: filtered.length,
    stageSummaries,
    groupSummaries,
    unassignedGroupCount
  };
}

/* -------------------------------------------------------------
 * Speed-Dialer & Queue Functions
 * ------------------------------------------------------------- */

export function getDialerQueue(
  queueId: string,
  options: DialerQueueOptions = {}
): DialerQueueResponse {
  const allContacts = getStoredContacts();
  const allGroups = getContactGroups();
  const stages = getPipelineStages();

  let queueTitle = "All Contacts Follow-Up Queue";
  let targetGroup: ContactGroup | null = null;
  let matchingContacts: Contact[] = [];

  if (queueId === "all") {
    queueTitle = "All Contacts Follow-Up Queue";
    matchingContacts = [...allContacts];
  } else if (queueId === "unassigned") {
    queueTitle = "Unassigned Leads Follow-Up Queue";
    matchingContacts = allContacts.filter((c) => !c.groupId);
  } else {
    targetGroup = allGroups.find((g) => g.id === queueId) || null;
    if (targetGroup) {
      queueTitle = `${targetGroup.name} Follow-Up Queue`;
      matchingContacts = allContacts.filter((c) => c.groupId === queueId);
    } else {
      // Group not found
      return {
        queueId,
        queueTitle: "Queue Not Found",
        group: null,
        contacts: [],
        totalLeads: 0,
        neverContactedCount: 0,
        stages
      };
    }
  }

  // Filter by status if specified
  if (options.statusFilter && options.statusFilter !== "All") {
    matchingContacts = matchingContacts.filter(
      (c) => c.status.toLowerCase() === options.statusFilter!.toLowerCase()
    );
  }

  // Priority sorting:
  // 1. Never contacted (lastContactedAt is falsy)
  // 2. Contacted before today (sorted by oldest lastContactedAt first)
  // 3. Contacted today (sorted by latest lastContactedAt at the end)
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  const sorted = [...matchingContacts].sort((a, b) => {
    const aContacted = a.lastContactedAt ? new Date(a.lastContactedAt).getTime() : 0;
    const bContacted = b.lastContactedAt ? new Date(b.lastContactedAt).getTime() : 0;

    // Both never contacted: preserve insertion order / createdAt
    if (!aContacted && !bContacted) {
      const aCreated = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bCreated = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return aCreated - bCreated;
    }

    // A never contacted: A goes first
    if (!aContacted) return -1;
    // B never contacted: B goes first
    if (!bContacted) return 1;

    const aToday = aContacted >= todayStart;
    const bToday = bContacted >= todayStart;

    // A not today, B contacted today: A goes first
    if (!aToday && bToday) return -1;
    // B not today, A contacted today: B goes first
    if (aToday && !bToday) return 1;

    // Both not today: oldest lastContactedAt first
    // Both today: oldest lastContactedAt first
    return aContacted - bContacted;
  });

  const neverContactedCount = sorted.filter((c) => !c.lastContactedAt).length;

  return {
    queueId,
    queueTitle,
    group: targetGroup,
    contacts: sorted,
    totalLeads: sorted.length,
    neverContactedCount,
    stages
  };
}

export function logDialerInteraction(
  payload: LogDialerInteractionInput
): { interaction: Interaction; updatedContact: Contact } {
  const result = logContactInteraction(payload.contactId, {
    outcome: payload.outcome,
    date: payload.date || new Date().toISOString(),
    notes: payload.notes || null
  });

  let currentContact = result.contact;

  if (payload.newStatus && payload.newStatus !== currentContact.status) {
    const updatedWithStage = updateContactStage(payload.contactId, payload.newStatus);
    if (updatedWithStage) {
      currentContact = updatedWithStage;
    }
  }

  return {
    interaction: result.interaction,
    updatedContact: currentContact
  };
}

