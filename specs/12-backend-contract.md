# Feature: Shareable Agent Speed-Dialer & Lead Follow-Up Queue (`/dial/[id]`)

## Overview & Purpose
Feature 12 introduces a focused, mobile-first Speed-Dialer and Lead Follow-Up Queue interface accessible at `/dial/[id]`. It enables business owners and sales reps to power through call lists, quickly trigger phone/WhatsApp actions, log interaction outcomes with one tap, update pipeline stages, and automatically advance to the next lead in the queue.

---

### Data model & Store Contracts

#### 1. Entity Types & Interfaces (`src/types/crm.ts`)

```typescript
// Dialer Queue Filter Options
export interface DialerQueueOptions {
  status?: string | null;           // Optional stage/status filter
  sort?: "priority" | "recent" | "alphabetical" | "oldest"; // Default: 'priority'
}

// Dialer Queue Snapshot Response
export interface DialerQueueResponse {
  queueId: string;                  // e.g. "grp_123" | "all" | "unassigned"
  title: string;                    // e.g. "Wholesale Buyers" | "All Contacts"
  contacts: Contact[];              // Ordered list of contacts in the queue
  totalCount: number;               // Total contacts matching criteria
  contactedCount: number;           // Contacts with interactions logged
  pendingCount: number;             // Contacts pending follow-up
  group: ContactGroup | null;       // Null if "all" or "unassigned"
  stages: PipelineStage[];          // Available pipeline stages for quick status picker
}

// Dialing / Fast Interaction Logging Payload
export interface LogDialerInteractionInput {
  contactId: string;
  outcome: InteractionOutcome;
  notes?: string | null;
  newStatus?: string;               // Optional immediate pipeline stage transition
  date?: string;                    // ISO 8601 string (defaults to new Date().toISOString())
}

// Dialer Progress Summary
export interface DialerSessionProgress {
  totalInQueue: number;
  currentIndex: number;
  completedIds: string[];
  skippedIds: string[];
}
```

#### 2. Firestore Document Paths & Hierarchy
All dialer data leverages existing tenant subcollections under `businesses/{businessId}` without requiring schema alterations:
- **Contacts:** `businesses/{businessId}/contacts/{contactId}`
  - Updated fields on call log: `lastContactedAt`, `status`, `stageChangedAt` (if stage changed), `notes`, `updatedAt`
- **Interactions:** `businesses/{businessId}/interactions/{interactionId}`
  - Logged entry: `id`, `contactId`, `outcome`, `date`, `notes`, `createdAt`, `updatedAt`
- **Groups & Stages:** Read from `businesses/{businessId}/groups` and `businesses/{businessId}/stages`

#### 3. Store Methods & Query Contracts (`src/lib/contacts-store.ts` & `src/lib/firestore-sync.ts`)

1. **`getDialerQueue(queueId: string, options?: DialerQueueOptions): DialerQueueResponse`**
   - **Resolution logic:**
     - `queueId === "all"`: Fetches all contacts in the business account.
     - `queueId === "unassigned"`: Fetches contacts where `groupId == null`.
     - `queueId === "grp_..."`: Fetches contacts where `groupId === queueId`.
   - **Queue Sorting Algorithm ("Priority"):**
     1. Uncontacted leads first (`lastContactedAt == null`), ordered by creation date ascending.
     2. Leads with oldest `lastContactedAt` ascending (longest time since last touchpoint).
     3. Already contacted today pushed to end of queue.
   - **Filter logic:** If `options.status` is provided, filters to only contacts matching that status.

2. **`logDialerInteraction(businessId: string, payload: LogDialerInteractionInput): { interaction: Interaction; updatedContact: Contact }`**
   - Creates new `Interaction` with generated ID `int_${Date.now()}_${rand}`.
   - Atomically updates the contact record:
     - Sets `lastContactedAt = payload.date || new Date().toISOString()`.
     - If `payload.newStatus` is provided and differs from current status:
       - Sets `status = payload.newStatus`.
       - Sets `stageChangedAt = payload.date || new Date().toISOString()`.
     - If `payload.notes` is provided, updates/appends contact `notes`.
     - Sets `updatedAt = new Date().toISOString()`.
   - Synchronizes changes to Cloud Firestore via `syncInteraction()` and `syncContact()`.
   - Returns the created interaction and updated contact.

3. **`getContactInteractionHistory(contactId: string): Interaction[]`**
   - Retrieves all historical interaction logs for the active lead, sorted newest to oldest (`date` descending).

---

### Layout & Mobile Interface Architecture

#### 1. URL Structure & Route Organization
- Route: `/dial/[id]` where `[id]` is dynamic (`[id].tsx` or `page.tsx` within `src/app/dial/[id]/`).
- Supports query params:
  - `/dial/grp_12345` -> Dials group with ID `grp_12345`.
  - `/dial/all?status=New%20Lead` -> Dials all "New Lead" contacts.
  - `/dial/unassigned` -> Dials unassigned leads.

#### 2. Standalone / Distraction-Free Layout
- **Bypass Desktop AppShell:**
  - `src/components/NavigationShell.tsx` detects `pathname.startsWith("/dial")` and renders a standalone, full-viewport mobile container without desktop sidebar nav or marketing header.
