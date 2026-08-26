import { db } from "./firebase";
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  onSnapshot, 
  writeBatch, 
  query, 
  orderBy,
  Unsubscribe,
  DocumentData
} from "firebase/firestore";
import { 
  Contact, 
  ContactGroup, 
  PipelineStage, 
  Interaction 
} from "@/types/crm";
import { BusinessAccount } from "@/types/auth";

/* -------------------------------------------------------------
 * Firestore Collection Helpers
 * ------------------------------------------------------------- */

function getBusinessDocRef(businessId: string) {
  if (!db) return null;
  return doc(db, "businesses", businessId);
}

function getContactsColRef(businessId: string) {
  if (!db) return null;
  return collection(db, "businesses", businessId, "contacts");
}

function getGroupsColRef(businessId: string) {
  if (!db) return null;
  return collection(db, "businesses", businessId, "groups");
}

function getStagesColRef(businessId: string) {
  if (!db) return null;
  return collection(db, "businesses", businessId, "stages");
}

function getInteractionsColRef(businessId: string) {
  if (!db) return null;
  return collection(db, "businesses", businessId, "interactions");
}

/* -------------------------------------------------------------
 * Business Profile Sync
 * ------------------------------------------------------------- */

export async function syncBusinessProfile(business: BusinessAccount): Promise<void> {
  const docRef = getBusinessDocRef(business.id);
  if (!docRef) return;
  try {
    await setDoc(docRef, business, { merge: true });
  } catch (e) {
    console.warn("Firestore syncBusinessProfile warning:", e);
  }
}

export function subscribeToBusinessProfile(
  businessId: string,
  onUpdate: (biz: BusinessAccount | null) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const docRef = getBusinessDocRef(businessId);
  if (!docRef) return () => {};

  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.data() as BusinessAccount);
      } else {
        onUpdate(null);
      }
    },
    (err) => {
      console.warn("Firestore business profile subscription error:", err);
      if (onError) onError(err);
    }
  );
}

/* -------------------------------------------------------------
 * Contacts Sync & Real-Time Listeners
 * ------------------------------------------------------------- */

export async function syncContact(businessId: string, contact: Contact): Promise<void> {
  if (!db) return;
  const docRef = doc(db, "businesses", businessId, "contacts", contact.id);
  try {
    await setDoc(docRef, contact, { merge: true });
  } catch (e) {
    console.warn("Firestore syncContact warning:", e);
  }
}

export async function syncDeleteContact(businessId: string, contactId: string): Promise<void> {
  if (!db) return;
  const docRef = doc(db, "businesses", businessId, "contacts", contactId);
  try {
    await deleteDoc(docRef);
  } catch (e) {
    console.warn("Firestore syncDeleteContact warning:", e);
  }
}

export async function syncBatchContacts(businessId: string, contacts: Contact[]): Promise<void> {
  if (!db || contacts.length === 0) return;

  // Chunk batch writes into max 400 operations
  const CHUNK_SIZE = 400;
  for (let i = 0; i < contacts.length; i += CHUNK_SIZE) {
    const chunk = contacts.slice(i, i + CHUNK_SIZE);
    const batch = writeBatch(db);

    for (const c of chunk) {
      const docRef = doc(db, "businesses", businessId, "contacts", c.id);
      batch.set(docRef, c, { merge: true });
    }

    try {
      await batch.commit();
    } catch (e) {
      console.warn("Firestore syncBatchContacts batch commit warning:", e);
    }
  }
}

