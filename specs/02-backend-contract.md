# Backend Architecture & Contract: Contact record view

## Firestore Data Model
Collection: `businesses/{businessId}/contacts/{contactId}`
- `id`: `string`
- `name`: `string`
- `phone`: `string | null`
- `email`: `string | null`
- `source`: `string | null`
- `notes`: `string | null`
- `status`: `string`
- `importedAt`: `string | null`
- `createdAt`: `string`
- `updatedAt`: `string`

## Routing & Retrieval
- **URL Pattern:** `/contacts/[id]`
- **Data Accessor:** `getStoredContactById(contactId: string): Contact | null`
- **Fallback Display:**
  - Name fallback: `"No Name"`
  - Missing email/source/phone: `"—"`
  - Missing notes: `"No notes added yet."`
  - Action buttons: Quick-dial `tel:` link, quick-email `mailto:` link.

## Security Rules
Multi-tenant security rule allowing read (`get`) on contact subcollection by authenticated business owner.
