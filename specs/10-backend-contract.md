# Backend Architecture & Contract: Sidebar Navigation & Groups Route (`/groups`)

## Layout & AppShell Architecture
- `AppShell` component wrapping authenticated pages (`/dashboard`, `/groups`, `/settings`, `/contacts/[id]`)
- Fixed desktop sidebar (`w-64`) with active route styling:
  - `/dashboard`: Contacts & Lead Pipeline
  - `/groups`: Contact Groups Management
  - `/settings`: Business Settings & Profile
- Mobile slide-over drawer with hamburger button & overlay
- Profile footer with business avatar, name, and Sign Out action

## Groups Store Query Methods (`src/lib/contacts-store.ts`)
- `getGroupMembers(groupId: string): Contact[]`
- `getUnassignedContacts(): Contact[]`
- `removeContactFromGroup(contactId: string): Contact | null`
- `deleteContactGroup(groupId: string): { success: boolean; unassignedCount: number }`

## Security Rules
```firestore
match /businesses/{businessId}/groups/{groupId} {
  allow read, write: if request.auth != null && request.auth.uid == businessId;
}
```