export function subscribeToContacts(
  businessId: string,
  onUpdate: (contacts: Contact[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const colRef = getContactsColRef(businessId);
  if (!colRef) return () => {};

  return onSnapshot(
    colRef,
    (snapshot) => {
      const contacts: Contact[] = snapshot.docs.map((d) => d.data() as Contact);
      onUpdate(contacts);
    },
    (err) => {
      console.warn("Firestore contacts subscription error:", err);
      if (onError) onError(err);
    }
  );
}

/* -------------------------------------------------------------
 * Groups Sync & Real-Time Listeners
 * ------------------------------------------------------------- */

export async function syncGroup(businessId: string, group: ContactGroup): Promise<void> {
  if (!db) return;
  const docRef = doc(db, "businesses", businessId, "groups", group.id);
  try {
    await setDoc(docRef, group, { merge: true });
  } catch (e) {
    console.warn("Firestore syncGroup warning:", e);
  }
}

export async function syncDeleteGroup(
  businessId: string, 
  groupId: string, 
  affectedContacts: Contact[] = []
): Promise<void> {
  if (!db) return;
  const batch = writeBatch(db);
  const groupDocRef = doc(db, "businesses", businessId, "groups", groupId);
  batch.delete(groupDocRef);

  // Safely unassign contacts in the same batch
  for (const c of affectedContacts) {
    const contactDocRef = doc(db, "businesses", businessId, "contacts", c.id);
    batch.set(contactDocRef, { groupId: null, updatedAt: new Date().toISOString() }, { merge: true });
  }

  try {
    await batch.commit();
  } catch (e) {
    console.warn("Firestore syncDeleteGroup warning:", e);
  }
}

export function subscribeToGroups(
  businessId: string,
  onUpdate: (groups: ContactGroup[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const colRef = getGroupsColRef(businessId);
  if (!colRef) return () => {};

  return onSnapshot(
    colRef,
    (snapshot) => {
      const groups: ContactGroup[] = snapshot.docs.map((d) => d.data() as ContactGroup);
      onUpdate(groups);
    },
    (err) => {
      console.warn("Firestore groups subscription error:", err);
      if (onError) onError(err);
    }
  );
}

/* -------------------------------------------------------------
 * Pipeline Stages Sync & Real-Time Listeners
 * ------------------------------------------------------------- */

export async function syncStages(businessId: string, stages: PipelineStage[]): Promise<void> {
  if (!db || stages.length === 0) return;
  const batch = writeBatch(db);

  for (const s of stages) {
    const stageDocRef = doc(db, "businesses", businessId, "stages", s.id);
    batch.set(stageDocRef, s, { merge: true });
  }

  try {
    await batch.commit();
  } catch (e) {
    console.warn("Firestore syncStages warning:", e);
  }
}

export async function syncDeleteStage(
  businessId: string,
  stageId: string,
  reassignedContacts: Contact[] = []
): Promise<void> {
  if (!db) return;
  const batch = writeBatch(db);
  const stageDocRef = doc(db, "businesses", businessId, "stages", stageId);
  batch.delete(stageDocRef);

  for (const c of reassignedContacts) {
    const contactDocRef = doc(db, "businesses", businessId, "contacts", c.id);
    batch.set(contactDocRef, { status: c.status, stageChangedAt: c.stageChangedAt, updatedAt: c.updatedAt }, { merge: true });
  }

  try {
    await batch.commit();
  } catch (e) {
    console.warn("Firestore syncDeleteStage warning:", e);
  }
}

export function subscribeToStages(
  businessId: string,
  onUpdate: (stages: PipelineStage[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const colRef = getStagesColRef(businessId);
  if (!colRef) return () => {};

  return onSnapshot(
    colRef,
    (snapshot) => {
      const stages: PipelineStage[] = snapshot.docs.map((d) => d.data() as PipelineStage);
      onUpdate(stages);
    },
    (err) => {
      console.warn("Firestore stages subscription error:", err);
      if (onError) onError(err);
    }
  );
}

/* -------------------------------------------------------------
 * Interactions Sync & Real-Time Listeners
 * ------------------------------------------------------------- */

export async function syncInteraction(
  businessId: string, 
  interaction: Interaction, 
  contactUpdate?: Contact | null
): Promise<void> {
  if (!db) return;
  const batch = writeBatch(db);
  const interactionDocRef = doc(db, "businesses", businessId, "interactions", interaction.id);
  batch.set(interactionDocRef, interaction, { merge: true });

  if (contactUpdate) {
    const contactDocRef = doc(db, "businesses", businessId, "contacts", contactUpdate.id);
    batch.set(contactDocRef, { lastContactedAt: contactUpdate.lastContactedAt, updatedAt: contactUpdate.updatedAt }, { merge: true });
  }

  try {
    await batch.commit();
  } catch (e) {
    console.warn("Firestore syncInteraction warning:", e);
  }
}

export async function syncDeleteInteraction(
  businessId: string, 
  interactionId: string, 
  contactUpdate?: Contact | null
): Promise<void> {
  if (!db) return;
  const batch = writeBatch(db);
  const interactionDocRef = doc(db, "businesses", businessId, "interactions", interactionId);
  batch.delete(interactionDocRef);

  if (contactUpdate) {
    const contactDocRef = doc(db, "businesses", businessId, "contacts", contactUpdate.id);
    batch.set(contactDocRef, { lastContactedAt: contactUpdate.lastContactedAt, updatedAt: contactUpdate.updatedAt }, { merge: true });
  }

  try {
    await batch.commit();
  } catch (e) {
    console.warn("Firestore syncDeleteInteraction warning:", e);
  }
}

export function subscribeToInteractions(
  businessId: string,
  onUpdate: (interactions: Interaction[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const colRef = getInteractionsColRef(businessId);
  if (!colRef) return () => {};

  return onSnapshot(
    colRef,
    (snapshot) => {
      const interactions: Interaction[] = snapshot.docs.map((d) => d.data() as Interaction);
      onUpdate(interactions);
    },
    (err) => {
      console.warn("Firestore interactions subscription error:", err);
      if (onError) onError(err);
    }
  );
}

/* -------------------------------------------------------------
 * Initial Business Seed in Firestore
 * ------------------------------------------------------------- */

export async function initializeBusinessInFirestore(
  businessId: string,
  business: BusinessAccount,
  defaultStages: PipelineStage[]
): Promise<void> {
  if (!db) return;
  try {
    const bizRef = doc(db, "businesses", businessId);
    const existing = await getDoc(bizRef);

    if (!existing.exists()) {
      await setDoc(bizRef, business);
      // Seed default pipeline stages
      await syncStages(businessId, defaultStages);
    }
  } catch (e) {
    console.warn("initializeBusinessInFirestore error:", e);
  }
}
