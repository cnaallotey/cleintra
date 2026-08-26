# Backend Architecture & Contract: Contact Groups & Group-based Import

## Data Model

### 1. New Subcollection: `businesses/{businessId}/groups/{groupId}`
- `id`: `string` (Unique group ID, e.g. `"grp_1718000000000_abc"`)
- `name`: `string` (Group label, e.g. `"Wholesale Customers"`)
- `createdAt`: `string` (ISO 8601 timestamp)
- `updatedAt`: `string` (ISO 8601 timestamp)

### 2. Contact Entity Additions
- `groupId`: `string | null` (Reference to `groups/{groupId}`, `null` if unassigned / "None")
- `updatedAt`: `string`

### 3. TypeScript Interfaces (`src/types/crm.ts`)
```typescript
export interface ContactGroup {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactGroupWithCount extends ContactGroup {
  contactCount: number;
}

export interface CreateContactGroupInput {
  name: string;
}

export interface UpdateContactGroupInput {
  name: string;
}
```

## API / Store Functions (`src/lib/contacts-store.ts`)
1. `getContactGroups(): ContactGroup[]`
2. `getContactGroupsWithCounts(): ContactGroupWithCount[]`
3. `createContactGroup(name: string): ContactGroup`
4. `updateContactGroup(groupId: string, updates: UpdateContactGroupInput): ContactGroup | null`
5. `deleteContactGroup(groupId: string): { success: boolean; unassignedCount: number }`
6. `updateContactGroupAssignment(contactId: string, groupId: string | null): Contact | null`
7. `importBatchContacts(newInputs: ValidContactInput[], targetGroupId?: string | null): Contact[]`
8. `getDashboardContacts(filters: DashboardFilterParams): DashboardContactsResponse`

## Validation Rules
- Group names must be non-empty after trimming, unique (case-insensitive per business tenant), and max 50 characters.
- Deleting a group sets `groupId: null` on all associated contacts; contact entities are preserved.
- Group-based CSV import tags all valid rows in the batch with the specified `targetGroupId`.

## Firestore Security Rules
- All `businesses/{businessId}/groups/{groupId}` read and write operations require `request.auth != null && request.auth.uid == businessId`.