- **Header:**
  - Minimal top utility bar: Queue title, Progress counter (e.g. "Lead 3 of 18" + mini progress bar), and "Exit / Close" icon button routing back to `/groups` or `/dashboard`.
- **Active Contact Card:**
  - Clean, high-contrast focal card displaying Contact Name, Phone Number, Email, Source badge, Current Pipeline Stage badge, and Lead Notes.
- **One-Tap Action Bar:**
  - Primary **"Call (tel:)"** button (launches native mobile phone dialer).
  - Quick **"WhatsApp (wa.me)"** launcher (cleans phone number and opens direct WhatsApp chat).
- **Rapid Outcome Logger (1-Tap Buttons):**
  - Grid of instant outcome buttons:
    - 📞 Connected
    - 🗣️ Left Voicemail
    - 🚫 No Answer
    - ✉️ Email Sent
    - 🤝 Meeting Booked
    - 📝 Note
- **Stage Picker & Note Drawer:**
  - Quick stage pills or dropdown to advance lead stage (e.g. from "New Lead" &rarr; "Contacted" or "Won").
  - Quick note field for shorthand call notes.
- **Queue Controls:**
  - "Next Lead" / "Skip" & "Previous" buttons for rapid manual navigation.
  - Optional auto-advance toggle: Automatically transitions to the next contact upon outcome submission.

#### 3. Real-Time & Offline Sync
- Leverages `onSnapshot` subscriptions and Firestore local persistence.
- Fast local state updates ensure zero lag on mobile 3G/4G connections.
- Offline writes queue in IndexedDB/Firestore cache and sync to cloud immediately when online.

---

### Validation rules

1. **Queue Identification:**
   - If `id` does not match `"all"`, `"unassigned"`, or a valid `groupId` belonging to the tenant, display a friendly "Queue not found" screen with a return link to `/dashboard`.
   - If a valid queue contains 0 contacts, display an "All caught up! No leads in this queue" empty state.

2. **Phone Number Sanitization for Dialing / WhatsApp:**
   - Phone string must strip non-digit characters (spaces, dashes, parentheses) before generating `tel:${cleanPhone}` and `https://wa.me/${cleanPhone}`.
   - If a contact record has no phone number, the "Call" and "WhatsApp" buttons render in a disabled state with a tooltip "No phone provided".

3. **Interaction Submission:**
   - `contactId` is mandatory and must match an existing contact.
   - `outcome` must match one of the allowed `InteractionOutcome` enum values.
   - `notes` is optional; trimmed if provided. Max length 1,000 characters.
   - `newStatus` must correspond to a valid stage name configured in the business pipeline.

---

### Firestore security rules

No modifications to the security rules schema structure are needed. Multi-tenant isolation is strictly enforced via authenticated user matching on the root business document:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Business Account Document & Subcollections
    match /businesses/{businessId} {
      allow read, write: if request.auth != null && request.auth.uid == businessId;
      
      match /contacts/{contactId} {
        allow read, write: if request.auth != null && request.auth.uid == businessId;
      }
      
      match /groups/{groupId} {
        allow read, write: if request.auth != null && request.auth.uid == businessId;
      }
      
      match /stages/{stageId} {
        allow read, write: if request.auth != null && request.auth.uid == businessId;
      }
      
      match /interactions/{interactionId} {
        allow read, write: if request.auth != null && request.auth.uid == businessId;
      }
    }
  }
}
```

---

### Conflicts / dependencies with prior features

1. **Dependency on Feature 04 (Call Logging) & Feature 08 (Contact Groups):**
   - Reuses `InteractionOutcome` and `ContactGroup` types without breaking changes.
2. **Dependency on Feature 11 (Firestore Sync):**
   - Uses `syncInteraction()` and `syncContact()` to maintain real-time cloud synchronization.
3. **`NavigationShell` Layout Routing:**
   - `NavigationShell` must be updated to exempt `/dial` paths from wrapping within the standard desktop `AppShell`.
4. **No Schema Conflicts:**
   - Existing contact documents and interaction documents already contain `groupId`, `lastContactedAt`, `status`, and `notes`.

---

### Open questions for Product Owner

1. **Public / Unauthenticated Shareable Link vs. Authenticated Agent Access:**
   - *Current MVP Specification:* The speed-dialer `/dial/[id]` is accessed by the authenticated business account owner/agent on their mobile device.
   - *Question for PO:* Should a future iteration support an unauthenticated, token-scoped share link (e.g. `/dial/share?token=xyz123`) to allow external cold-callers or freelancers to dial without logging into the main CRM account? (Recommended: defer tokenized public access to post-MVP backlog).
2. **Auto-Advance Default Behavior:**
   - When an outcome is tapped (e.g. "Left Voicemail"), should the UI immediately transition to the next lead card after a brief 500ms confirmation toast, or wait for the user to press "Next Lead"?
3. **Queue Sorting Preferences:**
   - Is the default "Never contacted first &rarr; Oldest contacted &rarr; Already contacted today at end" priority order the preferred default across all contact groups?
